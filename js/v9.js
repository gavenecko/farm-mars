// Farm Mars v9 - balance pass, mailbox + mayor letters + NPC recipes, discoverability hints, farm layouts (Standard / Crater Ridge / Ice Field),
// Bio-Pod glow blobs, combat depth (dodge roll, charged spin, ring slots), Colony Day year-end cutscene, seasonal soundtrack
// ---------- balance (see tools/econ_sim.py) ----------
CROPS.let.p=12;ITEMS.s_let.p=12;
{const _ng=newGame;newGame=function(){const g=_ng();g.money=500;g.inv[4]=['s_pot',8];g.inv[5]=['s_let',10];g.mail={box:[],read:{},got:{}};g.recK={};g.eq={r1:null,r2:null};g.blobs=[];g.hints={};g.layout='std';g.layoutAsk=1;return g}}
// ---------- items ----------
Object.assign(ITEMS,{gel:{n:'Glow Gel',v:60,c:'#7affc8',d:'Wobbly, glowing goo from a Bio-Pod blob.'},ggel:{n:'Golden Gel',v:250,c:'#ffd23a',d:'Rare gel from a golden blob.'},
 medal:{n:'Colony Medal',v:0,c:'#ffd23a',d:'Awarded on Colony Day for a year of hard work.'},
 rRuby:{n:'Ruby Band',v:300,c:'#ff3a4a',ring:1,d:'Ring: +2 weapon damage.'},rJade:{n:'Jade Loop',v:300,c:'#5adf8a',ring:1,d:'Ring: +15% move speed.'},
 rIron:{n:'Iron Guard',v:250,c:'#aab0c0',ring:1,d:'Ring: take 25% less damage.'},rGlow:{n:'Glow Ring',v:350,c:'#7affc8',ring:1,d:'Ring: slowly regenerates HP.'},
 rRift:{n:'Rift Signet',v:900,p:2500,c:'#ff2a8a',ring:1,d:'Ring: +4 weapon damage, 15% critical hits.'}});
RECIPES.push({id:'rRuby',in:{jasp:2,iron:5}},{id:'rJade',in:{opal:1,crys:3}},{id:'rIron',in:{iron:12,cob:2}},{id:'rGlow',in:{gel:3,crys:2}});
const NREC={ava:['hsalad','Hydro Salad',{let:2,lily:1},160,60],kai:['gpanc','Glow Pancakes',{wht:2,glo:1,egg:1},240,90],ruiz:['rbroth','Recovery Broth',{glowcap:1,carp:1},150,80],
 mo:['pasty',"Miner's Pasty",{pot:2,wht:1},150,70],zara:['prat','Pilot Rations',{wht:2,dst:1},170,75],theo:['stea','Stargazer Tea',{frb:1,lily:1},230,50],
 vega:['froast',"Founder's Roast",{pot:2,tom:1,milk:1},320,120],pip:['gcandy','Gel Candy',{gel:1,glo:1},210,45]};
for(const n in NREC){const[id,nm,inn,v,f]=NREC[n];ITEMS[id]={n:nm,v,c:'#ffb070',food:f,d:'Recipe from '+n[0].toUpperCase()+n.slice(1)+'.'}}
function syncRec(){for(const n in G.recK||{}){const[id,,inn]=NREC[n];if(!RECIPES.some(r=>r.id==id))RECIPES.push({id,in:inn,cook:1})}}
// ---------- mailbox + letters ----------
const LETTERS=[
 ['welcome','Mayor Vega','Welcome to New Cydonia',"Your aunt's mailbox still works! I'll write when there's something new in the colony. Tip: ship crops in the bin by your door - credits arrive overnight.",g=>1],
 ['grant','Mayor Vega','Colony Starter Grant','Every new farmer gets a small grant to get through the first week. Spend it on seeds - lettuce grows fastest.',g=>g.day>=2,['money',150]],
 ['board','Mayor Vega','The Request Board','Colonists post requests on the board in the city plaza every sol. Fill them for credits and friendship.',g=>g.day>=3],
 ['clinic','Dr. Ruiz','Clinic Hours','The Clinic in the south district is open. Full treatment for 80cr, medkits on the shelf. Please stop fainting in the mine.',g=>g.day>=4,['medkit',1]],
 ['airlock','Kai','The Airlock','The Airlock opens at 17:00 - drinks, rumors and the Dust Runner arcade. First fizz is on me.',g=>g.day>=5,['fizz',1]],
 ['mine','Old Mo','The Old Mine','North airlock, then follow the ridge. The mine elevator remembers every fifth floor. Bring food - and the weapon shop has better blades than that butter knife.',g=>g.day>=6],
 ['pod','Dr. Ruiz','Bio-Pod Research','I need a partner to raise glowing Martian blobs. Order a Bio-Pod for your farm (2000cr). Keep the troughs full and they make Glow Gel.',g=>g.day>=9,['pod',1]],
 ['rings','Old Mo','Rings of Power (sort of)','Old miners wore rings for luck. Craft them from ore at your workbench - hold one and press ACT to equip. Two slots. Try a roll (SHIFT / ROLL button) and hold ACT with a weapon for a spin attack.',g=>g.day>=11||g.deep>=3],
 ['rift','Mayor Vega','Hellas Rift Advisory','Surveyors report a gate of black glass south of the mine. A Rift Key opens it - craft one or buy it on Phobos.',g=>g.day>=14||g.deep>=8],
 ['port','Zara','Fly With Me','The Shuttle Port sells pilot licenses. Phobos Station has an exchange with rare goods. See you up there!',g=>g.day>=16||g.money>=2000],
 ['colony','Mayor Vega','Colony Day','On the last sol of every year we celebrate Colony Day with fireworks over the city. Everyone will be there - you too!',g=>(g.day-1)%28>=24]];
