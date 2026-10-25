// Procedural WebAudio SFX + music
const AU={ctx:null,music:true,sfx:true,zone:null,next:0,step:0,master:null,mbus:null};
function auInit(){if(AU.ctx)return;try{const C=window.AudioContext||window.webkitAudioContext;AU.ctx=new C();AU.master=AU.ctx.createGain();AU.master.gain.value=.5;AU.master.connect(AU.ctx.destination);AU.mbus=AU.ctx.createGain();AU.mbus.gain.value=.18;AU.mbus.connect(AU.master);setInterval(auSched,50)}catch(e){}}
function tone(f,d,type='square',v=.2,slide=0,t0=0,bus){const a=AU.ctx;if(!a)return;const t=a.currentTime+t0,o=a.createOscillator(),g=a.createGain();o.type=type;o.frequency.setValueAtTime(f,t);if(slide)o.frequency.exponentialRampToValueAtTime(Math.max(20,f+slide),t+d);g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.001,t+d);o.connect(g);g.connect(bus||AU.master);o.start(t);o.stop(t+d+.02)}
function noise(d,v=.2,f=1200,t0=0){const a=AU.ctx;if(!a)return;const b=a.createBuffer(1,a.sampleRate*d,a.sampleRate),ch=b.getChannelData(0);for(let i=0;i<ch.length;i++)ch[i]=Math.random()*2-1;const s=a.createBufferSource();s.buffer=b;const fl=a.createBiquadFilter();fl.type='bandpass';fl.frequency.value=f;const g=a.createGain();const t=a.currentTime+t0;g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.001,t+d);s.connect(fl);fl.connect(g);g.connect(AU.master);s.start(t)}
const SFX={till:()=>{noise(.12,.3,400);tone(110,.1,'square',.1,-40)},water:()=>{noise(.35,.15,2500);tone(900,.2,'sine',.05,-500)},plant:()=>tone(500,.08,'triangle',.15,200),
 harvest:()=>[523,659,784].forEach((f,i)=>tone(f,.12,'square',.08,0,i*.06)),coin:()=>{tone(988,.08,'square',.1);tone(1318,.2,'square',.1,0,.07)},
 swing:()=>noise(.12,.2,3000),hit:()=>{tone(200,.1,'sawtooth',.15,-120);noise(.08,.2,800)},clink:()=>{tone(1400,.08,'triangle',.15,-300);tone(2100,.05,'sine',.08)},
 break:()=>{noise(.25,.3,600);tone(300,.2,'square',.08,-200)},hurt:()=>tone(300,.25,'sawtooth',.2,-220),talk:()=>tone(660+Math.random()*200,.04,'square',.06),
 heart:()=>[660,880,1046,1318].forEach((f,i)=>tone(f,.15,'triangle',.12,0,i*.08)),door:()=>{tone(180,.15,'sine',.15,80);noise(.2,.08,500)},
 menu:()=>tone(880,.04,'square',.06),bad:()=>tone(160,.15,'square',.1,-40),roar:()=>{tone(90,.8,'sawtooth',.25,-50);noise(.8,.25,300)},sleep:()=>[523,392,330,262].forEach((f,i)=>tone(f,.4,'sine',.1,0,i*.25)),
 craft:()=>[392,523,659,784,1046].forEach((f,i)=>tone(f,.1,'square',.07,0,i*.05)),shoot:()=>tone(700,.15,'square',.08,-500),wed:()=>[523,659,784,1046,784,1046,1318].forEach((f,i)=>tone(f,.3,'triangle',.12,0,i*.2))};
function sfx(n){if(AU.sfx&&AU.ctx&&SFX[n])try{SFX[n]()}catch(e){}}
// music: per-zone procedural loops
const SONGS={farm:{bpm:84,root:57,scale:[0,2,4,7,9],wave:'triangle',pad:1},city:{bpm:104,root:55,scale:[0,3,5,7,10],wave:'square',pad:0},
 surf:{bpm:66,root:50,scale:[0,1,5,7,8],wave:'sine',pad:1},mine:{bpm:60,root:45,scale:[0,1,3,6,7],wave:'sine',pad:1},indoor:{bpm:76,root:60,scale:[0,4,7,9,11],wave:'triangle',pad:0},boss:{bpm:140,root:45,scale:[0,1,3,6,7],wave:'sawtooth',pad:0}};
let musRnd=1;const mr=()=>(musRnd=(musRnd*16807)%2147483647)/2147483647;
function auSched(){const a=AU.ctx;if(!a||!AU.music||!AU.zone)return;const s=SONGS[AU.zone];const spb=60/s.bpm/2;
 if(AU.next<a.currentTime)AU.next=a.currentTime+.05;
 while(AU.next<a.currentTime+.3){const st=AU.step++,t0=AU.next-a.currentTime,mf=n=>440*Math.pow(2,(n-69)/12);
  musRnd=(st%32)*977+s.root*13+1;mr();
  const bar=Math.floor(st/16)%4,chord=[0,3,4,2][bar];
  if(st%2==0||mr()<.3){const deg=Math.floor(mr()*5)+chord,n=s.root+12+s.scale[deg%5]+12*Math.floor(deg/5);if(mr()<.7)tone(mf(n),spb*1.6,s.wave,.12,0,t0,AU.mbus)}
  if(st%8==0)tone(mf(s.root-12+s.scale[chord%5]),spb*7,'triangle',.25,0,t0,AU.mbus);
  if(s.pad&&st%16==0)[0,2,4].forEach(i=>tone(mf(s.root+s.scale[(chord+i)%5]),spb*15,'sine',.05,0,t0,AU.mbus));
  if(AU.zone=='city'||AU.zone=='boss'){if(st%4==0)tone(60,.1,'sine',.3,-30,t0,AU.mbus);if(st%4==2)noise(.05,.05,6000,t0)}
  AU.next+=spb}}
function setMusic(z){if(AU.zone!=z){AU.zone=z;AU.step=0}}
