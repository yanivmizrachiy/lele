import React, { useState } from "react";
import { initialQuestions } from "./data";
import {
  Printer,
  FileText,
  Check,
  BookmarkCheck,
  Info,
  HelpCircle
} from "lucide-react";

// Beautiful custom static SVG components for each mathematical question context
const SpinnerSvg = () => (
  <div className="flex flex-col items-center justify-center my-4 select-none">
    <svg width="180" height="180" viewBox="0 0 100 100" className="drop-shadow-sm">
      <circle cx="50" cy="50" r="46" fill="white" stroke="#374151" strokeWidth="2.5" />
      
      {/* Slice 1: 0 - 45 deg (כתום) */}
      <path d="M 50 50 L 96 50 A 46 46 0 0 1 82.5 82.5 Z" fill="#F97316" stroke="#374151" strokeWidth="1" />
      {/* Slice 2: 45 - 90 deg (כתום) */}
      <path d="M 50 50 L 82.5 82.5 A 46 46 0 0 1 50 96 Z" fill="#F97316" stroke="#374151" strokeWidth="1" />
      
      {/* Slice 3: 90 - 135 deg (ירוק) */}
      <path d="M 50 50 L 50 96 A 46 46 0 0 1 17.5 82.5 Z" fill="#22C55E" stroke="#374151" strokeWidth="1" />
      
      {/* Slice 4: 135 - 180 deg (כחול) */}
      <path d="M 50 50 L 17.5 82.5 A 46 46 0 0 1 4 50 Z" fill="#3B82F6" stroke="#374151" strokeWidth="1" />
      
      {/* Slice 5: 180 - 225 deg (אדום) */}
      <path d="M 50 50 L 4 50 A 46 46 0 0 1 17.5 17.5 Z" fill="#EF4444" stroke="#374151" strokeWidth="1" />
      
      {/* Slice 6: 225 - 270 deg (סגול) */}
      <path d="M 50 50 L 17.5 17.5 A 46 46 0 0 1 50 4 Z" fill="#A855F7" stroke="#374151" strokeWidth="1" />
      {/* Slice 7: 270 - 315 deg (סגול) */}
      <path d="M 50 50 L 50 4 A 46 46 0 0 1 82.5 17.5 Z" fill="#A855F7" stroke="#374151" strokeWidth="1" />
      {/* Slice 8: 315 - 360 deg (סגול) */}
      <path d="M 50 50 L 82.5 17.5 A 46 46 0 0 1 96 50 Z" fill="#A855F7" stroke="#374151" strokeWidth="1" />
      
      {/* Center Pin & Arrow */}
      <circle cx="50" cy="50" r="5" fill="#1F2937" stroke="white" strokeWidth="1" />
      {/* Arrow pointing to some position */}
      <path d="M 50 50 L 78 35" stroke="#1F2937" strokeWidth="3.5" strokeLinecap="round" />
      <polygon points="76,31 83,33 78,39" fill="#1F2937" />

      {/* Hebrew Labels */}
      <text x="73" y="66" fontSize="5.5" fontWeight="black" fill="white" textAnchor="middle">כתום</text>
      <text x="58" y="80" fontSize="5.5" fontWeight="black" fill="white" textAnchor="middle">כתום</text>
      <text x="42" y="80" fontSize="5.5" fontWeight="black" fill="white" textAnchor="middle">ירוק</text>
      <text x="27" y="66" fontSize="5.5" fontWeight="black" fill="white" textAnchor="middle">כחול</text>
      <text x="27" y="38" fontSize="5.5" fontWeight="black" fill="white" textAnchor="middle">אדום</text>
      <text x="42" y="24" fontSize="5.5" fontWeight="black" fill="white" textAnchor="middle">סגול</text>
      <text x="58" y="24" fontSize="5.5" fontWeight="black" fill="white" textAnchor="middle">סגול</text>
      <text x="73" y="38" fontSize="5.5" fontWeight="black" fill="white" textAnchor="middle">סגול</text>
    </svg>
    <span className="text-[11px] font-bold text-gray-500 mt-2">תרשים: גלגל המזל (8 גזרות שוות)</span>
  </div>
);