for(const n in NREC)LETTERS.push(['rec_'+n,n[0].toUpperCase()+n.slice(1),'A recipe for you',"You've been a good friend. Here's my recipe for "+NREC[n][1]+' - cook it in your kitchen!',g=>(g.hearts[n]||0)>=3,['rec',n]]);
function mailCheck(){if(!G.mail)G.mail={box:[],read:{},got:{}};let n=0;for(const L of LETTERS)if(!G.mail.got[L[0]]&&L[4](G)){G.mail.got[L[0]]=1;G.mail.box.push(L[0]);n++}return n}
const unread=()=>G.mail?G.mail.box.filter(i=>!G.mail.read[i]).length:0;
function readLetter(id){const L=LETTERS.find(l=>l[0]==id);G.mail.read[id]=1;const a=L[5],o=[];let att='';
 if(a&&!G.mail.read[id+'_att']){G.mail.read[id+'_att']=1;if(a[0]=='money'){G.money+=a[1];att='Enclosed: '+a[1]+'cr'}else if(a[0]=='rec'){G.recK[a[1]]=1;syncRec();att='Learned recipe: '+NREC[a[1]][1]}else if(a[0]=='pod'){att=''}else{add(a[0],a[1]);att='Enclosed: '+ITEMS[a[0]].n}sfx('coin')}
 if(a&&a[0]=='pod'&&!G.pod)o.push({t:'Order Bio-Pod - 2000cr',f:()=>buyPod()});o.push({t:'Back to mailbox',f:()=>mailMenu()},{t:'Close'});
 say(L[1]+': '+L[2],[L[3]+(att?'\n'+att:'')],o)}
function mailMenu(){mailCheck();const b=G.mail.box.slice().reverse();if(!b.length){say('Mailbox','Empty. Check back tomorrow.');return}
 const o=b.slice(0,6).map(id=>{const L=LETTERS.find(l=>l[0]==id);return{t:(G.mail.read[id]?'  ':'✉ ')+L[1]+': '+L[2],f:()=>readLetter(id)}});o.push({t:'Close'});say('Mailbox',unread()+' unread letter(s).',o);sfx('menu')}
// ---------- hints ----------
const HINTS=[['eat',g=>g.energy<25,'Low energy - hold food and press ACT to eat, or sleep in your bed.'],['mail',g=>unread()>0&&g.zone=='farm','You have mail! The mailbox is next to your habitat.'],
 ['late',g=>g.time>=1380,'It is getting late - sleep before 02:00 or you will pass out.'],['ship',g=>g.inv.some(s=>s&&ITEMS[s[0]].crop),'Ship crops in the bin by your door, or sell at the city shop.'],
 ['o2',g=>OUTZ(g.zone)&&g.o2<35,'Oxygen low! Head back through an airlock or use an O2 Canister.'],['key',g=>cnt('riftkey')>0,'You have a Rift Key - the gate is south of the mine entrance.'],
 ['lic',g=>g.money>=2600&&!g.port,'You can afford a Shuttle License at the port in the south district.'],['bar',g=>g.zone=='city'&&g.time>=1020&&g.day<=10,'The Airlock bar is open in the south district.'],
 ['roll',g=>OUTZ(g.zone)&&ENTS.some(e=>e.k=='bug'&&Math.hypot(e.x-g.px,e.y-g.py)<60),'Dodge with SHIFT (or ROLL). Hold ACT with a weapon for a spin attack.'],
 ['ring',g=>g.inv.some(s=>s&&ITEMS[s[0]].ring),'Hold a ring and press ACT to equip it.'],['pod',g=>g.pod&&g.zone=='biopod','Fill the troughs (top right) daily. Put 3 gel + 1 crystal in the incubator for a new blob.']];
