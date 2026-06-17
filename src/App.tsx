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
  <div className="flex flex-col items-center justify-center my-3 p-4 bg-slate-50/50 border border-slate-200/60 rounded-3xl select-none shadow-sm transition-all hover:shadow-md hover:bg-slate-50">
    <svg width="240" height="240" viewBox="0 0 100 100" className="drop-shadow-md">
      <defs>
        {/* Gradients for premium classroom printable feel */}
        <radialGradient id="ring-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
          <stop offset="90%" stopColor="#fafafa" stopOpacity="1" />
          <stop offset="100%" stopColor="#e2e8f0" stopOpacity="1" />
        </radialGradient>
        <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="1.5" stdDeviation="1" floodColor="#0f172a" floodOpacity="0.15" />
        </filter>
      </defs>

      {/* Main Wheel Container with subtle shadow and border */}
      <circle cx="50" cy="50" r="46" fill="url(#ring-glow)" stroke="#0f172a" strokeWidth="1.5" filter="url(#shadow)" />

      {/* 1. Sgool (סגול): Right 180 degrees (from 0 to 180 deg) */}
      <path d="M 50 50 L 50 4 A 46 46 0 0 1 50 96 Z" fill="#faf5ff" stroke="#7c3aed" strokeWidth="1" strokeDasharray="3,0" />
      
      {/* 2. Katom (כתום): Upper-left quadrant (90 deg - from 180 to 270 deg) */}
      <path d="M 50 50 L 50 96 A 46 46 0 0 1 4 50 Z" fill="#fff7ed" stroke="#ea580c" strokeWidth="1" />

      {/* 3. Yarok (ירוק): 30 deg sector (from 270 to 300 deg) */}
      {/* dx = 46 * sin(300) = 46 * (-0.866) = -39.8, dy = -46 * cos(300) = -46 * (0.5) = -23. Point = (10.2, 27) */}
      <path d="M 50 50 L 4 50 A 46 46 0 0 1 10.16 27 Z" fill="#f0fdf4" stroke="#16a34a" strokeWidth="1" />

      {/* 4. Kahol (כחול): 30 deg sector (from 300 to 330 deg) */}
      {/* dx = 46 * sin(330) = 46 * (-0.5) = -23, dy = -46 * cos(330) = -46 * (0.866) = -39.8. Point = (27, 10.2) */}
      <path d="M 50 50 L 10.16 27 A 46 46 0 0 1 27 10.16 Z" fill="#eff6ff" stroke="#2563eb" strokeWidth="1" />

      {/* 5. Adom (אדום): 30 deg sector (from 330 to 360 deg) */}
      <path d="M 50 50 L 27 10.16 A 46 46 0 0 1 50 4 Z" fill="#fef2f2" stroke="#dc2626" strokeWidth="1" />
      
      {/* Radial Division Lines to enforce exact black-and-white print quality borders */}
      <line x1="50" y1="50" x2="50" y2="4" stroke="#0f172a" strokeWidth="0.8" />
      <line x1="50" y1="50" x2="50" y2="96" stroke="#0f172a" strokeWidth="0.8" />
      <line x1="50" y1="50" x2="4" y2="50" stroke="#0f172a" strokeWidth="0.8" />
      <line x1="50" y1="50" x2="10.16" y2="27" stroke="#0f172a" strokeWidth="0.8" />
      <line x1="50" y1="50" x2="27" y2="10.16" stroke="#0f172a" strokeWidth="0.8" />

      {/* Center Pin & Spinner Needle with elegant drop shadow pointing up-right into Purple */}
      <g filter="url(#shadow)">
        {/* Outer metallic center ring */}
        <circle cx="50" cy="50" r="5" fill="#1e293b" stroke="#e2e8f0" strokeWidth="0.8" />
        {/* Sleek math-workbook needle */}
        <line x1="50" y1="50" x2="74" y2="26" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
        <polygon points="70,24 78,22 76,30" fill="#0f172a" />
        <circle cx="50" cy="50" r="2" fill="#ef4444" />
      </g>
      
      {/* Clean Hebrew typography callouts, matching printed textbooks */}
      {/* Purple Label */}
      <text x="73" y="53" fontSize="7" fill="#6d28d9" textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight="900">סגול</text>
      <text x="73" y="59" fontSize="4.5" fill="#7c3aed" textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight="bold">(1/2)</text>

      {/* Orange Label */}
      <text x="27" y="71" fontSize="7" fill="#c2410c" textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight="900">כתום</text>
      <text x="27" y="77" fontSize="4.5" fill="#ea580c" textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight="bold">(1/4)</text>

      {/* Green Label */}
      <text x="18" y="42" fontSize="5.5" fill="#15803d" textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight="900">ירוק</text>
      <text x="18" y="47" fontSize="3.8" fill="#16a34a" textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight="bold">(1/12)</text>

      {/* Blue Label */}
      <text x="27" y="26" fontSize="5.5" fill="#1d4ed8" textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight="900">כחול</text>
      <text x="27" y="31" fontSize="3.8" fill="#2563eb" textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight="bold">(1/12)</text>

      {/* Red Label */}
      <text x="41" y="16" fontSize="5.5" fill="#b91c1c" textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight="900">אדום</text>
      <text x="41" y="21" fontSize="3.8" fill="#dc2626" textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight="bold">(1/12)</text>

      {/* Small 360 degree marking indicators */}
      <circle cx="50" cy="4" r="1.2" fill="#0f172a" />
      <circle cx="96" cy="50" r="1.2" fill="#0f172a" />
      <circle cx="50" cy="96" r="1.2" fill="#0f172a" />
      <circle cx="4" cy="50" r="1.2" fill="#0f172a" />
    </svg>
    <div className="text-[11px] text-slate-700 font-bold mt-2 bg-white/70 px-3 py-1 rounded-full border border-slate-200/40">
      גלגל א': חלוקה מדויקת לחמש גזרות (סגול, כתום, ירוק, כחול, אדום)
    </div>
  </div>
);

