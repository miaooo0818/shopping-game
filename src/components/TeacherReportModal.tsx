import React from 'react';
import { StepRecord, UserStats } from '../types';
import { FileText, Printer, Copy, Award, CheckCircle, AlertTriangle, Sparkles, TrendingUp, RefreshCw } from 'lucide-react';

interface TeacherReportProps {
  records: StepRecord[];
  userStats: UserStats;
  onClearRecords?: () => void;
}

export const TeacherReportModal: React.FC<TeacherReportProps> = ({
  records,
  userStats,
  onClearRecords,
}) => {
  const [copied, setCopied] = React.useState(false);

  // Compute metrics
  const totalMissions = records.length;
  const correctPaymentsCount = records.filter(r => r.paymentCorrect).length;
  const wrongChangeScenarios = records.filter(r => r.isWrongChangeScenario);
  const correctWrongChangeDetectedCount = wrongChangeScenarios.filter(r => r.userDetectedWrongChangeCorrectly).length;
  const saidPhraseCount = records.filter(r => r.userSaidPhraseCorrectly).length;

  const paymentAccuracy = totalMissions > 0 ? Math.round((correctPaymentsCount / totalMissions) * 100) : 0;
  const wrongChangeAccuracy = wrongChangeScenarios.length > 0 ? Math.round((correctWrongChangeDetectedCount / wrongChangeScenarios.length) * 100) : 0;

  const generateSummaryText = () => {
    return `【超商購物與找零訓練 - 特教個案個別化學習報告 (IEP)】
日期：${new Date().toLocaleDateString('zh-TW')}
總訓練關卡次數：${totalMissions} 次
--------------------------------------------------
1. 模擬付錢正確率：${paymentAccuracy}% (${correctPaymentsCount}/${totalMissions})
2. 找錯錢辨識與確認率：${wrongChangeAccuracy}% (${correctWrongChangeDetectedCount}/${wrongChangeScenarios.length})
3. 主動大聲說出「找錯錢了！」成功次數：${saidPhraseCount} 次
--------------------------------------------------
專業特教觀察與建議：
- 個案能順利辨識 NT$1、5、10、50、100 元幣值。
- 對於 100 以內減法找零計算，在紙筆直式減法卡輔助下學習穩定。
- 在店員找錯錢情境中，個案已能熟練使用固定回應語句：「找錯錢了！」請店員協助處理。
`;
  };

  const handleCopyReport = () => {
    navigator.clipboard.writeText(generateSummaryText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 shadow-xl font-sans text-slate-900 max-w-5xl mx-auto my-6">
      {/* Printable / Viewable Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b-2 border-slate-200 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-amber-100 text-amber-800 rounded-xl font-bold">📊</span>
            <h2 className="font-black text-xl md:text-2xl text-slate-900">
              特教模擬購物與找零訓練 - 個案學習歷程報告
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            專為特教老師、心理師及家長提供之評估數據與 IEP 個別化教育計畫紀錄
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopyReport}
            className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all border border-slate-300"
          >
            <Copy className="w-4 h-4 text-slate-600" />
            <span>{copied ? '已複製報告文字！' : '複製報告 (文字版)'}</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-extrabold transition-all shadow-md"
          >
            <Printer className="w-4 h-4" />
            <span>列印學習報告</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-emerald-800 mb-2">
            <span className="text-xs font-bold">付錢正確率</span>
            <CheckCircle className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-3xl font-black text-emerald-900">{paymentAccuracy}%</div>
          <p className="text-[11px] text-emerald-700 mt-1">
            正確完成付錢：{correctPaymentsCount} / {totalMissions} 次
          </p>
        </div>

        <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-amber-800 mb-2">
            <span className="text-xs font-bold">找錯錢辨識成功率</span>
            <AlertTriangle className="w-5 h-5 text-amber-600" />
          </div>
          <div className="text-3xl font-black text-amber-900">{wrongChangeAccuracy}%</div>
          <p className="text-[11px] text-amber-700 mt-1">
            正確抓出店員找錯錢：{correctWrongChangeDetectedCount} / {wrongChangeScenarios.length} 次
          </p>
        </div>

        <div className="bg-rose-50 border-2 border-rose-200 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-rose-800 mb-2">
            <span className="text-xs font-bold">口訣「找錯錢了！」練習</span>
            <Sparkles className="w-5 h-5 text-rose-600" />
          </div>
          <div className="text-3xl font-black text-rose-900">{saidPhraseCount} 次</div>
          <p className="text-[11px] text-rose-700 mt-1">
            遇到找錯錢能勇敢表達標準應對口訣
          </p>
        </div>

        <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-blue-800 mb-2">
            <span className="text-xs font-bold">總關卡成就</span>
            <Award className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-3xl font-black text-blue-900">{userStats.starsEarned} 🌟</div>
          <p className="text-[11px] text-blue-700 mt-1">
            獲得獎勵星星，持續提升金錢自主能力
          </p>
        </div>
      </div>

      {/* Teacher IEP Recommendations Block */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl p-5 mb-6 border border-slate-700">
        <h3 className="font-extrabold text-base text-amber-300 mb-2 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-amber-400" />
          <span>IEP 特教教學觀察與個案實施指引</span>
        </h3>
        <div className="text-xs md:text-sm text-slate-300 space-y-2 leading-relaxed">
          <p>
            📌 <strong>金錢概念現況：</strong> 個案已能正確拿取 NT$1、5、10、50、100 元幣值。
          </p>
          <p>
            📌 <strong>找零計算輔助：</strong> 建議保留「直式減法紙筆輔助卡」進行 100 以內減法練習（如蘋果牛奶 35 元，拿 50 元付錢，直式減法得找零 15 元）。
          </p>
          <p>
            📌 <strong>社交情境應對：</strong> 個案無須強求理解「少找」或「多找」複雜數學概念，重點在於檢驗金額與直式輔助卡不符時，能<b>直覺化大聲說出「找錯錢了！」</b>，將複雜情境簡化為店員標準協助流程。
          </p>
        </div>
      </div>

      {/* History Timeline Log */}
      <div>
        <h3 className="font-extrabold text-base text-slate-900 mb-3 flex items-center justify-between">
          <span>📋 詳細練習歷程紀錄檔 ({records.length} 筆)</span>
          {onClearRecords && records.length > 0 && (
            <button
              type="button"
              onClick={onClearRecords}
              className="text-xs text-red-600 underline hover:text-red-800 font-bold"
            >
              清除歷史紀錄
            </button>
          )}
        </h3>

        {records.length === 0 ? (
          <div className="text-center py-8 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 text-sm font-bold">
            目前尚未有練習紀錄。請點選「🎯 導引任務訓練」開始練習！
          </div>
        ) : (
          <div className="overflow-x-auto border border-slate-200 rounded-2xl shadow-xs">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-100 text-slate-900 font-black border-b border-slate-200">
                <tr>
                  <th className="p-3">時間</th>
                  <th className="p-3">關卡名稱</th>
                  <th className="p-3">商品金額</th>
                  <th className="p-3">付出金額</th>
                  <th className="p-3">應找零</th>
                  <th className="p-3">店員找零</th>
                  <th className="p-3">找錯錢辨識</th>
                  <th className="p-3">口訣「找錯錢了！」</th>
                  <th className="p-3">提示等級</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {records.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-50">
                    <td className="p-3 text-slate-400 font-mono">
                      {new Date(rec.timestamp).toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="p-3 font-bold text-slate-900">
                      {rec.missionTitle || (rec.mode === 'free' ? '自由選購' : '進階挑戰')}
                    </td>
                    <td className="p-3 font-black text-amber-700">${rec.totalPrice} 元</td>
                    <td className="p-3 font-black text-blue-700">${rec.paidAmount} 元</td>
                    <td className="p-3 font-black text-emerald-700">${rec.expectedChange} 元</td>
                    <td className="p-3 font-bold">
                      <span className={rec.isWrongChangeScenario ? 'text-red-600 font-black' : 'text-slate-800'}>
                        ${rec.actualGivenChange} 元
                        {rec.isWrongChangeScenario && ' (錯)'}
                      </span>
                    </td>
                    <td className="p-3">
                      {rec.isWrongChangeScenario ? (
                        rec.userDetectedWrongChangeCorrectly ? (
                          <span className="bg-emerald-100 text-emerald-800 font-black px-2 py-0.5 rounded-md">
                            ✅ 成功抓出
                          </span>
                        ) : (
                          <span className="bg-red-100 text-red-800 font-bold px-2 py-0.5 rounded-md">
                            ❌ 未辨識
                          </span>
                        )
                      ) : (
                        <span className="text-slate-400">正常金額</span>
                      )}
                    </td>
                    <td className="p-3">
                      {rec.userSaidPhraseCorrectly ? (
                        <span className="bg-rose-100 text-rose-800 font-black px-2 py-0.5 rounded-md">
                          🗣️ 已說口訣
                        </span>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="p-3 font-bold text-slate-500">
                      Lv.{rec.scaffoldingUsed}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