function hintTick(){if(toastT||modal||menu||CUT||!G.hints)return;for(const[id,c,t]of HINTS)if(!G.hints[id]&&c(G)){G.hints[id]=1;toast('Tip: '+t);return}}
// ---------- farm layouts ----------
const FARM0=MAPS.farm.map(r=>r.slice());const LAYOUTS={std:'Standard',ridge:'Crater Ridge',ice:'Ice Field'};
const RIDGE=[];for(let y=5;y<=8;y++)for(let x=27;x<=29;x++)RIDGE.push([x,y]);for(let y=13;y<=17;y++)for(let x=27;x<=29;x++)if(!(x==27&&y==17))RIDGE.push([x,y]);
const ICE=[];for(let y=12;y<=15;y++)for(let x=8;x<=12;x++)if(!((x==8||x==12)&&(y==12||y==15)))ICE.push([x,y]);
function applyLayout(){const m=MAPS.farm;for(let y=0;y<m.length;y++)m[y]=FARM0[y].slice();m[6][8]='x';
 if(G.layout=='ridge')for(const[x,y]of RIDGE)m[y][x]='J';if(G.layout=='ice')for(const[x,y]of ICE)m[y][x]='I';
 if(G.pod){for(let y=2;y<=4;y++)for(let x=17;x<=20;x++)m[y][x]='U';m[4][18]='D'}
 for(const k in G.tiles){const[x,y]=k.split(',').map(Number);if(m[y]&&'JIUxD'.includes(m[y][x]))delete G.tiles[k]}if(typeof MAPC!='undefined')for(const k in MAPC)if(k.startsWith('farm'))delete MAPC[k]}
['J','I','U','x'].forEach(t=>SOLID.add(t));
function layoutMenu(after){say('Choose your farm',['Aunt Rhea left notes on three possible dome sites. Where should your farm be?'],[
 {t:'Ice Field - frozen pond: ice fishing, soil near it waters itself',f:()=>pickLayout('ice',after)},{t:'Crater Ridge - rocky ridges that regrow ore every sol',f:()=>pickLayout('ridge',after)},
 {t:'Standard - wide open soil, extra seeds and a sprinkler',f:()=>pickLayout('std',after)}])}
function pickLayout(k,after){if(!G.layoutAsk&&!after){return}G.layout=k;delete G.layoutAsk;if(k=='std'){add('s_wht',8);add('spr',1)}applyLayout();unstick(false);toast(LAYOUTS[k]+' farm chosen');after&&after()}
// ---------- Bio-Pod ----------
MAPS.biopod=fromStr(['wwwwwwwwwwww','wjooooooeeow','woooooooooow','woooooooooow','woooooooooow','woooooooooow','woooooooooow','wwwwwDwwwwww']);
DOORS['farm:18,4']=['biopod',5,6];EXITS.biopod=['farm',18,5];
function buyPod(){if(G.pod){toast('You already have a Bio-Pod');return}if(G.money<2000){toast('Need 2000cr');sfx('bad');return}G.money-=2000;G.pod=1;G.blobs=[{c:'#7affc8'}];applyLayout();sfx('craft');
 say('Bio-Pod','Your Bio-Pod was built next to the barn, with one curious glowing blob inside. Fill its troughs every sol and it will make Glow Gel.')}
const BLC=['#7affc8','#8ab8ff','#ff8ad8','#ffb070','#c89aff'];let BLR=[];
function podMorning(){if(!G.pod)return'';let made=0,gold=0;if(G.podW){for(const b of G.blobs){if(Math.random()<.75){G.podOut=(G.podOut||0)+1;made++;if(b.gold&&Math.random()<.4){G.podGold=(G.podGold||0)+1;gold++}}}}
 if(G.podInc&&G.blobs.length<8){G.blobs.push({c:BLC[G.blobs.length%BLC.length],gold:Math.random()<.08});G.podInc=0;BLR=[]}G.podW=0;return made?'Bio-Pod: '+made+' Glow Gel'+(gold?' and '+gold+' Golden Gel':'')+' ready.':''}
