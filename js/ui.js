// Farm Mars v2 - loop, input, rendering, menus
let CRED=null,KIDC=null;
const cv=document.getElementById('c'),cx=cv.getContext('2d');let S=1;
const lc=document.createElement('canvas');lc.width=W;lc.height=H;const lx=lc.getContext('2d');
function resize(){S=Math.min(innerWidth/W,innerHeight/H);cv.width=W;cv.height=H;cv.style.width=W*S+'px';cv.style.height=H*S+'px';cv.style.left=(innerWidth-W*S)/2+'px';cv.style.top=(innerHeight-H*S)/2+'px';cx.imageSmoothingEnabled=false}
addEventListener('resize',resize);addEventListener('orientationchange',()=>setTimeout(resize,200));resize();
function isFS(){return !!(document.fullscreenElement||document.webkitFullscreenElement)}
function toggleFS(){const d=document,el=d.documentElement;try{if(isFS()){(d.exitFullscreen||d.webkitExitFullscreen).call(d)}else{const r=(el.requestFullscreen||el.webkitRequestFullscreen);if(r){const p=r.call(el,{navigationUI:'hide'});const lk=()=>{try{screen.orientation&&screen.orientation.lock&&screen.orientation.lock('landscape').catch(()=>{})}catch(e){}};if(p&&p.then)p.then(lk).catch(()=>toast('Fullscreen not allowed - try Add to Home screen'));else lk()}else toast('Use browser menu: Add to Home screen')}}catch(e){toast('Fullscreen unavailable')}setTimeout(resize,300)}
['fullscreenchange','webkitfullscreenchange'].forEach(ev=>document.addEventListener(ev,()=>setTimeout(resize,100)));
if('serviceWorker' in navigator&&location.protocol!='file:')addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));
const txt=(s,x,y,c='#fff',sz=8,al='left',sh='#000')=>{cx.font=sz+'px monospace';cx.textAlign=al;if(sh){cx.fillStyle=sh;cx.fillText(s,x+1,y+1)}cx.fillStyle=c;cx.fillText(s,x,y)};
const R=(x,y,w,h,c)=>px(cx,x,y,w,h,c);
function panel(x,y,w,h,c='#140a1ce8',b='#ff6aa8'){R(x,y,w,h,b);R(x+1,y+1,w-2,h-2,c);R(x+1,y+1,w-2,1,'#fff2')}
// ---------- input ----------
const keys={};let joy={on:false,id:null,ox:0,oy:0,dx:0,dy:0},touchUI='ontouchstart' in window,btnFx={};
const BTN={A:{x:W-36,y:H-62,r:23},B:{x:W-82,y:H-30,r:18}};const HB={x:62,y:H-22,s:21};
function firstInput(){auInit();AU.music=G.music;AU.sfx=G.sfx;if(AU.ctx&&AU.ctx.state=='suspended')AU.ctx.resume()}
addEventListener('keydown',e=>{firstInput();const k=e.key.toLowerCase();if(keys[k])return;keys[k]=1;if(CRED){if(CRED.t>40)endCredits();return}if(TITLE){if(k=='c')rollCredits('title');if(k>='1'&&k<='3')startSlot(+k);if(k=='enter'||k==' ')startSlot(1);if(k=='f')toggleFS();return}if(['arrowup','arrowdown',' ','tab'].includes(k))e.preventDefault();
 if(modal){if(k=='arrowup'||k=='w')modal.sel=Math.max(0,modal.sel-1),sfx('menu');else if(k=='arrowdown'||k=='s')modal.sel=Math.min((modal.opts||[1]).length-1,modal.sel+1),sfx('menu');else if([' ','enter','e','j','k'].includes(k))modalAdvance(-1);return}
 if(k=='m'||k=='escape'||k=='i'){menu?closeMenu():openMenu('bag');return}if(menu){if(k=='q')menuTab(-1);if(k=='e')menuTab(1);return}
 if(k==' '||k=='j')act();if(k=='e'||k=='k')interact();if(k=='q')G.sel=(G.sel+9)%10;if(k=='tab')G.sel=(G.sel+1)%10;if(k>='1'&&k<='9')G.sel=+k-1;if(k=='0')G.sel=9});
addEventListener('keyup',e=>keys[e.key.toLowerCase()]=0);
function toGame(t){const r=cv.getBoundingClientRect();return[(t.clientX-r.left)/S,(t.clientY-r.top)/S]}
function onTap(x,y){firstInput();if(CRED){if(CRED.t>40)endCredits();return true}if(TITLE){titleTap(x,y);return true}if(modal){modalTap(x,y);return true}if(menu){menuTap(x,y);return true}
 if(x>W-68&&x<W-48&&y<22){toggleFS();return true}if(x>W-46&&y<22){openMenu('bag');sfx('menu');return true}
 if(y>HB.y-2&&x>=HB.x&&x<HB.x+10*HB.s){G.sel=Math.floor((x-HB.x)/HB.s);sfx('menu');return true}
 for(const k in BTN){const b=BTN[k];if(Math.hypot(x-b.x,y-b.y)<b.r+6){btnFx[k]=8;k=='A'?act():interact();return true}}return false}
cv.addEventListener('touchstart',e=>{e.preventDefault();touchUI=true;for(const t of e.changedTouches){const[x,y]=toGame(t);if(onTap(x,y))continue;if(x<W*.55&&!joy.on)joy={on:true,id:t.identifier,ox:x,oy:y,dx:0,dy:0}}},{passive:false});
cv.addEventListener('touchmove',e=>{e.preventDefault();for(const t of e.changedTouches)if(t.identifier==joy.id){const[x,y]=toGame(t);let dx=x-joy.ox,dy=y-joy.oy,d=Math.hypot(dx,dy);if(d>26){joy.ox+=dx*(1-26/d);joy.oy+=dy*(1-26/d);dx*=26/d;dy*=26/d}joy.dx=dx/26;joy.dy=dy/26}},{passive:false});
const tend=e=>{for(const t of e.changedTouches)if(t.identifier==joy.id)joy={on:false,id:null,dx:0,dy:0}};cv.addEventListener('touchend',tend);cv.addEventListener('touchcancel',tend);
cv.addEventListener('mousedown',e=>{if(touchUI)return;const[x,y]=toGame(e);onTap(x,y)});
// ---------- modal ----------
function modalLast(){return modal.pi>=modal.pages.length-1}
function modalAdvance(i){const m=modal,pg=m.pages[m.pi];if(m.ch<pg.length){m.ch=pg.length;return}if(!modalLast()){m.pi++;m.ch=0;sfx('talk');return}
 if(m.opts){const o=m.opts[i<0?m.sel:i];if(!o)return;modal=null;sfx('menu');if(o.f)o.f()}else modal=null}
function optRect(i){const m=modal,n=m.opts.length,w=232,x=W-8-w,y0=H-62-n*15;return[x,y0+i*15,w,14]}
function modalTap(x,y){const m=modal;if(m.opts&&modalLast()&&m.ch>=m.pages[m.pi].length){for(let i=0;i<m.opts.length;i++){const[a,b,w,h]=optRect(i);if(x>=a&&x<=a+w&&y>=b-1&&y<=b+h+1){m.sel=i;modalAdvance(i);return}}return}modalAdvance(-1)}
// ---------- menu screen ----------
const TABS=['bag','craft','social','skills','system'];
function openMenu(t){menu={tab:t,pick:null,confirm:0};joy={on:false}}function closeMenu(){menu=null;sfx('menu')}
function menuTab(d){menu.tab=TABS[(TABS.indexOf(menu.tab)+d+TABS.length)%TABS.length];sfx('menu')}
function menuTap(x,y){if(x>W-40&&y<34){closeMenu();return}if(y>14&&y<32){const i=Math.floor((x-20)/62);if(i>=0&&i<TABS.length){menu.tab=TABS[i];menu.pick=null;sfx('menu')}return}
 if(menu.tab=='bag'){const i=slotAt(x,y);if(i<0)return;if(menu.pick==null){menu.pick=i;if(i<10)G.sel=i}else{const a=G.inv[menu.pick];G.inv[menu.pick]=G.inv[i];G.inv[i]=a;menu.pick=null}sfx('menu')}
 if(menu.tab=='craft'){const i=Math.floor((y-40)/18),P=craftPage();if(P.n>1&&i==7){CRPG=(CRPG+1)%P.n;sfx('menu')}else if(i>=0&&i<P.rs.length)craft(P.rs[i])}
 if(menu.tab=='system'){const i=Math.floor((y-36)/18);if(i==0){G.music=AU.music=!G.music}if(i==1){G.sfx=AU.sfx=!G.sfx}if(i==2)save();if(i==5)toggleFS();if(i==6){save(true);menu=null;TITLE=true;return}if(i==7){menu=null;rollCredits('game');return}if(i==4){if(unstick(true)){toast('Moved to a safe spot');menu=null}}if(i==3){if(menu.confirm){localStorage.removeItem(slotKey(SLOT));if(SLOT==1)localStorage.removeItem('farmmars1');G=newGame();boot();menu=null;toast('New game started')}else{menu.confirm=1;toast('Tap again to confirm NEW GAME')}}sfx('menu')}}
