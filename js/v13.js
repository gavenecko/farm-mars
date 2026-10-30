// Farm Mars v13 (round 15): Stardew-style dialogue box, expressive portraits, emotion tags
SFX.blip=()=>tone(520+Math.random()*90,.035,'sine',.045);
// ---------- emotion tags: $n neutral, $h happy, $s sad, $a angry, $l love/blush/surprise, $t thinking ----------
const MOODS={n:'',h:'happy',s:'sad',a:'angry',l:'love',t:'think'},TAGRE=/\s*\$([nhsalt])(?![a-z])/g,MOODOF=new Map();
function moodGuess(s){if(/\$[nhsalt](?![a-z])/.test(s))return null;const t=s.toLowerCase();
 if(/♥|love|blush|hug|kiss|for you|dating|marry|wedding|darling|sweetheart|beautiful|just for us|you remind me/.test(t))return 'l';
 if(/\bugh|hate|annoy|don't touch|furious|not again|gross|stop that|scram|how dare|grr|disgust|seriously\?/.test(t))return 'a';
 if(/sorry|miss (you|her|him|home|earth)|lonely|\bsad|cry|cries|lost |gone|died|tired|alone|worried|afraid|i wish|too far|leave|left all|dust storm|stay inside|burns/.test(t))return 's';
 if(/hmm|i wonder|think|maybe|perhaps|did you know|curious|theory|calculat|let me see|hypothes|\.\.\.$|you know\?/.test(t))return 't';
 if(/!|thank|great|wonderful|smile|laugh|haha|welcome|glad|amazing|nice|love it|perfect|delicious|fun|yay|fancy/.test(t))return 'h';
 return 'n'}
const tagS=(s,m)=>typeof s=='string'&&!/\$[nhsalt](?![a-z])/.test(s)?s+' $'+(m||moodGuess(s)):s;
const tagA=(a,m)=>Array.isArray(a)?a.map(x=>Array.isArray(x)?tagA(x,m):tagS(x,m)):tagS(a,m);
function tagAll(){
 for(const n of NPCS){if(n.lines)n.lines=n.lines.map(t=>tagA(t));if(n.season)for(const k in n.season)n.season[k]=tagS(n.season[k]);
  if(n.ev)for(const lv in n.ev)n.ev[lv]=n.ev[lv].map((p,i,a)=>tagS(p,i==a.length-1?(lv>=6?'l':'h'):undefined))}
 for(const L of[typeof DUSTL!='undefined'?DUSTL:{},typeof MUSL!='undefined'?MUSL:{},typeof MAGL!='undefined'?MAGL:{}])for(const k in L)L[k]=tagS(L[k],L===DUSTL?(moodGuess(L[k])=='h'?'h':'s'):L===MUSL?'h':'t');
 if(typeof HOMES!='undefined')for(const id in HOMES){const h=HOMES[id];h.home=h.home.map((s,i)=>tagS(s,['h','n','t'][i%3]=='n'?undefined:['h','n','t'][i%3]));h.ev=h.ev.map((s,i)=>tagS(s,i?'l':'t'))}
 if(typeof SQ!='undefined')for(const q of SQ){q.steps.forEach((s,i)=>s[2]=tagS(s[2],i?'h':'t'));q.end=tagS(q.end,'h')}}
tagAll();
// gift reactions, bouquet/pendant, marriage: tag the reply by outcome
{const _g=gift;gift=function(n){const s=cur(),id=s&&(ITEMS[s[0]].base||s[0]),lk=n.likes.includes(id),ht=n.hates.includes(id),already=G.gifted[n.id+G.day];_g(n);if(!modal)return;
 const m=already?'t':id=='bouquet'||id=='pendant'?(G.dating[n.id]||G.spouse==n.id?'l':'s'):lk||isBday(n)?'h':ht?'a':'n';modal.pages=modal.pages.map((p,i)=>tagS(p,id=='bouquet'&&i==1?'l':m));if(modal.scene=='wed')modal.pages=modal.pages.map(p=>tagS(p,'l'))}}
{const _c=chat;chat=function(n){_c(n);if(modal&&G.spouse==n.id)modal.pages=modal.pages.map(p=>tagS(p,moodGuess(p)=='n'?'h':undefined))}}
function mnorm(m){if(!m||!m.pages)return;for(let i=0;i<m.pages.length;i++){const p=m.pages[i];if(typeof p!='string'||p.indexOf('$')<0)continue;let md=null;const s=p.replace(TAGRE,(_,k)=>{md=k;return ''});if(md!=null){m.pages[i]=s;MOODOF.set(s,MOODS[md])}}}
function curMood(m){const pg=m.pages[m.pi];const t=MOODOF.get(pg);if(t!=null&&!(t===''&&m.mood))return t;return m.mood||(m.name&&m.name.includes('Event')?'love':'')}
{const _u=update;update=function(){if(modal)mnorm(modal);return _u.apply(this,arguments)}}
{const _ma=modalAdvance;modalAdvance=function(i){mnorm(modal);return _ma.apply(this,arguments)}}
{const _rl=typeof readLetter=='function'?readLetter:null;if(_rl)readLetter=function(){const r=_rl.apply(this,arguments);if(modal)modal.letter=1;return r}}
{const _mm=typeof mailMenu=='function'?mailMenu:null;if(_mm)mailMenu=function(){const r=_mm.apply(this,arguments);if(modal)modal.letter=1;return r}}
// ---------- portraits: 32x28, 6 moods, blink, talking mouth, per-character accessories ----------
const PC3=new Map();
function whoOf(look){const n=NPCS.find(q=>q.look===look||JSON.stringify(q.look)==JSON.stringify(look));return n?n.id:look===PLOOK?'you':'kid'}
function bust2(look,mood,blink,talk,who){who=who||whoOf(look);const sp=G&&G.spouse==who;const key=JSON.stringify(look)+mood+(blink?1:0)+(talk?1:0)+who+(sp?1:0);let c=PC3.get(key);if(c)return c;
 c=document.createElement('canvas');c.width=32;c.height=28;const g=c.getContext('2d'),P=(x,y,w,h,col)=>px(g,x,y,w,h,col);
 const sk=look.skin,hr=look.hair,tp=look.top,ac=look.acc||shade(tp,.4),st=look.style,skd=shade(sk,-.18),skdd=shade(sk,-.32),skl=shade(sk,.12),hl=shade(hr,.35),hd=shade(hr,-.3),hdd=shade(hr,-.5),kid=who=='kid'||who=='pip';
 const ink='#1a1426',mk=shade(sk,-.5);
 // long hair behind
 if(st=='long'){P(6,8,5,20,hd);P(21,8,5,20,hdd);P(7,9,1,14,hr)}
 if(st=='bob'){P(6,8,4,13,hd);P(22,8,4,13,hdd)}
 // shoulders / outfit
 P(3,23,26,5,tp);P(5,22,22,2,tp);P(3,23,26,1,shade(tp,.3));P(4,24,2,4,shade(tp,.15));P(26,24,3,4,shade(tp,-.3));P(12,22,8,3,shade(tp,-.35));
 P(13,22,6,2,skd);// neck shadow
 if(who=='ruiz'){P(9,22,3,6,'#fff');P(20,22,3,6,'#fff');P(11,23,1,4,ac);P(20,23,1,4,ac);P(15,26,3,2,'#ccc')}
 else if(who=='vega'){P(7,23,4,5,'#ffd23a');P(10,25,4,3,'#ffd23a');P(23,24,2,2,'#ffd23a')}
 else if(who=='kai'){P(13,23,6,5,'#fff');P(13,23,6,1,'#ddd')}
 else if(who=='ava'){P(8,24,3,4,'#3a4a5a');P(21,24,3,4,'#3a4a5a');P(15,24,2,2,ac)}
 else if(who=='zara'){P(14,23,4,2,ac);P(6,24,2,1,'#3af0ff');P(24,24,2,1,'#ff2ad8')}
 else{P(14,22,4,2,ac)}
 if(sp){P(21,24,3,2,'#ff6aa8');P(22,26,1,1,'#ff6aa8')}
 // head
 P(13,19,6,4,skd);P(9,5,14,15,sk);P(8,7,16,11,sk);P(10,20,12,1,sk);P(11,21,10,1,skd);
 P(9,6,6,1,skl);P(8,8,1,7,skl);P(23,8,1,9,skd);P(22,18,2,2,skd);P(9,18,1,2,skd);
 if(kid){P(8,17,1,2,sk);P(23,17,1,2,skd)}
 P(7,11,1,4,skd);P(24,11,1,4,skdd);P(6,12,1,2,skdd);P(25,12,1,2,skdd);// ears
 // eyes
 const ey=12,look2=mood=='think'?-1:0,wide=mood=='love'&&!blink;
 if(blink){P(10,ey+1,4,1,ink);P(18,ey+1,4,1,ink);P(10,ey+2,1,1,skd);P(21,ey+2,1,1,skd)}
 else if(mood=='happy'){P(10,ey,4,1,ink);P(9,ey+1,1,1,ink);P(14,ey+1,1,1,ink);P(18,ey,4,1,ink);P(17,ey+1,1,1,ink);P(22,ey+1,1,1,ink)}
 else{const eh=wide?4:3,y0=wide?ey-1:ey;P(10,y0,4,eh,'#fff');P(18,y0,4,eh,'#fff');P(10,y0-1,4,1,ink);P(18,y0-1,4,1,ink);
  const pc=who=='zara'?'#2a8aa0':who=='theo'||who=='ava'?'#2a4a8a':'#3a2418',pxo=look2,pyo=mood=='think'?-1:mood=='sad'?1:0;
  P(11+pxo,y0+(eh-2)+Math.min(0,pyo)+(pyo>0?0:0),2,2+(wide?1:0),pc);P(19+pxo,y0+(eh-2)+Math.min(0,pyo),2,2+(wide?1:0),pc);P(11+pxo,y0+(eh-2)+Math.min(0,pyo),1,1,'#fff');P(19+pxo,y0+(eh-2)+Math.min(0,pyo),1,1,'#fff');
  if(mood=='sad'){P(13,ey+3,1,2,'#8cf');P(10,ey+3,4,1,skd)}}
 // brows
 const bc=st=='bald'||hr=='#dddddd'||hr=='#eeeeee'?'#8a8a8a':hdd;
 if(mood=='angry'){P(9,ey-3,2,1,bc);P(11,ey-2,3,1,bc);P(21,ey-3,2,1,bc);P(18,ey-2,3,1,bc)}
 else if(mood=='sad'){P(10,ey-2,2,1,bc);P(12,ey-3,2,1,bc);P(20,ey-2,2,1,bc);P(18,ey-3,2,1,bc)}
 else if(mood=='think'){P(10,ey-3,4,1,bc);P(18,ey-4,4,1,bc);P(22,ey-3,1,1,bc)}
 else if(mood=='love'){P(10,ey-4,4,1,bc);P(18,ey-4,4,1,bc)}
 else{P(10,ey-3,4,1,bc);P(18,ey-3,4,1,bc)}
 // nose
 P(16,ey+4,1,2,skd);P(15,ey+6,2,1,skdd);
 // cheeks
 if(mood=='love'){P(8,ey+5,4,2,'#ff7a9a');P(20,ey+5,4,2,'#ff7a9a');P(9,ey+5,1,1,'#ffb0c0');P(21,ey+5,1,1,'#ffb0c0')}else if(mood=='happy'||kid){P(9,ey+5,3,1,'#f8909099');P(20,ey+5,3,1,'#f8909099')}
 if(who=='pip'){P(10,ey+4,1,1,skdd);P(12,ey+5,1,1,skdd);P(20,ey+4,1,1,skdd);P(22,ey+5,1,1,skdd)}
 if(mood=='angry'){P(23,ey-5,2,1,'#f44');P(24,ey-6,1,3,'#f44')}
 // mouth (talk frame opens it)
 const my=ey+8;
 if(talk){const ow=mood=='happy'||mood=='love'?5:4,ox=16-Math.floor(ow/2);P(ox,my,ow,3,'#5a1a2a');P(ox+1,my+2,ow-2,1,'#d85a6a');if(mood!='sad')P(ox,my,ow,1,'#fff')}
 else if(mood=='happy'){P(13,my,6,1,mk);P(12,my-1,1,1,mk);P(19,my-1,1,1,mk);P(14,my+1,4,1,'#c04050')}
 else if(mood=='love'){P(14,my,4,1,mk);P(13,my-1,1,1,mk);P(18,my-1,1,1,mk)}
 else if(mood=='sad'){P(14,my,4,1,mk);P(13,my+1,1,1,mk);P(18,my+1,1,1,mk)}
 else if(mood=='angry'){P(13,my,6,2,mk);P(14,my,4,1,'#fff')}
 else if(mood=='think'){P(16,my,3,1,mk);P(19,my-1,1,1,mk)}
 else{P(14,my,4,1,mk)}
 // hair styles
 if(st=='bald'){P(11,5,8,1,shade(sk,.3));P(12,6,4,1,shade(sk,.22));P(7,9,2,6,'#9a9a9a');P(23,9,2,6,'#8a8a8a');P(8,8,1,2,'#aaa')}
 else if(st=='beard'){P(9,4,14,3,hr);P(8,6,3,5,hr);P(21,6,3,5,hd);P(11,4,6,1,hl);
  P(8,17,16,6,hr);P(7,15,3,6,hr);P(22,15,3,6,hd);P(10,23,12,2,hr);P(12,25,8,1,hd);P(12,my-1,8,2,hr);P(10,17,1,4,hl);if(talk)P(14,my,4,2,'#5a1a2a');else P(14,my+1,4,1,mk)}
 else{P(9,3,14,5,hr);P(8,5,16,4,hr);P(7,7,3,5,hr);P(22,7,3,5,hd);P(11,3,7,1,hl);P(10,4,2,1,hl);P(9,8,2,2,hr);
  if(st=='bob'){P(6,7,3,14,hr);P(23,7,3,14,hd);P(10,8,5,2,hr);P(17,8,4,1,hr);P(6,20,3,1,hdd);P(23,20,3,1,hdd);P(7,9,1,8,hl)}
  else if(st=='spiky'){P(9,1,3,3,hr);P(13,0,3,4,hr);P(17,1,3,3,hr);P(21,2,3,4,hd);P(7,3,3,4,hr);P(14,0,1,2,hl);P(10,1,1,1,hl);P(11,8,3,1,hr);P(18,8,3,1,hr)}
  else if(st=='long'){P(6,7,3,10,hr);P(23,7,3,10,hd);P(10,8,4,2,hr);P(15,8,2,1,hr);P(7,9,1,8,hl)}
  else if(st=='cap'){P(8,1,16,6,ac);P(10,1,8,1,shade(ac,.35));P(6,6,20,2,shade(ac,-.25));P(5,7,22,1,shade(ac,-.4));P(14,2,4,3,who=='vega'?'#fff':shade(ac,-.2));if(who=='vega')P(15,3,2,1,'#c33');P(7,8,2,4,hr);P(23,8,2,4,hd)}}
 if(who=='theo'&&!blink){P(9,ey-1,6,1,'#333');P(17,ey-1,6,1,'#333');P(9,ey-1,1,5,'#333');P(14,ey-1,1,5,'#333');P(17,ey-1,1,5,'#333');P(22,ey-1,1,5,'#333');P(9,ey+3,6,1,'#333');P(17,ey+3,6,1,'#333');P(15,ey,2,1,'#333')}
 if(who=='ava')P(10,5,12,2,'#3a3a44'),P(11,5,3,2,'#9cf'),P(18,5,3,2,'#9cf');
 if(who=='kai')P(24,15,1,2,'#ffd27a');
 if(who=='zara'){P(8,ey+4,2,1,'#3af0ff');P(22,ey+4,2,1,'#ff2ad8');P(24,15,1,2,'#3af0ff')}
 if(who=='mo')P(14,4,4,1,'#ffd040');
 if(mood=='think'){P(19,22,5,5,sk);P(19,22,5,1,skl);P(23,23,1,4,skd);P(20,21,2,1,sk)}
 outline(c);if(PC3.size>800)PC3.clear();PC3.set(key,c);return c}
drawPortrait=function(g,X,Y,look,s=3,mood='',blink=false,talk=false){if(!look||!look.skin)return;const c=bust2(look,mood,blink,talk);g.imageSmoothingEnabled=false;const k=s>=3?2:1,w=32*k,h=28*k,bw=16*s,bh=14*s;
 g.drawImage(c,0,0,32,28,Math.round(X+(bw-w)/2),Math.round(Y+(bh-h)),w,h)};
// ---------- the box ----------
const DB={x:4,h:86,pf:76};// box geometry (canvas px; canvas is 384x216 -> ~2.4x on a 915x412 phone)
function dbRect(){return[DB.x,H-DB.h-3,W-DB.x*2,DB.h]}
function frame(x,y,w,h,fill,letter){const cu=letter?'#8a5a2a':'#b8642a',cl=letter?'#c8965a':'#f0a060',cd=letter?'#4a2a14':'#5a2410';
 R(x,y,w,h,'#140a10');R(x+1,y+1,w-2,h-2,cd);R(x+2,y+2,w-4,h-4,cu);R(x+2,y+2,w-4,1,cl);R(x+2,y+2,1,h-4,cl);R(x+3,y+h-3,w-5,1,cd);R(x+w-3,y+3,1,h-5,cd);
 R(x+4,y+4,w-8,h-8,'#140a10');R(x+5,y+5,w-10,h-10,letter?'#3af0ff00':'#3af0ff');R(x+6,y+6,w-12,h-12,fill);
 for(const[cxp,cyp]of[[x,y],[x+w-7,y],[x,y+h-7],[x+w-7,y+h-7]]){R(cxp+1,cyp+1,6,6,'#140a10');R(cxp+2,cyp+2,4,4,'#ffd27a');R(cxp+2,cyp+2,2,2,'#fff6c0');R(cxp+5,cyp+5,1,1,'#8a5a1a')}
 if(w>120){const mx=x+w/2;R(mx-14,y,28,3,'#140a10');R(mx-13,y+1,26,1,cl);R(mx-2,y,4,3,'#3af0ff')}}
function dbLayout(m){const[x,y,w,h]=dbRect(),hasP=!!m.look&&!m.letter,tw=hasP?w-DB.pf-26:w-26,tx=x+11,ty=y+16,pg=m.pages[m.pi]||'';const lines=[];for(const para of String(pg).split('\n'))lines.push(...wrapLines(para,tw));
 const L={x,y,w,h,hasP,tx,ty,tw,lines,rowH:12,opt:null};if(m.opts&&modalLast()){const tl=Math.min(lines.length,3),free=h-14-tl*10-6,n=m.opts.length;
  if(n*12<=free){L.lines=lines.slice(0,tl);L.opt={inBox:1,x:tx-2,y:ty+tl*10-2,w:tw,rh:12}}else{const rh=n*13<=y-8?13:Math.max(9,Math.floor((y-8)/n)),ow=Math.min(250,W-16);L.opt={inBox:0,x:W-8-ow,y:y-4-n*rh,w:ow,rh}}}
 return L}
optRect=function(i){const m=modal;mnorm(m);const L=dbLayout(m),o=L.opt;if(!o)return[0,-99,0,0];return[o.x,o.y+i*o.rh,o.w,o.rh-1]};
drawModal=function(){const m=modal;mnorm(m);if(m.pi>=m.pages.length)m.pi=m.pages.length-1;const pg=m.pages[m.pi],L=dbLayout(m),{x,y,w,h}=L,letter=!!m.letter;
 frame(x,y,w,h,letter?'#e8d8b0':'#1c1024',letter);if(!letter)for(let i=y+8;i<y+h-8;i+=3)R(x+7,i,w-14,1,'#ffffff05');
 // portrait
 if(L.hasP){const im=window.FM15&&FM15.get(m.look,curMood(m)),pw=DB.pf,px0=x+w-pw-6,py0=im?y-24:y+4,phh=im?90:62;frame(px0,py0,pw,phh,'#120a18');const bg=shade(m.look.top||'#444',-.55);R(px0+6,py0+6,pw-12,phh-12,bg);R(px0+6,py0+phh-22,pw-12,16,shade(bg,-.25));R(px0+6,py0+phh-22,pw-12,1,shade(bg,.2));
  for(let i=0;i<5;i++)R(px0+10+i*13,py0+10+(i*7)%9,1,1,'#fff8');
  const typing=m.ch<pg.length,ci=pg[Math.floor(m.ch)]||' ',talk=typing&&/[a-z0-9]/i.test(ci)&&(Math.floor(m.ch/2)%2==0),blink=(tick+((m.name||'').length*37))%170<7;
  if(im)FM15.place(px0+6,py0+6,pw-12,phh-12,im,m.pi+'|'+curMood(m)+'|'+m.name);else{cx.save();cx.beginPath();cx.rect(px0+6,py0+6,pw-12,phh-12);cx.clip();drawPortrait(cx,px0+6,py0+5,m.look,4,curMood(m),blink,talk);cx.restore()}
  const nm=(m.name||'').replace(/ ?- ?Heart Event| ♥ Event/,''),np=y+h-20;R(px0-2,np,pw+4,16,'#140a10');R(px0-1,np+1,pw+2,14,'#7a3a1a');R(px0,np+2,pw,12,'#b8642a');R(px0,np+2,pw,1,'#f0a060');
  cx.font='8px monospace';let fs=8;while(fs>5&&cx.measureText(nm).width>pw-8){fs--;cx.font=fs+'px monospace'}txt(nm,px0+pw/2,np+11,'#fff3d0',fs,'center');
  if(m.name&&/Event/.test(m.name))txt('♥',px0+pw-6,py0+14,'#ff7aa8',8,'center')}
 else if(m.name){cx.font='8px monospace';const nw=Math.min(W-30,cx.measureText(m.name).width+16);R(x+10,y-9,nw,13,'#140a10');R(x+11,y-8,nw-2,11,letter?'#8a5a2a':'#b8642a');R(x+11,y-8,nw-2,1,letter?'#c8965a':'#f0a060');txt(m.name,x+18,y,'#fff3d0',8)}
 // text (typewriter)
 const col=letter?'#3a2414':'#f4ead8';let left=Math.floor(m.ch),shown=0;const maxL=L.opt&&L.opt.inBox?L.lines.length:6;
 cx.save();cx.beginPath();cx.rect(x+7,y+6,(L.hasP?w-DB.pf-20:w-14),h-12);cx.clip();
 for(let i=0;i<Math.min(L.lines.length,maxL);i++){const l=L.lines[i];if(left<=0)break;const s=l.slice(0,left);left-=l.length;txt(s,L.tx,L.ty+i*10,col,8);shown++}cx.restore();
 const done=m.ch>=pg.length;
 if(done&&(!modalLast()||!m.opts)){const b=Math.round(Math.abs(Math.sin(tick/7))*3),ax=L.hasP?x+w-DB.pf-20:x+w-18,ay=y+h-15+b;R(ax,ay,9,1,'#140a10');R(ax+1,ay+1,7,1,letter?'#8a3a1a':'#3af0ff');R(ax+2,ay+2,5,1,letter?'#8a3a1a':'#3af0ff');R(ax+3,ay+3,3,1,letter?'#8a3a1a':'#3af0ff');R(ax+4,ay+4,1,1,'#fff')}
 if(done&&modalLast()&&m.opts&&L.opt){const o=L.opt;if(!o.inBox){frame(o.x-6,o.y-6,o.w+12,m.opts.length*o.rh+11,letter?'#e8d8b0':'#1c1024',letter)}
  m.opts.forEach((op,i)=>{const yy=o.y+i*o.rh,sel=i==m.sel;if(sel){R(o.x,yy,o.w,o.rh-1,letter?'#c8a870':'#3a1a3a');R(o.x,yy,2,o.rh-1,'#3af0ff')}cx.save();cx.beginPath();cx.rect(o.x,yy,o.w,o.rh);cx.clip();
   txt((sel?'▶ ':'  ')+op.t,o.x+4,yy+o.rh-3,sel?(letter?'#3a1a0a':'#3af0ff'):col,o.rh<11?6:7);cx.restore()})}};
window.FM13={MOODS,MOODOF,moodGuess,tagS,mnorm,curMood,bust2,dbRect,dbLayout,whoOf,frame};
