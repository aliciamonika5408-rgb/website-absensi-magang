import React, { useState, useEffect } from "react";
import { Search, Calendar, Filter, FileText, Download, Printer, Users, Eye, X, MapPin } from "lucide-react";
import { getAttendanceRecords, getStudents } from "../services/db";

export default function AdminDataAbsensi() {
  const [records, setRecords] = useState([]);
  const [students, setStudents] = useState([]);
  
  // Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("all");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedRecord, setSelectedRecord] = useState(null);

  const loadData = () => {
    setRecords(getAttendanceRecords());
    setStudents(getStudents());
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

  // Filter Logic
  const filteredRecords = records.filter(r => {
    const matchesSearch =
      r.namaSiswa.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.keterangan || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.keteranganPulang || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStudent = selectedStudent === "all" || r.studentId === selectedStudent;
    const matchesDate = !selectedDate || r.tanggal === selectedDate;
    return matchesSearch && matchesStudent && matchesDate;
  });

  // Export to Excel (CSV Format with UTF-8 BOM for Microsoft Excel compatibility)
  const exportToExcel = () => {
    const headers = ["No", "Nama Siswa", "Tanggal", "Jam Masuk", "Keterangan Absen Masuk", "Jam Pulang", "Keterangan Absen Pulang", "Status", "Lokasi"];
    const rows = filteredRecords.map((r, i) => [
      i + 1,
      `"${r.namaSiswa}"`,
      `"${r.tanggal}"`,
      `"${r.jamMasuk}"`,
      `"${r.keterangan || "-"}"`,
      `"${r.jamPulang}"`,
      `"${r.keteranganPulang || "-"}"`,
      `"${r.status}"`,
      `"PT. Multi Power Abadi, Surabaya"`
    ]);

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Laporan_Absensi_Magang_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export Full Database to JSON
  const exportToJSON = () => {
    const fullDbData = {
      exportDate: new Date().toLocaleDateString("id-ID"),
      exportTimestamp: new Date().toISOString(),
      students: students,
      attendanceRecords: records
    };
    const jsonStr = JSON.stringify(fullDbData, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Database_Absensi_Magang_${new Date().toISOString().split("T")[0]}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Download phpMyAdmin Compatible SQL File
  const downloadSQL = () => {
    const link = document.createElement("a");
    link.href = "/database_absen_magang.sql";
    link.download = "database_absen_magang.sql";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Printable View / Export PDF via Browser Print Engine
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="animate-fade-in" style={{ paddingBottom: "2rem" }}>
      {/* Header & Export Actions */}
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "1rem", marginBottom: "1.5rem" }} className="no-print">
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: "800", color: "#0f172a" }}>Data Master Absensi</h1>
          <p style={{ fontSize: "0.875rem", color: "#64748b" }}>Seluruh histori presensi siswa magang dengan rincian keterangan absen masuk & pulang.</p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
          {/* Export Excel */}
          <button
            onClick={exportToExcel}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              backgroundColor: "#10b981",
              color: "#ffffff",
              padding: "0.65rem 1.1rem",
              borderRadius: "0.75rem",
              fontWeight: "700",
              fontSize: "0.875rem",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 4px 10px rgba(16, 185, 129, 0.2)"
            }}
          >
            <Download size={16} /> Export Excel
          </button>

          {/* Cetak / Export PDF */}
          <button
            onClick={handlePrint}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              backgroundColor: "#dc2626",
              color: "#ffffff",
              padding: "0.65rem 1.1rem",
              borderRadius: "0.75rem",
              fontWeight: "700",
              fontSize: "0.875rem",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 4px 10px rgba(220, 38, 38, 0.2)"
            }}
          >
            <Printer size={16} /> Cetak / PDF
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div
        className="no-print"
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "1.25rem",
          padding: "1.25rem",
          border: "1px solid #e2e8f0",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.03)",
          marginBottom: "1.5rem",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1rem",
          alignItems: "center"
        }}
      >
        {/* Search */}
        <div style={{ position: "relative" }}>
          <Search size={18} color="#94a3b8" style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)" }} />
          <input
            type="text"
            placeholder="Cari siswa atau keterangan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: "100%",
              padding: "0.65rem 1rem 0.65rem 2.65rem",
              borderRadius: "0.75rem",
              border: "1px solid #cbd5e1",
              fontSize: "0.875rem",
              outline: "none",
              boxSizing: "border-box"
            }}
          />
        </div>

        {/* Filter Siswa */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Users size={18} color="#64748b" />
          <select
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
            style={{
              width: "100%",
              padding: "0.65rem 1rem",
              borderRadius: "0.75rem",
              border: "1px solid #cbd5e1",
              fontSize: "0.875rem",
              color: "#334155",
              fontWeight: "600",
              outline: "none",
              backgroundColor: "#ffffff",
              cursor: "pointer"
            }}
          >
            <option value="all">Semua Siswa Magang</option>
            {students.map(s => (
              <option key={s.id} value={s.id}>{s.nama}</option>
            ))}
          </select>
        </div>

        {/* Filter Tanggal */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Calendar size={18} color="#64748b" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={{
              width: "100%",
              padding: "0.65rem 1rem",
              borderRadius: "0.75rem",
              border: "1px solid #cbd5e1",
              fontSize: "0.875rem",
              color: "#334155",
              outline: "none",
              backgroundColor: "#ffffff"
            }}
          />
        </div>
      </div>

      {/* Main Table Document Container */}
      <div className="printable-document">
        <div className="printable-header" style={{ display: "none", marginBottom: "1.5rem", borderBottom: "2px solid #0f172a", paddingBottom: "1rem" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "800" }}>LAPORAN MASTER ABSENSI SISWA MAGANG</h2>
          <p style={{ fontSize: "0.9rem", color: "#475569" }}>Dicetak pada: {new Date().toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
        </div>

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
                  <th style={{ padding: "1rem 1.25rem", fontWeight: "700" }}>Tanggal</th>
                  <th style={{ padding: "1rem 1.25rem", fontWeight: "700" }}>Nama Siswa</th>
                  <th style={{ padding: "1rem 1.25rem", fontWeight: "700" }}>Jam Masuk</th>
                  <th style={{ padding: "1rem 1.25rem", fontWeight: "700" }}>Keterangan Absen Masuk</th>
                  <th style={{ padding: "1rem 1.25rem", fontWeight: "700" }}>Jam Pulang</th>
                  <th style={{ padding: "1rem 1.25rem", fontWeight: "700" }}>Keterangan Absen Pulang</th>
                  <th style={{ padding: "1rem 1.25rem", fontWeight: "700" }}>Status</th>
                  <th style={{ padding: "1rem 1.25rem", fontWeight: "700" }} className="no-print">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.length > 0 ? (
                  filteredRecords.map(r => (
                    <tr key={r.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                      <td style={{ padding: "0.85rem 1.25rem", fontWeight: "700", color: "#0f172a" }}>
                        {r.tanggal}
                      </td>
                      <td style={{ padding: "0.85rem 1.25rem", fontWeight: "700", color: "#dc2626" }}>
                        {r.namaSiswa}
                      </td>
                      <td style={{ padding: "0.85rem 1.25rem", fontFamily: "monospace", color: "#10b981", fontWeight: "700" }}>
                        {r.jamMasuk !== "-" ? `${r.jamMasuk} WIB` : "-"}
                      </td>
                      <td style={{ padding: "0.85rem 1.25rem", color: "#334155", maxWidth: "200px" }}>
                        <span style={{ fontWeight: "600", display: "block" }}>
                          {r.keterangan || "-"}
                        </span>
                      </td>
                      <td style={{ padding: "0.85rem 1.25rem", fontFamily: "monospace", color: "#dc2626", fontWeight: "700" }}>
                        {r.jamPulang !== "-" ? `${r.jamPulang} WIB` : "-"}
                      </td>
                      <td style={{ padding: "0.85rem 1.25rem", color: "#334155", maxWidth: "200px" }}>
                        <span style={{ fontWeight: "600", display: "block" }}>
                          {r.keteranganPulang || "-"}
                        </span>
                      </td>
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
                      <td style={{ padding: "0.85rem 1.25rem" }} className="no-print">
                        <button
                          onClick={() => setSelectedRecord(r)}
                          style={{
                            cursor: "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.3rem",
                            backgroundColor: "#fef2f2",
                            color: "#dc2626",
                            border: "1px solid #fecaca",
                            padding: "0.35rem 0.75rem",
                            borderRadius: "0.5rem",
                            fontWeight: "700",
                            fontSize: "0.8rem"
                          }}
                        >
                          <Eye size={14} /> Detail
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" style={{ padding: "2.5rem", textAlign: "center", color: "#94a3b8" }}>
                      Tidak ada data absensi yang sesuai filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal View Detail */}
      {selectedRecord && (
        <div
          className="no-print"
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(15, 23, 42, 0.5)",
            backdropFilter: "blur(4px)",
            zIndex: 60,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem"
          }}
        >
          <div
            className="animate-fade-in"
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "1.5rem",
              width: "100%",
              maxWidth: "500px",
              padding: "1.75rem",
              border: "1px solid #e2e8f0"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
              <h3 style={{ fontSize: "1.2rem", fontWeight: "800", color: "#0f172a" }}>Detail Absensi {selectedRecord.namaSiswa}</h3>
              <button onClick={() => setSelectedRecord(null)} style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer" }}>
                <X size={22} />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", backgroundColor: "#f8fafc", padding: "1.25rem", borderRadius: "1rem", border: "1px solid #e2e8f0", marginBottom: "1.25rem" }}>
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

              <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: "0.75rem" }}>
                <span style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: "700", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                  <FileText size={14} color="#10b981" /> KETERANGAN ABSEN MASUK:
                </span>
                <p style={{ fontSize: "0.875rem", color: "#0f172a", fontWeight: "600", marginTop: "2px", backgroundColor: "#ffffff", padding: "0.6rem", borderRadius: "0.5rem", border: "1px solid #e2e8f0" }}>
                  {selectedRecord.keterangan || "-"}
                </p>
              </div>

              <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: "0.75rem" }}>
                <span style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: "700", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                  <FileText size={14} color="#dc2626" /> KETERANGAN ABSEN PULANG:
                </span>
                <p style={{ fontSize: "0.875rem", color: "#0f172a", fontWeight: "600", marginTop: "2px", backgroundColor: "#ffffff", padding: "0.6rem", borderRadius: "0.5rem", border: "1px solid #e2e8f0" }}>
                  {selectedRecord.keteranganPulang || "-"}
                </p>
              </div>

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

            <button
              onClick={() => setSelectedRecord(null)}
              style={{
                width: "100%",
                backgroundColor: "#dc2626",
                color: "#ffffff",
                padding: "0.75rem",
                borderRadius: "0.75rem",
                fontWeight: "700",
                border: "none",
                cursor: "pointer"
              }}
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