function podInteract(t){if(t=='e'){if(G.podOut||G.podGold){const a=G.podOut||0,b=G.podGold||0;if(a)add('gel',a);if(b)add('ggel',b);G.podOut=0;G.podGold=0;toast('Collected '+a+' Glow Gel'+(b?' + '+b+' Golden':''));sfx('harvest');return true}
  if(G.podW){toast('Troughs are full');return true}if(useEnergy(2)){G.podW=1;sfx('water');toast('Filled the troughs');parts(9*T,2*T,'#6cf',10)}return true}
 if(t=='j'){if(G.podInc){toast('Incubating... check tomorrow');return true}if(G.blobs.length>=8){toast('The pod is full (8 blobs)');return true}
  if(cnt('gel')>=3&&cnt('crys')>=1){rem('gel',3);rem('crys',1);G.podInc=1;sfx('craft');toast('Incubator humming - new blob tomorrow!')}else toast('Incubator needs 3 Glow Gel + 1 Crystal');return true}return false}
function blobRT(){while(BLR.length<G.blobs.length){const i=BLR.length;BLR.push({x:(3+i%6*1.2)*T,y:(3+Math.floor(i/6)*2)*T,vx:0,vy:0,ph:i*1.7})}
 for(const b of BLR){if(Math.random()<.02){b.vx=(Math.random()-.5)*.8;b.vy=(Math.random()-.5)*.6}b.x=Math.max(1.5*T,Math.min(10.5*T,b.x+b.vx));b.y=Math.max(2.5*T,Math.min(6.4*T,b.y+b.vy));b.ph+=.12}}
// ---------- combat depth: roll, charge, rings ----------
let ROLL=null,RCD=0,CHG=0;
const ring=id=>G.eq&&(G.eq.r1==id||G.eq.r2==id);
function roll(){if(!G||modal||menu||ROLL||RCD||FISHING||TITLE||CUT)return false;if(!useEnergy(2))return false;let dx=(keys.arrowright||keys.d?1:0)-(keys.arrowleft||keys.a?1:0),dy=(keys.arrowdown||keys.s?1:0)-(keys.arrowup||keys.w?1:0);
 if(joy.on&&Math.hypot(joy.dx,joy.dy)>.3){dx=joy.dx;dy=joy.dy}if(!dx&&!dy){dx=DIRV[G.dir][0];dy=DIRV[G.dir][1]}const l=Math.hypot(dx,dy);ROLL={t:14,dx:dx/l,dy:dy/l};invT=Math.max(invT,16);sfx('swing');parts(G.px,G.py,'#d8a070',6,.8);return true}
function wpnDmg(id){const cb=perk('combat')?2:0;return(id=='blade'?[0,2,4,7][G.tools.blade]:id=='lance'?6:id=='hammer'?9:1)+cb+(ring('rRuby')?2:0)+(ring('rRift')?4:0)}
function spin(id){if(!useEnergy(4))return;swing(id);sfx('break');shake&&shake(3,2);const dmg=wpnDmg(id)*2;let hit=0;
 for(let i=0;i<20;i++){const a=i/20*6.28;parts(G.px+Math.cos(a)*24,G.py-4+Math.sin(a)*24,'#ffd27a',1,.6)}
 for(const e of ENTS){if(e.dead||e.under||e.k!='bug')continue;if(Math.hypot(e.x-G.px,e.y-4-G.py)>34+(e.t=='queen'||e.t=='wyrm'?14:0))continue;e.hp-=dmg;e.hit=8;hit++;const a=Math.atan2(e.y-G.py,e.x-G.px);e.vx=Math.cos(a)*5;e.vy=Math.sin(a)*5;floatTxt(e.x,e.y-14,'-'+dmg,'#ffd27a');if(e.hp<=0)killBug(e)}
 ENTS=ENTS.filter(e=>!e.dead);storeE();G.stats.spins=(G.stats.spins||0)+1;return hit}
function equipMenu(id){const nm=s=>s?ITEMS[s].n:'(empty)',o=[];if(id&&cnt(id)){o.push({t:'Put '+ITEMS[id].n+' in Slot 1',f:()=>equip(id,'r1')},{t:'Put '+ITEMS[id].n+' in Slot 2',f:()=>equip(id,'r2')})}
 for(const s of['r1','r2'])if(G.eq[s])o.push({t:'Unequip '+nm(G.eq[s]),f:()=>{add(G.eq[s]);G.eq[s]=null;equipMenu()}});o.push({t:'Close'});
 say('Equipment',['Ring slot 1: '+nm(G.eq.r1)+(G.eq.r1?' - '+ITEMS[G.eq.r1].d.replace('Ring: ',''):'')+'\nRing slot 2: '+nm(G.eq.r2)+(G.eq.r2?' - '+ITEMS[G.eq.r2].d.replace('Ring: ',''):'')],o)}
