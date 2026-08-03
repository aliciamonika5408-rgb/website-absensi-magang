import initialData from "../data/database.json";

// Initial Database Records from src/data/database.json
const INITIAL_STUDENTS = initialData.students;
const INITIAL_ADMIN = initialData.admin;
export const COMPANY_INFO = initialData.company;

// Seed Attendance Records - reset to empty
const generateInitialAttendance = () => {
  return initialData.attendanceRecords || [];
};

const DB_KEYS = {
  USERS: "absensi_magang_users_v1",
  ATTENDANCE: "absensi_magang_attendance_v1",
  CURRENT_USER: "absensi_magang_current_user_v1"
};

// Simple pseudo-hashing for admin view demonstration
export const hashPassword = (plainPassword) => {
  if (!plainPassword) return "$2b$10$e8F...";
  let hash = 0;
  for (let i = 0; i < plainPassword.length; i++) {
    hash = (hash << 5) - hash + plainPassword.charCodeAt(i);
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).padStart(8, '0');
  return `$2b$10$${hex}x9K2mL8q1vP3wZ${hex.slice(0, 4)}`;
};

// Database Initialization
export const initDB = () => {
  // Always ensure default users exist in DB on first run
  const defaultUsers = [INITIAL_ADMIN, ...INITIAL_STUDENTS];
  if (!localStorage.getItem(DB_KEYS.USERS)) {
    localStorage.setItem(DB_KEYS.USERS, JSON.stringify(defaultUsers));
  } else {
    // Only update admin credentials & existing profile photos, DO NOT re-add deleted users
    const existingUsers = JSON.parse(localStorage.getItem(DB_KEYS.USERS) || "[]");
    let hasChanges = false;

    // Ensure Admin always exists
    const adminIdx = existingUsers.findIndex(u => u.id === "admin-1" || u.role === "admin");
    if (adminIdx === -1) {
      existingUsers.unshift(INITIAL_ADMIN);
      hasChanges = true;
    } else {
      if (existingUsers[adminIdx].nama !== INITIAL_ADMIN.nama || existingUsers[adminIdx].password !== INITIAL_ADMIN.password || existingUsers[adminIdx].username !== INITIAL_ADMIN.username) {
        existingUsers[adminIdx].nama = INITIAL_ADMIN.nama;
        existingUsers[adminIdx].password = INITIAL_ADMIN.password;
        existingUsers[adminIdx].username = INITIAL_ADMIN.username;
        hasChanges = true;
      }
    }

    // Update avatar paths for existing students
    existingUsers.forEach(u => {
      if (u.id === "std-1" && u.fotoProfil !== "/alicia-profile.jpg") {
        u.fotoProfil = "/alicia-profile.jpg";
        hasChanges = true;
      } else if (u.id === "std-2" && u.fotoProfil !== "/aisyah-profile.png") {
        u.fotoProfil = "/aisyah-profile.png";
        hasChanges = true;
      } else if (["std-3", "std-4", "std-5", "std-6"].includes(u.id) && u.fotoProfil !== "/default-avatar.png") {
        u.fotoProfil = "/default-avatar.png";
        hasChanges = true;
      }
    });

    // Deduplicate existingUsers by ID (clean up any previous duplicates)
    const seenIds = new Set();
    const cleanUsers = [];
    existingUsers.forEach(u => {
      if (!seenIds.has(u.id)) {
        seenIds.add(u.id);
        cleanUsers.push(u);
      } else {
        hasChanges = true;
      }
    });

    if (hasChanges || cleanUsers.length !== existingUsers.length) {
      localStorage.setItem(DB_KEYS.USERS, JSON.stringify(cleanUsers));
    }

    const cur = getCurrentUser();
    if (cur && (cur.id === "admin-1" || cur.role === "admin")) {
      if (cur.nama !== INITIAL_ADMIN.nama || cur.username !== INITIAL_ADMIN.username) {
        cur.nama = INITIAL_ADMIN.nama;
        cur.username = INITIAL_ADMIN.username;
        setCurrentUser(cur);
      }
    } else if (cur && cur.id === "std-1" && cur.fotoProfil !== "/alicia-profile.jpg") {
      cur.fotoProfil = "/alicia-profile.jpg";
      setCurrentUser(cur);
    } else if (cur && cur.id === "std-2" && cur.fotoProfil !== "/aisyah-profile.png") {
      cur.fotoProfil = "/aisyah-profile.png";
      setCurrentUser(cur);
    } else if (cur && ["std-3", "std-4", "std-5", "std-6"].includes(cur.id) && cur.fotoProfil !== "/default-avatar.png") {
      cur.fotoProfil = "/default-avatar.png";
      setCurrentUser(cur);
    }
  }

  if (!localStorage.getItem(DB_KEYS.ATTENDANCE)) {
    localStorage.setItem(DB_KEYS.ATTENDANCE, JSON.stringify(initialData.attendanceRecords || []));
  }
};

