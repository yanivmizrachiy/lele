import React, { useState } from "react";
import { BarChartData } from "../types";
import { RefreshCw, Plus, Minus, BarChart } from "lucide-react";

interface BarChartVisualizerProps {
  data: BarChartData;
  isGrayscale: boolean;
}

export const BarChartVisualizer: React.FC<BarChartVisualizerProps> = ({ data, isGrayscale }) => {
  const [grades, setGrades] = useState(data.grades);

  const handleIncrement = (idx: number) => {
    setGrades((prev) =>
      prev.map((g, i) => (i === idx ? { ...g, students: Math.min(20, g.students + 1) } : g))
    );
  };

  const handleDecrement = (idx: number) => {
    setGrades((prev) =>
      prev.map((g, i) => (i === idx ? { ...g, students: Math.max(0, g.students - 1) } : g))
    );
  };

  const handleReset = () => {
    setGrades(data.grades);
  };

  const totalStudents = grades.reduce((sum, g) => sum + g.students, 0);
  const targetsCount = grades
    .filter((g) => g.grade > 80)
    .reduce((sum, g) => sum + g.students, 0);

  const liveProbability = totalStudents > 0 ? (targetsCount / totalStudents) * 100 : 0;
  
  // Find maximum count to scale SVGA heights
  const maxCount = Math.max(5, ...grades.map((g) => g.students));

  return (
    <div className={`p-4 bg-gray-50/50 rounded-2xl border border-gray-100 flex flex-col md:flex-row gap-6 items-center justify-center ${isGrayscale ? "grayscale" : ""}`}>
      
      {/* Interactive Bar Chart using SVG or styled divs */}
      <div className="flex-1 flex flex-col items-center justify-center bg-white p-3.5 rounded-xl border border-gray-200 shadow-sm w-full select-none" dir="rtl">
        <div className="text-[10px] font-bold text-gray-500 mb-3 flex items-center gap-1">
          <BarChart size={13} />
          <span>התפלגות ציונים אינטראקטיבית (שנה את כמות התלמידים):</span>
        </div>

        {/* The Bars container */}
        <div className="flex items-end justify-between w-full max-w-[280px] h-[130px] border-b border-gray-300 pb-1 px-2.5">
          {grades.map((g, idx) => {
            const barHeightPct = totalStudents > 0 ? (g.students / maxCount) * 100 : 0;
            const isTarget = g.grade > 80;
            return (
              <div key={g.grade} className="flex flex-col items-center flex-1 mx-1.5 group">
                {/* Floating student count */}
                <span className="text-[10px] font-extrabold text-blue-600 mb-1 leading-none">
                  {g.students}
                </span>
                
                {/* Visual Bar */}
                <div className="relative w-7 bg-slate-100 rounded-t-sm h-28 flex items-end">
                  <div
                    className={`w-full rounded-t-sm transition-all duration-300 ${
                      isTarget 
                        ? "bg-green-500 group-hover:bg-green-600" 
                        : "bg-blue-500 group-hover:bg-blue-600"
                    }`}
                    style={{ height: `${barHeightPct}%` }}
                  />
                </div>
                
                {/* Grade label */}
                <span className="text-[10px] font-bold text-gray-700 mt-1.5 leading-none">
                  {g.grade}
                </span>
              </div>
            );
          })}
        </div>

        {/* Interactive +/- Controls */}
        <div className="flex justify-between w-full max-w-[280px] mt-2 pb-1.5 px-2.5 border-b border-gray-100 no-print">
          {grades.map((g, idx) => (
            <div key={g.grade} className="flex items-center gap-0.5 justify-center flex-1 mx-1 text-center">
              <button
                id={`inc_grade_${g.grade}`}
                onClick={() => handleIncrement(idx)}
                className="p-0.5 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-all"
                title="הוסף תלמיד"
              >
                <Plus size={8} />
              </button>
              <button
                id={`dec_grade_${g.grade}`}
                onClick={() => handleDecrement(idx)}
                className="p-0.5 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-all"
                disabled={g.students <= 0}
                title="הסר תלמיד"
              >
                <Minus size={8} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Live calculations */}
      <div className="flex-1 flex flex-col w-full text-right" dir="rtl">
        <h4 className="text-sm font-bold text-gray-700 mb-2">חישובים והסתברויות:</h4>
        
        <div className="space-y-4">
          <div className="bg-white p-3 rounded-xl border border-gray-200 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-500">מספר נבחנים כולל:</span>
              <span className="font-extrabold text-slate-800">{totalStudents} תלמידים</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">תלמידים עם ציון מעל 80 (90, 100):</span>
              <span className="font-extrabold text-green-600">{targetsCount} תלמידים</span>
            </div>
            <div className="flex justify-between border-t pt-2 mt-2">
              <span className="text-gray-500">הסתברות לבחור תלמיד כזה:</span>
              <span className="font-extrabold text-blue-600">
                {totalStudents > 0 
                  ? `${targetsCount}/${totalStudents} (${liveProbability.toFixed(1)}%)` 
                  : "0 שחקנים (0%)"}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between no-print">
            <button
              id="reset_grades_btn"
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 text-gray-650 rounded-xl text-xs hover:bg-gray-100 transition-all font-semibold"
            >
              <RefreshCw size={12} />
              שחזר נתוני שאלה מקוריים
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};