function slotAt(x,y){const sx=(W-10*24)/2,sy=44;const c=Math.floor((x-sx)/24),r=Math.floor((y-sy)/24);return c>=0&&c<10&&r>=0&&r<3?r*10+c:-1}
// ---------- update ----------
let lastHour=-1;
function update(){tick++;if(CRED){CRED.t++;CRED.y-=.35;setMusic('credits');if(CRED.y<-CREDL.length*14-60)endCredits();return}if(TITLE)return;if(toastT)toastT--;if(swingT)swingT--;if(invT)invT--;for(const k in btnFx)if(btnFx[k])btnFx[k]--;
 P.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.vy+=p.gr;p.l--});P=P.filter(p=>p.l>0);FT.forEach(f=>{f.y-=.4;f.l--});FT=FT.filter(f=>f.l>0);
 setMusic(G.zone=='mine'&&MINE.boss&&!G.bossDead?'boss':EXITS[G.zone]?'indoor':G.zone=='valles'?(ENTS.some(e=>e.t=='wyrm'&&e.awake)?'boss':'surf'):G.zone);
 if(modal){if(modal.ch<modal.pages[modal.pi].length){modal.ch+=1.5;if(tick%4==0&&modal.look)sfx('talk')}return}
 if(menu)return;
 if(tick%300==0){G.time+=10;if(G.time>=1560){if(OUTZ(G.zone))G.money=Math.max(0,G.money-Math.min(500,Math.floor(G.money*.1)));sleep(true);return}}
 const hr=Math.floor(G.time/60);if(hr!=lastHour){lastHour=hr;placeNPCs(false);checkAch()}
 if(FISHING){updFish();G.moving=false;if(!FISHING)return;if(Math.hypot(joy.dx||0,joy.dy||0)>.6||keys.arrowleft||keys.arrowright||keys.arrowup||keys.arrowdown){FISHING=null;toast('Stopped fishing')}return}
 // movement
 let dx=(keys.arrowright||keys.d?1:0)-(keys.arrowleft||keys.a?1:0),dy=(keys.arrowdown||keys.s?1:0)-(keys.arrowup||keys.w?1:0);
 if(joy.on&&Math.hypot(joy.dx,joy.dy)>.2){dx=joy.dx;dy=joy.dy}const mv=Math.hypot(dx,dy);G.moving=mv>0&&!swingT;
 if(G.moving){const sp=1.25*(G.energy<10?.6:1)*(G.zone=='surf'&&G.rover?2:1)*(mv>1?1/mv:1);dx*=sp;dy*=sp;if(Math.abs(dx)>Math.abs(dy))G.dir=dx>0?1:3;else G.dir=dy>0?2:0;
  const fx=dx>0?5:-5;if(!solidAt(G.px+dx+fx,G.py-3)&&!solidAt(G.px+dx+fx,G.py))G.px+=dx;const fy=dy>0?1:-4;if(!solidAt(G.px-4,G.py+dy+fy)&&!solidAt(G.px+4,G.py+dy+fy))G.py+=dy;anim+=.12*Math.min(1,mv)}
 triggers();
 // npcs
 for(const id in npcRT){const n=npcRT[id];if(n.zone!=G.zone)continue;n.mv=false;
  if((!n.path||!n.path.length)&&Math.random()<.008){const gx=Math.floor(n.hx/T)+Math.round((Math.random()-.5)*5),gy=Math.floor(n.hy/T)+Math.round((Math.random()-.5)*3);n.path=npcPath(Math.floor(n.x/T),Math.floor(n.y/T),gx,gy)}
  if(n.path&&n.path.length&&!modal){const[tx,ty]=n.path[0],a=tx*T+8-n.x,b=ty*T+8-n.y,d=Math.hypot(a,b);if(d<.6){n.x=tx*T+8;n.y=ty*T+8;n.path.shift()}else{const s=Math.min(.45,d);n.x+=a/d*s;n.y+=b/d*s;n.mv=true;n.dir=Math.abs(a)>Math.abs(b)?(a>0?1:3):(b>0?2:0);n.f=(n.f||0)+.1}}}
 if(G.zone=='farm')updAnimals();
 if(G.zone=='farm'){if(Math.random()<.006){robot.tx=(10+Math.random()*18)*T;robot.ty=(8+Math.random()*10)*T}robot.x+=Math.sign(robot.tx-robot.x)*.5;robot.y+=Math.sign(robot.ty-robot.y)*.5}
 if(OUTZ(G.zone))hostile();}
function npcPath(sx,sy,gx,gy){const m=curMap(),w=m[0].length,h=m.length,ok=(x,y)=>x>0&&y>0&&x<w-1&&y<h-1&&!isSolid(G.zone,m[y][x])&&!'XDMuvP'.includes(m[y][x])&&!(G.zone=='farm'&&G.objs[x+','+y]);
 if(!ok(gx,gy))return null;const prev={},q=[[sx,sy]];prev[sx+','+sy]=null;let n=0;while(q.length&&n++<900){const[x,y]=q.shift();if(x==gx&&y==gy){const p=[];let k=x+','+y;while(k&&k!=sx+','+sy){p.unshift(k.split(',').map(Number));k=prev[k]}return p}
  for(const[a,b]of[[1,0],[-1,0],[0,1],[0,-1]]){const k=(x+a)+','+(y+b);if(!(k in prev)&&ok(x+a,y+b)){prev[k]=x+','+y;q.push([x+a,y+b])}}}return null}
function triggers(){const tx=Math.floor(G.px/T),ty=Math.floor((G.py-2)/T),t=tileAt(tx,ty),z=G.zone;if(t=='X'&&z=='surf'&&tx>=62){enter('valles',1,18,1);vallesIntro();return}if(t=='X'&&z=='valles'){enter('surf',61,21,3);return}
 if(t=='X'){if(z=='farm'&&tx>=30)enter('city',1,10,1);else if(z=='farm')enter('surf',31,41,0);else if(z=='city')enter('farm',29,10,3);else enter('farm',15,1,2)}
 if(t=='D'){if(EXITS[z]){const e=EXITS[z];enter(e[0],e[1],e[2],2)}else{const d=DOORS[z+':'+tx+','+ty];if(d)enter(d[0],d[1],d[2],0)}}
 if(t=='M'){G.py+=T;if(G.deep>=6){const o=[1,6,11,16].filter(f=>f==1||G.deep>=f).map(f=>({t:'Floor '+f+(f>10?' (Frozen Depths)':''),f:()=>enterMine(f)}));o.push({t:'Cancel'});say('Mine Elevator','Select a floor:',o)}else enterMine(1)}
 if(t=='u'){enter('surf',50,9,2)}
 if(t=='v'){if(G.floor>=20){G.py+=T;say('Floor 20','The ice gives way to solid basalt. This is the very bottom... for now.')}else{enterMine(G.floor+1);if(G.floor==11)say('Frozen Depths','The air turns bitter cold. Frost coats the walls, and something skitters in the dark. (Floors 11-20: Cryo Shards and Frostmites)')}}}
function hurt(d,from){if(invT)return;d=Math.round(d*(perk('combat')>=2?.75:1));G.hp-=d;invT=45;sfx('hurt');parts(G.px,G.py-8,'#f44',8);floatTxt(G.px,G.py-20,'-'+d,'#f66');if(from){const a=Math.atan2(G.py-from.y,G.px-from.x);for(let i=0;i<8;i++){const nx=G.px+Math.cos(a)*1.5,ny=G.py+Math.sin(a)*1.5;if(!solidAt(nx,ny)){G.px=nx;G.py=ny}}}
 if(G.hp<=0){const fee=Math.min(500,Math.floor(G.money*.1));G.money-=fee;G.hp=50;G.o2=100;enter('farm',13,2,2);say('Med Drone','You blacked out. A rescue drone dragged you back to the dome. Medical fee: '+fee+'cr.')}}
function hostile(){const storm=season()=='Storm'&&G.zone=='surf';if(tick%Math.round((G.zone=='mine'?90:storm?40:55)*(perk('forage')>=2?1.3:1)*(G.zone=='surf'&&G.terra>=2?1.5:1))==0)G.o2=Math.max(0,G.o2-1);if(G.o2<=0&&tick%30==0){G.hp-=4;sfx('hurt');if(G.hp<=0)hurt(0)}
 const bugs=ENTS.filter(e=>e.k=='bug');
 for(const e of bugs){const b=BUGS[e.t],d=Math.hypot(G.px-e.x,G.py-e.y),a=Math.atan2(G.py-e.y,G.px-e.x);let mx=0,my=0;e.tm++;if(e.hit)e.hit--;
  if((e.t=='crawler'||e.t=='frostmite'||e.t=='scorp')&&d<110){mx=Math.cos(a)*b.spd;my=Math.sin(a)*b.spd}
  if(e.t=='spitter'&&d<130){const s=d<50?-1:d>85?1:0;mx=Math.cos(a)*b.spd*s;my=Math.sin(a)*b.spd*s;if(e.tm%100==0)shoot(e,a,1.7,b.dmg)}
  if((e.t=='hopper'||e.t=='mantis')&&d<120){const ph=e.tm%80;if(ph<55){mx=Math.cos(a)*.15;my=Math.sin(a)*.15;e.da=a}else{mx=Math.cos(e.da)*3;my=Math.sin(e.da)*3}}
  if(e.t=='wyrm'){wyrmAI(e,a,d,bugs);continue}if(e.t=='queen'){const ph=Math.floor(e.tm/220)%3;if(ph==0){mx=Math.cos(a)*b.spd;my=Math.sin(a)*b.spd}if(ph==1&&e.tm%45==0){for(let i=0;i<12;i++)shoot(e,i/12*6.283+e.tm,1.4,10);sfx('shoot')}
   if(ph==2&&e.tm%220==1&&bugs.length<6){for(let i=0;i<2;i++)ENTS.push(mkBug('crawler',e.x+(i?20:-20),e.y+10,5));sfx('roar')}}
  mx+=e.vx;my+=e.vy;e.vx*=.8;e.vy*=.8;if(!solidAt(e.x+mx,e.y))e.x+=mx;if(!solidAt(e.x,e.y+my))e.y+=my;
  if(!e.under&&d<(e.t=='queen'?22:11))hurt(b.dmg,e)}
 PR.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.l--;if(Math.hypot(p.x-G.px,p.y-(G.py-6))<7){hurt(p.dmg);p.l=0}if(solidAt(p.x,p.y))p.l=0});PR=PR.filter(p=>p.l>0);
 if(G.zone=='mine')MINE.E=ENTS}
