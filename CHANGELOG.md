# CHANGELOG — KIDQUEST

Semua perubahan tercatat dalam format terstandarisasi.

## [0.2.0] - 2026-10-30
### Added
- Navigasi *Mobile Bottom Tab Bar* pada smartphone untuk Arena Anak (Beranda, Quest, Timer, Hero, Piala) dan Portal Orang Tua (Ringkasan, Approval, Quest, Dompet, Audit) dengan zona ergonomis ibu jari.
- *Circular Animated Countdown Timer* berbasis SVG untuk Time Manager anak dengan stroke progress dinamis dan tombol kontrol sentuh besar ($\ge 48\text{px}$).
- Efek visual gamifikasi RPG yang diperkuat: *glowing XP progress bar*, kartu quest berbingkai interaktif, dan badge status naik level.
- Modal pengajuan quest dan formulir input dengan gaya *Mobile Bottom Sheet* yang ramah sentuhan.
- Grid metrik responsif adaptif (2 kolom pada smartphone, 4 kolom pada desktop) di Dashboard Orang Tua.
- Posisi notifikasi toast adaptif di atas bottom navigation bar agar tidak menutupi tab kontrol.

## [0.1.0] - 2026-10-30
### Added
- Inisialisasi dokumen pedoman utama `MASTER-PROMPT.md` pada root repository.
- Pembuatan dokumen arsitektur dan spesifikasi teknis:
  - `docs/PRD.md`: Spesifikasi lengkap kebutuhan produk, persona anak & orang tua, aturan XP, level, dan Universal Time Wallet.
  - `docs/ARCHITECTURE.md`: Arsitektur Local-First, dual-mode UI, integritas double-entry ledger, dan timer berbasis timestamp.
  - `docs/DATABASE.md`: Desain relasi entitas lengkap (17 tabel relasional), kunci UUID, skema ledger append-only, dan indeks performa.
  - `docs/API.md`: Spesifikasi REST API untuk autentikasi, quest, approval workflow, dan time manager.
- Konfigurasi metadata aplikasi (`metadata.json`) dan sinkronisasi meta tag SEO/OpenGraph pada `index.html`.
- Penambahan font ramah anak dan keluarga (`Plus Jakarta Sans` & `Fredoka`).
- Laporan audit menyeluruh repository dan penyusunan roadmap implementasi fase pertama.
