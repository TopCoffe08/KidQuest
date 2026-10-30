import {
  Achievement,
  AuditLog,
  ChildProfile,
  Consequence,
  Quest,
  QuestAssignment,
  TimeSession,
  TimeTransaction,
  User,
  XpTransaction,
} from '../types';
import { calculateLevel, computeTimeBalance, computeTotalXp } from './gameEngine';

const STORAGE_KEY = 'KIDQUEST_V1_STATE';

export interface KidQuestState {
  currentUser: User;
  children: ChildProfile[];
  quests: Quest[];
  assignments: QuestAssignment[];
  xpTransactions: XpTransaction[];
  timeTransactions: TimeTransaction[];
  activeSessions: TimeSession[];
  achievements: Achievement[];
  consequences: Consequence[];
  auditLogs: AuditLog[];
}

export const INITIAL_STATE: KidQuestState = {
  currentUser: {
    id: 'user-parent-1',
    familyId: 'family-pratama',
    username: 'ayah_budi',
    displayName: 'Ayah Budi',
    role: 'PARENT',
  },
  children: [
    {
      id: 'child-kenzo',
      userId: 'user-child-1',
      familyId: 'family-pratama',
      displayName: 'Kenzo',
      avatarKey: 'brave_knight',
      currentLevel: 2,
      totalXp: 140,
      timeWalletMinutes: 35,
      dailyTimeLimitMinutes: 60,
      maxSessionDurationMinutes: 30,
      todayUsedMinutes: 15,
    },
    {
      id: 'child-alina',
      userId: 'user-child-2',
      familyId: 'family-pratama',
      displayName: 'Alina',
      avatarKey: 'starlight_mage',
      currentLevel: 1,
      totalXp: 65,
      timeWalletMinutes: 20,
      dailyTimeLimitMinutes: 45,
      maxSessionDurationMinutes: 20,
      todayUsedMinutes: 0,
    },
  ],
  quests: [
    {
      id: 'quest-1',
      familyId: 'family-pratama',
      title: 'Merapikan Tempat Tidur',
      description: 'Rapikan bantal, guling, dan selimut setelah bangun tidur pagi.',
      category: 'MORNING_ROUTINE',
      xpReward: 15,
      timeRewardMinutes: 5,
      recurrence: 'DAILY',
    },
    {
      id: 'quest-2',
      familyId: 'family-pratama',
      title: 'Membaca Buku 15 Menit',
      description: 'Membaca 1 bab buku cerita petualangan atau ensiklopedia anak.',
      category: 'STUDY',
      xpReward: 20,
      timeRewardMinutes: 10,
      recurrence: 'DAILY',
    },
    {
      id: 'quest-3',
      familyId: 'family-pratama',
      title: 'Membantu Merapikan Meja Makan',
      description: 'Membawa piring sendiri ke tempat cuci piring setelah sarapan.',
      category: 'CHORES',
      xpReward: 15,
      timeRewardMinutes: 10,
      recurrence: 'DAILY',
    },
    {
      id: 'quest-4',
      familyId: 'family-pratama',
      title: 'Menyikat Gigi Sebelum Tidur',
      description: 'Gosok gigi hingga bersih minimal 2 menit sebelum istirahat.',
      category: 'HEALTH',
      xpReward: 10,
      timeRewardMinutes: 5,
      recurrence: 'DAILY',
    },
  ],
  assignments: [
    {
      id: 'assign-1',
      questId: 'quest-2',
      quest: {
        id: 'quest-2',
        familyId: 'family-pratama',
        title: 'Membaca Buku 15 Menit',
        description: 'Membaca 1 bab buku cerita petualangan atau ensiklopedia anak.',
        category: 'STUDY',
        xpReward: 20,
        timeRewardMinutes: 10,
        recurrence: 'DAILY',
      },
      childId: 'child-kenzo',
      status: 'PENDING_APPROVAL',
      assignedDate: '2026-10-30',
      submittedAt: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
      childNotes: 'Kenzo sudah selesai membaca bab 3 petualangan ksatria singa!',
    },
    {
      id: 'assign-2',
      questId: 'quest-1',
      quest: {
        id: 'quest-1',
        familyId: 'family-pratama',
        title: 'Merapikan Tempat Tidur',
        description: 'Rapikan bantal, guling, dan selimut setelah bangun tidur pagi.',
        category: 'MORNING_ROUTINE',
        xpReward: 15,
        timeRewardMinutes: 5,
        recurrence: 'DAILY',
      },
      childId: 'child-kenzo',
      status: 'IN_PROGRESS',
      assignedDate: '2026-10-30',
    },
    {
      id: 'assign-3',
      questId: 'quest-3',
      quest: {
        id: 'quest-3',
        familyId: 'family-pratama',
        title: 'Membantu Merapikan Meja Makan',
        description: 'Membawa piring sendiri ke tempat cuci piring setelah sarapan.',
        category: 'CHORES',
        xpReward: 15,
        timeRewardMinutes: 10,
        recurrence: 'DAILY',
      },
      childId: 'child-kenzo',
      status: 'ASSIGNED',
      assignedDate: '2026-10-30',
    },
  ],
  xpTransactions: [
    {
      id: 'xp-tx-1',
      childId: 'child-kenzo',
      amount: 100,
      type: 'ACHIEVEMENT_UNLOCKED',
      idempotencyKey: 'init-kenzo-1',
      description: 'Bonus Selamat Datang di Petualangan KIDQUEST',
      createdAt: '2026-10-28T08:00:00.000Z',
    },
    {
      id: 'xp-tx-2',
      childId: 'child-kenzo',
      amount: 40,
      type: 'QUEST_APPROVED',
      idempotencyKey: 'init-kenzo-2',
      description: 'Menyelesaikan Quest Tugas Sekolah',
      createdAt: '2026-10-29T10:00:00.000Z',
    },
    {
      id: 'xp-tx-3',
      childId: 'child-alina',
      amount: 65,
      type: 'QUEST_APPROVED',
      idempotencyKey: 'init-alina-1',
      description: 'Membaca Buku Cerita Dongeng',
      createdAt: '2026-10-29T11:00:00.000Z',
    },
  ],
  timeTransactions: [
    {
      id: 'time-tx-1',
      childId: 'child-kenzo',
      minutes: 25,
      type: 'QUEST_CREDIT',
      idempotencyKey: 'time-init-1',
      description: 'Bonus Quest Selesai',
      createdAt: '2026-10-29T10:00:00.000Z',
    },
    {
      id: 'time-tx-2',
      childId: 'child-kenzo',
      minutes: 20,
      type: 'PARENT_ADJUSTMENT',
      idempotencyKey: 'time-init-2',
      description: 'Apresiasi Membantu Bersih-Bersih Ruang Tamu',
      createdAt: '2026-10-29T14:00:00.000Z',
    },
    {
      id: 'time-tx-3',
      childId: 'child-kenzo',
      minutes: -10,
      type: 'SESSION_DEBIT',
      idempotencyKey: 'time-init-3',
      description: 'Sesi Menonton Video Edukasi Hewan',
      createdAt: '2026-10-29T16:00:00.000Z',
    },
    {
      id: 'time-tx-4',
      childId: 'child-alina',
      minutes: 20,
      type: 'QUEST_CREDIT',
      idempotencyKey: 'time-alina-1',
      description: 'Bonus Quest Menggambar',
      createdAt: '2026-10-29T11:00:00.000Z',
    },
  ],
  activeSessions: [],
  achievements: [
    {
      id: 'ach-1',
      code: 'FIRST_STEP',
      title: 'Langkah Pertama',
      description: 'Menyelesaikan quest pertama di KIDQUEST.',
      iconKey: '🌱',
      xpBonus: 25,
      unlockedAt: '2026-10-28T09:00:00.000Z',
    },
    {
      id: 'ach-2',
      code: 'EARLY_RISER',
      title: 'Ksatria Fajar',
      description: 'Merapikan tempat tidur 3 hari berturut-turut.',
      iconKey: '☀️',
      xpBonus: 50,
    },
    {
      id: 'ach-3',
      code: 'KIND_HEART',
      title: 'Hati Emas',
      description: 'Membantu pekerjaan orang tua tanpa diminta.',
      iconKey: '💖',
      xpBonus: 40,
    },
  ],
  consequences: [
    {
      id: 'con-1',
      familyId: 'family-pratama',
      childId: 'child-kenzo',
      behaviorDescription: 'Lupa mematikan game saat waktu istirahat tiba.',
      restorativeAction: 'Membantu merapikan rak mainan bersama sebelum sesi hiburan berikutnya.',
      timeDeductionMinutes: 5,
      status: 'COMPLETED',
      createdAt: '2026-10-27T18:00:00.000Z',
      resolvedAt: '2026-10-28T08:30:00.000Z',
    },
  ],
  auditLogs: [
    {
      id: 'log-1',
      familyId: 'family-pratama',
      userId: 'user-parent-1',
      action: 'SYSTEM_INIT',
      entityType: 'FAMILY',
      description: 'KIDQUEST diinisialisasi untuk Keluarga Pratama',
      createdAt: '2026-10-28T07:00:00.000Z',
    },
  ],
};

