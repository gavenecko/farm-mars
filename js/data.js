// Farm Mars v2 - game data
const SEASONS=['Dust','Bloom','Frost','Storm'],SOLS_PER_SEASON=7;
const SEASON_TINT={Dust:'rgba(255,150,60,.07)',Bloom:'rgba(255,90,170,.06)',Frost:'rgba(120,200,255,.10)',Storm:'rgba(150,60,30,.12)'};
// crop: seed price, days to grow, regrow days, seasons, sell value, color, shape
const FISH={carp:{n:'Dome Carp',v:60,c:'#e8a050',zone:.34,spd:1.6},eel:{n:'Glass Eel',v:130,c:'#9ef',zone:.22,spd:2.4},koi:{n:'Crimson Koi',v:280,c:'#f34',zone:.14,spd:3.2}};
const CROPS={
 pot:{n:'Red Potato',p:20,days:3,v:45,s:[0,1],c:'#c8502e',c2:'#7a2a18',shape:'root'},
 let:{n:'Dust Lettuce',p:15,days:2,v:30,s:[0,3],c:'#86d65a',c2:'#3f8a2a',shape:'leaf'},
 wht:{n:'Ares Wheat',p:10,days:3,v:25,s:[0,1,2,3],c:'#e8c050',c2:'#a07820',shape:'grain'},
 glo:{n:'Glowberry',p:40,days:4,re:2,v:90,s:[1],c:'#ff5ad8',c2:'#a02a88',shape:'berry'},
 tom:{n:'Ruby Tomato',p:35,days:4,re:2,v:70,s:[1,2],c:'#ff3344',c2:'#9a1020',shape:'vine'},
 mel:{n:'Moonmelon',p:60,days:6,v:230,s:[1,2],c:'#cfe8ff',c2:'#6a8ab0',shape:'melon'},
 frb:{n:'Frostbloom',p:50,days:4,v:150,s:[2],c:'#9ae8ff',c2:'#3a88b0',shape:'flower'},
 cac:{n:'Ice Cactus',p:30,days:5,v:120,s:[2,3],c:'#5ad8b0',c2:'#1f7a60',shape:'cactus'},
 dst:{n:'Storm Pepper',p:30,days:3,v:75,s:[3],c:'#ff8a20',c2:'#a04a00',shape:'vine'},
};
const ITEMS={hoe:{n:'Hoe',tool:1,c:'#c96'},can:{n:'Water Can',tool:1,c:'#6cf'},pick:{n:'Pickaxe',tool:1,c:'#aab'},blade:{n:'Plasma Blade',tool:1,c:'#f4f'},
 iron:{n:'Ferrite Ore',v:25,c:'#b08870',d:'Common surface ore.'},crys:{n:'Aurorium Crystal',v:80,c:'#5ff',d:'Glows faintly blue.'},
 cob:{n:'Cobalt Ore',v:120,c:'#4a6aff',d:'Found deeper in the mines.'},pla:{n:'Plasma Gem',v:300,c:'#ff4af0',d:'Deep-mine treasure.'},
 glowcap:{n:'Glowcap',v:50,c:'#9f6',food:25,d:'Bioluminescent fungus.'},lily:{n:'Dust Lily',v:65,c:'#c8f',d:'Blooms in crater shadow.'},
 vmoss:{n:'Void Moss',v:140,c:'#64f',food:10,d:'Mine-grown. Hums softly.'},
 chit:{n:'Bug Chitin',v:35,c:'#a6f',d:'Crystal bug shell.'},venom:{n:'Spitter Gland',v:60,c:'#7f3',d:'Handle with gloves.'},
 core:{n:'Queen Core',v:1500,c:'#fff',d:'The heart of the Crystal Queen.'},
 coffee:{n:'Red Dust Latte',v:10,c:'#a52',food:40,p:30,d:'+40 energy.'},bun:{n:'Cydonia Bun',v:20,c:'#da8',food:30,p:25,d:'Warm and sweet.'},
 stew:{n:'Glowcap Stew',v:120,c:'#7c4',food:70,d:'Hearty colony meal.'},salad:{n:'Mars Salad',v:110,c:'#9e5',food:55,d:'Fresh from the dome.'},
 pie:{n:'Moonmelon Pie',v:400,c:'#dff',food:100,d:'Everyone loves pie.'},
 o2can:{n:'O2 Canister',v:30,c:'#6df',d:'Refills 60 O2.',use:'o2'},medkit:{n:'Medkit',v:40,c:'#f66',d:'Heals 60 HP.',use:'hp'},
 spr:{n:'Sprinkler',v:50,c:'#9ab',place:1,d:'Waters 4 adjacent tiles each morning.'},qspr:{n:'Quality Sprinkler',v:150,c:'#adf',place:1,d:'Waters all 8 surrounding tiles.'},
 pendant:{n:'Red Pendant',v:0,c:'#f33',p:500,d:'Give to someone at 10 hearts to propose.'},bouquet:{n:'Dome Bouquet',v:0,c:'#f9c',p:200,d:'Gift at 8+ hearts to start dating.'},
};
ITEMS.rod={n:'Fishing Rod',tool:1,c:'#da6'};for(const k in FISH)ITEMS[k]={n:FISH[k].n,v:FISH[k].v,c:FISH[k].c,food:Math.round(FISH[k].v/4),fish:1,d:'Caught in the dome reservoir.'};ITEMS.grill={n:'Grilled Carp',v:150,c:'#c84',food:60,d:'Smoky and filling.'};
for(const k in CROPS){const c=CROPS[k];ITEMS[k]={n:c.n,v:c.v,c:c.c,food:Math.round(c.v/3),crop:1,d:'Season: '+c.s.map(i=>SEASONS[i]).join(', ')};ITEMS['s_'+k]={n:c.n+' Seeds',seed:k,p:c.p,c:c.c,d:'Grows in '+c.days+' sols. '+c.s.map(i=>SEASONS[i]).join('/')+'.'}}
const RECIPES=[
 {id:'spr',in:{iron:5,crys:1}},{id:'qspr',in:{iron:8,cob:3,crys:2}},
 {id:'o2can',in:{iron:2,glowcap:1}},{id:'medkit',in:{lily:1,chit:2}},
 {id:'stew',in:{glowcap:2,pot:1},cook:1},{id:'salad',in:{let:2,tom:1},cook:1},{id:'pie',in:{mel:1,wht:2},cook:1},{id:'grill',in:{carp:1,wht:1},cook:1},
];
// tool upgrades [credits, materials]
const UPG=[null,null,{cr:500,in:{iron:10}},{cr:1500,in:{cob:6,crys:4}}];
const TOOL_TIER_NAMES=['','Basic','Ferrite','Cobalt'];
// NPC: schedule entries [hour,zone,x,y]
const NPCS=[
 {id:'ava',n:'Ava',mar:1,look:{skin:'#e8b48a',hair:'#ff4aa8',style:'bob',top:'#1fb5b5',pants:'#244',acc:'#ffd23a'},likes:['crys','cob','pla','glo'],hates:['chit'],
  sched:[[6,'home',0,0],[9,'cc',11,5],[16,'city',13,13],[20,'cafe',8,5],[22,'home',0,0]],
  lines:[["Hey. I'm Ava, life-support engineer. The dome seals hiss at night. You get used to it.","Crystals tune the reactors. Bring me some sometime?"],
   ["You're out on the surface a lot. Check your O2 seals twice.","I rebuilt the plaza fountain pump last week. Nobody noticed. Except you, now."],
   ["I keep a little Earth photo on my workbench. Silly, right?","When you come by the workshop the day goes faster."],
   ["I saved you a seat at the observatory. Earthrise is beautiful from here.","...I think about you when the reactor hums."]],
  season:{Frost:"Frost season stresses the hull heaters. Long shifts.",Storm:"Dust storm season. Stay inside the dome after dark, okay?"},
  ev:{3:["Ava is elbow-deep in a pump housing.","AVA: Hand me that wrench? ...Thanks. Most people just watch.","AVA: My mom was a welder on the first Phobos station. She said: fix what you can, love what you can't.","You spend an hour helping. Ava smiles more than usual."],
   6:["Ava finds you by the airlock at dusk.","AVA: I wanted to show you something. Look up.","Through the dome glass, Phobos crosses the sky, small and fast.","AVA: I come here when I miss home. Now... it feels like this is home."],
   9:["Ava is waiting at your farm gate, holding a tiny crystal flower she welded herself.","AVA: I made this. For you. It'll never wilt. Kind of like... how I feel.","Her face turns as pink as her hair."]}},
 {id:'kai',n:'Kai',mar:1,look:{skin:'#c98a5e',hair:'#1a1a2a',style:'spiky',top:'#d43a9a',pants:'#333',acc:'#fff'},likes:['glowcap','let','coffee','pie','salad'],hates:['iron'],
  sched:[[6,'home',0,0],[8,'cafe',7,2],[17,'city',8,9],[21,'home',0,0]],
  lines:[["Welcome to the Red Dust Cafe! I'm Kai. Coffee's synthetic but the love is real.","Fresh greens are so rare here. You grow them? Wow."],
   ["I'm experimenting with Glowcap tea. You're my official taste tester now.","Old Mo tips in ferrite. I don't know what to do with ferrite."],
   ["I sketch the regulars when it's slow. You're in there. A lot.","The cafe feels empty on days you don't come by."],
   ["I dreamed we opened a second cafe. On your farm. With a view of the canyon.","You're my favorite part of every sol."]],
  season:{Bloom:"Bloom season! I'm doing a Glowberry latte. Pink foam.",Dust:"New season, new menu. Bring me lettuce?"},
  ev:{3:["Kai is burning a batch of buns.","KAI: Ahh! No no no. ...Don't look at me.","You help scrape the tray. Kai laughs until they cry.","KAI: Thanks. I needed that."],
   6:["After closing, Kai pours two lattes and sits across from you.","KAI: Can I tell you something? I came to Mars to run away. Bad stuff on Earth.","KAI: But this place... you... I stopped running."],
   9:["Kai has drawn you a portrait in pencil and red dust.","KAI: It's you, watering the crops at sunrise. I see that in my head all the time.","KAI: ...I'm kind of hopelessly into you, farmer."]}},
 {id:'ruiz',n:'Dr. Ruiz',look:{skin:'#d9a479',hair:'#9a9a9a',style:'bald',top:'#eeeeee',pants:'#4a5a6a',acc:'#3a6'},likes:['lily','glowcap','vmoss','frb'],hates:['venom'],
  sched:[[6,'home',0,0],[8,'city',22,13],[12,'cafe',4,6],[14,'cc',4,6],[19,'city',22,13],[22,'home',0,0]],
  lines:[["Dr. Elena Ruiz, colony botanist. Martian flora is extraordinary. Bring me samples!"],["Dust Lilies bloom only in crater shadows. Fascinating chemistry."],["Your soil work is genuinely helping the colony's food security."],["You could co-author my next paper. I mean it."]],
  season:{Frost:"Frostbloom only sprouts in the cold. Try planting some!"},
  ev:{3:["DR. RUIZ: I sequenced that Glowcap you brought. It has six genomes. Six!","She hugs her tablet like a child."],6:["DR. RUIZ: My first garden on Mars died in a week. I almost went home.","DR. RUIZ: Seeing your farm thrive... you make this colony believe."]}},
 {id:'mo',n:'Old Mo',look:{skin:'#a0704a',hair:'#dddddd',style:'beard',top:'#a65a2a',pants:'#3a3a2a',acc:'#ff0'},likes:['iron','chit','pot','stew','core','carp','grill'],hates:['let'],
  sched:[[6,'home',0,0],[7,'city',17,14],[10,'cafe',12,5],[13,'city',17,14],[18,'shop',3,5],[21,'home',0,0]],
  lines:[["Back in '78 we mined with our bare gloves. Name's Mo."],["Crystal bugs hate a quick swing. Hit 'em and step back."],["Ferrite's the backbone of Cydonia. Keep it coming, kid."],["You remind me of me. Don't tell anyone I said that."]],
  season:{Storm:"Storm season. The mine's safer than the surface now. Ironic, huh?"},
  ev:{3:["OLD MO: The mine past the north ridge? I lost my partner down there on floor five.","OLD MO: Something big lives at the bottom. If you go... bring a good blade."],
   6:["OLD MO: Here. My old helmet lamp. It's lucky.","(Mo pats your shoulder. Max energy +10!)"]}},
];
const BUNDLES=[{n:'Farm Bundle',in:{pot:5,let:5,wht:5},r:600},{n:'Mineral Bundle',in:{iron:10,crys:3,cob:2},r:900},{n:'Surface Bundle',in:{glowcap:3,lily:3,chit:5},r:700},{n:'Deep Bundle',in:{pla:1,vmoss:2,core:1},r:3000}];
const BUGS={crawler:{hp:3,spd:.6,dmg:8,c:'#7a3ccf',c2:'#b88cff',drop:'chit'},spitter:{hp:4,spd:.45,dmg:6,c:'#3a9a2a',c2:'#9f6',drop:'venom'},hopper:{hp:5,spd:.5,dmg:12,c:'#cf6a2a',c2:'#ffb070',drop:'chit'},queen:{hp:70,spd:.5,dmg:15,c:'#4ad8ff',c2:'#e0ffff',drop:'core',boss:1}};
