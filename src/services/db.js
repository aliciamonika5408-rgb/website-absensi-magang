import initialData from "../data/database.json";
import { supabase } from "./supabase";

// Initial Database Records from src/data/database.json
const INITIAL_STUDENTS = initialData.students;
const INITIAL_ADMIN = initialData.admin;
export const COMPANY_INFO = initialData.company;

const DB_KEYS = {
  USERS: "absensi_magang_users_v1",
  ATTENDANCE: "absensi_magang_attendance_v1",
  CURRENT_USER: "absensi_magang_current_user_v1"
};

// Helper Data Mappers for Supabase (PostgreSQL column names mapping)
const mapUserFromSupabase = (u) => ({
  id: u.id,
  nama: u.nama,
  pin: u.pin,
  role: u.role,
  sekolah: u.sekolah,
  tempatMagang: u.tempat_magang || u.tempatMagang,
  noHp: u.no_hp || u.noHp,
  fotoProfil: u.foto_profil || u.fotoProfil || "/default-avatar.png",
  password: u.password || u.pin
});

const mapUserToSupabase = (u) => ({
  id: u.id,
  nama: u.nama,
  pin: u.pin,
  role: u.role,
  sekolah: u.sekolah || null,
  tempat_magang: u.tempatMagang || "PT. MULTI POWER ABADI",
  no_hp: u.noHp || null,
  foto_profil: u.fotoProfil || "/default-avatar.png"
});

const mapAbsensiFromSupabase = (a) => ({
  id: a.id,
  studentId: a.student_id || a.studentId,
  namaSiswa: a.nama_siswa || a.namaSiswa,
  tanggal: a.tanggal,
  jamMasuk: a.jam_masuk || a.jamMasuk || "-",
  ketMasuk: a.keterangan_masuk || a.ketMasuk || a.keterangan || "-",
  keterangan: a.keterangan_masuk || a.keterangan || "-",
  jamPulang: a.jam_pulang || a.jamPulang || "-",
  ketPulang: a.keterangan_pulang || a.ketPulang || "-",
  keteranganPulang: a.keterangan_pulang || a.keteranganPulang || "-",
  status: a.status || "Hadir",
  lat: a.latitude ? Number(a.latitude) : null,
  lng: a.longitude ? Number(a.longitude) : null,
  jarakMeters: a.jarak_meters ?? 0,
  statusLokasi: a.status_lokasi || "Di Area Magang"
});

const mapAbsensiToSupabase = (a) => ({
  id: a.id,
  student_id: a.studentId,
  nama_siswa: a.namaSiswa,
  tanggal: a.tanggal,
  jam_masuk: a.jamMasuk || "-",
  keterangan_masuk: a.ketMasuk || a.keterangan || "-",
  jam_pulang: a.jamPulang || "-",
  keterangan_pulang: a.ketPulang || a.keteranganPulang || "-",
  status: a.status || "Hadir",
  latitude: a.lat || null,
  longitude: a.lng || null,
  jarak_meters: a.jarakMeters || 0,
  status_lokasi: a.statusLokasi || "Di Area Magang"
});

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
  const defaultUsers = [INITIAL_ADMIN, ...INITIAL_STUDENTS];
  if (!localStorage.getItem(DB_KEYS.USERS)) {
    localStorage.setItem(DB_KEYS.USERS, JSON.stringify(defaultUsers));
  } else {
    const existingUsers = JSON.parse(localStorage.getItem(DB_KEYS.USERS) || "[]");
    let hasChanges = false;

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
  }

  if (!localStorage.getItem(DB_KEYS.ATTENDANCE)) {
    localStorage.setItem(DB_KEYS.ATTENDANCE, JSON.stringify(initialData.attendanceRecords || []));
  }

  // Trigger async Supabase fetch in background
  fetchCloudDB();
};

// Sync Cloud Supabase Database to Local Storage
export const fetchCloudDB = async () => {
  try {
    const { data: usersData, error: usersErr } = await supabase.from("users").select("*");
    const { data: absensiData, error: absensiErr } = await supabase.from("absensi").select("*");

    let updated = false;

    if (!usersErr && usersData && usersData.length > 0) {
      const mappedUsers = usersData.map(mapUserFromSupabase);
      localStorage.setItem(DB_KEYS.USERS, JSON.stringify(mappedUsers));
      try {
        window.dispatchEvent(new CustomEvent("users_updated"));
      } catch (e) {}
      updated = true;
    }

    if (!absensiErr && absensiData) {
      const mappedAbsensi = absensiData.map(mapAbsensiFromSupabase);
      localStorage.setItem(DB_KEYS.ATTENDANCE, JSON.stringify(mappedAbsensi));
      try {
        window.dispatchEvent(new CustomEvent("attendance_updated"));
      } catch (e) {}
      updated = true;
    }

    return updated;
  } catch (e) {
    console.warn("Supabase fetch notice:", e);
    return false;
  }
};

