// Farm Mars v5 - Valles Canyon, Sand Wyrm, crop quality, festivals, habitat upgrades, fishing minigame, NPC chatter, sci-fi UI
const OUTZ=z=>z=='surf'||z=='mine'||z=='valles';
function storeE(){if(G.zone=='mine')MINE.E=ENTS;else if(G.zone=='valles')VALL=ENTS;else SURF=ENTS}
// ---------- terraformed crater pools: only crater interiors fill ----------
const CRAT=[[14,12,4],[40,26,5],[20,32,3],[56,34,4]];
function isPool(x,y){return G.terra>=3&&CRAT.some(([a,b,r])=>Math.hypot(x-a,y-b)<r-1.3)}
{const _gs=genSurface;genSurface=function(){return _gs().filter(e=>{const x=Math.floor(e.x/T),y=Math.floor(e.y/T);return !isPool(x,y)&&!(x>=56&&y>=19&&y<=24)})}}
// surface east gate to the canyon
for(let y=19;y<=24;y++)for(let x=56;x<=62;x++)MAPS.surf[y][x]='r';MAPS.surf[21][63]='X';MAPS.surf[22][63]='X';
// ---------- new items, bugs, data ----------
Object.assign(ITEMS,{jasp:{n:'Canyon Jasper',v:110,c:'#e0603a',d:'Banded stone from the Valles walls.'},opal:{n:'Fire Opal',v:260,c:'#ffa040',d:'Rare canyon gem. Flickers like a flame.'},
 saltb:{n:'Salt Bloom',v:70,c:'#f0e8ff',food:15,d:'Crystalline flower from canyon salt flats.'},scale:{n:'Scorpion Scale',v:55,c:'#d08a4a',d:'Dropped by Dust Scorpions.'},
 wcore:{n:'Wyrm Heart',v:2000,c:'#ff7a2a',d:'Still warm. The heart of the Sand Wyrm.'}});
Object.assign(BUGS,{scorp:{hp:7,spd:.7,dmg:12,c:'#b8642a',c2:'#ffc080',drop:'scale'},mantis:{hp:8,spd:.5,dmg:14,c:'#5aa04a',c2:'#d0ff9a',drop:'scale'},wyrm:{hp:140,spd:.7,dmg:18,c:'#c8783a',c2:'#ffd0a0',drop:'wcore',boss:1}});
RESEARCH.push('jasp','opal','saltb','scale');REQPOOL.push('jasp','saltb');
ACH.push(['wyrm','Canyon Slayer','Defeat the Sand Wyrm',g=>!!g.wyrmDead],['gold','Gold Standard','Harvest a gold-quality crop',g=>(g.stats.gold||0)>=1],['cozy','Home Sweet Dome','Place 5 decorations',g=>Object.keys(g.decor||{}).length>=5],['fest','Party Animal','Join festivals in 3 seasons',g=>Object.keys(g.fests||{}).length>=3]);
// quality variants (silver/gold) for every crop
for(const k in CROPS){const b=ITEMS[k];ITEMS[k+'_s']=Object.assign({},b,{n:'Silver '+b.n,v:Math.round(b.v*1.25),q:1,base:k});ITEMS[k+'_g']=Object.assign({},b,{n:'Gold '+b.n,v:Math.round(b.v*1.6),q:2,base:k,food:Math.round((b.food||0)*1.5)})}
function qualId(c){const L=lvl('farm'),r=Math.random(),gold=.04+L*.035+(G.decor&&G.decor.scope?.03:0),silv=gold+.14+L*.04;if(r<gold){G.stats.gold=(G.stats.gold||0)+1;return c+'_g'}return r<silv?c+'_s':c}
// ---------- Valles Canyon ----------
const VW=56,VH=36,vcy=x=>18+Math.sin(x*.16)*5*Math.min(1,x/8),vhw=x=>x<3?3:4.5+Math.sin(x*.31+1)*1.6;
MAPS.valles=mk(VW,VH,(x,y)=>{if(x==0&&(y==17||y==18))return 'X';if(x==0||y==0||x==VW-1||y==VH-1)return 'R';
 if(x>=42&&Math.hypot(x-48,y-18)<7.2)return hash(x,y)%9==0?'y':'r';
 if(x<44&&Math.abs(y-vcy(x))<vhw(x)){const h=hash(x*7,y*3)%100;if(x>4&&h<4)return 'R';if(h>97&&x>4)return 'V';return h<30?'y':'r'}
 if(x<44&&y>=17&&y<=18)return 'r';return 'R'});
for(let x=1;x<4;x++)for(let y=16;y<=19;y++)MAPS.valles[y][x]='r';
function genValles(){const E=[],m=MAPS.valles;let n=0,g=0;while(n<46&&g++<4000){const x=4+Math.floor(Math.random()*(VW-6)),y=2+Math.floor(Math.random()*(VH-4));const t=m[y][x];if(t!='r'&&t!='y')continue;if(x>=41||x<6)continue;const q=Math.random();
  if(q<.38){const ty=Math.random()<.18?'opal':'jasp';E.push({k:'ore',t:ty,x:x*T+8,y:y*T+8,hp:ty=='opal'?7:5})}else if(q<.6)E.push({k:'plant',t:'saltb',x:x*T+8,y:y*T+8});else E.push(mkBug(Math.random()<.6?'scorp':'mantis',x*T+8,y*T+8,2));n++}
 if(!G.wyrmDead)E.push(Object.assign(mkBug('wyrm',48*T+8,18*T+8,0),{under:1,awake:0}));return E}
