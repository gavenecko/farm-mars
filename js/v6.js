// Farm Mars v6 - game feel, onboarding, gamepad, customization, artisan machines, greenhouse, shipping log, merchant, relics, robo-pets, colony evaluation
// ---------- juice: screen shake, hit-stop, coin flyers ----------
let SHAKE=0,HITSTOP=0,COINS=[],PADC=null,PADPREV={};
function shake(n,h=0){SHAKE=Math.max(SHAKE,n);HITSTOP=Math.max(HITSTOP,h)}
{const _sf=sfx;sfx=function(n){_sf(n);if(TITLE||CRED)return;if(n=='hit')shake(2.5,3);else if(n=='break')shake(3,2);else if(n=='roar')shake(6);else if(n=='hurt')shake(4,4)}}
{const _kb=killBug;killBug=function(e){_kb(e);if(BUGS[e.t].boss)shake(12,10);else shake(3.5,4)}}
function coinBurst(v,sx,sy){const n=Math.min(14,3+Math.floor(Math.log2(1+v)));for(let i=0;i<n;i++)COINS.push({x:sx+(Math.random()-.5)*20,y:sy+(Math.random()-.5)*10,vx:(Math.random()-.5)*3,vy:-1-Math.random()*2,t:-i*2});COINS.gain=(COINS.gain||0)+v;COINS.gt=90}
function invCounts(){const c={};for(const s of G.inv)if(s){const b=ITEMS[s[0]].base||s[0];c[b]=(c[b]||0)+s[1]}return c}
function logShip(before){const a=invCounts();let any=0;for(const k in before){const d=before[k]-(a[k]||0);if(d>0&&ITEMS[k]&&ITEMS[k].v&&!ITEMS[k].tool){G.shipped=G.shipped||{};G.shipped[k]=(G.shipped[k]||0)+d;any=1}}return any}
for(const fn of['sellAll','sellHeld']){const _f=window[fn]||eval(fn);const w=function(){const m=G.money,b=invCounts();_f();logShip(b);const v=G.money-m;if(v>0){G.tutSold=1;coinBurst(v,G.px-camX(),G.py-20-camY());floatTxt(G.px,G.py-30,'+'+v+'cr','#7f7')}};if(fn=='sellAll')sellAll=w;else sellHeld=w}
{const _sl=sleep;sleep=function(p){for(const[i,q]of G.ship){const b=ITEMS[i].base||i;G.shipped=G.shipped||{};G.shipped[b]=(G.shipped[b]||0)+q;G.tutSold=1}
 const keep={};if(G.gh)for(const k in G.tiles)if(inGH(k)){const t=G.tiles[k];if(t.c)keep[k]={c:t.c,g:t.g+1}; t.w=1}
 _sl(p);for(const k in keep){const t=G.tiles[k];if(t&&!t.c){t.c=keep[k].c;t.g=keep[k].g;t.dry=0}}
 if(G.gh)for(const k in G.tiles)if(inGH(k)){G.tiles[k].w=1;G.tiles[k].dry=0}
 const extra=[];if(G.pet){const pt=G.pet;if(pt.pet!=G.day-1)pt.love=Math.max(0,pt.love-.3);if(pt.love>=4&&Math.random()<.35){const it=Math.random()<.15?pickRelic():['glowcap','iron','crys','lily'][Math.floor(Math.random()*4)];add(it);extra.push(pt.n+' the robo-'+pt.t+' dug up a '+ITEMS[it].n+' overnight!')}}
 if(merchDay())extra.push('A traveling merchant shuttle has landed in the New Cydonia plaza today (9:00-18:00)!');
 if(year()>=3&&!G.evalDone){G.evalDone=G.day;extra.push(...evalPages(true))}
 if(modal&&extra.length)modal.pages.push(...extra)}}
let _cam=[0,0];const camX=()=>_cam[0],camY=()=>_cam[1];
{const _ds=drawStructures;drawStructures=function(ox,oy,D){_cam=[ox,oy];_ds(ox,oy,D);v6world(ox,oy,D)}}
{const _u=update;update=function(){if(!TITLE&&!CRED&&HITSTOP>0){HITSTOP--;tick++;padPoll();return}_u();padPoll();if(!TITLE&&!CRED)v6tick()}}
{const _d=draw;draw=function(){if(SHAKE>.3&&!TITLE&&!CRED&&!modal&&!menu){cx.save();cx.translate(Math.round((Math.random()-.5)*SHAKE),Math.round((Math.random()-.5)*SHAKE));_d();cx.restore();SHAKE*=.85}else{SHAKE=0;_d()}}}
{const _hv=harvest;harvest=function(k){const r=_hv(k);if(r!==false){const[x,y]=k.split(',').map(Number);for(let i=0;i<8;i++)P.push({x:x*T+8,y:y*T+6,vx:Math.cos(i*.785)*1.6,vy:Math.sin(i*.785)*1.6-1,l:22,c:i%2?'#fff':'#ffd27a',gr:.05});shake(1.5)}return r}}
// ---------- gamepad ----------
const PADMAP={0:' ',1:'e',2:'e',3:'m',9:'m',4:'q',5:'tab',12:'arrowup',13:'arrowdown',14:'arrowleft',15:'arrowright'};
function padPoll(){if(G&&G.pad===0)return;const ps=navigator.getGamepads?navigator.getGamepads():[];let p=null;for(const q of ps||[])if(q&&q.connected!==false){p=q;break}
 if(!p){if(PADC){PADC=null;if(joy.id=='pad')joy={on:false,id:null,dx:0,dy:0}}return}if(!PADC){PADC=p.id||'pad';if(!TITLE)toast('Controller connected: A use, B talk, Y menu, LB/RB items')}
 for(const b in PADMAP){const on=!!(p.buttons[b]&&(p.buttons[b].pressed||p.buttons[b].value>.5));if(on&&!PADPREV[b])dispatchEvent(new KeyboardEvent('keydown',{key:PADMAP[b]}));if(!on&&PADPREV[b])dispatchEvent(new KeyboardEvent('keyup',{key:PADMAP[b]}));PADPREV[b]=on}
 const ax=p.axes[0]||0,ay=p.axes[1]||0;if(Math.hypot(ax,ay)>.25)joy={on:true,id:'pad',ox:-99,oy:-99,dx:ax,dy:ay};else if(joy.id=='pad')joy={on:false,id:null,dx:0,dy:0}}
