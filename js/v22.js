// ===== v25: portrait cosmetics overlay, 10-heart CGs, spouse daily life =====
(function(){
// ---------- illustrated player portrait: hat overlay + outfit tint ----------
const IW=227,IH=256;let OV=null,TL=null,TR=null,lastK='';
function hatArt(g,id){const L=(c,w=3)=>{g.lineWidth=w;g.strokeStyle=c;g.stroke()},F=c=>{g.fillStyle=c;g.fill()},E=(x,y,rx,ry,a0=0,a1=Math.PI*2)=>{g.beginPath();g.ellipse(x,y,rx,ry,0,a0,a1)},P=pts=>{g.beginPath();g.moveTo(...pts[0]);for(const p of pts.slice(1))g.lineTo(...p);g.closePath()};
 switch(id){
 case'straw':E(114,66,108,24);F('#e2c06a');L('#6a4a1a');E(114,62,96,16);F('#ecd080');E(112,40,62,40,Math.PI,0);g.lineTo(174,62);g.lineTo(50,62);F('#e8c870');L('#6a4a1a');g.fillStyle='#c03838';g.fillRect(50,50,124,10);g.strokeStyle='#6a1a1a';g.lineWidth=2;g.strokeRect(50,50,124,10);g.strokeStyle='#b8984a';g.lineWidth=1.5;for(let i=0;i<7;i++){g.beginPath();g.moveTo(60+i*16,10+Math.abs(3-i)*3);g.lineTo(56+i*16,48);g.stroke()}break;
 case'miner':E(112,58,74,56,Math.PI,0);F('#f0c020');L('#5a4000');g.fillStyle='#fff3';g.fillRect(70,14,20,30);P([[34,58],[190,58],[200,70],[24,70]]);F('#b08a10');L('#5a4000');E(112,30,15,15);F('#fffbd0');L('#5a4000');E(112,30,8,8);F('#fff');break;
 case'beanie':P([[40,20],[54,-6],[74,14]]);F('#c8602a');L('#4a2008');P([[150,14],[170,-6],[184,20]]);F('#c8602a');L('#4a2008');P([[50,14],[56,2],[68,13]]);F('#ffd8c0');P([[156,13],[168,2],[174,14]]);F('#ffd8c0');E(112,58,74,54,Math.PI,0);F('#e07a3a');L('#4a2008');g.strokeStyle='#c8602a';g.lineWidth=2;for(let x=50;x<176;x+=10){g.beginPath();g.moveTo(x,30);g.lineTo(x,58);g.stroke()}g.fillStyle='#f6ead8';g.fillRect(38,54,148,16);g.strokeStyle='#4a2008';g.lineWidth=3;g.strokeRect(38,54,148,16);break;
 case'crown':P([[52,66],[52,24],[74,44],[94,10],[112,40],[130,10],[150,44],[172,24],[172,66]]);F('#ffd23a');L('#7a5000');g.fillStyle='#c09010';g.fillRect(52,56,120,10);for(const[x,c]of[[76,'#ff4a8a'],[112,'#22ffee'],[148,'#7a6aff']]){E(x,60,6,5);F(c);L('#7a5000',1.5)}E(94,10,5,5);F('#fff8c0');E(130,10,5,5);F('#fff8c0');break;
 case'goggles':g.fillStyle='#5a3a2a';g.fillRect(28,52,170,12);g.strokeStyle='#2a1a10';g.lineWidth=2;g.strokeRect(28,52,170,12);for(const x of[84,142]){E(x,56,24,20);F('#3a2a20');L('#1a1008');E(x,56,17,14);F('#7ad0ff');E(x-6,51,6,4);F('#ffffffcc')}break;
 case'angler':P([[62,16],[162,16],[176,58],[48,58]]);F('#6a8a5a');L('#2a3a20');E(112,62,92,14);F('#5a7a48');L('#2a3a20');g.fillStyle='#4a6a3a';g.fillRect(56,46,112,8);P([[150,24],[162,34],[150,40]]);F('#e04040');L('#601010',1.5);break;
 case'party':P([[112,-30],[66,64],[158,64]]);F('#ff4aa8');L('#6a0a3a');for(const[x,y,c]of[[100,30,'#ffe060'],[124,44,'#7af'],[110,52,'#fff'],[118,14,'#7f7']]){E(x,y,5,5);F(c)}g.fillStyle='#ffe060';g.fillRect(64,58,96,8);L('#6a0a3a',1);E(112,-26,10,10);F('#fff');break;
 case'circlet':g.beginPath();g.moveTo(34,70);g.quadraticCurveTo(112,40,190,70);g.lineWidth=7;g.strokeStyle='#a0f0ff';g.stroke();g.lineWidth=2;g.strokeStyle='#1a6a7a';g.stroke();P([[112,34],[126,52],[112,66],[98,52]]);F('#22ffee');L('#0a4a50',2);E(108,46,3,3);F('#fff');break}}
function ensureOv(el){if(OV&&OV.parentNode===el)return;OV=document.createElement('canvas');OV.style.cssText='position:absolute;left:0;top:0;width:100%;height:100%;pointer-events:none;z-index:2';
 const mk=cp=>{const d=document.createElement('div');d.style.cssText='position:absolute;left:0;top:0;width:100%;height:100%;pointer-events:none;mix-blend-mode:color;opacity:.8;z-index:1;clip-path:'+cp;return d};
 TL=mk('polygon(0% 68%,26% 62%,36% 80%,40% 100%,0% 100%)');TR=mk('polygon(72% 62%,100% 70%,100% 100%,62% 100%,66% 82%)');el.appendChild(TL);el.appendChild(TR);el.appendChild(OV)}
function portraitOverlay(){const st=window.FM15&&FM15.state();if(!st||!st.el){return}const el=st.el,mine=st.shown&&/\/you_/.test(st.src||'');if(!mine){if(OV)OV.style.display=TL.style.display=TR.style.display='none';lastK='';return}
 ensureOv(el);const c=G&&G.cos||{},hat=PLOOK.hat||'',dy=c.dye_top&&c.dye_top!='teal'?PLOOK.top:'',r=el.getBoundingClientRect(),k=hat+'|'+dy+'|'+Math.round(r.width)+'x'+Math.round(r.height)+'|'+st.src;if(k==lastK)return;lastK=k;
 OV.style.display=hat?'block':'none';TL.style.display=TR.style.display=dy?'block':'none';if(dy){TL.style.background=TR.style.background=dy}
 if(hat){const cw=Math.max(1,Math.round(r.width*2)),ch=Math.max(1,Math.round(r.height*2));OV.width=cw;OV.height=ch;const g=OV.getContext('2d');g.clearRect(0,0,cw,ch);const s=Math.max(cw/IW,ch/IH),ox=(cw-IW*s)*.5,oy=(ch-IH*s)*.08;g.save();g.translate(ox,oy);g.scale(s,s);g.lineJoin='round';hatArt(g,hat);g.restore()}}
{const _d=draw;draw=function(){_d.apply(this,arguments);try{portraitOverlay()}catch(e){}}}
// ---------- 10-heart events with illustrated CGs ----------
const H10={ava:["Ava takes you up the old comms antenna at sunset - the highest point in the colony.","AVA: I come up here when everything's too loud. I've never brought anyone before.","She leans her head on your shoulder. Neither of you says anything for a long, warm while."],
 kai:["Kai locks the cafe door at midnight and hands you an apron.","KAI: Recipe night. Secret family pie. You're family now, so... roll.","Flour everywhere. Laughing until you can't breathe. The pie comes out heart-shaped. Neither of you planned that. Probably."],
 zara:["Zara 'borrows' a shuttle for a low pass over the canyons.","ZARA: Don't tell Vega. Actually - tell everyone. Look at this!","At the top of the climb she reaches over and takes your hand. 'Best co-pilot I've ever had.'"],
 theo:["Theo sets up his grandfather's brass telescope on the observatory roof.","THEO: There's a double star I've never shown anyone. Two suns, orbiting each other for a billion years.","When you look up from the eyepiece, he isn't watching the stars at all."],
 nyx:["Nyx invites you to the big window on Phobos at shift change.","NYX: Tea, low-g style. Don't squeeze the pouch. ...You squeezed the pouch.","You both float there laughing, Mars filling the glass. 'You're my favorite groundling. Don't let it go to your head.'"]};
{const _t=talk;talk=function(n){const h=G.hearts[n.id]||0;if(H10[n.id]&&h>=10&&!G.events[n.id+'h10']&&!modal){G.events[n.id+'h10']=G.day;sfx('heart');addHearts(n,.5);const pg=H10[n.id];if(window.FM16)FM16.showCG('h10_'+n.id,n.n+' ♥ 10 Hearts',pg);else say(n.n+' ♥ 10 Hearts',pg,null,n.look);G.stats.h10=(G.stats.h10||0)+1;checkAch();return}return _t.apply(this,arguments)}}
// Nyx can reach 10 hearts (friendship)
{const _hc=heartsCap;heartsCap=function(n){if(n.id=='nyx')return 10;return _hc(n)}}
// ---------- spouse daily life: farm chores, morning variety, spouse corner ----------
const CORNER={ava:['Workbench','#6a7a8a','#ffd23a'],kai:['Baking nook','#a0703a','#ffe0b0'],zara:['Flight sim rig','#3a2a5a','#c84aff'],theo:['Star-chart desk','#5a4a3a','#9cf']};
const SPC=[1,6];
function chore(){const sp=G.spouse;if(!sp)return null;const r=G.day,k=hash(r,91)%5;
 if(k==0){let n=0;for(const key in G.tiles){const t=G.tiles[key];if(n<6&&t.c&&t.g>=CROPS[t.c].days){const c=t.c;if(add(c)){n++;if(CROPS[c].re)t.g=CROPS[c].days-CROPS[c].re;else{t.c=null;t.g=0}}}}return n?'harvested '+n+' ripe crop'+(n>1?'s':'')+' and left them in your bag':null}
 if(k==1&&G.animals&&G.animals.length){for(const a of G.animals){a.love=Math.min(10,(a.love||0)+1)}return'cuddled every animal in the barn (they look delighted)'}
 if(k==2&&G.fox&&G.fox.ad){G.fox.love=Math.min(10,(G.fox.love||0)+1);return'took Ember for a walk around the dome'}
 if(k==3){G.energy=Math.min(G.maxEn+20,G.energy+20);return'made you a big breakfast (+20 energy)'}
 const tid=Object.keys(G.tiles).filter(q=>G.tiles[q].c&&G.tiles[q].dry>=1);for(const q of tid){G.tiles[q].w=1;G.tiles[q].dry=0}return tid.length?'saved '+tid.length+' thirsty crop'+(tid.length>1?'s':'')+' with an early watering':'fixed the squeaky barn door'}
{const _sl=sleep;sleep=function(p){_sl.apply(this,arguments);if(G.spouse){const sn=NPCS.find(q=>q.id==G.spouse),c=chore();if(c&&modal&&modal.pages){modal.pages.splice(Math.max(1,modal.pages.length-1),0,sn.n+' '+c+'.');G.stats.chores=(G.stats.chores||0)+1}}}}
let CT=0;function spouseFarm(){const sp=G.spouse;if(!sp||G.zone!='farm')return;const r=npcRT[sp];if(!r||r.zone!='farm')return;
 if(r.chore&&(!r.path||!r.path.length)){const t=G.tiles[r.chore];if(t&&t.c&&!t.w){t.w=1;t.dry=0;parts(r.x,r.y-6,'#6cf',8,1);floatTxt(r.x,r.y-24,'*splash*','#9cf')}r.chore=null}
 if(++CT%240)return;if(r.chore)return;let best=null,bd=1e9;for(const k in G.tiles){const t=G.tiles[k];if(!t.c||t.w)continue;const[x,y]=k.split(',').map(Number),d=Math.hypot(x*T+8-r.x,y*T+8-r.y);if(d<bd){bd=d;best=[k,x,y]}}
 if(best&&bd<260){const p=npcPath(Math.floor(r.x/T),Math.floor(r.y/T),best[1],best[2]+1);if(p){r.path=p;r.chore=best[0]}}}
{const _u=update;update=function(){_u.apply(this,arguments);if(!TITLE&&!CRED&&G&&!modal)spouseFarm()}}
{const _dI=drawInterior;drawInterior=function(ox,oy,D,night){_dI(ox,oy,D,night);if(G.zone!='home'||!G.spouse||!CORNER[G.spouse])return;const[n,a,b]=CORNER[G.spouse],X=SPC[0]*T-ox,Y=SPC[1]*T-oy,s=G.spouse;
 D.push([Y+T,()=>{R(X,Y-2,T*2,14,a);R(X,Y-2,T*2,2,shade(a,.3));R(X+2,Y+12,2,4,shade(a,-.4));R(X+T*2-4,Y+12,2,4,shade(a,-.4));
  if(s=='ava'){R(X+4,Y-6,8,4,'#889');R(X+16,Y-8,3,6,b);if(tick%50<6)R(X+18,Y-10,2,2,'#fff')}else if(s=='kai'){ob(cx,X+4,Y-6,10,6,b);R(X+18,Y-6,8,5,'#c86a3a');R(X+20,Y-8,4,2,'#fff8')}
  else if(s=='zara'){R(X+4,Y-10,22,8,'#111');R(X+5,Y-9,20,6,b+'88');R(X+12+Math.round(Math.sin(tick/20)*6),Y-7,2,2,'#fff')}else{R(X+4,Y-6,22,6,'#e8e0c8');R(X+8,Y-5,1,1,'#36c');R(X+14,Y-4,1,1,'#36c');R(X+20,Y-5,1,1,'#36c');R(X+24,Y-12,2,8,'#a08040')}}]);
 if(s=='zara'||s=='ava')light(X+16,Y-4,14,b)}}
// ---------- achievements & debug ----------
ACH.push(['h10','Closest Friends','See a 10-heart event',g=>(g.stats.h10||0)>=1],['chores','Partners','Your spouse helps out 10 times',g=>(g.stats.chores||0)>=10]);
if(window.FM17&&FM17.CGT)Object.assign(FM17.CGT,{h10_ava:'Ava ♥ 10',h10_kai:'Kai ♥ 10',h10_zara:'Zara ♥ 10',h10_theo:'Theo ♥ 10',h10_nyx:'Nyx ♥ 10 (friend)'});
{const _st=FM17.setTab;FM17.setTab=function(t){_st.apply(this,arguments);const bd=document.querySelector('#dbg .bd');if(!bd)return;
 const sec=(title,items)=>{const h=document.createElement('h3');h.textContent=title;const row=document.createElement('div');row.className='row';for(const[l,f]of items){const b=document.createElement('button');b.textContent=l;b.onclick=()=>{f();if(DBG.open)FM17.setTab(t)};row.appendChild(b)}bd.appendChild(h);bd.appendChild(row)};
 if(t=='Events')sec('v25: 10-heart events',Object.keys(H10).map(id=>['10♥ '+id,()=>FM17.replay(()=>{const n=NPCS.find(q=>q.id==id);G.hearts[id]=10;delete G.events[id+'h10'];modal=null;talk(n)})]).concat([['Spouse chore (next morning)',()=>FM17.replay(()=>{if(!G.spouse)G.spouse='ava';sleep()})]]));
 if(t=='Give')sec('v25: Relationships',[...Object.keys(H10).map(id=>['10 hearts: '+id,()=>{G.hearts[id]=10;delete G.events[id+'h10']}]),['Marry Kai (spouse corner)',()=>{G.spouse='kai';G.wedDay=G.day;G.hearts.kai=10}]])}}
window.FM22={hatArt,portraitOverlay,H10,CORNER,chore,spouseFarm,state:()=>({ov:!!OV&&OV.style.display!='none',tint:!!TL&&TL.style.display!='none',k:lastK})};
})();
