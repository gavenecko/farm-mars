// Farm Mars v8 - Hellas Rift challenge dungeon, south city district (Clinic, The Airlock bar+arcade, Shuttle Port -> Phobos Station), talking portraits, door animations, camera smoothing, 10-heart events, spouse rooms, seasonal fish
const rnd=a=>a[Math.floor(Math.random()*a.length)];
// ---------- items ----------
Object.assign(ITEMS,{riftkey:{n:'Rift Key',v:0,c:'#ff4a8a',d:'Opens the Hellas Rift gate on the Martian Surface.'},rshard:{n:'Rift Shard',v:450,c:'#ff3a9a',d:'Humming crystal from the Hellas Rift.'},
 hgem:{n:'Hellas Gem',v:1500,c:'#ff2a5a',d:'A flawless red gem from deep in the Rift.'},rcache:{n:'Rift Cache',v:0,c:'#ffd23a'},fizz:{n:'Red Fizz',p:40,v:20,c:'#ff5a7a',food:35,d:'The Airlock\'s signature drink.'},
 pice:{n:'Phobos Ice',p:90,v:45,c:'#cfefff',food:70,d:'Ancient ice from Phobos, flavored.'}});
ITEMS.medkit.p=120;RESEARCH.push('rshard','hgem');
RECIPES.push({id:'riftkey',in:{metor:3,cob:5,crys:5}});
CROPS.stf={n:'Starfruit',p:200,days:8,v:420,s:[0,1,2,3],c:'#ffe24a',c2:'#b08a1a',shape:'flower'};
{const k='stf',c=CROPS[k],b=ITEMS[k]={n:c.n,v:c.v,c:c.c,food:120,crop:1,d:'Grows in any season. Imported from Phobos.'};ITEMS.s_stf={n:'Starfruit Seeds',seed:k,p:c.p,c:c.c,d:'Grows in 8 sols, any season.'};
 ITEMS.stf_s=Object.assign({},b,{n:'Silver Starfruit',v:525,q:1,base:k});ITEMS.stf_g=Object.assign({},b,{n:'Gold Starfruit',v:672,q:2,base:k,food:180});ITEMS.stf_t={n:'Starfruit Tonic',v:1038,c:c.c,food:20,art:'t',src:k};ITEMS.stf_d={n:'Dried Starfruit',v:729,c:c.c,food:220,art:'d',src:k}}
// ---------- fish variety ----------
Object.assign(FISH,{dgud:{n:'Dust Gudgeon',v:90,c:'#c8a060',zone:.3,spd:1.9},bfin:{n:'Bloomfin',v:110,c:'#ff8ad8',zone:.26,spd:2.1},ipik:{n:'Ice Pike',v:170,c:'#bfeaff',zone:.2,spd:2.7},sray:{n:'Storm Ray',v:200,c:'#9a6aff',zone:.18,spd:2.9},
 brine:{n:'Brine Tetra',v:120,c:'#7ad0c0',zone:.24,spd:2.2},cryp:{n:'Crypto-Coelacanth',v:600,c:'#4a6aaa',zone:.12,spd:3.4}});
for(const k of['dgud','bfin','ipik','sray','brine','cryp'])ITEMS[k]={n:FISH[k].n,v:FISH[k].v,c:FISH[k].c,food:Math.round(FISH[k].v/4),fish:1,d:k=='brine'||k=='cryp'?'Lives in the briny crater pools of the surface.':'Only bites in '+SEASONS[['dgud','bfin','ipik','sray'].indexOf(k)]+'.'};
const SFISH=['dgud','bfin','ipik','sray'];
function pickFish(){const r=Math.random(),pf=perk('fish')>=2?2:1;if(G.zone=='surf')return r<.08*pf?'cryp':'brine';if(r<.12*pf)return 'koi';if(r<.37)return SFISH[seasonIdx()];return r<.6?'eel':'carp'}
{const _fa=fishAct;fishAct=function(){const f=FISHING;if(f&&f.ph=='bite'){const k=pickFish();Object.assign(f,{ph:'reel',k,bar:.3,bv:0,bw:Math.min(.5,FISH[k].zone*(perk('fish')?1.3:1)+.06),fp:.5,fv:0,prog:.3,pos:.5,zs:.35,zw:.3,t:0});sfx('menu');return}return _fa()}}
{const _fw=fishWin;fishWin=function(){const k=FISHING&&FISHING.k;_fw();if(k&&G.inv.some(s=>s&&s[0]==k)){G.fishSeen=G.fishSeen||{};G.fishSeen[k]=1;checkAch()}}}
{const _a=act;act=function(){const s=cur();if(s&&s[0]=='rod'&&G.zone=='surf'&&!FISHING&&swingT<=4){const[fx,fy]=facingTile();if(tileAt(fx,fy)=='c'&&isPool(fx,fy)){if(useEnergy(2)){swing('rod');startFish()}return}}return _a()}}
// ---------- city south district ----------
{const m=MAPS.city;for(let x=14;x<=17;x++)m[21][x]='p';for(let y=22;y<=32;y++){m[y]=[];for(let x=0;x<32;x++){let t='p';if(x==0||x==31||y==32)t='W';
 for(const[a,b,d]of[[3,9,6],[12,19,15],[22,29,25]])if(x>=a&&x<=b&&y>=24&&y<=28)t=x==d&&y==28?'D':'H';if((x==11||x==20)&&y==30)t='L';m[y].push(t)}}}
