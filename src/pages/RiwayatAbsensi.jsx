import React, { useState, useEffect } from "react";
import { Search, Filter, ChevronLeft, ChevronRight, History, Calendar, FileText } from "lucide-react";
import { getStudentAttendanceHistory } from "../services/db";

export default function RiwayatAbsensi({ user }) {
  const [history, setHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  useEffect(() => {
    const loadHistory = () => {
      const data = getStudentAttendanceHistory(user.id);
      setHistory(data);
    };

    loadHistory();

    window.addEventListener("attendance_updated", loadHistory);
    window.addEventListener("storage", loadHistory);

    return () => {
      window.removeEventListener("attendance_updated", loadHistory);
      window.removeEventListener("storage", loadHistory);
    };
  }, [user]);

  // List of months for filter dropdown
  const months = [
    { value: "all", label: "Semua Bulan" },
    { value: "01", label: "Januari" },
    { value: "02", label: "Februari" },
    { value: "03", label: "Maret" },
    { value: "04", label: "April" },
    { value: "05", label: "Mei" },
    { value: "06", label: "Juni" },
    { value: "07", label: "Juli" },
    { value: "08", label: "Agustus" },
    { value: "09", label: "September" },
    { value: "10", label: "Oktober" },
    { value: "11", label: "November" },
    { value: "12", label: "Desember" }
  ];

  // Filtering Logic
  const filteredData = history.filter(item => {
    // Search filter (date, status, or keterangan matching)
    const matchesSearch =
      item.tanggal.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.jamMasuk.includes(searchTerm) ||
      item.jamPulang.includes(searchTerm) ||
      (item.keterangan || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.keteranganPulang || "").toLowerCase().includes(searchTerm.toLowerCase());

    // Month filter
    let matchesMonth = true;
    if (selectedMonth !== "all") {
      const monthNum = item.tanggal.split("-")[1];
      matchesMonth = monthNum === selectedMonth;
    }

    return matchesSearch && matchesMonth;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const getStatusBadge = (status) => {
    switch (status) {
      case "Hadir":
        return (
          <span
            style={{
              backgroundColor: "#ecfdf5",
              color: "#047857",
              border: "1px solid #a7f3d0",
              padding: "0.35rem 0.85rem",
              borderRadius: "9999px",
              fontSize: "0.85rem",
              fontWeight: "700",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.35rem"
            }}
          >
            🟢 Hadir
          </span>
        );
      case "Izin":
        return (
          <span
            style={{
              backgroundColor: "#fffbeb",
              color: "#b45309",
              border: "1px solid #fde68a",
              padding: "0.35rem 0.85rem",
              borderRadius: "9999px",
              fontSize: "0.85rem",
              fontWeight: "700",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.35rem"
            }}
          >
            🟡 Izin
          </span>
        );
      case "Tidak Hadir":
      default:
        return (
          <span
            style={{
              backgroundColor: "#fef2f2",
              color: "#b91c1c",
              border: "1px solid #fecaca",
              padding: "0.35rem 0.85rem",
              borderRadius: "9999px",
              fontSize: "0.85rem",
              fontWeight: "700",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.35rem"
            }}
          >
            🔴 Tidak Hadir
          </span>
        );
    }
  };

  return (
    <div className="animate-fade-in" style={{ paddingBottom: "2rem" }}>
      {/* Header */}
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: "800", color: "#0f172a" }}>Riwayat Absensi</h1>
        <p style={{ fontSize: "0.875rem", color: "#64748b" }}>Catatan dan histori presensi magang Anda di PT. Multi Power Abadi.</p>
      </div>

      {/* Filter and Search Bar */}
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "1.25rem",
          padding: "1.25rem",
          border: "1px solid #e2e8f0",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.03)",
          marginBottom: "1.5rem",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem"
        }}
      >
        {/* Search Input */}
        <div style={{ position: "relative", minWidth: "240px", flex: 1 }}>
          <Search size={18} color="#94a3b8" style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)" }} />
          <input
            type="text"
            placeholder="Cari tanggal, jam, atau catatan..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            style={{
              width: "100%",
              padding: "0.65rem 1rem 0.65rem 2.65rem",
              borderRadius: "0.75rem",
              border: "1px solid #cbd5e1",
              fontSize: "0.9rem",
              outline: "none"
            }}
          />
        </div>

        {/* Filter Month Dropdown */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Filter size={18} color="#64748b" />
          <select
            value={selectedMonth}
            onChange={(e) => { setSelectedMonth(e.target.value); setCurrentPage(1); }}
            style={{
              padding: "0.65rem 1rem",
              borderRadius: "0.75rem",
              border: "1px solid #cbd5e1",
              fontSize: "0.9rem",
              color: "#334155",
              fontWeight: "600",
              outline: "none",
              backgroundColor: "#ffffff",
              cursor: "pointer"
            }}
          >
            {months.map(m => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Attendance History Table */}
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
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.9rem" }}>
            <thead>
              <tr style={{ backgroundColor: "#f8fafc", borderBottom: "1px solid #e2e8f0", color: "#475569" }}>
                <th style={{ padding: "1rem 1.25rem", fontWeight: "700" }}>Tanggal</th>
                <th style={{ padding: "1rem 1.25rem", fontWeight: "700" }}>Jam Masuk</th>
                <th style={{ padding: "1rem 1.25rem", fontWeight: "700" }}>Jam Pulang</th>
                <th style={{ padding: "1rem 1.25rem", fontWeight: "700" }}>Catatan / Keterangan</th>
                <th style={{ padding: "1rem 1.25rem", fontWeight: "700" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length > 0 ? (
                paginatedData.map((item, idx) => (
                  <tr
                    key={item.id || idx}
                    style={{
                      borderBottom: "1px solid #f1f5f9",
                      transition: "background-color 0.15s"
                    }}
                  >
                    <td style={{ padding: "1rem 1.25rem", fontWeight: "700", color: "#0f172a" }}>
                      {new Date(item.tanggal).toLocaleDateString("id-ID", {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                        year: "numeric"
                      })}
                    </td>
                    <td style={{ padding: "1rem 1.25rem", color: "#10b981", fontFamily: "monospace", fontWeight: "700" }}>
                      {item.jamMasuk !== "-" ? `${item.jamMasuk} WIB` : "-"}
                    </td>
                    <td style={{ padding: "1rem 1.25rem", color: "#dc2626", fontFamily: "monospace", fontWeight: "700" }}>
                      {item.jamPulang !== "-" ? `${item.jamPulang} WIB` : "-"}
                    </td>
                    <td style={{ padding: "1rem 1.25rem", color: "#334155", maxWidth: "250px" }}>
                      <span style={{ fontWeight: "600", display: "block" }}>
                        {item.keterangan || item.keteranganPulang || "-"}
                      </span>
                    </td>
                    <td style={{ padding: "1rem 1.25rem" }}>
                      {getStatusBadge(item.status)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ padding: "3rem", textAlign: "center", color: "#94a3b8" }}>
                    <History size={40} style={{ opacity: 0.5, marginBottom: "0.5rem" }} />
                    <p style={{ fontWeight: "600" }}>Tidak ada riwayat absensi ditemukan.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer Controls */}
        <div
          style={{
            padding: "1rem 1.25rem",
            borderTop: "1px solid #e2e8f0",
            backgroundColor: "#f8fafc",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1rem"
          }}
        >
          <span style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: "600" }}>
            Menampilkan {filteredData.length > 0 ? startIndex + 1 : 0} - {Math.min(startIndex + itemsPerPage, filteredData.length)} dari {filteredData.length} data
          </span>

          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              style={{
                backgroundColor: "#ffffff",
                border: "1px solid #cbd5e1",
                borderRadius: "0.5rem",
                padding: "0.4rem 0.75rem",
                cursor: currentPage === 1 ? "not-allowed" : "pointer",
                opacity: currentPage === 1 ? 0.5 : 1,
                display: "flex",
                alignItems: "center"
              }}
            >
              <ChevronLeft size={18} />
            </button>

            <span style={{ fontSize: "0.85rem", fontWeight: "700", color: "#0f172a" }}>
              Halaman {currentPage} dari {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              style={{
                backgroundColor: "#ffffff",
                border: "1px solid #cbd5e1",
                borderRadius: "0.5rem",
                padding: "0.4rem 0.75rem",
                cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                opacity: currentPage === totalPages ? 0.5 : 1,
                display: "flex",
                alignItems: "center"
              }}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
