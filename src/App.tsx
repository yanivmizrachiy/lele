import React, { useState, useEffect } from "react";
import { initialQuestions } from "./data";
import { Question } from "./types";
import {
  Printer,
  FileText,
  Check,
  BookmarkCheck,
  Info,
  HelpCircle,
  Github,
  Loader2,
  Lock,
  Save,
  CheckCircle2,
  AlertCircle,
  Eye,
  Settings,
  Edit2
} from "lucide-react";

// ==========================================
// 1. HIGH-FIDELITY VECTOR GRAPHICS (SVGs)
// ==========================================

const SpinnerSvg = () => (
  <div className="flex flex-col items-center justify-center my-2 p-2 bg-slate-50 border border-slate-100 rounded-2xl select-none">
    <svg width="150" height="150" viewBox="0 0 100 100" className="drop-shadow-sm">
      <circle cx="50" cy="50" r="46" fill="white" stroke="#1e293b" strokeWidth="2" />
      {/* 12 sectors of 30deg each. */}
      {/* Red is exactly 1/12 (30 deg) -> say 0 to 30 deg */}
      <path d="M 50 50 L 96 50 A 46 46 0 0 1 89.8 73 Z" fill="#ef4444" stroke="#1e293b" strokeWidth="0.8" />
      <text x="83" y="58" fontSize="4.5" fontWeight="bold" fill="white" transform="rotate(15, 83, 58)">אדום</text>

      {/* Others are Orange, Green, Purple, Blue, White segments */}
      <path d="M 50 50 L 89.8 73 A 46 46 0 0 1 73 89.8 Z" fill="#f97316" stroke="#1e293b" strokeWidth="0.8" />
      <path d="M 50 50 L 73 89.8 A 46 46 0 0 1 50 96 Z" fill="#22c55e" stroke="#1e293b" strokeWidth="0.8" />
      <path d="M 50 50 L 50 96 A 46 46 0 0 1 27 89.8 Z" fill="#3b82f6" stroke="#1e293b" strokeWidth="0.8" />
      <path d="M 50 50 L 27 89.8 A 46 46 0 0 1 10.2 73 Z" fill="#a855f7" stroke="#1e293b" strokeWidth="0.8" />
      <path d="M 50 50 L 10.2 73 A 46 46 0 0 1 4 50 Z" fill="#e2e8f0" stroke="#1e293b" strokeWidth="0.8" />
      
      {/* Fill the other half (180 to 360 deg) as multi-colored */}
      <path d="M 50 50 L 4 50 A 46 46 0 0 1 50 4 Z" fill="#a855f7" fillOpacity="0.8" stroke="#1e293b" strokeWidth="0.8" />
      <path d="M 50 50 L 50 4 A 46 46 0 0 1 96 50 Z" fill="#f97316" fillOpacity="0.8" stroke="#1e293b" strokeWidth="0.8" />
      
      {/* Central Arrow */}
      <circle cx="50" cy="50" r="4.5" fill="#1e293b" />
      <path d="M 50 50 L 82 25" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
      <polygon points="80,21 86,24 81,28" fill="#1e293b" />
    </svg>
    <span className="text-[10px] text-slate-500 font-bold mt-1">תרשים א': גלגל המזל של סער (12 גזרות שוות)</span>
  </div>
);

const VehiclesSvg = () => (
  <div className="flex flex-col items-center justify-center my-2 p-2 bg-slate-50 border border-slate-100 rounded-2xl select-none w-full max-w-md">
    <div className="grid grid-cols-4 gap-2 w-full text-center text-xs font-bold font-mono">
      <div className="bg-blue-100 p-1.5 rounded-lg border border-blue-200">
        <div className="text-blue-900 text-[10px]">מכוניות</div>
        <div className="text-sm">60</div>
      </div>
      <div className="bg-orange-100 p-1.5 rounded-lg border border-orange-200">
        <div className="text-orange-900 text-[10px]">אופניים</div>
        <div className="text-sm">30</div>
      </div>
      <div className="bg-emerald-100 p-1.5 rounded-lg border border-emerald-200">
        <div className="text-emerald-900 text-[10px]">אוטובוסים</div>
        <div className="text-sm">10</div>
      </div>
      <div className="bg-purple-100 p-1.5 rounded-lg border border-purple-200">
        <div className="text-purple-900 text-[10px]">משאיות</div>
        <div className="text-sm">20</div>
      </div>
    </div>
    <span className="text-[10px] text-slate-500 font-bold mt-2">טבלת נתוני התצפית (120 רכבים בסך הכל)</span>
  </div>
);

const FootballSvg = () => (
  <div className="flex flex-col items-center justify-center my-2 p-2 bg-slate-50 border border-slate-100 rounded-2xl select-none w-full max-w-sm">
    <svg width="240" height="130" viewBox="0 0 240 130" className="bg-white rounded p-1 border">
      <line x1="25" y1="105" x2="230" y2="105" stroke="#475569" strokeWidth="1.5" />
      <line x1="25" y1="10" x2="25" y2="105" stroke="#475569" strokeWidth="1.5" />
      {/* y-ticks or grid lines (0 to 12) */}
      {[0, 2, 4, 6, 8, 10, 12].map(v => {
        const y = 105 - (v * 7.5);
        return (
          <g key={v}>
            <line x1="21" y1={y} x2="25" y2={y} stroke="#94a3b8" />
            <text x="17" y={y + 3} fontSize="8" fill="#475569" textAnchor="end">{v}</text>
            <line x1="25" y1={y} x2="230" y2={y} stroke="#f1f5f9" strokeWidth="0.8" />
          </g>
        );
      })}
      {/* Bars: x values 0 to 7 */}
      {[
        { x: 0, val: 6 }, { x: 1, val: 8 }, { x: 2, val: 12 }, { x: 3, val: 11 },
        { x: 4, val: 7 }, { x: 5, val: 3 }, { x: 6, val: 2 }, { x: 7, val: 1 }
      ].map((bar, i) => {
        const xPos = 35 + i * 24;
        const barHeight = bar.val * 7.5;
        return (
          <g key={bar.x}>
            <rect x={xPos} y={105 - barHeight} width="14" height={barHeight} fill="#0ea5e9" rx="1" />
            <text x={xPos + 7} y="116" fontSize="8" fontWeight="bold" fill="#334155" textAnchor="middle">{bar.x}</text>
            <text x={xPos + 7} y={105 - barHeight - 2} fontSize="7" fontWeight="black" fill="#0369a1" textAnchor="middle">{bar.val}</text>
          </g>
        );
      })}
      <text x="110" y="127" fontSize="7.5" fill="#475569" textAnchor="middle">מספר השערים במשחק</text>
      <text x="8" y="8" fontSize="7" fill="#475569" textAnchor="start">משחקים</text>
    </svg>
    <span className="text-[10px] text-slate-500 font-bold mt-1.5">דיאגרמת מספר השערים שהובקעו</span>
  </div>
);

