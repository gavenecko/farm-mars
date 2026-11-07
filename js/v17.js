// Farm Mars v20 - door/corner assist + tap-a-door auto-walk, Debug menu (sandbox, warp, time, events, people, viewers, give, cheats), Memory Album
(()=>{
const DBG=window.DBG={open:false,god:false,inf:false,noclip:false,grid:false,replay:null};
// ---------- movement assist: slide around wall corners so 1-tile doors are easy to hit with a joystick ----------
function inVec(){let dx=(keys.arrowright||keys.d?1:0)-(keys.arrowleft||keys.a?1:0),dy=(keys.arrowdown||keys.s?1:0)-(keys.arrowup||keys.w?1:0);if(joy.on&&Math.hypot(joy.dx,joy.dy)>.2){dx=joy.dx;dy=joy.dy}return[dx,dy]}
function assist(){const[dx,dy]=inVec(),ax=Math.abs(dx),ay=Math.abs(dy);if(ax<.1&&ay<.1)return;
 if(ay>ax*1.6){const ny=G.py+Math.sign(dy)*1.3+(dy>0?1:-4);if(!(solidAt(G.px-4,ny)||solidAt(G.px+4,ny)))return;const c0=Math.floor(G.px/T)*T+8;
  for(const c of[c0,c0-T,c0+T].sort((a,b)=>Math.abs(a-G.px)-Math.abs(b-G.px))){const d=c-G.px;if(Math.abs(d)>11)continue;if(solidAt(c-4,ny)||solidAt(c+4,ny))continue;const sx=G.px+Math.sign(d)*Math.min(1.25,Math.abs(d));if(!solidAt(sx+Math.sign(d)*5,G.py-3)&&!solidAt(sx+Math.sign(d)*5,G.py)){G.px=sx}return}}
 else if(ax>ay*1.6){const nx=G.px+Math.sign(dx)*1.3+(dx>0?5:-5);if(!(solidAt(nx,G.py-3)||solidAt(nx,G.py)))return;const c0=Math.floor(G.py/T)*T+10;
  for(const c of[c0,c0-T,c0+T].sort((a,b)=>Math.abs(a-G.py)-Math.abs(b-G.py))){const d=c-G.py;if(Math.abs(d)>11)continue;if(solidAt(nx,c-3)||solidAt(nx,c))continue;const sy=G.py+Math.sign(d)*Math.min(1.25,Math.abs(d));if(!solidAt(G.px-4,sy+(d>0?1:-4))&&!solidAt(G.px+4,sy+(d>0?1:-4)))G.py=sy;return}}}
// ---------- tap a door to walk to it ----------
let AUTO=null;
function pass(tx,ty,g){const t=tileAt(tx,ty);if(t===undefined)return false;if(g&&tx==g[0]&&ty==g[1])return true;if('XDMuv'.includes(t))return false;return feetFree(tx*T+8,ty*T+8)}
function bfs(s,g){const m=curMap(),w=m[0].length,h=m.length,K=(x,y)=>y*w+x,prev=new Map([[K(...s),-1]]),q=[s];while(q.length){const[x,y]=q.shift();if(x==g[0]&&y==g[1]){const p=[];let c=K(x,y);while(c!=-1){p.unshift([c%w,Math.floor(c/w)]);c=prev.get(c)}return p}
 for(const[a,b]of[[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+a,ny=y+b;if(nx<0||ny<0||nx>=w||ny>=h||prev.has(K(nx,ny))||!pass(nx,ny,g))continue;prev.set(K(nx,ny),K(x,y));q.push([nx,ny])}}return null}
function camO(){const m=curMap(),mw=m[0].length*T,mh=m.length*T;let ox=Math.round(CAM.x),oy=Math.round(CAM.y);if(mw<W)ox=Math.round((mw-W)/2);if(mh<H)oy=Math.round((mh-H)/2);return[ox,oy]}
function autoStep(){const a=AUTO;if(joy.on&&joy.id!='auto'){AUTO=null;return}if(modal||menu||CUT){AUTO=null;return}const p=a.p[a.i];if(!p){AUTO=null;return}const last=a.i==a.p.length-1,tx=p[0]*T+8,ty=p[1]*T+(last?(p[1]*T+8>G.py?14:4):8),dx=tx-G.px,dy=ty-G.py,d=Math.hypot(dx,dy);
 if(d<1.5&&!last){a.i++;return}if(++a.t>900){AUTO=null;return}joy={on:true,id:'auto',ox:0,oy:0,dx:dx/Math.max(d,1),dy:dy/Math.max(d,1)}}
window.FM17={bfs,pass,auto:()=>AUTO,walkToDoor(tx,ty){const p=bfs([Math.floor(G.px/T),Math.floor(G.py/T)],[tx,ty]);if(!p)return false;AUTO={p,i:1,t:0,z:G.zone};return true}};
{const _ot=onTap;onTap=function(x,y){const r=_ot(x,y);if(r||!G||TITLE||modal||menu||CUT||DBG.open)return r;const[ox,oy]=camO(),tx=Math.floor((x+ox)/T),ty=Math.floor((y+oy)/T);
 for(const[a,b]of[[0,0],[0,1],[0,-1]]){if(tileAt(tx+a,ty+b)=='D'&&DOORS[G.zone+':'+(tx+a)+','+(ty+b)]||tileAt(tx+a,ty+b)=='D'&&EXITS[G.zone]){if(FM17.walkToDoor(tx+a,ty+b)){sfx('menu');toast('Walking to the door...');return true}}}return r}}
// ---------- update hook: debug pause, cheats, assist, auto-walk, non-destructive replays ----------
{const _u=update;update=function(){if(DBG.open)return;if(G&&!TITLE){if(DBG.inf){G.energy=G.maxEn;G.o2=100}if(DBG.god)G.hp=Math.max(G.hp,G.maxHp||100)}
 const play=G&&!TITLE&&!modal&&!menu&&!CUT&&!DBG.open;if(play&&AUTO)autoStep();if(play&&!DBG.noclip)assist();const z=G&&G.zone;_u();if(joy.id=='auto'){joy={on:false,id:null,ox:0,oy:0,dx:0,dy:0};if(AUTO&&G.zone!=AUTO.z)AUTO=null}
 if(DBG.replay&&G&&!modal&&!CUT&&!(window.FM16&&FM16.state().sc)&&!(window.FM18&&(FM18.state().lg||FM18.state().derby))&&++DBG.replay.t>3)endReplay()}}
{const _h=hurt;hurt=function(d,f){if(DBG.god)return;return _h(d,f)}}
{const _s=solidAt;solidAt=function(x,y){if(DBG.noclip&&G&&Math.abs(x-G.px)<12&&Math.abs(y-G.py)<12&&tileAt(Math.floor(x/T),Math.floor(y/T))!==undefined)return false;return _s(x,y)}}
{const _sv=save;save=function(q){if(DBG.replay)return;return _sv(q)}}
function replay(fn){closeDbg();const snap=JSON.stringify(G);DBG.replay={snap,t:0,zone:G.zone,px:G.px,py:G.py,time:G.time,day:G.day};modal=null;menu=null;try{fn()}catch(e){console.error(e);endReplay();throw e}}
function endReplay(){const r=DBG.replay;DBG.replay=null;if(window.FM16&&FM16.state().sc)return;const z=G.zone;G=JSON.parse(r.snap);if(z!=G.zone||z=='mine'){if(r.zone=='mine'||r.zone=='valles')boot();else enter(r.zone,Math.floor(r.px/T),Math.floor(r.py/T))}G.px=r.px;G.py=r.py;placeNPCs(true);lastHour=-1;toast('Replay finished - save untouched')}
// ---------- draw: collision grid, sandbox banner, system-menu rows, title chip ----------
{const _d=draw;draw=function(){_d.apply(this,arguments);
 if(TITLE){panel(4,4,52,13,'#140a1cd0','#7a4a8a');txt('🐞 Debug',30,13,'#cfe',6,'center');txt('v20',W-6,H-4,'#fff6',5,'right');return}if(!G)return;
 if(DBG.grid){const[ox,oy]=camO(),m=curMap();for(let y=Math.max(0,Math.floor(oy/T));y<Math.min(m.length,Math.ceil((oy+H)/T));y++)for(let x=Math.max(0,Math.floor(ox/T));x<Math.min(m[0].length,Math.ceil((ox+W)/T));x++){const t=m[y][x];if('XDMuv'.includes(t))R(x*T-ox,y*T-oy,T,T,'#ffd23a55');else if(solidAt(x*T+8,y*T+8))R(x*T-ox,y*T-oy,T,T,'#ff303040')}R(G.px-5-ox,G.py-3-oy,10,3,'#00ff88aa')}
 if(G.dbgSandbox)txt('DEBUG SANDBOX',W/2,H-3,'#7fffd4',5,'center');
 if(menu&&menu.tab=='system'){[['Memory Album (event art)',9],['🐞 Debug menu',10]].forEach(([l],i)=>{const y=36+(8+i)*18;panel(60,y,W-120,15,'#1a0e24',i?'#3a8a7a':'#8a4a7a');txt(l,W/2,y+11,i?'#bfe':'#fcd',8,'center')})}}}
{const _mt=menuTap;menuTap=function(x,y){if(menu&&menu.tab=='system'&&x>60&&x<W-60){const i=Math.floor((y-36)/18);if(i==8){album();return}if(i==9){openDbg();return}}return _mt(x,y)}}
{const _tt=titleTap;titleTap=function(x,y){if(x<58&&y<20){openDbg();return}return _tt(x,y)}}

// ---------- DOM debug UI ----------
let el=null,body=null,tabs=null,cur='Warp';
const css=`#dbg{position:fixed;inset:0;z-index:50;background:#0d0716f2;color:#eee;font:15px/1.3 system-ui,sans-serif;display:flex;flex-direction:column}
#dbg header{display:flex;gap:6px;padding:6px;overflow-x:auto;background:#1c0f2a;flex:none;align-items:center}
#dbg header button{flex:none}#dbg .bd{flex:1;overflow-y:auto;padding:8px 10px 40px;-webkit-overflow-scrolling:touch}
#dbg button{min-height:44px;min-width:44px;padding:6px 12px;margin:3px;border-radius:10px;border:1px solid #7a4a8a;background:#2a1640;color:#fff;font:inherit}
#dbg button.on{background:#2f7a5a;border-color:#7fd}#dbg button.tab{background:#1c0f2a}#dbg button.tab.on{background:#7a3a8a}#dbg button.x{background:#7a1a2a;margin-left:auto}
#dbg h3{margin:12px 0 4px;font-size:14px;color:#ffb0d8;text-transform:uppercase;letter-spacing:.05em}#dbg .row{display:flex;flex-wrap:wrap;align-items:center}
#dbg .warn{background:#3a2a0a;border:1px solid #c90;border-radius:10px;padding:10px;margin:8px 0}#dbg input{font:inherit;padding:10px;border-radius:10px;border:1px solid #7a4a8a;background:#1a0e24;color:#fff;width:100%;box-sizing:border-box}
#dbg .grid{display:flex;flex-wrap:wrap;gap:6px}#dbg .grid figure{margin:0;text-align:center;font-size:11px}#dbg .grid img{height:110px;border-radius:8px;background:#2a1640}#dbg canvas{image-rendering:pixelated}
#dbg .cg img{width:100%;max-width:520px;border-radius:10px;display:block;margin:4px 0}`;
function h(tag,props={},...kids){const e=document.createElement(tag);for(const k in props){if(k=='on')e.onclick=props[k];else if(k=='cls')e.className=props[k];else e[k]=props[k]}for(const c of kids)if(c!=null)e.append(c);return e}
function B(label,fn,on){return h('button',{cls:on?'on':'',textContent:label,on:()=>{try{fn()}catch(e){console.error(e);toastD('Error: '+e.message)}if(el&&DBG.open)render()}})}
function sec(t,...k){return[h('h3',{textContent:t}),h('div',{cls:'row'},...k)]}
function toastD(s){toast(s);const t=h('div',{textContent:s,style:'position:fixed;bottom:14px;left:50%;transform:translateX(-50%);background:#2f7a5a;padding:10px 16px;border-radius:12px;z-index:60'});document.body.append(t);setTimeout(()=>t.remove(),1600)}
function openDbg(){if(!el){document.head.append(h('style',{textContent:css}));el=h('div',{id:'dbg'});tabs=h('header');body=h('div',{cls:'bd'});el.append(tabs,body);document.body.append(el)}el.style.display='flex';DBG.open=true;joy={on:false,id:null,ox:0,oy:0,dx:0,dy:0};render()}
function closeDbg(){if(el)el.style.display='none';DBG.open=false}
const TABS=['Warp','Time','Events','People','View','Give','Cheats'];
function render(){tabs.innerHTML='';const ready=G&&!TITLE&&G.dbgSandbox||G&&!TITLE&&DBG.direct;
 tabs.append(h('b',{textContent:'🐞 Debug',style:'padding:0 6px;color:#7fd;flex:none'}));if(ready)for(const t of TABS)tabs.append(h('button',{cls:'tab'+(t==cur?' on':''),textContent:t,on:()=>{cur=t;render()}}));tabs.append(h('button',{cls:'x',textContent:'Close ✕',on:closeDbg}));
 body.innerHTML='';body.scrollTop=0;if(!ready){gate();return}const f={Warp:warp,Time:time,Events:events,People:people,View:view,Give:give,Cheats:cheats}[cur];body.append(...f().flat())}
function gate(){const inGame=G&&!TITLE;body.append(h('div',{cls:'warn',innerHTML:'<b>Debug changes are kept away from your real save.</b><br>The <b>Debug Sandbox</b> copies '+(inGame?'your current game':'Slot 1 (or a fresh farm)')+' into a temporary slot. Anything you do there - warps, cheats, items, events - never touches your saves. Leave it any time from the Cheats tab.'}),
  B('▶ Start Debug Sandbox (recommended)',startSandbox));
 if(inGame)body.append(h('div',{cls:'warn',innerHTML:'⚠ <b>Edit this save directly</b>: changes (items, hearts, days...) are written into slot '+SLOT+' the next time the game saves. Event replays are still non-destructive.'}),B('Edit current save (risky)',()=>{if(confirm('Debug changes will be saved into your real slot '+SLOT+'. Continue?'))DBG.direct=true}))}
function startSandbox(){let src;if(G&&!TITLE){save(true);src=JSON.parse(JSON.stringify(G));src.dbgSandbox=SLOT}else{try{src=JSON.parse(localStorage.getItem(slotKey(1)))}catch(e){}if(!src||src.v!=2)src=newGame();src.dbgSandbox=1}
 delete src.migrated;localStorage.setItem(slotKey('dbg'),JSON.stringify(src));startSlot('dbg');G.dbgSandbox=G.dbgSandbox||1;CUT=null;modal=null;DBG.direct=false;toastD('Debug Sandbox started - your saves are safe');cur='Warp'}
function leaveSandbox(){localStorage.removeItem(slotKey('dbg'));DBG.god=DBG.inf=DBG.noclip=DBG.grid=false;closeDbg();modal=null;menu=null;CUT=null;TITLE=true}
// ---- sections ----
function spawnIn(z){for(const k in DOORS){const d=DOORS[k];if(d[0]==z)return[d[1],d[2]]}const S={farm:[13,9],city:[16,14],surf:[50,9],valles:[1,18],phobos:[6,5],port:[6,5]};if(S[z])return S[z];const m=MAPS[z];for(let r=0;r<200;r++){const x=1+Math.floor(Math.random()*(m[0].length-2)),y=1+Math.floor(Math.random()*(m.length-2));if(!isSolid(z,m[y][x])&&!'XDMuv'.includes(m[y][x]))return[x,y]}return[2,2]}
function go(z){closeDbg();modal=null;CUT=null;const[x,y]=spawnIn(z);if(z=='valles'){enter('valles',1,18,1);return}enter(z,x,y,2);unstick(false)}
const ZN={farm:'Farm',city:'New Cydonia (city)',home:'Your habitat',cafe:'Cafe',shop:'Shop',cc:'Community Center',surf:'Mars surface',valles:'Valles Canyon',clinic:'Clinic',bar:'The Airlock (bar)',port:'Shuttle Port',phobos:'Phobos Station',biopod:'Bio-Pod',museum:'Museum'};
function warp(){const zs=Object.keys(MAPS);return[sec('Outdoors & town',...zs.filter(z=>!z.startsWith('h_')).map(z=>B(ZN[z]||z,()=>{if(z=='biopod'&&!G.pod){G.pod=1;G.blobs=G.blobs||[{c:'#7affc8'}];if(typeof applyLayout=='function')applyLayout()}go(z)}))),
 sec('Resident homes',...zs.filter(z=>z.startsWith('h_')).map(z=>B((window.HOMEN&&HOMEN[z])||z,()=>go(z)))),
 sec('Mine floor',...[1,2,3,4,5,8,10,12,15,18,20,25,30].map(f=>B('B'+f,()=>{closeDbg();modal=null;enterMine(f)}))),
 sec('Hellas Rift depth',...[1,2,3,5,8,10].map(f=>B('Rift '+f,()=>{closeDbg();modal=null;G.riftKey=1;enterRift(f)}))),
 sec('Habitat Row doors (stand in front)',...Object.keys(HOMES||{}).filter(id=>!HOMES[id].orbital).map(id=>B(id,()=>{closeDbg();modal=null;const o=HOMES[id].out;enter('city',o[0],o[1],o[1]>HOMES[id].door[1]?0:2)})))]}
function setDay(d){G.day=Math.max(1,d);placeNPCs(true);lastHour=-1}
function time(){const yr0=(year()-1)*28;return[h('div',{textContent:'Now: '+season()+' sol '+solOfSeason()+', year '+year()+' - day '+G.day+', '+String(Math.floor(G.time/60)).padStart(2,'0')+':'+String(G.time%60).padStart(2,'0')+(G.wx?' - weather: '+G.wx:'')}),
 sec('Set hour',...[6,8,10,12,14,17,19,21,23,25].map(hh=>B((hh%24)+':00'+(hh>=24?' (late)':''),()=>{G.time=hh*60;lastHour=-1;placeNPCs(true)}))),
 sec('Day',B('Skip to next morning',()=>{closeDbg();modal=null;sleep()}),B('-1 day',()=>setDay(G.day-1)),B('+1 day',()=>setDay(G.day+1)),B('+7 days',()=>setDay(G.day+7))),
 sec('Season',...SEASONS.map((s,i)=>B(s,()=>setDay(yr0+i*7+((G.day-1)%7)+1),seasonIdx()==i))),
 sec('Sol of season',...[1,2,3,4,5,6,7].map(n=>B(''+n,()=>setDay(yr0+seasonIdx()*7+n),solOfSeason()==n))),
 sec('Weather',B('Clear',()=>{G.wx=null}),B('Dust storm',()=>{G.wx='dust';DUSTD=-1;closeDbg();modal=null;SURF=null;enter('surf',50,9,2)}),B('Rain/other: roll',()=>{const m=rollWeather();if(m)toastD(m)})),
 sec('Festivals & nights (warps to the plaza)',...SEASONS.map((s,i)=>B(['Founders\' Festival','Bloom Fair','Ice Lantern Night','Storm Derby'][i],()=>{setDay(yr0+i*7+7);G.time=10*60;G.feast=0;go('city')})),
  B('Starfall Night',()=>{setDay(yr0+seasonIdx()*7+4);G.time=20*60;closeDbg();modal=null;enter('city',16,12,2)}),B('Colony Day (eve)',()=>{setDay(yr0+28);G.time=18*60;go('city')}))]}
const kidLook={skin:'#e8b48a',hair:'#ff4aa8',style:'bob',top:'#ffd27a',pants:'#5a8ac8'};
function events(){const o=[h('div',{cls:'warn',textContent:'Replays are non-destructive: your game state is snapshotted and restored when the scene ends.'})];
 o.push(sec('Story',B('Intro',()=>replay(()=>playCut('intro',INTRO,()=>{}))),B('Epilogue',()=>replay(()=>playCut('epi',EPI,()=>{}))),B('Colony Day',()=>replay(()=>{G.colony={};colonyDay()})),B('Star Catcher',()=>replay(()=>{G.day=G.day-solOfSeason()+4;G.time=20*60;FM16.scStart()}))));
 o.push(sec('Weddings',...['ava','kai','zara','theo'].map(id=>{const n=NPCS.find(q=>q.id==id);return B(n.n,()=>replay(()=>{G.spouse=id;G.wedDay=G.day;sfx('wed');say('Wedding',['You kneel in the neon plaza and offer the Red Pendant.',n.n.toUpperCase()+': "Yes! A thousand times yes!"','The next sol, the whole colony gathers under the dome lights. You and '+n.n+' are married!'])}))})));
 o.push(sec('Starfall stargazing',...NPCS.map(n=>B(n.n,()=>replay(()=>{G.time=20*60;FM16.stargaze(n)})))));
 o.push(sec('Child',B('Child arrives',()=>replay(()=>{const sp=NPCS.find(q=>q.id==(G.spouse||'ava'));say('Big news!',['You and '+sp.n+' welcome a baby into your habitat! The whole colony sends gifts.'],null,kidLook)}))));
 for(const n of NPCS){const b=[];for(const lv of Object.keys(n.ev||{}).sort((a,b)=>a-b))b.push(B('♥'+lv,()=>replay(()=>say(n.n+' ♥'+lv+' Event',n.ev[lv].slice(),null,n.look))));
  if(typeof EV10!='undefined'&&EV10[n.id])b.push(B('♥10',()=>replay(()=>say(n.n+' ♥ Event',[EV10[n.id][0],EV10[n.id][1]],null,n.look))));
  if(HOMES[n.id]&&HOMES[n.id].ev)b.push(B('Home event',()=>replay(()=>{modal={name:n.n+' - Heart Event',pages:HOMES[n.id].ev.slice(),pi:0,ch:0,opts:null,sel:0,look:n.look,mood:'love'}})));o.push(sec(n.n+' heart events',...b))}
 o.push(sec('CG gallery',...Object.keys(CGT).map(k=>B(CGT[k],()=>replay(()=>FM16.showCG(k,CGT[k],['(Event art preview)']))))));return o}
const CGT={wed_ava:'Wedding - Ava',wed_kai:'Wedding - Kai',wed_zara:'Wedding - Zara',wed_theo:'Wedding - Theo',colony:'Colony Day',starfall:'Starfall (neutral)',sf_ava:'Starfall - Ava',sf_kai:'Starfall - Kai',sf_zara:'Starfall - Zara',sf_theo:'Starfall - Theo'};
function people(){const o=[];for(const n of NPCS){const v=G.hearts[n.id]||0;o.push(sec(n.n+' - '+v.toFixed(1)+' ♥'+(G.spouse==n.id?' (spouse)':G.dating&&G.dating[n.id]?' (dating)':''),B('0',()=>{G.hearts[n.id]=0}),B('-1',()=>{G.hearts[n.id]=Math.max(0,v-1)}),B('+1',()=>{G.hearts[n.id]=Math.min(14,v+1)}),B('6',()=>{G.hearts[n.id]=6}),B('10',()=>{G.hearts[n.id]=10}),
  n.mar?B(G.spouse==n.id?'Divorce':'Marry',()=>{if(G.spouse==n.id){G.spouse=null}else{G.spouse=n.id;G.wedDay=G.day;G.hearts[n.id]=Math.max(10,v);G.dating=G.dating||{};G.dating[n.id]=1}placeNPCs(true)},G.spouse==n.id):null,
  n.mar?B('Dating',()=>{G.dating=G.dating||{};G.dating[n.id]=G.dating[n.id]?0:1},!!(G.dating&&G.dating[n.id])):null,B('Reset events',()=>{for(const k in G.events)if(k.startsWith(n.id)||k=='homeEv_'+n.id)delete G.events[k]})))}
 o.push(sec('Child',B(G.kids?'Remove child':'Add child',()=>{if(G.kids){G.kids=0}else{if(!G.spouse){G.spouse='ava';G.wedDay=G.day}G.kids=1;G.kidDay=G.day-30}},!!G.kids)));
 o.push(sec('All',B('Everyone 10 ♥',()=>{for(const n of NPCS)G.hearts[n.id]=10}),B('Everyone 0 ♥',()=>{for(const n of NPCS)G.hearts[n.id]=0})));return o}
function view(){const o=[];const ws=window.FM15?FM15.WHO:[],ms=window.FM15?FM15.MOODS:[];
 o.push(sec('Portraits (character x mood)'));const g=h('div',{cls:'grid'});for(const w of ws)for(const m of ms)g.append(h('figure',{},h('img',{loading:'lazy',src:'assets/portraits/'+w+'_'+m+'.webp?v=18',alt:w+' '+m}),h('figcaption',{textContent:w+' · '+m})));o.push([g]);
 o.push(sec('Sprites (front, side, back, side + spacesuit)'));const looks=[['You',PLOOK],...NPCS.map(n=>[n.n,n.look]),['Child',kidLook]];const sg=h('div',{cls:'grid'});
 for(const[nm,L]of looks){const c=h('canvas',{width:8*20,height:30});const x=c.getContext('2d');x.imageSmoothingEnabled=false;[2,1,0,3].forEach((d,i)=>{for(const s of[0,1])x.drawImage(charSprite(L,d,(tick>>3)&3,!!s,0),(i+s*4)*20,1)});c.style.width=(8*20*3)+'px';c.style.height='90px';sg.append(h('figure',{},c,h('figcaption',{textContent:nm})))}o.push([sg]);
 o.push(sec('Event art'));const cg=h('div',{cls:'cg'});for(const k in CGT)cg.append(h('div',{},h('b',{textContent:CGT[k]}),h('img',{loading:'lazy',src:'assets/cg/'+k+'.webp?v=26a'})));o.push([cg]);return o}
let filt='';
function give(){const o=[sec('Money',...[1000,10000,100000].map(v=>B('+'+v+'cr',()=>{G.money+=v})),B('Stardust +50',()=>{G.dust=(G.dust||0)+50}))];
 o.push(sec('Unlock',B('Max all skills',()=>{for(const k in G.xp)G.xp[k]=2000}),B('Complete all side quests',()=>{G.sq=G.sq||{};for(const q of SQ)G.sq[q.id]='done'}),B('Fill museum',()=>{G.muse=G.muse||{};for(const i of FM10.MALL)G.muse[i]=1}),B('All achievements',()=>{for(const a of ACH)G.ach[a[0]]=G.day}),
  B('All decor + Deluxe habitat',()=>{G.house=HUPG.length-1;G.decor=G.decor||{};for(const k in FURN)G.decor[k]=1}),B('Bio-Pod',()=>{if(!G.pod){G.pod=1;G.blobs=[{c:'#7affc8'}];if(typeof applyLayout=='function')applyLayout()}}),B('Chart all stars',()=>{G.stars={};for(let i=0;i<12;i++)G.stars[i]=G.day}),B('All recipe ingredients x10',()=>{const s=new Set();for(const r of RECIPES)for(const k in r.in)s.add(k);for(const k of s)add(k,10)})),
  sec('Terraforming stage',...[0,1,2,3].map(n=>B(n?(TERRA[n-1]||{n:'Stage '+n}).n:'None',()=>{G.terra=n;SURF=null},G.terra==n))));
 const inp=h('input',{placeholder:'Search items (e.g. glowcap, pendant, ore)...',value:filt});inp.oninput=()=>{filt=inp.value;list()};const box=h('div',{cls:'row'});
 function list(){box.innerHTML='';const q=filt.toLowerCase();let n=0;for(const id in ITEMS){const it=ITEMS[id];if(q&&!(id+' '+it.n).toLowerCase().includes(q))continue;if(++n>60)break;box.append(h('span',{textContent:it.n,style:'min-width:150px;color:'+(it.c||'#fff')}),B('+1',()=>{add(id,1);toastD('+1 '+it.n)}),B('+10',()=>{add(id,10);toastD('+10 '+it.n)}),h('br'))}if(!n)box.append('No match')}
 list();o.push([h('h3',{textContent:'Items'}),inp,box]);return o}
function cheats(){return[sec('Toggles',B('God mode',()=>{DBG.god=!DBG.god},DBG.god),B('Infinite energy & O2',()=>{DBG.inf=!DBG.inf},DBG.inf),B('No clip',()=>{DBG.noclip=!DBG.noclip},DBG.noclip),B('Show collision grid',()=>{DBG.grid=!DBG.grid},DBG.grid)),
 sec('Player',B('Full heal + energy',()=>{G.hp=G.maxHp||100;G.energy=G.maxEn;G.o2=100}),B('Unstuck',()=>{unstick(true)})),
 sec('Sandbox',G.dbgSandbox?B('Leave Debug Sandbox (back to title)',leaveSandbox):B('Start Debug Sandbox',startSandbox),DBG.direct?h('span',{textContent:'⚠ Editing your real save (slot '+SLOT+')',style:'color:#fc6;margin:6px'}):null)]}
// ---------- Memory Album (player-facing): event art you've seen ----------
function album(){const seen=Object.keys(G.cgSeen||{}).filter(k=>CGT[k]);if(!seen.length){menu=null;say('Memory Album','No memories yet. Weddings, Colony Day and Starfall Night will fill these pages.');return}
 menu=null;say('Memory Album','Choose a memory:',seen.map(k=>({t:CGT[k],f:()=>FM16.showCG(k,'Memory Album',['"'+CGT[k]+'" - a moment you will never forget.'])})).concat([{t:'Close'}]))}
Object.assign(window.FM17,{openDbg,closeDbg,render,startSandbox,leaveSandbox,replay,DBG,CGT,setTab:t=>{cur=t;render()},assist});
})();
