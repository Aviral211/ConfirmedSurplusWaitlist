export const START = 19 * 3600 + 5 * 60;
export const PICKUP = 19 * 3600 + 30 * 60;
export const END = 20 * 3600;
export const OFFER_SECONDS = 300;
export const LAST_OFFER = END - OFFER_SECONDS - 600;
export const PRICE = 5;
export const SELF = 'alex';
export type Status = 'waiting' | 'offered' | 'reserved' | 'picked-up' | 'declined' | 'expired' | 'left' | 'unserved' | 'no-show';
export type Scenario = 'standard' | 'short-demand' | 'no-demand' | 'late' | 'newcomer';
export interface Guest { id: string; label: string; joined: number; boost: number; status: Status; offeredOnce: boolean; deadline?: number; bag?: number; code: string }
export interface Bag { id: number; status: 'available' | 'offered' | 'reserved' | 'picked-up' | 'remaining'; guest?: string }
export interface NightEvent { id: number; time: number; text: string }
export interface Night {
  version: 1; day: number; now: number; wall: number; running: boolean; scenario: Scenario;
  phase: 'collecting' | 'allocating' | 'closed'; quantity: number; confirmed: number | null;
  guests: Guest[]; bags: Bag[]; history: Record<string, number>; events: NightEvent[]; confirmations: number; pickups: number;
}
export type Action =
  | { type: 'JOIN' | 'LEAVE' | 'CONFIRM' | 'NEXT_NIGHT' | 'TOGGLE_CLOCK' | 'THREE_MISSES' }
  | { type: 'QUANTITY'; value: number }
  | { type: 'ACCEPT' | 'DECLINE' | 'PICKUP'; id: string }
  | { type: 'ADVANCE'; to: number }
  | { type: 'TICK'; wall: number }
  | { type: 'RESET'; scenario?: Scenario; wall: number };

