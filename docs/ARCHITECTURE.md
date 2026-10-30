# KIDQUEST — System Architecture Document

**Version:** 1.0.0-draft  
**Status:** Approved for Implementation  
**Architecture Style:** Local-First, Modular Monolith, Ledger-Backed  
**Document Language:** Bahasa Indonesia (dengan istilah teknis standar)

---

## 1. Arsitektur Tingkat Tinggi (High-Level Architecture)

KIDQUEST didesain dengan filosofi **Local-First Architecture**. Sistem menempatkan server lokal di rumah (atau cloud host pribadi) sebagai *Single Source of Truth* transaksi, sementara perangkat pengguna (Web browser & Android Capacitor) memiliki cache data lokal via IndexedDB untuk performa instan dan toleransi offline.

```
       +-------------------------------------------------------------+
       |                        Home Network                         |
       |                                                             |
       |   +-------------------+             +-------------------+   |
       |   |   Parent Device   |             |   Child Device    |   |
       |   | (Web / Capacitor) |             | (Web / Capacitor) |   |
       |   |  - Parent UI      |             |  - Child RPG UI   |   |
       |   |  - IndexedDB Cache|             |  - Timer & Avatar |   |
       |   +---------+---------+             +---------+---------+   |
       |             |                                 |             |
       |             +----------------+----------------+             |
       |                              | (REST / WebSocket)           |
       |                              v                              |
       |             +----------------------------------+            |
       |             |     KIDQUEST Core Backend        |            |
       |             |   (Node.js / Express Server)     |            |
       |             |                                  |            |
       |             |  - Auth & RBAC Guard             |            |
       |             |  - Quest Approval Engine         |            |
       |             |  - Double-Entry Ledger Service   |            |
       |             |  - Timestamp Timer Authority     |            |
       |             |  - Audit Logger & Backup Mgr     |            |
       |             +----------------+-----------------+            |
       |                              |                              |
       |                              v (Prisma / SQL)               |
       |             +----------------------------------+            |
       |             |    Relational Database (SQLite)  |            |
       |             |    - Tables with UUID & Ledger   |            |
       |             +----------------------------------+            |
       +-------------------------------------------------------------+
```

---

## 2. Lapisan Sistem (System Layers)

### 2.1 Lapisan Presentasi (Client / Frontend)
- **Teknologi:** React 19, TypeScript, Tailwind CSS v4, Lucide Icons, Motion (Framer Motion).
- **Dual Mode UI:**
  - **Parent Portal:** Dashboard komprehensif, Approval Center (menyetujui/menolak pengajuan tugas), Quest Builder, Consequence Matrix, Time Ledger Manager, Analitik.
  - **Child RPG Arena:** Desain imersif, ramah anak usia 6–9 tahun, avatar kustom, kartu quest berbentuk mini-scroll, meteran XP visual, brankas Time Wallet, dan timer hiburan interaktif.
- **Client Cache & Storage:** IndexedDB (melalui Dexie / idb) untuk menyimpan status profil, avatar, quest aktif, dan antrean sinkronisasi saat koneksi jaringan terputus sementara.

### 2.2 Lapisan Server & API (Backend)
- **Runtime & Framework:** Node.js + Express / Modular Services.
- **Tanggung Jawab Backend:**
  - **Otoritas Kebenaran (Authoritative Source):** Saldo waktu dan XP hanya dapat bertambah/berkurang setelah validasi backend.
  - **Proteksi Idempotency:** Mencegah reward ganda menggunakan UUID / idempotency header.
  - **Otoritas Timer:** Waktu mulai (`started_at`) dan waktu kedaluwarsa sesi hiburan diverifikasi menggunakan jam server terpercaya (*server epoch timestamp*).

### 2.3 Lapisan Data (Database Engine)
- **Database:** SQLite (lokal, performan tinggi, zero-configuration) dengan opsi migrasi mulus ke PostgreSQL jika ekspansi ke cloud.
- **Pola Ledger Transaksi (Append-Only Accounting):**
  - Saldo tidak dimutasi via `UPDATE balance = balance + 10`.
  - Saldo didapatkan dari agregasi transaksi valid di tabel `xp_transactions` dan `time_transactions`.
  - Setiap koreksi dilakukan melalui entri penyesuaian (*Adjustment / Reversal Transaction*).

---

## 3. Skema Ledger Integritas Saldo (Ledger Engine)

### 3.1 Transaksi XP (`xp_transactions`)
- **Tipe Mutasi:** `EARNED` (dari Quest Approved), `BONUS` (pencapaian spesial), `ADJUSTMENT` (koreksi manual orang tua).
- **Integritas:** XP bersifat searah; tidak ada penalti pemotongan XP otomatis atas pelanggaran (sesuai filosofi positif).

### 3.2 Transaksi Waktu (`time_transactions`)
- **Tipe Mutasi:**
  - `CREDIT` (dari Quest Approved / Hadiah Orang Tua).
  - `DEBIT` (dari penggunaan sesi timer hiburan).
  - `ADJUSTMENT` (koreksi orang tua jika terjadi salah input durasi).
  - `CONSEQUENCE_DEBIT` (pengurangan waktu hiburan sesuai aturan kesepakatan keluarga).
- **Aturan Non-Negatif:** Sebelum membuat transaksi `DEBIT`, backend memvalidasi:
  $$\sum \text{Credits} - \sum \text{Debits} \ge \text{DebitAmount}$$
  Jika saldo tidak mencukupi, operasi ditolak dengan status kode `422 Unprocessable Entity`.

---

## 4. Keamanan & RBAC (Role-Based Access Control)

1. **Role Hierarki:**
   - `PARENT` (Super Administrator Keluarga): Dilindungi password / master PIN (4–6 digit PIN dengan rate-limiting untuk pencegahan *brute-force* oleh anak).
   - `CHILD` (Explorer): Mengakses via sesi profil anak dengan token unik terbatas.
2. **Endpoint Boundary:**
   - Rute `/api/parent/*` mewajibkan validasi `ParentGuard` (Token/PIN auth).
   - Rute `/api/child/*` hanya mengizinkan aksi anak (Submit Quest, Start/Pause Timer pribadi).
   - Validasi payload menggunakan Zod Schema di setiap titik masuk API.
3. **Audit Log:**
   - Setiap aksi penting (Approval, Penyesuaian Saldo, Perubahan Aturan, Login Orang Tua) disimpan di tabel `audit_logs` dengan informasi timestamp, user ID, dan ringkasan aksi.

---

## 5. Arsitektur Timer Anti-Manipulasi

- Perhitungan sisa waktu hiburan:
  $$\text{RemainingSeconds} = \text{AllocatedSeconds} - (\text{ServerNow} - \text{SessionStart})$$
- Ketika anak menutup aplikasi atau perangkat restart:
  - Saat aplikasi dibuka kembali, client mengirim query status sesi ke backend.
  - Backend menghitung durasi nyata yang telah berlalu berdasarkan server clock.
  - Jika waktu telah habis saat app tertutup, sesi otomatis ditutup dengan status `COMPLETED_OFFLINE` dan saldo waktu dipotong sesuai durasi yang dialokasikan.
- Anak dilarang mengubah jam perangkat lokal untuk memperpanjang waktu bermain karena backend menggunakan waktu sistem server.
