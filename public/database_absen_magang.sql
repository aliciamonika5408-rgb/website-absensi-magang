-- MySQL Dump File untuk phpMyAdmin (XAMPP)
-- Database: db_absen_magang
-- Sistem Absensi Magang PT. Multi Power Abadi

SET FOREIGN_KEY_CHECKS=0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

CREATE DATABASE IF NOT EXISTS `db_absen_magang` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `db_absen_magang`;

-- --------------------------------------------------------
-- Struktur Tabel `perusahaan`
-- --------------------------------------------------------

DROP TABLE IF EXISTS `perusahaan`;
CREATE TABLE `perusahaan` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nama_perusahaan` varchar(150) NOT NULL,
  `alamat` text NOT NULL,
  `latitude` decimal(10,8) NOT NULL,
  `longitude` decimal(11,8) NOT NULL,
  `radius_max_meters` int(11) NOT NULL DEFAULT 200,
  `no_wa_pembimbing` varchar(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `perusahaan` (`id`, `nama_perusahaan`, `alamat`, `latitude`, `longitude`, `radius_max_meters`, `no_wa_pembimbing`) VALUES
(1, 'PT. MULTI POWER ABADI', 'Jl. Gn. Anyar Tambak IV No.50, Gn. Anyar Tambak, Kec. Gn. Anyar, Surabaya, Jawa Timur 60294', -7.34400100, 112.80484600, 200, '6288996838093');

-- --------------------------------------------------------
-- Struktur Tabel `users`
-- --------------------------------------------------------

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` varchar(50) NOT NULL,
  `nama` varchar(150) NOT NULL,
  `pin` varchar(10) NOT NULL,
  `role` enum('admin','siswa') NOT NULL DEFAULT 'siswa',
  `sekolah` varchar(150) DEFAULT NULL,
  `tempat_magang` varchar(150) DEFAULT 'PT. MULTI POWER ABADI',
  `no_hp` varchar(20) DEFAULT NULL,
  `foto_profil` varchar(255) DEFAULT '/default-avatar.png',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `pin` (`pin`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `users` (`id`, `nama`, `pin`, `role`, `sekolah`, `tempat_magang`, `no_hp`, `foto_profil`) VALUES
('admin-1', 'Admin', '999999', 'admin', 'Pusat Pengelola Magang', 'Administrator System', '081100001111', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80'),
('std-1', 'Alicia Monica', '12121', 'siswa', 'SMKN 2 SURABAYA', 'PT. MULTI POWER ABADI', '085955595369', '/alicia-profile.jpg'),
('std-2', 'Aisyah Yuanita', '15049', 'siswa', 'SMKN 2 SURABAYA', 'PT. MULTI POWER ABADI', '085882487732', '/aisyah-profile.png'),
('std-3', 'Rizky (Kiki)', '13015', 'siswa', 'Institut Teknologi Sepuluh Nopember', 'PT. MULTI POWER ABADI', '081337466129', '/default-avatar.png'),
('std-4', 'Glen', '09087', 'siswa', 'STIE IBMT', 'PT. MULTI POWER ABADI', '088228350129', '/default-avatar.png'),
('std-5', 'Muhammad davin Nararya tsaqif', '01010', 'siswa', 'SMK Telkom Malang', 'PT. MULTI POWER ABADI', '082183485393', '/default-avatar.png'),
('std-6', 'Abdur Rasyid Hibatullah Wibisono', '24049', 'siswa', 'SMK Telkom Malang', 'PT. MULTI POWER ABADI', '081536925803', '/default-avatar.png');

-- --------------------------------------------------------
-- Struktur Tabel `absensi`
-- --------------------------------------------------------

DROP TABLE IF EXISTS `absensi`;
CREATE TABLE `absensi` (
  `id` varchar(50) NOT NULL,
  `student_id` varchar(50) NOT NULL,
  `nama_siswa` varchar(150) NOT NULL,
  `tanggal` date NOT NULL,
  `jam_masuk` varchar(20) DEFAULT '-',
  `keterangan_masuk` text DEFAULT NULL,
  `jam_pulang` varchar(20) DEFAULT '-',
  `keterangan_pulang` text DEFAULT NULL,
  `status` enum('Hadir','Izin','Tidak Hadir') NOT NULL DEFAULT 'Hadir',
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  `jarak_meters` int(11) DEFAULT 0,
  `status_lokasi` varchar(100) DEFAULT 'Di Area Magang',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `student_id` (`student_id`),
  CONSTRAINT `fk_absensi_siswa` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

COMMIT;
SET FOREIGN_KEY_CHECKS=1;
