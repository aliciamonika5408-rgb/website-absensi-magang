import React, { useState, useEffect } from "react";
import { Search, UserPlus, Edit, Trash2, X, Key, Phone, Building } from "lucide-react";
import { getStudents, addStudent, updateStudent, deleteStudent } from "../services/db";

export default function AdminDataSiswa() {
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  const [formData, setFormData] = useState({
    nama: "",
    pin: "",
    sekolah: "",
    tempatMagang: "PT. MULTI POWER ABADI",
    noHp: ""
  });

  const loadData = () => {
    const data = getStudents() || [];
    setStudents(data);
  };

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener("users_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("users_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const handleOpenAddModal = () => {
    setEditingStudent(null);
    setFormData({
      nama: "",
      pin: Math.floor(10000 + Math.random() * 90000).toString(),
      sekolah: "",
      tempatMagang: "PT. MULTI POWER ABADI",
      noHp: ""
    });
    setShowModal(true);
  };

  const handleOpenEditModal = (student) => {
    setEditingStudent(student);
    setFormData({
      nama: student.nama || "",
      pin: student.pin || "",
      sekolah: student.sekolah || "",
      tempatMagang: student.tempatMagang || "PT. MULTI POWER ABADI",
      noHp: student.noHp || ""
    });
    setShowModal(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.nama.trim() || !formData.pin.trim()) {
      alert("Nama dan PIN wajib diisi!");
      return;
    }

    if (editingStudent) {
      updateStudent({
        id: editingStudent.id,
        ...formData
      });
    } else {
      addStudent(formData);
    }

    setShowModal(false);
    loadData();
  };

  const handleDelete = (student) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus data siswa "${student.nama}"?`)) {
      deleteStudent(student.id);
      loadData();
    }
  };

  const filteredStudents = students.filter((s) => {
    const query = searchQuery.toLowerCase();
    return (
      (s.nama && s.nama.toLowerCase().includes(query)) ||
      (s.pin && s.pin.includes(query)) ||
      (s.sekolah && s.sekolah.toLowerCase().includes(query)) ||
      (s.noHp && s.noHp.includes(query))
    );
  });

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* Header Halaman */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: "800", color: "#0f172a" }}>
            Data Siswa Magang
          </h1>
          <p style={{ fontSize: "0.875rem", color: "#64748b", marginTop: "4px" }}>
            Kelola daftar siswa magang, PIN login, sekolah instansi, dan informasi kontak.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            backgroundColor: "#dc2626",
            color: "#ffffff",
            border: "none",
            padding: "0.65rem 1.25rem",
            borderRadius: "0.5rem",
            fontSize: "0.875rem",
            fontWeight: "700",
            cursor: "pointer",
            boxShadow: "0 2px 4px rgba(220, 38, 38, 0.2)",
            transition: "all 0.2s"
          }}
        >
          <UserPlus size={18} /> Tambah Siswa Baru
        </button>
      </div>

      {/* Filter Bar / Search */}
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "0.75rem",
          padding: "1rem",
          border: "1px solid #e2e8f0",
          marginBottom: "1.5rem"
        }}
      >
        <div style={{ position: "relative", maxWidth: "400px" }}>
          <Search size={18} color="#94a3b8" style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)" }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama, PIN, atau asal sekolah..."
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
      </div>

      {/* Tabel Data Siswa */}
      <div style={{ backgroundColor: "#ffffff", borderRadius: "0.75rem", border: "1px solid #e2e8f0", overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.875rem" }}>
            <thead>
              <tr style={{ backgroundColor: "#f8fafc", borderBottom: "1px solid #e2e8f0", color: "#475569" }}>
                <th style={{ padding: "0.85rem 1rem", fontWeight: "700" }}>Siswa Magang</th>
                <th style={{ padding: "0.85rem 1rem", fontWeight: "700" }}>PIN Login</th>
                <th style={{ padding: "0.85rem 1rem", fontWeight: "700" }}>Asal Sekolah / Instansi</th>
                <th style={{ padding: "0.85rem 1rem", fontWeight: "700" }}>Tempat Magang</th>
                <th style={{ padding: "0.85rem 1rem", fontWeight: "700" }}>No. HP / WhatsApp</th>
                <th style={{ padding: "0.85rem 1rem", fontWeight: "700", textAlign: "center" }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length > 0 ? (
                filteredStudents.map((s) => (
                  <tr key={s.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "0.85rem 1rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <img
                          src={s.fotoProfil || "/default-avatar.png"}
                          alt={s.nama}
                          onError={(e) => { e.target.src = "/default-avatar.png"; }}
                          style={{ width: "38px", height: "38px", borderRadius: "50%", objectFit: "cover", border: "1px solid #cbd5e1" }}
                        />
                        <div>
                          <div style={{ fontWeight: "700", color: "#0f172a" }}>{s.nama}</div>
                          <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>ID: {s.id}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "0.85rem 1rem" }}>
                      <span
                        style={{
                          backgroundColor: "#f0fdf4",
                          color: "#166534",
                          border: "1px solid #bbf7d0",
                          padding: "0.2rem 0.5rem",
                          borderRadius: "0.375rem",
                          fontWeight: "800",
                          fontFamily: "monospace",
                          fontSize: "0.85rem"
                        }}
                      >
                        🔑 {s.pin}
                      </span>
                    </td>
                    <td style={{ padding: "0.85rem 1rem", color: "#334155", fontWeight: "500" }}>
                      {s.sekolah || "-"}
                    </td>
                    <td style={{ padding: "0.85rem 1rem", color: "#334155", fontWeight: "600" }}>
                      {s.tempatMagang || "PT. MULTI POWER ABADI"}
                    </td>
                    <td style={{ padding: "0.85rem 1rem", color: "#334155" }}>
                      {s.noHp || "-"}
                    </td>
                    <td style={{ padding: "0.85rem 1rem" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem" }}>
                        <button
                          onClick={() => handleOpenEditModal(s)}
                          title="Edit Data Siswa & PIN"
                          style={{
                            backgroundColor: "#eff6ff",
                            color: "#2563eb",
                            border: "1px solid #bfdbfe",
                            padding: "0.4rem 0.6rem",
                            borderRadius: "0.5rem",
                            cursor: "pointer"
                          }}
                        >
                          <Edit size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(s)}
                          title="Hapus Siswa"
                          style={{
                            backgroundColor: "#fef2f2",
                            color: "#ef4444",
                            border: "1px solid #fecaca",
                            padding: "0.4rem 0.6rem",
                            borderRadius: "0.5rem",
                            cursor: "pointer"
                          }}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ padding: "3rem 1rem", textAlign: "center", color: "#94a3b8" }}>
                    Tidak ada siswa ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Student Modal */}
      {showModal && (
        <div
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
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "1.5rem",
              width: "100%",
              maxWidth: "480px",
              padding: "1.75rem",
              boxShadow: "0 20px 30px -10px rgba(0, 0, 0, 0.2)",
              border: "1px solid #e2e8f0"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
              <h3 style={{ fontSize: "1.25rem", fontWeight: "800", color: "#0f172a" }}>
                {editingStudent ? "Edit Data Siswa" : "Tambah Siswa Magang"}
              </h3>
              <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer" }}>
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit}>
              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "700", color: "#334155", marginBottom: "0.2rem" }}>
                  Nama Lengkap Siswa *
                </label>
                <input
                  type="text"
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  required
                  placeholder="Masukkan nama lengkap siswa..."
                  style={{ width: "100%", padding: "0.65rem 0.85rem", borderRadius: "0.5rem", border: "1px solid #cbd5e1", fontSize: "0.85rem" }}
                />
              </div>

              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "700", color: "#dc2626", marginBottom: "0.2rem" }}>
                  🔑 PIN LOGIN (5-6 DIGIT) *
                </label>
                <input
                  type="text"
                  value={formData.pin}
                  onChange={(e) => setFormData({ ...formData, pin: e.target.value.replace(/[^0-9]/g, "") })}
                  required
                  maxLength={6}
                  placeholder="Masukkan PIN login siswa..."
                  style={{ width: "100%", padding: "0.65rem 0.85rem", borderRadius: "0.5rem", border: "1.5px solid #a7f3d0", fontSize: "0.95rem", fontFamily: "monospace", fontWeight: "800", backgroundColor: "#ecfdf5", color: "#047857" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "700", color: "#334155", marginBottom: "0.2rem" }}>
                    Sekolah / Instansi
                  </label>
                  <input
                    type="text"
                    value={formData.sekolah}
                    onChange={(e) => setFormData({ ...formData, sekolah: e.target.value })}
                    placeholder="SMKN 2 SURABAYA..."
                    style={{ width: "100%", padding: "0.6rem 0.85rem", borderRadius: "0.5rem", border: "1px solid #cbd5e1", fontSize: "0.85rem" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "700", color: "#334155", marginBottom: "0.2rem" }}>
                    Tempat Magang
                  </label>
                  <input
                    type="text"
                    value={formData.tempatMagang}
                    onChange={(e) => setFormData({ ...formData, tempatMagang: e.target.value })}
                    style={{ width: "100%", padding: "0.6rem 0.85rem", borderRadius: "0.5rem", border: "1px solid #cbd5e1", fontSize: "0.85rem" }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "700", color: "#334155", marginBottom: "0.2rem" }}>
                  Nomor Handphone Siswa
                </label>
                <input
                  type="text"
                  value={formData.noHp}
                  onChange={(e) => setFormData({ ...formData, noHp: e.target.value })}
                  placeholder="081234567890"
                  style={{ width: "100%", padding: "0.6rem 0.85rem", borderRadius: "0.5rem", border: "1px solid #cbd5e1", fontSize: "0.85rem" }}
                />
              </div>

              <button
                type="submit"
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
                {editingStudent ? "Simpan Perubahan" : "Simpan Siswa"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}