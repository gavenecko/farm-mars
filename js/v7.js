// Farm Mars v7 - story cutscenes, animated title, new crops, recipe book & buffs, weather events, lore journal, map/journal/settings screen, storage chests, autosave
// ---------- settings ----------
let SET=Object.assign({text:1,btn:1,shake:1},(()=>{try{return JSON.parse(localStorage.getItem('fm_set'))||{}}catch(e){return{}}})());
const TSPD=[[.8,'Slow'],[1.5,'Normal'],[4,'Fast'],[999,'Instant']],BSZ=[[.85,'Small'],[1,'Medium'],[1.2,'Large']];
function saveSet(){try{localStorage.setItem('fm_set',JSON.stringify(SET))}catch(e){}applyBtn()}
function applyBtn(){const s=BSZ[SET.btn][0],t=touchUI;BTN.A.r=Math.round((t?26:23)*s);BTN.B.r=Math.round((t?21:18)*s);BTN.A.x=W-8-BTN.A.r;BTN.A.y=H-40-BTN.A.r;BTN.B.x=BTN.A.x-BTN.A.r-BTN.B.r-6;BTN.B.y=H-13-BTN.B.r}
{const _pl=phoneLayout;phoneLayout=function(){_pl();applyBtn()}}
{const _sh=shake;shake=function(n,h){if(SET.shake)_sh(n,h);else _sh(0,h)}}
// ---------- new crops (2 per season) ----------
const NEWC={dbn:{n:'Dust Bean',p:25,days:3,re:2,v:50,s:[0],c:'#c8a060',shape:'vine'},rad:{n:'Rust Radish',p:18,days:2,v:38,s:[0,3],c:'#e04a5a',shape:'root'},
 sfl:{n:'Sunflare',p:50,days:5,v:150,s:[1],c:'#ffb020',shape:'flower'},pep:{n:'Plasma Pepper',p:40,days:4,re:3,v:80,s:[1],c:'#ff4020',shape:'berry'},
 icl:{n:'Ice Lettuce',p:30,days:3,v:70,s:[2],c:'#bfeaff',shape:'leaf'},snp:{n:'Snowpea',p:35,days:4,re:2,v:60,s:[2],c:'#d8f8c8',shape:'vine'},
 vol:{n:'Volt Squash',p:70,days:6,v:260,s:[3],c:'#9a6aff',shape:'melon'},ash:{n:'Ashgrain',p:15,days:3,v:40,s:[3],c:'#b8a89a',shape:'grain'}};
for(const k in NEWC){const c=Object.assign({c2:shade(NEWC[k].c,-.45)},NEWC[k]);CROPS[k]=c;const b=ITEMS[k]={n:c.n,v:c.v,c:c.c,food:Math.round(c.v/3),crop:1,d:'Season: '+c.s.map(i=>SEASONS[i]).join(', ')};ITEMS['s_'+k]={n:c.n+' Seeds',seed:k,p:c.p,c:c.c,d:'Grows in '+c.days+' sols. '+c.s.map(i=>SEASONS[i]).join('/')+'.'};
 ITEMS[k+'_s']=Object.assign({},b,{n:'Silver '+b.n,v:Math.round(b.v*1.25),q:1,base:k});ITEMS[k+'_g']=Object.assign({},b,{n:'Gold '+b.n,v:Math.round(b.v*1.6),q:2,base:k,food:Math.round(b.food*1.5)});
 ITEMS[k+'_t']={n:b.n+' Tonic',v:Math.round(b.v*2.4+30),c:b.c,food:20,art:'t',src:k,d:'Fermented in a Bio-Fermenter.'};ITEMS[k+'_d']={n:'Dried '+b.n,v:Math.round(b.v*1.7+15),c:b.c,food:Math.round(b.v/2)+10,art:'d',src:k,d:'Dehydrated snack.'};REQPOOL.push(k)}
{const _sm=seedMenu;seedMenu=function(){_sm();const o=modal&&modal.opts;if(o&&o.length>10){const pg=SEEDPG%Math.ceil((o.length-2)/7),body=o.slice(1,-1),sh=body.slice(pg*7,pg*7+7);modal.opts=[o[0]].concat(sh,[{t:'More seeds ('+(pg+1)+'/'+Math.ceil(body.length/7)+')',f:()=>{SEEDPG++;seedMenu()}},o[o.length-1]])}}}
let SEEDPG=0;
// ---------- recipe book & buffs ----------
Object.assign(ITEMS,{frit:{n:'Radish Fritters',v:140,c:'#e07a4a',food:50},chili:{n:'Plasma Chili',v:260,c:'#d8301a',food:70},sbread:{n:'Sunflare Bread',v:300,c:'#ffc040',food:75},fsoup:{n:'Frost Soup',v:220,c:'#bfeaff',food:60},
 vbake:{n:'Volt Squash Bake',v:420,c:'#9a6aff',food:90},eroll:{n:'Glass Eel Roll',v:320,c:'#9ef',food:60},ccake:{n:'Canyon Salt Cake',v:380,c:'#f0d8c8',food:80},sash:{n:'Koi Sashimi',v:500,c:'#f34',food:65},porr:{n:'Ashgrain Porridge',v:150,c:'#d8ccb8',food:55}});
