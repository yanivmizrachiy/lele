import React, { useState } from "react";
import { CardsData } from "../types";
import { RefreshCw, Play } from "lucide-react";

interface CardsVisualizerProps {
  data: CardsData;
  isGrayscale: boolean;
}

export const CardsVisualizer: React.FC<CardsVisualizerProps> = ({ data, isGrayscale }) => {
  const [drawnCard, setDrawnCard] = useState<{ suit: string; color: string; val: number } | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawnHistory, setDrawnHistory] = useState<{ suit: string; color: string; val: number }[]>([]);

  const totalCardsCount = data.suits.length * data.maxNumber;

  const handleDrawCard = () => {
    if (isDrawing) return;
    setIsDrawing(true);
    setDrawnCard(null);

    setTimeout(() => {
      const randomSuit = data.suits[Math.floor(Math.random() * data.suits.length)];
      const randomNum = Math.floor(Math.random() * data.maxNumber) + 1;
      
      const newCard = {
        suit: randomSuit.name,
        color: randomSuit.color,
        val: randomNum,
      };

      setDrawnCard(newCard);
      setDrawnHistory((prev) => [newCard, ...prev].slice(0, 15));
      setIsDrawing(false);
    }, 700);
  };

  const handleReset = () => {
    setDrawnCard(null);
    setDrawnHistory([]);
  };

  const totalDrawn = drawnHistory.length;
  // Criteria: Even or Red
  const successfulDrawsCount = drawnHistory.filter(
    (card) => card.val % 2 === 0 || card.suit === "אדום"
  ).length;

  const experimentalProb = totalDrawn > 0 ? (successfulDrawsCount / totalDrawn) * 100 : 0;
  // Theoretical probability is 25/40 = 62.5%
  const theoreticalProb = 62.5;

  return (
    <div className={`p-4 bg-gray-50/50 rounded-2xl border border-gray-100 flex flex-col gap-6 justify-center ${isGrayscale ? "grayscale" : ""}`}>
      
      {/* Simulation Controls & Result Display */}
      <div className="flex flex-col md:flex-row items-center gap-6" dir="rtl">
        
        {/* Draw action */}
        <div className="flex flex-col w-full md:w-56 text-right items-center justify-center">
          
          {/* Animated active Card */}
          <div className="relative w-28 h-40 bg-white border-2 border-slate-200 rounded-2xl shadow-md p-3 mb-4 flex flex-col justify-between overflow-hidden select-none">
            {drawnCard && !isDrawing ? (
              <>
                <div className="flex justify-between items-start">
                  <span className="font-extrabold text-xl leading-none" style={{ color: drawnCard.color }}>
                    {drawnCard.val}
                  </span>
                  <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                    {drawnCard.suit}
                  </span>
                </div>
                <div className="text-center font-black text-4xl block self-center" style={{ color: drawnCard.color }}>
                  {drawnCard.val}
                </div>
                <div className="flex justify-between items-end rotate-180">
                  <span className="font-extrabold text-xl leading-none">
                    {drawnCard.val}
                  </span>
                  <span className="text-xs font-semibold text-gray-500" style={{ color: drawnCard.color }} />
                </div>
              </>
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-800 flex flex-col items-center justify-center text-white border-[6px] border-white rounded-xl">
                <span className="text-3xl font-bold font-serif opacity-30">?</span>
                {isDrawing && <div className="absolute inset-x-4 h-1.5 bg-blue-500 rounded animate-ping"></div>}
              </div>
            )}
          </div>

          <div className="flex gap-2 w-full justify-center no-print">
            <button
              id="draw_card_btn"
              onClick={handleDrawCard}
              disabled={isDrawing}
              className="flex items-center justify-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-xl font-bold text-xs hover:bg-blue-700 disabled:opacity-50 shadow-sm transition-all flex-1"
            >
              <Play size={14} />
              שלוף קלף
            </button>
            {totalDrawn > 0 && (
              <button
                id="reset_cards_btn"
                onClick={handleReset}
                className="px-3 py-2 border border-gray-200 text-gray-600 rounded-xl text-xs hover:bg-gray-100 transition-all font-medium"
              >
                <RefreshCw size={12} />
              </button>
            )}
          </div>
        </div>

        {/* Live stats */}
        <div className="flex-1 flex flex-col text-right w-full">
          {drawnCard && !isDrawing && (
            <div className={`p-2.5 rounded-xl border mb-3 text-center ${
              drawnCard.val % 2 === 0 || drawnCard.suit === "אדום"
                ? "bg-green-50 border-green-100 text-green-800"
                : "bg-orange-50 border-orange-100 text-orange-850"
            }`}>
              <span className="text-xs">האם התנאי מתקיים? (קלף זוגי או אדום):</span>
              <strong className="text-sm block mt-0.5">
                {drawnCard.val % 2 === 0 || drawnCard.suit === "אדום" 
                  ? "✓ כן! הקלף עומד בתנאי (זוגי / אדום)" 
                  : "✗ לא! הקלף אינו זוגי ואינו אדום"}
              </strong>
            </div>
          )}

          <div className="bg-white p-3 rounded-xl border border-gray-200">
            <h5 className="text-[11px] font-bold text-gray-500 mb-2 border-b pb-1">סטטיסטיקת שליפה</h5>
            <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
              <div className="flex flex-col gap-1 ring-1 ring-gray-100 p-2 rounded-lg bg-gray-50/50">
                <span className="text-gray-400 text-[10px]">קלפים שנשלפו:</span>
                <span className="text-base text-gray-800">{totalDrawn}</span>
              </div>
              <div className="flex flex-col gap-1 ring-1 ring-gray-100 p-2 rounded-lg bg-gray-50/50">
                <span className="text-gray-400 text-[10px]">לשון התנאי (זוגי או אדום):</span>
                <span className="text-base text-green-600">{successfulDrawsCount}</span>
              </div>
              <div className="flex flex-col gap-1 ring-1 ring-gray-100 p-2 rounded-lg bg-gray-50/50">
                <span className="text-gray-400 text-[10px]">הסתברות ניסיונית:</span>
                <span className="text-sm text-blue-600">{experimentalProb.toFixed(1)}%</span>
              </div>
              <div className="flex flex-col gap-1 ring-1 ring-gray-100 p-2 rounded-lg bg-gray-50/50">
                <span className="text-gray-400 text-[10px]">הסתברות תיאורטית:</span>
                <span className="text-sm text-purple-600">{theoreticalProb.toFixed(1)}%</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Visual representation of grid of cards */}
      <div className="border-t border-gray-150 pt-4 text-right" dir="rtl">
        <span className="text-[11px] font-bold text-gray-500 block mb-2.5">הרכב חפיסת הקלפים (40 קלפים):</span>
        <div className="space-y-2">
          {data.suits.map((suit) => (
            <div key={suit.name} className="flex flex-col sm:flex-row sm:items-center gap-1 mb-1">
              <span className="text-[10px] font-bold w-14 text-gray-600 bg-gray-100 px-2 py-0.5 rounded border mb-1 sm:mb-0">
                {suit.name}
              </span>
              <div className="flex flex-wrap gap-1">
                {Array.from({ length: data.maxNumber }).map((_, i) => {
                  const val = i + 1;
                  const isMatch = val % 2 === 0 || suit.name === "אדום";
                  
                  // highlight if this is the active drawn card
                  const isActive = drawnCard && drawnCard.suit === suit.name && drawnCard.val === val && !isDrawing;
                  
                  let cardStyle = "bg-white border-slate-200 text-slate-500 hover:scale-105";
                  if (isMatch) {
                    cardStyle = "bg-green-50/50 border-green-200 text-slate-700";
                  }
                  if (isActive) {
                    cardStyle = "bg-blue-600 border-slate-900 text-white font-extrabold scale-110 shadow-md ring-2 ring-blue-300 z-10";
                  }

                  return (
                    <div
                      key={val}
                      title={`${suit.name} - קלף ${val} (${isMatch ? "מקיים תנאי" : "לא מקיים"})`}
                      className={`w-7 h-10 border rounded-md flex items-center justify-center text-[11px] font-bold transition-all select-none cursor-default ${cardStyle}`}
                    >
                      <span style={{ color: isActive ? "#ffffff" : (isActive ? "" : (suit.name === "אדום" && !isGrayscale ? "#EF4444" : "")) }}>
                        {val}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