addEventListener('gamepadconnected',()=>padPoll());cv.addEventListener('touchstart',phoneLayout,{passive:true});
// ---------- phone HUD: bigger thumbs, tutorial tracker ----------
function phoneLayout(){if(!touchUI)return;BTN.A.r=26;BTN.A.x=W-34;BTN.A.y=H-66;BTN.B.r=21;BTN.B.x=W-88;BTN.B.y=H-34}
const TUT=[['Till soil: Hoe + USE on grass',g=>Object.keys(g.tiles).length>0],['Plant seeds on tilled soil',g=>Object.values(g.tiles).some(t=>t.c)],['Water your crops with the Can',g=>Object.values(g.tiles).some(t=>t.w&&t.c)||g.day>1],
 ['Sleep in your bed to end the sol',g=>g.day>=2],['Harvest a grown crop',g=>g.stats.harvest>=1],['Sell a crop at Supply & Tech',g=>!!g.tutSold],['Visit New Cydonia (east gate)',g=>!!g.vcity],['Talk to a colonist',g=>!!g.tutTalk],['Visit the Martian surface (north)',g=>!!g.vsurf]];
function tutCheck(){if(G.tut==null||G.tut>=TUT.length)return;if(TUT[G.tut][1](G)){G.money+=50;sfx('craft');toast('Goal done: +50cr');coinBurst(50,40,40);G.tut++;if(G.tut>=TUT.length)tutDone()}}
function tutDone(){add('spr',2);G.money+=250;say('Colony Orientation complete',['MAYOR VEGA (radio): You\'ve got the hang of Martian life! Here are 2 sprinklers and 250cr.','One more thing - the colony robotics lab has a spare companion bot. Which one would you like?'],[{t:'Robo-Cat',f:()=>adoptPet('cat')},{t:'Robo-Dog',f:()=>adoptPet('dog')}])}
{const _h=hud;hud=function(){_h();if(G.tut!=null&&G.tut<TUT.length&&!modal){const s=(G.tut+1)+'/'+TUT.length+' ▶ '+TUT[G.tut][0];cx.font='7px monospace';const w=cx.measureText(s).width+10,y=OUTZ(G.zone)?52:43;panel(3,y,w,12,'#0a1420dd','#6cf');txt(s,7,y+9,'#cef',7)}
 for(const c of COINS){c.t++;if(c.t<0)continue;if(c.t<14){c.x+=c.vx;c.y+=c.vy;c.vy+=.15}else{c.x+=(108-c.x)*.18;c.y+=(30-c.y)*.18}R(c.x-2,c.y-2,4,4,'#a86a10');R(c.x-1,c.y-2,2,3,'#ffd23a')}COINS=COINS.filter(c=>c.t<40);
 if(COINS.gt>0){COINS.gt--;txt('+'+COINS.gain,123,41,'#bfb',7,'right');if(!COINS.gt)COINS.gain=0}if(PADC&&tick%600<120)txt('PAD',W-58,30,'#6cf',6,'center')}}
{const _tk=talk;talk=function(n){G.tutTalk=1;return _tk(n)}}
// ---------- character customization ----------
const PL0=Object.assign({},PLOOK),CUST={hair:['#8a3a1a','#2a1a10','#e8c060','#d04a2a','#6a4ad0','#f0f0f0','#2ac0a0','#ff4aa8'],style:['cap','spiky','bob','long','beard','bald'],top:['#2a8a6a','#d8502e','#3a6ad0','#e8b020','#8a3ad0','#e0e0e8','#1a1a2a'],skin:['#f0c090','#e8b48a','#c98a5e','#8a5a3a','#5a3a2a']};
function custMenu(after){const L=G.look,nm={hair:'Hair color',style:'Hair style',top:'Suit color',skin:'Skin tone'};Object.assign(PLOOK,L);
 say('Create your farmer',['Customize your colonist. Your look is saved with this farm.'],Object.keys(CUST).map(k=>({t:nm[k]+': '+(k=='style'?L[k]:'■ '+(CUST[k].indexOf(L[k])+1)+'/'+CUST[k].length),f:()=>{const a=CUST[k];L[k]=a[(a.indexOf(L[k])+1)%a.length];sfx('menu');custMenu(after)}})).concat([{t:'Done - start farming!',f:()=>{Object.assign(PLOOK,L);save(true);after&&after()}}]),PLOOK);modal.ch=999}
{const _ss=startSlot;startSlot=function(s){SLOT=s;const fresh=!load();_ss(s);if(fresh){G.tut=0;G.look=Object.assign({},PL0);const wm=modal;custMenu(()=>{modal=wm})}}}
{const _b=boot;boot=function(){_b();if(G.tut===undefined)G.tut=G.day>3?99:0;Object.assign(PLOOK,PL0,G.look||{});phoneLayout();PET=null}}
// ---------- artisan machines ----------
Object.assign(ITEMS,{ferm:{n:'Bio-Fermenter',v:120,c:'#6ac04a',place:1,d:'Turns any crop into a valuable Tonic in 3 sols.'},dehy:{n:'Dehydrator',v:90,c:'#e08a3a',place:1,d:'Turns any crop into Dried snacks overnight.'}});
RECIPES.push({id:'ferm',in:{iron:10,crys:2,chit:1}},{id:'dehy',in:{iron:8,cob:1}});
for(const k in CROPS){const b=ITEMS[k];ITEMS[k+'_t']={n:b.n+' Tonic',v:Math.round(b.v*2.4+30),c:b.c,food:20,art:'t',src:k,d:'Fermented in a Bio-Fermenter. Restores energy.'};ITEMS[k+'_d']={n:'Dried '+b.n,v:Math.round(b.v*1.7+15),c:b.c,food:Math.round(b.v/2)+10,art:'d',src:k,d:'Dehydrated snack. Light and filling.'}}
const MACH={ferm:{suf:'_t',days:3,verb:'Fermenting'},dehy:{suf:'_d',days:1,verb:'Drying'}};
function machAt(k){const o=G.objs[k];return MACH[o]?o:null}
function machUse(k){G.mach=G.mach||{};const o=machAt(k),M=MACH[o],m=G.mach[k],[x,y]=k.split(',').map(Number);
 if(m){if(G.day>=m.d){if(add(m.out)){delete G.mach[k];G.stats.artisan=(G.stats.artisan||0)+1;sfx('harvest');parts(x*T+8,y*T+4,'#ffd27a',12,1.5);floatTxt(x*T+8,y*T-4,'+'+ITEMS[m.out].n,'#ffd27a');shake(1.5)}}else toast(M.verb+'... '+(m.d-G.day)+' sol'+(m.d-G.day>1?'s':'')+' left');return true}
 const s=cur();if(!s)return false;const base=ITEMS[s[0]].base||s[0];if(!ITEMS[base].crop){if(s[0]=='hoe')return false;toast('Hold a crop to load the '+ITEMS[o].n);sfx('bad');return true}
 take(G.sel);G.mach[k]={in:base,out:base+M.suf,d:G.day+M.days};sfx('craft');parts(x*T+8,y*T+4,ITEMS[base].c,8);toast(M.verb+' '+ITEMS[base].n+' ('+M.days+' sol'+(M.days>1?'s':'')+')');return true}
