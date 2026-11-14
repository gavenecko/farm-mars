// ===== v28: walk cycles, capless hats, dye masks, sprite scale, baby, NPC suits =====
(function(){
const CW=144,CH=216,OW=72,OH=108,NF=4,ND=4;
const IDS=['you','ava','kai','zara','theo','nyx','pip','ruiz','mo','vega','kid','suit'];
const SHEET={},CACHE=new Map(),MASKS={};
const ILL={on:localStorage.fmIll!='0',ready:false,n:0,need:IDS.length+1};
const SCALE={v:Math.max(1,Math.min(1.6,+(localStorage.fmSprScale||1.25)))};
function hexRgb(h){h=String(h).replace('#','');if(h.length==3)h=h[0]+h[0]+h[1]+h[1]+h[2]+h[2];return[parseInt(h.slice(0,2),16),parseInt(h.slice(2,4),16),parseInt(h.slice(4,6),16)]}
function pinkHair(h){if(!h||h[0]!='#')return false;try{const[r,g,b]=hexRgb(h);return r>180&&g<160&&b>100&&r>g+20}catch(e){return false}}
function babyLook(look){return !!(look&&look.style=='bob'&&look.top==='#ffd27a'&&look.pants==='#5a8ac8'&&!pinkHair(look.hair))}
function whoId(look){if(!look)return null;if(look===PLOOK||(G&&(look===G.look||look===PLOOK)))return'you';
 const w=window.FM13&&FM13.whoOf(look);if(w&&w!='kid'&&IDS.indexOf(w)>=0)return w;if(w=='you')return'you';
 if(pinkHair(look.hair)&&(w=='kid'||look.style=='bob'))return'kid';
 if(babyLook(look))return'baby';
 return null}
function mkCanvas(w,h){const c=document.createElement('canvas');c.width=w;c.height=h;return c}
function loadOne(id){const im=new Image();im.decoding='async';im.onload=()=>{const s=mkCanvas(OW*NF,OH*ND),g=s.getContext('2d');g.imageSmoothingEnabled=true;g.imageSmoothingQuality='high';g.drawImage(im,0,0,s.width,s.height);SHEET[id]=s;buildMasks(id,s);if(++ILL.n>=ILL.need){ILL.ready=true;prewarm()}};im.onerror=()=>{ILL.need--;if(ILL.n>=ILL.need){ILL.ready=true;prewarm()}};im.src='assets/sprites/'+id+'.webp?v=28'}
function load(){for(const id of IDS)loadOne(id);loadOne('you_nocap')}
load();
function buildMasks(id,s){if(id!='you'&&id!='you_nocap'&&id!='kid')return;
 const t=mkCanvas(OW,OH),g=t.getContext('2d');
 for(let d=0;d<4;d++){g.clearRect(0,0,OW,OH);g.drawImage(s,0,d*OH,OW,OH,0,0,OW,OH);
  const data=g.getImageData(0,0,OW,OH).data,j=new Uint8Array(OW*OH),p=new Uint8Array(OW*OH),h=new Uint8Array(OW*OH);
  for(let y=0;y<OH;y++)for(let x=0;x<OW;x++){const i=(y*OW+x)*4,r=data[i],gv=data[i+1],b=data[i+2],a=data[i+3];if(a<180)continue;
   // jacket: mid body, G-dominant; skip cap (upper ~40%)
   // mid-torso only — stay below the face so green eyes are not dyed (back can start higher; no eyes)
   const y0=d==0?OH*.47:d==2?OH*.54:OH*.52;
   if(y>y0&&y<OH*.78&&gv>r+6&&gv>b-4&&gv>35&&gv<190)j[y*OW+x]=1;
   // pants: lower cool/dark, not brown shoes
   if(y>OH*.62&&y<OH*.90){const brown=r>gv+8&&r>b+10&&r>40;const navy=gv<=r+18&&b>=r-12&&r<95&&(r+gv+b)<220;if(navy&&!brown)p[y*OW+x]=1}
   // kid / baby hair (pink)
   if(id=='kid'&&r>170&&gv>70&&gv<210&&b>90&&r>gv+15&&r>b-10)h[y*OW+x]=1}
  MASKS[id+'|'+d+'|j']=j;MASKS[id+'|'+d+'|p']=p;MASKS[id+'|'+d+'|h']=h}}
function tintMask(g,mask,col){if(!mask||!col||col[0]!='#')return;let tr,tg,tb;try{[tr,tg,tb]=hexRgb(col)}catch(e){return}
 const d=g.getImageData(0,0,OW,OH),a=d.data,tl=0.299*tr+0.587*tg+0.114*tb||1;
 for(let p=0,i=0;p<mask.length;p++,i+=4){if(!mask[p]||a[i+3]<180)continue;const l=(0.299*a[i]+0.587*a[i+1]+0.114*a[i+2])/tl,k=Math.max(.25,Math.min(1.85,l));
  a[i]=Math.max(0,Math.min(255,tr*k));a[i+1]=Math.max(0,Math.min(255,tg*k));a[i+2]=Math.max(0,Math.min(255,tb*k))}
 g.putImageData(d,0,0)}
function drawHat(g,look,dir,frame,suit){if(!look||!look.hat||suit||!window.FM21||!FM21.hatPix)return;
 if(window.FM22&&FM22.hatArt){const s=OW/227;g.save();g.translate(0,Math.round(OH*-.04));g.scale(s,s);try{FM22.hatArt(g,look.hat)}catch(e){}g.restore();return}
 const t=mkCanvas(18,27),q=t.getContext('2d'),fl=dir==3;
 FM21.hatPix((x,y,w,h,col)=>{const yy=y-(suit?1:0);if(yy+h>0){q.fillStyle=col;q.fillRect(fl?17-x-w:x,Math.max(0,yy),w,h-(yy<0?-yy:0))}},look.hat,(frame&1)?1:0,dir);
 g.imageSmoothingEnabled=false;g.drawImage(t,0,-2,OW,OH)}
function npcSuit(g,look,d,f){const id=whoId(look),src=id&&id!='baby'?SHEET[id]:SHEET.kid;if(!src)return;
 g.save();g.beginPath();g.ellipse(OW/2,OH*.28,OW*.36,OH*.26,0,0,7);g.clip();
 // cover the default player head, then draw this character's head
 g.drawImage(src,f*OW,d*OH,OW,OH*.52, OW*.10,OH*.00,OW*.80,OH*.50);
 g.restore();
 // glass highlight
 g.fillStyle='rgba(255,255,255,.40)';g.beginPath();g.ellipse(OW*.38,OH*.14,OW*.11,OH*.05,-.5,0,7);g.fill()}
function hairTint(g,d,col){const m=MASKS['kid|'+d+'|h'];if(m)tintMask(g,m,col)}
function illSprite(look,dir,frame,suit,swing){const id0=whoId(look);if(!id0)return null;
 const d=dir&3,f=frame&3;
 const hatOn=!!(look&&look.hat&&!suit);
 const id=suit?(SHEET.suit?'suit':id0):(hatOn&&id0=='you'&&SHEET.you_nocap)?'you_nocap':(id0=='baby'?'kid':id0);
 const img=SHEET[id];if(!img||!(img.width||img.naturalWidth))return null;
 const dyeTop=(!suit&&id0=='you'&&look&&look.top)?look.top:'';
 const dyePants=(!suit&&id0=='you'&&look&&look.pants)?look.pants:'';
 const baby=id0=='baby';
 const key=[id,id0,d,f,suit?1:0,hatOn?look.hat:'',dyeTop,dyePants,baby?look.hair:''].join('|');
 let c=CACHE.get(key);if(c)return c;
 c=mkCanvas(OW,OH);c._ill=1;c._hd=4;c._fm28=1;const g=c.getContext('2d');g.imageSmoothingEnabled=true;g.imageSmoothingQuality='high';
 g.drawImage(img,f*OW,d*OH,OW,OH,0,0,OW,OH);
 if(baby&&look.hair)hairTint(g,d,look.hair);
 if(suit&&id!='suit'&&id0!='you')npcSuit(g,look,d,f);
 if(!suit&&id0=='you'){
  const defTop='#2a8a6a',defPants='#3a3a5a';
  if(dyeTop&&dyeTop[0]=='#'&&dyeTop!=defTop)tintMask(g,MASKS[(hatOn?'you_nocap':'you')+'|'+d+'|j'],dyeTop);
  if(dyePants&&dyePants[0]=='#'&&dyePants!=defPants)tintMask(g,MASKS[(hatOn?'you_nocap':'you')+'|'+d+'|p'],dyePants);
 }
 if(hatOn)drawHat(g,look,d,f,suit);
 if(CACHE.size>2000){let n=500;for(const k of CACHE.keys()){CACHE.delete(k);if(--n<=0)break}}CACHE.set(key,c);return c}
function placeholder(look){const c=mkCanvas(OW,OH);c._ill=1;c._hd=4;c._ph=1;const g=c.getContext('2d');g.fillStyle=look&&look.top||'#2a8a6a';g.globalAlpha=.35;g.fillRect(OW*.28,OH*.38,OW*.44,OH*.32);g.fillStyle=look&&look.hair||'#333';g.beginPath();g.ellipse(OW/2,OH*.28,OW*.22,OH*.18,0,0,7);g.fill();return c}
function prewarm(){if(!ILL.on||!ILL.ready)return;const looks=[PLOOK,...((typeof NPCS!='undefined'&&NPCS)||[]).map(n=>n.look)].filter(l=>l&&l.skin);
 const Q=[];for(const L of looks)for(let d=0;d<4;d++)for(let f=0;f<4;f++){Q.push([L,d,f,0,0]);if(L===PLOOK){Q.push([L,d,f,1,0]);if(L.hat)Q.push([Object.assign({},L,{hat:L.hat}),d,f,0,0])}}
 // baby sample
 Q.push([{skin:'#e8b48a',hair:'#1e2a5e',style:'bob',top:'#ffd27a',pants:'#5a8ac8',acc:'#fff'},2,0,0,0]);
 const step=()=>{const t=performance.now();while(Q.length&&performance.now()-t<6){try{illSprite(...Q.shift())}catch(e){Q.shift()}}if(Q.length)setTimeout(step,30)};setTimeout(step,40)}
{const _cs=charSprite;charSprite=function(look,dir,frame,suit,swing){if(ILL.on&&look&&!look.small){try{const c=illSprite(look,dir,frame,suit,swing);if(c)return c;if(!ILL.ready)return placeholder(look)}catch(e){console.error(e)}}return _cs.apply(this,arguments)}}
function worldCtx(g){return g&&(g===cx||g.canvas===cv)}
function labelLift(){return worldCtx(cx)?Math.round(27*(SCALE.v-1)):0}
{const _dc=drawChar;drawChar=function(g,X,Y,look,dir,frame,o={}){if(!look||!look.skin)return _dc.apply(this,arguments);
 const s=charSprite(look,dir,frame&3,o.suit,o.swing);if(!s||s.width<=18)return _dc.apply(this,arguments);
 const sc=worldCtx(g)?SCALE.v:1,dw=18*sc,dh=27*sc,dx=X-1-(dw-18)/2,dy=Y-2-(dh-27);
 px(g,X+3,Y+22,11,3,'#0005');px(g,X+2,Y+23,13,1,'#0003');
 const sm=g.imageSmoothingEnabled;g.imageSmoothingEnabled=true;g.drawImage(s,dx,dy,dw,dh);g.imageSmoothingEnabled=sm;
 if(o.carry){const c=o.carry,b=(frame&1)?1:0;ob(g,X+5,Y-6+b-Math.round((dh-27)*.3),6,6,c);px(g,X+6,Y-5+b,2,2,'#fff8')}}}
function gallery(){const ids=['you','ava','kai','zara','theo','nyx','pip','ruiz','mo','vega'],c=mkCanvas(ids.length*90,230),g=c.getContext('2d');g.fillStyle='#1c1024';g.fillRect(0,0,c.width,c.height);g.font='9px sans-serif';
 const prev=ILL.on;ids.forEach((id,i)=>{const L=id=='you'?PLOOK:NPCS.find(q=>q.id==id).look,im=window.FM15&&FM15.get(L,'neutral');if(im&&im.complete&&im.naturalWidth)g.drawImage(im,i*90+5,2,80,80);
  ILL.on=false;const v26=window.FM23?FM23.hdSprite(L,2,0,0,0):charSprite(L,2,0,0,0);g.drawImage(v26,i*90+21,88,48,72);
  ILL.on=true;const v28=illSprite(L,2,0,0,0)||v26;g.drawImage(v28,i*90+21,160,48,72);
  g.fillStyle='#aaa';g.fillText(id,i*90+6,86);g.fillStyle='#8cf';g.fillText('v26',i*90+6,158);g.fillStyle='#c8f';g.fillText('v28',i*90+6,228)});
 ILL.on=prev;c.style.cssText='width:100%;image-rendering:auto';return c}
function walkStrip(){const ids=['you','ava','kai','kid','suit'],c=mkCanvas(ids.length*80+20,4*70+20),g=c.getContext('2d');g.fillStyle='#140818';g.fillRect(0,0,c.width,c.height);g.font='8px sans-serif';g.fillStyle='#fff';
 ids.forEach((id,i)=>{const L=id=='you'||id=='suit'?PLOOK:id=='kid'?{skin:'#e8b48a',hair:'#ff9ac8',style:'bob',top:'#ffd27a',pants:'#5a8ac8'}:NPCS.find(q=>q.id==id).look;
  for(let f=0;f<4;f++){const s=illSprite(L,id=='suit'?2:2,f,id=='suit',0);if(s)g.drawImage(s,8+i*80,8+f*70,48,72)}
  g.fillStyle='#aaa';g.fillText(id,8+i*80,4*70+16)});
 c.style.cssText='width:100%;image-rendering:auto';return c}
{const _st=FM17.setTab;FM17.setTab=function(t){_st.apply(this,arguments);if(t!='View')return;const bd=document.querySelector('#dbg .bd');if(!bd)return;
 const h=document.createElement('h3');h.textContent='v28: Illustrated sprites';const row=document.createElement('div');row.className='row';
 const add=(l,f)=>{const b=document.createElement('button');b.textContent=l;b.onclick=()=>{f();CACHE.clear();if(window.FM23&&FM23.HC)FM23.HC.clear();FM17.setTab('View')};row.appendChild(b)};
 add('Illustrated (v28): '+(ILL.on?'ON':'off'),()=>{ILL.on=!ILL.on;localStorage.fmIll=ILL.on?'1':'0'});
 add('v26 procedural: '+(ILL.on?'off':'ON'),()=>{ILL.on=!ILL.on;localStorage.fmIll=ILL.on?'1':'0'});
 const sizes=[1,1.25,1.45];
 sizes.forEach(v=>add('Sprite size '+v+(SCALE.v==v?' ✓':''),()=>{SCALE.v=v;localStorage.fmSprScale=v}));
 bd.appendChild(h);bd.appendChild(row);
 const gh=document.createElement('h3');gh.textContent='Portraits · v26 · v28';bd.appendChild(gh);bd.appendChild(gallery());
 const wh=document.createElement('h3');wh.textContent='Walk cycles (front)';bd.appendChild(wh);bd.appendChild(walkStrip())}}
// keep FM24 API in sync for existing tests / debug
window.FM24={ILL,SHEET,illSprite,whoId,gallery,CACHE,tintJacket:function(g,w,h,col){tintMask(g,MASKS['you|2|j'],col)},load};
window.FM25={ILL,SHEET,illSprite,whoId,gallery,walkStrip,CACHE,MASKS,SCALE,labelLift,load,babyLook};
})();