const UrnSvg = () => (
  <div className="flex flex-col items-center justify-center my-4 select-none">
    <svg width="150" height="170" viewBox="0 0 100 120">
      {/* Glass Jar Outline */}
      <path d="M 30 15 L 70 15 L 70 25 L 85 45 L 85 105 A 10 10 0 0 1 75 115 L 25 115 A 10 10 0 0 1 15 105 L 15 45 L 30 25 Z" fill="#F0F9FF" fillOpacity="0.4" stroke="#0284C7" strokeWidth="3" />
      {/* Cap */}
      <rect x="26" y="5" width="48" height="10" rx="3" fill="#024970" />
      
      {/* Yellow balls (5) */}
      <circle cx="30" cy="100" r="8" fill="#EAB308" stroke="#CA8A04" strokeWidth="1" />
      <circle cx="48" cy="103" r="8" fill="#EAB308" stroke="#CA8A04" strokeWidth="1" />
      <circle cx="68" cy="102" r="8" fill="#EAB308" stroke="#CA8A04" strokeWidth="1" />
      <circle cx="28" cy="84" r="8" fill="#EAB308" stroke="#CA8A04" strokeWidth="1" />
      <circle cx="45" cy="86" r="8" fill="#EAB308" stroke="#CA8A04" strokeWidth="1" />

      {/* Red balls (3) */}
      <circle cx="63" cy="85" r="8" fill="#EF4444" stroke="#DC2626" strokeWidth="1" />
      <circle cx="36" cy="68" r="8" fill="#EF4444" stroke="#DC2626" strokeWidth="1" />
      <circle cx="55" cy="69" r="8" fill="#EF4444" stroke="#DC2626" strokeWidth="1" />

      {/* Green balls (2) */}
      <circle cx="73" cy="72" r="8" fill="#22C55E" stroke="#16A34A" strokeWidth="1" />
      <circle cx="48" cy="51" r="8" fill="#22C55E" stroke="#16A34A" strokeWidth="1" />
      
      {/* Gloss Effect */}
      <circle cx="27" cy="98" r="2" fill="white" fillOpacity="0.6" />
      <circle cx="45" cy="101" r="2" fill="white" fillOpacity="0.6" />
      <circle cx="65" cy="100" r="2" fill="white" fillOpacity="0.6" />
      <circle cx="25" cy="82" r="2" fill="white" fillOpacity="0.6" />
      <circle cx="42" cy="84" r="2" fill="white" fillOpacity="0.6" />
      <circle cx="60" cy="83" r="2" fill="white" fillOpacity="0.6" />
      <circle cx="33" cy="66" r="2" fill="white" fillOpacity="0.6" />
      <circle cx="52" cy="67" r="2" fill="white" fillOpacity="0.6" />
      <circle cx="70" cy="70" r="2" fill="white" fillOpacity="0.6" />
      <circle cx="45" cy="49" r="2" fill="white" fillOpacity="0.6" />
    </svg>
    <span className="text-[11px] font-bold text-gray-500 mt-2">תרשים: כד עם 10 כדורים (5 צהובים, 3 אדומים, 2 ירוקים)</span>
  </div>
);

const DiceMatrix = () => (
  <div className="flex flex-col items-center justify-center my-4 select-none" dir="rtl">
    <div className="grid grid-cols-7 gap-1 max-w-sm w-full font-sans text-[10px] text-center border p-2 bg-gray-50/50 rounded-xl">
      <div className="bg-gray-100 p-1 rounded font-bold border border-gray-200">קוביה ב/א</div>
      {[1, 2, 3, 4, 5, 6].map(b => (
        <div key={b} className="bg-blue-50 text-blue-800 p-1 rounded font-bold border border-blue-200 flex items-center justify-center">כחול {b}</div>
      ))}
      {[1, 2, 3, 4, 5, 6].map(r => (
        <React.Fragment key={r}>
          <div className="bg-red-50 text-red-850 p-1 rounded font-bold border border-red-200 flex items-center justify-center">אדום {r}</div>
          {[1, 2, 3, 4, 5, 6].map(b => {
            const sum = r + b;
            const isMatch = sum > 9;
            return (
              <div
                key={b}
                className={`p-1 rounded border flex flex-col justify-center items-center ${
                  isMatch
                    ? "bg-green-100 border-green-300 text-green-900 font-extrabold"
                    : "bg-white border-gray-200 text-gray-600"
                }`}
              >
                <span className="text-[8px] text-gray-400">({r},{b})</span>
                <span className="text-[10px] font-semibold">{sum}</span>
              </div>
            );
          })}
        </React.Fragment>
      ))}
    </div>
    <span className="text-[11px] font-bold text-gray-500 mt-2">תרשים: מרחב מדגם (36 אפשרויות) - מסומנים באדום/ירוק סכומים מעל 9</span>
  </div>
);

