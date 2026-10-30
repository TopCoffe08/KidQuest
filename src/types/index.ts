/**
 * KIDQUEST TypeScript Domain Types & Interfaces
 * Sesuai dengan spesifikasi MASTER-PROMPT.md, PRD.md, dan DATABASE.md
 */

export type UserRole = 'PARENT' | 'CHILD';

export interface User {
  id: string;
  familyId: string;
  username: string;
  displayName: string;
  role: UserRole;
  avatarUrl?: string;
}

export interface ChildProfile {
  id: string;
  userId: string;
  familyId: string;
  displayName: string;
  avatarKey: string;
  currentLevel: number;
  totalXp: number;
  timeWalletMinutes: number;
  dailyTimeLimitMinutes: number;
  maxSessionDurationMinutes: number;
  todayUsedMinutes: number;
}

export type QuestCategory =
  | 'MORNING_ROUTINE'
  | 'STUDY'
  | 'CHORES'
  | 'FITNESS'
  | 'KINDNESS'
  | 'HEALTH';

export type QuestStatus =
  | 'DRAFT'
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'PENDING_APPROVAL'
  | 'APPROVED'
  | 'REVISION_REQUIRED'
  | 'REJECTED'
  | 'EXPIRED';

export interface Quest {
  id: string;
  familyId: string;
  title: string;
  description: string;
  category: QuestCategory;
  xpReward: number;
  timeRewardMinutes: number;
  recurrence: 'DAILY' | 'WEEKLY' | 'ONE_TIME';
  iconKey?: string;
}

export interface QuestAssignment {
  id: string;
  questId: string;
  quest: Quest;
  childId: string;
  status: QuestStatus;
  assignedDate: string; // YYYY-MM-DD
  submittedAt?: string;
  childNotes?: string;
  reviewedAt?: string;
  parentFeedback?: string;
}

export type XpTransactionType =
  | 'QUEST_APPROVED'
  | 'ACHIEVEMENT_UNLOCKED'
  | 'BONUS'
  | 'ADJUSTMENT';

export interface XpTransaction {
  id: string;
  childId: string;
  amount: number;
  type: XpTransactionType;
  referenceId?: string;
  idempotencyKey: string;
  description: string;
  createdAt: string;
}

export type TimeTransactionType =
  | 'QUEST_CREDIT'
  | 'SESSION_DEBIT'
  | 'PARENT_ADJUSTMENT'
  | 'CONSEQUENCE_DEBIT';

export interface TimeTransaction {
  id: string;
  childId: string;
  minutes: number; // positive for credit, negative for debit
  type: TimeTransactionType;
  referenceId?: string;
  idempotencyKey: string;
  description: string;
  createdAt: string;
}

export type TimeSessionStatus = 'IDLE' | 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'CANCELED';

export interface TimeSession {
  id: string;
  childId: string;
  category: 'GAMING' | 'YOUTUBE' | 'OTHER_ENTERTAINMENT';
  status: TimeSessionStatus;
  startedAt: string; // ISO string
  durationMinutes: number;
  remainingSeconds: number;
  actualUsedMinutes: number;
}

export interface Achievement {
  id: string;
  code: string;
  title: string;
  description: string;
  iconKey: string;
  xpBonus: number;
  unlockedAt?: string;
}

export interface Consequence {
  id: string;
  familyId: string;
  childId: string;
  behaviorDescription: string;
  restorativeAction: string;
  timeDeductionMinutes: number;
  status: 'PENDING_REVIEW' | 'APPLIED' | 'COMPLETED';
  createdAt: string;
  resolvedAt?: string;
}

export interface AuditLog {
  id: string;
  familyId: string;
  userId: string;
  action: string;
  entityType: string;
  entityId?: string;
  description: string;
  createdAt: string;
}

export interface LevelThreshold {
  level: number;
  title: string;
  minXp: number;
  maxXp: number;
  badge: string;
}
