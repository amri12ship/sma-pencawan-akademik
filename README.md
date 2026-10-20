# Sistem Akademik SMA Pencawan — Prototype (UI Mockup)

Prototype antarmuka web **Sistem Akademik SMA Pencawan** yang dibuat murni dengan
**HTML + CSS + JavaScript vanilla**. Tujuan hanya untuk **gambaran visual dan alur penggunaan**:
tidak ada backend, tidak ada database, dan tidak ada request ke server.

## Cara Menjalankan

1. Buka folder `sma-pencawan/`.
2. Klik dua kali **`index.html`** (atau klik kanan → *Open with* → browser).
   `index.html` akan otomatis mengalihkan ke `login.html` (atau ke dashboard bila sesi login masih aktif).
3. Disarankan memakai Chrome/Edge/Firefox versi terbaru.

> Semua library dimuat via CDN, jadi koneksi internet diperlukan agar ikon, Chart.js,
> QR code, dan peta Leaflet tampil. Tanpa internet, halaman tetap berjalan namun
> komponen CDN tersebut tidak muncul.

## Akun Demo

| Peran | Nama Pengguna | Kata Sandi | Masuk ke |
|-------|---------------|-----------|----------|
| Admin | `admin` | `admin123` | Dashboard Admin (sidebar) |
| Guru  | `guru`  | `guru123`  | Dashboard Guru (mobile-first, bottom nav) |

Kredensial ini juga ditampilkan di halaman login.

## Daftar Halaman

### Admin
| Halaman | Deskripsi |
|---------|-----------|
| `admin/dashboard.html` | Kartu ringkasan (total guru, hadir, terlambat, belum absen), grafik kehadiran 7 hari & donat (Chart.js), absensi terbaru. |
| `admin/guru.html` | Manajemen guru (CRUD) dengan pencarian, filter status, modal tambah/ubah, dan nonaktifkan. |
| `admin/qr-absensi.html` | QR code (qrcodejs) + mode dinamis countdown 30 detik, unduh/cetak, pengaturan lokasi/jam/radius, peta radius (Leaflet). |
| `admin/jadwal-guru.html` | Grid jadwal mingguan per guru (dropdown) + modal slot dengan peringatan bentrok. |
| `admin/jadwal-kelas.html` | Grid jadwal per kelas + modal slot dengan peringatan bentrok kelas/ruangan/guru. |
| `admin/absensi-guru.html` | Monitoring absensi guru: filter tanggal/status/nama, modal detail (selfie, peta, koordinat), Setujui/Tolak, ekspor (simulasi). |
| `admin/laporan.html` | Rekap kehadiran guru bulanan (tabel + grafik) dengan filter bulan. |

### Guru (mobile-first)
| Halaman | Deskripsi |
|---------|-----------|
| `guru/dashboard.html` | Sapaan, status absen hari ini, jadwal mengajar hari ini, pintasan. |
| `guru/presensi.html` | Alur 4 langkah stepper: Scan QR → Cek lokasi GPS → Selfie → Konfirmasi, plus riwayat absensi pribadi. |
| `guru/jadwal.html` | Jadwal harian & mingguan (VIEW ONLY) dengan penanda jam berlangsung. |
| `guru/absensi-siswa.html` | Absensi siswa dengan toggle Hadir/Izin/Sakit/Alpa, ringkasan otomatis, simpan, tab rekap per kelas. |
| `guru/nilai.html` | Nilai siswa (CRUD): Tugas, Kuis, UH, UTS, UAS, nilai akhir otomatis, indikator di bawah KKM. |
| `guru/profil.html` | Data diri dan form ubah kata sandi (tampilan saja). |

## Struktur Folder

```
sma-pencawan/
├── index.html            # redirect ke login / dashboard
├── login.html            # login tiruan
├── admin/                # 7 halaman admin
├── guru/                 # 6 halaman guru
├── css/style.css         # seluruh gaya (desain sistem)
├── js/data.js            # SEMUA dummy data
├── js/app.js             # fungsi umum: auth, sidebar, topbar, modal, toast, tabel
├── assets/               # logo sekolah, gambar latar login, footer (logosekolah.jfif, GambarSekolah.jfif, footer_pendidikan.png, footer_ramah.png)
└── README.md
```

## Catatan Prototype (Tanpa Database)

- **Data dummy** tersimpan di `js/data.js`: 12 guru, 6 kelas (masing-masing 10–12 siswa),
  jadwal mingguan, 30 data absensi guru (termasuk contoh berstatus **Mencurigakan**),
  koordinat sekolah dummy di area **Medan, Sumatera Utara**.
- **Login tiruan** memakai `localStorage` (kunci `sp_auth`).
- **Perubahan kecil** (tambah/ubah guru, jadwal, nilai, verifikasi absensi) disimpan di
  `localStorage` agar demo terasa hidup, namun **hilang bila penyimpanan browser dibersihkan**.
- **Proteksi halaman tiruan**: tanpa login akan dialihkan ke `login.html`; guru tidak dapat
  membuka halaman admin dan sebaliknya (berdasarkan peran di `localStorage`).
- **Fitur simulasi**: tombol "Simulasi Scan Berhasil", "Simulasi Dalam/Luar Radius",
  "Ambil Foto", dan "Ekspor" hanya menampilkan tampilan/toast.
- Komponen berulang (sidebar, header, bottom nav, modal, toast, tabel dengan
  search/filter/pagination) dibuat sebagai fungsi/kelas di `js/app.js` agar tidak duplikasi.

## Desain

- Warna utama biru tua `#1e3a8a`, aksen kuning/emas `#f59e0b`, latar abu muda, font Inter.
- Logo sekolah (`assets/logosekolah.jfif`) tampil di kartu login, sidebar admin, dan topbar guru;
  halaman login memakai `assets/GambarSekolah.jfif` sebagai latar bergradasi;
  footer logo (`footer_pendidikan.png` / `footer_ramah.png`) muncul di bagian bawah setiap halaman admin & guru.
- Sidebar tetap di admin (collapsible di layar kecil), bottom navigation di halaman guru.
- Kartu bersudut membulat dengan bayangan halus; badge status berwarna
  (Hadir=hijau, Terlambat=kuning, Izin/Sakit=biru, Alpa/Ditolak=merah).
- Responsif: dashboard guru nyaman di layar 360px; admin nyaman di desktop & tablet.

---

> ⚠️ **Ini hanya prototype/mockup untuk keperluan visual dan demonstrasi alur.**
> Tidak untuk digunakan di produksi. Seluruh data bersifat fiktif.
