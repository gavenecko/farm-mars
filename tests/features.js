// Round 12+ feature tests (museum, dust storms, magma vents, fishing treasure, NPC schedules, tap-to-talk)
module.exports=async({t,ev,page,path,SHOTS})=>{
 await t('NPC schedule spots are walkable',async()=>ev(()=>{const bad=[];for(const n of NPCS)for(const s of n.sched){const[h,z,x,y]=s;if(!MAPS[z]||x==0&&y==0)continue;const tl=MAPS[z][y]&&MAPS[z][y][x];if(tl===undefined||isSolid(z,tl))bad.push(n.id+'@'+z+':'+x+','+y)}
  for(const id in FEST){const[x,y]=FEST[id];if(isSolid('city',MAPS.city[y][x]))bad.push('fest '+id)}const tl=MAPS.museum[4][10];if(isSolid('museum',tl))bad.push('theo museum');if(bad.length)throw new Error(bad.join(' '));return 'ok'}));
 await t('museum: enter, donate, reward, view',async()=>ev(()=>{G.muse={};G.museR={};enter('museum',6,6,0);if(G.zone!='museum')throw new Error('no museum');
  const ids=FM10.MALL.slice(0,5);for(const i of ids)add(i,1);const m0=G.money;G.px=3*T+8;G.py=2*T+8;G.dir=0;interact();if(!modal)throw new Error('menu not opened');modal=null;
  for(const i of ids)FM10.donate(i,0);modal=null;if(FM10.mcount()!=5)throw new Error('count '+FM10.mcount());if(G.money!=m0+300)throw new Error('reward not paid '+(G.money-m0));FM10.museumView();modal=null;
  for(let i=0;i<30;i++){update();draw()}return '5 donated, +300cr'}));
 await t('museum door round trip',async()=>ev(()=>{enter('city',25,12,0);G.py=11*T+10;G.px=25*T+8;triggers();if(G.zone!='museum')throw new Error('door did not open: '+G.zone);G.px=6*T+8;G.py=7*T+6;triggers();if(G.zone!='city')throw new Error('exit '+G.zone);return 'ok'}));
 await t('dust storm: weather, glass + wraiths spawn, O2 drains, wraith fights',async()=>ev(()=>{G.wx='dust';DUSTD=-1;SURF=null;enter('surf',31,40,0);const gl=ENTS.filter(e=>e.t=='sglass').length,wr=ENTS.filter(e=>e.t=='wraith');
  if(gl<3||!wr.length)throw new Error('spawn '+gl+'/'+wr.length);const o=G.o2;for(let i=0;i<400;i++)update();if(!(G.o2<o))throw new Error('o2');
  const w=wr[0];w.x=G.px+60;w.y=G.py;const x0=w.x;for(let i=0;i<30;i++)hostile();if(!(w.x<x0))throw new Error('wraith idle');for(let i=0;i<10;i++){update();draw()}
  const p=ENTS.find(e=>e.t=='sglass');for(let i=ENTS.length-1;i>=0;i--){const e=ENTS[i];if(e!==p&&Math.hypot(e.x-p.x,e.y-p.y)<40)ENTS.splice(i,1)}modal=null;menu=null;G.o2=100;G.hp=100;G.px=p.x;G.py=p.y;G.sel=G.inv.findIndex(q=>!q);if(G.sel<0){G.inv[G.inv.length-1]=null;G.sel=G.inv.length-1}interact();for(const q of ENTS.filter(e=>e.t=='sglass')){if(G.inv.some(q=>q&&q[0]=='sglass'))break;modal=null;G.px=q.x;G.py=q.y;interact()}if(!G.inv.some(q=>q&&q[0]=='sglass'))throw new Error('no glass pickup (zone '+G.zone+', ents '+ENTS.includes(p)+', modal '+(modal&&modal.name)+')');G.wx=null;return gl+' glass, '+wr.length+' wraiths'}));
 await t('magma vents floors 6-10: tiles, embers, walkable spawn, fireballs',async()=>ev(()=>{for(const f of[6,8,10]){enterMine(f);modal=null;if(!MINE.mag)throw new Error('not magma '+f);if(!feetFree(G.px,G.py))throw new Error('spawn '+f);if(!ENTS.some(e=>e.t=='ember'))throw new Error('no embers '+f)}
  enterMine(5);if(MINE.mag)throw new Error('boss floor magma');enterMine(11);modal=null;if(MINE.mag)throw new Error('11 magma');enterMine(7);modal=null;G.hp=100;const e=ENTS.find(e=>e.t=='ember');e.x=G.px+50;e.y=G.py;e.tm=74;PR=[];hostile();if(!PR.length)throw new Error('no fireball');
  for(let i=0;i<20;i++){update();draw()}return 'ok'}));
 await t('fishing: treasure chest + perfect catch',async()=>ev(()=>{enter('farm',13,9,2);FISHING={ph:'bite',t:0};fishAct();const f=FISHING;if(!f||f.ph!='reel')throw new Error('no reel');
  f.tr={p:.5,got:70,done:1};f.miss=0;f.prog=.999;f.bar=Math.max(0,f.fp-.05);const tr0=G.stats.treasure||0;for(let i=0;i<5&&FISHING;i++)updFish();if(FISHING)throw new Error('not caught');
  if((G.stats.treasure||0)!=tr0+1)throw new Error('no treasure');if(!(G.stats.perfect>=1))throw new Error('no perfect');G.wx='dust';let s=0;for(let i=0;i<200;i++)if(pickFish()=='sglf')s++;G.wx=null;if(!s)throw new Error('no glassfish');return 'ok, glassfish '+s+'/200'}));
 await t('NPC dust-storm dialogue + tap-to-talk',async()=>ev(()=>{G.wx='dust';G.talked={};const n=NPCS.find(q=>q.id=='mo');chat(n);const p=modal&&modal.pages.join(' ');modal=null;G.wx=null;if(!p||!p.includes('Storms'))throw new Error('line: '+p);
  enter('city',16,14,0);G.time=8*60;placeNPCs(true);const r=npcRT.mo;G.px=r.x+20;G.py=r.y;draw();const ox=Math.round(CAM.x),oy=Math.round(CAM.y);G.talked={};onTap(r.x-ox,r.y-10-oy);const ok=!!modal;modal=null;if(!ok)throw new Error('tap did not talk');return 'ok'}));
 await t('side quests: unlock at hearts, multi-step delivery, rewards, quest log',async()=>ev(()=>{G.sq={};const q=FM11.SQ[0],n=NPCS.find(x=>x.id==q.npc);G.hearts[n.id]=0;talk(n);modal=null;if(G.sq[q.id]!=null)throw new Error('started while locked');
  G.hearts[n.id]=4;talk(n);modal=null;if(G.sq[q.id]!==0)throw new Error('not started');talk(n);modal=null;if(G.sq[q.id]!==0)throw new Error('advanced without items');
  add('iron',5);talk(n);modal=null;if(G.sq[q.id]!==1)throw new Error('step1');add('crys',2);const m=G.money;talk(n);modal=null;if(G.sq[q.id]!='done')throw new Error('not done');if(G.money!=m+q.r[0])throw new Error('reward');
  FM11.questLog();if(!modal||!modal.pages[0].includes('Done'))throw new Error('log');modal=null;for(const x of FM11.SQ)for(const[s]of x.steps)if(!ITEMS[s])throw new Error('bad item '+s);boardMenu();if(!modal.opts.some(o=>o.t=='Side Quests'))throw new Error('board link');modal=null;
  const q2=FM11.SQ[1];G.hearts[q2.npc]=5;talk(NPCS.find(x=>x.id==q2.npc));modal=null;if(FM11.sqActive()!=q2)throw new Error('tracker');draw();const[rx,ry,rw,rh]=FM11.sqTrackRect();onTap(rx+10,ry+10);if(!modal||!modal.pages[0].includes(q2.t))throw new Error('tracker tap');modal=null;return 'ok'}));
 await t('homes: 8 doors open, spawns walkable, exits back, reachable sit spots',async()=>ev(()=>{const H=Object.fromEntries(Object.entries(FM12.HOMES).filter(([,h])=>!h.orbital)),out=[];if(Object.keys(H).length<8)throw new Error('homes '+Object.keys(H).length);
  for(const id in H){const h=H[id],z=FM12.HOMEZ(id);if(!NPCS.find(n=>n.id==id))throw new Error('no npc '+id);G.time=600;G.hearts[id]=0;
   if(MAPS.city[h.door[1]][h.door[0]]!='D')throw new Error('door tile '+id);if(isSolid('city',MAPS.city[h.out[1]][h.out[0]]))throw new Error('out solid '+id);
   enter('city',h.out[0],h.out[1],0);G.px=h.door[0]*T+8;G.py=h.door[1]*T+10;triggers();if(G.zone!=z)throw new Error('enter '+id+' -> '+G.zone);if(!feetFree(G.px,G.py))throw new Error('spawn '+id);
   const m=MAPS[z],seen={},q=[[5,6]];seen['5,6']=1;while(q.length){const[x,y]=q.shift();for(const[dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]]){const a=x+dx,b=y+dy;if(!m[b]||m[b][a]==null||seen[a+','+b]||isSolid(z,m[b][a]))continue;seen[a+','+b]=1;q.push([a,b])}}
   if(!seen[h.sit[0]+','+h.sit[1]])throw new Error('sit unreachable '+id);if(!seen['5,7'])throw new Error('door unreachable '+id);
   for(let i=0;i<3;i++){update();draw()}G.px=5*T+8;G.py=7*T+6;triggers();if(G.zone!='city')throw new Error('exit '+id);if(Math.floor(G.px/T)!=h.out[0]||Math.floor(G.py/T)!=h.out[1])throw new Error('exit pos '+id);out.push(id)}
  return out.length+' homes ok'}));
 await t('homes: locked late at night unless 6+ hearts; residents home on schedule',async()=>ev(()=>{const h=FM12.HOMES.kai;G.spouse=null;G.time=23*60;G.hearts.kai=0;enter('city',h.out[0],h.out[1],0);G.px=h.door[0]*T+8;G.py=h.door[1]*T+10;triggers();if(G.zone!='city')throw new Error('not locked');
  G.hearts.kai=6;G.px=h.door[0]*T+8;G.py=h.door[1]*T+10;triggers();if(G.zone!='h_kai')throw new Error('6 hearts locked');
  const bad=[];for(const tm of[6*60+30,23*60]){G.time=tm;placeNPCs(true);for(const id in FM12.HOMES){if(FM12.HOMES[id].orbital)continue;if(npcRT[id].zone!='h_'+id)bad.push(id+'@'+tm+'='+npcRT[id].zone)}}
  G.time=12*60;placeNPCs(true);const away=Object.keys(FM12.HOMES).filter(id=>!FM12.HOMES[id].orbital&&npcRT[id].zone.startsWith('h_'));if(bad.length)throw new Error(bad.join(' '));enter('city',16,14,0);return 'ok, at noon home: '+(away.join(',')||'none')}));
 await t('homes: home dialogue, heart event, readable item, gifting at home',async()=>ev(()=>{G.events={theo3:1,theo4:1,theo6:1,theo7:1,theo9:1};const n=NPCS.find(q=>q.id=='theo');G.time=23*60;G.hearts.theo=2;enter('h_theo',5,6,0);placeNPCs(true);G.talked={};talk(n);
  FM13.mnorm(modal);if(!modal||!FM12.HOMES.theo.home.map(s=>s.replace(/ \$[a-z]$/,'')).includes(modal.pages[0]))throw new Error('no home line');modal=null;G.hearts.theo=5;G.talked={};const h0=G.hearts.theo;talk(n);if(!modal||!modal.name.includes('Heart Event'))throw new Error('no event');modal=null;if(!(G.hearts.theo>h0))throw new Error('event hearts');
  const f=FM12.HOMES.theo.f.find(f=>f[0]=='starmap');G.px=f[1]*T+8;G.py=1*T+8;G.dir=0;interact();if(!modal||!modal.pages[0].includes('star chart'))throw new Error('read: '+(modal&&modal.pages[0]));modal=null;
  G.gifted={};const i=G.inv.findIndex(q=>!q);G.inv[i]=['crys',1];G.sel=i;G.talked={};modal=null;npcRT.theo.path=null;const hb=G.hearts.theo;G.px=npcRT.theo.x+14;G.py=npcRT.theo.y;talk(n);let go=modal&&modal.opts&&modal.opts.find(o=>o.t.startsWith('Give'));if(!go){const why=modal&&(modal.name+': '+String(modal.pages&&modal.pages[0]).slice(0,40));modal=null;G.talked={};talk(n);go=modal&&modal.opts&&modal.opts.find(o=>o.t.startsWith('Give'));if(!go)throw new Error('no give option ('+why+')')}modal=null;go.f();modal=null;const gave=!G.inv[i]||G.hearts.theo!=hb;G.inv[i]=null;if(!gave)throw new Error('gift failed');enter('city',16,14,0);return 'ok'}));
 await t('character sprites: player/NPC/kid 4 dirs x 4 frames + portraits render, outlined, no errors',async()=>ev(()=>{const _ill=window.FM24&&FM24.ILL.on;if(window.FM24)FM24.ILL.on=false;const looks=[PLOOK,...NPCS.map(n=>n.look),{skin:'#e8b48a',hair:'#ff4aa8',style:'bob',top:'#ffd27a',pants:'#5a8ac8'}];let n=0;
  const c=document.createElement('canvas');c.width=24;c.height=30;const g=c.getContext('2d');for(const L of looks)for(let d=0;d<4;d++)for(let f=0;f<4;f++)for(const o of[{},{suit:1},{swing:1}]){g.clearRect(0,0,24,30);drawChar(g,4,3,L,d,f,o);n++;
   const a=g.getImageData(0,0,24,30).data;let op=0,ol=0;for(let i=0;i<a.length;i+=4){if(a[i+3]==255)op++;if(a[i+3]>200&&a[i]+a[i+1]+a[i+2]<240)ol++}if(op<80||ol<8)throw new Error('sprite '+JSON.stringify(L)+' d'+d+' f'+f+' '+op+'/'+ol)}
  const s=FM12.charSprite(NPCS[0].look,1,0),s2=FM12.charSprite(NPCS[0].look,1,1);if(s.toDataURL()==s2.toDataURL())throw new Error('walk frames identical');
  for(const L of looks)for(const m of['','happy','love','angry','sad'])drawPortrait(cx,10,10,L,3,m,false),drawPortrait(cx,10,10,L,2,m,true);if(window.FM24)FM24.ILL.on=_ill;return n+' sprites, '+FM12.CC.size+' cached'}));
 await t('dialogue box: renders framed panel, typewriter, tap finishes then advances, choices by touch',async()=>ev(()=>{const n=NPCS[0];let picked=0;say(n.n,['Hello there, this is a fairly long first line that types out. $h','Second page. $t'],[{t:'Yes',f:()=>{picked=1}},{t:'No'}],n.look);
  for(let i=0;i<4;i++)update();if(!(modal.ch>0&&modal.ch<modal.pages[0].length))throw new Error('not typing '+modal.ch);draw();
  const[x,y,w,h]=FM13.dbRect(),d=cx.getImageData(x+2,y+20,1,1).data;if(d[0]<150)throw new Error('frame not drawn '+d.join(','));
  onTap(100,y+30);if(modal.ch<modal.pages[0].length)throw new Error('tap did not finish');if(modal.pi!=0)throw new Error('advanced too early');onTap(100,y+30);if(modal.pi!=1)throw new Error('no advance');
  onTap(100,y+30);draw();const r=optRect(0);if(r[1]<0||r[1]+r[3]>H)throw new Error('opt rect '+r);onTap(r[0]+10,r[1]+r[3]/2);if(!picked||modal)throw new Error('choice not picked');
  say('Sign','A readable sign without a portrait.');modal.ch=999;draw();modal=null;FM10&&FM10.museumView&&(FM10.museumView(),modal.ch=1e4,draw());modal=null;
  shopMenu&&shopMenu();if(modal){modal.ch=1e4;draw();const k=modal.opts.length-1,rr=optRect(k);if(rr[1]<0)throw new Error('long menu offscreen');modal=null}return 'ok'}));
 await t('emotion tags switch portrait mood per line; data is tagged',async()=>ev(()=>{const n=NPCS.find(q=>q.id=='kai');say(n.n,['Great to see you! $h','Ugh, not again. $a','Hmm, I wonder... $t','I miss Earth. $s','For you? $l','Plain line.'],null,n.look);
  FM13.mnorm(modal);const got=[];for(let i=0;i<6;i++){modal.pi=i;got.push(FM13.curMood(modal))}modal=null;const want=['happy','angry','think','sad','love',''];if(got.join()!=want.join())throw new Error(got.join());
  if(modal==null&&FM13.bust2(n.look,'happy',0,0).toDataURL()==FM13.bust2(n.look,'angry',0,0).toDataURL())throw new Error('moods identical');
  let tagged=0,total=0;for(const q of NPCS){for(const t of q.lines)for(const l of t){total++;if(/\$[nhsalt]/.test(l))tagged++}for(const k in q.ev)for(const l of q.ev[k]){total++;if(/\$[nhsalt]/.test(l))tagged++}}if(tagged<total)throw new Error('untagged '+(total-tagged));
  const hq=NPCS.find(q=>q.id=='kai');G.inv[0]=['iron',1];G.sel=0;G.gifted={};gift(hq);FM13.mnorm(modal);const gm=FM13.curMood(modal);modal=null;G.inv[0]=['hoe',1];if(gm!='angry')throw new Error('hated gift mood '+gm);
  return tagged+' lines tagged'}));
 await t('portraits: all residents, child, player, spouse in 6 moods + blink + talk render',async()=>ev(()=>{const looks=[PLOOK,...NPCS.map(n=>n.look),{skin:'#e8b48a',hair:'#ff4aa8',style:'bob',top:'#ffd27a',pants:'#5a8ac8'}];let k=0;
  const c=document.createElement('canvas');c.width=64;c.height=56;const g=c.getContext('2d');for(const L of looks)for(const m of['','happy','sad','angry','love','think'])for(const b of[0,1])for(const tk of[0,1]){g.clearRect(0,0,64,56);drawPortrait(g,0,0,L,4,m,b,tk);const a=g.getImageData(0,0,64,56).data;let op=0;for(let i=3;i<a.length;i+=4)if(a[i])op++;if(op<1200)throw new Error('blank '+m);k++}
  const sp=G.spouse;G.spouse='ava';FM13.bust2(NPCS[0].look,'love',0,0);G.spouse=sp;const q=FM13.bust2(NPCS[0].look,'happy',0,0);if(q.width!=64||q.height!=56||!window.FM14)throw new Error('not anime 64x56');return k+' portraits (64x56 anime)'}));
 await t('illustrated portraits: 10 characters x 6 moods load, overlay shows in dialogue, procedural fallback works',async()=>ev(async()=>{const ws=FM15.WHO;
  await Promise.all(ws.flatMap(w=>FM15.MOODS.map(m=>new Promise((res,rej)=>{const i=new Image();i.onload=()=>i.naturalHeight>=200?res():rej(new Error('small '+w+m));i.onerror=()=>rej(new Error('missing '+w+'_'+m));i.src='assets/portraits/'+w+'_'+m+'.webp?v=18'}))));
  for(const L of[PLOOK,...NPCS.map(n=>n.look),{skin:'#e8b48a',hair:'#ff4aa8',style:'bob',top:'#ffd27a',pants:'#5a8ac8'}])FM15.get(L,'');await new Promise(r=>setTimeout(r,400));
  for(const w of ws)for(const m of FM15.MOODS)if(!FM15.PIMG[w]||!FM15.PIMG[w][m]||!FM15.PIMG[w][m]._ok)throw new Error('not loaded '+w+' '+m);
  const n=NPCS.find(q=>q.id=='ava');say(n.n,'Hi there! $h',null,n.look);modal.ch=1e4;draw();const s=FM15.state();if(!s.shown||!/ava_happy/.test(s.src))throw new Error('overlay not shown '+s.src);
  FM15.FAIL.ava=1;draw();const s2=FM15.state().shown;delete FM15.FAIL.ava;if(s2)throw new Error('fallback did not hide overlay');
  modal=null;draw();if(FM15.state().shown)throw new Error('overlay stuck');return FM15.WHO.length*6+' portraits loaded; overlay + fallback ok'}));
 await t('v19: event CGs (wedding x4, Colony Day, Starfall) lazy-load and overlay dialogue',async()=>ev(async()=>{const ks=['wed_ava','wed_kai','wed_zara','wed_theo','colony','starfall'];
  await Promise.all(ks.map(k=>new Promise((res,rej)=>{const i=new Image();i.onload=()=>i.naturalWidth>=600?res():rej(new Error('small '+k));i.onerror=()=>rej(new Error('missing cg '+k));i.src='assets/cg/'+k+'.webp?v=19'})));
  G.spouse='zara';say('Wedding',['The next sol, the colony gathers.']);draw();await new Promise(r=>setTimeout(r,500));draw();let s=FM16.state();if(s.cg!='wed_zara'||!s.cgShown)throw new Error('wedding CG not shown '+JSON.stringify(s.cg));
  modal=null;draw();if(FM16.state().cgShown)throw new Error('CG stuck');G.spouse=null;
  playCut('colony',['x'],()=>{});skipCut();draw();await new Promise(r=>setTimeout(r,500));draw();s=FM16.state();if(s.cg!='colony'||!s.cgShown)throw new Error('colony CG not shown');modal=null;draw();CUT=null;
  return '6 CGs ok; wedding + Colony Day overlays shown and cleared'}));
 await t('v19: Starfall Night - Star Catcher minigame, stardust exchange, stargazing date',async()=>ev(async()=>{G.day=4+28*(year()-1);G.time=20*60;if(!isStarfall())throw new Error('not starfall');
  enter('city',16,14,0);FM16.sfMenu();if(!modal||modal.name!='Starfall Night')throw new Error('menu');const d0=G.dust||0;FM16.scStart();if(modal)throw new Error('modal during game');
  let st=FM16.state().sc,n=0;while(!st.over&&n<4000){const tg=st.it.filter(i=>i.k!='rock').sort((a,b)=>b.y-a.y)[0];if(tg)st.tx=tg.x;update();n++}if(!st.over)throw new Error('no end');
  if(st.sc<5)throw new Error('score too low '+st.sc);if(G.dust-d0!=st.sc)throw new Error('dust mismatch');draw();for(let i=0;i<45;i++)update();onTap(100,100);if(FM16.state().sc)throw new Error('did not exit');
  G.dust=40;delete (G.decor||{}).comet;FM16.dustMenu();modal.opts[2].f();if(!G.decor.comet||G.dust!=20)throw new Error('exchange');FM16.dustMenu();modal.opts[0].f();if(G.dust!=15||!G.inv.some(i=>i&&i[0]=='startonic'))throw new Error('tonic');
  G.hearts.theo=6;G.sfDate=0;FM16.sfMenu();const o=modal.opts.find(o=>/Watch/.test(o.t));o.f();const th=modal.opts.find(o=>o.t.startsWith('Theo'));const h0=G.hearts.theo;th.f();if(!(G.hearts.theo>h0))throw new Error('hearts');if(FM16.state().cg!='sf_theo')throw new Error('starfall cg');
  modal=null;draw();return 'score '+st.sc+', exchange + date ok'}));
 await t('v19: telescope constellation journal + chibi spacesuit sprites',async()=>ev(()=>{G.decor=G.decor||{};G.decor.scope=1;G.stars={};G.scopeDay=0;G.wx=null;G.time=21*60;G.day=5;FM16.scopeMenu();
  const o=modal.opts.find(o=>/Look/.test(o.t));if(!o)throw new Error('no look option');o.f();if(Object.keys(G.stars).length!=1)throw new Error('stars '+Object.keys(G.stars).length);FM16.scopeMenu();if(modal.opts.some(o=>/Look/.test(o.t)))throw new Error('twice a night');
  for(let i=0;i<12;i++)G.stars[i]=1;G.astro=0;G.scopeDay=0;checkAch();if(!G.ach.astro)throw new Error('astro ach');modal=null;
  {const _ill=window.FM24&&FM24.ILL.on;if(window.FM24)FM24.ILL.on=false;const a=charSprite(PLOOK,2,0,true),b=charSprite(PLOOK,2,0,false);if(window.FM24)FM24.ILL.on=_ill;if(a.width!=b.width||a.width%18||a.height!=a.width*1.5)throw new Error('suit not chibi '+a.width);const d=a.getContext('2d').getImageData(0,0,a.width,a.height).data;let hel=0;for(let i=0;i<d.length;i+=4)if(d[i+3]>40&&d[i+3]<200&&d[i+2]>200&&d[i+1]>200)hel++;if(hel<10)throw new Error('no helmet '+hel);return 'journal ok; suit sprite with helmet ('+hel+'px)'}}));
 await t('v20: every door in every map is reachable by real joystick movement from spawn + each city entrance, and enters',async()=>ev(async()=>{eval(await (await fetch('tests/walk.js?v=20')).text());
  modal=null;CUT=null;menu=null;for(const n of NPCS)G.hearts[n.id]=G.hearts[n.id]||0;if(!G.pod){G.pod=1;G.blobs=[{c:'#7affc8'}];applyLayout()}const bad=[],ok=[];
  const starts={city:[[16,14],[1,10],[15,22],[16,30]],farm:[[13,9]],surf:[[31,41]],valles:[[2,17]]};G.gly=Object.assign(G.gly||{},{open:1});
  for(const k in DOORS){const[z,xy]=k.split(':'),[x,y]=xy.split(',').map(Number);for(const st of starts[z]||[[2,2]]){G.time=DOORS[k][0]=='bar'?19*60:12*60;enter(z,st[0],st[1],0);modal=null;const r=FMWALK.walkTo([x,y]);if(!r.ok||r.zone!=DOORS[k][0])bad.push(k+' from '+st+': '+(r.why||r.zone));else ok.push(k)}}
  // every interior exit door leads back out
  for(const z in EXITS){if(z=='phobos')continue;const m=MAPS[z];let dd=null;for(let y=0;y<m.length&&!dd;y++)for(let x=0;x<m[0].length;x++)if(m[y][x]=='D'){dd=[x,y];break}if(!dd){bad.push('no exit door in '+z);continue}
   let sp=null;for(const k in DOORS)if(DOORS[k][0]==z)sp=[DOORS[k][1],DOORS[k][2]];if(!sp)sp=[dd[0],dd[1]-2];G.time=12*60;enter(z,sp[0],sp[1],0);modal=null;const r=FMWALK.walkTo(dd);if(!r.ok||r.zone!=EXITS[z][0])bad.push('exit '+z+': '+(r.why||r.zone));else ok.push('exit '+z)}
  // straight joystick push (no drift) from up to 7px off-centre still enters each Habitat Row door (corner assist)
  for(const id in HOMES){const hm=HOMES[id];if(hm.orbital||!(hm.out[1]==15||hm.out[1]==20))continue;for(const off of[-7,-4,4,7]){G.time=12*60;enter('city',hm.out[0],hm.out[1],0);modal=null;G.px+=off;const sgn=hm.door[1]>hm.out[1]?1:-1;let f=0;for(;f<90&&G.zone=='city';f++){joy.on=true;joy.dx=0;joy.dy=sgn;update();modal=null}joy.on=false;if(G.zone!='h_'+id)bad.push('straight '+id+' off '+off)}}
  // tap-a-door auto-walk
  G.time=12*60;enter('city',16,14,0);modal=null;const hv=HOMES.vega;FM17.walkToDoor(hv.door[0],hv.door[1]);for(let i=0;i<1500&&G.zone=='city';i++)update();if(G.zone!='h_vega')bad.push('tap-walk vega '+G.zone);
  if(bad.length)throw new Error(bad.join(' | '));enter('farm',13,9,2);return ok.length+' door walks ok (city/farm doors x entrances, interior exits), straight-push + tap-walk ok'}));
 await t('v20: debug menu opens (title chip + system menu), sandbox protects real save, every tab renders with big tap targets',async()=>ev(async()=>{
  save(true);const realKey=slotKey(SLOT),real0=localStorage.getItem(realKey),slot0=SLOT;TITLE=true;onTap(20,10);const el=document.getElementById('dbg');if(!el||el.style.display=='none'||!DBG.open)throw new Error('title chip did not open');
  if(!/Sandbox/.test(el.textContent))throw new Error('no sandbox gate');FM17.startSandbox();if(SLOT!='dbg'||!G.dbgSandbox)throw new Error('not in sandbox');FM17.render();
  const bad=[];for(const t of['Warp','Time','Events','People','View','Give','Cheats']){FM17.setTab(t);const bs=[...el.querySelectorAll('.bd button')];if(t!='View'&&bs.length<2||!el.querySelector('.bd').children.length)bad.push(t+' empty');for(const b of bs){const r=b.getBoundingClientRect();if(r.height&&r.height<40)bad.push(t+' small '+b.textContent+' '+r.height)}}
  FM17.setTab('View');await new Promise(r=>setTimeout(r,50));if(false)bad.push();if(el.querySelectorAll('.bd img[src*=portraits]').length!=FM15.WHO.length*FM15.MOODS.length)bad.push('portraits');if(el.querySelectorAll('.bd canvas').length<10)bad.push('sprites');
  const click=(tab,txt)=>{FM17.openDbg();FM17.setTab(tab);const b=[...el.querySelectorAll('.bd button')].find(b=>b.textContent==txt);if(!b)throw new Error('no button '+tab+'/'+txt);b.click()};
  click('Give','+10000cr');const m=G.money;if(m<10000)bad.push('money');click('People','+1');click('Time','Storm');if(seasonIdx()!=3)bad.push('season');click('Time','21:00');if(G.time!=1260)bad.push('hour');
  for(const z of Object.keys(MAPS)){FM17.openDbg();FM17.setTab('Warp');const b=[...el.querySelectorAll('.bd button')].find(b=>b.textContent==((window.HOMEN&&HOMEN[z])||({farm:'Farm',city:'New Cydonia (city)',home:'Your habitat',cafe:'Cafe',shop:'Shop',cc:'Community Center',surf:'Mars surface',valles:'Valles Canyon',clinic:'Clinic',bar:'The Airlock (bar)',port:'Shuttle Port',phobos:'Phobos Station',biopod:'Bio-Pod',museum:'Museum'}[z])||z));if(!b){bad.push('warp btn '+z);continue}b.click();if(G.zone!=z)bad.push('warp '+z+'->'+G.zone);for(let i=0;i<3;i++){update();draw()}if(feetFree&&!feetFree(G.px,G.py))bad.push('warp stuck '+z)}
  click('Warp','B10');if(G.zone!='mine'||G.floor!=10)bad.push('mine');click('Warp','Rift 3');if(G.zone!='mine')bad.push('rift');
  click('Cheats','God mode');click('Cheats','Infinite energy & O2');click('Cheats','No clip');click('Cheats','Show collision grid');if(!(DBG.god&&DBG.inf&&DBG.noclip&&DBG.grid))bad.push('toggles');FM17.closeDbg();G.energy=1;const hp=G.hp;hurt(50);update();draw();if(G.energy!=G.maxEn||G.hp<hp)bad.push('god/inf');
  FM17.openDbg();FM17.setTab('Cheats');for(const t of['God mode','Infinite energy & O2','No clip','Show collision grid'])[...el.querySelectorAll('.bd button')].find(b=>b.textContent==t).click();FM17.closeDbg();
  if(localStorage.getItem(realKey)!==real0)bad.push('REAL SAVE CHANGED');
  menu=null;modal=null;openMenu('system');draw();menuTap(W/2,36+9*18+6);if(!DBG.open)bad.push('system menu entry');FM17.closeDbg();menu=null;
  FM17.leaveSandbox();if(!TITLE)bad.push('leave');if(localStorage.getItem(slotKey('dbg')))bad.push('sandbox not cleared');startSlot(slot0);modal=null;CUT=null;
  if(bad.length)throw new Error(bad.join(' | '));return '7 tabs, '+Object.keys(MAPS).length+' warps, toggles, real save untouched'}));
 await t('v20: every event replay (story, weddings, stargazing, child, heart events, CGs) runs and restores state',async()=>ev(async()=>{modal=null;CUT=null;G.dbgSandbox=1;DBG.direct=true;const el=()=>document.getElementById('dbg');FM17.openDbg();FM17.setTab('Events');
  const labels=[...el().querySelectorAll('.bd button')].map((b,i)=>i);let n=0;const bad=[];
  for(const i of labels){FM17.openDbg();FM17.setTab('Events');const b=el().querySelectorAll('.bd button')[i];if(!b){bad.push('missing btn '+i);break}const lbl=b.textContent;const before=JSON.stringify({h:G.hearts,s:G.spouse,d:G.day,m:G.money,e:G.events,k:G.kids,c:G.colony});try{b.click();
   let f=0;for(;f<6000&&(modal||CUT||DBG.replay||(window.FM18&&(FM18.state().lg||FM18.state().derby)));f++){if(CUT){CUT.ch=1e9;cutNext()}else if(modal){if(modal.opts){modal=null}else{modal.ch=1e9;modalAdvance(-1)}}else if(window.FM16&&FM16.state().sc){const s=FM16.state().sc;if(s.over>50){onTap(10,10);modal=null}}else if(window.FM18&&FM18.state().lg){const L=FM18.LG;if(L&&!L.over){L.t=L.dur}if(L&&L.over>40)onTap(10,10)}else if(window.FM18&&FM18.state().derby){const D=FM18.DERBY;if(D&&!D.over){D.dist=D.len}if(D&&D.over>40)onTap(10,10)}update();if(f%20==0)draw()}
   if(DBG.replay||modal||CUT)bad.push(lbl+' did not finish');const after=JSON.stringify({h:G.hearts,s:G.spouse,d:G.day,m:G.money,e:G.events,k:G.kids,c:G.colony});if(after!=before)bad.push(lbl+' changed state');n++}catch(e){bad.push(lbl+': '+e.message);break}}
  delete G.dbgSandbox;if(window.__err)bad.push('err '+window.__err.message);if(bad.length)throw new Error(bad.slice(0,8).join(' | '));return n+' replays ok, state restored each time'}));
 await t('v20: Starfall CG matches the chosen partner',async()=>ev(()=>{const r=[];for(const n of NPCS){FM16.stargaze(n);r.push(n.id+':'+FM16.state().cg);modal=null;draw()}const want=id=>['ava','kai','zara','theo'].includes(id)?'sf_'+id:'starfall';const bad=r.filter(x=>{const[i,c]=x.split(':');return c!=want(i)});if(bad.length)throw new Error(bad.join(','));return r.join(' ')}));
 await t('screenshots',async()=>{const shot=async(n,f)=>{await ev(f);await new Promise(r=>setTimeout(r,450));await page.screenshot({path:path.join(SHOTS,n)})};
  await shot('fm13_museum.png',()=>{for(const i of FM10.MALL.slice(0,22))G.muse[i]=1;enter('museum',6,5,0);G.time=700;modal=null;if(npcRT.theo){npcRT.theo.zone='museum';npcRT.theo.x=10*T+8;npcRT.theo.y=4*T+8}});
  await shot('fm13_dust.png',()=>{G.wx='dust';DUSTD=-1;SURF=null;enter('surf',33,37,0);G.time=800;modal=null});
  await shot('fm13_magma.png',()=>{G.wx=null;enterMine(8);modal=null;G.px=9*T;G.py=8*T;const e=ENTS.filter(e=>e.t=='ember');if(e[0]){e[0].x=G.px+40;e[0].y=G.py-10;e[0].tm=60}});
  await shot('fm14_tracker.png',()=>{modal=null;G.sq={kai1:0};add('glowcap',2);enter('farm',13,9,2);G.time=1000});
  await shot('fm14_log.png',()=>{G.sq={ava1:'done',kai1:1,mo1:0};FM11.questLog()});
  await shot('fm14_quest.png',()=>{modal=null;G.sq={};const n=NPCS.find(x=>x.id=='kai');G.hearts.kai=5;enter('city',16,14,0);G.time=720;placeNPCs(true);const r=npcRT.kai;if(r.zone=='city'){G.px=r.x+20;G.py=r.y}talk(n)});
  await shot('fm15_home_zara.png',()=>{modal=null;G.time=22*60+30;G.wx=null;enter('h_zara',5,6,0);placeNPCs(true);G.px=6*T+8;G.py=5*T+8});
  await shot('fm15_home_mo.png',()=>{modal=null;G.time=21*60;enter('h_mo',5,6,0);placeNPCs(true);G.px=4*T+8;G.py=5*T+8});
  await shot('fm15_habitat_row.png',()=>{modal=null;G.time=19*60;enter('city',6,20,0)});
  await shot('fm15_portrait.png',()=>{G.time=21*60;enter('h_theo',5,6,0);placeNPCs(true);G.px=6*T+8;G.py=5*T+8;const n=NPCS.find(q=>q.id=='theo');say(n.n,FM12.HOMES.theo.home[1],null,n.look);modal.ch=999});
  await ev(()=>{modal=null;const old=document.getElementById('cmp');if(old)old.remove();const looks=[['You',PLOOK],...NPCS.map(n=>[n.n,n.look]),['Child',{skin:'#e8b48a',hair:'#ff4aa8',style:'bob',top:'#ffd27a',pants:'#5a8ac8'}]];
   const S=4,cw=looks.length*26,ch=140,c=document.createElement('canvas');c.id='cmp';c.width=cw*S;c.height=ch*S;c.style.cssText='position:fixed;left:0;top:0;z-index:99;width:'+cw*S/2+'px;height:'+ch*S/2+'px;image-rendering:pixelated';
   const o=document.createElement('canvas');o.width=cw;o.height=ch;const g=o.getContext('2d');g.fillStyle='#1a1030';g.fillRect(0,0,cw,ch);g.fillStyle='#2a1a40';g.fillRect(0,70,cw,70);
   const tx=(s,x,y)=>{g.fillStyle='#ffd27a';g.font='6px monospace';g.fillText(s,x,y)};tx('BEFORE',2,7);tx('AFTER',2,77);
   looks.forEach(([nm,L],i)=>{const x=i*26+5;FM12.drawCharV1(g,x,10,L,2,0);FM12.drawCharV1(g,x,38,L,1,1);FM12.drawPortraitV1(g,x-1,58,L,0.75);drawChar(g,x,80,L,2,0);drawChar(g,x,108,L,1,1);});
   const q=c.getContext('2d');q.imageSmoothingEnabled=false;q.drawImage(o,0,0,cw*S,ch*S);document.body.appendChild(c)});
  await new Promise(r=>setTimeout(r,200));await (await page.$('#cmp')).screenshot({path:path.join(SHOTS,'fm15_before_after.png')});
  await ev(()=>{document.getElementById('cmp').remove()});
  await shot('fm18_dlg_happy.png',()=>{modal=null;G.time=12*60;enter('city',16,14,0);placeNPCs(true);const n=NPCS.find(q=>q.id=='kai');say(n.n,"Glowcaps! You remembered! I'm making the Glowcap Omelette tonight, and you're getting the first plate. $h",null,n.look);modal.ch=48});
  await shot('fm16_dlg_angry.png',()=>{const n=NPCS.find(q=>q.id=='mo');say(n.n,"Iron? You brought ME iron? I've dug forty years of the stuff out of those tunnels. Take it back! $a",null,n.look);modal.ch=1e4});
  await shot('fm18_dlg_think.png',()=>{const n=NPCS.find(q=>q.id=='theo');say(n.n,"Hmm... if Phobos keeps drifting closer, then in fifty million years... Do you think anyone will be here to see it? $t",[{t:'Definitely. Our grandkids.'},{t:"Let's make sure of it."},{t:'That is a long time, Theo.'}],n.look);modal.ch=1e4});
  await shot('fm18_dlg_love.png',()=>{const n=NPCS.find(q=>q.id=='zara');say(n.n+' - Heart Event',["I wrote it after visiting your farm. It's called 'Home'. $l"],null,n.look);modal.ch=1e4});
  await shot('fm16_letter.png',()=>{modal=null;G.mail=G.mail||{box:[],read:{}};if(typeof mailMenu=='function')mailMenu();if(G.mail.box.length&&typeof readLetter=='function'){modal=null;readLetter(G.mail.box[G.mail.box.length-1])}if(modal)modal.ch=1e4});
  await ev(()=>{modal=null;const old=document.getElementById('cmp');if(old)old.remove();const looks=[['You',PLOOK],...NPCS.map(n=>[n.n,n.look]),['Child',{skin:'#e8b48a',hair:'#ff4aa8',style:'bob',top:'#ffd27a',pants:'#5a8ac8'}]],M=[['neutral',''],['happy','happy'],['sad','sad'],['angry','angry'],['love','love'],['thinking','think'],['talking','',1]];
   const cw=60+M.length*70,ch=24+looks.length*62,c=document.createElement('canvas');c.id='cmp';c.width=cw;c.height=ch;c.style.cssText='position:fixed;left:0;top:0;z-index:99;width:'+cw+'px;height:'+ch+'px;image-rendering:pixelated';const g=c.getContext('2d');g.imageSmoothingEnabled=false;
   g.fillStyle='#1a1030';g.fillRect(0,0,cw,ch);g.font='10px monospace';g.fillStyle='#ffd27a';M.forEach((m,i)=>g.fillText(m[0],64+i*70,14));
   looks.forEach(([nm,L],r)=>{g.fillStyle='#f4ead8';g.fillText(nm.slice(0,9),2,24+r*62+34);M.forEach((m,i)=>{g.fillStyle=r%2?'#2a1a40':'#24163a';g.fillRect(62+i*70,20+r*62,66,58);drawPortrait(g,63+i*70,21+r*62,L,4,m[1],false,!!m[2])})});document.body.appendChild(c)});
  await new Promise(r=>setTimeout(r,200));await (await page.$('#cmp')).screenshot({path:path.join(SHOTS,'fm17_portrait_sheet.png')});
  await ev(()=>{document.getElementById('cmp').remove();const d=document.createElement('div');d.id='cmp';d.style.cssText='position:fixed;left:0;top:0;z-index:99;background:#1a1030;padding:8px;font:12px monospace;color:#ffd27a;display:grid;grid-template-columns:70px repeat(6,100px);gap:4px;align-items:center';
   d.innerHTML='<div></div>'+FM15.MOODS.map(m=>'<div>'+m+'</div>').join('')+FM15.WHO.map(w=>'<div>'+w+'</div>'+FM15.MOODS.map(m=>'<img style="width:100px;height:113px;object-fit:cover;border-radius:4px" src="assets/portraits/'+w+'_'+m+'.webp?v=18">').join('')).join('');document.body.appendChild(d)});
  await new Promise(r=>setTimeout(r,800));await (await page.$('#cmp')).screenshot({path:path.join(SHOTS,'fm18_portrait_sheet.png')});
  await ev(()=>{document.getElementById('cmp').remove();const looks=[['You',PLOOK],...NPCS.map(n=>[n.n,n.look]),['Child',{skin:'#e8b48a',hair:'#ff4aa8',style:'bob',top:'#ffd27a',pants:'#5a8ac8'}]];const S=4,cw=looks.length*22+4,ch=4*28+12,o=document.createElement('canvas');o.width=cw;o.height=ch;const g=o.getContext('2d');g.fillStyle='#3a2030';g.fillRect(0,0,cw,ch);
   looks.forEach(([nm,L],i)=>{[2,1,3,0].forEach((dir,r)=>drawChar(g,4+i*22,6+r*28,L,dir,(i+r)%4))});const c=document.createElement('canvas');c.id='cmp';c.width=cw*S;c.height=ch*S;c.style.cssText='position:fixed;left:0;top:0;z-index:99;width:'+cw*S/2+'px;height:'+ch*S/2+'px;image-rendering:pixelated';const q=c.getContext('2d');q.imageSmoothingEnabled=false;q.drawImage(o,0,0,cw*S,ch*S);document.body.appendChild(c)});
  await new Promise(r=>setTimeout(r,200));await (await page.$('#cmp')).screenshot({path:path.join(SHOTS,'fm18_sprite_lineup.png')});
  await ev(()=>{document.getElementById('cmp').remove();modal=null;enter('farm',13,9,2)});
  await shot('fm19_cg_wedding.png',()=>{G.spouse='kai';say('Wedding',['You kneel in the neon plaza and offer the Red Pendant.','KAI: "Yes! A thousand times yes!"']);modal.ch=1e4});
  await new Promise(r=>setTimeout(r,600));await page.screenshot({path:path.join(SHOTS,'fm19_cg_wedding.png')});
  await shot('fm19_cg_colony.png',()=>{modal=null;G.spouse=null;playCut('colony',['x'],()=>{});skipCut();modal.ch=1e4});await new Promise(r=>setTimeout(r,600));await page.screenshot({path:path.join(SHOTS,'fm19_cg_colony.png')});
  await shot('fm19_starfall_plaza.png',()=>{modal=null;CUT=null;G.day=4;G.time=21*60;enter('city',16,14,0);FM16.sfMenu();modal.ch=1e4});
  await shot('fm19_star_catcher.png',()=>{FM16.scStart();const s=FM16.state().sc;for(let i=0;i<700;i++){const tg=s.it.filter(i=>i.k!='rock').sort((a,b)=>b.y-a.y)[0];if(tg)s.tx=tg.x;update()}});
  await shot('fm19_telescope.png',()=>{const s=FM16.state().sc;while(!s.over)update();for(let i=0;i<45;i++)update();onTap(10,10);modal=null;G.house=Math.max(G.house||0,1);G.decor.scope=1;G.decor.comet=1;G.stars={0:1,3:1,7:1};G.scopeDay=0;G.time=21*60;enter('home',9,6,1);FM16.scopeMenu();modal.ch=1e4});
  await ev(()=>{const looks=[PLOOK,...NPCS.map(n=>n.look)],S=4,c=document.createElement('canvas');c.id='cmp';c.width=(8*22+4)*S;c.height=(looks.length*30+4)*S;c.style.cssText='position:fixed;left:0;top:0;z-index:99;background:#5a3a2a';const g=c.getContext('2d');g.imageSmoothingEnabled=false;g.fillStyle='#5a3a2a';g.fillRect(0,0,c.width,c.height);
   looks.forEach((L,r)=>[2,1,0,3].forEach((d,i)=>{for(const s of[0,1])g.drawImage(charSprite(L,d,0,!!s,0),(4+(i+s*4)*22)*S,(2+r*30)*S,18*S,27*S)}));document.body.appendChild(c);modal=null});
  await new Promise(r=>setTimeout(r,200));await (await page.$('#cmp')).screenshot({path:path.join(SHOTS,'fm19_sprites_suits.png')});
  await ev(()=>{document.getElementById('cmp').remove();modal=null;enter('farm',13,9,2)});return 'saved'});
 await t('v21: Phobos expansion - Nyx, bunk door, Low-G Drift, exchange extras',async()=>ev(async()=>{
  if(!NPCS.find(n=>n.id=='nyx'))throw new Error('no nyx');if(!FM15.WHO.includes('nyx'))throw new Error('nyx portraits');
  if(!MAPS.phobos||MAPS.phobos.length<12)throw new Error('phobos map');if(!MAPS.h_nyx)throw new Error('nyx bunk');
  G.port=1;G.time=12*60;enter('phobos',14,8,0);placeNPCs(true);if(!feetFree(G.px,G.py))throw new Error('phobos spawn');
  if(!(npcRT.nyx&&npcRT.nyx.zone=='phobos'))throw new Error('nyx not on station');
  enter('phobos',22,4,0);G.py=3*T+10;triggers();if(G.zone!='h_nyx')throw new Error('bunk door '+G.zone);
  G.px=5*T+8;G.py=7*T+4;triggers();if(G.zone!='phobos')throw new Error('bunk exit '+G.zone);
  FM18.lgStart();if(!FM18.state().lg)throw new Error('lg');for(let i=0;i<40;i++){FM18.LG.tx=200;FM18.LG.ty=100;update()}
  FM18.LG.t=FM18.LG.dur;update();for(let i=0;i<60;i++)update();if(!(FM18.LG&&FM18.LG.over))throw new Error('lg end');
  onTap(10,10);modal=null;
  // exchange sells new goods
  const m0=G.money;G.money=99999;exchMenu();if(!modal||!modal.opts)throw new Error('exch');const names=modal.opts.map(o=>o.t).join('|');
  if(!/Zero-G|Moon Rock|Snowglobe/.test(names))throw new Error('exch missing '+names);modal=null;G.money=m0;
  return 'nyx+bunk+low-g+exchange ok'}));
 await t('v21: Storm Derby is a playable race + festival menu',async()=>ev(()=>{
  const yr0=(year()-1)*28;G.day=yr0+3*7+7;G.time=10*60;G.feast=0;festAct();
  if(!modal||modal.name!='Storm Derby')throw new Error('no fest menu');
  const race=modal.opts.find(o=>/Race/i.test(o.t));if(!race)throw new Error('no race option');race.f();
  if(!FM18.state().derby)throw new Error('derby not started');
  for(let i=0;i<80;i++){const D=FM18.DERBY;if(D){D.tx=D.x+(i%2?20:-20);update()}}
  FM18.DERBY.dist=FM18.DERBY.len;update();for(let i=0;i<60;i++)update();
  if(!(FM18.DERBY&&FM18.DERBY.over))throw new Error('no finish');const place=G.derbyHi;onTap(10,10);modal=null;
  if(!cnt('ticket'))throw new Error('no ribbon');return 'finished place was tracked ('+place+')'}));
 await t('v21: Cydonia Springs spa - door, soak CG, date',async()=>ev(()=>{
  if(!MAPS.springs)throw new Error('no springs');if(!DOORS['city:26,19'])throw new Error('no door');
  enter('city',26,20,0);G.py=19*T+10;triggers();if(G.zone!='springs')throw new Error('door '+G.zone);
  G.px=8*T+8;G.py=6*T+8;if(isSolid('springs','p'))throw new Error('pool solid');if(!feetFree(G.px,G.py))throw new Error('pool blocked');
  G.springDay=0;FM18.soak();if(FM16.state().cg!='springs')throw new Error('cg '+FM16.state().cg);modal=null;
  G.hearts.ava=8;G.dating=G.dating||{};G.dating.ava=1;G.springDay=0;FM18.springDate(NPCS.find(n=>n.id=='ava'));
  if(FM16.state().cg!='springs')throw new Error('date cg');modal=null;
  G.px=8*T+8;G.py=11*T+4;triggers();if(G.zone!='city')throw new Error('exit '+G.zone);
  return 'springs door+soak+date ok'}));
 await t('v21: partner Starfall + new CGs load',async()=>ev(()=>{
  for(const k of['phobos','springs','derby']){const im=FM16.cgLoad(k);if(!im)throw new Error('no '+k)}
  return '3 new CGs'}));
 await t('v22: Old Colony - door, 6 section consoles, donate/partial/complete bundles, rewards, unlocks (greenhouse, scrap, med, forecast, rail), finale CG, tracker',async()=>ev(()=>{const F=FM19,bad=[];G.oc=null;G.gh=0;
  enter('surf',F.OCD[0],F.OCD[1]+1,0);G.py=F.OCD[1]*T+10;triggers();if(G.zone!='oldcol')throw new Error('door '+G.zone);G.px=1*T+8;G.py=7*T+8;G.px=0*T+8;triggers();if(G.zone!='surf')bad.push('exit');
  for(const r of F.ROOMS){enter('oldcol',r.p[0],r.p[1]+1,0);G.dir=0;modal=null;interact();if(!modal||modal.name!=r.n)bad.push('console '+r.id);modal=null}
  if(F.OCB.length<12)bad.push('bundles '+F.OCB.length);for(const b of F.OCB)for(const k in b.in)if(k!='$'&&!ITEMS[k])bad.push('bad item '+k);
  const b=F.OCB.find(q=>q.id=='s1');add('iron',8);F.donate(b);if(F.bDone(b)||(G.oc.b.s1.iron!=8))bad.push('partial');add('iron',12);add('cob',5);const m0=G.money;F.donate(b);modal=null;if(!F.bDone(b)||G.money!=m0+800)bad.push('complete/reward');
  G.oc.pin='h1';draw();const[x,y,w,h]=F.trRect();onTap(x+5,y+5);if(!modal||modal.name!='Dust & Bloom Crops')bad.push('tracker tap');modal=null;
  const en=G.maxEn;for(const q of F.OCB)if(!F.bDone(q))F.completeBundle(q,true);if(!F.ocAllDone()||!G.oc.fin)bad.push('all');if(G.maxEn!=en+25)bad.push('med');if(!G.gh||GHR[0]!=18)bad.push('greenhouse');
  const iron=cnt('iron'),fc=F.forecastFor(G.day+1);sleep();modal=null;if(cnt('iron')<=iron)bad.push('scrap');if(G.wx!=fc)bad.push('forecast '+fc+' vs '+G.wx);if(!(G.fcast||'').includes('Tomorrow'))bad.push('fcast text');
  enter('farm',28,14,0);G.px=28*T+8;G.py=13*T+20;interact();const o=modal&&modal.opts&&modal.opts.find(q=>/Old Colony/.test(q.t));if(!o)bad.push('rail menu');else{o.f();if(G.zone!='oldcol')bad.push('rail ride '+G.zone)}modal=null;
  F.finale();if(FM16.state().cg!='oldcol')bad.push('finale cg');modal=null;if(!LETTERS.find(l=>l[0]=='oldcol'&&l[4]({day:3})))bad.push('letter');
  if(bad.length)throw new Error(bad.join(' | '));return F.OCB.length+' bundles / 6 sections ok'}));
 await t('v22: visible terraforming - surface paint per stage, forage, open-sky crops, critters, dome view, NPC lines, stage CGs',async()=>ev(()=>{const F=FM19,bad=[];
  const px=st=>{G.terra=st;const c=bgCache('surf',MAPS.surf);const d=c.getContext('2d').getImageData(0,0,c.width,c.height).data;let gr=0;for(let i=0;i<d.length;i+=16)if(d[i+1]>d[i]&&d[i+1]>d[i+2])gr++;return gr};
  const g=[0,1,2,3].map(px);if(!(g[1]>g[0]&&g[2]>g[1]&&g[3]>g[2]))bad.push('green px '+g);
  for(const st of[1,2,3]){G.terra=st;const E=genSurface();const k=E.filter(e=>e.k=='plant'&&['mclover','cbloom','reed'].includes(e.t)).length;if(!k)bad.push('forage st'+st)}G.terra=0;if(genSurface().some(e=>['mclover','cbloom','reed'].includes(e.t)))bad.push('forage at 0');
  G.oplot={};G.terra=1;enter('surf',17,39,0);G.dir=0;G.inv[0]=['s_mbar',2];G.sel=0;F.plotAct(17,38);if(G.oplot['17,38'])bad.push('planted too early');
  G.terra=2;F.plotAct(17,38);if(!G.oplot['17,38'])bad.push('plant');for(let i=0;i<4;i++){sleep();modal=null}const b=cnt('mbar');F.plotAct(17,38);if(cnt('mbar')<=b)bad.push('harvest');
  G.terra=3;G.tfCG=2;modal=null;CUT=null;menu=null;update();if(FM16.state().cg!='tf3')bad.push('stage cg '+FM16.state().cg);modal=null;
  const n=NPCS.find(q=>q.id=='mo');G.tfHeard={};delete G.talked['mo'+G.day];chat(n);if(!modal||!modal.pages.some(p=>p.includes('craters')))bad.push('npc line');modal=null;
  enter('surf',20,20,0);G.time=12*60;for(let i=0;i<3;i++){update();draw()}enter('farm',13,2,0);draw();
  if(bad.length)throw new Error(bad.join(' | '));return 'green px by stage '+g.join('<')}));
 await t('v22: debug menu has Old Colony/terraform warps, events and unlocks',async()=>ev(()=>{const el=()=>document.getElementById('dbg');G.dbgSandbox=1;const bad=[];
  const find=(tab,l)=>{FM17.openDbg();FM17.setTab(tab);return[...el().querySelectorAll('.bd button')].find(b=>b.textContent==l)};
  for(const[tab,l]of[['Warp','Old Colony'],['Warp','Rail Depot'],['Events','Old Colony finale'],['Events','Terraform CG 2'],['Give','Restore Radio Tower'],['Give','Stage 2']]){const b=find(tab,l);if(!b)bad.push(tab+'/'+l);}
  find('Warp','Old Colony').click();if(G.zone!='oldcol')bad.push('warp');find('Give','Reset Old Colony').click();find('Give','Restore Rail Depot').click();if(!G.oc.unl.rail)bad.push('unlock');FM17.closeDbg();delete G.dbgSandbox;
  if(bad.length)throw new Error(bad.join(' | '));return 'ok'}));
 await t('v20 screenshots',async()=>{const shot=async(n,f)=>{await ev(f);await new Promise(r=>setTimeout(r,500));await page.screenshot({path:path.join(SHOTS,n)})};
  await shot('fm20_habitat_row.png',()=>{FM17.closeDbg();modal=null;G.time=12*60;G.wx=null;enter('city',6,15,2);DBG.grid=true});
  await shot('fm20_habitat_row_nogrid.png',()=>{DBG.grid=false;enter('city',8,17,0);G.py=15*T+8});
  await shot('fm20_debug_gate.png',()=>{FM17.openDbg()});
  await shot('fm20_debug_warp.png',()=>{G.dbgSandbox=1;FM17.setTab('Warp')});
  await shot('fm20_debug_events.png',()=>{FM17.setTab('Events')});
  await shot('fm20_debug_people.png',()=>{FM17.setTab('People')});
  await shot('fm20_debug_view.png',()=>{FM17.setTab('View')});
  await shot('fm20_debug_give.png',()=>{FM17.setTab('Give')});
  await shot('fm20_system_menu.png',()=>{FM17.closeDbg();delete G.dbgSandbox;openMenu('system')});
  await shot('fm20_title.png',()=>{menu=null;TITLE=true});
  await shot('fm20_cg_sf_zara.png',()=>{TITLE=false;FM16.stargaze(NPCS.find(n=>n.id=='zara'));modal.pi=1;modal.ch=1e4});
  await ev(()=>{modal=null;enter('farm',13,9,2)});return 'saved'});
 await t('v23: NPC routines - weekly meetups, NPCs walk out through doors and arrive through doors, pair chatter',async()=>ev(()=>{const F=FM20,bad=[];
  for(const r of F.ROUT)for(const id in r.at){const[z,x,y]=r.at[id];const[a,b]=F.nearFree(z,x,y);if(!MAPS[z]||isSolid(z,MAPS[z][b][a]))bad.push('spot '+r.id+id)}
  G.day=8;const mo=schedFor(NPCS.find(n=>n.id=='mo'),12);if(mo[0]!='cafe')bad.push('lunch sched '+mo);
  G.day=9;G.time=8*60+50;placeNPCs(true);enter('city',12,15,2);const a=npcRT.ava;if(a.zone!='city')bad.push('ava jog '+a.zone);G.time=9*60;lastHour=-1;update();if(!a.leave||a.zone!='city'||!a.path||!a.path.length)bad.push('no walk-out');
  let i=0;for(;i<6000&&a.leave;i++)update();if(a.zone!='cc'||i<60)bad.push('walk-out end '+a.zone+' '+i);
  G.time=8*60+50;placeNPCs(true);enter('cc',7,7,0);G.time=9*60;lastHour=-1;update();if(a.zone!='cc'||!a.path||!a.path.length)bad.push('no walk-in');
  G.day=8;G.time=12*60+10;G.rec={};F.syncPairs();if(PAIRS[0][0]!='kai')bad.push('pair '+PAIRS[0]);
  if(bad.length)throw new Error(bad.join(' | '));return 'walk-out '+i+' ticks, '+F.ROUT.length+' routines'}));
 await t('v23: NPCs react to storms, weddings and donations (lines + pair chatter)',async()=>ev(()=>{const F=FM20,bad=[];
  for(const e of['storm','wed','don']){G.rec={[e]:G.day};G.rheard={};const n=NPCS.find(q=>q.id=='theo');delete G.talked['theo'+G.day];G.spouse=null;modal=null;chat(n);if(!modal||modal.pages[0]!=F.REACT[e].theo)bad.push(e);modal=null;F.syncPairs();if(!F.REACTP[e].some(p=>PAIRS.includes(p)))bad.push(e+' pairs')}
  G.rec={};G.oc=G.oc||{b:{},done:{},unl:{},pin:null};F.trackRecent();G.oc.done.zz=1;F.trackRecent();if(G.rec.don!=G.day)bad.push('track don');delete G.oc.done.zz;
  if(bad.length)throw new Error(bad.join(' | '));return 'ok'}));
 await t('v23: Earth letters - 5-letter arc, choices change later letters, CGs at key beats, seeds, finale on first sunflower',async()=>ev(()=>{const bad=[];G.mail={box:[],read:{},got:{}};G.earth=null;G.money=5000;G.day=5;
  mailCheck();if(!G.mail.box.includes('earth1'))bad.push('e1');readLetter('earth1');modal.opts[1].f();modal=null;
  G.day=9;mailCheck();readLetter('earth2');if(FM16.state().cg!='earth1')bad.push('cg1');modal=null;
  const L=LETTERS.find(l=>l[0]=='earth2');if(!L[3].includes('lonely'))bad.push('choice text');readLetter('earth2');const o=modal.opts;if(o.length!=4)bad.push('e2 opts');o[0].f();if(G.money!=3500)bad.push('cr');modal=null;
  G.day=13;mailCheck();const s0=cnt('s_sun');readLetter('earth3');if(cnt('s_sun')!=s0+5)bad.push('seeds');if(!LETTERS.find(l=>l[0]=='earth3')[3].includes('credits'))bad.push('gift ref');modal.opts[0].f();modal=null;
  G.day=18;mailCheck();readLetter('earth4');if(FM16.state().cg!='earth2')bad.push('cg2');modal=null;readLetter('earth4');modal.opts[0].f();modal=null;
  mailCheck();if(G.mail.got.earth5)bad.push('e5 early');G.tiles['6,15']={c:'sun',g:5,w:1,dry:0};harvest('6,15');if(!G.mail.got.earth5)bad.push('e5');readLetter('earth5');if(FM16.state().cg!='earth3')bad.push('cg3');modal=null;checkAch();if(!G.ach.rosa)bad.push('ach');
  seedMenu();if(modal.opts.some(q=>/Sunflower/.test(q.t)))bad.push('sun in shop');modal=null;
  if(bad.length)throw new Error(bad.join(' | '));return '5 letters, 3 CGs, choices ok'}));
 await t('v23: weird crops - Static Bloom grows only in storms, Lumen Lily lights the night farm, 3x3 Crater Gourds go giant',async()=>ev(()=>{const F=FM20,bad=[];G.day=2;
  G.tiles={'5,15':{c:'stc',g:0,w:1,dry:0}};G.wx=null;sleep();modal=null;if(G.tiles['5,15'].g!=0)bad.push('stc grew w/o storm');G.tiles['5,15'].w=1;G.wx='dust';sleep();modal=null;if(G.tiles['5,15'].g!=1)bad.push('stc storm');
  G.wx='dust';seedMenu();if(!modal.opts.some(q=>/Static Bloom/.test(q.t)))bad.push('stc shop storm');modal=null;G.wx=null;G.day=2;seedMenu();if(modal.opts.some(q=>/Static Bloom/.test(q.t)))bad.push('stc shop clear');modal=null;
  G.tiles={};F.plantGrid('lum',true,5,1,10,12);enter('farm',12,14,0);G.time=22*60;LIGHTS=[];draw();const n=LIGHTS.filter(l=>l.c==CROPS.lum.c).length;if(n<5)bad.push('lum lights '+n);
  G.tiles={};G.giant={};F.plantGrid('grd',true);if(F.formGiants(true)!=1)bad.push('giant form');enter('farm',19,16,0);if(!solidAt(19*T+8,13*T+8))bad.push('giant solid');G.py=15*T+8;G.dir=0;G.energy=100;const g0=cnt('grd');act();if(cnt('grd')-g0!=15||Object.keys(G.giant).length)bad.push('giant harvest');
  G.tiles={};F.plantGrid('grd',true,2,3);if(F.formGiants(true))bad.push('2x3 went giant');
  if(bad.length)throw new Error(bad.join(' | '));return 'lum lights '+n}));
 await t('v23: wildlife - dust fox befriended over 3 sols with CG, follows you home; ore-sniffer befriended with ore, sniffs out ore',async()=>ev(()=>{const F=FM20,bad=[];G.fox=null;G.sniff=null;F.resetRT();G.inv=G.inv.map((s,i)=>i<4?s:null);G.time=12*60;
  enter('surf',F.FOXH[0]-1,F.FOXH[1],1);const p=F.foxRT();if(!p)throw new Error('no wild fox');G.px=p.x-14;G.py=p.y;G.dir=1;
  for(let d=0;d<3;d++){add('pot',2);G.sel=G.inv.findIndex(s=>s&&s[0]=='pot');modal=null;F.foxAct();if(d<2)F.foxAct();G.day++}if(!G.fox.ad||G.fox.fed!=3)bad.push('fox befriend '+G.fox.fed);if(FM16.state().cg!='fox')bad.push('fox cg');modal=null;
  enter('farm',13,9,2);for(let i=0;i<120;i++)update();let fp=F.foxRT();if(!fp||fp.z!='farm'||Math.hypot(fp.x-G.px,fp.y-G.py)>40)bad.push('fox follow farm');
  G.px=5*T+8;G.py=5*T+10;triggers();for(let i=0;i<60;i++)update();fp=F.foxRT();if(G.zone!='home'||!fp||fp.z!='home')bad.push('fox home '+G.zone);
  G.fox.love=5;let gift=0;for(let d=0;d<8;d++){sleep();if(modal&&modal.pages.some(q=>/left a gift/.test(q)))gift++;modal=null}if(!gift)bad.push('fox gifts');
  G.fox.pet=-1;enter('farm',13,9,2);update();fp=F.foxRT();if(!fp)throw new Error('no fox after sleeps: zone '+G.zone+' fox '+JSON.stringify(G.fox)+' modal '+!!modal+' cut '+!!CUT);G.px=fp.x-12;G.py=fp.y;const l0=G.fox.love;interact();if(G.fox.love<=l0&&l0<10)bad.push('fox pet');
  add('iron',5);enterMine(3);modal=null;const s=F.snRT();if(!s)throw new Error('no sniffer');G.px=s.x-14;G.py=s.y;interact();modal=null;if(!G.sniff.ad)bad.push('sniff befriend');
  G.inv=G.inv.map((s,i)=>i<12?s:null);for(let i=0;i<3000&&G.sniff.found<1;i++){modal=null;menu=null;CUT=null;update()}if(G.sniff.found<1)bad.push('ores '+ENTS.filter(e=>e.k=='ore').length+' sn '+JSON.stringify(F.snRT()&&[F.snRT().x,F.snRT().y,G.px,G.py]));if(G.sniff.found<1)bad.push('sniff found');
  if(bad.length)throw new Error(bad.join(' | '));return 'fox gifts '+gift+'/8, sniffed '+G.sniff.found}));
 await t('v23: debug menu - routines/wildlife warps, Earth letter + reaction events, crop/wildlife gives',async()=>ev(()=>{const el=()=>document.getElementById('dbg');G.dbgSandbox=1;const bad=[];
  const find=(tab,l)=>{FM17.openDbg();FM17.setTab(tab);return[...el().querySelectorAll('.bd button')].find(b=>b.textContent.startsWith(l))};
  for(const[tab,l]of[['Warp','Dust fox'],['Warp','Ore-sniffer'],['Warp','Routine: Cafe lunch'],['Events','Earth letter 1'],['Events','Earth letter 5'],['Events','Giant crop'],['Events','NPC storm'],['Give','Weird seeds'],['Give','Adopt dust fox'],['Give','Force dust storm']]){if(!find(tab,l))bad.push(tab+'/'+l)}
  find('Give','Adopt dust fox').click();if(!G.fox||!G.fox.ad)bad.push('adopt');find('Warp','Ore-sniffer').click();if(G.zone!='mine')bad.push('warp mine');FM17.closeDbg();delete G.dbgSandbox;
  if(bad.length)throw new Error(bad.join(' | '));return 'ok'}));
 await t('v24: cosmetics - hats on sprite+portrait, dyes, tailoring machine sew/extract/wardrobe, wallpaper & flooring, festival/fishing rewards',async()=>ev(()=>{const F=FM21,bad=[];G.cos=null;G.money=99999;G.inv=G.inv.map((s,i)=>i<4?s:null);G.time=12*60;
  const before=charSprite(PLOOK,2,0,false,false).toDataURL();F.gain('hats','straw');F.wear('straw');if(PLOOK.hat!='straw'||G.look.hat!='straw')bad.push('wear');const after=charSprite(PLOOK,2,0,false,false).toDataURL();if(before==after)bad.push('sprite unchanged');
  if(typeof bust3=='function'){const a=bust3(Object.assign({},PLOOK,{hat:null}),'',0,0,'you').toDataURL(),b=bust3(PLOOK,'',0,0,'you').toDataURL();if(a==b)bad.push('portrait unchanged')}
  shopMenu();const cat=modal.opts.find(q=>/Home Catalog/.test(q.t));if(!cat)bad.push('catalog');cat.f();const lm=modal.opts.find(q=>/Tailoring Machine/.test(q.t));lm.f();if(!G.cos.loom)bad.push('buy loom');modal=null;
  enter('home',10,3,0);G.dir=0;interact();if(!modal||modal.name!='Tailoring Machine')bad.push('loom interact');modal=null;
  add('wht',5);F.sewMenu();modal.opts.find(q=>/Straw/.test(q.t))||0;G.cos.hats={};F.sewMenu();const so=modal.opts.find(q=>/Straw/.test(q.t));so.f();if(!G.cos.hats.straw||cnt('wht')!=0&&cnt('wht')>=5)bad.push('sew');modal=null;
  add('tom',1);G.sel=G.inv.findIndex(s=>s&&s[0]=='tom');F.extractDye();if(!G.cos.dyes.crimson)bad.push('extract');modal=null;F.dye('top','crimson');F.dye('pants','crimson');if(PLOOK.top!='#c03040'||G.look.pants!='#c03040')bad.push('dye');
  const t0=tileImg('home','w',1).toDataURL();F.gain('walls','stars');F.setRoom('wall','stars');F.gain('floors','wood');F.setRoom('floor','wood');if(tileImg('home','w',1).toDataURL()==t0)bad.push('wallpaper');if(G.cos.floor!='wood')bad.push('floor');
  G.cos.hats={};G.derbyHi=2;FM18.derbyEnd?0:0;window.FMEV('derby',2);if(!G.cos.hats.goggles)bad.push('derby hook');G.cos.hats={};G.colony={};const mm=modal;colonyDay();if(CUT&&CUT.done){const d=CUT.done;CUT=null;d()}modal=null;if(!G.cos.hats.party)bad.push('colony day hook');FMEV('starfall');FMEV('derby');if(!G.cos.hats.goggles)bad.push('derby hat');if(!G.cos.hats.crown)bad.push('starfall hat');
  G.stats.fish=9;FISHING={k:'koi'};fishWin();if(!G.cos.hats.angler||!G.cos.walls.ocean)bad.push('fish rewards');
  F.wear(null);if(PLOOK.hat)bad.push('unwear');
  if(bad.length)throw new Error(bad.join(' | '));return Object.keys(F.HATS).length+' hats, '+Object.keys(F.DYES).length+' dyes, '+(Object.keys(F.WALLS).length-1)+' wallpapers, '+(Object.keys(F.FLOORS).length-1)+' floors'}));
 await t('v24: glyph mystery - 7 glyphs in mine/canyon/Phobos/Old Colony, journal decoding, sealed canyon door opens',async()=>ev(()=>{const F=FM21,bad=[];G.gly=null;G.time=12*60;G.inv=G.inv.map((s,i)=>i<4?s:null);
  for(const g of F.GLY){if(g.z=='mine')enterMine(g.fl);else enter(g.z,g.x,g.y,0);modal=null;const p=F.glyPos(g);if(!p){bad.push('no pos '+g.id);continue}if(G.zone!='mine'&&isSolid(g.z,MAPS[g.z][p[1]][p[0]]))bad.push('solid '+g.id);G.px=p[0]*T+8;G.py=p[1]*T+18;if(solidAt(G.px,G.py)){G.py=p[1]*T+8}interact();modal=null;if(!G.gly.f[g.id])bad.push('find '+g.id)}
  if(!cnt('gjour'))bad.push('journal item');enter('valles',F.RD[0],F.RD[1]+2,0);G.py=F.RD[1]*T+10;triggers();if(G.zone!='valles')bad.push('door not sealed');modal=null;
  G.inv[0]=['gjour',1];G.sel=0;act();if(!modal||modal.name!='Glyph Journal')bad.push('journal open');draw();
  F.decode(F.GLY[0]);const wrong=modal.opts.find(q=>q.t!=F.GLY[0].w);wrong.f();if(G.gly.d.we)bad.push('wrong accepted');modal=null;
  for(const g of F.GLY){F.decode(g);modal.opts.find(q=>q.t==g.w).f();modal=null}if(!G.gly.open)bad.push('not open');
  const theo=NPCS.find(n=>n.id=='theo');delete G.talked['theo'+G.day];G.rheard={};chat(theo);if(!modal.pages.some(p=>/address/.test(p)))bad.push('theo');modal=null;
  enter('valles',F.RD[0],F.RD[1]+1,0);G.py=F.RD[1]*T+10;triggers();if(G.zone!='ruins')bad.push('enter ruins '+G.zone);if(FM16.state().cg!='ruins')bad.push('ruins cg');modal=null;
  if(bad.length)throw new Error(bad.join(' | '));return F.GLY.length+' glyphs found+decoded'}));
 await t('v24: ruins - pillar order puzzle, lamp lever puzzle, Sentinel boss fight with rings/bolts/shield, rewards, mural CG',async()=>ev(()=>{const F=FM21,bad=[];G.inv=G.inv.map((s,i)=>i<4?s:null);const q=F.gl();q.open=1;q.g1=0;q.g2=0;q.boss=0;q.pil=[];q.lev=[0,0,0,0];G.time=12*60;enter('ruins',4,13,0);modal=null;CUT=null;
  if(!solidAt(10*T+8,7*T+8))bad.push('gate1 open early');const pk=id=>Object.keys(F.PIL).find(k=>F.PIL[k]==id).split(',').map(Number);
  F.ruinsAct(...pk('sleep'));modal=null;if(q.pil.length)bad.push('wrong order kept');for(const id of F.PORD){F.ruinsAct(...pk(id));modal=null}if(!q.g1||solidAt(10*T+8,7*T+8))bad.push('gate1');
  F.ruinsAct(...F.LEV[1]);if(q.lev.join('')!='1110')bad.push('lever toggle '+q.lev);F.ruinsAct(...F.LEV[1]);F.ruinsAct(...F.LEV[0]);F.ruinsAct(...F.LEV[3]);modal=null;if(!q.g2||solidAt(20*T+8,8*T+8))bad.push('gate2');
  F.ruinsAct(25,2);if(q.mural)bad.push('mural early');modal=null;
  enter('ruins',22,8,1);F.resetBoss();G.hp=100;modal=null;menu=null;CUT=null;update();const b=F.bossRT();if(!b.awake)bad.push('awake '+JSON.stringify([!!modal,modal&&modal.name,!!menu,G.zone,G.px]));let hurtSeen=0;G.px=b.x-60;G.py=b.y;for(let i=0;i<400;i++){const h=G.hp;modal=null;menu=null;CUT=null;update();if(G.hp<h)hurtSeen++;G.hp=100;invT=0}if(!hurtSeen)bad.push('boss never hits');
  G.inv[1]=['blade',1];G.sel=1;b.sh=50;const hp0=b.hp;G.px=b.x-20;G.py=b.y;act();if(b.hp!=hp0)bad.push('shield');b.sh=0;
  for(let i=0;i<500&&!b.dead;i++){G.px=b.x-20;G.py=b.y;b.sh=0;modal=null;menu=null;act();swingT=0;G.hp=100;invT=0;update()}if(!b.dead||!q.boss)bad.push('boss not dead');if(FM16.state().cg!='sentinel')bad.push('boss cg');if(!cnt('acore')||!G.cos.hats.circlet)bad.push('rewards');modal=null;CUT=null;
  F.ruinsAct(25,2);if(!q.mural||FM16.state().cg!='mural')bad.push('mural');modal=null;checkAch();if(!G.ach.sentinel)bad.push('ach');
  if(bad.length)throw new Error(bad.join(' | '));return 'puzzles + boss ok'}));
 await t('v24: cozy - radio stations change music + talk ticker, sprinkler spray & rain sound, seasonal window views',async()=>ev(()=>{const F=FM21,bad=[];G.time=12*60;
  enter('home',4,2,0);G.dir=0;interact();if(!modal||!/Radio/.test(modal.name))bad.push('radio interact');const mus={};for(const k of['lofi','jazz','news','static']){modal.opts.find(q=>q.t.includes(F.STATIONS[k].n)).f();for(let i=0;i<4;i++){modal=null;menu=null;CUT=null;update()}mus[k]=AU.zone;if(AU.zone!=F.STATIONS[k].s)bad.push('music '+k+'='+AU.zone);G.dir=0;interact()}modal=null;
  if(F.newsLines().length<3||F.staticLines().length<1)bad.push('lines');G.radio='off';update();if(/^r_/.test(AU.zone))bad.push('off');
  const cnt0={n:0};const _n=noise;window.noise=noise=function(){cnt0.n++;};AU.sfx=1;const hadCtx=AU.ctx;if(!AU.ctx)AU.ctx={};
  enter('farm',13,9,2);G.objs['14,10']='spr';G.time=6*60+20;for(let i=0;i<60;i++)update();noise=_n;window.noise=_n;if(!hadCtx)AU.ctx=null;if(!cnt0.n)bad.push('no sprinkler sound');if(!F.spraying())bad.push('spray');delete G.objs['14,10'];
  enter('home',7,3,2);const sig=[];for(const s of[0,1,2,3]){G.day=1+s*7;G.time=12*60;cx.save();F.windowView(0,0,false);sig.push(cx.getImageData(2,9,12,3).data.join(','));cx.restore()}if(new Set(sig).size<4)bad.push('window seasons '+new Set(sig).size);
  if(bad.length)throw new Error(bad.join(' | '));return 'stations '+Object.values(mus).join('/')}));
 await t('v24: debug menu - glyph/ruins/home warps, CG + boss events, cosmetics/glyph/radio gives',async()=>ev(()=>{const el=()=>document.getElementById('dbg');G.dbgSandbox=1;const bad=[];
  const find=(tab,l)=>{FM17.openDbg();FM17.setTab(tab);return[...el().querySelectorAll('.bd button')].find(b=>b.textContent.startsWith(l))};
  for(const[tab,l]of[['Warp','Glyph: we'],['Warp','Canyon ruins door'],['Warp','Ruins: Sentinel arena'],['Events','CG: Ruins'],['Events','CG: Mural'],['Events','Fight the Sentinel'],['Events','Radio menu'],['Give','All hats'],['Give','Decode all'],['Give','Defeat Sentinel'],['Give','Radio: 88.1']]){if(!find(tab,l))bad.push(tab+'/'+l)}
  find('Give','All hats').click();if(Object.keys(G.cos.hats).length<8)bad.push('all hats');find('Warp','Martian Ruins').click();if(G.zone!='ruins')bad.push('warp ruins');FM17.closeDbg();delete G.dbgSandbox;
  if(bad.length)throw new Error(bad.join(' | '));return 'ok'}));
 await t('v25: portrait hat overlay + outfit tint, hat on spacesuit, 10-heart CGs, spouse chores/corner, lum balance',async()=>ev(async()=>{const bad=[],w=ms=>new Promise(r=>setTimeout(r,ms)),F=FM21;FM17.closeDbg();modal=null;menu=null;CUT=null;G.cos=null;
  F.gain('hats','crown');F.wear('crown');F.gain('dyes','crimson');F.dye('top','crimson');say('You',['test'],null,PLOOK);await w(500);draw();const s=FM22.state();if(!s.ov)bad.push('no hat overlay');if(!s.tint)bad.push('no tint');
  F.wear(null);F.dye('top','teal');draw();await w(100);draw();if(FM22.state().ov||FM22.state().tint)bad.push('overlay not hidden');modal=null;
  F.wear('miner');if(charSprite(PLOOK,0,0,1)===charSprite(Object.assign({},PLOOK,{hat:null}),0,0,1))bad.push('suit hat');
  for(const id of['ava','kai','zara','theo','nyx']){modal=null;if(window.FM16)FM16.state().cg=null;G.hearts[id]=10;delete G.events[id+'h10'];talk(NPCS.find(q=>q.id==id));if(!G.events[id+'h10'])bad.push('h10 '+id);if(FM16.state().cg!='h10_'+id)bad.push('cg '+id)}
  modal=null;G.spouse='ava';const before=G.stats.chores||0;for(let i=0;i<5;i++){modal=null;sleep()}if((G.stats.chores||0)<=before)bad.push('no chores');modal=null;
  enter('home',8,3,2);for(let i=0;i<5;i++){update();draw()}
  G.zone='farm';enter('farm',13,9,2);G.tiles['10,10']={c:'wht',g:0,w:0};const r=npcRT.ava;if(r){r.zone='farm';r.x=10*T+8;r.y=12*T+8;r.path=null;r.chore=null;for(let i=0;i<240&&!r.chore;i++)FM22.spouseFarm();if(r.chore!='10,10')bad.push('no chore target '+r.chore);r.path=[];FM22.spouseFarm();if(!G.tiles['10,10'].w)bad.push('spouse did not water')}
  if(CROPS.lum.v>90)bad.push('lum value');G.spouse=null;delete G.tiles['10,10'];modal=null;return bad.length?bad.join(';'):'ok'}).then(r=>{if(r!='ok')throw new Error(r)}));
 await t('v25: debug menu - 10-heart replays, spouse chore, relationship gives',async()=>ev(()=>{G.dbgSandbox=1;FM17.openDbg?FM17.openDbg():0;const bad=[];FM17.setTab('Events');let h=document.getElementById('dbg').innerHTML;if(!/10♥ ava/.test(h))bad.push('ev');FM17.setTab('Give');h=document.getElementById('dbg').innerHTML;if(!/10 hearts: nyx/.test(h))bad.push('give');FM17.closeDbg();return bad.join(';')||'ok'}).then(r=>{if(r!='ok')throw new Error(r)}));
 await t('v26: crisp rendering - hi-DPI world canvas, full-res text overlay, text cleared under panels, world-coord pixel probes',async()=>ev(async()=>{const bad=[];FM17.closeDbg();modal=null;menu=null;CUT=null;enter('farm',13,9,2);draw();
  const kw=cv.width/W,tc=document.getElementById('txt'),dpr=devicePixelRatio,S2=parseFloat(cv.style.width)/W;if(kw<1.99)bad.push('world K '+kw);if(!tc)bad.push('no overlay');else{const kt=tc.width/W;if(Math.abs(kt-Math.min(S2*dpr,Math.sqrt(4.2e6/(W*H))))>.05)bad.push('overlay K '+kt);if(tc.style.width!=cv.style.width||tc.style.left!=cv.style.left)bad.push('overlay misaligned')}
  const d=FM23B.tx.getImageData(0,0,tc.width,Math.round(tc.height*.2)).data;let n=0;for(let i=3;i<d.length;i+=4)if(d[i]>200)n++;if(n<200)bad.push('HUD text missing on overlay '+n);
  // a panel drawn over text clears it
  FM23B.tx.setTransform(1,0,0,1,0,0);txt('XXXXXXXX',100,100,'#fff',8);panel(90,88,80,20);const k=tc.width/W,p=FM23B.tx.getImageData(Math.round(110*k),Math.round(96*k),Math.round(30*k),Math.round(6*k)).data;let left=0;for(let i=3;i<p.length;i+=4)if(p[i]>100)left++;if(left>5)bad.push('text not covered '+left);
  const px=cx.getImageData(0,0,4,4);if(px.width!=4||px.data.length!=64)bad.push('probe size');return bad.join(';')||'ok'}).then(r=>{if(r!='ok')throw new Error(r)}));
 await t('v26: textures - 2x tiles with generated detail maps, per-zone material, cached bg at 2x, toggle',async()=>ev(async()=>{const bad=[];for(let i=0;i<40&&!FM23T.ready();i++)await new Promise(r=>setTimeout(r,100));if(!FM23T.ready())bad.push('tex not loaded');
  for(const k in TC)delete TC[k];for(const k in BGK)delete BGK[k];const a=tileImg('farm','g',1),b=tileImg('mine','.',0),c=tileImg('home','o',2);if(a.width!=32)bad.push('tile not 2x');
  const flat=x=>{const q=document.createElement('canvas');q.width=q.height=32;const g=q.getContext('2d');g.imageSmoothingEnabled=false;g.drawImage(x._base,0,0,32,32);return q.getContext('2d').getImageData(0,0,32,32).data};
  for(const[nm,t]of[['farm',a],['mine',b],['home',c]]){const f=flat(t),d=t.getContext('2d').getImageData(0,0,32,32).data;let diff=0;for(let i=0;i<d.length;i+=4)diff+=Math.abs(d[i]-f[i]);if(diff/1024<2)bad.push(nm+' untextured '+(diff/1024).toFixed(1))}
  enter('farm',13,9,2);draw();const bg=bgCache('farm',curMap());if(!bg||bg._s!=2)bad.push('bg not 2x');
  FM23TEX.on=false;for(const k in TC)delete TC[k];const e=tileImg('farm','g',1);const f=flat(e),dd=e.getContext('2d').getImageData(0,0,32,32).data;let df=0;for(let i=0;i<dd.length;i+=4)df+=Math.abs(dd[i]-f[i]);if(df)bad.push('toggle off failed');FM23TEX.on=true;for(const k in TC)delete TC[k];for(const k in BGK)delete BGK[k];
  return bad.join(';')||'ok'}).then(r=>{if(r!='ok')throw new Error(r)}));
 await t('v26: HD anime sprites match portrait designs (hair colour, signature items) for player + all NPCs, all dirs, hats & suit',async()=>ev(()=>{const _ill=window.FM24&&FM24.ILL.on;if(window.FM24)FM24.ILL.on=false;const bad=[];const hex=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16));
  FM21.wear(null);const looks=[['you',PLOOK],...['ava','kai','zara','theo','nyx','pip','ruiz','mo','vega'].map(id=>[id,NPCS.find(q=>q.id==id).look])];
  for(const[id,L]of looks){for(let d=0;d<4;d++){const c=charSprite(L,d,d&1,0,0);if(c.width!=72)bad.push(id+' not HD')}
   const c=charSprite(L,2,0,0,0),D=c.getContext('2d').getImageData(0,0,72,40).data,[r,g,b]=hex(L.hair);let hn=0;for(let i=0;i<D.length;i+=4)if(D[i+3]>200&&Math.abs(D[i]-r)<14&&Math.abs(D[i+1]-g)<14&&Math.abs(D[i+2]-b)<14)hn++;if(hn<60)bad.push(id+' hair '+hn)}
  const sig={you:'#ffd23a',ava:'#7ad0ff',kai:'#f4f0ec',ruiz:'#2a8a5a',vega:'#7a1a3a',zara:'#ff3ad0',pip:'#d02a2a'};
  for(const id in sig){const L=id=='you'?PLOOK:NPCS.find(q=>q.id==id).look,c=charSprite(L,2,0,0,0),D=c.getContext('2d').getImageData(0,0,72,108).data,[r,g,b]=hex(sig[id]);let n=0;for(let i=0;i<D.length;i+=4)if(D[i+3]>200&&Math.abs(D[i]-r)<16&&Math.abs(D[i+1]-g)<16&&Math.abs(D[i+2]-b)<16)n++;if(n<6)bad.push(id+' signature '+n)}
  FM21.gain('hats','crown');FM21.wear('crown');const h1=charSprite(PLOOK,2,0,0,0).toDataURL();FM21.wear(null);const h0=charSprite(PLOOK,2,0,0,0).toDataURL();if(h1==h0)bad.push('hat not drawn');
  if(charSprite(PLOOK,2,0,1,0).toDataURL()==h0)bad.push('suit same');FM23.HD.on=false;if(charSprite(PLOOK,2,0,0,0).width!=18)bad.push('HD toggle');FM23.HD.on=true;if(window.FM24)FM24.ILL.on=_ill;return bad.join(';')||'ok'}).then(r=>{if(r!='ok')throw new Error(r)}));
 await t('v26: debug menu - graphics toggles + sprite/portrait gallery',async()=>ev(()=>{G.dbgSandbox=1;FM17.openDbg();FM17.setTab('View');const el=document.getElementById('dbg'),h=el.innerHTML,bad=[];for(const s of['v26: Graphics','HD sprites','Crisp text layer','Textures','World res 3x','Sprites vs portraits'])if(!h.includes(s))bad.push(s);if(!el.querySelector('canvas'))bad.push('gallery');FM17.closeDbg();return bad.join(';')||'ok'}).then(r=>{if(r!='ok')throw new Error(r)}));

 await t('v27: illustrated sprites load for player + 9 NPCs, 4 unique dirs, suit/hat/dye, fallback to v26, kid portrait look',async()=>ev(async()=>{const bad=[],w=ms=>new Promise(r=>setTimeout(r,ms));
  for(let i=0;i<50&&!(FM24&&FM24.ILL.ready);i++)await w(80);
  if(!FM24.ILL.ready)bad.push('sheets not ready');
  FM24.ILL.on=true;FM24.CACHE.clear();FM21.wear(null);
  const ids=['you','ava','kai','zara','theo','nyx','pip','ruiz','mo','vega'];
  for(const id of ids){const L=id=='you'?PLOOK:NPCS.find(q=>q.id==id).look;const urls=new Set();
   for(let d=0;d<4;d++){const c=charSprite(L,d,0,0,0);if(!c._ill)bad.push(id+' not illustrated');if(c.width!=72)bad.push(id+' size '+c.width);urls.add(c.toDataURL())}
   if(urls.size<4)bad.push(id+' dirs not unique '+urls.size)}
  const base=charSprite(PLOOK,2,0,0,0).toDataURL();
  if(charSprite(PLOOK,2,0,1,0).toDataURL()==base)bad.push('suit');
  FM21.gain('hats','crown');FM21.wear('crown');if(charSprite(PLOOK,2,0,0,0).toDataURL()==base)bad.push('hat');FM21.wear(null);
  FM21.gain('dyes','crimson');FM21.dye('top','crimson');if(charSprite(PLOOK,2,0,0,0).toDataURL()==base)bad.push('dye');FM21.dye('top','teal');
  FM24.ILL.on=false;if(charSprite(PLOOK,2,0,0,0)._ill)bad.push('fallback');FM24.ILL.on=true;
  const kid={skin:'#e8b48a',hair:'#ff9ac8',style:'bob',top:'#ffd27a',pants:'#5a8ac8',acc:'#fff'};const kc=charSprite(kid,2,0,0,0);if(!kc._ill)bad.push('kid sheet');
  const baby={skin:'#e8b48a',hair:'#1e2a5e',style:'bob',top:'#ffd27a',pants:'#5a8ac8',acc:'#fff'};const bc=charSprite(baby,2,0,0,0);if(!bc._ill)bad.push('baby not illustrated');if(bc.toDataURL()==kc.toDataURL())bad.push('baby used untinted pink kid sheet');
  return bad.join(';')||'ok'}).then(r=>{if(r!='ok')throw new Error(r)}));
 await t('v27: debug View toggle + portrait/v26/v27 gallery',async()=>ev(()=>{G.dbgSandbox=1;FM17.openDbg();FM17.setTab('View');const el=document.getElementById('dbg'),h=el.innerHTML,bad=[];
  for(const s of['v28: Illustrated sprites','Illustrated (v28)','Portraits · v26 · v28','Sprite size','Walk cycles'])if(!h.includes(s))bad.push('missing '+s);
  const g=FM24.gallery();if(!g||g.width<800)bad.push('gallery');FM17.closeDbg();return bad.join(';')||'ok'}).then(r=>{if(r!='ok')throw new Error(r)}));

 await t('v28: walk frames unique per direction, no back satchel, capless hats, pants dye, baby tint, NPC suit, sprite scale',async()=>ev(async()=>{
  const bad=[],w=ms=>new Promise(r=>setTimeout(r,ms));
  for(let i=0;i<50&&!(FM25&&FM25.ILL.ready);i++)await w(80);
  if(!FM25||!FM25.ILL.ready)bad.push('v28 sheets not ready');
  FM25.ILL.on=true;FM24.ILL.on=true;FM25.CACHE.clear();FM21.wear(null);
  const ids=['you','ava','kai','zara','theo','nyx','pip','ruiz','mo','vega','kid'];
  for(const id of ids){
    const L=id=='you'?PLOOK:id=='kid'?{skin:'#e8b48a',hair:'#ff9ac8',style:'bob',top:'#ffd27a',pants:'#5a8ac8'}:NPCS.find(q=>q.id==id).look;
    for(let d=0;d<4;d++){const urls=new Set();for(let f=0;f<4;f++){const c=charSprite(L,d,f,0,0);if(!c._ill)bad.push(id+' f'+f+' not ill');urls.add(c.toDataURL())}if(urls.size<3)bad.push(id+' d'+d+' walk '+urls.size)}
  }
  const brown=c=>{const d=c.getContext('2d').getImageData(0,0,c.width,c.height).data,w=c.width,h=c.height;let n=0;for(let y=h*0.58|0;y<h*0.82;y++)for(let x=w*0.45|0;x<w;x++){const i=(y*w+x)*4,r=d[i],g=d[i+1],b=d[i+2],a=d[i+3];if(a>180&&r>70&&r<160&&g<100&&b<80&&r>g+16&&r>b+25)n++}return n};
  const bak=charSprite(PLOOK,0,0,0,0);if(brown(bak)>40)bad.push('satchel brown '+brown(bak));
  const capPx=c=>{const d=c.getContext('2d').getImageData(0,0,c.width,c.height).data,w=c.width,h=c.height;let n=0;for(let y=0;y<h*0.36;y++)for(let x=0;x<w;x++){const i=(y*w+x)*4,r=d[i],g=d[i+1],b=d[i+2],a=d[i+3];if(a>180&&g>r+6&&g>b-4&&g>40&&g<200)n++}return n};
  FM21.wear(null);const cap0=capPx(charSprite(PLOOK,2,0,0,0));FM21.gain('hats','crown');FM21.wear('crown');const hatC=charSprite(PLOOK,2,0,0,0),cap1=capPx(hatC);if(cap1>cap0*0.5)bad.push('cap peeks '+cap1+'/'+cap0);FM21.wear(null);
  PLOOK.pants='#3a3a5a';if(G.look)G.look.pants='#3a3a5a';if(G.cos)G.cos.dye_pants=null;FM25.CACHE.clear();
  const base=charSprite(PLOOK,2,0,0,0);
  FM21.gain('dyes','crimson');FM21.dye('pants','crimson');const dyed=charSprite(PLOOK,2,0,0,0);if(base.toDataURL()==dyed.toDataURL())bad.push('pants dye no change');
  // pants region should have more crimson-ish pixels
  const lowRed=c=>{const d=c.getContext('2d').getImageData(0,0,c.width,c.height).data,w=c.width,h=c.height;let n=0;for(let y=h*0.62|0;y<h*0.90;y++)for(let x=0;x<w;x++){const i=(y*w+x)*4;if(d[i+3]>180&&d[i]>d[i+1]+20&&d[i]>d[i+2]+20)n++}return n};
  if(lowRed(dyed)<=lowRed(base))bad.push('pants not reddened');
  const eyeRed=c=>{const d=c.getContext('2d').getImageData(0,0,c.width,c.height).data,w=c.width,h=c.height;let n=0;for(let y=h*0.28|0;y<h*0.50;y++)for(let x=0;x<w;x++){const i=(y*w+x)*4;if(d[i+3]>180&&d[i]>d[i+1]+25&&d[i]>d[i+2]+15)n++}return n};
  FM21.dye('top','crimson');FM25.CACHE.clear();const topD=charSprite(PLOOK,2,0,0,0);if(eyeRed(topD)>eyeRed(base)+8)bad.push('eyes dyed '+eyeRed(topD)+'/'+eyeRed(base));
  PLOOK.pants='#3a3a5a';if(G.look)G.look.pants='#3a3a5a';if(G.cos)G.cos.dye_pants=null;FM21.dye('top','teal');
  const baby={skin:'#e8b48a',hair:'#1e2a5e',style:'bob',top:'#ffd27a',pants:'#5a8ac8',acc:'#fff'};
  const bc=charSprite(baby,2,0,0,0),kc=charSprite({skin:'#e8b48a',hair:'#ff9ac8',style:'bob',top:'#ffd27a',pants:'#5a8ac8',acc:'#fff'},2,0,0,0);
  if(!bc._ill)bad.push('baby not ill');if(bc.toDataURL()==kc.toDataURL())bad.push('baby==kid');
  const ava=NPCS.find(q=>q.id=='ava').look;if(charSprite(ava,2,0,1,0).toDataURL()==charSprite(ava,2,0,0,0).toDataURL())bad.push('npc suit same');
  const sc=FM25.SCALE.v;FM25.SCALE.v=1.45;enter('farm',13,9,2);if(!feetFree(G.px,G.py))bad.push('scale feet');enter('farm',15,1,2);if(!feetFree(G.px,G.py))bad.push('scale door');FM25.SCALE.v=sc;enter('farm',13,9,2);
  return bad.join(';')||'ok'}).then(r=>{if(r!='ok')throw new Error(r)}));
 await t('v28: debug View size toggle + walk gallery',async()=>ev(()=>{G.dbgSandbox=1;FM17.openDbg();FM17.setTab('View');const el=document.getElementById('dbg'),h=el.innerHTML,bad=[];
  for(const s of['v28: Illustrated sprites','Sprite size 1','Sprite size 1.25','Sprite size 1.45','Walk cycles (front)','Portraits · v26 · v28'])if(!h.includes(s))bad.push('missing '+s);
  if(!/Sprite size 1(\.25|\.45)? ✓/.test(h)&&!h.includes('Sprite size 1 ✓'))bad.push('no size checkmark');
  const g=FM25.gallery(),w=FM25.walkStrip();if(!g||g.width<800)bad.push('gallery');if(!w||w.height<200)bad.push('walk strip');FM17.closeDbg();return bad.join(';')||'ok'}).then(r=>{if(r!='ok')throw new Error(r)}));
 await t('v28 screenshots',async()=>{const S=async(n,f,ms=500)=>{await ev(f);await new Promise(r=>setTimeout(r,ms));await page.screenshot({path:path.join(SHOTS,n)})};
  await ev(()=>{FM17.closeDbg();modal=null;CUT=null;menu=null;G.tut=99;G.time=12*60;FM21.wear(null);FM24.ILL.on=true;if(FM25){FM25.ILL.on=true;FM25.CACHE.clear()}});
  await S('fm28_walk_strip.png',()=>{const c=FM25.walkStrip();document.body.appendChild(c);c.id='fm28walk';c.style.cssText='position:fixed;left:0;top:0;width:100%;height:100%;background:#140818;z-index:99';},200);
  await ev(()=>{const c=document.getElementById('fm28walk');if(c)c.remove()});
  await S('fm28_dirs_grid.png',()=>{const ids=['you','ava','kai','zara','theo','nyx','pip','ruiz','mo','vega','kid'],c=document.createElement('canvas');c.width=72*4+8;c.height=ids.length*108+8;const g=c.getContext('2d');g.fillStyle='#140818';g.fillRect(0,0,c.width,c.height);
    ids.forEach((id,i)=>{const L=id=='you'?PLOOK:id=='kid'?{skin:'#e8b48a',hair:'#ff9ac8',style:'bob',top:'#ffd27a',pants:'#5a8ac8'}:NPCS.find(q=>q.id==id).look;for(let d=0;d<4;d++){const s=charSprite(L,d,0,0,0);g.drawImage(s,4+d*72,4+i*108)}});
    c.id='fm28grid';c.style.cssText='position:fixed;left:0;top:0;width:auto;height:100%;background:#140818;z-index:99';document.body.appendChild(c)},200);
  await ev(()=>{const c=document.getElementById('fm28grid');if(c)c.remove()});
  await S('fm28_hat_nocap.png',()=>{FM21.gain('hats','crown');FM21.wear('crown');FM21.dye('top','teal');FM21.dye('pants','navy');enter('farm',13,9,2);G.dir=2;G.moving=0});
  await S('fm28_dye_pants.png',()=>{FM21.wear(null);FM21.gain('dyes','crimson');FM21.dye('top','crimson');FM21.dye('pants','crimson');enter('farm',13,9,2);G.dir=2;G.moving=0});
  await ev(()=>{FM21.dye('top','teal');FM21.dye('pants','navy');FM21.wear(null)});
 });

 await t('v25 screenshots',async()=>{const S=async(n,f,ms=500)=>{await ev(f);await new Promise(r=>setTimeout(r,ms));await page.screenshot({path:path.join(SHOTS,n)})};
  await S('fm25_portrait_straw.png',()=>{FM17.closeDbg();modal=null;CUT=null;G.tut=99;G.time=12*60;enter('farm',13,9,2);FM21.gain('hats','straw');FM21.wear('straw');FM21.gain('dyes','crimson');FM21.dye('top','crimson');say('You',['Straw hat weather.'],null,PLOOK)},800);
  await S('fm25_portrait_crown.png',()=>{modal=null;FM21.gain('hats','crown');FM21.wear('crown');FM21.gain('dyes','gold');FM21.dye('top','gold');say('You',['Starfall champion.'],null,PLOOK)},800);
  await S('fm25_suit_hat.png',()=>{modal=null;FM21.wear('miner');enter('surf',50,9,2)});
  for(const id of['ava','kai','zara','theo','nyx'])await S('fm25_cg_h10_'+id+'.png',new Function("modal=null;FM16.showCG('h10_"+id+"',"+JSON.stringify(id)+",['♥']);modal.ch=1e4"),700);
  await S('fm25_cg_sentinel.png',()=>{FM16.showCG('sentinel','The Sentinel Rests',['It was keeping a promise.']);modal.ch=1e4},700);
  await S('fm25_spouse_corner.png',()=>{modal=null;G.spouse='zara';G.time=20*60;enter('home',4,4,0)});
  await S('fm25_chores.png',()=>{modal=null;G.spouse='kai';sleep()});
  await ev(()=>{modal=null;G.spouse=null;enter('farm',13,9,2)});return 'saved'});
 await t('v24 screenshots',async()=>{const sh=async(n,f)=>{const keep=/cg_|journal|tailor|radio_menu/.test(n);await ev(f);await new Promise(r=>setTimeout(r,150));if(!keep)await ev(()=>{modal=null;CUT=null});await new Promise(r=>setTimeout(r,300));if(!keep){await ev(()=>{modal=null});await new Promise(r=>setTimeout(r,120))}await page.screenshot({path:path.join(SHOTS,n)})};
  await sh('fm24_hats_home.png',()=>{FM17.closeDbg();modal=null;CUT=null;G.tut=99;G.time=12*60;G.day=8;const F=FM21;for(const k in F.HATS)F.gain('hats',k);F.gain('dyes','rose');F.dye('top','rose');F.wear('miner');F.cos().loom=1;F.gain('walls','stars');F.setRoom('wall','stars');F.gain('floors','wood');F.setRoom('floor','wood');G.radio='lofi';enter('home',8,3,2)});
  await sh('fm24_tailor.png',()=>{FM21.wear('straw');G.px=10*T+8;G.py=3*T+8;G.dir=0;FM21.tailorMenu()});
  await sh('fm24_window_frost.png',()=>{modal=null;G.day=16;G.time=12*60;FM21.wear('beanie');FM21.setRoom('wall','leaf');FM21.setRoom('floor','check');enter('home',4,2,0)});
  await sh('fm24_radio_news.png',()=>{G.day=8;G.radio='news';enter('home',4,2,0);for(let i=0;i<120;i++)update()});
  await sh('fm24_sprinklers.png',()=>{G.radio='off';G.objs['14,11']='qspr';G.objs['10,11']='spr';G.time=6*60+15;FM21.wear('party');enter('farm',12,13,0);for(let i=0;i<30;i++)update()});
  await sh('fm24_glyph_canyon.png',()=>{delete G.objs['14,11'];delete G.objs['10,11'];G.time=12*60;G.gly=null;FM21.wear('angler');const g=FM21.GLY[2];const p=FM20.nearFree('valles',g.x,g.y);enter('valles',p[0]-2,p[1]+1,1)});
  await sh('fm24_journal.png',()=>{const q=FM21.gl();for(const g of FM21.GLY.slice(0,5))q.f[g.id]=1;for(const g of FM21.GLY.slice(0,3))q.d[g.id]=1;FM21.journal()});
  await sh('fm24_ruins_door.png',()=>{modal=null;const q=FM21.gl();for(const g of FM21.GLY){q.f[g.id]=1;q.d[g.id]=1}q.open=1;enter('valles',FM21.RD[0],FM21.RD[1]+2,0)});
  await sh('fm24_cg_ruins.png',()=>{FM16.showCG('ruins','The Martian Ruins',['Stairs of fitted stone lead down into a vast hall.']);modal.ch=1e4});
  await sh('fm24_ruins_pillars.png',()=>{modal=null;const q=FM21.gl();q.g1=0;q.g2=0;q.pil=['we','sleep'];FM21.wear('circlet');enter('ruins',5,8,0)});
  await sh('fm24_ruins_levers.png',()=>{const q=FM21.gl();q.g1=1;q.lev=[1,1,0,0];enter('ruins',15,10,0)});
  await sh('fm24_sentinel_fight.png',()=>{const q=FM21.gl();q.g2=1;q.boss=0;FM21.resetBoss();enter('ruins',22,8,1);G.hp=100;const b=FM21.bossRT();b.awake=1;b.hp=55;for(let i=0;i<170;i++){update();G.hp=100}});
  await sh('fm24_cg_sentinel.png',()=>{FM16.showCG('sentinel','The Sentinel Rests',['It was never angry. It was keeping a promise.']);modal.ch=1e4});
  await sh('fm24_cg_mural.png',()=>{modal=null;FM16.showCG('mural','The Mural',['Wake when the sky is blue again.']);modal.ch=1e4});
  await ev(()=>{modal=null;CUT=null;G.gly=null;G.cos=null;FM21.applyLook();FM21.resetBoss();G.radio='off';G.time=12*60;enter('farm',13,9,2)});return 'saved'});
 await t('v23 screenshots',async()=>{const sh=async(n,f)=>{const keep=/cg_|letter/.test(n);await ev(f);await new Promise(r=>setTimeout(r,150));if(!keep)await ev(()=>{modal=null;CUT=null;if(window.FM16&&FM16.state().cg)modal=null});await new Promise(r=>setTimeout(r,300));if(!keep){await ev(()=>{modal=null});await new Promise(r=>setTimeout(r,120))}await page.screenshot({path:path.join(SHOTS,n)})};
  await sh('fm23_npc_walk.png',()=>{G.tut=99;FM17.closeDbg();modal=null;CUT=null;G.day=9;G.time=8*60+50;placeNPCs(true);enter('city',12,13,2);G.time=9*60;lastHour=-1;for(let i=0;i<200;i++)update()});
  await sh('fm23_npc_chat.png',()=>{G.day=8;G.time=12*60+20;placeNPCs(true);enter('cafe',7,6,0);FM20.syncPairs();NCT=0;NCHAT=null;for(let i=0;i<200;i++)update();if(!NCHAT){NCHAT={p:PAIRS[0],i:0,t:40}}});
  await sh('fm23_earth_letter.png',()=>{modal=null;G.earth=null;G.mail={box:['earth1'],read:{},got:{earth1:1}};readLetter('earth1')});
  await sh('fm23_cg_earth1.png',()=>{modal=null;G.earth={read:{earth1:G.day-5},ch:{earth1:'cheer'}};readLetter('earth2');modal.ch=1e4});
  await sh('fm23_cg_earth3.png',()=>{modal=null;G.earth.ch.earth2='vid';G.earth.ch.earth3='plant';G.earth.ch.earth4='grow';G.earth.read.earth5=null;delete G.earth.read.earth5;readLetter('earth5');modal.ch=1e4});
  await sh('fm23_giant_gourd.png',()=>{modal=null;G.tiles={};G.giant={};FM20.plantGrid('grd',true);FM20.formGiants(true);FM20.plantGrid('stc',false,3,1,14,12);for(const k of['14,12','15,12','16,12'])G.tiles[k].g=1;G.time=12*60;enter('farm',19,16,0)});
  await sh('fm23_lumen_night.png',()=>{FM20.plantGrid('lum',true,6,2,8,13);G.time=22*60;enter('farm',11,16,0)});
  await sh('fm23_fox_wild.png',()=>{G.fox=null;FM20.resetRT();G.time=12*60;enter('surf',FM20.FOXH[0]-2,FM20.FOXH[1],1)});
  await sh('fm23_cg_fox.png',()=>{FM16.showCG('fox','A New Friend',['Ember curls around your boots.']);modal.ch=1e4});
  await sh('fm23_fox_home.png',()=>{modal=null;G.fox={ad:1,n:'Ember',love:5,fed:3};FM20.resetRT();enter('farm',13,9,2);for(let i=0;i<90;i++)update()});
  await sh('fm23_sniffer.png',()=>{G.sniff={ad:1,n:'Pebble',iron:3,found:0};FM20.resetRT();enterMine(3);modal=null;const s=FM20.snRT();G.px=s.x-20;G.py=s.y;for(let i=0;i<150;i++){modal=null;update()}if(G.zone!='mine'){enterMine(3);modal=null}});
  await ev(()=>{modal=null;G.fox=null;G.sniff=null;G.giant={};G.time=12*60;enter('farm',13,9,2)});return 'saved'});
 await t('v22 screenshots',async()=>{const sh=async(n,f,...a)=>{await ev(f,...a);await new Promise(r=>setTimeout(r,450));await page.screenshot({path:path.join(SHOTS,n)})};
  await sh('fm22_oldcol_broken.png',()=>{FM17.closeDbg();modal=null;G.oc=null;G.time=12*60;enter('oldcol',13,7,0)});
  await sh('fm22_oldcol_partial.png',()=>{for(const x of FM19.OCB.slice(0,8))FM19.completeBundle(x,true);enter('oldcol',13,7,0)});
  await sh('fm22_bundle_ui.png',()=>{enter('oldcol',13,11,0);FM19.bundleView(FM19.OCB.find(b=>b.id=='l1'));modal.ch=999});
  await sh('fm22_oldcol_restored.png',()=>{modal=null;for(const x of FM19.OCB)FM19.completeBundle(x,true);enter('oldcol',13,7,0)});
  await sh('fm22_cg_oldcol.png',()=>{FM19.finale();modal.ch=1e4});
  await sh('fm22_surface_entrance.png',()=>{modal=null;G.terra=0;G.tfCG=0;SURF=null;enter('surf',14,37,0)});
  for(const s of[1,2,3])await sh('fm22_terra'+s+'.png',(s)=>{modal=null;G.terra=s;G.tfCG=s;SURF=null;enter('surf',22,30,0)},s);
  await sh('fm22_farm_domeview.png',()=>{G.terra=3;enter('farm',13,2,0)});
  await sh('fm22_cg_tf3.png',()=>{G.terra=3;G.tfCG=2;update();modal.ch=1e4});
  await ev(()=>{modal=null;G.terra=0;G.tfCG=0;enter('farm',13,9,2)});return 'saved'});
 await t('v21 screenshots',async()=>{const shot=async(n,f)=>{await ev(f);await new Promise(r=>setTimeout(r,400));await page.screenshot({path:path.join(SHOTS,n)})};
  await shot('fm21_phobos.png',()=>{FM17.closeDbg();modal=null;G.port=1;enter('phobos',14,8,0);placeNPCs(true)});
  await shot('fm21_springs.png',()=>{enter('springs',8,8,0)});
  await shot('fm21_nyx.png',()=>{enter('phobos',5,5,0);talk(NPCS.find(n=>n.id=='nyx'));modal.ch=1e4});
  await shot('fm21_derby.png',()=>{modal=null;FM18.derbyStart();for(let i=0;i<30;i++)update()});
  await shot('fm21_lowg.png',()=>{modal=null;if(window.FM18&&FM18.DERBY){FM18.DERBY.over=999;onTap(1,1)}FM18.lgStart();for(let i=0;i<20;i++)update()});
  await shot('fm21_cg_phobos.png',()=>{modal=null;if(FM18.LG){FM18.LG.over=999;onTap(1,1)}FM16.showCG('phobos','Phobos',['Mars fills the window.']);modal.ch=1e4});
  await shot('fm21_cg_springs.png',()=>{FM16.showCG('springs','Springs',['Warm water.']);modal.ch=1e4});
  await ev(()=>{modal=null;enter('farm',13,9,2)});return 'saved'});
};