RECIPES.push({id:'frit',in:{rad:2,wht:1},cook:1},{id:'chili',in:{pep:2,dbn:2},cook:1},{id:'sbread',in:{sfl:1,wht:2},cook:1},{id:'fsoup',in:{icl:2,snp:1},cook:1},{id:'vbake',in:{vol:1,egg:1},cook:1},{id:'eroll',in:{eel:1,let:1},cook:1},{id:'ccake',in:{saltb:2,wht:1,egg:1},cook:1},{id:'sash',in:{koi:1,icl:1},cook:1},{id:'porr',in:{ash:2,milk:1},cook:1});
const BUFFS={speed:['Swift','#7f7','move 35% faster'],luck:['Lucky','#ffd23a','better crop quality'],o2:['Deep Breath','#3cf','O2 drains half as fast'],def:['Armored','#f88','take 40% less damage'],en:['Tireless','#fc3','tools cost half energy']};
const RBUFF={stew:'o2',salad:'speed',pie:'luck',grill:'def',omelet:'en',cheese:'luck',frit:'speed',chili:'def',sbread:'luck',fsoup:'o2',vbake:'en',eroll:'luck',ccake:'def',sash:'o2',porr:'en'};
for(const k in RBUFF)if(ITEMS[k])ITEMS[k].d=(ITEMS[k].d?ITEMS[k].d+' ':'')+'Buff: '+BUFFS[RBUFF[k]][0]+' ('+BUFFS[RBUFF[k]][2]+', 4h).';
const buff=k=>G.buff&&G.buff.k==k&&G.buff.until>G.time&&G.buff.day==G.day;
{const _co=consume;consume=function(){const s=cur(),id=s&&s[0],n0=id?cnt(id):0;_co();if(id&&RBUFF[id]&&cnt(id)<n0){const b=RBUFF[id];G.buff={k:b,until:G.time+240,day:G.day};floatTxt(G.px,G.py-34,BUFFS[b][0]+'!',BUFFS[b][1]);parts(G.px,G.py-10,BUFFS[b][1],12,1.5)}}}
{const _h=hurt;hurt=function(d,f){_h(buff('def')?Math.max(1,Math.round(d*.6)):d,f)}}
{const _ue=useEnergy;useEnergy=function(n){return _ue(buff('en')?Math.ceil(n/2):n)}}
{const _q=qualId;qualId=function(c){const a=_q(c);if(!buff('luck'))return a;const b=_q(c),r=x=>ITEMS[x].q||0;return r(b)>r(a)?b:a}}
function recipeBook(pg=0){const C=RECIPES.filter(r=>r.cook),per=5,n=Math.ceil(C.length/per);pg=(pg+n)%n;const o=C.slice(pg*per,pg*per+per).map(r=>{const can=hasAll(r.in);return{t:(can?'✓ ':'  ')+ITEMS[r.id].n+' ['+(RBUFF[r.id]?BUFFS[RBUFF[r.id]][0]:'-')+']: '+Object.entries(r.in).map(([i,q])=>q+' '+ITEMS[i].n.split(' ').pop()).join(', '),f:()=>{craft(r);recipeBook(pg)}}});
 o.push({t:'Next page ('+(pg+1)+'/'+n+')',f:()=>recipeBook(pg+1)},{t:'Done'});say('Kitchen',['Recipe Book - '+C.length+' recipes. Meals restore energy and give a 4-hour buff: '+Object.values(BUFFS).map(b=>b[0]+' ('+b[2]+')').join(', ')+'.'],o);modal.ch=999}
cookMenu=function(){recipeBook(0)};
{const _cr=craft;craft=function(r){const b=cnt(r.id);_cr(r);if(r.cook&&cnt(r.id)>b){G.cooked=G.cooked||{};G.cooked[r.id]=1;checkAch()}}}
// ---------- weather events ----------
ITEMS.metor={n:'Meteorite Ore',v:320,c:'#7a6aa0',d:'Fell from the sky during a meteor shower.'};RESEARCH.push('metor');
function rollWeather(){G.wx=null;if(G.day<3||isFestival())return '';const r=Math.random();
 if(r<.1){G.wx='meteor';G.metc={};let n=3+Math.floor(Math.random()*3),g=0;while(n>0&&g++<400){const x=2+Math.floor(Math.random()*28),y=6+Math.floor(Math.random()*14),k=x+','+y;if(MAPS.farm[y][x]!='g'||G.tiles[k]||G.objs[k]||(x>=11&&x<=14&&y<=7)||Math.abs(x-12)<2&&Math.abs(y-9)<2)continue;G.metc[k]=1;n--}
  return 'METEOR SHOWER! Streaks of fire crossed the dome sky last night. '+Object.keys(G.metc).length+' meteorites landed on your farm - break them open with your pickaxe.'}
 if(r<.2){G.wx='flare';return 'SOLAR FLARE warning! Outdoor O2 drains faster today, but watered crops soak up the energy and grow an extra stage tonight.'}return ''}