function shoot(e,a,s,d){PR.push({x:e.x,y:e.y-6,vx:Math.cos(a)*s,vy:Math.sin(a)*s,l:150,dmg:d,c:BUGS[e.t].c2});if(e.t!='queen')sfx('shoot')}
// ---------- render ----------
let LIGHTS=[];const light=(x,y,r,c)=>LIGHTS.push({x,y,r,c});
function zoneKey(){return G.zone}
function draw(){if(CRED){drawCredits();return}if(TITLE){drawTitle();return}const z=G.zone,m=curMap(),mw=m[0].length*T,mh=m.length*T;LIGHTS=[];
 CAMX=0;const tox=Math.max(0,Math.min(mw-W,G.px-W/2)),toy=Math.max(0,Math.min(mh-H,G.py-H/2-10));if(CAM.z!==G.zone||FADE>0||Math.abs(CAM.x-tox)>90||Math.abs(CAM.y-toy)>90){CAM.x=tox;CAM.y=toy}else{CAM.x+=(tox-CAM.x)*.2;CAM.y+=(toy-CAM.y)*.2}CAM.z=G.zone;let ox=Math.round(CAM.x),oy=Math.round(CAM.y);if(mw<W)ox=Math.round(-(W-mw)/2);if(mh<H)oy=Math.round(-(H-mh)/2);
 cx.fillStyle={farm:'#2a1208',city:'#0a0614',surf:'#12040c',mine:'#08060c'}[z]||'#0a0608';cx.fillRect(0,0,W,H);
 if(EXITS[z]){cx.fillStyle='#000';cx.fillRect(0,0,W,H)}
 const x0=Math.max(0,Math.floor(ox/T)),y0=Math.max(0,Math.floor(oy/T)),x1=Math.min(m[0].length,Math.ceil((ox+W)/T)+1),y1=Math.min(m.length,Math.ceil((oy+H)/T)+2);
 const D=[];
 for(let y=y0;y<y1;y++)for(let x=x0;x<x1;x++){const t=m[y][x],X=x*T-ox,Y=y*T-oy,v=hash(x,y)%4;let bt=t;
  if(z=='farm'&&'HBTLN'.includes(t))bt='g';if(z=='city'&&'HAFLSQ'.includes(t))bt='p';
  cx.drawImage(tileImg(z,bt,v),X,Y);
  if(OUTZ(z)&&t=='R'){const top=z=='mine'?(G.floor>10?['#6a8ab0','#cfe8ff','#2a3a5a']:['#3a3048','#4a4060','#1e1828']):z=='valles'?['#9a4a26','#c8743e','#4a1a0c']:['#7a2a3e','#a04a5e','#3a0e1c'];D.push([Y+T,()=>{R(X,Y-7,T,T,top[0]);R(X,Y-7,T,2,top[1]);R(X,Y+9,T,7,top[2]);if(v==1)R(X+4,Y-3,3,2,top[2]);R(X+T,Y+2,3,T-2,'#0003')}])}
  if(z=='surf'&&t=='O'){D.push([Y+T,()=>{R(X+4,Y-18,8,32,'#2a1a3a');R(X+5,Y-17,6,30,'#3a2a50');const g=tick%120<60;R(X+7,Y-12,2,2,g?'#6ff':'#288');R(X+7,Y-6,2,2,'#6ff');R(X+7,Y,2,2,g?'#288':'#6ff')}]);light(X+8,Y-6,26,'#4ff')}
  if(t=='P'||(z=='surf'&&t=='c'&&isPool(x,y)))drawWater(z,m,x,y,X,Y,t);else if(z=='farm'&&t=='g'&&!G.tiles[x+','+y]){const hh=hash(x*3,y*7)%23;if(hh<3){R(X+3+hh*3,Y+9,1,3,'#5a8a2a');R(X+4+hh*3,Y+8,1,4,'#7ab03a');R(X+5+hh*3,Y+10,1,2,'#5a8a2a')}else if(hh==4)R(X+8,Y+6,2,2,['#f6a','#ff6','#adf'][(x+y)%3])}
  else if(z=='surf'&&t=='r'){const hh=hash(x*5,y*3)%19;if(hh<2)R(X+4+hh*5,Y+7,3,2,'#5a1a1a');if(G.terra>=1&&hh>=2&&hh<7){R(X+hh*2,Y+4+hh,3,2,'#5a8a3a');R(X+hh*2+5,Y+10-hh,2,1,'#7ab04a')}}
  if(z=='surf'&&t=='c'&&!isPool(x,y)){if(tileAt(x,y-1)!='c')R(X,Y,T,2,'#0003');if(tileAt(x,y+1)!='c')R(X,Y+T-2,T,2,'#ffffff18')}
  if((z=='surf'||z=='valles')&&t=='V')light(X+8,Y+8,22,'#f80');
  if(t=='L'){D.push([Y+T,()=>{R(X+7,Y-18,2,32,'#556');R(X+4,Y-20,8,3,z=='city'?'#f0f':'#ffb050');R(X+5,Y-17,6,1,'#fff8')}]);light(X+8,Y-18,46,z=='city'?'#f4f':'#fb6')}
  if(z=='farm'){const ft=G.tiles[x+','+y];if(ft){R(X+1,Y+1,14,14,ft.w?'#4a2010':'#7a3a1c');{const e=ft.w?'#2a0e06':'#4a2010';if(!G.tiles[x+','+(y-1)])R(X+1,Y+1,14,1,e);if(!G.tiles[x+','+(y+1)])R(X+1,Y+14,14,1,'#a8603a');if(!G.tiles[(x-1)+','+y])R(X+1,Y+1,1,14,e);if(!G.tiles[(x+1)+','+y])R(X+14,Y+1,1,14,'#a8603a')}for(let i=3;i<14;i+=4){R(X+2,Y+i,12,1,ft.w?'#38180a':'#5a2a14');R(X+2,Y+i+1,12,1,ft.w?'#5a3020':'#9a5030')}if(ft.w&&v==0)R(X+4,Y+5,2,1,'#8cf6');
    if(ft.c){const c=ft.c,st=Math.min(ft.g/CROPS[c].days,1),wilt=ft.dry>=2;const sw=st>=.25&&!wilt?Math.round(Math.sin(tick/28+x*.9+y*.5)*.9):0;D.push([Y+12,()=>drawCrop(cx,X+sw,Y,c,st,wilt)]);if(c=='glo'||c=='frb')light(X+8,Y+6,14,CROPS[c].c)}}
   const o=G.objs[x+','+y];if(o)D.push([Y+12,()=>{drawIcon(cx,o,X,Y);if(tick%90<10)R(X+3,Y+2,10,1,'#9cf')}]);
   if(t=='T')D.push([Y+T,()=>{if(x==25&&y==2){R(X,Y-10,32,42,'#5a7a8a');R(X+1,Y-10,30,4,'#9ab');R(X+3,Y+2,26,14,'#3a8ab0');R(X+3,Y+2,26,2,'#8ef');R(X+1,Y+28,30,4,'#3a4a5a');txt('H2O',X+16,Y-1,'#cef',7,'center',0)}}]);
   if(t=='N'&&x==11&&y==2)D.push([Y+3*T,()=>drawBarn(X,Y)]);
   if(t=='B')D.push([Y+T,()=>{R(X,Y+2,T,13,'#6b3b1f');R(X,Y+2,T,4,'#a86a3a');R(X+2,Y+9,12,1,'#432');R(X+6,Y+4,4,1,'#fd6')}])}
  if(z=='city'&&t=='Q')D.push([Y+T,()=>{R(X+2,Y+8,2,8,'#5a3a2a');R(X+12,Y+8,2,8,'#5a3a2a');R(X,Y-8,T,16,'#7a4a2a');R(X+1,Y-7,14,14,'#d8b888');R(X+3,Y-5,5,4,'#fff');R(X+9,Y-4,4,5,G.req&&!G.req.done?'#ff6':'#9c9');R(X+4,Y+1,8,1,'#a87')}]),light(X+8,Y,14,'#ff8');
  if(z=='mine'&&(t=='u'||t=='v'))light(X+8,Y+8,24,t=='v'?'#fd6':'#8cf');}
 drawStructures(ox,oy,D);
 // entities
 const pl=()=>{const blink=invT&&tick%6<3;if(blink)return;const fr=G.moving?Math.floor(anim*2.5)%4:0;const X=G.px-8-ox,Y=G.py-24-oy;
  if(swingT&&G.dir==0)drawSwing(X,Y);if(z=='surf'&&G.rover&&!swingT){drawRover(X+8,Y+20,G.dir);return}drawChar(cx,X,Y,PLOOK,G.dir,fr,{suit:OUTZ(z),swing:swingT>0});if(swingT&&G.dir!=0)drawSwing(X,Y)};
 D.push([G.py-oy,pl]);
 for(const id in npcRT){const n=npcRT[id];if(n.zone!=z)continue;const npc=NPCS.find(q=>q.id==id),X=n.x-8-ox,Y=n.y-24-oy;D.push([n.y-oy,()=>{drawChar(cx,X,Y,npc.look,n.dir||2,n.mv?Math.floor(n.f*2.5)%4:0);
   const near=Math.hypot(n.x-G.px,n.y-G.py)<40;if(near||G.spouse==id){txt((G.spouse==id?'♥ ':'')+npc.n,X+8,Y-3,G.spouse==id?'#f8a':'#fff',7,'center')}const em=EMO[id];if(em&&tick<em.e)drawEmote(X+8,Y-14,em.k);else if(G.events&&[3,4,6,7,9].some(l=>G.hearts[id]>=l&&npc.ev[l]&&!G.events[id+l]))txt('!',X+8,Y-10+Math.sin(tick/8)*2,'#ff0',9,'center')}])}
 if(z=='farm')for(const a of G.animals){const X=a.x-ox,Y=a.y-oy;D.push([Y,()=>{drawAnimal(a,X,Y);if(Math.hypot(a.x-G.px,a.y-G.py)<36)txt(a.n+(a.pet==G.day?' ♥':''),X,Y-16,'#fff',7,'center')}])}
 if(G.kids&&(z=='home'||z=='farm')){const kx=(z=='home'?6*T+8:10*T+8)+Math.sin(tick/50)*12-ox,ky=(z=='home'?4*T+8:8*T+8)-oy,kl={skin:'#e8b48a',hair:(NPCS.find(q=>q.id==G.spouse)||NPCS[0]).look.hair,style:'bob',top:'#ffd27a',pants:'#5a8ac8',acc:'#fff'};D.push([ky,()=>{const c=KIDC||(KIDC=document.createElement('canvas'));c.width=16;c.height=24;const q=c.getContext('2d');q.clearRect(0,0,16,24);drawChar(q,0,0,kl,2,Math.floor(tick/10)%4);cx.drawImage(c,kx-5,ky-16,11,16);if(Math.hypot(kx+ox-G.px,ky+oy-G.py)<36)txt('Baby '+(G.kidName||'Nova'),kx,ky-19,'#ffd27a',7,'center')}])}
 if(z=='farm'){D.push([robot.y-oy,()=>drawRobot(cx,robot.x-8-ox,robot.y-16-oy,tick)]);light(robot.x-ox,robot.y-10-oy,16,'#0ff')}
 for(const e of ENTS){const X=e.x-ox,Y=e.y-oy;if(X<-40||X>W+40||Y<-40||Y>H+40)continue;
  if(e.k=='ore')D.push([Y+4,()=>drawOre(e,X,Y)]),e.t!='stone'&&e.t!='iron'&&light(X,Y-4,18,ITEMS[e.t].c);
  if(e.k=='plant'){D.push([Y+4,()=>drawPlant(e,X,Y)]);light(X,Y-4,24,ITEMS[e.t].c)}
  if(e.k=='bug'){D.push([Y+4,()=>drawBug(e,X,Y)]);if(e.t=='queen')light(X,Y-10,60,'#4df')}}
 D.sort((a,b)=>a[0]-b[0]).forEach(d=>d[1]());
 PR.forEach(p=>{R(p.x-ox-2,p.y-oy-2,4,4,p.c);R(p.x-ox-1,p.y-oy-1,2,2,'#fff');light(p.x-ox,p.y-oy,10,p.c)});
 P.forEach(p=>R(p.x-ox,p.y-oy,2,2,p.c));
 overlays(ox,oy);weather(ox,oy);lighting(ox,oy);if(z=='surf'||z=='valles')skyBand(ox,oy);if(G.zone=='city'&&isFestival()&&G.time>=480&&G.time<1000)festival(ox,oy);if(FISHING)drawFish(ox,oy);
 drawBubbles(ox,oy);FT.forEach(f=>txt(f.s,f.x-ox,f.y-oy,f.c,7,'center'));
 if(FADE>0){cx.fillStyle='rgba(0,0,0,'+(FADE/18)+')';cx.fillRect(0,0,W,H);FADE--}hud();if(menu)drawMenu();if(modal&&modal.scene=='wed')drawWed(modal);if(modal)drawModal()}