Object.assign(MAPS,{clinic:fromStr(["wwwwwwwwwwwwww","wsssswobbobbow","woooooooooooow","wccccoooooooow","wooooooooooehw","woooorrrroooow","woooooooooooow","wwwwwwDwwwwwww"]),
 bar:fromStr(["wwwwwwwwwwwwwwww","wsssssseowhhhhow","woooooooooooooow","wccccccoooooooow","woooooooototooow","wotootooooooooow","woooooooooooooow","wwwwwwwDwwwwwwww"]),
 port:fromStr(["wwwwwwwwwwwwww","wheeoooooosssw","woooooooooooow","wooccccoooooow","woooooooooooow","wtotooooootoow","woooooooooooow","wwwwwwDwwwwwww"]),
 phobos:fromStr(["wwwwwwwwwwwwwwwwwwwwww","wsssswwwwwwwwwwwwkkkkw","woooooooooooooooooooow","wooccccooooooootototow","woooooooooooooooooooow","wooooorrrrrrrrrrooooow","wooeoooooooooooooohoow","woooooooooooooooooooow","wwwwwwwwwwDwwwwwwwwwww"])});
Object.assign(DOORS,{'city:6,28':['clinic',6,6],'city:15,28':['bar',7,6],'city:25,28':['port',6,6]});Object.assign(EXITS,{clinic:['city',6,29],bar:['city',15,29],port:['city',25,29],phobos:['port',6,6]});
const barOpen=()=>G.time>=1020||G.time<120;
{const _sf=schedFor;schedFor=function(n,h){const r=_sf(n,h);if(G.spouse==n.id||isFestival()&&h>=9&&h<16)return r;
 if(n.id=='ruiz'&&h>=9&&h<13)return['clinic',6,4];if(n.id=='kai'&&h>=20&&h<22)return['bar',4,2];if(n.id=='zara'&&h>=19&&h<22)return['bar',8,5];if(n.id=='theo'&&h>=18&&h<22)return['bar',13,5];return r}}
const ruizIn=()=>npcRT.ruiz&&npcRT.ruiz.zone=='clinic';
function clinicMenu(){say('Cydonia Clinic',[ruizIn()?'DR. RUIZ: "Sit down, let\'s have a look at you. Mining again?"':'A nurse droid beeps: "Dr. Ruiz is out. Automated care available."'],[
 {t:'Full treatment (HP to 100) - 80cr',f:()=>{if(G.hp>=100){toast('You are perfectly healthy');return clinicMenu()}if(G.money<80){toast('Not enough credits');sfx('bad');return}G.money-=80;G.hp=100;sfx('heart');parts(G.px,G.py-10,'#f88',14);toast('HP fully restored');clinicMenu()}},
 {t:'Buy Medkit (heals 60) - 120cr',f:()=>{buy('medkit');clinicMenu()}},{t:'Buy O2 Canister - 60cr',f:()=>{ITEMS.o2can.p=ITEMS.o2can.p||60;buy('o2can');clinicMenu()}},{t:'Leave'}]);modal.ch=999}
function barMenu(){const kai=npcRT.kai&&npcRT.kai.zone=='bar';say('The Airlock',[kai?'KAI: "Night shift at the Airlock. What\'ll it be?"':'The bar-bot polishes a glass. "Welcome to the Airlock."'],[{t:'Red Fizz (+35 energy) - 40cr',f:()=>{buy('fizz');barMenu()}},
 {t:'Rumors - free',f:()=>{say('The Airlock',[rnd(['They say the Hellas Rift changes every sol. Something down there rearranges the rock overnight.','Old Mo swears he saw a gate of black glass south of the mine entrance.','Zara says Phobos Station has the best view in the solar system. And Starfruit seeds.','Rift Keys? Forge one from meteorite ore, cobalt and crystals. Or pay the Phobos traders a fortune.','Dr. Ruiz patched me up after the Rift. Never go down there without medkits.'])],[{t:'Ha.',f:barMenu}])}},{t:'Leave'}]);modal.ch=999}
function portMenu(){const o=[];if(!G.port)o.push({t:'Buy Shuttle License - 2500cr',f:()=>{if(G.money<2500){toast('Not enough credits');sfx('bad');return}G.money-=2500;G.port=1;sfx('wed');toast('Shuttle License acquired!');portMenu()}});
 else o.push({t:'Fly to Phobos Station - 150cr',f:()=>{if(G.money<150){toast('Not enough credits');sfx('bad');return}G.money-=150;modal=null;flyPhobos()}});o.push({t:'Leave'});
 say('Shuttle Port',[G.port?'Departures: PHOBOS STATION - boarding now. Flight time: 40 minutes.':'"Orbital flights are licensed colonists only. A license costs 2500cr." (A friendly pilot might vouch for you...)'],o);modal.ch=999}
