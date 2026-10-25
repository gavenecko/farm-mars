// Farm Mars - prototype. Plain canvas, procedural pixel art.
const W=384,H=216,T=16;const cv=document.getElementById('c'),cx=cv.getContext('2d');
let S=1;function resize(){S=Math.max(1,Math.min(innerWidth/W,innerHeight/H));cv.width=W;cv.height=H;cv.style.width=W*S+'px';cv.style.height=H*S+'px';cv.style.left=(innerWidth-W*S)/2+'px';cv.style.top=(innerHeight-H*S)/2+'px';cx.imageSmoothingEnabled=false}
addEventListener('resize',resize);resize();
const R=(x,y,w,h,c)=>{cx.fillStyle=c;cx.fillRect(Math.round(x),Math.round(y),w,h)};
const txt=(s,x,y,c='#fff',sz=8,al='left')=>{cx.font=sz+'px monospace';cx.textAlign=al;cx.fillStyle='#000';cx.fillText(s,x+1,y+1);cx.fillStyle=c;cx.fillText(s,x,y)};
const rnd=(a,b)=>a+Math.random()*(b-a),hash=(x,y)=>((x*73856093)^(y*19349663))>>>0;
// ---------- data ----------
const ITEMS={hoe:{n:'Hoe',tool:1,c:'#c96'},can:{n:'Water Can',tool:1,c:'#6cf'},pick:{n:'Pickaxe',tool:1,c:'#aaa'},blade:{n:'Plasma Blade',tool:1,c:'#f4f'},
 s_pot:{n:'Red Potato Seed',seed:'pot',p:20,c:'#a63'},s_let:{n:'Dust Lettuce Seed',seed:'let',p:15,c:'#7c4'},s_glo:{n:'Glowberry Seed',seed:'glo',p:40,c:'#f6c'},
 pot:{n:'Red Potato',v:45,c:'#c53',food:20},let:{n:'Dust Lettuce',v:30,c:'#8d5',food:15},glo:{n:'Glowberry',v:110,c:'#f5d',food:30},
 iron:{n:'Ferrite Ore',v:25,c:'#b87'},crys:{n:'Aurorium Crystal',v:80,c:'#6ff'},glowcap:{n:'Glowcap',v:50,c:'#9f6',food:25},lily:{n:'Dust Lily',v:65,c:'#c8f'},
 chit:{n:'Bug Chitin',v:35,c:'#a6f'},coffee:{n:'Red Dust Latte',v:10,c:'#a52',food:40,p:30},pendant:{n:'Red Pendant',v:0,c:'#f33',p:500}};
const CROPS={pot:{days:3,c:'#c53'},let:{days:2,c:'#8d5'},glo:{days:4,c:'#f5d'}};
const NPCS=[
 {id:'ava',n:'Ava',zone:'city',x:10,y:11,body:'#2bb',hair:'#f4a',mar:1,likes:['crys','glo'],lines:['Hey farmer. The dome seals hiss at night, you get used to it.','I keep the life support humming. Bring me crystals, they tune the reactors.','You out on the surface again? Stay safe out there.','I saved you a seat at the observatory. The Earth-rise is lovely.']},
 {id:'kai',n:'Kai',zone:'city',x:7,y:8,body:'#d4a',hair:'#222',mar:1,likes:['glowcap','coffee','let'],lines:['Welcome to the Red Dust Cafe! Well, outside it.','Fresh greens are rare here. You grow them? Wow.','I\'m experimenting with Glowcap tea. Want to be my taste tester?','Honestly, my favorite part of the sol is when you stop by.']},
 {id:'ruiz',n:'Dr. Ruiz',zone:'city',x:22,y:11,body:'#eee',hair:'#888',likes:['lily','glowcap','glo'],lines:['Martian flora is extraordinary. Bring me samples!','Dust Lilies bloom only in crater shadows.','Your soil work is helping the colony, truly.','You could publish with me, you know.']},
 {id:'mo',n:'Old Mo',zone:'city',x:16,y:14,body:'#a63',hair:'#ddd',likes:['iron','chit','pot'],lines:['Back in \'78 we mined with our bare gloves.','Crystal bugs hate a quick swing. Hit and step back.','Ferrite\'s the backbone of Cydonia. Keep it coming.','You remind me of me, kid.']}];
// ---------- maps ----------
function mk(w,h,f){const m=[];for(let y=0;y<h;y++){m.push([]);for(let x=0;x<w;x++)m[y].push(f(x,y))}return m}
const MAPS={
 farm:mk(28,20,(x,y)=>{if(y==0&&x>=13&&x<=14)return 'X';if(x==27&&y>=9&&y<=10)return 'X';if(x==0||y==0||x==27||y==19)return 'W';if(x>=2&&x<=7&&y>=2&&y<=5)return 'H';if(x==9&&y==5)return 'B';if(x==21&&y==4)return 'T';return 'g'}),
 city:mk(30,20,(x,y)=>{if(x==0&&y>=9&&y<=10)return 'X';if(x==0||y==0||x==29||y==19)return 'W';for(const[a,b]of[[2,8],[11,18],[20,27]])if(x>=a&&x<=b&&y>=1&&y<=5)return 'H';if(x>=14&&x<=15&&y>=10&&y<=11)return 'F';if((x+y)%7==0&&y>13&&(x<4||x>25))return 'L';return 'p'}),
 surf:mk(44,32,(x,y)=>{if(y==31&&x>=21&&x<=22)return 'X';if(x==0||y==0||x==43||y==31)return 'R';const h=hash(x,y)%100;if(h<6&&Math.abs(x-21.5)>2)return 'R';if(Math.hypot(x-30,y-9)<4)return 'c';if(Math.hypot(x-10,y-12)<3)return 'c';return 'r'})};