function breakMeteor(k){if(!useEnergy(3))return;swing('pick');sfx('break');shake(4,3);const[x,y]=k.split(',').map(Number);delete G.metc[k];const q=1+(Math.random()<.4?1:0);add('metor',q);parts(x*T+8,y*T+8,'#c8b8ff',16,2);floatTxt(x*T+8,y*T-6,'+'+q+' Meteorite Ore','#c8b8ff');if(Math.random()<.35)loreFind();G.stats.meteor=(G.stats.meteor||0)+1;checkAch()}
// ---------- lore journal ----------
const LORE=[["Rhea's Letter","Kid - if you're reading this, the farm is yours. The soil's better than it looks. Talk to people. Water every sol. And never trust a quiet sandstorm. - Aunt Rhea"],
 ['Colony Charter, p.1','New Cydonia is founded on the principle that no colonist shall go hungry while another has bread. Signed by 41 founders, Sol 1, 2074.'],
 ['Rover Log 17','Battery 12%. Dust devil heading north. Found a strange black stone, very smooth. Logging location for Dr. Ruiz. Returning to dome.'],
 ["Miner's Song",'"Blue for cobalt, red for iron, green for the crystal that sings; / down where the Queen keeps her children, the mountain remembers things."'],
 ['Dr. Ruiz, Note 3','The microfossils are 3.4 billion years old. Mars was alive once. If we do this right, it will be alive again.'],
 ['Torn Postcard','Wish you were here! The sunsets are blue and the gravity makes my knees happy. Love, Mo & Dee.'],
 ['Terraforming Memo','Stage 1 lichen, Stage 2 atmosphere, Stage 3 ice melt. Estimated time: 300 years. Estimated time with one stubborn farmer: let\'s find out.'],
 ['Obelisk Rubbing','Spirals and dots carved in no known language. The dots match the positions of Phobos and Deimos 10,000 years ago.'],
 ["Zara's Flight Plan",'Route: Cydonia - Valles - Olympus. Purpose: "just to see it". Approved by: nobody. Flown anyway.'],
 ["Rhea's Diary",'Planted the first glowberry today. It glowed. I cried a little. Don\'t tell Mo.'],
 ['Wyrm Sighting','Canyon survey team reports "a sand dune that moved against the wind." Survey suspended. Further visits: at own risk.'],
 ['Time Capsule','To whoever finds this in 2191: we hope the sky is blue for you. We hope you still tell stories about us. - The children of Dome 2']];
function loreFind(force){G.lore=G.lore||{};const un=LORE.map((_,i)=>i).filter(i=>!G.lore[i]);if(!un.length)return false;const i=force!=null?force:un[Math.floor(Math.random()*un.length)];G.lore[i]=1;sfx('craft');toast('Journal: found "'+LORE[i][0]+'" ('+Object.keys(G.lore).length+'/'+LORE.length+')');checkAch();return true}
{const _da=digAt;digAt=function(){const n=ENTS.filter(e=>e.k=='dig').length,r=_da();if(r&&ENTS.filter(e=>e.k=='dig').length<n&&Math.random()<.25)loreFind();return r}}
{const _em=enterMine;enterMine=function(f){_em(f);G.loreM=G.loreM||{};if(f%3==0&&!G.loreM[f]){G.loreM[f]=1;loreFind()}}}
// ---------- storage chests ----------
ITEMS.chest={n:'Storage Chest',v:40,c:'#a86a3a',place:1,d:'Place on the farm. Stores any number of items.'};RECIPES.push({id:'chest',in:{iron:4}});
function chestMenu(k,pg=0){G.chests=G.chests||{};const C=G.chests[k]=G.chests[k]||{},ks=Object.keys(C),per=5,n=Math.max(1,Math.ceil(ks.length/per));pg=(pg+n)%n;const o=[];
 const s=cur();if(s&&!ITEMS[s[0]].tool)o.push({t:'Store held: '+ITEMS[s[0]].n+' x'+s[1],f:()=>{C[s[0]]=(C[s[0]]||0)+s[1];G.inv[G.sel]=null;sfx('menu');chestMenu(k,pg)}});
 o.push({t:'Store all crops, goods & materials',f:()=>{let m=0;G.inv.forEach((q,i)=>{if(q&&!ITEMS[q[0]].tool&&!ITEMS[q[0]].wpn&&!ITEMS[q[0]].seed&&!ITEMS[q[0]].food||q&&ITEMS[q[0]].crop){C[q[0]]=(C[q[0]]||0)+q[1];G.inv[i]=null;m++}});toast(m?'Stored '+m+' stacks':'Nothing to store');sfx('menu');chestMenu(k,pg)}});
 for(const id of ks.slice(pg*per,pg*per+per))o.push({t:'Take '+ITEMS[id].n+' x'+C[id],f:()=>{if(add(id,C[id])){delete C[id];sfx('menu')}chestMenu(k,pg)}});
 if(n>1)o.push({t:'Next page ('+(pg+1)+'/'+n+')',f:()=>chestMenu(k,pg+1)});o.push({t:'Close'});say('Storage Chest',[ks.length+' kinds of items stored.'],o);modal.ch=999}
{const _ng=newGame;newGame=function(){const g=_ng();g.objs['10,5']='chest';return g}}
// ---------- act wrapper: chests & meteorites ----------
{const _a=act;act=function(){if(FISHING||swingT>4)return _a();const s=cur(),[fx,fy]=facingTile(),k=fx+','+fy;
 if(G.zone=='farm'&&G.objs[k]=='chest'){if(s&&s[0]=='hoe'&&Object.keys((G.chests||{})[k]||{}).length){toast('Empty the chest first');sfx('bad');return}if(!(s&&s[0]=='hoe')){chestMenu(k);return}}
 if(G.zone=='farm'&&G.metc&&G.metc[k]){if(s&&s[0]=='pick'){breakMeteor(k);return}toast('Use a pickaxe on the meteorite');sfx('bad');return}
 _a()}}
{const _in=interact;interact=function(){const[fx,fy]=facingTile(),k=fx+','+fy;if(G.zone=='farm'&&G.objs[k]=='chest'&&!nearNPC()){chestMenu(k);return}return _in()}}
// ---------- sleep: weather, flare growth, autosave note ----------
{const _sl=sleep;sleep=function(p){if(G.wx=='flare')for(const k in G.tiles){const t=G.tiles[k];if(t.c&&t.w)t.g++}if(G.wx=='meteor')G.metc={};_sl(p);const w=rollWeather();if(modal){if(w)modal.pages.splice(1,0,w);modal.pages[modal.pages.length-1]+=' (Auto-saved.)'}save(true)}}
let lastSaveHr=-1;
function v7tick(){const hr=Math.floor(G.time/60);if(hr!=lastSaveHr&&!modal){if(lastSaveHr>=0)save(true);lastSaveHr=hr}
 if(G.wx=='flare'&&OUTZ(G.zone)&&tick%70==0)G.o2=Math.max(0,G.o2-1);if(buff('o2')&&OUTZ(G.zone)&&tick%110==0)G.o2=Math.min(100,G.o2+1)}
