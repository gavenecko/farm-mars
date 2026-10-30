// Farm Mars v19 - Starfall Night festival + Star Catcher minigame, Stardust exchange, telescope constellation journal, illustrated event CGs
(()=>{
// ---------- illustrated event CGs (lazy-loaded HTML overlay) ----------
const CGI={},CGF={};let cgEl=null,cgCap=null,cgImg=null,CG=null;
function cgLoad(k){if(CGI[k]||CGF[k])return CGI[k];const im=new Image();im.decoding='async';im.onload=()=>{im._ok=1};im.onerror=()=>{CGF[k]=1};im.src='assets/cg/'+k+'.webp?v=19';CGI[k]=im;return im}
function cgEnsure(){if(cgEl)return;cgEl=document.createElement('div');cgEl.id='cgov';cgEl.style.cssText='position:fixed;display:none;pointer-events:none;z-index:6;overflow:hidden;background:#000;opacity:0;transition:opacity .5s';
 cgImg=document.createElement('img');cgImg.style.cssText='width:100%;height:100%;object-fit:cover;display:block';cgEl.appendChild(cgImg);
 cgCap=document.createElement('div');cgCap.style.cssText='position:absolute;left:0;right:0;bottom:0;padding:1.2% 3% 2.2%;background:linear-gradient(transparent,rgba(10,4,20,.82) 30%);color:#fff;font:600 2.6vmin/1.35 system-ui,sans-serif;text-shadow:0 1px 3px #000';cgEl.appendChild(cgCap);document.body.appendChild(cgEl)}
// show a CG with dialogue pages; `next` modal (if any) is restored afterwards
function showCG(k,name,pages,next){cgLoad(k);say(name,pages);CG={k,m:modal,next:next||null,t:0};G.cgSeen=G.cgSeen||{};G.cgSeen[k]=1}
function cgFrame(){if(!CG)return false;if(modal!==CG.m){const n=CG.next;CG=null;if(n&&!modal)modal=n;return false}
 const im=CGI[CG.k];if(!im||!im._ok)return false;cgEnsure();const c=document.getElementById('c'),r=c.getBoundingClientRect();
 Object.assign(cgEl.style,{left:r.left+'px',top:r.top+'px',width:r.width+'px',height:r.height+'px',display:'block'});if(cgImg.src!==im.src)cgImg.src=im.src;
 CG.t++;if(CG.t>1)cgEl.style.opacity='1';const m=modal,pg=m.pages[m.pi]||'';const nm=m.name?'<b style="color:#ffb0d8">'+m.name+'</b><br>':'';
 const h=nm+pg.slice(0,m.ch).replace(/\$[a-z]/g,'').replace(/[&<]/g,s=>s=='&'?'&amp;':'&lt;')+(m.ch>=pg.length?' <span style="color:#ffd23a">▼</span>':'');if(cgCap.innerHTML!==h)cgCap.innerHTML=h;return true}
function cgHide(){if(cgEl&&cgEl.style.display!='none'){cgEl.style.display='none';cgEl.style.opacity='0'}}
{const _d=draw;draw=function(){
  if(modal&&!CG&&modal.name=='Wedding'&&G&&G.spouse&&!modal._cg&&['ava','kai','zara','theo'].includes(G.spouse)){modal._cg=1;CG={k:'wed_'+G.spouse,m:modal,t:0};cgLoad(CG.k);G.cgSeen=G.cgSeen||{};G.cgSeen[CG.k]=1}
  _d.apply(this,arguments);if(!(G&&!TITLE&&cgFrame()))cgHide();else if(window.FM15)FM15.hide()}}
// Colony Day: the fireworks CG closes the year-end cutscene
{const _pc=playCut;playCut=function(k,lines,done){if(k=='colony'){const d=done;done=()=>{d&&d();const back=modal;modal=null;showCG('colony','Colony Day',['Fireworks bloom over the dome - red, gold, green and blue. For a moment the whole colony is quiet, faces turned up to the sky.','Ava, Kai, Zara and Theo stand beside you in the crowd. This is home now.'],back)}}return _pc(k,lines,done)}}

// ---------- items, letters, achievements ----------
Object.assign(ITEMS,{startonic:{n:'Starlight Tonic',v:120,c:'#bde8ff',food:150,d:'Fizzy, faintly glowing. Brewed from Starfall stardust.'},
 meteorite:{n:'Meteorite',v:650,c:'#8a6a7a',d:'An iron-nickel chunk that fell during Starfall Night. Collectors pay well.'}});
FURN.comet={n:'Comet Mobile',p:0,x:9,y:0,fest:1};
ACH.push(['starcatch','Star Catcher','Score 40+ in Star Catcher',g=>(g.scHi||0)>=40],['astro','Astronomer','Chart all 12 Martian constellations',g=>Object.keys(g.stars||{}).length>=12]);
if(typeof LETTERS!='undefined')LETTERS.push(['starfall','Theo','Starfall Night',"On the 4th sol of every season, Mars drifts through a comet trail. From 19:00 we gather at the plaza fountain to play Star Catcher and watch the sky. Bring someone special. Tip: a Telescope in your habitat lets you chart constellations on clear nights.",g=>g.day>=2,['startonic',1]]);

// ---------- Starfall Night ----------
const isSF=()=>G&&solOfSeason()==4&&G.time>=19*60;
window.isStarfall=isSF;
function sfMenu(){G.dust=G.dust||0;const o=[{t:'Play Star Catcher (free)',f:scStart},{t:'Stardust Exchange ('+G.dust+' dust)',f:dustMenu}];
 if(G.sfDate!=G.day)o.push({t:'Watch the meteors with...',f:dateMenu});o.push({t:'Leave'});
 say('Starfall Night',"The plaza lights are dimmed. Above the dome, meteors streak across the sky. Best Star Catcher score: "+(G.scHi||0)+'.',o)}
function dustMenu(){const S=[['Starlight Tonic',5,()=>add('startonic')],['Meteorite',12,()=>add('meteorite')],['Comet Mobile (decor)',20,()=>{G.decor=G.decor||{};if(G.decor.comet){toast('Already hanging at home');return false}G.decor.comet=1;checkAch();toast('Comet Mobile hung in your habitat')}]];
 say('Stardust Exchange','You have '+(G.dust||0)+' stardust.',S.map(([n,c,f])=>({t:n+' - '+c+' dust',f:()=>{if((G.dust||0)<c){toast('Not enough stardust');sfx('bad')}else if(f()!==false){G.dust-=c;sfx('coin')}dustMenu()}})).concat([{t:'Back',f:sfMenu}]))}
function dateMenu(){const c=NPCS.filter(n=>G.spouse==n.id||(G.hearts[n.id]||0)>=4);
 if(!c.length){say('Starfall Night','You watch the meteors alone. Maybe next season you will have someone to share them with (4+ hearts).');G.sfDate=G.day;return}
 say('Starfall Night','Who will you watch the sky with?',c.slice(0,5).map(n=>({t:n.n+(G.spouse==n.id?' ♥':''),f:()=>{G.sfDate=G.day;addHearts(n,1);sfx('heart');G.stats.sfDates=(G.stats.sfDates||0)+1;
  const L={ava:"Ava: \"Every streak up there is a rock that never made it to the ground. Lucky us - we did.\"",kai:"Kai: \"I closed the bar early for this. Don't tell anyone. ...Okay, tell everyone, I don't care.\"",zara:"Zara: \"I've flown through those trails. It's prettier from down here - with you.\"",theo:"Theo: \"Comet 2081-Ares. Debris at seventy km per second. ...Sorry. It's also just really, really beautiful.\""}[n.id]||(n.n+': "Make a wish! Quick!"');
  showCG('starfall','Starfall Night',['You climb the ridge outside the dome with '+n.n+' and spread a blanket on the red sand.',L,'Meteors fall until the sky runs out of stars to drop. Your friendship with '+n.n+' grows.'])}})))}
{const _in=interact;interact=function(){if(!nearNPC()&&G.zone=='city'&&isSF()){const[fx,fy]=facingTile();if(tileAt(fx,fy)=='F'){sfMenu();return}}
 if(!nearNPC()&&G.zone=='home'&&G.decor&&G.decor.scope&&Math.hypot(G.px-(10*T+8),G.py-(6*T+8))<28){scopeMenu();return}return _in()}}
{const _a=act;act=function(){if(!SC&&G.zone=='home'&&G.decor&&G.decor.scope&&!nearNPC()&&Math.hypot(G.px-(10*T+8),G.py-(6*T+8))<20){scopeMenu();return}return _a()}}
{const _sl=sleep;sleep=function(p){_sl(p);if(solOfSeason()==4&&modal)modal.pages.splice(modal.pages.length-1,0,'Tonight is STARFALL NIGHT! Meet at the plaza fountain from 19:00 for Star Catcher and meteor watching.')}}

// ---------- Star Catcher minigame ----------
let SC=null;
function scStart(){modal=null;SC={t:0,x:W/2,tx:W/2,k:0,it:[],sc:0,combo:0,stun:0,over:0,dur:1800,fx:[]};sfx('shoot')}
function scStep(){const s=SC;if(s.over){s.over++;return}s.t++;if(s.k)s.tx=s.x+s.k*24;s.x+=Math.max(-4.6,Math.min(4.6,s.tx-s.x))*(s.stun?0.3:1);s.x=Math.max(78,Math.min(W-78,s.x));if(s.stun)s.stun--;
 const lv=s.t/s.dur,rate=Math.max(10,26-lv*16);if(s.t%Math.round(rate)==0){const r=Math.random();s.it.push({x:80+Math.random()*(W-160),y:22,v:.9+lv*1.3+Math.random()*.5,k:r<.1?'gold':r<.33+lv*.12?'rock':'star',w:Math.random()*6.28})}
 for(const i of s.it){i.y+=i.v;i.w+=.1;if(!i.d&&i.y>H-34&&i.y<H-22&&Math.abs(i.x-s.x)<17){i.d=1;if(i.k=='rock'){s.stun=40;s.combo=0;s.sc=Math.max(0,s.sc-3);sfx('bad');s.fx.push({x:i.x,y:i.y,t:0,c:'#f66',s:'-3'})}else{s.combo++;const g=(i.k=='gold'?3:1)+(s.combo>=10?1:0);s.sc+=g;sfx('coin');s.fx.push({x:i.x,y:i.y,t:0,c:i.k=='gold'?'#ffd23a':'#bdf',s:'+'+g})}}else if(!i.d&&i.y>H-20&&i.k!='rock'){i.d=1;s.combo=0}}
 s.it=s.it.filter(i=>!i.d&&i.y<H);for(const f of s.fx)f.t++;s.fx=s.fx.filter(f=>f.t<30);
 if(s.t>=s.dur){s.over=1;const d=s.sc;G.dust=(G.dust||0)+d;G.scHi=Math.max(G.scHi||0,s.sc);G.stats.scPlays=(G.stats.scPlays||0)+1;let bonus='';
  if(s.sc>=40){G.scPrize=G.scPrize||{};const y=year()+'-'+seasonIdx();if(!G.scPrize[y]){G.scPrize[y]=1;add('meteorite');bonus=' +Meteorite!'}}s.msg=d+' stardust'+bonus;checkAch();sfx('wed')}}
function drawSC(){const s=SC;panel(64,10,W-128,H-18,'#060318','#8ad0ff');
 for(let i=0;i<40;i++){const x=68+hash(i,9)%(W-136),y=14+(hash(9,i)%(H-30)+s.t*(.05+i%3*.03))%(H-30);R(x,y,1,1,i%5?'#fff6':'#bdf')}
 if(s.t%90<40){const p=(s.t%90)/40;cx.globalAlpha=1-p;R(90+p*180,20+p*40,10,1,'#fff');R(86+p*180,19+p*40,4,1,'#bdf8');cx.globalAlpha=1}
 for(const i of s.it){if(i.k=='rock'){R(i.x-4,i.y-4,8,8,'#6a3a2a');R(i.x-3,i.y-3,3,2,'#9a5a3a');R(i.x-4,i.y-12,8,7,'#ff6a2a55');light&&light(i.x,i.y,10,'#f84')}
  else{const c=i.k=='gold'?'#ffd23a':'#cfeaff',a=Math.sin(i.w)>0?1:0;R(i.x-1,i.y-4,2,8,c);R(i.x-4,i.y-1,8,2,c);if(a){R(i.x-3,i.y-3,1,1,c);R(i.x+2,i.y+2,1,1,c)}R(i.x-1,i.y-1,2,2,'#fff');light&&light(i.x,i.y,12,c)}}
 const bx=Math.round(s.x),by=H-30;R(bx-14,by,28,3,s.stun&&s.t%6<3?'#f66':'#ffb0d8');R(bx-14,by+3,2,6,'#c87aa8');R(bx+12,by+3,2,6,'#c87aa8');R(bx-12,by+8,24,2,'#c87aa8');R(bx-12,by+3,24,5,'#2a1a40');
 for(const f of s.fx)txt(f.s,f.x,f.y-f.t*.6,f.c,7,'center');
 txt('STAR CATCHER',W/2,24,'#bdf',8,'center');txt('Score '+s.sc+(s.combo>=10?'  COMBO x'+s.combo:''),72,24,'#fff',6);txt(Math.max(0,Math.ceil((s.dur-s.t)/60))+'s',W-72,24,'#ffd23a',6,'right');
 if(s.t<150&&!s.over)txt('Catch stars (gold = 3), dodge meteors!  ←/→ or tap',W/2,H/2,'#fff',6,'center');
 if(s.over){panel(W/2-80,H/2-24,160,46,'#140a1cf0','#ffd23a');txt('TIME! Score '+s.sc,W/2,H/2-8,'#ffd23a',8,'center');txt(s.msg||'',W/2,H/2+4,'#bdf',6,'center');if(s.over>40)txt('tap / ENTER to continue',W/2,H/2+15,'#aaa',5,'center')}}
function scEnd(){SC=null;sfMenu()}
{const _u=update;update=function(){if(SC){tick++;if(typeof padPoll=='function')padPoll();scStep();return}return _u()}}
{const _d=draw;draw=function(){_d.apply(this,arguments);if(SC&&G&&!TITLE)drawSC();else if(G&&!TITLE&&!CUT&&!SC&&isSF()&&['city','farm','surf'].includes(G.zone))meteors()}}
{const _ot=onTap;onTap=function(x,y){if(SC){if(SC.over>40)scEnd();else if(!SC.over)SC.tx=x;return true}return _ot(x,y)}}
addEventListener('keydown',e=>{if(!SC)return;e.stopImmediatePropagation();const k=e.key.toLowerCase();if(SC.over>40&&[' ','enter','e','escape'].includes(k)){scEnd();return}if(k=='arrowleft'||k=='a')SC.k=-1;if(k=='arrowright'||k=='d')SC.k=1},true);
addEventListener('keyup',e=>{if(!SC)return;const k=e.key.toLowerCase();if(['arrowleft','a','arrowright','d'].includes(k))SC.k=0},true);
function meteors(){for(let i=0;i<4;i++){const p=((tick+i*53)%140)/60;if(p>1)continue;const x0=40+hash(i,Math.floor((tick+i*53)/140))%(W-80),y0=6+i*9;cx.globalAlpha=1-p;for(let j=0;j<10;j++)R(x0+p*70-j*2,y0+p*30-j,2,1,j?'#bdf':'#fff');cx.globalAlpha=1}}

// ---------- telescope: constellation journal ----------
const CONS=[['The Rover','Six wheels and a dust plume. Every colony kid finds it first.'],['Olympus','A giant volcano drawn in nine stars - the tallest on any world.'],['The Lantern','Ice Lantern Night wishes are said to rise here.'],['Deimos Hound','A loyal dog chasing the little moon around the sky.'],['The Aunt','Your aunt named this one. Its brightest star is a seed.'],['Valles Wyrm','A long, coiling worm of faint red stars.'],['The Shuttle','Zara swears it points toward Earth. It does, sort of.'],['Glowcap','Five blue stars clustered like a mushroom cap.'],['The Miner','Old Mo\'s favourite: a pick raised to strike gold.'],['Earth','Not a constellation - a pale blue dot. Everyone goes quiet.'],['The Founders','Eight stars, one for each of the first colonists.'],['The Farmer','A new one. Theo insists it appeared the year you arrived.']];
window.FM16={CONS,showCG,CGI,cgLoad,sfMenu,dustMenu,scStart,scopeMenu,state:()=>({cg:CG&&CG.k,cgShown:!!cgEl&&cgEl.style.display=='block',sc:SC})};
function scopeMenu(){G.stars=G.stars||{};const n=Object.keys(G.stars).length,night=G.time>=20*60||G.time<5*60;
 const o=[];if(night&&G.wx!='dust'&&G.scopeDay!=G.day&&n<12)o.push({t:'Look through the telescope',f:observe});o.push({t:'Star journal ('+n+'/12)',f:journal},{t:'Leave'});
 say('Telescope',n>=12?'Your star chart is complete. The sky feels like an old friend.':!night?'Too bright. Come back after 20:00.':G.wx=='dust'?'A dust storm hides every star tonight.':G.scopeDay==G.day?'You already charted the sky tonight. Get some sleep.':'Clear skies tonight. You have charted '+n+' of 12 constellations.',o)}
function observe(){const left=CONS.map((c,i)=>i).filter(i=>!G.stars[i]),k=solOfSeason()==4?2:1,got=[];for(let j=0;j<k&&left.length;j++){const i=left.splice(Math.floor(Math.random()*left.length),1)[0];G.stars[i]=G.day;got.push(i)}
 G.scopeDay=G.day;sfx('heart');const pg=got.map(i=>'New constellation: '+CONS[i][0]+'! '+CONS[i][1]);if(k>1)pg.unshift('Meteors streak across the eyepiece - Starfall Night reveals two constellations!');
 if(Object.keys(G.stars).length>=12&&!G.astro){G.astro=1;G.money+=2000;pg.push('Your chart is complete! Theo will want to see this. The Colony Science Fund awards you 2000cr.')}checkAch();say('Telescope',pg)}
function journal(){const n=Object.keys(G.stars||{}).length;say('Star Journal',[n?CONS.map((c,i)=>G.stars[i]?'★ '+c[0]:'☆ ???').join('   '):'No constellations charted yet. Look through the telescope on a clear night (after 20:00).'])}
// home drawing: comet mobile
{const _d=draw;draw=function(){_d.apply(this,arguments);if(!G||TITLE||SC||G.zone!='home'||!G.decor||!G.decor.comet)return;const m=curMap(),mw=m[0].length*T,mh=m.length*T;let ox=Math.round(CAM.x),oy=Math.round(CAM.y);if(mw<W)ox=Math.round((mw-W)/2);if(mh<H)oy=Math.round((mh-H)/2);
 const X=9*T-ox+8,Y=0*T-oy+12,sw=Math.sin(tick/40)*2;R(X,Y-10,1,8,'#888');R(X-8+sw,Y-2,16,1,'#aaa');R(X-9+sw,Y-1,4,4,'#ffd23a');R(X+5+sw,Y-1,3,3,'#bdf');R(X-1+sw,Y+3,3,3,'#ffb0d8');R(X-1+sw,Y+6,1,4,'#ffb0d8aa');if(typeof light=='function')light(X,Y+2,14,'#ffd23a')}}
})();