// Push Local Storage to Cloud Database (Supabase)
export const pushCloudDB = async (customUsers = null, customRecords = null) => {
  try {
    const allUsers = customUsers || JSON.parse(localStorage.getItem(DB_KEYS.USERS) || "[]");
    const attendanceRecords = customRecords || JSON.parse(localStorage.getItem(DB_KEYS.ATTENDANCE) || "[]");

    if (allUsers.length > 0) {
      const payloadUsers = allUsers.map(mapUserToSupabase);
      await supabase.from("users").upsert(payloadUsers);
    }

    if (attendanceRecords.length > 0) {
      const payloadAbsensi = attendanceRecords.map(mapAbsensiToSupabase);
      await supabase.from("absensi").upsert(payloadAbsensi);
    }
  } catch (e) {
    console.warn("Supabase push notice:", e);
  }
};

export const syncDatabaseDisk = (customUsers = null, customRecords = null) => {
  pushCloudDB(customUsers, customRecords);
};

export const getUsers = () => {
  initDB();
  return JSON.parse(localStorage.getItem(DB_KEYS.USERS) || "[]");
};

export const saveUsers = (users) => {
  localStorage.setItem(DB_KEYS.USERS, JSON.stringify(users));
  try {
    window.dispatchEvent(new CustomEvent("users_updated"));
  } catch (e) {}
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

  const adminNama = (INITIAL_ADMIN.nama || "").trim().toLowerCase();
  const adminUsername = (INITIAL_ADMIN.username || "").trim().toLowerCase();
  const isAdminMatch = (inputNama === adminUsername || inputNama === adminNama || inputNama === "admin123" || inputNama === "admin");

  if (isAdminMatch && inputPass === INITIAL_ADMIN.password) {
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
  localStorage.setItem(DB_KEYS.USERS, JSON.stringify(users));
  try {
    window.dispatchEvent(new CustomEvent("users_updated"));
  } catch (e) {}

  // Sync to Supabase directly
  supabase.from("users").upsert(mapUserToSupabase(newStudent)).then(({ error }) => {
    if (error) console.warn("Supabase addStudent error:", error);
  });

  return newStudent;
};

export const updateStudent = (studentData) => {
  const users = getUsers();
  const index = users.findIndex(u => u.id === studentData.id);
  if (index !== -1) {
    const updated = { ...users[index], ...studentData };
    users[index] = updated;
    saveUsers(users);

    const currentUser = getCurrentUser();
    if (currentUser && currentUser.id === studentData.id) {
      setCurrentUser(updated);
    }

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

    // Push updated student to Supabase
    supabase.from("users").upsert(mapUserToSupabase(updated)).then(({ error }) => {
      if (error) console.warn("Supabase updateStudent error:", error);
    });

    return updated;
  }
  return null;
};

export const deleteStudent = (studentId) => {
  const users = getUsers().filter(u => u.id !== studentId);
  localStorage.setItem(DB_KEYS.USERS, JSON.stringify(users));
  try {
    window.dispatchEvent(new CustomEvent("users_updated"));
  } catch (e) {}

  // Delete from Supabase
  supabase.from("users").delete().eq("id", studentId).then(({ error }) => {
    if (error) console.warn("Supabase deleteStudent error:", error);
  });
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
  } catch (e) {}
  pushCloudDB(null, records);
};

export const deleteAttendanceRecord = (recordId) => {
  const records = getAttendanceRecords().filter(r => r.id !== recordId);
  saveAttendanceRecords(records);
  supabase.from("absensi").delete().eq("id", recordId).then(({ error }) => {
    if (error) console.warn("Supabase deleteAttendanceRecord error:", error);
  });
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
    todayRecord.ketMasuk = keterangan || todayRecord.ketMasuk || "-";
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
      ketMasuk: keterangan || "-",
      keterangan: keterangan || "-",
      jamPulang: "-",
      ketPulang: "-",
      keteranganPulang: "-",
      status: "Hadir",
      lat: locInfo.lat,
      lng: locInfo.lng,
      jarakMeters: locInfo.jarakMeters,
      statusLokasi: locInfo.statusLokasi
    };
    records.unshift(todayRecord);
  }

  saveAttendanceRecords(records);

  // Push immediately to Supabase
  supabase.from("absensi").upsert(mapAbsensiToSupabase(todayRecord)).then(({ error }) => {
    if (error) console.warn("Supabase submitAbsenMasuk error:", error);
  });

  return todayRecord;
};

export const submitAbsenPulang = (student, keterangan = "", locationData = null) => {
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
    todayRecord.ketPulang = keterangan || todayRecord.ketPulang || "-";
    todayRecord.keteranganPulang = keterangan || todayRecord.keteranganPulang || "-";
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
      jamMasuk: "-",
      ketMasuk: "-",
      keterangan: "-",
      jamPulang: nowTime,
      ketPulang: keterangan || "-",
      keteranganPulang: keterangan || "-",
      status: "Hadir",
      lat: locInfo.lat,
      lng: locInfo.lng,
      jarakMeters: locInfo.jarakMeters,
      statusLokasi: locInfo.statusLokasi
    };
    records.unshift(todayRecord);
  }

  saveAttendanceRecords(records);

  // Push immediately to Supabase
  supabase.from("absensi").upsert(mapAbsensiToSupabase(todayRecord)).then(({ error }) => {
    if (error) console.warn("Supabase submitAbsenPulang error:", error);
  });

  return todayRecord;
};
