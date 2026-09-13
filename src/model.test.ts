import assert from 'node:assert/strict';
import {test} from 'node:test';
import {createNight,reducer,stats,currentGuest,consumerRank,restore,dateLabel,START,PICKUP,END,LAST_OFFER,SELF,type Night,type Action} from './model.ts';

function run(n:Night,...actions:Action[]) {return actions.reduce(reducer,n);}
function confirmed() {return run(createNight('standard',0),{type:'JOIN'},{type:'CONFIRM'});}
function conserved(n:Night) {
  assert.equal(n.bags.length,n.confirmed??0);
  const active=n.guests.filter(g=>['offered','reserved','picked-up','no-show'].includes(g.status));
  assert.equal(new Set(active.map(g=>g.bag)).size,active.length);
  for(const g of active)assert.equal(n.bags.find(b=>b.id===g.bag)?.guest,g.id);
  assert.equal(stats(n).revenue,stats(n).picked*5);
  assert.equal(stats(n).remaining+stats(n).picked,n.confirmed??0);
}
test('interest creates no promise; one confirmation conserves physical bags',()=>{
  let n=run(createNight('standard',0),{type:'JOIN'});
  assert.equal(n.bags.length,0);assert.equal(consumerRank(n),2);
  n=run(n,{type:'CONFIRM'},{type:'CONFIRM'},{type:'QUANTITY',value:12});
  assert.equal(n.confirmations,1);assert.equal(n.bags.length,3);assert.equal(n.quantity,3);conserved(n);
});
test('same bag declines and moves to next eligible guest; no second offer to decliner',()=>{
  let n=confirmed();const bag=currentGuest(n)!.bag;
  n=run(n,{type:'DECLINE',id:SELF});
  assert.equal(n.bags.find(b=>b.id===bag)?.guest,'sarah');
  assert.deepEqual(n.bags.find(b=>b.id===bag)?.previous,{label:'Alex',reason:'declined'});
  n=run(n,{type:'DECLINE',id:SELF},{type:'ACCEPT',id:SELF});assert.equal(currentGuest(n)!.status,'declined');conserved(n);
});
test('expiry reconciles chronologically and never creates extra inventory',()=>{
  let n=confirmed();n=run(n,{type:'ADVANCE',to:START+300});
  assert.equal(currentGuest(n)!.status,'expired');assert.equal(stats(n).held,2);
  assert.equal(n.bags[0].guest,'sarah');assert.equal(n.bags[1].guest,'james');
  n=run(n,{type:'ADVANCE',to:END});assert.equal(stats(n).held,0);assert.equal(stats(n).remaining,3);conserved(n);
});
test('end-to-end: three claimed, two collected, one no-show, $10, 67%',()=>{
  let n=run(confirmed(),{type:'DECLINE',id:'maya'},{type:'ACCEPT',id:SELF},{type:'ACCEPT',id:'david'},{type:'ACCEPT',id:'sarah'});
  assert.equal(stats(n).claimed,3);assert.equal(stats(n).revenue,0);
  n=run(n,{type:'ADVANCE',to:PICKUP},{type:'VERIFY_CODE',code:'4821'},{type:'VERIFY_CODE',code:'7303'},{type:'ADVANCE',to:END});
  const s=stats(n);assert.equal(s.claimed,3);assert.equal(s.picked,2);assert.equal(s.noShows,1);assert.equal(s.revenue,10);assert.equal(s.sellThrough,67);conserved(n);
});
test('zero surplus closes without offers, credits only eligible waiting guests',()=>{
  let n=run(createNight('newcomer',0),{type:'JOIN'},{type:'QUANTITY',value:0},{type:'CONFIRM'});
  assert.equal(n.phase,'closed');assert.equal(n.history.alex,1);assert.equal(n.bags.length,0);
  n=run(n,{type:'CONFIRM'},{type:'ADVANCE',to:END});assert.equal(n.history.alex,1);conserved(n);
});
test('no demand and excess supply remain unsold',()=>{
  for(const scenario of ['no-demand','short-demand'] as const){let n=run(createNight(scenario,0),{type:'CONFIRM'});assert.equal(stats(n).held,scenario==='no-demand'?0:1);n=run(n,{type:'ADVANCE',to:END});assert.equal(stats(n).revenue,0);assert.equal(stats(n).remaining,n.confirmed);conserved(n);}
});
test('excess demand receives no invented offers; unserved wait earns credit',()=>{
  let n=run(createNight('newcomer',0),{type:'JOIN'},{type:'CONFIRM'},{type:'ACCEPT',id:'maya'},{type:'ACCEPT',id:'david'},{type:'ACCEPT',id:'sarah'},{type:'ADVANCE',to:END});
  assert.equal(currentGuest(n)!.status,'unserved');assert.equal(n.history.alex,1);conserved(n);
});
test('last offer includes five minutes to accept and ten to arrive',()=>{
  let n=run(createNight('standard',0),{type:'ADVANCE',to:LAST_OFFER},{type:'CONFIRM'});assert.equal(stats(n).held,3);
  n=run(n,{type:'ADVANCE',to:LAST_OFFER+1},{type:'DECLINE',id:'maya'});assert.equal(n.bags[0].status,'available');
  const late=run(createNight('standard',0),{type:'ADVANCE',to:LAST_OFFER+1},{type:'CONFIRM'});assert.equal(stats(late).held,0);conserved(n);conserved(late);
});
test('accept one second before expiry succeeds; at expiry fails',()=>{
  let n=confirmed();const deadline=currentGuest(n)!.deadline!;
  n=run(n,{type:'ADVANCE',to:deadline-1},{type:'ACCEPT',id:SELF});assert.equal(currentGuest(n)!.status,'reserved');
  n=run(confirmed(),{type:'ADVANCE',to:deadline},{type:'ACCEPT',id:SELF});assert.equal(currentGuest(n)!.status,'expired');conserved(n);
});
test('invalid, premature and duplicate pickup attempts do not produce revenue',()=>{
  let n=run(confirmed(),{type:'ACCEPT',id:SELF},{type:'VERIFY_CODE',code:'4821'});assert.equal(n.pickupResult!.ok,false);
  n=run(n,{type:'ADVANCE',to:PICKUP},{type:'VERIFY_CODE',code:'0000'});assert.equal(stats(n).revenue,0);
  n=run(n,{type:'VERIFY_CODE',code:' 4821 '});assert.equal(n.pickupResult!.ok,true);assert.equal(stats(n).revenue,5);
  n=run(n,{type:'VERIFY_CODE',code:'4821'});assert.match(n.pickupResult!.text,/already collected/);assert.equal(stats(n).revenue,5);conserved(n);
});
test('pickup after closing cannot show a successful payment',()=>{
  const n=run(confirmed(),{type:'ACCEPT',id:SELF},{type:'ADVANCE',to:END},{type:'VERIFY_CODE',code:'4821'});assert.equal(n.pickupResult!.ok,false);assert.match(n.pickupResult!.text,/closed/);assert.equal(stats(n).revenue,0);
});
test('credit resets on offer, remains reset next evening, and reset seeds are explicit',()=>{
  let n=confirmed();assert.equal(n.history.alex,0);assert.equal(currentGuest(n)!.boost,0);
  n=run(n,{type:'ADVANCE',to:END},{type:'NEXT_NIGHT'},{type:'JOIN'});assert.equal(currentGuest(n)!.boost,0);assert.equal(n.day,10);
  n=reducer(n,{type:'RESET',scenario:'newcomer',wall:0});assert.equal(n.history.alex,0);
  n=reducer(n,{type:'RESET',wall:0});assert.equal(n.history.alex,3);
});
test('three unsuccessful nights earn capped credits; leaving earns none',()=>{
  let n=run(createNight('newcomer',0),{type:'THREE_MISSES'});assert.equal(n.history.alex,3);assert.equal(n.day,9);
  n=run(createNight('newcomer',0),{type:'JOIN'},{type:'LEAVE'},{type:'QUANTITY',value:0},{type:'CONFIRM'});assert.equal(n.history.alex,0);
});
test('weekday and month follow the simulated calendar',()=>{
  assert.equal(dateLabel(9),'Wednesday, September 9');assert.equal(dateLabel(10),'Thursday, September 10');assert.equal(dateLabel(31),'Thursday, October 1');
});
test('fractional ticks accumulate; actions cannot slow deadlines',()=>{
  let n=createNight('standard',0);for(let wall=100;wall<=2100;wall+=100)n=reducer(n,{type:'TICK',wall});
  assert.equal(n.now,START+2);assert.equal(n.wall,2000);
  const before=n;n=reducer(n,{type:'TICK',wall:1500});assert.deepEqual(n,before);
});
test('pause, resume and presenter jumps share the same clock',()=>{
  let n=run(confirmed(),{type:'TOGGLE_CLOCK'},{type:'TICK',wall:100000});assert.equal(n.now,START);
  n=run(n,{type:'NEAR_EXPIRY'});assert.equal(currentGuest(n)!.deadline!-n.now,2);
  n=run(n,{type:'TOGGLE_CLOCK'},{type:'TICK',wall:101000});assert.equal(currentGuest(n)!.deadline!-n.now,1);
});
test('refresh preserves reservations and reconciles elapsed offers',()=>{
  const original=run(confirmed(),{type:'ACCEPT',id:SELF});
  const n=restore(JSON.stringify(original),600000);assert.equal(currentGuest(n)!.status,'reserved');assert.equal(stats(n).held,0);assert.equal(n.bags.length,3);conserved(n);
  assert.equal(restore('{bad json',0).phase,'collecting');
  const broken=confirmed();delete currentGuest(broken)!.deadline;assert.equal(restore(JSON.stringify(broken),0).phase,'collecting');
});
test('seeded mixed action sequences maintain inventory and payment invariants',()=>{
  let seed=711;const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed;};
  for(let trial=0;trial<50;trial++) {let n=run(createNight('standard',0),{type:'JOIN'},{type:'QUANTITY',value:random()%13},{type:'CONFIRM'});for(let i=0;i<30;i++){const id=['alex','maya','david','sarah','james'][random()%5];const action:Action=[{type:'ACCEPT',id},{type:'DECLINE',id},{type:'PICKUP',id},{type:'ADVANCE',to:n.now+random()%400}][random()%4] as Action;n=reducer(n,action);conserved(n);}n=reducer(n,{type:'ADVANCE',to:END});conserved(n);}
});
