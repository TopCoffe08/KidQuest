# KIDQUEST — Database Architecture & Schema Specification

**Version:** 1.0.0-draft  
**Database Engine:** SQLite (Lokal) / PostgreSQL (Cloud Ready)  
**ORM Support:** Prisma Schema Compatible  
**Data Integrity:** Strict Foreign Keys, UUIDv4 Primary Keys, Append-Only Ledger

---

## 1. Desain Relasi Entitas (ERD Overview)

```
[Family] ──< [Users (Parent/Child)]
   │
   ├───< [ChildProfiles] ───< [QuestAssignments] >─── [Quests]
   │          │                        │
   │          │                        └───< [QuestSubmissions] >───< [Approvals]
   │          │
   │          ├───< [XpTransactions] (Ledger)
   │          ├───< [TimeTransactions] (Ledger)
   │          ├───< [TimeSessions] (Timer Sessions)
   │          ├───< [ChildAchievements] >─── [Achievements]
   │          └───< [Consequences]
   │
   ├───< [Levels]
   ├───< [AuditLogs]
   └───< [Devices]
```

---

## 2. Definisi Entitas & Tabel

### 2.1 `families`
Mewakili satu unit keluarga (tenant lokal).
- `id`: UUID (PK)
- `name`: VARCHAR(100) — Nama keluarga (contoh: "Keluarga Pratama")
- `created_at`: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
- `updated_at`: TIMESTAMP DEFAULT CURRENT_TIMESTAMP

### 2.2 `users`
Akun pengguna di dalam keluarga.
- `id`: UUID (PK)
- `family_id`: UUID (FK -> `families.id`)
- `role`: VARCHAR(20) — `'PARENT'` | `'CHILD'`
- `username`: VARCHAR(50) UNIQUE
- `display_name`: VARCHAR(100)
- `pin_hash`: VARCHAR(255) — Hash PIN/Password (khusus Parent & Child PIN)
- `created_at`: TIMESTAMP
- `updated_at`: TIMESTAMP

### 2.3 `child_profiles`
Profil karakter anak untuk gamifikasi RPG.
- `id`: UUID (PK)
- `user_id`: UUID UNIQUE (FK -> `users.id`)
- `family_id`: UUID (FK -> `families.id`)
- `avatar_key`: VARCHAR(50) — ID visual avatar RPG (misal: `'brave_knight'`, `'starlight_mage'`)
- `current_level`: INT DEFAULT 1
- `daily_time_limit_minutes`: INT DEFAULT 60 — Batas maksimal layar hiburan per hari
- `max_session_duration_minutes`: INT DEFAULT 30 — Batas durasi per sesi
- `created_at`: TIMESTAMP
- `updated_at`: TIMESTAMP

### 2.4 `quests`
Katalog tugas & kebiasaan positif yang dibuat oleh orang tua.
- `id`: UUID (PK)
- `family_id`: UUID (FK -> `families.id`)
- `title`: VARCHAR(150) — Nama quest (contoh: "Merapikan Tempat Tidur")
- `description`: TEXT — Petunjuk pengerjaan
- `category`: VARCHAR(50) — `'MORNING_ROUTINE'`, `'STUDY'`, `'CHORES'`, `'FITNESS'`, `'KINDNESS'`
- `xp_reward`: INT NOT NULL (misal: 15)
- `time_reward_minutes`: INT NOT NULL (misal: 5)
- `recurrence`: VARCHAR(20) — `'DAILY'`, `'WEEKLY'`, `'ONE_TIME'`
- `is_active`: BOOLEAN DEFAULT TRUE
- `created_at`: TIMESTAMP
- `updated_at`: TIMESTAMP

### 2.5 `quest_assignments`
Penugasan quest kepada anak tertentu.
- `id`: UUID (PK)
- `quest_id`: UUID (FK -> `quests.id`)
- `child_id`: UUID (FK -> `child_profiles.id`)
- `status`: VARCHAR(30) — `'ASSIGNED'`, `'IN_PROGRESS'`, `'PENDING_APPROVAL'`, `'APPROVED'`, `'REVISION_REQUIRED'`, `'EXPIRED'`
- `assigned_date`: DATE NOT NULL
- `due_timestamp`: TIMESTAMP NULL
- `created_at`: TIMESTAMP
- `updated_at`: TIMESTAMP

### 2.6 `quest_submissions`
Bukti penyerahan tugas oleh anak.
- `id`: UUID (PK)
- `assignment_id`: UUID (FK -> `quest_assignments.id`)
- `submitted_at`: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
- `child_notes`: TEXT NULL
- `proof_image_path`: VARCHAR(255) NULL
- `status`: VARCHAR(20) — `'PENDING'`, `'REVIEWED'`

### 2.7 `approvals`
Catatan persetujuan resmi dari orang tua.
- `id`: UUID (PK)
- `submission_id`: UUID (FK -> `quest_submissions.id`)
- `parent_user_id`: UUID (FK -> `users.id`)
- `decision`: VARCHAR(20) — `'APPROVED'`, `'REJECTED'`, `'NEEDS_REVISION'`
- `feedback`: TEXT NULL
- `reviewed_at`: TIMESTAMP DEFAULT CURRENT_TIMESTAMP

