import React, { useState } from "react";
import { TreeData } from "../types";
import { RefreshCw, Play } from "lucide-react";

interface TreeVisualizerProps {
  data: TreeData;
  isGrayscale: boolean;
}

export const TreeVisualizer: React.FC<TreeVisualizerProps> = ({ data, isGrayscale }) => {
  const [activePath, setActivePath] = useState<{ step1: "A" | "B"; step2: "C" | "D" } | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [history, setHistory] = useState<{ step1: string; step2: string }[]>([]);

  const handleSimulate = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setActivePath(null);

    let progress = 0;
    const interval = setInterval(() => {
      // Flashing different paths as animation
      const s1 = Math.random() > 0.5 ? "A" : "B";
      const s2 = Math.random() > 0.25 ? "D" : "C";
      setActivePath({ step1: s1, step2: s2 });
      progress++;
      if (progress > 8) {
        clearInterval(interval);
        
        // Final outcomes
        const finalS1 = Math.random() > 0.5 ? "A" : "B";
        const finalS2 = Math.random() > 0.25 ? "D" : "C";
        
        setActivePath({ step1: finalS1, step2: finalS2 });
        
        const textS1 = finalS1 === "A" ? data.step1.optionA : data.step1.optionB;
        const textS2 = finalS2 === "C" ? data.step2A.optionC : data.step2A.optionD;
        
        setHistory((prev) => [{ step1: textS1, step2: textS2 }, ...prev].slice(0, 15));
        setIsSimulating(false);
      }
    }, 100);
  };

  const handleReset = () => {
    setActivePath(null);
    setHistory([]);
  };

  const total = history.length;
  // Criteria: "עץ" and "כחול"
  const matches = history.filter(
    (h) => h.step1 === data.step1.optionA && h.step2 === data.step2A.optionC
  ).length;

  const experimentalProb = total > 0 ? (matches / total) * 100 : 0;
  // Theoretical probability is 0.5 * 0.25 = 0.125 (12.5%)
  const theoreticalProb = 12.5;

  return (
    <div className={`p-4 bg-gray-50/50 rounded-2xl border border-gray-100 flex flex-col md:flex-row gap-6 items-center justify-center ${isGrayscale ? "grayscale" : ""}`}>
      
      {/* SVG Tree Diagram */}
      <div className="relative w-full max-w-[280px] h-[220px] select-none bg-white p-2 rounded-xl border border-gray-200 shadow-sm">
        <svg width="100%" height="100%" viewBox="0 0 280 220" className="w-full h-full">
          {/* Root node (starting experiment) */}
          <circle cx="140" cy="20" r="8" fill="#4B5563" />
          <text x="140" y="10" fontSize="9 font-bold" fill="#374151" textAnchor="middle" fontWeight="bold">התחלה</text>

          {/* Level 1 lines */}
          {/* Root -> Option A (עץ) */}
          <line
            x1="140" y1="20" x2="60" y2="90"
            stroke={activePath?.step1 === "A" ? "#3B82F6" : "#D1D5DB"}
            strokeWidth={activePath?.step1 === "A" ? "4" : "2"}
            className="transition-all duration-300"
          />
          {/* Root -> Option B (פלי) */}
          <line
            x1="140" y1="20" x2="220" y2="90"
            stroke={activePath?.step1 === "B" ? "#3B82F6" : "#D1D5DB"}
            strokeWidth={activePath?.step1 === "B" ? "4" : "2"}
            className="transition-all duration-300"
          />

          {/* Level 2 lines */}
          {/* A -> C (כחול) */}
          <line
            x1="60" y1="90" x2="25" y2="170"
            stroke={activePath?.step1 === "A" && activePath?.step2 === "C" ? "#10B981" : "#D1D5DB"}
            strokeWidth={activePath?.step1 === "A" && activePath?.step2 === "C" ? "4" : "2"}
            className="transition-all duration-300"
          />
          {/* A -> D (אחר) */}
          <line
            x1="60" y1="90" x2="95" y2="170"
            stroke={activePath?.step1 === "A" && activePath?.step2 === "D" ? "#3B82F6" : "#D1D5DB"}
            strokeWidth={activePath?.step1 === "A" && activePath?.step2 === "D" ? "4" : "2"}
            className="transition-all duration-300"
          />
          {/* B -> C (כחול) */}
          <line
            x1="220" y1="90" x2="185" y2="170"
            stroke={activePath?.step1 === "B" && activePath?.step2 === "C" ? "#3B82F6" : "#D1D5DB"}
            strokeWidth={activePath?.step1 === "B" && activePath?.step2 === "C" ? "4" : "2"}
            className="transition-all duration-300"
          />
          {/* B -> D (אחר) */}
          <line
            x1="220" y1="90" x2="255" y2="170"
            stroke={activePath?.step1 === "B" && activePath?.step2 === "D" ? "#3B82F6" : "#D1D5DB"}
            strokeWidth={activePath?.step1 === "B" && activePath?.step2 === "D" ? "4" : "2"}
            className="transition-all duration-300"
          />

          {/* Probability weights text */}
          <text x="90" y="45" fontSize="8" fill="#6B7280" textAnchor="middle">0.5</text>
          <text x="190" y="45" fontSize="8" fill="#6B7280" textAnchor="middle">0.5</text>
          
          <text x="35" y="125" fontSize="8" fill="#6B7280" textAnchor="middle">0.25</text>
          <text x="85" y="125" fontSize="8" fill="#6B7280" textAnchor="middle">0.75</text>
          <text x="195" y="125" fontSize="8" fill="#6B7280" textAnchor="middle">0.25</text>
          <text x="245" y="125" fontSize="8" fill="#6B7280" textAnchor="middle">0.75</text>

          {/* Step 1 Node circles & Label */}
          {/* Option A (עץ) */}
          <circle
            cx="60" cy="90" r="14"
            fill={activePath?.step1 === "A" ? "#3B82F6" : "#F3F4F6"}
            stroke="#9CA3AF" strokeWidth="1"
            className="transition-all duration-300"
          />
          <text
            x="60" y="93" fontSize="9 font-semibold"
            fill={activePath?.step1 === "A" ? "#ffffff" : "#374151"}
            textAnchor="middle" fontWeight="bold"
          >
            {data.step1.optionA}
          </text>

          {/* Option B (פלי) */}
          <circle
            cx="220" cy="90" r="14"
            fill={activePath?.step1 === "B" ? "#3B82F6" : "#F3F4F6"}
            stroke="#9CA3AF" strokeWidth="1"
            className="transition-all duration-300"
          />
          <text
            x="220" y="93" fontSize="9 font-semibold"
            fill={activePath?.step1 === "B" ? "#ffffff" : "#374151"}
            textAnchor="middle" fontWeight="bold"
          >
            {data.step1.optionB}
          </text>

          {/* Step 2 Node Circles & Labels */}
          {/* Step 2 under A */}
          <circle
            cx="25" cy="170" r="13"
            fill={activePath?.step1 === "A" && activePath?.step2 === "C" ? "#10B981" : "#F3F4F6"}
            stroke="#9CA3AF" strokeWidth="1"
            className="transition-all duration-300"
          />
          <text x="25" y="173" fontSize="8" fill={activePath?.step1 === "A" && activePath?.step2 === "C" ? "#ffffff" : "#374151"} textAnchor="middle" fontWeight="bold">כחול</text>
          
          <circle
            cx="95" cy="170" r="13"
            fill={activePath?.step1 === "A" && activePath?.step2 === "D" ? "#3B82F6" : "#F3F4F6"}
            stroke="#9CA3AF" strokeWidth="1"
            className="transition-all duration-300"
          />
          <text x="95" y="173" fontSize="8" fill={activePath?.step1 === "A" && activePath?.step2 === "D" ? "#ffffff" : "#374151"} textAnchor="middle" fontWeight="bold">אחר</text>

          {/* Step 2 under B */}
          <circle
            cx="185" cy="170" r="13"
            fill={activePath?.step1 === "B" && activePath?.step2 === "C" ? "#3B82F6" : "#F3F4F6"}
            stroke="#9CA3AF" strokeWidth="1"
            className="transition-all duration-300"
          />
          <text x="185" y="173" fontSize="8" fill={activePath?.step1 === "B" && activePath?.step2 === "C" ? "#ffffff" : "#374151"} textAnchor="middle" fontWeight="bold">כחול</text>
          
          <circle
            cx="255" cy="170" r="13"
            fill={activePath?.step1 === "B" && activePath?.step2 === "D" ? "#3B82F6" : "#F3F4F6"}
            stroke="#9CA3AF" strokeWidth="1"
            className="transition-all duration-300"
          />
          <text x="255" y="173" fontSize="8" fill={activePath?.step1 === "B" && activePath?.step2 === "D" ? "#ffffff" : "#374151"} textAnchor="middle" fontWeight="bold">אחר</text>

          {/* Math calculation display directly in tree */}
          <text x="25" y="198" fontSize="7" fill={activePath?.step1 === "A" && activePath?.step2 === "C" ? "#10B981" : "#9CA3AF"} textAnchor="middle" fontWeight="bold">סנכרון: 1/8</text>
          <text x="95" y="198" fontSize="7" fill="#9CA3AF" textAnchor="middle">ס"ה: 3/8</text>
          <text x="185" y="198" fontSize="7" fill="#9CA3AF" textAnchor="middle">ס"ה: 1/8</text>
          <text x="255" y="198" fontSize="7" fill="#9CA3AF" textAnchor="middle">ס"ה: 3/8</text>
        </svg>
      </div>

      {/* Control statistics */}
      <div className="flex-1 flex flex-col w-full text-right" dir="rtl">
        <h4 className="text-sm font-bold text-gray-700 mb-2">סימולטור ניסוי רב-שלבי:</h4>

        <div className="flex gap-2 mb-4 w-full justify-start no-print">
          <button
            id="simulate_tree_btn"
            onClick={handleSimulate}
            disabled={isSimulating}
            className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded-xl font-medium text-xs hover:bg-blue-700 disabled:opacity-50 shadow-sm transition-all"
          >
            <Play size={14} />
            בצע ניסוי משולב
          </button>
          
          {total > 0 && (
            <button
              id="reset_tree_btn"
              onClick={handleReset}
              className="flex items-center gap-1 px-3 py-2 border border-gray-200 text-gray-600 rounded-xl text-xs hover:bg-gray-100 transition-all font-medium"
            >
              <RefreshCw size={12} />
              איפוס סטטיסטיקה
            </button>
          )}
        </div>

        {activePath && !isSimulating && (
          <div className="p-2.5 bg-blue-50 border border-blue-100 rounded-xl mb-4 text-center">
            <span className="text-xs text-blue-700 font-medium">תוצאת הניסוי הנוכחי:</span>
            <span className="text-sm font-bold text-blue-900 block mt-1">
              🎉 הוטל: {activePath.step1 === "A" ? data.step1.optionA : data.step1.optionB} • סביבון: {activePath.step2 === "C" ? "כחול" : "אחר"}
            </span>
          </div>
        )}

        {/* Dynamic tables */}
        <div className="bg-white p-3 rounded-xl border border-gray-200">
          <div className="text-[11px] font-bold text-gray-500 mb-2 border-b pb-1 flex justify-between">
            <span>טבלה סטטיסטית</span>
            <span>סך ניסויים: {total}</span>
          </div>
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">ניסיונות מוצלחים לשלב (עץ וכחול):</span>
              <span className="font-extrabold text-green-600">{matches} ({(experimentalProb).toFixed(0)}%)</span>
            </div>
            {/* Split comparison */}
            <div className="grid grid-cols-2 gap-4 border-t pt-2 mt-2">
              <div className="flex flex-col gap-0.5">
                <span className="text-gray-400 text-[10px]">הסתברות ניסיונית:</span>
                <span className="text-sm font-bold text-blue-600">{experimentalProb.toFixed(1)}%</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-gray-400 text-[10px]">הסתברות תיאורטית:</span>
                <span className="text-sm font-bold text-purple-600">{theoreticalProb.toFixed(1)}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
