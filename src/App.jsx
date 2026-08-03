import React, { useState, useEffect } from "react";
import Login from "./pages/Login";
import AdminLogin from "./pages/AdminLogin";
import StudentDashboard from "./pages/StudentDashboard";
import AbsenMasuk from "./pages/AbsenMasuk";
import AbsenPulang from "./pages/AbsenPulang";
import RiwayatAbsensi from "./pages/RiwayatAbsensi";
import HalamanIzin from "./pages/HalamanIzin";
import ProfilSiswa from "./pages/ProfilSiswa";

import AdminDashboard from "./pages/AdminDashboard";
import AdminDataSiswa from "./pages/AdminDataSiswa";
import AdminDataAbsensi from "./pages/AdminDataAbsensi";
import AdminResetPassword from "./pages/AdminResetPassword";

import Header from "./components/Header";
import Sidebar from "./components/Sidebar";

import { getCurrentUser, setCurrentUser as saveSessionUser, initDB, fetchCloudDB } from "./services/db";

export default function App() {
  const [user, setUser] = useState(null);
  const [currentTab, setCurrentTab] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAdminPortalView, setIsAdminPortalView] = useState(false);

  useEffect(() => {
    initDB();
    const activeUser = getCurrentUser();
    if (activeUser) {
      setUser(activeUser);
      setCurrentTab(activeUser.role === "admin" ? "admin-dashboard" : "dashboard");
    }

    // Fetch initial Cloud DB & start 6-second realtime background sync across all laptops/devices
    fetchCloudDB().then(() => {
      const refreshedUser = getCurrentUser();
      if (refreshedUser) {
        setUser(refreshedUser);
      }
    });

    const interval = setInterval(() => {
      fetchCloudDB();
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  const handleLoginSuccess = (loggedInUser) => {
    setUser(loggedInUser);
    saveSessionUser(loggedInUser);
    setCurrentTab(loggedInUser.role === "admin" ? "admin-dashboard" : "dashboard");
  };

  const handleLogout = () => {
    setUser(null);
    saveSessionUser(null);
    setCurrentTab("");
    setIsAdminPortalView(false);
  };

  if (!user) {
    if (isAdminPortalView) {
      return (
        <AdminLogin
          onLoginSuccess={handleLoginSuccess}
          onBackToStudent={() => setIsAdminPortalView(false)}
        />
      );
    }
    return (
      <Login
        onLoginSuccess={handleLoginSuccess}
        onOpenAdminPortal={() => setIsAdminPortalView(true)}
      />
    );
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#f8fafc" }}>
      {/* Sidebar Navigation */}
      <Sidebar
        user={user}
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onLogout={handleLogout}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div
        className="main-layout"
        style={{
          flex: 1,
          marginLeft: "260px",
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
          transition: "margin-left 0.3s ease"
        }}
      >
        {/* Top Header */}
        <Header
          user={user}
          currentTab={currentTab}
          onLogout={handleLogout}
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />

        {/* Page Container */}
        <main style={{ flex: 1, padding: "1.5rem 2rem", maxWidth: "1280px", width: "100%", margin: "0 auto" }}>
          {/* Student Tabs */}
          {user.role === "siswa" && (
            <>
              {currentTab === "dashboard" && <StudentDashboard user={user} onNavigate={setCurrentTab} />}
              {currentTab === "absen-masuk" && <AbsenMasuk user={user} onNavigate={setCurrentTab} />}
              {currentTab === "absen-pulang" && <AbsenPulang user={user} onNavigate={setCurrentTab} />}
              {currentTab === "riwayat" && <RiwayatAbsensi user={user} />}
              {currentTab === "izin" && <HalamanIzin user={user} />}
              {currentTab === "profil" && (
                <ProfilSiswa
                  user={user}
                  onUpdateUser={(updatedUser) => {
                    setUser(updatedUser);
                    saveSessionUser(updatedUser);
                  }}
                />
              )}
            </>
          )}

          {/* Admin Tabs */}
          {user.role === "admin" && (
            <>
              {currentTab === "admin-dashboard" && <AdminDashboard />}
              {currentTab === "admin-siswa" && <AdminDataSiswa />}
              {currentTab === "admin-absensi" && <AdminDataAbsensi />}
              {currentTab === "admin-reset-password" && <AdminResetPassword />}
            </>
          )}
        </main>
      </div>

      {/* Responsive layout styles */}
      <style>{`
        @media (max-width: 1024px) {
          .main-layout {
            margin-left: 0 !important;
          }
          .sidebar-panel {
            transform: translateX(-100%);
          }
          .sidebar-panel.sidebar-open {
            transform: translateX(0) !important;
          }
          .mobile-toggle-btn {
            display: flex !important;
          }
        }
        @media (min-width: 1025px) {
          .mobile-toggle-btn, .mobile-close-btn, .mobile-backdrop {
            display: none !important;
          }
          .desktop-user-name {
            display: block !important;
          }
        }
      `}</style>
    </div>
  );
}
