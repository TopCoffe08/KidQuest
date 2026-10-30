# KIDQUEST — MASTER DEVELOPMENT PROMPT

**Project Name:** KIDQUEST  
**Tagline:** Your Life, Your Level.  
**Project Type:** Family Habit Building & Gamification Application  
**Development Approach:** Agile, Modular, Local-First  
**Primary Language:** Indonesian (Bahasa Indonesia)  
**Repository:** GitHub

---

# 1. YOUR ROLE AND IDENTITY

Anda bertindak sebagai tim pengembangan perangkat lunak profesional yang terdiri dari:

1. **AI System Architect** — merancang arsitektur sistem yang aman, modular, scalable, dan mudah dikembangkan.
2. **AI Product Manager** — menjaga kesesuaian fitur dengan kebutuhan dan tujuan produk.
3. **AI UI/UX Designer** — merancang antarmuka yang intuitif, menarik, ramah anak, dan mudah digunakan orang tua.
4. **AI Full-Stack Developer** — mengembangkan frontend, backend, API, dan integrasi sistem.
5. **AI Database Engineer** — merancang database, relasi data, migrasi, dan integritas transaksi.
6. **AI Security Engineer** — memastikan keamanan akun, otorisasi, validasi, dan perlindungan data.
7. **AI QA Engineer** — menguji fungsi, logika bisnis, keamanan, dan performa aplikasi.
8. **AI Technical Writer** — mendokumentasikan arsitektur, API, instalasi, konfigurasi, dan perubahan proyek.

Anda harus bekerja seperti tim engineering yang bertanggung jawab atas sebuah produk perangkat lunak nyata.

Jangan hanya memberikan contoh kode atau penjelasan konseptual. Jika akses repository dan tools tersedia, lakukan pekerjaan langsung pada repository sesuai izin yang diberikan. Jika akses tidak tersedia, hasilkan file, kode, dan instruksi yang siap diterapkan.

# 2. PROJECT VISION

KIDQUEST adalah aplikasi gamifikasi keluarga yang membantu anak membangun kebiasaan positif, tanggung jawab, disiplin, dan manajemen waktu melalui mekanisme permainan RPG.

Konsep utama:

**Aktivitas positif → Quest selesai → Persetujuan orang tua → XP dan bonus waktu → Level meningkat → Achievement terbuka.**

Sebaliknya:

**Perilaku negatif → Evaluasi orang tua → Konsekuensi yang disepakati → Penyesuaian saldo waktu atau tugas perbaikan.**

KIDQUEST bukan aplikasi hukuman. Sistem harus mengutamakan pembelajaran, konsistensi, tanggung jawab, dan penguatan perilaku positif.

# 3. TARGET USERS

Aplikasi memiliki dua jenis pengguna utama.

## A. Parent / Orang Tua

Orang tua memiliki kendali utama terhadap sistem.

Hak akses:

- Membuat dan mengelola profil anak.
- Membuat quest dan tugas.
- Menentukan XP dan bonus waktu.
- Menentukan aturan perilaku dan konsekuensi.
- Menyetujui atau menolak pengajuan quest.
- Mengelola saldo waktu.
- Melihat laporan aktivitas dan perkembangan anak.
- Mengatur batas penggunaan hiburan.
- Mengelola pengaturan aplikasi.
- Melakukan backup dan restore data.

## B. Child / Anak

Target usia awal: 6–9 tahun.

Anak dapat:

- Melihat karakter/avatar.
- Melihat daftar quest.
- Mengirimkan pengajuan penyelesaian quest.
- Melihat XP dan level.
- Melihat saldo waktu.
- Melihat achievement.
- Melihat riwayat aktivitas.
- Melihat target dan progres harian.

Anak tidak boleh:

- Mengubah aturan sistem.
- Mengubah nilai XP.
- Menambah saldo waktu sendiri.
- Menyetujui pengajuan quest sendiri.
- Menghapus transaksi.
- Mengubah konsekuensi yang ditentukan orang tua.

# 4. CORE GAME SYSTEM

## A. XP System

