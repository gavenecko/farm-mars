// Farm Mars v11 (round 13): friendship side quests + quest tracker
// ---------- FRIENDSHIP SIDE QUESTS ----------
const SQ=[
 {id:'ava1',npc:'ava',h:3,t:'Seal Check',steps:[['iron',5,"The north dome seal is cracking. Could you bring me 5 Iron so I can patch it?"],['crys',2,"The patch holds! Now I need 2 Crystals for the pressure sensor."]],r:[600,'qspr',1],end:"The dome is sealed tight. You've saved us a lot of trouble. Here's a Quality Sprinkler from my stash."},
 {id:'kai1',npc:'kai',h:3,t:'Signature Dish',steps:[['glowcap',3,"I want a new house special. Bring me 3 Glowcaps and I'll start experimenting."],['egg',2,"Close, but it needs protein. 2 Eggs please!"]],r:[500,'medkit',3],end:"The Glowcap Omelette is a hit! It's named after you on the menu. Take these medkits too."},
 {id:'mo1',npc:'mo',h:3,t:'Old Mo\'s Lost Pick',steps:[['cob',4,"My grandfather's pick is somewhere down on floor 4. Bring me 4 Cobalt so I can forge a locator."],['jasp',1,"The locator needs a Jasper lens. Just one."]],r:[900,'s_mel',5],end:"Found it! It's still sharp, too. Here are some melon seeds I was keeping for a special occasion."},
 {id:'pip1',npc:'pip',h:3,t:'Pip\'s Space Garden',steps:[['lily',2,"I'm planting a garden in a tin can. Can I have 2 Dust Lilies? Please!"]],r:[350,'glowcap',3],end:"They're growing! I'm going to be a farmer just like you!"},
 {id:'theo1',npc:'theo',h:4,t:'Fossil Mystery',steps:[['rel1',1,"I think a buried relic would explain the canyon layers. Could you find one?"],['opal',1,"An Opal would date this precisely. Do you have one?"]],r:[1200,'rGlow',1],end:"Two billion years old! I'll credit you in my paper. Please take this ring."},
];
const sqs=()=>{if(!G.sq)G.sq={};return G.sq};
function sqAvail(q){const s=sqs()[q.id];return s==null&&(G.hearts[q.npc]||0)>=q.h&&!!NPCS.find(n=>n.id==q.npc)&&!!ITEMS[q.steps[0][0]]}
function sqStatus(q){const s=sqs()[q.id];if(s=='done')return 'Done';if(s==null)return (G.hearts[q.npc]||0)>=q.h?'New!':'Locked ('+q.h+'♥ with '+NPCS.find(n=>n.id==q.npc).n+')';const[it,n]=q.steps[s];return 'Bring '+n+' '+ITEMS[it].n+' ('+Math.min(cnt(it),n)+'/'+n+')'}
function questLog(){const o=SQ.filter(q=>NPCS.find(n=>n.id==q.npc)).map(q=>q.t+': '+sqStatus(q));say('Side Quests',[o.join('\n')+'\n\nTalk to townsfolk when you are friends to start their quests. Bring what they ask for to finish them.'])}
{const _t=talk;talk=function(n){const qs=SQ.filter(q=>q.npc==n.id);for(const q of qs){const s=sqs()[q.id];
  if(s==null&&sqAvail(q)){sqs()[q.id]=0;sfx('menu');say(n.n,['I have a favor to ask... ('+q.t+')',q.steps[0][2]],null,n.look);toast('New side quest: '+q.t);return}
  if(typeof s=='number'){const[it,c]=q.steps[s];if(cnt(it)>=c){rem(it,c);const ns=s+1;sfx('coin');
    if(ns>=q.steps.length){sqs()[q.id]='done';G.money+=q.r[0];if(q.r[1])add(q.r[1],q.r[2]);addHearts(n,2);parts(G.px,G.py-12,'#ffd27a',16,1.5);floatTxt(G.px,G.py-26,'Quest complete! +'+q.r[0]+'cr','#ffd27a');
      G.sqN=(G.sqN||0)+1;if(G.sqN>=3&&!G.ach.helper){G.ach.helper=1;toast('Achievement: Good Neighbor!')}say(n.n,q.end,null,n.look);return}
    sqs()[q.id]=ns;addHearts(n,1);say(n.n,['Thank you!',q.steps[ns][2]],null,n.look);return}}}
  return _t(n)}}
{const _b=boardMenu;boardMenu=function(){_b.apply(this,arguments);if(modal&&!modal.opts)modal.opts=[{t:'OK',f:()=>{}},{t:'Side Quests',f:()=>questLog()}];else if(modal&&modal.opts)modal.opts.push({t:'Side Quests',f:()=>questLog()})}}
// ---------- quest tracker HUD (tap to open log) ----------
function sqActive(){for(const q of SQ){const s=sqs()[q.id];if(typeof s=='number')return q}return null}
function sqTrackRect(){return[W-176,40,170,22]}
function sqTrackText(q){const[it,n]=q.steps[sqs()[q.id]];const c=Math.min(cnt(it),n);return[q.t,'Bring '+NPCS.find(x=>x.id==q.npc).n+' '+ITEMS[it].n+' '+c+'/'+n,c>=n]}
{const _d=draw;draw=function(){_d.apply(this,arguments);if(!G||TITLE||CRED||modal||menu||CUT)return;const q=sqActive();if(!q)return;const[x,y,w,h]=sqTrackRect(),[t,l,ready]=sqTrackText(q);
 R(x,y,w,h,'#0a0614c0');R(x,y,2,h,ready?'#7f7':'#ffd27a');txt('★ '+t,x+6,y+8,'#ffd27a',7);txt(l,x+6,y+18,ready?'#9f9':'#cfd6e8',6)}}
{const _t=onTap;onTap=function(x,y){if(G&&!TITLE&&!CRED&&!modal&&!menu&&!CUT&&sqActive()){const[a,b,w,h]=sqTrackRect();if(x>=a&&x<=a+w&&y>=b&&y<=b+h){questLog();sfx('menu');return true}}return _t.apply(this,arguments)}}
window.FM11={SQ,sqs,questLog,sqActive,sqTrackRect};
