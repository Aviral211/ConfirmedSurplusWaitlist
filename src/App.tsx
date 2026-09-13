import {useEffect, useRef, useState} from 'react';
import {ArrowUpRight, PackageCheck} from 'lucide-react';
import {Consumer} from './components/Consumer';
import {Merchant} from './components/Merchant';
import {DemoControls} from './components/DemoControls';
import {currentGuest, timeLabel} from './model';
import {useNight} from './useNight';

export default function App() {
  const {night,act,storageAvailable}=useNight();
  const [view,setView]=useState<'consumer'|'merchant'>('consumer');
  const [demoOpen,setDemoOpen]=useState(false);
  const main=useRef<HTMLElement>(null);
  const demoButton=useRef<HTMLButtonElement>(null);
  const status=view==='consumer'?currentGuest(night)?.status:night.phase;
  const previous=useRef({view,status});
  useEffect(()=>{
    if(previous.current.view===view&&previous.current.status===status)return;
    previous.current={view,status};
    if(!demoOpen)main.current?.querySelector<HTMLElement>('h1')?.focus({preventScroll:true});
  },[view,status,demoOpen]);
  const closeDemo=(sceneChanged=false)=>{
    setDemoOpen(false);
    requestAnimationFrame(()=>{
      if(sceneChanged){window.scrollTo(0,0);main.current?.querySelector<HTMLElement>('h1')?.focus({preventScroll:true});}
      else demoButton.current?.focus({preventScroll:true});
    });
  };
  return <div className="app-shell">
    <a className="skip-link" href="#main">Skip to content</a>
    <header className="site-header">
      <a href="#main" className="brand" onClick={()=>setView('consumer')} aria-label="Confirmed Surplus Waitlist home"><PackageCheck size={29} strokeWidth={1.4}/><span><strong>Confirmed Surplus</strong><small>Waitlist</small></span></a>
      <nav aria-label="Demo role preview" className="role-nav">
        <button aria-pressed={view==='consumer'} onClick={()=>setView('consumer')}>Consumer{currentGuest(night)?.status==='offered'&&view!=='consumer'&&<span className="nav-offer">Offer ready</span>}</button>
        <button aria-pressed={view==='merchant'} onClick={()=>setView('merchant')}>Merchant</button>
      </nav>
      <span className="night-clock">Tonight · <time>{timeLabel(night.now)}</time>{!night.running&&<small>Paused</small>}</span>
    </header>
    <main id="main" ref={main}>
      <div className="role-enter" key={view}>{view==='consumer'?<Consumer night={night} act={act} onDemo={()=>{act({type:'ADVANCE',to:19*3600+16*60});setView('merchant');}}/>:<Merchant night={night} act={act}/>}</div>
    </main>
    {!storageAvailable&&<p className="storage-note" role="status">Browser storage is unavailable. This evening will reset when you reload.</p>}
    <footer className="site-footer"><span>Interactive demo · Fictional bakery night<span className="footer-extra"> · No real payments or notifications</span></span><button ref={demoButton} className="text-button" onClick={()=>setDemoOpen(true)}>Demo controls <ArrowUpRight size={16}/></button></footer>
    {demoOpen&&<DemoControls open onClose={closeDemo} night={night} act={act} setView={setView}/>}
  </div>;
}