const guest = (id: string, label: string, joined: number, boost = 0): Guest => ({ id, label, joined, boost, status: 'waiting', offeredOnce: false, code: id === SELF ? '4821' : ({maya:'6102', david:'7303', sarah:'8404', james:'9505'}[id] ?? '1000') });
export function createNight(scenario: Scenario = 'standard', wall = Date.now(), history?: Record<string, number>, day = 9): Night {
  const credits = history ?? {alex: scenario === 'newcomer' ? 0 : 3, maya: 0, david: 0, sarah: 0, james: 0};
  const all = [guest('maya','Guest 01',17*3600+20*60),guest('david','Guest 02',17*3600+50*60),guest('sarah','Guest 03',18*3600+20*60),guest('james','Guest 04',18*3600+40*60)];
  const guests = (scenario === 'no-demand' ? [] : scenario === 'short-demand' ? all.slice(0,1) : all).map(g=>({...g,boost:Math.min(3,credits[g.id]??0)}));
  return {version:1,day,now:scenario === 'late' ? LAST_OFFER-60 : START,wall,running:true,scenario,phase:'collecting',quantity:scenario==='short-demand'?5:3,confirmed:null,guests,bags:[],history:{...credits},events:[],confirmations:0,pickups:0};
}
export const priority = (g: Guest) => g.joined - Math.min(3, g.boost)*1800;
export const ordered = (guests: Guest[]) => [...guests].sort((a,b)=>priority(a)-priority(b)||a.joined-b.joined||a.id.localeCompare(b.id));
export const waiting = (n: Night) => ordered(n.guests.filter(g=>g.status==='waiting'));
export const currentGuest = (n: Night) => n.guests.find(g=>g.id===SELF);
export function consumerRank(n: Night) {
  const me=currentGuest(n); if(!me || me.status!=='waiting') return 0;
  return waiting(n).findIndex(g=>g.id===SELF)+1;
}
export function stats(n: Night) {
  const picked=n.guests.filter(g=>g.status==='picked-up').length;
  const reserved=n.guests.filter(g=>g.status==='reserved').length;
  const noShows=n.guests.filter(g=>g.status==='no-show').length;
  const held=n.guests.filter(g=>g.status==='offered').length;
  return {picked,reserved,noShows,held,claimed:picked+reserved+noShows,available:n.bags.filter(b=>b.status==='available').length,remaining:(n.confirmed??0)-picked,revenue:picked*PRICE,sellThrough:n.confirmed?Math.round(picked/n.confirmed*100):0};
}
const log = (n: Night, text: string) => n.events.push({id:(n.events.at(-1)?.id??0)+1,time:n.now,text});
function allocate(n: Night) {
  if(n.phase!=='allocating'||n.now>LAST_OFFER) return;
  const queue=waiting(n);
  for(const bag of n.bags.filter(b=>b.status==='available')) {
    const next=queue.shift(); if(!next) break;
    bag.status='offered'; bag.guest=next.id;
    next.status='offered'; next.offeredOnce=true; next.bag=bag.id; next.deadline=n.now+OFFER_SECONDS;
    n.history[next.id]=0;
    log(n,`Bag ${bag.id} offered to ${next.label.toLowerCase()}. Five minutes to respond.`);
  }
}
function release(n: Night, g: Guest, status: 'expired'|'declined') {
  g.status=status; delete g.deadline;
  const bag=n.bags.find(b=>b.id===g.bag);
  if(bag) {bag.status='available';delete bag.guest;}
  log(n,`Bag ${g.bag}: ${status==='expired'?'offer expired':'offer declined'}. ${n.now>LAST_OFFER?'Too little pickup time to offer again.':'Released for the next eligible guest.'}`);
}
function close(n: Night) {
  if(n.phase==='closed') return;
  n.phase='closed';
  for(const g of n.guests) {
    if(g.status==='offered') release(n,g,'expired');
    if(g.status==='reserved') {g.status='no-show';log(n,`Bag ${g.bag}: pickup missed. No charge; bag remains at the bakery.`);}
    if(g.status==='waiting') {g.status='unserved'; if(!g.offeredOnce) n.history[g.id]=Math.min(3,(n.history[g.id]??0)+1);}
  }
  for(const b of n.bags) if(b.status!=='picked-up') b.status='remaining';
  log(n,'Tonight is closed. Uncollected bags stay with the bakery.');
}
// Process each historical deadline before moving to the final requested time.
function advance(n: Night, target: number) {
  const to=Math.min(END,Math.max(n.now,target));
  while(n.phase!=='closed') {
    const deadlines=n.guests.filter(g=>g.status==='offered').map(g=>g.deadline!);
    const next=Math.min(END,...deadlines);
    if(next>to) break;
    n.now=next;
    if(next===END) {close(n);break;}
    for(const g of n.guests) if(g.status==='offered'&&g.deadline!<=next) release(n,g,'expired');
    allocate(n);
  }
  n.now=to;
}
export function reducer(state: Night, action: Action): Night {
  if(action.type==='RESET') return createNight(action.scenario??'standard',action.wall);
  const n=structuredClone(state);
  switch(action.type) {
    case 'TICK': {
      const elapsed=Math.max(0,Math.floor((action.wall-n.wall)/1000));
      if(n.running&&n.phase!=='closed'&&elapsed) advance(n,n.now+elapsed);
      n.wall=action.wall; break;
    }
    case 'TOGGLE_CLOCK': n.running=!n.running; break;
    case 'ADVANCE': if(Number.isFinite(action.to)) advance(n,action.to); break;
    case 'QUANTITY': if(n.phase==='collecting'&&Number.isFinite(action.value)) n.quantity=Math.max(0,Math.min(12,Math.floor(action.value))); break;
    case 'JOIN': {
      if(n.phase!=='collecting'||n.guests.some(g=>g.id===SELF&&g.status!=='left')) break;
      n.guests=n.guests.filter(g=>g.id!==SELF);
      n.guests.push(guest(SELF,'Alex',n.now,Math.min(3,n.history[SELF]??0)));
      log(n,'A guest joined the waitlist. No bag promised, no charge.');break;
    }
    case 'LEAVE': {const me=currentGuest(n); if(me?.status==='waiting'&&n.phase==='collecting'){me.status='left';log(n,'A guest left the waitlist.');} break;}
    case 'CONFIRM':
      if(n.phase!=='collecting') break;
      n.confirmed=n.quantity;n.confirmations=1;n.phase='allocating';
      n.bags=Array.from({length:n.quantity},(_,i)=>({id:i+1,status:'available'}));
      log(n,`${n.quantity} actual bags confirmed. One inventory confirmation.`);
      if(n.quantity===0) close(n); else allocate(n); break;
    case 'ACCEPT': {const g=n.guests.find(g=>g.id===action.id); if(g?.status!=='offered'||n.now>=g.deadline!) break;
      g.status='reserved';delete g.deadline; const b=n.bags.find(b=>b.id===g.bag)!;b.status='reserved';
      log(n,`Bag ${g.bag} reserved by ${g.label.toLowerCase()}. Payment due at pickup.`);break;}
    case 'DECLINE': {const g=n.guests.find(g=>g.id===action.id); if(g?.status!=='offered') break;release(n,g,'declined');allocate(n);break;}
    case 'PICKUP': {const g=n.guests.find(g=>g.id===action.id);if(g?.status!=='reserved'||n.now<PICKUP||n.now>=END)break;
      g.status='picked-up';n.bags.find(b=>b.id===g.bag)!.status='picked-up';n.pickups++;
      log(n,`Bag ${g.bag} collected. $5 received at pickup (demo).`);break;}
    case 'NEXT_NIGHT': if(n.phase==='closed') return createNight('standard',n.wall,n.history,n.day+1);break;
    case 'THREE_MISSES': {
      // Three complete no-surplus nights, using the exact public transitions.
      let h:Night=createNight('newcomer',n.wall,undefined,6);
      for(let i=0;i<3;i++) {
        h=reducer(h,{type:'JOIN'});h=reducer(h,{type:'QUANTITY',value:0});h=reducer(h,{type:'CONFIRM'});h=reducer(h,{type:'NEXT_NIGHT'});
      }
      return h;
    }
  }
  return n;
}
export function timeLabel(seconds: number) {
  const h=Math.floor(seconds/3600);const m=Math.floor(seconds%3600/60);
  return `${h%12||12}:${String(m).padStart(2,'0')} ${h>=12?'PM':'AM'}`;
}
export function countdown(seconds: number) {const s=Math.max(0,Math.ceil(seconds));return `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`;}

export const STORAGE_KEY='sunrise-night-v1';
export function restore(raw: string | null, wall=Date.now()): Night {
  try {
    if(!raw) return createNight('standard',wall);
    const n=JSON.parse(raw) as Night;
    if(n.version!==1||!Number.isFinite(n.now)||n.now<START||n.now>END||!Number.isFinite(n.wall)||!Array.isArray(n.guests)||!Array.isArray(n.bags)||!Array.isArray(n.events)||!n.history||!['collecting','allocating','closed'].includes(n.phase)) throw Error('Invalid state');
    if(n.guests.some(g=>!g.id||!Number.isFinite(g.joined)||!Number.isFinite(g.boost)||!['waiting','offered','reserved','picked-up','declined','expired','left','unserved','no-show'].includes(g.status))) throw Error('Invalid guest');
    if(new Set(n.guests.map(g=>g.id)).size!==n.guests.length||n.bags.length!==(n.confirmed??0))throw Error('Invalid inventory');
    return reducer(n,{type:'TICK',wall});
  } catch {return createNight('standard',wall);}
}
