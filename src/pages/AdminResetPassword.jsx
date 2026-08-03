import React, { useState, useEffect } from "react";
import { KeyRound, ShieldAlert, CheckCircle2, UserCheck } from "lucide-react";
import { getStudents, resetPassword } from "../services/db";

export default function AdminResetPassword() {
  const [students, setStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    const stds = getStudents();
    setStudents(stds);
    if (stds.length > 0) {
      setSelectedStudentId(stds[0].id);
    }
  }, []);

  const handleResetSubmit = (e) => {
    e.preventDefault();
    if (!selectedStudentId || !newPassword) return;

    const student = students.find(s => s.id === selectedStudentId);
    if (student) {
      resetPassword(selectedStudentId, newPassword);
      setSuccessMsg(`Password siswa "${student.nama}" telah berhasil direset menjadi "${newPassword}". Password baru sudah tersimpan permanen.`);
      setNewPassword("");
      setTimeout(() => setSuccessMsg(""), 6000);
    }
  };

  const selectedStudent = students.find(s => s.id === selectedStudentId);

  return (
    <div className="animate-fade-in" style={{ maxWidth: "600px", margin: "0 auto", paddingBottom: "2rem" }}>
      {/* Title */}
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: "800", color: "#0f172a" }}>Reset Password Siswa</h1>
        <p style={{ fontSize: "0.875rem", color: "#64748b" }}>
          Fitur khusus Admin untuk mereset password siswa yang lupa atau berhalangan masuk.
        </p>
      </div>

      {/* Main Card */}
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "1.5rem",
          padding: "2rem",
          border: "1px solid #e2e8f0",
          boxShadow: "0 10px 25px -5px rgba(37, 99, 235, 0.08)"
        }}
      >
        {successMsg && (
          <div
            style={{
              backgroundColor: "#ecfdf5",
              border: "1px solid #a7f3d0",
              color: "#047857",
              padding: "1rem",
              borderRadius: "1rem",
              fontSize: "0.9rem",
              fontWeight: "700",
              marginBottom: "1.5rem",
              display: "flex",
              alignItems: "flex-start",
              gap: "0.5rem"
            }}
          >
            <CheckCircle2 size={20} style={{ flexShrink: 0, marginTop: "2px" }} />
            <div>{successMsg}</div>
          </div>
        )}

        <form onSubmit={handleResetSubmit}>
          {/* Select Student Dropdown */}
          <div style={{ marginBottom: "1.25rem" }}>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "700", color: "#334155", marginBottom: "0.4rem" }}>
              Pilih Siswa Magang *
            </label>
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                borderRadius: "0.75rem",
                border: "1px solid #cbd5e1",
                fontSize: "0.95rem",
                fontWeight: "700",
                color: "#0f172a",
                outline: "none",
                backgroundColor: "#ffffff",
                cursor: "pointer"
              }}
            >
              {students.map(s => (
                <option key={s.id} value={s.id}>
                  {s.nama} ({s.sekolah})
                </option>
              ))}
            </select>
          </div>

          {/* Target Student Preview Box */}
          {selectedStudent && (
            <div
              style={{
                backgroundColor: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: "1rem",
                padding: "1rem",
                marginBottom: "1.25rem",
                display: "flex",
                alignItems: "center",
                gap: "1rem"
              }}
            >
              <img
                src={selectedStudent.fotoProfil || "/default-avatar.svg"}
                alt={selectedStudent.nama}
                style={{ width: "3rem", height: "3rem", borderRadius: "50%", objectFit: "cover" }}
              />
              <div>
                <span style={{ fontSize: "0.95rem", fontWeight: "800", color: "#0f172a", display: "block" }}>{selectedStudent.nama}</span>
                <span style={{ fontSize: "0.8rem", color: "#64748b" }}>{selectedStudent.sekolah} • {selectedStudent.tempatMagang}</span>
              </div>
            </div>
          )}

          {/* New Password Input */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "700", color: "#334155", marginBottom: "0.4rem" }}>
              Masukkan Password Baru *
            </label>
            <div style={{ position: "relative" }}>
              <KeyRound size={18} color="#94a3b8" style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)" }} />
              <input
                type="text"
                placeholder="Ketik password baru untuk siswa..."
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem 0.75rem 2.75rem",
                  borderRadius: "0.75rem",
                  border: "1px solid #cbd5e1",
                  fontSize: "0.95rem",
                  fontWeight: "700",
                  outline: "none"
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            style={{
              width: "100%",
              backgroundColor: "#dc2626",
              color: "#ffffff",
              fontSize: "1rem",
              fontWeight: "700",
              padding: "0.85rem",
              borderRadius: "0.75rem",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(220, 38, 38, 0.3)"
            }}
          >
            🔒 Simpan Reset Password
          </button>
        </form>
      </div>
    </div>
  );
}
