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
 await t('screenshots',async()=>{const shot=async(n,f)=>{await ev(f);await new Promise(r=>setTimeout(r,450));await page.screenshot({path:path.join(SHOTS,n)})};
  await shot('fm13_museum.png',()=>{for(const i of FM10.MALL.slice(0,22))G.muse[i]=1;enter('museum',6,5,0);G.time=700;modal=null;if(npcRT.theo){npcRT.theo.zone='museum';npcRT.theo.x=10*T+8;npcRT.theo.y=4*T+8}});
  await shot('fm13_dust.png',()=>{G.wx='dust';DUSTD=-1;SURF=null;enter('surf',33,37,0);G.time=800;modal=null});
  await shot('fm13_magma.png',()=>{G.wx=null;enterMine(8);modal=null;G.px=9*T;G.py=8*T;const e=ENTS.filter(e=>e.t=='ember');if(e[0]){e[0].x=G.px+40;e[0].y=G.py-10;e[0].tm=60}});
  await ev(()=>{enter('farm',13,9,2)});return 'saved'});
};