const VehiclesSvg = () => {
  const [selectedRep, setSelectedRep] = React.useState<'a' | 'b' | 'c'>('a');
  return (
    <div className="flex flex-col items-center justify-center my-3 p-4 bg-slate-50/50 border border-slate-200/60 rounded-3xl select-none w-full max-w-lg gap-4 shadow-sm">
      {/* Dynamic Selector to compare representations requested in the Ministry question */}
      <div className="w-full flex flex-col gap-2">
        <span className="text-[11px] font-black text-slate-700 text-right pr-1">טבלת השכיחויות שנמצאה:</span>
        <div className="grid grid-cols-4 gap-2 w-full text-center text-xs font-bold font-mono">
          <div className="bg-blue-50 p-2 rounded-xl border border-blue-200/50 shadow-sm">
            <div className="text-blue-800 text-[10px] font-bold">🎯 מכוניות</div>
            <div className="text-sm font-black text-blue-950">60</div>
            <div className="text-[8px] text-blue-600">(50%)</div>
          </div>
          <div className="bg-amber-50 p-2 rounded-xl border border-amber-200/50 shadow-sm">
            <div className="text-amber-800 text-[10px] font-bold">🚲 אופניים</div>
            <div className="text-sm font-black text-amber-950">30</div>
            <div className="text-[8px] text-amber-600">(25%)</div>
          </div>
          <div className="bg-emerald-50 p-2 rounded-xl border border-emerald-200/50 shadow-sm">
            <div className="text-emerald-800 text-[10px] font-bold">🚌 אוטובוס</div>
            <div className="text-sm font-black text-emerald-950">10</div>
            <div className="text-[8px] text-emerald-600">(8.3%)</div>
          </div>
          <div className="bg-purple-50 p-2 rounded-xl border border-purple-200/50 shadow-sm">
            <div className="text-purple-800 text-[10px] font-bold">🚛 משאיות</div>
            <div className="text-sm font-black text-purple-950">20</div>
            <div className="text-[8px] text-purple-600">(16.7%)</div>
          </div>
        </div>
      </div>

      <div className="w-full bg-white border border-slate-200/80 rounded-2xl p-3 flex flex-col items-center shadow-inner min-h-[170px] justify-center">
        <div className="flex gap-2 mb-3 bg-slate-100 p-1 rounded-lg">
          <button 
            type="button"
            onClick={() => setSelectedRep('a')} 
            className={`px-3 py-1 rounded text-[10px] font-bold transition-all ${selectedRep === 'a' ? 'bg-white text-blue-600 shadow' : 'text-slate-500 hover:text-slate-800'}`}
          >
            ייצוג א' (עמודות)
          </button>
          <button 
            type="button"
            onClick={() => setSelectedRep('b')} 
            className={`px-3 py-1 rounded text-[10px] font-bold transition-all ${selectedRep === 'b' ? 'bg-white text-blue-600 shadow' : 'text-slate-500 hover:text-slate-800'}`}
          >
            ייצוג ב' (פיקטו)
          </button>
          <button 
            type="button"
            onClick={() => setSelectedRep('c')} 
            className={`px-3 py-1 rounded text-[10px] font-bold transition-all ${selectedRep === 'c' ? 'bg-white text-blue-600 shadow' : 'text-slate-500 hover:text-slate-800'}`}
          >
            ייצוג ג' (עיגול מעוות)
          </button>
        </div>

        {selectedRep === 'a' && (
          <div className="flex flex-col items-center w-full animate-fade-in">
            <span className="text-[8px] font-extrabold text-blue-600 mb-1">דיאגרמת עמודות תקנית (נכונה)</span>
            <svg width="240" height="110" viewBox="0 0 240 110">
              <line x1="30" y1="85" x2="220" y2="85" stroke="#1e293b" strokeWidth="1.2" />
              <line x1="30" y1="10" x2="30" y2="85" stroke="#1e293b" strokeWidth="1.2" />
              {[0, 20, 40, 60].map(v => {
                const y = 85 - (v * 1.1);
                return (
                  <g key={v}>
                    <line x1="26" y1={y} x2="30" y2={y} stroke="#1e293b" />
                    <text x="21" y={y + 2.5} fontSize="7" fill="#64748b" textAnchor="end">{v}</text>
                    <line x1="30" y1={y} x2="220" y2={y} stroke="#f1f5f9" strokeWidth="0.8" />
                  </g>
                );
              })}
              {/* Bars */}
              {[
                { name: "מכוניות", val: 60, fill: "#3b82f6" },
                { name: "אופניים", val: 30, fill: "#f59e0b" },
                { name: "אוטובוס", val: 10, fill: "#10b981" },
                { name: "משאיות", val: 20, fill: "#a855f7" }
              ].map((bar, i) => {
                const x = 45 + i * 42;
                const h = bar.val * 1.1;
                return (
                  <g key={bar.name}>
                    <rect x={x} y={85 - h} width="22" height={h} fill={bar.fill} rx="2" stroke={bar.fill} strokeWidth="1" />
                    <text x={x + 11} y="94" fontSize="6.5" fontWeight="bold" fill="#334155" textAnchor="middle">{bar.name}</text>
                    <text x={x + 11} y={85 - h - 3} fontSize="7" fontWeight="black" fill="#0f172a" textAnchor="middle">{bar.val}</text>
                  </g>
                );
              })}
            </svg>
          </div>
        )}

        {selectedRep === 'b' && (
          <div className="flex flex-col items-center w-full animate-fade-in">
            <span className="text-[8px] font-extrabold text-amber-600 mb-1">פיקטוגרמה (סמל מייצג 10 רכבים)</span>
            <div className="grid grid-cols-4 gap-2 w-full text-[9px] px-4 py-2 font-semibold">
              <div className="flex flex-col items-center bg-slate-50 p-1.5 rounded-lg border">
                <span className="font-bold text-blue-700">🚗 מכוניות</span>
                <div className="flex gap-0.5 flex-wrap justify-center mt-1 w-12">
                  {"🔵🔵🔵🔵🔵🔵".split("").map((s, i) => (
                    <span key={i} className="text-[12px]" title="10 רכבים">🚗</span>
                  ))}
                </div>
                <span className="text-[8px] text-slate-500 mt-1">6 סמלים</span>
              </div>
              <div className="flex flex-col items-center bg-slate-50 p-1.5 rounded-lg border">
                <span className="font-bold text-amber-700">🚲 אופניים</span>
                <div className="flex gap-0.5 flex-wrap justify-center mt-1 w-12">
                  {"🟠🟠🟠".split("").map((s, i) => (
                    <span key={i} className="text-[12px]" title="10 רכבים">🚲</span>
                  ))}
                </div>
                <span className="text-[8px] text-slate-500 mt-1">3 סמלים</span>
              </div>
              <div className="flex flex-col items-center bg-slate-50 p-1.5 rounded-lg border">
                <span className="font-bold text-emerald-700">🚌 אוטובוס</span>
                <div className="flex gap-0.5 flex-wrap justify-center mt-1 w-12">
                  {"🟢".split("").map((s, i) => (
                    <span key={i} className="text-[12px]" title="10 רכבים">🚌</span>
                  ))}
                </div>
                <span className="text-[8px] text-slate-500 mt-1">1 סמל</span>
              </div>
              <div className="flex flex-col items-center bg-slate-50 p-1.5 rounded-lg border">
                <span className="font-bold text-purple-700">🚛 משאיות</span>
                <div className="flex gap-0.5 flex-wrap justify-center mt-1 w-12">
                  {"🟣🟣".split("").map((s, i) => (
                    <span key={i} className="text-[12px]" title="10 רכבים">🚛</span>
                  ))}
                </div>
                <span className="text-[8px] text-slate-500 mt-1">2 סמלים</span>
              </div>
            </div>
          </div>
        )}

        {selectedRep === 'c' && (
          <div className="flex flex-col items-center w-full animate-fade-in">
            <span className="text-[8px] font-extrabold text-red-500 mb-1">דיאגרמת עיגול (חלוקת אחוזים שגויה להשוואה)</span>
            <svg width="100" height="100" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="white" stroke="#334155" strokeWidth="1" />
              {/* Drawn with incorrect sectors showing visual trap for students */}
              <path d="M 50 50 L 90 50 A 40 40 0 0 1 50 90 Z" fill="#93c5fd" stroke="#2563eb" strokeWidth="0.5" />
              <path d="M 50 50 L 50 90 A 40 40 0 0 1 10 50 Z" fill="#fde047" stroke="#ca8a04" strokeWidth="0.5" />
              <path d="M 50 50 L 10 50 A 40 40 0 0 1 50 10 Z" fill="#86efac" stroke="#16a34a" strokeWidth="0.5" />
              <path d="M 50 55 L 50 10 A 40 40 0 0 1 90 55 Z" fill="#d8b4fe" stroke="#9333ea" strokeWidth="0.5" />
              <text x="70" y="70" fontSize="5" fontWeight="bold" fill="#1e3a8a">מכוניות (?)</text>
              <text x="30" y="70" fontSize="5" fontWeight="bold" fill="#854d0e">אופניים (?)</text>
              <text x="30" y="30" fontSize="5" fontWeight="bold" fill="#14532d">אוטובוס (?)</text>
              <text x="70" y="30" fontSize="5" fontWeight="bold" fill="#581c87">משאיות (?)</text>
            </svg>
          </div>
        )}
      </div>
      <div className="text-[9.5px] text-slate-500 italic text-center px-4">
        * מבוסס על שאלת משרד החינוך: מצאו אילו מן הייצוגים (א', ב', או ג') מציגים את נתוני התצפית בצורה תואמת ומהימנה.
      </div>
    </div>
  );
};

const FootballSvg = () => (
  <div className="flex flex-col items-center justify-center my-3 p-4 bg-slate-50/50 border border-slate-200/60 rounded-3xl select-none w-full max-w-md shadow-sm">
    <svg width="280" height="150" viewBox="0 0 280 150" className="bg-white rounded-2xl p-2 border border-slate-100 shadow-inner">
      <defs>
        {/* Soft grid lining gradient */}
        <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
          <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#f8fafc" strokeWidth="1" />
        </pattern>
        <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#0284c7" />
        </linearGradient>
      </defs>
      
      {/* Background grid */}
      <rect width="280" height="150" fill="url(#grid)" rx="8" />

      {/* Axis Lines */}
      <line x1="30" y1="120" x2="260" y2="120" stroke="#0f172a" strokeWidth="1.5" strokeLinecap="round" />
      <polygon points="260,117 265,120 260,123" fill="#0f172a" />
      
      <line x1="30" y1="15" x2="30" y2="120" stroke="#0f172a" strokeWidth="1.5" strokeLinecap="round" />
      <polygon points="27,15 30,10 33,15" fill="#0f172a" />

      {/* Y-axis Ticks & Horizontal Helplines */}
      {[0, 2, 4, 6, 8, 10, 12].map(v => {
        const y = 120 - (v * 8);
        return (
          <g key={v}>
            <line x1="26" y1={y} x2="30" y2={y} stroke="#0f172a" strokeWidth="1" />
            <text x="21" y={y + 3} fontSize="8" fontWeight="bold" fill="#334155" textAnchor="end">{v}</text>
            <line x1="30" y1={y} x2="252" y2={y} stroke="#e2e8f0" strokeWidth="0.8" strokeDasharray="3,3" />
          </g>
        );
      })}

      {/* Bars: Goal index from 0 to 7 */}
      {[
        { x: 0, val: 6 }, { x: 1, val: 8 }, { x: 2, val: 12 }, { x: 3, val: 11 },
        { x: 4, val: 7 }, { x: 5, val: 3 }, { x: 6, val: 2 }, { x: 7, val: 1 }
      ].map((bar, i) => {
        const xPos = 42 + i * 26;
        const h = bar.val * 8;
        return (
          <g key={bar.x} className="transition-all duration-300 hover:opacity-90">
            {/* Draw beautiful glossy textbook bar */}
            <rect x={xPos} y={120 - h} width="16" height={h} fill="url(#barGradient)" rx="2" stroke="#0369a1" strokeWidth="0.8" />
            {/* Dark wood baseline helper underneath the bar */}
            <line x1={xPos} y1="120" x2={xPos + 16} y2="120" stroke="#0f172a" strokeWidth="1.5" />
            {/* X labels  */}
            <text x={xPos + 8} y="132" fontSize="9.5" fontWeight="black" fill="#1e293b" textAnchor="middle">{bar.x}</text>
            {/* Value markers on top */}
            <text x={xPos + 8} y={120 - h - 3} fontSize="8.5" fontWeight="black" fill="#0369a1" textAnchor="middle">{bar.val}</text>
          </g>
        );
      })}

      {/* Axis titles */}
      <text x="145" y="145" fontSize="9.5" fontWeight="bold" fill="#0f172a" textAnchor="middle">מספר השערים שהובקעו במשחק</text>
      <text x="12" y="12" fontSize="7.5" fontWeight="black" fill="#0f172a" textAnchor="start">משחקים</text>
    </svg>
    <span className="text-[10px] text-slate-500 font-bold mt-2 bg-white/70 px-3 py-1 rounded-full border">
      דיאגרמה א': מספר השערים השכיחי שהובקעו בליגה
    </span>
  </div>
);

const HobbiesSvg = () => (
  <div className="flex flex-col items-center justify-center my-3 p-4 bg-slate-50/50 border border-slate-200/60 rounded-3xl select-none w-full max-w-md gap-4 shadow-sm">
    {/* Table - Enhanced Layout */}
    <div className="w-full">
      <div className="text-[10.5px] font-black text-slate-700 bg-slate-200/50 p-2 rounded-t-xl text-center border-t border-x border-slate-200">
        הטבלה של חן (התפלגות באחוזים)
      </div>
      <table className="w-full text-center text-xs border border-collapse rounded-b-xl overflow-hidden bg-white shadow-sm border-slate-200">
        <thead>
          <tr className="bg-slate-100 text-[10px] font-black text-slate-700">
            <th className="p-2 border">חוג</th>
            <th className="p-2 border text-indigo-700">תיאטרון</th>
            <th className="p-2 border text-purple-700 bg-purple-50/70 font-extrabold">מחול</th>
            <th className="p-2 border text-blue-700">מחשבים</th>
            <th className="p-2 border text-emerald-700">ספורט</th>
          </tr>
        </thead>
        <tbody>
          <tr className="font-semibold text-slate-800">
            <td className="p-2 border font-bold bg-slate-50">אחוז</td>
            <td className="p-2 border text-indigo-600">10%</td>
            <td className="p-2 border text-purple-600 font-extrabold bg-purple-50/40">35%</td>
            <td className="p-2 border text-blue-600">15%</td>
            <td className="p-2 border text-emerald-600">40%</td>
          </tr>
        </tbody>
      </table>
    </div>

    {/* Stick chart / Stick representation - Upgraded Graphics with coordinate guides */}
    <div className="w-full">
      <div className="text-[10.5px] font-black text-slate-700 bg-slate-200/50 p-2 rounded-t-xl text-center border-t border-x border-slate-200">
        דיאגרמת המקלות של אלעד (במספרי תלמידים משוערים)
      </div>
      <div className="bg-white border text-right border-slate-200 rounded-b-xl p-3 flex flex-col items-center">
        {/* Draw a beautiful mock coordinate system representing the stick graphs */}
        <svg width="280" height="120" viewBox="0 0 280 120" className="p-1">
          {/* Grid lines in background */}
          {[0, 20, 40, 60, 80].map(h => {
             const y = 100 - (h * 0.9);
             return (
               <g key={h}>
                 <line x1="30" y1={y} x2="270" y2={y} stroke="#f1f5f9" strokeWidth="1" />
                 <text x="24" y={y + 3} fontSize="7" fill="#64748b" textAnchor="end">{h}</text>
               </g>
             );
          })}
          
          {/* Coordinates Axes */}
          <line x1="30" y1="100" x2="270" y2="100" stroke="#1e293b" strokeWidth="1.2" />
          <line x1="30" y1="10" x2="30" y2="100" stroke="#1e293b" strokeWidth="1.2" />
          
          {/* Sticks representing courses: Theater(20), Dance(70), Computers(30), Sport(80) */}
          {[
            { name: "תיאטרון", val: 20, fill: "#4f46e5", percent: "10%" },
            { name: "מחול", val: 70, fill: "#9333ea", percent: "35%" },
            { name: "מחשבים", val: 30, fill: "#2563eb", percent: "15%" },
            { name: "ספורט", val: 80, fill: "#059669", percent: "40%" }
          ].map((stick, i) => {
            const x = 60 + i * 62;
            const y = 100 - (stick.val * 0.9);
            return (
              <g key={stick.name}>
                {/* Thick wood-stick styling with colored endpoint indicator balloon */}
                <line x1={x} y1="100" x2={x} y2={y} stroke={stick.fill} strokeWidth="3" strokeLinecap="round" />
                <circle cx={x} cy={y} r="5" fill={stick.fill} stroke="white" strokeWidth="1.2" />
                {/* Visual guideline projection */}
                <line x1="30" y1={y} x2={x} y2={y} stroke={stick.fill} strokeWidth="0.6" strokeDasharray="2,3" strokeOpacity="0.4" />
                
                {/* Labels */}
                <text x={x} y="112" fontSize="8" fontWeight="black" fill="#1e293b" textAnchor="middle">{stick.name}</text>
                <text x={x} y={y - 8} fontSize="7" fontWeight="black" fill={stick.fill} textAnchor="middle">{stick.val} תלמ' ({stick.percent})</text>
              </g>
            );
          })}
          <text x="10" y="8" fontSize="6.5" fill="#64748b" textAnchor="start">תלמידים</text>
        </svg>
      </div>
    </div>
  </div>
);

const CallsSvg = () => (
  <div className="flex flex-col items-center justify-center my-3 p-4 bg-slate-50/50 border border-slate-200/60 rounded-3xl select-none w-full max-w-lg gap-3 shadow-sm border-slate-200">
    <div className="grid grid-cols-4 gap-2 text-center text-xs font-mono font-bold w-full">
      <div className="p-2 bg-green-50 text-green-900 rounded-xl border border-green-200 shadow-sm">
        <span className="block text-[8px] text-green-700">קשר תקין</span>
        <strong className="text-sm">250</strong>
        <span className="block text-[7px] text-green-600">(50%)</span>
      </div>
      <div className="p-2 bg-yellow-50 text-yellow-900 rounded-xl border border-yellow-200 shadow-sm">
        <span className="block text-[8px] text-yellow-700">אין תשובה</span>
        <strong className="text-sm">100</strong>
        <span className="block text-[7px] text-yellow-600">(20%)</span>
      </div>
      <div className="p-2 bg-orange-50 text-orange-900 rounded-xl border border-orange-200 shadow-sm">
        <span className="block text-[8px] text-orange-700">מקולקל</span>
        <strong className="text-sm">125</strong>
        <span className="block text-[7px] text-orange-600">(25%)</span>
      </div>
      <div className="p-2 bg-red-50 text-red-900 rounded-xl border border-red-200 shadow-sm">
        <span className="block text-[8px] text-red-700">תפוס</span>
        <strong className="text-sm">25</strong>
        <span className="block text-[7px] text-red-600">(5%)</span>
      </div>
    </div>
    
    <div className="flex items-center gap-5 bg-white p-3 border rounded-2xl w-full justify-center shadow-inner">
      {/* Circle divided exactly in 10 parts with shaded color representing 500 total calls */}
      <svg width="120" height="120" viewBox="0 0 100 100" className="drop-shadow-sm">
        <circle cx="50" cy="50" r="45" fill="#fdfdfd" stroke="#0f172a" strokeWidth="1.2" />
        
        {/* Fill sectors of 10 equal divisions representing 10% each */}
        {/* Radial partitions */}
        {Array.from({ length: 10 }).map((_, i) => {
          const angle = (i * 36) * (Math.PI / 180);
          const x = 50 + 45 * Math.cos(angle);
          const y = 50 + 45 * Math.sin(angle);
          return (
            <line key={i} x1="50" y1="50" x2={x} y2={y} stroke="#334155" strokeWidth="0.6" strokeDasharray="1.5,1.5" />
          );
        })}

        {/* Shading representing actual distributions nicely overlayed */}
        {/* Slice 1: קשר תקין - 5 slices (0 to 180 deg) */}
        <path d="M 50 50 L 95 50 A 45 45 0 0 1 5 50 Z" fill="#22c55e" fillOpacity="0.15" stroke="#16a34a" strokeWidth="1" />
        
        {/* Slice 2: אין תשובה - 2 slices (180 to 252 deg) */}
        {/* 252 deg coordinates: dx = 45 * cos(252) = -13.9, dy = 45 * sin(252) = -42.8. Point = (36.1, 7.2) */}
        <path d="M 50 50 L 5 50 A 45 45 0 0 1 36.1 7.2 Z" fill="#eab308" fillOpacity="0.12" stroke="#ca8a04" strokeWidth="1" />
        
        {/* Slice 3: קשר מקולקל - 2.5 slices (252 to 342 deg) */}
        {/* 342 deg coordinates: dx = 45 * cos(342) = 42.8, dy = 45 * sin(342) = -13.9. Point = (92.8, 36.1) */}
        <path d="M 50 50 L 36.1 7.2 A 45 45 0 0 1 92.8 36.1 Z" fill="#f97316" fillOpacity="0.12" stroke="#ea580c" strokeWidth="1" />
        
        {/* Slice 4: תפוס - 0.5 slice (342 to 360 deg) */}
        <path d="M 50 50 L 92.8 36.1 A 45 45 0 0 1 95 50 Z" fill="#ef4444" fillOpacity="0.15" stroke="#dc2626" strokeWidth="1" />
        
        {/* Core pin */}
        <circle cx="50" cy="50" r="3" fill="#1e293b" />
        
        {/* Sector Labels inside SVG */}
        <text x="50" y="72" fontSize="5.5" fontWeight="900" fill="#15803d" textAnchor="middle">תקין (50%)</text>
        <text x="24" y="36" fontSize="5.5" fontWeight="900" fill="#a16207" textAnchor="middle">אין מענה (20%)</text>
        <text x="64" y="24" fontSize="5.5" fontWeight="900" fill="#c2410c" textAnchor="middle">מקולקל (25%)</text>
        <text x="88" y="44" fontSize="3.8" fontWeight="900" fill="#991b1b" textAnchor="middle">תפוס</text>
      </svg>
      <div className="text-[10.5px] text-slate-600 font-semibold text-right leading-relaxed max-w-[200px]">
        📊 <strong>חלוקת דיאגרמת ה-10 גזרות</strong>:<br />
        • עיגול סמוך <strong>מפורק ל-10 עוגות שוות</strong> (10% כ"א).<br />
        • כל נתון רשום עם אחוזיו מתוך סך הכל (500 חיוגים).
      </div>
    </div>
  </div>
);

const ColorsSvg = () => (
  <div className="flex flex-col items-center justify-center my-3 p-4 bg-slate-50/50 border border-slate-200/60 rounded-3xl select-none shadow-sm">
    <svg width="180" height="180" viewBox="0 0 100 100" className="drop-shadow-md">
      <defs>
        <filter id="crisp-shadow" x="-5%" y="-5%" width="110%" height="110%">
          <feDropShadow dx="0" dy="1" stdDeviation="0.8" floodColor="#000" floodOpacity="0.1" />
        </filter>
      </defs>
      {/* Base ring with shadow */}
      <circle cx="50" cy="50" r="45" fill="#fef08a" stroke="#ca8a04" strokeWidth="1.2" filter="url(#crisp-shadow)" />
      
      {/* Red 60% -> 216 deg (from 0 to 216) */}
      {/* 216 deg Point: dx = 45 * cos(216 deg) = -36.4, dy = 45 * sin(216 deg) = -26.45. Point = (13.6, 23.5) */}
      <path d="M 50 50 L 95 50 A 45 45 0 1 1 13.6 23.5 Z" fill="#fee2e2" stroke="#dc2626" strokeWidth="1.2" />
      
      {/* Blue 25% -> 90 deg starting from 216 -> terminates at 306 deg */}
      {/* 306 deg Point: dx = 45 * cos(306 deg) = 26.45, dy = 45 * sin(306 deg) = -36.4. Point = (76.4, 13.6) */}
      <path d="M 50 50 L 13.6 23.5 A 45 45 0 0 1 76.4 13.6 Z" fill="#dbeafe" stroke="#2563eb" strokeWidth="1.2" />

      {/* Yellow remaining 15% (306 to 360 deg) completed by the base yellow slice */}
      
      {/* Direct black border overlay separating sectors mathematically */}
      <line x1="50" y1="50" x2="95" y2="50" stroke="#0f172a" strokeWidth="1" />
      <line x1="50" y1="50" x2="13.6" y2="23.5" stroke="#0f172a" strokeWidth="1" />
      <line x1="50" y1="50" x2="76.4" y2="13.6" stroke="#0f172a" strokeWidth="1" />

      {/* Decorative pointer pin */}
      <circle cx="50" cy="50" r="2.5" fill="#1e293b" />

      {/* Precise Text Labels with dark thematic colors */}
      <text x="45" y="76" fontSize="6.5" fontWeight="900" fill="#991b1b" textAnchor="middle">אדום (60%)</text>
      <text x="34" y="31" fontSize="6.5" fontWeight="900" fill="#1e40af" textAnchor="middle">כחול (25%)</text>
      <text x="74" y="34" fontSize="6.5" fontWeight="900" fill="#854d0e" textAnchor="middle">צהוב (?)</text>
    </svg>
    <span className="text-[10px] text-slate-500 font-bold mt-2 bg-white/70 px-3 py-1 rounded-full border">
      דיאגרמת התפלגות צבעי בלונים (60% אדום, 25% כחול)
    </span>
  </div>
);

const NewspaperSalesSvg = () => {
  const [showFairGraph, setShowFairGraph] = React.useState(false);
  return (
    <div className="flex flex-col items-center justify-center my-3 p-4 bg-slate-50/50 border border-slate-200/60 rounded-3xl select-none w-full max-w-lg gap-3 shadow-sm">
      <div className="bg-amber-50 border border-amber-200/70 text-[9.5px] text-amber-900 p-2 rounded-xl text-center font-bold w-full">
        ⚠️ שים לב: בציר ה-Y של הדיאגרמה הרשמית, המספרים מתחילים מ-<strong>6,000</strong> ליצירת אפקט הטעיה מכוון!
      </div>
      
      <div className="flex gap-2">
        <button 
          type="button"
          onClick={() => setShowFairGraph(!showFairGraph)}
          className="bg-slate-800 text-white hover:bg-slate-900 px-3 py-1 text-[10px] font-black rounded-lg transition-all shadow-sm"
        >
          {showFairGraph ? "צפה בגרף המטעה המקורי (הפרש עצום)" : "צפה בגרף ההתחלה מ-0 (ההפרש האמיתי)"}
        </button>
      </div>

      <div className="bg-white rounded-2xl p-3 border border-slate-100 shadow-inner w-full flex flex-col items-center min-h-[140px] justify-center">
        {!showFairGraph ? (
          <div className="flex flex-col items-center w-full animate-fade-in">
            <span className="text-[8.5px] font-extrabold text-red-600 mb-1">הגרף המטעה (ציר קטוע מ-6000)</span>
            <svg width="260" height="110" viewBox="0 0 260 110">
              <line x1="33" y1="90" x2="235" y2="90" stroke="#1e293b" strokeWidth="1.2" />
              <line x1="33" y1="10" x2="33" y2="90" stroke="#1e293b" strokeWidth="1.2" />
              {[6000, 8000, 10000, 12000].map((v, i) => {
                const y = 90 - i * 24;
                return (
                  <g key={v}>
                    <line x1="29" y1={y} x2="33" y2={y} stroke="#1e293b" />
                    <text x="25" y={y + 2.5} fontSize="7" fontWeight="bold" fill="#475569" textAnchor="end">{v.toLocaleString()}</text>
                    <line x1="33" y1={y} x2="235" y2={y} stroke="#f1f5f9" strokeWidth="0.8" />
                  </g>
                );
              })}
              
              {/* Break symbol representation to prove truncated scale officially */}
              <g stroke="#dc2626" strokeWidth="1">
                <line x1="28" y1="86" x2="38" y2="84" />
                <line x1="28" y1="88" x2="38" y2="86" />
              </g>

              {/* Jan: Zed 9000, Zealand 11000 (Height values: (9000-6000)/6000 * 72) */}
              <rect x="48" y={90 - 36} width="12" height={36} fill="#cbd5e1" stroke="#94a3b8" strokeWidth="0.8" rx="0.5" />
              <rect x="62" y={90 - 60} width="12" height={60} fill="#334155" stroke="#0f172a" strokeWidth="0.8" rx="0.5" />
              <text x="61" y="99" fontSize="8" fontWeight="black" fill="#334155" textAnchor="middle">ינואר</text>

              {/* Feb: Zed 10000, Zealand 11500 */}
              <rect x="108" y={90 - 48} width="12" height={48} fill="#cbd5e1" stroke="#94a3b8" strokeWidth="0.8" rx="0.5" />
              <rect x="122" y={90 - 66} width="12" height={66} fill="#334155" stroke="#0f172a" strokeWidth="0.8" rx="0.5" />
              <text x="121" y="99" fontSize="8" fontWeight="black" fill="#334155" textAnchor="middle">פברואר</text>

              {/* Mar: Zed 8000, Zealand 10500 */}
              <rect x="168" y={90 - 24} width="12" height={24} fill="#cbd5e1" stroke="#94a3b8" strokeWidth="0.8" rx="0.5" />
              <rect x="182" y={90 - 54} width="12" height={54} fill="#334155" stroke="#0f172a" strokeWidth="0.8" rx="0.5" />
              <text x="181" y="99" fontSize="8" fontWeight="black" fill="#334155" textAnchor="middle">מרץ</text>

              {/* Map Legend inside graph */}
              <g transform="translate(198, 12)">
                <rect x="0" y="0" width="6" height="6" fill="#cbd5e1" stroke="#94a3b8" />
                <text x="10" y="6" fontSize="5.5" fontWeight="bold" fill="#475569">'זד היום'</text>
                <rect x="0" y="10" width="6" height="6" fill="#334155" stroke="#0f172a" />
                <text x="10" y="16" fontSize="5.5" fontWeight="bold" fill="#475569">'עיתון זלנד'</text>
              </g>
            </svg>
          </div>
        ) : (
          <div className="flex flex-col items-center w-full animate-fade-in">
            <span className="text-[8.5px] font-extrabold text-emerald-600 mb-1">הגרף הפרופורציונלי האמיתי (ציר שלם מ-0)</span>
            <svg width="260" height="110" viewBox="0 0 260 110">
              <line x1="33" y1="90" x2="235" y2="90" stroke="#1e293b" strokeWidth="1.2" />
              <line x1="33" y1="10" x2="33" y2="90" stroke="#1e293b" strokeWidth="1.2" />
              {[0, 4000, 8000, 12000].map((v, i) => {
                const y = 90 - i * 25;
                return (
                  <g key={v}>
                    <line x1="29" y1={y} x2="33" y2={y} stroke="#1e293b" />
                    <text x="25" y={y + 2.5} fontSize="7" fontWeight="bold" fill="#475569" textAnchor="end">{v.toLocaleString()}</text>
                    <line x1="33" y1={y} x2="235" y2={y} stroke="#f1f5f9" strokeWidth="0.8" />
                  </g>
                );
              })}

              {/* Jan: Zed 9000 (Height = 9000/12000 * 75 = 56.25), Zealand 11000 (Height = 68.75) */}
              <rect x="48" y={90 - 56.2} width="12" height={56.2} fill="#cbd5e1" stroke="#94a3b8" rx="0.5" />
              <rect x="62" y={90 - 68.7} width="12" height={68.7} fill="#334155" stroke="#0f172a" rx="0.5" />
              <text x="61" y="99" fontSize="8" fontWeight="black" fill="#334155" textAnchor="middle">ינואר</text>

              {/* Feb: Zed 10000, Zealand 11500 */}
              <rect x="108" y={90 - 62.5} width="12" height={62.5} fill="#cbd5e1" stroke="#94a3b8" rx="0.5" />
              <rect x="122" y={90 - 71.8} width="12" height={71.8} fill="#334155" stroke="#0f172a" rx="0.5" />
              <text x="121" y="99" fontSize="8" fontWeight="black" fill="#334155" textAnchor="middle">פברואר</text>

              {/* Mar: Zed 8000, Zealand 10500 */}
              <rect x="168" y={90 - 50} width="12" height={50} fill="#cbd5e1" stroke="#94a3b8" rx="0.5" />
              <rect x="182" y={90 - 65.6} width="12" height={65.6} fill="#334155" stroke="#0f172a" rx="0.5" />
              <text x="181" y="99" fontSize="8" fontWeight="black" fill="#334155" textAnchor="middle">מרץ</text>

              <g transform="translate(198, 12)">
                <rect x="0" y="0" width="6" height="6" fill="#cbd5e1" stroke="#94a3b8" />
                <text x="10" y="6" fontSize="5.5" fontWeight="bold" fill="#475569">'זד היום'</text>
                <rect x="0" y="10" width="6" height="6" fill="#334155" stroke="#0f172a" />
                <text x="10" y="16" fontSize="5.5" fontWeight="bold" fill="#475569">'עיתון זלנד'</text>
              </g>
            </svg>
          </div>
        )}
      </div>
    </div>
  );
};

const TvPreferencesSvg = () => (
  <div className="flex flex-col items-center justify-center my-3 p-4 bg-slate-50/50 border border-slate-200/60 rounded-3xl select-none w-full max-w-sm shadow-sm">
    <svg width="180" height="180" viewBox="0 0 100 100" className="drop-shadow-md">
      <defs>
        <filter id="soft-shadow" x="-8%" y="-8%" width="116%" height="116%">
          <feDropShadow dx="0" dy="1.2" stdDeviation="1" floodColor="#000" floodOpacity="0.12" />
        </filter>
      </defs>
      <circle cx="50" cy="50" r="45" fill="white" stroke="#1e293b" strokeWidth="1.5" filter="url(#soft-shadow)" />

      {/* Circle divided exactly into 12 parts of 30deg each. */}
      {/* 4/12 music = 120deg (0 to 120) */}
      <path d="M 50 50 L 95 50 A 45 45 0 0 1 27.5 89 Z" fill="#eff6ff" stroke="#2563eb" strokeWidth="0.8" />
      {/* 3/12 drama = 90deg (120 to 210) */}
      {/* coordinates: dx = 45 * cos(210) = -39, dy = 45 * sin(210) = -22.5. Point = (11, 27.5) */}
      <path d="M 50 50 L 27.5 89 A 45 45 0 0 1 11 27.5 Z" fill="#ecfdf5" stroke="#059669" strokeWidth="0.8" />
      {/* 2/12 action = 60deg (210 to 270) */}
      {/* coordinates: dx = 45 * cos(270) = 0, dy = 45 * sin(270) = -45. Point = (50, 5) */}
      <path d="M 50 50 L 11 27.5 A 45 45 0 0 1 50 5 Z" fill="#fff1f2" stroke="#e11d48" strokeWidth="0.8" />
      {/* 1/12 history = 30deg (270 to 300) */}
      {/* coordinates: dx = 45 * cos(300) = 22.5, dy = 45 * sin(300) = -39. Point = (72.5, 11) */}
      <path d="M 50 50 L 50 5 A 45 45 0 0 1 72.5 11 Z" fill="#fffbeb" stroke="#d97706" strokeWidth="0.8" />
      {/* 1/12 sports = 30deg (300 to 330) */}
      {/* coordinates: dx = 45 * cos(330) = 39, dy = 45 * sin(330) = -22.5. Point = (89, 27.5) */}
      <path d="M 50 50 L 72.5 11 A 45 45 0 0 1 89 27.5 Z" fill="#faf5ff" stroke="#7c3aed" strokeWidth="0.8" />
      {/* 1/12 none = 30deg (330 to 360) */}
      <path d="M 50 50 L 89 27.5 A 45 45 0 0 1 95 50 Z" fill="#f8fafc" stroke="#475569" strokeWidth="0.8" />

      {/* Pure black outlines separating wedges */}
      <line x1="50" y1="50" x2="95" y2="50" stroke="#0f172a" strokeWidth="0.8" />
      <line x1="50" y1="50" x2="27.5" y2="89" stroke="#0f172a" strokeWidth="0.8" />
      <line x1="50" y1="50" x2="11" y2="27.5" stroke="#0f172a" strokeWidth="0.8" />
      <line x1="50" y1="50" x2="50" y2="5" stroke="#0f172a" strokeWidth="0.8" />
      <line x1="50" y1="50" x2="72.5" y2="11" stroke="#0f172a" strokeWidth="0.8" />
      <line x1="50" y1="50" x2="89" y2="27.5" stroke="#0f172a" strokeWidth="0.8" />

      {/* Axis center pin */}
      <circle cx="50" cy="50" r="2.5" fill="#1e293b" />

      {/* Exterior and interior text markings to enforce max aesthetic workspace readability */}
      <text x="66" y="72" fontSize="5.5" fontWeight="950" fill="#1d4ed8" textAnchor="middle">מוזיקה (4/12)</text>
      <text x="25" y="70" fontSize="5.5" fontWeight="950" fill="#047857" textAnchor="middle">דרמה (3/12)</text>
      <text x="23" y="32" fontSize="5.5" fontWeight="950" fill="#be123c" textAnchor="middle">פעולה (2/12)</text>
      <text x="50" y="15" fontSize="4.5" fontWeight="950" fill="#b45309" textAnchor="middle">היסטוריה (1/12)</text>
      <text x="73" y="21" fontSize="4.5" fontWeight="950" fill="#6b21a8" textAnchor="middle">ספורט (1/12)</text>
      <text x="88" y="38" fontSize="4.5" fontWeight="950" fill="#475569" textAnchor="middle">ללא (1/12)</text>
    </svg>
    <div className="text-[10px] text-slate-500 font-extrabold mt-2 text-center">
      מבנה גלגל 12 הגזרות: 240 תלמידים סה"כ (כל גזרה נציגה 20 ילדים)
    </div>
  </div>
);

const GreenInitiativeSvg = () => {
  const [showHelperGraph, setShowHelperGraph] = React.useState(false);
  return (
    <div className="flex flex-col items-center justify-center my-3 p-4 bg-slate-50/50 border border-slate-200/60 rounded-3xl select-none w-full max-w-sm gap-2 shadow-sm">
      <div className="text-[10.5px] bg-emerald-50 text-emerald-900 p-2 rounded-xl border border-emerald-150 w-full text-center font-bold">
        🌿 נתוני האיסוף שנרשמו: <strong>א: 45 | ב: 60 | ג: 30 | ד: 75 | ה: 50</strong>
      </div>
      
      <div className="flex gap-2">
        <button 
          type="button"
          onClick={() => setShowHelperGraph(!showHelperGraph)}
          className="bg-emerald-700 text-white hover:bg-emerald-800 px-3 py-1 text-[10px] font-black rounded-lg transition-all shadow-sm"
        >
          {showHelperGraph ? "הסתר שרטוט מודרך" : "הצג שרטוט מודרך לציונים"}
        </button>
      </div>

      <div className="bg-white border rounded-2xl p-2 w-full flex flex-col items-center shadow-inner">
        <svg width="240" height="120" viewBox="0 0 240 120">
          {/* Main textbook axes */}
          <line x1="30" y1="95" x2="230" y2="95" stroke="#1e293b" strokeWidth="1.5" strokeLinecap="round" />
          <polygon points="230,92 235,95 230,98" fill="#1e293b" />
          <text x="235" y="106" fontSize="6" fontWeight="bold" fill="#334155" textAnchor="end">ימי השבוע</text>

          <line x1="30" y1="12" x2="30" y2="95" stroke="#1e293b" strokeWidth="1.5" strokeLinecap="round" />
          <polygon points="27,12 30,7 33,12" fill="#1e293b" />
          <text x="35" y="10" fontSize="6.5" fontWeight="black" fill="#1e293b" textAnchor="start">כמות בקבוקים (Y)</text>
          
          {/* Explicit grid systems for kids to draw with pencil */}
          {[0, 10, 20, 30, 40, 50, 60, 70, 80].map(val => (
            <g key={val}>
              <line x1="26" y1={95 - val * 0.95} x2="30" y2={95 - val * 0.95} stroke="#1e293b" strokeWidth="1" />
              <text x="22" y={95 - val * 0.95 + 2.5} fontSize="7.5" fontWeight="bold" fill="#64748b" textAnchor="end">{val}</text>
              <line x1="30" y1={95 - val * 0.95} x2="222" y2={95 - val * 0.95} stroke="#f1f5f9" strokeWidth="0.8" />
            </g>
          ))}

          {/* Semi-transparent guided columns if helper is activated */}
          {showHelperGraph && [
            { day: "א'", val: 45, fill: "#10b981" },
            { day: "ב'", val: 60, fill: "#10b981" },
            { day: "ג'", val: 30, fill: "#10b981" },
            { day: "ד'", val: 75, fill: "#10b981" },
            { day: "ה'", val: 50, fill: "#10b981" }
          ].map((item, idx) => {
            const x = 50 + idx * 35;
            const h = item.val * 0.95;
            return (
              <g key={idx} className="animate-fade-in">
                <rect x={x} y={95 - h} width="16" height={h} fill={item.fill} fillOpacity="0.45" stroke={item.fill} strokeWidth="1" strokeDasharray="2,2" rx="1" />
                <text x={x + 8} y={95 - h - 3} fontSize="7" fontWeight="black" fill="#047857" textAnchor="middle">{item.val}</text>
              </g>
            );
          })}

          {/* Day markers on X axis */}
          {["ראשון", "שני", "שלישי", "רביעי", "חמישי"].map((day, d) => (
            <text key={day} x={58 + d * 35} y="106" fontSize="7.5" fontWeight="bold" fill="#1e293b" textAnchor="middle">{day}</text>
          ))}
        </svg>
        <span className="text-[8.5px] text-slate-450 italic mt-1.5 text-center leading-relaxed">
          * דגם דיאגרמה ריק המיועד ללמידה וסרטוט מדויק. {showHelperGraph ? "הפתרון מוצג בקו מקווקו חלש." : "הדליקו פתרון מודרך כדי לאמת."}
        </span>
      </div>
    </div>
  );
};

const StudyTimeSvg = () => (
  <div className="flex flex-col items-center justify-center my-3 p-4 bg-slate-50/50 border border-slate-200/60 rounded-3xl select-none w-full max-w-md shadow-sm">
    <svg width="260" height="150" viewBox="0 0 260 150" className="bg-white rounded-2xl p-2 border border-slate-100 shadow-inner">
      {/* Grid patterning background */}
      <line x1="30" y1="120" x2="245" y2="120" stroke="#0f172a" strokeWidth="1.5" strokeLinecap="round" />
      <polygon points="245,117 250,120 245,123" fill="#0f172a" />
      <text x="245" y="132" fontSize="7.5" fontWeight="black" fill="#1e293b" textAnchor="end">שעות הכנה למבחן (x)</text>

      <line x1="30" y1="15" x2="30" y2="120" stroke="#0f172a" strokeWidth="1.5" strokeLinecap="round" />
      <polygon points="27,15 30,10 33,15" fill="#0f172a" />
      <text x="35" y="12" fontSize="7.5" fontWeight="black" fill="#1e293b" textAnchor="start">ציון במבחן (y)</text>

      {/* Grid lines up to 100 on Y-Axis */}
      {[0, 20, 40, 60, 80, 100].map(v => {
        const y = 120 - (v * 0.95);
        return (
          <g key={v}>
            <line x1="26" y1={y} x2="30" y2={y} stroke="#0f172a" strokeWidth="1" />
            <text x="22" y={y + 3} fontSize="8" fontWeight="bold" fill="#64748b" textAnchor="end">{v}</text>
            <line x1="30" y1={y} x2="240" y2={y} stroke="#f1f5f9" strokeWidth="1" />
          </g>
        );
      })}
      
      {/* Hours 0 to 6 on X-Axis with exact ticks */}
      {Array.from({ length: 7 }).map((_, h) => {
        const x = 30 + h * 32;
        return (
          <g key={h}>
            <line x1={x} y1="120" x2={x} y2="124" stroke="#0f172a" strokeWidth="1" />
            <text x={x} y="132" fontSize="8" fontWeight="bold" fill="#64748b" textAnchor="middle">{h}</text>
            <line x1={x} y1="15" x2={x} y2="120" stroke="#f8fafc" strokeWidth="0.8" />
          </g>
        );
      })}

      {/* Points: א(2.5, 80), ב(3.0, 40), ג(4.2, 70), ד(6.0, 90), ה(5.3, 76), ו(5.5, 45) */}
      {/* With explicit dashed coordinate guide projections */}
      {[
        { name: "א", x: 2.5, y: 80, color: "#2563eb" },
        { name: "ב", x: 3.0, y: 40, color: "#dc2626" },
        { name: "ג", x: 4.2, y: 70, color: "#059669" },
        { name: "ד", x: 6.0, y: 90, color: "#7c3aed" },
        { name: "ה", x: 5.3, y: 76, color: "#d97706" },
        { name: "ו", x: 5.5, y: 45, color: "#db2777" }
      ].map(p => {
        const cx = 30 + p.x * 32;
        const cy = 120 - p.y * 0.95;
        return (
          <g key={p.name}>
            {/* Horizontal coordinate helper */}
            <line x1="30" y1={cy} x2={cx} y2={cy} stroke={p.color} strokeWidth="0.6" strokeDasharray="2,2" strokeOpacity="0.5" />
            {/* Vertical coordinate helper */}
            <line x1={cx} y1="120" x2={cx} y2={cy} stroke={p.color} strokeWidth="0.6" strokeDasharray="2,2" strokeOpacity="0.5" />
            
            {/* Solid point bullet with white bezel halo */}
            <circle cx={cx} cy={cy} r="5" fill={p.color} stroke="white" strokeWidth="1.5" className="transition-all duration-200 hover:scale-125" />
            
            {/* Labels beside dot */}
            <text x={cx + 7} y={cy - 4} fontSize="9" fontWeight="black" fill="#0f172a">{p.name}</text>
          </g>
        );
      })}
    </svg>
    <span className="text-[10px] text-slate-500 font-bold mt-2 bg-white/70 px-3 py-1 rounded-full border">
      דיאגרמת פיזור ב': התאמת שעות הלמידה לציוני תלמידי הכיתה
    </span>
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
  <div className="mt-4 print:mt-1.5 border border-slate-200 bg-slate-50/5 max-w-full rounded-2xl p-4 print:p-2.5 flex flex-col justify-between select-none">
    <span className="text-[10px] font-black text-slate-400 mb-2 print:mb-1 block leading-none">תשובות ודרך הפתרון:</span>
    <div className="space-y-5 print:space-y-4 py-1 print:py-0.5">
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
                className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
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
                <div className="border-b-2 border-slate-900 pb-3 print:pb-1.5 mb-5 print:mb-3 flex justify-between items-start">
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-black tracking-widest text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md inline-block mb-1">
                      דף עבודה נושאי • אי-ודאות והסתברות
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
