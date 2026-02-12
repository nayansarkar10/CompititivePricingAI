export interface PricingItem {
  company: string;
  brand: string;
  usp: string;
  specs: string;
  price: number;
  currency: string;
  link: string; // Added link for verification
}

export interface AnalysisResult {
  report: string;
  data: PricingItem[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
  isLoading?: boolean;
}

export enum AppState {
  LANDING = 'LANDING',
  ANALYZING = 'ANALYZING',
  RESULTS = 'RESULTS',
}
