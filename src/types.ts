export type PrintStyle = 'hybrid' | 'blue' | 'academic' | 'grayscale';

export interface SpinnerData {
  sectors: { color: string; label: string; fraction: number; weight: number }[];
}

export interface UrnData {
  balls: { color: string; label: string; count: number }[];
}

export interface DiceData {
  targetSum: number;
}

export interface CardsData {
  suits: { color: string; name: string }[];
  maxNumber: number;
}

export interface TreeData {
  step1: { optionA: string; probA: number; optionB: string; probB: number };
  step2A: { optionC: string; probC: number; optionD: string; probD: number };
  step2B: { optionC: string; probC: number; optionD: string; probD: number };
}

export interface ComplementaryData {
  eventProb: number;
}

export interface BarChartData {
  grades: { grade: number; students: number }[];
}

export interface GeometricData {
  innerRadius: number;
  middleRadius: number;
  outerRadius: number;
}

export type QuestionData =
  | SpinnerData
  | UrnData
  | DiceData
  | CardsData
  | TreeData
  | ComplementaryData
  | BarChartData
  | GeometricData;

export interface Question {
  id: number;
  title: string;
  text: string;
  type: 'spinner' | 'urn' | 'dice' | 'cards' | 'tree' | 'complementary' | 'barchart' | 'geometric';
  data: QuestionData;
  answer: string;
  solution: string;
}