function flyPhobos(){FLY={t:0};sfx('door')}
let FLY=null;
function phobosArrive(){FLY=null;G.time=Math.min(G.time+40,1500);enter('phobos',10,7,0);G.stats.phobos=(G.stats.phobos||0)+1;if(!G.phob){G.phob=1;say('Phobos Station',['The shuttle docks with a soft clunk. Through the great window, Mars fills half the sky.','Gravity here is barely a whisper - every step feels like a leap.','Traders on the station sell things you can\'t get in the dome. Check the Exchange counter.']);loreFind()}checkAch()}
function exchMenu(){say('Phobos Exchange',['"Rare goods from the outer belt. Credits only."'],[{t:'Rift Key - 1800cr',f:()=>{ITEMS.riftkey.p=1800;buy('riftkey');exchMenu()}},{t:'Starfruit Seeds - 200cr',f:()=>{buy('s_stf');exchMenu()}},{t:'Phobos Ice (+70 energy) - 90cr',f:()=>{buy('pice');exchMenu()}},{t:'Leave'}]);modal.ch=999}
function phobosLog(){say('Observation Terminal',['MARS - orbital survey. Terraforming stage '+G.terra+'/3. '+['Surface: dust and rock. Thin CO2 haze.','Lichen fields detected near Cydonia.','Atmosphere thickening. Clouds observed!','Liquid water confirmed. Mars is waking up.'][Math.min(3,G.terra)],G.lore&&Object.keys(G.lore).length<LORE.length?'An archive file flickers open...':'Archive: no new files.'],[{t:'Close',f:()=>{if(Math.random()<.5)loreFind()}}]);modal.ch=999}
// ---------- Hellas Rift ----------
SOLID.add('Z');const RG=[26,40];
{const m=MAPS.surf;for(let y=RG[1]-1;y<=RG[1]+2;y++)for(let x=RG[0]-1;x<=RG[0]+1;x++)m[y][x]='r';m[RG[1]][RG[0]]='K'}
{const _gs=genSurface;genSurface=function(){return _gs().filter(e=>Math.hypot(e.x-RG[0]*T-8,e.y-RG[1]*T-8)>40)}}
Object.assign(BUGS,{wraith:{hp:10,spd:.8,dmg:16,c:'#c02a6a',c2:'#ff9ac8',drop:'rshard'},magma:{hp:14,spd:.45,dmg:18,c:'#d8501a',c2:'#ffd070',drop:'chit'}});
const MODS=[['Swarm','Twice as many creatures'],['Rich Veins','Extra ore and Rift Shards'],['Magma Surge','Lava floods the caverns'],['Thin Air','O2 drains twice as fast'],['Treasure Hunt','A Rift Cache on every floor'],['Glass Cannon','Creatures are frail but hit 50% harder']];
const riftMod=(d=G.day)=>hash(d,77)%MODS.length,inRift=()=>G.zone=='mine'&&MINE&&MINE.rift;
const UQ={boots:['Phase Boots','move 20% faster everywhere'],charm:['Rift Charm','take 25% less damage'],lung:['Rift Lung','O2 drains 30% slower']};
function genRift(f){let seed=(G.day*131+f*7919)%2147483646+1;const r=()=>(seed=(seed*16807)%2147483647)/2147483647,mod=riftMod(),w=30,h=22;
 const m=mk(w,h,(x,y)=>x==0||y==0||x==w-1||y==h-1?'Z':(r()<.08&&!(x<6&&y<6))?'Z':'n');const lava=[];
 for(let i=0,n=mod==2?9:2+Math.floor(f/4);i<n;i++){const cx_=6+Math.floor(r()*(w-10)),cy=3+Math.floor(r()*(h-6)),rr=1+r()*1.6;lava.push([cx_,cy]);for(let y=cy-2;y<=cy+2;y++)for(let x=cx_-2;x<=cx_+2;x++)if(m[y]&&m[y][x]=='n'&&Math.hypot(x-cx_,y-cy)<=rr)m[y][x]='l'}
 m[2][2]='u';let lx,ly;do{lx=Math.floor(w/2+r()*(w/2-3));ly=Math.floor(3+r()*(h-6))}while(m[ly][lx]=='Z');m[ly][lx]='v';
 for(let x=2;x<=lx;x++)if(m[3][x]!='v')m[3][x]='n';for(let y=Math.min(3,ly);y<=Math.max(3,ly);y++)if(m[y][lx]!='v')m[y][lx]='n';for(let y=1;y<6;y++)for(let x=1;x<6;x++)if(m[y][x]!='u')m[y][x]='n';
 const E=[],free=(x,y)=>m[y][x]=='n'&&!(x<6&&y<6)&&!(Math.abs(x-lx)<2&&Math.abs(y-ly)<2)&&!E.some(e=>Math.hypot(e.x-x*T-8,e.y-y*T-8)<T)&&!(y==3&&x<=lx)&&!(x==lx);
 const no=Math.round((14+f)*(mod==1?1.6:1));for(let i=0,g=0;i<no&&g<900;g++){const x=1+Math.floor(r()*(w-2)),y=1+Math.floor(r()*(h-2));if(!free(x,y))continue;const q=r();
  const t=q<(mod==1?.25:.14)?'rshard':q<.3?'pla':q<.55?'cob':q<.8?'iron':'crys';E.push({k:'ore',t,x:x*T+8,y:y*T+8,hp:{rshard:9,pla:8,cob:6,iron:3,crys:4}[t]});i++}
 if(f%5==0||mod==4)for(let g=0;g<400;g++){const x=1+Math.floor(r()*(w-2)),y=1+Math.floor(r()*(h-2));if(free(x,y)){E.push({k:'ore',t:'rcache',x:x*T+8,y:y*T+8,hp:6});break}}
 const nb=Math.min(40,Math.round((4+f*1.5)*(mod==0?2:1))),pool=['crawler','spitter','hopper','scorp','mantis','frostmite','wraith','magma'];
 for(let i=0,g=0;i<nb&&g<900;g++){const x=6+Math.floor(r()*(w-8)),y=2+Math.floor(r()*(h-4));if(m[y][x]!='n')continue;const t=pool[Math.min(pool.length-1,Math.floor(r()*Math.min(pool.length,3+f/2)))];const b=mkBug(t,x*T+8,y*T+8,8+f*1.2);if(mod==5){b.hp=b.max=Math.ceil(b.hp/2)}E.push(b);i++}
 return{m,E,boss:false,rift:true,lava}}