function festival(ox,oy){for(let r=0;r<3;r++){const y=(7+r*4)*T-oy;cx.strokeStyle='#ffd27a88';cx.beginPath();cx.moveTo(2*T-ox,y);for(let x=2;x<=29;x++)cx.lineTo(x*T-ox,y+Math.sin(x)*4);cx.stroke();
 for(let x=2;x<=29;x++){const c=['#f4f','#0ff','#ff4','#f84'][(x+r+Math.floor(tick/20))%4];R(x*T-ox-1,y+Math.sin(x)*4,3,3,c)}}panel(W/2-70,26,140,13,'#3a0a3acc','#ff4');txt('★ '+festName().toUpperCase()+' ★',W/2,36,'#ffd27a',8,'center')}
function drawFish(ox,oy){const f=FISHING,d=DIRV[G.dir],bx=G.px+d[0]*20-ox,by=G.py-4+d[1]*20-oy+(f.ph=='bite'?Math.sin(tick)*2:Math.sin(tick/10));
 cx.strokeStyle='#fff8';cx.beginPath();cx.moveTo(G.px-ox+d[0]*8,G.py-oy-14);cx.lineTo(bx,by);cx.stroke();R(bx-2,by-2,4,4,'#f44');R(bx-2,by-2,4,1,'#fff');
 if(f.ph=='bite')txt('!',G.px-ox,G.py-oy-30,'#ff0',14,'center');
 if(f.ph=='reel'){const x=W/2-80,y=50;panel(x-4,y-14,168,30,'#000c','#9ef');txt('Press USE in the green zone!',W/2,y-4,'#fff',7,'center');R(x,y,160,10,'#422');R(x+f.zs*160,y,f.zw*160,10,'#3c6');R(x+f.pos*160-1,y-2,3,14,'#fff')}}
function drawSwing(X,Y){const id=swingId,p=1-swingT/14,d=G.dir,base=[-Math.PI/2,0,Math.PI/2,Math.PI][d],a=base-1.2+p*2.4;
 cx.save();cx.translate(X+8,Y+16);cx.rotate(a+Math.PI/2);drawIcon(cx,id,-8,-18);cx.restore();
 if(id=='blade'){cx.strokeStyle='rgba(255,120,255,'+(.7*(1-p))+')';cx.lineWidth=3;cx.beginPath();cx.arc(X+8,Y+16,15,base-1.2,a);cx.stroke()}}
function drawOre(e,X,Y){const c=e.t=='stone'?'#6a5a6a':ITEMS[e.t].c,d=shade(c,-.45),l=shade(c,.4);R(X-8,Y+1,16,4,'#0005');
 if(e.t=='stone'||e.t=='iron'){ob(cx,X-7,Y-8,14,10,e.t=='stone'?'#5a4a5a':'#6a5a5a');R(X-7,Y-8,14,3,e.t=='stone'?'#7a6a7a':'#8a7a7a');if(e.t=='iron'){R(X-4,Y-5,3,2,c);R(X+2,Y-3,3,2,c);R(X-1,Y-7,2,1,l)}}
 else{R(X-6,Y-3,12,5,'#3a2a3a');ob(cx,X-6,Y-9,4,10,c);ob(cx,X-1,Y-14,5,15,c);ob(cx,X+4,Y-7,3,8,c);R(X,Y-13,1,10,l);R(X-5,Y-8,1,6,l);R(X+3,Y-13,1,13,d)}
 if(e.hp<({stone:2,iron:3,crys:4,cob:6,pla:8}[e.t]))R(X-2,Y-5,4,1,'#000')}
function drawPlant(e,X,Y){const g=Math.sin(tick/15+e.x)*.5+.5,c=ITEMS[e.t].c;R(X-5,Y+1,10,3,'#0004');R(X-1,Y-6,2,8,'#2a6a3a');
 if(e.t=='glowcap'){ob(cx,X-5,Y-10,10,4,c);R(X-3,Y-11,6,1,shade(c,.5));R(X-3,Y-7,2,2,shade(c,.6))}
 else if(e.t=='lily'){[[-5,-8],[2,-8],[-2,-12]].forEach(([a,b])=>ob(cx,X+a,Y+b,3,4,c));R(X-1,Y-8,2,2,'#fff')}
 else{ob(cx,X-6,Y-4,12,5,c);R(X-4,Y-5,2,1,'#c9f');R(X+1,Y-6,2,2,'#c9f')}
 if(g>.7)R(X+Math.sin(tick/7)*5,Y-14-g*3,1,1,'#fff')}
function drawBug(e,X,Y){const b=BUGS[e.t],f=Math.floor(tick/6)%2,c=e.hit?'#fff':b.c;
 if(e.t=='queen'){R(X-18,Y+2,36,6,'#0006');ob(cx,X-14,Y-20,28,20,c);R(X-14,Y-20,28,4,b.c2);for(let i=-12;i<=12;i+=6){R(X+i,Y-28-Math.abs(i)/2,3,10,b.c2);R(X+i,Y-29-Math.abs(i)/2,3,2,'#fff')}
  R(X-8,Y-13,4,3,'#f22');R(X+4,Y-13,4,3,'#f22');for(let i=0;i<3;i++){R(X-20,Y-8+i*4+(f?1:-1),6,2,b.c);R(X+14,Y-8+i*4+(f?-1:1),6,2,b.c)}return}
 R(X-6,Y+2,12,3,'#0005');for(let i=0;i<3;i++){R(X-8,Y-4+i*3+(f?1:0),3,1,b.c2);R(X+5,Y-4+i*3+(f?0:1),3,1,b.c2)}
 const hop=e.t=='hopper'&&e.tm%80>=55?-3:0;ob(cx,X-5,Y-7+hop,10,8,c);R(X-5,Y-7+hop,10,2,b.c2);R(X-3,Y-10+hop,2,3,b.c2);R(X+1,Y-11+hop,2,4,b.c2);
 R(X-3,Y-5+hop,2,2,'#f22');R(X+1,Y-5+hop,2,2,'#f22');if(e.t=='spitter')R(X-1,Y-1+hop,2,2,'#cf6');
 if(e.hp<e.max){R(X-6,Y-14,12,2,'#300');R(X-6,Y-14,12*e.hp/e.max,2,'#f44')}}
function drawStructures(ox,oy,D){const z=G.zone,night=G.time>=1140||G.time<390;
 if(z=='farm'){const X=2*T-ox,Y=2*T-oy;R(X+4,Y+62,96,6,'#0004');
  R(X,Y+12,96,52,'#e8dcc8');for(let i=Y+16;i<Y+64;i+=6)R(X,i,96,1,'#cfc2ac');R(X,Y+60,96,4,'#9a8a74');
  R(X-4,Y-6,104,20,'#b84a32');for(let i=0;i<104;i+=8)R(X-4+i,Y-6,1,20,'#9a3a26');R(X-4,Y-6,104,3,'#e07a50');R(X-4,Y+12,104,2,'#6a2a1a');
  R(X+60,Y-14,30,10,'#2a3a6a');for(let i=0;i<30;i+=6)R(X+60+i,Y-14,1,10,'#6a8ad0');R(X+60,Y-14,30,1,'#9ab');
  for(const wx of[X+10,X+66]){R(wx,Y+24,20,16,'#5a4a3a');R(wx+1,Y+25,18,14,night?'#ffd06a':'#9ee0ff');R(wx+10,Y+25,1,14,'#5a4a3a');R(wx+1,Y+32,18,1,'#5a4a3a');if(night)light(wx+10,Y+32,34,'#fc6')}
  cx.drawImage(tileImg('farm','D',0),5*T-ox,5*T-oy);txt('HOME',X+48,Y+6,'#fff',7,'center','#6a2a1a');if(night)light(5*T-ox+8,5*T-oy+8,26,'#fc6')}
 if(z=='city'){const B=[[2,8,'RED DUST CAFE','#8a2a2a','#ff8a3a',5],[11,18,'SUPPLY & TECH','#1a3a5a','#2ff',14],[21,28,'COMMUNITY CTR','#3a2050','#f4f',24]];
  for(const[a,b,n,c,neon,dx]of B){const X=a*T-ox,Y=T-oy-12,w=(b-a+1)*T,h=5*T+12;R(X+4,Y+h,w,5,'#0005');R(X,Y,w,h,c);for(let i=Y+8;i<Y+h;i+=8)R(X,i,w,1,shade(c,-.15));R(X,Y,w,4,shade(c,.25));
   const fl=tick%200<190||n[0]=='S';R(X+4,Y+8,w-8,14,'#0a0610');txt(n,X+w/2,Y+18,fl?neon:shade(neon,-.6),8,'center',0);if(fl)light(X+w/2,Y+15,60,neon);
   for(let i=10;i<w-10;i+=22)if(Math.abs(X+i-(dx*T-ox))>16){R(X+i,Y+34,14,16,'#2a2030');R(X+i+1,Y+35,12,14,night?'#ffd890':'#8ad8ff');R(X+i+1,Y+35,12,2,'#fff6');if(night)light(X+i+7,Y+42,20,'#fd8')}
   R(X,Y+h-3,w,3,neon);cx.drawImage(tileImg('city','D',0),dx*T-ox,5*T-oy);R(dx*T-ox,5*T-oy,T,1,neon)}
  {const X=3*T-ox,Y=16*T-oy;R(X,Y-10,7*T,4*T+10,'#4a3a4a');R(X,Y-10,7*T,3,'#7a5a7a');for(let i=0;i<6;i++){R(X+6+i*18,Y+6,10,10,night&&i%2?'#ffd890':'#2a1a2a');R(X+6+i*18,Y+24,10,10,night&&i%3==0?'#ffd890':'#2a1a2a')}txt('HABITAT ROW',X+56,Y-1,'#f8c',7,'center',0)}
  {const X=15*T-ox,Y=10*T-oy;R(X-2,Y-2,36,36,'#5a4a6a');R(X,Y,32,32,'#1a5a8a');const w=tick%40;R(X+4,Y+4,24,24,'#2a8ac0');R(X+14,Y+2,4,14,'#bff');R(X+12-w%8/2,Y+14-w%10,2,2,'#fff');R(X+18+w%8/2,Y+14-w%10,2,2,'#fff');light(X+16,Y+16,40,Object.keys(G.bundles).length>=2?['#f4f','#4ff','#ff4'][Math.floor(tick/30)%3]:'#4cf')}
  for(let x=12;x<=19;x++){const X=x*T-ox,Y=17*T-oy;R(X,Y+4,T,5,'#6a4a3a');R(X,Y+4,T,1,'#9a7a5a');R(X+2,Y+9,2,5,'#333');R(X+12,Y+9,2,5,'#333')}
  const hb=(tick/3)%200;R(13*T-ox,8*T-oy-30,64,0,'#000');}
 if(EXITS[z])drawInterior(ox,oy,D,night)}