function vallesIntro(){if(!G.vint){G.vint=1;say('Valles Canyon',['The gate opens onto a canyon four kilometers deep. Banded walls of jasper glow in the low sun.','Dust Scorpions and Canyon Mantises hunt here. Deep in the canyon, the sand itself seems to breathe...','(New: Canyon Jasper, Fire Opal, Salt Bloom. Watch your O2.)'])}}
function wyrmAI(e,a,d,bugs){const b=BUGS.wyrm;e.tm++;if(e.hit)e.hit--;
 if(!e.awake){if(d<90){e.awake=1;e.tm=0;sfx('roar');toast('The sand erupts - SAND WYRM!');parts(e.x,e.y,'#c8783a',30,3)}return}
 const ph=Math.floor(e.tm/200)%3;e.under=ph==1&&e.tm%200<170?1:0;
 if(ph==0){e.x+=Math.cos(a)*b.spd;e.y+=Math.sin(a)*b.spd;if(e.tm%70==0){for(let i=-1;i<=1;i++)shoot(e,a+i*.3,1.8,10);sfx('shoot')}}
 if(ph==1){if(e.under){const nx=e.x+Math.cos(a)*1.3,ny=e.y+Math.sin(a)*1.3;if(!solidAt(nx,ny)){e.x=nx;e.y=ny}if(tick%6==0)parts(e.x,e.y,'#a86a3a',3,1)}else if(e.tm%200==170){for(let i=0;i<14;i++)shoot(e,i/14*6.283,1.5,12);sfx('break');parts(e.x,e.y,'#ffd0a0',24,3)}}
 if(ph==2&&e.tm%200==5&&bugs.length<7){ENTS.push(mkBug('scorp',e.x-24,e.y+8,3),mkBug('scorp',e.x+24,e.y+8,3));sfx('roar')}
 e.x+=e.vx;e.y+=e.vy;e.vx*=.8;e.vy*=.8;if(!e.under&&d<22)hurt(b.dmg,e)}
function wyrmDie(e){G.wyrmDead=1;add('wcore');G.money+=1500;sfx('wed');addXP('combat',150);checkAch();say('VICTORY',['The Sand Wyrm thrashes once and sinks into the canyon floor. Silence.','You recover the Wyrm Heart and 1500cr of fused opal glass. The canyon is safe to explore.'],[{t:'Roll the credits',f:()=>rollCredits('game')},{t:'Continue'}])}
// ---------- festivals ----------
const FESTN=["Founders' Festival",'Bloom Fair','Ice Lantern Night','Storm Derby'];
const festName=()=>FESTN[seasonIdx()];
function festAct(){const s=seasonIdx();G.fests=G.fests||{};G.fests[s]=1;
 if(s==1){const best=[2,1,0].map(q=>G.inv.findIndex(i=>i&&ITEMS[i[0]]&&(q?ITEMS[i[0]].q==q:ITEMS[i[0]].crop&&!ITEMS[i[0]].q))).map((i,k)=>[i,2-k]).find(p=>p[0]>=0);
  if(!best){say('Bloom Fair','MAYOR VEGA: Enter a crop in the judging! Bring one from your bag - quality matters.');delete G.fests[s];return}
  const[i,q]=best,it=ITEMS[G.inv[i][0]],prize=[200,600,1500][q];take(i);G.money+=prize;G.feast=G.day;sfx('wed');checkAch();say('Bloom Fair',['You enter your '+it.n+' in the crop judging.',['Third place! ','Second place! ','FIRST PLACE! '][q]+'The judges award you '+prize+'cr.'+(q==2?' Old Mo whistles loudly from the crowd.':'')]);return}
 if(s==2){G.feast=G.day;G.energy=G.maxEn;for(const n of NPCS)addHearts(n,.5);G.decor=G.decor||{};G.decor.lantern=1;sfx('wed');checkAch();say('Ice Lantern Night',['Everyone writes a wish on a paper lantern and lets it rise into the dome sky.','Hundreds of tiny lights drift up toward the frost. Your friendships with every colonist grow.','You keep a spare lantern - it now hangs in your habitat.']);return}
 if(s==3){G.feast=G.day;const rc=[['Zara\'s "Red Comet"',.45],['Pip\'s "Junkbot 9000"',.3],['Theo\'s "Stargazer"',.25]];say('Storm Derby','Rovers race through the dust storm! Bet 200cr on a racer (pays 3x):',rc.map(([n,p])=>({t:n,f:()=>{if(G.money<200){toast('Not enough credits');G.feast=0;return}G.money-=200;let r=Math.random(),w=rc.length-1;for(let k=0,acc=0;k<rc.length;k++){acc+=rc[k][1];if(r<acc){w=k;break}}const win=rc[w][0]==n;if(win)G.money+=600;sfx(win?'coin':'bad');checkAch();say('Storm Derby',[rc[w][0]+' wins the derby!',win?'Your bet pays out 600cr!':'Better luck next storm.'])}})).concat([{t:'Just watch',f:()=>{checkAch();say('Storm Derby','The rovers vanish into the dust. Pip\'s Junkbot loses a wheel and keeps going anyway. Everyone cheers.')}}]));return}}