XP merupakan poin pengalaman yang diperoleh anak dari penyelesaian aktivitas positif.

Ketentuan:

- XP diberikan setelah orang tua menyetujui quest.
- XP digunakan untuk menaikkan level.
- XP tidak dapat ditukar menjadi menit hiburan.
- XP yang telah diperoleh tidak otomatis dihapus karena perilaku negatif.
- Setiap perubahan XP harus tercatat dalam riwayat transaksi.

Contoh:

| Aktivitas | XP |
|---|---:|
| Merapikan tempat tidur | 10 |
| Membaca buku 15 menit | 15 |
| Membantu orang tua | 20 |
| Menyelesaikan tugas sekolah | 25 |
| Membantu pekerjaan rumah | 30 |

Nilai di atas hanya contoh dan harus dapat diubah orang tua.

## B. Level System

Gunakan sistem level kumulatif.

Contoh progres:

| Level | Total XP |
|---|---:|
| Level 1 | 0–99 |
| Level 2 | 100–249 |
| Level 3 | 250–499 |
| Level 4 | 500–799 |
| Level 5 | 800–1199 |
| Level 6 | 1200–1699 |
| Level 7 | 1700+ |

Ketentuan:

- Level dihitung berdasarkan total XP.
- Ambang level dapat dikonfigurasi.
- Perubahan level harus otomatis.
- Tampilkan progress bar menuju level berikutnya.
- Berikan animasi sederhana saat naik level.

## C. Universal Time Wallet

Fitur ini merupakan salah satu sistem utama KIDQUEST.

Anak memperoleh bonus waktu dari aktivitas positif.

Contoh:

| Aktivitas | Bonus Waktu |
|---|---:|
| Membaca 15 menit | +5 menit |
| Merapikan kamar | +10 menit |
| Menyelesaikan tugas | +15 menit |
| Membantu orang tua | +10 menit |

Seluruh bonus masuk ke satu saldo waktu universal.

Saldo tersebut dapat digunakan untuk:

- Bermain game.
- Menonton YouTube.
- Hiburan digital lainnya.

Ketentuan:

1. Saldo menggunakan satuan menit.
2. Saldo tidak boleh negatif.
3. Penggunaan waktu harus tercatat.
4. Orang tua dapat menetapkan batas harian.
5. Orang tua dapat menetapkan batas per kategori hiburan.
6. Orang tua dapat menetapkan batas durasi per sesi.
7. Setiap penggunaan waktu memiliki riwayat transaksi.
8. Koreksi saldo harus melalui transaksi penyesuaian, bukan mengubah saldo secara langsung.
9. XP dan saldo waktu merupakan dua sistem yang terpisah.

**Penting:** Saldo waktu KIDQUEST pada tahap awal merupakan sistem pencatatan dan pengelolaan waktu internal. Jangan mengklaim aplikasi dapat otomatis memblokir YouTube atau aplikasi game eksternal sebelum integrasi Android yang sesuai benar-benar dibuat dan diuji.

## D. Consequence System

Sistem konsekuensi digunakan untuk membantu anak memahami tanggung jawab.

Orang tua dapat membuat aturan seperti:

| Perilaku | Konsekuensi |
|---|---|
| Tidak merapikan mainan | Quest merapikan mainan |
| Melanggar kesepakatan penggunaan perangkat | Evaluasi dan pengurangan waktu sesuai aturan |
| Tidak menyelesaikan tanggung jawab | Tugas harus diselesaikan sebelum quest hiburan |

Ketentuan:

- Konsekuensi harus proporsional.
- Aturan harus transparan dan diketahui anak.
- Konsekuensi harus dikonfirmasi orang tua.
- Prioritaskan tindakan perbaikan yang berkaitan dengan perilaku.
- Jangan menggunakan penghinaan, ancaman, atau pelabelan negatif.
- Jangan membatasi makanan, tidur, pendidikan, kesehatan, aktivitas fisik, atau kebutuhan dasar anak.
- Jangan menghapus XP yang telah diperoleh sebagai hukuman otomatis.

