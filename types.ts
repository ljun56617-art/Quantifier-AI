export enum AnalysisStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export interface ProfessionalismScore {
  terminology: number;
  logic: number;
  density: number;
}

export interface AccuracyResult {
  chainOfThought: string;
  isCorrect: boolean;
  firstErrorStep: string | null;
}

export interface ReadabilityResult {
  tone: string;
  vocabularyLevel: string;
  analysis: string;
}

export interface GroupAnalysis {
  professionalism: ProfessionalismScore;
  accuracy: AccuracyResult;
  readability: ReadabilityResult;
}

export interface QuantifierResponse {
  groupA: GroupAnalysis;
  groupB: GroupAnalysis;
}