// ---------- cutscenes: intro & epilogue ----------
let CUT=null;
const INTRO=['2091. Six months out from Earth, the shuttle Perseverance II begins its descent.','Below: Mars. Rust-red, cold, and very, very quiet.','On the Cydonia plain, a ring of domes glitters - New Cydonia, home to 214 colonists.','Your great-aunt Rhea left you her dome farm. Nobody has worked it in a year.','Time to see if anything can still grow out here.'];
const EPI=['The ice melted. The craters filled. For the first time in three billion years, rain fell on Mars.','Lichen became moss. Moss became meadow. Old Mo planted a tree outside the mine and swore at it lovingly every morning.','New Cydonia grew from 214 colonists to two thousand. Every one of them knew your name.','Years later, children would ask how the blue sky began.','And someone would always say: "It started with a farmer who wouldn\'t give up."'];
function playCut(k,lines,done){CUT={k,lines,i:0,t:0,ch:0,done};modal=null;menu=null;firstInput();setMusic(k=='epi'?'credits':'surf')}
function cutNext(){if(!CUT)return;const L=CUT.lines[CUT.i];if(CUT.ch<L.length){CUT.ch=L.length;return}CUT.i++;CUT.ch=0;CUT.t=0;sfx('talk');if(CUT.i>=CUT.lines.length){const d=CUT.done;CUT=null;d&&d()}}
function skipCut(){if(!CUT)return;const d=CUT.done;CUT=null;d&&d()}
function drawCut(){const c=CUT,T0=c.i*240+c.t,ep=c.k=='epi';
 if(!ep){const g=cx.createLinearGradient(0,0,0,H);g.addColorStop(0,'#02010a');g.addColorStop(1,c.i>=2?'#3a0e1a':'#0a0420');cx.fillStyle=g;cx.fillRect(0,0,W,H);stars(90,.05,1,7);
  const mr=c.i<1?40+T0*.06:c.i<2?90+T0*.1:400,my=c.i<2?H+mr*.35-T0*.05:H+330;cx.fillStyle='#b8442a';cx.beginPath();cx.arc(W/2,Math.max(my,H*.55+mr*.5),mr,0,6.3);cx.fill();cx.fillStyle='#d8643a';cx.beginPath();cx.arc(W/2-mr*.2,Math.max(my,H*.55+mr*.5)-mr*.15,mr*.75,0,6.3);cx.fill();
  if(c.i>=2){R(0,H-50,W,50,'#7a2a1a');for(let i=0;i<9;i++){const x=40+i*38,r=10+hash(i,3)%10;cx.fillStyle='#bfe8ff55';cx.beginPath();cx.arc(x,H-50,r,Math.PI,0);cx.fill();cx.strokeStyle='#dff6ff';cx.stroke();if((tick/10+i)%7<5)R(x-2,H-56,2,2,'#ffd27a')}R(0,H-50,W,1,'#c8642a')}
  const sx=W*.3+T0*.12,sy=20+T0*.09;if(sy<H-60){cx.save();cx.translate(sx%W,sy);R(-10,-4,20,8,'#e8e0f0');R(-10,-4,20,2,'#fff');R(6,-3,4,3,'#7cf');R(-14,-2,4,4,'#9aa');R(-12,4,3,2+(tick%4<2?2:0),'#fa4');R(-16,0,3,1,'#ffd27a');cx.restore()}}
 else{const g=cx.createLinearGradient(0,0,0,H);g.addColorStop(0,'#4aa0e8');g.addColorStop(.6,'#bfe4ff');g.addColorStop(1,'#ffe8c0');cx.fillStyle=g;cx.fillRect(0,0,W,H);cx.fillStyle='#fff8d0';cx.beginPath();cx.arc(W-70,40,16,0,6.3);cx.fill();
  for(let i=0;i<4;i++){const x=(i*110+tick*.15)%(W+80)-40;cx.fillStyle='#ffffffcc';cx.beginPath();cx.ellipse(x,30+i*12,26,7,0,0,6.3);cx.fill()}
  R(0,H-70,W,70,'#5aa04a');R(0,H-70,W,2,'#8ad06a');cx.fillStyle='#3a8ad0';cx.beginPath();cx.ellipse(W*.32,H-34,70,14,0,0,6.3);cx.fill();R(W*.32-50,H-38,40,1,'#bfe8ff');
  for(let i=0;i<40;i++){const x=hash(i,9)%W,y=H-66+hash(9,i)%60;if(Math.abs(x-W*.32)<75&&y>H-50)continue;R(x,y,2,2,['#ff6a9a','#ffd23a','#fff'][i%3])}
  for(let i=0;i<6;i++){const x=W*.6+i*24,r=8+i%3*3;cx.fillStyle='#dff6ff88';cx.beginPath();cx.arc(x,H-70,r,Math.PI,0);cx.fill()}
  const tx=60+((tick*.3)%(W-120));R(tx,H-86,3,16,'#6a4a2a');cx.fillStyle='#3a8a3a';cx.beginPath();cx.arc(tx+1,H-90,9,0,6.3);cx.fill()}
 c.t++;c.ch+=TSPD[SET.text][0]*.8;const L=c.lines[c.i]||'';panel(14,H-44,W-28,38,'#000a','#ffd27a');wrapLines(L.slice(0,Math.floor(c.ch)),W-48,8).slice(0,3).forEach((l,i)=>txt(l,24,H-30+i*10,'#fff'));
 panel(W-50,6,44,16,'#0008','#fff6');txt('SKIP ⏭',W-28,17,'#fff',7,'center');txt('tap ▶',W-24,H-10,'#ffd27a',6,'right');if(c.t>320&&c.ch>=L.length)cutNext()}
{const _ss=startSlot;startSlot=function(s){SLOT=s;const fresh=!load();_ss(s);if(fresh){const cm=modal;playCut('intro',INTRO,()=>{modal=cm;loreFind(0)})}}}
{const _cm=custMenu;custMenu=function(after){_cm(()=>{after&&after();if(modal&&modal.name=='Welcome to Farm Mars'){const v=NPCS.find(n=>n.id=='vega');modal.name='Mayor Vega';modal.look=v.look;modal.pages=['Welcome to New Cydonia! I\'m Mayor Vega. Rhea talked about you all the time - she\'d be proud you came.'].concat(modal.pages.slice(1),['Oh - Rhea left a letter for you. I put it in your Journal. Tap MAP to read it.'])}})}}
{const _rc=rollCredits;rollCredits=function(from){if(from=='game'&&G&&G.terra>=3&&!G.epiSeen&&!CUT){playCut('epi',EPI,()=>{G.epiSeen=1;save(true);_rc(from)});return}_rc(from)}}
// ---------- map / journal / settings screen ----------
let MAPV=null;const MCOL={g:'#7a5a3a',p:'#4a3a5a',r:'#a8502e',c:'#7a3a2a',y:'#c86a3a',P:'#3a7ad0',w:'#2a1a2a'},MAPC={};
function openMap(t='map'){MAPV={tab:t,sel:0};menu=null;sfx('menu')}
function mapCanvas(z){const m=z=='mine'?MINE.m:MAPS[z];const key=z+(z=='mine'?G.floor:'')+(z=='surf'?G.terra:'');if(MAPC[key])return MAPC[key];const c=document.createElement('canvas');c.width=m[0].length;c.height=m.length;const q=c.getContext('2d');
 for(let y=0;y<m.length;y++)for(let x=0;x<m[0].length;x++){const t=m[y][x];q.fillStyle='XDMuv'.includes(t)?'#ffd27a':isSolid(z,t)?'#1a0f1a':MCOL[t]||'#6a4a4a';q.fillRect(x,y,1,1)}return MAPC[key]=c}
