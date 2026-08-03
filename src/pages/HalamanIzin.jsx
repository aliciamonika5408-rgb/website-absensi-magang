import React from "react";
import { MessageSquare, Phone } from "lucide-react";

export default function HalamanIzin({ user }) {
  const targetWaNumber = "6288996838093";
  const displayWaNumber = "+62 889-9683-8093";

  const messageText = encodeURIComponent(
    `Halo, saya ${user?.nama || "Siswa Magang"} dari ${user?.sekolah || "Sekolah"}. Mohon izin tidak dapat hadir kegiatan magang hari ini dikarenakan [sebutkan alasan]. Terima kasih.`
  );

  const waUrl = `https://wa.me/${targetWaNumber}?text=${messageText}`;

  return (
    <div className="animate-fade-in" style={{ maxWidth: "600px", margin: "0 auto", paddingBottom: "2rem" }}>
      {/* Title */}
      <div style={{ marginBottom: "1.5rem", textAlign: "center" }}>
        <h1 style={{ fontSize: "1.75rem", fontWeight: "800", color: "#0f172a" }}>Izin Tidak Hadir</h1>
        <p style={{ fontSize: "0.95rem", color: "#64748b", marginTop: "4px" }}>
          Informasi dan prosedur pengajuan izin siswa magang.
        </p>
      </div>

      {/* Main Info Card */}
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "1.5rem",
          padding: "2.5rem 2rem",
          border: "1px solid #e2e8f0",
          boxShadow: "0 10px 25px -5px rgba(37, 99, 235, 0.08)",
          textAlign: "center"
        }}
      >
        <div
          style={{
            width: "5rem",
            height: "5rem",
            backgroundColor: "#ecfdf5",
            borderRadius: "1.25rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 1.5rem auto",
            color: "#10b981",
            boxShadow: "0 8px 20px rgba(16, 185, 129, 0.2)"
          }}
        >
          <MessageSquare size={44} />
        </div>

        {/* Informational Message */}
        <h2 style={{ fontSize: "1.25rem", fontWeight: "700", color: "#0f172a", marginBottom: "0.75rem" }}>
          Prosedur Pengajuan Izin
        </h2>

        <p
          style={{
            fontSize: "1.05rem",
            color: "#334155",
            lineHeight: 1.6,
            marginBottom: "2rem",
            backgroundColor: "#f8fafc",
            padding: "1.25rem",
            borderRadius: "1rem",
            border: "1px solid #f1f5f9",
            fontWeight: "500"
          }}
        >
          "Jika berhalangan hadir, silakan menghubungi kontak WhatsApp berikut."
        </p>

        {/* Phone Contact Info Box */}
        <div
          style={{
            backgroundColor: "#ecfdf5",
            border: "1px solid #a7f3d0",
            borderRadius: "1rem",
            padding: "1rem 1.25rem",
            marginBottom: "2rem",
            textAlign: "left",
            display: "flex",
            alignItems: "center",
            gap: "1rem"
          }}
        >
          <div style={{ backgroundColor: "#10b981", color: "#ffffff", padding: "0.6rem", borderRadius: "0.75rem" }}>
            <Phone size={24} />
          </div>
          <div>
            <span style={{ fontSize: "0.75rem", color: "#047857", fontWeight: "700", display: "block" }}>NOMOR KONTAK IZIN</span>
            <span style={{ fontSize: "1.15rem", fontWeight: "800", color: "#0f172a" }}>{displayWaNumber}</span>
          </div>
        </div>

        {/* Prominent Green WhatsApp Button */}
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.75rem",
            width: "100%",
            backgroundColor: "#25D366", // WhatsApp Green
            color: "#ffffff",
            fontSize: "1.1rem",
            fontWeight: "800",
            padding: "1.1rem 1.5rem",
            borderRadius: "1rem",
            textDecoration: "none",
            boxShadow: "0 10px 25px -5px rgba(37, 211, 102, 0.4)",
            transition: "transform 0.2s ease"
          }}
          className="card-modern-hover"
        >
          <MessageSquare size={24} /> 💬 Hubungi {displayWaNumber} via WhatsApp
        </a>
      </div>
    </div>
  );
}