function drawInterior(ox,oy,D,night){const z=G.zone,m=curMap();
 for(let y=0;y<m.length;y++)for(let x=0;x<m[0].length;x++){const t=m[y][x],X=x*T-ox,Y=y*T-oy;
  if(t=='w'&&y==0&&x%3==1&&z!='shop'){R(X+2,Y+3,12,9,night?'#1a1440':'#ff9a5a');R(X+3,Y+4,10,7,night?'#0a0a2a':'#e86a3a');if(night)R(X+5,Y+5,1,1,'#fff');R(X+2,Y+3,12,1,'#fff6')}
  if(t=='k')D.push([Y+T,()=>{R(X,Y-4,T,20,'#ccc');R(X,Y-4,T,3,'#eee');R(X+2,Y+4,12,8,'#999');if(x==2){R(X+3,Y-3,4,2,'#333');R(X+9,Y-3,4,2,'#333')}}]);
  if(t=='b'&&m[y][x-1]!='b')D.push([Y+T,()=>{R(X,Y-6,32,22,'#5a3a2a');R(X+1,Y-4,30,18,'#e8e8f8');R(X+2,Y-4,10,6,'#fff');R(X+12,Y,19,14,'#3a6ab0');R(X+12,Y,19,2,'#5a8ad0');if(G.spouse)R(X+20,Y-4,10,6,'#fff')}]);
  if(t=='t')D.push([Y+T,()=>{R(X+1,Y+2,14,10,shade('#8a5a3a',.1));R(X+1,Y+2,14,2,'#b08060');R(X+3,Y+12,2,4,'#3a2a1a');R(X+11,Y+12,2,4,'#3a2a1a');if(z=='cafe'&&(x+y)%2)R(X+6,Y,3,3,'#fff')}]);
  if(t=='p')D.push([Y+T,()=>{R(X+4,Y+6,8,9,'#a0603a');R(X+3,Y+5,10,2,'#c08050');R(X+5,Y-2,6,7,'#9f6');R(X+6,Y-4,4,3,'#cfa')}]),light(X+8,Y,18,'#9f6');
  if(t=='s')D.push([Y+T,()=>{R(X,Y-6,T,22,z=='cafe'?'#4a2a1a':'#2a3a4a');for(let i=0;i<3;i++){R(X,Y-2+i*6,T,1,'#0006');for(let j=1;j<T-2;j+=4)R(X+j,Y-5+i*6,3,3,['#f84','#4cf','#9f6','#fd4','#f4f'][(x*3+j+i)%5])}}]);
  if(t=='e')D.push([Y+T,()=>{R(X+2,Y-6,12,20,'#888');R(X+4,Y-2,8,6,'#222');R(X+6,Y+6,4,4,'#a52')}]);
  if(t=='c')D.push([Y+T,()=>{R(X,Y-2,T,18,z=='cafe'?'#6a2a1a':'#2a4a6a');R(X,Y-2,T,3,z=='cafe'?'#c86a3a':'#4a8aca');R(X,Y+12,T,4,'#0004');if(x==3&&z=='shop'){R(X+4,Y-6,8,5,'#111');R(X+5,Y-5,6,3,'#0f8')}if(x==2&&z=='cafe'){R(X+3,Y-7,9,6,'#888');R(X+4,Y-5,3,3,'#a52')}}]);
  if(t=='h')D.push([Y+T,()=>{R(X+2,Y-8,12,22,'#1a2a3a');R(X+3,Y-7,10,8,'#0ff4');R(X+5,Y-5,6,4,'#0ff')}]),light(X+8,Y-3,22,'#0ff');
  if(t=='q'&&z=='cc')D.push([Y+T,()=>{R(X,Y-8,T,22,'#4a3020');R(X+1,Y-7,14,16,'#c8a878');for(let i=0;i<3;i++)R(X+3,Y-5+i*5,9,3,G.bundles[x-1]?'#6c6':'#fff');}]);
  if(t=='j')D.push([Y+T,()=>{R(X,Y-2,T,16,'#5a5a6a');R(X,Y-2,T,3,'#8a8aa0');if(x==12){R(X+3,Y-7,6,5,'#f80');R(X+10,Y-6,4,4,'#9ab')}if(x==13)txt('CRAFT',X+16,Y-6,'#ff8',7,'center')}]);}
 if(z=='cc'){txt('BUNDLES',2.5*T-ox+16,0*T-oy+12,'#ffd',7,'center')}}
function overlays(ox,oy){const z=G.zone,s=season();
 if(z=='farm'){cx.strokeStyle='rgba(255,230,200,.07)';cx.lineWidth=1;const cxp=16*T-ox,cyp=11*T-oy;for(let i=1;i<=6;i++){cx.beginPath();cx.ellipse(cxp,cyp,16*T*i/6,11*T,0,0,6.3);cx.stroke()}for(let i=1;i<6;i++){cx.beginPath();cx.ellipse(cxp,cyp,16*T,11*T*i/6,0,0,6.3);cx.stroke()}
  const gr=cx.createLinearGradient(0,0,W,H);gr.addColorStop(0,'rgba(255,255,255,.06)');gr.addColorStop(.3,'rgba(255,255,255,0)');cx.fillStyle=gr;cx.fillRect(0,0,W,H)}
 if(z=='farm'||z=='surf'||z=='city'){cx.fillStyle=SEASON_TINT[s];cx.fillRect(0,0,W,H)}
 if(z=='surf'){const n=s=='Storm'?90:30,sp=s=='Storm'?3:.8;for(let i=0;i<n;i++){const x=(hash(i,7)%W+tick*sp*(1+i%3*.3))%W,y=(hash(7,i)%H+Math.sin(tick/50+i)*10+H)%H;R(x,y,i%4?1:2,1,s=='Storm'?'#c86a4aaa':'#e8a08a55')}}
 if(s=='Frost'&&(z=='farm'||z=='surf')){for(let i=0;i<40;i++){const x=(hash(i,3)%W),y=(hash(3,i)+tick*.5*(1+i%3))%H;R(x,y,1,1,'#fff8')}}
 if(z=='mine'){cx.fillStyle=G.floor>10?'rgba(120,190,255,.12)':'rgba(40,20,80,.08)';cx.fillRect(0,0,W,H);if(G.floor>10)for(let i=0;i<25;i++){const x=hash(i,9)%W,y=(hash(9,i)+tick*.3*(1+i%3))%H;R(x,y,1,1,'#eef8')}}}
function lighting(ox,oy){const z=G.zone,hr=G.time/60;let dark=hr<19?0:Math.min(.5,(hr-19)/5*.5);if(hr<6.5)dark=.38;
 if(EXITS[z])dark*=.35;if(z=='mine')dark=.62;if(z=='surf'||z=='valles')dark=Math.min(.6,dark+.06);if(z=='city')dark*=.85;
 if(dark>.02){if(z=='mine'||(z=='surf'&&dark>.3))light(G.px-ox,G.py-10-oy,z=='mine'?110:80,'#ffe0a0');
  lx.globalCompositeOperation='source-over';lx.clearRect(0,0,W,H);lx.fillStyle=`rgba(8,2,24,${dark})`;lx.fillRect(0,0,W,H);lx.globalCompositeOperation='destination-out';
  for(const l of LIGHTS){const g=lx.createRadialGradient(l.x,l.y,0,l.x,l.y,l.r);g.addColorStop(0,'rgba(0,0,0,1)');g.addColorStop(1,'rgba(0,0,0,0)');lx.fillStyle=g;lx.fillRect(l.x-l.r,l.y-l.r,l.r*2,l.r*2)}
  cx.drawImage(lc,0,0)}
 cx.globalCompositeOperation='lighter';for(const l of LIGHTS){if(!l.c)continue;const g=cx.createRadialGradient(l.x,l.y,0,l.x,l.y,l.r*.7);g.addColorStop(0,hexA(l.c,.18+dark*.25));g.addColorStop(1,hexA(l.c,0));cx.fillStyle=g;cx.fillRect(l.x-l.r,l.y-l.r,l.r*2,l.r*2)}cx.globalCompositeOperation='source-over'}
function hexA(h,a){let c=h.replace('#','');if(c.length==3)c=c.split('').map(q=>q+q).join('');const n=parseInt(c.slice(0,6),16);return `rgba(${n>>16},${n>>8&255},${n&255},${a})`}
function bar(x,y,v,mx,c,l){R(x,y,56,7,'#000');R(x+1,y+1,54,5,'#2a1a2a');R(x+1,y+1,54*Math.min(1,Math.max(0,v)/mx),5,c);R(x+1,y+1,54*Math.min(1,Math.max(0,v)/mx),1,'#fff5');txt(l,x+59,y+7,'#fff',7)}
function aLabel(){if(FISHING)return FISHING.ph=='reel'?'REEL!':FISHING.ph=='bite'?'HOOK!':'WAIT';const s=cur(),[fx,fy]=facingTile();if(G.zone=='farm'&&mature(G.tiles[fx+','+fy]))return 'HARVEST';if(!s)return 'USE';const it=ITEMS[s[0]];
 if(it.food||it.use)return 'EAT';if(it.seed)return 'PLANT';if(it.place)return 'PLACE';return{rod:'FISH',hoe:'TILL',can:'WATER',pick:'MINE',blade:'ATTACK',lance:'ATTACK',hammer:'SMASH'}[s[0]]||'USE'}