// ---------- habitat upgrades & decoration ----------
const HUPG=[null,{cr:5000,in:{iron:30,jasp:5},n:'Expanded Habitat',d:'+20 max energy, roomier home, more decor slots.'},{cr:12000,in:{cob:10,pla:4,opal:2},n:'Deluxe Habitat',d:'+20 max energy, cooking makes double portions.'}];
const FURN={rug:{n:'Martian Rug',p:400,x:3,y:6},lamp:{n:'Lava Lamp',p:350,x:1,y:2},shelf:{n:'Bookshelf',p:600,x:3,y:0},aqua:{n:'Aquarium',p:1200,x:10,y:3,h:1},sofa:{n:'Crater Sofa',p:900,x:8,y:4,h:1},scope:{n:'Telescope',p:1500,x:10,y:6,h:1},poster:{n:'Earthrise Poster',p:150,x:6,y:0},lantern:{n:'Ice Lantern',p:0,x:5,y:2,fest:1}};
function habitatMenu(){G.decor=G.decor||{};G.house=G.house||0;const o=[];const u=HUPG[G.house+1];
 if(u)o.push({t:'Upgrade: '+u.n+' '+u.cr+'cr+'+Object.entries(u.in).map(([i,q])=>q+' '+ITEMS[i].n.split(' ').pop()).join(','),f:()=>{if(G.money>=u.cr&&hasAll(u.in)){G.money-=u.cr;for(const[i,q]of Object.entries(u.in))rem(i,q);G.house++;G.maxEn+=20;sfx('wed');say('Habitat',u.n+' complete! '+u.d)}else{toast('Need more credits/materials');sfx('bad');habitatMenu()}}});
 else o.push({t:'Habitat: Deluxe (max)',f:habitatMenu});
 for(const k in FURN){const f=FURN[k];if(f.fest)continue;const own=G.decor[k],lock=f.h&&G.house<1;o.push({t:f.n+(own?' (placed)':lock?' (needs Expanded Habitat)':' '+f.p+'cr'),f:()=>{if(!own&&!lock){if(G.money>=f.p){G.money-=f.p;G.decor[k]=1;sfx('coin');checkAch();toast(f.n+' placed in your habitat')}else{toast('Not enough credits');sfx('bad')}}habitatMenu()}})}
 o.push({t:'Back',f:shopMenu});say('Habitat Catalog','Comfort '+comfort()+' (each point: +2 morning energy). '+G.money+'cr.',o)}
const comfort=()=>Object.keys(G.decor||{}).length+(G.house||0)*2;
{const _sm=shopMenu;shopMenu=function(){_sm();if(modal&&modal.opts)modal.opts.splice(modal.opts.length-1,0,{t:'Habitat upgrades & decor',f:habitatMenu})}}
{const _cr=craft;craft=function(r){const b=cnt(r.id);_cr(r);if(r.cook&&G.house>=2&&cnt(r.id)>b)add(r.id)}}
{const _sl=sleep;sleep=function(p){_sl(p);const c=comfort();if(c&&!p){G.energy=Math.min(G.maxEn+c*2,G.energy+c*2)}}}
// ---------- extra heart events ----------
const EV2={ava:{4:["Ava hands you a tiny bolt on a chain.","AVA: It's from the first dome seal I ever replaced. It held for nine years. Keep it.","It's oddly touching."],7:["The power flickers. Ava grabs your hand in the dark.","AVA: ...Backup reactor in 3, 2, 1.","The lights return. She doesn't let go right away."]},
 kai:{4:["Kai lets you taste a new recipe: glowcap curry.","KAI: Too spicy? Be honest. ...Okay, be a little less honest."],7:["Kai shows you a battered notebook of recipes from Earth.","KAI: My grandmother's. I'm going to cook every one of these on Mars.","He writes your name next to the curry recipe."]},
 ruiz:{4:["DR. RUIZ: Hold this sample very still. ...Very still. Perfect.","She names a new bacterium after your farm."],7:["Dr. Ruiz shows you a seedling growing in unfiltered Martian soil.","DR. RUIZ: Twenty years of work. And your crops gave me the last gene I needed.","She is crying a little. So are you."]},
 mo:{4:["Old Mo teaches you to read the color of ore by lamplight.","OLD MO: Cobalt hums blue. Iron sulks red. Listen to the rocks, kid."],7:["Old Mo hands you his partner's old helmet lamp.","OLD MO: She'd want it to see daylight again. Take it into the canyon for me.","The lamp still works."]},
 zara:{4:["Zara takes you up in a shuttle for a quick hop over the dome.","ZARA: Don't touch anything. ...Okay, push THAT one.","New Cydonia sparkles below like a jewel box."]
  ,7:["Zara shows you a star chart with a circle drawn around Earth.","ZARA: I used to want to go back. Lately... I want to stay.","She glances at you and quickly looks away."]},
 theo:{4:["Theo points the telescope at Phobos.","THEO: See the groove lines? It's slowly falling. In fifty million years it'll be a ring.","He sounds delighted about it."],7:["Theo shows you a comet he discovered.","THEO: I'm allowed to name it. How about... yours?","Comet Farm Mars now orbits the sun."]},
 vega:{4:["MAYOR VEGA: The council wants a colony anthem. I wrote one. It's terrible.","She sings it anyway. It is terrible. You both laugh."],7:["Mayor Vega unrolls the original colony blueprints.","MAYOR VEGA: We planned for three hundred people. We have twelve hundred now. Because of folks like you.","She gives you a commemorative founders' coin."]},
 pip:{4:["Pip shows you a drawing of you fighting a giant bug.","PIP: That's you! I made your muscles bigger."],7:["Pip builds a tiny robot that waters one plant.","PIP: It's R0-V3R junior! It's for your farm!","It immediately waters your boot."]}};