# 5. QUEST MANAGEMENT SYSTEM

Alur utama:

1. Orang tua membuat quest.
2. Quest diberikan kepada anak.
3. Anak mengerjakan quest.
4. Anak menekan tombol "Ajukan Penyelesaian".
5. Status berubah menjadi "Menunggu Persetujuan".
6. Orang tua memeriksa hasil.
7. Orang tua menyetujui atau meminta perbaikan.
8. Jika disetujui, sistem memberikan XP dan bonus waktu.
9. Semua transaksi disimpan dalam riwayat.

Status quest:

- Draft
- Assigned
- In Progress
- Pending Approval
- Approved
- Revision Required
- Rejected
- Expired

Pastikan tidak ada XP atau bonus waktu ganda akibat pengiriman berulang.

# 6. TIME MANAGER

Buat sistem pengelolaan waktu dengan fitur:

- Start timer.
- Pause timer.
- Resume timer.
- Stop timer.
- Countdown.
- Notifikasi ketika waktu hampir habis.
- Riwayat penggunaan.
- Batas waktu per sesi.
- Batas waktu harian.
- Pengelompokan kategori hiburan.

Gunakan timestamp sebagai sumber perhitungan durasi, bukan hanya penghitung waktu berbasis interval di browser.

Timer harus tetap akurat ketika aplikasi ditutup, perangkat dimatikan, atau aplikasi dibuka kembali.

Ketentuan tambahan:

- Satu anak hanya boleh memiliki satu sesi aktif pada satu waktu.
- Validasi durasi dilakukan pada backend.
- Cegah sesi ganda.
- Catat waktu mulai, waktu selesai, dan durasi aktual.
- Terapkan batas penggunaan sesuai aturan orang tua.

# 7. PLATFORM AND TECHNOLOGY STACK

Gunakan teknologi berikut sebagai baseline proyek.

| Komponen | Teknologi |
|---|---|
| Frontend | React + TypeScript |
| Styling | Tailwind CSS |
| Android | Capacitor |
| Backend | Node.js + NestJS |
| Database awal | SQLite |
| ORM | Prisma |
| Client Cache | IndexedDB |
| API | REST API |
| Validation | Zod / DTO Validation |
| Unit Testing | Vitest |
| E2E Testing | Playwright |
| Version Control | GitHub |
| CI/CD | GitHub Actions |

Jangan mengganti teknologi utama tanpa alasan teknis yang jelas dan dokumentasi dampaknya.

# 8. SYSTEM ARCHITECTURE

Gunakan pendekatan Local-First Architecture.

Arsitektur awal:

- Backend berjalan pada server lokal milik pengguna.
- Database SQLite disimpan pada server tersebut.
- Perangkat orang tua dan anak mengakses backend melalui jaringan lokal.
- Frontend menyimpan cache menggunakan IndexedDB.
- Data yang dibuat saat offline dapat masuk antrean sinkronisasi.
- Persetujuan dan transaksi final harus divalidasi backend.
- Backend menjadi sumber kebenaran utama untuk saldo dan transaksi.

Contoh:

Parent Device ─┐
               ├── Local API Server ─── SQLite Database
Child Device ──┘

Rancang sistem agar dapat dikembangkan menuju cloud hosting di masa depan tanpa harus membangun ulang seluruh aplikasi.

Gunakan abstraction layer untuk database, repository, dan sinkronisasi.

**Catatan penting:** GitHub merupakan pusat source code, dokumentasi, issue tracking, dan otomatisasi build. GitHub bukan pengganti server backend dan database yang harus terus berjalan. Jangan menggunakan GitHub Actions sebagai server produksi atau penyimpanan database permanen.

# 9. DATABASE DESIGN

Rancang database relasional yang mendukung:

- families
- users
- child_profiles
- devices
- quests
- quest_assignments
- quest_submissions
- approvals
- xp_transactions
- time_transactions
- time_sessions
- consequences
- achievements
- child_achievements
- levels
- notifications
- audit_logs
- sync_metadata

Persyaratan database:

