import React, { useState } from 'react';
import {
  AuditLog,
  ChildProfile,
  Consequence,
  Quest,
  QuestAssignment,
  QuestCategory,
  TimeSession,
  TimeTransaction,
  User,
  XpTransaction,
} from '../types';
import { QUEST_CATEGORY_META, AVATAR_PRESETS } from '../services/gameEngine';
import {
  CheckCircle2,
  XCircle,
  Plus,
  Clock,
  Shield,
  Sparkles,
  AlertTriangle,
  FileText,
  Download,
  Upload,
  UserCheck,
  TrendingUp,
  Settings,
  Scale,
  MessageSquare,
  BarChart3,
  Scroll,
  X,
  Sliders,
  History,
} from 'lucide-react';

interface ParentViewProps {
  currentUser: User;
  childrenList: ChildProfile[];
  quests: Quest[];
  assignments: QuestAssignment[];
  xpTransactions: XpTransaction[];
  timeTransactions: TimeTransaction[];
  activeSessions: TimeSession[];
  consequences: Consequence[];
  auditLogs: AuditLog[];
  onReviewSubmission: (
    assignmentId: string,
    decision: 'APPROVED' | 'REVISION_REQUIRED' | 'REJECTED',
    feedback?: string
  ) => void;
  onCreateQuest: (questData: Omit<Quest, 'id' | 'familyId'>, assignToChildId?: string) => void;
  onAdjustTimeWallet: (childId: string, minutes: number, reason: string) => void;
  onExportBackup: () => void;
  onImportBackup: (jsonString: string) => void;
}

type ParentTabType =
  | 'OVERVIEW'
  | 'APPROVALS'
  | 'QUESTS'
  | 'TIME_WALLET'
  | 'CONSEQUENCES'
  | 'ANALYTICS'
  | 'AUDIT'
  | 'BACKUP';

