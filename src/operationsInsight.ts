export interface HistoricalEvening {
  date: string;
  weekday: 'Wednesday';
  confirmedAtMinute: number;
  confirmedBags: number;
  collectedBags: number;
}

export interface OperationalEvidence {
  status: 'sufficient';
  datasetLabel: string;
  evidence: string;
  facts: {
    comparableEvenings: number;
    timingBoundary: string;
    laterEvenings: number;
    laterWithUnclaimed: number;
    earlierEvenings: number;
    earlierWithUnclaimed: number;
  };
}

export interface InsufficientEvidence {
  status: 'insufficient';
  datasetLabel: string;
  evidence: string;
}

export type EvidenceResult = OperationalEvidence | InsufficientEvidence;

export type MerchantInsightResponse =
  | {
      status: 'ready';
      datasetLabel: string;
      observation: string;
      evidence: string;
      experiment: string;
      model: string;
    }
  | {
      status: 'insufficient' | 'unavailable';
      datasetLabel: string;
      evidence: string;
      message: string;
    };

export const DEMO_HISTORY: readonly HistoricalEvening[] = [
  {date: '2026-07-29', weekday: 'Wednesday', confirmedAtMinute: 19 * 60 + 12, confirmedBags: 3, collectedBags: 3},
  {date: '2026-08-05', weekday: 'Wednesday', confirmedAtMinute: 19 * 60 + 14, confirmedBags: 4, collectedBags: 4},
  {date: '2026-08-12', weekday: 'Wednesday', confirmedAtMinute: 19 * 60 + 18, confirmedBags: 3, collectedBags: 3},
  {date: '2026-08-19', weekday: 'Wednesday', confirmedAtMinute: 19 * 60 + 21, confirmedBags: 4, collectedBags: 3},
  {date: '2026-08-26', weekday: 'Wednesday', confirmedAtMinute: 19 * 60 + 24, confirmedBags: 3, collectedBags: 2},
  {date: '2026-09-02', weekday: 'Wednesday', confirmedAtMinute: 19 * 60 + 28, confirmedBags: 5, collectedBags: 3},
] as const;

const TIMING_BOUNDARY = 19 * 60 + 20;

export function buildOperationalEvidence(history: readonly HistoricalEvening[]): EvidenceResult {
  const relevant = history.filter(evening => evening.weekday === 'Wednesday' && evening.confirmedBags > 0);
  const label = 'Demo history · ' + relevant.length + ' completed Wednesday ' + (relevant.length === 1 ? 'evening' : 'evenings');
  const earlier = relevant.filter(evening => evening.confirmedAtMinute <= TIMING_BOUNDARY);
  const later = relevant.filter(evening => evening.confirmedAtMinute > TIMING_BOUNDARY);

  if (relevant.length < 4 || earlier.length < 2 || later.length < 2) {
    return {
      status: 'insufficient',
      datasetLabel: label,
      evidence: 'At least four comparable evenings, with observations on both sides of 7:20 PM, are needed.',
    };
  }

  const hasUnclaimed = (evening: HistoricalEvening) => evening.collectedBags < evening.confirmedBags;
  const laterWithUnclaimed = later.filter(hasUnclaimed).length;
  const earlierWithUnclaimed = earlier.filter(hasUnclaimed).length;

  return {
    status: 'sufficient',
    datasetLabel: label,
    evidence: laterWithUnclaimed + ' of ' + later.length + ' demo Wednesdays confirmed after 7:20 PM ended with at least one unclaimed bag, compared with ' + earlierWithUnclaimed + ' of ' + earlier.length + ' confirmed by 7:20 PM.',
    facts: {
      comparableEvenings: relevant.length,
      timingBoundary: '7:20 PM',
      laterEvenings: later.length,
      laterWithUnclaimed,
      earlierEvenings: earlier.length,
      earlierWithUnclaimed,
    },
  };
}
