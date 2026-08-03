// Location & GPS Service for PT. MULTI POWER ABADI Attendance System

export const TARGET_LOCATION = {
  name: "PT. MULTI POWER ABADI",
  address: "Jl. Gn. Anyar Tambak IV No.50, Gn. Anyar Tambak, Kec. Gn. Anyar, Surabaya, Jawa Timur 60294",
  lat: -7.344001,
  lng: 112.804846,
  maxRadiusMeters: 200
};

/**
 * Calculates distance in meters between two GPS coordinates using Haversine formula
 */
export const calculateDistanceMeters = (lat1, lon1, lat2, lon2) => {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 0;
  const R = 6371000; // Earth radius in meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
};

/**
 * Get device GPS coordinates via Browser Geolocation API
 */
export const getCurrentGPSLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject({
        code: "UNSUPPORTED",
        message: "Browser Anda tidak mendukung layanan Geolocation GPS."
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy
        });
      },
      (error) => {
        let errorMsg = "Aktifkan GPS dan izinkan akses lokasi untuk melakukan absensi.";
        reject({
          code: error.code,
          message: errorMsg
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0
      }
    );
  });
};

/**
 * Validates whether GPS coordinates are within 100m radius of target internship location
 */
export const validateLocationRadius = (userLat, userLng) => {
  const distance = calculateDistanceMeters(
    userLat,
    userLng,
    TARGET_LOCATION.lat,
    TARGET_LOCATION.lng
  );

  const isWithinRadius = distance <= TARGET_LOCATION.maxRadiusMeters;

  return {
    isWithinRadius,
    distanceMeters: distance,
    maxRadiusMeters: TARGET_LOCATION.maxRadiusMeters,
    statusText: isWithinRadius ? "Di Area Magang" : "Di Luar Area Magang"
  };
};
