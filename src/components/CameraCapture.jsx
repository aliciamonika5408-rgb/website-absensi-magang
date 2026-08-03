import React, { useRef, useState, useEffect } from "react";
import { Camera, RefreshCw, CheckCircle, Upload, AlertCircle } from "lucide-react";

export default function CameraCapture({ onPhotoCaptured, title = "Absen Foto" }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [cameraError, setCameraError] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    setCameraError(null);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "user" },
        audio: false
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.warn("Webcam access error:", err);
      setCameraError("Kamera tidak dapat diakses atau tidak diizinkan. Silakan gunakan tombol simulasi foto di bawah.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const takePhoto = () => {
    setIsCapturing(true);
    setTimeout(() => {
      if (videoRef.current && canvasRef.current && !cameraError) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
        setPhoto(dataUrl);
        if (onPhotoCaptured) onPhotoCaptured(dataUrl);
      } else {
        // Fallback photo simulation if camera fails
        simulatePhoto();
      }
      setIsCapturing(false);
    }, 200);
  };

  const simulatePhoto = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 640;
    canvas.height = 480;
    const ctx = canvas.getContext("2d");
    
    // Draw stylish gradient avatar background
    const grad = ctx.createLinearGradient(0, 0, 640, 480);
    grad.addColorStop(0, "#2563EB");
    grad.addColorStop(1, "#1D4ED8");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 640, 480);

    // Draw camera circle and watermark
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 32px Plus Jakarta Sans, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("📷 ABSENSI MAGANG", 320, 200);

    ctx.font = "18px Plus Jakarta Sans, sans-serif";
    ctx.fillText(`Timestamp: ${new Date().toLocaleString("id-ID")}`, 320, 260);
    ctx.fillText("Verified Selfie Capture", 320, 300);

    const dataUrl = canvas.toDataURL("image/jpeg");
    setPhoto(dataUrl);
    if (onPhotoCaptured) onPhotoCaptured(dataUrl);
  };

  const retakePhoto = () => {
    setPhoto(null);
    if (onPhotoCaptured) onPhotoCaptured(null);
    startCamera();
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhoto(event.target.result);
        if (onPhotoCaptured) onPhotoCaptured(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
      {/* Hidden Canvas for capture */}
      <canvas ref={canvasRef} style={{ display: "none" }} />

      {!photo ? (
        <div style={{ width: "100%", maxWidth: "560px", position: "relative" }}>
          {/* Webcam Frame */}
          <div
            style={{
              position: "relative",
              width: "100%",
              aspectRatio: "4/3",
              backgroundColor: "#0f172a",
              borderRadius: "1.25rem",
              overflow: "hidden",
              border: "3px solid #fecaca",
              boxShadow: "0 10px 25px -5px rgba(220, 38, 38, 0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            {cameraError ? (
              <div style={{ textAlign: "center", padding: "1.5rem", color: "#ffffff" }}>
                <AlertCircle size={48} color="#f59e0b" style={{ marginBottom: "0.75rem" }} />
                <p style={{ fontSize: "0.95rem", opacity: 0.9, marginBottom: "1rem" }}>{cameraError}</p>
                <button
                  type="button"
                  onClick={simulatePhoto}
                  style={{
                    backgroundColor: "#dc2626",
                    color: "white",
                    border: "none",
                    padding: "0.6rem 1.25rem",
                    borderRadius: "0.5rem",
                    fontWeight: "600",
                    cursor: "pointer"
                  }}
                >
                  📸 Ambil Foto Simulasi
                </button>
              </div>
            ) : (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            )}

            {/* Overlay Guide Target */}
            {!cameraError && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  pointerEvents: "none",
                  border: "2px dashed rgba(255,255,255,0.4)",
                  margin: "1.5rem",
                  borderRadius: "1rem",
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "center",
                  paddingBottom: "1rem"
                }}
              >
                <span
                  style={{
                    backgroundColor: "rgba(15, 23, 42, 0.65)",
                    color: "#ffffff",
                    padding: "0.25rem 0.75rem",
                    borderRadius: "9999px",
                    fontSize: "0.8rem",
                    backdropFilter: "blur(4px)"
                  }}
                >
                  Posisikan Wajah di Tengah Frame
                </span>
              </div>
            )}
          </div>

          {/* Controls */}
          <div style={{ marginTop: "1.25rem", display: "flex", gap: "0.75rem", justifyContent: "center", width: "100%" }}>
            <button
              type="button"
              onClick={takePhoto}
              disabled={isCapturing}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                backgroundColor: "#dc2626",
                color: "#ffffff",
                fontSize: "1.05rem",
                fontWeight: "700",
                padding: "0.85rem 2rem",
                borderRadius: "1rem",
                border: "none",
                cursor: "pointer",
                boxShadow: "0 8px 20px rgba(37,99,235,0.3)",
                transition: "all 0.2s ease"
              }}
            >
              <Camera size={22} />
              {isCapturing ? "Mengambil Foto..." : "📷 Ambil Foto"}
            </button>

            <label
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                backgroundColor: "#f1f5f9",
                color: "#475569",
                fontSize: "0.9rem",
                fontWeight: "600",
                padding: "0.85rem 1.25rem",
                borderRadius: "1rem",
                border: "1px solid #e2e8f0",
                cursor: "pointer"
              }}
            >
              <Upload size={18} />
              Upload
              <input type="file" accept="image/*" onChange={handleFileUpload} style={{ display: "none" }} />
            </label>
          </div>
        </div>
      ) : (
        /* Preview Frame */
        <div style={{ width: "100%", maxWidth: "560px", animation: "fadeIn 0.3s ease" }}>
          <div
            style={{
              position: "relative",
              width: "100%",
              aspectRatio: "4/3",
              borderRadius: "1.25rem",
              overflow: "hidden",
              border: "3px solid #10b981",
              boxShadow: "0 10px 25px -5px rgba(16, 185, 129, 0.2)"
            }}
          >
            <img src={photo} alt="Preview Absen" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            <div
              style={{
                position: "absolute",
                top: "1rem",
                right: "1rem",
                backgroundColor: "#10b981",
                color: "white",
                padding: "0.35rem 0.85rem",
                borderRadius: "9999px",
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                fontSize: "0.85rem",
                fontWeight: "600",
                boxShadow: "0 4px 10px rgba(16, 185, 129, 0.4)"
              }}
            >
              <CheckCircle size={16} /> Foto Berhasil Diambil
            </div>
          </div>

          <div style={{ marginTop: "1rem", textAlign: "center" }}>
            <button
              type="button"
              onClick={retakePhoto}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                backgroundColor: "#ffffff",
                color: "#475569",
                border: "1px solid #cbd5e1",
                padding: "0.6rem 1.25rem",
                borderRadius: "0.75rem",
                fontSize: "0.9rem",
                fontWeight: "600",
                cursor: "pointer"
              }}
            >
              <RefreshCw size={16} /> Foto Ulang
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