const SOLID=new Set(['W','H','B','T','F','R','L']);
const DOORS={city:{'5,6':'cafe','14,6':'shop','23,6':'cc'},farm:{'5,6':'home'}};
// ---------- state ----------
let G;function newGame(){return{day:1,time:360,money:300,energy:100,hp:100,o2:100,zone:'farm',px:12*T,py:9*T,dir:2,sel:0,
 inv:[['hoe',1],['can',1],['pick',1],['blade',1],['s_pot',6],['s_let',4],null,null,null,null],tiles:{},ship:[],hearts:{ava:0,kai:0,ruiz:0,mo:0},talked:{},gifted:{},spouse:null,cc:0,ents:null}}
function save(){localStorage.setItem('farmmars1',JSON.stringify(G));toast('Game saved')}
function load(){try{const s=JSON.parse(localStorage.getItem('farmmars1'));if(s&&s.day)return s}catch(e){}return null}
G=load()||newGame();
// surface entities
function spawnSurface(){const e=[];let n=0;while(n<34){const x=2+Math.floor(Math.random()*40),y=2+Math.floor(Math.random()*26);if(MAPS.surf[y][x]=='R'||Math.abs(x-21.5)<3&&y>26)continue;const r=Math.random();
 e.push(r<.45?{k:'ore',t:Math.random()<.25||MAPS.surf[y][x]=='c'?'crys':'iron',x:x*T+8,y:y*T+8,hp:3}:r<.75?{k:'plant',t:Math.random()<.5?'glowcap':'lily',x:x*T+8,y:y*T+8}:{k:'bug',x:x*T+8,y:y*T+8,hp:3,vx:0,vy:0,cd:0});n++}G.ents=e}
if(!G.ents)spawnSurface();
const npcs=NPCS.map(n=>({...n,px:n.x*T,py:n.y*T,tx:n.x*T,ty:n.y*T}));
let robot={px:15*T,py:12*T,tx:15*T,ty:12*T};
// ---------- inventory ----------
function add(id,q=1){for(const s of G.inv)if(s&&s[0]==id){s[1]+=q;return true}const i=G.inv.findIndex(s=>!s);if(i<0){toast('Inventory full');return false}G.inv[i]=[id,q];return true}
function take(i,q=1){const s=G.inv[i];s[1]-=q;if(s[1]<=0)G.inv[i]=null}
const cur=()=>G.inv[G.sel];
// ---------- UI / modal ----------
let msgs=[],modal=null,toastT=0,toastS='';function toast(s){toastS=s;toastT=150}
function say(name,text,opts){modal={name,text,opts:opts||[{t:'OK'}],sel:0}}
// ---------- input ----------
const keys={};let joy={on:false,id:null,ox:0,oy:0,dx:0,dy:0};const btnDown={};
addEventListener('keydown',e=>{keys[e.key.toLowerCase()]=1;const k=e.key.toLowerCase();
 if(modal){if(k=='arrowup'||k=='w')modal.sel=(modal.sel+modal.opts.length-1)%modal.opts.length;if(k=='arrowdown'||k=='s')modal.sel=(modal.sel+1)%modal.opts.length;if(k==' '||k=='enter'||k=='e'||k=='j')choose(modal.sel);return}
 if(k==' '||k=='j')act();if(k=='e'||k=='k')interact();if(k=='q')G.sel=(G.sel+9)%10;if(k=='tab'){e.preventDefault();G.sel=(G.sel+1)%10}if(k>='1'&&k<='9')G.sel=+k-1;if(k=='0')G.sel=9;if(k=='f')eat()});
addEventListener('keyup',e=>keys[e.key.toLowerCase()]=0);
function toGame(t){const r=cv.getBoundingClientRect();return[(t.clientX-r.left)/S,(t.clientY-r.top)/S]}
const BTN={A:{x:W-34,y:H-62,r:17,l:'USE'},B:{x:W-70,y:H-36,r:15,l:'TALK'},E:{x:W-26,y:H-104,r:11,l:'EAT'}};
function onTap(x,y){if(modal){modalClick(x,y);return true}
 if(y>H-22){const i=Math.floor((x-(W/2-100))/20);if(i>=0&&i<10){G.sel=i;return true}}
 for(const k in BTN){const b=BTN[k];if(Math.hypot(x-b.x,y-b.y)<b.r+4){btnDown[k]=8;k=='A'?act():k=='B'?interact():eat();return true}}
 if(x>W-40&&y<20){save();return true}return false}