export class StorageService {
  private static loadState(): KidQuestState {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch {
      // ignore
    }
    return INITIAL_STATE;
  }

  private static saveState(state: KidQuestState): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore
    }
  }

  static getState(): KidQuestState {
    const state = this.loadState();
    // Refresh computed balances from ledger
    state.children = state.children.map((child) => {
      const childXpTxs = state.xpTransactions.filter((tx) => tx.childId === child.id);
      const childTimeTxs = state.timeTransactions.filter((tx) => tx.childId === child.id);

      const totalXp = computeTotalXp(childXpTxs);
      const timeWalletMinutes = computeTimeBalance(childTimeTxs);
      const { level } = calculateLevel(totalXp);

      return {
        ...child,
        totalXp,
        timeWalletMinutes,
        currentLevel: level,
      };
    });
    return state;
  }

  static resetToDefault(): KidQuestState {
    this.saveState(INITIAL_STATE);
    return INITIAL_STATE;
  }

  /**
   * Anak mengajukan quest untuk diperiksa orang tua
   */
  static submitQuest(assignmentId: string, notes?: string): KidQuestState {
    const state = this.loadState();
    const assignment = state.assignments.find((a) => a.id === assignmentId);
    if (!assignment) return state;

    assignment.status = 'PENDING_APPROVAL';
    assignment.submittedAt = new Date().toISOString();
    assignment.childNotes = notes || 'Quest sudah selesai dikerjakan!';

    state.auditLogs.unshift({
      id: `log-${Date.now()}`,
      familyId: state.currentUser.familyId,
      userId: state.currentUser.id,
      action: 'QUEST_SUBMITTED',
      entityType: 'QUEST_ASSIGNMENT',
      entityId: assignmentId,
      description: `Anak mengajukan penyelesaian quest: "${assignment.quest.title}"`,
      createdAt: new Date().toISOString(),
    });

    this.saveState(state);
    return this.getState();
  }

  /**
   * Keputusan Orang Tua: Menyetujui atau Meminta Revisi
   */
  static reviewSubmission(
    assignmentId: string,
    decision: 'APPROVED' | 'REVISION_REQUIRED' | 'REJECTED',
    feedback?: string
  ): KidQuestState {
    const state = this.loadState();
    const assignment = state.assignments.find((a) => a.id === assignmentId);
    if (!assignment) return state;

    assignment.status = decision;
    assignment.reviewedAt = new Date().toISOString();
    assignment.parentFeedback = feedback;

    if (decision === 'APPROVED') {
      const childId = assignment.childId;
      const idempotencyKey = `appr-${assignment.id}-${Date.now()}`;

      // 1. Catat ke Ledger XP
      state.xpTransactions.push({
        id: `xp-tx-${Date.now()}`,
        childId,
        amount: assignment.quest.xpReward,
        type: 'QUEST_APPROVED',
        referenceId: assignment.id,
        idempotencyKey: `xp-${idempotencyKey}`,
        description: `Quest Disetujui: ${assignment.quest.title}`,
        createdAt: new Date().toISOString(),
      });

      // 2. Catat ke Ledger Time Wallet
      state.timeTransactions.push({
        id: `time-tx-${Date.now()}`,
        childId,
        minutes: assignment.quest.timeRewardMinutes,
        type: 'QUEST_CREDIT',
        referenceId: assignment.id,
        idempotencyKey: `time-${idempotencyKey}`,
        description: `Bonus Waktu Quest: ${assignment.quest.title}`,
        createdAt: new Date().toISOString(),
      });

      // 3. Catat Audit Log
      state.auditLogs.unshift({
        id: `log-${Date.now()}`,
        familyId: state.currentUser.familyId,
        userId: state.currentUser.id,
        action: 'QUEST_APPROVED',
        entityType: 'QUEST_ASSIGNMENT',
        entityId: assignmentId,
        description: `Orang tua menyetujui "${assignment.quest.title}". (+${assignment.quest.xpReward} XP, +${assignment.quest.timeRewardMinutes} Menit)`,
        createdAt: new Date().toISOString(),
      });
    } else {
      state.auditLogs.unshift({
        id: `log-${Date.now()}`,
        familyId: state.currentUser.familyId,
        userId: state.currentUser.id,
        action: decision === 'REVISION_REQUIRED' ? 'QUEST_REVISION_REQUESTED' : 'QUEST_REJECTED',
        entityType: 'QUEST_ASSIGNMENT',
        entityId: assignmentId,
        description: `Orang tua memberikan feedback untuk "${assignment.quest.title}": ${feedback || 'Perlu diperbaiki.'}`,
        createdAt: new Date().toISOString(),
      });
    }

    this.saveState(state);
    return this.getState();
  }

  /**
   * Menambahkan Quest Baru ke Katalog
   */
  static createQuest(questData: Omit<Quest, 'id' | 'familyId'>, assignToChildId?: string): KidQuestState {
    const state = this.loadState();
    const newQuest: Quest = {
      ...questData,
      id: `quest-${Date.now()}`,
      familyId: state.currentUser.familyId,
    };

    state.quests.push(newQuest);

    if (assignToChildId) {
      state.assignments.push({
        id: `assign-${Date.now()}`,
        questId: newQuest.id,
        quest: newQuest,
        childId: assignToChildId,
        status: 'ASSIGNED',
        assignedDate: new Date().toISOString().split('T')[0],
      });
    }

    state.auditLogs.unshift({
      id: `log-${Date.now()}`,
      familyId: state.currentUser.familyId,
      userId: state.currentUser.id,
      action: 'QUEST_CREATED',
      entityType: 'QUEST',
      entityId: newQuest.id,
      description: `Quest baru dibuat: "${newQuest.title}" (+${newQuest.xpReward} XP, +${newQuest.timeRewardMinutes}m)`,
      createdAt: new Date().toISOString(),
    });

    this.saveState(state);
    return this.getState();
  }

  /**
   * Koreksi Saldo Waktu (Parent Ledger Adjustment)
   */
  static adjustTimeWallet(childId: string, minutes: number, reason: string): KidQuestState {
    const state = this.loadState();
    const child = state.children.find((c) => c.id === childId);
    if (!child) return state;

    state.timeTransactions.push({
      id: `time-tx-${Date.now()}`,
      childId,
      minutes,
      type: 'PARENT_ADJUSTMENT',
      idempotencyKey: `adj-${Date.now()}`,
      description: reason || 'Penyesuaian waktu oleh orang tua',
      createdAt: new Date().toISOString(),
    });

    state.auditLogs.unshift({
      id: `log-${Date.now()}`,
      familyId: state.currentUser.familyId,
      userId: state.currentUser.id,
      action: 'TIME_ADJUSTMENT',
      entityType: 'TIME_TRANSACTION',
      description: `Penyesuaian saldo waktu ${child.displayName}: ${minutes >= 0 ? '+' : ''}${minutes} menit (${reason})`,
      createdAt: new Date().toISOString(),
    });

    this.saveState(state);
    return this.getState();
  }

  /**
   * Time Manager: Mulai Sesi Timer Hiburan
   */
  static startSession(
    childId: string,
    category: 'GAMING' | 'YOUTUBE' | 'OTHER_ENTERTAINMENT',
    minutes: number
  ): { success: boolean; error?: string; state: KidQuestState } {
    const state = this.loadState();
    const child = state.children.find((c) => c.id === childId);
    if (!child) return { success: false, error: 'Profil anak tidak ditemukan.', state };

    // Validasi saldo
    const currentBalance = computeTimeBalance(state.timeTransactions.filter((tx) => tx.childId === childId));
    if (currentBalance < minutes) {
      return { success: false, error: `Saldo waktu tidak mencukupi (Tersedia: ${currentBalance} menit).`, state };
    }

    // Validasi sesi aktif
    const existingActive = state.activeSessions.find((s) => s.childId === childId && s.status === 'ACTIVE');
    if (existingActive) {
      return { success: false, error: 'Sudah ada sesi hiburan aktif yang sedang berjalan.', state };
    }

    const session: TimeSession = {
      id: `session-${Date.now()}`,
      childId,
      category,
      status: 'ACTIVE',
      startedAt: new Date().toISOString(),
      durationMinutes: minutes,
      remainingSeconds: minutes * 60,
      actualUsedMinutes: 0,
    };

    state.activeSessions = state.activeSessions.filter((s) => s.childId !== childId);
    state.activeSessions.push(session);

    this.saveState(state);
    return { success: true, state: this.getState() };
  }

  /**
   * Time Manager: Akhiri Sesi Timer & Potong Saldo dari Durasi Aktual
   */
  static endSession(childId: string, actualUsedMinutes: number): KidQuestState {
    const state = this.loadState();
    const sessionIndex = state.activeSessions.findIndex((s) => s.childId === childId);
    if (sessionIndex === -1) return state;

    const session = state.activeSessions[sessionIndex];
    session.status = 'COMPLETED';
    session.actualUsedMinutes = actualUsedMinutes;

    // Catat mutasi DEBIT di ledger Time Wallet
    if (actualUsedMinutes > 0) {
      state.timeTransactions.push({
        id: `time-tx-${Date.now()}`,
        childId,
        minutes: -actualUsedMinutes,
        type: 'SESSION_DEBIT',
        idempotencyKey: `sess-${session.id}`,
        description: `Penggunaan Hiburan (${session.category})`,
        createdAt: new Date().toISOString(),
      });
    }

    state.activeSessions.splice(sessionIndex, 1);

    this.saveState(state);
    return this.getState();
  }
}
