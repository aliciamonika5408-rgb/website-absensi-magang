import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  Send,
  CheckCircle2,
  ArrowLeft,
  MapPin,
  AlertTriangle,
  RefreshCw,
  Compass,
  FileText,
  Check
} from "lucide-react";
import { submitAbsenMasuk, getTodayAttendance } from "../services/db";
import { getCurrentGPSLocation, validateLocationRadius, TARGET_LOCATION } from "../services/locationService";
import confetti from "canvas-confetti";

export default function AbsenMasuk({ user, onNavigate }) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [keterangan, setKeterangan] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [todayRecord, setTodayRecord] = useState(null);

  // GPS Location State
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);

  const fetchLocation = async () => {
    setIsLoadingLocation(true);
    setLocationError(null);
    try {
      const gps = await getCurrentGPSLocation();
      const validation = validateLocationRadius(gps.lat, gps.lng);
      setLocation({
        lat: gps.lat,
        lng: gps.lng,
        ...validation
      });
    } catch (err) {
      setLocationError("Aktifkan GPS dan izinkan akses lokasi untuk melakukan absensi.");
      setLocation(null);
    } finally {
      setIsLoadingLocation(false);
    }
  };

  useEffect(() => {
    const record = getTodayAttendance(user.id);
    if (record && record.jamMasuk && record.jamMasuk !== "-") {
      setTodayRecord(record);
    }

    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    fetchLocation();

    return () => clearInterval(timer);
  }, [user]);

  const setSimulatedLocation = (inRadius = true) => {
    setIsLoadingLocation(true);
    setTimeout(() => {
      const mockLat = inRadius ? TARGET_LOCATION.lat : TARGET_LOCATION.lat + 0.005; // 0.005 deg ~ 550m
      const mockLng = inRadius ? TARGET_LOCATION.lng : TARGET_LOCATION.lng + 0.005;
      const validation = validateLocationRadius(mockLat, mockLng);
      setLocation({
        lat: mockLat,
        lng: mockLng,
        ...validation
      });
      setLocationError(null);
      setIsLoadingLocation(false);
    }, 400);
  };

  const dateStr = currentTime.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  const timeStr = currentTime.toLocaleTimeString("id-ID", { hour12: false }) + " WIB";

  // Form is valid ONLY IF location exists, inside radius, no location error, not loading, AND keterangan is filled
  const isFormValid =
    location &&
    location.isWithinRadius &&
    !locationError &&
    !isLoadingLocation &&
    keterangan.trim().length > 0;

  const handleKirimAbsensi = () => {
    if (!isFormValid) return;
    const record = submitAbsenMasuk(user, keterangan, location);
    setTodayRecord(record);
    setIsSubmitted(true);

    try {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    } catch (e) {
      console.log(e);
    }
  };

  const activeRecord = todayRecord || (isSubmitted ? getTodayAttendance(user.id) : null);

  return (
    <div className="animate-fade-in" style={{ maxWidth: "700px", margin: "0 auto", paddingBottom: "2rem" }}>
      {/* Header Back & Title */}
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
        <button
          onClick={() => onNavigate("dashboard")}
          style={{
            backgroundColor: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "0.75rem",
            padding: "0.6rem",
            cursor: "pointer",
            color: "#475569",
            display: "flex",
            alignItems: "center"
          }}
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: "800", color: "#0f172a" }}>Halaman Absen Masuk</h1>
          <p style={{ fontSize: "0.875rem", color: "#64748b" }}>Isi keterangan & verifikasi lokasi GPS Anda untuk melakukan presensi masuk.</p>
        </div>
      </div>

      {/* Main Card */}
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "1.5rem",
          padding: "2rem",
          border: "1px solid #e2e8f0",
          boxShadow: "0 10px 25px -5px rgba(220, 38, 38, 0.08)"
        }}
      >
        {isSubmitted || (todayRecord && todayRecord.jamMasuk && todayRecord.jamMasuk !== "-") ? (
          <div style={{ textAlign: "center", padding: "1.5rem 0.5rem" }}>
            <div
              style={{
                width: "5rem",
                height: "5rem",
                backgroundColor: "#ecfdf5",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1.25rem auto",
                color: "#10b981"
              }}
            >
              <CheckCircle2 size={48} />
            </div>
            <h2 style={{ fontSize: "1.5rem", fontWeight: "800", color: "#0f172a" }}>Absensi Masuk Berhasil!</h2>
            <p style={{ fontSize: "0.95rem", color: "#64748b", marginTop: "0.5rem" }}>
              Terima kasih, <strong>{user.nama}</strong>. Data absensi & lokasi GPS Anda telah tersimpan ke database.
            </p>

            <div
              style={{
                backgroundColor: "#f8fafc",
                borderRadius: "1rem",
                padding: "1.25rem",
                marginTop: "1.5rem",
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1.25rem",
                textAlign: "left",
                border: "1px solid #e2e8f0"
              }}
            >
              <div>
                <span style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: "600", display: "block" }}>NAMA SISWA</span>
                <p style={{ fontSize: "0.95rem", fontWeight: "700", color: "#0f172a", marginTop: "2px" }}>{user.nama}</p>
              </div>
              <div>
                <span style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: "600", display: "block" }}>STATUS</span>
                <span style={{ fontSize: "0.85rem", fontWeight: "700", color: "#047857", backgroundColor: "#ecfdf5", padding: "0.2rem 0.6rem", borderRadius: "9999px", border: "1px solid #a7f3d0", display: "inline-block", marginTop: "2px" }}>
                  🟢 Hadir
                </span>
              </div>
              <div>
                <span style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: "600", display: "block" }}>TANGGAL</span>
                <p style={{ fontSize: "0.95rem", fontWeight: "700", color: "#0f172a", marginTop: "2px" }}>{dateStr}</p>
              </div>
              <div>
                <span style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: "600", display: "block" }}>JAM MASUK</span>
                <p style={{ fontSize: "0.95rem", fontWeight: "800", color: "#10b981", marginTop: "2px" }}>
                  {activeRecord?.jamMasuk || timeStr}
                </p>
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <span style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: "600", display: "block" }}>KETERANGAN ABSENSI</span>
                <p style={{ fontSize: "0.9rem", fontWeight: "600", color: "#334155", backgroundColor: "#ffffff", padding: "0.6rem 0.8rem", borderRadius: "0.5rem", border: "1px solid #e2e8f0", marginTop: "4px" }}>
                  {activeRecord?.keterangan || keterangan || "-"}
                </p>
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <span style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: "600", display: "block" }}>LOKASI ABSENSI</span>
                <p style={{ fontSize: "0.85rem", fontWeight: "700", color: "#0f172a", marginTop: "2px" }}>
                  Jl. Gn. Anyar Tambak IV No.50, Gn. Anyar Tambak, Kec. Gn. Anyar, Surabaya, Jawa Timur 60294
                </p>
              </div>
            </div>

            <div style={{ marginTop: "2rem" }}>
              <button
                onClick={() => onNavigate("dashboard")}
                style={{
                  backgroundColor: "#dc2626",
                  color: "#ffffff",
                  padding: "0.75rem 2rem",
                  borderRadius: "0.75rem",
                  fontWeight: "700",
                  border: "none",
                  cursor: "pointer"
                }}
              >
                Kembali ke Dashboard
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Tanggal & Jam Automatic Display */}
            <div
              style={{
                backgroundColor: "#f8fafc",
                borderRadius: "1rem",
                padding: "1.25rem",
                border: "1px solid #e2e8f0",
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
                marginBottom: "1.5rem"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <div style={{ backgroundColor: "#fef2f2", padding: "0.6rem", borderRadius: "0.75rem", color: "#dc2626" }}>
                  <Calendar size={20} />
                </div>
                <div>
                  <span style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: "600", display: "block" }}>📅 Tanggal (otomatis)</span>
                  <span style={{ fontSize: "0.95rem", fontWeight: "700", color: "#0f172a" }}>{dateStr}</span>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <div style={{ backgroundColor: "#ecfdf5", padding: "0.6rem", borderRadius: "0.75rem", color: "#10b981" }}>
                  <Clock size={20} />
                </div>
                <div>
                  <span style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: "600", display: "block" }}>🕒 Jam (otomatis)</span>
                  <span style={{ fontSize: "1rem", fontWeight: "800", color: "#10b981", fontFamily: "monospace" }}>{timeStr}</span>
                </div>
              </div>
            </div>

            {/* GPS Location Validation Card */}
            <div
              style={{
                backgroundColor: "#f8fafc",
                borderRadius: "1.25rem",
                padding: "1.25rem",
                border: "1px solid #e2e8f0",
                marginBottom: "1.5rem"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <MapPin size={20} color="#dc2626" />
                  <span style={{ fontWeight: "800", fontSize: "0.95rem", color: "#0f172a" }}>Lokasi saat ini (GPS)</span>
                </div>
                <button
                  type="button"
                  onClick={fetchLocation}
                  disabled={isLoadingLocation}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.3rem",
                    background: "none",
                    border: "none",
                    color: "#dc2626",
                    fontWeight: "700",
                    fontSize: "0.8rem",
                    cursor: "pointer"
                  }}
                >
                  <RefreshCw size={14} className={isLoadingLocation ? "animate-spin" : ""} /> Refresh GPS
                </button>
              </div>

              <div style={{ fontSize: "0.85rem", color: "#475569", marginBottom: "1rem", backgroundColor: "#ffffff", padding: "0.75rem", borderRadius: "0.75rem", border: "1px solid #e2e8f0" }}>
                <span style={{ fontWeight: "700", color: "#0f172a", display: "block" }}>📍 Alamat tempat magang:</span>
                <span style={{ fontWeight: "700", color: "#dc2626" }}>PT. Multi Power Abadi</span>
                <p style={{ marginTop: "2px", color: "#64748b", fontSize: "0.8rem" }}>
                  Jl. Gn. Anyar Tambak IV No.50, Gn. Anyar Tambak, Kec. Gn. Anyar, Surabaya, Jawa Timur 60294.
                </p>
              </div>

              {/* Status Box */}
              {isLoadingLocation ? (
                <div style={{ padding: "0.85rem", backgroundColor: "#ffffff", borderRadius: "0.75rem", border: "1px solid #cbd5e1", textAlign: "center", fontSize: "0.85rem", color: "#64748b" }}>
                  ⏳ Mengambil titik koordinat GPS lokasi Anda...
                </div>
              ) : locationError ? (
                <div style={{ padding: "0.85rem", backgroundColor: "#fef2f2", border: "1px solid #fecaca", borderRadius: "0.75rem", color: "#dc2626", fontSize: "0.85rem", fontWeight: "600", display: "flex", alignItems: "flex-start", gap: "0.5rem" }}>
                  <AlertTriangle size={18} style={{ flexShrink: 0, marginTop: "2px" }} />
                  <div>
                    <span>Aktifkan GPS dan izinkan akses lokasi untuk melakukan absensi.</span>
                  </div>
                </div>
              ) : location ? (
                <div>
                  <div
                    style={{
                      padding: "0.85rem",
                      backgroundColor: location.isWithinRadius ? "#ecfdf5" : "#fef2f2",
                      border: `1px solid ${location.isWithinRadius ? "#a7f3d0" : "#fecaca"}`,
                      borderRadius: "0.75rem",
                      color: location.isWithinRadius ? "#047857" : "#dc2626",
                      fontSize: "0.875rem",
                      fontWeight: "700",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <Compass size={18} />
                      <span>
                        {location.isWithinRadius
                          ? `🟢 Di Area Magang (${location.distanceMeters}m dari lokasi)`
                          : `🔴 Di Luar Area Magang (${location.distanceMeters}m dari lokasi)`}
                      </span>
                    </div>
                    <span style={{ fontSize: "0.75rem", opacity: 0.8 }}>Maks: 100m</span>
                  </div>

                  {!location.isWithinRadius && (
                    <div style={{ marginTop: "0.75rem", padding: "0.85rem", backgroundColor: "#fef2f2", borderRadius: "0.75rem", border: "1px solid #fecaca", color: "#b91c1c", fontSize: "0.85rem", fontWeight: "600", display: "flex", alignItems: "flex-start", gap: "0.5rem" }}>
                      <AlertTriangle size={18} style={{ flexShrink: 0, marginTop: "2px" }} />
                      <div>
                        Anda berada di luar area PT. Multi Power Abadi. Silakan masuk ke area perusahaan untuk melakukan absensi.
                      </div>
                    </div>
                  )}

                  <div style={{ marginTop: "0.5rem", fontSize: "0.75rem", color: "#64748b", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span>Latitude: {location.lat.toFixed(6)} | Longitude: {location.lng.toFixed(6)}</span>
                    <a
                      href={`https://www.google.com/maps?q=${location.lat},${location.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "#dc2626", fontWeight: "700", textDecoration: "underline" }}
                    >
                      Buka Google Maps
                    </a>
                  </div>
                </div>
              ) : null}

              {/* Demo Mode Toggle for desktop testing */}
              <div style={{ marginTop: "1rem", paddingTop: "0.75rem", borderTop: "1px dashed #cbd5e1", display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "center" }}>
                <span style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: "600", width: "100%" }}>Uji Coba Simulator GPS:</span>
                <button
                  type="button"
                  onClick={() => setSimulatedLocation(true)}
                  style={{
                    backgroundColor: "#ecfdf5",
                    color: "#047857",
                    border: "1px solid #a7f3d0",
                    padding: "0.35rem 0.75rem",
                    borderRadius: "0.5rem",
                    fontSize: "0.75rem",
                    fontWeight: "700",
                    cursor: "pointer"
                  }}
                >
                  🎯 Set Dalam Radius (0m)
                </button>
                <button
                  type="button"
                  onClick={() => setSimulatedLocation(false)}
                  style={{
                    backgroundColor: "#fef2f2",
                    color: "#dc2626",
                    border: "1px solid #fecaca",
                    padding: "0.35rem 0.75rem",
                    borderRadius: "0.5rem",
                    fontSize: "0.75rem",
                    fontWeight: "700",
                    cursor: "pointer"
                  }}
                >
                  📍 Set Luar Radius (550m)
                </button>
              </div>
            </div>

            {/* Input Kolom Catatan / Keterangan Absensi */}
            <div style={{ marginBottom: "1.5rem" }}>
              <label
                htmlFor="keterangan-absensi"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  fontSize: "0.9rem",
                  fontWeight: "700",
                  color: "#0f172a",
                  marginBottom: "0.5rem"
                }}
              >
                <FileText size={18} color="#dc2626" />
                Catatan / Keterangan Absensi <span style={{ color: "#dc2626" }}>*</span>
              </label>
              <textarea
                id="keterangan-absensi"
                rows={3}
                value={keterangan}
                onChange={(e) => setKeterangan(e.target.value)}
                placeholder="Masukkan keterangan absensi..."
                style={{
                  width: "100%",
                  padding: "0.85rem 1rem",
                  borderRadius: "0.75rem",
                  border: "1.5px solid #cbd5e1",
                  fontSize: "0.95rem",
                  color: "#0f172a",
                  outline: "none",
                  transition: "border-color 0.2s ease, box-shadow 0.2s ease",
                  boxSizing: "border-box",
                  fontFamily: "inherit",
                  resize: "vertical"
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#dc2626";
                  e.target.style.boxShadow = "0 0 0 3px rgba(220, 38, 38, 0.15)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#cbd5e1";
                  e.target.style.boxShadow = "none";
                }}
              />
              {!keterangan.trim() && (
                <span style={{ fontSize: "0.75rem", color: "#dc2626", marginTop: "0.3rem", display: "block" }}>
                  * Keterangan absensi wajib diisi sebelum mengirim.
                </span>
              )}
            </div>

            {/* Submit Button */}
            <button
              onClick={handleKirimAbsensi}
              disabled={!isFormValid}
              style={{
                width: "100%",
                backgroundColor: isFormValid ? "#10b981" : "#cbd5e1",
                color: isFormValid ? "#ffffff" : "#64748b",
                fontSize: "1.05rem",
                fontWeight: "800",
                padding: "1rem",
                borderRadius: "1rem",
                border: "none",
                cursor: isFormValid ? "pointer" : "not-allowed",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.6rem",
                boxShadow: isFormValid ? "0 8px 20px rgba(16, 185, 129, 0.3)" : "none",
                opacity: isFormValid ? 1 : 0.7,
                transition: "all 0.2s ease"
              }}
            >
              <Check size={20} /> ✅ Kirim Absensi
            </button>
          </>
        )}
      </div>
    </div>
  );
}
