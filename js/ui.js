// Farm Mars v2 - loop, input, rendering, menus
const cv=document.getElementById('c'),cx=cv.getContext('2d');let S=1;
const lc=document.createElement('canvas');lc.width=W;lc.height=H;const lx=lc.getContext('2d');
function resize(){S=Math.min(innerWidth/W,innerHeight/H);cv.width=W;cv.height=H;cv.style.width=W*S+'px';cv.style.height=H*S+'px';cv.style.left=(innerWidth-W*S)/2+'px';cv.style.top=(innerHeight-H*S)/2+'px';cx.imageSmoothingEnabled=false}
addEventListener('resize',resize);resize();
const txt=(s,x,y,c='#fff',sz=8,al='left',sh='#000')=>{cx.font=sz+'px monospace';cx.textAlign=al;if(sh){cx.fillStyle=sh;cx.fillText(s,x+1,y+1)}cx.fillStyle=c;cx.fillText(s,x,y)};
const R=(x,y,w,h,c)=>px(cx,x,y,w,h,c);
function panel(x,y,w,h,c='#140a1ce8',b='#ff6aa8'){R(x,y,w,h,b);R(x+1,y+1,w-2,h-2,c);R(x+1,y+1,w-2,1,'#fff2')}
// ---------- input ----------
const keys={};let joy={on:false,id:null,ox:0,oy:0,dx:0,dy:0},touchUI='ontouchstart' in window,btnFx={};
const BTN={A:{x:W-36,y:H-62,r:23},B:{x:W-82,y:H-30,r:18}};const HB={x:62,y:H-22,s:21};
function firstInput(){auInit();AU.music=G.music;AU.sfx=G.sfx;if(AU.ctx&&AU.ctx.state=='suspended')AU.ctx.resume()}
addEventListener('keydown',e=>{firstInput();const k=e.key.toLowerCase();if(keys[k])return;keys[k]=1;if(['arrowup','arrowdown',' ','tab'].includes(k))e.preventDefault();
 if(modal){if(k=='arrowup'||k=='w')modal.sel=Math.max(0,modal.sel-1),sfx('menu');else if(k=='arrowdown'||k=='s')modal.sel=Math.min((modal.opts||[1]).length-1,modal.sel+1),sfx('menu');else if([' ','enter','e','j','k'].includes(k))modalAdvance(-1);return}
 if(k=='m'||k=='escape'||k=='i'){menu?closeMenu():openMenu('bag');return}if(menu){if(k=='q')menuTab(-1);if(k=='e')menuTab(1);return}
 if(k==' '||k=='j')act();if(k=='e'||k=='k')interact();if(k=='q')G.sel=(G.sel+9)%10;if(k=='tab')G.sel=(G.sel+1)%10;if(k>='1'&&k<='9')G.sel=+k-1;if(k=='0')G.sel=9});