const HobbiesSvg = () => (
  <div className="flex flex-col items-center justify-center my-2 p-3 bg-slate-50 border border-slate-100 rounded-2xl select-none w-full max-w-md gap-3">
    {/* Table */}
    <div className="w-full">
      <div className="text-[10px] font-extrabold text-slate-700 bg-slate-200/80 p-1 rounded-t-lg text-center">הטבלה של חן (באחוזים)</div>
      <table className="w-full text-center text-xs border border-collapse rounded-b-lg overflow-hidden bg-white">
        <thead>
          <tr className="bg-slate-100 text-[10px]">
            <th className="p-1 border">חוג</th>
            <th className="p-1 border text-indigo-700">תיאטרון</th>
            <th className="p-1 border text-purple-700 font-extrabold bg-purple-50">מחול</th>
            <th className="p-1 border text-blue-700">מחשבים</th>
            <th className="p-1 border text-emerald-700">ספורט</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="p-1.5 border font-bold">אחוז</td>
            <td className="p-1.5 border">10%</td>
            <td className="p-1.5 border text-red-500 font-black bg-purple-50/50">?</td>
            <td className="p-1.5 border">15%</td>
            <td className="p-1.5 border">40%</td>
          </tr>
        </tbody>
      </table>
    </div>
    {/* Stick chart */}
    <div className="w-full">
      <div className="text-[10px] font-extrabold text-slate-700 bg-slate-200/80 p-1 rounded-t-lg text-center">דיאגרמת המקלות של אלעד</div>
      <div className="bg-white border rounded-b-lg p-2 flex justify-around text-xs font-mono">
        <div className="flex flex-col items-center">
          <div className="h-10 w-2.5 bg-slate-200 rounded-t" />
          <div className="text-[9px] text-slate-450 italic mt-1">תיאטרון</div>
          <div className="text-[10px] font-bold text-red-500 font-black">(?)</div>
        </div>
        <div className="flex flex-col items-center">
          <div className="h-16 w-2.5 bg-purple-500 rounded-t" />
          <div className="text-[9px] text-purple-900 font-bold mt-1">מחול</div>
          <div className="text-[10px] font-bold">70 תלמידים</div>
        </div>
        <div className="flex flex-col items-center">
          <div className="h-10 w-2.5 bg-slate-200 rounded-t" />
          <div className="text-[9px] text-slate-450 italic mt-1">מחשבים</div>
          <div className="text-[10px] font-bold text-red-500 font-black">(?)</div>
        </div>
        <div className="flex flex-col items-center">
          <div className="h-20 w-2.5 bg-emerald-500 rounded-t" />
          <div className="text-[9px] text-emerald-900 font-bold mt-1">ספורט</div>
          <div className="text-[10px] font-bold">80 תלמידים</div>
        </div>
      </div>
    </div>
  </div>
);