export const ParentView: React.FC<ParentViewProps> = ({
  childrenList,
  quests,
  assignments,
  xpTransactions,
  timeTransactions,
  activeSessions,
  consequences,
  auditLogs,
  onReviewSubmission,
  onCreateQuest,
  onAdjustTimeWallet,
  onExportBackup,
  onImportBackup,
}) => {
  const [activeTab, setActiveTab] = useState<ParentTabType>('OVERVIEW');

  // Modals state
  const [isCreateQuestOpen, setIsCreateQuestOpen] = useState(false);
  const [isAdjustTimeOpen, setIsAdjustTimeOpen] = useState(false);
  const [selectedSubmissionForReview, setSelectedSubmissionForReview] = useState<QuestAssignment | null>(null);
  const [reviewFeedback, setReviewFeedback] = useState('');

  // Form states for new quest
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newCategory, setNewCategory] = useState<QuestCategory>('CHORES');
  const [newXpReward, setNewXpReward] = useState(15);
  const [newTimeReward, setNewTimeReward] = useState(10);
  const [newRecurrence, setNewRecurrence] = useState<'DAILY' | 'WEEKLY' | 'ONE_TIME'>('DAILY');
  const [assignChildId, setAssignChildId] = useState(childrenList[0]?.id || '');

  // Form states for adjust time
  const [adjustChildId, setAdjustChildId] = useState(childrenList[0]?.id || '');
  const [adjustMinutes, setAdjustMinutes] = useState(10);
  const [adjustReason, setAdjustReason] = useState('');

  const pendingApprovals = assignments.filter((a) => a.status === 'PENDING_APPROVAL');

  const handleOpenReview = (assignment: QuestAssignment) => {
    setSelectedSubmissionForReview(assignment);
    setReviewFeedback('');
  };

  const handleConfirmReview = (decision: 'APPROVED' | 'REVISION_REQUIRED' | 'REJECTED') => {
    if (!selectedSubmissionForReview) return;
    onReviewSubmission(selectedSubmissionForReview.id, decision, reviewFeedback);
    setSelectedSubmissionForReview(null);
  };

  const handleFormCreateQuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onCreateQuest(
      {
        title: newTitle.trim(),
        description: newDescription.trim(),
        category: newCategory,
        xpReward: Number(newXpReward),
        timeRewardMinutes: Number(newTimeReward),
        recurrence: newRecurrence,
      },
      assignChildId || undefined
    );

    setNewTitle('');
    setNewDescription('');
    setIsCreateQuestOpen(false);
  };

  const handleFormAdjustTime = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustReason.trim()) return;
    onAdjustTimeWallet(adjustChildId, Number(adjustMinutes), adjustReason.trim());
    setAdjustReason('');
    setIsAdjustTimeOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-28 lg:pb-16">
      {/* Top Banner - Parent Control Room */}
      <div className="bg-slate-900 text-white pt-6 pb-10 px-4 sm:px-6 shadow-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">🛡️</span>
              <h1 className="text-xl sm:text-2xl font-black font-game tracking-wide text-white">
                Portal Kontrol Orang Tua
              </h1>
              <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                Admin
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Evaluasi quest anak, pantau saldo screen-time, dan tegakkan kebiasaan positif.
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setIsCreateQuestOpen(true)}
              className="flex-1 sm:flex-initial px-4 py-2.5 min-h-[44px] rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Buat Quest
            </button>
            <button
              onClick={() => setIsAdjustTimeOpen(true)}
              className="flex-1 sm:flex-initial px-4 py-2.5 min-h-[44px] rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 border border-slate-700 text-slate-200 font-bold text-xs transition flex items-center justify-center gap-1.5"
            >
              <Clock className="w-4 h-4 text-amber-400" /> Atur Saldo
            </button>
          </div>
        </div>
      </div>

      {/* Desktop/Tablet Segmented Navigation (Hidden on Smartphone) */}
      <div className="max-w-7xl mx-auto px-4 -mt-4 hidden lg:block">
        <div className="bg-white rounded-2xl shadow-md p-1.5 flex gap-1 border border-slate-200">
          <button
            onClick={() => setActiveTab('OVERVIEW')}
            className={`px-3.5 py-2.5 min-h-[44px] rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'OVERVIEW' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            📊 Ringkasan
          </button>
          <button
            onClick={() => setActiveTab('APPROVALS')}
            className={`flex items-center gap-1.5 px-3.5 py-2.5 min-h-[44px] rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'APPROVALS' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            ✅ Persetujuan
            {pendingApprovals.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px] font-bold">
                {pendingApprovals.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('QUESTS')}
            className={`px-3.5 py-2.5 min-h-[44px] rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'QUESTS' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            📜 Quest ({quests.length})
          </button>
          <button
            onClick={() => setActiveTab('TIME_WALLET')}
            className={`px-3.5 py-2.5 min-h-[44px] rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'TIME_WALLET' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            ⏳ Dompet Waktu
          </button>
          <button
            onClick={() => setActiveTab('CONSEQUENCES')}
            className={`px-3.5 py-2.5 min-h-[44px] rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'CONSEQUENCES' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            ⚖️ Konsekuensi
          </button>
          <button
            onClick={() => setActiveTab('ANALYTICS')}
            className={`px-3.5 py-2.5 min-h-[44px] rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'ANALYTICS' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            📈 Laporan
          </button>
          <button
            onClick={() => setActiveTab('AUDIT')}
            className={`px-3.5 py-2.5 min-h-[44px] rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'AUDIT' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            🛡️ Audit Log
          </button>
          <button
            onClick={() => setActiveTab('BACKUP')}
            className={`px-3.5 py-2.5 min-h-[44px] rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'BACKUP' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            💾 Backup
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 mt-4 sm:mt-6">
        {/* Pending Approvals Urgent Notice */}
        {pendingApprovals.length > 0 && activeTab !== 'APPROVALS' && (
          <div className="mb-5 p-4 rounded-2xl bg-amber-50/90 border border-amber-300 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl shrink-0">🔔</span>
              <div>
                <h4 className="font-bold text-sm text-amber-900 font-game">
                  Ada {pendingApprovals.length} pengajuan quest yang menunggu persetujuan Anda!
                </h4>
                <p className="text-xs text-amber-700 mt-0.5">
                  Tinjau hasil tugas anak untuk memberikan reward XP dan menit waktu secara akurat.
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('APPROVALS')}
              className="w-full sm:w-auto px-4 py-2 min-h-[40px] rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-amber-950 font-bold text-xs shadow-xs text-center shrink-0"
            >
              Buka Pusat Persetujuan
            </button>
          </div>
        )}

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'OVERVIEW' && (
          <div className="space-y-5">
            {/* Child Profiles Quick Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {childrenList.map((child) => {
                const avatar = AVATAR_PRESETS.find((a) => a.key === child.avatarKey) || AVATAR_PRESETS[0];
                const activeSession = activeSessions.find((s) => s.childId === child.id && s.status === 'ACTIVE');
                const childPending = assignments.filter((a) => a.childId === child.id && a.status === 'PENDING_APPROVAL');

                return (
                  <div key={child.id} className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs">
                    <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${avatar.bgColor} flex items-center justify-center text-2xl shadow-xs shrink-0`}
                        >
                          {avatar.emoji}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-black text-base text-slate-900 font-game">{child.displayName}</h3>
                            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                              Level {child.currentLevel}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500">{avatar.name}</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">Saldo Waktu</span>
                        <span className="text-xl sm:text-2xl font-black text-amber-600 font-game">
                          {child.timeWalletMinutes} <span className="text-xs text-slate-500 font-sans">m</span>
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mt-3.5 text-center">
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="text-[10px] font-bold text-slate-400 block uppercase">Total XP</span>
                        <span className="text-xs sm:text-sm font-bold text-slate-800">{child.totalXp} XP</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="text-[10px] font-bold text-slate-400 block uppercase">Batas Hari</span>
                        <span className="text-xs sm:text-sm font-bold text-slate-800">{child.dailyTimeLimitMinutes}m</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="text-[10px] font-bold text-slate-400 block uppercase">Maks Sesi</span>
                        <span className="text-xs sm:text-sm font-bold text-slate-800">{child.maxSessionDurationMinutes}m</span>
                      </div>
                    </div>

                    <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      {activeSession ? (
                        <span className="text-rose-600 font-bold flex items-center gap-1.5 animate-pulse">
                          🎮 Sedang bermain ({activeSession.category})
                        </span>
                      ) : (
                        <span className="text-slate-400">Tidak ada sesi aktif</span>
                      )}

                      {childPending.length > 0 && (
                        <span className="text-amber-800 font-bold bg-amber-50 px-2.5 py-0.5 rounded-lg border border-amber-200 text-[11px]">
                          {childPending.length} menunggu review
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 2-Column on Mobile, 4-Column on Desktop Metrics Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Katalog Quest</span>
                <div className="text-2xl font-black text-slate-800 mt-1 font-game">{quests.length}</div>
                <span className="text-[10px] text-slate-500">Misi keluarga aktif</span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Menunggu Review</span>
                <div className="text-2xl font-black text-rose-600 mt-1 font-game">{pendingApprovals.length}</div>
                <span className="text-[10px] text-rose-500 font-medium">Perlu tindakan</span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Ledger XP</span>
                <div className="text-2xl font-black text-amber-500 mt-1 font-game">{xpTransactions.length}</div>
                <span className="text-[10px] text-slate-500">Mutasi tervalidasi</span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Ledger Waktu</span>
                <div className="text-2xl font-black text-indigo-600 mt-1 font-game">{timeTransactions.length}</div>
                <span className="text-[10px] text-slate-500">Mutasi tervalidasi</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: APPROVAL CENTER */}
        {activeTab === 'APPROVALS' && (
          <div className="space-y-5">
            <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-xs border border-slate-200">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-slate-900 font-game">
                    ✅ Pusat Persetujuan Quest
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Tinjau pengajuan tugas anak sebelum mendistribusikan reward XP dan waktu ke ledger.
                  </p>
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                  {pendingApprovals.length} Menunggu Persetujuan
                </span>
              </div>

              {pendingApprovals.length === 0 ? (
                <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                  <h4 className="font-bold text-slate-700 text-sm">Semua Pengajuan Selesai Ditinjau!</h4>
                  <p className="text-xs text-slate-400 mt-1">Belum ada pengajuan baru dari anak saat ini.</p>
                </div>
              ) : (
                <div className="space-y-3.5">
                  {pendingApprovals.map((assignment) => {
                    const child = childrenList.find((c) => c.id === assignment.childId);
                    const catMeta = QUEST_CATEGORY_META[assignment.quest.category];

                    return (
                      <div
                        key={assignment.id}
                        className="p-4 sm:p-5 rounded-2xl border-2 border-amber-200 bg-amber-50/40 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-white text-indigo-900 border border-slate-200">
                              👤 {child?.displayName}
                            </span>
                            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${catMeta.color}`}>
                              {catMeta.icon} {catMeta.label}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              Diajukan: {assignment.submittedAt ? new Date(assignment.submittedAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '-'}
                            </span>
                          </div>

                          <h3 className="font-bold text-slate-900 text-base">{assignment.quest.title}</h3>
                          <p className="text-xs text-slate-600 mt-0.5">{assignment.quest.description}</p>

                          {assignment.childNotes && (
                            <div className="mt-2.5 p-3 rounded-xl bg-white border border-amber-200 text-xs text-slate-700">
                              <span className="font-bold text-amber-900">Catatan Anak:</span> &ldquo;{assignment.childNotes}&rdquo;
                            </div>
                          )}

                          <div className="flex items-center gap-2 mt-3 text-xs font-bold">
                            <span className="text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md border border-amber-200">
                              +{assignment.quest.xpReward} XP
                            </span>
                            <span className="text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-md border border-indigo-200">
                              +{assignment.quest.timeRewardMinutes}m Waktu
                            </span>
                          </div>
                        </div>

                        {/* Touch-Friendly Action Button */}
                        <div className="w-full md:w-auto flex justify-end">
                          <button
                            onClick={() => handleOpenReview(assignment)}
                            className="w-full md:w-auto px-4 py-2.5 min-h-[44px] rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-xs shadow-xs transition flex items-center justify-center gap-1.5"
                          >
                            <UserCheck className="w-4 h-4" /> Periksa & Beri Keputusan
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: QUEST MANAGEMENT */}
        {activeTab === 'QUESTS' && (
          <div className="space-y-5">
            <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-xs border border-slate-200">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-slate-900 font-game">
                    📜 Katalog Quest Keluarga
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Daftar kebiasaan positif yang dapat ditugaskan kepada anak-anak.
                  </p>
                </div>
                <button
                  onClick={() => setIsCreateQuestOpen(true)}
                  className="w-full sm:w-auto px-4 py-2.5 min-h-[44px] rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Buat Quest Baru
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {quests.map((quest) => {
                  const catMeta = QUEST_CATEGORY_META[quest.category];
                  return (
                    <div
                      key={quest.id}
                      className="p-4 rounded-2xl border border-slate-200 bg-white hover:shadow-md transition flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${catMeta.color}`}>
                            {catMeta.icon} {catMeta.label}
                          </span>
                          <span className="text-[10px] font-medium text-slate-400">
                            {quest.recurrence === 'DAILY' ? 'Harian' : 'Sekali'}
                          </span>
                        </div>
                        <h4 className="font-bold text-slate-800 text-base">{quest.title}</h4>
                        <p className="text-xs text-slate-600 mt-1">{quest.description}</p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                            +{quest.xpReward} XP
                          </span>
                          <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">
                            +{quest.timeRewardMinutes}m Waktu
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: TIME WALLET */}
        {activeTab === 'TIME_WALLET' && (
          <div className="space-y-5">
            <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-xs border border-slate-200">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-slate-900 font-game">
                    ⏳ Pengelolaan Saldo Dompet Waktu
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Saldo waktu hiburan dikelola melalui buku besar (ledger) transaksi.
                  </p>
                </div>
                <button
                  onClick={() => setIsAdjustTimeOpen(true)}
                  className="w-full sm:w-auto px-4 py-2.5 min-h-[44px] rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Penyesuaian Saldo Manual
                </button>
              </div>

              {/* Children Balances Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mb-6">
                {childrenList.map((child) => (
                  <div key={child.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-800 text-base">{child.displayName}</h4>
                      <p className="text-xs text-slate-500">
                        Batas: {child.dailyTimeLimitMinutes}m/hari • Maks sesi: {child.maxSessionDurationMinutes}m
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-black text-amber-600 font-game">{child.timeWalletMinutes}</span>
                      <span className="text-xs text-slate-500 ml-1">menit</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Transactions Ledger List */}
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                Ledger Riwayat Transaksi Waktu ({timeTransactions.length})
              </h3>
              <div className="space-y-2">
                {timeTransactions.slice().reverse().map((tx) => {
                  const child = childrenList.find((c) => c.id === tx.childId);
                  const isCredit = tx.minutes >= 0;
                  return (
                    <div key={tx.id} className="p-3 rounded-xl border border-slate-200 bg-white flex items-center justify-between text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-800">{child?.displayName}:</span>
                          <span>{tx.description}</span>
                          <span className="text-[10px] px-2 py-0.2 rounded-full bg-slate-100 text-slate-500 border border-slate-200">
                            {tx.type}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400">
                          {new Date(tx.createdAt).toLocaleDateString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <span className={`font-black font-game text-sm ${isCredit ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {isCredit ? `+${tx.minutes}` : tx.minutes} m
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: CONSEQUENCES */}
        {activeTab === 'CONSEQUENCES' && (
          <div className="space-y-5">
            <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-xs border border-slate-200">
              <h2 className="text-lg sm:text-xl font-black text-slate-900 font-game mb-2">
                ⚖️ Sistem Konsekuensi Restoratif
              </h2>
              <p className="text-xs text-slate-500 mb-4">
                KIDQUEST bukan aplikasi hukuman. Konsekuensi berfokus pada tindakan perbaikan nyata dan penguatan tanggung jawab.
              </p>

              <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 mb-6 text-xs text-indigo-900">
                <strong>Pedoman Utama:</strong>
                <ul className="list-disc pl-5 mt-1 space-y-0.5">
                  <li>Konsekuensi harus proporsional dan disepakati bersama anak.</li>
                  <li>Dilarang membatasi makanan, tidur, pendidikan, atau kebutuhan pokok anak.</li>
                  <li>XP yang telah diperoleh anak tidak dipotong otomatis sebagai hukuman.</li>
                </ul>
              </div>

              <div className="space-y-3">
                {consequences.map((con) => {
                  const child = childrenList.find((c) => c.id === con.childId);
                  return (
                    <div key={con.id} className="p-4 rounded-2xl border border-slate-200 bg-white shadow-2xs">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-800">
                          👤 {child?.displayName}
                        </span>
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          Status: Selesai Direfleksikan
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-800 text-sm">
                        Perilaku: &ldquo;{con.behaviorDescription}&rdquo;
                      </h4>
                      <p className="text-xs text-indigo-700 mt-1 font-medium bg-indigo-50/60 p-2 rounded-lg">
                        <strong>Tindakan Perbaikan:</strong> {con.restorativeAction}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: ANALYTICS */}
        {activeTab === 'ANALYTICS' && (
          <div className="space-y-5">
            <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-xs border border-slate-200">
              <h2 className="text-lg sm:text-xl font-black text-slate-900 font-game mb-4">
                📈 Laporan & Analitik Kebiasaan
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-xs font-bold text-slate-400 uppercase">Tingkat Selesai Quest</span>
                  <div className="text-3xl font-black text-emerald-600 font-game mt-2">88%</div>
                  <p className="text-[11px] text-slate-500 mt-1">Konsistensi anak sangat baik dalam 7 hari terakhir.</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-xs font-bold text-slate-400 uppercase">Rata-rata Screen-Time</span>
                  <div className="text-3xl font-black text-indigo-600 font-game mt-2">25 m</div>
                  <p className="text-[11px] text-slate-500 mt-1">Di bawah batas maksimal harian keluarga.</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-xs font-bold text-slate-400 uppercase">Aktivitas Terbanyak</span>
                  <div className="text-2xl font-black text-amber-600 font-game mt-2">Belajar & Rumah</div>
                  <p className="text-[11px] text-slate-500 mt-1">Kontributor terbesar XP anak.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: AUDIT LOG */}
        {activeTab === 'AUDIT' && (
          <div className="space-y-5">
            <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-xs border border-slate-200">
              <h2 className="text-lg sm:text-xl font-black text-slate-900 font-game mb-4">
                🛡️ Audit Log Transaksi & Aksi
              </h2>
              <div className="space-y-2">
                {auditLogs.map((log) => (
                  <div key={log.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800">{log.action}</span>
                        <span className="text-slate-400">•</span>
                        <span className="text-slate-600">{log.description}</span>
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {new Date(log.createdAt).toLocaleDateString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase px-2 py-0.5 rounded-sm bg-white border border-slate-200">
                      {log.entityType}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 8: BACKUP & RESTORE */}
        {activeTab === 'BACKUP' && (
          <div className="space-y-5">
            <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-xs border border-slate-200">
              <h2 className="text-lg sm:text-xl font-black text-slate-900 font-game mb-2">
                💾 Cadangkan & Pulihkan Data
              </h2>
              <p className="text-xs text-slate-500 mb-6">
                Seluruh data quest, saldo ledger, dan riwayat disimpan secara lokal dan dapat diekspor ke file JSON.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={onExportBackup}
                  className="px-5 py-3 min-h-[44px] rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" /> Ekspor File Backup JSON
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MOBILE FIXED BOTTOM TAB BAR (Confirmed Decision 1) */}
      <nav
        aria-label="Navigasi Portal Orang Tua"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 text-white pb-safe shadow-xl"
      >
        <div className="grid grid-cols-5 items-center h-16 max-w-md mx-auto px-1">
          <button
            onClick={() => setActiveTab('OVERVIEW')}
            className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-colors ${
              activeTab === 'OVERVIEW' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            <span className="text-[10px] tracking-tight mt-1">Ringkasan</span>
          </button>

          <button
            onClick={() => setActiveTab('APPROVALS')}
            className={`flex flex-col items-center justify-center h-full min-h-[44px] relative transition-colors ${
              activeTab === 'APPROVALS' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <CheckCircle2 className="w-5 h-5" />
            <span className="text-[10px] tracking-tight mt-1">Approval</span>
            {pendingApprovals.length > 0 && (
              <span className="absolute top-2 right-4 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
                {pendingApprovals.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('QUESTS')}
            className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-colors ${
              activeTab === 'QUESTS' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Scroll className="w-5 h-5" />
            <span className="text-[10px] tracking-tight mt-1">Quest</span>
          </button>

          <button
            onClick={() => setActiveTab('TIME_WALLET')}
            className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-colors ${
              activeTab === 'TIME_WALLET' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Clock className="w-5 h-5" />
            <span className="text-[10px] tracking-tight mt-1">Dompet</span>
          </button>

          <button
            onClick={() => setActiveTab('AUDIT')}
            className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-colors ${
              activeTab === 'AUDIT' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Shield className="w-5 h-5" />
            <span className="text-[10px] tracking-tight mt-1">Audit</span>
          </button>
        </div>
      </nav>

      {/* MODAL 1: CREATE QUEST (Responsive Bottom-Sheet) */}
      {isCreateQuestOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 max-w-lg w-full shadow-2xl border border-slate-100 max-h-[92vh] overflow-y-auto pb-safe">
            <div className="w-10 h-1 bg-slate-300 rounded-full mx-auto mb-3 sm:hidden" />

            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base sm:text-lg font-black text-slate-900 font-game">Buat Quest Baru</h3>
              <button
                onClick={() => setIsCreateQuestOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:bg-slate-100 min-h-[36px] min-w-[36px] flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormCreateQuest} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Judul Quest:</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Contoh: Merapikan Rak Buku"
                  className="w-full p-3 min-h-[44px] rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Deskripsi & Petunjuk:</label>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Contoh: Susun buku cerita dan buku pelajaran dengan rapi."
                  rows={2}
                  className="w-full p-3 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Kategori:</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as QuestCategory)}
                    className="w-full p-2.5 min-h-[44px] rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="MORNING_ROUTINE">☀️ Rutinitas Pagi</option>
                    <option value="STUDY">📚 Belajar & Tugas</option>
                    <option value="CHORES">🧹 Bantu Rumah</option>
                    <option value="FITNESS">🏃 Olahraga</option>
                    <option value="HEALTH">🦷 Kebersihan Diri</option>
                    <option value="KINDNESS">❤️ Kebaikan</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Tugaskan ke:</label>
                  <select
                    value={assignChildId}
                    onChange={(e) => setAssignChildId(e.target.value)}
                    className="w-full p-2.5 min-h-[44px] rounded-xl border border-slate-300 bg-white"
                  >
                    {childrenList.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.displayName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Reward XP:</label>
                  <input
                    type="number"
                    min={5}
                    max={100}
                    value={newXpReward}
                    onChange={(e) => setNewXpReward(Number(e.target.value))}
                    className="w-full p-2.5 min-h-[44px] rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Reward Waktu (m):</label>
                  <input
                    type="number"
                    min={0}
                    max={60}
                    value={newTimeReward}
                    onChange={(e) => setNewTimeReward(Number(e.target.value))}
                    className="w-full p-2.5 min-h-[44px] rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-3">
                <button
                  type="button"
                  onClick={() => setIsCreateQuestOpen(false)}
                  className="px-4 py-2.5 min-h-[44px] rounded-xl text-slate-600 font-bold hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 min-h-[44px] rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold shadow-md"
                >
                  Simpan & Tugaskan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADJUST TIME */}
      {isAdjustTimeOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 max-w-md w-full shadow-2xl border border-slate-100 pb-safe">
            <div className="w-10 h-1 bg-slate-300 rounded-full mx-auto mb-3 sm:hidden" />

            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base sm:text-lg font-black text-slate-900 font-game">Penyesuaian Saldo Waktu</h3>
              <button
                onClick={() => setIsAdjustTimeOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:bg-slate-100 min-h-[36px] min-w-[36px] flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Setiap perubahan saldo dicatat ke dalam ledger transaksi secara akuntabel.
            </p>

            <form onSubmit={handleFormAdjustTime} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Pilih Anak:</label>
                <select
                  value={adjustChildId}
                  onChange={(e) => setAdjustChildId(e.target.value)}
                  className="w-full p-2.5 min-h-[44px] rounded-xl border border-slate-300 bg-white"
                >
                  {childrenList.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.displayName} (Saldo: {c.timeWalletMinutes}m)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Menit Penyesuaian (+ atau -):</label>
                <input
                  type="number"
                  required
                  value={adjustMinutes}
                  onChange={(e) => setAdjustMinutes(Number(e.target.value))}
                  placeholder="Contoh: 15 atau -10"
                  className="w-full p-2.5 min-h-[44px] rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Alasan Penyesuaian:</label>
                <input
                  type="text"
                  required
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  placeholder="Contoh: Hadiah inisiatif membantu keluarga"
                  className="w-full p-2.5 min-h-[44px] rounded-xl border border-slate-300"
                />
              </div>

              <div className="flex gap-2 justify-end pt-3">
                <button
                  type="button"
                  onClick={() => setIsAdjustTimeOpen(false)}
                  className="px-4 py-2.5 min-h-[44px] rounded-xl text-slate-600 font-bold hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 min-h-[44px] rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-bold shadow-md"
                >
                  Simpan Transaksi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: REVIEW SUBMISSION */}
      {selectedSubmissionForReview && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 max-w-md w-full shadow-2xl border border-slate-100 pb-safe">
            <div className="w-10 h-1 bg-slate-300 rounded-full mx-auto mb-3 sm:hidden" />

            <h3 className="text-base sm:text-lg font-black text-slate-900 font-game mb-1">
              Peninjauan Pengajuan Quest
            </h3>
            <p className="text-xs text-slate-600 mb-3">
              Quest: <strong>{selectedSubmissionForReview.quest.title}</strong>
            </p>

            {selectedSubmissionForReview.childNotes && (
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 mb-4">
                <strong>Catatan Anak:</strong> &ldquo;{selectedSubmissionForReview.childNotes}&rdquo;
              </div>
            )}

            <div className="mb-4">
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Catatan / Apresiasi untuk Anak (Opsional):
              </label>
              <textarea
                value={reviewFeedback}
                onChange={(e) => setReviewFeedback(e.target.value)}
                placeholder="Contoh: Bagus sekali pengerjaannya! Tetap semangat ya!"
                rows={2}
                className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={() => handleConfirmReview('APPROVED')}
                className="w-full py-3 min-h-[46px] rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs shadow-md flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" /> Setujui (+{selectedSubmissionForReview.quest.xpReward} XP, +{selectedSubmissionForReview.quest.timeRewardMinutes}m)
              </button>

              <button
                onClick={() => handleConfirmReview('REVISION_REQUIRED')}
                className="w-full py-3 min-h-[46px] rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-bold text-xs shadow-xs flex items-center justify-center gap-1.5"
              >
                <MessageSquare className="w-4 h-4" /> Minta Perbaikan (Revisi)
              </button>

              <button
                onClick={() => setSelectedSubmissionForReview(null)}
                className="w-full py-2 min-h-[40px] rounded-xl text-slate-500 font-bold text-xs hover:bg-slate-100"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
