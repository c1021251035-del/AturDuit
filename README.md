# AturDuit — Smart Budget Planner 50/30/20

AturDuit adalah aplikasi personal finance yang membantu masyarakat Indonesia mengatur keuangan bulanan secara otomatis menggunakan metode rasio **50/30/20** (Kebutuhan / Keinginan / Tabungan).

## Fitur Utama
- **Onboarding Cerdas**: Pilih profil (Mahasiswa, Pekerja, Freelancer, dll) dan masukkan pendapatan — sistem langsung membagi budget secara otomatis.
- **Kategori Dinamis**: Sub-kategori budget menyesuaikan dengan profil yang dipilih.
- **Pencatatan Transaksi**: Catat pengeluaran harian dan bandingkan dengan alokasi budget.
- **Dashboard Visual**: Donut chart proporsi budget, progress bar per kategori, ringkasan bulanan.
- **Peringatan Batas**: Notifikasi ketika pengeluaran kategori mendekati atau melebihi limit.
- **Analitik**: Tren pengeluaran bulanan, perbandingan kategori, insight otomatis.
- **Pengaturan**: Ubah profil, pendapatan, rasio default, dan tema tampilan.

## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **UI**: TailwindCSS + shadcn/ui
- **State Management**: React Context + localStorage
- **Charting**: Custom SVG (donut, bar, line)
- **Dark Mode**: Full support

## Cara Menjalankan

### Prasyarat
- Node.js 18+
- npm 9+

### Instalasi
```bash
npm install
```

### Development
```bash
npm run dev
```

### Production
```bash
npm run build
npm start
```

## Struktur Direktori
```
aturduit/
├── src/
│   ├── app/               # Halaman Next.js
│   │   ├── (app)/         # Halaman aplikasi (dashboard, budget, transaksi, dll)
│   │   ├── onboarding/    # Halaman onboarding
│   │   └── layout.tsx     # Layout root
│   ├── components/        # Komponen reusable
│   │   ├── layout/        # Sidebar, Topbar, AppShell
│   │   └── ui/            # Komponen shadcn/ui
│   ├── lib/               # Logika bisnis & store
│   │   ├── budget.ts      # Kalkulator 50/30/20, kategori
│   │   └── store.tsx      # State management
├── public/               # Asset statis
├── tailwind.config.ts    # Konfigurasi Tailwind
└── README.md             # Dokumentasi
```

## Warna Kategori
- **Kebutuhan (50%)**: Biru (#2563eb)
- **Keinginan (30%)**: Oranye (#f59e0b)
- **Tabungan (20%)**: Hijau (#10b981)

## Lisensi
MIT