function equip(id,s){if(!cnt(id))return;rem(id,1);if(G.eq[s])add(G.eq[s]);G.eq[s]=id;sfx('craft');toast(ITEMS[id].n+' equipped');equipMenu()}
{const _a=act;act=function(){if(!G||modal)return _a();const s=cur(),id=s&&s[0];if(id&&ITEMS[id].ring){equipMenu(id);return}
 const[fx,fy]=facingTile(),t=tileAt(fx,fy);
 if(G.zone=='farm'&&id=='pick'&&t=='J'){const k=fx+','+fy;G.ridgeHit=G.ridgeHit||{};if(G.ridgeHit[k]){toast('This ridge is picked clean until tomorrow');return}if(!useEnergy(2))return;swing('pick');sfx('clink');G.ridgeHit[k]=1;
  const r=hash(G.day*31+fx,fy*7)%100,o=r<55?'iron':r<72?'cob':r<88?'crys':r<96?'jasp':'opal';add(o,o=='iron'?2:1);floatTxt(fx*T+8,fy*T,'+'+ITEMS[o].n,'#9ef');parts(fx*T+8,fy*T+8,'#a87',6);return}
 if(G.zone=='farm'&&id=='rod'&&t=='I'&&!FISHING&&swingT<=4){if(useEnergy(2)){swing('rod');ICEF=1;startFish()}return}
 const before=OUTZ(G.zone)?ENTS.filter(e=>e.k=='bug').map(e=>[e,e.hp]):[];const r=_a();
 if(before.length&&id&&(id=='blade'||ITEMS[id].wpn)){let ch=0;for(const[e,h]of before){if(e.dead||e.hp>=h)continue;let b=(ring('rRuby')?2:0)+(ring('rRift')?4:0);if(ring('rRift')&&Math.random()<.15){b+=h-e.hp;floatTxt(e.x,e.y-22,'CRIT!','#ff2a8a')}if(b){e.hp-=b;ch=1;if(e.hp<=0)killBug(e)}}if(ch){ENTS=ENTS.filter(e=>!e.dead);storeE()}}return r}}
let ICEF=0;{const _pf=pickFish;pickFish=function(){if(ICEF&&G.zone=='farm'){const r=Math.random();return r<.45?'ipik':r<.6?'koi':'carp'}return _pf()}}
{const _fw=fishWin;fishWin=function(){_fw();ICEF=0}}
{const _h=hurt;hurt=function(d,f){if(ROLL)return;if(ring('rIron'))d*=.75;return _h(d,f)}}
{const _i=interact;interact=function(){if(G&&!modal){const[fx,fy]=facingTile(),t=tileAt(fx,fy);if(G.zone=='farm'&&t=='x'){mailMenu();return}if(G.zone=='biopod'&&podInteract(t))return
  if(G.zone=='biopod'){const b=BLR.find(b=>Math.hypot(b.x-G.px,b.y-G.py)<20);if(b){b.vy=-2;sfx('heart');emote&&0;floatTxt(b.x,b.y-14,'♥','#ff8ad8');return}}}return _i()}}
// ---------- Colony Day ----------
const COLONY=["The last sol of the year. All of New Cydonia gathers in the plaza under the dome lights.",'Mayor Vega: "Another year on Mars - and we are still here. Better than here: growing."','Kai: "Drinks are on the Airlock tonight. Well - the first one."',
 'Dr. Ruiz: "Zero fatalities this year. Mostly thanks to people listening to me. Mostly."','Old Mo: "Forty years I\'ve watched these fireworks. Still makes an old miner cry."','Zara: "I timed the shuttle flyover with the finale. Watch the sky!"',
 'Theo: "Each burst is a tiny star. Strontium red, copper blue, barium green."','Pip: "WOOOOAH! Do it again! DO IT AGAIN!"','Ava: "Happy Colony Day, farmer. You made this place feel like home."','The sky over Mars blooms with color. The Mayor pins a Colony Medal to your suit.'];
