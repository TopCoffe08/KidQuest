import React, { useState, useEffect } from 'react';
import { StorageService, KidQuestState } from './services/storageService';
import { Header } from './components/Header';
import { ChildView } from './components/ChildView';
import { ParentView } from './components/ParentView';
import { Quest } from './types';

export default function App() {
  const [state, setState] = useState<KidQuestState>(() => StorageService.getState());
  const [currentRole, setCurrentRole] = useState<'PARENT' | 'CHILD'>('CHILD');
  const [selectedChildId, setSelectedChildId] = useState<string>('child-kenzo');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleRoleChange = (role: 'PARENT' | 'CHILD', childId?: string) => {
    setCurrentRole(role);
    if (childId) {
      setSelectedChildId(childId);
    }
  };

  const handleResetData = () => {
    if (window.confirm('Reset seluruh data KIDQUEST ke kondisi awal demo?')) {
      const resetState = StorageService.resetToDefault();
      setState(resetState);
      showToast('Data demo berhasil di-reset!');
    }
  };

  // Child Actions
  const handleSubmitQuest = (assignmentId: string, notes: string) => {
    const updated = StorageService.submitQuest(assignmentId, notes);
    setState(updated);
    showToast('🎉 Quest berhasil diajukan! Menunggu persetujuan orang tua.');
  };

  const handleStartSession = (category: 'GAMING' | 'YOUTUBE' | 'OTHER_ENTERTAINMENT', minutes: number) => {
    const result = StorageService.startSession(selectedChildId, category, minutes);
    if (!result.success) {
      showToast(result.error || 'Gagal memulai sesi.');
      return;
    }
    setState(result.state);
    showToast(`⏱️ Sesi hiburan (${minutes}m) dimulai! Selamat bermain dengan disiplin.`);
  };

  const handleEndSession = (actualUsedMinutes: number) => {
    const updated = StorageService.endSession(selectedChildId, actualUsedMinutes);
    setState(updated);
    showToast(`🛑 Sesi hiburan selesai. Terpakai: ${actualUsedMinutes} menit.`);
  };

  // Parent Actions
  const handleReviewSubmission = (
    assignmentId: string,
    decision: 'APPROVED' | 'REVISION_REQUIRED' | 'REJECTED',
    feedback?: string
  ) => {
    const updated = StorageService.reviewSubmission(assignmentId, decision, feedback);
    setState(updated);
    if (decision === 'APPROVED') {
      showToast('✅ Quest disetujui! XP dan Bonus Waktu telah dikreditkan ke ledger anak.');
    } else if (decision === 'REVISION_REQUIRED') {
      showToast('📝 Permintaan revisi telah dikirimkan kepada anak.');
    } else {
      showToast('❌ Pengajuan quest ditolak.');
    }
  };

  const handleCreateQuest = (questData: Omit<Quest, 'id' | 'familyId'>, assignToChildId?: string) => {
    const updated = StorageService.createQuest(questData, assignToChildId);
    setState(updated);
    showToast(`✨ Quest "${questData.title}" berhasil dibuat dan ditugaskan!`);
  };

  const handleAdjustTimeWallet = (childId: string, minutes: number, reason: string) => {
    const updated = StorageService.adjustTimeWallet(childId, minutes, reason);
    setState(updated);
    showToast(`⏳ Penyesuaian waktu (${minutes >= 0 ? '+' : ''}${minutes}m) berhasil dicatat.`);
  };

  const handleExportBackup = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(state, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `kidquest-backup-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('💾 Berkas backup JSON berhasil diunduh.');
  };

  const handleImportBackup = (jsonString: string) => {
    try {
      const parsed = JSON.parse(jsonString);
      localStorage.setItem('KIDQUEST_V1_STATE', JSON.stringify(parsed));
      setState(StorageService.getState());
      showToast('✅ Berkas backup berhasil dipulihkan!');
    } catch {
      showToast('❌ Gagal memulihkan backup: Format JSON tidak valid.');
    }
  };

  const activeChild = state.children.find((c) => c.id === selectedChildId) || state.children[0];
  const pendingApprovalsCount = state.assignments.filter((a) => a.status === 'PENDING_APPROVAL').length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      {/* Top Application Header */}
      <Header
        currentUser={state.currentUser}
        currentRole={currentRole}
        selectedChildId={selectedChildId}
        childrenList={state.children}
        pendingApprovalsCount={pendingApprovalsCount}
        onRoleChange={handleRoleChange}
        onResetData={handleResetData}
      />

      {/* Main Dual-View Body */}
      <main className="flex-1">
        {currentRole === 'CHILD' && activeChild ? (
          <ChildView
            child={activeChild}
            assignments={state.assignments}
            xpTransactions={state.xpTransactions}
            timeTransactions={state.timeTransactions}
            activeSessions={state.activeSessions}
            achievements={state.achievements}
            onSubmitQuest={handleSubmitQuest}
            onStartSession={handleStartSession}
            onEndSession={handleEndSession}
          />
        ) : (
          <ParentView
            currentUser={state.currentUser}
            childrenList={state.children}
            quests={state.quests}
            assignments={state.assignments}
            xpTransactions={state.xpTransactions}
            timeTransactions={state.timeTransactions}
            activeSessions={state.activeSessions}
            consequences={state.consequences}
            auditLogs={state.auditLogs}
            onReviewSubmission={handleReviewSubmission}
            onCreateQuest={handleCreateQuest}
            onAdjustTimeWallet={handleAdjustTimeWallet}
            onExportBackup={handleExportBackup}
            onImportBackup={handleImportBackup}
          />
        )}
      </main>

      {/* Toast Notification (Offset above mobile bottom navigation bar) */}
      {toastMessage && (
        <div className="fixed bottom-20 sm:bottom-6 right-3 sm:right-6 z-50 bg-slate-900/95 backdrop-blur-md text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-2xl border border-slate-700 animate-slide-up flex items-center gap-2 max-w-sm">
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
