import {ArrowRight, Check, Clock3, MapPin, Sprout} from 'lucide-react';
import {Action, Night, consumerRank, countdown, currentGuest, LAST_OFFER, SELF, stats, waiting} from '../model';

export function Consumer({night:n,act}:{night:Night;act:(a:Action)=>void}) {
  const me=currentGuest(n);const s=stats(n);const joined=me&&me.status!=='left';
  const credit=me?.boost??n.history[SELF]??0;
  const offer=me?.status==='offered';
  const reserved=me?.status==='reserved';
  const picked=me?.status==='picked-up';
  const terminal=['expired','declined','unserved','no-show'].includes(me?.status??'');
  let title='Good things, still to come.';
  let description='Join tonight’s waitlist. If there’s surplus at closing, you may receive a timed offer.';
  if(joined&&me.status==='waiting'){title=n.phase==='collecting'?'You’re on the list.':'You’re still in line.';description=n.phase==='collecting'?'The bakery will count what’s left near closing. We’ll keep your place until then.':'All available bags are held for other guests. You may receive an offer if one is released.';}
  if(offer){title='A little good fortune.';description='The bakery has counted and packed a bag for you. Accept before your offer expires.';}
  if(reserved){title='Yours for the evening.';description='One bag reserved. Show your code at the counter during the pickup window.';}
  if(picked){title='A lovely way to end today.';description='Your pickup is complete. Thank you for giving today’s baking a home.';}
  if(me?.status==='declined'){title='Passed on, with care.';description='You released your offer. You won’t receive another tonight, and nothing was charged.';}
  if(me?.status==='expired'){title='Your offer has expired.';description='Your five-minute hold ended. Nothing was charged. You can join again another evening.';}
  if(me?.status==='no-show'){title='The pickup window closed.';description='Your reserved bag wasn’t collected. It remains with the bakery; no payment was taken.';}
  if(me?.status==='unserved'||(!joined&&n.phase==='closed')){title=n.confirmed===0?'No surplus tonight.':'That’s tonight wrapped.';description=n.confirmed===0?'Everything found a home today. The bakery confirmed there are no leftover bags.':'Tonight’s pickup window has closed. Some evenings there simply aren’t enough bags for everyone.';}
  if(!joined&&n.phase==='allocating'){title='Tonight’s list is closed.';description='The bakery has confirmed its surplus and offers are underway. Join a future evening before the count.';}
  return <section className={`consumer-layout ${joined?'has-status':''}`} aria-label="Sunrise Bakery tonight">
    <div className="bakery-story">
      <figure className="bakery-photo"><img src="/bakery.png" width="1448" height="1086" alt="Golden croissants and rustic bread on a bakery counter"/><figcaption>A little of today, for your evening. <span>Illustrative photo</span></figcaption></figure>
      <div className="store-details"><h2>Sunrise Bakery</h2><p><MapPin size={16}/>10400 NE 4th St, Bellevue</p><p className="food-note">A surprise mix of today’s baking. Contents vary; may contain wheat, milk, eggs, nuts, or other allergens. Ask the bakery before accepting if you have a dietary restriction.</p></div>
    </div>
    <div className="consumer-content">
      <div className="state-heading" aria-live="polite" aria-atomic="true"><h1 tabIndex={-1}>{title}</h1><p className="intro">{description}</p></div>
      <div className="decision-facts"><span><strong>$5</strong> / bag</span><span>Pickup <strong>7:30–8:00 PM</strong></span></div>
      {!joined&&n.phase==='collecting'&&<div className="action-section"><h3>Nothing promised. Nothing charged.</h3><p>We only offer bags after the bakery counts what’s left.</p><button className="primary" onClick={()=>act({type:'JOIN'})}>Join tonight’s waitlist <ArrowRight size={20}/></button><small className="button-note">No payment to join · One bag per person</small></div>}
      {me?.status==='waiting'&&<div className="action-section">
        <div className="queue-position"><span className="serif-number">{consumerRank(n)}</span><div><h3>{n.phase==='collecting'?'Your place tonight':'For the next available bag'}</h3><p>{waiting(n).length} people waiting · priority-adjusted order</p></div></div>
        <p className="status-line"><span className="status-dot"/>{n.phase==='collecting'?'Waiting for the bakery’s count':n.now>LAST_OFFER?'Too little pickup time for new offers':'Waiting for a bag to be released'}</p>
        <small>No reservation yet. A place in line doesn’t guarantee a bag.</small>
        {n.phase==='collecting'&&<button className="text-button leave-button" onClick={()=>act({type:'LEAVE'})}>Leave tonight’s waitlist</button>}
      </div>}
      {offer&&<div className="action-section">
        <div className="offer-clock"><span><Clock3 size={18}/>Your offer ends in</span><strong role="timer" aria-label="Time remaining">{countdown(me.deadline!-n.now)}</strong></div>
        <div className="timer-track" aria-hidden="true"><span style={{width:`${Math.max(0,(me.deadline!-n.now)/300*100)}%`}}/></div>
        <button className="primary" onClick={()=>act({type:'ACCEPT',id:SELF})}>Accept & reserve my bag <ArrowRight size={20}/></button>
        <small className="button-note">$5 due at pickup · No online payment</small>
        <button className="text-button decline-button" onClick={()=>act({type:'DECLINE',id:SELF})}>Decline and release this bag</button>
      </div>}
      {reserved&&<div className="pickup-ticket"><div className="ticket-top"><span><Check size={18}/>Reservation confirmed</span><span>Bag {me.bag}</span></div><p className="pickup-code" aria-label={`Pickup code ${me.code}`}>{me.code}</p><p>Show this code at the counter</p><div className="ticket-bottom"><span>$5 due at pickup</span><span>By 8:00 PM tonight</span></div></div>}
      {picked&&<div className="completion"><Check size={28}/><h3>Collected and paid</h3><p>$5 received at pickup · Demo transaction</p></div>}
      {terminal&&<div className="action-section"><h3>{me?.status==='unserved'?'Your patience counts.':me?.status==='no-show'?'An honest outcome.':'The queue keeps moving.'}</h3><p>{me?.status==='unserved'?`Your next evening has ${n.history[SELF]} ${n.history[SELF]===1?'priority credit':'priority credits'}. A boost helps your place, but can’t create more surplus.`:me?.status==='no-show'?'In this demo, missed pickups are unpaid and aren’t reassigned after closing. The real policy still needs testing.':n.now>LAST_OFFER?'There isn’t enough pickup time to offer this bag again. It stays with the bakery.':s.held>0?'Released bags are offered to the next eligible guests while time allows.':'No eligible guests are waiting for a new offer. Any unclaimed bags stay with the bakery.'}</p></div>}
      {n.phase==='closed'&&<button className="secondary next-night" onClick={()=>act({type:'NEXT_NIGHT'})}>See the next evening <ArrowRight size={18}/></button>}
      <div className="fairness"><Sprout size={25} strokeWidth={1.6}/><div><h3>{credit>0?`Priority boost · ${credit} previous waits`:'A fairer place in line'}</h3><p>{credit>0?'Previous nights without an offer give you a little more priority.':'Waited without an offer before? Your next visit gets a small priority boost.'}</p><details><summary>How priority works</summary><p>Each completed night without an offer moves your effective join time 30 minutes earlier, up to 90 minutes. Earlier effective time goes first; ties go to the earlier actual join.</p><p>One bag per person. Credits reset when you receive an offer. Leaving, declining, expiration, and missed pickup earn no extra credit. Tonight’s issued offers never get displaced.</p><p>This is a proposed demo policy, not a guarantee of a bag.</p></details></div></div>
      {!joined&&n.phase==='collecting'&&<ol className="flow-strip"><li><span>1</span>Join with<br/>no commitment</li><li><span>2</span>Bakery confirms<br/>actual bags</li><li><span>3</span>Accept, then<br/>collect</li></ol>}
    </div>
  </section>;
}
