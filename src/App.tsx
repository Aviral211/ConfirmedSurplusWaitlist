import {useEffect, useRef, useState} from 'react';
import {ArrowUpRight, Sun} from 'lucide-react';
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
  const first=useRef(true);
  const status=currentGuest(night)?.status;
  useEffect(()=>{
    if(first.current){first.current=false;return;}
    if(!demoOpen)main.current?.querySelector<HTMLElement>('h1')?.focus({preventScroll:true});
  },[view,status,night.phase]);
  return <div className="app-shell">
    <a className="skip-link" href="#main">Skip to content</a>
    <header className="site-header">
      <a href="#main" className="brand" onClick={()=>setView('consumer')} aria-label="Sunrise Bakery home"><Sun size={30} strokeWidth={1.3}/><span><strong>Sunrise</strong><small>Bakery · Bellevue</small></span></a>
      <nav aria-label="Demo role preview" className="role-nav">
        <button aria-pressed={view==='consumer'} onClick={()=>setView('consumer')}>Consumer</button>
        <button aria-pressed={view==='merchant'} onClick={()=>setView('merchant')}>Merchant</button>
      </nav>
      <span className="night-clock">Tonight · <time>{timeLabel(night.now)}</time>{!night.running&&<small>Paused</small>}</span>
    </header>
    <main id="main" ref={main}>
      {view==='consumer'?<Consumer night={night} act={act}/>:<Merchant night={night} act={act}/>}
    </main>
    {!storageAvailable&&<p className="storage-note" role="status">Browser storage is unavailable. This evening will reset when you reload.</p>}
    <footer className="site-footer"><span>Interactive demo · Fictional bakery night<span className="footer-extra"> · No real payments or notifications</span></span><button ref={demoButton} className="text-button" onClick={()=>setDemoOpen(true)}>Demo controls <ArrowUpRight size={16}/></button></footer>
    <DemoControls open={demoOpen} onClose={()=>{setDemoOpen(false);demoButton.current?.focus();}} night={night} act={act} setView={setView}/>
  </div>;
}
