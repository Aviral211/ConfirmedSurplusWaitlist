import {useEffect,useRef} from 'react';
import {X,Pause,Play,RotateCcw,ArrowRight} from 'lucide-react';
import {Action,END,Night,PICKUP,Scenario,SELF,stats,timeLabel} from '../model';
interface Props {open:boolean;onClose:()=>void;night:Night;act:(a:Action)=>void;setView:(v:'consumer'|'merchant')=>void}
export function DemoControls({open,onClose,night:n,act,setView}:Props) {
  const dialog=useRef<HTMLDialogElement>(null);
  useEffect(()=>{if(open)dialog.current?.showModal();else dialog.current?.close();},[open]);
  const s=stats(n);const next=n.guests.find(g=>g.status==='offered'&&g.id!==SELF);
  const deadline=Math.min(...n.guests.filter(g=>g.status==='offered').map(g=>g.deadline!));
  const reset=(scenario:Scenario)=>{act({type:'RESET',scenario,wall:Date.now()});setView(scenario==='no-demand'?'merchant':'consumer');onClose();};
  return <dialog className="demo-dialog" ref={dialog} aria-labelledby="demo-title" onCancel={onClose} onClick={e=>{if(e.target===dialog.current)onClose();}}>
    <div className="dialog-heading"><div><p>Presenter tools</p><h2 id="demo-title">One bakery. One evening.</h2></div><button className="icon-button" onClick={onClose} aria-label="Close demo controls"><X/></button></div>
    <p className="demo-intro">These controls change the same live evening. Guest actions, payments and time are simulated.</p>
    <div className="demo-clock"><strong>{timeLabel(n.now)}</strong><button className="secondary" onClick={()=>act({type:'TOGGLE_CLOCK'})}>{n.running?<Pause size={16}/>:<Play size={16}/>} {n.running?'Pause clock':'Resume clock'}</button></div>
    <section><h3>Move the story along</h3><div className="demo-actions">
      <button disabled={n.now>=19*3600+16*60||n.phase==='closed'} onClick={()=>{act({type:'ADVANCE',to:19*3600+16*60});setView('merchant');onClose();}}>Closing count · 7:16 PM <ArrowRight size={16}/></button>
      <button disabled={!next} onClick={()=>act({type:'ACCEPT',id:next!.id})}>Another guest accepts {next&&<small>Bag {next.bag}</small>}</button>
      <button disabled={!next} onClick={()=>act({type:'DECLINE',id:next!.id})}>Another guest declines {next&&<small>Bag {next.bag}</small>}</button>
      <button disabled={!Number.isFinite(deadline)} onClick={()=>act({type:'ADVANCE',to:deadline})}>Advance to next expiration <small>Reassignment runs automatically</small></button>
      <button disabled={n.now>=PICKUP||n.phase==='closed'} onClick={()=>{act({type:'ADVANCE',to:PICKUP});setView('merchant');onClose();}}>Open pickup · 7:30 PM <ArrowRight size={16}/></button>
      <button disabled={n.phase==='closed'} onClick={()=>{act({type:'ADVANCE',to:END});setView('merchant');onClose();}}>Close tonight · 8:00 PM <small>Uncollected reservations become no-shows</small></button>
    </div></section>
    {s.reserved>0&&<section><h3>Demo pickup codes</h3><p>Presenter-only fictional codes. The consumer view reveals only its own reservation.</p><div className="demo-codes">{n.guests.filter(g=>g.status==='reserved').map(g=><span key={g.id}>Bag {g.bag}<strong>{g.code}</strong></span>)}</div></section>}
    <section><h3>Start a fresh scenario</h3><p>Replaces tonight’s local demo state.</p><div className="scenario-buttons"><button onClick={()=>reset('standard')}>The main story <small>3 bags · 5 possible guests</small></button><button onClick={()=>reset('short-demand')}>More bags than guests <small>5 bags · 2 possible guests</small></button><button onClick={()=>reset('no-demand')}>Nobody waiting <small>3 bags · no demand</small></button><button onClick={()=>reset('late')}>A late count <small>7:44 PM · limited time</small></button><button onClick={()=>reset('newcomer')}>First evening <small>No priority history</small></button><button onClick={()=>{act({type:'THREE_MISSES'});setView('consumer');onClose();}}>Three unsuccessful waits <small>Complete 3 no-surplus nights</small></button></div></section>
    <details className="demo-guide"><summary>The 90-second pitch</summary><ol><li>Consumer: join, then explain the transparent priority boost.</li><li>Use “Closing count”; merchant confirms three counted bags.</li><li>Consumer accepts. In these tools, another guest accepts.</li><li>Advance to next expiration. The released bag goes to the next guest; let that guest accept.</li><li>Open pickup. Enter Alex’s code 4821 and one other demo code.</li><li>Close tonight. Two pickups, one no-show, $10 recovered, one inventory confirmation.</li></ol><p>Proposed policy: five-minute offer, ten-minute arrival buffer, pay at pickup. No new offers after 7:45 PM. No-show policy, priority weighting and demand need field testing. Role preview is not authentication.</p></details>
    <button className="text-button reset-all" onClick={()=>reset('standard')}><RotateCcw size={16}/>Reset demo and history</button>
  </dialog>;
}