for(const n of NPCS)Object.assign(n.ev,EV2[n.id]||{});
// ---------- NPC-to-NPC chatter ----------
const PAIRS=[['ava','zara',["Did you recalibrate the strut sensors?","Twice. You still owe me a coffee."]],['kai','mo',["Your usual, Mo? Extra glowcap?","You know me too well, son."]],['ruiz','theo',["Any new signals from the obelisks?","Just static. Beautiful static."]],['vega','pip',["Pip, did you rewire the plaza lights again?","...They look better in purple!"]],['ava','kai',["Your oven tripped the breaker again.","It's called flavor, Ava."]],['zara','theo',["Flight window opens tonight.","I'll watch your engines from the roof."]],['mo','pip',["Back in my day the mine had no elevator.","Did you have dinosaurs?"]],['vega','ruiz',["Budget review for the lab is tomorrow.","Then today I'll pretend I didn't hear that."]]];
let NCHAT=null,NCT=0;
function npcChatter(){if(modal||menu)return;if(NCHAT){NCHAT.t++;if(NCHAT.t>130){NCHAT.i++;NCHAT.t=0;if(NCHAT.i>=2){const[a,b]=NCHAT.p;if(Math.hypot(npcRT[a].x-G.px,npcRT[a].y-G.py)<90){G.overheard=(G.overheard||0)+1}NCHAT=null;NCT=600}}return}
 if(NCT>0){NCT--;return}if(tick%60)return;
 for(const p of PAIRS){const A=npcRT[p[0]],B=npcRT[p[1]];if(!A||!B||A.zone!=G.zone||B.zone!=G.zone)continue;if(Math.hypot(A.x-B.x,A.y-B.y)<70&&Math.hypot(A.x-G.px,A.y-G.py)<200){NCHAT={p,i:0,t:0};A.dir=B.x>A.x?1:3;B.dir=A.x>B.x?1:3;A.path=null;B.path=null;return}}}
function drawBubbles(ox,oy){if(!NCHAT)return;const id=NCHAT.p[NCHAT.i],r=npcRT[id];if(!r||r.zone!=G.zone)return;const s=NCHAT.p[2][NCHAT.i].slice(0,Math.floor(NCHAT.t*1.2));cx.font='7px monospace';const w=Math.max(20,cx.measureText(NCHAT.p[2][NCHAT.i]).width+8),X=Math.round(r.x-ox-w/2),Y=Math.round(r.y-oy-44);
 R(X,Y,w,12,'#1a0f1a');R(X+1,Y+1,w-2,10,'#fff');R(X+w/2-1,Y+12,3,2,'#fff');R(X+w/2,Y+14,1,1,'#fff');txt(s,X+4,Y+9,'#223',7,'left',0)}
{const _up=update;update=function(){_up();if(!TITLE&&!CRED&&G)npcChatter();if(FISHING&&FISHING.ph=='reel')holdA=keys[' ']||keys.j||touchHold}}
// ---------- fishing minigame: keep the fish inside the catch bar ----------
let holdA=false,touchHold=false;
cv.addEventListener('touchstart',e=>{for(const t of e.changedTouches){const[x,y]=toGame(t);if(Math.hypot(x-BTN.A.x,y-BTN.A.y)<BTN.A.r+6){touchHold=t.identifier+1}}},{passive:true});
cv.addEventListener('touchend',e=>{for(const t of e.changedTouches)if(touchHold==t.identifier+1)touchHold=false},{passive:true});
fishAct=function(){const f=FISHING;if(f.ph=='wait'){FISHING=null;toast('Reeled in too early');return}
 if(f.ph=='bite'){const r=Math.random(),k=r<(perk('fish')>=2?.24:.12)?'koi':r<.4?'eel':'carp';Object.assign(f,{ph:'reel',k,bar:.3,bv:0,bw:Math.min(.5,FISH[k].zone*(perk('fish')?1.3:1)+.06),fp:.5,fv:0,prog:.3,pos:.5,zs:.35,zw:.3,t:0});sfx('menu');return}
 if(f.ph=='reel'){f.bv-=.012;if(f.prog>=.999||(f.fp>=f.bar&&f.fp<=f.bar+f.bw&&f.prog>.98))fishWin()}};
function fishWin(){const f=FISHING;FISHING=null;if(add(f.k)){sfx('harvest');G.stats.fish=(G.stats.fish||0)+1;addXP('fish',12);floatTxt(G.px,G.py-24,'Caught '+FISH[f.k].n+'!','#9ef')}}
updFish=function(){const f=FISHING;f.t++;if(f.ph=='wait'&&f.t>f.bite){f.ph='bite';f.t=0;sfx('clink')}if(f.ph=='bite'&&f.t>50){FISHING=null;toast('It got away!');sfx('bad');return}
 if(f.ph=='reel'){const sp=FISH[f.k].spd;if(Math.random()<.03*sp)f.fv=(Math.random()-.5)*.03*sp;f.fp=Math.max(0,Math.min(1,f.fp+f.fv));if(f.fp<=0||f.fp>=1)f.fv*=-1;
  f.bv+=holdA?-.0028:.0022;f.bv*=.92;f.bar=Math.max(0,Math.min(1-f.bw,f.bar+f.bv));if(f.bar<=0||f.bar>=1-f.bw)f.bv*=.3;
  const inz=f.fp>=f.bar&&f.fp<=f.bar+f.bw;f.prog=Math.max(0,Math.min(1,f.prog+(inz?.006:-.004)));f.pos=f.fp;f.zs=f.bar;f.zw=f.bw;
  if(f.prog>=1)fishWin();else if(f.prog<=0){FISHING=null;sfx('bad');toast('It got away!')}}};