// ---------- greenhouse ----------
const GHR=[22,6,28,10];const inGH=k=>{const[x,y]=k.split(',').map(Number);return x>=GHR[0]&&x<=GHR[2]&&y>=GHR[1]&&y<=GHR[3]};
{const _hm=habitatMenu;habitatMenu=function(){_hm();if(modal&&modal.opts)modal.opts.unshift({t:G.gh?'Greenhouse: built (crops ignore seasons)':'Build Greenhouse 8000cr+20 Iron+5 Crystal',f:()=>{if(G.gh){habitatMenu();return}if(G.money>=8000&&cnt('iron')>=20&&cnt('crys')>=5){G.money-=8000;rem('iron',20);rem('crys',5);G.gh=1;sfx('wed');checkAch();say('Greenhouse','A glass greenhouse rises in the east field. Anything grows inside, any season, and misters water it each morning.')}else{toast('Need 8000cr, 20 Iron, 5 Crystal');sfx('bad');habitatMenu()}}})}}
// ---------- relics ----------
const RELICS={rel1:['Sojourner Wheel','#b8b8c8',300],rel2:['Microfossil Slab','#c8a878',380],rel3:['Ares Flag Scrap','#d84a3a',220],rel4:['Iron Meteorite','#6a6a7a',260],rel5:['Obelisk Shard','#4a3aa8',600],rel6:['Viking Lander Bolt','#e0c060',340]};
for(const k in RELICS){const[n,c,v]=RELICS[k];ITEMS[k]={n,c,v,relic:1,d:'A rare Martian relic. Donate it to the Research Archive or sell it.'};RESEARCH.push(k)}
function pickRelic(){const ks=Object.keys(RELICS),un=ks.filter(k=>!(G.relics||{})[k]);const pool=un.length&&Math.random()<.7?un:ks;return pool[Math.floor(Math.random()*pool.length)]}
function gotRelic(id,x,y){G.relics=G.relics||{};const nw=!G.relics[id];G.relics[id]=1;add(id);sfx('wed');shake(3);parts(x,y,'#ffd27a',18,2);floatTxt(x,y-12,'RELIC! '+ITEMS[id].n,'#ffd27a');if(nw)toast('New relic found: '+ITEMS[id].n+' ('+Object.keys(G.relics).length+'/6)');checkAch()}
function digSpots(m,n,ok,occ=[]){const E=[];let g=0;while(E.length<n&&g++<800){const x=3+Math.floor(Math.random()*(m[0].length-6)),y=3+Math.floor(Math.random()*(m.length-6)),px_=x*T+8,py_=y*T+8;if(ok(m[y][x],x,y)&&!occ.concat(E).some(e=>Math.hypot(e.x-px_,e.y-py_)<T))E.push({k:'dig',x:px_,y:py_})}return E}
{const _gs=genSurface;genSurface=function(){const B=_gs();return B.concat(digSpots(MAPS.surf,5,(t,x,y)=>t=='r'&&!isPool(x,y),B))}}
{const _gv=genValles;genValles=function(){const B=_gv();return B.concat(digSpots(MAPS.valles,4,(t,x)=>(t=='r'||t=='y')&&x>5&&x<41,B))}}
function digAt(){const d=DIRV[G.dir],ax=G.px+d[0]*12,ay=G.py-4+d[1]*12;const e=ENTS.find(e=>e.k=='dig'&&Math.hypot(e.x-ax,e.y-ay)<16);if(!e)return false;if(!useEnergy(3))return true;swing('hoe');sfx('till');e.dead=1;ENTS=ENTS.filter(q=>!q.dead);storeE();
 parts(e.x,e.y,'#a86a3a',12,1.5);const r=Math.random();if(r<.45)gotRelic(pickRelic(),e.x,e.y);else{const it=r<.7?'iron':r<.85?'crys':G.zone=='valles'?'jasp':'cob';add(it,2);floatTxt(e.x,e.y-12,'+2 '+ITEMS[it].n,'#9ef')}G.stats.dug=(G.stats.dug||0)+1;return true}