// Users Store Methods
export const getUsers = () => {
  initDB();
  return JSON.parse(localStorage.getItem(DB_KEYS.USERS) || "[]");
};

const CLOUD_DB_URL = "https://jsonblob.com/api/jsonBlob/019fc670-75fd-740b-98ac-48d2fbb1f326";

// Track last push timestamp to prevent fetch overwriting a pending push
let _lastPushTime = 0;

// Sync Cloud Database to Local Storage
export const fetchCloudDB = async () => {
  // Skip fetch if a push just happened within the last 5 seconds
  if (Date.now() - _lastPushTime < 5000) return false;

  try {
    const res = await fetch(CLOUD_DB_URL, {
      headers: { "Accept": "application/json" }
    });
    if (res.ok) {
      const data = await res.json();
      let updated = false;

      if (data.users && Array.isArray(data.users) && data.users.length > 0) {
        localStorage.setItem(DB_KEYS.USERS, JSON.stringify(data.users));
        window.dispatchEvent(new CustomEvent("users_updated"));
        updated = true;
      }

      if (data.attendance && Array.isArray(data.attendance)) {
        localStorage.setItem(DB_KEYS.ATTENDANCE, JSON.stringify(data.attendance));
        window.dispatchEvent(new CustomEvent("attendance_updated"));
        updated = true;
      }

      return updated;
    }
  } catch (e) {
    console.warn("Cloud DB fetch notice:", e);
  }
  return false;
};

// Push Local Storage to Cloud Database
export const pushCloudDB = async (customUsers = null, customRecords = null) => {
  _lastPushTime = Date.now(); // mark push time to pause fetchCloudDB for 5s
  try {
    const allUsers = customUsers || JSON.parse(localStorage.getItem(DB_KEYS.USERS) || "[]");
    const attendanceRecords = customRecords || JSON.parse(localStorage.getItem(DB_KEYS.ATTENDANCE) || "[]");

    await fetch(CLOUD_DB_URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        users: allUsers,
        attendance: attendanceRecords
      })
    });
    console.log("Cloud DB push complete. Users:", allUsers.filter(u => u.role === "siswa").length, "students");
  } catch (e) {
    console.warn("Cloud DB push notice:", e);
  }
};

// Auto Sync to Disk Endpoint & Cloud DB
export const syncDatabaseDisk = (customUsers = null, customRecords = null) => {
  pushCloudDB(customUsers, customRecords);
  try {
    const allUsers = customUsers || JSON.parse(localStorage.getItem(DB_KEYS.USERS) || "[]");
    const students = allUsers.filter(u => u.role === "siswa");
    const admin = allUsers.find(u => u.role === "admin") || INITIAL_ADMIN;
    const attendanceRecords = customRecords || JSON.parse(localStorage.getItem(DB_KEYS.ATTENDANCE) || "[]");

    fetch("/api/save-database", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        company: COMPANY_INFO,
        admin: admin,
        students: students,
        attendanceRecords: attendanceRecords
      })
    }).catch(err => {
      console.warn("Disk database sync notice:", err);
    });
  } catch (e) {
    console.warn("Disk database sync error:", e);
  }
};

export const saveUsers = (users) => {
  localStorage.setItem(DB_KEYS.USERS, JSON.stringify(users));
  try {
    window.dispatchEvent(new CustomEvent("users_updated"));
  } catch (e) {
    // Ignore in non-browser env
  }
  syncDatabaseDisk(users, null);
};

export const getStudents = () => {
  return getUsers().filter(u => u.role === "siswa");
};

export const findUserByPin = (pin) => {
  const users = getUsers();
  const cleanPin = (pin || "").trim();
  return users.find(u => u.pin === cleanPin);
};