drawFish=function(ox,oy){const f=FISHING,d=DIRV[G.dir],bx=G.px+d[0]*20-ox,by=G.py-4+d[1]*20-oy+(f.ph=='bite'?Math.sin(tick)*2:Math.sin(tick/10));
 cx.strokeStyle='#fff8';cx.beginPath();cx.moveTo(G.px-ox+d[0]*8,G.py-oy-14);cx.lineTo(bx,by);cx.stroke();R(bx-2,by-2,4,4,'#f44');R(bx-2,by-2,4,1,'#fff');
 if(f.ph=='bite')txt('!',G.px-ox,G.py-oy-30,'#ff0',14,'center');
 if(f.ph=='reel'){const X=W-120,Y=34,h=110;panel(X-8,Y-8,46,h+36,'#0a1420ee','#6cf');R(X,Y,14,h,'#0a2a4a');for(let i=0;i<h;i+=8)R(X,Y+i,14,1,'#0d3558');
  const b0=Y+h-(f.bar+f.bw)*h;R(X+1,b0,12,f.bw*h,'#3c6a');R(X+1,b0,12,1,'#9f9');R(X+1,b0+f.bw*h-1,12,1,'#9f9');
  const fy=Y+h-f.fp*h-4;R(X+3,fy,8,5,FISH[f.k].c);R(X+1,fy+1,2,3,FISH[f.k].c);R(X+8,fy+1,1,1,'#000');
  R(X+20,Y,6,h,'#300');R(X+20,Y+h-f.prog*h,6,f.prog*h,f.prog>.6?'#6f6':f.prog>.3?'#fd4':'#f64');
  txt('HOLD USE',X+15,Y+h+12,'#fff',7,'center');txt('to rise',X+15,Y+h+21,'#9cf',6,'center')}};
// ---------- sci-fi panel frame ----------
panel=function(x,y,w,h,c='#140a1ce8',b='#ff6aa8'){x=Math.round(x);y=Math.round(y);const hi=b.length==7?shade(b,.45):b,lo=b.length==7?shade(b,-.35):b;
 R(x+2,y,w-4,1,b);R(x+2,y+h-1,w-4,1,lo);R(x,y+2,1,h-4,b);R(x+w-1,y+2,1,h-4,lo);R(x+1,y+1,1,1,b);R(x+w-2,y+1,1,1,b);R(x+1,y+h-2,1,1,lo);R(x+w-2,y+h-2,1,1,lo);
 R(x+1,y+2,w-2,h-4,c);R(x+2,y+1,w-4,1,c);R(x+2,y+h-2,w-4,1,c);R(x+2,y+2,w-4,1,'#ffffff14');
 if(w>24&&h>13){R(x+2,y+2,4,1,hi);R(x+2,y+2,1,3,hi);R(x+w-6,y+2,4,1,hi);R(x+w-3,y+2,1,3,hi);R(x+2,y+h-3,4,1,hi);R(x+2,y+h-5,1,3,hi);R(x+w-6,y+h-3,4,1,hi);R(x+w-3,y+h-5,1,3,hi)}
 if(w>80&&h>28){R(x+w-22,y,14,2,hi);R(x+8,y+h-2,10,2,b);for(let i=0;i<3;i++)R(x+w-30-i*4,y+1,2,1,hi)}};
// ---------- character detail ----------
{const _dc=drawChar;drawChar=function(g,X,Y,look,dir,frame,o={}){_dc(g,X,Y,look,dir,frame,o);const bob=(frame&1)?-1:0,by=Y+10+bob,hy=Y+2+bob,top=look.top,pn=look.pants;
 px(g,X+4,by+6,8,1,shade(pn,-.25));if(dir==2){px(g,X+7,by+6,2,1,'#e8c060');px(g,X+6,by,4,1,shade(top,.45))}
 px(g,dir==3?X+4:X+11,by+1,1,5,shade(top,-.22));if(dir!=0&&look.style!='bald')px(g,X+5,hy-1,2,1,shade(look.hair,.55));
 if(dir==2){px(g,X+5,hy+4,1,1,'#fff');px(g,X+10,hy+4,1,1,'#fff')}
 if(o.suit){px(g,dir==1?X+2:dir==3?X+12:X+5,by+2,2,4,'#8a8aa0');px(g,dir==1?X+2:dir==3?X+12:X+5,by+2,2,1,'#c8c8e0');if(tick%40<20)px(g,dir==1?X+2:dir==3?X+13:X+6,by+5,1,1,'#3f8')}}}