addEventListener('keyup',e=>keys[e.key.toLowerCase()]=0);
function toGame(t){const r=cv.getBoundingClientRect();return[(t.clientX-r.left)/S,(t.clientY-r.top)/S]}
function onTap(x,y){firstInput();if(modal){modalTap(x,y);return true}if(menu){menuTap(x,y);return true}
 if(x>W-46&&y<22){openMenu('bag');sfx('menu');return true}
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
const TABS=['bag','craft','social','system'];
function openMenu(t){menu={tab:t,pick:null,confirm:0};joy={on:false}}function closeMenu(){menu=null;sfx('menu')}
function menuTab(d){menu.tab=TABS[(TABS.indexOf(menu.tab)+d+4)%4];sfx('menu')}
function menuTap(x,y){if(x>W-40&&y<34){closeMenu();return}if(y>14&&y<32){const i=Math.floor((x-20)/62);if(i>=0&&i<4){menu.tab=TABS[i];menu.pick=null;sfx('menu')}return}
 if(menu.tab=='bag'){const i=slotAt(x,y);if(i<0)return;if(menu.pick==null){menu.pick=i;if(i<10)G.sel=i}else{const a=G.inv[menu.pick];G.inv[menu.pick]=G.inv[i];G.inv[i]=a;menu.pick=null}sfx('menu')}
 if(menu.tab=='craft'){const i=Math.floor((y-40)/18);const rs=RECIPES;if(i>=0&&i<rs.length)craft(rs[i])}
 if(menu.tab=='system'){const i=Math.floor((y-44)/20);if(i==0){G.music=AU.music=!G.music}if(i==1){G.sfx=AU.sfx=!G.sfx}if(i==2)save();if(i==4){if(unstick(true)){toast('Moved to a safe spot');menu=null}}if(i==3){if(menu.confirm){localStorage.removeItem('farmmars2');localStorage.removeItem('farmmars1');G=newGame();boot();menu=null;toast('New game started')}else{menu.confirm=1;toast('Tap again to confirm NEW GAME')}}sfx('menu')}}
function slotAt(x,y){const sx=(W-10*24)/2,sy=44;const c=Math.floor((x-sx)/24),r=Math.floor((y-sy)/24);return c>=0&&c<10&&r>=0&&r<3?r*10+c:-1}
// ---------- update ----------
let lastHour=-1;
function update(){tick++;if(toastT)toastT--;if(swingT)swingT--;if(invT)invT--;for(const k in btnFx)if(btnFx[k])btnFx[k]--;
 P.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.vy+=p.gr;p.l--});P=P.filter(p=>p.l>0);FT.forEach(f=>{f.y-=.4;f.l--});FT=FT.filter(f=>f.l>0);
 setMusic(G.zone=='mine'&&MINE.boss&&!G.bossDead?'boss':EXITS[G.zone]?'indoor':G.zone);
 if(modal){if(modal.ch<modal.pages[modal.pi].length){modal.ch+=1.5;if(tick%4==0&&modal.look)sfx('talk')}return}
 if(menu)return;
 if(tick%300==0){G.time+=10;if(G.time>=1560){if(G.zone=='surf'||G.zone=='mine')G.money=Math.max(0,G.money-Math.min(500,Math.floor(G.money*.1)));sleep(true);return}}
 const hr=Math.floor(G.time/60);if(hr!=lastHour){lastHour=hr;placeNPCs(false)}
 // movement
 let dx=(keys.arrowright||keys.d?1:0)-(keys.arrowleft||keys.a?1:0),dy=(keys.arrowdown||keys.s?1:0)-(keys.arrowup||keys.w?1:0);
 if(joy.on&&Math.hypot(joy.dx,joy.dy)>.2){dx=joy.dx;dy=joy.dy}const mv=Math.hypot(dx,dy);G.moving=mv>0&&!swingT;
 if(G.moving){const sp=1.25*(G.energy<10?.6:1)*(mv>1?1/mv:1);dx*=sp;dy*=sp;if(Math.abs(dx)>Math.abs(dy))G.dir=dx>0?1:3;else G.dir=dy>0?2:0;
  const fx=dx>0?5:-5;if(!solidAt(G.px+dx+fx,G.py-3)&&!solidAt(G.px+dx+fx,G.py))G.px+=dx;const fy=dy>0?1:-4;if(!solidAt(G.px-4,G.py+dy+fy)&&!solidAt(G.px+4,G.py+dy+fy))G.py+=dy;anim+=.12*Math.min(1,mv)}
 triggers();
 // npcs
 for(const id in npcRT){const n=npcRT[id];if(n.zone!=G.zone)continue;if(!n.tx||Math.random()<.006){n.tx=n.hx+(Math.random()-.5)*40;n.ty=n.hy+(Math.random()-.5)*28}
  const a=n.tx-n.x,b=n.ty-n.y;n.mv=false;if(Math.hypot(a,b)>2&&!(modal)){const sx=Math.sign(a)*.45,sy=Math.sign(b)*.45;if(!solidAt(n.x+sx*12,n.y))n.x+=sx,n.mv=true;else n.tx=n.x;if(!solidAt(n.x,n.y+sy*8))n.y+=sy,n.mv=true;else n.ty=n.y;if(n.mv){n.dir=Math.abs(a)>Math.abs(b)?(a>0?1:3):(b>0?2:0);n.f=(n.f||0)+.1}}}
 if(G.zone=='farm'){if(Math.random()<.006){robot.tx=(10+Math.random()*18)*T;robot.ty=(8+Math.random()*10)*T}robot.x+=Math.sign(robot.tx-robot.x)*.5;robot.y+=Math.sign(robot.ty-robot.y)*.5}
 if(G.zone=='surf'||G.zone=='mine')hostile();}
