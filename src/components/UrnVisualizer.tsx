import React, { useState } from "react";
import { UrnData } from "../types";
import { RefreshCw, Play } from "lucide-react";

interface UrnVisualizerProps {
  data: UrnData;
  isGrayscale: boolean;
}

export const UrnVisualizer: React.FC<UrnVisualizerProps> = ({ data, isGrayscale }) => {
  const [drawnBall, setDrawnBall] = useState<{ color: string; label: string } | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawHistory, setDrawHistory] = useState<{ color: string; label: string }[]>([]);

  const totalBalls = data.balls.reduce((sum, b) => sum + b.count, 0);

  // Flatten balls for index selection
  const flatBallsList: { color: string; label: string }[] = [];
  data.balls.forEach((group) => {
    for (let i = 0; i < group.count; i++) {
      flatBallsList.push({ color: group.color, label: group.label });
    }
  });

  const handleDraw = () => {
    if (isDrawing) return;
    setIsDrawing(true);
    setDrawnBall(null);

    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * flatBallsList.length);
      const selected = flatBallsList[randomIndex];
      setDrawnBall(selected);
      setDrawHistory((prev) => [selected, ...prev].slice(0, 15));
      setIsDrawing(false);
    }, 800);
  };

  const handleReset = () => {
    setDrawnBall(null);
    setDrawHistory([]);
  };

  const ballsHistoryCounts = data.balls.reduce((acc, b) => {
    acc[b.label] = drawHistory.filter((ball) => ball.label === b.label).length;
    return acc;
  }, {} as Record<string, number>);

  const totalDrawn = drawHistory.length;

  return (
    <div className={`p-4 bg-gray-50/50 rounded-2xl border border-gray-100 flex flex-col md:flex-row items-center gap-6 justify-center ${isGrayscale ? "grayscale" : ""}`}>
      {/* Urn Drawing */}
      <div className="relative w-[180px] h-[200px] flex flex-col items-center justify-end select-none">
        
        {/* Glass jar body */}
        <div className="relative w-[150px] h-[160px] border-[4px] border-slate-300 rounded-b-[40px] rounded-t-[15px] bg-sky-50/10 shadow-inner flex flex-wrap content-end justify-center p-3 gap-1.5 overflow-hidden">
          {/* Jar cap/rim */}
          <div className="absolute top-0 left-[25%] right-[25%] h-3 bg-slate-300 rounded-b-md"></div>
          
          {/* Drawing floating ball container */}
          {isDrawing && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/20 backdrop-blur-[1px] z-10 transition-all">
              <div className="w-8 h-8 rounded-full border-2 border-slate-400 bg-slate-300 animate-bounce"></div>
            </div>
          )}

          {/* Render static balls in the jar */}
          {flatBallsList.map((ball, idx) => {
            // Apply unique minor translate or offset to make them pack naturally
            const rowIdx = Math.floor(idx / 4);
            const colIdx = idx % 4;
            const tilt = (rowIdx + colIdx) % 3 === 0 ? "translate-y-0.5" : "-translate-y-0.5";
            return (
              <div
                key={idx}
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-md transition-all duration-300 ${tilt}`}
                style={{ backgroundColor: ball.color }}
                title={ball.label}
              >
                {ball.label[0]}
              </div>
            );
          })}
        </div>
      </div>

      {/* Stats and Controls */}
      <div className="flex-1 flex flex-col w-full text-right" dir="rtl">
        <h4 className="text-sm font-bold text-gray-700 mb-2">סימולטור הוצאת כדורים (עם החזרה):</h4>

        {/* Buttons */}
        <div className="flex gap-2 mb-4 w-full justify-start no-print">
          <button
            id="draw_ball_btn"
            onClick={handleDraw}
            disabled={isDrawing}
            className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded-xl font-medium text-xs hover:bg-blue-700 disabled:opacity-50 shadow-sm transition-all"
          >
            <Play size={14} className={isDrawing ? "animate-spin" : ""} />
            {isDrawing ? "מוציא..." : "שלוף כדור מהכד"}
          </button>
          
          {totalDrawn > 0 && (
            <button
              id="reset_urn_btn"
              onClick={handleReset}
              className="flex items-center gap-1 px-3 py-2 border border-gray-200 text-gray-600 rounded-xl text-xs hover:bg-gray-100 transition-all font-medium"
            >
              <RefreshCw size={12} />
              איפוס סטטיסטיקה
            </button>
          )}
        </div>

        {/* Floating results */}
        {drawnBall && !isDrawing && (
          <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl mb-4 flex items-center justify-between">
            <span className="text-xs text-blue-700 font-medium">הכדור שנשלף:</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-blue-900">
                {drawnBall.label}
              </span>
              <div className="w-[18px] h-[18px] rounded-full border border-sky-400" style={{ backgroundColor: drawnBall.color }} />
            </div>
          </div>
        )}

        {/* Summary Table */}
        <div className="bg-white p-3 rounded-xl border border-gray-200">
          <div className="text-[11px] font-bold text-gray-500 mb-2 border-b pb-1 flex justify-between">
            <span>טבלת הרכב הכדורים</span>
            <span>סה\"כ הוצאות: {totalDrawn}</span>
          </div>
          <div className="space-y-2">
            {data.balls.map((b, idx) => {
              const countInUrn = b.count;
              const drawnCount = ballsHistoryCounts[b.label] || 0;
              const experimentalProb = totalDrawn > 0 ? (drawnCount / totalDrawn) * 100 : 0;
              const theoreticalProb = (countInUrn / totalBalls) * 100;
              return (
                <div key={idx} className="flex flex-col gap-1 text-[11px]">
                  <div className="flex items-center justify-between font-medium">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: b.color }} />
                      <span className="text-gray-700">{b.label} ({countInUrn}/{totalBalls} כדורים)</span>
                    </div>
                    <span className="text-gray-500">
                      נשלפו: <strong className="text-gray-700">{drawnCount}</strong> ({experimentalProb.toFixed(0)}%)
                      | סיכוי תיאורטי: <strong>{theoreticalProb.toFixed(1)}%</strong>
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden flex">
                    <div
                      className="bg-gray-300 h-full transition-all duration-300"
                      style={{ width: `${theoreticalProb}%` }}
                    />
                    <div
                      className="bg-blue-500 h-full transition-all duration-300 border-l border-white"
                      style={{ width: `${experimentalProb}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