const CallsSvg = () => (
  <div className="flex flex-col items-center justify-center my-2 p-2 bg-slate-50 border border-slate-100 rounded-2xl select-none w-full max-w-md gap-3">
    <div className="grid grid-cols-4 gap-1.5 text-center text-xs font-mono font-bold w-full">
      <div className="p-1 bg-green-50 text-green-800 rounded border border-green-200">קשר תקין (250)</div>
      <div className="p-1 bg-yellow-50 text-yellow-800 rounded border border-yellow-200">אין תשובה (100)</div>
      <div className="p-1 bg-orange-50 text-orange-850 rounded border border-orange-200">קשר מקולקל (125)</div>
      <div className="p-1 bg-red-50 text-red-800 rounded border border-red-200">תפוס (25)</div>
    </div>
    
    <div className="flex items-center gap-4 bg-white p-2 border rounded-xl w-full justify-center">
      {/* Circle divided in 10 parts */}
      <svg width="90" height="90" viewBox="0 0 100 100" className="opacity-80">
        <circle cx="50" cy="50" r="45" fill="none" stroke="#64748b" strokeWidth="1.5" />
        {/* Draw 10 slice lines */}
        {Array.from({ length: 10 }).map((_, i) => {
          const angle = (i * 36) * (Math.PI / 180);
          const x = 50 + 45 * Math.cos(angle);
          const y = 50 + 45 * Math.sin(angle);
          return (
            <line key={i} x1="50" y1="50" x2={x} y2={y} stroke="#64748b" strokeWidth="1" strokeDasharray="2" />
          );
        })}
        <circle cx="50" cy="50" r="2" fill="#1e293b" />
      </svg>
      <div className="text-[10px] text-slate-500 font-semibold text-right leading-relaxed">
        • סך החיוגים הכולל: <strong>500</strong> חיוגים.<br />
        • עיגול סמוך <strong>מפורק ל-10 עוגות שוות</strong> (10% כ\"א).<br />
        • צבעו או רשמו את חלקו היחסי של כל סעיף.
      </div>
    </div>
  </div>
);

const ColorsSvg = () => (
  <div className="flex flex-col items-center justify-center my-2 p-2 bg-slate-50 border border-slate-100 rounded-2xl select-none">
    <svg width="120" height="120" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="45" fill="#fef08a" stroke="#ca8a04" strokeWidth="1.5" /> {/* Yellow basis */}
      {/* Red 60% -> 216 deg */}
      <path d="M 50 50 L 95 50 A 45 45 0 1 1 13.6 23.5 Z" fill="#ef4444" stroke="#dc2626" strokeWidth="1" />
      {/* Blue 25% -> 90 deg starting from the end of Red (216 deg) - end at 306 deg */}
      <path d="M 50 50 L 13.6 23.5 A 45 45 0 0 1 76.4 13.6 Z" fill="#3b82f6" stroke="#2563eb" strokeWidth="1" />
      
      {/* Labels */}
      <text x="45" y="75" fontSize="6.5" fontWeight="bold" fill="white" textAnchor="middle">אדום (60%)</text>
      <text x="32" y="30" fontSize="6.5" fontWeight="bold" fill="white" textAnchor="middle">כחול (25%)</text>
      <text x="75" y="32" fontSize="6.5" fontWeight="bold" fill="#854d0e" textAnchor="middle">צהוב (?)</text>
    </svg>
    <span className="text-[10px] text-slate-500 font-bold mt-1">דיאגרמה: התפלגות צבעים אהובים</span>
  </div>
);

const NewspaperSalesSvg = () => (
  <div className="flex flex-col items-center justify-center my-2 p-2 bg-slate-50 border border-slate-100 rounded-2xl select-none w-full max-w-sm">
    <div className="bg-amber-50 border border-amber-200 text-[9px] text-amber-800 p-1.5 rounded-lg mb-2 text-center font-semibold">
      שים לב: ציר ה-Y מתחיל מ-<strong>6,000</strong> עיתונים ולא מ-0!
    </div>
    <svg width="240" height="120" viewBox="0 0 240 120" className="bg-white rounded p-1 border">
      <line x1="30" y1="100" x2="230" y2="100" stroke="#475569" strokeWidth="1.5" />
      <line x1="30" y1="10" x2="30" y2="100" stroke="#475569" strokeWidth="1.5" />
      {[6000, 8000, 10000, 12000].map((v, i) => {
        const y = 100 - i * 27;
        return (
          <g key={v}>
            <line x1="26" y1={y} x2="30" y2={y} stroke="#475569" />
            <text x="22" y={y + 3} fontSize="7" fill="#475569" textAnchor="end">{v.toLocaleString()}</text>
            <line x1="30" y1={y} x2="230" y2={y} stroke="#f1f5f9" strokeWidth="0.8" />
          </g>
        );
      })}
      
      {/* Jan: Zed 9000, Zealand 11000 */}
      <rect x="45" y={100 - 13.5} width="11" height={13.5} fill="#94a3b8" rx="0.5" />
      <rect x="57" y={100 - 67.5} width="11" height={67.5} fill="#475569" rx="0.5" />
      <text x="56" y="108" fontSize="7.5" fontWeight="bold" fill="#334155" textAnchor="middle">ינואר</text>

      {/* Feb: Zed 10000, Zealand 11500 */}
      <rect x="105" y={100 - 54} width="11" height={54} fill="#94a3b8" rx="0.5" />
      <rect x="117" y={100 - 74.25} width="11" height={74.25} fill="#475569" rx="0.5" />
      <text x="116" y="108" fontSize="7.5" fontWeight="bold" fill="#334155" textAnchor="middle">פברואר</text>

      {/* Mar: Zed 8000, Zealand 10500 */}
      <rect x="165" y={100 - 27} width="11" height={27} fill="#94a3b8" rx="0.5" />
      <rect x="177" y={100 - 60.75} width="11" height={60.75} fill="#475569" rx="0.5" />
      <text x="176" y="108" fontSize="7.5" fontWeight="bold" fill="#334155" textAnchor="middle">מרץ</text>

      <legend className="text-[6.5px]">
        <rect x="200" y="15" width="6" height="6" fill="#94a3b8" />
        <text x="210" y="20" fontSize="6" fill="#475569">'זד היום'</text>
        <rect x="200" y="25" width="6" height="6" fill="#475569" />
        <text x="210" y="30" fontSize="6" fill="#475569">'חדשות זלנד'</text>
      </legend>
    </svg>
  </div>
);

const TvPreferencesSvg = () => (
  <div className="flex flex-col items-center justify-center my-2 p-2 bg-slate-50 border border-slate-100 rounded-2xl select-none">
    <svg width="130" height="130" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="45" fill="white" stroke="#334155" strokeWidth="2" />
      {/* Draw equal divisions of 12 ( mỗi cái 30 độ) */}
      {/* 4/12 music = 120deg */}
      <path d="M 50 50 L 95 50 A 45 45 0 0 1 27.5 89 Z" fill="#60a5fa" stroke="#1d4ed8" strokeWidth="0.8" />
      {/* 3/12 drama = 90deg */}
      <path d="M 50 50 L 27.5 89 A 45 45 0 0 1 5 50 Z" fill="#a7f3d0" stroke="#047857" strokeWidth="0.8" />
      {/* 2/12 action = 60deg */}
      <path d="M 50 50 L 5 50 A 45 45 0 0 1 27.5 11 Z" fill="#fecdd3" stroke="#be123c" strokeWidth="0.8" />
      {/* 1/12 history = 30deg */}
      <path d="M 50 50 L 27.5 11 A 45 45 0 0 1 50 5 Z" fill="#fef08a" stroke="#b45309" strokeWidth="0.8" />
      {/* 1/12 sports = 30deg */}
      <path d="M 50 50 L 50 5 A 45 45 0 0 1 72.5 11 Z" fill="#e9d5ff" stroke="#6b21a8" strokeWidth="0.8" />
      {/* 1/12 none = 30deg */}
      <path d="M 50 50 L 72.5 11 A 45 45 0 0 1 95 50 Z" fill="#f1f5f9" stroke="#475569" strokeWidth="0.8" />

      <text x="68" y="70" fontSize="5" fontWeight="bold" fill="#1e3a8a">מוזיקה (4)</text>
      <text x="25" y="70" fontSize="5" fontWeight="bold" fill="#064e3b">דרמה (3)</text>
      <text x="18" y="35" fontSize="5" fontWeight="bold" fill="#4c0519">פעולה (2)</text>
      <text x="36" y="15" fontSize="4.5" fontWeight="bold" fill="#78350f">היסטוריה (1)</text>
      <text x="58" y="15" fontSize="5" fontWeight="bold" fill="#581c87">ספורט (1)</text>
      <text x="80" y="35" fontSize="5" fontWeight="bold" fill="#334155">ללא (1)</text>
    </svg>
    <span className="text-[9px] text-slate-500 font-bold mt-1">דיאגרמת עיגול (12 גזרות שוות) ל-240 תלמידים</span>
  </div>
);

const GreenInitiativeSvg = () => (
  <div className="flex flex-col items-center justify-center my-2 p-2 bg-slate-50 border border-slate-100 rounded-2xl select-none w-full max-w-sm gap-2">
    <div className="text-[10px] bg-emerald-50 text-emerald-800 p-1.5 rounded border border-emerald-150 w-full text-center">
      שכיחויות איסוף קבוע: <strong>א: 45| ב: 60 | ג: 30 | ד: 75 | ה: 50</strong>
    </div>
    {/* Unfilled coordinate axis template representing print design instructions for physical handdrawing */}
    <div className="bg-white border rounded p-1 w-full flex flex-col items-center">
      <svg width="220" height="95" viewBox="0 0 220 95">
        <line x1="25" y1="80" x2="210" y2="80" stroke="#64748b" strokeWidth="1.5" />
        <polygon points="210,77 215,80 210,83" fill="#64748b" />
        <line x1="25" y1="10" x2="25" y2="80" stroke="#64748b" strokeWidth="1.5" />
        <polygon points="22,10 25,5 28,10" fill="#64748b" />
        
        {/* Helper grid lines for kids */}
        {[0, 20, 40, 60, 80].map(val => (
          <g key={val}>
            <line x1="22" y1={80 - val * 0.8} x2="25" y2={80 - val * 0.8} stroke="#64748b" />
            <text x="18" y={80 - val * 0.8 + 2.5} fontSize="6" fill="#64748b" textAnchor="end">{val}</text>
            <line x1="25" y1={80 - val * 0.8} x2="200" y2={80 - val * 0.8} stroke="#f1f5f9" strokeWidth="0.8" />
          </g>
        ))}
        {/* Day markings */}
        {["ראשון", "שני", "שלישי", "רביעי", "חמישי"].map((day, d) => (
          <text key={day} x={45 + d * 33} y="89" fontSize="6.5" fill="#475569" textAnchor="middle">{day}</text>
        ))}
      </svg>
      <span className="text-[8px] text-slate-400 italic">סרגל דיאגרמה ריק - סרטטו את העמודות שלכם בדף מודפס</span>
    </div>
  </div>
);

const StudyTimeSvg = () => (
  <div className="flex flex-col items-center justify-center my-2 p-2 bg-slate-50 border border-slate-100 rounded-2xl select-none w-full max-w-sm">
    <svg width="220" height="135" viewBox="0 0 220 135" className="bg-white rounded p-1 border">
      <line x1="25" y1="110" x2="210" y2="110" stroke="#475569" strokeWidth="1.5" />
      <polygon points="210,107 215,110 210,113" fill="#475569" />
      <text x="210" y="121" fontSize="6" fill="#475569" textAnchor="end">שעות הכנה למבחן (x)</text>

      <line x1="25" y1="15" x2="25" y2="110" stroke="#475569" strokeWidth="1.5" />
      <polygon points="22,15 25,10 28,15" fill="#475569" />
      <text x="28" y="12" fontSize="6" fill="#475569" textAnchor="start">ציון במבחן (y)</text>

      {/* Grid lines */}
      {[0, 20, 40, 60, 80, 100].map(v => {
        const y = 110 - (v * 0.9);
        return (
          <g key={v}>
            <line x1="21" y1={y} x2="25" y2={y} stroke="#cbd5e1" />
            <text x="18" y={y + 2.5} fontSize="7" fill="#64748b" textAnchor="end">{v}</text>
            <line x1="25" y1={y} x2="210" y2={y} stroke="#f1f5f9" strokeWidth="0.8" />
          </g>
        );
      })}
      {/* X hours (0 to 6) */}
      {[0, 1, 2, 3, 4, 5, 6].map(h => {
        const x = 25 + h * 28;
        return (
          <g key={h}>
            <line x1={x} y1="110" x2={x} y2="114" stroke="#cbd5e1" />
            <text x={x} y="121" fontSize="7" fill="#64748b" textAnchor="middle">{h}</text>
          </g>
        );
      })}

      {/* Points: א(2.5, 80), ב(3.0, 40), ג(4.2, 70), ד(6.0, 90), ה(5.3, 76), ו(5.5, 45) */}
      {[
        { name: "א", x: 2.5, y: 80, color: "#3b82f6" },
        { name: "ב", x: 3.0, y: 40, color: "#ef4444" },
        { name: "ג", x: 4.2, y: 70, color: "#10b981" },
        { name: "ד", x: 6.0, y: 90, color: "#8b5cf6" },
        { name: "ה", x: 5.3, y: 76, color: "#f59e0b" },
        { name: "ו", x: 5.5, y: 45, color: "#ec4899" }
      ].map(p => {
        const cx = 25 + p.x * 28;
        const cy = 110 - p.y * 0.9;
        return (
          <g key={p.name}>
            <circle cx={cx} cy={cy} r="4" fill={p.color} stroke="white" strokeWidth="1" />
            <text x={cx + 6} y={cy - 4} fontSize="8" fontWeight="black" fill="#1e293b">{p.name}</text>
          </g>
        );
      })}
    </svg>
    <span className="text-[9px] text-slate-500 font-bold mt-1">דיאגרמת פיזור (ציוני התלמידים מול שעות הלמידה)</span>
  </div>
);

const PisaHitsSvg = () => (
  <div className="flex flex-col items-center justify-center my-2 p-2 bg-slate-50 border border-slate-100 rounded-2xl select-none w-full max-w-sm">
    <svg width="240" height="120" viewBox="0 0 240 120" className="bg-white rounded p-1 border">
      <line x1="30" y1="100" x2="230" y2="100" stroke="#475569" strokeWidth="1.5" />
      <line x1="30" y1="10" x2="30" y2="100" stroke="#475569" strokeWidth="1.5" />
      {[0, 500, 1000, 1500, 2000].map((v, i) => {
        const y = 100 - i * 20;
        return (
          <g key={v}>
            <line x1="26" y1={y} x2="30" y2={y} stroke="#475569" />
            <text x="22" y={y + 3} fontSize="7" fill="#475569" textAnchor="end">{v}</text>
            <line x1="30" y1={y} x2="230" y2={y} stroke="#f1f5f9" strokeWidth="0.8" />
          </g>
        );
      })}
      
      {/* Draw simplified bars represent Jan to June trend */}
      {/* Block 1 (April): Indian in space = 500, Barcodez = 1200, Loneliness = 1400 */}
      <rect x="75" y={100 - 20} width="9" height={20} fill="#475569" /> {/* Indian */}
      <rect x="85" y={100 - 48} width="9" height={48} fill="#94a3b8" /> {/* Barcodez */}
      <rect x="95" y={100 - 56} width="9" height={56} fill="#cbd5e1" /> {/* Loneliness */}
      <text x="89" y="109" fontSize="7.5" fontWeight="bold" fill="#334155" textAnchor="middle">אפריל</text>

      {/* Block 2 (June): Indian = 1200, Barcodez = 500, Loneliness = 1900 */}
      <rect x="145" y={100 - 48} width="9" height={48} fill="#475569" />
      <rect x="155" y={100 - 20} width="9" height={20} fill="#94a3b8" />
      <rect x="165" y={100 - 76} width="9" height={76} fill="#cbd5e1" />
      <text x="159" y="109" fontSize="7.5" fontWeight="bold" fill="#334155" textAnchor="middle">יוני</text>

      <legend className="text-[6px]">
        <rect x="200" y="10" width="5" height="5" fill="#475569" />
        <text x="208" y="14" fontSize="5.5" fill="#475569">אינדיאנים</text>
        <rect x="200" y="18" width="5" height="5" fill="#94a3b8" />
        <text x="208" y="22" fontSize="5.5" fill="#475569">ברקודז</text>
        <rect x="200" y="26" width="5" height="5" fill="#cbd5e1" />
        <text x="208" y="30" fontSize="5.5" fill="#475569">בדידות קיצ'</text>
      </legend>
    </svg>
    <span className="text-[9px] text-slate-500 font-bold mt-1">מכירות נבחרות לחודשי אפריל ויוני (שנות PISA)</span>
  </div>
);

const HeadacheComparisonSvg = () => (
  <div className="flex flex-col items-center justify-center my-2 p-2 bg-slate-50 border border-slate-100 rounded-2xl select-none w-full max-w-md gap-3">
    <div className="grid grid-cols-2 gap-3 w-full">
      {/* Graph I: Cropped Axis (80% to 90%) */}
      <div className="bg-white rounded border p-1.5 flex flex-col items-center">
        <span className="text-[8px] font-black text-red-650 block mb-1">גרף I: ציר קטוע (80%-90%)</span>
        <svg width="100" height="90" viewBox="0 0 100 90">
          <line x1="20" y1="80" x2="95" y2="80" stroke="#475569" strokeWidth="1" />
          <line x1="20" y1="10" x2="20" y2="80" stroke="#475569" strokeWidth="1" />
          {[80, 82, 84, 86, 88, 90].map((v, i) => (
            <g key={v}>
              <text x="17" y={80 - i*13 + 2.5} fontSize="5.5" fill="#475569" textAnchor="end">{v}%</text>
            </g>
          ))}
          {/* Rashkal (82%) -> height of 2 items = 26 units */}
          <rect x="35" y={80 - 26} width="16" height={26} fill="#0ea5e9" />
          {/* Bli Keev (88%) -> height of 8 items = 104 -> 104 but capped? no, 88 is (88-80)/(10)*65 = 52 units */}
          <rect x="65" y={80 - 52} width="16" height={52} fill="#10b981" />
        </svg>
      </div>

      {/* Graph II: Full Axis (0% to 100%) */}
      <div className="bg-white rounded border p-1.5 flex flex-col items-center">
        <span className="text-[8px] font-black text-emerald-700 block mb-1">גרף II: ציר תקני מלא (0%-100%)</span>
        <svg width="100" height="90" viewBox="0 0 100 90">
          <line x1="20" y1="80" x2="95" y2="80" stroke="#475569" strokeWidth="1" />
          <line x1="20" y1="10" x2="20" y2="80" stroke="#475569" strokeWidth="1" />
          {[0, 20, 40, 60, 80, 100].map((v, i) => (
            <g key={v}>
              <text x="17" y={80 - i*13.5 + 2.5} fontSize="5.5" fill="#475569" textAnchor="end">{v}%</text>
            </g>
          ))}
          {/* Rashkal (82%) -> 55.35 units */}
          <rect x="35" y={80 - 55.4} width="16" height={55.4} fill="#0ea5e9" />
          {/* Bli Keev (88%) -> 59.4 units */}
          <rect x="65" y={80 - 59.4} width="16" height={59.4} fill="#10b981" />
        </svg>
      </div>
    </div>
    <div className="text-[8px] text-slate-400 italic text-center">
      השוואה חזותית: שיעורי הקלה ב-ראשקל (82%, כחול) מול בלי כאב (88%, ירוק)
    </div>
  </div>
);

const UsbMemorySvg = () => (
  <div className="flex flex-col items-center justify-center my-2 p-2 bg-slate-50 border border-slate-100 rounded-2xl select-none w-full max-w-sm gap-2">
    {/* Concentric / segmented bar summarizing 1GB device */}
    <div className="w-full bg-slate-200 h-6 rounded-full overflow-hidden flex text-[9px] font-bold text-white text-center">
      <div style={{ width: "65%" }} className="bg-blue-500 h-full flex items-center justify-center">מוזיקה (650MB)</div>
      <div style={{ width: "19.8%" }} className="bg-pink-500 h-full flex items-center justify-center">תמונות (198MB)</div>
      <div style={{ width: "15.2%" }} className="bg-emerald-500 h-full flex items-center justify-center text-emerald-950">פנוי (152MB)</div>
    </div>
    <span className="text-[9px] text-slate-500 font-extrabold">תפוסת הזיכרון הנייד הנוכחי (1,000 MB)</span>
  </div>
);

const MatchingChartsSvg = () => (
  <div className="flex flex-col items-center justify-center my-2 p-2 bg-slate-50 border border-slate-100 rounded-2xl select-none w-full max-w-xs">
    <div className="space-y-1 w-full text-right text-[10px] bg-white p-2 border rounded-xl font-medium">
      <div className="p-1 border-b">📄 1. אוכלוסיית הכפר לאורך זמן ⬅️ _______</div>
      <div className="p-1 border-b">📊 2. מספר בנים ובנות שנולדו בכל שנה ⬅️ _______</div>
      <div className="p-1">🍕 3. סוג העיסוק הנוכחי של העובדים ⬅️ _______</div>
    </div>
    <span className="text-[9px] text-slate-400 italic mt-1.5">התאימו: דיאגרמת קווים / דיאגרמת עמודות כפולה / דיאגרמת עיגול</span>
  </div>
);

const PetrusPenguinsSvg = () => (
  <div className="flex flex-col items-center justify-center my-2 p-2 bg-slate-50 border border-slate-100 rounded-2xl select-none w-full max-w-sm gap-2">
    <div className="grid grid-cols-2 gap-2 text-[10px] w-full text-right font-semibold">
      <div className="bg-slate-100 p-1.5 border rounded">⛰️ אזור הצוקים: <strong>30 גוזלים</strong></div>
      <div className="bg-blue-50 p-1.5 border rounded">🌊 חוף מערבי: <strong>45 גוזלים</strong></div>
      <div className="bg-indigo-50 p-1.5 border rounded">⛵ המפרץ השקט: <strong>60 גוזלים</strong></div>
      <div className="bg-white p-1.5 border rounded border-blue-200">❄️ אזור הקרחון: <strong>15 גוזלים</strong></div>
    </div>
    <span className="text-[10px] text-slate-500 font-bold">4 אזורי ספירה של מושבת 'פינגווין אדלי' (150 גוזלים)</span>
  </div>
);

const GradesRangeSvg = () => (
  <div className="flex flex-col items-center justify-center my-2 p-2 bg-slate-50 border border-slate-100 rounded-2xl select-none w-full max-w-sm">
    <div className="bg-white p-2 border rounded-xl text-[9px] font-mono grid grid-cols-8 gap-1 text-center w-full">
      {[
        72, 44, 56, 90, 82, 76, 56, 82, 
        90, 72, 82, 82, 80, 70, 70, 63, 
        82, 80, 72, 44, 85, 90, 82, 78, 
        80, 78, 76, 68, 80, 70, 90, 90
      ].map((g, idx) => (
        <span key={idx} className="bg-slate-100 border p-1 rounded font-bold text-slate-750">{g}</span>
      ))}
    </div>
    <span className="text-[9px] text-slate-500 font-bold mt-1.5">רשימת 32 ציוני הכיתה שנרשמו במבחן</span>
  </div>
);

const SportsClassSvg = () => (
  <div className="flex flex-col items-center justify-center my-2 p-2 bg-slate-50 border border-slate-100 rounded-2xl select-none w-full max-w-sm gap-2">
    <div className="grid grid-cols-2 gap-3 w-full text-center text-xs">
      <div className="p-2 border rounded-xl bg-white">
        <span className="text-[10px] font-black text-indigo-700 block mb-1">כיתה ז'1</span>
        <div className="text-sm font-black">20 מתוך 40</div>
        <div className="text-[9px] text-slate-450 mt-1">עוסקים בספורט קבוע</div>
      </div>
      <div className="p-2 border rounded-xl bg-white">
        <span className="text-[10px] font-black text-rose-700 block mb-1">כיתה ז'2</span>
        <div className="text-sm font-black">15 מתוך 25</div>
        <div className="text-[9px] text-slate-450 mt-1">עוסקים בספורט קבוע</div>
      </div>
    </div>
  </div>
);

const CongestedIntersectionSvg = () => (
  <div className="flex flex-col items-center justify-center my-2 p-2 bg-slate-50 border border-slate-100 rounded-2xl select-none w-full max-w-sm gap-2">
    <div className="bg-slate-100 p-2 border rounded-xl text-[9px] w-full text-right leading-relaxed font-semibold text-slate-705">
      🚦 **נתוני ספירת כלי הרכב בצומת (50 סך הכל)**:<br />
      • 25 מכוניות פרטיות (50% מהתנועה)<br />
      • 10 אוטובוסים (20% מהתנועה)<br />
      • 5 אופנועים | • 10 משאיות
    </div>
    <div className="bg-white p-2 border rounded-xl text-[9px] w-full text-right leading-relaxed text-blue-800">
      👥 **נתוני נוסעים משוערים (לפי דרישת המהנדסת הראשית)**:<br />
      • בכל מכונית פרטית: בממוצע <strong>2 אנשים</strong> (25 * 2 = 50 אנשים)<br />
      • בכל אוטובוס: בממוצע <strong>40 אנשים</strong> (10 * 40 = 400 אנשים)
    </div>
  </div>
);

const ChampionShooterSvg = () => (
  <div className="flex flex-col items-center justify-center my-2 p-2 bg-slate-50 border border-slate-100 rounded-2xl select-none w-full max-w-sm gap-2">
    <div className="grid grid-cols-2 gap-3 w-full text-center text-xs">
      <div className="p-2 border rounded-xl bg-white flex flex-col justify-between">
        <span className="text-[10px] font-black text-orange-600 block mb-1">🏀 השחקן: עידו</span>
        <div className="text-sm font-black bg-orange-50/50 py-1 rounded inline-block">12 קליעות מתוך 20</div>
        <span className="text-[8px] text-slate-400 mt-1">שכיחות: 12/20</span>
      </div>
      <div className="p-2 border rounded-xl bg-white flex flex-col justify-between">
        <span className="text-[10px] font-black text-emerald-700 block mb-1">🏀 השחקן: נועם</span>
        <div className="text-sm font-black bg-emerald-50/50 py-1 rounded inline-block">7 קליעות מתוך 10</div>
        <span className="text-[8px] text-slate-400 mt-1">שכיחות: 7/10</span>
      </div>
    </div>
  </div>
);

// ==========================================
// 2. ANSWER SHEET PLACES & WRITING FIELDS
// ==========================================

const WorkbookDottedLines = () => (
  <div className="mt-4 border border-slate-200 bg-slate-50/5 max-w-full rounded-2xl p-4 flex flex-col justify-between select-none">
    <span className="text-[10px] font-black text-slate-400 mb-2 block leading-none">תשובות ודרך הפתרון:</span>
    <div className="space-y-5 py-1">
      <div className="border-b border-dashed border-slate-350 w-full h-[1px]" />
      <div className="border-b border-dashed border-slate-350 w-full h-[1px]" />
      <div className="border-b border-dashed border-slate-350 w-full h-[1px]" />
      <div className="border-b border-dashed border-slate-350 w-full h-[1px]" />
    </div>
  </div>
);

// ==========================================
// MAIN WORKBOOK APP COMPONENT
// ==========================================

export default function App() {
  const [questions, setQuestions] = useState<Question[]>(initialQuestions);
  const [printSolutions, setPrintSolutions] = useState(true);
  const [editMode, setEditMode] = useState<number | null>(null);
  
  // GitHub credentials & synchronization state
  const [githubToken, setGithubToken] = useState("");
  const [isSyncing, setIsSyncing] = useState(false);
  const [showSyncModal, setShowSyncModal] = useState(false);
  const [syncLogs, setSyncLogs] = useState<string[]>([]);
  const [syncStatus, setSyncStatus] = useState<"idle" | "success" | "error">("idle");
  const [syncError, setSyncError] = useState("");

  // Retrieve token from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem("gh_pat_token");
    if (savedToken) {
      setGithubToken(savedToken);
    }
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleEditQuestionText = (id: number, text: string) => {
    setQuestions(prev => prev.map(q => q.id === id ? { ...q, text } : q));
  };

  const syncToGitHub = async () => {
    setIsSyncing(true);
    setSyncStatus("idle");
    setSyncError("");
    setSyncLogs(["🔄 יוזם תהליך סינכרון עבור yanivmizrachiy/i-vadaut-ai-studio..."]);

    if (!githubToken.trim()) {
      setSyncStatus("error");
      setSyncError("אנא הזן מפתח (Personal Access Token) תקין של GitHub.");
      setIsSyncing(false);
      return;
    }

    // Save token in localStorage
    localStorage.setItem("gh_pat_token", githubToken);

    try {
      setSyncLogs(prev => [...prev, "📡 יוצר קשר עם שרת היישום לביצוע עדכון המאגר..."]);
      
      const response = await fetch("/api/github-sync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          token: githubToken,
          message: "עדכון דפי עבודה וכללים משרד החינוך"
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "התגלתה שגיאה בתקשורת מול GitHub API המרכזי");
      }

      setSyncLogs(prev => [
        ...prev,
        `📂 זוהה ענף ברירת מחדל מוצלח: ${data.branch}`,
        ...(data.results || []),
        "🎉 כלל הקבצים הוחלפו וסונכרנו בהצלחה ברמת שיא!"
      ]);
      setSyncStatus("success");
    } catch (error: any) {
      console.error(error);
      setSyncStatus("error");
      setSyncError(error.message || "פעולת הסינכרון נכשלה. בדוק את תקינות ה-Token שלך.");
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col justify-between" dir="rtl">
      
      {/* Dynamic Action Header - strictly hidden on printed document */}
      <header className="bg-white border-b border-slate-200 py-4 px-6 shadow-sm no-print sticky top-0 z-40">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-right flex items-center gap-3">
            <div className="bg-blue-600 text-white p-2 rounded-2xl shadow-indigo-200 shadow-md">
              <BookmarkCheck className="w-6 h-6 shrink-0" />
            </div>
            <div>
              <h1 className="text-base md:text-lg font-black text-slate-800 leading-none">
                מאגר דפי עבודה להדפסה: אי-ודאות והסתברות
              </h1>
              <p className="text-[10px] md:text-xs text-slate-500 mt-1">
                עותק מדויק ומלא של משרד החינוך (כיתות ז'-ח') • כתיבה וחישובי A4 מקצועיים
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowSyncModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold transition text-xs shadow-sm"
            >
              <Github size={14} />
              <span>סנכרון לגיט-האב</span>
            </button>

            <label className="flex items-center gap-2 text-[11px] font-bold text-slate-700 bg-slate-100 border px-3 py-2 rounded-xl cursor-pointer hover:bg-slate-200 transition-all">
              <input
                type="checkbox"
                checked={printSolutions}
                onChange={(e) => setPrintSolutions(e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
              />
              <span>מפתח תשובות למורה</span>
            </label>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-5 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition text-xs shadow-md"
            >
              <Printer size={14} />
              הדפס (A4 PDF)
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 md:px-6 py-6 space-y-6">
        
        {/* Helper layout warning & info */}
        <div className="bg-indigo-50/80 border border-indigo-100 p-4 rounded-2xl flex gap-3 items-start no-print shadow-sm text-right">
          <Info size={16} className="text-indigo-600 shrink-0 mt-0.5" />
          <div className="text-xs text-indigo-900 leading-relaxed">
            <strong>מורה יקר/ה:</strong> דפים אלו מתוכננים לעמוד בסטנדרט ההדפסה המחמיר ביותר.
            מומלץ לסמן במאפייני ההדפסה של הדפדפן <strong>"הדפס גרפיקת רקע" (Background graphics)</strong> כדי שכל הגרפים, הטבלאות והצבעים היפים ישתלבו בדפים המודפסים באופן מושלם.
          </div>
        </div>

        {/* Digital Worksheet Sheets Preview */}
        <div id="worksheet-pages" className="space-y-6 print:space-y-0">
          {questions.map((q, idx) => (
            <section
              key={q.id}
              className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm relative print:border-none print:shadow-none print:p-0 print:m-0 print-page-break print:min-h-screen flex flex-col justify-between"
            >
              <div>
                {/* Academic Header in Ministry of Education workbook style */}
                <div className="border-b-2 border-slate-900 pb-3 mb-5 flex justify-between items-start">
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-black tracking-widest text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md inline-block mb-1">
                      משימת הערכה רשמית
                    </span>
                    <h2 className="text-lg md:text-xl font-black text-slate-900 leading-tight">
                      שאלה {q.id}: {q.title}
                    </h2>
                  </div>
                  <div className="text-left shrink-0 no-print flex items-center gap-1">
                    <button 
                      onClick={() => setEditMode(editMode === q.id ? null : q.id)}
                      className="text-slate-500 hover:text-slate-800 p-1.5 rounded-lg border hover:bg-slate-50 transition"
                      title="ערוך נוסח שאלה באופן מקומי"
                    >
                      <Edit2 size={13} />
                    </button>
                    <span className="text-[10px] md:text-xs font-black bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-xl text-slate-700">
                      עמוד {idx + 1}
                    </span>
                  </div>
                </div>

                {/* Local Edit Box (Only visible when teacher configures text locally) */}
                {editMode === q.id && (
                  <div className="mb-4 bg-yellow-50 border border-yellow-200 p-3 rounded-2xl no-print space-y-2">
                    <div className="text-xs font-bold text-amber-900">התאמה אישית של מלל השאלה המודפס:</div>
                    <textarea
                      value={q.text}
                      onChange={(e) => handleEditQuestionText(q.id, e.target.value)}
                      rows={5}
                      className="w-full text-xs p-2 border border-yellow-300 rounded-lg focus:ring-1 focus:ring-yellow-500 bg-white"
                    />
                    <button
                      onClick={() => setEditMode(null)}
                      className="text-[10px] px-3 py-1.5 bg-yellow-600 text-white rounded-lg font-bold"
                    >
                      סגור ועבור לתצוגה
                    </button>
                  </div>
                )}

                {/* Question Paragraph verbatim clone */}
                <div className="mb-5 text-right">
                  <p className="text-sm md:text-[15px] font-medium leading-relaxed text-slate-800 whitespace-pre-line">
                    {q.text}
                  </p>
                </div>

                {/* The beautifully embedded visual graphic models */}
                <div className="my-3 flex items-center justify-center p-2 rounded-2xl">
                  {q.type === "spinner" && <SpinnerSvg />}
                  {q.type === "vehicles" && <VehiclesSvg />}
                  {q.type === "football" && <FootballSvg />}
                  {q.type === "hobbies" && <HobbiesSvg />}
                  {q.type === "calls" && <CallsSvg />}
                  {q.type === "colors" && <ColorsSvg />}
                  {q.type === "newspaper_sales" && <NewspaperSalesSvg />}
                  {q.type === "tv_preferences" && <TvPreferencesSvg />}
                  {q.type === "green_initiative" && <GreenInitiativeSvg />}
                  {q.type === "study_time" && <StudyTimeSvg />}
                  {q.type === "pisa_hits" && <PisaHitsSvg />}
                  {q.type === "headache" && <HeadacheComparisonSvg />}
                  {q.type === "headache_advanced" && <HeadacheComparisonSvg />}
                  {q.type === "usb_memory" && <UsbMemorySvg />}
                  {q.type === "matching_charts" && <MatchingChartsSvg />}
                  {q.type === "petrus_penguins" && <PetrusPenguinsSvg />}
                  {q.type === "grades_range" && <GradesRangeSvg />}
                  {q.type === "sports_class" && <SportsClassSvg />}
                  {q.type === "congested_intersection" && <CongestedIntersectionSvg />}
                  {q.type === "champion_shooter" && <ChampionShooterSvg />}
                </div>
              </div>

              {/* Student response writing Lines */}
              <div className="mt-4">
                <WorkbookDottedLines />
                
                {/* Print format footer */}
                <div className="mt-6 pt-3 border-t border-slate-100 flex justify-between items-center text-[9px] text-slate-400 select-none">
                  <span>דף הערכה מותאם לכיתות ח' • תחום אי-ודאות והסתברות • מיוצר כחוק</span>
                  <span>עמוד {idx + 1}</span>
                </div>
              </div>
            </section>
          ))}

          {/* Optional Page: Teacher Solutions Manual / Answer Keys */}
          {printSolutions && (
            <section className="bg-white border border-green-200 rounded-3xl p-6 md:p-8 shadow-sm relative print:border-none print:shadow-none print:p-0 print:m-0 print-page-break print:min-h-screen flex flex-col justify-between">
              <div>
                <div className="border-b-2 border-green-800 pb-3 mb-5 flex justify-between items-center">
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-black text-green-700 bg-green-50 px-2 py-1 rounded inline-block mb-1">
                      למורה בלבד
                    </span>
                    <h2 className="text-lg md:text-xl font-black text-green-900 leading-none">
                      מפתח תשובות והסברים לפעילות (מחוון הערכה)
                    </h2>
                  </div>
                  <div className="text-left shrink-0">
                    <span className="text-[10px] md:text-xs font-black bg-green-50 border border-green-200 px-3 py-1.5 rounded-xl text-green-700">
                      דף תשובות מפורט
                    </span>
                  </div>
                </div>

                <div className="space-y-4 text-right">
                  {questions.map((q) => (
                    <div key={q.id} className="p-3 border border-slate-150 rounded-2xl bg-slate-50 text-xs">
                      <div className="font-extrabold text-slate-900">
                        שאלה {q.id}: {q.title}
                      </div>
                      <div className="text-emerald-700 font-extrabold mt-1">
                        תשובה סופית: {q.answer}
                      </div>
                      <div className="text-slate-600 leading-relaxed mt-1 text-[11px] whitespace-pre-line border-t pt-1 border-slate-205/50">
                        <strong>דרך פתרון מלאה:</strong> {q.solution}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="mt-6 pt-3 border-t border-slate-100 flex justify-between items-center text-[9px] text-slate-400 select-none">
                  <span>משוב פדגוגי והדרכה – הערכת תפקודי למידה</span>
                  <span>עמוד תשובות ומחוון</span>
                </div>
              </div>
            </section>
          )}
        </div>

      </main>

      {/* GitHub Sync Modal Sidebar */}
      {showSyncModal && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 backdrop-blur-sm flex justify-center items-center p-4">
          <div className="bg-white max-w-lg w-full rounded-3xl shadow-xl overflow-hidden text-right" dir="rtl">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Github className="w-5 h-5 text-indigo-400" />
                <h3 className="font-black text-sm md:text-base">סנכרון הקבצים לריפו ב-GitHub</h3>
              </div>
              <button 
                onClick={() => setShowSyncModal(false)}
                className="text-slate-400 hover:text-white text-lg font-black leading-none"
              >
                ✕
              </button>
            </div>
            
            <div className="p-5 space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed">
                תהליך סנכרון זה מעלה ומעדכן באופן אוטומטי את קבצי מאגר השאלות, קבצי העיצוב (CSS) 
                ודף הכללים המקצועי ישירות לריפו שלך ב-GitHub בכתובת המבוקשת:<br />
                <strong className="text-slate-805 font-mono select-all">https://github.com/yanivmizrachiy/i-vadaut-ai-studio</strong>
              </p>

              <div className="space-y-1">
                <label className="text-xs font-black text-slate-700 flex items-center gap-1">
                  <Lock size={12} className="text-indigo-600" />
                  <span>GitHub Personal Access Token (PAT):</span>
                </label>
                <input
                  type="password"
                  placeholder="הדבק כאן את מפתח הגישה האישי (ghp_...)"
                  value={githubToken}
                  onChange={(e) => setGithubToken(e.target.value)}
                  className="w-full text-xs p-2.5 border rounded-xl bg-slate-50 focus:bg-white focus:ring-1 focus:ring-indigo-500 font-mono"
                />
                <span className="text-[10px] text-slate-400 block">
                  ה-Token נשמר באופן מאובטח בדפדפן המקומי שלך (LocalStorage) לצורך סנכרון עתידי מהיר.
                </span>
              </div>

              {/* Loader or sync status logs */}
              {syncLogs.length > 0 && (
                <div className="bg-slate-950 text-slate-200 p-3 rounded-2xl font-mono text-[10px] space-y-1 max-h-40 overflow-y-auto">
                  {syncLogs.map((log, i) => (
                    <div key={i} className="leading-normal">{log}</div>
                  ))}
                  {syncStatus === "success" && (
                    <div className="text-emerald-400 font-bold flex items-center gap-1 mt-1">
                      <CheckCircle2 size={10} />
                      <span>הסנכרון הושלם בהצלחה מרובה!</span>
                    </div>
                  )}
                  {syncStatus === "error" && (
                    <div className="text-red-400 font-bold flex items-center gap-1 mt-1">
                      <AlertCircle size={10} />
                      <span>שגיאה: {syncError}</span>
                    </div>
                  )}
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  disabled={isSyncing}
                  onClick={syncToGitHub}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-900 disabled:bg-slate-300 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition"
                >
                  {isSyncing ? (
                    <Loader2 size={13} className="animate-spin" />
                  ) : (
                    <Save size={13} />
                  )}
                  <span>סנכרן את כל הקבצים עכשיו</span>
                </button>
                <button
                  onClick={() => setShowSyncModal(false)}
                  className="border px-4 py-2.5 rounded-xl font-bold text-xs hover:bg-slate-50 text-slate-600"
                >
                  סגור
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer strictly hidden on printed document */}
      <footer className="bg-slate-900 text-slate-400 py-4 text-center text-xs no-print border-t border-slate-800 mt-8 select-none">
        <p>© {new Date().getFullYear()} מחולל דפי עבודה וכללים - אי-ודאות והסתברות | yanivmizrachiy & AI Studio</p>
      </footer>

    </div>
  );
}