export const findUserByNameAndPassword = (nama, password) => {
  const inputNama = nama.trim().toLowerCase();
  const inputPass = password.trim();

  // Always check against INITIAL_ADMIN from database.json first (source of truth)
  const adminNama = (INITIAL_ADMIN.nama || "").trim().toLowerCase();
  const adminUsername = (INITIAL_ADMIN.username || "").trim().toLowerCase();
  const isAdminMatch = (inputNama === adminUsername || inputNama === adminNama || inputNama === "admin123" || inputNama === "admin");

  if (isAdminMatch && inputPass === INITIAL_ADMIN.password) {
    // Also force-update localStorage so it stays in sync
    const users = getUsers();
    const adminIdx = users.findIndex(u => u.id === "admin-1");
    if (adminIdx !== -1) {
      users[adminIdx].nama = INITIAL_ADMIN.nama;
      users[adminIdx].username = INITIAL_ADMIN.username;
      users[adminIdx].password = INITIAL_ADMIN.password;
      localStorage.setItem(DB_KEYS.USERS, JSON.stringify(users));
    }
    return { ...INITIAL_ADMIN };
  }

  const users = getUsers();
  return users.find(u => {
    const dbNama = (u.nama || "").trim().toLowerCase();
    const dbUsername = (u.username || "").trim().toLowerCase();
    const isNameMatch = dbNama === inputNama || dbUsername === inputNama;
    const isPassMatch = u.password === inputPass;
    return isNameMatch && isPassMatch;
  });
};

export const addStudent = (studentData) => {
  const users = getUsers();
  const newStudent = {
    id: `std-${Date.now()}`,
    role: "siswa",
    fotoProfil: "/default-avatar.svg",
    ...studentData
  };
  if (!newStudent.fotoProfil) {
    newStudent.fotoProfil = "/default-avatar.svg";
  }
  users.push(newStudent);
  // Save to localStorage immediately
  localStorage.setItem(DB_KEYS.USERS, JSON.stringify(users));
  window.dispatchEvent(new CustomEvent("users_updated"));
  // Push to Cloud DB immediately so all laptops see the new student
  pushCloudDB(users, null);
  return newStudent;
};

export const updateStudent = (studentData) => {
  const users = getUsers();
  const index = users.findIndex(u => u.id === studentData.id);
  if (index !== -1) {
    const updated = { ...users[index], ...studentData };
    users[index] = updated;
    saveUsers(users);

    // Update active user session if editing current student
    const currentUser = getCurrentUser();
    if (currentUser && currentUser.id === studentData.id) {
      setCurrentUser(updated);
    }

    // Sync student name in attendance records if changed
    if (studentData.nama) {
      const records = getAttendanceRecords();
      let hasUpdates = false;
      records.forEach(r => {
        if (r.studentId === studentData.id) {
          r.namaSiswa = studentData.nama;
          hasUpdates = true;
        }
      });
      if (hasUpdates) {
        saveAttendanceRecords(records);
      }
    }

    return updated;
  }
  return null;
};

export const deleteStudent = (studentId) => {
  const users = getUsers().filter(u => u.id !== studentId);
  // Save to localStorage immediately
  localStorage.setItem(DB_KEYS.USERS, JSON.stringify(users));
  window.dispatchEvent(new CustomEvent("users_updated"));
  // Push deletion to Cloud DB immediately so all laptops stay in sync
  pushCloudDB(users, null);
};

export const resetPassword = (studentId, newPassword) => {
  const users = getUsers();
  const student = users.find(u => u.id === studentId);
  if (student) {
    student.password = newPassword;
    saveUsers(users);
    return true;
  }
  return false;
};

// Current Session Methods
export const getCurrentUser = () => {
  const json = localStorage.getItem(DB_KEYS.CURRENT_USER);
  return json ? JSON.parse(json) : null;
};

export const setCurrentUser = (user) => {
  if (user) {
    localStorage.setItem(DB_KEYS.CURRENT_USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(DB_KEYS.CURRENT_USER);
  }
};

// Attendance Records Store Methods
export const getAttendanceRecords = () => {
  initDB();
  return JSON.parse(localStorage.getItem(DB_KEYS.ATTENDANCE) || "[]");
};

export const saveAttendanceRecords = (records) => {
  localStorage.setItem(DB_KEYS.ATTENDANCE, JSON.stringify(records));
  try {
    window.dispatchEvent(new CustomEvent("attendance_updated"));
  } catch (e) {
    // Ignore in non-browser env
  }
  // Push to Cloud DB so all devices get the updated attendance
  pushCloudDB(null, records);
};

export const deleteAttendanceRecord = (recordId) => {
  const records = getAttendanceRecords().filter(r => r.id !== recordId);
  saveAttendanceRecords(records);
};

export const getStudentAttendanceHistory = (studentId) => {
  const records = getAttendanceRecords();
  return records
    .filter(r => r.studentId === studentId)
    .sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));
};

