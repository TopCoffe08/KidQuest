# KIDQUEST — Product Requirements Document (PRD)

**Project Name:** KIDQUEST  
**Tagline:** Your Life, Your Level.  
**Version:** 1.0.0-draft  
**Status:** In Progress / Foundation  
**Language:** Bahasa Indonesia  
**Author:** AI Development Team (Architect, PM, Designer, Dev, QA)

---

## 1. Ringkasan Eksekutif & Visi Produk

KIDQUEST adalah aplikasi gamifikasi keluarga yang dirancang untuk membantu anak (target awal usia 6–9 tahun) membangun kebiasaan positif, kemandirian, rasa tanggung jawab, disiplin, dan manajemen waktu melalui mekanisme permainan peran (RPG).

**Prinsip Utama:**
> *"Build responsibility through positive reinforcement, not fear."*  
> KIDQUEST bukan instrumen hukuman. Sistem mengedepankan pembelajaran, konsistensi, transparansi, penguatan perilaku positif, dan akuntabilitas yang disepakati bersama antara orang tua dan anak.

---

## 2. Pengguna Sasaran & Personas

### 2.1 Persona 1: Orang Tua (Parent / Admin)
- **Karakteristik:** Membutuhkan kemudahan dalam membimbing anak, memantau rutinitas harian, memberikan apresiasi yang terstruktur, dan mengendalikan screen-time tanpa konflik berkepanjangan.
- **Wewenang & Hak Akses:**
  - Penuh terhadap seluruh pengaturan keluarga dan profil anak.
  - Membuat, mengedit, menjadwalkan, dan menugaskan quest.
  - Menentukan reward (XP dan menit bonus waktu hiburan).
  - Meninjau, menyetujui (*approve*), atau meminta perbaikan (*revision*) atas pengajuan quest anak.
  - Menetapkan batas screen-time (harian, per kategori hiburan, per sesi).
  - Melakukan penyesuaian saldo (*ledger adjustment*) disertai alasan tercatat.
  - Melihat laporan analitik perkembangan anak, riwayat transaksi, dan audit log.
  - Melakukan pencadangan (*backup*) dan pemulihan (*restore*) database.

### 2.2 Persona 2: Anak (Child / Quest Explorer, Usia 6–9 Tahun)
- **Karakteristik:** Membutuhkan visual antarmuka yang ceria (*playful*), interaktif, mudah dipahami (teks singkat, ikon jelas, visualisasi progress bar), serta umpan balik instan (*gratification*) yang memotivasi.
- **Wewenang & Hak Akses:**
  - Memilih dan mengkustomisasi avatar/karakter RPG.
  - Melihat daftar quest aktif yang ditugaskan kepadanya.
  - Menyerahkan pengajuan penyelesaian quest (*Submit Quest*).
  - Melihat perolehan XP kumulatif, level badge, dan progress bar menuju level berikutnya.
  - Melihat saldo *Universal Time Wallet* (dalam satuan menit).
  - Memulai dan menghentikan sesi timer hiburan sesuai saldo yang dimiliki.
  - Membuka dan mengagumi pencapaian (*achievements/trophies*).
  - Melihat riwayat aktivitas positif miliknya.
- **Batasan Ketat (Security Boundary):**
  - Tidak dapat menambah XP atau menit waktu secara mandiri.
  - Tidak dapat meng-approve quest miliknya sendiri.
  - Tidak dapat mengubah aturan, konsekuensi, atau menghapus riwayat audit.

---

## 3. Fitur Utama & Spesifikasi Fungsional

### 3.1 Core Game System

#### A. XP & Level System
- **XP (Experience Points):** Diperoleh murni dari penyelesaian quest positif setelah disetujui orang tua. XP bersifat kumulatif dan tidak pernah hangus atau dipotong sebagai sanksi hukuman.
- **Leveling:** Level dihitung dari formula XP kumulatif:
  - Level 1: 0 – 99 XP
  - Level 2: 100 – 249 XP
  - Level 3: 250 – 499 XP
  - Level 4: 500 – 799 XP
  - Level 5: 800 – 1.199 XP
  - Level 6: 1.200 – 1.699 XP
  - Level 7+: 1.700+ XP (dan skala dinamis berikutnya)
