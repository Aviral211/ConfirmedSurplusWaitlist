import {useState, type FormEvent} from 'react';
import {Check, Minus, Plus, ArrowRight, PackageCheck, ArrowRightLeft} from 'lucide-react';
import {Action, Bag, Night, bagLabel, countdown, dateLabel, LAST_OFFER, PICKUP, stats, timeLabel, waiting} from '../model';
import {MerchantInsight} from './MerchantInsight';

export function Merchant({night:n,act}:{night:Night;act:(a:Action)=>void}) {
  const s=stats(n);
  const collecting=n.phase==='collecting';
  const closed=n.phase==='closed';
  const title=collecting?'Count what’s actually left.':closed?'Every bag, accounted for.':s.held>0?'Confirmed. Offers are moving.':s.reserved>0?(n.now<PICKUP?'Reserved. Pickup opens at 7:30.':'Reserved. Ready for pickup.'):s.picked===n.confirmed?'Every bag collected.':n.now>LAST_OFFER?'New offers have ended.':'No guests left to offer.';
  const description=collecting?'One count, one confirmation. We’ll handle offers and reassignment.':closed?'What was counted, claimed, and collected tonight.':s.held>0?'Five-minute offers. Unanswered or declined bags move to the next eligible guest.':s.reserved>0?'Allocation is complete. Verify each pickup when the guest arrives.':s.picked===n.confirmed?'No pickups remain. Tonight’s final results will settle at 8:00 PM.':n.now>LAST_OFFER?'Unallocated bags stay with the store. Existing reservations can still be collected.':'The waitlist is exhausted. Unclaimed bags remain with the store.';
  return <section className={`merchant-layout ${closed?'is-closed':''}`}>
    <div className="store-context"><span>Sunrise Bakery <small>· Bellevue</small></span><small>{dateLabel(n.day)} · Demo evening</small></div>
    <div className="merchant-heading state-enter" key={n.phase}><p className="eyebrow">{collecting?'Action required · Physical count':closed?'Tonight’s results':s.held?'Automatic allocation':s.reserved?'Next · Verify pickups':'Allocation complete'}</p><h1 tabIndex={-1}>{title}</h1><p className="intro">{description}</p></div>
    {collecting?<>
      <div className="count-layout"><div className="count-workspace"><h2>How many bags are packed and ready?</h2><div className="quantity-control"><button aria-label="Decrease bag count" disabled={n.quantity===0} onClick={()=>act({type:'QUANTITY',value:n.quantity-1})}><Minus/></button><output aria-live="polite" aria-label="Bag quantity"><span className="quantity-enter" key={n.quantity}>{n.quantity}</span></output><button aria-label="Increase bag count" disabled={n.quantity===12} onClick={()=>act({type:'QUANTITY',value:n.quantity+1})}><Plus/></button></div><p className="count-details">$5 per bag · Pickup 7:30–8:00 PM</p><button className="primary" onClick={()=>act({type:'CONFIRM'})}>{n.quantity===0?'Confirm no surplus':`Confirm ${n.quantity} ${n.quantity===1?'bag':'bags'}`}<ArrowRight size={19}/></button><small className="button-note">Confirm only the surplus you’ve physically counted.</small>{n.now>LAST_OFFER&&<p className="caution">New offers stopped at 7:45 PM. You can record this count, but these bags cannot be allocated tonight.</p>}</div>
      <aside className="tonight-aside"><h2>Interest before inventory.</h2><div className="fact-row"><strong>{waiting(n).length}</strong><span>people waiting</span></div><div className="fact-row"><strong>0</strong><span>bags promised</span></div><p>No early inventory guess. After this confirmation, the software sends offers only for bags that exist.</p><p className="staff-note">You still pack the bags and verify each handover.</p></aside></div>
      <ol className="merchant-steps"><li><strong>01</strong><span>Count & confirm</span></li><li><strong>02</strong><span>Automatic offers & reassignment</span></li><li><strong>03</strong><span>Verify pickups</span></li></ol>
    </>:<>
      <div className="merchant-impact"><div><Check size={18}/><strong>{n.confirmations} inventory confirmation</strong><span>No manual reassignment</span></div><small>{n.pickups} pickup {n.pickups===1?'checkoff':'checkoffs'} · Staff count, pack, and hand over</small></div>
      {closed?<><Results night={n}/><MerchantInsight/></>:<div className="live-summary" aria-label="Live inventory totals"><Metric value={n.confirmed??0} label="confirmed" tone="brand"/><Metric value={s.held} label="live offers" tone="live"/><Metric value={s.reserved} label="reserved" tone="reserved"/><Metric value={s.picked} label="collected" tone="success"/><Metric value={`$${s.revenue}`} label="received at pickup" tone="success"/></div>}
      {!closed&&s.available>0&&<p className="honest-note"><strong>{s.available} {s.available===1?'bag':'bags'} unallocated.</strong> {n.now>LAST_OFFER?'Too little pickup time for another offer.':waiting(n).length===0?'No eligible guests remain. Distribution can’t create demand.':'Waiting for an eligible guest.'}</p>}
      <div className="operations-grid"><section aria-label="Confirmed bag inventory"><div className="section-title"><h2>{closed?'Bag outcomes':'Tonight’s bags'}</h2><span>{closed?'Physical inventory, final status':'Offer → reserve → collect'}</span></div><div className="bag-list">{n.bags.length===0?<p className="empty-state">No surplus. No offers sent or commitments made.</p>:n.bags.map(b=><BagRow key={b.id} bag={b} night={n}/>)}</div></section>
      {!closed&&<aside className="pickup-workspace">{s.claimed>0?<Pickup night={n} act={act}/>:<div className="automation-note"><PackageCheck size={24}/><h2>{s.held?'No action needed.':'No pickups pending.'}</h2><p>{s.held?'Offers are out. The software handles responses and reassignment. Return when guests arrive.':'Unclaimed bags stay with the store. Results settle at 8:00 PM.'}</p></div>}</aside>}
      </div>
      <Activity night={n}/>
      {closed&&<button className="secondary next-night" onClick={()=>act({type:'NEXT_NIGHT'})}>Start the next evening <ArrowRight size={18}/></button>}
    </>}
  </section>;
}