export const getTodayAttendance = (studentId) => {
  const today = new Date().toISOString().split("T")[0];
  const records = getAttendanceRecords();
  return records.find(r => r.studentId === studentId && r.tanggal === today) || null;
};

export const submitAbsenMasuk = (student, keterangan = "", locationData = null) => {
  // If 2nd parameter is locationData object instead of string (backwards compat)
  if (typeof keterangan === "object" && keterangan !== null && !locationData) {
    locationData = keterangan;
    keterangan = "";
  }

  const today = new Date().toISOString().split("T")[0];
  const nowTime = new Date().toLocaleTimeString("id-ID", { hour12: false });
  const records = getAttendanceRecords();

  let todayRecord = records.find(r => r.studentId === student.id && r.tanggal === today);

  const locInfo = {
    lat: locationData?.lat || -7.344001,
    lng: locationData?.lng || 112.804846,
    jarakMeters: locationData?.distanceMeters ?? locationData?.jarakMeters ?? 0,
    statusLokasi: locationData?.statusText || locationData?.statusLokasi || "Di Area Magang"
  };

  if (todayRecord) {
    todayRecord.jamMasuk = nowTime;
    todayRecord.keterangan = keterangan || todayRecord.keterangan || "-";
    todayRecord.status = "Hadir";
    todayRecord.lat = locInfo.lat;
    todayRecord.lng = locInfo.lng;
    todayRecord.jarakMeters = locInfo.jarakMeters;
    todayRecord.statusLokasi = locInfo.statusLokasi;
  } else {
    todayRecord = {
      id: `att-${Date.now()}`,
      studentId: student.id,
      namaSiswa: student.nama,
      tanggal: today,
      jamMasuk: nowTime,
      jamPulang: "-",
      keterangan: keterangan || "-",
      status: "Hadir",
      fotoMasuk: null,
      fotoPulang: null,
      lat: locInfo.lat,
      lng: locInfo.lng,
      jarakMeters: locInfo.jarakMeters,
      statusLokasi: locInfo.statusLokasi
    };
    records.unshift(todayRecord);
  }

  saveAttendanceRecords(records);
  return todayRecord;
};

export const submitAbsenPulang = (student, keterangan = "", locationData = null) => {
  // If 2nd parameter is locationData object instead of string (backwards compat)
  if (typeof keterangan === "object" && keterangan !== null && !locationData) {
    locationData = keterangan;
    keterangan = "";
  }

  const today = new Date().toISOString().split("T")[0];
  const nowTime = new Date().toLocaleTimeString("id-ID", { hour12: false });
  const records = getAttendanceRecords();

  let todayRecord = records.find(r => r.studentId === student.id && r.tanggal === today);

  const locInfo = {
    lat: locationData?.lat || -7.344001,
    lng: locationData?.lng || 112.804846,
    jarakMeters: locationData?.distanceMeters ?? locationData?.jarakMeters ?? 0,
    statusLokasi: locationData?.statusText || locationData?.statusLokasi || "Di Area Magang"
  };

  if (todayRecord) {
    todayRecord.jamPulang = nowTime;
    todayRecord.keteranganPulang = keterangan || todayRecord.keteranganPulang || "-";
    todayRecord.status = "Hadir";
    todayRecord.latPulang = locInfo.lat;
    todayRecord.lngPulang = locInfo.lng;
    todayRecord.jarakMetersPulang = locInfo.jarakMeters;
    todayRecord.statusLokasiPulang = locInfo.statusLokasi;
  } else {
    todayRecord = {
      id: `att-${Date.now()}`,
      studentId: student.id,
      namaSiswa: student.nama,
      tanggal: today,
      jamMasuk: "-",
      jamPulang: nowTime,
      keterangan: "-",
      keteranganPulang: keterangan || "-",
      status: "Hadir",
      fotoMasuk: null,
      fotoPulang: null,
      lat: locInfo.lat,
      lng: locInfo.lng,
      jarakMeters: locInfo.jarakMeters,
      statusLokasi: locInfo.statusLokasi
    };
    records.unshift(todayRecord);
  }

  saveAttendanceRecords(records);
  return todayRecord;
};