function hud(){const z=G.zone;panel(3,3,124,OUTZ(z)?47:38,'#0a0612d8','#ffb050');
 const h=Math.floor(G.time/60)%24,mm=G.time%60,ic=G.time<1140?'☀':'☾';txt(`${season()} ${solOfSeason()} · Y${year()}`,7,12,'#ffd27a',8);txt(ic+' '+String(h).padStart(2,'0')+':'+String(mm).padStart(2,'0'),123,12,'#fff',8,'right');
 bar(7,16,G.energy,G.maxEn,'#fc3','EN');bar(7,25,G.hp,100,'#f44','HP');txt(G.money+'cr',123,32,'#7f7',8,'right');
 if(OUTZ(z)){bar(7,34,G.o2,100,G.o2<25&&tick%20<10?'#f00':'#3cf','O2');if(G.o2<25)txt('LOW OXYGEN!',W/2,46,'#f44',9,'center')}
 const zn={farm:'Dome Farm',mine2:0,city:'New Cydonia',surf:'Martian Surface',home:'Your Habitat',cafe:'Red Dust Cafe',shop:'Supply & Tech',cc:'Community Center',valles:'Valles Canyon',clinic:'Cydonia Clinic',biopod:'Bio-Pod',bar:'The Airlock',port:'Shuttle Port',phobos:'Phobos Station',mine:MINE&&MINE.rift?'Hellas Rift - Depth '+G.rfloor:(G.floor>10?'Frozen Depths - ':'Mine - Floor ')+(G.floor>10?'F'+G.floor:G.floor)}[z];txt(zn,W/2,12,'#fff9',8,'center');
 const boss=ENTS.find(e=>e.t=='queen'||e.t=='wyrm'&&e.awake);if(boss){R(W/2-80,18,160,8,'#000');R(W/2-79,19,158*boss.hp/boss.max,6,'#4df');txt(boss.t=='wyrm'?'SAND WYRM':'CRYSTAL QUEEN',W/2,32,'#bff',7,'center')}
 R(W-46,3,43,19,'#ff6aa8');R(W-45,4,41,17,'#1a0a24');txt('MENU',W-24.5,16,'#fff',8,'center');R(W-67,3,19,19,'#ffb050');R(W-66,4,17,17,'#1a0a24');{const c='#fff',a=W-63,b=7,o=isFS()?3:0;R(a+o,b+o,4,1,c);R(a+o,b+o,1,4,c);R(a+11-o,b+o,4,1,c);R(a+14-o,b+o,1,4,c);R(a+o,b+10+o-o*2,1,4,c);R(a+o,b+13-o,4,1,c);R(a+14-o,b+10-o,1,4,c);R(a+11-o,b+13-o,4,1,c)}
 for(let i=0;i<10;i++){const X=HB.x+i*HB.s,Y=HB.y;R(X,Y,HB.s-1,HB.s-1,i==G.sel?'#ffd27a':'#000c');R(X+1,Y+1,HB.s-3,HB.s-3,i==G.sel?'#4a2a3a':'#2a1a2acc');const s=G.inv[i];if(s){drawIcon(cx,s[0],X+2,Y+2);const it=ITEMS[s[0]];if(it.tool&&G.tools[s[0]]>1)R(X+2,Y+2,3,3,['','','#c96','#46f'][G.tools[s[0]]]);if(!it.tool)txt(s[1],X+HB.s-2,Y+HB.s-2,'#fff',7,'right')}}
 const s=cur();if(s)txt(ITEMS[s[0]].n+(G.tools[s[0]]?' ('+TOOL_TIER_NAMES[G.tools[s[0]]]+')':''),HB.x+105,HB.y-4,'#fff',7,'center');
 if(joy.on){cx.globalAlpha=.35;cx.fillStyle='#fff';cx.beginPath();cx.arc(joy.ox,joy.oy,26,0,6.3);cx.fill();cx.globalAlpha=.75;cx.beginPath();cx.arc(joy.ox+joy.dx*26,joy.oy+joy.dy*26,11,0,6.3);cx.fill();cx.globalAlpha=1}
 else if(touchUI){cx.globalAlpha=.3;cx.strokeStyle='#fff';cx.lineWidth=2;cx.beginPath();cx.arc(46,H-70,26,0,6.3);cx.stroke();cx.globalAlpha=1;txt('MOVE',46,H-67,'#fff8',7,'center')}
 if(touchUI){const lab={A:aLabel(),B:nearNPC()?'TALK':'ACT'};for(const k in BTN){const b=BTN[k];cx.globalAlpha=btnFx[k]?.95:.6;cx.fillStyle=k=='A'?'#e8603a':'#3aa8cc';cx.beginPath();cx.arc(b.x,b.y,b.r,0,6.3);cx.fill();cx.strokeStyle='#fff';cx.lineWidth=1.5;cx.stroke();cx.globalAlpha=1;txt(lab[k],b.x,b.y+3,'#fff',lab[k].length>5?7:8,'center')}}
 if(toastT){cx.globalAlpha=Math.min(1,toastT/20);cx.font='8px monospace';const w=cx.measureText(toastS).width+12;panel(W/2-w/2,H-48,w,13,'#000c','#fff4');txt(toastS,W/2,H-38,'#fff',8,'center');cx.globalAlpha=1}}
function wrapLines(s,w,sz=8){cx.font=sz+'px monospace';const out=[];let l='';for(const t of s.split(' ')){if(cx.measureText(l+t).width>w&&l){out.push(l);l=''}l+=t+' '}out.push(l);return out}
function drawModal(){const m=modal,pg=m.pages[m.pi],by=H-58,hasP=!!m.look,tx=hasP?66:16;panel(6,by,W-12,54);
 if(hasP){R(11,by+5,50,44,'#2a1a3a');drawPortrait(cx,12,by+6,m.look,3,m.mood||(m.name&&m.name.includes('Event')?'love':''),tick%180<8)}
 if(m.name){cx.font='8px monospace';const w=cx.measureText(m.name).width+10;panel(tx-4,by-11,w,12,'#3a1a4a');txt(m.name,tx+1,by-2,'#ffd27a')}
 wrapLines(pg.slice(0,Math.floor(m.ch)),W-tx-16).slice(0,5).forEach((l,i)=>txt(l,tx,by+12+i*9,'#fff'));
 const done=m.ch>=pg.length;if(done&&(!modalLast()||!m.opts)&&tick%40<28)txt('▼',W-16,by+50,'#8ff',8,'center');
 if(done&&modalLast()&&m.opts){m.opts.forEach((o,i)=>{const[x,y,w,h]=optRect(i);panel(x,y,w,h,i==m.sel?'#3a1a4af0':'#140a1cf0',i==m.sel?'#0ff':'#7a4a8a');cx.save();cx.beginPath();cx.rect(x,y,w,h);cx.clip();txt(o.t,x+5,y+10,i==m.sel?'#0ff':'#eee',7);cx.restore()})}}
function drawMenu(){panel(12,8,W-24,H-16,'#120818f4','#ffb050');TABS.forEach((t,i)=>{const X=20+i*62,a=menu.tab==t;panel(X,14,58,17,a?'#4a2a3a':'#1a0e24',a?'#ffd27a':'#6a4a6a');txt(t.toUpperCase(),X+29,26,a?'#ffd27a':'#aaa',8,'center')});
 panel(W-38,12,24,20,'#4a1a2a','#f66');txt('X',W-26,26,'#fff',9,'center');
 if(menu.tab=='bag'){for(let i=0;i<30;i++){const X=(W-240)/2+(i%10)*24,Y=44+Math.floor(i/10)*24;R(X,Y,22,22,menu.pick==i?'#0ff':i<10?'#7a5a3a':'#4a3a4a');R(X+1,Y+1,20,20,'#241626');if(i==G.sel)R(X+1,Y+20,20,1,'#ffd27a');const s=G.inv[i];if(s){drawIcon(cx,s[0],X+3,Y+3);if(!ITEMS[s[0]].tool)txt(s[1],X+21,Y+21,'#fff',7,'right')}}
  txt('Top row = hotbar. Tap an item, then tap another slot to move/swap.',W/2,124,'#aaa',7,'center');const s=G.inv[menu.pick!=null?menu.pick:G.sel];
  if(s){const it=ITEMS[s[0]];txt(it.n+(G.tools[s[0]]?' - '+TOOL_TIER_NAMES[G.tools[s[0]]]+' tier':''),24,140,'#ffd27a',8);wrapLines(it.d||(it.tool?'A trusty tool. Upgrade at Supply & Tech.':''),W-60,7).forEach((l,i)=>txt(l,24,151+i*9,'#ddd',7));if(it.v)txt('Sells for '+it.v+'cr'+(it.food?'  ·  +'+it.food+' energy':''),24,172,'#7f7',7)}
  txt(`Harvested ${G.stats.harvest} · Mined ${G.stats.mined} · Bugs ${G.stats.bugs} · Deepest floor ${G.deep}`,W/2,H-20,'#9ab',7,'center')}
 if(menu.tab=='craft'){const P=craftPage();if(P.n>1){panel(24,40+7*18,W-48,16,'#1a2a3a','#6cf');txt('More recipes  ('+(P.pg+1)+'/'+P.n+')  ▶',W/2,40+7*18+11,'#cef',8,'center')}P.rs.forEach((r,i)=>{const Y=40+i*18,ok=hasAll(r.in)&&(!r.cook||G.zone=='home');panel(24,Y,W-48,16,ok?'#1a3a2a':'#1a0e24',ok?'#6c6':'#5a4a5a');drawIcon(cx,r.id,27,Y);
  txt(ITEMS[r.id].n+(r.cook?' (kitchen)':''),46,Y+11,ok?'#bfb':'#bbb',8);txt(Object.entries(r.in).map(([k,q])=>cnt(k)+'/'+q+' '+ITEMS[k].n).join('  '),W-28,Y+11,'#ddd',7,'right')});txt('Tap a recipe to craft. Meals: use the Recipe Book at your home kitchen.',W/2,H-18,'#aaa',7,'center')}
 if(menu.tab=='social'){NPCS.forEach((n,i)=>{const X=18+(i%2)*174,Y=36+Math.floor(i/2)*41,w=170;panel(X,Y,w,39,'#1a0e24',isBday(n)?'#ffd27a':'#6a4a6a');drawPortrait(cx,X+2,Y+3,n.look,2);const h=G.hearts[n.id]||0;txt(n.n,X+36,Y+10,'#ffd27a',8);
  for(let j=0;j<10;j++)txt(j<Math.floor(h)?'♥':j<h?'♡':'·',X+36+j*8,Y+21,j<h?'#f6a':'#666',8);
  const st=G.spouse==n.id?'Spouse ♥':G.dating[n.id]?'Dating':n.mar?'Single':'';txt(st,X+w-4,Y+10,'#f8c',7,'right');const b=BDAY[n.id];
  cx.save();cx.beginPath();cx.rect(X+2,Y+24,w-4,14);cx.clip();txt((isBday(n)?'BIRTHDAY TODAY! ':'Bday '+SEASONS[b[0]]+' '+b[1]+' · ')+(h>=4?'Likes '+n.likes.slice(0,2).map(k=>ITEMS[k].n).join(', '):'Likes ??? (4♥)'),X+36,Y+33,isBday(n)?'#ffd27a':'#9ab',7);cx.restore()})}
 if(menu.tab=='skills')drawSkills();
 if(menu.tab=='system'){['Music: '+(G.music?'ON':'OFF'),'Sound FX: '+(G.sfx?'ON':'OFF'),'Save game','New game'+(menu.confirm?' - TAP AGAIN TO CONFIRM':''),'Unstuck me (move to safe spot)','Fullscreen: '+(isFS()?'ON':'OFF'),'Save & return to title (slot '+SLOT+')','Credits'].forEach((l,i)=>{panel(60,36+i*18,W-120,15,'#1a0e24','#7a4a8a');txt(l,W/2,47+i*18,'#fff',8,'center')});
  if(0)txt('Keys: WASD move · Space use · E act · 1-0 hotbar · M menu',W/2,H-30,'#aaa',7,'center');txt('Farm Mars v5 · slot '+SLOT+' · saves each night',W/2,H-19,'#777',7,'center')}}