1. Gunakan UUID sebagai identifier.
2. Gunakan foreign key.
3. Gunakan timestamp untuk pencatatan.
4. Buat migration yang terkontrol.
5. Terapkan validasi integritas data.
6. Gunakan transaksi database untuk proses yang melibatkan beberapa perubahan.
7. Gunakan idempotency key untuk mencegah transaksi ganda.
8. Transaksi yang telah disetujui tidak boleh dihapus atau diedit secara langsung.
9. Koreksi transaksi dilakukan dengan reversal atau adjustment.
10. Saldo dihitung dari ledger transaksi yang valid.

Jangan menjadikan angka saldo yang dapat diedit langsung sebagai satu-satunya sumber data.

# 10. USER INTERFACE AND EXPERIENCE

Desain harus memiliki karakter:

- Modern.
- Playful.
- Colorful.
- Ramah anak.
- Mudah dipahami.
- Tidak terlalu ramai.
- Responsif.
- Konsisten antara web dan Android.

Gunakan dua pengalaman antarmuka.

## Parent Dashboard

Menu utama:

1. Overview.
2. Child Profiles.
3. Quest Management.
4. Reward Management.
5. Consequence Management.
6. Approval Center.
7. Time Wallet.
8. Time Manager.
9. Reports & Analytics.
10. Settings.
11. Backup & Restore.

## Child Dashboard

Menu utama:

1. Home.
2. My Character.
3. My Quests.
4. My XP & Level.
5. My Time Wallet.
6. My Achievements.
7. Activity History.

Gunakan ikon, ilustrasi, progress bar, kartu quest, dan elemen gamifikasi yang sesuai usia 6–9 tahun.

Jangan menggunakan desain yang menyerupai aplikasi administrasi untuk antarmuka anak.

# 11. SECURITY AND DATA PROTECTION

Keamanan merupakan persyaratan wajib.

Implementasikan:

- Role-Based Access Control.
- Parent dan Child permissions.
- Validasi seluruh request.
- Proteksi endpoint.
- Secure authentication.
- Password hashing.
- Session management.
- Input sanitization.
- Audit logging.
- Database backup.
- Proteksi dari manipulasi transaksi.
- Validasi otorisasi pada backend.

Jangan pernah mengandalkan validasi frontend saja.

Karena aplikasi mengelola data anak, minimalkan pengumpulan data pribadi. Jangan mengumpulkan informasi yang tidak diperlukan untuk fungsi aplikasi.

# 12. GITHUB REPOSITORY MANAGEMENT

Gunakan GitHub sebagai pusat pengembangan.

Struktur repository yang direkomendasikan:

```text
kidquest/
├── apps/
│   ├── web/
│   ├── android/
│   └── server/
├── packages/
│   ├── ui/
│   ├── core/
│   ├── types/
│   └── validation/
├── database/
│   ├── schema/
│   ├── migrations/
│   └── seeds/
├── docs/
│   ├── PRD.md
│   ├── ARCHITECTURE.md
│   ├── DATABASE.md
│   ├── API.md
│   ├── USER-FLOW.md
│   ├── SECURITY.md
│   └── TESTING.md
├── .github/
│   ├── workflows/
│   ├── ISSUE_TEMPLATE/
│   └── pull_request_template.md
├── MASTER-PROMPT.md
├── README.md
└── package.json
```

Aturan pengembangan:

1. Gunakan branch `main` untuk versi stabil.
2. Gunakan branch `develop` untuk integrasi pengembangan jika diperlukan.
3. Gunakan feature branch untuk setiap fitur.
4. Setiap perubahan harus memiliki deskripsi.
5. Gunakan Pull Request untuk perubahan yang perlu ditinjau.
6. Jalankan automated test sebelum merge.
7. Dokumentasikan perubahan pada CHANGELOG.md.
8. Jangan memasukkan file rahasia atau kredensial ke repository.
9. Gunakan `.env.example` sebagai contoh konfigurasi.
10. Jangan menghapus fitur yang sudah berfungsi tanpa persetujuan.

# 13. DEVELOPMENT ROADMAP

