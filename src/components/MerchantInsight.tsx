import {useState} from 'react';
import {Lightbulb} from 'lucide-react';
import type {MerchantInsightResponse} from '../operationsInsight';

export function MerchantInsight() {
  const [state, setState] = useState<'idle' | 'loading' | MerchantInsightResponse>('idle');

  const generate = async () => {
    setState('loading');
    try {
      const response = await fetch('/api/merchant-insight', {method: 'POST'});
      const body = await response.json() as MerchantInsightResponse;
      if (!body || !('status' in body)) throw new Error('Invalid response');
      setState(body);
    } catch {
      setState({
        status: 'unavailable',
        datasetLabel: 'Demo history',
        evidence: 'Completed history could not be loaded.',
        message: 'AI interpretation is unavailable right now. Completed results are unaffected.',
      });
    }
  };

  return <section className="merchant-insight" aria-labelledby="insight-title">
    <div className="insight-heading">
      <Lightbulb size={19}/>
      <div>
        <p className="eyebrow">Completed history</p>
        <h2 id="insight-title">Operations insight</h2>
      </div>
      <span>AI-assisted</span>
    </div>

    {state === 'idle' && <>
      <p className="insight-intro">Review completed demo evenings for one cautious operational experiment.</p>
      <button className="secondary" onClick={generate}>Review demo history</button>
    </>}

    {state === 'loading' && <p className="insight-state" role="status">Reviewing completed history…</p>}

    {typeof state === 'object' && state.status === 'ready' && <div className="insight-content" aria-live="polite">
      <small>{state.datasetLabel}</small>
      <div className="insight-interpretation"><strong>Observation</strong><p>{state.observation}</p></div>
      <div className="insight-evidence-row"><strong>Evidence</strong><p>{state.evidence}</p></div>
      <div className="insight-interpretation"><strong>Suggested experiment</strong><p>{state.experiment}</p></div>
    </div>}

    {typeof state === 'object' && state.status !== 'ready' && <div className="insight-content insight-unavailable" role="status">
      <small>{state.datasetLabel}</small>
      <strong>{state.status === 'insufficient' ? 'Not enough comparable history yet.' : 'Insight unavailable.'}</strong>
      <p>{state.message}</p>
      <p className="insight-evidence">{state.evidence}</p>
      <button className="text-button" onClick={generate}>Try again</button>
    </div>}
  </section>;
}
