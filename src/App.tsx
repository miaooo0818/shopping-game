/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { GameMode, ScaffoldingLevel, StepRecord, UserStats } from './types';
import { Header } from './components/Header';
import { MissionMode } from './components/MissionMode';
import { FreeShopMode } from './components/FreeShopMode';
import { AdvancedListMode } from './components/AdvancedListMode';
import { TeacherReportModal } from './components/TeacherReportModal';
import { LayoutSelectorModal } from './components/LayoutSelectorModal';
import { stopSpeech, speakText } from './utils/speech';

export default function App() {
  const [currentMode, setCurrentMode] = useState<GameMode>('mission');
  const [scaffoldingLevel, setScaffoldingLevel] = useState<ScaffoldingLevel>(1);
  const [audioEnabled, setAudioEnabled] = useState<boolean>(true);
  
  // Tablet UX Optimization Settings
  const [isTabletXL, setIsTabletXL] = useState<boolean>(true);
  const [speechRate, setSpeechRate] = useState<number>(0.85);
  const [isLayoutModalOpen, setIsLayoutModalOpen] = useState<boolean>(true);

  // IEP Step Records & Stats
  const [records, setRecords] = useState<StepRecord[]>([]);
  const [userStats, setUserStats] = useState<UserStats>({
    totalMissionsCompleted: 0,
    correctPayments: 0,
    totalPaymentsAttempted: 0,
    correctChangeDetections: 0,
    totalChangeDetections: 0,
    wrongChangeScriptPractices: 0,
    starsEarned: 3, // initial motivation stars
  });

  const handleRecordStep = (record: StepRecord) => {
    setRecords(prev => [record, ...prev]);
    setUserStats(prev => ({
      ...prev,
      totalMissionsCompleted: prev.totalMissionsCompleted + 1,
      correctPayments: prev.correctPayments + (record.paymentCorrect ? 1 : 0),
      totalPaymentsAttempted: prev.totalPaymentsAttempted + 1,
      correctChangeDetections: prev.correctChangeDetections + (record.userDetectedWrongChangeCorrectly ? 1 : 0),
      totalChangeDetections: prev.totalChangeDetections + (record.isWrongChangeScenario ? 1 : 0),
      wrongChangeScriptPractices: prev.wrongChangeScriptPractices + (record.userSaidPhraseCorrectly ? 1 : 0),
    }));
  };

  const handleEarnStar = () => {
    setUserStats(prev => ({ ...prev, starsEarned: prev.starsEarned + 1 }));
  };

  const handleSelectMode = (mode: GameMode) => {
    stopSpeech();
    setCurrentMode(mode);
  };

  const handleToggleAudio = () => {
    if (audioEnabled) {
      stopSpeech();
    } else {
      speakText('語音朗讀功能已開啟', undefined, speechRate);
    }
    setAudioEnabled(!audioEnabled);
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900 selection:bg-emerald-200 flex flex-col">
      {/* Top Header Navigation & Settings Bar */}
      <Header
        currentMode={currentMode}
        onSelectMode={handleSelectMode}
        scaffoldingLevel={scaffoldingLevel}
        onChangeScaffolding={setScaffoldingLevel}
        audioEnabled={audioEnabled}
        onToggleAudio={handleToggleAudio}
        starsCount={userStats.starsEarned}
        onOpenLayoutSelector={() => setIsLayoutModalOpen(true)}
        isTabletXL={isTabletXL}
      />

      {/* Main Mode View */}
      <main className="py-6 px-2 sm:px-4 flex-1">
        {currentMode === 'mission' && (
          <MissionMode
            scaffoldingLevel={scaffoldingLevel}
            onRecordStep={handleRecordStep}
            onEarnStar={handleEarnStar}
          />
        )}

        {currentMode === 'free' && (
          <FreeShopMode
            scaffoldingLevel={scaffoldingLevel}
            onRecordStep={handleRecordStep}
            onEarnStar={handleEarnStar}
          />
        )}

        {currentMode === 'advanced' && (
          <AdvancedListMode
            scaffoldingLevel={scaffoldingLevel}
            onRecordStep={handleRecordStep}
            onEarnStar={handleEarnStar}
          />
        )}

        {currentMode === 'report' && (
          <TeacherReportModal
            records={records}
            userStats={userStats}
            onClearRecords={() => setRecords([])}
          />
        )}
      </main>

      {/* Layout Selection & Tablet Settings Modal */}
      <LayoutSelectorModal
        isOpen={isLayoutModalOpen}
        onClose={() => setIsLayoutModalOpen(false)}
        currentMode={currentMode}
        onSelectMode={handleSelectMode}
        isTabletXL={isTabletXL}
        onToggleTabletXL={setIsTabletXL}
        speechRate={speechRate}
        onChangeSpeechRate={setSpeechRate}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700">超商購物大冒險</span>
            <span>- 兒童生活模擬購物與找零練習系統</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsLayoutModalOpen(true)}
              className="text-amber-700 font-extrabold hover:underline cursor-pointer"
            >
              ⚙️ 重新選擇遊戲版面 / 平板大圖卡設定
            </button>
            <span>• 支援高清晰語音朗讀與音效</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

