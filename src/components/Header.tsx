import React from 'react';
import { User, ChildProfile } from '../types';
import { Shield, Sparkles, Clock, RotateCcw, UserCheck, Users } from 'lucide-react';

interface HeaderProps {
  currentUser: User;
  currentRole: 'PARENT' | 'CHILD';
  selectedChildId: string;
  childrenList: ChildProfile[];
  pendingApprovalsCount: number;
  onRoleChange: (role: 'PARENT' | 'CHILD', childId?: string) => void;
  onResetData: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  selectedChildId,
  childrenList,
  pendingApprovalsCount,
  onRoleChange,
  onResetData,
}) => {
  const activeChild = childrenList.find((c) => c.id === selectedChildId) || childrenList[0];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-2">
          {/* Brand & Wordmark */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-amber-500/20 font-game text-lg sm:text-xl shrink-0">
              ⚔️
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg sm:text-xl font-black tracking-tight text-slate-900 font-game">
                  KIDQUEST
                </span>
                <span className="hidden md:inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                  Your Life, Your Level
                </span>
              </div>
            </div>
          </div>

          {/* Quick Stats Pill (Desktop & Tablet) */}
          <div className="hidden md:flex items-center gap-4">
            {currentRole === 'CHILD' && activeChild && (
              <div className="flex items-center gap-3 bg-slate-50 border border-slate-200/80 rounded-full px-4 py-1.5 shadow-2xs">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Level {activeChild.currentLevel} ({activeChild.totalXp} XP)</span>
                </div>
                <div className="h-4 w-px bg-slate-200" />
                <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-600">
                  <Clock className="w-4 h-4 text-indigo-500" />
                  <span>Dompet Waktu: {activeChild.timeWalletMinutes}m</span>
                </div>
              </div>
            )}

            {currentRole === 'PARENT' && (
              <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                <Shield className="w-4 h-4 text-emerald-600" />
                <span>Portal Orang Tua</span>
                {pendingApprovalsCount > 0 && (
                  <span className="bg-rose-500 text-white px-2 py-0.2 rounded-full text-[11px] font-bold animate-pulse">
                    {pendingApprovalsCount} perlu ditinjau
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Role Switcher Toolbar (Touch-Friendly) */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80">
              <button
                onClick={() => onRoleChange('PARENT')}
                className={`flex items-center gap-1 px-2.5 sm:px-3 py-1.5 min-h-[38px] rounded-lg text-xs font-bold transition-all ${
                  currentRole === 'PARENT'
                    ? 'bg-white text-indigo-900 shadow-xs border border-slate-200/80'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Beralih ke Portal Orang Tua"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span className="hidden xs:inline sm:inline">Orang Tua</span>
                {pendingApprovalsCount > 0 && (
                  <span className="ml-1 px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px] font-bold">
                    {pendingApprovalsCount}
                  </span>
                )}
              </button>

              <div className="flex items-center gap-0.5 sm:gap-1 pl-1">
                {childrenList.map((child) => (
                  <button
                    key={child.id}
                    onClick={() => onRoleChange('CHILD', child.id)}
                    className={`flex items-center gap-1 px-2 sm:px-2.5 py-1.5 min-h-[38px] rounded-lg text-xs font-bold transition-all ${
                      currentRole === 'CHILD' && selectedChildId === child.id
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span>{child.displayName}</span>
                    <span className="text-[10px] opacity-80 hidden sm:inline">Lv.{child.currentLevel}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Reset Demo Button */}
            <button
              onClick={onResetData}
              title="Reset Data Demo"
              aria-label="Reset Data Demo"
              className="p-2 min-h-[38px] min-w-[38px] flex items-center justify-center text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