function triggers(){const tx=Math.floor(G.px/T),ty=Math.floor((G.py-2)/T),t=tileAt(tx,ty),z=G.zone;
 if(t=='X'){if(z=='farm'&&tx>=30)enter('city',1,10,1);else if(z=='farm')enter('surf',31,41,0);else if(z=='city')enter('farm',29,10,3);else enter('farm',15,1,2)}
 if(t=='D'){if(EXITS[z]){const e=EXITS[z];enter(e[0],e[1],e[2],2)}else{const d=DOORS[z+':'+tx+','+ty];if(d)enter(d[0],d[1],d[2],0)}}
 if(t=='M'){G.py+=T;if(G.deep>=6)say('Mine Elevator','Select a floor:',[{t:'Floor 1',f:()=>enterMine(1)},{t:'Floor 6',f:()=>enterMine(6)},{t:'Cancel'}]);else enterMine(1)}
 if(t=='u'){enter('surf',50,9,2)}
 if(t=='v'){if(G.floor>=10){G.py+=T;say('Floor 10','The tunnel ends in solid basalt. This is the bottom... for now.')}else enterMine(G.floor+1)}}
function hurt(d,from){if(invT)return;G.hp-=d;invT=45;sfx('hurt');parts(G.px,G.py-8,'#f44',8);floatTxt(G.px,G.py-20,'-'+d,'#f66');if(from){const a=Math.atan2(G.py-from.y,G.px-from.x);for(let i=0;i<8;i++){const nx=G.px+Math.cos(a)*1.5,ny=G.py+Math.sin(a)*1.5;if(!solidAt(nx,ny)){G.px=nx;G.py=ny}}}
 if(G.hp<=0){const fee=Math.min(500,Math.floor(G.money*.1));G.money-=fee;G.hp=50;G.o2=100;enter('farm',13,2,2);say('Med Drone','You blacked out. A rescue drone dragged you back to the dome. Medical fee: '+fee+'cr.')}}
function hostile(){const storm=season()=='Storm'&&G.zone=='surf';if(tick%(G.zone=='mine'?90:storm?40:55)==0)G.o2=Math.max(0,G.o2-1);if(G.o2<=0&&tick%30==0){G.hp-=4;sfx('hurt');if(G.hp<=0)hurt(0)}
 const bugs=ENTS.filter(e=>e.k=='bug');
 for(const e of bugs){const b=BUGS[e.t],d=Math.hypot(G.px-e.x,G.py-e.y),a=Math.atan2(G.py-e.y,G.px-e.x);let mx=0,my=0;e.tm++;if(e.hit)e.hit--;
  if(e.t=='crawler'&&d<110){mx=Math.cos(a)*b.spd;my=Math.sin(a)*b.spd}
  if(e.t=='spitter'&&d<130){const s=d<50?-1:d>85?1:0;mx=Math.cos(a)*b.spd*s;my=Math.sin(a)*b.spd*s;if(e.tm%100==0)shoot(e,a,1.7,b.dmg)}
  if(e.t=='hopper'&&d<120){const ph=e.tm%80;if(ph<55){mx=Math.cos(a)*.15;my=Math.sin(a)*.15;e.da=a}else{mx=Math.cos(e.da)*3;my=Math.sin(e.da)*3}}
  if(e.t=='queen'){const ph=Math.floor(e.tm/220)%3;if(ph==0){mx=Math.cos(a)*b.spd;my=Math.sin(a)*b.spd}if(ph==1&&e.tm%45==0){for(let i=0;i<12;i++)shoot(e,i/12*6.283+e.tm,1.4,10);sfx('shoot')}
   if(ph==2&&e.tm%220==1&&bugs.length<6){for(let i=0;i<2;i++)ENTS.push(mkBug('crawler',e.x+(i?20:-20),e.y+10,5));sfx('roar')}}
  mx+=e.vx;my+=e.vy;e.vx*=.8;e.vy*=.8;if(!solidAt(e.x+mx,e.y))e.x+=mx;if(!solidAt(e.x,e.y+my))e.y+=my;
  if(d<(e.t=='queen'?22:11))hurt(b.dmg,e)}
 PR.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.l--;if(Math.hypot(p.x-G.px,p.y-(G.py-6))<7){hurt(p.dmg);p.l=0}if(solidAt(p.x,p.y))p.l=0});PR=PR.filter(p=>p.l>0);
 if(G.zone=='mine')MINE.E=ENTS}