// ---------- act / interact wrapper ----------
{const _a=act;act=function(){if(FISHING||swingT>4)return _a();const s=cur(),[fx,fy]=facingTile(),k=fx+','+fy;
 if(G.zone=='farm'&&machAt(k)){if(s&&s[0]=='hoe'&&G.mach&&G.mach[k]){toast('Empty the machine first');sfx('bad');return}if(machUse(k))return}
 if(G.zone=='farm'&&s&&ITEMS[s[0]].seed&&G.gh&&inGH(k)){const t=G.tiles[k];if(t&&!t.c){t.c=ITEMS[s[0]].seed;t.g=0;t.dry=0;take(G.sel);sfx('plant');parts(fx*T+8,fy*T+10,'#7a4a2a',4);return}}
 if(OUTZ(G.zone)&&G.zone!='mine'&&s&&s[0]=='hoe'&&digAt())return;
 const n0=Object.keys(G.tiles).length;_a();
 if(G.zone=='farm'&&s&&s[0]=='hoe'){const n1=Object.keys(G.tiles).length;for(let i=n0;i<n1;i++)if(Math.random()<.025){gotRelic(pickRelic(),G.px,G.py-10);break}}
 for(const kk in (G.mach||{}))if(!machAt(kk))delete G.mach[kk]}}
// ---------- robo-pets ----------
let PET=null;
function adoptPet(t){G.pet={t,n:t=='cat'?'Sprocket':'Bolt',love:2,pet:0};sfx('heart');say('New companion!',[(t=='cat'?'A sleek robo-cat':'A bouncy robo-dog')+' boots up and imprints on you. Name: '+G.pet.n+'.','Pet it every sol (face it and press TALK). Happy pets dig up gifts at night - sometimes even relics!'])}
function petRT(){if(!G.pet||!['farm','home','city'].includes(G.zone))return null;if(!PET||PET.z!=G.zone){PET={z:G.zone,x:G.px-14,y:G.py,f:1,mv:0};if(solidAt(PET.x,PET.y)){PET.x=G.px;PET.y=G.py}}return PET}
function updPet(){const p=petRT();if(!p)return;const dx=G.px-18*(G.dir==1?1:G.dir==3?-1:0)-p.x,dy=G.py+(G.dir==0?14:G.dir==2?-14:0)-p.y,d=Math.hypot(dx,dy);p.mv=0;if(d>200){p.x=G.px;p.y=G.py;return}
 if(d>16){const sp=Math.min(d>60?2.2:1.2,d/10),nx=p.x+dx/d*sp,ny=p.y+dy/d*sp;if(!solidAt(nx,ny)){p.x=nx;p.y=ny}else if(!solidAt(nx,p.y))p.x=nx;else if(!solidAt(p.x,ny))p.y=ny;p.mv=1;p.f=dx>0?1:0}}
