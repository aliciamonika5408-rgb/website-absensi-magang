import React, { useState, useEffect } from "react";
import { UserPlus, Edit, Trash2, Search, X, Check } from "lucide-react";
import { getStudents, addStudent, updateStudent, deleteStudent } from "../services/db";

export default function AdminDataSiswa() {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");

  // Form Fields (password removed, strictly uses PIN login)
  const [formData, setFormData] = useState({
    nama: "",
    pin: "",
    sekolah: "",
    tempatMagang: "PT. MULTI POWER ABADI",
    noHp: ""
  });

  const loadData = () => {
    setStudents(getStudents());
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
      pin: "",
      sekolah: "SMKN 1 Surabaya",
      tempatMagang: "PT. MULTI POWER ABADI",
      noHp: "081234567890"
    });
    setShowModal(true);
  };

  const handleOpenEditModal = (student) => {
    setEditingStudent(student);
    setFormData({
      nama: student.nama,
      pin: student.pin || "",
      sekolah: student.sekolah || "",
      tempatMagang: student.tempatMagang || "PT. MULTI POWER ABADI",
      noHp: student.noHp || ""
    });
    setShowModal(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.pin || formData.pin.trim().length < 4) {
      alert("PIN Login wajib diisi minimal 4-5 digit angka.");
      return;
    }

    if (editingStudent) {
      updateStudent({ id: editingStudent.id, ...formData });
      setSuccessMsg(`Data siswa "${formData.nama}" berhasil diperbarui.`);
    } else {
      addStudent(formData);
      setSuccessMsg(`Siswa baru "${formData.nama}" berhasil ditambahkan.`);
    }
    setShowModal(false);
    loadData();
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  const handleDelete = (student) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus siswa ${student.nama}?`)) {
      deleteStudent(student.id);
      setSuccessMsg(`Siswa "${student.nama}" telah dihapus.`);
      loadData();
      setTimeout(() => setSuccessMsg(""), 4000);
    }
  };

  const filteredStudents = students.filter(s =>
    s.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.sekolah.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.tempatMagang.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-fade-in" style={{ paddingBottom: "2rem" }}>
      {/* Header & Add Action */}
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "1rem", marginBottom: "1.5rem" }}>
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: "800", color: "#0f172a" }}>Data Siswa Magang</h1>
          <p style={{ fontSize: "0.875rem", color: "#64748b" }}>Kelola akun siswa dan PIN login presensi.</p>
        </div>

        <button
          onClick={handleOpenAddModal}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            backgroundColor: "#dc2626",
            color: "#ffffff",
            padding: "0.75rem 1.25rem",
            borderRadius: "0.75rem",
            fontWeight: "700",
            border: "none",
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(220, 38, 38, 0.25)"
          }}
        >
          <UserPlus size={18} /> Tambah Siswa
        </button>
      </div>

      {/* Success Notification Banner */}
      {successMsg && (
        <div
          style={{
            backgroundColor: "#ecfdf5",
            border: "1px solid #a7f3d0",
            color: "#047857",
            padding: "0.85rem 1.25rem",
            borderRadius: "0.85rem",
            fontSize: "0.9rem",
            fontWeight: "700",
            marginBottom: "1.25rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem"
          }}
        >
          <Check size={18} /> {successMsg}
        </div>
      )}

      {/* Search Input Bar */}
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "1rem",
          padding: "1rem",
          border: "1px solid #e2e8f0",
          marginBottom: "1.5rem"
        }}
      >
        <div style={{ position: "relative" }}>
          <Search size={18} color="#94a3b8" style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)" }} />
          <input
            type="text"
            placeholder="Cari nama siswa, sekolah, atau tempat magang..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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
      </div>

      {/* Main Student Data Table */}
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
                <th style={{ padding: "1rem 1.25rem", fontWeight: "700" }}>PIN LOGIN (5 DIGIT)</th>
                <th style={{ padding: "1rem 1.25rem", fontWeight: "700" }}>Sekolah</th>
                <th style={{ padding: "1rem 1.25rem", fontWeight: "700" }}>Tempat Magang</th>
                <th style={{ padding: "1rem 1.25rem", fontWeight: "700" }}>No HP</th>
                <th style={{ padding: "1rem 1.25rem", fontWeight: "700", textAlign: "center" }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length > 0 ? (
                filteredStudents.map(s => (
                  <tr key={s.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    {/* Nama & Foto */}
                    <td style={{ padding: "0.85rem 1.25rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <img
                          src={s.fotoProfil || "/default-avatar.svg"}
                          alt={s.nama}
                          style={{ width: "2.5rem", height: "2.5rem", borderRadius: "50%", objectFit: "cover" }}
                        />
                        <div>
                          <span style={{ fontWeight: "700", color: "#0f172a", display: "block" }}>{s.nama}</span>
                        </div>
                      </div>
                    </td>

                    {/* PIN Siswa */}
                    <td style={{ padding: "0.85rem 1.25rem" }}>
                      <span
                        style={{
                          backgroundColor: "#ecfdf5",
                          color: "#047857",
                          border: "1px solid #a7f3d0",
                          padding: "0.35rem 0.75rem",
                          borderRadius: "0.6rem",
                          fontSize: "0.9rem",
                          fontWeight: "800",
                          fontFamily: "monospace",
                          letterSpacing: "1px"
                        }}
                        title="PIN Akun Siswa untuk Login"
                      >
                        🔑 {s.pin || "12121"}
                      </span>
                    </td>

                    {/* Sekolah */}
                    <td style={{ padding: "0.85rem 1.25rem", color: "#334155", fontWeight: "600" }}>
                      {s.sekolah}
                    </td>

                    {/* Tempat Magang */}
                    <td style={{ padding: "0.85rem 1.25rem", color: "#334155", fontWeight: "600" }}>
                      {s.tempatMagang}
                    </td>

                    {/* No HP */}
                    <td style={{ padding: "0.85rem 1.25rem", color: "#334155", fontWeight: "600" }}>
                      {s.noHp || "-"}
                    </td>

                    {/* Action buttons */}
                    <td style={{ padding: "0.85rem 1.25rem" }}>
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
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center"
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
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center"
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
                  <td colSpan="6" style={{ padding: "2.5rem", textAlign: "center", color: "#94a3b8" }}>
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
            className="animate-fade-in"
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
                  🔑 PIN LOGIN (5 DIGIT) *
                </label>
                <input
                  type="text"
                  value={formData.pin}
                  onChange={(e) => setFormData({ ...formData, pin: e.target.value.replace(/[^0-9]/g, "") })}
                  required
                  maxLength={6}
                  placeholder="Masukkan 5 digit PIN login siswa..."
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