// ---------- item icons ----------
{const _di=drawIcon;drawIcon=function(g,id,X,Y){const it=ITEMS[id];if(!it)return;if(it.base){_di(g,it.base,X,Y);const c=it.q==2?'#ffd23a':'#dfe8f0';px(g,X+10,Y+10,5,5,'#1a0f1a');px(g,X+11,Y+12,3,1,c);px(g,X+12,Y+11,1,3,c);return}
 if(it.fish){const c=it.c;px(g,X+2,Y+6,10,6,'#1a0f1a');px(g,X+3,Y+7,8,4,c);px(g,X+3,Y+7,8,1,shade(c,.4));px(g,X+11,Y+6,3,6,'#1a0f1a');px(g,X+12,Y+7,2,4,shade(c,-.2));px(g,X+5,Y+8,1,1,'#000');px(g,X+4,Y+10,6,1,shade(c,-.3));return}
 if(id=='jasp'||id=='opal'){const c=it.c;px(g,X+3,Y+4,10,9,'#1a0f1a');px(g,X+4,Y+5,8,7,c);px(g,X+4,Y+7,8,1,shade(c,-.3));px(g,X+4,Y+10,8,1,shade(c,.3));px(g,X+5,Y+5,2,1,'#fff9');if(id=='opal'&&tick%30<15)px(g,X+9,Y+8,1,1,'#fff');return}
 if(id=='saltb'){px(g,X+7,Y+8,2,6,'#7a9a8a');[[4,4],[9,3],[6,1],[10,7],[3,8]].forEach(([a,b])=>{px(g,X+a,Y+b,3,3,'#f0e8ff');px(g,X+a,Y+b,1,1,'#fff')});return}
 if(id=='scale'){px(g,X+3,Y+3,10,10,'#1a0f1a');px(g,X+4,Y+4,8,8,it.c);for(let i=5;i<12;i+=3)px(g,X+4,Y+i,8,1,shade(it.c,-.3));return}
 if(id=='wcore'){px(g,X+3,Y+3,10,10,'#1a0f1a');px(g,X+4,Y+4,8,8,'#ff7a2a');px(g,X+6,Y+6,4,4,'#ffd060');px(g,X+7,Y+7,2,2,'#fff');return}
 if(it.food&&!it.crop&&!it.fish&&['stew','salad','pie','grill','bun','coffee'].includes(id)){if(id=='coffee'){px(g,X+4,Y+5,8,9,'#1a0f1a');px(g,X+5,Y+6,6,7,'#f0e8e0');px(g,X+5,Y+6,6,2,it.c);px(g,X+11,Y+8,2,3,'#f0e8e0');px(g,X+6,Y+2+tick/20%2,1,2,'#fff6');return}
  px(g,X+1,Y+9,14,5,'#1a0f1a');px(g,X+2,Y+10,12,3,'#e8e0f0');px(g,X+2,Y+12,12,1,'#a8a0b8');px(g,X+4,Y+5,8,6,'#1a0f1a');px(g,X+5,Y+6,6,4,it.c);px(g,X+5,Y+6,3,1,shade(it.c,.5));return}
 _di(g,id,X,Y)}}