function enterRift(f){G.rfloor=f;G.riftBest=Math.max(G.riftBest||0,f);MINE=genRift(f);enter('mine',3,3,2);const md=MODS[riftMod()];toast('Hellas Rift - Depth '+f+' · '+md[0]);if(f==1)say('Hellas Rift',['Today\'s Rift modifier: '+md[0].toUpperCase()+' - '+md[1]+'.','The Rift reshapes itself every sol. Danger grows with every depth. Rift Caches appear every 5 depths.'],null);if(f%5==0)sfx('roar');checkAch()}
function riftGate(){G.py+=T;if(!G.riftOpen){if(cnt('riftkey')){rem('riftkey',1);G.riftOpen=1;sfx('wed');shake(6,4);say('Hellas Rift',['The key slides into the black-glass arch. Red light pours out of the ground.','The Hellas Rift is open. It changes every sol. Go deep - if you dare.'],[{t:'Descend',f:()=>enterRift(1)},{t:'Not yet'}])}else say('Black Glass Gate',['A gate of fused black glass, humming faintly. There is a keyhole shaped like a shard of crystal.','(Forge a Rift Key from 3 Meteorite Ore, 5 Cobalt and 5 Crystal - or buy one on Phobos.)']);return}
 const md=MODS[riftMod()];say('Hellas Rift',['Today: '+md[0]+' - '+md[1]+'. Deepest: Depth '+(G.riftBest||0)+'.'],[{t:'Enter Depth 1',f:()=>enterRift(1)},...(G.riftBest>=6?[{t:'Enter Depth 5',f:()=>enterRift(5)}]:[]),...(G.riftBest>=11?[{t:'Enter Depth 10',f:()=>enterRift(10)}]:[]),{t:'Leave'}])}
function openCache(){const own=Object.keys(UQ).filter(k=>!(G.uq||{})[k]);G.uq=G.uq||{};let msg;
 if(own.length&&G.rfloor>=5&&Math.random()<.5){const k=rnd(own);G.uq[k]=1;msg='UNIQUE: '+UQ[k][0]+'! ('+UQ[k][1]+')';sfx('wed')}
 else if(Math.random()<.4){add('hgem');msg='Hellas Gem!'}else{const q=2+Math.floor(G.rfloor/5);add('rshard',q);G.money+=100*G.rfloor;msg=q+' Rift Shards + '+100*G.rfloor+'cr'}
 floatTxt(G.px,G.py-30,msg,'#ffd23a');say('Rift Cache',['The cache cracks open: '+msg]);modal.ch=999;shake(4,2);checkAch()}
{const _tr=triggers;triggers=function(){const tx=Math.floor(G.px/T),ty=Math.floor((G.py-2)/T),t=tileAt(tx,ty);
 if(inRift()){if(t=='u'){enter('surf',RG[0],RG[1]+1,2);toast('You climb out of the Rift');return}if(t=='v'){enterRift(G.rfloor+1);return}}
 if(G.zone=='surf'&&t=='K'){riftGate();return}
 if(G.zone=='city'&&t=='D'&&tx==15&&ty==28&&!barOpen()){G.py+=T;toast('The Airlock opens at 5pm');sfx('bad');return}return _tr()}}
{const _h=hurt;hurt=function(d,f){if(inRift())d=Math.round(d*(1+G.rfloor*.04)*(riftMod()==5?1.5:1));if(G.uq&&G.uq.charm)d=Math.max(1,Math.round(d*.75));_h(d,f)}}
{const _mc=mapCanvas;mapCanvas=function(z){if(z=='mine')for(const k in MAPC)if(k.startsWith('mine'))delete MAPC[k];return _mc(z)}}
// ---------- interactions ----------
{const _in=interact;interact=function(){if(nearNPC())return _in();const[fx,fy]=facingTile(),t=tileAt(fx,fy),z=G.zone;
 if(z=='clinic'&&(t=='c'||t=='e'||t=='h')){clinicMenu();return}if(z=='bar'&&t=='c'){barMenu();return}if(z=='bar'&&t=='h'){arcadeMenu();return}if(z=='bar'&&t=='s'){barMenu();return}
 if(z=='port'&&(t=='c'||t=='h'||t=='e')){portMenu();return}if(z=='phobos'&&t=='c'){exchMenu();return}if(z=='phobos'&&(t=='h'||t=='k')){phobosLog();return}return _in()}}
{const _a2=act;act=function(){const[fx,fy]=facingTile(),t=tileAt(fx,fy),z=G.zone;if(['clinic','bar','port','phobos'].includes(z)&&'cehk'.includes(t)&&t&&!nearNPC()){interact();return}return _a2()}}
// ---------- arcade minigame: Dust Runner ----------
let MINI=null;
function arcadeMenu(){say('DUST RUNNER',['Dodge the falling meteors! Steer with arrows/A-D or tap left/right. Score x5 = credits (max 300). Today\'s best: '+(G.arcHi||0)+'.'],[{t:'Play - 25cr',f:()=>{if(G.money<25){toast('Not enough credits');sfx('bad');return}G.money-=25;modal=null;MINI={t:0,x:W/2,tx:W/2,rocks:[],score:0,over:0,k:0}}},{t:'Leave'}]);modal.ch=999}
function miniStep(){const m=MINI;if(m.over){m.over++;return}m.t++;const sp=1.6+m.t/500;if(m.k)m.tx=m.x+m.k*20;m.x+=Math.max(-3,Math.min(3,m.tx-m.x));m.x=Math.max(70,Math.min(W-70,m.x));
 if(m.t%Math.max(7,26-Math.floor(m.t/90))==0)m.rocks.push({x:70+Math.random()*(W-140),y:30,r:4+Math.random()*5,s:sp*(0.8+Math.random()*.5)});
 for(const r of m.rocks){r.y+=r.s;if(Math.hypot(r.x-m.x,r.y-(H-40))<r.r+5){m.over=1;sfx('hurt');shake(5,0);const pay=Math.min(300,m.score*5);G.money+=pay;G.arcHi=Math.max(G.arcHi||0,m.score);m.pay=pay;G.stats.arcade=(G.stats.arcade||0)+1;checkAch()}if(r.y>H-24&&!r.p){r.p=1;m.score++}}
 m.rocks=m.rocks.filter(r=>r.y<H)}
