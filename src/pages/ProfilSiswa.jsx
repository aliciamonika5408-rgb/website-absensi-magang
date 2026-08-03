import React, { useState } from "react";
import { User, School, Building2, Phone, ShieldAlert, Edit3, X, CheckCircle2, Camera } from "lucide-react";
import { updateStudent } from "../services/db";

export default function ProfilSiswa({ user, onUpdateUser }) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [sekolahInput, setSekolahInput] = useState(user?.sekolah || "SMKN 1 Jakarta");
  const [tempatMagangInput, setTempatMagangInput] = useState(user?.tempatMagang || "PT. MULTI POWER ABADI");
  const [noHpInput, setNoHpInput] = useState(user?.noHp || "081298765432");
  const [fotoProfilInput, setFotoProfilInput] = useState(user?.fotoProfil || "");
  const [successMsg, setSuccessMsg] = useState("");

  const handleOpenModal = () => {
    setSekolahInput(user?.sekolah || "");
    setTempatMagangInput(user?.tempatMagang || "");
    setNoHpInput(user?.noHp || "");
    setFotoProfilInput(user?.fotoProfil || "");
    setShowEditModal(true);
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target.result;
        setFotoProfilInput(dataUrl);
        
        // Save immediately to DB & active session
        const updatedData = { ...user, fotoProfil: dataUrl };
        const saved = updateStudent(updatedData);
        if (saved && onUpdateUser) {
          onUpdateUser(saved);
        }
        setSuccessMsg("Foto profil berhasil diperbarui!");
        setTimeout(() => setSuccessMsg(""), 4000);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    const updatedData = {
      ...user,
      sekolah: sekolahInput.trim(),
      tempatMagang: tempatMagangInput.trim(),
      noHp: noHpInput.trim(),
      fotoProfil: fotoProfilInput || user?.fotoProfil
    };

    const saved = updateStudent(updatedData);
    if (saved && onUpdateUser) {
      onUpdateUser(saved);
    }

    setSuccessMsg("Informasi akun pengguna berhasil diperbarui!");
    setShowEditModal(false);
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: "700px", margin: "0 auto", paddingBottom: "2rem" }}>
      {/* Title Header */}
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: "800", color: "#0f172a" }}>User</h1>
        <p style={{ fontSize: "0.875rem", color: "#64748b" }}>Detail data diri dan informasi akun pengguna Anda.</p>
      </div>

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
          <CheckCircle2 size={18} /> {successMsg}
        </div>
      )}

      {/* Main Profile Card */}
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "1.5rem",
          padding: "2rem",
          border: "1px solid #e2e8f0",
          boxShadow: "0 10px 25px -5px rgba(37, 99, 235, 0.08)",
          position: "relative"
        }}
      >
        {/* Edit Button at Top Right */}
        <button
          onClick={handleOpenModal}
          style={{
            position: "absolute",
            top: "1.75rem",
            right: "1.75rem",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            backgroundColor: "#fef2f2",
            color: "#dc2626",
            border: "1px solid #fecaca",
            padding: "0.5rem 0.9rem",
            borderRadius: "0.75rem",
            fontSize: "0.85rem",
            fontWeight: "700",
            cursor: "pointer",
            transition: "all 0.2s"
          }}
        >
          <Edit3 size={16} /> Edit Profil
        </button>

        {/* Top Profile Header with Interactive Photo Change */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: "1.25rem",
            paddingBottom: "1.75rem",
            borderBottom: "1px solid #e2e8f0",
            marginBottom: "1.75rem"
          }}
        >
          {/* Avatar with Camera Change Trigger */}
          <label style={{ position: "relative", cursor: "pointer", display: "inline-block", flexShrink: 0 }} title="Klik untuk ubah foto profil">
            <img
              src={user?.fotoProfil || "/default-avatar.svg"}
              alt={user?.nama}
              style={{
                width: "5.5rem",
                height: "5.5rem",
                borderRadius: "50%",
                objectFit: "cover",
                border: "4px solid #fecaca",
                boxShadow: "0 4px 14px rgba(220, 38, 38, 0.2)"
              }}
            />
            {/* Camera Overlay Badge */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                right: 0,
                backgroundColor: "#dc2626",
                color: "#ffffff",
                padding: "0.4rem",
                borderRadius: "50%",
                border: "2px solid #ffffff",
                boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <Camera size={14} />
            </div>
            <input type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: "none" }} />
          </label>

          <div style={{ flex: 1, minWidth: "200px" }}>
            <span
              style={{
                backgroundColor: "#fef2f2",
                color: "#dc2626",
                fontSize: "0.75rem",
                fontWeight: "700",
                padding: "0.25rem 0.75rem",
                borderRadius: "9999px",
                display: "inline-block",
                marginBottom: "0.4rem"
              }}
            >
              AKUN USER MAGANG
            </span>
            <h2 style={{ fontSize: "1.4rem", fontWeight: "800", color: "#0f172a" }}>{user?.nama}</h2>
            <p style={{ fontSize: "0.9rem", color: "#dc2626", fontWeight: "700" }}>{user?.sekolah || "Belum diisi"}</p>
          </div>
        </div>

        {/* Profile Attributes List */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1.25rem" }}>
          {/* Nama */}
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{ backgroundColor: "#fef2f2", color: "#dc2626", padding: "0.75rem", borderRadius: "0.75rem" }}>
              <User size={20} />
            </div>
            <div>
              <span style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: "600", display: "block" }}>Nama Lengkap</span>
              <span style={{ fontSize: "1rem", fontWeight: "700", color: "#0f172a" }}>{user?.nama}</span>
            </div>
          </div>

          {/* Sekolah / Perguruan Tinggi */}
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{ backgroundColor: "#fef2f2", color: "#dc2626", padding: "0.75rem", borderRadius: "0.75rem" }}>
              <School size={20} />
            </div>
            <div>
              <span style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: "600", display: "block" }}>Sekolah / Perguruan Tinggi / Universitas</span>
              <span style={{ fontSize: "1.05rem", fontWeight: "800", color: "#dc2626" }}>{user?.sekolah || "Klik Edit untuk mengisi"}</span>
            </div>
          </div>

          {/* Tempat Magang */}
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{ backgroundColor: "#fef2f2", color: "#dc2626", padding: "0.75rem", borderRadius: "0.75rem" }}>
              <Building2 size={20} />
            </div>
            <div>
              <span style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: "600", display: "block" }}>Tempat Magang</span>
              <span style={{ fontSize: "1rem", fontWeight: "700", color: "#0f172a" }}>{user?.tempatMagang || "-"}</span>
            </div>
          </div>

          {/* Nomor HP */}
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{ backgroundColor: "#fef2f2", color: "#dc2626", padding: "0.75rem", borderRadius: "0.75rem" }}>
              <Phone size={20} />
            </div>
            <div>
              <span style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: "600", display: "block" }}>Nomor Handphone</span>
              <span style={{ fontSize: "1rem", fontWeight: "700", color: "#0f172a" }}>{user?.noHp || "-"}</span>
            </div>
          </div>
        </div>

        {/* Security Password Info Box */}
        <div
          style={{
            marginTop: "2rem",
            backgroundColor: "#fffbeb",
            border: "1px solid #fde68a",
            borderRadius: "1rem",
            padding: "1.25rem",
            display: "flex",
            alignItems: "flex-start",
            gap: "0.85rem"
          }}
        >
          <ShieldAlert size={22} color="#b45309" style={{ flexShrink: 0, marginTop: "2px" }} />
          <div>
            <h4 style={{ fontSize: "0.9rem", fontWeight: "700", color: "#b45309" }}>Keamanan Akun & Password</h4>
            <p style={{ fontSize: "0.825rem", color: "#78350f", marginTop: "4px", lineHeight: 1.4 }}>
              Password disembunyikan demi keamanan data Anda. Jika lupa password, hubungi Admin untuk melakukan reset.
            </p>
          </div>
        </div>
      </div>

      {/* Modal Dialog for User Profile Editing */}
      {showEditModal && (
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
              maxWidth: "460px",
              padding: "1.75rem",
              boxShadow: "0 20px 30px -10px rgba(0,0,0,0.2)",
              border: "1px solid #e2e8f0"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
              <h3 style={{ fontSize: "1.25rem", fontWeight: "800", color: "#0f172a" }}>Edit Profile User</h3>
              <button onClick={() => setShowEditModal(false)} style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer" }}>
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleSaveProfile}>
              {/* Upload Foto Section */}
              <div style={{ marginBottom: "1.25rem", textAlign: "center" }}>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "700", color: "#334155", marginBottom: "0.5rem" }}>
                  Foto Profil
                </label>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem" }}>
                  <img
                    src={fotoProfilInput || user?.fotoProfil || "/default-avatar.svg"}
                    alt="Preview"
                    style={{ width: "4rem", height: "4rem", borderRadius: "50%", objectFit: "cover", border: "2px solid #fecaca" }}
                  />
                  <label
                    style={{
                      backgroundColor: "#fef2f2",
                      color: "#dc2626",
                      border: "1px solid #fecaca",
                      padding: "0.5rem 1rem",
                      borderRadius: "0.5rem",
                      fontSize: "0.85rem",
                      fontWeight: "700",
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.4rem"
                    }}
                  >
                    <Camera size={16} /> Pilih Foto Baru
                    <input type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: "none" }} />
                  </label>
                </div>
              </div>

              {/* Input Sekolah / Perguruan Tinggi / Universitas */}
              <div style={{ marginBottom: "1.25rem" }}>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "700", color: "#334155", marginBottom: "0.4rem" }}>
                  Sekolah / Perguruan Tinggi / Universitas *
                </label>
                <input
                  type="text"
                  value={sekolahInput}
                  onChange={(e) => setSekolahInput(e.target.value)}
                  placeholder="SMKN 1 Jakarta / Universitas Indonesia"
                  required
                  style={{
                    width: "100%",
                    padding: "0.75rem 1rem",
                    borderRadius: "0.75rem",
                    border: "1px solid #cbd5e1",
                    fontSize: "0.95rem",
                    fontWeight: "600",
                    outline: "none"
                  }}
                />
              </div>

              {/* Input Tempat Magang */}
              <div style={{ marginBottom: "1.25rem" }}>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "700", color: "#334155", marginBottom: "0.4rem" }}>
                  Tempat Magang
                </label>
                <input
                  type="text"
                  value={tempatMagangInput}
                  onChange={(e) => setTempatMagangInput(e.target.value)}
                  placeholder="Nama tempat magang"
                  style={{
                    width: "100%",
                    padding: "0.75rem 1rem",
                    borderRadius: "0.75rem",
                    border: "1px solid #cbd5e1",
                    fontSize: "0.9rem",
                    outline: "none"
                  }}
                />
              </div>

              {/* Input Nomor HP */}
              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "700", color: "#334155", marginBottom: "0.4rem" }}>
                  Nomor Handphone
                </label>
                <input
                  type="text"
                  value={noHpInput}
                  onChange={(e) => setNoHpInput(e.target.value)}
                  placeholder="081234567890"
                  style={{
                    width: "100%",
                    padding: "0.75rem 1rem",
                    borderRadius: "0.75rem",
                    border: "1px solid #cbd5e1",
                    fontSize: "0.9rem",
                    outline: "none"
                  }}
                />
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
                Simpan Perubahan
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