// ---------- bugs art ----------
{const _db=drawBug;drawBug=function(e,X,Y){const b=BUGS[e.t],f=Math.floor(tick/6)%2,c=e.hit?'#fff':b.c;
 if(e.t=='wyrm'){if(!e.awake||e.under){const r=e.awake?10:7;R(X-r,Y-2,r*2,5,'#8a4a26');R(X-r+2,Y-3,r*2-4,2,'#c8783a');if(tick%10<5)R(X-2+Math.sin(tick/5)*r*.6,Y-4,2,2,'#ffd0a0');return}
  R(X-20,Y+2,40,7,'#0006');for(let i=3;i>=0;i--){const sx=X+Math.sin(tick/12+i)*6-i*2,sy=Y-6-i*7;ob(cx,sx-10+i,sy-6,20-i*2,12,i%2?shade(c,-.15):c);R(sx-8+i,sy-6,16-i*2,2,b.c2)}
  const hx=X+Math.sin(tick/12+4)*6-8,hy=Y-38;ob(cx,hx-11,hy-8,22,14,c);R(hx-11,hy-8,22,3,b.c2);R(hx-7,hy-3,4,3,'#ff2');R(hx+3,hy-3,4,3,'#ff2');for(let i=-8;i<=6;i+=4)R(hx+i,hy+5,2,4,'#fff');light(hx,hy,40,'#fa4');return}
 if(e.t=='scorp'){R(X-7,Y+1,14,3,'#0005');for(let i=0;i<3;i++){R(X-9,Y-4+i*3+(f?1:0),3,1,b.c2);R(X+6,Y-4+i*3+(f?0:1),3,1,b.c2)}ob(cx,X-5,Y-6,10,7,c);R(X-5,Y-6,10,2,b.c2);
  ob(cx,X-9,Y-9,3,3,c);ob(cx,X+6,Y-9,3,3,c);for(let i=0;i<4;i++)R(X-1,Y-8-i*3,3,3,i==3?'#f42':c);R(X-3,Y-4,1,1,'#000');R(X+2,Y-4,1,1,'#000');}
 else if(e.t=='mantis'){const hop=e.tm%80>=55?-3:0;R(X-6,Y+1,12,3,'#0005');R(X-4,Y-2+hop,1,4,b.c2);R(X+3,Y-2+hop,1,4,b.c2);ob(cx,X-3,Y-8+hop,6,8,c);ob(cx,X-3,Y-13+hop,6,5,c);R(X-3,Y-12+hop,2,2,'#f22');R(X+1,Y-12+hop,2,2,'#f22');R(X-7,Y-10+hop+(f?1:0),4,1,b.c2);R(X+3,Y-10+hop+(f?0:1),4,1,b.c2);R(X-1,Y-16+hop,1,3,b.c2)}
 else return _db(e,X,Y);
 if(e.hp<e.max){R(X-6,Y-18,12,2,'#300');R(X-6,Y-18,12*e.hp/e.max,2,'#f44')}}}
{const _dp=drawPlant;drawPlant=function(e,X,Y){if(e.t!='saltb')return _dp(e,X,Y);R(X-5,Y+1,10,3,'#0004');R(X-1,Y-6,2,8,'#7a9a8a');[[-5,-9],[2,-10],[-2,-13],[3,-6],[-6,-5]].forEach(([a,b])=>{R(X+a,Y+b,3,3,'#e8e0ff');R(X+a,Y+b,1,1,'#fff')});if(tick%60<8)R(X+1,Y-14,1,1,'#fff')}}
// ---------- building & interior art ----------
{const _ds=drawStructures;drawStructures=function(ox,oy,D){_ds(ox,oy,D);const z=G.zone,night=G.time>=1140||G.time<390;
 if(z=='farm'){const X=2*T-ox,Y=2*T-oy;for(const wx of[X+10,X+66]){R(wx-2,Y+40,24,4,'#6a3a20');R(wx-2,Y+40,24,1,'#9a5a30');for(let i=0;i<5;i++)R(wx+i*5,Y+37,3,3,['#ff6a9a','#ffd23a','#9ae8ff'][i%3])}
  R(X+30,Y-14,6,8,'#6a6a7a');R(X+30,Y-14,6,1,'#9a9aaa');for(let i=0;i<3;i++){const t=(tick/2+i*30)%90;cx.globalAlpha=Math.max(0,.5-t/180);R(X+31+Math.sin(t/9)*3,Y-18-t/3,4,3,'#eee');cx.globalAlpha=1}
  R(X+20,Y-20,1,14,'#888');R(X+18,Y-21,5,1,'#888');if(tick%60<30){R(X+20,Y-22,1,1,'#f44');light(X+20,Y-22,6,'#f44')}
  if(tick%240<12)R(X+60+(tick%240)*2.4,Y-14,2,10,'#fff6');R(X+40,Y+12,1,52,'#9a8a74');R(X+56,Y+12,1,52,'#9a8a74');R(X+42,Y+30,12,6,'#5a5a6a');R(X+43,Y+31,10,1,'#8af');
  R(X+82,Y+56,6,8,'#3a5a3a');R(X+81,Y+52,8,5,'#5a9a3a');if(G.house>=1){R(X+96,Y+20,26,44,'#d8ccb8');R(X+94,Y+14,30,8,'#b84a32');R(X+94,Y+14,30,2,'#e07a50');R(X+102,Y+30,12,10,'#5a4a3a');R(X+103,Y+31,10,8,night?'#ffd06a':'#9ee0ff')}
  if(G.house>=2){R(X-14,Y+30,14,34,'#9ee0ff55');R(X-14,Y+30,14,1,'#fff8');for(let i=0;i<3;i++)R(X-12+i*4,Y+52,3,10,'#5a9a3a')}}
 if(z=='city'){for(const[a,b]of[[2,8],[11,18],[21,28]]){const X=a*T-ox,Y=T-oy-12,w=(b-a+1)*T;R(X+w-14,Y-12,1,12,'#99a');R(X+w-17,Y-6,7,1,'#99a');if((tick+a*20)%80<40){R(X+w-14,Y-13,1,1,'#f33');light(X+w-14,Y-13,8,'#f33')}R(X+8,Y-4,10,4,'#4a4a5a');R(X+9,Y-3,8,1,'#7af')}
  for(const[dx,c]of[[5,'#ff8a3a'],[14,'#2ff'],[24,'#f4f']]){const X=dx*T-ox-6,Y=5*T-oy-5;for(let i=0;i<7;i++)R(X+i*4,Y,4,4,i%2?c:'#f4f0e8');R(X,Y+4,28,1,'#0005')}}}}
{const _dI=drawInterior;drawInterior=function(ox,oy,D,night){_dI(ox,oy,D,night);const z=G.zone,O=(x,y)=>[x*T-ox,y*T-oy];
 if(z=='home'){const dc=G.decor||{};if(G.house>=1){for(let x=1;x<11;x++){const[X,Y]=O(x,0);R(X,Y+12,T,2,'#8a6a4a');if(x%2)R(X+6,Y+6,4,4,'#d8b888')}}
  {const[X,Y]=O(8,0);R(X+3,Y+2,10,10,'#3a2a1a');R(X+4,Y+3,8,8,'#f4f0e8');const a=G.time/60/12*6.283;R(X+8,Y+7,1,1,'#000');R(X+8+Math.round(Math.sin(a)*3),Y+7-Math.round(Math.cos(a)*3),1,1,'#c22')}
  if(dc.rug){const[X,Y]=O(2,6);R(X,Y+2,4*T,12,'#2a4a8a');R(X+2,Y+4,4*T-4,8,'#4a7ad0');for(let i=6;i<4*T-6;i+=8)R(X+i,Y+7,4,2,'#ffd27a')}
  if(dc.poster){const[X,Y]=O(6,0);R(X+2,Y+1,12,10,'#111');R(X+3,Y+2,10,8,'#0a0a2a');R(X+5,Y+6,6,4,'#3a8af0');R(X+5,Y+6,6,1,'#9cf');R(X+9,Y+3,1,1,'#fff')}
  if(dc.shelf){const[X,Y]=O(3,0);R(X,Y+1,T,14,'#5a3a2a');for(let i=0;i<3;i++){R(X+1,Y+4+i*4,T-2,1,'#3a2a1a');for(let j=0;j<4;j++)R(X+2+j*3,Y+1+i*4,2,3,['#c44','#4ac','#ec4','#8c4'][(i+j)%4])}}
  if(dc.lamp){const[X,Y]=O(1,2);D.push([Y+T,()=>{R(X+5,Y+6,6,9,'#333');R(X+6,Y-2,4,9,'#f4a');const b=(tick/8)%7;R(X+7,Y+4-b,2,2,'#ff8')}]);light(X+8,Y+2,26,'#f6c')}
  if(dc.lantern){const[X,Y]=O(5,2);const b=Math.sin(tick/20)*1.5;R(X+7,Y-14,1,8,'#aaa');R(X+4,Y-6+b,8,9,'#ffe8a0');R(X+4,Y-6+b,8,1,'#fff');light(X+8,Y-2,30,'#fd8')}
  if(dc.aqua){const[X,Y]=O(10,3);D.push([Y+T,()=>{R(X,Y-6,T,20,'#333');R(X+1,Y-5,14,13,'#2a7ad0');R(X+1,Y-5,14,2,'#8ef');const f=(tick/4)%12;R(X+2+f,Y,3,2,'#f84');R(X+12-(tick/6)%10,Y+4,2,1,'#ff4');R(X+3,Y+6,10,2,'#ca8')}]);light(X+8,Y,20,'#4cf')}
  if(dc.sofa){const[X,Y]=O(8,4);D.push([Y+T,()=>{R(X-4,Y-2,24,14,'#8a2a3a');R(X-4,Y-2,24,4,'#b04a5a');R(X-4,Y+4,24,1,'#6a1a2a');R(X-6,Y+2,3,10,'#8a2a3a');R(X+19,Y+2,3,10,'#8a2a3a')}])}
  if(dc.scope){const[X,Y]=O(10,6);D.push([Y+T,()=>{R(X+4,Y+4,1,10,'#555');R(X+11,Y+4,1,10,'#555');R(X+7,Y+2,1,12,'#555');cx.save();cx.translate(X+8,Y+2);cx.rotate(-.6);R(-2,-10,5,14,'#d8d8e8');R(-2,-10,5,2,'#7af');cx.restore()}])}}
 if(z=='cafe'){for(const x of[3,7,11]){const[X,Y]=O(x,1);R(X+7,Y-16,1,10,'#444');R(X+4,Y-6,8,3,'#c86a3a');R(X+5,Y-3,6,1,'#ffd890');light(X+8,Y,28,'#fc8')}const[X,Y]=O(1,0);R(X+4,Y+2,20,12,'#1a1a1a');txt('MENU',X+14,Y+8,'#ffd27a',6,'center',0);R(X+6,Y+10,16,1,'#888')}
 if(z=='shop'){const[X,Y]=O(8,3);D.push([Y+T,()=>{R(X+4,Y+6,8,8,'#2a3a4a');cx.globalAlpha=.6+Math.sin(tick/10)*.2;R(X+5,Y-8+Math.sin(tick/15)*2,6,10,'#0ff');cx.globalAlpha=1;R(X+3,Y+5,10,2,'#4af')}]);light(X+8,Y,24,'#0ff')}
 if(z=='cc'){const[X,Y]=O(6,0);R(X,Y+1,4*T,12,'#2a1a3a');R(X+2,Y+3,4*T-4,8,'#c8502e');R(X+20,Y+3,12,4,'#4a8ad0');for(let i=0;i<G.terra;i++)R(X+4+i*10,Y+8,6,2,'#6c6');txt('TERRAFORM',X+32,Y+12,'#fff',6,'center',0)}}}