// ---------- boot ----------
function boot(){ENTS=[];SURF=genSurface();MINE=null;for(const k in npcRT)delete npcRT[k];if(G.zone=='mine'||G.zone=='valles'){G.zone='surf';G.px=50*T+8;G.py=9*T+8}if(G.zone=='surf')ENTS=SURF;placeNPCs(true);unstick(false);AU.music=G.music;AU.sfx=G.sfx}
let TITLE=true;G=newGame();
function slotInfo(s){try{const o=JSON.parse(localStorage.getItem(slotKey(s)));if(o&&o.day)return o}catch(e){}if(s==1)try{const o=JSON.parse(localStorage.getItem('farmmars1'));if(o&&o.day)return{day:o.day,money:o.money||0,v1:1}}catch(e){}return null}
function startSlot(s){SLOT=s;const l=load();G=l||newGame();boot();TITLE=false;modal=null;menu=null;genReq();firstInput();
 if(G.migrated){delete G.migrated;say('Farm Mars v2','Your v1 save was carried over: day, credits, crops, items and friendships. Tools were reset and new mechanics unlocked!')}
 else if(!l)say('Welcome to Farm Mars',['Sol 1, Dust season, year 2091. You inherited a dome farm outside New Cydonia.','Till soil with the Hoe, plant seeds, and water them every sol. Sleep in your habitat bed to end the day.','East gate: the neon city. North airlock: the Martian surface and the old mine. Tap MENU for your bag, crafting and friends.','New: buy hens and goats for your barn, check the city Request Board daily, and donate specimens to the Research Archive at the Community Center.']);save(true)}
const TSL=i=>[W/2-120,84+i*30,240,26];
function titleTap(x,y){if(y>H-30&&x>W/2+74){rollCredits('title');return}for(let i=0;i<3;i++){const[a,b,w,h]=TSL(i);if(x>=a&&x<=a+w&&y>=b&&y<=b+h){sfx('menu');startSlot(i+1);return}}if(y>H-30&&Math.abs(x-W/2)<70)toggleFS()}
function drawTitle(){const g=cx.createLinearGradient(0,0,0,H);g.addColorStop(0,'#0a0420');g.addColorStop(.6,'#3a0e2a');g.addColorStop(1,'#a03a1a');cx.fillStyle=g;cx.fillRect(0,0,W,H);
 for(let i=0;i<70;i++){const x=hash(i,1)%W,y=hash(1,i)%120;R(x,y,1,1,(tick/20+i)%9<1?'#fff':'#fff8')}
 cx.fillStyle='#c8502e';cx.beginPath();cx.arc(W-60,40,26,0,6.3);cx.fill();cx.fillStyle='#e87a4a';cx.beginPath();cx.arc(W-66,34,14,0,6.3);cx.fill();
 cx.strokeStyle='#ffffff30';for(let i=1;i<=4;i++){cx.beginPath();cx.ellipse(70,H+10,110,110*i/4,0,Math.PI,0);cx.stroke()}
 txt('FARM MARS',W/2,40,'#ffd27a',28,'center','#6a1a2a');txt('a colony farming life',W/2,56,'#f8c',8,'center');
 for(let i=0;i<3;i++){const[a,b,w,h]=TSL(i),o=slotInfo(i+1);panel(a,b,w,h,'#140a1ce8',o?'#ffb050':'#6a4a8a');txt('SLOT '+(i+1),a+8,b+16,'#ffd27a',8);
  txt(o?(o.v1?'v1 save - Sol '+o.day:'Sol '+o.day+' · '+season(o.day)+' · Y'+(1+Math.floor((o.day-1)/(SOLS_PER_SEASON*4)))+' · '+o.money+'cr'+(o.spouse?' · ♥':'')):'Empty - tap to start a new farm',a+w-8,b+16,o?'#fff':'#aaa',8,'right')}
 panel(W/2+76,H-28,70,18,'#1a0a24','#ff6aa8');txt('CREDITS',W/2+111,H-16,'#fff',8,'center');panel(W/2-70,H-28,140,18,'#1a0a24','#ffb050');txt((isFS()?'EXIT ':'')+'FULLSCREEN',W/2,H-16,'#fff',8,'center');txt('Android: browser menu > Add to Home screen for app mode',W/2,H-34,'#fff8',7,'center')}
if(0){if(G.migrated){delete G.migrated;say('Farm Mars v2','Your v1 save was carried over: day, credits, crops, items and friendships. Tools were reset and new mechanics unlocked!')}
else if(G.day==1&&G.time==360&&!localStorage.getItem('farmmars2'))say('Welcome to Farm Mars',['Sol 1, Dust season, year 2091. You inherited a dome farm outside New Cydonia.','Till soil with the Hoe, plant seeds, and water them every sol. Sleep in your habitat bed to end the day.','East gate: the neon city. North airlock: the Martian surface and the old mine. Tap MENU for your bag, crafting and friends.'])}
window.FM={start:startSlot,get TITLE(){return TITLE},get G(){return G},enter,enterMine,sleep,add,talk:id=>talk(NPCS.find(n=>n.id==id)),act,interact,get modal(){return modal},modalAdvance,ents:()=>ENTS,npcRT};
function loop(){try{update();draw()}catch(e){console.error(e);if(!window.__err)window.__err=e}requestAnimationFrame(loop)}loop();

// ---------- v3 art ----------
function drawBarn(X,Y){R(X+4,Y+46,64,5,'#0005');R(X,Y+12,64,36,'#a8322a');for(let i=0;i<64;i+=6)R(X+i,Y+12,1,36,'#7a2018');R(X-4,Y,72,14,'#5a2a2a');R(X-4,Y,72,3,'#8a4a3a');R(X+4,Y-6,56,8,'#4a2020');
 R(X+22,Y+24,20,24,'#f0e0d0');R(X+24,Y+26,16,22,'#7a2018');cx.strokeStyle='#f0e0d0';cx.lineWidth=2;cx.beginPath();cx.moveTo(X+24,Y+26);cx.lineTo(X+40,Y+48);cx.moveTo(X+40,Y+26);cx.lineTo(X+24,Y+48);cx.stroke();cx.lineWidth=1;
 R(X+6,Y+18,10,8,'#f0e0d0');R(X+7,Y+19,8,6,G.time>=1140?'#ffd06a':'#3a2a2a');R(X+48,Y+18,10,8,'#f0e0d0');R(X+49,Y+19,8,6,G.time>=1140?'#ffd06a':'#3a2a2a');txt('BARN',X+32,Y+10,'#fff',7,'center','#4a1010')}
function drawAnimal(a,X,Y){const b=a.mv&&tick%16<8?1:0,fl=a.f?1:-1;R(X-6,Y-1,12,3,'#0004');
 if(a.t=='hen'){R(X-4,Y-8,8,6,'#f4f0e8');R(X-4,Y-8,8,1,'#fff');R(X+fl*3-1,Y-11,3,4,'#f4f0e8');R(X+fl*3-1,Y-12,2,1,'#e33');R(X+fl*5-(fl<0?1:0),Y-10,1,1,'#fa2');R(X+fl*3,Y-10,1,1,'#000');R(X-2,Y-2,1,2+b,'#fa2');R(X+1,Y-2,1,3-b,'#fa2');R(X-fl*4-1,Y-9,2,2,'#ddd')}
 else{R(X-6,Y-10,12,7,'#b0583a');R(X-6,Y-10,12,2,'#d07a5a');R(X+fl*6-(fl<0?4:0),Y-13,4,5,'#b0583a');R(X+fl*6+(fl>0?1:-2),Y-15,1,2,'#ddd');R(X+fl*6+(fl>0?3:-4),Y-15,1,2,'#ddd');R(X+fl*7-(fl<0?1:0),Y-11,1,1,'#000');
  for(const lx of[-5,-2,2,4])R(X+lx,Y-3,1,3+((lx>0)==!!b?0:-1),'#5a2a1a');R(X-fl*6-(fl>0?1:0),Y-10,1,3,'#7a3a2a')}}
function drawEmote(x,y,k){const bob=Math.sin(tick/6)*1.5;R(x-6,y-10+bob,12,11,'#fff');R(x-5,y-11+bob,10,1,'#fff');R(x-1,y+1+bob,3,2,'#fff');
 txt(k=='heart'?'♥':k=='angry'?'✖':'♪',x,y-2+bob,k=='heart'?'#e24':k=='angry'?'#a20':'#36c',8,'center',0)}
function drawWed(m){const g=cx.createLinearGradient(0,0,0,H);g.addColorStop(0,'#120a30');g.addColorStop(1,'#4a1a4a');cx.fillStyle=g;cx.fillRect(0,0,W,H);
 for(let i=0;i<50;i++)R(hash(i,4)%W,hash(4,i)%90,1,1,'#fff9');cx.strokeStyle='#ffffff22';for(let i=1;i<=5;i++){cx.beginPath();cx.ellipse(W/2,H,W*.6,H*i/5,0,Math.PI,0);cx.stroke()}
 R(0,118,W,40,'#2a1a3a');for(let x=0;x<W;x+=16)R(x,118,1,40,'#3a2a4a');
 const ax=W/2;cx.strokeStyle='#f9c';cx.lineWidth=4;cx.beginPath();cx.arc(ax,108,44,Math.PI,0);cx.stroke();cx.lineWidth=1;for(let a=0;a<14;a++){const t=Math.PI+a/13*Math.PI;R(ax+Math.cos(t)*44-2,108+Math.sin(t)*44-2,4,4,['#fff','#ff6aa8','#ffd27a'][a%3])}
 R(ax-46,108,4,48,'#ccc');R(ax+42,108,4,48,'#ccc');
 const big=(look,X,Y,dir,s=3)=>{const c=document.createElement('canvas');c.width=16;c.height=24;drawChar(c.getContext('2d'),0,0,look,dir,0);cx.drawImage(c,X,Y,16*s,24*s)};
 big(PLOOK,ax-46,86,1);big(m.wl,ax-2,86,3);
 let gi=0;for(const n of NPCS){if(n.id==m.wid)continue;const X=24+gi*48+(gi>=3?W-24-7*48+48:0),Y=128;if(gi<3||gi>=3){const c=document.createElement('canvas');c.width=16;c.height=24;drawChar(c.getContext('2d'),0,0,n.look,2,Math.floor(tick/20+gi)%2?0:1);cx.drawImage(c,gi<3?14+gi*30:W-128+(gi-3)*28,120,24,36)}gi++}
 for(let i=0;i<30;i++){const x=(hash(i,8)%W+Math.sin(tick/30+i)*12+W)%W,y=(hash(8,i)+tick*(.4+i%3*.2))%H;R(x,y,2,2,['#f9c','#fff','#ff6aa8'][i%3])}
 for(let i=0;i<5;i++){const y=100-((tick+i*40)%160)*.5;txt('♥',ax-2+Math.sin((tick+i*40)/10)*10,y,'#ff6aa8',9,'center',0)}
 txt('♥ WEDDING DAY ♥',W/2,22,'#ffd27a',12,'center','#6a1a2a')}

