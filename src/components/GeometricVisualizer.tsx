import React, { useState } from "react";
import { GeometricData } from "../types";
import { RefreshCw, Play } from "lucide-react";

interface GeometricVisualizerProps {
  data: GeometricData;
  isGrayscale: boolean;
}

export const GeometricVisualizer: React.FC<GeometricVisualizerProps> = ({ data, isGrayscale }) => {
  const [darts, setDarts] = useState<{ x: number; y: number; zone: "inner" | "middle" | "outer" }[]>([]);
  const [isThrowing, setIsThrowing] = useState(false);
  const [currentResult, setCurrentResult] = useState<string | null>(null);

  const handleThrow = () => {
    if (isThrowing) return;
    setIsThrowing(true);
    setCurrentResult(null);

    setTimeout(() => {
      // Throw random dart within the outer radius (30 cm)
      // Generate x, y using polar coordinates to ensure it lands inside the circular target
      const angle = Math.random() * 2 * Math.PI;
      const radius = Math.random() * data.outerRadius; // radius between 0 and 30 cm

      // Determine landing zone
      let zone: "inner" | "middle" | "outer" = "outer";
      let zoneName = "טבעת חיצונית צהובה";
      if (radius <= data.innerRadius) {
        zone = "inner";
        zoneName = "עיגול פנימי אדום";
      } else if (radius <= data.middleRadius) {
        zone = "middle";
        zoneName = "טבעת אמצעית כחולה";
      }

      // Convert polar back to cartesian for SVG rendering (center at 100, 100, outer circle is 90px radius)
      // SVG scale factor: 90px corresponds to 30 cm (factor of 3)
      const scale = 3;
      const svgR = radius * scale;
      const svgX = 100 + svgR * Math.cos(angle);
      const svgY = 100 + svgR * Math.sin(angle);

      const newDart = { x: svgX, y: svgY, zone };
      setDarts((prev) => [newDart, ...prev].slice(0, 50)); // store up to 50 dots
      setCurrentResult(`פגיעה ב-${zoneName}!`);
      setIsThrowing(false);
    }, 600);
  };

  const handleReset = () => {
    setDarts([]);
    setCurrentResult(null);
  };

  const totalThrows = darts.length;
  const innerCount = darts.filter((d) => d.zone === "inner").length;
  const middleCount = darts.filter((d) => d.zone === "middle").length;
  const outerCount = darts.filter((d) => d.zone === "outer").length;

  const expInner = totalThrows > 0 ? (innerCount / totalThrows) * 100 : 0;
  const expMiddle = totalThrows > 0 ? (middleCount / totalThrows) * 100 : 0;
  const expOuter = totalThrows > 0 ? (outerCount / totalThrows) * 100 : 0;

  // Theoretical Probabilities: proportional to area
  // Inner: r=10, Area = 100pi, total = 900pi => Prob = 100/900 = 11.1%
  // Middle ring: r=20, Area = 400pi - 100pi = 300pi => Prob = 300/900 = 33.3%
  // Outer ring: r=30, Area = 900pi - 400pi = 500pi => Prob = 500/900 = 55.6%
  const theorInner = (100 / 900) * 100;
  const theorMiddle = (300 / 900) * 100;
  const theorOuter = (500 / 900) * 100;

  return (
    <div className={`p-4 bg-gray-50/50 rounded-2xl border border-gray-100 flex flex-col md:flex-row gap-6 items-center justify-center ${isGrayscale ? "grayscale" : ""}`}>
      
      {/* Target Dartboard rendering */}
      <div className="relative w-[210px] h-[210px] select-none bg-white p-1 rounded-full border border-gray-100 shadow-md flex items-center justify-center">
        <svg width="200" height="200" viewBox="0 0 200 200" className="w-full h-full">
          {/* Outer circle: radius 90 px (represents 30 cm) */}
          <circle cx="100" cy="100" r="90" fill="#FEF08A" stroke="#EAB308" strokeWidth="2" />
          
          {/* Middle circle: radius 60 px (represents 20 cm) */}
          <circle cx="100" cy="100" r="60" fill="#BFDBFE" stroke="#3B82F6" strokeWidth="2" />
          
          {/* Inner circle: radius 30 px (represents 10 cm) */}
          <circle cx="100" cy="100" r="30" fill="#FECACA" stroke="#EF4444" strokeWidth="2" />
          
          {/* Center tiny target bullseye */}
          <circle cx="100" cy="100" r="3" fill="#ffffff" />

          {/* Render thrown darts/dots */}
          {darts.map((d, i) => (
            <circle
              key={i}
              cx={d.x}
              cy={d.y}
              r="4"
              fill="#111827"
              stroke="#ffffff"
              strokeWidth="1.5"
              className="animate-bounce"
              style={{
                opacity: i === 0 ? 1 : 0.45,
                transformOrigin: `${d.x}px ${d.y}px`,
              }}
            />
          ))}
        </svg>

        {isThrowing && (
          <div className="absolute inset-0 flex items-center justify-center rounded-full bg-slate-900/10 backdrop-blur-[0.5px]">
            <div className="animate-ping w-8 h-8 rounded-full bg-slate-800"></div>
          </div>
        )}
      </div>

      {/* Control statistics */}
      <div className="flex-1 flex flex-col w-full text-right" dir="rtl">
        <h4 className="text-sm font-bold text-gray-700 mb-2">סימולטור זריקת חיצים גאומטרית:</h4>

        <div className="flex gap-2 mb-3 w-full justify-start no-print">
          <button
            id="throw_dart_btn"
            onClick={handleThrow}
            disabled={isThrowing}
            className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded-xl font-medium text-xs hover:bg-blue-700 disabled:opacity-50 shadow-sm transition-all"
          >
            <Play size={14} />
            {isThrowing ? "זורק..." : "זרוק חץ באקראי"}
          </button>
          
          {totalThrows > 0 && (
            <button
              id="reset_geometric_btn"
              onClick={handleReset}
              className="flex items-center gap-1 px-3 py-2 border border-gray-200 text-gray-600 rounded-xl text-xs hover:bg-gray-100 transition-all font-medium"
            >
              <RefreshCw size={12} />
              איפוס סטטיסטיקה
            </button>
          )}
        </div>

        {currentResult && (
          <div className="p-2 bg-blue-50 border border-blue-100 rounded-xl mb-3 text-center">
            <span className="text-xs text-blue-700 font-medium">תוצאה:</span>
            <span className="text-sm font-bold text-blue-900 block mt-0.5">🎯 {currentResult}</span>
          </div>
        )}

        {/* Dynamic results table */}
        <div className="bg-white p-3 rounded-xl border border-gray-200">
          <div className="text-[11px] font-bold text-gray-500 mb-2 border-b pb-1 flex justify-between">
            <span>טבלת פגיעות לפי אזורים</span>
            <span>סה\"כ פגיעות: {totalThrows}</span>
          </div>
          <div className="space-y-2 text-[11px]">
            {/* Inner row */}
            <div className="flex flex-col gap-0.5">
              <div className="flex justify-between font-semibold">
                <span className="text-red-600">עיגול פנימי אדום (רדיוס 10 ס"מ)</span>
                <span className="text-gray-500">
                  פגיעות: <strong className="text-gray-700">{innerCount}</strong> ({expInner.toFixed(0)}%)
                  | תיאורטי: <strong>{theorInner.toFixed(1)}%</strong>
                </span>
              </div>
              <div className="w-full bg-gray-100 h-1 rounded-full overflow-hidden flex">
                <div className="bg-red-300 h-full" style={{ width: `${theorInner}%` }} />
                <div className="bg-red-600 h-full" style={{ width: `${expInner}%` }} />
              </div>
            </div>

            {/* Middle row */}
            <div className="flex flex-col gap-0.5">
              <div className="flex justify-between font-semibold">
                <span className="text-blue-600">טבעת אמצעית כחולה (רדיוס 20 ס"מ)</span>
                <span className="text-gray-500">
                  פגיעות: <strong className="text-gray-700">{middleCount}</strong> ({expMiddle.toFixed(0)}%)
                  | תיאורטי: <strong>{theorMiddle.toFixed(1)}%</strong>
                </span>
              </div>
              <div className="w-full bg-gray-100 h-1 rounded-full overflow-hidden flex">
                <div className="bg-blue-300 h-full" style={{ width: `${theorMiddle}%` }} />
                <div className="bg-blue-600 h-full" style={{ width: `${expMiddle}%` }} />
              </div>
            </div>

            {/* Outer row */}
            <div className="flex flex-col gap-0.5">
              <div className="flex justify-between font-semibold">
                <span className="text-yellow-600">טבעת חיצונית צהובה (רדיוס 30 ס"מ)</span>
                <span className="text-gray-500">
                  פגיעות: <strong className="text-gray-700">{outerCount}</strong> ({expOuter.toFixed(0)}%)
                  | תיאורטי: <strong>{theorOuter.toFixed(1)}%</strong>
                </span>
              </div>
              <div className="w-full bg-gray-100 h-1 rounded-full overflow-hidden flex">
                <div className="bg-yellow-300 h-full" style={{ width: `${theorOuter}%` }} />
                <div className="bg-yellow-600 h-full" style={{ width: `${expOuter}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
