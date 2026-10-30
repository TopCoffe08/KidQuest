import React, { useState, useEffect } from 'react';
import {
  ChildProfile,
  QuestAssignment,
  TimeSession,
  TimeTransaction,
  XpTransaction,
  Achievement,
  QuestCategory,
} from '../types';
import {
  calculateLevel,
  AVATAR_PRESETS,
  QUEST_CATEGORY_META,
} from '../services/gameEngine';
import {
  Sparkles,
  Clock,
  CheckCircle2,
  Play,
  Square,
  Shield,
  Trophy,
  History,
  Send,
  AlertCircle,
  Gamepad2,
  Tv,
  Heart,
  Flame,
  Award,
  Home,
  Scroll,
  X,
  ChevronRight,
} from 'lucide-react';

interface ChildViewProps {
  child: ChildProfile;
  assignments: QuestAssignment[];
  xpTransactions: XpTransaction[];
  timeTransactions: TimeTransaction[];
  activeSessions: TimeSession[];
  achievements: Achievement[];
  onSubmitQuest: (assignmentId: string, notes: string) => void;
  onStartSession: (category: 'GAMING' | 'YOUTUBE' | 'OTHER_ENTERTAINMENT', minutes: number) => void;
  onEndSession: (actualUsedMinutes: number) => void;
}

type TabType = 'HOME' | 'QUESTS' | 'TIME_WALLET' | 'CHARACTER' | 'ACHIEVEMENTS' | 'HISTORY';