const CDN=['vega','kai','ruiz','mo','zara','theo','pip','ava'];
{const _sl=sleep;sleep=function(p){const d0=G.day;G.ridgeHit={};if(G.layout=='ice'){for(const k in G.tiles){const[x,y]=k.split(',').map(Number);if(ICE.some(([a,b])=>Math.abs(a-x)<=2&&Math.abs(b-y)<=2))G.tiles[k].w=1}}_sl(p);
 const pm=podMorning(),nm=mailCheck();if(modal){if(pm)modal.pages.splice(modal.pages.length-1,0,pm);if(nm)modal.pages.splice(modal.pages.length-1,0,'You have '+nm+' new letter(s) in your mailbox.')}
}}
function colonyDay(){const y=year();G.colony=G.colony||{};if(G.colony[y])return false;G.colony[y]=1;const m=modal;playCut('colony',COLONY,()=>{add('medal');G.money+=500;G.stats.colony=(G.stats.colony||0)+1;checkAch();modal=m;toast('Colony Medal + 500cr')});setMusic('credits');return true}
const FW=[];{const _dc=drawCut;drawCut=function(){const c=CUT;if(c.k!='colony')return _dc();const g=cx.createLinearGradient(0,0,0,H);g.addColorStop(0,'#05021a');g.addColorStop(1,'#2a0a2a');cx.fillStyle=g;cx.fillRect(0,0,W,H);stars(70,.02,1,3);
 if(tick%22==0&&FW.length<12){const x=40+Math.random()*(W-80),y=30+Math.random()*(H*.35);FW.push({x,y,t:0,c:rnd(['#ff4a6a','#ffd23a','#5adf8a','#6ab8ff','#ff8ad8','#fff']),n:18+Math.floor(Math.random()*10)});sfx('shoot')}
 for(const f of FW){f.t++;const r=f.t*1.3,a=Math.max(0,1-f.t/50);cx.globalAlpha=a;for(let i=0;i<f.n;i++){const an=i/f.n*6.28;R(f.x+Math.cos(an)*r,f.y+Math.sin(an)*r+f.t*f.t*.01,2,2,f.c)}cx.globalAlpha=1;light(f.x,f.y,40*a,f.c)}for(let i=FW.length-1;i>=0;i--)if(FW[i].t>50)FW.splice(i,1);
 for(let i=0;i<7;i++){const x=i*W/6-20,r=34+hash(i,5)%26;cx.fillStyle='#120a20';cx.beginPath();cx.arc(x,H-56,r,Math.PI,0);cx.fill();cx.strokeStyle='#ff6aa855';cx.stroke()}R(0,H-56,W,56,'#1a0e1e');R(0,H-56,W,1,'#ff6aa8');
 const sp=c.i>=1&&c.i<=8?CDN[c.i-1]:null;CDN.forEach((id,i)=>{const n=NPCS.find(n=>n.id==id);if(!n)return;const X=W/2-150+i*34+(i>=4?40:0),Y=H-80-(sp==id?3+Math.abs(Math.sin(tick/6))*3:0);drawChar(cx,X,Y,n.look,2,0)});
 if(G.look)drawChar(cx,W/2-16+52,H-80,G.look,2,0);
 c.t++;c.ch+=TSPD[SET.text][0]*.8;const L=c.lines[c.i]||'';panel(14,H-44,W-28,38,'#000a','#ffd27a');wrapLines(L.slice(0,Math.floor(c.ch)),W-48,8).slice(0,3).forEach((l,i)=>txt(l,24,H-30+i*10,'#fff'));
 panel(W-50,6,44,16,'#0008','#fff6');txt('SKIP ⏭',W-28,17,'#fff',7,'center');txt('COLONY DAY',W/2,16,'#ffd27a',9,'center');if(c.t>320&&c.ch>=L.length)cutNext()}}
// ---------- seasonal soundtrack ----------
for(const z of['farm','city','surf']){const b=SONGS[z];SONGS[z+'_1']=Object.assign({},b,{bpm:b.bpm+10,scale:[0,2,4,7,9],root:b.root+2,wave:'triangle',pad:1});
 SONGS[z+'_2']=Object.assign({},b,{bpm:b.bpm-12,scale:[0,2,3,7,8],root:b.root-3,wave:'sine',pad:1});SONGS[z+'_3']=Object.assign({},b,{bpm:b.bpm+16,scale:[0,3,5,6,10],root:b.root-1,wave:'square'})}
{const _sm=setMusic;setMusic=function(z){const s=G&&!TITLE?seasonIdx():0;if(s&&SONGS[z+'_'+s])z=z+'_'+s;_sm(z)}}
// ---------- start / boot ----------
{const _b=boot;boot=function(){_b();if(!G.mail)G.mail={box:[],read:{},got:{}};G.recK=G.recK||{};G.eq=G.eq||{r1:null,r2:null};G.blobs=G.blobs||[];G.hints=G.hints||{};G.layout=G.layout||'std';syncRec();BLR=[];applyLayout();mailCheck();unstick(false)}}
const LDESC={std:'open soil, +8 wheat seeds, a sprinkler',ridge:'rock ridges regrow ore every sol',ice:'ice fishing; soil near the ice waters itself'};
{const _cm=custMenu;custMenu=function(after){_cm(after);if(!G.layoutAsk||!modal||!modal.opts)return;const o=modal.opts,last=o[o.length-1],lf=last.f;
 last.f=function(){pickLayout(G.layout);return lf&&lf.apply(this,arguments)};o.splice(o.length-1,0,{t:'Farm site: '+LAYOUTS[G.layout]+' ('+LDESC[G.layout]+') ▸',f:()=>{const k=Object.keys(LAYOUTS);G.layout=k[(k.indexOf(G.layout)+1)%3];applyLayout();custMenu(after)}})}}