const ZLINK=[['mine','Mine',0,0],['surf','Surface',0,1],['valles','Valles Canyon',1,1],['farm','Dome Farm',0,2],['city','New Cydonia',1,2],['home','Habitat',0,3]];
function drawMapV(){panel(10,6,W-20,H-12,'#0a1420f4','#6cf');['map','journal','settings'].forEach((t,i)=>{const a=MAPV.tab==t;panel(18+i*72,12,68,15,a?'#1a3a5a':'#0a1420',a?'#9ef':'#3a5a7a');txt(t.toUpperCase(),52+i*72,23,'#fff',8,'center')});panel(W-38,12,22,15,'#3a1a2a','#f88');txt('X',W-27,23,'#fff',8,'center');
 if(MAPV.tab=='map'){const z=OUTZ(G.zone)||['farm','city'].includes(G.zone)?G.zone:'farm',c=mapCanvas(z),s=Math.min(200/c.width,150/c.height),X=22,Y=34;cx.imageSmoothingEnabled=false;R(X-1,Y-1,c.width*s+2,c.height*s+2,'#6cf');cx.drawImage(c,X,Y,c.width*s,c.height*s);
  if(z==G.zone&&tick%30<20){R(X+G.px/T*s-2,Y+G.py/T*s-2,4,4,'#fff');R(X+G.px/T*s-1,Y+G.py/T*s-1,2,2,'#f44')}
  if(z==G.zone)for(const id in npcRT){const n=npcRT[id];if(n.zone==z)R(X+n.x/T*s-1,Y+n.y/T*s-1,2,2,'#ff6aa8')}if(z=='farm'&&G.metc)for(const k in G.metc){const[a,b]=k.split(',').map(Number);R(X+a*s,Y+b*s,2,2,'#c8b8ff')}
  txt({farm:'Dome Farm',city:'New Cydonia',surf:'Martian Surface',mine:'Mine F'+G.floor,valles:'Valles Canyon'}[z],X,Y+c.height*s+12,'#9ef',8);
  const ox=W-112,oy=48;txt('WORLD',ox+32,oy-8,'#9ef',8,'center');const pos={};for(const[k,n,x,y]of ZLINK)pos[k]=[ox+x*64,oy+y*30];cx.strokeStyle='#6cf8';cx.beginPath();for(const[a,b]of[['farm','city'],['farm','surf'],['surf','mine'],['surf','valles'],['farm','home'],['city','valles']]){cx.moveTo(...pos[a]);cx.lineTo(...pos[b])}cx.stroke();
  for(const[k,n]of ZLINK){const[x,y]=pos[k],here=G.zone==k||(k=='city'&&['cafe','shop','cc'].includes(G.zone));R(x-3,y-3,6,6,here&&tick%30<20?'#fff':'#6cf');txt(n,x,y+11,here?'#fff':'#9ab',6,'center')}
  txt('white: you · pink: colonists',ox+32,oy+112,'#9ab',6,'center');if(G.wx)txt(G.wx=='meteor'?'Meteorites on farm!':'Solar flare today',ox+32,oy+124,'#ffd27a',7,'center')}
 if(MAPV.tab=='journal'){G.lore=G.lore||{};txt('Lore Journal '+Object.keys(G.lore).length+'/'+LORE.length,22,42,'#ffd27a',8);LORE.forEach((l,i)=>{const got=G.lore[i],y=52+i*12,a=MAPV.sel==i;if(a)R(20,y-8,120,11,'#1a3a5a');txt(got?l[0]:'???',24,y,got?(a?'#fff':'#cef'):'#567',7)});
  const L=LORE[MAPV.sel];panel(146,34,W-170,H-52,'#08101a','#3a5a7a');if(G.lore[MAPV.sel]){txt(L[0],154,48,'#ffd27a',8);wrapLines(L[1],W-190,8).slice(0,13).forEach((l,i)=>txt(l,154,62+i*10,'#dfe8f0',8))}else txt('Not found yet. Dig, mine and explore.',154,48,'#789',7)}
 if(MAPV.tab=='settings'){const rows=['Text speed: '+TSPD[SET.text][1],'Button size: '+BSZ[SET.btn][1],'Screen shake: '+(SET.shake?'ON':'OFF'),'Controller: '+(G.pad===0?'OFF':'ON'),'Auto-save: every in-game hour & each morning'];rows.forEach((r,i)=>{const a=MAPV.sel==i;panel(60,40+i*22,W-120,18,a?'#1a3a5a':'#0a1420',a?'#9ef':'#3a5a7a');txt(r,W/2,52+i*22,i==4?'#9ab':'#fff',8,'center')});txt('Tap a row (or ENTER) to change. Settings apply to all save slots.',W/2,H-18,'#9ab',7,'center')}}
