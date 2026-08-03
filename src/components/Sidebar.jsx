import React from "react";
import {
  LayoutDashboard,
  LogIn,
  LogOut as LogOutIcon,
  History,
  MessageSquare,
  User,
  Users,
  ClipboardList,
  KeyRound,
  ClipboardCheck,
  X
} from "lucide-react";

export default function Sidebar({ user, currentTab, setCurrentTab, onLogout, isOpen, onClose }) {
  const isStudent = user?.role === "siswa";

  const studentNavItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "absen-masuk", label: "Absen Masuk", icon: LogIn },
    { id: "absen-pulang", label: "Absen Pulang", icon: LogOutIcon },
    { id: "riwayat", label: "Riwayat Absensi", icon: History },
    { id: "izin", label: "Izin", icon: MessageSquare },
    { id: "profil", label: "User", icon: User }
  ];

  const adminNavItems = [
    { id: "admin-dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "admin-siswa", label: "Data Siswa", icon: Users },
    { id: "admin-absensi", label: "Data Absensi", icon: ClipboardList },
    { id: "admin-reset-password", label: "Reset Password", icon: KeyRound }
  ];

  const navItems = isStudent ? studentNavItems : adminNavItems;

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(15, 23, 42, 0.5)",
            backdropFilter: "blur(4px)",
            zIndex: 40
          }}
          className="mobile-backdrop"
        />
      )}

      {/* Sidebar Navigation Panel */}
      <aside
        className={`sidebar-panel ${isOpen ? "sidebar-open" : ""}`}
        style={{
          width: "260px",
          backgroundColor: "#ffffff",
          borderRight: "1px solid #e2e8f0",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          height: "100vh",
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 45,
          transition: "transform 0.3s ease"
        }}
      >
        <div>
          {/* Brand Header */}
          <div
            style={{
              height: "4.5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 1.5rem",
              borderBottom: "1px solid #e2e8f0"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <div
                style={{
                  width: "2.5rem",
                  height: "2.5rem",
                  backgroundColor: "#dc2626",
                  borderRadius: "0.75rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#ffffff",
                  boxShadow: "0 4px 10px rgba(220, 38, 38, 0.3)"
                }}
              >
                <ClipboardCheck size={22} />
              </div>
              <div>
                <h1 style={{ fontSize: "1.1rem", fontWeight: "800", color: "#dc2626", lineHeight: 1.2 }}>
                  Absensi Magang
                </h1>
                <span style={{ fontSize: "0.7rem", color: "#64748b", fontWeight: "600", letterSpacing: "0.5px" }}>
                  PORTAL {user?.role?.toUpperCase()}
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              style={{
                background: "none",
                border: "none",
                color: "#94a3b8",
                cursor: "pointer",
                padding: "0.25rem"
              }}
              className="mobile-close-btn"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav style={{ padding: "1.25rem 0.85rem", display: "flex", flexDirection: "column", gap: "0.35rem" }}>
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentTab(item.id);
                    if (onClose) onClose();
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.85rem",
                    width: "100%",
                    padding: "0.75rem 1rem",
                    borderRadius: "0.75rem",
                    border: "none",
                    backgroundColor: isActive ? "#dc2626" : "transparent",
                    color: isActive ? "#ffffff" : "#475569",
                    fontSize: "0.95rem",
                    fontWeight: isActive ? "700" : "600",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                    boxShadow: isActive ? "0 4px 12px rgba(220, 38, 38, 0.25)" : "none"
                  }}
                >
                  <Icon size={20} color={isActive ? "#ffffff" : "#64748b"} />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Logout Footer */}
        <div style={{ padding: "1.25rem 0.85rem", borderTop: "1px solid #e2e8f0" }}>
          <button
            onClick={onLogout}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.85rem",
              width: "100%",
              padding: "0.75rem 1rem",
              borderRadius: "0.75rem",
              border: "1px solid #fee2e2",
              backgroundColor: "#fef2f2",
              color: "#ef4444",
              fontSize: "0.95rem",
              fontWeight: "700",
              cursor: "pointer",
              transition: "all 0.15s ease"
            }}
          >
            <LogOutIcon size={20} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