cv.addEventListener('touchstart',e=>{e.preventDefault();for(const t of e.changedTouches){const[x,y]=toGame(t);if(onTap(x,y))continue;if(x<W/2&&!joy.on){joy={on:true,id:t.identifier,ox:x,oy:y,dx:0,dy:0}}}},{passive:false});
cv.addEventListener('touchmove',e=>{e.preventDefault();for(const t of e.changedTouches)if(t.identifier==joy.id){const[x,y]=toGame(t);let dx=x-joy.ox,dy=y-joy.oy,d=Math.hypot(dx,dy);if(d>24){dx*=24/d;dy*=24/d}joy.dx=dx/24;joy.dy=dy/24}},{passive:false});
const tend=e=>{for(const t of e.changedTouches)if(t.identifier==joy.id)joy={on:false,id:null,dx:0,dy:0}};
cv.addEventListener('touchend',tend);cv.addEventListener('touchcancel',tend);
cv.addEventListener('mousedown',e=>{const[x,y]=toGame(e);onTap(x,y)});
function modalClick(x,y){const m=modal,by=H-70;m.opts.forEach((o,i)=>{const oy=by+30+i*11;if(y>oy-9&&y<oy+2&&m.opts.length>1)choose(i)});if(m.opts.length==1)choose(0)}
function choose(i){const o=modal.opts[i];modal=null;if(o.f)o.f()}
// ---------- world helpers ----------
const map=()=>MAPS[G.zone];
function solidAt(px,py){const x=Math.floor(px/T),y=Math.floor(py/T),m=map();if(y<0||x<0||y>=m.length||x>=m[0].length)return true;if(SOLID.has(m[y][x]))return true;
 if(G.zone=='surf')for(const e of G.ents)if(e.k=='ore'&&Math.abs(e.x-px)<6&&Math.abs(e.y-py)<5)return true;return false}
function facing(){const d=[[0,-1],[1,0],[0,1],[-1,0]][G.dir];return[Math.floor((G.px)/T)+d[0],Math.floor((G.py+4)/T)+d[1]]}
function useEnergy(n){if(G.energy<n){toast('Too tired... go to bed');return false}G.energy-=n;return true}
function go(zone,x,y){G.zone=zone;G.px=x*T+8;G.py=y*T+8;if(zone=='surf'){G.o2=100;toast('Airlock cycled. Watch your O2!')}}
// ---------- actions ----------
function act(){const s=cur();if(!s)return;const id=s[0],[fx,fy]=facing(),k=fx+','+fy,m=map();
 if(G.zone=='farm'){const t=m[fy]&&m[fy][fx];if(t!='g')return;const ft=G.tiles[k];
  if(id=='hoe'){if(!ft&&useEnergy(2)){G.tiles[k]={w:0,c:null,g:0}}}
  else if(id=='can'){if(ft&&useEnergy(1)){ft.w=1;if(ft.c&&ft.g>=CROPS[ft.c].days)harvest(k)}}
  else if(ITEMS[id].seed){if(ft&&!ft.c){ft.c=ITEMS[id].seed;ft.g=0;take(G.sel)}}
  else if(ft&&ft.c&&ft.g>=CROPS[ft.c].days)harvest(k);
  return}
 if(G.zone=='surf'){const ax=G.px+[[0,-1],[1,0],[0,1],[-1,0]][G.dir][0]*12,ay=G.py+[[0,-1],[1,0],[0,1],[-1,0]][G.dir][1]*12;
  if(id=='pick'||id=='blade'){if(!useEnergy(id=='pick'?3:1))return;swing=10;
   for(const e of G.ents){if(Math.hypot(e.x-ax,e.y-ay)>14)continue;
    if(e.k=='ore'&&id=='pick'){e.hp--;parts(e.x,e.y,ITEMS[e.t].c);if(e.hp<=0){e.dead=1;add(e.t,e.t=='crys'?1:2);toast('+'+ITEMS[e.t].n)}}
    if(e.k=='bug'){e.hp-=id=='blade'?2:1;const a=Math.atan2(e.y-G.py,e.x-G.px);e.vx=Math.cos(a)*4;e.vy=Math.sin(a)*4;parts(e.x,e.y,'#c8f');if(e.hp<=0){e.dead=1;add('chit');toast('+Bug Chitin')}}}
   G.ents=G.ents.filter(e=>!e.dead)}}}
function harvest(k){const ft=G.tiles[k];if(add(ft.c)){toast('+'+ITEMS[ft.c].n);ft.c=null;ft.g=0}}
function eat(){const s=cur();if(s&&ITEMS[s[0]].food){G.energy=Math.min(100,G.energy+ITEMS[s[0]].food);G.hp=Math.min(100,G.hp+ITEMS[s[0]].food);toast('Ate '+ITEMS[s[0]].n);take(G.sel)}else toast('Select food to eat')}
function interact(){const[fx,fy]=facing();
 // npc nearby
 const list=G.zone=='city'?npcs.filter(n=>!(G.spouse==n.id)):G.zone=='farm'&&G.spouse?npcs.filter(n=>n.id==G.spouse):[];
 for(const n of list)if(Math.hypot(n.px+8-G.px,n.py+8-G.py)<22){talk(n);return}
 if(G.zone=='surf'){for(const e of G.ents)if(e.k=='plant'&&Math.hypot(e.x-G.px,e.y-G.py)<18){e.dead=1;add(e.t);toast('Foraged '+ITEMS[e.t].n);G.ents=G.ents.filter(e=>!e.dead);return}}
 if(G.zone=='farm'){if(Math.hypot(robot.px+8-G.px,robot.py+8-G.py)<22){say('R0-V3R','*beep* I water a few crops each morning. Grow, grow, grow!');return}
  const t=map()[fy]&&map()[fy][fx];
  if(t=='B'){const s=cur();if(s&&ITEMS[s[0]].v>0&&!ITEMS[s[0]].tool){G.ship.push([s[0],s[1]]);toast('Shipped '+s[1]+' '+ITEMS[s[0]].n);G.inv[G.sel]=null}else toast('Shipping bin: hold an item to ship it (paid overnight)');return}
  if(t=='H'||(fx==5&&fy==6)){say('Habitat','Go to sleep and end Sol '+G.day+'?',[{t:'Sleep (saves)',f:sleep},{t:'Not yet'}]);return}
  if(t=='T'){say('Water Tank','Recycled H2O. Your can is always full.');return}}
 if(G.zone=='city'){const t=map()[fy]&&map()[fy][fx];if(t=='H'){const b=fx<=8?'cafe':fx<=18?'shop':'cc';building(b);return}if(t=='F'){say('','The fountain recycles the colony\'s water. A plaque reads: "Cydonia, est. 2079".');return}}
 const ft=G.tiles[fx+','+fy];if(ft&&ft.c&&ft.g>=CROPS[ft.c].days){harvest(fx+','+fy);return}}