function setRow(i){if(i==0)SET.text=(SET.text+1)%TSPD.length;if(i==1)SET.btn=(SET.btn+1)%BSZ.length;if(i==2)SET.shake=SET.shake?0:1;if(i==3)G.pad=G.pad===0?1:0;saveSet();sfx('menu')}
function mapTap(x,y){if(x>W-40&&y<30){MAPV=null;sfx('menu');return}if(y>=12&&y<28&&x>=18&&x<18+216){MAPV.tab=['map','journal','settings'][Math.floor((x-18)/72)];MAPV.sel=0;sfx('menu');return}
 if(MAPV.tab=='journal'&&x<140){const i=Math.floor((y-44)/12);if(i>=0&&i<LORE.length){MAPV.sel=i;sfx('menu')}}if(MAPV.tab=='settings'&&x>60&&x<W-60){const i=Math.floor((y-40)/22);if(i>=0&&i<4){MAPV.sel=i;setRow(i)}}}
{const _ot=onTap;onTap=function(x,y){if(CUT){if(x>W-56&&y<26)skipCut();else cutNext();return true}if(MAPV){mapTap(x,y);return true}if(!TITLE&&!modal&&!menu&&!CRED&&x>W-96&&x<W-69&&y<22){openMap();return true}return _ot(x,y)}}
addEventListener('keydown',e=>{const k=e.key.toLowerCase();if(CUT){e.stopImmediatePropagation();if(k=='s'||k=='escape')skipCut();else if([' ','enter','e','j'].includes(k))cutNext();return}
 if(MAPV){e.stopImmediatePropagation();e.preventDefault&&e.preventDefault();const tabs=['map','journal','settings'],n=MAPV.tab=='journal'?LORE.length:4;if(k=='n'||k=='escape'||k=='m')MAPV=null;else if(k=='q'||k=='arrowleft')MAPV.tab=tabs[(tabs.indexOf(MAPV.tab)+2)%3],MAPV.sel=0;else if(k=='e'||k=='arrowright'||k=='tab')MAPV.tab=tabs[(tabs.indexOf(MAPV.tab)+1)%3],MAPV.sel=0;else if(k=='arrowup'||k=='w')MAPV.sel=(MAPV.sel+n-1)%n;else if(k=='arrowdown'||k=='s')MAPV.sel=(MAPV.sel+1)%n;else if((k==' '||k=='enter')&&MAPV.tab=='settings')setRow(MAPV.sel);return}
 if(k=='n'&&!TITLE&&!modal&&!menu&&!CRED){e.stopImmediatePropagation();openMap()}},true);