// ---------- update / draw ----------
{const _u=update;update=function(){const play=G&&!TITLE&&!CRED&&!modal&&!menu&&!CUT&&!MAPV&&!MINI&&!FLY;const x0=G&&G.px,y0=G&&G.py;_u();if(!play)return;
 if(ROLL){for(let i=0;i<3;i++){const nx=G.px+ROLL.dx*1.1,ny=G.py+ROLL.dy*1.1;if(feetFree(nx,ny)){G.px=nx;G.py=ny}}if(tick%3==0)parts(G.px,G.py,'#d8a070',1,.3);if(--ROLL.t<=0){ROLL=null;RCD=20}}else if(RCD)RCD--;
 if(ring('rJade')&&(G.px!=x0||G.py!=y0)&&!ROLL){const nx=G.px+(G.px-x0)*.15,ny=G.py+(G.py-y0)*.15;if(feetFree(nx,ny)){G.px=nx;G.py=ny}}
 if(ring('rGlow')&&tick%180==0&&G.hp<100)G.hp++;
 const s=cur(),w=s&&(s[0]=='blade'||ITEMS[s[0]].wpn)?s[0]:null,hold=keys[' ']||keys.j||touchHold;if(w&&hold&&OUTZ(G.zone))CHG++;else{if(CHG>=40&&w)spin(w);CHG=0}
 if(keys.shift||keys.l){if(!roll.k){roll.k=1;roll()}}else roll.k=0;if(G.zone=='biopod')blobRT();if(tick%90==0)hintTick();if(G.day%28==0&&G.time>=1080&&tick%30==0&&!(G.colony||{})[year()])colonyDay()}}
{const _ds=drawStructures;drawStructures=function(ox,oy,D){_ds(ox,oy,D);const z=G.zone;
 if(z=='farm'){const X=8*T-ox,Y=6*T-oy;D.push([Y+T,()=>{R(X+7,Y+4,2,12,'#6a4a2a');R(X+2,Y-2,12,8,'#5a7a9a');R(X+2,Y-2,12,2,'#8ab0d0');R(X+3,Y+2,10,1,'#2a3a4a');if(unread()){R(X+12,Y-6,2,7,'#f44');R(X+12,Y-6,4,3,'#f44');if(tick%40<20)txt('✉',X+8,Y-10,'#ffd27a',8,'center')}}]);
  if(G.pod){const X=17*T-ox,Y=2*T-oy,w=4*T;D.push([Y+3*T,()=>{cx.fillStyle='#bfe8ff55';cx.beginPath();cx.ellipse(X+w/2,Y+3*T,w/2+2,3*T,0,Math.PI,0);cx.fill();cx.strokeStyle='#dff6ff';cx.lineWidth=1;cx.stroke();
   R(X,Y+2*T,w,T,'#3a4a5a');R(X,Y+2*T,w,2,'#7affc8');R(X+T+2,Y+2*T+2,12,14,'#0a1a14');R(X+T+3,Y+2*T+3,10,12,'#7affc855');txt('BIO-POD',X+w/2,Y+2*T-4,'#7affc8',6,'center');
   for(let i=0;i<Math.min(3,G.blobs.length);i++)R(X+8+i*16,Y+T+6+Math.sin(tick/8+i)*2,6,4,G.blobs[i].c)}]);light(X+w/2,Y+2*T,40,'#7affc8')}
  if(G.layout=='ridge')for(const[x,y]of RIDGE){const X=x*T-ox,Y=y*T-oy;if(X<-T||X>W||Y<-T||Y>H)continue;if(!(G.ridgeHit||{})[x+','+y]&&hash(x,y)%3==0)R(X+5+hash(y,x)%5,Y+5,3,3,['#9ef','#c8a','#7cf'][hash(x+y,2)%3])}}
 if(z=='biopod'){for(const b of BLR){const i=BLR.indexOf(b),bl=G.blobs[i];if(!bl)continue;const X=b.x-ox,Y=b.y-oy,sq=Math.sin(b.ph)*1.5,c=bl.gold?'#ffd23a':bl.c;D.push([Y,()=>{R(X-7,Y+1,14,3,'#0004');cx.fillStyle=c+'cc';cx.beginPath();cx.ellipse(X,Y-5+sq/2,7+sq,6-sq,0,0,6.3);cx.fill();R(X-4,Y-9,2,3,'#012');R(X+2,Y-9,2,3,'#012');R(X-4,Y-9,1,1,'#fff');R(X-5,Y-10+sq/2,3,1,'#fff8')}]);light(X,Y-5,22,c)}
  const X=9*T-ox,Y=T-oy;if(G.podW){R(X+2,Y+5,2*T-4,4,'#6cf');}if(G.podOut)txt(G.podOut+' gel',X+T,Y-2,'#7affc8',6,'center');if(G.podInc){R(T-ox+4,T-oy+2,8,8,tick%30<15?'#7affc8':'#3a8a6a')}}}}