function shoot(e,a,s,d){PR.push({x:e.x,y:e.y-6,vx:Math.cos(a)*s,vy:Math.sin(a)*s,l:150,dmg:d,c:BUGS[e.t].c2});if(e.t!='queen')sfx('shoot')}
// ---------- render ----------
let LIGHTS=[];const light=(x,y,r,c)=>LIGHTS.push({x,y,r,c});
function zoneKey(){return G.zone}
function draw(){const z=G.zone,m=curMap(),mw=m[0].length*T,mh=m.length*T;LIGHTS=[];
 let ox=Math.round(Math.max(0,Math.min(mw-W,G.px-W/2))),oy=Math.round(Math.max(0,Math.min(mh-H,G.py-H/2-10)));if(mw<W)ox=Math.round(-(W-mw)/2);if(mh<H)oy=Math.round(-(H-mh)/2);
 cx.fillStyle={farm:'#2a1208',city:'#0a0614',surf:'#12040c',mine:'#08060c'}[z]||'#0a0608';cx.fillRect(0,0,W,H);
 if(EXITS[z]){cx.fillStyle='#000';cx.fillRect(0,0,W,H)}
 const x0=Math.max(0,Math.floor(ox/T)),y0=Math.max(0,Math.floor(oy/T)),x1=Math.min(m[0].length,Math.ceil((ox+W)/T)+1),y1=Math.min(m.length,Math.ceil((oy+H)/T)+2);
 const D=[];
 for(let y=y0;y<y1;y++)for(let x=x0;x<x1;x++){const t=m[y][x],X=x*T-ox,Y=y*T-oy,v=hash(x,y)%4;let bt=t;
  if(z=='farm'&&'HBTL'.includes(t))bt='g';if(z=='city'&&'HAFLS'.includes(t))bt='p';
  cx.drawImage(tileImg(z,bt,v),X,Y);
  if((z=='surf'||z=='mine')&&t=='R'){const top=z=='mine'?['#3a3048','#4a4060','#1e1828']:['#7a2a3e','#a04a5e','#3a0e1c'];D.push([Y+T,()=>{R(X,Y-7,T,T,top[0]);R(X,Y-7,T,2,top[1]);R(X,Y+9,T,7,top[2]);if(v==1)R(X+4,Y-3,3,2,top[2]);R(X+T,Y+2,3,T-2,'#0003')}])}
  if(z=='surf'&&t=='O'){D.push([Y+T,()=>{R(X+4,Y-18,8,32,'#2a1a3a');R(X+5,Y-17,6,30,'#3a2a50');const g=tick%120<60;R(X+7,Y-12,2,2,g?'#6ff':'#288');R(X+7,Y-6,2,2,'#6ff');R(X+7,Y,2,2,g?'#288':'#6ff')}]);light(X+8,Y-6,26,'#4ff')}
  if(z=='surf'&&t=='V')light(X+8,Y+8,22,'#f80');
  if(t=='L'){D.push([Y+T,()=>{R(X+7,Y-18,2,32,'#556');R(X+4,Y-20,8,3,z=='city'?'#f0f':'#ffb050');R(X+5,Y-17,6,1,'#fff8')}]);light(X+8,Y-18,46,z=='city'?'#f4f':'#fb6')}
  if(z=='farm'){const ft=G.tiles[x+','+y];if(ft){R(X+1,Y+1,14,14,ft.w?'#4a2010':'#7a3a1c');for(let i=3;i<14;i+=4){R(X+2,Y+i,12,1,ft.w?'#38180a':'#5a2a14');R(X+2,Y+i+1,12,1,ft.w?'#5a3020':'#9a5030')}if(ft.w&&v==0)R(X+4,Y+5,2,1,'#8cf6');
    if(ft.c){const c=ft.c,st=Math.min(ft.g/CROPS[c].days,1),wilt=ft.dry>=2;D.push([Y+12,()=>drawCrop(cx,X,Y,c,st,wilt)]);if(c=='glo'||c=='frb')light(X+8,Y+6,14,CROPS[c].c)}}
   const o=G.objs[x+','+y];if(o)D.push([Y+12,()=>{drawIcon(cx,o,X,Y);if(tick%90<10)R(X+3,Y+2,10,1,'#9cf')}]);
   if(t=='T')D.push([Y+T,()=>{if(x==25&&y==2){R(X,Y-10,32,42,'#5a7a8a');R(X+1,Y-10,30,4,'#9ab');R(X+3,Y+2,26,14,'#3a8ab0');R(X+3,Y+2,26,2,'#8ef');R(X+1,Y+28,30,4,'#3a4a5a');txt('H2O',X+16,Y-1,'#cef',7,'center',0)}}]);
   if(t=='B')D.push([Y+T,()=>{R(X,Y+2,T,13,'#6b3b1f');R(X,Y+2,T,4,'#a86a3a');R(X+2,Y+9,12,1,'#432');R(X+6,Y+4,4,1,'#fd6')}])}
  if(z=='mine'&&(t=='u'||t=='v'))light(X+8,Y+8,24,t=='v'?'#fd6':'#8cf');}
 drawStructures(ox,oy,D);
 // entities
 const pl=()=>{const blink=invT&&tick%6<3;if(blink)return;const fr=G.moving?Math.floor(anim*2.5)%4:0;const X=G.px-8-ox,Y=G.py-24-oy;
  if(swingT&&G.dir==0)drawSwing(X,Y);drawChar(cx,X,Y,PLOOK,G.dir,fr,{suit:z=='surf'||z=='mine',swing:swingT>0});if(swingT&&G.dir!=0)drawSwing(X,Y)};
 D.push([G.py-oy,pl]);
 for(const id in npcRT){const n=npcRT[id];if(n.zone!=z)continue;const npc=NPCS.find(q=>q.id==id),X=n.x-8-ox,Y=n.y-24-oy;D.push([n.y-oy,()=>{drawChar(cx,X,Y,npc.look,n.dir||2,n.mv?Math.floor(n.f*2.5)%4:0);
   const near=Math.hypot(n.x-G.px,n.y-G.py)<40;if(near||G.spouse==id){txt((G.spouse==id?'♥ ':'')+npc.n,X+8,Y-3,G.spouse==id?'#f8a':'#fff',7,'center')}if(G.events&&[3,6,9].some(l=>G.hearts[id]>=l&&npc.ev[l]&&!G.events[id+l]))txt('!',X+8,Y-10+Math.sin(tick/8)*2,'#ff0',9,'center')}])}
 if(z=='farm'){D.push([robot.y-oy,()=>drawRobot(cx,robot.x-8-ox,robot.y-16-oy,tick)]);light(robot.x-ox,robot.y-10-oy,16,'#0ff')}
 for(const e of ENTS){const X=e.x-ox,Y=e.y-oy;if(X<-40||X>W+40||Y<-40||Y>H+40)continue;
  if(e.k=='ore')D.push([Y+4,()=>drawOre(e,X,Y)]),e.t!='stone'&&e.t!='iron'&&light(X,Y-4,18,ITEMS[e.t].c);
  if(e.k=='plant'){D.push([Y+4,()=>drawPlant(e,X,Y)]);light(X,Y-4,24,ITEMS[e.t].c)}
  if(e.k=='bug'){D.push([Y+4,()=>drawBug(e,X,Y)]);if(e.t=='queen')light(X,Y-10,60,'#4df')}}
 D.sort((a,b)=>a[0]-b[0]).forEach(d=>d[1]());
 PR.forEach(p=>{R(p.x-ox-2,p.y-oy-2,4,4,p.c);R(p.x-ox-1,p.y-oy-1,2,2,'#fff');light(p.x-ox,p.y-oy,10,p.c)});
 P.forEach(p=>R(p.x-ox,p.y-oy,2,2,p.c));
 overlays(ox,oy);lighting(ox,oy);
 FT.forEach(f=>txt(f.s,f.x-ox,f.y-oy,f.c,7,'center'));
 hud();if(menu)drawMenu();if(modal)drawModal()}
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
 if(z=='mine'){cx.fillStyle='rgba(40,20,80,.08)';cx.fillRect(0,0,W,H)}}
