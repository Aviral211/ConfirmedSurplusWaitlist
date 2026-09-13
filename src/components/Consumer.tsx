import {ArrowRight, Check, Clock3, MapPin, PackageCheck, Sprout} from 'lucide-react';
import {Action, Night, bagLabel, consumerRank, countdown, currentGuest, LAST_OFFER, PICKUP, SELF, waiting} from '../model';

export function Consumer({night:n,act,onDemo}:{night:Night;act:(a:Action)=>void;onDemo:()=>void}) {
  const me=currentGuest(n);
  const joined=!!me&&me.status!=='left';
  const offer=me?.status==='offered';
  const reserved=me?.status==='reserved';
  const picked=me?.status==='picked-up';
  const isWaiting=me?.status==='waiting';
  const compact=joined&&!isWaiting||n.phase==='closed';
  const credit=n.history[SELF]??0;
  const showFairness=n.phase==='collecting'||me?.status==='unserved';
  const bag=n.bags.find(b=>b.id===me?.bag);
  let title='Good things, still to come.';
  let description='Join Sunrise’s waitlist. If there’s surplus at closing, you may receive a timed offer.';
  if(isWaiting){title='You’re on the list.';description=n.phase==='collecting'?'The bakery counts what’s left near closing. Your place is saved; no bag is promised.':n.now>LAST_OFFER?'New offers have ended for tonight. We’ll close your wait at 8:00 PM.':'You’re waiting for a released bag. Offers follow the same priority order.';}
  if(offer){title='Your bag is available.';description='Counted, packed, and held for you. Accept before the timer ends.';}
  if(reserved){title=n.now<PICKUP?'Your bag is reserved.':'Your pickup is ready.';description='Show your code at Sunrise Bakery. Pay $5 when you collect.';}
  if(picked){title='Collected. Enjoy your evening.';description='Your bag is picked up and your $5 payment is recorded in this demo.';}
  if(me?.status==='declined'){title='You released your offer.';description='Nothing charged. You can join the waitlist again another evening.';}
  if(me?.status==='expired'){title='Your offer has expired.';description='The five-minute hold ended. Nothing charged; no reservation was made.';}
  if(me?.status==='no-show'){title='The pickup window closed.';description='Your bag wasn’t collected. It remains with Sunrise; no payment was taken.';}
  if(me?.status==='unserved'||(!joined&&n.phase==='closed')){title=n.confirmed===0?'No surplus tonight.':'Tonight’s waitlist is closed.';description=n.confirmed===0?'The bakery counted no leftover bags. No offers or reservations were made.':'Pickup has ended. Some evenings there aren’t enough bags for everyone.';}
  if(!joined&&n.phase==='allocating'){title='Tonight’s list is closed.';description='Surplus has been counted. Join a future evening before the count.';}
  return <section className={`consumer-layout ${compact?'compact':''} ${joined?'has-status':''} consumer-state-${me?.status??n.phase}`} aria-label="Sunrise Bakery waitlist">
    <aside className="bakery-story">
      {!compact&&<figure className="bakery-photo"><img src="/bakery.png" width="1448" height="1086" alt="Golden croissants and rustic bread on a bakery counter"/><figcaption>A little of today, for your evening. <span>Illustrative photo</span></figcaption></figure>}
      <div className="store-details"><p className="eyebrow">Your store tonight</p><h2>Sunrise Bakery</h2><p className="store-address"><MapPin size={16}/>10400 NE 4th St, Bellevue</p>
        {compact?<><p className="store-window">Pickup · 7:30–8:00 PM</p>{offer&&<details className="food-details"><summary>Contents & allergens</summary><p>A surprise mix of today’s baking. May contain wheat, milk, eggs, nuts, or other allergens. Ask the bakery before accepting if you have a dietary restriction.</p></details>}</>:<p className="food-note">A surprise mix of today’s baking. Contents vary; may contain wheat, milk, eggs, nuts, or other allergens. Ask the bakery before accepting if you have a dietary restriction.</p>}
      </div>
      {compact&&me?.bag&&<div className="bag-journey"><PackageCheck size={22}/><strong>{bagLabel(me.bag)}</strong><span>{picked?'Counted → reserved → collected':reserved?'Counted → offered → reserved':'Confirmed physical inventory'}</span></div>}
    </aside>
    <div className={`consumer-content ${offer?'offer-active':''}`}>
      <div className="state-heading state-enter" key={me?.status??n.phase}>
        {offer&&<p className="eyebrow offer-label"><span className="status-dot"/>Your offer · {bagLabel(me.bag!)}</p>}
        <h1 tabIndex={-1}>{title}</h1><p className="intro">{description}</p>
      </div>
      {!reserved&&!picked&&<div className="decision-facts"><span><strong>$5</strong> / bag</span><span>Pickup <strong>7:30–8:00 PM</strong></span></div>}
      {!joined&&n.phase==='collecting'&&<div className="action-section"><h3>Nothing promised. Nothing charged.</h3><p>Offers begin only after actual surplus is confirmed.</p><button className="primary" onClick={()=>act({type:'JOIN'})}>Join tonight’s waitlist <ArrowRight size={20}/></button><small className="button-note">Free to join · One bag per person · Pay at pickup</small></div>}
      {isWaiting&&<div className="action-section">
        <div className="queue-position"><span className="serif-number">{consumerRank(n)}</span><div><h3>Your place tonight</h3><p>{waiting(n).length} people waiting · priority-adjusted order</p></div></div>
        <p className="status-line"><span className="status-dot"/>{n.phase==='collecting'?'Waiting for the bakery’s count':n.now>LAST_OFFER?'New offers ended at 7:45 PM':'Waiting for a bag to be released'}</p>
        <small>A place in line doesn’t guarantee a bag.</small>
        {n.phase==='collecting'&&<><button className="text-button leave-button" onClick={()=>act({type:'LEAVE'})}>Leave tonight’s waitlist</button><p className="demo-hint">Trying the demo? <button onClick={onDemo}>Move to the closing count <ArrowRight size={14}/></button></p></>}
      </div>}
      {offer&&<div className="action-section offer-decision state-enter" key={`offer-${me.bag}`}>
        <div className="offer-clock"><span><Clock3 size={18}/>Time to accept</span><strong role="timer" aria-label="Time remaining">{countdown(me.deadline!-n.now)}</strong></div>
        <div className="timer-track" aria-hidden="true"><span style={{width:`${Math.max(0,(me.deadline!-n.now)/300*100)}%`}}/></div>
        <button className="primary" onClick={()=>act({type:'ACCEPT',id:SELF})}>Accept & reserve <ArrowRight size={20}/></button>
        <small className="button-note">$5 due at pickup · No online payment</small><button className="text-button decline-button" onClick={()=>act({type:'DECLINE',id:SELF})}>Decline and release this bag</button>
      </div>}
      {reserved&&<div className="pickup-ticket ticket-enter"><div className="ticket-top"><span><Check size={18}/>Reservation confirmed</span><span>{bagLabel(me.bag!)}</span></div><p className="pickup-code" aria-label={`Pickup code ${me.code}`}>{me.code}</p><p>Show this code at the counter</p><div className="ticket-bottom"><strong>$5 due at pickup</strong><span>7:30–8:00 PM tonight</span></div><p className="ticket-deadline">Collect by 8:00 PM. Uncollected bags remain unpaid.</p></div>}
      {picked&&<div className="completion ticket-enter"><Check size={28}/><h3>{bagLabel(me.bag!)} · Collected & paid</h3><p>$5 received at pickup · Demo transaction</p></div>}
      {(me?.status==='expired'||me?.status==='declined')&&<div className="release-note state-enter"><PackageCheck size={22}/><div><h3>{bagLabel(me.bag!)} released.</h3><p>{bag?.guest&&bag.guest!==SELF?bag.status==='picked-up'?'The same bag was offered to another guest and collected.':bag.status==='remaining'?'The bag was offered again but remained uncollected.':'The same bag has moved to another guest.':n.now>LAST_OFFER?'There is too little pickup time to offer it again. It remains with the bakery.':'No eligible guests remain. The bag stays with the bakery.'}</p></div></div>}
      {me?.offeredOnce&&!isWaiting&&!offer&&!reserved&&!picked&&<p className="credit-note">Priority credits reset when an offer arrives. No additional credit is earned for declining, expiry, or a missed pickup.</p>}
      {showFairness&&<div className="fairness"><Sprout size={24}/><div><h3>{me?.status==='unserved'?`${credit} ${credit===1?'credit':'credits'} for next time`:credit>0?`Priority boost · ${credit} previous waits`:'A fairer place in line'}</h3><p>{me?.status==='unserved'?'You waited without receiving an offer. Your next evening gets a priority boost, with no guarantee of a bag.':credit>0?'Previous nights without an offer give you a little more priority.':'Complete an evening without an offer to earn a priority credit.'}</p><details><summary>How priority works</summary><p>Each completed night without an offer moves your effective join time 30 minutes earlier, up to 90 minutes. Earlier effective time goes first; ties go to the earlier actual join, then a stable guest ID.</p><p>Credits reset on receiving an offer. Leaving, declining, expiration, and missed pickup earn no extra credit. Existing offers never get displaced. This is a proposed demo policy.</p></details></div></div>}
      {n.phase==='closed'&&<button className="secondary next-night" onClick={()=>act({type:'NEXT_NIGHT'})}>See the next evening <ArrowRight size={18}/></button>}
      {!joined&&n.phase==='collecting'&&<ol className="flow-strip"><li><span>1</span>Join with<br/>no commitment</li><li><span>2</span>Store confirms<br/>actual bags</li><li><span>3</span>Accept, then<br/>collect</li></ol>}
    </div>
  </section>;
}

