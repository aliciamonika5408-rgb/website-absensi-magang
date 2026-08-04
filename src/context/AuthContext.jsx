import React, { createContext, useContext, useState, useEffect } from 'react';

// Membuat Context
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Inisialisasi state dari sessionStorage agar login bertahan saat di-refresh (F5)
  const [user, setUser] = useState(() => {
    const savedUser = sessionStorage.getItem('authUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Fungsi Login: Menyimpan data ke state dan sessionStorage
  const login = (userData) => {
    setUser(userData);
    sessionStorage.setItem('authUser', JSON.stringify(userData));
  };

  // Fungsi Logout: Menghapus data dari state dan sessionStorage
  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('authUser');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook kustom agar komponen lain mudah mengakses AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};