function drawMini(){const m=MINI;panel(60,14,W-120,H-24,'#05020e','#ff6aa8');for(let i=0;i<30;i++)R(64+hash(i,4)%(W-128),20+(hash(4,i)%(H-40)+m.t*(.3+i%3*.2))%(H-40),1,1,'#fff8');
 R(64,H-26,W-128,2,'#ff6aa8');txt('DUST RUNNER',W/2,28,'#ffd27a',8,'center');txt('SCORE '+m.score,72,28,'#fff',7);txt('BEST '+(G.arcHi||0),W-72,28,'#fff',7,'right');
 for(const r of m.rocks){cx.fillStyle='#8a5a4a';cx.beginPath();cx.arc(r.x,r.y,r.r,0,6.3);cx.fill();R(r.x-1,r.y-r.r-5,2,4,'#fa4')}
 const X=m.x,Y=H-40;R(X-6,Y+2,12,4,'#4cf');R(X-2,Y-6,4,8,'#e8e0f0');R(X-1,Y-5,2,2,'#7cf');if(tick%4<2)R(X-1,Y+6,2,3,'#fa4');
 if(m.over){panel(W/2-80,H/2-24,160,44,'#000c','#ffd27a');txt('CRASH!  Score '+m.score,W/2,H/2-8,'#fff',8,'center');txt('+'+m.pay+'cr   (tap to exit)',W/2,H/2+8,'#ffd27a',7,'center')}}
// ---------- 10-heart events ----------
const EV10={ava:['Ava takes you to the top of the greenhouse at night. "I painted this for you," she says, unveiling a canvas of your farm - green, glowing, alive.','"When I came to Mars I thought I\'d paint only red. You changed my palette."',['s_sfl',5]],
 kai:['Kai closes the cafe early and cooks a meal just for you: every recipe you two ever talked about, on one plate.','"Best customer. Best friend. Don\'t tell the others."',['chili',3]],
 ruiz:['Dr. Ruiz shows you her microscope. Under the glass, a single living cell - grown from your soil.','"Native Martian life, revived. Your farm did that. I\'m putting your name on the paper."',['medkit',5]],
 mo:['Old Mo hands you a key of black glass, warm to the touch. "Found it in the deep mine forty years ago. Never had the guts to use it."','"South of the mine. A gate. You\'re braver than I ever was, kid."',['riftkey',1]],
 zara:['Zara straps you into the co-pilot seat and takes off. The whole colony becomes a ring of lights below you.','"Here - I vouched for you at the Shuttle Port. Your license is waiting. Come fly with me sometime."',['port',1]],
 theo:['Theo shows you the telescope he built from scrap. Through it, a pale blue dot hangs over the horizon. Earth.','"It looks so small from here. Funny - Mars feels bigger every day."',['rshard',3]],
 vega:['Mayor Vega invites you to the colony council. They vote unanimously: you are named Honorary Founder of New Cydonia.','"Rhea would be proud. I certainly am."',['money',2000]],
 pip:['Pip drags you to a secret patch behind the Community Center. Twelve glowberries, planted in a perfect heart.','"I grew them myself! Just like you showed me!"',['s_glo',10]]};
{const _tk=talk;talk=function(n){const h=G.hearts[n.id]||0,e=EV10[n.id];if(h>=10&&e&&!G.events[n.id+'10']&&!isFestival()){G.events[n.id+'10']=1;sfx('heart');say(n.n+' ♥ Event',[e[0],e[1]],[{t:'♥',f:()=>{const[k,q]=e[2];if(k=='money')G.money+=q;else if(k=='port')G.port=1;else add(k,q);toast('Received: '+(k=='money'?q+'cr':k=='port'?'Shuttle License':q+' '+ITEMS[k].n));G.stats.ev10=(G.stats.ev10||0)+1;checkAch()}}],n.look);return}return _tk(n)}}
// ---------- talking portraits ----------
{const _dp=drawPortrait;drawPortrait=function(g,X,Y,look,s=3,mood,blink){_dp(g,X,Y,look,s,mood,blink);if(g===cx&&modal&&modal.look===look&&modal.ch<(modal.pages[modal.pi]||'').length&&Math.floor(tick/5)%2){const sk=look.skin;R(X+6*s,Y+8*s,4*s,3*s,sk);R(X+6*s,Y+9*s,4*s,2*s,'#3a1018');R(X+7*s,Y+10*s,2*s,1*s,'#d0506a')}}}
// ---------- spouse rooms ----------
const SPROOM={ava:(X,Y)=>{R(X+4,Y-10,2,24,'#6a4a2a');R(X+16,Y-10,2,24,'#6a4a2a');R(X+2,Y-14,18,14,'#fff');R(X+4,Y-12,14,4,'#7cf');R(X+4,Y-8,14,6,'#5a4');R(X+9,Y-11,4,4,'#ffd23a')},
 kai:(X,Y)=>{R(X+2,Y-6,26,18,'#5a3a2a');R(X+2,Y-6,26,3,'#8a6a4a');R(X+6,Y-14,10,10,'#888');R(X+8,Y-12,6,4,'#222');R(X+20,Y-10,5,5,'#fff');if(tick%40<20)R(X+21,Y-14,1,3,'#fff8')},
 ruiz:(X,Y)=>{R(X+2,Y-4,24,16,'#ccd');R(X+2,Y-4,24,2,'#fff');R(X+6,Y-14,4,10,'#334');R(X+5,Y-16,6,3,'#556');R(X+16,Y-10,6,6,'#9f6');R(X+17,Y-9,4,4,'#cfc')},
 mo:(X,Y)=>{R(X+2,Y-2,26,14,'#4a3a2a');R(X+4,Y-8,6,6,'#7a6a5a');R(X+12,Y-6,5,4,'#ffb070');R(X+19,Y-9,6,7,'#4cf');R(X+20,Y-8,2,2,'#fff')},
 zara:(X,Y)=>{R(X+12,Y-18,4,24,'#ddd');R(X+10,Y-4,8,4,'#f44');R(X+13,Y-22,2,4,'#f44');R(X+12,Y+6,4,3,tick%6<3?'#fa4':'#ff6');R(X+2,Y-8,8,10,'#2a3a6a');R(X+3,Y-7,6,3,'#9cf')},
 theo:(X,Y)=>{R(X+10,Y-2,2,14,'#555');R(X+4,Y+8,14,2,'#555');R(X+4,Y-14,18,6,'#c8c8d8');R(X+20,Y-14,3,6,'#7cf');R(X+2,Y,6,10,'#a86a3a')},
 vega:(X,Y)=>{R(X+2,Y-4,26,16,'#6a3a2a');R(X+2,Y-4,26,3,'#9a5a3a');R(X+6,Y-12,12,8,'#ffd23a');R(X+8,Y-10,8,4,'#fff6');R(X+22,Y-10,4,6,'#7a1a3a')},
 pip:(X,Y)=>{R(X+2,Y,10,10,'#ff6aa8');R(X+14,Y+2,8,8,'#6af');R(X+6,Y-6,6,6,'#ffd23a');R(X+18,Y-12,8,10,'#9f6');R(X+20,Y-14,4,3,'#3a8a3a')}};