DZ.biopod=['#22323a','#1a2830','#7affc8','#142026'];
{const _dt=drawTile;drawTile=function(g,z,t,v){if(z=='farm'){if(t=='J'){_dt(g,z,'g',v);px(g,1,3,14,12,'#6a4a3a');px(g,2,2,12,4,'#8a6a4a');px(g,3,9,5,3,'#4a3226');px(g,9,6,4,2,'#9a7a5a');return}
  if(t=='I'){px(g,0,0,T,T,'#bfe8ff');px(g,0,0,T,1,'#e8f8ff');if(v==1)px(g,3,5,7,1,'#fff');if(v==2){px(g,6,6,4,4,'#3a6a9a');px(g,6,6,4,1,'#1a3a5a')}return}
  if(t=='U'||t=='x'){_dt(g,z,'g',v);return}}_dt(g,z,t,v)}}
{const _d=draw;draw=function(){_d();if(!G||TITLE||CRED||CUT||MAPV)return;
 if(CHG>0){const p=Math.min(1,CHG/40);R(W/2-20,H-70,40,4,'#0008');R(W/2-20,H-70,40*p,4,p>=1?(tick%8<4?'#fff':'#ffd27a'):'#ff9a4a')}
 if(touchUI&&OUTZ(G.zone)){const b=RB();cx.globalAlpha=RCD||ROLL?.35:.6;cx.fillStyle='#8a6aff';cx.beginPath();cx.arc(b.x,b.y,b.r,0,6.3);cx.fill();cx.globalAlpha=1;txt('ROLL',b.x,b.y+3,'#fff',6,'center')}
 if(G.eq&&(G.eq.r1||G.eq.r2)){[G.eq.r1,G.eq.r2].forEach((r,i)=>{if(r){cx.strokeStyle=ITEMS[r].c;cx.lineWidth=2;cx.beginPath();cx.arc(8+i*10,H-48,3.5,0,6.3);cx.stroke()}})}}}
const RB=()=>({x:BTN.A.x-BTN.A.r-14,y:BTN.A.y-BTN.A.r-6,r:13});
{const _ot=onTap;onTap=function(x,y){if(G&&!TITLE&&!modal&&!menu&&!CUT&&!MINI&&!FLY&&OUTZ(G.zone)){const b=RB();if(Math.hypot(x-b.x,y-b.y)<b.r+4){roll();return true}}return _ot(x,y)}}
// icons
{const _di=drawIcon;drawIcon=function(g,id,X,Y){const it=ITEMS[id];if(it&&it.ring){px(g,X+4,Y+6,8,8,'#ccb070');px(g,X+6,Y+8,4,4,'#0000');px(g,X+5,Y+3,6,4,it.c);px(g,X+6,Y+4,2,1,'#fff');return}
 if(id=='gel'||id=='ggel'){ob(g,X+3,Y+5,10,9,it.c);px(g,X+5,Y+7,2,2,'#fff');return}if(id=='medal'){px(g,X+6,Y+1,4,6,'#c33');ob(g,X+4,Y+7,8,8,'#ffd23a');px(g,X+7,Y+9,2,2,'#fff');return}_di(g,id,X,Y)}}
ACH.push(['mail','Pen Pal','Read 10 letters',g=>Object.keys((g.mail||{}).read||{}).filter(k=>!k.endsWith('_att')).length>=10],['blobs','Blob Rancher','Raise 5 blobs in the Bio-Pod',g=>(g.blobs||[]).length>=5],
 ['spin','Whirlwind','Land 10 spin attacks',g=>(g.stats.spins||0)>=10],['colony','Colonist','Celebrate Colony Day',g=>(g.stats.colony||0)>=1],['chef2','Neighborly Chef','Learn 4 NPC recipes',g=>Object.keys(g.recK||{}).length>=4]);
window.FM9={LETTERS,mailCheck,mailMenu,readLetter,unread,applyLayout,layoutMenu,pickLayout,buyPod,podMorning,podInteract,roll,spin,equipMenu,equip,ring,NREC,syncRec,HINTS,hintTick,COLONY,colonyDay,RIDGE,ICE,
 get ROLL(){return ROLL},get CHG(){return CHG},set CHG(v){CHG=v},get BLR(){return BLR},FARM0};
