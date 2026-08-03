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
  // Always ensure default users exist in DB
  const defaultUsers = [INITIAL_ADMIN, ...INITIAL_STUDENTS];
  if (!localStorage.getItem(DB_KEYS.USERS)) {
    localStorage.setItem(DB_KEYS.USERS, JSON.stringify(defaultUsers));
  } else {
    // Sync missing students into local storage if any
    const existingUsers = JSON.parse(localStorage.getItem(DB_KEYS.USERS) || "[]");
    let hasChanges = false;
    defaultUsers.forEach(defUser => {
      const idx = existingUsers.findIndex(u => u.id === defUser.id || u.nama.toLowerCase() === defUser.nama.toLowerCase());
      if (idx === -1) {
        existingUsers.push(defUser);
        hasChanges = true;
      } else if (defUser.id === "std-1" && existingUsers[idx].fotoProfil !== "/alicia-profile.jpg") {
        existingUsers[idx].fotoProfil = "/alicia-profile.jpg";
        hasChanges = true;
      } else if (defUser.id === "std-2" && existingUsers[idx].fotoProfil !== "/aisyah-profile.png") {
        existingUsers[idx].fotoProfil = "/aisyah-profile.png";
        hasChanges = true;
      } else if (["std-3", "std-4", "std-5", "std-6"].includes(defUser.id) && existingUsers[idx].fotoProfil !== "/default-avatar.png") {
        existingUsers[idx].fotoProfil = "/default-avatar.png";
        hasChanges = true;
      }
    });
    if (hasChanges) {
      localStorage.setItem(DB_KEYS.USERS, JSON.stringify(existingUsers));
    }

    const cur = getCurrentUser();
    if (cur && cur.id === "std-1" && cur.fotoProfil !== "/alicia-profile.jpg") {
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
  } else {
    const existingRecords = JSON.parse(localStorage.getItem(DB_KEYS.ATTENDANCE) || "[]");
    const jsonRecords = initialData.attendanceRecords || [];
    let hasChanges = false;
    jsonRecords.forEach(jRec => {
      const idx = existingRecords.findIndex(r => r.id === jRec.id || (r.studentId === jRec.studentId && r.tanggal === jRec.tanggal));
      if (idx === -1) {
        existingRecords.push(jRec);
        hasChanges = true;
      }
    });
    if (hasChanges) {
      localStorage.setItem(DB_KEYS.ATTENDANCE, JSON.stringify(existingRecords));
    }
  }
};

// Users Store Methods
export const getUsers = () => {
  initDB();
  return JSON.parse(localStorage.getItem(DB_KEYS.USERS) || "[]");
};

// Auto Sync to Disk Endpoint
export const syncDatabaseDisk = (customUsers = null, customRecords = null) => {
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
  const users = getUsers();
  const inputNama = nama.trim().toLowerCase();
  const inputPass = password.trim();

  return users.find(u => {
    const dbNama = u.nama.trim().toLowerCase();
    const isNameMatch = dbNama === inputNama || (inputNama.includes("alicia") && dbNama.includes("alicia"));
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
  saveUsers(users);
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
  saveUsers(users);
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
  syncDatabaseDisk(null, records);
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