function building(b){if(b=='cafe')say('Red Dust Cafe','Warm air and synth-coffee. Buy a latte (30cr, +40 energy)?',[{t:'Buy latte 30cr',f:()=>buy('coffee')},{t:'Leave'}]);
 if(b=='shop')shop();if(b=='cc'){const need=[['pot',5],['iron',5],['crys',2],['lily',2]];
  say('Community Center',G.cc?'The Colony Bundle is complete! The community thanks you.':'Colony Bundle: 5 Red Potato, 5 Ferrite, 2 Aurorium, 2 Dust Lily. Reward: 1000cr.',G.cc?null:[{t:'Donate bundle',f:()=>{if(need.every(([i,q])=>cnt(i)>=q)){need.forEach(([i,q])=>rem(i,q));G.cc=1;G.money+=1000;say('Community Center','Bundle complete! +1000cr. The plaza lights glow brighter.')}else toast('Missing bundle items')}},{t:'Leave'}])}}
const cnt=id=>G.inv.reduce((a,s)=>a+(s&&s[0]==id?s[1]:0),0);function rem(id,q){for(let i=0;i<10;i++){const s=G.inv[i];if(s&&s[0]==id){const t=Math.min(q,s[1]);take(i,t);q-=t}}}
function buy(id){const p=ITEMS[id].p;if(G.money<p){toast('Not enough credits');return}if(add(id)){G.money-=p;toast('Bought '+ITEMS[id].n)}}
function shop(){const o=['s_pot','s_let','s_glo'].map(i=>({t:'Buy '+ITEMS[i].n+' '+ITEMS[i].p+'cr',f:()=>{buy(i);shop()}}));
 if(Object.values(G.hearts).some(h=>h>=8)&&!G.spouse)o.push({t:'Buy Red Pendant 500cr',f:()=>buy('pendant')});
 o.push({t:'Sell held item',f:()=>{const s=cur();if(s&&ITEMS[s[0]].v){const v=ITEMS[s[0]].v*s[1];G.money+=v;toast('Sold for '+v+'cr');G.inv[G.sel]=null}else toast('Hold something sellable');shop()}},{t:'Leave'});
 say('Supply & Tech','Seeds, gear, trade. Credits: '+G.money,o)}
function talk(n){const h=G.hearts[n.id],s=cur(),key=n.id+G.day;
 if(G.spouse==n.id){say(n.n,['Morning, love. The dome looks beautiful today.','I made you breakfast. Don\'t let the bugs bite.','Home is wherever you are. Even on Mars.'][G.day%3]);if(!G.talked[key]){G.talked[key]=1;G.energy=Math.min(100,G.energy+20)}return}
 const opts=[{t:'Chat',f:()=>{if(!G.talked[key]){G.talked[key]=1;G.hearts[n.id]=Math.min(10,h+.5)}say(n.n,n.lines[Math.min(3,Math.floor(G.hearts[n.id]/2.5))])}}];
 if(s&&!ITEMS[s[0]].tool)opts.push({t:'Give '+ITEMS[s[0]].n,f:()=>gift(n)});opts.push({t:'Bye'});
 say(n.n+' '+'♥'.repeat(Math.floor(h))+'·'.repeat(10-Math.floor(h)),'Hi there!',opts)}
function gift(n){const s=cur(),id=s[0];
 if(id=='pendant'){if(!n.mar){say(n.n,'That\'s sweet, but I\'m not the marrying type.');return}
  if(G.hearts[n.id]<10){say(n.n,'Oh! I... I don\'t think we\'re there yet. (Reach 10 hearts)');return}
  take(G.sel);G.spouse=n.id;say(n.n,'Yes! A thousand times yes! I\'ll move into your dome habitat tonight. ♥');return}
 if(G.gifted[n.id+G.day]){say(n.n,'You already gave me something today!');return}
 take(G.sel);G.gifted[n.id+G.day]=1;const lk=n.likes.includes(id);G.hearts[n.id]=Math.min(10,G.hearts[n.id]+(lk?2:.75));
 say(n.n,lk?'I LOVE this! How did you know?':'Thanks, that\'s thoughtful.')}
function sleep(){let earn=0;for(const[i,q]of G.ship)earn+=ITEMS[i].v*q;G.ship=[];G.money+=earn;
 for(const k in G.tiles){const t=G.tiles[k];if(t.c&&t.w)t.g++;t.w=0}
 // robot waters up to 3 planted tiles next morning
 let r=0;for(const k in G.tiles)if(G.tiles[k].c&&r<3){G.tiles[k].w=1;r++}
 const passed=G.time>=1560;G.day++;G.time=360;G.energy=passed?60:100;G.hp=100;G.zone='farm';G.px=5*T+8;G.py=7*T+8;G.dir=2;spawnSurface();save();
 say('Sol '+G.day,(passed?'You collapsed from exhaustion. ':'')+'You slept well. Shipping earned '+earn+'cr.'+(r?' R0-V3R watered '+r+' crops.':''))}
