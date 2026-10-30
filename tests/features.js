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
  const p=ENTS.find(e=>e.t=='sglass');G.px=p.x;G.py=p.y;G.sel=G.inv.findIndex(q=>!q);interact();if(!G.inv.some(q=>q&&q[0]=='sglass'))throw new Error('no glass pickup');G.wx=null;return gl+' glass, '+wr.length+' wraiths'}));
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
 await t('homes: 8 doors open, spawns walkable, exits back, reachable sit spots',async()=>ev(()=>{const H=FM12.HOMES,out=[];if(Object.keys(H).length<8)throw new Error('homes '+Object.keys(H).length);
  for(const id in H){const h=H[id],z=FM12.HOMEZ(id);if(!NPCS.find(n=>n.id==id))throw new Error('no npc '+id);G.time=600;G.hearts[id]=0;
   if(MAPS.city[h.door[1]][h.door[0]]!='D')throw new Error('door tile '+id);if(isSolid('city',MAPS.city[h.out[1]][h.out[0]]))throw new Error('out solid '+id);
   enter('city',h.out[0],h.out[1],0);G.px=h.door[0]*T+8;G.py=h.door[1]*T+10;triggers();if(G.zone!=z)throw new Error('enter '+id+' -> '+G.zone);if(!feetFree(G.px,G.py))throw new Error('spawn '+id);
   const m=MAPS[z],seen={},q=[[5,6]];seen['5,6']=1;while(q.length){const[x,y]=q.shift();for(const[dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]]){const a=x+dx,b=y+dy;if(!m[b]||m[b][a]==null||seen[a+','+b]||isSolid(z,m[b][a]))continue;seen[a+','+b]=1;q.push([a,b])}}
   if(!seen[h.sit[0]+','+h.sit[1]])throw new Error('sit unreachable '+id);if(!seen['5,7'])throw new Error('door unreachable '+id);
   for(let i=0;i<3;i++){update();draw()}G.px=5*T+8;G.py=7*T+6;triggers();if(G.zone!='city')throw new Error('exit '+id);if(Math.floor(G.px/T)!=h.out[0]||Math.floor(G.py/T)!=h.out[1])throw new Error('exit pos '+id);out.push(id)}
  return out.length+' homes ok'}));
 await t('homes: locked late at night unless 6+ hearts; residents home on schedule',async()=>ev(()=>{const h=FM12.HOMES.kai;G.spouse=null;G.time=23*60;G.hearts.kai=0;enter('city',h.out[0],h.out[1],0);G.px=h.door[0]*T+8;G.py=h.door[1]*T+10;triggers();if(G.zone!='city')throw new Error('not locked');
  G.hearts.kai=6;G.px=h.door[0]*T+8;G.py=h.door[1]*T+10;triggers();if(G.zone!='h_kai')throw new Error('6 hearts locked');
  const bad=[];for(const tm of[6*60+30,23*60]){G.time=tm;placeNPCs(true);for(const id in FM12.HOMES)if(npcRT[id].zone!='h_'+id)bad.push(id+'@'+tm+'='+npcRT[id].zone)}
  G.time=12*60;placeNPCs(true);const away=Object.keys(FM12.HOMES).filter(id=>npcRT[id].zone.startsWith('h_'));if(bad.length)throw new Error(bad.join(' '));enter('city',16,14,0);return 'ok, at noon home: '+(away.join(',')||'none')}));
 await t('homes: home dialogue, heart event, readable item, gifting at home',async()=>ev(()=>{G.events={theo3:1,theo4:1,theo6:1,theo7:1,theo9:1};const n=NPCS.find(q=>q.id=='theo');G.time=23*60;G.hearts.theo=2;enter('h_theo',5,6,0);placeNPCs(true);G.talked={};talk(n);
  if(!modal||!FM12.HOMES.theo.home.includes(modal.pages[0]))throw new Error('no home line');modal=null;G.hearts.theo=5;G.talked={};const h0=G.hearts.theo;talk(n);if(!modal||!modal.name.includes('Heart Event'))throw new Error('no event');modal=null;if(!(G.hearts.theo>h0))throw new Error('event hearts');
  const f=FM12.HOMES.theo.f.find(f=>f[0]=='starmap');G.px=f[1]*T+8;G.py=1*T+8;G.dir=0;interact();if(!modal||!modal.pages[0].includes('star chart'))throw new Error('read: '+(modal&&modal.pages[0]));modal=null;
  G.gifted={};const i=G.inv.findIndex(q=>!q);G.inv[i]=['crys',1];G.sel=i;G.talked={};const hb=G.hearts.theo;G.px=npcRT.theo.x+14;G.py=npcRT.theo.y;talk(n);const go=modal&&modal.opts&&modal.opts.find(o=>o.t.startsWith('Give'));if(!go)throw new Error('no give option');modal=null;go.f();modal=null;const gave=!G.inv[i]||G.hearts.theo!=hb;G.inv[i]=null;if(!gave)throw new Error('gift failed');enter('city',16,14,0);return 'ok'}));
 await t('character sprites: player/NPC/kid 4 dirs x 4 frames + portraits render, outlined, no errors',async()=>ev(()=>{const looks=[PLOOK,...NPCS.map(n=>n.look),{skin:'#e8b48a',hair:'#ff4aa8',style:'bob',top:'#ffd27a',pants:'#5a8ac8'}];let n=0;
  const c=document.createElement('canvas');c.width=24;c.height=30;const g=c.getContext('2d');for(const L of looks)for(let d=0;d<4;d++)for(let f=0;f<4;f++)for(const o of[{},{suit:1},{swing:1}]){g.clearRect(0,0,24,30);drawChar(g,4,3,L,d,f,o);n++;
   const a=g.getImageData(0,0,24,30).data;let op=0,ol=0;for(let i=0;i<a.length;i+=4){if(a[i+3]==255)op++;if(a[i]==26&&a[i+1]==15&&a[i+2]==26)ol++}if(op<80||ol<20)throw new Error('sprite '+JSON.stringify(L)+' d'+d+' f'+f+' '+op+'/'+ol)}
  const s=FM12.charSprite(NPCS[0].look,1,0),s2=FM12.charSprite(NPCS[0].look,1,1);if(s.toDataURL()==s2.toDataURL())throw new Error('walk frames identical');
  for(const L of looks)for(const m of['','happy','love','angry','sad'])drawPortrait(cx,10,10,L,3,m,false),drawPortrait(cx,10,10,L,2,m,true);return n+' sprites, '+FM12.CC.size+' cached'}));
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
  await ev(()=>{document.getElementById('cmp').remove();modal=null;enter('farm',13,9,2)});return 'saved'});
};
