import React, { useState } from "react";
import { ComplementaryData } from "../types";
import { RefreshCw, Play, BarChart2 } from "lucide-react";

interface ComplementaryVisualizerProps {
  data: ComplementaryData;
  isGrayscale: boolean;
}

export const ComplementaryVisualizer: React.FC<ComplementaryVisualizerProps> = ({ data, isGrayscale }) => {
  const [isSimulating, setIsSimulating] = useState(false);
  const [stats, setStats] = useState<{
    total: number;
    success: number;
    failure: number;
    consecutiveFF: number;
    consecutiveFS: number;
    consecutiveSF: number;
    consecutiveSS: number;
  } | null>(null);

  const handleSimulateBatch = () => {
    if (isSimulating) return;
    setIsSimulating(true);

    let currentIter = 0;
    const batchSize = 100;
    
    // Initializing counters
    let succ = 0;
    let fail = 0;
    let ff = 0;
    let fs = 0;
    let sf = 0;
    let ss = 0;

    const interval = setInterval(() => {
      // Simulate 10 trials per tick to make it look fast and active
      for (let i = 0; i < 10; i++) {
        const randSingle = Math.random();
        if (randSingle < data.eventProb) {
          succ++;
        } else {
          fail++;
        }

        // Simulate 2 consecutive trials
        const rand1 = Math.random() < data.eventProb;
        const rand2 = Math.random() < data.eventProb;
        
        if (!rand1 && !rand2) ff++;
        else if (!rand1 && rand2) fs++;
        else if (rand1 && !rand2) sf++;
        else ss++;
      }

      currentIter += 10;
      setStats({
        total: currentIter,
        success: succ,
        failure: fail,
        consecutiveFF: ff,
        consecutiveFS: fs,
        consecutiveSF: sf,
        consecutiveSS: ss,
      });

      if (currentIter >= batchSize) {
        clearInterval(interval);
        setIsSimulating(false);
      }
    }, 150);
  };

  const handleReset = () => {
    setStats(null);
  };

  const probSuccess = data.eventProb;
  const probFailure = 1 - data.eventProb;

  // Theoretical probability values
  const theoreticalFF = probFailure * probFailure * 100; // 0.65 * 0.65 = 42.25%
  const theoreticalOther = (1 - probFailure * probFailure) * 100; // 57.75%

  return (
    <div className={`p-4 bg-gray-50/50 rounded-2xl border border-gray-100 flex flex-col gap-6 justify-center ${isGrayscale ? "grayscale" : ""}`}>
      
      {/* Visualization representation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6" dir="rtl">
        
        {/* Single stage probability */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 text-right">
          <h5 className="text-xs font-bold text-gray-500 mb-3 flex items-center gap-1">
            <BarChart2 size={13} />
            <span>א. הסתברות אירוע משלים (סיבוב בודד):</span>
          </h5>
          
          <div className="space-y-4">
            {/* Visual representation bar */}
            <div className="h-6 w-full rounded-lg overflow-hidden flex font-bold text-[10px] text-white">
              <div
                className="bg-green-500 h-full flex items-center justify-center transition-all duration-300"
                style={{ width: `${probSuccess * 100}%` }}
                title={`הצלחה: ${probSuccess * 100}%`}
              >
                פגיעה ({probSuccess * 100}%)
              </div>
              <div
                className="bg-red-500 h-full flex items-center justify-center transition-all duration-300"
                style={{ width: `${probFailure * 100}%` }}
                title={`כישלון/משלים: ${(probFailure * 100).toFixed(0)}%`}
              >
                החטאה ({(probFailure * 100).toFixed(0)}%)
              </div>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500">הסתברות להצלחה:</span>
                <span className="font-semibold text-green-600">{probSuccess} (35%)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">הסתברות לאירוע משלים (החטאה):</span>
                <span className="font-semibold text-red-500">1 - {probSuccess} = {probFailure.toFixed(2)} (65%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Double stage probability */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 text-right">
          <h5 className="text-xs font-bold text-gray-500 mb-3 flex items-center gap-1">
            <BarChart2 size={13} />
            <span>ב. הסתברות לשני הפסדים רצופים:</span>
          </h5>

          <div className="space-y-4">
            <div className="h-6 w-full rounded-lg overflow-hidden flex font-bold text-[10px] text-white">
              <div
                className="bg-red-600 h-full flex items-center justify-center transition-all duration-300"
                style={{ width: `${theoreticalFF}%` }}
                title={`שני הפסדים: ${theoreticalFF.toFixed(2)}%`}
              >
                הפסד והפסד ({theoreticalFF.toFixed(1)}%)
              </div>
              <div
                className="bg-slate-400 h-full flex items-center justify-center transition-all duration-300"
                style={{ width: `${theoreticalOther}%` }}
                title={`שאר האפשרויות: ${theoreticalOther.toFixed(2)}%`}
              >
                אפשרויות אחרות ({theoreticalOther.toFixed(1)}%)
              </div>
            </div>

            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500">חישוב הסתברות תיאורטית:</span>
                <span className="font-bold text-slate-700">0.65 * 0.65 = 42.25%</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Simulator Batch Panel */}
      <div className="border-t border-gray-150 pt-4 text-right" dir="rtl">
        <h4 className="text-xs font-bold text-gray-700 mb-2">סימולטור 100 הטלות משחק רציפות:</h4>
        
        <div className="flex gap-2 mb-4 w-full justify-start no-print">
          <button
            id="simulate_complementary_btn"
            onClick={handleSimulateBatch}
            disabled={isSimulating}
            className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded-xl font-medium text-xs hover:bg-blue-700 disabled:opacity-50 shadow-sm transition-all"
          >
            <Play size={14} className={isSimulating ? "animate-spin" : ""} />
            {isSimulating ? "מבצע סימולציות..." : "הרץ 100 סימולציות"}
          </button>
          
          {stats && (
            <button
              id="reset_complementary_btn"
              onClick={handleReset}
              className="flex items-center gap-1 px-3 py-2 border border-gray-200 text-gray-600 rounded-xl text-xs hover:bg-gray-100 transition-all font-medium"
            >
              <RefreshCw size={12} />
              איפוס סטטיסטיקה
            </button>
          )}
        </div>

        {stats && (
          <div className="bg-white p-3 rounded-xl border border-gray-200 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-semibold">
            <div className="flex flex-col gap-0.5 p-2 bg-gray-50 rounded-lg border">
              <span className="text-gray-400 text-[10px]">סך הכל משחקים מנוסים:</span>
              <span className="text-sm font-bold text-gray-800">{stats.total}</span>
            </div>
            <div className="flex flex-col gap-0.5 p-2 bg-gray-50 rounded-lg border">
              <span className="text-gray-400 text-[10px]">פגיעות בפועל (בסיבוב בודד):</span>
              <span className="text-sm font-bold text-green-600">{stats.success} ({(stats.success / stats.total * 100).toFixed(0)}%)</span>
            </div>
            <div className="flex flex-col gap-0.5 p-2 bg-gray-50 rounded-lg border">
              <span className="text-gray-400 text-[10px]">החטאות בפועל (בסיבוב בודד):</span>
              <span className="text-sm font-bold text-red-500">{stats.failure} ({(stats.failure / stats.total * 100).toFixed(0)}%)</span>
            </div>
            <div className="flex flex-col gap-0.5 p-2 bg-gray-50 rounded-lg border">
              <span className="text-gray-400 text-[10px]">שני הפסדים ברצף בפועל:</span>
              <span className="text-sm font-bold text-blue-600">{stats.consecutiveFF} ({(stats.consecutiveFF / stats.total * 100).toFixed(0)}%)</span>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
