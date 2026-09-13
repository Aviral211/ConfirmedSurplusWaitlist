import {GoogleGenAI} from '@google/genai';
import {buildOperationalEvidence, DEMO_HISTORY, type MerchantInsightResponse} from '../src/operationsInsight';

export const GEMINI_MODEL = 'gemini-3.1-flash-lite';

const responseSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    observation: {
      type: 'string',
      maxLength: 180,
      description: 'A cautious interpretation without numbers, causation, certainty, or prediction.',
    },
    experiment: {
      type: 'string',
      maxLength: 180,
      description: 'One small, reversible operational experiment without changing inventory or allocation decisions.',
    },
  },
  required: ['observation', 'experiment'],
} as const;

const forbidden = /\d|%|\$|\b(caus(?:e|es|ed|al)|predict(?:s|ed|ion)?|optimal|guarantee(?:s|d)?|certain(?:ly)?|should)\b/i;

function validInterpretation(value: unknown): value is {observation: string; experiment: string} {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.observation === 'string' &&
    typeof candidate.experiment === 'string' &&
    candidate.observation.length > 20 &&
    candidate.observation.length <= 180 &&
    candidate.experiment.length > 20 &&
    candidate.experiment.length <= 180 &&
    !forbidden.test(candidate.observation) &&
    !forbidden.test(candidate.experiment)
  );
}

export async function createMerchantInsight(apiKey = process.env.GEMINI_API_KEY): Promise<{statusCode: number; body: MerchantInsightResponse}> {
  const grounding = buildOperationalEvidence(DEMO_HISTORY);
  if (grounding.status === 'insufficient') {
    return {
      statusCode: 200,
      body: {...grounding, message: 'Keep collecting completed evenings before asking for an interpretation.'},
    };
  }

  if (!apiKey) {
    return {
      statusCode: 503,
      body: {
        status: 'unavailable',
        datasetLabel: grounding.datasetLabel,
        evidence: grounding.evidence,
        message: 'AI interpretation is unavailable right now. Completed results are unaffected.',
      },
    };
  }

  try {
    const ai = new GoogleGenAI({apiKey});
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: JSON.stringify(grounding.facts),
      config: {
        systemInstruction: [
          'You help a bakery merchant interpret completed operating history.',
          'Application code has already calculated the supplied facts. Do not add, repeat, estimate, or transform any number or business metric.',
          'Return one cautious observation and one small, reversible experiment.',
          'Use language such as may, might, coincided, consider, or test. Do not claim causation, certainty, prediction, or an optimal action.',
          'Do not recommend how many bags to confirm. Do not change inventory confirmation, allocation, fairness, priority, pricing, reservations, pickup, or revenue.',
          'The only appropriate experiment here concerns when staff perform their physical count.',
        ].join(' '),
        responseMimeType: 'application/json',
        responseJsonSchema: responseSchema,
        maxOutputTokens: 160,
        temperature: 0.2,
      },
    });
    const interpretation = JSON.parse(response.text ?? 'null') as unknown;
    if (!validInterpretation(interpretation)) throw new Error('Invalid Gemini response');

    return {
      statusCode: 200,
      body: {
        status: 'ready',
        datasetLabel: grounding.datasetLabel,
        observation: interpretation.observation.trim(),
        evidence: grounding.evidence,
        experiment: interpretation.experiment.trim(),
        model: GEMINI_MODEL,
      },
    };
  } catch {
    return {
      statusCode: 502,
      body: {
        status: 'unavailable',
        datasetLabel: grounding.datasetLabel,
        evidence: grounding.evidence,
        message: 'AI interpretation is unavailable right now. Completed results are unaffected.',
      },
    };
  }
}