function lighting(ox,oy){const z=G.zone,hr=G.time/60;let dark=hr<19?0:Math.min(.5,(hr-19)/5*.5);if(hr<6.5)dark=.38;
 if(EXITS[z])dark*=.35;if(z=='mine')dark=.62;if(z=='surf')dark=Math.min(.6,dark+.06);if(z=='city')dark*=.85;
 if(dark>.02){if(z=='mine'||(z=='surf'&&dark>.3))light(G.px-ox,G.py-10-oy,z=='mine'?110:80,'#ffe0a0');
  lx.globalCompositeOperation='source-over';lx.clearRect(0,0,W,H);lx.fillStyle=`rgba(8,2,24,${dark})`;lx.fillRect(0,0,W,H);lx.globalCompositeOperation='destination-out';
  for(const l of LIGHTS){const g=lx.createRadialGradient(l.x,l.y,0,l.x,l.y,l.r);g.addColorStop(0,'rgba(0,0,0,1)');g.addColorStop(1,'rgba(0,0,0,0)');lx.fillStyle=g;lx.fillRect(l.x-l.r,l.y-l.r,l.r*2,l.r*2)}
  cx.drawImage(lc,0,0)}
 cx.globalCompositeOperation='lighter';for(const l of LIGHTS){if(!l.c)continue;const g=cx.createRadialGradient(l.x,l.y,0,l.x,l.y,l.r*.7);g.addColorStop(0,hexA(l.c,.18+dark*.25));g.addColorStop(1,hexA(l.c,0));cx.fillStyle=g;cx.fillRect(l.x-l.r,l.y-l.r,l.r*2,l.r*2)}cx.globalCompositeOperation='source-over'}