export const ChildView: React.FC<ChildViewProps> = ({
  child,
  assignments,
  xpTransactions,
  timeTransactions,
  activeSessions,
  achievements,
  onSubmitQuest,
  onStartSession,
  onEndSession,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('HOME');
  const [selectedAssignment, setSelectedAssignment] = useState<QuestAssignment | null>(null);
  const [submissionNote, setSubmissionNote] = useState('');
  const [selectedDuration, setSelectedDuration] = useState<number>(15);
  const [selectedCategory, setSelectedCategory] = useState<'GAMING' | 'YOUTUBE' | 'OTHER_ENTERTAINMENT'>('GAMING');
  const [timerRemaining, setTimerRemaining] = useState<number>(0);
  const [questCategoryFilter, setQuestCategoryFilter] = useState<string>('ALL');

  const levelInfo = calculateLevel(child.totalXp);
  const avatar = AVATAR_PRESETS.find((a) => a.key === child.avatarKey) || AVATAR_PRESETS[0];
  const activeSession = activeSessions.find((s) => s.childId === child.id && s.status === 'ACTIVE');

  // Timer countdown effect based on timestamp
  useEffect(() => {
    if (!activeSession) {
      setTimerRemaining(0);
      return;
    }

    const interval = setInterval(() => {
      const startMs = new Date(activeSession.startedAt).getTime();
      const elapsedSeconds = Math.floor((Date.now() - startMs) / 1000);
      const totalSeconds = activeSession.durationMinutes * 60;
      const remaining = Math.max(0, totalSeconds - elapsedSeconds);
      setTimerRemaining(remaining);

      if (remaining <= 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [activeSession]);

  const childAssignments = assignments.filter((a) => a.childId === child.id);
  const pendingAssignments = childAssignments.filter((a) => a.status === 'PENDING_APPROVAL');
  const availableAssignments = childAssignments.filter(
    (a) => a.status === 'ASSIGNED' || a.status === 'IN_PROGRESS' || a.status === 'REVISION_REQUIRED'
  );
  const completedAssignments = childAssignments.filter((a) => a.status === 'APPROVED');

  const filteredAvailableAssignments = availableAssignments.filter((a) => {
    if (questCategoryFilter === 'ALL') return true;
    return a.quest.category === questCategoryFilter;
  });

  const childXpTxs = xpTransactions.filter((tx) => tx.childId === child.id);
  const childTimeTxs = timeTransactions.filter((tx) => tx.childId === child.id);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleOpenSubmit = (assignment: QuestAssignment) => {
    setSelectedAssignment(assignment);
    setSubmissionNote('');
  };

  const handleConfirmSubmit = () => {
    if (!selectedAssignment) return;
    onSubmitQuest(selectedAssignment.id, submissionNote);
    setSelectedAssignment(null);
  };

  const handleStopActiveTimer = () => {
    if (!activeSession) return;
    const startMs = new Date(activeSession.startedAt).getTime();
    const elapsedMinutes = Math.max(1, Math.ceil((Date.now() - startMs) / 60000));
    const used = Math.min(activeSession.durationMinutes, elapsedMinutes);
    onEndSession(used);
  };

  // SVG Circular math
  const circleRadius = 90;
  const circumference = 2 * Math.PI * circleRadius;
  const totalSessionSeconds = activeSession ? activeSession.durationMinutes * 60 : 1;
  const strokeDashoffset = activeSession
    ? circumference - (timerRemaining / totalSessionSeconds) * circumference
    : 0;

  return (
    <div className="min-h-screen bg-slate-50 pb-28 lg:pb-16">
      {/* Hero Character Card - Vibrant RPG Theme */}
      <div className="bg-gradient-to-b from-indigo-950 via-indigo-900 to-indigo-950 text-white pt-6 pb-12 sm:pb-14 px-4 sm:px-6 shadow-xl relative overflow-hidden">
        {/* Ambient Magic Glow Orbs */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-64 h-64 bg-violet-500/25 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-5 sm:gap-6 relative z-10">
          {/* Avatar Icon with RPG Frame */}
          <div className="relative group shrink-0">
            <div
              className={`w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr ${avatar.bgColor} p-1 shadow-2xl flex items-center justify-center border-3 border-amber-300/60 transform transition-transform duration-300 group-hover:scale-105`}
            >
              <span className="text-5xl sm:text-6xl filter drop-shadow-md">{avatar.emoji}</span>
            </div>
            <div className="absolute -bottom-2 -right-1.5 bg-gradient-to-r from-amber-400 to-orange-500 text-indigo-950 font-black text-[11px] sm:text-xs px-2.5 py-1 rounded-full border-2 border-white shadow-md font-game flex items-center gap-1">
              <span>⭐</span> Lv. {levelInfo.level}
            </div>
          </div>

          {/* Child Identity & Interactive Glowing XP Meter */}
          <div className="flex-1 text-center md:text-left w-full">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-1">
              <h1 className="text-2xl sm:text-3xl font-black font-game tracking-wide text-amber-300 drop-shadow-xs">
                {child.displayName}
              </h1>
              <span className="bg-indigo-800/80 text-amber-200 text-xs px-2.5 py-0.5 rounded-full font-bold border border-indigo-600/50">
                {avatar.name} • {levelInfo.title}
              </span>
            </div>
            <p className="text-indigo-200 text-xs sm:text-sm max-w-xl line-clamp-2 md:line-clamp-none">
              {avatar.description}
            </p>

            {/* Glowing XP Progress Bar */}
            <div className="mt-3.5 bg-indigo-950/80 p-3 sm:p-3.5 rounded-2xl border border-indigo-700/60 shadow-inner max-w-xl">
              <div className="flex justify-between items-center text-xs font-bold mb-1.5">
                <span className="text-amber-300 flex items-center gap-1.5 font-game">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
                  Level {levelInfo.level} ({levelInfo.title})
                </span>
                <span className="text-indigo-200 font-mono">
                  {child.totalXp} / {levelInfo.nextLevelXp} XP ({levelInfo.progressPercent}%)
                </span>
              </div>
              <div className="w-full bg-indigo-900/90 rounded-full h-3.5 overflow-hidden p-0.5 border border-indigo-700">
                <div
                  className="bg-gradient-to-r from-amber-400 via-amber-300 to-orange-500 h-full rounded-full transition-all duration-700 shadow-md animate-xp-glow"
                  style={{ width: `${Math.max(4, levelInfo.progressPercent)}%` }}
                />
              </div>
              <div className="text-[11px] text-indigo-300 mt-1.5 flex justify-between font-medium">
                <span>{levelInfo.currentLevelMinXp} XP</span>
                <span className="text-amber-200 font-bold">
                  {levelInfo.xpToNextLevel > 0
                    ? `Kurang ${levelInfo.xpToNextLevel} XP ke Lv. ${levelInfo.level + 1}`
                    : 'Level Maksimal!'}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Time Wallet Vault */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 sm:p-4 border border-white/20 flex flex-col items-center justify-center min-w-[150px] sm:min-w-[170px] shadow-lg shrink-0">
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-indigo-200 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-300" /> Dompet Waktu
            </span>
            <div className="text-3xl sm:text-4xl font-black text-amber-300 font-game my-0.5">
              {child.timeWalletMinutes} <span className="text-base sm:text-lg font-normal text-white">menit</span>
            </div>
            <span className="text-[10px] sm:text-[11px] text-indigo-200">
              Maks per sesi: {child.maxSessionDurationMinutes}m
            </span>
          </div>
        </div>
      </div>

      {/* Desktop/Tablet Segmented Navigation (Hidden on Smartphone) */}
      <div className="max-w-5xl mx-auto px-4 -mt-6 hidden lg:block">
        <div className="bg-white rounded-2xl shadow-md p-1.5 flex gap-1 border border-slate-200">
          <button
            onClick={() => setActiveTab('HOME')}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap min-h-[44px] ${
              activeTab === 'HOME'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            🏠 Beranda
          </button>
          <button
            onClick={() => setActiveTab('QUESTS')}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap min-h-[44px] ${
              activeTab === 'QUESTS'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            📜 Quest Saya ({availableAssignments.length})
          </button>
          <button
            onClick={() => setActiveTab('TIME_WALLET')}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap min-h-[44px] ${
              activeTab === 'TIME_WALLET'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            ⏳ Timer Hiburan
            {activeSession && <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping ml-1" />}
          </button>
          <button
            onClick={() => setActiveTab('CHARACTER')}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap min-h-[44px] ${
              activeTab === 'CHARACTER'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            🛡️ Karakter & Level
          </button>
          <button
            onClick={() => setActiveTab('ACHIEVEMENTS')}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap min-h-[44px] ${
              activeTab === 'ACHIEVEMENTS'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            🏆 Piala ({achievements.filter((a) => a.unlockedAt).length})
          </button>
          <button
            onClick={() => setActiveTab('HISTORY')}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap min-h-[44px] ${
              activeTab === 'HISTORY'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            📖 Riwayat
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-5xl mx-auto px-3 sm:px-4 mt-4 sm:mt-6">
        {/* Floating Active Timer Banner */}
        {activeSession && (
          <div className="mb-5 p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-rose-500 via-rose-600 to-amber-500 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3 animate-slide-up">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/20 flex items-center justify-center text-xl sm:text-2xl shrink-0">
                {activeSession.category === 'GAMING' ? '🎮' : '📺'}
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-sm sm:text-base font-game">Sesi Hiburan Berjalan</h4>
                <p className="text-[11px] sm:text-xs text-rose-100">
                  {activeSession.category === 'GAMING' ? 'Bermain Game' : 'Menonton Video'} • Total: {activeSession.durationMinutes}m
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between w-full sm:w-auto gap-3">
              <div className="text-2xl sm:text-3xl font-black font-mono tracking-wider bg-black/25 px-3.5 py-1 rounded-xl border border-white/20">
                {formatTimer(timerRemaining)}
              </div>
              <button
                onClick={handleStopActiveTimer}
                className="px-3.5 py-2 min-h-[44px] rounded-xl bg-white text-rose-600 font-bold text-xs hover:bg-rose-50 active:scale-95 transition shadow-sm flex items-center gap-1.5"
              >
                <Square className="w-3.5 h-3.5 fill-current" /> Selesai
              </button>
            </div>
          </div>
        )}

        {/* TAB 1: HOME */}
        {activeTab === 'HOME' && (
          <div className="space-y-5">
            {/* Active Quests Spotlight */}
            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-xs border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xl">⭐</span>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 font-game">Misi Aktif Hari Ini</h2>
                </div>
                <button
                  onClick={() => setActiveTab('QUESTS')}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-0.5 p-1 min-h-[36px]"
                >
                  Semua ({availableAssignments.length}) <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {availableAssignments.length === 0 ? (
                <div className="text-center py-8 bg-amber-50/60 rounded-2xl border border-dashed border-amber-300 p-4">
                  <span className="text-4xl block mb-2">🎉</span>
                  <p className="text-sm font-bold text-slate-800">Hebat! Semua quest hari ini telah selesai!</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Tunggu orang tua memeriksa atau memberikan misi petualangan baru.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
                  {availableAssignments.slice(0, 4).map((assign) => {
                    const catMeta = QUEST_CATEGORY_META[assign.quest.category];
                    return (
                      <div
                        key={assign.id}
                        className="p-4 rounded-2xl border-2 border-slate-200 hover:border-amber-400 bg-white hover:shadow-md transition-all flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${catMeta.color}`}>
                              {catMeta.icon} {catMeta.label}
                            </span>
                            {assign.status === 'REVISION_REQUIRED' && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 border border-rose-300">
                                Perlu Revisi
                              </span>
                            )}
                          </div>
                          <h3 className="font-bold text-slate-900 text-base">{assign.quest.title}</h3>
                          <p className="text-xs text-slate-600 mt-1 line-clamp-2">{assign.quest.description}</p>
                          {assign.parentFeedback && (
                            <div className="mt-2.5 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800">
                              <strong>Pesan Orang Tua:</strong> {assign.parentFeedback}
                            </div>
                          )}
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-1 rounded-lg border border-amber-200">
                              +{assign.quest.xpReward} XP
                            </span>
                            <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-1 rounded-lg border border-indigo-200">
                              +{assign.quest.timeRewardMinutes}m Waktu
                            </span>
                          </div>
                          <button
                            onClick={() => handleOpenSubmit(assign)}
                            className="px-3.5 py-2.5 min-h-[44px] rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-bold text-xs shadow-xs active:scale-95 transition flex items-center gap-1.5 shrink-0"
                          >
                            <Send className="w-3.5 h-3.5" /> Ajukan
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Pending Approvals Notice Card */}
            {pendingAssignments.length > 0 && (
              <div className="bg-amber-50/80 border border-amber-300 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-400 text-amber-950 flex items-center justify-center font-bold text-lg shrink-0">
                    ⏳
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-amber-900 font-game">
                      {pendingAssignments.length} Quest Menunggu Persetujuan Orang Tua
                    </h4>
                    <p className="text-xs text-amber-700 mt-0.5">
                      Orang tua akan memeriksa tugasmu dan reward XP serta menit waktu akan masuk ke dompetmu.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('QUESTS')}
                  className="w-full sm:w-auto px-4 py-2 min-h-[40px] rounded-xl bg-amber-500 hover:bg-amber-600 text-amber-950 font-bold text-xs shadow-xs text-center"
                >
                  Lihat Status
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: MY QUESTS */}
        {activeTab === 'QUESTS' && (
          <div className="space-y-5">
            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-xs border border-slate-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <h2 className="text-lg sm:text-xl font-black text-slate-900 font-game flex items-center gap-2">
                  📜 Buku Petualangan Quest
                </h2>

                {/* Category Filter Pills (Touch-Friendly) */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  <button
                    onClick={() => setQuestCategoryFilter('ALL')}
                    className={`px-3 py-1.5 min-h-[36px] rounded-xl text-xs font-bold transition shrink-0 ${
                      questCategoryFilter === 'ALL'
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Semua
                  </button>
                  <button
                    onClick={() => setQuestCategoryFilter('MORNING_ROUTINE')}
                    className={`px-3 py-1.5 min-h-[36px] rounded-xl text-xs font-bold transition shrink-0 ${
                      questCategoryFilter === 'MORNING_ROUTINE'
                        ? 'bg-amber-500 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    ☀️ Pagi
                  </button>
                  <button
                    onClick={() => setQuestCategoryFilter('STUDY')}
                    className={`px-3 py-1.5 min-h-[36px] rounded-xl text-xs font-bold transition shrink-0 ${
                      questCategoryFilter === 'STUDY'
                        ? 'bg-blue-500 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    📚 Belajar
                  </button>
                  <button
                    onClick={() => setQuestCategoryFilter('CHORES')}
                    className={`px-3 py-1.5 min-h-[36px] rounded-xl text-xs font-bold transition shrink-0 ${
                      questCategoryFilter === 'CHORES'
                        ? 'bg-emerald-500 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    🧹 Bantu Rumah
                  </button>
                </div>
              </div>

              {/* Available Quests Grid */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                    Quest Yang Perlu Dikerjakan ({filteredAvailableAssignments.length})
                  </h3>
                  {filteredAvailableAssignments.length === 0 ? (
                    <p className="text-xs text-slate-400 italic py-4">Tidak ada quest pada kategori ini.</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
                      {filteredAvailableAssignments.map((assign) => {
                        const catMeta = QUEST_CATEGORY_META[assign.quest.category];
                        return (
                          <div
                            key={assign.id}
                            className="p-4 rounded-2xl border-2 border-slate-200 bg-white hover:shadow-md transition flex flex-col justify-between"
                          >
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${catMeta.color}`}>
                                  {catMeta.icon} {catMeta.label}
                                </span>
                                <span className="text-[10px] text-slate-400 font-medium">
                                  {assign.quest.recurrence === 'DAILY' ? 'Harian' : 'Sekali'}
                                </span>
                              </div>
                              <h4 className="font-bold text-slate-800 text-base">{assign.quest.title}</h4>
                              <p className="text-xs text-slate-600 mt-1">{assign.quest.description}</p>
                              {assign.parentFeedback && (
                                <div className="mt-2.5 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800">
                                  <strong>Catatan Perbaikan:</strong> {assign.parentFeedback}
                                </div>
                              )}
                            </div>
                            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-1 rounded-lg border border-amber-200">
                                  +{assign.quest.xpReward} XP
                                </span>
                                <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-1 rounded-lg border border-indigo-200">
                                  +{assign.quest.timeRewardMinutes}m
                                </span>
                              </div>
                              <button
                                onClick={() => handleOpenSubmit(assign)}
                                className="px-3.5 py-2.5 min-h-[44px] rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs active:scale-95 transition flex items-center gap-1.5 shrink-0"
                              >
                                <Send className="w-3.5 h-3.5" /> Ajukan Selesai
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Pending Section */}
                {pendingAssignments.length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-3">
                      Menunggu Pemeriksaan Orang Tua ({pendingAssignments.length})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                      {pendingAssignments.map((assign) => (
                        <div key={assign.id} className="p-4 rounded-2xl border-2 border-amber-300 bg-amber-50/60 shadow-2xs">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-200 text-amber-900">
                              ⏳ Sedang Ditinjau
                            </span>
                            <span className="text-xs font-bold text-amber-800">
                              +{assign.quest.xpReward} XP • +{assign.quest.timeRewardMinutes}m
                            </span>
                          </div>
                          <h4 className="font-bold text-slate-800">{assign.quest.title}</h4>
                          {assign.childNotes && (
                            <p className="text-xs text-slate-600 mt-2 bg-white/80 p-2.5 rounded-xl italic border border-amber-200">
                              &ldquo;{assign.childNotes}&rdquo;
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Approved Completed Section */}
                {completedAssignments.length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-3">
                      Quest Selesai & Disetujui ({completedAssignments.length})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                      {completedAssignments.map((assign) => (
                        <div
                          key={assign.id}
                          className="p-4 rounded-2xl border border-emerald-200 bg-emerald-50/50 flex items-center justify-between"
                        >
                          <div>
                            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 mb-1">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Disetujui
                            </div>
                            <h4 className="font-bold text-slate-800 text-sm">{assign.quest.title}</h4>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-bold text-emerald-700 block">
                              +{assign.quest.xpReward} XP
                            </span>
                            <span className="text-[11px] text-emerald-600 block">
                              +{assign.quest.timeRewardMinutes}m Waktu
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: TIME WALLET & CIRCULAR ANIMATED COUNTDOWN TIMER */}
        {activeTab === 'TIME_WALLET' && (
          <div className="space-y-5">
            <div className="bg-white rounded-3xl p-5 sm:p-8 shadow-xs border border-slate-200">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-game">
                    ⏳ Universal Time Wallet
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Saldo waktu hiburan mandiri. Gunakan secara disiplin sesuai kesepakatan keluarga.
                  </p>
                </div>
                <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 px-5 py-3 rounded-2xl">
                  <div>
                    <span className="text-[11px] font-bold text-amber-800 uppercase block">Saldo Waktu</span>
                    <span className="text-2xl sm:text-3xl font-black text-amber-600 font-game">
                      {child.timeWalletMinutes} <span className="text-sm font-normal text-slate-700">menit</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Circular Animated Timer Component */}
              {!activeSession ? (
                <div className="mt-6 max-w-lg mx-auto bg-slate-50 p-5 sm:p-6 rounded-3xl border border-slate-200">
                  <h3 className="font-bold text-slate-800 text-base mb-4 text-center font-game">
                    Mulai Sesi Hiburan Baru
                  </h3>

                  {/* Category Selection (Touch-Friendly min-h-[48px]) */}
                  <div className="mb-4">
                    <label className="text-xs font-bold text-slate-600 block mb-2">Pilih Aktivitas Hiburan:</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setSelectedCategory('GAMING')}
                        className={`p-3 min-h-[48px] rounded-2xl border-2 flex items-center justify-center gap-2.5 transition active:scale-95 ${
                          selectedCategory === 'GAMING'
                            ? 'bg-indigo-50 border-indigo-600 text-indigo-900 font-bold shadow-xs'
                            : 'bg-white border-slate-200 text-slate-700'
                        }`}
                      >
                        <Gamepad2 className="w-5 h-5 text-indigo-600" />
                        <span className="text-xs font-bold">Main Game</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedCategory('YOUTUBE')}
                        className={`p-3 min-h-[48px] rounded-2xl border-2 flex items-center justify-center gap-2.5 transition active:scale-95 ${
                          selectedCategory === 'YOUTUBE'
                            ? 'bg-rose-50 border-rose-600 text-rose-900 font-bold shadow-xs'
                            : 'bg-white border-slate-200 text-slate-700'
                        }`}
                      >
                        <Tv className="w-5 h-5 text-rose-600" />
                        <span className="text-xs font-bold">Nonton Video</span>
                      </button>
                    </div>
                  </div>

                  {/* Duration Buttons (Touch-Friendly min-h-[44px]) */}
                  <div className="mb-6">
                    <label className="text-xs font-bold text-slate-600 block mb-2">
                      Pilih Durasi: <span className="text-indigo-600 font-bold">{selectedDuration} Menit</span>
                    </label>
                    <div className="grid grid-cols-5 gap-2">
                      {[5, 10, 15, 20, 30].map((mins) => {
                        const isAllowed = mins <= child.timeWalletMinutes && mins <= child.maxSessionDurationMinutes;
                        return (
                          <button
                            key={mins}
                            type="button"
                            disabled={!isAllowed}
                            onClick={() => setSelectedDuration(mins)}
                            className={`py-2.5 min-h-[44px] rounded-xl text-xs font-bold transition active:scale-95 ${
                              selectedDuration === mins
                                ? 'bg-indigo-600 text-white shadow-xs scale-105'
                                : isAllowed
                                ? 'bg-white border-2 border-slate-200 text-slate-700 hover:bg-slate-100'
                                : 'bg-slate-100 text-slate-300 cursor-not-allowed border border-slate-200'
                            }`}
                          >
                            {mins}m
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <button
                    onClick={() => onStartSession(selectedCategory, selectedDuration)}
                    disabled={child.timeWalletMinutes < selectedDuration}
                    className="w-full py-3.5 min-h-[50px] rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-600 to-emerald-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-sm shadow-md transition active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed font-game"
                  >
                    <Play className="w-4 h-4 fill-current" /> Mulai Timer ({selectedDuration} Menit)
                  </button>
                </div>
              ) : (
                /* Interactive Circular Animated Countdown Timer */
                <div className="mt-6 text-center max-w-sm mx-auto bg-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

                  <span className="text-xs uppercase tracking-widest text-slate-400 font-bold block mb-4">
                    {activeSession.category === 'GAMING' ? '🎮 Sesi Main Game' : '📺 Sesi Nonton'}
                  </span>

                  {/* SVG Circular Ring */}
                  <div className="relative w-56 h-56 mx-auto flex items-center justify-center">
                    <svg className="w-56 h-56 transform -rotate-90" viewBox="0 0 200 200">
                      {/* Background Track Circle */}
                      <circle
                        cx="100"
                        cy="100"
                        r={circleRadius}
                        stroke="#334155"
                        strokeWidth="12"
                        fill="transparent"
                      />
                      {/* Animated Progress Circle */}
                      <circle
                        cx="100"
                        cy="100"
                        r={circleRadius}
                        stroke={timerRemaining < 60 ? '#f43f5e' : '#f59e0b'}
                        strokeWidth="12"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        fill="transparent"
                        className="timer-ring-circle"
                      />
                    </svg>

                    {/* Centered Large Digits */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-amber-400">
                        {formatTimer(timerRemaining)}
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium mt-1">Sisa Waktu</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 mt-4 mb-6">
                    Waktu dihitung menggunakan jam sistem. Tetap disiplin dan selesaikan sebelum alarm berbunyi!
                  </p>

                  <button
                    onClick={handleStopActiveTimer}
                    className="w-full py-3.5 min-h-[48px] rounded-2xl bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-bold text-sm shadow-md active:scale-95 transition flex items-center justify-center gap-2"
                  >
                    <Square className="w-4 h-4 fill-current" /> Selesai & Simpan Waktu
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: CHARACTER & LEVEL */}
        {activeTab === 'CHARACTER' && (
          <div className="space-y-5">
            <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-xs border border-slate-200">
              <h2 className="text-xl font-black text-slate-900 font-game mb-4 flex items-center gap-2">
                🛡️ Karakter & Progres Level
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div
                  className={`p-8 rounded-3xl bg-gradient-to-tr ${avatar.bgColor} text-white text-center shadow-lg border-4 border-white`}
                >
                  <span className="text-8xl block mb-2 filter drop-shadow-lg">{avatar.emoji}</span>
                  <h3 className="text-2xl font-black font-game">{avatar.name}</h3>
                  <p className="text-xs opacity-90 mt-1 max-w-xs mx-auto">{avatar.description}</p>
                </div>

                <div className="space-y-3.5">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <span className="text-xs font-bold text-slate-400 uppercase">Gelar Kehormatan</span>
                    <h4 className="text-base sm:text-lg font-bold text-slate-800 font-game flex items-center gap-2 mt-0.5">
                      <span>{levelInfo.badge}</span> Level {levelInfo.level} — {levelInfo.title}
                    </h4>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <span className="text-xs font-bold text-slate-400 uppercase">Total Pengalaman (XP)</span>
                    <div className="text-2xl font-black text-amber-500 font-game mt-0.5">
                      {child.totalXp} <span className="text-xs font-normal text-slate-500">XP Terkumpul</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <span className="text-xs font-bold text-slate-400 uppercase">Menuju Level {levelInfo.level + 1}</span>
                    <p className="text-xs text-slate-600 mt-1">
                      Kumpulkan <strong>{levelInfo.xpToNextLevel} XP</strong> lagi untuk naik level berikutnya!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: ACHIEVEMENTS */}
        {activeTab === 'ACHIEVEMENTS' && (
          <div className="space-y-5">
            <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-xs border border-slate-200">
              <h2 className="text-xl font-black text-slate-900 font-game mb-4 flex items-center gap-2">
                🏆 Lencana & Piala Pencapaian
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 sm:gap-4">
                {achievements.map((ach) => {
                  const isUnlocked = !!ach.unlockedAt;
                  return (
                    <div
                      key={ach.id}
                      className={`p-4 rounded-2xl border-2 transition ${
                        isUnlocked
                          ? 'bg-amber-50/70 border-amber-300 shadow-xs'
                          : 'bg-slate-50 border-slate-200 opacity-60'
                      }`}
                    >
                      <div className="text-4xl mb-2">{ach.iconKey}</div>
                      <h4 className="font-bold text-slate-900 text-sm font-game">{ach.title}</h4>
                      <p className="text-xs text-slate-600 mt-1">{ach.description}</p>
                      <div className="mt-3 pt-2.5 border-t border-slate-200 flex items-center justify-between text-[11px] font-bold">
                        <span className="text-amber-700">+{ach.xpBonus} XP Bonus</span>
                        <span className={isUnlocked ? 'text-emerald-700 font-bold' : 'text-slate-400'}>
                          {isUnlocked ? 'Terbuka ✨' : 'Terkunci 🔒'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: HISTORY */}
        {activeTab === 'HISTORY' && (
          <div className="space-y-5">
            <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-xs border border-slate-200">
              <h2 className="text-xl font-black text-slate-900 font-game mb-4 flex items-center gap-2">
                📖 Buku Catatan Transaksi & Riwayat
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* XP History */}
                <div>
                  <h3 className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-3">
                    Mutasi XP ({childXpTxs.length})
                  </h3>
                  <div className="space-y-2">
                    {childXpTxs.slice().reverse().map((tx) => (
                      <div key={tx.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-slate-800">{tx.description}</p>
                          <span className="text-[10px] text-slate-400">
                            {new Date(tx.createdAt).toLocaleDateString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <span className="text-xs font-black text-amber-600 font-game">+{tx.amount} XP</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Time Ledger History */}
                <div>
                  <h3 className="text-xs font-bold text-indigo-700 uppercase tracking-wider mb-3">
                    Mutasi Dompet Waktu ({childTimeTxs.length})
                  </h3>
                  <div className="space-y-2">
                    {childTimeTxs.slice().reverse().map((tx) => (
                      <div key={tx.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-slate-800">{tx.description}</p>
                          <span className="text-[10px] text-slate-400">
                            {new Date(tx.createdAt).toLocaleDateString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <span
                          className={`text-xs font-black font-game ${
                            tx.minutes >= 0 ? 'text-emerald-600' : 'text-rose-600'
                          }`}
                        >
                          {tx.minutes >= 0 ? `+${tx.minutes}` : tx.minutes} m
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MOBILE FIXED BOTTOM TAB BAR (Confirmed Decision 1) */}
      <nav
        aria-label="Navigasi Arena Anak"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-lg pb-safe"
      >
        <div className="grid grid-cols-5 items-center h-16 max-w-md mx-auto px-1">
          <button
            onClick={() => setActiveTab('HOME')}
            className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-colors ${
              activeTab === 'HOME' ? 'text-indigo-600 font-bold' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px] tracking-tight mt-1">Beranda</span>
          </button>

          <button
            onClick={() => setActiveTab('QUESTS')}
            className={`flex flex-col items-center justify-center h-full min-h-[44px] relative transition-colors ${
              activeTab === 'QUESTS' ? 'text-indigo-600 font-bold' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Scroll className="w-5 h-5" />
            <span className="text-[10px] tracking-tight mt-1">Quest</span>
            {availableAssignments.length > 0 && (
              <span className="absolute top-2 right-4 w-4 h-4 rounded-full bg-amber-500 text-white text-[9px] font-bold flex items-center justify-center">
                {availableAssignments.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('TIME_WALLET')}
            className={`flex flex-col items-center justify-center h-full min-h-[44px] relative transition-colors ${
              activeTab === 'TIME_WALLET' ? 'text-indigo-600 font-bold' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Clock className="w-5 h-5" />
            <span className="text-[10px] tracking-tight mt-1">Timer</span>
            {activeSession && <span className="absolute top-2.5 right-4 w-2 h-2 rounded-full bg-rose-500 animate-ping" />}
          </button>

          <button
            onClick={() => setActiveTab('CHARACTER')}
            className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-colors ${
              activeTab === 'CHARACTER' ? 'text-indigo-600 font-bold' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Shield className="w-5 h-5" />
            <span className="text-[10px] tracking-tight mt-1">Hero</span>
          </button>

          <button
            onClick={() => setActiveTab('ACHIEVEMENTS')}
            className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-colors ${
              activeTab === 'ACHIEVEMENTS' ? 'text-indigo-600 font-bold' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Trophy className="w-5 h-5" />
            <span className="text-[10px] tracking-tight mt-1">Piala</span>
          </button>
        </div>
      </nav>

      {/* Modal / Bottom Sheet Submit Quest (Touch-Friendly) */}
      {selectedAssignment && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 max-w-md w-full shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto pb-safe">
            {/* Grab Handle for Mobile Bottom Sheet */}
            <div className="w-10 h-1 bg-slate-300 rounded-full mx-auto mb-4 sm:hidden" />

            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🎉</span>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 font-game">Ajukan Selesai Quest</h3>
              </div>
              <button
                onClick={() => setSelectedAssignment(null)}
                className="p-1.5 rounded-full text-slate-400 hover:bg-slate-100 min-h-[36px] min-w-[36px] flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 mb-3">
              Kamu telah menyelesaikan quest: <strong>{selectedAssignment.quest.title}</strong>
            </p>

            <textarea
              value={submissionNote}
              onChange={(e) => setSubmissionNote(e.target.value)}
              placeholder="Contoh: Sudah selesai membaca 1 bab buku cerita!"
              rows={3}
              className="w-full text-xs p-3 rounded-2xl border-2 border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 mb-4"
            />

            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setSelectedAssignment(null)}
                className="px-4 py-2.5 min-h-[44px] rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 active:scale-95"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmSubmit}
                className="px-5 py-2.5 min-h-[44px] rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-bold shadow-md flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" /> Kirim ke Orang Tua
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
