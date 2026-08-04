-- =========================================================
-- SQL Schema Migration untuk Supabase (PostgreSQL)
-- Web Absensi Magang PT. Multi Power Abadi
-- =========================================================

-- 1. Tabel Perusahaan
CREATE TABLE IF NOT EXISTS perusahaan (
  id SERIAL PRIMARY KEY,
  nama_perusahaan VARCHAR(150) NOT NULL,
  alamat TEXT NOT NULL,
  latitude NUMERIC(10,8) NOT NULL,
  longitude NUMERIC(11,8) NOT NULL,
  radius_max_meters INT NOT NULL DEFAULT 200,
  no_wa_pembimbing VARCHAR(20) NOT NULL
);

INSERT INTO perusahaan (id, nama_perusahaan, alamat, latitude, longitude, radius_max_meters, no_wa_pembimbing)
VALUES (1, 'PT. MULTI POWER ABADI', 'Jl. Gn. Anyar Tambak IV No.50, Gn. Anyar Tambak, Kec. Gn. Anyar, Surabaya, Jawa Timur 60294', -7.34400100, 112.80484600, 200, '6288996838093')
ON CONFLICT (id) DO NOTHING;

-- 2. Tabel Users (Admin & Siswa Magang)
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(50) PRIMARY KEY,
  nama VARCHAR(150) NOT NULL,
  pin VARCHAR(10) UNIQUE NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'siswa',
  sekolah VARCHAR(150),
  tempat_magang VARCHAR(150) DEFAULT 'PT. MULTI POWER ABADI',
  no_hp VARCHAR(20),
  foto_profil VARCHAR(255) DEFAULT '/default-avatar.png',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed Data Pengguna Awal
INSERT INTO users (id, nama, pin, role, sekolah, tempat_magang, no_hp, foto_profil) VALUES
('admin-1', 'Admin', '999999', 'admin', 'Pusat Pengelola Magang', 'Administrator System', '081100001111', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80'),
('std-1', 'Alicia Monica', '12121', 'siswa', 'SMKN 2 SURABAYA', 'PT. MULTI POWER ABADI', '085955595369', '/alicia-profile.jpg'),
('std-2', 'Aisyah Yuanita', '15049', 'siswa', 'SMKN 2 SURABAYA', 'PT. MULTI POWER ABADI', '085882487732', '/aisyah-profile.png'),
('std-3', 'Rizky (Kiki)', '13015', 'siswa', 'Institut Teknologi Sepuluh Nopember', 'PT. MULTI POWER ABADI', '081337466129', '/default-avatar.png'),
('std-4', 'Glen', '09087', 'siswa', 'STIE IBMT', 'PT. MULTI POWER ABADI', '088228350129', '/default-avatar.png'),
('std-5', 'Muhammad davin Nararya tsaqif', '01010', 'siswa', 'SMK Telkom Malang', 'PT. MULTI POWER ABADI', '082183485393', '/default-avatar.png'),
('std-6', 'Abdur Rasyid Hibatullah Wibisono', '24049', 'siswa', 'SMK Telkom Malang', 'PT. MULTI POWER ABADI', '081536925803', '/default-avatar.png')
ON CONFLICT (id) DO NOTHING;

-- 3. Tabel Absensi
CREATE TABLE IF NOT EXISTS absensi (
  id VARCHAR(50) PRIMARY KEY,
  student_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,
  nama_siswa VARCHAR(150) NOT NULL,
  tanggal DATE NOT NULL,
  jam_masuk VARCHAR(20) DEFAULT '-',
  keterangan_masuk TEXT DEFAULT '-',
  jam_pulang VARCHAR(20) DEFAULT '-',
  keterangan_pulang TEXT DEFAULT '-',
  status VARCHAR(20) NOT NULL DEFAULT 'Hadir',
  latitude NUMERIC(10,8),
  longitude NUMERIC(11,8),
  jarak_meters INT DEFAULT 0,
  status_lokasi VARCHAR(100) DEFAULT 'Di Area Magang',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Hak Akses Public (Row Level Security / RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE absensi ENABLE ROW LEVEL SECURITY;
ALTER TABLE perusahaan ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public all on users" ON users;
CREATE POLICY "Allow public all on users" ON users FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public all on absensi" ON absensi;
CREATE POLICY "Allow public all on absensi" ON absensi FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public all on perusahaan" ON perusahaan;
CREATE POLICY "Allow public all on perusahaan" ON perusahaan FOR ALL USING (true) WITH CHECK (true);
