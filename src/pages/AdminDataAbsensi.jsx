import React, { useState, useEffect } from "react";
import { Search, Calendar, Users, Printer, Download, RefreshCw } from "lucide-react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { getAttendanceRecords, getStudents } from "../services/db";

export default function AdminDataAbsensi() {
  const [absensiList, setAbsensiList] = useState([]);
  const [siswaList, setSiswaList] = useState([]);
  
  // State untuk Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSiswa, setSelectedSiswa] = useState("semua");
  const [selectedDate, setSelectedDate] = useState("");

  const loadData = () => {
    const dataAbsensi = getAttendanceRecords() || [];
    const dataSiswa = getStudents() || [];
    setAbsensiList(dataAbsensi);
    setSiswaList(dataSiswa);
  };

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener("attendance_updated", handleUpdate);
    window.addEventListener("users_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("attendance_updated", handleUpdate);
      window.removeEventListener("users_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);


  // Logika Filter Data Absensi
  const filteredAbsensi = absensiList.filter((item) => {
    // 1. Filter Pencarian Nama / Keterangan
    const matchQuery =
      (item.namaSiswa && item.namaSiswa.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.ketMasuk && item.ketMasuk.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.ketPulang && item.ketPulang.toLowerCase().includes(searchQuery.toLowerCase()));

    // 2. Filter Pilih Siswa
    const matchSiswa =
      selectedSiswa === "semua" || item.namaSiswa === selectedSiswa || item.siswaId === selectedSiswa;

    // 3. Filter Tanggal
    const matchDate = !selectedDate || item.tanggal === selectedDate;

    return matchQuery && matchSiswa && matchDate;
  });

  // FUNGSI UTAMA: Cetak & Export PDF
  const handleExportPDF = () => {
    if (filteredAbsensi.length === 0) {
      alert("Tidak ada data absensi untuk dicetak!");
      return;
    }

    // Initialize jsPDF (Format A4 Portrait)
    const doc = new jsPDF("p", "mm", "a4");

    // Header / Kop Dokumen
    doc.setFontSize(16);
    doc.setTextColor(15, 23, 42); // Warna Dark Slate
    doc.text("LAPORAN ABSENSI SISWA MAGANG", 14, 18);

    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139); // Warna Grey
    doc.text("PT. MULTI POWER ABADI", 14, 24);
    doc.text(`Tanggal Cetak: ${new Date().toLocaleDateString("id-ID")}`, 14, 29);

    // Garis Pemisah
    doc.setDrawColor(226, 232, 240);
    doc.line(14, 33, 196, 33);

    // Menyiapkan Data Tabel untuk PDF
    const tableData = filteredAbsensi.map((item, index) => [
      index + 1,
      item.tanggal || "-",
      item.namaSiswa || "-",
      item.jamMasuk || "-",
      item.ketMasuk || "-",
      item.jamPulang || "-",
      item.ketPulang || "-",
      item.status || "Hadir"
    ]);

    // Membuat Tabel PDF dengan AutoTable
    doc.autoTable({
      startY: 37,
      head: [
        [
          "No",
          "Tanggal",
          "Nama Siswa",
          "Jam Masuk",
          "Ket. Masuk",
          "Jam Pulang",
          "Ket. Pulang",
          "Status"
        ]
      ],
      body: tableData,
      theme: "grid",
      headStyles: {
        fillColor: [220, 38, 38], // Warna Merah (#dc2626) sesuai tema aplikasi
        textColor: [255, 255, 255],
        fontStyle: "bold",
        fontSize: 9
      },
      bodyStyles: {
        fontSize: 8,
        textColor: [51, 65, 85]
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252] // Warna belang tipis (#f8fafc)
      }
    });

    // Simpan File PDF
    doc.save(`Laporan_Absensi_Magang_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* Header Halaman */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: "800", color: "#0f172a" }}>
            Data Master Absensi
          </h1>
          <p style={{ fontSize: "0.875rem", color: "#64748b", marginTop: "4px" }}>
            Seluruh histori presensi siswa magang dengan rincian keterangan absen masuk & pulang.
          </p>
        </div>

        {/* Tombol Aksi (Export PDF & Excel) */}
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button
            onClick={handleExportPDF}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              backgroundColor: "#dc2626",
              color: "#ffffff",
              border: "none",
              padding: "0.6rem 1.25rem",
              borderRadius: "0.5rem",
              fontSize: "0.875rem",
              fontWeight: "700",
              cursor: "pointer",
              boxShadow: "0 2px 4px rgba(220, 38, 38, 0.2)",
              transition: "all 0.2s"
            }}
          >
            <Printer size={18} /> Cetak / PDF
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "0.75rem",
          padding: "1rem",
          border: "1px solid #e2e8f0",
          marginBottom: "1.5rem",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1rem"
        }}
      >
        {/* Input Pencarian */}
        <div style={{ position: "relative" }}>
          <Search size={18} color="#94a3b8" style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)" }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari siswa atau keterangan..."
            style={{
              width: "100%",
              padding: "0.55rem 0.75rem 0.55rem 2.5rem",
              borderRadius: "0.5rem",
              border: "1px solid #cbd5e1",
              fontSize: "0.875rem",
              outline: "none"
            }}
          />
        </div>

        {/* Dropdown Filter Siswa */}
        <div style={{ position: "relative" }}>
          <Users size={18} color="#94a3b8" style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)" }} />
          <select
            value={selectedSiswa}
            onChange={(e) => setSelectedSiswa(e.target.value)}
            style={{
              width: "100%",
              padding: "0.55rem 0.75rem 0.55rem 2.5rem",
              borderRadius: "0.5rem",
              border: "1px solid #cbd5e1",
              fontSize: "0.875rem",
              outline: "none",
              backgroundColor: "#ffffff"
            }}
          >
            <option value="semua">Semua Siswa Magang</option>
            {siswaList.map((s, i) => (
              <option key={i} value={s.nama || s.namaSiswa}>
                {s.nama || s.namaSiswa}
              </option>
            ))}
          </select>
        </div>

        {/* Filter Tanggal */}
        <div style={{ position: "relative" }}>
          <Calendar size={18} color="#94a3b8" style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)" }} />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={{
              width: "100%",
              padding: "0.55rem 0.75rem 0.55rem 2.5rem",
              borderRadius: "0.5rem",
              border: "1px solid #cbd5e1",
              fontSize: "0.875rem",
              outline: "none",
              color: selectedDate ? "#0f172a" : "#94a3b8"
            }}
          />
        </div>
      </div>

      {/* Tabel Data Absensi */}
      <div style={{ backgroundColor: "#ffffff", borderRadius: "0.75rem", border: "1px solid #e2e8f0", overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.875rem" }}>
            <thead>
              <tr style={{ backgroundColor: "#f8fafc", borderBottom: "1px solid #e2e8f0", color: "#475569" }}>
                <th style={{ padding: "0.85rem 1rem", fontWeight: "700" }}>Tanggal</th>
                <th style={{ padding: "0.85rem 1rem", fontWeight: "700" }}>Nama Siswa</th>
                <th style={{ padding: "0.85rem 1rem", fontWeight: "700" }}>Jam Masuk</th>
                <th style={{ padding: "0.85rem 1rem", fontWeight: "700" }}>Keterangan Absen Masuk</th>
                <th style={{ padding: "0.85rem 1rem", fontWeight: "700" }}>Jam Pulang</th>
                <th style={{ padding: "0.85rem 1rem", fontWeight: "700" }}>Keterangan Absen Pulang</th>
                <th style={{ padding: "0.85rem 1rem", fontWeight: "700" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredAbsensi.length > 0 ? (
                filteredAbsensi.map((row, idx) => (
                  <tr key={idx} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "0.85rem 1rem", color: "#334155" }}>{row.tanggal || "-"}</td>
                    <td style={{ padding: "0.85rem 1rem", fontWeight: "600", color: "#0f172a" }}>{row.namaSiswa || "-"}</td>
                    <td style={{ padding: "0.85rem 1rem", color: "#16a34a", fontWeight: "600" }}>{row.jamMasuk || "-"}</td>
                    <td style={{ padding: "0.85rem 1rem", color: "#64748b" }}>{row.ketMasuk || "-"}</td>
                    <td style={{ padding: "0.85rem 1rem", color: "#dc2626", fontWeight: "600" }}>{row.jamPulang || "-"}</td>
                    <td style={{ padding: "0.85rem 1rem", color: "#64748b" }}>{row.ketPulang || "-"}</td>
                    <td style={{ padding: "0.85rem 1rem" }}>
                      <span
                        style={{
                          backgroundColor: row.status === "Izin" ? "#fef3c7" : "#dcfce7",
                          color: row.status === "Izin" ? "#d97706" : "#15803d",
                          padding: "0.25rem 0.6rem",
                          borderRadius: "0.375rem",
                          fontSize: "0.75rem",
                          fontWeight: "700"
                        }}
                      >
                        {row.status || "Hadir"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ padding: "3rem 1rem", textAlign: "center", color: "#94a3b8" }}>
                    Tidak ada data absensi yang sesuai filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}