- **Celebration UX:** Animasi selebrasi dan dialog ceria saat naik level atau memperoleh achievement baru.

#### B. Universal Time Wallet (Dompet Waktu Hiburan)
- **Konsep:** Setiap kebiasaan positif memberikan bonus waktu (contoh: membaca buku 15 menit → +5 menit hiburan, membantu merapikan mainan → +10 menit hiburan).
- **Aturan Integritas Saldo:**
  - Satuan saldo adalah **menit bulat (integer menit)**.
  - Saldo **tidak pernah boleh bernilai negatif** ($saldo \ge 0$).
  - Saldo dihitung dari **ledger transaksi** (audit ledger), bukan angka yang dimutasi langsung di database tanpa riwayat.
  - XP dan Saldo Waktu merupakan dua entitas yang terpisah: XP tidak dapat dikonversi menjadi waktu hiburan sembarangan.
- **Batasan Kontrol Orang Tua:**
  - Batas maksimal screen-time harian (misal: maks 60 menit/hari terlepas dari besarnya saldo).
  - Batas durasi per sesi (misal: maks 30 menit per sesi main game).
  - Batas per kategori hiburan (Game, Video/YouTube, Sosialisasi).

#### C. Consequence System (Konsekuensi Restoratif)
- Mengedepankan **tindakan perbaikan (*restorative action*)** yang relevan dengan perilaku.
- *Strict Constraint:* Sistem dilarang memfasilitasi pembatasan kebutuhan dasar (makanan, tidur, olahraga, pendidikan, waktu istirahat utama) atau kata-kata ejekan/label negatif.
- Konsekuensi harus disepakati dan dikonfirmasi oleh orang tua.

---

### 3.2 Siklus Hidup Quest (Quest Lifecycle)

```
[DRAFT] ──> [ASSIGNED] ──> [IN_PROGRESS] ──> [PENDING_APPROVAL]
                                                      │
                       ┌──────────────────────────────┴──────────────────────────┐
                       ▼                                                         ▼
                 [APPROVED]                                             [REVISION_REQUIRED]
                     │                                                           │
        (Ledger XP + Time credited)                                              ▼
                                                                           [IN_PROGRESS]
```

- **Idempotency:** Mencegah perolehan XP atau waktu ganda akibat penekanan tombol berulang (*double submission*).
- **Proof of Work (Opsional):** Anak dapat menyertakan foto hasil pekerjaan atau catatan singkat.

---

### 3.3 Time Manager & Timer Mesin

- **State Timer:** Idle, Running, Paused, Completed.
- **Timestamp-Based Calculation:** Durasi tidak dihitung dengan sekadar `setInterval` lokal di browser yang rentan freeze/mati saat layar mati atau app di-background.
  - Waktu mulai dicatat dengan ISO Timestamp (`started_at`).
  - Timer menghitung sisa waktu berdasarkan perbandingan selisih waktu sistem aktual:
    $$\Delta t = \text{CurrentTimestamp} - \text{StartedAt}$$
  - Sisa waktu disimpan secara berkala ke database/local storage untuk toleransi crash.
- **Pencegahan Sesi Ganda:** 1 anak hanya boleh memiliki 1 sesi timer hiburan aktif pada waktu yang sama.

---

## 4. Persyaratan Non-Fungsional (NFR)

1. **Local-First Architecture:** Sistem dapat beroperasi di jaringan rumah tanpa koneksi internet kontinu.
2. **Data Integrity:** Double-entry ledger pattern untuk XP dan Time balance.
3. **Responsive UI:** Tampilan adaptif untuk smartphone (Android Capacitor), tablet anak, dan desktop orang tua.
4. **Keamanan & Privasi Anak (COPPA / GDPR-K Alignment):** Minimalkan data pribadi. Tidak menyimpan identitas sensitif anak ke pihak ketiga tanpa izin.
5. **Performa:** Render transisi instan (< 100ms) dan UI interaktif bebas jank/lag.