// ---------- festival decorations by season ----------
{const _fe=festival;festival=function(ox,oy){_fe(ox,oy);const s=seasonIdx();if(s==2)for(let i=0;i<14;i++){const x=(hash(i,51)%28+2)*T-ox,y=(6+hash(51,i)%10)*T-oy-((tick*.3+i*40)%200);R(x,y,4,5,'#ffe8a0');light(x+2,y+2,12,'#fd8')}
 if(s==1)for(let i=0;i<20;i++){const x=(hash(i,61)%28+2)*T-ox,y=(hash(61,i)%12+6)*T-oy;R(x,y,2,2,['#ff6a9a','#ffd23a','#9ae8ff'][i%3])}
 if(s==3){const x=(tick*2)%(40*T)-4*T-ox;R(x,13*T-oy,18,9,'#e8e0d0');R(x+12,13*T-oy-4,6,5,'#7cf');R(x+2,13*T-oy+8,4,4,'#222');R(x+12,13*T-oy+8,4,4,'#222')}}}
// ---------- skills tab: show quality & habitat ----------
{const _sk=drawSkills;drawSkills=function(){_sk();txt('Habitat lv '+(G.house||0)+' · comfort '+comfort()+' · gold crops '+(G.stats.gold||0)+(G.wyrmDead?' · Wyrm slain':''),24,H-22,'#9ab',6)}}
window.FM5={isPool,genValles,festAct,habitatMenu,comfort,qualId,get NCHAT(){return NCHAT},npcChatter,fishWin};
