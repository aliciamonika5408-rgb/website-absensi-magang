import React, { useState } from "react";
import { Lock, AlertCircle, CheckCircle2, ShieldCheck, ClipboardCheck, KeyRound, User, School, Phone, ArrowLeft, Shield } from "lucide-react";
import { findUserByPin, addStudent } from "../services/db";

export default function Login({ onLoginSuccess, onOpenAdminPortal }) {
  const [activeTab, setActiveTab] = useState("login"); // "login" | "register"

  // Student PIN Login State
  const [pin, setPin] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Student Registration Form State
  const [regNama, setRegNama] = useState("");
  const [regPin, setRegPin] = useState("");
  const [regSekolah, setRegSekolah] = useState("");
  const [regNoHp, setRegNoHp] = useState("");

  // Handle PIN input change (numeric only & max 6 digits)
  const handlePinChange = (e) => {
    const val = e.target.value.replace(/[^0-9]/g, "");
    if (val.length <= 6) {
      setPin(val);
      if (errorMsg) setErrorMsg("");
    }
  };

  // Handle Registration PIN input change
  const handleRegPinChange = (e) => {
    const val = e.target.value.replace(/[^0-9]/g, "");
    if (val.length <= 6) {
      setRegPin(val);
    }
  };

  // Student Login Submit Validation
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!pin) {
      setErrorMsg("PIN wajib diisi.");
      return;
    }

    if (pin.length < 4 || pin.length > 6) {
      setErrorMsg("PIN harus 4 sampai 6 digit angka.");
      return;
    }

    const foundUser = findUserByPin(pin);
    if (foundUser) {
      onLoginSuccess(foundUser);
    } else {
      setErrorMsg("PIN tidak ditemukan. Silakan periksa kembali.");
    }
  };

  // Registration Form Submit
  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!regNama.trim()) {
      setErrorMsg("Nama Lengkap wajib diisi.");
      return;
    }

    if (!regPin || regPin.length < 4 || regPin.length > 6) {
      setErrorMsg("PIN Pendaftaran harus 4 - 6 digit angka.");
      return;
    }

    const existing = findUserByPin(regPin);
    if (existing) {
      setErrorMsg("PIN tersebut sudah digunakan. Silakan gunakan PIN lain.");
      return;
    }

    const newStudent = addStudent({
      nama: regNama.trim(),
      pin: regPin,
      password: `pin-${regPin}`,
      sekolah: regSekolah.trim() || "SMKN 1 Jakarta",
      tempatMagang: "PT. MULTI POWER ABADI",
      pembimbing: "Bpk. Hendra Wijaya",
      waPembimbing: "6281234567890",
      noHp: regNoHp.trim() || "08123456789"
    });

    setSuccessMsg("Pendaftaran PIN berhasil! Silakan masuk dengan PIN Anda.");
    setPin(newStudent.pin);
    setActiveTab("login");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        backgroundColor: "#f8fafc",
        overflow: "hidden",
        position: "relative",
        fontFamily: "'Plus Jakarta Sans', sans-serif"
      }}
    >
      {/* Left Side: Red & White Hero Section */}
      <div
        className="login-left-hero"
        style={{
          flex: "1 1 45%",
          position: "relative",
          background: "linear-gradient(135deg, #991b1b 0%, #dc2626 50%, #b91c1c 100%)",
          color: "#ffffff",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "3rem",
          textAlign: "center",
          overflow: "hidden"
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url('https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=1200&auto=format&fit=crop&q=80')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.18,
            mixBlendMode: "overlay"
          }}
        />

        {/* Organic Wave Divider */}
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          style={{
            position: "absolute",
            top: 0,
            right: "-1px",
            bottom: 0,
            height: "100%",
            width: "120px",
            zIndex: 10,
            pointerEvents: "none"
          }}
        >
          <path
            d="M0,0 C30,20 70,30 50,60 C30,90 80,100 100,100 L100,0 Z"
            fill="#f8fafc"
          />
        </svg>

        <div style={{ position: "relative", zIndex: 12, maxWidth: "400px" }}>
          <div
            style={{
              width: "4.5rem",
              height: "4.5rem",
              backgroundColor: "#ffffff",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1.5rem auto",
              boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
              color: "#dc2626"
            }}
          >
            <ClipboardCheck size={42} strokeWidth={2.2} />
          </div>

          <h1 style={{ fontSize: "2.25rem", fontWeight: "800", letterSpacing: "-0.5px", marginBottom: "0.4rem" }}>
            Absensi Magang
          </h1>
          <p style={{ fontSize: "1.1rem", opacity: 0.95, fontWeight: "500" }}>
            PT. MULTI POWER ABADI
          </p>

          <div style={{ width: "80%", height: "1px", backgroundColor: "rgba(255,255,255,0.3)", margin: "1.5rem auto" }} />

          <p style={{ fontSize: "0.95rem", opacity: 0.9, lineHeight: 1.6 }}>
            Catat presensi harian siswa magang dengan cepat dan praktis.
          </p>
        </div>
      </div>

      {/* Right Side: Student Login Form Section */}
      <div
        style={{
          flex: "1 1 55%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "2.5rem 1.5rem",
          position: "relative",
          zIndex: 5
        }}
      >
        <div style={{ width: "100%", maxWidth: "420px", position: "relative", zIndex: 10 }}>
          
          {/* Top User Icon Circle */}
          <div style={{ textAlign: "center", marginBottom: "1.25rem" }}>
            <div
              style={{
                width: "4.25rem",
                height: "4.25rem",
                backgroundColor: "#fef2f2",
                borderRadius: "50%",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#dc2626",
                boxShadow: "0 4px 14px rgba(220, 38, 38, 0.15)"
              }}
            >
              <KeyRound size={38} strokeWidth={2} />
            </div>

            <h2 style={{ fontSize: "1.75rem", fontWeight: "800", color: "#0f172a", marginTop: "0.85rem", letterSpacing: "-0.5px" }}>
              {activeTab === "register" ? "Daftar PIN Siswa" : "Login Siswa"}
            </h2>
            <p style={{ fontSize: "0.9rem", color: "#64748b", marginTop: "4px" }}>
              {activeTab === "register" ? "Buat PIN untuk akun Anda" : "Masukkan PIN 5 digit Anda untuk masuk"}
            </p>
          </div>

          {/* White Card Box */}
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "1.25rem",
              padding: "2rem",
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.06), 0 8px 10px -6px rgba(0,0,0,0.04)",
              border: "1px solid #e2e8f0"
            }}
            className="animate-fade-in"
          >
            {/* Error Message */}
            {errorMsg && (
              <div
                style={{
                  backgroundColor: "#fef2f2",
                  border: "1px solid #fecaca",
                  color: "#dc2626",
                  padding: "0.75rem 1rem",
                  borderRadius: "0.75rem",
                  fontSize: "0.85rem",
                  fontWeight: "600",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  marginBottom: "1.25rem"
                }}
              >
                <AlertCircle size={18} style={{ flexShrink: 0 }} />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Success Message */}
            {successMsg && (
              <div
                style={{
                  backgroundColor: "#ecfdf5",
                  border: "1px solid #a7f3d0",
                  color: "#047857",
                  padding: "0.75rem 1rem",
                  borderRadius: "0.75rem",
                  fontSize: "0.85rem",
                  fontWeight: "600",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  marginBottom: "1.25rem"
                }}
              >
                <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
                <span>{successMsg}</span>
              </div>
            )}

            {activeTab === "login" ? (
              /* STUDENT LOGIN FORM USING PIN */
              <form onSubmit={handleLoginSubmit}>
                <div style={{ marginBottom: "1.5rem" }}>
                  <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "700", color: "#1e293b", marginBottom: "0.5rem" }}>
                    PIN Siswa
                  </label>
                  <div style={{ position: "relative" }}>
                    <Lock size={18} color="#94a3b8" style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)" }} />
                    <input
                      type="password"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={6}
                      value={pin}
                      onChange={handlePinChange}
                      placeholder="Contoh: 54321"
                      required
                      style={{
                        width: "100%",
                        padding: "0.85rem 1rem 0.85rem 2.75rem",
                        borderRadius: "0.75rem",
                        border: "1.5px solid #cbd5e1",
                        fontSize: "1.25rem",
                        letterSpacing: "4px",
                        fontWeight: "800",
                        color: "#0f172a",
                        outline: "none"
                      }}
                    />
                  </div>
                  <span style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "4px", display: "block" }}>
                    Masukkan PIN Anda.
                  </span>
                </div>

                <button
                  type="submit"
                  style={{
                    width: "100%",
                    background: "linear-gradient(180deg, #dc2626 0%, #b91c1c 100%)",
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
                  Masuk
                </button>

                <div style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.875rem", color: "#64748b" }}>
                  Belum memiliki PIN?{" "}
                  <button
                    type="button"
                    onClick={() => { setActiveTab("register"); setErrorMsg(""); }}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#dc2626",
                      fontWeight: "700",
                      cursor: "pointer",
                      textDecoration: "underline",
                      fontSize: "0.875rem",
                      padding: 0
                    }}
                  >
                    Daftar terlebih dahulu.
                  </button>
                </div>
              </form>
            ) : (
              /* STUDENT REGISTRATION FORM */
              <form onSubmit={handleRegisterSubmit}>
                <button
                  type="button"
                  onClick={() => { setActiveTab("login"); setErrorMsg(""); }}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.3rem",
                    background: "none",
                    border: "none",
                    color: "#64748b",
                    fontSize: "0.8rem",
                    fontWeight: "600",
                    cursor: "pointer",
                    marginBottom: "1rem"
                  }}
                >
                  <ArrowLeft size={16} /> Kembali ke Login
                </button>

                <div style={{ marginBottom: "1rem" }}>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "700", color: "#334155", marginBottom: "0.2rem" }}>
                    Nama Lengkap *
                  </label>
                  <div style={{ position: "relative" }}>
                    <User size={16} color="#94a3b8" style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)" }} />
                    <input
                      type="text"
                      value={regNama}
                      onChange={(e) => setRegNama(e.target.value)}
                      placeholder="Masukkan nama lengkap"
                      required
                      style={{ width: "100%", padding: "0.6rem 0.75rem 0.6rem 2.25rem", borderRadius: "0.5rem", border: "1px solid #cbd5e1", fontSize: "0.875rem" }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: "1rem" }}>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "700", color: "#334155", marginBottom: "0.2rem" }}>
                    Buat PIN (5 Digit) *
                  </label>
                  <div style={{ position: "relative" }}>
                    <KeyRound size={16} color="#94a3b8" style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)" }} />
                    <input
                      type="password"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={6}
                      value={regPin}
                      onChange={handleRegPinChange}
                      placeholder="Contoh: 54321"
                      required
                      style={{ width: "100%", padding: "0.6rem 0.75rem 0.6rem 2.25rem", borderRadius: "0.5rem", border: "1px solid #cbd5e1", fontSize: "0.95rem", letterSpacing: "4px", fontWeight: "700" }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: "1rem" }}>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "700", color: "#334155", marginBottom: "0.2rem" }}>
                    Sekolah / Perguruan Tinggi
                  </label>
                  <div style={{ position: "relative" }}>
                    <School size={16} color="#94a3b8" style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)" }} />
                    <input
                      type="text"
                      value={regSekolah}
                      onChange={(e) => setRegSekolah(e.target.value)}
                      placeholder="SMK / Universitas"
                      style={{ width: "100%", padding: "0.6rem 0.75rem 0.6rem 2.25rem", borderRadius: "0.5rem", border: "1px solid #cbd5e1", fontSize: "0.875rem" }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: "1.25rem" }}>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "700", color: "#334155", marginBottom: "0.2rem" }}>
                    Nomor Handphone
                  </label>
                  <div style={{ position: "relative" }}>
                    <Phone size={16} color="#94a3b8" style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)" }} />
                    <input
                      type="text"
                      value={regNoHp}
                      onChange={(e) => setRegNoHp(e.target.value)}
                      placeholder="081234567890"
                      style={{ width: "100%", padding: "0.6rem 0.75rem 0.6rem 2.25rem", borderRadius: "0.5rem", border: "1px solid #cbd5e1", fontSize: "0.875rem" }}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  style={{
                    width: "100%",
                    backgroundColor: "#10b981",
                    color: "#ffffff",
                    fontSize: "0.95rem",
                    fontWeight: "700",
                    padding: "0.75rem",
                    borderRadius: "0.6rem",
                    border: "none",
                    cursor: "pointer"
                  }}
                >
                  Daftar PIN Baru
                </button>
              </form>
            )}
          </div>

          {/* Footer with separate Admin link */}
          <div style={{ textAlign: "center", marginTop: "1.75rem" }}>
            <button
              onClick={onOpenAdminPortal}
              style={{
                background: "none",
                border: "none",
                color: "#64748b",
                fontSize: "0.8rem",
                fontWeight: "600",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.35rem"
              }}
            >
              <Shield size={14} color="#64748b" /> Akses Portal Khusus Admin
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .login-left-hero {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