function petPet(){const pt=G.pet,p=PET;if(pt.pet==G.day){floatTxt(p.x,p.y-16,pt.n+' purrs happily','#cff');return}pt.pet=G.day;pt.love=Math.min(10,pt.love+1);sfx('heart');parts(p.x,p.y-12,'#6ff',8,1);floatTxt(p.x,p.y-16,'♥ '+pt.n,'#8ff');checkAch()}
function drawPet(p,X,Y){const pt=G.pet,b=p.mv&&tick%12<6?1:0,fl=p.f?1:-1,c='#c8ccd8',d='#6a7088',e=tick%150<6?'#333':'#2ff';R(X-6,Y-1,12,3,'#0004');
 if(pt.t=='cat'){R(X-5,Y-7-b,10,6,c);R(X-5,Y-7-b,10,1,'#fff');R(X+fl*3-2,Y-12-b,6,5,c);R(X+fl*3-2,Y-14-b,1,2,c);R(X+fl*3+3,Y-14-b,1,2,c);R(X+fl*3-1,Y-10-b,1,1,e);R(X+fl*3+2,Y-10-b,1,1,e);R(X-fl*6-1,Y-10-b+Math.round(Math.sin(tick/8)),1,5,d);R(X-4,Y-1,2,1,d);R(X+2,Y-1,2,1,d)}
 else{R(X-6,Y-8-b,12,7,c);R(X-6,Y-8-b,12,1,'#fff');R(X+fl*5-3,Y-13-b,7,6,c);R(X+fl*5-3,Y-13-b,2,4,d);R(X+fl*5+2,Y-13-b,2,4,d);R(X+fl*5-1,Y-11-b,1,1,e);R(X+fl*5+1,Y-11-b,1,1,e);R(X+fl*8,Y-9-b,2,1,'#f6a');R(X-fl*7,Y-10-b-(tick%10<5?1:0),2,3,d);R(X-5,Y-1,2,2,d);R(X+3,Y-1,2,2,d)}
 light(X,Y-8,10,'#2ff')}
// ---------- traveling merchant ----------
const merchDay=()=>solOfSeason()==4,merchOpen=()=>merchDay()&&G.time>=540&&G.time<1080,MPOS=[26*T+8,14*T+8];
function merchStock(){const seeds=Object.keys(ITEMS).filter(k=>ITEMS[k].seed),r=i=>hash(G.day,i)%seeds.length;const st=[[seeds[r(1)],2],[seeds[r(2)],2],[seeds[r(3)],2]].map(([id,m])=>({id,p:ITEMS[id].p*m}));
 st.push({id:'qspr',p:900},{id:Object.keys(RELICS)[hash(G.day,9)%6],p:1800},{id:'opal',p:700});return st}
function merchMenu(){const o=merchStock().map(s=>({t:ITEMS[s.id].n+' '+s.p+'cr'+(ITEMS[s.id].seed?' (any season in a greenhouse)':''),f:()=>{if(G.money<s.p){toast('Not enough credits');sfx('bad')}else if(add(s.id)){G.money-=s.p;sfx('coin');toast('Bought '+ITEMS[s.id].n)}merchMenu()}}));
 if(!G.pet)o.push({t:'Robo-pet crate 1500cr',f:()=>{if(G.money>=1500){G.money-=1500;say('Merchant','Cat or dog model?',[{t:'Robo-Cat',f:()=>adoptPet('cat')},{t:'Robo-Dog',f:()=>adoptPet('dog')}])}else{toast('Not enough credits');sfx('bad');merchMenu()}}});
 o.push({t:'Leave'});say('Traveling Merchant','ZEPH: Rare goods from Phobos Station and beyond! Here one sol a week, then off to the next colony.',o,{skin:'#b0d8e8',hair:'#e0e0ff',style:'long',top:'#4a3aa8',pants:'#222',acc:'#ffd23a'})}
{const _in=interact;interact=function(){const p=PET;if(p&&G.pet&&p.z==G.zone&&Math.hypot(p.x-G.px,p.y-G.py)<22&&!nearNPC()){petPet();return}if(G.zone=='city'&&merchOpen()&&Math.hypot(MPOS[0]-G.px,MPOS[1]-G.py)<34){merchMenu();return}return _in()}}
// ---------- shipping log & colony evaluation ----------
const SHIPLIST=()=>Object.keys(ITEMS).filter(k=>ITEMS[k].v&&!ITEMS[k].tool&&!ITEMS[k].base&&!ITEMS[k].place&&!ITEMS[k].seed&&!ITEMS[k].wpn);
function shipLog(){const L=SHIPLIST(),got=L.filter(k=>(G.shipped||{})[k]);const grp={Crops:k=>ITEMS[k].crop,Artisan:k=>ITEMS[k].art,Relics:k=>ITEMS[k].relic,Other:k=>!ITEMS[k].crop&&!ITEMS[k].art&&!ITEMS[k].relic};
 const pg=['Shipping log: '+got.length+'/'+L.length+' different items shipped.'];for(const g in grp){const all=L.filter(grp[g]),h=all.filter(k=>(G.shipped||{})[k]);pg.push(g+' ('+h.length+'/'+all.length+'): '+(h.length?h.map(k=>ITEMS[k].n+' x'+G.shipped[k]).slice(0,8).join(', ')+(h.length>8?' ...':''):'nothing yet'))}say('Shipping Log',pg)}
function evalScore(){const S=[],a=(n,v,m)=>S.push([n,Math.round(Math.min(m,v)),m]);const NH=NPCS.reduce((s,n)=>s+(G.hearts[n.id]||0),0);
 a('Terraforming',G.terra*7,21);a('Community bundles',Object.keys(G.bundles).length/BUNDLES.length*14,14);a('Friendship',NH/(NPCS.length*10)*15,15);a('Research archive',Object.keys(G.research).length/RESEARCH.length*10,10);
 a('Shipping log',Object.keys(G.shipped||{}).length/30*10,10);a('Wealth',G.money/3000,10);a('Heroics',(G.bossDead?5:0)+(G.wyrmDead?5:0),10);a('Home & family',(G.spouse?4:0)+(G.kids?2:0)+(G.house||0)*1.5+(G.pet?1:0)+(G.gh?2:0),10);
 const tot=S.reduce((s,q)=>s+q[1],0);return{S,tot,domes:tot>=85?5:tot>=65?4:tot>=45?3:tot>=25?2:1}}