PADMAP[8]='n';
// ---------- animated title ----------
const _dtOrig=drawTitle;
drawTitle=function(){const t=tick,g=cx.createLinearGradient(0,0,0,H);g.addColorStop(0,'#05021a');g.addColorStop(.45,'#2a0c30');g.addColorStop(.75,'#8a2a2a');g.addColorStop(1,'#d8642a');cx.fillStyle=g;cx.fillRect(0,0,W,H);stars(80,.03,1,3);
 const px_=(t*.25)%(W+60)-30;cx.fillStyle='#c8b8a8';cx.beginPath();cx.arc(px_,26+Math.sin(t/200)*4,4,0,6.3);cx.fill();cx.fillStyle='#d8643a';cx.beginPath();cx.arc(W-56,44,22,0,6.3);cx.fill();cx.fillStyle='#f0904a';cx.beginPath();cx.arc(W-61,39,13,0,6.3);cx.fill();
 const ridge=(off,amp,base,col,sp)=>{cx.fillStyle=col;cx.beginPath();cx.moveTo(0,H);for(let x=0;x<=W;x+=8){const u=x+t*sp+off;cx.lineTo(x,base-Math.abs(Math.sin(u/60))*amp-Math.sin(u/23)*amp*.3)}cx.lineTo(W,H);cx.fill()};
 ridge(0,26,H-62,'#5a1a2a',.05);cx.fillStyle='#4a1424';cx.beginPath();cx.moveTo(30,H-60);cx.lineTo(110,H-104);cx.lineTo(190,H-60);cx.fill();R(96,H-104,28,3,'#7a2a3a');ridge(200,16,H-42,'#7a2a22',.12);
 for(let i=0;i<7;i++){const x=W-150+i*20,r=6+hash(i,5)%6;cx.fillStyle='#bfe8ff44';cx.beginPath();cx.arc(x,H-40,r,Math.PI,0);cx.fill();if((t/12+i)%5<3.5)R(x-1,H-44,2,2,'#ffd27a')}
 ridge(400,8,H-24,'#9a3a22',.3);for(let i=0;i<12;i++){const x=(hash(i,2)%W+t*(.6+i%3*.3))%(W+40)-20;R(x,H-30-hash(2,i)%40,6+i%3*4,1,'#ffb08a33')}
 const rx=(t*.4)%(W+40)-20;R(rx-6,H-22,12,4,'#e8e0d0');R(rx+2,H-25,4,3,'#7cf');R(rx-5,H-18,3,3,'#222');R(rx+2,H-18,3,3,'#222');
 const by=Math.sin(t/30)*1.5;txt('FARM MARS',W/2+2,42+by+2,'#3a0a1a',30,'center',null);txt('FARM MARS',W/2,42+by,'#ffd27a',30,'center','#8a2a1a');const sw=(t*2)%400-60;cx.save();cx.beginPath();cx.rect(W/2-90,18+by,180,28);cx.clip();cx.fillStyle='#ffffff55';cx.beginPath();cx.moveTo(sw,18);cx.lineTo(sw+10,18);cx.lineTo(sw-4,50);cx.lineTo(sw-14,50);cx.fill();cx.restore();
 R(W/2-60,48+by,120,1,'#ff6aa8');txt('a colony farming life',W/2,59,'#f8c',8,'center');
 for(let i=0;i<3;i++){const[a,b,w,h]=TSL(i),o=slotInfo(i+1);panel(a,b,w,h,'#140a1ccc',o?'#ffb050':'#6a4a8a');txt('SLOT '+(i+1),a+8,b+16,'#ffd27a',8);
  txt(o?(o.v1?'v1 save - Sol '+o.day:'Sol '+o.day+' · '+season(o.day)+' · Y'+(1+Math.floor((o.day-1)/(SOLS_PER_SEASON*4)))+' · '+o.money+'cr'+(o.spouse?' · ♥':'')):'Empty - tap to start a new farm',a+w-8,b+16,o?'#fff':'#aaa',8,'right')}
 panel(W/2+76,H-28,70,18,'#1a0a24','#ff6aa8');txt('CREDITS',W/2+111,H-16,'#fff',8,'center');panel(W/2-70,H-28,140,18,'#1a0a24','#ffb050');txt((isFS()?'EXIT ':'')+'FULLSCREEN',W/2,H-16,'#fff',8,'center');txt('Created by Gavenecko',8,H-8,'#fff8',6)};
