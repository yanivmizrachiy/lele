import React, { useState, useRef } from "react";
import { SpinnerData } from "../types";
import { RefreshCw, Play } from "lucide-react";

interface SpinnerVisualizerProps {
  data: SpinnerData;
  isGrayscale: boolean;
}

export const SpinnerVisualizer: React.FC<SpinnerVisualizerProps> = ({ data, isGrayscale }) => {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinHistory, setSpinHistory] = useState<string[]>([]);
  const [selectedSec, setSelectedSec] = useState<string | null>(null);
  
  const totalWeight = data.sectors.reduce((sum, s) => sum + s.weight, 0);

  // Pre-calculate accumulated angles
  let accumulatedFraction = 0;
  const sectorsWithAngles = data.sectors.map((sector) => {
    const startAngle = accumulatedFraction * 360;
    const sizeAngle = (sector.weight / totalWeight) * 360;
    accumulatedFraction += sector.weight / totalWeight;
    return {
      ...sector,
      startAngle,
      endAngle: startAngle + sizeAngle,
    };
  });

  const handleSpin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setSelectedSec(null);

    // Random spin: multiple full rotations + some extra random degrees
    const extraDegrees = Math.floor(Math.random() * 360);
    const totalNewRotation = rotation + 1800 + extraDegrees;
    setRotation(totalNewRotation);

    setTimeout(() => {
      setIsSpinning(false);
      // Determine landing sector (the pointer is pointing up, i.e., at 270 degrees clockwise or 90 degrees CCW depending on how you read it. Let's make pointer at the top (270 degrees).
      // Since rotation rotates the dial clockwise, the pointer points to (270 - rotation) % 360.
      const endingAngle = (360 - (totalNewRotation % 360) + 270) % 360;
      
      const landedSector = sectorsWithAngles.find((s) => {
        return endingAngle >= s.startAngle && endingAngle < s.endAngle;
      }) || sectorsWithAngles[0];

      setSelectedSec(landedSector.label);
      setSpinHistory((prev) => [landedSector.label, ...prev].slice(0, 10));
    }, 3000);
  };

  const resetStats = () => {
    setSpinHistory([]);
    setSelectedSec(null);
  };

  // SVGs paths to draw pie sectors
  const renderSectorsSVG = () => {
    return sectorsWithAngles.map((sec, idx) => {
      const radStart = (sec.startAngle * Math.PI) / 180;
      const radEnd = (sec.endAngle * Math.PI) / 180;
      const x1 = 100 + 90 * Math.cos(radStart);
      const y1 = 100 + 90 * Math.sin(radStart);
      const x2 = 100 + 90 * Math.cos(radEnd);
      const y2 = 100 + 90 * Math.sin(radEnd);
      
      const largeArcFlag = sec.endAngle - sec.startAngle > 180 ? 1 : 0;
      
      const pathData = `
        M 100 100
        L ${x1} ${y1}
        A 90 90 0 ${largeArcFlag} 1 ${x2} ${y2}
        Z
      `;

      // Central text angle
      const textAngle = ((sec.startAngle + sec.endAngle) / 2 * Math.PI) / 180;
      const tx = 100 + 55 * Math.cos(textAngle);
      const ty = 100 + 55 * Math.sin(textAngle);

      return (
        <g key={idx}>
          <path
            d={pathData}
            fill={sec.color}
            stroke="#ffffff"
            strokeWidth="1.5"
            className="transition-all duration-300 pointer-events-none"
          />
          <text
            x={tx}
            y={ty}
            fill="#ffffff"
            fontSize="9 font-semibold"
            fontFamily="Heebo, system-ui"
            textAnchor="middle"
            dominantBaseline="middle"
            transform={`rotate(${(sec.startAngle + sec.endAngle) / 2 + 90}, ${tx}, ${ty})`}
            className="select-none font-bold drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
          >
            {sec.label}
          </text>
        </g>
      );
    });
  };

  // Calculate stats
  const totalSpins = spinHistory.length;
  const sectorCounts = data.sectors.reduce((acc, s) => {
    acc[s.label] = spinHistory.filter((v) => v === s.label).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className={`p-4 bg-gray-50/50 rounded-2xl border border-gray-100 flex flex-col md:flex-row items-center gap-6 justify-center ${isGrayscale ? "grayscale" : ""}`}>
      {/* Spinner Graphic and Pointer */}
      <div className="relative w-[230px] h-[230px] flex items-center justify-center select-none">
        {/* Pointer needle at top */}
        <div className="absolute top-1 z-20 flex flex-col items-center">
          <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[20px] border-t-slate-800 drop-shadow-md"></div>
          <div className="w-2 h-2 rounded-full bg-slate-800 -mt-1"></div>
        </div>

        {/* Outer frame */}
        <div className="w-[204px] h-[204px] rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center overflow-hidden">
          <svg
            width="200"
            height="200"
            viewBox="0 0 200 200"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: isSpinning ? "transform 3s cubic-bezier(0.2, 0.8, 0.2, 1)" : "none",
            }}
            className="w-full h-full"
          >
            {renderSectorsSVG()}
            {/* Inner tiny circle */}
            <circle cx="100" cy="100" r="10" fill="#ffffff" stroke="#bbbbbb" strokeWidth="2" />
          </svg>
        </div>
      </div>

      {/* Control Panel / Live Statistics */}
      <div className="flex-1 flex flex-col w-full text-right" dir="rtl">
        <h4 className="text-sm font-bold text-gray-700 mb-2">סימולטור סיבובים אינטראקטיבי:</h4>
        
        {/* Actions */}
        <div className="flex gap-2 mb-4 w-full justify-start no-print">
          <button
            id="spin_wheel_btn"
            onClick={handleSpin}
            disabled={isSpinning}
            className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded-xl font-medium text-xs hover:bg-blue-700 disabled:opacity-50 shadow-sm transition-all"
          >
            <Play size={14} />
            {isSpinning ? "מסתובב..." : "סובב גלגל המזל"}
          </button>
          
          {totalSpins > 0 && (
            <button
              id="reset_stats_btn"
              onClick={resetStats}
              className="flex items-center gap-1 px-3 py-2 border border-gray-200 text-gray-600 rounded-xl text-xs hover:bg-gray-100 transition-all font-medium"
            >
              <RefreshCw size={12} />
              איפוס סטטיסטיקה
            </button>
          )}
        </div>

        {/* Current Result Banner */}
        {selectedSec && (
          <div className="p-2.5 bg-blue-50 border border-blue-100 rounded-xl mb-4 text-center">
            <span className="text-xs text-blue-700 font-medium">תוצאת סיבוב אחרון:</span>
            <span className="text-sm font-bold text-blue-900 block mt-1">🎉 הגלגל עצר על {selectedSec}!</span>
          </div>
        )}

        {/* Stats Table */}
        <div className="bg-white p-3 rounded-xl border border-gray-200">
          <div className="text-xs font-bold text-gray-500 mb-2 border-b pb-1 flex justify-between">
            <span>טבלת תוצאות</span>
            <span>סך סיבובים: {totalSpins}</span>
          </div>
          <div className="space-y-2">
            {data.sectors.map((sec, idx) => {
              const count = sectorCounts[sec.label] || 0;
              const experimentalProb = totalSpins > 0 ? (count / totalSpins) * 100 : 0;
              const theoreticalProb = (sec.weight / totalWeight) * 100;
              return (
                <div key={idx} className="flex flex-col gap-1 text-[11px]">
                  <div className="flex items-center justify-between font-medium">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: sec.color }} />
                      <span className="text-gray-700">{sec.label} ({sec.weight}/8)</span>
                    </div>
                    <span className="text-gray-500">
                      ניסיוני: <strong className="text-gray-700">{count}</strong> ({experimentalProb.toFixed(0)}%)
                      | תיאורטי: <strong>{theoreticalProb.toFixed(1)}%</strong>
                    </span>
                  </div>
                  {/* Progress bar representational */}
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