function hexA(h,a){let c=h.replace('#','');if(c.length==3)c=c.split('').map(q=>q+q).join('');const n=parseInt(c.slice(0,6),16);return `rgba(${n>>16},${n>>8&255},${n&255},${a})`}
function bar(x,y,v,mx,c,l){R(x,y,56,7,'#000');R(x+1,y+1,54,5,'#2a1a2a');R(x+1,y+1,54*Math.max(0,v)/mx,5,c);R(x+1,y+1,54*Math.max(0,v)/mx,1,'#fff5');txt(l,x+59,y+7,'#fff',7)}
function aLabel(){const s=cur(),[fx,fy]=facingTile();if(G.zone=='farm'&&mature(G.tiles[fx+','+fy]))return 'HARVEST';if(!s)return 'USE';const it=ITEMS[s[0]];
 if(it.food||it.use)return 'EAT';if(it.seed)return 'PLANT';if(it.place)return 'PLACE';return{hoe:'TILL',can:'WATER',pick:'MINE',blade:'ATTACK'}[s[0]]||'USE'}
function hud(){const z=G.zone;panel(3,3,124,z=='surf'||z=='mine'?47:38,'#0a0612d8','#ffb050');
 const h=Math.floor(G.time/60)%24,mm=G.time%60,ic=G.time<1140?'☀':'☾';txt(`${season()} ${solOfSeason()} · Y${year()}`,7,12,'#ffd27a',8);txt(ic+' '+String(h).padStart(2,'0')+':'+String(mm).padStart(2,'0'),123,12,'#fff',8,'right');
 bar(7,16,G.energy,G.maxEn,'#fc3','EN');bar(7,25,G.hp,100,'#f44','HP');txt(G.money+'cr',123,32,'#7f7',8,'right');
 if(z=='surf'||z=='mine'){bar(7,34,G.o2,100,G.o2<25&&tick%20<10?'#f00':'#3cf','O2');if(G.o2<25)txt('LOW OXYGEN!',W/2,46,'#f44',9,'center')}
 const zn={farm:'Dome Farm',city:'New Cydonia',surf:'Martian Surface',home:'Your Habitat',cafe:'Red Dust Cafe',shop:'Supply & Tech',cc:'Community Center',mine:'Mine - Floor '+G.floor}[z];txt(zn,W/2,12,'#fff9',8,'center');
 const boss=ENTS.find(e=>e.t=='queen');if(boss){R(W/2-80,18,160,8,'#000');R(W/2-79,19,158*boss.hp/boss.max,6,'#4df');txt('CRYSTAL QUEEN',W/2,32,'#bff',7,'center')}
 R(W-46,3,43,19,'#ff6aa8');R(W-45,4,41,17,'#1a0a24');txt('MENU',W-24.5,16,'#fff',8,'center');
 for(let i=0;i<10;i++){const X=HB.x+i*HB.s,Y=HB.y;R(X,Y,HB.s-1,HB.s-1,i==G.sel?'#ffd27a':'#000c');R(X+1,Y+1,HB.s-3,HB.s-3,i==G.sel?'#4a2a3a':'#2a1a2acc');const s=G.inv[i];if(s){drawIcon(cx,s[0],X+2,Y+2);const it=ITEMS[s[0]];if(it.tool&&G.tools[s[0]]>1)R(X+2,Y+2,3,3,['','','#c96','#46f'][G.tools[s[0]]]);if(!it.tool)txt(s[1],X+HB.s-2,Y+HB.s-2,'#fff',7,'right')}}
 const s=cur();if(s)txt(ITEMS[s[0]].n+(ITEMS[s[0]].tool?' ('+TOOL_TIER_NAMES[G.tools[s[0]]]+')':''),HB.x+105,HB.y-4,'#fff',7,'center');
 if(joy.on){cx.globalAlpha=.35;cx.fillStyle='#fff';cx.beginPath();cx.arc(joy.ox,joy.oy,26,0,6.3);cx.fill();cx.globalAlpha=.75;cx.beginPath();cx.arc(joy.ox+joy.dx*26,joy.oy+joy.dy*26,11,0,6.3);cx.fill();cx.globalAlpha=1}
 else if(touchUI){cx.globalAlpha=.3;cx.strokeStyle='#fff';cx.lineWidth=2;cx.beginPath();cx.arc(46,H-70,26,0,6.3);cx.stroke();cx.globalAlpha=1;txt('MOVE',46,H-67,'#fff8',7,'center')}
 if(touchUI){const lab={A:aLabel(),B:nearNPC()?'TALK':'ACT'};for(const k in BTN){const b=BTN[k];cx.globalAlpha=btnFx[k]?.95:.6;cx.fillStyle=k=='A'?'#e8603a':'#3aa8cc';cx.beginPath();cx.arc(b.x,b.y,b.r,0,6.3);cx.fill();cx.strokeStyle='#fff';cx.lineWidth=1.5;cx.stroke();cx.globalAlpha=1;txt(lab[k],b.x,b.y+3,'#fff',lab[k].length>5?7:8,'center')}}
 if(toastT){cx.globalAlpha=Math.min(1,toastT/20);cx.font='8px monospace';const w=cx.measureText(toastS).width+12;panel(W/2-w/2,H-48,w,13,'#000c','#fff4');txt(toastS,W/2,H-38,'#fff',8,'center');cx.globalAlpha=1}}