// ---------- update / draw hooks ----------
{const _u=update;update=function(){if(CUT||MAPV){tick++;padPoll();return}const sp=buff('speed')&&!modal&&!menu,x0=G.px,y0=G.py;if(modal&&modal.ch<modal.pages[modal.pi].length)modal.ch+=TSPD[SET.text][0]-1.5;_u();
 if(!TITLE&&!CRED){if(sp&&(G.px!=x0||G.py!=y0)){const nx=G.px+(G.px-x0)*.35,ny=G.py+(G.py-y0)*.35;if(feetFree(nx,ny)){G.px=nx;G.py=ny}}v7tick()}}}
{const _d=draw;draw=function(){if(CUT){drawCut();return}_d();if(TITLE||CRED)return;if(!modal&&!menu&&!MAPV){panel(W-96,3,27,19,'#0a1420','#6cf');txt('MAP',W-82.5,16,'#cef',7,'center')}
 if(G.buff&&buff(G.buff.k)&&!MAPV){const b=BUFFS[G.buff.k],m=G.buff.until-G.time;txt(b[0]+' '+Math.floor(m/60)+':'+String(m%60).padStart(2,'0'),W-100,32,b[1],7,'right')}
 if(G.wx=='flare'&&(OUTZ(G.zone)||G.zone=='farm')){cx.fillStyle=`rgba(255,220,120,${.05+Math.sin(tick/20)*.03})`;cx.fillRect(0,0,W,H)}if(MAPV)drawMapV()}}
{const _ds=drawStructures;drawStructures=function(ox,oy,D){_ds(ox,oy,D);if(G.zone=='farm'&&G.metc)for(const k in G.metc){const[x,y]=k.split(',').map(Number),X=x*T-ox,Y=y*T-oy;D.push([Y+12,()=>{R(X+1,Y+9,14,5,'#3a1a10');R(X+2,Y+10,12,3,'#1a0a08');ob(cx,X+4,Y+3,8,8,'#5a4a7a');R(X+5,Y+4,3,2,'#c8b8ff');if(tick%50<25)R(X+9,Y+6,1,1,'#fff');if(tick%8<4)R(X+3+tick%10,Y+2,1,1,'#fa4')}]);light(X+8,Y+8,14,'#c8b8ff')}
 if(G.zone=='surf'&&(G.time>=1140||G.time<390)&&tick%300<40){const p=(tick%300)/40;R(40+p*200-ox%40,10+p*40,3,1,'#fff');R(36+p*200-ox%40,9+p*40,4,1,'#fff6')}}}
{const _di=drawIcon;drawIcon=function(g,id,X,Y){if(id=='chest'){px(g,X+1,Y+4,14,11,'#3a1a0a');px(g,X+2,Y+5,12,9,'#a86a3a');px(g,X+2,Y+5,12,3,'#c88a4a');px(g,X+2,Y+8,12,1,'#5a3a1a');px(g,X+7,Y+7,2,3,'#ffd23a');return}
 if(id=='metor'){ob(g,X+3,Y+4,10,9,'#5a4a7a');px(g,X+4,Y+5,3,2,'#c8b8ff');px(g,X+9,Y+9,2,2,'#c8b8ff');return}
 if(RBUFF[id]&&!['stew','salad','pie','grill','omelet','cheese'].includes(id)){const it=ITEMS[id];px(g,X+1,Y+9,14,5,'#1a0f1a');px(g,X+2,Y+10,12,3,'#e8e0f0');px(g,X+4,Y+5,8,6,'#1a0f1a');px(g,X+5,Y+6,6,4,it.c);px(g,X+5,Y+6,3,1,shade(it.c,.5));px(g,X+12,Y+3,3,3,BUFFS[RBUFF[id]][1]);return}_di(g,id,X,Y)}}
ACH.push(['lore','Historian','Collect all 12 journal notes',g=>Object.keys(g.lore||{}).length>=12],['meteor','Stargazer','Break 5 meteorites',g=>(g.stats.meteor||0)>=5],['chef2','Master Chef','Cook all 15 recipes',g=>RECIPES.filter(r=>r.cook).every(r=>(g.cooked||{})[r.id])]);
window.FM7={get CUT(){return CUT},get MAPV(){return MAPV},openMap,mapTap,cutNext,skipCut,playCut,INTRO,EPI,LORE,loreFind,rollWeather,breakMeteor,chestMenu,recipeBook,buff,BUFFS,RBUFF,SET,setRow,applyBtn,NEWC,drawMapV};