// ---------- particles ----------
let P=[],swing=0;function parts(x,y,c){for(let i=0;i<8;i++)P.push({x,y,vx:rnd(-1.5,1.5),vy:rnd(-2,.5),l:20,c})}
// ---------- update ----------
let tick=0,anim=0;
function update(){tick++;if(toastT)toastT--;if(swing)swing--;for(const k in btnDown)if(btnDown[k])btnDown[k]--;
 P.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.vy+=.15;p.l--});P=P.filter(p=>p.l>0);
 if(modal)return;
 if(tick%40==0){G.time+=10;if(G.time>=1560){sleep();return}}
 let dx=(keys.arrowright||keys.d?1:0)-(keys.arrowleft||keys.a?1:0),dy=(keys.arrowdown||keys.s?1:0)-(keys.arrowup||keys.w?1:0);
 if(joy.on&&Math.hypot(joy.dx,joy.dy)>.2){dx=joy.dx;dy=joy.dy}
 const mv=Math.hypot(dx,dy);if(mv>0){const sp=1.3*(G.energy<10?.6:1);dx=dx/Math.max(1,mv)*sp;dy=dy/Math.max(1,mv)*sp;
  if(Math.abs(dx)>Math.abs(dy))G.dir=dx>0?1:3;else G.dir=dy>0?2:0;
  if(!solidAt(G.px+dx+(dx>0?5:-5),G.py+4)&&!solidAt(G.px+dx+(dx>0?5:-5),G.py+7))G.px+=dx;
  if(!solidAt(G.px-4,G.py+dy+(dy>0?8:3))&&!solidAt(G.px+4,G.py+dy+(dy>0?8:3)))G.py+=dy;anim+=.15}
 // exits
 const tx=Math.floor(G.px/T),ty=Math.floor((G.py+6)/T),t=map()[ty]&&map()[ty][tx];
 if(t=='X'){if(G.zone=='farm'&&tx>=26)go('city',1,9.5);else if(G.zone=='farm')go('surf',21.5,29);else if(G.zone=='city')go('farm',26,9.5);else go('farm',13.5,1)}
 if(G.zone=='city')npcs.forEach(n=>{if(Math.random()<.005){n.tx=n.x*T+rnd(-40,40);n.ty=n.y*T+rnd(-24,24)}const a=n.tx-n.px,b=n.ty-n.py;if(Math.hypot(a,b)>1&&!solidAt(n.px+8+Math.sign(a)*6,n.py+12)){n.px+=Math.sign(a)*.4;n.py+=Math.sign(b)*.4}});
 if(G.zone=='farm'){if(Math.random()<.008){robot.tx=rnd(10,24)*T;robot.ty=rnd(8,17)*T}robot.px+=Math.sign(robot.tx-robot.px)*.5;robot.py+=Math.sign(robot.ty-robot.py)*.5}
 if(G.zone=='surf'){if(tick%12==0)G.o2=Math.max(0,G.o2-1);if(G.o2<=0&&tick%20==0)G.hp-=3;
  for(const e of G.ents)if(e.k=='bug'){const d=Math.hypot(G.px-e.x,G.py-e.y);if(d<90){const a=Math.atan2(G.py-e.y,G.px-e.x);e.x+=Math.cos(a)*.55+e.vx;e.y+=Math.sin(a)*.55+e.vy}e.vx*=.8;e.vy*=.8;if(e.cd)e.cd--;
   if(d<10&&!e.cd){G.hp-=8;e.cd=50;parts(G.px,G.py,'#f44')}}
  if(G.hp<=0){G.money=Math.max(0,G.money-100);G.zone='farm';G.px=5*T+8;G.py=7*T+8;G.hp=50;G.energy=Math.max(20,G.energy);say('Med Bay','You were dragged back to the dome by a rescue drone. Medical fee: 100cr.')}}}
// ---------- draw ----------
const PAL={farm:{bg:'#3a1c10'},city:{bg:'#120a1e'},surf:{bg:'#1d0814'}};
function tile(z,t,x,y,X,Y){const h=hash(x,y);
 if(z=='farm'){if(t=='W'){R(X,Y,T,T,'#5a2a14');R(X,Y,T,6,'#8fd8ff55');if((x+y)%3==0)R(X+7,Y,1,T,'#bfefff88');return}
  R(X,Y,T,T,(h%5==0)?'#c4723a':'#cf7d42');if(h%11==0)R(X+(h%12),Y+(h%9),2,1,'#e3a165');if(h%13==0)R(X+4,Y+10,1,2,'#7ba04c');
  if(t=='X'){R(X,Y,T,T,'#555');R(X+2,Y+2,12,12,'#2af');}
  if(t=='B'){R(X+1,Y+3,14,12,'#6b3b1f');R(X+1,Y+3,14,3,'#a86a3a');R(X+3,Y+9,10,1,'#432')}
  if(t=='T'){R(X+2,Y-6,12,20,'#7aa');R(X+2,Y-6,12,3,'#bdd');R(X+4,Y,8,6,'#49c')}}
 else if(z=='city'){if(t=='W'){R(X,Y,T,T,'#2a1530');R(X,Y+14,T,2,'#f0f');return}
  R(X,Y,T,T,(x+y)%2?'#3a2a3e':'#33243a');R(X,Y,T,1,'#4a3550');if(h%9==0)R(X+5,Y+5,2,2,'#0ff3');
  if(t=='X'){R(X,Y,T,T,'#222');R(X+2,Y+2,12,12,'#0ff')}
  if(t=='F'){R(X,Y,T,T,'#245');R(X+2,Y+2,12,12,'#3cf');if(tick%30<15)R(X+6,Y+3,3,3,'#fff')}
  if(t=='L'){R(X+7,Y-14,2,28,'#555');R(X+4,Y-16,8,3,'#f0f');R(X+5,Y-13,6,1,'#f8f8')}}
 else{if(t=='R'){R(X,Y,T,T,'#3a1020');R(X+1,Y-6,14,12,'#6a2236');R(X+1,Y-6,14,3,'#8c3a4e');R(X+1,Y+6,14,10,'#401222');return}
  R(X,Y,T,T,t=='c'?'#4a1630':(h%4==0?'#6a2030':'#5e1c2e'));if(h%7==0)R(X+(h%13),Y+(h%11),2,2,'#7a3040');if(h%23==0)R(X+3,Y+3,1,1,'#b6f');
  if(t=='X'){R(X,Y,T,T,'#333');R(X+2,Y+2,12,12,'#fa2')}}}