// ---------- v4: credits, sky, weather, water, rover, skills ----------
const CREDL=['FARM MARS','','~ Created by ~','Gavenecko','','~ Built with ~','FarmMars (Grok Bot)','','~ Game Design ~','Gavenecko','','~ Code ~','FarmMars (Grok Bot)','','~ Pixel Art ~','Procedural, drawn in code','','~ Music & Sound ~','Procedural WebAudio synthesis','','~ Colonists of New Cydonia ~','Ava · Kai · Dr. Ruiz · Old Mo','Zara · Theo · Mayor Vega · Pip','R0-V3R the farm robot','','~ Special Thanks ~','Everyone who plays','','Thank you for playing!','','Mars is waking up.'];
function rollCredits(from){CRED={from,y:H+10,t:0};modal=null;menu=null;firstInput()}
function endCredits(){const f=CRED.from;CRED=null;if(f=='title')TITLE=true}
function stars(n,sp,sz,seed){for(let i=0;i<n;i++){const x=(hash(i,seed)%W-tick*sp%W+W*2)%W,y=hash(seed,i)%H;R(x,y,sz,sz,(i+Math.floor(tick/15))%11==0?'#fff':'#fff9')}}
function drawCredits(){const g=cx.createLinearGradient(0,0,0,H);g.addColorStop(0,'#05020f');g.addColorStop(1,'#2a0a1e');cx.fillStyle=g;cx.fillRect(0,0,W,H);
 stars(60,.05,1,11);stars(30,.15,1,12);stars(12,.35,2,13);
 R(40,30,2,2,'#7cf');R(39,31,4,0,'#7cf');txt('Earth',44,34,'#7cf8',6);
 const mx=W/2,my=H+120;cx.fillStyle='#8a2a1a';cx.beginPath();cx.arc(mx,my,190,0,6.3);cx.fill();cx.fillStyle='#c8502e';cx.beginPath();cx.arc(mx-10,my-6,184,0,6.3);cx.fill();
 for(let i=0;i<14;i++){cx.fillStyle='#a03a22';cx.beginPath();cx.arc(mx-150+hash(i,2)%300,my-170+hash(2,i)%40,3+hash(i,5)%6,0,6.3);cx.fill()}
 const pa=tick/90,da=tick/260;cx.fillStyle='#b8a090';cx.beginPath();cx.arc(mx+Math.cos(pa)*170,H-40+Math.sin(pa)*30,5,0,6.3);cx.fill();cx.fillStyle='#d8c8b8';cx.beginPath();cx.arc(mx+Math.cos(da+2)*230,H-70+Math.sin(da+2)*24,3,0,6.3);cx.fill();
 CREDL.forEach((l,i)=>{const y=CRED.y+i*14;if(y<-10||y>H+10)return;const head=l.startsWith('~')||i==0;txt(l,W/2,y,i==0?'#ffd27a':head?'#f8c':'#fff',i==0?18:head?7:9,'center')});
 if(CRED.t>40)txt('tap to skip',W-8,H-6,'#fff6',6,'right')}
function skyBand(ox,oy){const hr=G.time/60,h=30,night=hr>=19.5||hr<6,dusk=hr>=17.5&&hr<19.5,blue=G.terra>=2;
 const g=cx.createLinearGradient(0,0,0,h);const top=night?'#05030f':dusk?'#1a3a6a':blue?'#4a8ad0':'#c8905a',bot=night?'#1a0a18':dusk?'#5a8ac8':blue?'#9ac0e0':'#e8b07a';g.addColorStop(0,top);g.addColorStop(.75,bot);g.addColorStop(1,'rgba(0,0,0,0)');cx.fillStyle=g;cx.fillRect(0,0,W,h);
 if(night||dusk){for(let i=0;i<40;i++){const x=(hash(i,21)%(W*2)-ox*.05+W*2)%W,y=hash(21,i)%22;R(x,y,1,1,i%7?'#fff8':'#fff')}const ex=(300-ox*.04+W)%W;R(ex,8,2,2,'#8cf');light(ex+1,9,8,'#8cf')}
 const px_=((tick*.08-ox*.12)%(W+60)+W+60)%(W+60)-30,dx_=((tick*.02-ox*.08+200)%(W+60)+W+60)%(W+60)-30;
 cx.fillStyle=night?'#c8b8a8':'#ffffffa0';cx.beginPath();cx.arc(px_,12,4,0,6.3);cx.fill();cx.fillStyle='#0003';cx.beginPath();cx.arc(px_+1.5,12,3,0,6.3);cx.fill();
 cx.fillStyle=night?'#ddd':'#ffffff80';cx.beginPath();cx.arc(dx_,7,2,0,6.3);cx.fill();
 for(let i=0;i<4;i++){const x=((i*110-ox*.25)%(W+80)+W+80)%(W+80)-40;cx.fillStyle=night?'#1a0810':'#7a3a2a';cx.beginPath();cx.moveTo(x-40,h);cx.lineTo(x,h-10-i%2*5);cx.lineTo(x+40,h);cx.fill()}}
function weather(ox,oy){const z=G.zone,s=season();
 if(z=='surf'&&(s=='Dust'||s=='Storm'))for(let k=0;k<2;k++){const cxp=((tick*.4+k*500)%(64*T))-ox,cyp=(12+k*14+Math.sin(tick/200+k)*6)*T-oy;if(cxp<-30||cxp>W+30)continue;for(let i=0;i<26;i++){const a=tick/6+i*.9,r=3+i*.7;R(cxp+Math.cos(a)*r,cyp-i*1.6+Math.sin(a)*r*.3,2,1,i%3?'#e8a07a99':'#ffd0a0aa')}}
 if(z=='farm'&&s=='Bloom')for(let i=0;i<18;i++){const x=(hash(i,31)%W+Math.sin(tick/60+i)*20+W)%W,y=(hash(31,i)%H-tick*.2*(1+i%2)+H*4)%H;R(x,y,1,1,'#ffb0f0');light(x,y,5,'#f8c')}
 if(z=='city')for(let i=0;i<10;i++){const x=(hash(i,41)%W+tick*.3)%W,y=(hash(41,i)%60+20);R(x,y,1,1,'#f4f6')}}
function drawWater(z,m,x,y,X,Y,t){const w=t;if(z=='surf'){R(X+1,Y+1,14,14,'#2a6aa0');R(X+1,Y+1,14,2,'#4a9ad0')}
 const s=(tick/10+x*3+y*5)%16;R(X+((s+2)%14)+1,Y+5,3,1,'#bff8');R(X+((s+9)%14)+1,Y+11,2,1,'#8ef8');if((tick+x*7+y*3)%90<6)R(X+7,Y+7,2,2,'#fff');
 const n=(a,b)=>{const q=m[y+b]&&m[y+b][x+a];return q==w||(z=='surf'&&q=='c'&&isPool(x+a,y+b))};if(!n(0,-1))R(X,Y,T,2,'#6a5a4a');if(!n(0,1))R(X,Y+T-2,T,2,'#3a2a1a');if(!n(-1,0))R(X,Y,2,T,'#5a4a3a');if(!n(1,0))R(X+T-2,Y,2,T,'#4a3a2a')}
function drawRover(X,Y,d){const hz=d==1||d==3;R(X-12,Y-2,24,4,'#0005');if(hz){R(X-12,Y-14,24,10,'#e8e0d0');R(X-12,Y-14,24,2,'#fff');R(X+(d==1?2:-10),Y-20,8,6,'#7cf');R(X-12,Y-6,24,2,'#c8502e')}else{R(X-8,Y-18,16,14,'#e8e0d0');R(X-8,Y-18,16,2,'#fff');R(X-5,Y-16,10,5,'#7cf');R(X-8,Y-6,16,2,'#c8502e')}
 const wb=Math.floor(tick/4)%2;for(const wx of hz?[-10,6]:[-10,6]){R(X+wx,Y-5,5,5,'#222');R(X+wx+1,Y-4+wb,3,1,'#666')}light(X+(d==1?14:d==3?-14:0),Y-8+(d==2?6:d==0?-10:0),20,'#ffe')}
function drawSkills(){let y=40;txt('SKILLS',24,y,'#ffd27a',8);for(const k in SKILLS){y+=24;const L=lvl(k),cxp=G.xp[k]||0,nx=20*(L+1)*(L+1),pv=20*L*L;txt(SKILLS[k]+' Lv '+L,24,y,'#fff',8);R(24,y+3,150,5,'#000');R(25,y+4,L>=10?148:148*(cxp-pv)/(nx-pv),3,'#7f7');
  cx.save();cx.beginPath();cx.rect(24,y+8,168,10);cx.clip();txt(perk(k)?'Perk: '+PERKS[k][perk(k)-1]:'Lv5 perk: '+PERKS[k][0],24,y+15,perk(k)?'#ffd27a':'#888',6);cx.restore()}
 const X=200;txt('MAIN QUEST: TERRAFORM MARS',X,40,'#ffd27a',7);txt(G.terra>=3?'Complete! Mars is waking up.':'Stage '+(G.terra+1)+'/3: '+TERRA[G.terra].n,X,50,'#8ef',7);for(let i=0;i<3;i++)R(X+i*50,54,46,4,i<G.terra?'#6c6':'#333');
 const got=Object.keys(G.ach).length;txt('ACHIEVEMENTS '+got+'/'+ACH.length,X,72,'#ffd27a',7);ACH.forEach(([id,n,d],i)=>txt((G.ach[id]?'✓ ':'· ')+n+(G.ach[id]?'':' - '+d),X,82+i*8.5,G.ach[id]?'#9f9':'#888',6))}

let CRPG=0;function craftPage(){const all=RECIPES.filter(r=>!r.cook),n=Math.ceil(all.length/7)||1,pg=CRPG%n;return{rs:all.slice(pg*7,pg*7+7),n,pg}}
const CAM={x:0,y:0,z:null};