function evalPages(first){const e=evalScore(),best=G.evalBest||0;const pg=[(first?'Two Martian years have passed. ':'')+'MAYOR VEGA arrives with the Colony Board for your official Colony Evaluation...',e.S.map(q=>q[0]+' '+q[1]+'/'+q[2]).join(' · '),'Total '+e.tot+'/100 - Colony rating: '+'★'.repeat(e.domes)+'☆'.repeat(5-e.domes)+' ('+['Struggling outpost','Growing settlement','Thriving colony','Model colony','Jewel of Mars'][e.domes-1]+')'];
 if(e.domes>best){const rw=(e.domes-best)*1000;G.money+=rw;G.evalBest=e.domes;pg.push('New best rating! The Board awards you '+rw+'cr.'+(e.domes>=4?' A golden dome statue is installed on your farm.':''));if(e.domes>=4)G.statue=1}else pg.push('Improve your colony and ask for a re-evaluation at the Community Center.');checkAch();return pg}
{const _bm=bundleMenu;bundleMenu=function(){_bm();if(modal&&modal.opts){modal.opts.push({t:'Shipping Log ('+Object.keys(G.shipped||{}).length+'/'+SHIPLIST().length+')',f:shipLog},{t:year()>=3?'Colony Evaluation (best '+(G.evalBest||0)+'★)':'Colony Evaluation: Year 3 (now '+evalScore().tot+'/100)',f:()=>{if(year()<3){const e=evalScore();say('Colony Evaluation','The Board will evaluate your colony at the start of Year 3. Current projection: '+e.tot+'/100 ('+e.domes+'★). '+e.S.map(q=>q[0]+' '+q[1]+'/'+q[2]).join(' · '))}else say('Colony Evaluation',evalPages(false))}})}}}
ACH.push(['relic','Archaeologist','Find all 6 Martian relics',g=>Object.keys(g.relics||{}).length>=6],['artisan','Artisan','Make 10 artisan goods',g=>(g.stats.artisan||0)>=10],['ship30','Exporter','Ship 30 different items',g=>Object.keys(g.shipped||{}).length>=30],['pet','Best Friend','Max out your robo-pet\'s love',g=>!!(g.pet&&g.pet.love>=10)],['eval5','Jewel of Mars','Earn a 5-star colony rating',g=>(g.evalBest||0)>=5],['green','Green Thumb','Build the greenhouse',g=>!!g.gh]);
// ---------- per-tick ----------
function v6tick(){if(G.zone=='city')G.vcity=1;if(G.zone=='surf')G.vsurf=1;if(tick%30==0)tutCheck();if(!modal&&!menu)updPet()}
// ---------- world drawing: seasonal tiles, greenhouse, machines, dig spots, merchant, pet, statue, glow ----------
const SEASTINT=['','#ff6a9a','#dff0ff','#c8903a'];
function v6world(ox,oy,D){const z=G.zone,m=curMap(),si=seasonIdx(),night=G.time>=1140||G.time<390;
 if(z=='farm'||z=='city'||z=='surf'){const x0=Math.max(0,Math.floor(ox/T)),y0=Math.max(0,Math.floor(oy/T)),x1=Math.min(m[0].length-1,x0+W/T+1),y1=Math.min(m.length-1,y0+H/T+1);
  for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){const t=m[y][x];if(t!='g'&&!(z=='surf'&&t=='r'))continue;const k=x+','+y;if(z=='farm'&&(G.tiles[k]||G.objs[k]))continue;const h=hash(x*3+si,y*5),X=x*T-ox,Y=y*T-oy;
   if(si==1&&t=='g'&&h%5==0){R(X+h%12+1,Y+(h>>4)%12+1,2,2,['#ff6a9a','#ffd23a','#fff','#c89aff'][h%4]);R(X+h%12+1,Y+(h>>4)%12+3,1,2,'#3a7a3a')}
   else if(si==2){R(X,Y,T,T,t=='g'?'#e8f4ff26':'#e8f4ff1a');if(h%4==0)R(X+h%13,Y+(h>>3)%13,2,1,'#fff9')}
   else if(si==3&&h%3==0){R(X+h%10,Y+(h>>4)%12,5,1,'#c8903a55');R(X+(h>>2)%12,Y+(h>>6)%12,2,1,'#e8b06a66')}
   else if(si==0&&t=='g'&&h%9==0)R(X+h%13,Y+(h>>4)%13,3,2,'#b8703a44')}}
 if(z=='farm'){
  if(G.gh){const X=GHR[0]*T-ox,Y=GHR[1]*T-oy,w=(GHR[2]-GHR[0]+1)*T,h=(GHR[3]-GHR[1]+1)*T;R(X,Y,w,h,'#9ee0ff18');for(let i=0;i<=w;i+=T)R(X+i,Y,1,h,'#cfefff55');R(X,Y,w,2,'#cfefffaa');R(X,Y+h-2,w,2,'#7a9aaa');R(X-1,Y,1,h,'#cfefffaa');R(X+w,Y,1,h,'#cfefffaa');if(tick%200<100)R(X+((tick*2)%w),Y+2,1,h-4,'#ffffff22');txt('GREENHOUSE',X+w/2,Y-2,'#cfefff',6,'center')}
  for(const k in (G.mach||{})){const mm=G.mach[k],[x,y]=k.split(',').map(Number),X=x*T-ox,Y=y*T-oy;D.push([Y+13,()=>{if(G.day>=mm.d){const b=Math.sin(tick/8)*2;R(X+3,Y-13+b,10,10,'#fff');R(X+6,Y-3+b,4,2,'#fff');drawIcon(cx,mm.out,X,Y-16+b);}else if(tick%40<20)R(X+7,Y+2,2,2,'#6f6')}]);if(G.objs[k]=='ferm')light(X+8,Y+6,12,'#6c4')}
  if(G.statue){const X=16*T-ox,Y=6*T-oy;D.push([Y+T,()=>{R(X+2,Y+8,12,6,'#7a6a5a');R(X+3,Y+8,10,1,'#aa9a8a');ob(cx,X+3,Y-4,10,12,'#ffd23a');R(X+5,Y-2,3,3,'#fff8');light(X+8,Y,24,'#fd6')}])}
  for(const k in G.tiles){const t=G.tiles[k];if(!mature(t))continue;const[x,y]=k.split(',').map(Number),X=x*T-ox,Y=y*T-oy;if(X<-16||X>W||Y<-16||Y>H)continue;if(night&&t.c!='glo'&&t.c!='frb')light(X+8,Y+6,10,CROPS[t.c].c);else if(tick%120<4&&hash(x,y)%5==0)R(X+4+hash(y,x)%8,Y+2,2,2,'#fff')}
  for(const k in G.objs){if(G.objs[k]!='qspr'&&G.objs[k]!='spr')continue;if(night){const[x,y]=k.split(',').map(Number);light(x*T-ox+8,y*T-oy+8,8,'#9cf')}}}
 if(z=='city'&&merchOpen()){const X=MPOS[0]-ox,Y=MPOS[1]-oy;D.push([Y+6,()=>{R(X-22,Y+4,44,5,'#0005');R(X-20,Y-22,40,24,'#d8dce8');R(X-20,Y-22,40,3,'#fff');R(X-24,Y-6,48,6,'#9aa0b8');R(X-14,Y-16,10,7,'#4a8ad0');R(X-13,Y-15,8,2,'#9cf');R(X+2,Y-12,14,14,'#3a3a5a');R(X+4,Y-10,10,10,'#ffd27a');R(X-26,Y-4,6,10,'#6a6a7a');R(X+20,Y-4,6,10,'#6a6a7a');txt('SHOP',X+9,Y-14,'#ffd27a',6,'center',0);if(tick%40<20){R(X-21,Y-24,2,2,'#f44');R(X+19,Y-24,2,2,'#4f4')}
   if(Math.hypot(MPOS[0]-G.px,MPOS[1]-G.py)<50)txt('Traveling Merchant',X,Y-28,'#ffd27a',7,'center')}]);light(X,Y-8,30,'#fd8')}
 if(OUTZ(z))for(const e of ENTS)if(e.k=='dig'){const X=e.x-ox,Y=e.y-oy;if(X<-20||X>W+20||Y<-20||Y>H+20)continue;D.push([Y,()=>{const w=Math.round(Math.sin(tick/6+e.x)*1.5);R(X-4,Y,8,2,'#5a2a1a');R(X-1+w,Y-5,1,5,'#3a1a10');R(X+2-w,Y-4,1,4,'#3a1a10');if(tick%90<10)R(X-3,Y-7,1,1,'#fff')}])}
 const p=petRT();if(p)D.push([p.y-oy,()=>{drawPet(p,p.x-ox,p.y-oy);if(Math.hypot(p.x-G.px,p.y-G.py)<36)txt(G.pet.n+(G.pet.pet==G.day?' ♥':''),p.x-ox,p.y-oy-16,'#8ff',7,'center')}])}