// ---------- update / draw ----------
const DOORA={};
function v8tick(){if(inRift()){const t=tileAt(Math.floor(G.px/T),Math.floor((G.py-2)/T));if(t=='l'&&tick%30==0&&!G.uq?.lava){hurt(5);parts(G.px,G.py,'#fa4',6)}if(riftMod()==3&&tick%60==0)G.o2=Math.max(0,G.o2-1)}
 if(G.uq&&G.uq.lung&&OUTZ(G.zone)&&tick%120==0)G.o2=Math.min(100,G.o2+1);if(cnt('rcache')){rem('rcache',1);openCache()}}
{const _u=update;update=function(){if(MINI||FLY){tick++;padPoll();if(MINI)miniStep();if(FLY&&++FLY.t>150)phobosArrive();return}const x0=G.px,y0=G.py,ok=!TITLE&&!CRED&&!modal&&!menu&&!CUT&&!MAPV;_u();
 if(ok&&G&&(G.px!=x0||G.py!=y0)){const k=(G.uq&&G.uq.boots?.2:0)+(G.zone=='phobos'?.3:0);if(k){const nx=G.px+(G.px-x0)*k,ny=G.py+(G.py-y0)*k;if(feetFree(nx,ny)){G.px=nx;G.py=ny}}
  if(tick%14==0&&['farm','surf','valles'].includes(G.zone))parts(G.px,G.py,G.zone=='farm'?'#d8a070':'#a85a4a',2,.4)}
 if(!TITLE&&!CRED&&G)v8tick()}}
