import React, { useState } from "react";
import { Bell, Menu, User, LogOut, CheckCircle2, Clock } from "lucide-react";

export default function Header({ user, currentTab, onLogout, toggleSidebar }) {
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: 1, title: "Sistem Absensi Aktif", text: "Jangan lupa melakukan Absen Pulang tepat waktu.", time: "Baru saja", unread: true },
    { id: 2, title: "Status Absensi Hari Ini", text: "Silakan cek status absensi di Dashboard Anda.", time: "1 jam lalu", unread: false }
  ];

  return (
    <header
      style={{
        height: "4.5rem",
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #e2e8f0",
        padding: "0 1.5rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 30,
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.02)"
      }}
    >
      {/* Left Menu Toggle & Mobile Title */}
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <button
          onClick={toggleSidebar}
          style={{
            background: "none",
            border: "none",
            color: "#475569",
            cursor: "pointer",
            padding: "0.5rem",
            borderRadius: "0.5rem",
            display: "flex",
            alignItems: "center"
          }}
          className="mobile-toggle-btn"
          aria-label="Toggle Navigation"
        >
          <Menu size={24} />
        </button>

        <div>
          <h2 style={{ fontSize: "1.25rem", fontWeight: "700", color: "#0f172a" }}>
            Halo, {user?.nama || "Siswa"}
          </h2>
          <p style={{ fontSize: "0.8rem", color: "#64748b" }}>
            {user?.role === "admin" ? "Admin Administrator" : user?.sekolah || "Siswa Magang"}
          </p>
        </div>
      </div>

      {/* Right User Actions & Notifications */}
      <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
        {/* Notification Bell Icon */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            style={{
              position: "relative",
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              color: "#475569",
              padding: "0.6rem",
              borderRadius: "0.75rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s"
            }}
          >
            <Bell size={20} />
            <span
              style={{
                position: "absolute",
                top: "6px",
                right: "6px",
                width: "8px",
                height: "8px",
                backgroundColor: "#dc2626",
                borderRadius: "50%",
                boxShadow: "0 0 0 2px white"
              }}
            />
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div
              className="notification-dropdown"
              style={{
                position: "absolute",
                top: "3.2rem",
                right: 0,
                width: "320px",
                backgroundColor: "#ffffff",
                borderRadius: "1rem",
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                border: "1px solid #e2e8f0",
                padding: "1rem",
                zIndex: 50,
                animation: "fadeIn 0.2s ease"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem", paddingBottom: "0.5rem", borderBottom: "1px solid #f1f5f9" }}>
                <span style={{ fontWeight: "700", fontSize: "0.9rem", color: "#0f172a" }}>Notifikasi</span>
                <span style={{ fontSize: "0.75rem", color: "#dc2626", fontWeight: "600" }}>Tandai Dibaca</span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {notifications.map(n => (
                  <div
                    key={n.id}
                    style={{
                      padding: "0.65rem",
                      borderRadius: "0.5rem",
                      backgroundColor: n.unread ? "#fef2f2" : "#ffffff",
                      borderLeft: n.unread ? "3px solid #dc2626" : "1px solid #f1f5f9"
                    }}
                  >
                    <span style={{ fontWeight: "700", fontSize: "0.8rem", color: "#0f172a", display: "block" }}>{n.title}</span>
                    <span style={{ fontSize: "0.75rem", color: "#64748b", display: "block", marginTop: "2px" }}>{n.text}</span>
                    <span style={{ fontSize: "0.7rem", color: "#dc2626", fontWeight: "600", marginTop: "4px", display: "block" }}>{n.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Small Profile Avatar */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <img
            src={user?.fotoProfil || "/default-avatar.svg"}
            alt={user?.nama}
            style={{
              width: "2.5rem",
              height: "2.5rem",
              borderRadius: "50%",
              objectFit: "cover",
              border: "2px solid #fecaca"
            }}
          />
        </div>
      </div>
    </header>
  );
}