// ---------- icons for machines, artisan goods, relics ----------
{const _di=drawIcon;drawIcon=function(g,id,X,Y){const it=ITEMS[id];if(!it)return;
 if(id=='ferm'){px(g,X+3,Y+2,10,13,'#1a0f1a');px(g,X+4,Y+3,8,11,'#5a6a5a');px(g,X+5,Y+5,6,6,'#6ac04a');px(g,X+5,Y+5,6,1,'#bfa');px(g,X+5,Y+12,6,1,'#9a9');px(g,X+7,Y,2,3,'#8a8a9a');return}
 if(id=='dehy'){px(g,X+2,Y+4,12,10,'#1a0f1a');px(g,X+3,Y+5,10,8,'#c8ccd8');for(let i=0;i<3;i++)px(g,X+4,Y+6+i*2,8,1,'#e08a3a');px(g,X+3,Y+5,10,1,'#fff');return}
 if(it.art=='t'){px(g,X+5,Y+1,6,14,'#1a0f1a');px(g,X+6,Y+5,4,9,it.c);px(g,X+6,Y+5,1,8,'#fff6');px(g,X+7,Y+2,2,3,'#8a6a4a');return}
 if(it.art=='d'){for(let i=0;i<3;i++){px(g,X+2+i*4,Y+5+(i%2)*3,5,6,'#1a0f1a');px(g,X+3+i*4,Y+6+(i%2)*3,3,4,shade(it.c,-.25))}return}
 if(it.relic){px(g,X+2,Y+3,12,11,'#1a0f1a');ob(g,X+3,Y+4,10,9,it.c);px(g,X+4,Y+5,3,2,'#fff8');px(g,X+11,Y+2,2,2,'#ffd23a');return}
 _di(g,id,X,Y)}}