function Metric({value,label,tone='neutral'}:{value:string|number;label:string;tone?:'neutral'|'brand'|'live'|'reserved'|'success'|'warning'}) {
  return <div className={`metric metric-${tone}`}><strong key={value} className="metric-enter">{value}</strong><span>{label}</span></div>;
}
function BagRow({bag:b,night:n}:{bag:Bag;night:Night}) {
  const g=n.guests.find(g=>g.id===b.guest);
  const status=b.status==='remaining'?(g?.status==='no-show'?'No-show':'Unclaimed'):b.status==='picked-up'?'Collected':b.status==='reserved'?'Reserved':b.status==='offered'?'Offer pending':'Unallocated';
  const step=b.status==='picked-up'?3:b.status==='reserved'?2:b.status==='offered'?1:0;
  return <div className={`bag-row ${b.status} ${g?.status==='no-show'?'no-show':''} ${b.previous?'reassigned':''}`}>
    <span className="bag-number">{String(b.id).padStart(2,'0')}</span>
    <div className="bag-change" key={`${b.status}-${b.guest}`}>
      <div className="bag-recipient"><strong>{bagLabel(b.id)}</strong><span>{g?(g.id==='alex'?'Alex · demo consumer':g.label):'With the store'}</span>
        {b.previous&&<small className="bag-transfer"><ArrowRightLeft size={13}/>{b.previous.label} {b.previous.reason==='expired'?'offer expired':'declined'}{g?` → ${g.id==='alex'?'Alex':g.label}`:' → no next guest'}</small>}
      </div>
      <div className={`bag-status ${b.status}`}><strong>{status}</strong>{b.status==='offered'?<small>{countdown(g!.deadline!-n.now)} to respond</small>:<small>{b.status==='picked-up'?'$5 received':b.status==='reserved'?'$5 due at pickup':b.status==='remaining'?'No payment':'No reservation'}</small>}<div className="bag-progress" aria-hidden="true">{[1,2,3].map(i=><i key={i} className={step>=i?'done':''}/>)}</div></div>
    </div>
  </div>;
}
function Pickup({night:n,act}:{night:Night;act:(a:Action)=>void}) {
  const [code,setCode]=useState('');
  const complete=stats(n).reserved===0;
  const [editing,setEditing]=useState(false);
  const verify=(e:FormEvent)=>{e.preventDefault();act({type:'VERIFY_CODE',code});setCode('');setEditing(false);};
  return <form className="pickup-form" onSubmit={verify}><p className="eyebrow">{complete?'All pickups complete':n.now<PICKUP?'Next action · From 7:30 PM':'Action required · At handover'}</p><label htmlFor="pickup-code">{complete?'Check a pickup code':'Verify a pickup'}</label><p>{complete?'No handovers remain. Check a code to confirm a previous pickup.':'Match the code, hand over the bag, and collect $5.'}</p><div><input id="pickup-code" value={code} onChange={e=>{setCode(e.target.value.replace(/\D/g,'').slice(0,4));setEditing(true);}} placeholder="4-digit code" inputMode="numeric" autoComplete="off" pattern="[0-9]{4}" required maxLength={4}/><button className="primary" type="submit" disabled={n.now<PICKUP}>{complete?'Check code':'Mark collected'}</button></div>{n.now<PICKUP&&<small>Pickup opens at 7:30 PM.</small>}<div role="status" className={`pickup-feedback ${!editing&&n.pickupResult?.ok?'success':''}`} key={n.pickupResult?.sequence}>{!editing&&n.pickupResult?.text}</div><small>Reservations are unpaid until pickup is recorded.</small></form>;
}
function Activity({night:n}:{night:Night}) {
  const latest=n.events.at(-1);
  return <details className="activity"><summary><span>Activity · {n.events.length} events</span>{latest&&<span className="activity-preview">{timeLabel(latest.time)} · {latest.text}</span>}</summary><ol>{n.events.slice().reverse().map(e=><li key={e.id}><time>{timeLabel(e.time)}</time><p>{e.text}</p></li>)}</ol></details>;
}
function Results({night:n}:{night:Night}) {
  const s=stats(n);
  return <section className="results" aria-label="Tonight’s demo results"><div className="result-head"><div><p>Received at pickup · Demo</p><strong className="revenue metric-enter">${s.revenue}</strong><p>{s.picked} completed {s.picked===1?'pickup':'pickups'} × $5. Reservations alone earn nothing.</p></div><div className="sell-through"><strong>{n.confirmed?`${s.sellThrough}%`:'—'}</strong><p>Confirmed-surplus sell-through</p><small>Collected ÷ confirmed bags</small></div></div><div className="outcome-strip" aria-hidden="true">{n.bags.map(b=>{const guest=n.guests.find(g=>g.id===b.guest);return <span key={b.id} className={b.status==='picked-up'?'collected':guest?.status==='no-show'?'missed':'remaining'}/>})}</div><div className="result-counts"><Metric value={n.confirmed??0} label="confirmed" tone="brand"/><Metric value={s.claimed} label="claimed" tone="reserved"/><Metric value={s.picked} label="collected" tone="success"/><Metric value={s.noShows} label="no-shows" tone={s.noShows?'warning':'neutral'}/><Metric value={s.remaining} label="remaining" tone={s.remaining?'warning':'neutral'}/></div><p className="result-note">{s.remaining>0?`${s.remaining} ${s.remaining===1?'bag remains':'bags remain'} with the store, including ${s.noShows} ${s.noShows===1?'no-show':'no-shows'}. No pickup, no revenue.`:n.confirmed===0?'No surplus tonight. Guests who waited without an offer earn a priority credit.':'Every confirmed bag was collected.'}</p></section>;
}


