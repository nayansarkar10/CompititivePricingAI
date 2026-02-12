export interface PricingItem {
  company: string;
  brand: string;
  usp: string;
  specs: string;
  price: number;
  currency: string;
  link: string;
  isBestDeal?: boolean; // For highlighting
}

export interface AnalysisResult {
  report: string;
  data: PricingItem[];
}

export interface Question {
  id: string;
  text: string;
  options: string[];
}

export interface RefinementData {
  originalQuery: string;
  answers: Record<string, string>;
}

export enum AppState {
  LAYER1_LANDING = 'LANDING',
  LAYER2_QUESTIONS = 'QUESTIONS',
  LAYER3_PROCESSING = 'PROCESSING',
  LAYER4_RESULTS = 'RESULTS',
}

export type AgentStage = 'gathering' | 'analysis' | 'positioning' | 'intelligence' | 'finalizing';

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isLoading?: boolean;
}