### 2.8 `xp_transactions` (Ledger XP)
Buku besar mutasi XP anak (Append-only).
- `id`: UUID (PK)
- `child_id`: UUID (FK -> `child_profiles.id`)
- `amount`: INT NOT NULL (selalu positif)
- `type`: VARCHAR(30) — `'QUEST_APPROVED'`, `'ACHIEVEMENT_UNLOCKED'`, `'BONUS'`, `'ADJUSTMENT'`
- `reference_id`: UUID NULL — ID assignment / approval terkait
- `idempotency_key`: VARCHAR(100) UNIQUE NOT NULL
- `description`: VARCHAR(255) NOT NULL
- `created_at`: TIMESTAMP DEFAULT CURRENT_TIMESTAMP

### 2.9 `time_transactions` (Ledger Time Wallet)
Buku besar mutasi menit waktu hiburan anak (Append-only).
- `id`: UUID (PK)
- `child_id`: UUID (FK -> `child_profiles.id`)
- `minutes`: INT NOT NULL — Nilai mutasi (+ untuk Kredit, - untuk Debit)
- `type`: VARCHAR(30) — `'QUEST_CREDIT'`, `'SESSION_DEBIT'`, `'PARENT_ADJUSTMENT'`, `'CONSEQUENCE_DEBIT'`
- `reference_id`: UUID NULL — ID sesi / approval / konsekuensi terkait
- `idempotency_key`: VARCHAR(100) UNIQUE NOT NULL
- `description`: VARCHAR(255) NOT NULL
- `created_at`: TIMESTAMP DEFAULT CURRENT_TIMESTAMP

### 2.10 `time_sessions`
Pencatatan sesi penggunaan screen-time hiburan.
- `id`: UUID (PK)
- `child_id`: UUID (FK -> `child_profiles.id`)
- `category`: VARCHAR(50) — `'GAMING'`, `'YOUTUBE'`, `'OTHER_ENTERTAINMENT'`
- `status`: VARCHAR(20) — `'ACTIVE'`, `'PAUSED'`, `'COMPLETED'`, `'CANCELED'`
- `started_at`: TIMESTAMP NOT NULL
- `paused_at`: TIMESTAMP NULL
- `ended_at`: TIMESTAMP NULL
- `duration_minutes`: INT NOT NULL — Durasi yang direncanakan
- `actual_used_minutes`: INT DEFAULT 0 — Menit aktual yang digunakan
- `created_at`: TIMESTAMP DEFAULT CURRENT_TIMESTAMP

### 2.11 `consequences`
Daftar konsekuensi yang disepakati bersama.
- `id`: UUID (PK)
- `family_id`: UUID (FK -> `families.id`)
- `child_id`: UUID (FK -> `child_profiles.id`)
- `behavior_description`: TEXT NOT NULL
- `restorative_action`: TEXT NOT NULL
- `time_deduction_minutes`: INT DEFAULT 0
- `status`: VARCHAR(20) — `'PENDING_REVIEW'`, `'APPLIED'`, `'COMPLETED'`
- `created_at`: TIMESTAMP
- `resolved_at`: TIMESTAMP NULL

### 2.12 `achievements` & `child_achievements`
Piala pencapaian RPG (milestone).
- `achievements`: `id`, `code`, `title`, `description`, `icon_key`, `xp_bonus`, `required_quests_count`
- `child_achievements`: `id`, `child_id`, `achievement_id`, `unlocked_at`

### 2.13 `levels`
Tabel referensi level kumulatif XP.
- `level_number`: INT (PK)
- `title`: VARCHAR(50) — Contoh: 'Novice Explorer', 'Apprentice Adventurer', 'Master Guardian'
- `min_xp`: INT NOT NULL
- `max_xp`: INT NULL

### 2.14 `audit_logs`
Pencatatan aktivitas sensitif untuk transparansi keluarga.
- `id`: UUID (PK)
- `family_id`: UUID (FK -> `families.id`)
- `user_id`: UUID (FK -> `users.id`)
- `action`: VARCHAR(100) NOT NULL
- `entity_type`: VARCHAR(50) NOT NULL
- `entity_id`: UUID NULL
- `metadata_json`: TEXT NULL
- `created_at`: TIMESTAMP DEFAULT CURRENT_TIMESTAMP

---

## 3. Indeks Kinerja & Integritas Transaksi
- Indeks pada `(child_id, created_at)` pada tabel `xp_transactions` dan `time_transactions` untuk komputasi cepat saldo ledger.
- Indeks unik pada `idempotency_key` untuk menjamin tidak ada duplikasi transaksi akibat jaringan tidak stabil atau pengiriman berulang.
- Indeks pada `(child_id, status)` pada `time_sessions` untuk memastikan validasi "1 anak hanya boleh memiliki 1 sesi aktif".