const CardsTable = () => {
  const suits = [
    { name: "אדום", color: "text-red-700 bg-red-50/80 border-red-205" },
    { name: "ירוק", color: "text-green-700 bg-green-50/80 border-green-205" },
    { name: "כחול", color: "text-blue-700 bg-blue-50/80 border-blue-205" },
    { name: "צהוב", color: "text-yellow-750 bg-yellow-50/80 border-yellow-205" },
  ];
  return (
    <div className="flex flex-col items-center justify-center my-4 select-none" dir="rtl">
      <div className="flex flex-col gap-1 w-full max-w-md p-2 bg-gray-50/50 border rounded-xl">
        {suits.map((s) => (
          <div key={s.name} className="flex items-center gap-1.5 justify-center">
            <span className={`w-14 text-center text-[10px] font-black rounded-lg py-1 border ${s.color}`}>
              {s.name}
            </span>
            <div className="flex gap-1">
              {Array.from({ length: 10 }).map((_, i) => {
                const num = i + 1;
                return (
                  <div
                    key={num}
                    className="w-7 h-9 rounded border flex flex-col items-center justify-center text-[11px] font-bold bg-white border-gray-200 text-slate-700"
                  >
                    <span>{num}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <span className="text-[11px] font-bold text-gray-500 mt-2">תרשים: 4 סדרות של 10 קלפים כל אחת (40 קלפים בסך הכל)</span>
    </div>
  );
};

const StaticTreeSvg = () => (
  <div className="flex flex-col items-center justify-center my-4 select-none">
    <svg width="280" height="140" viewBox="0 0 280 140">
      <circle cx="140" cy="15" r="4.5" fill="#374151" />
      <text x="140" y="8" fontSize="8" fontWeight="bold" fill="#374151" textAnchor="middle">התחלה</text>

      <line x1="140" y1="15" x2="70" y2="55" stroke="#4B5563" strokeWidth="1.5" />
      <line x1="140" y1="15" x2="210" y2="55" stroke="#4B5563" strokeWidth="1.5" />
      
      <text x="100" y="32" fontSize="7.5" fill="#4B5563" fontWeight="bold">0.5</text>
      <text x="180" y="32" fontSize="7.5" fill="#4B5563" fontWeight="bold">0.5</text>

      <circle cx="70" cy="55" r="11" fill="#DBEAFE" stroke="#1D4ED8" strokeWidth="1" />
      <text x="70" y="58" fontSize="8" fontWeight="bold" fill="#1E40AF" textAnchor="middle">עץ</text>
      
      <circle cx="210" cy="55" r="11" fill="#FEF3C7" stroke="#D97706" strokeWidth="1" />
      <text x="210" y="58" fontSize="8" fontWeight="bold" fill="#92400E" textAnchor="middle">פלי</text>

      <line x1="70" y1="55" x2="35" y2="105" stroke="#4B5563" strokeWidth="1.5" />
      <line x1="70" y1="55" x2="105" y2="105" stroke="#4B5563" strokeWidth="1.5" />
      
      <line x1="210" y1="55" x2="175" y2="105" stroke="#4B5563" strokeWidth="1.5" />
      <line x1="210" y1="55" x2="245" y2="105" stroke="#4B5563" strokeWidth="1.5" />

      <text x="47" y="80" fontSize="7.5" fill="#4B5563">0.25</text>
      <text x="93" y="80" fontSize="7.5" fill="#4B5563">0.75</text>
      <text x="187" y="80" fontSize="7.5" fill="#4B5563">0.25</text>
      <text x="233" y="80" fontSize="7.5" fill="#4B5563">0.75</text>

      <circle cx="35" cy="105" r="9" fill="#D1FAE5" stroke="#047857" strokeWidth="1" />
      <text x="35" y="108" fontSize="7" fontWeight="bold" fill="#065F46" textAnchor="middle">כחול</text>
      <text x="35" y="124" fontSize="7" fill="#6B7280" textAnchor="middle">1/8</text>

      <circle cx="105" cy="105" r="9" fill="#F3F4F6" stroke="#4B5563" strokeWidth="1" />
      <text x="105" y="108" fontSize="7" fontWeight="bold" fill="#374151" textAnchor="middle">אחר</text>
      <text x="105" y="124" fontSize="7" fill="#6B7280" textAnchor="middle">3/8</text>

      <circle cx="175" cy="105" r="9" fill="#D1FAE5" stroke="#047857" strokeWidth="1" />
      <text x="175" y="108" fontSize="7" fontWeight="bold" fill="#065F46" textAnchor="middle">כחול</text>
      <text x="175" y="124" fontSize="7" fill="#6B7280" textAnchor="middle">1/8</text>

      <circle cx="245" cy="105" r="9" fill="#F3F4F6" stroke="#4B5563" strokeWidth="1" />
      <text x="245" y="108" fontSize="7" fontWeight="bold" fill="#374151" textAnchor="middle">אחר</text>
      <text x="245" y="124" fontSize="7" fill="#6B7280" textAnchor="middle">3/8</text>
    </svg>
    <span className="text-[11px] font-bold text-gray-500 mt-1">תרשים: דיאגרמת עץ דו-שלבית מפורטת (מטבע ולאחריו סביבון)</span>
  </div>
);

const StaticComplementarySvg = () => (
  <div className="flex flex-col items-center justify-center my-4 select-none">
    <div className="flex items-center gap-6 p-3 border rounded-xl bg-gray-50/50">
      <svg width="100" height="100" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="45" fill="none" stroke="#EF4444" strokeWidth="10" />
        <circle cx="50" cy="50" r="27" fill="none" stroke="#EF4444" strokeWidth="10" />
        <circle cx="50" cy="50" r="9" fill="#EF4444" />
      </svg>
      <div className="flex flex-col text-right text-xs gap-1">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-505 bg-red-500 inline-block" />
          <span>הסתברות פגיעה: <strong className="text-red-650">0.35</strong></span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-slate-400 inline-block" />
          <span>הסתברות החטאה: <strong className="text-slate-600">0.65</strong></span>
        </div>
        <div className="border-t pt-1 mt-1 text-[10px] text-gray-550 italic">
          נוסחה למאורע משלים:<br />
          P(משלים) = 1 - P(מאורע)
        </div>
      </div>
    </div>
    <span className="text-[11px] font-bold text-gray-500 mt-2">תרשים: קליעה למטרה ושני אירועים משלימים</span>
  </div>
);

const StaticBarChartSvg = () => (
  <div className="flex flex-col items-center justify-center my-4 select-none">
    <svg width="250" height="140" viewBox="0 0 250 140" className="border border-gray-200 rounded-lg p-2 bg-white drop-shadow-sm">
      <line x1="30" y1="110" x2="240" y2="110" stroke="#9CA3AF" strokeWidth="1.5" />
      <line x1="30" y1="15" x2="30" y2="110" stroke="#9CA3AF" strokeWidth="1.5" />
      
      {[0, 2, 4, 6, 8, 10].map(val => {
        const y = 110 - val * 8;
        return (
          <g key={val}>
            <line x1="26" y1={y} x2="30" y2={y} stroke="#9CA3AF" />
            <text x="22" y={y + 3} fontSize="7.5" fill="#4B5563" textAnchor="end">{val}</text>
          </g>
        );
      })}

      {/* Grade 60 (4 students) */}
      <rect x="45" y={110 - 4*8} width="22" height={4*8} fill="#3B82F6" rx="1.5" />
      <text x="56" y="122" fontSize="8.5" fontWeight="bold" fill="#374151" textAnchor="middle">60</text>
      <text x="56" y={110 - 4*8 - 3} fontSize="8" fontWeight="bold" fill="#1D4ED8" textAnchor="middle">4</text>

      {/* Grade 70 (6 students) */}
      <rect x="85" y={110 - 6*8} width="22" height={6*8} fill="#3B82F6" rx="1.5" />
      <text x="96" y="122" fontSize="8.5" fontWeight="bold" fill="#374151" textAnchor="middle">70</text>
      <text x="96" y={110 - 6*8 - 3} fontSize="8" fontWeight="bold" fill="#1D4ED8" textAnchor="middle">6</text>

      {/* Grade 80 (10 students) */}
      <rect x="125" y={110 - 10*8} width="22" height={10*8} fill="#3B82F6" rx="1.5" />
      <text x="136" y="122" fontSize="8.5" fontWeight="bold" fill="#374151" textAnchor="middle">80</text>
      <text x="136" y={110 - 10*8 - 3} fontSize="8" fontWeight="bold" fill="#1D4ED8" textAnchor="middle">10</text>

      {/* Grade 90 (6 students) */}
      <rect x="165" y={110 - 6*8} width="22" height={6*8} fill="#10B981" rx="1.5" />
      <text x="176" y="122" fontSize="8.5" fontWeight="bold" fill="#374151" textAnchor="middle">90</text>
      <text x="176" y={110 - 6*8 - 3} fontSize="8" fontWeight="bold" fill="#047857" textAnchor="middle">6</text>

      {/* Grade 100 (4 students) */}
      <rect x="205" y={110 - 4*8} width="22" height={4*8} fill="#10B981" rx="1.5" />
      <text x="216" y="122" fontSize="8.5" fontWeight="bold" fill="#374151" textAnchor="middle">100</text>
      <text x="216" y={110 - 4*8 - 3} fontSize="8" fontWeight="bold" fill="#047857" textAnchor="middle">4</text>

      <text x="10" y="12" fontSize="7" fontWeight="bold" fill="#4B5563" textAnchor="start">תלמידים</text>
    </svg>
    <span className="text-[11px] font-bold text-gray-500 mt-2">תרשים: התפלגות ציוני הכיתה לפי כמות תלמידים</span>
  </div>
);

const StaticGeometricSvg = () => (
  <div className="flex flex-col items-center justify-center my-4 select-none">
    <svg width="170" height="170" viewBox="0 0 200 200">
      <circle cx="100" cy="100" r="90" fill="#FEF08A" stroke="#EAB308" strokeWidth="2" />
      <circle cx="100" cy="100" r="60" fill="#BFDBFE" stroke="#3B82F6" strokeWidth="2" />
      <circle cx="100" cy="100" r="30" fill="#FECACA" stroke="#EF4444" strokeWidth="2" />
      <circle cx="100" cy="100" r="3" fill="#111827" />

      {/* Radius guidelines and texts */}
      <line x1="100" y1="100" x2="130" y2="100" stroke="#DC2626" strokeWidth="1" strokeDasharray="3" />
      <text x="115" y="94" fontSize="8.5" fontWeight="bold" fill="#991B1B">10 ס"מ</text>

      <line x1="100" y1="100" x2="100" y2="160" stroke="#2563EB" strokeWidth="1" strokeDasharray="3" />
      <text x="104" y="135" fontSize="8.5" fontWeight="bold" fill="#1E40AF">20 ס"מ</text>

      <line x1="100" y1="100" x2="36" y2="36" stroke="#CA8A04" strokeWidth="1" strokeDasharray="3" />
      <text x="56" y="52" fontSize="8.5" fontWeight="bold" fill="#854D0E" transform="rotate(-45, 56, 52)">30 ס"מ</text>

      <text x="100" y="82" fontSize="7.5" fontWeight="black" fill="#B91C1C" textAnchor="middle">אדום</text>
      <text x="100" y="52" fontSize="7.5" fontWeight="black" fill="#1D4ED8" textAnchor="middle">כחול</text>
      <text x="100" y="22" fontSize="7.5" fontWeight="black" fill="#854D0E" textAnchor="middle">צהוב</text>
    </svg>
    <span className="text-[11px] font-bold text-gray-500 mt-2">תרשים: שלושת המעגלים הקונצנטריים ומידות הרדיוס</span>
  </div>
);

// Renders 4 horizontal dotted workbook placeholder lines for the student's handwritten answer on paper
const WorkbookDottedLines = () => (
  <div className="mt-6 border border-gray-200 bg-gray-50/20 max-w-full rounded-xl p-4 flex flex-col justify-between">
    <span className="text-[11px] font-bold text-gray-400 mb-2 block leading-none">מקום לכתיבת דרך הפתרון, החישובים והתשובה הסופית:</span>
    <div className="space-y-6 py-2">
      <div className="border-b border-dashed border-gray-300 w-full h-[1px]" />
      <div className="border-b border-dashed border-gray-300 w-full h-[1px]" />
      <div className="border-b border-dashed border-gray-300 w-full h-[1px]" />
      <div className="border-b border-dashed border-gray-300 w-full h-[1px]" />
    </div>
  </div>
);

export default function App() {
  const [printSolutions, setPrintSolutions] = useState(true);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans flex flex-col justify-between" dir="rtl">
      
      {/* 1. Nice, minimalistic action header (strictly hidden on printed template files) */}
      <header className="bg-white border-b border-slate-200 py-5 px-6 shadow-sm no-print">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-right">
            <div className="flex items-center gap-2">
              <BookmarkCheck className="text-blue-600 w-6 h-6 shrink-0" />
              <h1 className="text-lg md:text-xl font-black text-slate-800">
                מחולל דפי עבודה מודפסים בהסתברות (חטיבת ביניים כיתה ח')
              </h1>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              כל 8 השאלות המקוריות מסודרות בהתאמה נוקשה - כל שאלה נדפסת בעמוד נפרד ונקי.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 text-xs font-bold text-slate-700 bg-slate-50 border px-3 py-2 rounded-xl cursor-pointer hover:bg-slate-100 transition-all">
              <input
                type="checkbox"
                checked={printSolutions}
                onChange={(e) => setPrintSolutions(e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500 font-medium w-4 h-4 cursor-pointer"
              />
              <span>הוסף דף מפתח תשובות בסוף</span>
            </label>

            <button
              id="global_print_btn"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition text-xs shadow-md"
            >
              <Printer size={15} />
              הדפס דף עבודה (PDF)
            </button>
          </div>
        </div>
      </header>

      {/* 2. Scrollable display representing what is going to be printed */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-6 space-y-8">
        
        {/* Helper tip above print */}
        <div className="bg-blue-50 border border-blue-150 p-4 rounded-2xl flex gap-2.5 items-start no-print">
          <Info size={16} className="text-blue-600 shrink-0 mt-0.5" />
          <div className="text-xs text-blue-800 leading-relaxed text-right">
            <strong>הנחיות הדפסה קלות:</strong> לחץ על "הדפס דף עבודה" למעלה. במאפייני ההדפסה של הדפדפן מומלץ לוודא שהאופציה <strong>"הדפס רקעי מילוי" (Background Graphics)</strong> מסומנת כדי שהסרגלים והגרפים הצבעוניים יופיעו במלואם.
          </div>
        </div>

        {/* The sequentially listed printable worksheets (each represents a single page) */}
        <div id="worksheet-pages" className="space-y-6 print:space-y-0">
          {initialQuestions.map((q, idx) => (
            <section
              key={q.id}
              className="bg-white border border-gray-200 rounded-3xl p-8 sm:p-10 shadow-sm relative print:border-none print:shadow-none print:p-0 print:my-0 print-page-break print:min-h-screen flex flex-col justify-between"
            >
              <div>
                {/* Header pattern in Ministry of Education standard layout */}
                <div className="border-b-2 border-slate-800 pb-3 mb-6 flex justify-between items-center">
                  <div>
                    <h2 className="text-xl md:text-2xl font-black text-slate-900 leading-tight">
                      משימת הערכה: {q.title}
                    </h2>
                    <span className="text-[10px] sm:text-xs text-slate-500 block mt-0.5">
                      נושא: אי-ודאות והסתברות בניסויים מקריים • כיתה ח' • משרד החינוך
                    </span>
                  </div>
                  <div className="text-left shrink-0">
                    <span className="text-[10px] sm:text-xs font-black bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg text-slate-700 tracking-wider">
                      חלק א' - דף {idx + 1}
                    </span>
                  </div>
                </div>

                {/* Question Text verbatim copy */}
                <div className="mb-6">
                  <p className="text-base font-medium leading-relaxed text-slate-850 whitespace-pre-line text-right">
                    {q.text}
                  </p>
                </div>

                {/* The beautifully embedded static SVG diagram */}
                <div className="my-4 bg-slate-50/50 p-3 rounded-2xl border border-gray-100/50 flex items-center justify-center">
                  {q.type === "spinner" && <SpinnerSvg />}
                  {q.type === "urn" && <UrnSvg />}
                  {q.type === "dice" && <DiceMatrix />}
                  {q.type === "cards" && <CardsTable />}
                  {q.type === "tree" && <StaticTreeSvg />}
                  {q.type === "complementary" && <StaticComplementarySvg />}
                  {q.type === "barchart" && <StaticBarChartSvg />}
                  {q.type === "geometric" && <StaticGeometricSvg />}
                </div>
              </div>

              {/* Dotted lines/workspace for students answering on physical paper */}
              <div className="mt-auto">
                <WorkbookDottedLines />
                
                {/* Printable footer */}
                <div className="mt-8 pt-3 border-t border-slate-100 flex justify-between items-center text-[9px] text-slate-400 select-none">
                  <span>דף עבודה מותאם לתלמיד • מיוצר באופן תקני על פי תוכנית הלימודים</span>
                  <span>עמוד {idx + 1}</span>
                </div>
              </div>
            </section>
          ))}

          {/* 3. Opt-in Page 9: Teacher Answer Key / Solution Manual */}
          {printSolutions && (
            <section className="bg-white border border-gray-200 rounded-3xl p-8 sm:p-10 shadow-sm relative print:border-none print:shadow-none print:p-0 print:my-0 print-page-break print:min-h-screen flex flex-col justify-between">
              <div>
                <div className="border-b-2 border-green-800 pb-3 mb-6 flex justify-between items-center">
                  <div>
                    <h2 className="text-xl md:text-2xl font-black text-green-900 leading-tight">
                      מפתח תשובות והסברים מפורטים (למורה בלבד)
                    </h2>
                    <span className="text-[10px] sm:text-xs text-green-600 block mt-0.5">
                      מדריך עזר פדגוגי מהיר לבדיקה והערכה של דפי העבודה
                    </span>
                  </div>
                  <div className="text-left shrink-0">
                    <span className="text-[10px] sm:text-xs font-black bg-green-55 bg-green-50 border border-green-200 px-3 py-1.5 rounded-lg text-green-700 tracking-wider">
                      דף תשובות ומחוון
                    </span>
                  </div>
                </div>

                <div className="space-y-5 text-right font-sans">
                  {initialQuestions.map((q) => (
                    <div key={q.id} className="p-3.5 border border-gray-150 rounded-xl bg-gray-55 bg-gray-50/50 space-y-1 text-xs">
                      <h4 className="font-extrabold text-slate-900 leading-none">
                        תשובה ל{q.title}:
                      </h4>
                      <p className="text-green-800 font-extrabold mt-1">
                        تשובה סופית: {q.answer}
                      </p>
                      <p className="text-slate-650 leading-relaxed mt-0.5 whitespace-pre-line text-[11px]">
                        <strong>דרך החישוב המדויקת:</strong> {q.solution}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="mt-8 pt-3 border-t border-slate-100 flex justify-between items-center text-[9px] text-slate-400 select-none">
                  <span>מפתח פתרונות ומחוון משרד החינוך – עזר הדרכה פדגוגי</span>
                  <span>עמוד מחוון</span>
                </div>
              </div>
            </section>
          )}
        </div>

      </main>

      {/* Page Footer */}
      <footer className="bg-slate-800 text-slate-400 py-4 text-center text-xs mt-12 no-print border-t border-slate-700">
        <p>מחולל דפי עבודה - אי-ודאות והסתברות • נבנה עבור מורים ותלמידים • משרד החינוך כיתה ח'</p>
      </footer>

    </div>
  );
}