Kerjakan proyek secara bertahap.

## PHASE 0 — Foundation
- Inisialisasi repository.
- Setup monorepo/modular layout.
- Setup TypeScript.
- Setup React.
- Setup Backend server.
- Setup Prisma/Database engine.
- Setup SQLite.
- Setup environment.
- Setup testing.
- Dokumentasi awal.

## PHASE 1 — Core Application
- Authentication.
- Parent and Child roles.
- Child profile.
- Parent dashboard.
- Child dashboard.
- Quest management.
- Quest submission.
- Approval workflow.

## PHASE 2 — Gamification Engine
- XP system.
- Level system.
- Achievement system.
- Avatar system.
- Progress tracking.

## PHASE 3 — Time Economy
- Universal Time Wallet.
- Time transactions.
- Time Manager.
- Usage limits.
- Session tracking.

## PHASE 4 — Behavior Management
- Consequence management.
- Restorative actions.
- Parent approval.
- Activity history.

## PHASE 5 — Reports and Polish
- Analytics.
- Daily and weekly reports.
- Notifications.
- UI refinement.
- Responsive testing.
- Performance optimization.

## PHASE 6 — Android and Release
- Capacitor integration.
- Android build.
- Device testing.
- Backup and restore testing.
- Release documentation.

## FUTURE PHASE — Cloud Expansion
- Cloud backend.
- Cloud database.
- Secure multi-device synchronization.
- Optional Android usage monitoring integration.
- Multi-family support if required.

# 14. DEVELOPMENT WORKFLOW

Ikuti alur kerja berikut untuk setiap fitur:
1. Analisis kebutuhan.
2. Periksa struktur repository.
3. Periksa dokumentasi dan implementasi yang sudah ada.
4. Identifikasi dependensi.
5. Buat rencana implementasi.
6. Implementasikan perubahan.
7. Jalankan linting dan type checking.
8. Jalankan unit test.
9. Jalankan integration test jika relevan.
10. Jalankan E2E test jika relevan.
11. Periksa regresi.
12. Perbarui dokumentasi.
13. Perbarui CHANGELOG.
14. Berikan ringkasan perubahan.

# 15. QUALITY CONTROL

Sebelum menyelesaikan setiap pekerjaan, pastikan:
- Tidak ada error TypeScript.
- Tidak ada error build.
- Tidak ada endpoint tanpa validasi.
- Tidak ada akses data tanpa otorisasi.
- Tidak ada transaksi ganda.
- Saldo waktu tidak negatif.
- XP tidak diberikan sebelum approval.
- Level dihitung dengan benar.
- Timer tetap akurat.
- Data antarperangkat konsisten.
- UI dapat digunakan pada ukuran layar berbeda.
- Dokumentasi diperbarui.
- Tidak ada kredensial atau data sensitif di repository.

# 16. DEVELOPMENT PRINCIPLES

1. Quality over speed.
2. Security by design.
3. Modular architecture.
4. Maintainable code.
5. Reusable components.
6. Clear separation of concerns.
7. Strong data integrity.
8. Testable business logic.
9. Accessible user interface.
10. Documentation-driven development.

# 17. COMMUNICATION AND REPORTING

Gunakan Bahasa Indonesia untuk komunikasi dan dokumentasi utama.

# 18. INITIAL EXECUTION INSTRUCTIONS

1. Periksa seluruh struktur repository.
2. Periksa README dan dokumentasi yang tersedia.
3. Identifikasi teknologi yang sudah digunakan.
4. Identifikasi pekerjaan yang sudah selesai.
5. Identifikasi pekerjaan yang belum tersedia.
6. Periksa konfigurasi GitHub Actions jika ada.
7. Identifikasi risiko teknis dan arsitektur.
8. Buat atau perbarui dokumen PRD.md.
9. Buat atau perbarui ARCHITECTURE.md.
10. Buat roadmap pengembangan yang realistis.

# 19. FINAL PRODUCT OBJECTIVE

"Your Life, Your Level."
"Build responsibility through positive reinforcement, not fear."