// ---------- cached-sprite lighting (same look, far fewer gradient allocations) ----------
const LSPR={};function lspr(c){if(LSPR[c])return LSPR[c];const k=document.createElement('canvas');k.width=k.height=64;const q=k.getContext('2d'),g=q.createRadialGradient(32,32,0,32,32,32);
 if(c=='cut'){g.addColorStop(0,'rgba(0,0,0,1)');g.addColorStop(1,'rgba(0,0,0,0)')}else{g.addColorStop(0,hexA(c,1));g.addColorStop(.7,hexA(c,0));g.addColorStop(1,hexA(c,0))}q.fillStyle=g;q.fillRect(0,0,64,64);return LSPR[c]=k}
function fastLight(ox,oy){const z=G.zone,hr=G.time/60;let dark=hr<19?0:Math.min(.5,(hr-19)/5*.5);if(hr<6.5)dark=.38;
 if(EXITS[z])dark*=.35;if(z=='mine')dark=.62;if(z=='surf'||z=='valles')dark=Math.min(.6,dark+.06);if(z=='city')dark*=.85;
 if(dark>.02){if(z=='mine'||(z=='surf'&&dark>.3))light(G.px-ox,G.py-10-oy,z=='mine'?110:80,'#ffe0a0');
  lx.globalCompositeOperation='source-over';lx.clearRect(0,0,W,H);lx.fillStyle=`rgba(8,2,24,${dark})`;lx.fillRect(0,0,W,H);lx.globalCompositeOperation='destination-out';const cut=lspr('cut');
  for(const l of LIGHTS)lx.drawImage(cut,l.x-l.r,l.y-l.r,l.r*2,l.r*2);lx.globalCompositeOperation='source-over';cx.drawImage(lc,0,0)}
 cx.globalCompositeOperation='lighter';cx.globalAlpha=Math.min(1,.18+dark*.25);for(const l of LIGHTS){if(!l.c)continue;cx.drawImage(lspr(l.c),l.x-l.r,l.y-l.r,l.r*2,l.r*2)}cx.globalAlpha=1;cx.globalCompositeOperation='source-over'}
// ---------- per-zone day/night palette ----------
const ZPAL={farm:['#ffb08a','#ff7a3a','#1a6a7a'],city:['#ff9ad8','#ff5aa0','#5a1a8a'],surf:['#ffc8a0','#ff6a2a','#1a2a7a'],valles:['#ffa070','#e04a1a','#4a1a5a'],mine:[null,null,'#1a3a5a']};
{const _lt=lighting;lighting=function(ox,oy){if(LIGHTS.length>36){const B={};for(const l of LIGHTS){if(l.x<-l.r||l.y<-l.r||l.x>W+l.r||l.y>H+l.r)continue;const k=Math.floor(l.x/48)+','+Math.floor(l.y/48),o=B[k];if(!o)B[k]=Object.assign({n:1},l);else{o.n++;if(l.r>o.r){o.r=l.r;o.c=l.c}}}LIGHTS=Object.values(B).map(l=>(l.n>1&&(l.r=Math.min(l.r*1.25,l.r+8)),l))}fastLight(ox,oy);const z=G.zone,pal=ZPAL[z];if(!pal)return;const hr=G.time/60;let c=null,a=0;
 if(z=='mine'){c=pal[2];a=.1}else if(hr<8){c=pal[0];a=.12*(1-Math.max(0,hr-6.5)/1.5)}else if(hr>=17&&hr<19.5){c=pal[1];a=.13*Math.min(1,(hr-17)/1.2)}else if(hr>=19.5||hr<6.5){c=pal[2];a=.14}
 if(c&&a>.01){cx.fillStyle=hexA(c,a);cx.fillRect(0,0,W,H)}}}
// ---------- system menu: controller option ----------
{const _mt=menuTap;menuTap=function(x,y){if(menu&&menu.tab=='system'&&y>=36+8*18&&y<36+9*18&&x>60&&x<W-60){G.pad=G.pad===0?1:0;if(!G.pad)PADC=null;sfx('menu');toast('Controller '+(G.pad?'enabled':'disabled'));return}_mt(x,y)}}
{const _dm=drawMenu;drawMenu=function(){_dm();if(menu&&menu.tab=='system'){panel(60,36+8*18,W-120,15,'#1a0e24','#6cf');txt('Controller (gamepad): '+(G.pad===0?'OFF':PADC?'ON - connected':'ON - plug in to play'),W/2,47+8*18,'#cef',8,'center')}}}
{const _sk=drawSkills;drawSkills=function(){_sk();txt('Relics '+Object.keys(G.relics||{}).length+'/6 · shipped '+Object.keys(G.shipped||{}).length+' kinds · rating '+(G.evalBest||0)+'★'+(G.pet?' · pet '+G.pet.n+' ♥'+Math.floor(G.pet.love):''),24,H-14,'#9ab',6)}}
window.FM6={TUT,tutCheck,machUse,MACH,inGH,digAt,pickRelic,gotRelic,merchStock,merchMenu,merchOpen,MPOS,evalScore,evalPages,shipLog,adoptPet,petRT,updPet,custMenu,padPoll,get SHAKE(){return SHAKE},get HITSTOP(){return HITSTOP},get COINS(){return COINS},get PET(){return PET},CUST};
