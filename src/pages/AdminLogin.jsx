import React, { useState } from "react";
import { Lock, User, ShieldCheck, AlertCircle, ShieldAlert, ArrowLeft } from "lucide-react";
import { findUserByNameAndPassword } from "../services/db";

export default function AdminLogin({ onLoginSuccess, onBackToStudent }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleAdminSubmit = (e) => {
    e.preventDefault();
    setErrorMsg("");

    const admin = findUserByNameAndPassword(username, password);
    if (admin && admin.role === "admin") {
      onLoginSuccess(admin);
    } else {
      setErrorMsg("Kredensial Administrator tidak valid. Periksa username dan password.");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#0f172a",
        backgroundImage: "radial-gradient(#1e293b 1px, transparent 1px)",
        backgroundSize: "24px 24px",
        padding: "1.5rem",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        position: "relative"
      }}
    >
      {/* Back to Student Portal Link */}
      <button
        onClick={onBackToStudent}
        style={{
          position: "absolute",
          top: "1.75rem",
          left: "1.75rem",
          display: "inline-flex",
          alignItems: "center",
          gap: "0.5rem",
          backgroundColor: "rgba(255,255,255,0.08)",
          color: "#94a3b8",
          border: "1px solid rgba(255,255,255,0.12)",
          padding: "0.6rem 1.1rem",
          borderRadius: "0.75rem",
          fontSize: "0.85rem",
          fontWeight: "700",
          cursor: "pointer",
          transition: "all 0.2s"
        }}
      >
        <ArrowLeft size={16} /> Portal Siswa
      </button>

      {/* Admin Login Card Container */}
      <div
        className="animate-fade-in"
        style={{
          width: "100%",
          maxWidth: "420px",
          backgroundColor: "#1e293b",
          borderRadius: "1.5rem",
          padding: "2.5rem 2rem",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
          color: "#ffffff",
          textAlign: "center"
        }}
      >
        {/* Admin Icon Badge */}
        <div
          style={{
            width: "4.5rem",
            height: "4.5rem",
            backgroundColor: "#dc2626",
            borderRadius: "50%",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#ffffff",
            marginBottom: "1.25rem",
            boxShadow: "0 10px 25px -5px rgba(220, 38, 38, 0.4)"
          }}
        >
          <ShieldAlert size={40} strokeWidth={2} />
        </div>

        <h1 style={{ fontSize: "1.75rem", fontWeight: "800", letterSpacing: "-0.5px" }}>
          Portal Administrator
        </h1>
        <p style={{ fontSize: "0.875rem", color: "#94a3b8", marginTop: "4px", marginBottom: "1.75rem" }}>
          Sistem Monitoring & Pengelola Absensi Siswa Magang
        </p>

        {errorMsg && (
          <div
            style={{
              backgroundColor: "rgba(239, 68, 68, 0.15)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              color: "#fca5a5",
              padding: "0.75rem 1rem",
              borderRadius: "0.75rem",
              fontSize: "0.85rem",
              fontWeight: "600",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              marginBottom: "1.25rem",
              textAlign: "left"
            }}
          >
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleAdminSubmit} style={{ textAlign: "left" }}>
          {/* Username Input */}
          <div style={{ marginBottom: "1.25rem" }}>
            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "700", color: "#cbd5e1", marginBottom: "0.4rem" }}>
              Username Admin
            </label>
            <div style={{ position: "relative" }}>
              <User size={18} color="#64748b" style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)" }} />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan username admin"
                required
                style={{
                  width: "100%",
                  padding: "0.8rem 1rem 0.8rem 2.75rem",
                  borderRadius: "0.75rem",
                  border: "1px solid #334155",
                  backgroundColor: "#0f172a",
                  color: "#ffffff",
                  fontSize: "0.95rem",
                  fontWeight: "600",
                  outline: "none"
                }}
              />
            </div>
          </div>

          {/* Password Input */}
          <div style={{ marginBottom: "1.75rem" }}>
            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "700", color: "#cbd5e1", marginBottom: "0.4rem" }}>
              Password Admin
            </label>
            <div style={{ position: "relative" }}>
              <Lock size={18} color="#64748b" style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)" }} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{
                  width: "100%",
                  padding: "0.8rem 1rem 0.8rem 2.75rem",
                  borderRadius: "0.75rem",
                  border: "1px solid #334155",
                  backgroundColor: "#0f172a",
                  color: "#ffffff",
                  fontSize: "0.95rem",
                  fontWeight: "600",
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
              boxShadow: "0 4px 14px rgba(220, 38, 38, 0.4)",
              transition: "all 0.2s"
            }}
          >
            Masuk Portal Admin
          </button>
        </form>

        <div style={{ marginTop: "1.75rem", paddingTop: "1.25rem", borderTop: "1px solid rgba(255,255,255,0.08)", fontSize: "0.8rem", color: "#64748b", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem" }}>
          <ShieldCheck size={16} color="#dc2626" />
          <span>Akses Terenkripsi Pengelola PT. MULTI POWER ABADI</span>
        </div>
      </div>
    </div>
  );
}