function drawBuildings(ox,oy){if(G.zone=='farm'){const X=2*T-ox,Y=2*T-oy;R(X,Y+6,6*T,4*T-6,'#d9c7b0');R(X-4,Y-6,6*T+8,16,'#b0533a');R(X-4,Y-6,6*T+8,3,'#d77a50');
  R(X+3*T-6,Y+3*T,12,T,'#5a3a2a');R(X+3*T-4,Y+3*T+2,8,6,'#ffcf6a');R(X+10,Y+24,16,12,'#9ef');R(X+5*T-10,Y+24,16,12,'#9ef');txt('HOME',X+3*T,Y+20,'#743',8,'center');
  // dome ribs
  cx.strokeStyle='#ffe6c033';cx.lineWidth=1;cx.beginPath();cx.ellipse(14*T-ox,10*T-oy,14*T,10*T,0,0,6.3);cx.stroke();for(let i=1;i<6;i++){cx.beginPath();cx.ellipse(14*T-ox,10*T-oy,14*T*i/6,10*T,0,0,6.3);cx.stroke()}}
 if(G.zone=='city'){const B=[[2,8,'RED DUST CAFE','#a33','#f80'],[11,18,'SUPPLY & TECH','#245','#0ff'],[20,27,'COMMUNITY CTR','#425','#f0f']];
  for(const[a,b,n,c,neon]of B){const X=a*T-ox,Y=T-oy,w=(b-a+1)*T;R(X,Y-10,w,5*T+10,c);R(X,Y-10,w,3,neon);R(X,Y+5*T-3,w,3,'#0006');
   for(let i=8;i<w-8;i+=20)R(X+i,Y+30,12,14,tick%60<30?'#ffd8':'#ffd6');R(X+w/2-8,Y+4*T-4,16,T+4,'#111');R(X+w/2-8,Y+4*T-4,16,2,neon);txt(n,X+w/2,Y+12,neon,8,'center')}}}
function chr(X,Y,body,hair,dir,mv,suit){const b=mv?Math.sin(anim*3)>0?1:0:0;R(X+3,Y+14,10,3,'#0004');
 R(X+4,Y+10+b,3,5,'#333');R(X+9,Y+10-b+1,3,5,'#333');R(X+3,Y+5,10,7,body);R(X+3,Y+5,10,1,'#fff4');
 R(X+4,Y-2,8,8,suit?'#cde':'#f2c49b');R(X+4,Y-3,8,3,hair);if(dir!=0){R(X+(dir==3?5:dir==1?9:5),Y+1,1,2,'#000');if(dir==2)R(X+9,Y+1,1,2,'#000')}else R(X+4,Y-2,8,5,hair);
 if(suit){cx.strokeStyle='#bff8';cx.beginPath();cx.arc(X+8,Y+2,7,0,6.3);cx.stroke();R(X+11,Y+6,3,5,'#888')}}
