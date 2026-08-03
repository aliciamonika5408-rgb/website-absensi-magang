import React, { useState, useEffect } from "react";
import { Users, CheckCircle, LogIn, LogOut, Eye, X, Calendar, MapPin, FileText } from "lucide-react";
import { getStudents, getAttendanceRecords } from "../services/db";

export default function AdminDashboard() {
  const [students, setStudents] = useState([]);
  const [records, setRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const loadData = () => {
    const stds = getStudents();
    const atts = getAttendanceRecords();
    setStudents(stds);
    setRecords(atts);
  };

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener("attendance_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("attendance_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const todayStr = new Date().toISOString().split("T")[0];
  const todayRecords = records.filter(r => r.tanggal === todayStr);

  // Statistics counters
  const totalSiswa = students.length;
  const hadirHariIni = todayRecords.filter(r => r.status === "Hadir").length;
  const absenMasukHariIni = todayRecords.filter(r => r.jamMasuk && r.jamMasuk !== "-").length;
  const absenPulangHariIni = todayRecords.filter(r => r.jamPulang && r.jamPulang !== "-").length;

  return (
    <div className="animate-fade-in" style={{ paddingBottom: "2rem" }}>
      {/* Welcome Admin Banner */}
      <div
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          borderRadius: "1.5rem",
          padding: "2rem",
          color: "#ffffff",
          boxShadow: "0 10px 25px -5px rgba(15, 23, 42, 0.2)",
          marginBottom: "1.75rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "1rem"
        }}
      >
        <div>
          <span style={{ backgroundColor: "#dc2626", color: "white", padding: "0.25rem 0.75rem", borderRadius: "9999px", fontSize: "0.75rem", fontWeight: "700" }}>
            ADMINISTRATOR PORTAL
          </span>
          <h1 style={{ fontSize: "1.75rem", fontWeight: "800", marginTop: "0.4rem" }}>
            Dashboard Admin Absensi
          </h1>
          <p style={{ fontSize: "0.9rem", color: "#94a3b8", marginTop: "4px" }}>
            Monitoring presensi & catatan kegiatan seluruh siswa magang secara real-time.
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", backgroundColor: "rgba(255,255,255,0.08)", padding: "0.6rem 1rem", borderRadius: "0.75rem" }}>
          <Calendar size={18} color="#ef4444" />
          <span style={{ fontSize: "0.85rem", fontWeight: "600", color: "#e2e8f0" }}>
            {new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </span>
        </div>
      </div>

      {/* 4 Cards Statistik */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.25rem", marginBottom: "2rem" }}>
        {/* Card 1: Total Siswa */}
        <div className="card-modern card-modern-hover" style={{ padding: "1.25rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
            <span style={{ fontSize: "0.85rem", fontWeight: "700", color: "#64748b" }}>Total Siswa</span>
            <div style={{ backgroundColor: "#fef2f2", color: "#dc2626", padding: "0.6rem", borderRadius: "0.75rem" }}>
              <Users size={20} />
            </div>
          </div>
          <div style={{ fontSize: "2rem", fontWeight: "800", color: "#0f172a" }}>{totalSiswa}</div>
          <span style={{ fontSize: "0.75rem", color: "#dc2626", fontWeight: "600" }}>👨 Siswa Terdaftar</span>
        </div>

        {/* Card 2: Hadir Hari Ini */}
        <div className="card-modern card-modern-hover" style={{ padding: "1.25rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
            <span style={{ fontSize: "0.85rem", fontWeight: "700", color: "#64748b" }}>Hadir Hari Ini</span>
            <div style={{ backgroundColor: "#ecfdf5", color: "#10b981", padding: "0.6rem", borderRadius: "0.75rem" }}>
              <CheckCircle size={20} />
            </div>
          </div>
          <div style={{ fontSize: "2rem", fontWeight: "800", color: "#10b981" }}>{hadirHariIni}</div>
          <span style={{ fontSize: "0.75rem", color: "#059669", fontWeight: "600" }}>✅ Presensi Aktif</span>
        </div>

        {/* Card 3: Absen Masuk Hari Ini */}
        <div className="card-modern card-modern-hover" style={{ padding: "1.25rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
            <span style={{ fontSize: "0.85rem", fontWeight: "700", color: "#64748b" }}>Absen Masuk Hari Ini</span>
            <div style={{ backgroundColor: "#fef2f2", color: "#dc2626", padding: "0.6rem", borderRadius: "0.75rem" }}>
              <LogIn size={20} />
            </div>
          </div>
          <div style={{ fontSize: "2rem", fontWeight: "800", color: "#dc2626" }}>{absenMasukHariIni}</div>
          <span style={{ fontSize: "0.75rem", color: "#dc2626", fontWeight: "600" }}>📥 Check-in Masuk</span>
        </div>

        {/* Card 4: Absen Pulang Hari Ini */}
        <div className="card-modern card-modern-hover" style={{ padding: "1.25rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
            <span style={{ fontSize: "0.85rem", fontWeight: "700", color: "#64748b" }}>Absen Pulang Hari Ini</span>
            <div style={{ backgroundColor: "#eff6ff", color: "#2563eb", padding: "0.6rem", borderRadius: "0.75rem" }}>
              <LogOut size={20} />
            </div>
          </div>
          <div style={{ fontSize: "2rem", fontWeight: "800", color: "#2563eb" }}>{absenPulangHariIni}</div>
          <span style={{ fontSize: "0.75rem", color: "#2563eb", fontWeight: "600" }}>📤 Check-out Pulang</span>
        </div>
      </div>

      {/* Map Header Card */}
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
            📌 Buka Google Maps
          </a>
        </div>

        {/* Embedded Compact Google Map */}
        <div style={{ width: "100%", height: "200px", borderRadius: "0.85rem", overflow: "hidden", border: "1px solid #e2e8f0" }}>
          <iframe
            title="Peta Titik Lokasi Magang Admin"
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

      {/* Tabel Data Absensi Siswa Terbaru */}
      <h2 style={{ fontSize: "1.2rem", fontWeight: "800", color: "#0f172a", marginBottom: "1rem" }}>
        Data Absensi Siswa Terbaru
      </h2>

      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "1.25rem",
          border: "1px solid #e2e8f0",
          boxShadow: "0 10px 25px -5px rgba(37, 99, 235, 0.05)",
          overflow: "hidden"
        }}
      >
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.875rem" }}>
            <thead>
              <tr style={{ backgroundColor: "#f8fafc", borderBottom: "1px solid #e2e8f0", color: "#475569" }}>
                <th style={{ padding: "1rem 1.25rem", fontWeight: "700" }}>Nama Siswa</th>
                <th style={{ padding: "1rem 1.25rem", fontWeight: "700" }}>Tanggal</th>
                <th style={{ padding: "1rem 1.25rem", fontWeight: "700" }}>Jam Masuk</th>
                <th style={{ padding: "1rem 1.25rem", fontWeight: "700" }}>Keterangan Absen Masuk</th>
                <th style={{ padding: "1rem 1.25rem", fontWeight: "700" }}>Jam Pulang</th>
                <th style={{ padding: "1rem 1.25rem", fontWeight: "700" }}>Keterangan Absen Pulang</th>
                <th style={{ padding: "1rem 1.25rem", fontWeight: "700" }}>Status</th>
                <th style={{ padding: "1rem 1.25rem", fontWeight: "700" }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {records.length > 0 ? (
                records.slice(0, 10).map((r) => (
                  <tr key={r.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    {/* Nama Siswa */}
                    <td style={{ padding: "0.85rem 1.25rem", fontWeight: "700", color: "#0f172a" }}>
                      {r.namaSiswa}
                    </td>

                    {/* Tanggal */}
                    <td style={{ padding: "0.85rem 1.25rem", color: "#64748b", fontWeight: "600" }}>
                      {r.tanggal}
                    </td>

                    {/* Jam Masuk */}
                    <td style={{ padding: "0.85rem 1.25rem", fontFamily: "monospace", color: "#10b981", fontWeight: "700" }}>
                      {r.jamMasuk !== "-" ? `${r.jamMasuk} WIB` : "-"}
                    </td>

                    {/* Keterangan Absen Masuk */}
                    <td style={{ padding: "0.85rem 1.25rem", color: "#334155", maxWidth: "200px" }}>
                      <span style={{ fontWeight: "600", display: "block" }}>
                        {r.keterangan || "-"}
                      </span>
                    </td>

                    {/* Jam Pulang */}
                    <td style={{ padding: "0.85rem 1.25rem", fontFamily: "monospace", color: "#2563eb", fontWeight: "700" }}>
                      {r.jamPulang !== "-" ? `${r.jamPulang} WIB` : "-"}
                    </td>

                    {/* Keterangan Absen Pulang */}
                    <td style={{ padding: "0.85rem 1.25rem", color: "#334155", maxWidth: "200px" }}>
                      <span style={{ fontWeight: "600", display: "block" }}>
                        {r.keteranganPulang || "-"}
                      </span>
                    </td>

                    {/* Status Badge */}
                    <td style={{ padding: "0.85rem 1.25rem" }}>
                      <span
                        style={{
                          backgroundColor: r.status === "Hadir" ? "#ecfdf5" : r.status === "Izin" ? "#fffbeb" : "#fef2f2",
                          color: r.status === "Hadir" ? "#047857" : r.status === "Izin" ? "#b45309" : "#b91c1c",
                          padding: "0.3rem 0.75rem",
                          borderRadius: "9999px",
                          fontSize: "0.8rem",
                          fontWeight: "700"
                        }}
                      >
                        {r.status === "Hadir" ? "🟢 Hadir" : r.status === "Izin" ? "🟡 Izin" : "🔴 Tidak Hadir"}
                      </span>
                    </td>

                    {/* Aksi Button Detail */}
                    <td style={{ padding: "0.85rem 1.25rem" }}>
                      <button
                        onClick={() => setSelectedRecord(r)}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.4rem",
                          backgroundColor: "#fef2f2",
                          color: "#dc2626",
                          border: "1px solid #fecaca",
                          padding: "0.4rem 0.85rem",
                          borderRadius: "0.5rem",
                          fontSize: "0.85rem",
                          fontWeight: "700",
                          cursor: "pointer"
                        }}
                      >
                        <Eye size={16} /> Detail
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" style={{ padding: "2rem", textAlign: "center", color: "#94a3b8" }}>
                    Belum ada data absensi.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Right Slide-over Panel for Detail Absensi */}
      {selectedRecord && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(15, 23, 42, 0.5)",
            backdropFilter: "blur(4px)",
            zIndex: 60,
            display: "flex",
            justifyContent: "flex-end"
          }}
        >
          <div
            className="animate-slide-right"
            style={{
              width: "100%",
              maxWidth: "440px",
              backgroundColor: "#ffffff",
              height: "100%",
              boxShadow: "-10px 0 25px rgba(0,0,0,0.15)",
              padding: "1.75rem",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between"
            }}
          >
            <div>
              {/* Panel Header */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #e2e8f0", paddingBottom: "1rem", marginBottom: "1.5rem" }}>
                <h3 style={{ fontSize: "1.25rem", fontWeight: "800", color: "#0f172a" }}>Detail Absensi Siswa</h3>
                <button
                  onClick={() => setSelectedRecord(null)}
                  style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer" }}
                >
                  <X size={24} />
                </button>
              </div>

              {/* Data Details List */}
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem", backgroundColor: "#f8fafc", padding: "1.25rem", borderRadius: "1rem", border: "1px solid #e2e8f0", marginBottom: "1.5rem" }}>
                <div>
                  <span style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: "600" }}>NAMA SISWA</span>
                  <p style={{ fontSize: "1.1rem", fontWeight: "800", color: "#0f172a" }}>{selectedRecord.namaSiswa}</p>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div>
                    <span style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: "600" }}>TANGGAL</span>
                    <p style={{ fontSize: "0.9rem", fontWeight: "700", color: "#0f172a" }}>{selectedRecord.tanggal}</p>
                  </div>
                  <div>
                    <span style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: "600" }}>STATUS</span>
                    <p style={{ fontSize: "0.9rem", fontWeight: "800", color: selectedRecord.status === "Hadir" ? "#10b981" : "#d97706" }}>
                      🟢 {selectedRecord.status}
                    </p>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div>
                    <span style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: "600" }}>JAM MASUK</span>
                    <p style={{ fontSize: "0.9rem", fontWeight: "700", color: "#10b981", fontFamily: "monospace" }}>
                      {selectedRecord.jamMasuk !== "-" ? `${selectedRecord.jamMasuk} WIB` : "-"}
                    </p>
                  </div>
                  <div>
                    <span style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: "600" }}>JAM PULANG</span>
                    <p style={{ fontSize: "0.9rem", fontWeight: "700", color: "#dc2626", fontFamily: "monospace" }}>
                      {selectedRecord.jamPulang !== "-" ? `${selectedRecord.jamPulang} WIB` : "-"}
                    </p>
                  </div>
                </div>

                {/* Keterangan Absen Masuk */}
                <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: "0.75rem" }}>
                  <span style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: "700", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                    <FileText size={14} color="#10b981" /> KETERANGAN ABSEN MASUK:
                  </span>
                  <p style={{ fontSize: "0.875rem", color: "#0f172a", fontWeight: "600", marginTop: "2px", backgroundColor: "#ffffff", padding: "0.6rem", borderRadius: "0.5rem", border: "1px solid #e2e8f0" }}>
                    {selectedRecord.keterangan || "-"}
                  </p>
                </div>

                {/* Keterangan Absen Pulang */}
                <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: "0.75rem" }}>
                  <span style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: "700", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                    <FileText size={14} color="#dc2626" /> KETERANGAN ABSEN PULANG:
                  </span>
                  <p style={{ fontSize: "0.875rem", color: "#0f172a", fontWeight: "600", marginTop: "2px", backgroundColor: "#ffffff", padding: "0.6rem", borderRadius: "0.5rem", border: "1px solid #e2e8f0" }}>
                    {selectedRecord.keteranganPulang || "-"}
                  </p>
                </div>

                {/* Location Address Info */}
                <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: "0.75rem" }}>
                  <span style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: "700", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                    <MapPin size={14} color="#dc2626" /> LOKASI ABSENSI:
                  </span>
                  <p style={{ fontSize: "0.85rem", color: "#0f172a", fontWeight: "700", marginTop: "2px" }}>
                    PT. Multi Power Abadi
                  </p>
                  <p style={{ fontSize: "0.8rem", color: "#64748b", marginTop: "1px" }}>
                    Jl. Gn. Anyar Tambak IV No.50, Gn. Anyar Tambak, Kec. Gn. Anyar, Surabaya, Jawa Timur 60294
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedRecord(null)}
              style={{
                width: "100%",
                backgroundColor: "#dc2626",
                color: "#ffffff",
                padding: "0.85rem",
                borderRadius: "0.75rem",
                fontWeight: "700",
                border: "none",
                cursor: "pointer"
              }}
            >
              Tutup Detail
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