function wrapLines(s,w,sz=8){cx.font=sz+'px monospace';const out=[];let l='';for(const t of s.split(' ')){if(cx.measureText(l+t).width>w&&l){out.push(l);l=''}l+=t+' '}out.push(l);return out}
function drawModal(){const m=modal,pg=m.pages[m.pi],by=H-58,hasP=!!m.look,tx=hasP?66:16;panel(6,by,W-12,54);
 if(hasP){R(11,by+5,50,44,'#2a1a3a');drawPortrait(cx,12,by+6,m.look,3)}
 if(m.name){cx.font='8px monospace';const w=cx.measureText(m.name).width+10;panel(tx-4,by-11,w,12,'#3a1a4a');txt(m.name,tx+1,by-2,'#ffd27a')}
 wrapLines(pg.slice(0,Math.floor(m.ch)),W-tx-16).slice(0,5).forEach((l,i)=>txt(l,tx,by+12+i*9,'#fff'));
 const done=m.ch>=pg.length;if(done&&(!modalLast()||!m.opts)&&tick%40<28)txt('▼',W-16,by+50,'#8ff',8,'center');
 if(done&&modalLast()&&m.opts){m.opts.forEach((o,i)=>{const[x,y,w,h]=optRect(i);panel(x,y,w,h,i==m.sel?'#3a1a4af0':'#140a1cf0',i==m.sel?'#0ff':'#7a4a8a');cx.save();cx.beginPath();cx.rect(x,y,w,h);cx.clip();txt(o.t,x+5,y+10,i==m.sel?'#0ff':'#eee',7);cx.restore()})}}
