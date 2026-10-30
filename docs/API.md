# KIDQUEST — REST API Specification

**Version:** 1.0.0-draft  
**Base URL:** `/api/v1`  
**Data Format:** JSON (`Content-Type: application/json`)  
**Authentication:** Header `Authorization: Bearer <token>` atau `X-Family-PIN: <pin>` (Parent Guard)

---

## 1. Authentication & Profiling

### `POST /api/v1/auth/login`
Autentikasi Parent atau Child.
- **Request:**
  ```json
  {
    "username": "ayah_budi",
    "pin": "1234"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "token": "jwt_token_here",
    "user": {
      "id": "uuid-v4",
      "displayName": "Ayah Budi",
      "role": "PARENT",
      "familyId": "uuid-family"
    }
  }
  ```

### `GET /api/v1/family/children`
Mendapatkan daftar profil anak dalam keluarga.
- **Response (200 OK):**
  ```json
  [
    {
      "id": "uuid-child-1",
      "displayName": "Kenzo",
      "avatarKey": "brave_knight",
      "level": 2,
      "totalXp": 160,
      "nextLevelXp": 250,
      "timeWalletMinutes": 45,
      "dailyTimeLimitMinutes": 60
    }
  ]
  ```

---

## 2. Quest Management (Parent)

### `GET /api/v1/quests`
Mengambil seluruh katalog quest dan status penugasannya.

### `POST /api/v1/quests`
Membuat quest baru.
- **Request:**
  ```json
  {
    "title": "Membaca Buku Cerita 15 Menit",
    "description": "Baca 1 bab buku cerita petualangan.",
    "category": "STUDY",
    "xpReward": 15,
    "timeRewardMinutes": 10,
    "recurrence": "DAILY",
    "assignToChildIds": ["uuid-child-1"]
  }
  ```

---

## 3. Child Quest Actions & Submissions (Child)

### `GET /api/v1/child/quests/active`
Mengambil quest yang ditugaskan ke anak yang sedang aktif.

### `POST /api/v1/child/quests/:assignmentId/submit`
Anak mengajukan penyelesaian tugas.
- **Request:**
  ```json
  {
    "notes": "Sudah selesai membaca bab 3!",
    "proofImage": null
  }
  ```
- **Response (200 OK):** Mengubah status assignment menjadi `PENDING_APPROVAL`.

---

## 4. Approval Center (Parent)

### `GET /api/v1/parent/approvals/pending`
Mengambil daftar pengajuan quest anak yang menunggu peninjauan orang tua.

### `POST /api/v1/parent/approvals/:submissionId/decision`
Menyetujui atau meminta revisi pengerjaan tugas.
- **Request:**
  ```json
  {
    "decision": "APPROVED", // "APPROVED" | "REVISION_REQUIRED" | "REJECTED"
    "feedback": "Bagus sekali Kenzo, bacaannya rapi!",
    "idempotencyKey": "approval-sub123-token"
  }
  ```
- **Side Effect jika APPROVED:**
  1. Status assignment berubah menjadi `APPROVED`.
  2. Entri baru dibuat di `xp_transactions` (+15 XP).
  3. Entri baru dibuat di `time_transactions` (+10 Menit).
  4. Periksa apakah XP memicu kenaikan Level atau unlock Achievement.
  5. Audit log dicatat.

---

## 5. Universal Time Wallet & Timer Manager

### `GET /api/v1/child/time-wallet/balance`
Mengambil saldo waktu yang terverifikasi secara server-side beserta batas harian hari ini.

### `POST /api/v1/time-manager/sessions/start`
Memulai sesi timer hiburan anak.
- **Request:**
  ```json
  {
    "childId": "uuid-child-1",
    "category": "GAMING",
    "requestedMinutes": 20
  }
  ```
- **Validasi Backend:**
  - Pastikan saldo anak $\ge 20$ menit.
  - Pastikan anak tidak memiliki sesi aktif lain.
  - Pastikan durasi tidak melebihi `max_session_duration_minutes` (30 menit).
  - Pastikan total penggunaan hari ini $+ 20 \le \text{dailyTimeLimitMinutes}$.
- **Response (201 Created):**
  ```json
  {
    "sessionId": "uuid-session-1",
    "status": "ACTIVE",
    "startedAt": "2026-10-30T00:37:00.000Z",
    "allocatedMinutes": 20,
    "endsAt": "2026-10-30T00:57:00.000Z"
  }
  ```

### `POST /api/v1/time-manager/sessions/:sessionId/stop`
Menghentikan sesi timer hiburan.
- Menghitung menit aktual yang terpakai berdasarkan selisih waktu server.
- Mencatat transaksi debet waktu pada `time_transactions` dengan menit yang terpakai.
- Mengembalikan sisa waktu yang tidak jadi dipakai ke dalam saldo.

---

## 6. Ledger & Koreksi Saldo (Parent)

### `POST /api/v1/parent/time-wallet/adjustment`
Penyesuaian saldo manual oleh orang tua (misal bonus kejutan atau koreksi).
- **Request:**
  ```json
  {
    "childId": "uuid-child-1",
    "adjustmentMinutes": 10, // positif atau negatif
    "reason": "Membantu nenek membawakan belanjaan"
  }
  ```