function draw(){const z=G.zone,m=map(),mw=m[0].length*T,mh=m.length*T;
 let ox=Math.round(Math.max(0,Math.min(mw-W,G.px-W/2))),oy=Math.round(Math.max(0,Math.min(mh-H,G.py-H/2)));if(mw<W)ox=-(W-mw)/2;
 R(0,0,W,H,PAL[z].bg);
 if(z=='surf'){for(let i=0;i<40;i++)R((hash(i,1)%W),(hash(1,i)%60),1,1,'#fff8')}
 const x0=Math.max(0,Math.floor(ox/T)),y0=Math.max(0,Math.floor(oy/T)),x1=Math.min(m[0].length,x0+W/T+2),y1=Math.min(m.length,y0+H/T+2);
 const draws=[];
 for(let y=y0;y<y1;y++)for(let x=x0;x<x1;x++){const t=m[y][x],X=x*T-ox,Y=y*T-oy;if(z=='surf'&&t=='R'){R(X,Y,T,T,'#5e1c2e');draws.push([Y+T,()=>tile(z,t,x,y,X,Y)])}else if(t=='T'||t=='L')draws.push([Y+T,()=>tile(z,t,x,y,X,Y)]),tile(z,'g',x,y,X,Y)||(z=='city'&&R(X,Y,T,T,'#33243a'));else tile(z,t,x,y,X,Y);
  if(z=='farm'){const ft=G.tiles[x+','+y];if(ft){R(X+1,Y+1,14,14,ft.w?'#4a2414':'#7a3e20');for(let i=3;i<14;i+=4)R(X+2,Y+i,12,1,'#0003');
   if(ft.c){const c=CROPS[ft.c],st=Math.min(ft.g/c.days,1);if(st<.3){R(X+7,Y+8,2,4,'#6c3')}else if(st<1){R(X+7,Y+5,2,8,'#5b3');R(X+4,Y+6,4,2,'#7d4');R(X+9,Y+8,4,2,'#7d4')}else{R(X+7,Y+4,2,9,'#5b3');R(X+3,Y+3,10,6,'#6c4');R(X+5,Y+4,6,5,c.c);R(X+6,Y+4,2,2,'#fff8')}}}}}
 drawBuildings(ox,oy);
 const mvng=keys.arrowleft||keys.arrowright||keys.arrowup||keys.arrowdown||keys.w||keys.a||keys.s||keys.d||joy.on;
 draws.push([G.py+8-oy,()=>{chr(G.px-8-ox,G.py-8-oy,z=='surf'?'#e84':'#2a6',z=='surf'?'#e84':'#a42',G.dir,mvng,z=='surf');
  if(swing){const d=[[0,-1],[1,0],[0,1],[-1,0]][G.dir],c=ITEMS[cur()?cur()[0]:'pick'].c;R(G.px-ox+d[0]*10-2,G.py-oy+d[1]*10,5,5,c)}}]);
 if(z=='city')npcs.forEach(n=>{if(G.spouse!=n.id)draws.push([n.py+16-oy,()=>{chr(n.px-ox,n.py-oy,n.body,n.hair,2,0);txt(n.n,n.px+8-ox,n.py-6-oy,'#fff',7,'center')}])});
 if(z=='farm'){draws.push([robot.py+16-oy,()=>{const X=robot.px-ox,Y=robot.py-oy;R(X+3,Y+12,10,3,'#0004');R(X+3,Y+2,10,9,'#ccc');R(X+5,Y+4,6,3,'#123');R(X+6,Y+5,1,1,tick%40<20?'#0ff':'#088');R(X+9,Y+5,1,1,'#0ff');R(X+7,Y-2,2,4,'#999');R(X+7,Y-3,2,1,'#f40');R(X+4,Y+11,3,3,'#555');R(X+9,Y+11,3,3,'#555')}]);
  if(G.spouse){const n=npcs.find(q=>q.id==G.spouse);n.px=8*T;n.py=7*T;draws.push([n.py+16-oy,()=>{chr(n.px-ox,n.py-oy,n.body,n.hair,2,0);txt('♥ '+n.n,n.px+8-ox,n.py-6-oy,'#f8a',7,'center')}])}}
 if(z=='surf')for(const e of G.ents){const X=e.x-ox,Y=e.y-oy;if(X<-20||X>W+20||Y<-30||Y>H+20)continue;
  if(e.k=='ore')draws.push([Y+6,()=>{const c=e.t=='crys'?['#2cc','#8ff','#055']:['#865','#ba8','#432'];R(X-7,Y+2,14,4,'#0005');R(X-6,Y-6,12,10,c[2]);R(X-5,Y-8,5,10,c[0]);R(X+1,Y-11,4,13,c[0]);R(X-4,Y-7,2,4,c[1]);R(X+2,Y-10,1,5,c[1])}]);
  if(e.k=='plant'){const g=Math.sin(tick/15+e.x)*.5+.5;draws.push([Y+4,()=>{cx.fillStyle=e.t=='glowcap'?`rgba(150,255,100,${.15+g*.2})`:`rgba(200,140,255,${.15+g*.2})`;cx.beginPath();cx.arc(X,Y-2,9,0,6.3);cx.fill();R(X-1,Y-4,2,7,'#3a5');if(e.t=='glowcap'){R(X-4,Y-7,8,3,'#9f6');R(X-2,Y-8,4,1,'#dfb')}else{R(X-4,Y-6,3,3,'#c8f');R(X+1,Y-6,3,3,'#c8f');R(X-1,Y-8,2,3,'#fdf')}}])}
  if(e.k=='bug')draws.push([Y+4,()=>{const f=tick%20<10;R(X-6,Y+3,12,3,'#0005');R(X-5,Y-4,10,7,e.cd>40?'#fff':'#7a3ccf');R(X-3,Y-6,6,3,'#b8f');R(X-4,Y-3,2,2,'#f22');R(X+2,Y-3,2,2,'#f22');R(X-7,Y+(f?-1:1),2,1,'#cbf');R(X+5,Y+(f?1:-1),2,1,'#cbf');R(X-1,Y-9,2,3,'#dcf')}])}
 draws.sort((a,b)=>a[0]-b[0]).forEach(d=>d[1]());
 P.forEach(p=>R(p.x-ox,p.y-oy,2,2,p.c));
 // lighting
 const hr=G.time/60;let dark=hr<18?0:Math.min(.55,(hr-18)/6*.55);if(z=='surf')dark+=.15;
 if(z=='farm'){cx.fillStyle='rgba(255,140,40,.08)';cx.fillRect(0,0,W,H)}if(z=='city'){cx.fillStyle='rgba(60,0,90,.12)';cx.fillRect(0,0,W,H)}
 if(dark>0){cx.fillStyle=`rgba(10,0,30,${dark})`;cx.fillRect(0,0,W,H)}
 if(z=='surf'){const g=cx.createRadialGradient(G.px-ox,G.py-oy,30,G.px-ox,G.py-oy,200);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(20,0,20,.6)');cx.fillStyle=g;cx.fillRect(0,0,W,H)}
 hud();}
function bar(x,y,v,c,l){R(x,y,52,6,'#0008');R(x+1,y+1,50*v/100,4,c);txt(l,x+54,y+6,'#fff',7)}
function hud(){const z={farm:'Dome Farm',city:'New Cydonia',surf:'Martian Surface'}[G.zone];
 R(2,2,112,G.zone=='surf'?44:30,'#000a');const h=Math.floor(G.time/60)%24,mm=G.time%60;txt(`Sol ${G.day}  ${String(h).padStart(2,'0')}:${String(mm).padStart(2,'0')}`,6,11,'#ffd27a');
 txt(G.money+'cr',110,11,'#7f7',8,'right');bar(6,15,G.energy,'#fc3','EN');txt(z,6,H-26,'#fff8',7);
 if(G.zone=='surf'){bar(6,24,G.o2,'#3cf','O2');bar(6,33,G.hp,'#f44','HP')}else bar(6,24,G.hp,'#f44','HP');
 R(W-38,2,36,14,'#000a');txt('SAVE',W-20,12,'#8ff',8,'center');
 // hotbar
 const hx=W/2-100;for(let i=0;i<10;i++){const X=hx+i*20,Y=H-20;R(X,Y,18,18,i==G.sel?'#ffd27a':'#0009');R(X+1,Y+1,16,16,'#2a1a2a');const s=G.inv[i];if(s){const it=ITEMS[s[0]];icon(s[0],X+2,Y+2);if(!it.tool)txt(s[1],X+16,Y+17,'#fff',7,'right')}}
 const s=cur();if(s)txt(ITEMS[s[0]].n,W/2,H-23,'#fff',8,'center');
 // touch controls
 if(joy.on){cx.globalAlpha=.4;cx.fillStyle='#fff';cx.beginPath();cx.arc(joy.ox,joy.oy,24,0,6.3);cx.fill();cx.globalAlpha=.7;cx.beginPath();cx.arc(joy.ox+joy.dx*24,joy.oy+joy.dy*24,10,0,6.3);cx.fill();cx.globalAlpha=1}
 else if(touchUI){cx.globalAlpha=.25;cx.strokeStyle='#fff';cx.beginPath();cx.arc(50,H-60,24,0,6.3);cx.stroke();cx.globalAlpha=1;txt('move',50,H-57,'#fff6',7,'center')}
 if(touchUI)for(const k in BTN){const b=BTN[k];cx.globalAlpha=btnDown[k]?.9:.5;cx.fillStyle=k=='A'?'#e63':k=='B'?'#3ac':'#7a4';cx.beginPath();cx.arc(b.x,b.y,b.r,0,6.3);cx.fill();cx.globalAlpha=1;txt(b.l,b.x,b.y+3,'#fff',7,'center')}
 if(toastT)txt(toastS,W/2,30,'#fff',8,'center');
 if(modal){const m=modal,by=H-70;R(10,by,W-20,66,'#140a1cee');R(10,by,W-20,2,'#f6a');txt(m.name,16,by+11,'#ffd27a');wrap(m.text,16,by+22,W-40);
  if(m.opts.length>1)m.opts.forEach((o,i)=>txt((i==m.sel?'▶ ':'  ')+o.t,i<4?16:W/2,by+33+(i%4)*9+ (i>=4?0:0),i==m.sel?'#0ff':'#ccc',8));else txt('▶ tap / press to continue',W-20,by+62,'#8ff',7,'right')}}
function wrap(s,x,y,w){cx.font='8px monospace';const ws=s.split(' ');let l='';for(const t of ws){if(cx.measureText(l+t).width>w){txt(l,x,y,'#fff');y+=9;l=''}l+=t+' '}txt(l,x,y,'#fff')}
function icon(id,X,Y){const c=ITEMS[id].c;
 if(id=='hoe'){R(X+3,Y+3,2,11,'#864');R(X+3,Y+2,8,3,c)}else if(id=='can'){R(X+3,Y+5,9,7,c);R(X+11,Y+4,3,2,c);R(X+4,Y+3,5,2,'#48a')}
 else if(id=='pick'){R(X+6,Y+3,2,11,'#864');R(X+2,Y+2,10,2,c);R(X+1,Y+4,2,2,c);R(X+11,Y+4,2,2,c)}else if(id=='blade'){R(X+6,Y+1,3,10,c);R(X+7,Y+2,1,8,'#fff');R(X+4,Y+11,7,2,'#666');R(X+6,Y+13,3,2,'#333')}
 else if(id.startsWith('s_')){R(X+3,Y+2,9,11,'#ddc');R(X+5,Y+5,5,5,c)}else{R(X+3,Y+3,10,9,c);R(X+4,Y+4,3,2,'#fff6')}}
// (fix: building() placeholder above would shadow; reassign real fn)
let touchUI='ontouchstart' in window;addEventListener('touchstart',()=>touchUI=true,{once:true});
// debug/test hook
window.FM={G,go:(z)=>{if(z=='surf')go('surf',21.5,28);else if(z=='city')go('city',3,10);else go('farm',12,9)},sleep};
if(G.day==1&&!localStorage.getItem('farmmars_intro')){localStorage.setItem('farmmars_intro',1);say('Welcome to Farm Mars','Sol 1, year 2091. You inherited a dome farm outside New Cydonia. Till soil (Hoe + USE), plant seeds, water daily, sleep at your Home. East exit leads to the city; the north airlock leads to the surface.')}
function loop(){update();draw();requestAnimationFrame(loop)}loop();