const DZ={clinic:['#e8f0f4','#c8d8e0','#bfe8e8','#4a8a9a'],bar:['#2a1a34','#221430','#ff2ad8','#1a0a24'],port:['#5a6070','#4a5060','#8ad8ff','#2a3040'],phobos:['#3a4050','#30364a','#9ad0ff','#1a2030']};
{const _dt=drawTile;drawTile=function(g,z,t,v){if(DZ[z]){const p=DZ[z];if(t=='w'){px(g,0,0,T,T,p[3]);px(g,0,10,T,6,shade(p[3],-.3));px(g,0,10,T,1,p[2]);if(v==2&&z!='phobos'){px(g,4,2,8,6,p[2]);px(g,4,2,8,1,'#fff')}return}
 px(g,0,0,T,T,p[0]);px(g,0,0,T,1,p[1]);px(g,0,0,1,T,p[1]);if(z=='bar'&&(v%2))px(g,7,7,2,2,'#ff2ad855');if(z=='clinic'&&v==1)px(g,6,6,4,4,p[1]);if(t=='r'){px(g,0,2,T,12,z=='clinic'?'#5ab0c0':z=='bar'?'#6a1a5a':'#3a5a8a');px(g,0,4,T,1,'#fff6');px(g,0,11,T,1,'#fff6')}if(t=='D'){px(g,2,0,12,T,'#1a1a24');px(g,3,1,10,T,p[2]+'40')}return}
 if(z=='mine'&&(t=='n'||t=='Z'||t=='l')){if(t=='Z'){px(g,0,0,T,T,'#1a0608');px(g,0,0,T,2,'#3a0a10');if(v==1)px(g,5,6,3,1,'#ff2a4a55');return}dither(g,'#2a1214','#200c0e','#3a1a1a',v,16);if(v==2){px(g,3,8,6,1,'#ff3a2a66');px(g,8,9,4,1,'#ff3a2a44')}
  if(t=='l'){px(g,0,0,T,T,'#c8300a');px(g,1,1,14,14,'#ff6a1a');px((g),(v*5)%10+2,4,4,2,'#ffd040');px(g,(v*7)%9+3,10,3,2,'#ffb020')}return}
 if(z=='surf'&&t=='K'){_dt(g,z,'r',v);px(g,2,2,12,12,'#1a0a14');px(g,4,4,8,8,'#ff2a6a');px(g,6,6,4,4,'#ffd0e0');return}_dt(g,z,t,v)}}
{const _ds=drawStructures;drawStructures=function(ox,oy,D){_ds(ox,oy,D);const z=G.zone,night=G.time>=1140||G.time<390;
 if(z=='city'){for(const[a,b,n,c,neon,dx]of[[3,9,'CLINIC','#d8e8f0','#ff3a3a',6],[12,19,'THE AIRLOCK','#2a1036','#ff2ad8',15],[22,29,'SHUTTLE PORT','#3a4a5a','#8ad8ff',25]]){const X=a*T-ox,Y=24*T-oy-12,w=(b-a+1)*T,h=5*T+12;if(X>W||X+w<0||Y>H||Y+h<-20)continue;
   R(X+4,Y+h,w,5,'#0005');R(X,Y,w,h,c);for(let i=Y+8;i<Y+h;i+=8)R(X,i,w,1,shade(c,-.12));R(X,Y,w,4,shade(c,.25));const on=n!='THE AIRLOCK'||barOpen()||tick%60<30;R(X+4,Y+8,w-8,14,'#0a0610');txt(n,X+w/2,Y+18,on?neon:shade(neon,-.6),8,'center',0);if(on)light(X+w/2,Y+15,60,neon);
   for(let i=10;i<w-10;i+=22)if(Math.abs(X+i-(dx*T-ox))>16){R(X+i,Y+34,14,16,'#2a2030');R(X+i+1,Y+35,12,14,night?'#ffd890':'#8ad8ff');R(X+i+1,Y+35,12,2,'#fff6')}
   if(n=='CLINIC'){R(X+w-22,Y+28,12,4,'#f33');R(X+w-18,Y+24,4,12,'#f33')}if(n=='SHUTTLE PORT'){const sy=(tick*.4)%120;if(sy<60){R(X+w/2-3,Y-6-sy,6,10,'#e8e0f0');R(X+w/2-1,Y+4-sy,2,3,'#fa4')}}
   R(X,Y+h-3,w,3,neon);doorAnim(dx,28,ox,oy,neon)}}
 if(z=='city'||z=='farm'){for(const k in DOORS){const[zz,p]=k.split(':');if(zz!=z)continue;const[dx,dy]=p.split(',').map(Number);if(!(z=='city'&&dy==28))doorAnim(dx,dy,ox,oy,z=='farm'?'#ffd06a':'#ff6aa8')}}
 if(z=='surf'){const X=RG[0]*T-ox,Y=RG[1]*T-oy;if(X>-40&&X<W+40&&Y>-60&&Y<H+20)D.push([Y+T,()=>{R(X-14,Y-30,8,44,'#140810');R(X+22,Y-30,8,44,'#140810');R(X-16,Y-36,48,10,'#1e0c16');R(X-14,Y-34,44,2,'#4a1a2a');
   const o=G.riftOpen;R(X-6,Y-26,28,40,o?'#ff2a6a'+(tick%20<10?'aa':'88'):'#2a0a18');if(o)for(let i=0;i<4;i++)R(X-4+((tick+i*9)%24),Y-20+((tick*2+i*17)%30),2,2,'#ffd0e0');R(X+5,Y-12,6,6,o?'#fff':'#ff4a8a');txt('HELLAS RIFT',X+8,Y-40,'#ff9ac8',6,'center')}]),light(X+8,Y-8,50,'#ff2a6a')}
 if(inRift()&&MINE.lava)for(const[a,b]of MINE.lava){const X=a*T-ox+8,Y=b*T-oy+8;if(X>-40&&X<W+40&&Y>-40&&Y<H+40)light(X,Y,36+Math.sin(tick/15+a)*4,'#ff5a1a')}
 if(z=='home'&&G.spouse&&SPROOM[G.spouse]){const X=9*T-ox,Y=2*T-oy;D.push([Y+T,()=>SPROOM[G.spouse](X,Y)]);}
 if(z=='bar'){for(let x=10;x<=13;x++){const X=x*T-ox,Y=T-oy;D.push([Y+T+1,()=>{R(X+1,Y-10,14,26,'#1a0a2a');R(X+3,Y-8,10,8,['#f4f','#4ff','#ff4','#4f8'][x%4]+(tick%30<15?'':'aa'));R(X+3,Y+2,10,2,'#555');R(X+5,Y+1,2,2,'#f44');R(X+9,Y+1,2,2,'#44f');txt('★',X+8,Y-11,'#ffd27a',5,'center',0)}]);light(X+8,Y-4,16,'#f4f')}
  if(!barOpen())0;const X=4*T-ox,Y=1*T-oy;light(X,Y,50,'#ff2ad8')}
 if(z=='clinic'){const X=11*T-ox,Y=1*T-oy;R(X+2,Y-8,10,6,'#fff');R(X+5,Y-8,4,6,'#f33');R(X+3,Y-6,8,2,'#f33')}
 if(z=='phobos'){const X=5*T-ox,Y=-oy+2,w=12*T,h=2*T-6;R(X-2,Y-2,w+4,h+4,'#8a9ab0');R(X,Y,w,h,'#02010a');for(let i=0;i<24;i++)R(X+hash(i,8)%w,Y+hash(8,i)%h,1,1,'#fff');
  cx.save();cx.beginPath();cx.rect(X,Y,w,h);cx.clip();const mx=X+w/2,my=Y+h+60;cx.fillStyle='#b8442a';cx.beginPath();cx.arc(mx,my,80,0,6.3);cx.fill();cx.fillStyle='#d8643a';cx.beginPath();cx.arc(mx-10+Math.sin(tick/300)*4,my-8,62,0,6.3);cx.fill();if(G.terra>=2){cx.fillStyle='#fff6';cx.fillRect(mx-50+(tick/4)%100,my-70,30,3)}if(G.terra>=3){cx.fillStyle='#3a8ad0';cx.beginPath();cx.arc(mx+20,my-60,8,0,6.3);cx.fill()}cx.restore();
  for(let i=0;i<w;i+=48)R(X+i,Y,2,h,'#8a9ab0')}}}
