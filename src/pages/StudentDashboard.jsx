import React, { useState, useEffect } from "react";
import { LogIn, LogOut, CheckCircle2, Clock, Calendar, ArrowRight, ShieldCheck, FileText, MapPin } from "lucide-react";
import { getTodayAttendance } from "../services/db";

export default function StudentDashboard({ user, onNavigate }) {
  const [todayRecord, setTodayRecord] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Fetch today's attendance record
    const loadRecord = () => {
      const record = getTodayAttendance(user.id);
      setTodayRecord(record);
    };

    loadRecord();

    window.addEventListener("attendance_updated", loadRecord);
    window.addEventListener("storage", loadRecord);

    // Live clock interval
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
      window.removeEventListener("attendance_updated", loadRecord);
      window.removeEventListener("storage", loadRecord);
    };
  }, [user]);

  // Format Date and Time
  const dateFormatted = currentTime.toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  const timeFormatted = currentTime.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  }) + " WIB";

  const isMasukDone = todayRecord && todayRecord.jamMasuk && todayRecord.jamMasuk !== "-";
  const isPulangDone = todayRecord && todayRecord.jamPulang && todayRecord.jamPulang !== "-";

  return (
    <div className="animate-fade-in" style={{ paddingBottom: "2rem" }}>
      {/* Welcome Hero Banner */}
      <div
        style={{
          background: "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)",
          borderRadius: "1.5rem",
          padding: "2rem",
          color: "#ffffff",
          boxShadow: "0 10px 25px -5px rgba(220, 38, 38, 0.3)",
          marginBottom: "1.75rem",
          position: "relative",
          overflow: "hidden"
        }}
      >
        <div style={{ position: "relative", zIndex: 2, maxWidth: "600px" }}>
          <span
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              padding: "0.3rem 0.85rem",
              borderRadius: "9999px",
              fontSize: "0.8rem",
              fontWeight: "700",
              display: "inline-block",
              marginBottom: "0.75rem"
            }}
          >
            Siswa Magang Active
          </span>
          <h1 style={{ fontSize: "1.75rem", fontWeight: "800", marginBottom: "0.4rem" }}>
            Selamat Datang di Sistem Absensi Magang!
          </h1>
        </div>
      </div>

      {/* Dynamic Date & Clock Header Bar */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
          backgroundColor: "#ffffff",
          padding: "1.25rem 1.5rem",
          borderRadius: "1.25rem",
          border: "1px solid #e2e8f0",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.03)",
          marginBottom: "1.75rem"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div style={{ backgroundColor: "#fef2f2", padding: "0.6rem", borderRadius: "0.75rem", color: "#dc2626" }}>
            <Calendar size={22} />
          </div>
          <div>
            <span style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: "600", display: "block" }}>TANGGAL HARI INI</span>
            <span style={{ fontSize: "1.05rem", fontWeight: "700", color: "#0f172a" }}>{dateFormatted}</span>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div style={{ backgroundColor: "#fef2f2", padding: "0.6rem", borderRadius: "0.75rem", color: "#dc2626" }}>
            <Clock size={22} />
          </div>
          <div>
            <span style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: "600", display: "block" }}>JAM SEKARANG</span>
            <span style={{ fontSize: "1.1rem", fontWeight: "800", color: "#dc2626", fontFamily: "monospace" }}>{timeFormatted}</span>
          </div>
        </div>
      </div>

      {/* Compact Location GPS Map Card */}
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "1.25rem",
          padding: "1.25rem",
          border: "1px solid #e2e8f0",
          boxShadow: "0 6px 18px rgba(0,0,0,0.03)",
          marginBottom: "1.75rem"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem", flexWrap: "wrap", gap: "0.5rem" }}>
          <div>
            <span style={{ fontSize: "0.95rem", fontWeight: "800", color: "#0f172a", display: "flex", alignItems: "center", gap: "0.4rem" }}>
              📍 Titik Lokasi Magang (PT. Multi Power Abadi)
            </span>
            <span style={{ fontSize: "0.8rem", color: "#64748b", display: "block", marginTop: "2px" }}>
              Jl. Gn. Anyar Tambak IV No.50, Gn. Anyar Tambak, Kec. Gn. Anyar, Surabaya, Jawa Timur 60294
            </span>
          </div>
          <a
            href="https://www.google.com/maps?q=-7.344001,112.804846"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              backgroundColor: "#fef2f2",
              color: "#dc2626",
              border: "1px solid #fecaca",
              padding: "0.4rem 0.85rem",
              borderRadius: "0.6rem",
              fontSize: "0.8rem",
              fontWeight: "700",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.3rem"
            }}
          >
            📌 Petunjuk Arah
          </a>
        </div>

        {/* Embedded Compact Google Map */}
        <div style={{ width: "100%", height: "210px", borderRadius: "0.85rem", overflow: "hidden", border: "1px solid #e2e8f0" }}>
          <iframe
            title="Peta Lokasi Magang PT Multi Power Abadi"
            src="https://maps.google.com/maps?q=-7.344001,112.804846&z=17&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>

      {/* Card Status Absensi Hari Ini Section */}
      {(isMasukDone || isPulangDone) && (
        <div style={{ marginBottom: "2rem" }}>
          <h2 style={{ fontSize: "1.2rem", fontWeight: "800", color: "#0f172a", marginBottom: "1rem" }}>
            Status Absensi Hari Ini
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.25rem" }}>
            {/* Status Absen Masuk Card */}
            {isMasukDone && (
              <div
                style={{
                  backgroundColor: "#ffffff",
                  borderRadius: "1.25rem",
                  padding: "1.5rem",
                  border: "2px solid #10b981",
                  boxShadow: "0 8px 20px rgba(16, 185, 129, 0.08)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <CheckCircle2 size={24} color="#10b981" />
                    <div>
                      <span style={{ fontSize: "1.1rem", fontWeight: "800", color: "#10b981" }}>Absen Masuk Berhasil</span>
                      <span style={{ display: "block", fontSize: "0.8rem", color: "#64748b" }}>Pukul {todayRecord.jamMasuk} WIB</span>
                    </div>
                  </div>
                  <span style={{ backgroundColor: "#ecfdf5", color: "#047857", padding: "0.25rem 0.65rem", borderRadius: "9999px", fontSize: "0.75rem", fontWeight: "700" }}>
                    🟢 Hadir
                  </span>
                </div>
                {todayRecord.keterangan && (
                  <div style={{ backgroundColor: "#f8fafc", padding: "0.75rem", borderRadius: "0.75rem", border: "1px solid #e2e8f0" }}>
                    <span style={{ fontSize: "0.7rem", color: "#64748b", fontWeight: "700", display: "block" }}>Catatan Masuk:</span>
                    <span style={{ fontSize: "0.85rem", color: "#0f172a", fontWeight: "600" }}>{todayRecord.keterangan}</span>
                  </div>
                )}
              </div>
            )}

            {/* Status Absen Pulang Card */}
            {isPulangDone && (
              <div
                style={{
                  backgroundColor: "#ffffff",
                  borderRadius: "1.25rem",
                  padding: "1.5rem",
                  border: "2px solid #dc2626",
                  boxShadow: "0 8px 20px rgba(220, 38, 38, 0.08)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <CheckCircle2 size={24} color="#dc2626" />
                    <div>
                      <span style={{ fontSize: "1.1rem", fontWeight: "800", color: "#dc2626" }}>Absen Pulang Berhasil</span>
                      <span style={{ display: "block", fontSize: "0.8rem", color: "#64748b" }}>Pukul {todayRecord.jamPulang} WIB</span>
                    </div>
                  </div>
                  <span style={{ backgroundColor: "#ecfdf5", color: "#047857", padding: "0.25rem 0.65rem", borderRadius: "9999px", fontSize: "0.75rem", fontWeight: "700" }}>
                    🟢 Hadir
                  </span>
                </div>
                {todayRecord.keteranganPulang && (
                  <div style={{ backgroundColor: "#f8fafc", padding: "0.75rem", borderRadius: "0.75rem", border: "1px solid #e2e8f0" }}>
                    <span style={{ fontSize: "0.7rem", color: "#64748b", fontWeight: "700", display: "block" }}>Catatan Pulang:</span>
                    <span style={{ fontSize: "0.85rem", color: "#0f172a", fontWeight: "600" }}>{todayRecord.keteranganPulang}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2 Large Interactive Action Buttons */}
      <h2 style={{ fontSize: "1.2rem", fontWeight: "800", color: "#0f172a", marginBottom: "1rem" }}>
        Menu Absensi Hari Ini
      </h2>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.25rem" }}>
        {/* Tombol Besar Absen Masuk */}
        <button
          onClick={() => onNavigate("absen-masuk")}
          style={{
            backgroundColor: "#ffffff",
            color: "#0f172a",
            borderRadius: "1.5rem",
            padding: "1.75rem",
            border: `2px solid ${isMasukDone ? "#10b981" : "#dc2626"}`,
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "1rem",
            boxShadow: "0 10px 25px -5px rgba(220, 38, 38, 0.08)",
            transition: "all 0.2s ease"
          }}
          className="card-modern-hover"
        >
          <div
            style={{
              backgroundColor: isMasukDone ? "#ecfdf5" : "#fef2f2",
              padding: "0.75rem",
              borderRadius: "1rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            {isMasukDone ? <CheckCircle2 size={32} color="#10b981" /> : <LogIn size={32} color="#dc2626" />}
          </div>
          <div style={{ textAlign: "left", width: "100%" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: "1.35rem", fontWeight: "800", color: isMasukDone ? "#10b981" : "#dc2626" }}>
                {isMasukDone ? "✅ Absen Masuk" : "📝 Absen Masuk"}
              </span>
              <ArrowRight size={20} color={isMasukDone ? "#10b981" : "#dc2626"} />
            </div>
            <p style={{ fontSize: "0.85rem", color: "#64748b", marginTop: "4px" }}>
              {isMasukDone
                ? `Sudah absen masuk pukul ${todayRecord.jamMasuk} WIB`
                : "Isi catatan & verifikasi lokasi GPS PT. Multi Power Abadi"}
            </p>
          </div>
        </button>

        {/* Tombol Besar Absen Pulang */}
        <button
          onClick={() => onNavigate("absen-pulang")}
          style={{
            backgroundColor: "#ffffff",
            color: "#0f172a",
            borderRadius: "1.5rem",
            padding: "1.75rem",
            border: `2px solid ${isPulangDone ? "#10b981" : "#dc2626"}`,
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "1rem",
            boxShadow: "0 10px 25px -5px rgba(220, 38, 38, 0.08)",
            transition: "all 0.2s ease"
          }}
          className="card-modern-hover"
        >
          <div
            style={{
              backgroundColor: isPulangDone ? "#ecfdf5" : "#fef2f2",
              padding: "0.75rem",
              borderRadius: "1rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            {isPulangDone ? <CheckCircle2 size={32} color="#10b981" /> : <LogOut size={32} color="#dc2626" />}
          </div>
          <div style={{ textAlign: "left", width: "100%" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: "1.35rem", fontWeight: "800", color: isPulangDone ? "#10b981" : "#dc2626" }}>
                {isPulangDone ? "✅ Absen Pulang" : "📝 Absen Pulang"}
              </span>
              <ArrowRight size={20} color={isPulangDone ? "#10b981" : "#dc2626"} />
            </div>
            <p style={{ fontSize: "0.85rem", color: "#64748b", marginTop: "4px" }}>
              {isPulangDone
                ? `Sudah absen pulang pukul ${todayRecord.jamPulang} WIB`
                : "Isi catatan kegiatan & verifikasi lokasi GPS sebelum pulang"}
            </p>
          </div>
        </button>
      </div>
    </div>
  );
}
