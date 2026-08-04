# Website Absensi Magang - PT. Multi Power Abadi

Aplikasi presensi (absensi masuk & pulang) berbasis lokasi GPS dan foto foto selfie untuk siswa magang PT. Multi Power Abadi. Dibuat menggunakan **React**, **Vite**, dan terhubung langsung ke **Supabase (PostgreSQL Cloud Database)**.

---

## 🚀 Fitur Utama

- 📍 **Validasi Absensi Berbasis GPS**: Menghitung jarak presisi ke lokasi kantor magang menggunakan rumus *Haversine* (Maksimal Radius: 200 meter).
- 📸 **Presensi Masuk & Pulang**: Tangkap foto selfie presensi dan catat jam masuk/pulang real-time.
- ⚡ **Supabase Integration**: Penyimpanan data siswa & riwayat absensi terhubung langsung ke Supabase Cloud secara real-time dengan fallback local cache (`localStorage`).
- 📊 **Dashboard Admin**: Pengelolaan data siswa magang, reset PIN, filter tanggal/siswa, dan **Export Laporan PDF** resmi.

---

## 🛠️ Teknologi & Dependensi

- **Frontend**: React 19, Vite
- **Database Cloud**: Supabase (PostgreSQL)
- **Icons**: Lucide React
- **Export PDF**: jsPDF & jsPDF-AutoTable
- **Styling**: Vanilla CSS / Inline Design System

---

## 📁 Struktur Direktori

```
├── public/                 # Aset statis & foto profil default
├── src/
│   ├── components/        # Komponen UI Reusable (Header, Sidebar, Camera, Guard)
│   ├── context/           # AuthContext untuk manajemen sesi login
│   ├── data/              # Record data awal (database.json)
│   ├── pages/             # Halaman utama (Login, Dashboard, Absensi, Admin)
│   └── services/
│       ├── db.js          # API Layer Data (Local Storage & Supabase Sync)
│       ├── locationService.js # Layanan GPS Geolocation & Rumus Jarak
│       └── supabase.js    # Client Inisialisasi Supabase SDK
├── .env                   # Kunci Rahasia Supabase (URL & Anon Key)
├── .env.example           # Contoh variabel lingkungan
├── supabase_schema.sql    # Skrip SQL DDL untuk Supabase SQL Editor
└── README.md
```

---

## ⚙️ Panduan Penggunaan & Instalasi

### 1. Install Dependensi
```bash
npm install
```

### 2. Konfigurasi Supabase Environment
Buat atau sesuaikan file `.env` di root proyek:
```env
VITE_SUPABASE_URL=https://lposgjfykvrfqrotbjcm.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_vRx7BGogVx0iE89ltN_ykA_jWMVWPuK
```

### 3. Migrasi Database Supabase
Buka **[Supabase Dashboard SQL Editor](https://supabase.com/dashboard/project/lposgjfykvrfqrotbjcm/sql/new)**, salin seluruh isi berkas `supabase_schema.sql`, lalu klik **Run** untuk membuat tabel `users`, `absensi`, dan `perusahaan`.

### 4. Jalankan Aplikasi di Lokal
```bash
npm run dev
```

### 5. Build untuk Produksi (Vercel)
```bash
npm run build
```