function doorAnim(dx,dy,ox,oy,col){const k=G.zone+dx+','+dy,X=dx*T-ox,Y=dy*T-oy,near=Math.hypot(G.px-dx*T-8,G.py-dy*T-8)<30&&!(G.zone=='city'&&dx==15&&dy==28&&!barOpen());DOORA[k]=Math.max(0,Math.min(1,(DOORA[k]||0)+(near?.12:-.08)));const p=DOORA[k];if(p<=0||X<-T||X>W||Y<-T||Y>H)return;
 R(X+2,Y+1,12,14,'#2a1a14');const o=Math.round(6*p);R(X+3+6-o,Y+2,o*2,13,'#0a0610');R(X+3+6-o,Y+2,o*2,1,col);if(p>.5)light(X+8,Y+10,18*p,col)}
{const _d=draw;draw=function(){if(FLY){const t=FLY.t,g=cx.createLinearGradient(0,0,0,H);g.addColorStop(0,'#02010a');g.addColorStop(1,'#1a0620');cx.fillStyle=g;cx.fillRect(0,0,W,H);stars(90,.2+t*.01,1,5);
  const my=H+40+t*1.4;cx.fillStyle='#b8442a';cx.beginPath();cx.arc(W/2,my,150,0,6.3);cx.fill();const py_=H-60-t*.4+Math.sin(t/8)*1.5;cx.fillStyle='#8a8a9a';cx.beginPath();cx.arc(W-70,40+(150-t)*.3,14+t*.12,0,6.3);cx.fill();
  R(W/2-12,py_,24,10,'#e8e0f0');R(W/2-12,py_,24,2,'#fff');R(W/2+6,py_+2,4,3,'#7cf');R(W/2-4,py_+10,8,4+(tick%4<2?3:0),'#fa4');panel(W/2-90,H-30,180,20,'#000a','#8ad8ff');txt('En route to Phobos Station...',W/2,H-16,'#cef',8,'center');return}
 _d();if(MINI)drawMini();else if(inRift()&&!TITLE&&!CRED&&!MAPV){const md=MODS[riftMod()];txt(md[0],W/2,30,'#ff9ac8',7,'center');cx.fillStyle='rgba(120,0,20,0.08)';cx.fillRect(0,0,W,H)}}}
{const _ot=onTap;onTap=function(x,y){if(FLY)return true;if(MINI){if(MINI.over>20)MINI=null;else if(!MINI.over)MINI.tx=x;return true}return _ot(x,y)}}
addEventListener('keydown',e=>{if(!MINI&&!FLY)return;e.stopImmediatePropagation();const k=e.key.toLowerCase();if(FLY)return;if(MINI.over>20&&(k==' '||k=='enter'||k=='escape'||k=='e')){MINI=null;return}if(k=='arrowleft'||k=='a')MINI.k=-1;if(k=='arrowright'||k=='d')MINI.k=1},true);
addEventListener('keyup',e=>{if(!MINI)return;const k=e.key.toLowerCase();if(['arrowleft','a','arrowright','d'].includes(k))MINI.k=0},true);
// icons
{const _di=drawIcon;drawIcon=function(g,id,X,Y){if(id=='riftkey'){px(g,X+2,Y+6,6,6,'#1a0a14');px(g,X+3,Y+7,4,4,'#ff4a8a');px(g,X+8,Y+8,7,2,'#2a1020');px(g,X+12,Y+10,2,3,'#2a1020');px(g,X+4,Y+8,2,2,'#fff');return}
 if(id=='rshard'||id=='hgem'){const c=ITEMS[id].c;px(g,X+6,Y+2,4,12,shade(c,-.4));px(g,X+4,Y+5,8,7,c);px(g,X+5,Y+5,2,4,'#fff8');if(id=='hgem')px(g,X+3,Y+7,10,3,c);return}
 if(id=='fizz'){px(g,X+5,Y+3,6,11,'#ccc');px(g,X+6,Y+5,4,8,'#ff5a7a');px(g,X+6,Y+5,4,1,'#fff');px(g,X+9,Y+1,1,4,'#fff');return}if(id=='pice'){ob(g,X+3,Y+4,10,9,'#cfefff');px(g,X+5,Y+5,3,2,'#fff');return}_di(g,id,X,Y)}}
ACH.push(['rift10','Rift Diver','Reach Depth 10 of the Hellas Rift',g=>(g.riftBest||0)>=10],['riftuq','Rift Lord','Find all 3 Rift uniques',g=>Object.keys(g.uq||{}).length>=3],['phobos','Spacefarer','Visit Phobos Station',g=>(g.stats.phobos||0)>=1],
 ['angler2','Master Angler','Catch all 6 new fish',g=>['dgud','bfin','ipik','sray','brine','cryp'].every(k=>(g.fishSeen||{})[k])],['ev10','Kindred Spirit','See a 10-heart event',g=>(g.stats.ev10||0)>=1],['arcade','High Scorer','Score 30 in Dust Runner',g=>(g.arcHi||0)>=30]);
window.FM8={genRift,enterRift,riftGate,riftMod,MODS,RG,UQ,openCache,clinicMenu,barMenu,portMenu,exchMenu,phobosArrive,flyPhobos,arcadeMenu,get MINI(){return MINI},set MINI(v){MINI=v},get FLY(){return FLY},miniStep,EV10,pickFish,DOORA,SPROOM,barOpen,inRift};