function drawMenu(){panel(12,8,W-24,H-16,'#120818f4','#ffb050');TABS.forEach((t,i)=>{const X=20+i*62,a=menu.tab==t;panel(X,14,58,17,a?'#4a2a3a':'#1a0e24',a?'#ffd27a':'#6a4a6a');txt(t.toUpperCase(),X+29,26,a?'#ffd27a':'#aaa',8,'center')});
 panel(W-38,12,24,20,'#4a1a2a','#f66');txt('X',W-26,26,'#fff',9,'center');
 if(menu.tab=='bag'){for(let i=0;i<30;i++){const X=(W-240)/2+(i%10)*24,Y=44+Math.floor(i/10)*24;R(X,Y,22,22,menu.pick==i?'#0ff':i<10?'#7a5a3a':'#4a3a4a');R(X+1,Y+1,20,20,'#241626');if(i==G.sel)R(X+1,Y+20,20,1,'#ffd27a');const s=G.inv[i];if(s){drawIcon(cx,s[0],X+3,Y+3);if(!ITEMS[s[0]].tool)txt(s[1],X+21,Y+21,'#fff',7,'right')}}
  txt('Top row = hotbar. Tap an item, then tap another slot to move/swap.',W/2,124,'#aaa',7,'center');const s=G.inv[menu.pick!=null?menu.pick:G.sel];
  if(s){const it=ITEMS[s[0]];txt(it.n+(it.tool?' - '+TOOL_TIER_NAMES[G.tools[s[0]]]+' tier':''),24,140,'#ffd27a',8);wrapLines(it.d||(it.tool?'A trusty tool. Upgrade at Supply & Tech.':''),W-60,7).forEach((l,i)=>txt(l,24,151+i*9,'#ddd',7));if(it.v)txt('Sells for '+it.v+'cr'+(it.food?'  ·  +'+it.food+' energy':''),24,172,'#7f7',7)}
  txt(`Harvested ${G.stats.harvest} · Mined ${G.stats.mined} · Bugs ${G.stats.bugs} · Deepest floor ${G.deep}`,W/2,H-20,'#9ab',7,'center')}
 if(menu.tab=='craft'){RECIPES.forEach((r,i)=>{const Y=40+i*18,ok=hasAll(r.in)&&(!r.cook||G.zone=='home');panel(24,Y,W-48,16,ok?'#1a3a2a':'#1a0e24',ok?'#6c6':'#5a4a5a');drawIcon(cx,r.id,27,Y);
  txt(ITEMS[r.id].n+(r.cook?' (kitchen)':''),46,Y+11,ok?'#bfb':'#bbb',8);txt(Object.entries(r.in).map(([k,q])=>cnt(k)+'/'+q+' '+ITEMS[k].n).join('  '),W-28,Y+11,'#ddd',7,'right')});txt('Tap a recipe to craft. Cooking works at your home kitchen.',W/2,H-18,'#aaa',7,'center')}
 if(menu.tab=='social'){NPCS.forEach((n,i)=>{const Y=38+i*36;panel(24,Y,W-48,33,'#1a0e24','#6a4a6a');drawPortrait(cx,27,Y+1,n.look,2);const h=G.hearts[n.id];txt(n.n,62,Y+12,'#ffd27a',8);
  for(let j=0;j<10;j++)txt(j<Math.floor(h)?'♥':j<h?'♡':'·',62+j*9,Y+25,j<h?'#f6a':'#666',9);
  const st=G.spouse==n.id?'Spouse ♥':G.dating[n.id]?'Dating':n.mar?'Single':'';txt(st,W-30,Y+12,'#f8c',8,'right');txt(h>=4?'Likes: '+n.likes.map(k=>ITEMS[k].n).join(', '):'Likes: ??? (4♥)',W-30,Y+25,'#9ab',7,'right')})}
 if(menu.tab=='system'){['Music: '+(G.music?'ON':'OFF'),'Sound FX: '+(G.sfx?'ON':'OFF'),'Save game','New game'+(menu.confirm?' - TAP AGAIN TO CONFIRM':''),'Unstuck me (move to safe spot)'].forEach((l,i)=>{panel(60,44+i*20,W-120,17,'#1a0e24','#7a4a8a');txt(l,W/2,56+i*20,'#fff',8,'center')});
  if(0)txt('Keys: WASD move · Space use · E act · 1-0 hotbar · M menu',W/2,H-30,'#aaa',7,'center');txt('Farm Mars v2 · saves automatically each night',W/2,H-19,'#777',7,'center')}}
// ---------- boot ----------
function boot(){ENTS=[];SURF=genSurface();MINE=null;for(const k in npcRT)delete npcRT[k];if(G.zone=='mine'){G.zone='surf';G.px=50*T+8;G.py=9*T+8}if(G.zone=='surf')ENTS=SURF;placeNPCs(true);unstick(false);AU.music=G.music;AU.sfx=G.sfx}
G=load()||newGame();boot();
if(G.migrated){delete G.migrated;say('Farm Mars v2','Your v1 save was carried over: day, credits, crops, items and friendships. Tools were reset and new mechanics unlocked!')}
else if(G.day==1&&G.time==360&&!localStorage.getItem('farmmars2'))say('Welcome to Farm Mars',['Sol 1, Dust season, year 2091. You inherited a dome farm outside New Cydonia.','Till soil with the Hoe, plant seeds, and water them every sol. Sleep in your habitat bed to end the day.','East gate: the neon city. North airlock: the Martian surface and the old mine. Tap MENU for your bag, crafting and friends.']);
window.FM={get G(){return G},enter,enterMine,sleep,add,talk:id=>talk(NPCS.find(n=>n.id==id)),act,interact,get modal(){return modal},modalAdvance,ents:()=>ENTS,npcRT};
function loop(){try{update();draw()}catch(e){console.error(e);if(!window.__err)window.__err=e}requestAnimationFrame(loop)}loop();
