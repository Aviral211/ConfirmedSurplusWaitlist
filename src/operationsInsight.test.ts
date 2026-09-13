import assert from 'node:assert/strict';
import test from 'node:test';
import {buildOperationalEvidence, DEMO_HISTORY} from './operationsInsight';

test('application code calculates the exact demo-history evidence', () => {
  const result = buildOperationalEvidence(DEMO_HISTORY);
  assert.equal(result.status, 'sufficient');
  if (result.status !== 'sufficient') return;
  assert.deepEqual(result.facts, {
    comparableEvenings: 6,
    timingBoundary: '7:20 PM',
    laterEvenings: 3,
    laterWithUnclaimed: 3,
    earlierEvenings: 3,
    earlierWithUnclaimed: 0,
  });
  assert.equal(result.evidence, '3 of 3 demo Wednesdays confirmed after 7:20 PM ended with at least one unclaimed bag, compared with 0 of 3 confirmed by 7:20 PM.');
});

test('insufficient history produces no manufactured insight', () => {
  const result = buildOperationalEvidence(DEMO_HISTORY.slice(0, 3));
  assert.equal(result.status, 'insufficient');
  assert.match(result.evidence, /At least four comparable evenings/);
});
