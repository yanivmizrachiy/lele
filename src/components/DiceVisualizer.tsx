import React, { useState } from "react";
import { DiceData } from "../types";
import { RefreshCw, Play, Dices } from "lucide-react";

interface DiceVisualizerProps {
  data: DiceData;
  isGrayscale: boolean;
}

export const DiceVisualizer: React.FC<DiceVisualizerProps> = ({ data, isGrayscale }) => {
  const [die1, setDie1] = useState(1);
  const [die2, setDie2] = useState(1);
  const [isRolling, setIsRolling] = useState(false);
  const [rollHistory, setRollHistory] = useState<{ d1: number; d2: number; sum: number }[]>([]);

  const handleRoll = () => {
    if (isRolling) return;
    setIsRolling(true);

    // Roll animation effect
    let counter = 0;
    const interval = setInterval(() => {
      setDie1(Math.floor(Math.random() * 6) + 1);
      setDie2(Math.floor(Math.random() * 6) + 1);
      counter++;
      if (counter > 10) {
        clearInterval(interval);
        
        const finalD1 = Math.floor(Math.random() * 6) + 1;
        const finalD2 = Math.floor(Math.random() * 6) + 1;
        setDie1(finalD1);
        setDie2(finalD2);
        
        const sum = finalD1 + finalD2;
        setRollHistory((prev) => [{ d1: finalD1, d2: finalD2, sum }, ...prev].slice(0, 15));
        setIsRolling(false);
      }
    }, 80);
  };

  const handleReset = () => {
    setDie1(1);
    setDie2(1);
    setRollHistory([]);
  };

  const totalRolls = rollHistory.length;
  const successfulRolls = rollHistory.filter((roll) => roll.sum > data.targetSum).length;
  const experimentalProb = totalRolls > 0 ? (successfulRolls / totalRolls) * 100 : 0;
  const theoreticalSuccessfulOutcomes = 6; // sum > 9: (4,6), (5,5), (5,6), (6,4), (6,5), (6,6)
  const theoreticalProb = (theoreticalSuccessfulOutcomes / 36) * 100;

  // Render pip dots on flat dice faces
  const renderDicePips = (val: number, color: string) => {
    const dotsMap: Record<number, number[]> = {
      1: [4],
      2: [0, 8],
      3: [0, 4, 8],
      4: [0, 2, 6, 8],
      5: [0, 2, 4, 6, 8],
      6: [0, 1, 2, 6, 7, 8],
    };

    const currentDots = dotsMap[val] || [];
    return (
      <div className={`relative w-12 h-12 rounded-xl flex items-center justify-center p-2.5 shadow-md border ${color}`}>
        <div className="grid grid-cols-3 grid-rows-3 gap-1 w-full h-full">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="flex items-center justify-center">
              {currentDots.includes(i) && (
                <div className={`w-20% h-20% max-w-[7px] max-h-[7px] rounded-full aspect-square ${color.includes("red") ? "bg-red-800" : "bg-blue-800"}`} />
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={`p-4 bg-gray-50/50 rounded-2xl border border-gray-100 flex flex-col lg:flex-row gap-6 justify-center ${isGrayscale ? "grayscale" : ""}`}>
      
      {/* 2D Dice Roll & Graphic */}
      <div className="flex flex-col items-center justify-center gap-3 w-full lg:w-48 text-center select-none" dir="rtl">
        <div className="flex justify-center gap-4 py-4">
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-bold text-red-500 mb-1 leading-none">קוביה א'</span>
            {renderDicePips(die1, "bg-red-50 border-red-200 shadow-red-200/50")}
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-bold text-blue-500 mb-1 leading-none">קוביה ב'</span>
            {renderDicePips(die2, "bg-blue-50 border-blue-200 shadow-blue-200/50")}
          </div>
        </div>

        <div className="p-2 border border-slate-200 bg-white rounded-xl shadow-sm text-center font-bold text-slate-800 text-sm w-full">
          {isRolling ? "מטיל..." : `תוצאת הסכום: ${die1 + die2}`}
        </div>

        <div className="flex gap-2 w-full justify-center no-print">
          <button
            id="roll_dice_btn"
            onClick={handleRoll}
            disabled={isRolling}
            className="flex items-center justify-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-xl font-semibold text-xs hover:bg-blue-700 disabled:opacity-50 shadow-sm transition-all flex-1"
          >
            <Play size={14} />
            הטל קוביות
          </button>
          
          {totalRolls > 0 && (
            <button
              id="reset_dice_btn"
              onClick={handleReset}
              className="px-2.5 py-2 border border-gray-200 text-gray-600 rounded-xl text-xs hover:bg-gray-100 transition-all font-medium"
            >
              <RefreshCw size={12} />
            </button>
          )}
        </div>
      </div>

      {/* Grid representation */}
      <div className="flex-1 flex flex-col w-full text-right" dir="rtl">
        <div className="bg-white p-3 rounded-xl border border-gray-200 flex flex-col md:flex-row gap-4">
          
          {/* Outer Grid Wrapper */}
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="text-[10px] font-bold text-gray-500 mb-1 flex items-center gap-1">
              <Dices size={12} className="text-gray-400" />
              <span>מרחב המדגם ( Highlight: סכום {`>`} {data.targetSum} )</span>
            </div>
            
            <div className="grid grid-cols-7 gap-1">
              {/* Row Header corner */}
              <div className="w-6 h-6 flex items-center justify-center text-[10px] text-gray-400 font-bold bg-gray-50 rounded" />
              {/* Columns Header (Red die 1-6) */}
              {Array.from({ length: 6 }).map((_, c) => (
                <div key={c} className="w-6 h-6 flex items-center justify-center text-[10px] text-red-500 font-bold bg-red-50 rounded">
                  {c + 1}
                </div>
              ))}

              {Array.from({ length: 6 }).map((_, r) => {
                const dice2Val = r + 1;
                return (
                  <React.Fragment key={r}>
                    {/* Rows Header (Blue die 1-6) */}
                    <div className="w-6 h-6 flex items-center justify-center text-[10px] text-blue-500 font-bold bg-blue-50 rounded">
                      {dice2Val}
                    </div>
                    {/* Cells values */}
                    {Array.from({ length: 6 }).map((_, c) => {
                      const dice1Val = c + 1;
                      const sum = dice1Val + dice2Val;
                      const isTarget = sum > data.targetSum;
                      const isCurrent = dice1Val === die1 && dice2Val === die2 && !isRolling;
                      
                      let cellClass = "bg-gray-50 text-gray-400";
                      if (isTarget) {
                        cellClass = "bg-green-100 text-green-800 border-[1px] border-green-300 font-semibold";
                      }
                      if (isCurrent) {
                        cellClass = "bg-blue-600 text-white border-2 border-slate-900 font-bold animate-pulse transform scale-110 z-10";
                      }

                      return (
                        <div
                          key={c}
                          title={`קוביה א': ${dice1Val}, קוביה ב': ${dice2Val} (סכום: ${sum})`}
                          className={`w-6 h-6 rounded flex items-center justify-center text-[10px] transition-all cursor-default ${cellClass}`}
                        >
                          {sum}
                        </div>
                      );
                    })}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* Probability Statistics */}
          <div className="flex-1 flex flex-col justify-between border-t md:border-t-0 md:border-r border-gray-100 pt-3 md:pt-0 md:pr-4 py-1 text-right">
            <div>
              <h5 className="text-[11px] font-bold text-gray-500 mb-2">סטטיסטיקת המבחן:</h5>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-500">מספר הטלות כולל:</span>
                  <span className="font-bold text-gray-700">{totalRolls}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">הצלחות (סכום {`>`} {data.targetSum}):</span>
                  <span className="font-bold text-green-600">{successfulRolls}</span>
                </div>
                <div className="flex justify-between border-t pt-1.5 mt-1.5">
                  <span className="text-gray-500">הסתברות ניסיונית:</span>
                  <span className="font-bold text-blue-600">{experimentalProb.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">הסתברות תיאורטית:</span>
                  <span className="font-bold text-purple-600">{theoreticalProb.toFixed(1)}%</span>
                </div>
              </div>
            </div>

            {totalRolls > 0 && (
              <div className="mt-4 p-2.5 bg-green-50 border border-green-100 rounded-xl text-center">
                <p className="text-[10px] text-green-700 leading-tight">
                  ככל שתטיל את הקוביות מספר רב יותר של פעמים, ההסתברות הניסיונית תתקרב להסתברות התיאורטית (חוק המספרים הגדולים).
                </p>
              </div>
            )}
          </div>

        </div>
      </div>

    </div>
  );
};
