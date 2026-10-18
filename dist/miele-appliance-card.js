/*! Miele Appliance Card for Home Assistant — https://github.com/g-force-be/ha-miele-appliance-card
 * MIT License. Copyright (c) 2026 My Media Build; Copyright (c) 2026 Peter Gheeraert.
 * Based on hOn Washer & Dryer Card by My Media Build (https://github.com/spikey1965/ha-hon-appliance-card), MIT.
 * Not affiliated with or endorsed by Miele. Miele is a trademark of Miele & Cie. KG. */
var si={sensor:{status:"status",program_id:"program",program_phase:"phase",program_type:"program_type",remaining_time:"remaining",elapsed_time:"elapsed",start_time:"start_in",finish:"finish",start:"start_ts",target_temperature:"target_temp",core_temperature:"core_temp",core_target_temperature:"core_target",temperature_zone_2:"temp_2",temperature_zone_3:"temp_3",spin_speed:"spin_speed",drying_step:"drying_step",energy_consumption:"energy",energy_forecast:"energy_forecast",water_consumption:"water",water_forecast:"water_forecast",twin_dos_1_level:"twindos_1",twin_dos_2_level:"twindos_2",plate:"plate"},binary_sensor:{remote_control:"remote_control",mobile_start:"mobile_start",smart_grid:"smart_grid",notification_active:"notification"},button:{start:"btn_start",stop:"btn_stop",pause:"btn_pause"},switch:{power:"power",supercooling:"supercooling",superfreezing:"superfreezing"},light:{light:"light",ambient_light:"ambient_light"},fan:{fan:"fan"},climate:{zone_2:"thermo_2",zone_3:"thermo_3"},vacuum:{vacuum:"vacuum"},select:{fridge_freezer_mode:"mode"}},Fe={state_status:"status",state_program_id:"program",state_program_phase:"phase",state_program_type:"program_type",state_remaining_time:"remaining",state_elapsed_time:"elapsed",state_start_time:"start_in",state_finish_timestamp:"finish",state_start_timestamp:"start_ts",state_target_temperature:"target_temp",state_temperature_1:"temp",state_core_temperature:"core_temp",state_core_target_temperature:"core_target",state_spinning_speed:"spin_speed",state_drying_step:"drying_step",current_energy_consumption:"energy",energy_forecast:"energy_forecast",current_water_consumption:"water",water_forecast:"water_forecast",twin_dos_1_level:"twindos_1",twin_dos_2_level:"twindos_2",state_signal_door:"door",state_signal_failure:"failure",state_signal_info:"notification",state_full_remote_control:"remote_control",state_mobile_start:"mobile_start",state_smart_grid:"smart_grid",start:"btn_start",stop:"btn_stop",pause:"btn_pause",poweronoff:"power",light:"light",state_temperature_2:"temp_2",state_temperature_3:"temp_3",state_plate_step:"plate",state_battery:"battery",thermostat:"thermo_1",thermostat2:"thermo_2",thermostat3:"thermo_3",supercooling:"supercooling",superfreezing:"superfreezing",fan:"fan",fan_readonly:"fan",ambient_light:"ambient_light"},ni={"sensor.temperature":"temp","binary_sensor.door":"door","binary_sensor.problem":"failure","sensor.battery":"battery"},ai=[["program_ended","status"],["no_program","program"],["normal_operation_mode","program_type"],["not_running","phase"],["extra_dry","drying_step"]];function li(t,e,o,i){let r=t.slice(0,t.indexOf(".")),s=e?.translation_key;if(s)return si[r]?.[s]??null;if(i){let l=i.slice(i.indexOf("-")+1),a=Fe[l]??Fe[l.replace(/-\d+$/,"")];if(a)return a}let n=o?.attributes??{};if(r==="sensor"&&n.device_class==="enum"&&Array.isArray(n.options)){for(let[l,a]of ai)if(n.options.includes(l))return a}return r==="climate"?"thermo_1":ni[`${r}.${n.device_class}`]??null}function ci(t,e,{uniqueIds:o={},overrides:i={}}={}){let r={},s=[];for(let[l,a]of Object.entries(t.entities??{})){if(a.device_id!==e||a.platform!=="miele")continue;let p=li(l,a,t.states?.[l],o[l]);p==="plate"?s.push(l):p&&!r[p]&&(r[p]=l)}let n=l=>Number(/-(\d+)$/.exec(o[l]??"")?.[1]??/(\d+)\s*$/.exec(t.states?.[l]?.attributes?.friendly_name??"")?.[1]??NaN);s.map((l,a)=>[Number.isFinite(n(l))?n(l):100+a,l]).sort((l,a)=>l[0]-a[0]).forEach(([,l],a)=>{r[`plate_${a+1}`]=l});for(let[l,a]of Object.entries(i??{}))a&&(r[l]=a);return r}function Ke(t,e){let o={};for(let i of t??[]){if(i.device_id!==e||i.platform!=="miele"||!i.disabled_by)continue;let r=i.unique_id?Fe[i.unique_id.slice(i.unique_id.indexOf("-")+1)]:null;r?.startsWith("btn_")&&(o[r]=i.entity_id)}return o}var di={"washing machine":"washer","tumble dryer":"dryer","washer dryer":"washer_dryer",dishwasher:"dishwasher",oven:"oven","oven microwave":"oven_microwave","steam oven":"steam_oven","steam oven combi":"steam_oven_combi","steam oven micro":"steam_oven_micro","dialog oven":"dialog_oven",microwave:"microwave","coffee system":"coffee","warming drawer":"drawer",hob:"hob","hob extraction":"hob",hood:"hood",refrigerator:"fridge",freezer:"fridge","fridge freezer":"fridge","wine cabinet":"wine","wine conditioning unit":"wine","wine unit":"wine","wine cabinet freezer":"wine","robot vacuum cleaner":"vacuum"},pi=[[/^(WT|WWT)/,"washer_dryer"],[/^W/,"washer"],[/^T/,"dryer"],[/^G/,"dishwasher"],[/^ESW/,"drawer"],[/^(CM|CVA)/,"coffee"],[/^DGM/,"steam_oven_micro"],[/^DG/,"steam_oven_combi"],[/^H\w*BM/,"oven_microwave"],[/^M/,"microwave"],[/^H/,"oven"],[/^KM/,"hob"],[/^DA/,"hood"],[/^KWT/,"wine"],[/^(K|F)/,"fridge"],[/^RX/,"vacuum"]],hi={washer:{group:"laundry",drawing:"washer"},washer_dryer:{group:"laundry",drawing:"washer_dryer"},dryer:{group:"laundry",drawing:"dryer"},dishwasher:{group:"dishwasher",drawing:"dishwasher"},oven:{group:"oven",drawing:"oven"},steam_oven:{group:"oven",drawing:"steam_oven"},steam_oven_combi:{group:"oven",drawing:"steam_oven"},dialog_oven:{group:"oven",drawing:"oven"},steam_oven_micro:{group:"oven",drawing:"microwave"},oven_microwave:{group:"oven",drawing:"microwave"},microwave:{group:"oven",drawing:"microwave"},coffee:{group:"coffee",drawing:"coffee"},drawer:{group:"drawer",drawing:"drawer"},hob:{group:"hob",drawing:"hob"},hood:{group:"hood",drawing:"hood"},fridge:{group:"cooling",drawing:"fridge"},wine:{group:"cooling",drawing:"wine"},vacuum:{group:"vacuum",drawing:"robot"}};function fi(t,e){let o=String(e??"").replace(/\s+/g,"").toUpperCase(),i=di[String(t??"").trim().toLowerCase()];if(!i){let s=o||String(t??"").replace(/\s+/g,"").toUpperCase();i=pi.find(([n])=>n.test(s))?.[1]??"other"}let r=hi[i]??{group:"other",drawing:"generic"};return{kind:i,group:r.group,drawing:i==="coffee"&&o.startsWith("CVA")?"coffee_builtin":r.drawing,builtIn:i==="coffee"?o.startsWith("CVA"):["oven","drawer"].includes(r.group),finish:r.group==="laundry"?"lotus_white":"obsidian_black"}}var J=t=>{let e=Object.values(t?.entities??{}).filter(o=>o.platform==="miele");return e.length>0&&!e.some(o=>o.translation_key)};function A(t,e){let o=new Set;for(let i of Object.values(t.entities??{}))i.platform==="miele"&&i.device_id&&o.add(i.device_id);return[...o].map(i=>W(t,i,e)).sort((i,r)=>String(i.areaId).localeCompare(String(r.areaId))||i.name.localeCompare(r.name))}function W(t,e,o){let i=t.devices?.[e]??{};return{id:e,name:i.name_by_user||i.name||e,model:i.model??null,modelId:i.model_id??null,areaId:i.area_id??null,family:fi(i.model,i.model_id),roles:ci(t,e,o)}}var gi=new Set(["unknown","unavailable",""]),mi=t=>t!=null&&!gi.has(t),ui={s:1/60,min:1,h:60,d:1440},yi=(t,e)=>t==null?null:t*(ui[e]??1);function X(t,e){let o=d=>e[d]?t.states?.[e[d]]:void 0,i=d=>{let c=o(d)?.state;return mi(c)?c:null},r=d=>{let c=i(d),h=c==null?NaN:Number(c);return Number.isFinite(h)?h:null},s=d=>yi(r(d),o(d)?.attributes?.unit_of_measurement),n=d=>{let c=o(d);return c?Date.parse(c.last_changed):NaN},l=d=>{let c=i(d),h=c==null?NaN:Date.parse(c);return Number.isFinite(h)?h:null},a=d=>{let c=i(d);return c==="on"?!0:c==="off"?!1:null},p=d=>e[d]?o(d)?o(d).state==="unavailable"?"unavailable":"available":"disabled":"none";return{status:o("status")?.state??null,statusAt:n("status"),program:i("program"),phase:i("phase"),programType:i("program_type"),remaining:s("remaining"),remainingAt:n("remaining"),elapsed:s("elapsed"),elapsedAt:n("elapsed"),startIn:s("start_in"),finish:l("finish"),startTs:l("start_ts"),temp:r("temp"),targetTemp:r("target_temp"),coreTemp:r("core_temp"),coreTarget:r("core_target"),tempUnit:o("temp")?.attributes?.unit_of_measurement??o("target_temp")?.attributes?.unit_of_measurement??"\xB0C",spin:r("spin_speed"),dryingStep:i("drying_step"),energyForecast:r("energy_forecast"),waterForecast:r("water_forecast"),twindos1:r("twindos_1"),twindos2:r("twindos_2"),door:a("door"),failure:a("failure"),notification:a("notification"),remote:a("remote_control"),mobileStart:a("mobile_start"),smartGrid:a("smart_grid"),power:a("power"),light:a("light"),buttons:{start:p("btn_start"),stop:p("btn_stop"),pause:p("btn_pause")},plates:wi(e).map(d=>i(d)),fan:e.fan?{on:o("fan")?.state==="on",pct:Number(o("fan")?.attributes?.percentage)||0}:null,ambient:a("ambient_light"),temp2:r("temp_2"),temp3:r("temp_3"),thermo:["thermo_1","thermo_2","thermo_3"].filter(d=>e[d]).map(d=>{let c=o(d)?.attributes??{},h=f=>Number.isFinite(Number(f))&&f!=null?Number(f):null;return{current:h(c.current_temperature),target:h(c.temperature),min:h(c.min_temp),max:h(c.max_temp)}}),supercooling:a("supercooling"),superfreezing:a("superfreezing"),battery:r("battery"),vacuum:i("vacuum"),fanSpeed:o("vacuum")?.attributes?.fan_speed??null}}var wi=t=>Object.keys(t).filter(e=>/^plate_\d+$/.test(e)).sort((e,o)=>e.slice(6)-o.slice(6));function re(t){if(!t||t==="plate_step_0")return{level:0,text:"0"};if(t==="plate_step_warming")return{level:.12,text:"w"};if(t.startsWith("plate_step_boost"))return{level:1,text:"B"};let e=Number(t.slice(11));return Number.isFinite(e)?{level:Math.min(1,e/18),text:e%2?`${(e-1)/2}.`:String(e/2)}:{level:0,text:"-"}}var _i={off:"off",reserved:"off",on:"standby",idle:"standby",programmed:"ready",waiting_to_start:"scheduled",in_use:"running",rinse_hold:"running",autocleaning:"running",superheating:"running",superfreezing:"running",supercooling:"running",supercooling_superfreezing:"running",pause:"paused",program_ended:"done",program_interrupted:"interrupted",failure:"error",service:"error"},ie=new Set(["ready","scheduled","running","paused"]),xi=new Set(["scheduled","running","paused","done"]),vi=new Set(["off","standby"]),We=new Set(["not_running"]),bi=new Set(["finished","process_finished"]);function Mt(t){let e=t.status;if(e==null||e==="not_connected"||e==="unavailable")return{state:"offline",connected:!1,guessed:!1};if(e==="unknown"){if(t.phase==null&&t.program==null)return{state:"offline",connected:!1,guessed:!1};let i=We.has(t.phase)||t.phase==null?"standby":bi.has(t.phase)?"done":"running";return{state:t.failure?"error":i,connected:!0,guessed:!0}}return e==="pause"&&We.has(t.phase)&&!(t.elapsed>0)&&!t.failure?{state:"ready",connected:!0,guessed:!1,notStarted:!0}:{state:t.failure?"error":_i[e]??"standby",connected:!0,guessed:!1}}var Gt=new Set(["heating_up_phase","pre_heating","heating_up"]),ki=new Set(["cooling_down","comfort_cooling","safety_cooling","cooling_phase"]),me=["machine_iron","hand_iron_2","hand_iron","hand_iron_1","slightly_dry","normal","normal_plus","extra_dry"],Ct=t=>me.indexOf(t),$i=2,P=class{constructor(e,o={}){this.family=e,this.opts={holdMs:6e4,activeHoldMs:20*6e4,endGraceMs:5*6e4,debounceMs:1e3,...o},this.prev=null,this.good=null,this.offlineSince=null,this.unknownSince=null,this.c=this._newCycle(null)}_newCycle(e){return{since:e,pausedMs:0,pauseStart:null,heatFrom:null,maxRemaining:null,lastElapsed:null,program:null,reachedDry:null,frozen:null,last:null,readyProgram:void 0,readySince:null,readyShown:null}}update(e,o){let i=this.opts,r=Mt(e),s=(l,a)=>this.good?o-l<a||vi.has(this.good.state)?!0:xi.has(this.good.state)?this.good.endAt?o<this.good.endAt+i.endGraceMs:o-l<i.activeHoldMs:!1:!1;if(!r.connected)return this.unknownSince=null,this.offlineSince==null&&(this.offlineSince=Number.isFinite(e.statusAt)&&e.statusAt<=o?e.statusAt:o),s(this.offlineSince,i.holdMs)?this._compute(this.good.snap,o,{stale:!0,connection:"lost"}):this._offline(o);if(this.offlineSince=null,r.guessed){if(this.unknownSince==null&&(this.unknownSince=o),o-this.unknownSince<i.holdMs&&this.good)return this._compute(this.good.snap,o,{stale:!0,connection:"ok"})}else this.unknownSince=null;let n=this._compute(e,o,{stale:!1,connection:"ok",guessed:r.guessed});return this.good={snap:e,state:n.state,endAt:n.state==="done"?null:n.endAt},n}_offline(e){return{state:"offline",phase:null,program:null,stale:!1,connection:"lost",offlineSince:this.offlineSince,lastState:this.good?.state??null,progress:{mode:"none",value:null},leftSec:null,endAt:null,startAt:null,lcd:{main:{kind:"dashes"},sub:{kind:"text",value:"offline"}},flags:{},dryness:null,temps:{},controls:{}}}_compute(e,o,{stale:i,connection:r,guessed:s=!1}){let n=this.family,l=this.opts,a=Mt(e),p=this.prev,d=a.notStarted&&(p==="running"||p==="paused")?"paused":a.state,c=this.c;if(!i){let L=Number.isFinite(e.statusAt)&&e.statusAt<=o?e.statusAt:o,R=n.group==="oven"&&d==="running"&&c.program&&e.program&&e.program!=="no_program"&&e.program!==c.program,ri=e.elapsed!=null&&c.lastElapsed!=null&&e.elapsed<c.lastElapsed;(ie.has(d)&&!ie.has(p)||ri||R)&&(c=this.c=this._newCycle(o)),d==="paused"&&c.pauseStart==null&&(c.pauseStart=L,c.frozen=c.last),d!=="paused"&&c.pauseStart!=null&&(c.pausedMs+=Math.max(0,L-c.pauseStart),c.pauseStart=null,c.frozen=null),e.program&&e.program!=="no_program"&&(c.program=e.program),e.elapsed!=null&&(c.lastElapsed=e.elapsed),e.remaining!=null&&e.remaining>0&&(d==="ready"?c.maxRemaining=e.remaining:d==="running"&&(c.maxRemaining=Math.max(c.maxRemaining??0,e.remaining))),me.includes(e.phase)&&(c.reachedDry==null||Ct(e.phase)>Ct(c.reachedDry))&&(c.reachedDry=e.phase),this.prev=d}let h=d==="running"||d==="paused",f=ie.has(d)||d==="done",_=e.program&&e.program!=="no_program"?e.program:f?c.program:null,m=e.phase&&!We.has(e.phase)?e.phase:null,y=null;if(e.remaining!=null&&e.remaining>0){let L=e.remaining*60,R=Number.isFinite(e.remainingAt)?Math.max(0,(o-e.remainingAt)/1e3):0;y=d==="running"?Math.max(L-R,L-60):L}else e.finish!=null&&(d==="running"||d==="scheduled")&&(y=Math.max(0,(e.finish-o)/1e3));let b=n.group==="oven"&&e.targetTemp!=null&&e.temp!=null&&h,x=b&&e.temp<e.targetTemp-$i&&(Gt.has(e.phase)||!(e.remaining>0));x&&!i&&(c.heatFrom=Math.min(c.heatFrom??e.temp,e.temp));let g="none",u=null,v=!1,C=(c.pausedMs+(c.pauseStart!=null?Math.max(0,o-c.pauseStart):0))/1e3;if(d==="done")g="done",u=1;else if(d==="paused"&&c.frozen)({mode:g,progress:u}=c.frozen),y=c.frozen.leftSec??y;else if(h){if(x){g="heat";let L=c.heatFrom??e.temp,R=e.targetTemp-L;u=R>0?Math.min(.99,Math.max(0,(e.temp-L)/R)):0}else if(y!=null){if(g="time",e.elapsed!=null){let L=d==="running"&&Number.isFinite(e.elapsedAt)?Math.min(59,Math.max(0,(o-e.elapsedAt)/1e3)):0,R=Math.max(0,e.elapsed*60+L-C);u=R+y>0?R/(R+y):0}else c.maxRemaining&&(u=1-y/(c.maxRemaining*60));d==="running"&&y<=0&&(v=!0)}else(n.group==="laundry"||n.group==="dishwasher")&&e.remaining===0&&d==="running"?(g="time",v=!0,y=0,u=Math.max(c.last?.progress??0,.99)):b?(g="at_temp",u=1):g="indeterminate";u!=null&&(u=Math.min(g==="at_temp"?1:.99,Math.max(0,u)))}!i&&d==="running"&&(c.last={mode:g,progress:u,leftSec:y});let V=ie.has(d)?e.finish??(y>0?o+y*1e3:null):d==="done"?e.finish:null,B=d!=="scheduled"?null:e.startTs!=null&&e.startTs>o?e.startTs:e.startIn?o+e.startIn*6e4:null,S=null;d==="ready"&&(e.program!==c.readyProgram&&(c.readyProgram=e.program,c.readySince=o),(c.readyShown==null||o-c.readySince>=l.debounceMs)&&(c.readyShown=e.remaining),S=c.readyShown);let Y={heating:h&&Gt.has(e.phase),cooling:ki.has(e.phase)&&(h||d==="done"),antiCrease:e.phase==="anti_crease",keepWarm:e.phase==="keeping_warm",rinsing:e.status==="autocleaning",spin:e.phase==="spin",drain:e.phase==="drain",almostDone:v,doorOpen:e.door===!0,smartGridWait:d==="scheduled"&&e.smartGrid===!0,remote:e.remote===!0,mobileStart:e.mobileStart===!0,light:e.light},I=e.buttons,E={pause:d==="running"&&I.pause==="available",resume:d==="paused"&&I.start==="available",start:d==="ready"&&I.start==="available",stop:ie.has(d)&&I.stop==="available",disabled:Object.entries(I).filter(([,L])=>L==="disabled").map(([L])=>L)},ii=(n.kind==="dryer"||n.kind==="washer_dryer")&&f&&(e.dryingStep||c.reachedDry)?{target:e.dryingStep,reached:c.reachedDry}:null;return{state:d,phase:m,program:_,programType:e.programType,stale:i,connection:r,guessed:s,progress:{mode:g,value:u},leftSec:y,endAt:V,startAt:B,flags:Y,dryness:ii,lcd:this._lcd({state:d,mode:g,leftSec:y,almostDone:v,readyDur:S,startAt:B,snap:e,program:_,phase:m,flags:Y}),temps:{current:e.temp,target:e.targetTemp,core:e.coreTemp,coreTarget:e.coreTarget,unit:e.tempUnit},elapsedMin:e.elapsed,pausedSec:Math.round(C),controls:E}}_lcd({state:e,mode:o,leftSec:i,almostDone:r,readyDur:s,startAt:n,snap:l,program:a,phase:p,flags:d}){let c=this.family.group;switch(e){case"off":return{main:{kind:"dashes"},sub:null};case"standby":return{main:{kind:"blank"},sub:null};case"ready":return{main:s?{kind:"duration",value:s*60}:{kind:"blank"},sub:{kind:"text",value:"ready"}};case"scheduled":return{main:n?{kind:"clock",value:n}:{kind:"dashes"},sub:{kind:"text",value:d.smartGridWait?"smart_grid":"starts"}};case"done":return{main:{kind:"text",value:"end"},sub:p?{kind:"phase",value:p}:null};case"interrupted":return{main:{kind:"text",value:"interrupted"},sub:null};case"error":return{main:{kind:"text",value:"error"},sub:null}}let h=e==="paused"?{kind:"text",value:"paused"}:null;return r?{main:{kind:"text",value:"almost_done"},sub:h??{kind:"percent"}}:o==="time"?{main:{kind:"countdown",value:i},sub:h??{kind:"percent"}}:o==="heat"?{main:{kind:"temp",value:l.temp},sub:h??{kind:"text",value:"heating"}}:o==="at_temp"?{main:{kind:"temp",value:l.temp},sub:h??(l.elapsed!=null?{kind:"elapsed",value:l.elapsed}:{kind:"text",value:"at_temp"})}:c==="coffee"?{main:d.rinsing?{kind:"text",value:"rinsing"}:a?{kind:"program",value:a}:{kind:"blank"},sub:p?{kind:"phase",value:p}:h}:c==="drawer"&&l.temp!=null?{main:{kind:"temp",value:l.temp},sub:p?{kind:"phase",value:p}:h}:l.elapsed!=null?{main:{kind:"elapsed",value:l.elapsed},sub:h}:{main:a?{kind:"program",value:a}:{kind:"blank"},sub:h}}};var j=()=>typeof globalThis.__MIELE_NOW__=="function"?globalThis.__MIELE_NOW__():Date.now();var Si={state:{off:"Uit",offline:"Niet verbonden",standby:"Aan",ready:"Klaar om te starten",scheduled:"Gepland",running:"Bezig",paused:"Gepauzeerd",done:"Klaar",interrupted:"Onderbroken",error:"Storing"},lcd:{ready:"Klaar",starts:"Start om",smart_grid:"Slim starten",end:"Einde",interrupted:"Onderbroken",error:"Storing",almost_done:"Bijna klaar",heating:"Opwarmen",at_temp:"Op temperatuur",paused:"Pauze",rinsing:"Spoelen",offline:"Geen verbinding",drinks:"Dranken"},row:{program:"Programma",temp:"Temperatuur",spin:"Centrifuge",dryness:"Droogtegraad",ends:"Klaar om",ended:"Klaar om",duration:"Duur",starts:"Start om",elapsed:"Verstreken",core:"Kerntemperatuur",zones:"Kookzones",fan:"Ventilator",light:"Licht",ambient:"Sfeerlicht",fridge:"Koelen",freezer:"Vriezen",zone:"Zone {n}",battery:"Batterij",suction:"Zuigkracht"},pill:{almost_done:"Bijna klaar",smart_grid:"Wacht op slim starten",lost:"Geen verbinding",door_open:"Deur open",drawer_open:"Lade open",zones:"{n} zones aan",fan:"Stand {n}",supercool:"SuperKoelen",superfreeze:"SuperVriezen",docked:"In het station",cleaning:"Zuigt",returning:"Keert terug",charging:"Laadt op"},btn:{pause:"Pauzeren",resume:"Hervatten",start:"Starten",stop:"Stoppen",off:"Uitzetten",on:"Aanzetten",cancel:"Annuleren",on_state:"Aan"},ask:{stop:"{name} stoppen? Het programma wordt afgebroken.",off:"{name} uitzetten?",off_running:"{name} uitzetten? Het programma stopt.",start:"{program} starten op de {name}?"},icon:{remote:"Bediening op afstand",mobile:"Start op afstand",door_open:"Deur open",door_closed:"Deur dicht",door_locked:"Deur vergrendeld",lost:"Geen verbinding, laatste toestand",light:"Licht aan/uit"},err:{send:"Niet verstuurd: {msg}",no_device:"Geen Miele-toestel gevonden. Kies een toestel in de kaartinstellingen.",old_integration:"Deze kaart werkt met de ingebouwde Miele-integratie van Home Assistant (sinds 2025.5). Je Miele-toestellen komen nu van een oudere HACS-integratie."},prog:{title:"Programma's",all:"Alle programma's ({n})",fewer:"Minder programma's",remote_on:"Start op afstand aan",remote_off:"Start op afstand uit",temp:"Temperatuur",time:"Tijd",none:"Geen",until_stop:"tot je stopt",start:"Starten",ask:"{what} starten op de {name}?",prepare:"Klaarzetten",ask_prepare:"{what} klaarzetten op de {name}? Starten doe je daarna op het toestel.",started:"{program} gestart.",prepared:"{program} staat klaar. Druk op Start op de {name}.",cached:"Lijst van {when}, bewaard in deze browser.",why:{mobile_start:"Zet Start op afstand aan op de {name} om hier een programma te starten.",prepare:"Start op afstand staat uit. Je kunt een programma klaarzetten en het daarna op het toestel starten.",waiting:"{program} staat klaar op de {name}. Druk op Start op het toestel, of zet Start op afstand aan om hier te starten.",busy:"Er loopt al een programma. Starten kan weer als het klaar is.",offline:"De {name} is niet verbonden.",no_programs:"Miele biedt voor de {name} geen programma's aan om op afstand te starten.",no_remote:"Deze {name} kan niet op afstand starten.",no_list:"De programmalijst is nog niet binnen."}},ed:{found:"Herkend: {model} ({kind}), tekening {drawing}.",more:"Meer instellingen",appliances:"Toestellen",suggest:"Stel layout voor",export:"Kopieer als losse kaarten",copied:"Gekopieerd. Plak het in de YAML-editor van een nieuwe view.",copy_by_hand:"Selecteer de tekst hierboven en kopieer hem.",layout:{rooms:"Per ruimte",grid:"Raster",active:"Alleen actieve",phone:"Telefoon",display:"Keukenscherm (alleen kijken)"},f:{entity:"Toestel",name:"Naam",finish:"Frontkleur",drawing:"Tekening",theme:"Thema",animations:"Animaties",controls:"Bediening tonen",big_countdown:"Grote aftelling",design:"Ontwerp",accent:"Accentkleur",language:"Taal",max_width:"Maximale breedte tekening",images:"Map met eigen tekeningen",programs:"Favorieten",show_all:"Ook alle andere programma's",collapsed:"Ingeklapt",layout:"Layout",programmes:"Programmakaart"},h:{design:"Standaard volgens het typenummer.",entity:"Elke entiteit van het toestel werkt.",accent:"Bijvoorbeeld #4fa3e0",max_width:"Bijvoorbeeld 380px",images:"Bijvoorbeeld /local/miele/ met washer.svg, dryer.svg, \u2026",programs:"Leeg: een voorstel per type toestel."},finish:{lotus_white:"Lotuswit",brilliant_white:"Briljantwit",pearl_beige:"Parelbeige",clean_steel:"CleanSteel",graphite_grey:"Grafietgrijs",obsidian_black:"Obsidiaanzwart"},drawing:{washer:"wasmachine (W1)",washer_dryer:"was-droogcombinatie (WT1)",dryer:"droogkast (T1)",dishwasher:"vaatwasser",oven:"oven 60 cm",steam_oven:"stoomoven 45 cm",microwave:"oven met microgolf 45 cm",coffee:"koffiemachine (CM)",coffee_builtin:"inbouw-koffiemachine (CVA)",drawer:"warmhoudlade",hob:"kookplaat",hood:"dampkap",fridge:"koelkast",wine:"wijnkast",robot:"robotstofzuiger",generic:"algemeen"},theme:{dark:"Donker",light:"Licht",auto:"Volgt Home Assistant",ha:"Kleuren van Home Assistant"},design:{chrome:"Chromen deur",white:"Witte deur (White Edition)",black:"Zwarte deur",graphite:"Grafietgrijze deur",mtouch:"M Touch (zonder draaiknop)",integrated:"Volledig ge\xEFntegreerd",semi:"Half ge\xEFntegreerd",freestanding:"Vrijstaand",vitroline:"VitroLine",pureline:"PureLine",artline:"ArtLine (grepeloos)",contourline:"ContourLine",active:"Active (draaiknoppen)",cm7:"CM 7",cm6:"CM 6",induction:"Inductie",extractor:"Met afzuiging",wall:"Wandschouw",aura:"Aura (eiland)"},anim:{full:"Volledig",reduced:"Beperkt",off:"Uit"},w:{buttons:"De start-, pauze- en stopknop staan uit in Home Assistant.",enable:"Inschakelen",enabled:"Ingeschakeld. Home Assistant laadt de Miele-integratie zo opnieuw.",offline:"Niet verbonden.",mobile_start:"Start op afstand staat nu uit."}},ov:{all_off:"Alle toestellen staan uit"},unit:{rpm:"tpm",min:"min"},kind:{washer:"Wasmachine",dryer:"Droogkast",washer_dryer:"Was-droogcombinatie",dishwasher:"Vaatwasser",oven:"Oven",steam_oven:"Stoomoven",steam_oven_combi:"Stoomoven",steam_oven_micro:"Stoomoven met microgolf",dialog_oven:"Dialog-oven",oven_microwave:"Oven met microgolf",microwave:"Microgolfoven",coffee:"Koffiemachine",drawer:"Warmhoudlade",hob:"Kookplaat",hood:"Dampkap",fridge:"Koelkast",wine:"Wijnkast",vacuum:"Robotstofzuiger",other:"Miele-toestel"}},Ze={state:{off:"Off",offline:"Not connected",standby:"On",ready:"Ready to start",scheduled:"Scheduled",running:"Running",paused:"Paused",done:"Finished",interrupted:"Interrupted",error:"Fault"},lcd:{ready:"Ready",starts:"Starts at",smart_grid:"Smart start",end:"End",interrupted:"Interrupted",error:"Fault",almost_done:"Almost done",heating:"Heating up",at_temp:"At temperature",paused:"Paused",rinsing:"Rinsing",offline:"No connection",drinks:"Drinks"},row:{program:"Programme",temp:"Temperature",spin:"Spin",dryness:"Dryness",ends:"Ends at",ended:"Ended at",duration:"Duration",starts:"Starts at",elapsed:"Elapsed",core:"Core temperature",zones:"Cooking zones",fan:"Fan",light:"Light",ambient:"Ambient light",fridge:"Fridge",freezer:"Freezer",zone:"Zone {n}",battery:"Battery",suction:"Suction"},pill:{almost_done:"Almost done",smart_grid:"Waiting for smart start",lost:"No connection",door_open:"Door open",drawer_open:"Drawer open",zones:"{n} zones on",fan:"Level {n}",supercool:"SuperCool",superfreeze:"SuperFrost",docked:"Docked",cleaning:"Cleaning",returning:"Returning",charging:"Charging"},btn:{pause:"Pause",resume:"Resume",start:"Start",stop:"Stop",off:"Switch off",on:"Switch on",cancel:"Cancel",on_state:"On"},ask:{stop:"Stop the {name}? This cancels the programme.",off:"Switch the {name} off?",off_running:"Switch the {name} off? The programme stops.",start:"Start {program} on the {name}?"},icon:{remote:"Remote control",mobile:"Remote start",door_open:"Door open",door_closed:"Door closed",door_locked:"Door locked",lost:"No connection, last known state",light:"Light on/off"},err:{send:"Not sent: {msg}",no_device:"No Miele appliance found. Pick one in the card settings.",old_integration:"This card works with Home Assistant's built-in Miele integration (since 2025.5). Your Miele appliances come from an older HACS integration."},prog:{title:"Programmes",all:"All programmes ({n})",fewer:"Fewer programmes",remote_on:"Remote start on",remote_off:"Remote start off",temp:"Temperature",time:"Time",none:"None",until_stop:"until you stop it",start:"Start",ask:"Start {what} on the {name}?",prepare:"Set up",ask_prepare:"Set up {what} on the {name}? You then start it on the appliance.",started:"{program} started.",prepared:"{program} is set. Press Start on the {name}.",cached:"List from {when}, kept in this browser.",why:{mobile_start:"Turn on Remote start on the {name} to start a programme here.",prepare:"Remote start is off. You can set up a programme and start it on the appliance.",waiting:"{program} is set on the {name}. Press Start on the appliance, or turn on Remote start to start it here.",busy:"A programme is running. You can start again once it's finished.",offline:"The {name} isn't connected.",no_programs:"Miele offers no programmes to start remotely on the {name}.",no_remote:"This {name} can't be started remotely.",no_list:"The programme list hasn't arrived yet."}},ed:{found:"Found: {model} ({kind}), drawing {drawing}.",more:"More settings",appliances:"Appliances",suggest:"Suggest a layout",export:"Copy as separate cards",copied:"Copied. Paste it into the YAML editor of a new view.",copy_by_hand:"Select the text above and copy it.",layout:{rooms:"Per room",grid:"Grid",active:"Active only",phone:"Phone",display:"Kitchen display (view only)"},f:{entity:"Appliance",name:"Name",finish:"Front colour",drawing:"Drawing",theme:"Theme",animations:"Animations",controls:"Show controls",big_countdown:"Large countdown",design:"Design",accent:"Accent colour",language:"Language",max_width:"Maximum drawing width",images:"Folder with your own drawings",programs:"Favourites",show_all:"Also all other programmes",collapsed:"Folded",layout:"Layout",programmes:"Programmes card"},h:{design:"Default from the type number.",entity:"Any entity of the appliance works.",accent:"For example #4fa3e0",max_width:"For example 380px",images:"For example /local/miele/ with washer.svg, dryer.svg, \u2026",programs:"Empty: a suggestion per appliance type."},finish:{lotus_white:"Lotus white",brilliant_white:"Brilliant white",pearl_beige:"Pearl beige",clean_steel:"CleanSteel",graphite_grey:"Graphite grey",obsidian_black:"Obsidian black"},drawing:{washer:"washing machine (W1)",washer_dryer:"washer-dryer (WT1)",dryer:"tumble dryer (T1)",dishwasher:"dishwasher",oven:"oven 60 cm",steam_oven:"steam oven 45 cm",microwave:"oven with microwave 45 cm",coffee:"coffee machine (CM)",coffee_builtin:"built-in coffee machine (CVA)",drawer:"warming drawer",hob:"hob",hood:"cooker hood",fridge:"fridge",wine:"wine unit",robot:"robot vacuum",generic:"generic"},theme:{dark:"Dark",light:"Light",auto:"Follows Home Assistant",ha:"Home Assistant's colours"},design:{chrome:"Chrome door",white:"White door (White Edition)",black:"Black door",graphite:"Graphite grey door",mtouch:"M Touch (no dial)",integrated:"Fully integrated",semi:"Semi-integrated",freestanding:"Freestanding",vitroline:"VitroLine",pureline:"PureLine",artline:"ArtLine (handleless)",contourline:"ContourLine",active:"Active (knobs)",cm7:"CM 7",cm6:"CM 6",induction:"Induction",extractor:"With extraction",wall:"Wall chimney",aura:"Aura (island)"},anim:{full:"Full",reduced:"Reduced",off:"Off"},w:{buttons:"The start, pause and stop buttons are switched off in Home Assistant.",enable:"Switch on",enabled:"Switched on. Home Assistant reloads the Miele integration shortly.",offline:"Not connected.",mobile_start:"Remote start is off right now."}},ov:{all_off:"All appliances are off"},unit:{rpm:"rpm",min:"min"},kind:{washer:"Washing machine",dryer:"Tumble dryer",washer_dryer:"Washer dryer",dishwasher:"Dishwasher",oven:"Oven",steam_oven:"Steam oven",steam_oven_combi:"Steam oven",steam_oven_micro:"Steam oven with microwave",dialog_oven:"Dialog oven",oven_microwave:"Oven with microwave",microwave:"Microwave",coffee:"Coffee machine",drawer:"Warming drawer",hob:"Hob",hood:"Cooker hood",fridge:"Fridge",wine:"Wine cabinet",vacuum:"Robot vacuum",other:"Miele appliance"}},Lt={nl:Si,en:Ze},Q=(t,e)=>{let o=String(e?.language||t?.locale?.language||t?.language||"en").slice(0,2).toLowerCase();return Lt[o]?o:"en"};function k(t,e,o){let i=e.split(".").reduce((r,s)=>r?.[s],Lt[t]??Ze)??e.split(".").reduce((r,s)=>r?.[s],Ze)??e;return o?i.replace(/\{(\w+)\}/g,(r,s)=>o[s]??""):i}var Mi={status:{autocleaning:["Automatic cleaning","Automatisch spoelen"],reserved:["Reserved","Gereserveerd"],supercooling:["Supercooling","SuperKoelen"],superfreezing:["Superfreezing","SuperVriezen"],supercooling_superfreezing:["Supercooling/superfreezing","SuperKoelen/SuperVriezen"],superheating:["Superheating","Snel opwarmen"]},phase:{"2nd_espresso":["2nd espresso coffee","2e espresso"],"2nd_grinding":["2nd grinding","2e keer malen"],"2nd_pre_brewing":["2nd pre-brewing","2e voorbrouwen"],comfort_cooling:["Comfort cooling","Comfortkoeling"],cooling_phase:["Cooling phase","Afkoelen"],dispensing:["Dispensing","Uitschenken"],dust_box_missing:["Missing dust box","Stofbox ontbreekt"],energy_save:["Energy save","Energiebesparing"],espresso:["Espresso coffee","Espresso"],final_rinse:["Final rinse","Laatste spoeling"],flex_load_active:["FlexLoad active","FlexLoad actief"],freshen_up_and_moisten:["Freshen up & moisten","Opfrissen en bevochtigen"],going_to_target_area:["Going to target area","Onderweg naar doelzone"],grinding:["Grinding","Malen"],hand_iron:["Hand iron","Strijkdroog"],hygiene_drying:["Hygiene drying","Hygi\xEBnisch drogen"],interim_rinse:["Interim rinse","Tussenspoeling"],keep_warm:["Keep warm","Warmhouden"],keeping_warm:["Keeping warm","Warmhouden"],milk_foam:["Milk foam","Melkschuim"],moisten:["Moisten","Bevochtigen"],motor_overload:["Check dust box and filter","Controleer stofbox en filter"],perfect_dry_active:["PerfectDry active","PerfectDry actief"],pre_brewing:["Pre-brewing","Voorbrouwen"],pre_dishwash:["Pre-cleaning","Voorreinigen"],process_finished:["Process finished","Klaar"],process_running:["Process running","Bezig"],program_running:["Program running","Programma loopt"],reactivating:["Reactivating","Opnieuw starten"],remote_controlled:["Remote controlled","Op afstand bediend"],rinse_out_lint:["Rinse out lint","Pluizen uitspoelen"],rinses:["Rinses","Spoelen"],roasting:["Roasting","Braden"],safety_cooling:["Safety cooling","Veiligheidskoeling"],searing:["Searing","Aanbraden"],slightly_dry:["Slightly dry","Licht droog"],slow_roasting:["Slow roasting","Lagetemperatuurgaren"],soak:["Soak","Inweken"],starch_stop:["Starch stop","Stijfselstop"],steam_reduction:["Steam reduction","Stoomreductie"],steam_smoothing:["Steam smoothing","Stoomgladmaken"],thermo_spin:["Thermo spin","ThermoSpin"],timed_drying:["Timed drying","Drogen op tijd"],venting:["Venting","Ontluchten"],waiting_for_start:["Waiting for start","Wacht op start"],warm_cups_glasses:["Warm cups/glasses","Kopjes en glazen voorverwarmen"],warm_dishes_plates:["Warm dishes/plates","Borden voorverwarmen"],wheel_lifted:["Wheel lifted","Wiel opgetild"]},program:{clean_machine:["Clean machine","Machine reinigen"],easy_care:["Easy care","Onderhoudsarm"],freshen_up:["Freshen up","Opfrissen"],outdoor_garments:["Outdoor garments","Outdoorkleding"],rinse_out_lint:["Rinse out lint","Pluizen uitspoelen"],separate_rinse_starch:["Separate rinse/starch","Apart spoelen/stijven"],steam_care:["Steam care","Stoomverzorging"],stuffed_toys:["Stuffed toys","Knuffels"],towels:["Towels","Handdoeken"],trainers_refresh:["Trainers refresh","Sportschoenen opfrissen"],downs_duvets:["Downs/Duvets","Dons/dekbedden"],pillows_sanitize:["Pillows sanitize","Kussens hygi\xEBne"],steam_smoothing:["Steam smoothing","Stoomgladmaken"],fan_plus:["Fan plus","Hetelucht plus"],conventional_heat:["Conventional heat","Boven- en onderwarmte"],intensive_bake:["Intensive bake","Intensief bakken"],fan_grill:["Fan grill","Grill met circulatie"],eco_fan_heat:["ECO fan heat","ECO hetelucht"],top_heat:["Top heat","Bovenwarmte"],eco_steam_cooking:["ECO steam cooking","ECO stoomgaren"],steam_cooking:["Steam cooking","Stoomgaren"],rapid_steam_cooking:["Rapid steam cooking","Snel stoomgaren"],reheating_with_steam:["Reheating with steam","Opwarmen met stoom"],moisture_plus_fan_plus:["Moisture plus + Fan plus","Klimaatgaren + hetelucht plus"],keeping_warm:["Keeping warm","Warmhouden"],descale:["Descale","Ontkalken"],microwave_fan_plus:["Microwave + Fan plus","Microgolf + hetelucht plus"],microwave_fan_grill:["Microwave + Fan grill","Microgolf + grill met circulatie"],microwave_auto_roast:["Microwave + Auto roast","Microgolf + automatisch braden"],reheating_with_microwave:["Reheating with microwave","Opwarmen met microgolf"],auto_roast:["Auto roast","Automatisch braden"],low_temperature_cooking:["Low temperature cooking","Lagetemperatuurgaren"],appliance_settings:["Appliance settings menu","Instellingen"],brewing_unit_degrease:["Brewing unit degrease","Zetgroep ontvetten"],coffee_pot:["Coffee pot","Koffiepot"],descaling:["Appliance descaling","Ontkalken"],fruit_tea:["Fruit tea","Vruchtenthee"],herbal_tea:["Herbal tea","Kruidenthee"],intermediate_rinsing:["Intermediate rinsing","Tussentijds spoelen"],long_coffee:["Long coffee","Lange koffie"],very_hot_water:["Very hot water","Zeer heet water"],white_tea:["White tea","Witte thee"],evaporate_water:["Evaporate water","Water verdampen"],quick_microwave:["","Snel microgolf"],microwave_grill:["","Microgolf + grill"],keep_warm:["","Warmhouden"],slow_roasting:["","Lagetemperatuurgaren"],warm_cups_glasses:["","Kopjes en glazen voorverwarmen"],warm_dishes_plates:["","Borden voorverwarmen"]}};function M(t,e,o,i){if(o==null)return"";let r={program:"program_id",phase:"program_phase",dryness:"drying_step",status:"status"}[e],s=t?.localize?.(`component.miele.entity.sensor.${r}.state.${o}`),n=i==="nl"?Mi[e]?.[o]:null;return n&&(!s||s===n[0])?n[1]:s||String(o).replace(/_/g," ").replace(/^./,l=>l.toUpperCase())}var ue=["chrome","white","black","graphite","mtouch"];function ye(t){let e=String(t??"").replace(/\s+/g,"").toUpperCase();return/^WT[RW]\d/.test(e)||/^[WT][A-Z][RV]\d/.test(e)?"mtouch":/^W[SW][A-Z]\d/.test(e)?"white":"chrome"}var we=t=>t==="mtouch"?{...Ue,lcd:{...Ue.lcd,w:57}}:Ue,Ue={ratio:"600/850",view:"0 0 600 850",window:{x:50,y:43.53,d:50},ring:{path:"M300 132 A238 238 0 1 1 300 608 A238 238 0 1 1 300 132",width:8.5,spin:{x:50,y:43.53,d:79.4}},lcd:{x:36.33,y:3.06,w:27.33,h:7.53},icons:{size:5.8,at:[[9,7.4],[16,7.4],[23,7.4]]},panel:{left:4.5,right:4.5,top:75.6,bottom:5.4}},w=t=>`var(--f-${t})`;function Gi(t,e){let o=[26,20,30,22,28,18,24],i="";return o.forEach((r,s)=>{let n=e-27+s*9,l=o[6-s];i+=`<rect x="${t-40-r}" y="${n-1.1}" width="${r}" height="2.2" rx="1.1"/><circle cx="${t-34}" cy="${n}" r="1.3"/>`,i+=`<rect x="${t+40}" y="${n-1.1}" width="${l}" height="2.2" rx="1.1"/><circle cx="${t+34}" cy="${n}" r="1.3"/>`}),i}var Ci=(t,e,o,i,r)=>`<rect x="${t}" y="${e}" width="${o}" height="${i}" rx="${i/2}" fill="${r("slot")}"/>
  <path d="M${t+i/2} ${e+1.2} H${t+o-i/2}" stroke="#000" stroke-opacity=".18" stroke-width="2" stroke-linecap="round"/>`,Ye=(t,e,o)=>`<circle cx="${t}" cy="${e}" r="10.5" fill="${o("knob")}" style="stroke:${w("edge")}" stroke-width="1.4"/>`,Li=(t,e)=>e==="chrome"?"":`
  <linearGradient id="${t}-ringW" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" style="stop-color:${w("hi")}"/><stop offset=".55" style="stop-color:${w("mid")}"/><stop offset="1" style="stop-color:${w("lo")}"/>
  </linearGradient>
  <linearGradient id="${t}-ringB" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#4a4c50"/><stop offset=".25" stop-color="#1c1d20"/><stop offset=".6" stop-color="#2d2f33"/><stop offset="1" stop-color="#0f1012"/>
  </linearGradient>
  <linearGradient id="${t}-ringG" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#8e949a"/><stop offset=".3" stop-color="#5c6267"/><stop offset=".55" stop-color="#7c8288"/><stop offset="1" stop-color="#43484c"/>
  </linearGradient>
  <linearGradient id="${t}-ringS" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#e9ecee"/><stop offset=".35" stop-color="#c3c8cd"/><stop offset=".6" stop-color="#d9dde0"/><stop offset="1" stop-color="#a6adb3"/>
  </linearGradient>`,At={chrome:["chrome","chromeIn"],white:["ringW","ringW"],black:["ringB",null],graphite:["ringG","chromeIn"],mtouch:["ringS","chromeIn"]};function _e(t,e=!1,o="chrome"){let i=p=>`url(#${t}-${p})`,[r,s]=At[o]??At.chrome,n=o==="mtouch",l=o==="white",a="M10 18 H590 V127 H214 C209 150 190 168 152 170 H10 Z";return`<svg class="art-svg" viewBox="0 0 600 850" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
<defs>
  <linearGradient id="${t}-body" x1="0" x2="1">
    <stop offset="0" style="stop-color:${w("lo")}"/><stop offset=".05" style="stop-color:${w("mid")}"/>
    <stop offset=".42" style="stop-color:${w("hi")}"/><stop offset=".92" style="stop-color:${w("mid")}"/><stop offset="1" style="stop-color:${w("lo")}"/>
  </linearGradient>
  <linearGradient id="${t}-sheen" x1="0" x2="0" y1="0" y2="1">
    <stop offset="0" stop-color="#fff" stop-opacity=".14"/><stop offset=".3" stop-color="#fff" stop-opacity="0"/>
    <stop offset=".85" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".1"/>
  </linearGradient>
  <linearGradient id="${t}-panel" x1="0" x2="0" y1="0" y2="1">
    <stop offset="0" style="stop-color:${w("hi")}"/><stop offset=".7" style="stop-color:${w("hi")}"/><stop offset="1" style="stop-color:${w("mid")}"/>
  </linearGradient>
  <linearGradient id="${t}-under" x1="0" x2="0" y1="0" y2="1">
    <stop offset="0" stop-color="#000" stop-opacity=".12"/><stop offset="1" stop-color="#000" stop-opacity="0"/>
  </linearGradient>
  <linearGradient id="${t}-slot" x1="0" x2="0" y1="0" y2="1">
    <stop offset="0" style="stop-color:${w("edge")}"/><stop offset=".6" style="stop-color:${w("lo")}"/><stop offset="1" style="stop-color:${w("mid")}"/>
  </linearGradient>
  <linearGradient id="${t}-flap" x1="0" x2="0" y1="0" y2="1">
    <stop offset="0" style="stop-color:${w("hi")}"/><stop offset="1" style="stop-color:${w("mid")}"/>
  </linearGradient>
  <radialGradient id="${t}-knob" cx=".42" cy=".38" r=".7">
    <stop offset="0" style="stop-color:${w("hi")}"/><stop offset=".75" style="stop-color:${w("mid")}"/><stop offset="1" style="stop-color:${w("lo")}"/>
  </radialGradient>
  <linearGradient id="${t}-chrome" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#fbfcfd"/><stop offset=".15" stop-color="#cfd4d9"/><stop offset=".32" stop-color="#8a9299"/>
    <stop offset=".48" stop-color="#f3f5f7"/><stop offset=".66" stop-color="#a4abb2"/><stop offset=".82" stop-color="#e6e9ec"/><stop offset="1" stop-color="#7a828a"/>
  </linearGradient>
  <linearGradient id="${t}-chromeIn" x1="1" y1="1" x2="0" y2="0">
    <stop offset="0" stop-color="#f4f6f7"/><stop offset=".35" stop-color="#9ea6ad"/><stop offset=".6" stop-color="#e2e6e9"/><stop offset="1" stop-color="#8c949b"/>
  </linearGradient>
  <radialGradient id="${t}-bezel" cx=".5" cy=".42" r=".55">
    <stop offset=".72" stop-color="${e?"#5b6066":"#3a3e43"}"/><stop offset=".88" stop-color="${e?"#3d4146":"#1f2225"}"/><stop offset="1" stop-color="#121416"/>
  </radialGradient>
  <radialGradient id="${t}-glass" cx=".45" cy=".4" r=".65">
    <stop offset="0" stop-color="#7d858c"/><stop offset=".7" stop-color="#454b51"/><stop offset="1" stop-color="#22262a"/>
  </radialGradient>
  <radialGradient id="${t}-shadow">
    <stop offset=".9" stop-color="#000" stop-opacity=".16"/><stop offset="1" stop-color="#000" stop-opacity="0"/>
  </radialGradient>
  <radialGradient id="${t}-ground" cx=".5" cy=".5" r=".5">
    <stop offset="0" stop-color="#000" stop-opacity=".3"/><stop offset="1" stop-color="#000" stop-opacity="0"/>
  </radialGradient>
  <linearGradient id="${t}-screen" x1="0" x2="0" y1="0" y2="1">
    <stop offset="0" stop-color="#17191c"/><stop offset="1" stop-color="#060708"/>
  </linearGradient>
  <clipPath id="${t}-top"><path d="${a}"/></clipPath>${Li(t,o)}
</defs>

<ellipse cx="300" cy="842" rx="292" ry="8" fill="${i("ground")}"/>

<g class="body">
  <rect x="10" y="8" width="580" height="830" rx="10" fill="${i("body")}"/>
  <rect x="10" y="8" width="580" height="830" rx="10" fill="${i("sheen")}"/>
  <rect x="10.5" y="8.5" width="579" height="829" rx="10" fill="none" style="stroke:${w("edge")}" stroke-width="1.3"/>
  <path d="M14 10 H586" stroke="#fff" stroke-opacity=".6" stroke-width="1.4"/>
  <path d="M10 18 H590" style="stroke:${w("edge")}" stroke-opacity=".7" stroke-width="1.1"/>
</g>

<g class="controls">
  <path d="${a}" fill="${i("panel")}"/>
  <path d="M214 127 C209 150 190 168 152 170 H10 V188 H152 C200 186 226 160 232 145 H590 V127 Z" fill="${i("under")}"/>
  <path d="M590 127 H214 C209 150 190 168 152 170 H10" fill="none" style="stroke:${w("edge")}" stroke-width="1.3"/>
  <path d="M207 19 V110" style="stroke:${w("edge")}" stroke-opacity=".75" stroke-width="1.1"/>
  ${Ci(44,128,110,24,i)}
  <rect x="218" y="26" width="${n?342:164}" height="64" rx="6" fill="${i("screen")}"/>
  <path d="M222 29 H${n?556:378} L${n?540:362} 46 H222 Z" fill="#fff" opacity=".045"/>
  ${n?"":`<g style="fill:${w("ink")}" opacity=".26">${Gi(486,50)}</g>
  <circle cx="486" cy="50" r="26" fill="${i(l?"knob":"chrome")}"${l?` style="stroke:${w("edge")}" stroke-width="1.2"`:""}/>
  <circle cx="486" cy="50" r="22.5" fill="${i(l?"panel":"chromeIn")}"/>
  <circle cx="486" cy="50" r="19" fill="${i("knob")}" stroke="#000" stroke-opacity=".08"/>
  <path d="M480.5 59.5 L476.5 66.5" stroke="#f2a33a" stroke-width="3.4" stroke-linecap="round"/>`}
</g>

<g class="door">
  <circle cx="303" cy="377" r="238" fill="${i("shadow")}"/>
  <circle cx="300" cy="370" r="228" fill="${i(r)}"/>${l?`
  <circle cx="300" cy="370" r="227.3" fill="none" style="stroke:${w("edge")}" stroke-width="1.4"/>`:""}
  <circle cx="300" cy="370" r="214" fill="${s?i(s):"#f2f1ec"}"/>${l||o==="black"?`
  <circle cx="300" cy="370" r="214" fill="none" stroke="#000" stroke-opacity=".12" stroke-width="1.2"/>`:""}
  <circle cx="300" cy="370" r="186" fill="#8d959c"/>
  <circle cx="300" cy="370" r="183" fill="${i("bezel")}"/>
  <circle cx="300" cy="370" r="151" fill="${i("glass")}"/>
  <path d="${e?"M370.6 218.6 A167 167 0 0 1 447.4 291.6":"M148.6 299.4 A167 167 0 0 1 216.5 225.4"}" fill="none" stroke="#f2a33a" stroke-width="8" stroke-linecap="round"/>
  <path d="M520 334 a228 228 0 0 1 0 72" fill="none" stroke="#000" stroke-opacity=".22" stroke-width="7" stroke-linecap="round"/>
  <path d="M110 250 a222 222 0 0 1 150 -100" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="3.5" stroke-linecap="round"/>
</g>

<g class="lower">
  ${e?`<rect x="30" y="646" width="236" height="154" rx="8" fill="${i("flap")}" style="stroke:${w("edge")}" stroke-width="1.3"/>
  ${Ye(148,722,i)}
  <rect x="274" y="646" width="296" height="154" rx="8" fill="${i("flap")}" style="stroke:${w("edge")}" stroke-width="1.3"/>
  <g style="fill:${w("lo")}">${Array.from({length:13},(p,d)=>`<rect x="290" y="${660+d*10.4}" width="264" height="5" rx="2.5"/>`).join("")}</g>
  <g fill="#000" opacity=".1">${Array.from({length:13},(p,d)=>`<rect x="290" y="${660+d*10.4}" width="264" height="1.6" rx=".8"/>`).join("")}</g>`:`<rect x="35" y="646" width="180" height="152" rx="8" fill="${i("flap")}" style="stroke:${w("edge")}" stroke-width="1.3"/>
  ${Ye(125,672,i)}
  <rect x="272" y="646" width="292" height="152" rx="8" fill="${i("flap")}" style="stroke:${w("edge")}" stroke-width="1.3"/>
  ${Ye(418,672,i)}`}
  <rect x="10" y="810" width="580" height="28" rx="6" style="fill:${w("lo")}"/>
  <path d="M12 810.5 H588" style="stroke:${w("edge")}" stroke-width="1.2"/>
  <rect x="10" y="830" width="580" height="8" rx="4" fill="#000" opacity=".22"/>
</g>
</svg>`}var Ai=t=>`<pattern id="${t}-hex" width="13" height="22.5" patternUnits="userSpaceOnUse" patternTransform="rotate(8)">
  <path d="M6.5 0 L13 3.75 L13 11.25 L6.5 15 L0 11.25 L0 3.75 Z M6.5 15 V22.5" fill="none" stroke="#000" stroke-opacity=".14" stroke-width=".9"/>
  <path d="M6.5 1.2 L11.8 4.3" stroke="#fff" stroke-opacity=".35" stroke-width=".8"/>
</pattern>`,Ei=t=>`<pattern id="${t}-hex" width="7" height="12.12" patternUnits="userSpaceOnUse" patternTransform="rotate(8)">
  <circle cx="3.5" cy="3" r="1.25" fill="#000" fill-opacity=".38"/><circle cx="0" cy="9.06" r="1.25" fill="#000" fill-opacity=".38"/><circle cx="7" cy="9.06" r="1.25" fill="#000" fill-opacity=".38"/>
</pattern>`,Hi=(t,e)=>`<svg viewBox="0 0 200 200" aria-hidden="true"><defs>
  <radialGradient id="${t}-steel" cx=".5" cy=".46" r=".56">
    <stop offset="0" stop-color="#e3e6e9"/><stop offset=".4" stop-color="#c3c8cd"/><stop offset=".78" stop-color="#8e959b"/><stop offset="1" stop-color="#4e5459"/>
  </radialGradient>
  <linearGradient id="${t}-lifter" x1="0" x2="1"><stop offset="0" stop-color="#f4f6f7"/><stop offset="1" stop-color="#a9b0b6"/></linearGradient>
  ${e?Ei(t):Ai(t)}</defs>
  <circle cx="100" cy="100" r="100" fill="url(#${t}-steel)"/>
  <circle cx="100" cy="100" r="94" fill="url(#${t}-hex)"/>
  <circle cx="100" cy="100" r="58" fill="none" stroke="#000" stroke-opacity=".1" stroke-width="10"/>
  <g fill="url(#${t}-lifter)" stroke="#000" stroke-opacity=".16" stroke-width=".8">
    <path d="M92 8 C96 26 104 34 116 38 L110 8 Z"/><path d="M92 8 C96 26 104 34 116 38 L110 8 Z" transform="rotate(120 100 100)"/><path d="M92 8 C96 26 104 34 116 38 L110 8 Z" transform="rotate(240 100 100)"/>
  </g>
  <circle cx="100" cy="100" r="15" fill="#cfd3d7" stroke="#000" stroke-opacity=".18"/><circle cx="100" cy="100" r="6" fill="#9aa1a7"/></svg>`,zi=(t,e)=>{let o=e?["#7d8fa3","#e9e5dc","#c3958c","#a9b0b8","#8f9e86","#ddd6c8"]:["#3f5a78","#e7e3db","#b98582","#8b929a","#86a084","#d8d2c6"];return`<svg viewBox="0 0 200 200" aria-hidden="true"><defs>
  <linearGradient id="${t}-fold" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".2"/><stop offset=".55" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".32"/></linearGradient>
  <clipPath id="${t}-towel"><path d="M86 158 C84 140 98 128 118 128 C140 126 160 136 164 152 C168 168 154 182 132 184 C108 186 88 176 86 158 Z"/></clipPath></defs>
  <g stroke="#000" stroke-opacity=".16" stroke-width="1.2" stroke-linejoin="round">
    <path d="M118 120 L134 106 C146 102 160 108 166 120 L170 140 C162 148 148 150 136 146 L120 140 C112 134 112 126 118 120 Z" fill="${o[3]}"/>
    <path d="M30 128 C30 116 42 110 52 112 L66 116 C72 122 70 132 62 136 L44 140 C36 140 30 136 30 128 Z" fill="${o[4]}"/>
    <path d="M56 134 C60 118 76 108 94 108 L110 112 C122 116 126 128 120 138 C112 148 96 152 82 150 L66 148 C58 146 54 140 56 134 Z" fill="${o[2]}"/>
    <path d="M24 160 C26 146 40 136 58 134 L88 132 C100 134 106 144 102 156 L96 170 C88 180 72 184 56 182 L38 178 C28 174 22 168 24 160 Z" fill="${o[0]}"/>
    <path d="M86 158 C84 140 98 128 118 128 C140 126 160 136 164 152 C168 168 154 182 132 184 C108 186 88 176 86 158 Z" fill="${o[1]}"/>
    <path d="M128 172 C134 164 150 162 160 168 L172 176 C170 186 158 192 146 190 L132 186 C124 182 124 176 128 172 Z" fill="${o[5]}"/>
  </g>
  <g clip-path="url(#${t}-towel)" fill="${o[0]}" opacity=".55"><rect x="80" y="146" width="100" height="5"/><rect x="80" y="155" width="100" height="2.5"/></g>
  <path d="M24 160 C26 146 40 136 58 134 L88 132 C100 134 106 144 102 156 L96 170 C88 180 72 184 56 182 L38 178 C28 174 22 168 24 160 Z
    M86 158 C84 140 98 128 118 128 C140 126 160 136 164 152 C168 168 154 182 132 184 C108 186 88 176 86 158 Z
    M56 134 C60 118 76 108 94 108 L110 112 C122 116 126 128 120 138 C112 148 96 152 82 150 L66 148 C58 146 54 140 56 134 Z" fill="url(#${t}-fold)"/>
  <path d="M40 150 C52 146 66 150 74 160 M62 172 C72 166 84 166 92 172 M100 150 C112 144 126 146 134 156 M72 124 C82 120 94 122 102 130 M128 118 C138 116 150 120 156 130"
    fill="none" stroke="#000" stroke-opacity=".2" stroke-width="1.6" stroke-linecap="round"/>
  <path d="M58 136 L66 128 M110 113 L104 122" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="1.4" stroke-linecap="round"/></svg>`},Di=t=>`<svg viewBox="0 0 400 200" preserveAspectRatio="none" aria-hidden="true"><defs>
  <linearGradient id="${t}-water" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#7fb8e6" stop-opacity=".55"/><stop offset="1" stop-color="#2d6aa3" stop-opacity=".62"/></linearGradient></defs>
  <path d="M0 132 C25 124 50 140 75 132 S125 124 150 132 S200 140 225 132 S275 124 300 132 S350 140 375 132 S400 128 400 128 V200 H0 Z" fill="url(#${t}-water)"/>
  <path d="M0 132 C25 124 50 140 75 132 S125 124 150 132 S200 140 225 132 S275 124 300 132 S350 140 375 132" fill="none" stroke="#d8ecfb" stroke-opacity=".5" stroke-width="1.6"/></svg>`,Oi=t=>`<svg viewBox="0 0 200 200" aria-hidden="true"><defs>
  <radialGradient id="${t}-vig" cx=".5" cy=".5" r=".5"><stop offset=".72" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".45"/></radialGradient>
  <linearGradient id="${t}-shine" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".26"/><stop offset=".45" stop-color="#fff" stop-opacity=".03"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient></defs>
  <circle cx="100" cy="100" r="100" fill="#0d1218" opacity=".1"/>
  <circle cx="100" cy="100" r="100" fill="url(#${t}-vig)"/>
  <path d="M30 70 A80 80 0 0 1 112 22 A92 92 0 0 0 46 96 Z" fill="url(#${t}-shine)"/></svg>`;function xe(t,e=!1,o=!1){return`<div class="layer drum">${Hi(t,e)}</div>
    <div class="layer laundry">${zi(t,e)}</div>
    ${e?'<div class="layer heat"></div><div class="layer chill"></div>':`<div class="layer water"><div class="wave">${Di(t)}</div></div>`}${o?'<div class="layer heat"></div><div class="layer chill"></div>':""}
    <div class="layer led"></div>
    <div class="layer reflect">${Oi(t)}</div>`}var se=t=>`var(--f-${t})`;function H(t,e,o,i,r){return`M${t+o/2} ${e} H${t+o-r} A${r} ${r} 0 0 1 ${t+o} ${e+r} V${e+i-r} A${r} ${r} 0 0 1 ${t+o-r} ${e+i} H${t+r} A${r} ${r} 0 0 1 ${t} ${e+i-r} V${e+r} A${r} ${r} 0 0 1 ${t+r} ${e} Z`}var Et=t=>({ratio:"600/456",view:"0 0 600 456",window:{left:17,top:44.96,width:66,height:36.62,radius:"1.6% / 3.8%"},ring:{path:H(92,195,416,187,14),width:6},lcd:t?{x:41.5,y:11,w:17,h:7.6}:{x:34,y:5.26,w:32,h:15.35},icons:{size:4.2,at:[[78,9],[83,9],[88,9],[93,9]]},panel:null}),ne=(t,e)=>{let o=[118,146,168,400,424,448,472];return`<path d="M84 ${t} H516" style="stroke:${e}" stroke-opacity=".28" stroke-width="1.2"/>
  <circle cx="104" cy="${t-10}" r="6.5" fill="none" style="stroke:${e}" stroke-opacity=".6" stroke-width="1.6"/>
  <path d="M104 ${t-16} v5" style="stroke:${e}" stroke-opacity=".6" stroke-width="1.6" stroke-linecap="round"/>
  ${o.map(i=>`<rect x="${i-4}" y="${t-14}" width="8" height="8" rx="2" fill="none" style="stroke:${e}" stroke-opacity=".45" stroke-width="1.2"/>`).join("")}
  <g style="fill:${e}" opacity=".35">${Array.from({length:28},(i,r)=>`<rect x="${226+r*5.4}" y="${t-11}" width="1.6" height="3" rx=".8"/>`).join("")}</g>`},Je=t=>Array.from({length:8},(e,o)=>{let i=146+o*38;return`<rect x="${i}" y="24" width="24" height="17" rx="3" fill="none" style="stroke:${t}" stroke-opacity=".9" stroke-width="1.5"/>
    <path d="M${i+6} ${o%2?31:34} h12 M${i+6} ${o%2?35:30} h7" style="stroke:${t}" stroke-opacity=".8" stroke-width="1.3" stroke-linecap="round"/>`}).join("");function Ht(t,e=!1){let o=s=>`url(#${t}-${s})`,i=se("ink"),r=e?{x:249,y:50,w:102,h:35}:{x:204,y:24,w:192,h:70};return`<svg class="art-svg" viewBox="0 0 600 456" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
<defs>
  <linearGradient id="${t}-front" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" style="stop-color:${se("hi")}"/><stop offset=".45" style="stop-color:${se("mid")}"/><stop offset="1" style="stop-color:${se("lo")}"/>
  </linearGradient>
  <linearGradient id="${t}-sheen" x1="0" x2="1">
    <stop offset="0" stop-color="#fff" stop-opacity=".02"/><stop offset=".3" stop-color="#fff" stop-opacity=".07"/>
    <stop offset=".55" stop-color="#fff" stop-opacity=".01"/><stop offset="1" stop-color="#fff" stop-opacity=".04"/>
  </linearGradient>
  <linearGradient id="${t}-slot" x1="0" x2="0" y1="0" y2="1">
    <stop offset="0" stop-color="#000"/><stop offset=".7" stop-color="#0b0c0d"/><stop offset="1" stop-color="#1a1b1d"/>
  </linearGradient>
  <linearGradient id="${t}-screen" x1="0" x2="0" y1="0" y2="1">
    <stop offset="0" stop-color="#121315"/><stop offset="1" stop-color="#040405"/>
  </linearGradient>
</defs>
<g class="body">
  <rect x="1" y="1" width="598" height="454" rx="5" fill="${o("front")}"/>
  <rect x="1" y="1" width="598" height="454" rx="5" fill="${o("sheen")}"/>
  <rect x="1.5" y="1.5" width="597" height="453" rx="5" fill="none" style="stroke:${se("edge")}" stroke-width="1.6"/>
  <path d="M8 3 H592" stroke="#fff" stroke-opacity=".14" stroke-width="1.2"/>
</g>
<g class="controls">
  ${e?Je(i):""}
  <rect x="${r.x}" y="${r.y}" width="${r.w}" height="${r.h}" rx="${e?3:5}" fill="${o("screen")}" stroke="#fff" stroke-opacity=".06"/>
  ${ne(103,i)}
</g>
<g class="slot">
  <rect x="1" y="110" width="598" height="15" fill="${o("slot")}"/>
  <path d="M1 110.6 H599" stroke="#fff" stroke-opacity=".22" stroke-width="1.2"/>
  <path d="M1 124.6 H599" stroke="#fff" stroke-opacity=".08" stroke-width="1"/>
</g>
<g class="door">
  <rect x="100" y="203" width="400" height="171" rx="11" fill="#000" opacity=".35"/>
  <rect x="102" y="205" width="396" height="167" rx="9" fill="#0d0e10"/>
</g>
</svg>`}var Ti=t=>`<svg viewBox="0 0 396 167" preserveAspectRatio="none" aria-hidden="true"><defs>
  <radialGradient id="${t}-wall" cx=".5" cy=".55" r=".7"><stop offset="0" stop-color="#2a2b2e"/><stop offset=".7" stop-color="#151618"/><stop offset="1" stop-color="#08090a"/></radialGradient></defs>
  <rect width="396" height="167" fill="url(#${t}-wall)"/>
  <path d="M0 0 L40 22 V145 L0 167 M396 0 L356 22 V145 L396 167 M40 22 H356 M40 145 H356" fill="none" stroke="#fff" stroke-opacity=".06" stroke-width="1.5"/>
  <path d="M6 64 H40 M356 64 H390 M6 112 H40 M356 112 H390" stroke="#9aa1a8" stroke-opacity=".35" stroke-width="3" stroke-linecap="round"/>
  <path d="M60 14 L80 8 L100 14 L120 8 L140 14 L160 8 L180 14 L200 8 L220 14 L240 8 L260 14 L280 8 L300 14 L320 8 L336 14" fill="none" stroke="#5b5f64" stroke-opacity=".7" stroke-width="2.2" stroke-linejoin="round"/></svg>`,Ii=()=>`<svg viewBox="0 0 396 167" preserveAspectRatio="none" aria-hidden="true">
  <path d="M40 112 H356" stroke="#b9c0c6" stroke-opacity=".55" stroke-width="2.4"/>
  <path d="M128 112 L138 132 H258 L268 112 Z" fill="#3b3f44"/>
  <path d="M128 112 H268" stroke="#9aa1a8" stroke-width="2"/>
  <path d="M146 112 C156 92 180 86 198 88 C218 86 240 92 250 112 Z" fill="#9c6a42"/>
  <path d="M160 104 C172 96 188 94 198 96" fill="none" stroke="#e2b07a" stroke-opacity=".55" stroke-width="3" stroke-linecap="round"/></svg>`,Xe=t=>`<div class="layer w"><svg viewBox="0 0 396 167" preserveAspectRatio="none" aria-hidden="true">
  <path d="${t}" fill="none" stroke="#f2f5f7" stroke-opacity=".5" stroke-width="7" stroke-linecap="round"/></svg></div>`,Qe=()=>`<div class="layer wv"><svg viewBox="0 0 396 167" aria-hidden="true">
  <circle cx="198" cy="84" r="34" fill="none" stroke="#9fd3ff" stroke-opacity=".75" stroke-width="3"/></svg></div>`,ji=(t,e)=>`<svg viewBox="0 0 396 167" preserveAspectRatio="none" aria-hidden="true"><defs>
  ${e?`<pattern id="${t}-mesh" width="4" height="4" patternUnits="userSpaceOnUse"><path d="M0 0 H4 M0 0 V4" stroke="#000" stroke-opacity=".55" stroke-width="1.3"/></pattern>`:`<pattern id="${t}-mesh" width="5" height="5" patternUnits="userSpaceOnUse"><circle cx="2.5" cy="2.5" r=".95" fill="#000" fill-opacity=".45"/></pattern>`}
  <linearGradient id="${t}-refl" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".1"/><stop offset=".4" stop-color="#fff" stop-opacity=".02"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient></defs>
  <rect width="396" height="167" fill="url(#${t}-mesh)"/>
  <rect width="396" height="167" fill="url(#${t}-refl)"/></svg>`;function et(t,e=!1){return`<div class="layer cavity">${Ti(t)}</div>
    <div class="layer dish">${Ii()}</div>
    <div class="layer glow"></div>
    <div class="layer light"></div>
    <div class="layer steam">${Xe("M150 100 C140 80 162 66 150 46 S156 18 148 6")}${Xe("M200 104 C210 82 188 66 200 44 S192 18 202 4")}${Xe("M250 100 C240 78 262 64 248 42 S256 20 246 6")}</div>
    ${e?`<div class="layer waves">${Qe()}${Qe()}${Qe()}</div>`:""}
    <div class="layer print">${ji(t,e)}</div>`}var F=t=>`var(--f-${t})`,Ot=["vitroline","pureline","artline","contourline","active"],it=["artline","vitroline","pureline","contourline"],Tt=/^(H|DGC|DGM|DG|DO)\d{4}[A-Z]*X/;function It(t){return/^H2\d/.test(t)?"active":Tt.test(t)?"artline":/^H71\d/.test(t)?"contourline":"vitroline"}var rt=t=>Tt.test(t)?"artline":"vitroline";function st(t){if(/^H2\d/.test(t))return"knobs";if(/^DO/.test(t))return"mtouch";let e=/^(?:H|DGC|DGM|DG)\d(\d)/.exec(t),o=e?Number(e[1]):4;return o>=8?"mtouch":o>=6?"mtouchS":o>=3?"direct":"directS"}var zt={mtouch:{x:204,y:24,w:192,h:70},mtouchS:{x:214,y:30,w:172,h:58},direct:{x:220,y:34,w:160,h:44},directS:{x:236,y:40,w:128,h:36},knobs:{x:236,y:36,w:128,h:42}},jt=(t,e)=>t==="direct"&&e?{x:249,y:50,w:102,h:35}:zt[t]??zt.direct,Rt=t=>t?{x:92,y:214,w:416,h:336}:{x:102,y:205,w:396,h:167};function nt({panel:t,microwave:e,full:o}){let i=o?596:456,r=jt(t,e),s=Rt(o),n=41/i*100,l=t==="knobs"?63:78;return{ratio:`600/${i}`,view:`0 0 600 ${i}`,window:{left:s.x/6,top:s.y/i*100,width:s.w/6,height:s.h/i*100,radius:o?"1.6% / 2%":"1.6% / 3.8%"},ring:{path:H(s.x-10,s.y-10,s.w+20,s.h+20,14),width:6},lcd:{x:r.x/6,y:r.y/i*100,w:r.w/6,h:r.h/i*100},icons:{size:4.2,at:[0,1,2,3].map(a=>[l+a*5,n])},panel:null}}var Dt=(t,e,o)=>`<circle cx="${t}" cy="${e}" r="27" fill="${o("steel")}"/>
  <circle cx="${t}" cy="${e}" r="21" fill="${o("knob")}" stroke="#000" stroke-opacity=".25"/>
  <path d="M${t} ${e-18} v10" stroke="#2a2c2f" stroke-width="3" stroke-linecap="round"/>`;function at(t,{design:e="vitroline",panel:o="direct",microwave:i=!1,full:r=!0}={}){let s=h=>`url(#${t}-${h})`,n=r?596:456,l=F("ink"),a=jt(o,i),p=Rt(r),d=e==="pureline"||e==="contourline"||e==="active",c=e==="contourline"?14:0;return`<svg class="art-svg" viewBox="0 0 600 ${n}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
<defs>
  <linearGradient id="${t}-front" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" style="stop-color:${F("hi")}"/><stop offset=".45" style="stop-color:${F("mid")}"/><stop offset="1" style="stop-color:${F("lo")}"/>
  </linearGradient>
  <linearGradient id="${t}-sheen" x1="0" x2="1">
    <stop offset="0" stop-color="#fff" stop-opacity=".02"/><stop offset=".3" stop-color="#fff" stop-opacity=".07"/>
    <stop offset=".55" stop-color="#fff" stop-opacity=".01"/><stop offset="1" stop-color="#fff" stop-opacity=".04"/>
  </linearGradient>
  <linearGradient id="${t}-steel" x1="0" x2="1">
    <stop offset="0" stop-color="#9aa1a7"/><stop offset=".2" stop-color="#e3e6e9"/><stop offset=".5" stop-color="#b9bfc4"/><stop offset=".8" stop-color="#eceff1"/><stop offset="1" stop-color="#90979d"/>
  </linearGradient>
  <linearGradient id="${t}-glassbar" x1="0" x2="0" y1="0" y2="1">
    <stop offset="0" style="stop-color:${F("hi")}"/><stop offset="1" style="stop-color:${F("lo")}"/>
  </linearGradient>
  <radialGradient id="${t}-knob" cx=".4" cy=".35" r=".7"><stop offset="0" stop-color="#4a4d51"/><stop offset="1" stop-color="#16171a"/></radialGradient>
  <linearGradient id="${t}-slot" x1="0" x2="0" y1="0" y2="1">
    <stop offset="0" stop-color="#000"/><stop offset=".7" stop-color="#0b0c0d"/><stop offset="1" stop-color="#1a1b1d"/>
  </linearGradient>
  <linearGradient id="${t}-screen" x1="0" x2="0" y1="0" y2="1">
    <stop offset="0" stop-color="#121315"/><stop offset="1" stop-color="#040405"/>
  </linearGradient>
</defs>
<g class="body">
  <rect x="1" y="1" width="598" height="${n-2}" rx="5" fill="${s(e==="contourline"?"steel":"front")}"/>
  ${c?`<rect x="${c}" y="${c}" width="${600-2*c}" height="${n-2*c}" rx="3" fill="${s("front")}"/>`:""}
  <rect x="1" y="1" width="598" height="${n-2}" rx="5" fill="${s("sheen")}"/>
  <rect x="1.5" y="1.5" width="597" height="${n-3}" rx="5" fill="none" style="stroke:${F("edge")}" stroke-width="1.6"/>
  <path d="M8 3 H592" stroke="#fff" stroke-opacity=".14" stroke-width="1.2"/>
</g>
<g class="controls">
  ${o==="direct"&&i?Je(l):""}
  ${o==="knobs"?Dt(96,60,s)+Dt(504,60,s):""}
  <rect x="${a.x}" y="${a.y}" width="${a.w}" height="${a.h}" rx="${o.startsWith("mtouch")?5:3}" fill="${s("screen")}" stroke="#fff" stroke-opacity=".06"/>
  ${o==="knobs"?"":ne(103,l)}
</g>
${e==="artline"?`<g class="slot">
  <rect x="1" y="110" width="598" height="15" fill="${s("slot")}"/>
  <path d="M1 110.6 H599" stroke="#fff" stroke-opacity=".22" stroke-width="1.2"/>
  <path d="M1 124.6 H599" stroke="#fff" stroke-opacity=".08" stroke-width="1"/>
</g>`:`<g class="trim">
  <path d="M${c+1} 112 H${599-c}" stroke="#000" stroke-opacity=".55" stroke-width="2.4"/>
  ${e==="pureline"?`<rect x="${c+1}" y="113" width="${598-2*c}" height="5" fill="${s("steel")}"/>`:""}
  <rect x="66" y="${r?140:136}" width="468" height="9" rx="4.5" fill="#000" opacity=".45"/>
  <rect x="64" y="${r?132:128}" width="472" height="14" rx="7" fill="${s(d?"steel":"glassbar")}" ${d?"":`style="stroke:${F("edge")}"`} stroke-width="1"/>
  <path d="M72 ${r?134:130} H528" stroke="#fff" stroke-opacity="${d?".5":".32"}" stroke-width="1.4" stroke-linecap="round"/>
</g>`}
<g class="door">
  <rect x="${p.x-2}" y="${p.y-2}" width="${p.w+4}" height="${p.h+4}" rx="11" fill="#000" opacity=".35"/>
  <rect x="${p.x}" y="${p.y}" width="${p.w}" height="${p.h}" rx="9" fill="#0d0e10"/>
</g>
</svg>`}var Ri=t=>`<svg viewBox="0 0 396 320" preserveAspectRatio="none" aria-hidden="true"><defs>
  <radialGradient id="${t}-wall" cx=".5" cy=".55" r=".7"><stop offset="0" stop-color="#2a2b2e"/><stop offset=".7" stop-color="#151618"/><stop offset="1" stop-color="#08090a"/></radialGradient></defs>
  <rect width="396" height="320" fill="url(#${t}-wall)"/>
  <path d="M0 0 L40 26 V294 L0 320 M396 0 L356 26 V294 L396 320 M40 26 H356 M40 294 H356" fill="none" stroke="#fff" stroke-opacity=".06" stroke-width="1.5"/>
  <path d="${[92,150,208,262].map(e=>`M6 ${e} H40 M356 ${e} H390`).join(" ")}" stroke="#9aa1a8" stroke-opacity=".35" stroke-width="3" stroke-linecap="round"/>
  <path d="M60 16 L80 10 L100 16 L120 10 L140 16 L160 10 L180 16 L200 10 L220 16 L240 10 L260 16 L280 10 L300 16 L320 10 L336 16" fill="none" stroke="#5b5f64" stroke-opacity=".7" stroke-width="2.2" stroke-linejoin="round"/></svg>`,Ni=()=>`<svg viewBox="0 0 396 320" preserveAspectRatio="none" aria-hidden="true">
  <path d="M40 208 H356" stroke="#b9c0c6" stroke-opacity=".55" stroke-width="2.4"/>
  <path d="M120 208 L132 236 H264 L276 208 Z" fill="#3b3f44"/>
  <path d="M120 208 H276" stroke="#9aa1a8" stroke-width="2"/>
  <path d="M140 208 C152 180 180 172 198 174 C220 172 246 180 256 208 Z" fill="#9c6a42"/>
  <path d="M156 198 C170 188 188 186 198 188" fill="none" stroke="#e2b07a" stroke-opacity=".55" stroke-width="3" stroke-linecap="round"/></svg>`,tt=t=>`<div class="layer w"><svg viewBox="0 0 396 320" preserveAspectRatio="none" aria-hidden="true">
  <path d="${t}" fill="none" stroke="#f2f5f7" stroke-opacity=".5" stroke-width="7" stroke-linecap="round"/></svg></div>`,ot=()=>`<div class="layer wv"><svg viewBox="0 0 396 320" aria-hidden="true">
  <circle cx="198" cy="180" r="44" fill="none" stroke="#9fd3ff" stroke-opacity=".75" stroke-width="3"/></svg></div>`,Vi=(t,e)=>`<svg viewBox="0 0 396 320" preserveAspectRatio="none" aria-hidden="true"><defs>
  ${e?`<pattern id="${t}-mesh" width="4" height="4" patternUnits="userSpaceOnUse"><path d="M0 0 H4 M0 0 V4" stroke="#000" stroke-opacity=".55" stroke-width="1.3"/></pattern>`:`<pattern id="${t}-mesh" width="5" height="5" patternUnits="userSpaceOnUse"><circle cx="2.5" cy="2.5" r=".95" fill="#000" fill-opacity=".45"/></pattern>`}
  <linearGradient id="${t}-refl" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".1"/><stop offset=".4" stop-color="#fff" stop-opacity=".02"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient></defs>
  <rect width="396" height="320" fill="url(#${t}-mesh)"/>
  <rect width="396" height="320" fill="url(#${t}-refl)"/></svg>`;function Nt(t,e=!1){return`<div class="layer cavity">${Ri(t)}</div>
    <div class="layer dish">${Ni()}</div>
    <div class="layer glow"></div>
    <div class="layer light"></div>
    <div class="layer steam">${tt("M150 196 C140 160 162 136 150 100 S156 50 148 24")}${tt("M200 200 C210 162 188 136 200 98 S192 48 202 20")}${tt("M250 196 C240 158 262 134 248 96 S256 52 246 26")}</div>
    ${e?`<div class="layer waves">${ot()}${ot()}${ot()}</div>`:""}
    <div class="layer print">${Vi(t,e)}</div>`}var O=t=>`var(--f-${t})`,Vt={ratio:"600/620",view:"0 0 600 620",window:{left:36.67,top:48.39,width:53.33,height:41.94,radius:"4% / 5%"},ring:{path:H(212,292,336,276,18),width:4.5},lcd:{x:55,y:10,w:16.67,h:12.58},icons:{size:4.4,at:[[78,13.5],[82.6,13.5],[87.2,13.5],[91.8,13.5]]},panel:null};function Bt(t){let e=o=>`url(#${t}-${o})`;return`<svg class="art-svg" viewBox="0 0 600 620" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
<defs>
  <linearGradient id="${t}-body" x1="0" x2="1">
    <stop offset="0" style="stop-color:${O("lo")}"/><stop offset=".3" style="stop-color:${O("mid")}"/><stop offset=".7" style="stop-color:${O("mid")}"/><stop offset="1" style="stop-color:${O("lo")}"/>
  </linearGradient>
  <linearGradient id="${t}-block" x1="0" x2="0" y1="0" y2="1">
    <stop offset="0" style="stop-color:${O("mid")}"/><stop offset="1" style="stop-color:${O("edge")}"/>
  </linearGradient>
  <linearGradient id="${t}-gloss" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#fff" stop-opacity=".16"/><stop offset=".35" stop-color="#fff" stop-opacity=".03"/><stop offset=".6" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#fff" stop-opacity=".06"/>
  </linearGradient>
  <linearGradient id="${t}-under" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity=".55"/><stop offset="1" stop-color="#000" stop-opacity="0"/></linearGradient>
  <linearGradient id="${t}-steel" x1="0" x2="1">
    <stop offset="0" stop-color="#8d949a"/><stop offset=".25" stop-color="#e9ecee"/><stop offset=".55" stop-color="#b4bac0"/><stop offset=".8" stop-color="#f4f6f7"/><stop offset="1" stop-color="#7f868c"/>
  </linearGradient>
  <linearGradient id="${t}-jar" x1="0" x2="1">
    <stop offset="0" stop-color="#fff" stop-opacity=".35"/><stop offset=".2" stop-color="#fff" stop-opacity=".08"/><stop offset=".8" stop-color="#fff" stop-opacity=".05"/><stop offset="1" stop-color="#fff" stop-opacity=".3"/>
  </linearGradient>
  <linearGradient id="${t}-milk" x1="0" x2="1">
    <stop offset="0" stop-color="#e9e7e2"/><stop offset=".3" stop-color="#ffffff"/><stop offset="1" stop-color="#dcd9d3"/>
  </linearGradient>
  <linearGradient id="${t}-screen" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#141517"/><stop offset="1" stop-color="#050506"/></linearGradient>
  <radialGradient id="${t}-ground" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#000" stop-opacity=".3"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
</defs>
<ellipse cx="330" cy="612" rx="300" ry="7" fill="${e("ground")}"/>

<g class="milk">
  <path d="M328 238 C268 238 214 272 182 312 C164 334 136 336 116 348" fill="none" stroke="#d9dcdf" stroke-width="5" stroke-linecap="round"/>
  <rect x="44" y="372" width="102" height="232" rx="14" fill="#c9d3dc" fill-opacity=".22"/>
  <rect x="44" y="372" width="102" height="232" rx="14" fill="${e("jar")}" stroke="#8d969e" stroke-opacity=".7" stroke-width="2"/>
  <path d="M48 470 H142 V590 a12 12 0 0 1 -12 12 H60 a12 12 0 0 1 -12 -12 Z" fill="${e("milk")}"/>
  <path d="M95 372 V560" stroke="#fff" stroke-opacity=".4" stroke-width="2"/>
  <rect x="38" y="346" width="114" height="28" rx="7" fill="#1b1c1e"/>
  <path d="M44 350 H146" stroke="#fff" stroke-opacity=".15" stroke-width="1.4"/>
</g>

<g class="body">
  <rect x="300" y="8" width="160" height="18" rx="5" style="fill:${O("lo")};stroke:${O("edge")}" stroke-width="1.2"/>
  <rect x="190" y="196" width="380" height="408" rx="10" fill="${e("body")}"/>
  <rect x="190.5" y="196.5" width="379" height="407" rx="10" fill="none" style="stroke:${O("edge")}" stroke-width="1.4"/>
  <path d="M192 414 H568" stroke="#000" stroke-opacity=".4" stroke-width="2"/>
  <path d="M192 416 H568" stroke="#fff" stroke-opacity=".06" stroke-width="1"/>
  <rect x="190" y="208" width="380" height="16" fill="${e("under")}"/>
</g>

<g class="controls">
  <rect x="176" y="22" width="408" height="186" rx="9" fill="${e("block")}"/>
  <rect x="176" y="22" width="408" height="186" rx="9" fill="${e("gloss")}"/>
  <rect x="176.5" y="22.5" width="407" height="185" rx="9" fill="none" stroke="#fff" stroke-opacity=".12" stroke-width="1.2"/>
  <path d="M184 206 H576" stroke="#000" stroke-opacity=".6" stroke-width="3"/>
  <rect x="330" y="62" width="100" height="78" rx="3" fill="${e("screen")}" stroke="#fff" stroke-opacity=".08"/>
  <circle cx="214" cy="182" r="9" fill="none" style="stroke:${O("ink")}" stroke-opacity=".8" stroke-width="1.6"/>
  <path d="M214 175 v5" style="stroke:${O("ink")}" stroke-opacity=".8" stroke-width="1.6" stroke-linecap="round"/>
  <path d="M374 182 h9 a5 5 0 0 1 0 10 h-7 M378 178 l-4 4 l4 4" fill="none" style="stroke:${O("ink")}" stroke-opacity=".75" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</g>

<g class="front">
  <rect x="330" y="216" width="100" height="84" rx="3" fill="${e("steel")}"/>
  <path d="M334 218 H426" stroke="#fff" stroke-opacity=".7" stroke-width="1.2"/>
  <rect x="340" y="296" width="80" height="10" rx="3" fill="#2c2f33"/>
  <g fill="#0c0d0e"><circle cx="366" cy="303" r="3.5"/><circle cx="380" cy="303" r="3.5"/><circle cx="394" cy="303" r="3.5"/></g>
  <rect x="206" y="538" width="348" height="36" rx="5" fill="${e("steel")}"/>
  <g stroke="#000" stroke-opacity=".3" stroke-width="2" stroke-linecap="round">${[546,552,558,564,570].map(o=>`<path d="M224 ${o} H536"/>`).join("")}</g>
  <g fill="#1e2124" stroke="#fff" stroke-opacity=".35" stroke-width="1.2"><circle cx="352" cy="557" r="8.5"/><circle cx="408" cy="557" r="8.5"/><circle cx="474" cy="549" r="4"/></g>
  <rect x="198" y="574" width="364" height="30" rx="6" fill="#0d0e0f"/>
  <path d="M202 575 H558" stroke="#fff" stroke-opacity=".1" stroke-width="1.2"/>
</g>
</svg>`}function ve(t){return`<div class="layer cuplight"></div>
    <div class="layer cup"><svg viewBox="0 0 320 260" aria-hidden="true"><defs>
      <clipPath id="${t}-cupin"><path d="M126 120 H194 L188 236 a8 8 0 0 1 -8 8 H140 a8 8 0 0 1 -8 -8 Z"/></clipPath></defs>
      <g clip-path="url(#${t}-cupin)"><g class="fill"><rect x="120" y="150" width="80" height="100" fill="#6b4226"/><rect x="120" y="130" width="80" height="24" fill="#efe6da"/></g></g>
      <path d="M126 120 H194 L188 236 a8 8 0 0 1 -8 8 H140 a8 8 0 0 1 -8 -8 Z" fill="#fff" fill-opacity=".07" stroke="#fff" stroke-opacity=".55" stroke-width="2"/>
      <path d="M132 128 L138 232" stroke="#fff" stroke-opacity=".35" stroke-width="3" stroke-linecap="round"/></svg></div>
    <div class="layer stream"><div class="jet"></div><div class="jet two"></div></div>
    <div class="layer steam">
      <div class="layer w"><svg viewBox="0 0 320 260" aria-hidden="true"><path d="M150 112 C142 96 160 86 150 70 S154 50 148 40" fill="none" stroke="#fff" stroke-opacity=".45" stroke-width="5" stroke-linecap="round"/></svg></div>
      <div class="layer w"><svg viewBox="0 0 320 260" aria-hidden="true"><path d="M172 112 C180 94 162 84 172 68 S168 48 174 38" fill="none" stroke="#fff" stroke-opacity=".45" stroke-width="5" stroke-linecap="round"/></svg></div></div>
    <div class="layer drops">${[146,160,174].map(e=>`<div class="layer d"><svg viewBox="0 0 320 260" aria-hidden="true"><path d="M${e} 10 c3 6 5 9 5 12 a5 5 0 0 1 -10 0 c0 -3 2 -6 5 -12 Z" fill="#cfe6f7" fill-opacity=".8"/></svg></div>`).join("")}</div>`}var N=t=>`var(--f-${t})`,qt=["cm7","cm6"],Pt=t=>/^CM6/.test(t)?"cm6":"cm7",Ft={ratio:"600/620",view:"0 0 600 620",window:{left:42.67,top:48.39,width:41.33,height:41.94,radius:"4% / 5%"},ring:{path:H(248,292,264,276,18),width:4.5},lcd:{x:50,y:10.2,w:26,h:5.4},icons:{size:4.4,at:[[82,8],[86.6,8],[91.2,8],[95.8,8]]},panel:null};function Wt(t){let e=o=>`url(#${t}-${o})`;return`<svg class="art-svg" viewBox="0 0 600 620" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
<defs>
  <linearGradient id="${t}-body" x1="0" x2="1">
    <stop offset="0" style="stop-color:${N("lo")}"/><stop offset=".3" style="stop-color:${N("mid")}"/><stop offset=".7" style="stop-color:${N("mid")}"/><stop offset="1" style="stop-color:${N("lo")}"/>
  </linearGradient>
  <linearGradient id="${t}-steel" x1="0" x2="1">
    <stop offset="0" stop-color="#8d949a"/><stop offset=".25" stop-color="#e9ecee"/><stop offset=".55" stop-color="#b4bac0"/><stop offset=".8" stop-color="#f4f6f7"/><stop offset="1" stop-color="#7f868c"/>
  </linearGradient>
  <linearGradient id="${t}-glass" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#3a3c40"/><stop offset=".5" stop-color="#151618"/><stop offset="1" stop-color="#0a0b0c"/>
  </linearGradient>
  <linearGradient id="${t}-jar" x1="0" x2="1">
    <stop offset="0" stop-color="#fff" stop-opacity=".35"/><stop offset=".2" stop-color="#fff" stop-opacity=".08"/><stop offset=".8" stop-color="#fff" stop-opacity=".05"/><stop offset="1" stop-color="#fff" stop-opacity=".3"/>
  </linearGradient>
  <linearGradient id="${t}-milk" x1="0" x2="1"><stop offset="0" stop-color="#e9e7e2"/><stop offset=".3" stop-color="#ffffff"/><stop offset="1" stop-color="#dcd9d3"/></linearGradient>
  <radialGradient id="${t}-ground" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#000" stop-opacity=".3"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
</defs>
<ellipse cx="360" cy="612" rx="250" ry="7" fill="${e("ground")}"/>
<g class="milk">
  <path d="M376 236 C330 236 296 262 268 300 C252 322 214 330 186 344" fill="none" stroke="#d9dcdf" stroke-width="5" stroke-linecap="round"/>
  <rect x="108" y="372" width="96" height="232" rx="14" fill="#c9d3dc" fill-opacity=".22"/>
  <rect x="108" y="372" width="96" height="232" rx="14" fill="${e("jar")}" stroke="#8d969e" stroke-opacity=".7" stroke-width="2"/>
  <path d="M112 470 H200 V590 a12 12 0 0 1 -12 12 H124 a12 12 0 0 1 -12 -12 Z" fill="${e("milk")}"/>
  <rect x="102" y="346" width="108" height="28" rx="7" fill="#1b1c1e"/>
</g>
<g class="body">
  <rect x="232" y="20" width="296" height="584" rx="12" fill="${e("body")}"/>
  <rect x="232.5" y="20.5" width="295" height="583" rx="12" fill="none" style="stroke:${N("edge")}" stroke-width="1.4"/>
  <rect x="236" y="26" width="288" height="190" rx="9" fill="${e("glass")}"/>
  <path d="M244 30 H516" stroke="#fff" stroke-opacity=".16" stroke-width="1.2"/>
  <rect x="300" y="63" width="156" height="33" rx="3" fill="#050506" stroke="#fff" stroke-opacity=".08"/>
  <g fill="none" stroke="#c9ced3" stroke-opacity=".7" stroke-width="1.6" stroke-linecap="round">
    <circle cx="268" cy="80" r="9"/><path d="M268 72 v5"/>
    <path d="M314 128 h14 v10 a7 7 0 0 1 -14 0 Z M346 128 h18 v9 a9 9 0 0 1 -18 0 Z M384 126 h12 l-2 20 h-8 Z M418 128 h14 v10 a7 7 0 0 1 -14 0 Z"/>
    <path d="M472 132 h10 M477 127 v10"/>
  </g>
</g>
<g class="front">
  <rect x="330" y="220" width="100" height="78" rx="3" fill="${e("steel")}"/>
  <path d="M334 222 H426" stroke="#fff" stroke-opacity=".7" stroke-width="1.2"/>
  <g fill="#0c0d0e"><circle cx="366" cy="295" r="3.5"/><circle cx="380" cy="295" r="3.5"/><circle cx="394" cy="295" r="3.5"/></g>
  <rect x="250" y="540" width="260" height="34" rx="5" fill="${e("steel")}"/>
  <g stroke="#000" stroke-opacity=".3" stroke-width="2" stroke-linecap="round">${[548,554,560,566].map(o=>`<path d="M266 ${o} H494"/>`).join("")}</g>
  <rect x="240" y="574" width="280" height="30" rx="6" fill="#0d0e0f"/>
</g>
</svg>`}var Kt={ratio:"600/456",view:"0 0 600 456",window:{left:30,top:32.89,width:40,height:54.82,radius:"3% / 4%"},ring:{path:H(170,140,260,270,16),width:5},lcd:{x:37,y:4.8,w:26,h:16.7},icons:{size:4.2,at:[[78,9],[83,9],[88,9],[93,9]]},panel:null};function Zt(t){let e=i=>`url(#${t}-${i})`,o=N("ink");return`<svg class="art-svg" viewBox="0 0 600 456" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
<defs>
  <linearGradient id="${t}-front" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" style="stop-color:${N("hi")}"/><stop offset=".45" style="stop-color:${N("mid")}"/><stop offset="1" style="stop-color:${N("lo")}"/>
  </linearGradient>
  <linearGradient id="${t}-recess" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#050506"/><stop offset="1" stop-color="#1c1d20"/></linearGradient>
  <linearGradient id="${t}-steel" x1="0" x2="1">
    <stop offset="0" stop-color="#8d949a"/><stop offset=".25" stop-color="#e9ecee"/><stop offset=".55" stop-color="#b4bac0"/><stop offset=".8" stop-color="#f4f6f7"/><stop offset="1" stop-color="#7f868c"/>
  </linearGradient>
  <linearGradient id="${t}-screen" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#121315"/><stop offset="1" stop-color="#040405"/></linearGradient>
</defs>
<g class="body">
  <rect x="1" y="1" width="598" height="454" rx="5" fill="${e("front")}"/>
  <rect x="1.5" y="1.5" width="597" height="453" rx="5" fill="none" style="stroke:${N("edge")}" stroke-width="1.6"/>
  <path d="M8 3 H592" stroke="#fff" stroke-opacity=".14" stroke-width="1.2"/>
</g>
<g class="controls">
  <rect x="222" y="22" width="156" height="76" rx="5" fill="${e("screen")}" stroke="#fff" stroke-opacity=".06"/>
  ${ne(112,o)}
</g>
<g class="front">
  <rect x="172" y="142" width="256" height="266" rx="14" fill="#000" opacity=".4"/>
  <rect x="180" y="150" width="240" height="250" rx="10" fill="${e("recess")}"/>
  <rect x="258" y="152" width="84" height="56" rx="3" fill="${e("steel")}"/>
  <g fill="#0c0d0e"><circle cx="286" cy="205" r="3.5"/><circle cx="300" cy="205" r="3.5"/><circle cx="314" cy="205" r="3.5"/></g>
  <rect x="196" y="374" width="208" height="20" rx="4" fill="${e("steel")}"/>
  <g stroke="#000" stroke-opacity=".3" stroke-width="2" stroke-linecap="round"><path d="M206 380 H394 M206 386 H394"/></g>
</g>
</svg>`}var ee=t=>`var(--f-${t})`,Ut={ratio:"600/292",view:"0 0 600 292",window:{left:0,top:0,width:100,height:100,radius:"0.8% / 1.7%"},ring:{path:H(4,4,592,284,7),width:3.5},lcd:{x:35,y:36,w:30,h:28,ghost:!0},icons:{size:4.4,at:[[5.5,14],[10.3,14],[15.1,14]]},panel:null},Yt=t=>`<svg class="art-svg" viewBox="0 0 600 292" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
<defs><linearGradient id="${t}-in" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#2a1e14"/><stop offset=".25" stop-color="#0c0b0a"/><stop offset="1" stop-color="#050505"/></linearGradient></defs>
<rect x="0" y="0" width="600" height="292" rx="5" fill="url(#${t}-in)"/>
<rect x="8" y="4" width="584" height="34" rx="3" fill="#060607" stroke="#fff" stroke-opacity=".08"/>
<g fill="none" stroke="#d8dce0" stroke-opacity=".75" stroke-width="1.5" stroke-linecap="round">
  <circle cx="150" cy="21" r="6"/><path d="M150 14 v5"/><rect x="200" y="14" width="9" height="14" rx="2"/><path d="M250 16 h12 M250 21 h12 M250 26 h12"/>
  <path d="M318 17 h9 v5 a4.5 4.5 0 0 1 -9 0 Z"/><path d="M352 25 h14"/><path d="M420 14 v9 a3 3 0 1 0 1 0"/></g>
<path d="M384 26 c0 -4 4 -4 4 -8 M390 26 c0 -4 4 -4 4 -8 M396 26 c0 -4 4 -4 4 -8" fill="none" stroke="#f2a33a" stroke-width="1.8" stroke-linecap="round"/>
<g fill="#d8dce0" opacity=".75"><rect x="458" y="19" width="12" height="4" rx="2"/><rect x="474" y="19" width="12" height="4" rx="2"/><rect x="490" y="19" width="12" height="4" rx="2"/><rect x="522" y="19" width="12" height="4" rx="2"/></g>
<rect x="506" y="19" width="12" height="4" rx="2" fill="#f2a33a"/>
</svg>`,Jt=t=>`<div class="layer front"><svg viewBox="0 0 600 292" preserveAspectRatio="none" aria-hidden="true"><defs>
  <linearGradient id="${t}-df" x1="0" x2="1">
    <stop offset="0" style="stop-color:${ee("lo")}"/><stop offset=".22" style="stop-color:${ee("mid")}"/><stop offset=".5" style="stop-color:${ee("hi")}"/>
    <stop offset=".78" style="stop-color:${ee("mid")}"/><stop offset="1" style="stop-color:${ee("lo")}"/>
  </linearGradient>
  <linearGradient id="${t}-dv" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".09"/><stop offset=".4" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".12"/></linearGradient></defs>
  <rect x="1" y="1" width="598" height="290" rx="5" fill="url(#${t}-df)"/>
  <rect x="1" y="1" width="598" height="290" rx="5" fill="url(#${t}-dv)"/>
  <rect x="1.5" y="1.5" width="597" height="289" rx="5" fill="none" style="stroke:${ee("edge")}" stroke-width="1.6"/>
  <path d="M8 3 H592" stroke="#fff" stroke-opacity=".16" stroke-width="1.2"/></svg></div>
  <div class="layer warmline"></div>`;var ae=t=>`var(--f-${t})`,Xt=["integrated","semi","freestanding"];function Qt(t){return/SCVI|SCU|VI$/i.test(t)?"integrated":/SCI$/i.test(t)?"semi":/SC$/i.test(t)?"freestanding":"integrated"}var be={integrated:{band:[0,40],door:46},semi:{band:[0,92],door:96},freestanding:{band:[16,108],door:112}};function eo(t){let{band:e}=be[t]??be.integrated,o=(e[0]+e[1])/2,i=Math.min(30,e[1]-e[0]-10);return{ratio:"600/820",view:"0 0 600 820",window:{left:14,top:22.5,width:72,height:58,radius:"3% / 2.2%"},ring:{path:H(74,175,452,495,22),width:6},lcd:{x:30,y:(o-i/2)/8.2,w:30,h:i/8.2},icons:{size:4,at:[[72,o/8.2],[77,o/8.2],[82,o/8.2],[87,o/8.2]]},panel:null}}var Bi=(t,e,o)=>{let i=(t+e)/2,r=o?"#3b4046":ae("ink"),s=[118,146,400,426];return`<rect x="176" y="${i-Math.min(15,(e-t-10)/2)}" width="184" height="${Math.min(30,e-t-10)}" rx="3" fill="#0b0c0d" stroke="#fff" stroke-opacity=".06"/>
  <circle cx="72" cy="${i}" r="8" fill="none" style="stroke:${r}" stroke-opacity=".7" stroke-width="1.6"/>
  <path d="M72 ${i-7} v5" style="stroke:${r}" stroke-opacity=".7" stroke-width="1.6" stroke-linecap="round"/>
  ${s.map(n=>`<rect x="${n-7}" y="${i-5}" width="14" height="10" rx="2.5" fill="none" style="stroke:${r}" stroke-opacity=".5" stroke-width="1.2"/>`).join("")}`};function to(t,e="integrated"){let o=s=>`url(#${t}-${s})`,i=be[e]??be.integrated,r=e!=="integrated";return`<svg class="art-svg" viewBox="0 0 600 820" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
<defs>
  <linearGradient id="${t}-door" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" style="stop-color:${ae("hi")}"/><stop offset=".5" style="stop-color:${ae("mid")}"/><stop offset="1" style="stop-color:${ae("lo")}"/>
  </linearGradient>
  <linearGradient id="${t}-steel" x1="0" x2="1">
    <stop offset="0" stop-color="#aeb4b9"/><stop offset=".25" stop-color="#dfe3e6"/><stop offset=".55" stop-color="#c3c8cd"/><stop offset=".8" stop-color="#e6e9eb"/><stop offset="1" stop-color="#a3a9ae"/>
  </linearGradient>
  <linearGradient id="${t}-edge" x1="0" x2="0" y1="0" y2="1">
    <stop offset="0" stop-color="#d4d8db"/><stop offset="1" stop-color="#8f969c"/>
  </linearGradient>
  <radialGradient id="${t}-floor" cx=".5" cy="0" r=".9"><stop offset="0" stop-color="#ff6b3d" stop-opacity=".75"/><stop offset="1" stop-color="#ff6b3d" stop-opacity="0"/></radialGradient>
  <radialGradient id="${t}-ground" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#000" stop-opacity=".3"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
</defs>
<ellipse cx="300" cy="814" rx="292" ry="7" fill="${o("ground")}"/>
${e==="freestanding"?'<rect x="2" y="0" width="596" height="18" rx="4" fill="#3a3d41"/><path d="M4 1 H596" stroke="#fff" stroke-opacity=".18"/>':""}
<g class="band">
  ${e==="integrated"?`<rect x="10" y="${i.band[0]}" width="580" height="${i.band[1]-i.band[0]}" rx="3" fill="${o("edge")}"/>`:`<rect x="2" y="${i.band[0]}" width="596" height="${i.band[1]-i.band[0]}" rx="3" fill="${o("steel")}"/>
  <path d="M4 ${i.band[1]-.5} H596" stroke="#000" stroke-opacity=".25" stroke-width="1.4"/>`}
  ${Bi(i.band[0]+4,i.band[1]-4,!0)}
</g>
<g class="dwfront">
  <rect x="2" y="${i.door}" width="596" height="${760-i.door}" rx="4" fill="${o(e==="freestanding"?"steel":"door")}"/>
  <rect x="2.5" y="${i.door+.5}" width="595" height="${759-i.door}" rx="4" fill="none" style="stroke:${ae("edge")}" stroke-width="1.4"/>
  ${e==="freestanding"?`<rect x="230" y="${i.door+12}" width="140" height="10" rx="5" fill="#8b9197"/>`:""}
  <rect x="78" y="178" width="444" height="488" rx="16" fill="#000" opacity=".38"/>
  <rect x="84" y="184.5" width="432" height="475.5" rx="12" fill="#121416"/>
</g>
<g class="plinth">
  <rect x="14" y="764" width="572" height="44" rx="3" fill="#1c1d20"/>
  <ellipse class="infolight" cx="300" cy="812" rx="70" ry="7" fill="${o("floor")}"/>
</g>
</svg>`}var qi=t=>`<svg viewBox="0 0 432 476" preserveAspectRatio="none" aria-hidden="true"><defs>
  <linearGradient id="${t}-tub" x1="0" x2="1"><stop offset="0" stop-color="#5b6268"/><stop offset=".2" stop-color="#a3aab0"/><stop offset=".5" stop-color="#c6cbd0"/><stop offset=".8" stop-color="#a3aab0"/><stop offset="1" stop-color="#5b6268"/></linearGradient></defs>
  <rect width="432" height="476" fill="url(#${t}-tub)"/>
  <path d="M0 0 L40 26 V452 L0 476 M432 0 L392 26 V452 L432 476 M40 26 H392 M40 452 H392" fill="none" stroke="#000" stroke-opacity=".15" stroke-width="1.5"/>
  <g fill="none" stroke="#6e757b" stroke-width="2.4" stroke-opacity=".9">
    <path d="M44 70 H388 M44 232 H388 M44 396 H388"/>
    <path d="M44 70 V90 M388 70 V90 M44 232 V256 M388 232 V256"/>
  </g>
  <path d="M60 438 H372" stroke="#7d848a" stroke-width="7" stroke-linecap="round"/>
  <circle cx="216" cy="438" r="11" fill="#868d93"/>
  <path d="M90 270 H342" stroke="#7d848a" stroke-width="6" stroke-linecap="round"/></svg>`,Pi=()=>`<svg viewBox="0 0 432 476" preserveAspectRatio="none" aria-hidden="true">
  <g fill="#f4f2ec" stroke="#b9b6ae" stroke-width="1.6">${[0,1,2,3,4,5,6,7].map(t=>`<ellipse cx="${84+t*36}" cy="338" rx="11" ry="${t%3===1?50:56}"/>`).join("")}</g>
  <g fill="#e1ddd4">${[0,1,2,3,4,5,6,7].map(t=>`<ellipse cx="${84+t*36}" cy="338" rx="5" ry="${t%3===1?32:38}"/>`).join("")}</g>
  <g fill="#cfe2ee" fill-opacity=".55" stroke="#9fb8c8" stroke-width="1.5">${[0,1,2,3,4].map(t=>`<path d="M${76+t*64} 132 h34 l-4 74 h-26 Z"/>`).join("")}</g>
  <g fill="#e8e3d8" stroke="#b9b3a6" stroke-width="1.5"><path d="M330 150 a28 18 0 0 0 56 0 v40 a28 18 0 0 1 -56 0 Z"/></g>
  <g stroke="#9aa1a7" stroke-width="2.4" stroke-linecap="round">${[0,1,2,3,4,5,6,7,8,9].map(t=>`<path d="M${96+t*26} 34 v26"/>`).join("")}</g></svg>`,Fi=()=>`<svg viewBox="0 0 432 476" preserveAspectRatio="none" aria-hidden="true">
  <g fill="none" stroke="#d9eefc" stroke-width="5.5" stroke-linecap="round">
    ${[90,150,216,282,342].map((t,e)=>`<path class="jet" d="M${t} 434 Q${t+(e-2)*10} 400 ${t+(e-2)*18} 370" style="animation-delay:-${e*.3}s"/>`).join("")}
    ${[120,216,312].map((t,e)=>`<path class="jet" d="M${t} 266 Q${t+(e-1)*8} 240 ${t+(e-1)*14} 214" style="animation-delay:-${e*.4+.2}s"/>`).join("")}
  </g></svg>`,lt=t=>`<div class="layer w"><svg viewBox="0 0 432 476" preserveAspectRatio="none" aria-hidden="true">
  <path d="${t}" fill="none" stroke="#f2f5f7" stroke-opacity=".45" stroke-width="9" stroke-linecap="round"/></svg></div>`;function oo(t){return`<div class="layer tub">${qi(t)}</div>
    <div class="layer plates">${Pi()}</div>
    <div class="layer spray">${Fi()}</div>
    <div class="layer steam">${lt("M140 420 C126 360 156 320 138 260 S150 170 136 120")}${lt("M216 430 C230 370 200 330 218 270 S204 180 220 110")}${lt("M292 420 C278 362 306 322 290 262 S302 176 288 118")}</div>
    <div class="layer dlight"></div>`}var io=["induction","extractor"],ro=t=>/^KMDA/.test(t)?"extractor":"induction",Wi=[["KM7575",6],["KM7576",6],["KM7678",6],["KM7697",6],["KM7699",5],["KM7740",5],["KM7878",6],["KM7897",6],["KM7899",5],["KM7999",5],["KMDA7633",5],["KMDA7634",5],["KMDA7774",5],["KMX",6]],so=t=>Wi.find(([e])=>t.startsWith(e))?.[1]??4;function no(t,e){if(t==="extractor"){let o=(i,r)=>r===3?[[i,110,60],[i,245,60],[i,380,60]]:[[i,140,82],[i,350,82]];return[...o(140,(e>=5,2)),...o(460,e>=5?3:2)].slice(0,Math.max(e,4))}return e>=6?[[110,140,74],[110,350,74],[300,140,74],[300,350,74],[490,140,74],[490,350,74]]:e===5?[[130,135,76],[130,360,76],[300,248,100],[470,135,76],[470,360,76]]:[[160,135,72],[160,345,96],[440,135,96],[440,345,72]]}function ao(t,e){return{ratio:"600/520",view:"0 0 600 520",window:{left:0,top:0,width:100,height:88.46,radius:"2% / 2.3%"},ring:{path:"M300 0",width:0},lcd:{x:24,y:90,w:52,h:7.5},icons:{size:4.2,at:[[83,94],[88,94],[93,94],[78,94]]},panel:null}}function lo(t,e="induction",o=4){let i=s=>`url(#${t}-${s})`,r=no(e,o);return`<svg class="art-svg" viewBox="0 0 600 520" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
<defs>
  <linearGradient id="${t}-glass" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#2b2d31"/><stop offset=".45" stop-color="#141517"/><stop offset="1" stop-color="#0a0a0b"/>
  </linearGradient>
  <linearGradient id="${t}-grille" x1="0" x2="1"><stop offset="0" stop-color="#3a3d41"/><stop offset=".5" stop-color="#5a5e63"/><stop offset="1" stop-color="#3a3d41"/></linearGradient>
</defs>
<rect x="0" y="0" width="600" height="520" rx="12" fill="${i("glass")}"/>
<rect x=".75" y=".75" width="598.5" height="518.5" rx="12" fill="none" stroke="#fff" stroke-opacity=".1" stroke-width="1.5"/>
<path d="M20 12 L180 12" stroke="#fff" stroke-opacity=".08" stroke-width="6" stroke-linecap="round"/>
${e==="extractor"?`<rect x="258" y="30" width="84" height="400" rx="10" fill="${i("grille")}"/>
<g stroke="#1a1b1d" stroke-width="3">${Array.from({length:17},(s,n)=>`<path d="M266 ${48+n*22} H334"/>`).join("")}</g>`:""}
<g fill="none" stroke="#c9ced3" stroke-opacity=".28" stroke-width="2">
  ${r.map(([s,n,l])=>`<circle cx="${s}" cy="${n}" r="${l}"/><circle cx="${s}" cy="${n}" r="${l-10}" stroke-dasharray="3 7"/>`).join("")}
</g>
<path d="M14 460 H586" stroke="#fff" stroke-opacity=".07" stroke-width="1.2"/>
</svg>`}function co(t,e="induction",o=4){let i=no(e,o);return`<div class="layer"><svg viewBox="0 0 600 460" aria-hidden="true"><defs>
  <radialGradient id="${t}-hot"><stop offset="0" stop-color="#ff7a3c" stop-opacity=".95"/><stop offset=".6" stop-color="#ff4d2a" stop-opacity=".45"/><stop offset="1" stop-color="#ff4d2a" stop-opacity="0"/></radialGradient>
  <radialGradient id="${t}-pan" cx=".45" cy=".4" r=".7"><stop offset="0" stop-color="#5a5f65"/><stop offset=".85" stop-color="#2c2f33"/><stop offset="1" stop-color="#1b1d20"/></radialGradient></defs>
  ${i.map(([r,s,n],l)=>`<g class="zone" data-z="${l}">
    <circle class="zg" cx="${r}" cy="${s}" r="${n+18}" fill="url(#${t}-hot)"/>
    <g class="pan"><circle cx="${r}" cy="${s}" r="${n-6}" fill="url(#${t}-pan)" stroke="#9aa1a8" stroke-width="3"/>
      <circle cx="${r}" cy="${s}" r="${n-18}" fill="none" stroke="#000" stroke-opacity=".25" stroke-width="2"/>
      <path d="M${r+n-8} ${s-4} h${Math.round(n*.7)}" stroke="#2c2f33" stroke-width="10" stroke-linecap="round"/></g>
  </g>`).join("")}</svg></div>`}var K=t=>`var(--f-${t})`,po=["wall","aura"],ho=t=>/^DA7\d{3}D/.test(t)?"aura":"wall",fo=t=>({ratio:"600/560",view:"0 0 600 560",window:{left:8,top:55.36,width:84,height:42.86,radius:"0"},ring:{path:"M300 0",width:0},lcd:t==="aura"?{x:40,y:47,w:20,h:3.6,ghost:!0}:{x:66,y:47.3,w:24,h:3.6},icons:{size:4.2,at:[[8,4],[13,4],[18,4],[23,4]]},panel:null});function go(t,e="wall"){let o=r=>`url(#${t}-${r})`,i=`<defs>
  <linearGradient id="${t}-steel" x1="0" x2="1">
    <stop offset="0" style="stop-color:${K("lo")}"/><stop offset=".25" style="stop-color:${K("hi")}"/><stop offset=".55" style="stop-color:${K("mid")}"/><stop offset=".8" style="stop-color:${K("hi")}"/><stop offset="1" style="stop-color:${K("lo")}"/>
  </linearGradient>
  <linearGradient id="${t}-under" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity=".35"/><stop offset="1" stop-color="#000" stop-opacity="0"/></linearGradient>
  <radialGradient id="${t}-aura" cx=".5" cy=".4" r=".6"><stop offset="0" stop-color="#ffffff"/><stop offset=".7" stop-color="#eef0f1"/><stop offset="1" stop-color="#cfd3d6"/></radialGradient>
</defs>`;return e==="aura"?`<svg class="art-svg" viewBox="0 0 600 560" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${i}
<path d="M300 0 V110" stroke="#9aa1a8" stroke-width="4"/>
<ellipse class="aura-glow" cx="300" cy="262" rx="210" ry="40" fill="none" stroke="#7fd3ff" stroke-width="10" stroke-opacity=".8"/>
<path d="M110 250 C110 160 190 110 300 110 C410 110 490 160 490 250 C490 262 470 272 450 272 H150 C130 272 110 262 110 250 Z" fill="${o("aura")}" stroke="#b9bfc4" stroke-width="1.5"/>
<g stroke="#b5bbc0" stroke-width="2" fill="none">${Array.from({length:9},(r,s)=>`<path d="M${170+s*32} 272 L${176+s*32} 236"/>`).join("")}</g>
<ellipse cx="300" cy="272" rx="150" ry="8" fill="#000" opacity=".18"/>
<path d="M60 556 H540" stroke="#000" stroke-opacity=".25" stroke-width="3"/>
</svg>`:`<svg class="art-svg" viewBox="0 0 600 560" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${i}
<rect x="232" y="0" width="136" height="236" fill="${o("steel")}"/>
<path d="M232 0 V236 M368 0 V236" style="stroke:${K("edge")}" stroke-width="1.4"/>
<path d="M40 236 H560 L548 292 H52 Z" fill="${o("steel")}" style="stroke:${K("edge")}" stroke-width="1.4"/>
<rect x="52" y="292" width="496" height="10" fill="#2a2c2f"/>
<rect x="52" y="302" width="496" height="18" fill="${o("under")}"/>
<circle cx="180" cy="297" r="6" fill="#fff4dc"/><circle cx="420" cy="297" r="6" fill="#fff4dc"/>
<path d="M60 556 H540" stroke="#000" stroke-opacity=".25" stroke-width="3"/>
</svg>`}var ct=(t,e)=>`<div class="layer w" style="animation-delay:-${e*1.1}s"><svg viewBox="0 0 504 240" preserveAspectRatio="none" aria-hidden="true">
  <path d="${t}" fill="none" stroke="#e9eef2" stroke-opacity=".5" stroke-width="10" stroke-linecap="round"/></svg></div>`;function mo(t,e="wall"){return`<div class="layer cones"><svg viewBox="0 0 504 240" preserveAspectRatio="none" aria-hidden="true"><defs>
    <linearGradient id="${t}-cone" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#fff3d6" stop-opacity=".55"/><stop offset="1" stop-color="#fff3d6" stop-opacity="0"/></linearGradient></defs>
    ${(e==="aura"?[252]:[132,372]).map(i=>`<path d="M${i-6} 0 L${i-90} 240 H${i+90} L${i+6} 0 Z" fill="url(#${t}-cone)"/>`).join("")}</svg></div>
    <div class="layer vapour">${ct("M200 220 C186 180 214 150 198 110 S210 50 196 10",0)}${ct("M252 224 C266 184 238 152 254 110 S242 52 256 8",1)}${ct("M304 220 C290 182 318 148 302 108 S314 48 300 10",2)}</div>
    <div class="layer"><svg viewBox="0 0 504 240" aria-hidden="true">
      <path d="M40 236 H464" stroke="#6f767c" stroke-width="3"/>
      <path d="M178 236 V206 H326 V236" fill="#3d4146" stroke="#8a9198" stroke-width="2"/>
      <path d="M170 206 H334" stroke="#9aa1a8" stroke-width="4" stroke-linecap="round"/></svg></div>`}var Z=t=>`var(--f-${t})`,uo=["freestanding","integrated"],yo=t=>/^(KFN|KS|FNS|KF|F)\s*[24]\d{3}|^KS\s*28|^FNS\s*28/.test(t)?"freestanding":"integrated",wo=["freestanding","integrated"],_o=t=>/(IG|IGS|UG|VI|VIS)$/i.test(t)?"integrated":"freestanding",xo=(t,e)=>({ratio:"600/1300",view:"0 0 600 1300",window:t,ring:{path:"M300 0",width:0},lcd:e,icons:{size:4.6,at:[[12,2.4],[18,2.4],[24,2.4],[30,2.4]]},panel:null}),vo=()=>xo({left:12,top:9.2,width:62,height:49.2,radius:"2% / 1%"},{x:30,y:3.4,w:40,h:4.6}),bo=()=>xo({left:9.33,top:8.46,width:81.33,height:86.15,radius:"1.6% / .8%"},{x:28,y:2.4,w:44,h:4.4}),ko=t=>`<defs>
  <linearGradient id="${t}-door" x1="0" x2="1">
    <stop offset="0" style="stop-color:${Z("lo")}"/><stop offset=".3" style="stop-color:${Z("hi")}"/><stop offset=".7" style="stop-color:${Z("mid")}"/><stop offset="1" style="stop-color:${Z("lo")}"/>
  </linearGradient>
  <linearGradient id="${t}-steel" x1="0" x2="1">
    <stop offset="0" stop-color="#8e959b"/><stop offset=".3" stop-color="#e2e5e8"/><stop offset=".6" stop-color="#b6bcc1"/><stop offset="1" stop-color="#8a9197"/>
  </linearGradient>
  <linearGradient id="${t}-tint" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2b3036" stop-opacity=".55"/><stop offset="1" stop-color="#0e1114" stop-opacity=".7"/></linearGradient>
  <radialGradient id="${t}-ground" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#000" stop-opacity=".3"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
</defs>`;function $o(t,e="freestanding"){let o=r=>`url(#${t}-${r})`,i=e==="integrated";return`<svg class="art-svg" viewBox="0 0 600 1300" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${ko(t)}
<ellipse cx="300" cy="1294" rx="290" ry="7" fill="${o("ground")}"/>
<rect x="6" y="4" width="588" height="1282" rx="10" fill="#1b1c1f"/>
<g class="doors">
  <rect x="10" y="8" width="580" height="${i?812:830}" rx="8" fill="${o("door")}" style="stroke:${Z("edge")}" stroke-width="1.5"/>
  <rect x="10" y="${i?826:846}" width="580" height="${i?456:436}" rx="8" fill="${o("door")}" style="stroke:${Z("edge")}" stroke-width="1.5"/>
  ${i?`<rect x="120" y="784" width="360" height="12" rx="6" fill="${o("steel")}"/><rect x="120" y="858" width="360" height="12" rx="6" fill="${o("steel")}"/>`:`<rect x="532" y="300" width="16" height="300" rx="8" fill="${o("steel")}"/><rect x="532" y="900" width="16" height="240" rx="8" fill="${o("steel")}"/>
  <rect x="180" y="28" width="240" height="72" rx="8" fill="#0b0c0e" stroke="#fff" stroke-opacity=".08"/>`}
  <rect x="68" y="116" width="380" height="648" rx="14" fill="#000" opacity=".3"/>
  <rect x="72" y="120" width="372" height="640" rx="10" fill="#0f1215"/>
</g>
</svg>`}function So(t){return`<div class="layer inside"><svg viewBox="0 0 372 640" preserveAspectRatio="none" aria-hidden="true"><defs>
    <linearGradient id="${t}-cell" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#dfe8ee"/><stop offset="1" stop-color="#b7c4cd"/></linearGradient></defs>
    <rect width="372" height="640" fill="url(#${t}-cell)"/>
    <g stroke="#ffffff" stroke-opacity=".8" stroke-width="5">${[150,290,430].map(e=>`<path d="M16 ${e} H356"/>`).join("")}</g>
    <path d="M20 470 H352 V620 H20 Z" fill="#cfdae2" stroke="#9fb0bb" stroke-width="2"/>
    <g fill="#4f7d4a"><circle cx="70" cy="560" r="26"/><circle cx="110" cy="575" r="22"/></g><circle cx="300" cy="570" r="30" fill="#d4593d"/>
    <path d="M60 140 V70 C60 60 66 54 72 50 V36 H86 V50 C92 54 98 60 98 70 V140 Z" fill="#7aa7c6" fill-opacity=".85"/>
    <path d="M200 140 L276 140 L276 104 Z" fill="#f2c95c"/><rect x="150" y="234" width="120" height="56" rx="8" fill="#f4f1ea"/>
    <rect x="230" y="370" width="90" height="60" rx="6" fill="#e9b07a"/></svg></div>
    <div class="layer cold"></div><div class="layer flight"></div>`}function Mo(t,e="freestanding"){let o=r=>`url(#${t}-${r})`,i=e==="integrated";return`<svg class="art-svg" viewBox="0 0 600 1300" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${ko(t)}
<ellipse cx="300" cy="1294" rx="290" ry="7" fill="${o("ground")}"/>
<rect x="6" y="4" width="588" height="1282" rx="10" fill="${o(i?"door":"steel")}"/>
<rect x="6.5" y="4.5" width="587" height="1281" rx="10" fill="none" style="stroke:${Z("edge")}" stroke-width="1.5"/>
<rect x="160" y="22" width="280" height="70" rx="8" fill="#0b0c0e" stroke="#fff" stroke-opacity=".08"/>
<rect x="50" y="104" width="500" height="1132" rx="10" fill="#0a0b0c"/>
<rect x="${i?544:556}" y="420" width="14" height="440" rx="7" fill="${i?o("steel"):"#2a2c2f"}"/>
</svg>`}function Go(t){let e=(i,r,s)=>`<g transform="translate(${i} ${r})"><path d="M0 0 h60 a8 8 0 0 1 8 8 v14 a8 8 0 0 1 -8 8 h-60 Z" fill="${s}"/><rect x="68" y="9" width="26" height="12" rx="3" fill="${s}"/><rect x="94" y="10" width="6" height="10" fill="#c9a96a"/></g>`,o=(i,r)=>[0,1,2,3].map(s=>e(36+s*112,i,r)).join("");return`<div class="layer"><svg viewBox="0 0 488 1120" preserveAspectRatio="none" aria-hidden="true">
    <rect width="488" height="1120" fill="#141618"/>
    <g stroke="#7a6a52" stroke-width="5">${[180,360,540,720,900].map(i=>`<path d="M12 ${i} H476"/>`).join("")}</g>
    <path d="M0 372 H488 M0 748 H488" stroke="#3a3d41" stroke-width="10"/>
    ${[110,290].map(i=>o(i,"#4a1d24")).join("")}${[470,650].map(i=>o(i,"#d9c37a")).join("")}${[830,1010].map(i=>o(i,"#5b1f2b")).join("")}
  </svg></div>
  <div class="layer wlight"></div>
  <div class="layer"><svg viewBox="0 0 488 1120" preserveAspectRatio="none" aria-hidden="true">
    <rect width="488" height="1120" fill="url(#${t}-wt)"/><defs><linearGradient id="${t}-wt" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#9fb2c2" stop-opacity=".16"/><stop offset=".5" stop-color="#9fb2c2" stop-opacity=".03"/><stop offset="1" stop-color="#9fb2c2" stop-opacity=".1"/></linearGradient></defs></svg></div>`}var le=t=>`var(--f-${t})`,Co={ratio:"600/600",view:"0 0 600 600",window:{left:0,top:0,width:100,height:100,radius:"3%"},ring:{path:"M300 128 A182 182 0 1 1 300 492 A182 182 0 1 1 300 128",width:9},lcd:{x:41,y:44.5,w:18,h:6,ghost:!0},icons:{size:5,at:[[6,6],[12,6],[18,6],[24,6]]},panel:null};function Lo(t){return`<svg class="art-svg" viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs>
  <pattern id="${t}-floor" width="120" height="40" patternUnits="userSpaceOnUse"><rect width="120" height="40" fill="#b48a62"/>
    <path d="M0 0 H120 M0 20 H120 M60 0 V20 M0 20 V40 M120 20 V40" stroke="#8d6a49" stroke-width="1.4"/></pattern></defs>
  <rect width="600" height="600" rx="18" fill="url(#${t}-floor)"/>
  <rect width="600" height="600" rx="18" fill="#000" opacity=".12"/>
  <rect x="236" y="0" width="128" height="34" rx="6" fill="#2a2c2f"/><rect x="262" y="34" width="76" height="10" rx="3" fill="#3a3d41"/>
  <path d="M296 12 l-6 10 h8 l-4 9" fill="none" stroke="#7fd3ff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`}function Ao(t){let e=(o,i)=>`<g class="brush" style="transform-origin:${o}px ${i}px">${[0,120,240].map(r=>`<path d="M${o} ${i} l${Math.round(Math.cos(r*Math.PI/180)*46)} ${Math.round(Math.sin(r*Math.PI/180)*46)}" stroke="#d6c7a8" stroke-width="3" stroke-linecap="round"/>`).join("")}</g>`;return`<div class="layer trail"><svg viewBox="0 0 600 600" aria-hidden="true">
    <path d="M70 540 H530 V470 H70 V400 H530 V330 H70" fill="none" stroke="#fff" stroke-opacity=".22" stroke-width="40" stroke-linejoin="round"/></svg></div>
    <div class="layer bot"><svg viewBox="0 0 600 600" aria-hidden="true"><defs>
      <radialGradient id="${t}-top" cx=".45" cy=".38" r=".7"><stop offset="0" style="stop-color:${le("hi")}"/><stop offset=".7" style="stop-color:${le("mid")}"/><stop offset="1" style="stop-color:${le("lo")}"/></radialGradient></defs>
      ${e(212,214)}${e(388,214)}
      <ellipse cx="300" cy="316" rx="168" ry="164" fill="#000" opacity=".28"/>
      <path d="M300 146 C392 146 466 220 466 310 C466 400 392 474 300 474 C208 474 134 400 134 310 C134 238 172 182 212 160 C236 150 266 146 300 146 Z" fill="url(#${t}-top)" style="stroke:${le("edge")}" stroke-width="2"/>
      <path d="M190 172 C228 154 372 154 410 172" fill="none" stroke="#0e0f11" stroke-width="16" stroke-linecap="round"/>
      <circle cx="262" cy="166" r="7" fill="#1d2a36" stroke="#7aa3c2" stroke-width="2"/><circle cx="338" cy="166" r="7" fill="#1d2a36" stroke="#7aa3c2" stroke-width="2"/>
      <rect x="246" y="266" width="108" height="38" rx="8" fill="#0b0c0e" stroke="#fff" stroke-opacity=".1"/>
      <circle cx="300" cy="360" r="16" fill="none" style="stroke:${le("ink")}" stroke-opacity=".7" stroke-width="2.4"/></svg></div>`}var Ki={ratio:"600/700",view:"0 0 600 700",window:{x:50,y:52,d:44},ring:{path:"M300 202 A162 162 0 1 1 300 526 A162 162 0 1 1 300 202",width:7,spin:{x:50,y:52,d:54}},lcd:{x:30,y:7.5,w:40,h:8.5},icons:{size:6,at:[[9,22],[9,30],[9,38],[9,46]]},panel:null},Zi=t=>`<svg class="art-svg" viewBox="0 0 600 700" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs>
  <linearGradient id="${t}-gb" x1="0" x2="1"><stop offset="0" style="stop-color:var(--f-lo)"/><stop offset=".45" style="stop-color:var(--f-hi)"/><stop offset="1" style="stop-color:var(--f-lo)"/></linearGradient></defs>
  <rect x="20" y="10" width="560" height="676" rx="22" fill="url(#${t}-gb)" style="stroke:var(--f-edge)" stroke-width="1.5"/>
  <path d="M22 116 H578" style="stroke:var(--f-edge)" stroke-width="1.5"/>
  <rect x="172" y="46" width="256" height="70" rx="10" fill="#0b0c0e"/>
  <circle cx="300" cy="364" r="150" style="fill:var(--f-lo);stroke:var(--f-edge)" stroke-width="3"/>
  <circle cx="300" cy="364" r="132" fill="#14181d"/></svg>`,ke=t=>({build:()=>t}),Ui=(t,e)=>{let o={design:t,panel:st(e),microwave:/^H\d{4}BM/.test(e),full:!0};return{svg:i=>at(i,o),geom:nt(o),window:i=>Nt(i,o.microwave),display:"oven"}},Eo=(t,e,o)=>{let i=e?st(e):o?"direct":"mtouch";if(t==="artline"&&i===(o?"direct":"mtouch"))return{svg:s=>Ht(s,o),geom:Et(o),window:s=>et(s,o),display:"oven"};let r={design:t,panel:i,microwave:o,full:!1};return{svg:s=>at(s,r),geom:nt(r),window:s=>et(s,o),display:"oven"}},T={washer:{designs:ue,design:ye,build:t=>({svg:e=>_e(e,!1,t),geom:we(t),window:e=>xe(e,!1),display:"line"})},washer_dryer:{designs:ue,design:ye,build:t=>({svg:e=>_e(e,!1,t),geom:we(t),window:e=>xe(e,!1,!0),display:"line"})},dryer:{designs:ue,design:ye,build:t=>({svg:e=>_e(e,!0,t),geom:we(t),window:e=>xe(e,!0),display:t==="mtouch"?"line":"seg"})},oven:{designs:Ot,design:It,build:(t,e)=>Ui(t,e)},steam_oven:{designs:it,design:rt,build:(t,e)=>Eo(t,e,!1)},microwave:{designs:it,design:rt,build:(t,e)=>Eo(t,e,!0)},coffee:{designs:qt,design:Pt,build:t=>t==="cm6"?{svg:Wt,geom:Ft,window:ve,display:"line"}:{svg:Bt,geom:Vt,window:ve,display:"menu"}},coffee_builtin:ke({svg:Zt,geom:Kt,window:ve,display:"menu"}),drawer:ke({svg:Yt,geom:Ut,window:Jt}),dishwasher:{designs:Xt,design:Qt,build:t=>({svg:e=>to(e,t),geom:eo(t),window:oo,display:"line"})},hob:{designs:io,design:ro,build:(t,e)=>{let o=so(e);return{svg:i=>lo(i,t,o),geom:ao(t,o),window:i=>co(i,t,o),display:"zones"}}},hood:{designs:po,design:ho,build:t=>({svg:e=>go(e,t),geom:fo(t),window:e=>mo(e,t),display:"hood",finish:"clean_steel"})},fridge:{designs:uo,design:yo,build:t=>({svg:e=>$o(e,t),geom:vo(),window:So,display:"cool",maxWidth:"260px",finish:t==="freestanding"?"clean_steel":void 0})},wine:{designs:wo,design:_o,build:t=>({svg:e=>Mo(e,t),geom:bo(),window:Go,display:"cool",maxWidth:"260px"})},robot:ke({svg:Lo,geom:Co,window:Ao,display:"robot"}),generic:ke({svg:Zi,geom:Ki,window:()=>""})},te={washer:"#4fa3e0",washer_dryer:"#4fa3e0",dryer:"#e9a23b",dishwasher:"#4fa3e0",oven:"#e07a4f",steam_oven:"#e07a4f",microwave:"#e07a4f",coffee:"#c98b5a",coffee_builtin:"#c98b5a",drawer:"#e0a84f",hob:"#e8603c",hood:"#8fb3c9",fridge:"#6fc3e8",wine:"#b5536b",robot:"#4fa3e0",generic:"#4fa3e0"},Ho=t=>String(t??"").replace(/\s+/g,"").toUpperCase();function $e(t,e,o){let i=T[t];if(!i?.designs)return null;if(i.designs.includes(e))return e;let r=i.design?.(Ho(o));return i.designs.includes(r)?r:i.designs[0]}function zo(t,e,o){let i=T[t]??T.generic;return{...i.build(e??i.designs?.[0]??null,Ho(o)),design:e??null}}var pe={lotus_white:{hi:"#f7f6f2",mid:"#ebeae5",lo:"#d6d5cf",edge:"#bdbcb5",ink:"#6f6e68"},brilliant_white:{hi:"#ffffff",mid:"#f2f3f4",lo:"#dcdfe2",edge:"#c3c7cb",ink:"#6b7075"},pearl_beige:{hi:"#efe7db",mid:"#e0d6c6",lo:"#c8bca9",edge:"#aea28f",ink:"#6e6455"},clean_steel:{hi:"#e6e8ea",mid:"#c9cdd1",lo:"#a3a8ad",edge:"#8a9095",ink:"#4f555a"},graphite_grey:{hi:"#6e7175",mid:"#56595d",lo:"#3e4144",edge:"#2e3033",ink:"#b8bcc0"},obsidian_black:{hi:"#3b3c3f",mid:"#27282b",lo:"#18191b",edge:"#0e0e10",ink:"#8d9196"}},Yi=t=>{let e=/^#?([0-9a-f]{6})$/i.exec(String(t).trim());return e?[0,2,4].map(o=>parseInt(e[1].slice(o,o+2),16)):null},ce=t=>"#"+t.map(e=>Math.round(Math.max(0,Math.min(255,e))).toString(16).padStart(2,"0")).join(""),de=(t,e,o)=>t.map((i,r)=>i+(e[r]-i)*o);function Ji(t){let e=Yi(t);if(!e)return null;let o=(.2126*e[0]+.7152*e[1]+.0722*e[2])/255;return{hi:ce(de(e,[255,255,255],.18)),mid:ce(e),lo:ce(de(e,[0,0,0],.16)),edge:ce(de(e,[0,0,0],.32)),ink:ce(o>.55?de(e,[0,0,0],.55):de(e,[255,255,255],.55))}}var Do=(t,e)=>pe[t]??Ji(t)??pe[e]??pe.lotus_white,Oo=t=>Object.entries(t).map(([e,o])=>`--f-${e}:${o}`).join(";");var Se=`
:host { display: block; }
ha-card {
  display: block; overflow: hidden; padding: 12px 14px 14px; box-shadow: none;
  border-radius: var(--ha-card-border-radius, 16px); border: 1px solid var(--mc-line);
  background: var(--mc-bg); color: var(--mc-fg);
  font-family: var(--ha-font-family-body, var(--paper-font-body1_-_font-family, Roboto, system-ui, -apple-system, "Segoe UI", sans-serif));
  --ok: #46b97a; --cool: #74c3ee; --warn: #e8833a; --bad: #e5484d;
  --rc: var(--c);
}
.theme-dark { --mc-bg: #232528; --mc-fg: #eceef0; --mc-muted: #9ca1a7; --mc-line: #ffffff14; --mc-btn: #33363a;
  --mc-panel: #1c1e21; --mc-panel-fg: #eceef0; --mc-panel-line: #ffffff17; --mc-dot: #ffffff2e; }
.theme-light { --mc-bg: #ffffff; --mc-fg: #1f2226; --mc-muted: #646a71; --mc-line: #e2e4e7; --mc-btn: #eff1f3;
  --mc-panel: #ffffff; --mc-panel-fg: #1f2226; --mc-panel-line: #0000001a; --mc-dot: #00000024; }
.theme-ha { --mc-bg: var(--ha-card-background, var(--card-background-color, #fff)); --mc-fg: var(--primary-text-color, #212121);
  --mc-muted: var(--secondary-text-color, #727272); --mc-line: var(--divider-color, #0000001f); --mc-btn: var(--secondary-background-color, #e5e5e5);
  --mc-panel: var(--mc-bg); --mc-panel-fg: var(--mc-fg); --mc-panel-line: var(--mc-line);
  --mc-dot: var(--divider-color, #0000002e); }

[hidden] { display: none !important; }

.head { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; min-height: 28px; }
.name { font-weight: 600; font-size: 17px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.pill { margin-left: auto; flex: none; max-width: 60%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  font-size: 12.5px; font-weight: 600; padding: 3px 10px; border-radius: 999px; background: var(--mc-btn); color: var(--mc-muted); }
.st-running .pill, .st-scheduled .pill, .st-ready .pill { background: color-mix(in srgb, var(--c) 18%, transparent); color: var(--c); }
.st-done .pill { background: color-mix(in srgb, var(--ok) 18%, transparent); color: var(--ok); }
.f-cool .pill { background: color-mix(in srgb, var(--cool) 18%, transparent); color: var(--cool); }
.st-interrupted .pill { background: color-mix(in srgb, var(--warn) 18%, transparent); color: var(--warn); }
.st-error .pill { background: color-mix(in srgb, var(--bad) 18%, transparent); color: var(--bad); }

.ctl { display: flex; flex-wrap: wrap; gap: 8px; margin: 0 0 10px; }
.ctl button, .ask button { display: inline-flex; align-items: center; gap: 6px; min-height: 38px; padding: 0 14px;
  font: 600 13.5px/1 inherit; font-family: inherit; color: var(--mc-fg); background: var(--mc-btn); border: 1px solid var(--mc-line);
  border-radius: 999px; cursor: pointer; -webkit-tap-highlight-color: transparent; touch-action: manipulation; }
.ctl button ha-icon, .ask button ha-icon { --mdc-icon-size: 18px; }
.ctl button:active { background: color-mix(in srgb, var(--c) 30%, var(--mc-btn)); }
button:focus-visible { outline: 2px solid var(--c); outline-offset: 2px; }
.ask { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; margin: 0 0 10px; padding: 8px 10px; border-radius: 12px;
  background: var(--mc-btn); border: 1px solid color-mix(in srgb, var(--bad) 45%, transparent); }
.ask span { flex: 1 1 160px; font-size: 13.5px; }
.ask .go { background: var(--bad); border-color: transparent; color: #fff; }
.ask.start { border-color: color-mix(in srgb, var(--c) 50%, transparent); }
.ask.start .go { background: var(--c); }
.err { font-size: 12.5px; color: var(--bad); margin: -4px 0 8px; }
.bigtime { display: flex; flex-wrap: wrap; align-items: baseline; column-gap: 12px; margin: -2px 0 8px; }
.bt { font-size: 44px; line-height: 1.05; font-weight: 700; font-variant-numeric: tabular-nums; letter-spacing: -.5px; color: var(--c); }
.st-done .bt { color: var(--ok); }
.bs { font-size: 15px; color: var(--mc-muted); }
.err:empty { display: none; }
`,dt=Se+`
.pic { position: relative; margin: 0 auto; max-width: var(--maxw, 400px); aspect-ratio: var(--ratio); container-type: inline-size;
  cursor: pointer; -webkit-tap-highlight-color: transparent; }
.art, .art img, .art-svg { position: absolute; inset: 0; width: 100%; height: 100%; display: block; }
.at { position: absolute; transform: translate(-50%, -50%); }
.st-offline .art, .st-offline .glass { opacity: .5; }

/* the window */
.glass { position: absolute; overflow: hidden; background: #0d1116; isolation: isolate; }
.glass.round { aspect-ratio: 1; border-radius: 50%; }
.glass.box { background: none; }
.layer { position: absolute; inset: 0; }
.layer svg { display: block; width: 100%; height: 100%; }
.drum { opacity: .5; transition: opacity .8s; }
.lit .drum { opacity: 1; }
.laundry { opacity: 0; transition: opacity .8s; }
.loaded .laundry { opacity: 1; }
.water { overflow: hidden; opacity: 0; transform: translateY(45%); transition: transform 5s ease-in-out, opacity 2s; }
.wet .water { opacity: 1; transform: none; }
.wave { position: absolute; top: 0; bottom: 0; left: -50%; width: 200%; }
.heat { background: radial-gradient(circle, #ff9b4200 36%, #ff9b427a 100%); opacity: 0; transition: opacity 1.2s; }
.chill { background: radial-gradient(circle, #74c3ee00 36%, #74c3ee80 100%); opacity: 0; transition: opacity 1.2s; }
.f-heat .heat { opacity: .75; }
.f-cool .chill { opacity: .8; }
.f-cool .heat { opacity: 0; }
.led { background: radial-gradient(circle at 50% 16%, #fff8e0b0 0, #fff8e000 64%); opacity: 0; transition: opacity .8s; }
.lit .led { opacity: 1; }
.phase { position: absolute; left: 50%; bottom: 11%; transform: translateX(-50%); max-width: 84%; overflow: hidden; text-overflow: ellipsis;
  white-space: nowrap; font-weight: 600; font-size: clamp(11px, 3.4cqw, 15px); padding: .2em .8em; border-radius: 999px;
  background: #000000a8; color: #fff; opacity: 0; transition: opacity .6s; }
.has-phase .phase { opacity: 1; }

/* the progress ring round the door or window: a path in drawing units, starting at the top */
.ring { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; overflow: visible; }
.ring .track { fill: none; stroke: color-mix(in srgb, var(--f-ink) 24%, transparent); }
.ring .bar { fill: none; stroke: var(--rc); stroke-linecap: round; stroke-linejoin: round; transition: stroke-dashoffset 1s linear, stroke .6s, opacity .4s; }
.spinbox { aspect-ratio: 1; pointer-events: none; }
.spin { position: absolute; inset: 0; opacity: 0; transition: opacity .4s; }
.spin svg { width: 100%; height: 100%; display: block; }
.spin circle { fill: none; stroke: var(--rc); stroke-width: 1.8; stroke-linecap: round; stroke-dasharray: 12 88; }
.m-indeterminate .spin { opacity: 1; }
.st-paused { --rc: color-mix(in srgb, var(--c) 55%, #8d9298); }
.st-done { --rc: var(--ok); }
.f-cool { --rc: var(--cool); }
.st-interrupted { --rc: var(--warn); }
.st-error { --rc: var(--bad); }
.stale .ring, .stale .lcd { opacity: .6; }

/* the appliance's own display: white on black, like Miele's */
.lcd { position: absolute; box-sizing: border-box; display: flex; align-items: center; justify-content: center; container-type: size;
  border-radius: 6px; color: #f2f4f6; font-variant-numeric: tabular-nums; white-space: nowrap; overflow: hidden; }
.lcd .t { font-size: min(58cqh, 15cqw); font-weight: 500; letter-spacing: .01em; line-height: 1; }
.lcd .t.word { font-size: min(42cqh, 11cqw); letter-spacing: 0; }
.lcd .s { font-size: min(30cqh, 8cqw); color: #9ba4ae; line-height: 1; margin-left: .45em; }
.lcd .s:empty { display: none; }
.st-off .lcd .t { color: #5d6268; }

/* display styles after the real appliances (see _display in the card) */
.lcd.line { justify-content: flex-start; gap: 1cqw; padding: 0 2cqw; }
.lcd.line .lk { display: inline-flex; width: 7cqw; height: 34cqh; flex: none; }
.lcd.line .lk:empty { display: none; }
.lcd.line .lk svg { width: 100%; height: 100%; }
.lcd.line .lb { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; font-size: min(40cqh, 10.5cqw); font-weight: 500; }
.lcd.line .t { font-size: min(44cqh, 12cqw); font-weight: 500; }
.lcd.seg { justify-content: space-between; gap: 1cqw; padding: 0 1.8cqw; }
.lcd.seg .lad { display: grid; flex: 1 1 0; overflow: hidden; gap: 2cqh; min-width: 0; font-size: min(19cqh, 7cqw); line-height: 1.1; color: #687078; }
.lcd.seg .lad span { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.lcd.seg .lad .on { color: #f2f4f6; font-weight: 600; }
.lcd.seg .sg { display: flex; height: 56cqh; flex: none; }
.lcd.seg .sg svg { height: 100%; width: auto; overflow: visible; }
.lcd.seg .sg path { fill: none; stroke: currentColor; stroke-width: 2.3; stroke-linecap: round; }
.lcd.seg .sg path.off { opacity: .07; }
.lcd.seg .sg circle { fill: currentColor; }
.lcd.oven { display: grid; grid-template-rows: auto auto auto; justify-items: center; align-content: center; gap: .25cqw; padding: 0 1.5cqw; }
.lcd.oven .lb { max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: min(19cqh, 8cqw); color: #cfd4d9; }
.lcd.oven .t { font-size: min(40cqh, 15cqw); line-height: 1; }
.lcd.oven .t.word { font-size: min(26cqh, 8.5cqw); }
.lcd.oven .cur { font-size: min(19cqh, 8cqw); color: #f0a23c; }
.lcd.oven .lb:empty, .lcd.oven .cur:empty { display: none; }
.lcd.menu { display: grid; grid-template-rows: auto 1fr; align-items: stretch; gap: .6cqw; padding: .8cqw 1.2cqw; transition: background .4s; }
.lcd.menu .hd { display: flex; justify-content: space-between; gap: 4cqw; font-size: min(13cqh, 10cqw); white-space: nowrap; }
.lcd.menu .bd { display: grid; align-content: center; justify-items: center; min-height: 0; text-align: center; }
.lcd.menu .bd svg { width: 100%; height: 100%; }
.lcd.menu .bd .big { font-size: min(16cqh, 11cqw); font-weight: 500; }
.lcd.menu .bd .small { font-size: min(10cqh, 7cqw); color: #c3c9cf; }
/* switched on means a lit display, like the real ones (the coffee machine's screen is a light grey UI) */
.lcd-on .lcd.line, .lcd-on .lcd.seg, .lcd-on .lcd.oven { background: linear-gradient(#ffffff0c, #ffffff04); }
.lcd-on .lcd.menu { background: #4a5158; }
.g-coffee:not(.moving) .ring .track { opacity: 0; }

/* status icons on the front */
.icon { aspect-ratio: 1; border-radius: 50%; display: grid; place-items: center;
  background: color-mix(in srgb, var(--f-ink) 13%, transparent); }
.icon ha-icon { --mdc-icon-size: 62%; width: 62%; height: 62%; display: grid; place-items: center; color: var(--f-ink); opacity: .6; }
.icon.lit ha-icon { color: var(--c); opacity: 1; }
.icon.warn ha-icon { color: var(--warn); opacity: 1; }

.icon.tap { cursor: pointer; }

/* information: on the lower front of the laundry machines, underneath the drawing for the others */
.panel { display: grid; align-content: center; gap: .9cqw; padding: 1.6cqw 3.4cqw; border-radius: 2.6cqw;
  background: var(--mc-panel); color: var(--mc-panel-fg); box-shadow: 0 0 0 1px var(--mc-panel-line), 0 2px 10px #0000001f;
  font-size: clamp(11px, 3.35cqw, 14.5px); line-height: 1.3; }
.panel.over { position: absolute; }
.panel.below { margin: 12px auto 0; max-width: var(--maxw, 400px); gap: 3px; padding: 8px 12px; border-radius: 12px; font-size: 13.5px;
  box-shadow: 0 0 0 1px var(--mc-panel-line); }
.lcd.ghost { color: var(--f-ink); }
.lcd.ghost .t { font-weight: 400; }
.quiet .lcd.ghost { opacity: 0; }
.quiet .panel { display: none; }
.row { display: flex; justify-content: space-between; align-items: baseline; gap: 10px; min-width: 0; }
.row .k { color: var(--mc-muted); flex: none; }
.row .v { font-weight: 500; text-align: right; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.dots { display: inline-flex; gap: .7cqw; margin-right: 1.4cqw; vertical-align: .05em; }
.dots i { width: 1.5cqw; height: 1.5cqw; min-width: 6px; min-height: 6px; border-radius: 50%; background: var(--mc-dot); }
.dots i.on { background: var(--c); }
.dots i.target { box-shadow: 0 0 0 1.5px var(--c); }

/* motion */
@keyframes mc-rot { to { transform: rotate(360deg); } }
@keyframes mc-tumble { 0%, 100% { transform: rotate(-26deg); } 50% { transform: rotate(40deg); } }
@keyframes mc-slosh { 0%, 100% { transform: translateX(-7%); } 50% { transform: translateX(7%); } }
@keyframes mc-pulse { 50% { opacity: .4; } }
@keyframes mc-breathe { 0%, 100% { opacity: .75; } 50% { opacity: .2; } }
.moving .drum, .moving .laundry, .moving .wave, .m-indeterminate .ring .spin { will-change: transform; }
.anim-full.moving .drum { animation: mc-rot 6s linear infinite; }
.anim-full.moving .laundry { animation: mc-tumble 2.8s ease-in-out infinite; }
.anim-full.moving .wave { animation: mc-slosh 3.4s ease-in-out infinite; }
.anim-full.moving.f-spin .drum, .anim-full.moving.f-spin .laundry { animation: mc-rot 1.5s linear infinite; }
.anim-full.dryer.moving .drum { animation-duration: 7s; }
.anim-full.dryer.moving .laundry { animation-duration: 3.4s; }
.anim-full.f-heat.moving .heat { animation: mc-pulse 3.6s ease-in-out infinite; }
.anim-full.f-anti .drum, .anim-full.st-done.f-cool .drum { animation: mc-rot 14s linear infinite; }
.anim-full.f-anti .laundry, .anim-full.st-done.f-cool .laundry { animation: mc-tumble 7s ease-in-out infinite; }
.anim-reduced.moving .drum, .anim-reduced.f-anti .drum { animation: mc-rot 16s linear infinite; }
.anim-reduced.moving.f-spin .drum { animation-duration: 5s; }
.anim-full.m-indeterminate .spin, .anim-reduced.m-indeterminate .spin { animation: mc-rot 2.6s linear infinite; }
.breathe .ring .bar { opacity: .6; }
.anim-full.breathe .ring .bar, .anim-reduced.breathe .ring .bar { animation: mc-breathe 3s ease-in-out infinite; }

/* ovens: the cavity, glow, light, steam and microwaves */
@keyframes mc-rise { 0% { transform: translateY(18%); opacity: 0; } 30% { opacity: .65; } 100% { transform: translateY(-24%); opacity: 0; } }
@keyframes mc-wave { 0% { transform: scale(.35); opacity: .9; } 100% { transform: scale(2.3); opacity: 0; } }
.cavity { opacity: .7; transition: opacity .8s; }
.lit .cavity, .lcd-on .cavity { opacity: 1; }
.dish { opacity: 0; transition: opacity .8s; }
.loaded .dish { opacity: 1; }
.glow { background: radial-gradient(ellipse 70% 60% at 50% 100%, #ff8a3d78, #ff8a3d00 70%), radial-gradient(ellipse 80% 45% at 50% 0%, #ff6a2a5c, #ff6a2a00 70%);
  opacity: 0; transition: opacity 1.2s; }
.f-heat .glow { opacity: .85; }
/* switched on: a soft glow behind the glass; the light really on (light entity): the full light */
.light { background: radial-gradient(ellipse 90% 85% at 50% 0%, #fff0d2d8, #fff0d200 80%), linear-gradient(#ffe8c040, #ffe8c018);
  opacity: 0; transition: opacity .8s; }
.lcd-on .light { opacity: .3; }
.lamp .light { opacity: 1; }
.steam .w, .waves .wv { opacity: 0; }
.f-steam .steam .w, .f-dispense .steam .w { opacity: .5; }
.f-micro .waves .wv:first-child { opacity: .55; }
.anim-full.f-heating .glow { animation: mc-pulse 2.4s ease-in-out infinite; }
.anim-full.f-steam .steam .w, .anim-full.f-dispense .steam .w { animation: mc-rise 3.6s ease-in infinite; }
.anim-full.f-micro .waves .wv { animation: mc-wave 2.4s ease-out infinite; }
.steam .w:nth-child(2), .waves .wv:nth-child(2) { animation-delay: -1.2s !important; }
.steam .w:nth-child(3), .waves .wv:nth-child(3) { animation-delay: -2.4s !important; }

/* dishwasher: plates and glasses when loaded, water from the spray arms, steam while drying, the light inside,
   the floor light under the plinth while it runs */
@keyframes mc-jet { 0%, 100% { opacity: .2; transform: scaleY(.55); } 50% { opacity: .8; transform: scaleY(1); } }
.tub { opacity: .75; transition: opacity .8s; }
.lit .tub { opacity: 1; }
.plates { opacity: 0; transition: opacity .8s; }
.loaded .plates { opacity: 1; }
.spray .jet { opacity: 0; transform-box: fill-box; transform-origin: 50% 100%; }
.f-spray .spray .jet { opacity: .75; }
.anim-full.f-spray .spray .jet { animation: mc-jet 1.4s ease-in-out infinite; }
.dlight { background: radial-gradient(ellipse 90% 70% at 50% 0%, #f2f6ffd0, #f2f6ff00 75%); opacity: 0; transition: opacity .8s; }
.f-door .dlight, .dishwasher.lamp .dlight { opacity: 1; }
.infolight { opacity: 0; transition: opacity 1s; }
.moving .infolight { opacity: 1; }

/* hob, hood, fridges: no cycle, so no progress ring */
.g-hob .ring, .g-hood .ring, .g-cooling .ring { display: none; }
/* hob: a pan and a glow on every zone that is on, the glow as strong as the zone's level (--lvl, 0\u20261) */
.zone .zg { opacity: calc(var(--lvl, 0) * .9); transition: opacity .8s; }
.zone .pan { opacity: clamp(0, calc(var(--lvl, 0) * 1000), 1); transition: opacity .4s; }
/* inside .lcd (a size container) cq units are the display's own */
.lcd.zones { background: none; }
.lcd.zones .zt { display: flex; width: 100%; justify-content: space-evenly; align-items: center; }
.lcd.zones i { font-style: normal; font-weight: 700; font-size: 72cqh; line-height: 1; color: #e7a83c; opacity: .28; font-variant-numeric: tabular-nums; }
.lcd.zones i.on { opacity: 1; text-shadow: 0 0 8cqh #e7a83c80; }
/* hood: vapour rising into it, faster with every fan level; the light cones; the Aura's coloured ring */
.vapour .w { opacity: 0; }
.fan-on .vapour .w { opacity: .55; }
.anim-full.fan-on .vapour .w, .anim-reduced.fan-on .vapour .w { animation: mc-rise 3.8s ease-in infinite; }
.anim-full.fan-2 .vapour .w { animation-duration: 2.9s; }
.anim-full.fan-3 .vapour .w { animation-duration: 2.2s; }
.anim-full.fan-4 .vapour .w { animation-duration: 1.5s; }
.cones { opacity: 0; transition: opacity .8s; }
.lamp .cones { opacity: 1; }
.theme-light .vapour path { stroke: #8f9ca7; }
.theme-light .cones path { fill: #f0c86a; fill-opacity: .28; }
.aura-glow { opacity: 0; transition: opacity 1s; }
.ambient .aura-glow { opacity: 1; }
.lcd.hood { background: none; }
.lcd.hood .hb { display: flex; align-items: center; justify-content: center; gap: 4cqw; }
.lcd.hood i { width: 16cqw; height: 26cqh; border-radius: 13cqh; background: #ffffff38; }
.theme-light .lcd.hood i { background: #00000026; }
.lcd.hood i.on { background: var(--c); }

/* fridge and wine: the inside lit when the door opens, cold mist while SuperCool/SuperFrost runs, the zone temperatures */
.inside { opacity: .78; transition: opacity .8s; }
.f-door .inside, .lamp .inside { opacity: 1; }
.cold { background: linear-gradient(#eaf6ff00, #eaf6ffb0); opacity: 0; transition: opacity 1.2s; }
.f-super .cold { opacity: .75; }
.anim-full.f-super .cold { animation: mc-pulse 4s ease-in-out infinite; }
.flight { background: radial-gradient(ellipse 90% 60% at 50% 0%, #ffffffe0, #ffffff00 75%); opacity: 0; transition: opacity .6s; }
.f-door .flight { opacity: 1; }
.wlight { background: linear-gradient(90deg, #ffe7b800, #ffe7b855 50%, #ffe7b800); opacity: 0; transition: opacity .8s; }
.lamp .wlight, .f-door .wlight { opacity: 1; }
.lcd.cool .ct { display: flex; justify-content: space-evenly; width: 100%; align-items: center; }
.lcd.cool b { font-size: 62cqh; font-weight: 600; line-height: 1; color: #9fd8ff; font-variant-numeric: tabular-nums; }
.lcd.cool { opacity: .35; }
.lcd-on .lcd.cool { opacity: 1; }
/* robot: side brushes that turn while it cleans, the stretch it has done, the station's charge mark */
.trail { opacity: 0; transition: opacity 1.5s; }
.f-clean .trail { opacity: 1; }
.anim-full.f-clean .brush, .anim-reduced.f-clean .brush { animation: mc-rot .7s linear infinite; }
.g-vacuum .ring .track { opacity: .25; }

/* coffee: cup light, the cup filling up, the stream, steam, rinse drops, the grinder's buzz */
@keyframes mc-fall { to { transform: translateY(10px); } }
@keyframes mc-drop { 0% { transform: translateY(0); opacity: 0; } 15% { opacity: .9; } 100% { transform: translateY(62%); opacity: 0; } }
@keyframes mc-buzz { 25% { transform: translate(.5px, -.4px); } 75% { transform: translate(-.5px, .4px); } }
.cuplight { background: radial-gradient(ellipse 42% 62% at 50% 0%, #fff3d8a0, #fff3d800 72%); opacity: 0; transition: opacity .8s; }
.lcd-on .cuplight { opacity: .3; }
.lamp .cuplight { opacity: 1; }
.cup { opacity: 0; transition: opacity .6s; }
.g-coffee.moving .cup, .g-coffee.st-done .cup { opacity: 1; }
.cup .fill { transform-box: fill-box; transform-origin: 50% 100%; transform: scaleY(.04); }
.f-dispense .cup .fill { transform: scaleY(1); transition: transform 40s ease-out; }
.jet { position: absolute; top: 0; height: 46%; width: 1.4%; left: 47.4%; overflow: hidden; opacity: 0; transition: opacity .3s; }
.jet.two { left: 51.2%; }
.jet::before { content: ""; position: absolute; left: 0; right: 0; top: -20px; bottom: 0;
  background: repeating-linear-gradient(to bottom, #7a4a2b 0 7px, #7a4a2b99 7px 10px); }
.f-dispense .jet { opacity: .95; }
.anim-full.f-dispense .jet::before { animation: mc-fall .4s linear infinite; }
.drops .d { opacity: 0; }
.anim-full.f-rinse .drops .d { animation: mc-drop 1.1s ease-in infinite; }
.drops .d:nth-child(2) { animation-delay: -.4s !important; }
.drops .d:nth-child(3) { animation-delay: -.8s !important; }
.anim-full.f-grind .art { animation: mc-buzz .14s linear infinite; }

/* warming drawer: the front slides out when the drawer opens, a warm line along the top while it heats */
.drawer .glass.box { overflow: visible; }
.front { transition: transform .8s ease; }
.f-door .front { transform: translateY(13%) scale(1.015); }
.drawer .pic { margin-bottom: 4%; transition: margin-bottom .8s ease; }
.drawer.f-door .pic { margin-bottom: 14%; }
.warmline { bottom: auto; height: 12%; background: linear-gradient(to bottom, #ffa45c99, #ffa45c00); opacity: 0; transition: opacity 1s; }
.f-warm .warmline { opacity: 1; }
.anim-full.f-warm .warmline { animation: mc-pulse 4s ease-in-out infinite; }

.st-paused .layer, .st-paused .wave, .st-paused .jet::before { animation-play-state: paused !important; }
@media (prefers-reduced-motion: reduce) {
  .layer, .wave, .spin, .ring .bar, .jet::before, .art { animation: none !important; }
  .water, .cup .fill { transition: none !important; }
}
`;var Me=t=>String(t).padStart(2,"0");function To(t){let e=Math.max(0,Math.round(t)),o=Math.floor(e/3600),i=Math.floor(e%3600/60),r=e%60;return o?`${o}:${Me(i)}:${Me(r)}`:`${i}:${Me(r)}`}function U(t){let e=Math.round(t/60);return`${Math.floor(e/60)}:${Me(e%60)}`}function z(t,e,o){let i=e?.locale??{},r={hour:"2-digit",minute:"2-digit"};i.time_zone==="server"&&e?.config?.time_zone&&(r.timeZone=e.config.time_zone),i.time_format==="12"?r.hour12=!0:i.time_format==="24"&&(r.hour12=!1);try{return new Intl.DateTimeFormat(o,r).format(t)}catch{return new Date(t).toTimeString().slice(0,5)}}var G=(t,e="\xB0C")=>`${Math.round(t)} ${e}`;var Xi={a:"M3.2 1.6 H8.8",b:"M10.4 3.2 V8.8",c:"M10.4 11.2 V16.8",d:"M3.2 18.4 H8.8",e:"M1.6 11.2 V16.8",f:"M1.6 3.2 V8.8",g:"M3.2 10 H8.8"},Qi={0:"abcdef",1:"bc",2:"abged",3:"abgcd",4:"fgbc",5:"afgcd",6:"afgedc",7:"abc",8:"abcdefg",9:"abfgcd","-":"g"," ":""};function Io(t){let e=0,o="";for(let i of String(t)){if(i===":"){o+=`<circle cx="${e+2}" cy="6.4" r="1.25"/><circle cx="${e+2}" cy="13.6" r="1.25"/>`,e+=4.2;continue}let r=Qi[i]??"";o+=`<g transform="translate(${e} 0)">${Object.entries(Xi).map(([s,n])=>`<path d="${n}" class="${r.includes(s)?"on":"off"}"/>`).join("")}</g>`,e+=12.6}return`<svg viewBox="-1 0 ${e+1} 20" aria-hidden="true"><g transform="skewX(-6)">${o}</g></svg>`}async function Ge(t,e,o,i){try{return await t.callService(e,o,i),null}catch(r){return pt(t,r)}}async function pt(t,e){let o=e?.message||String(e);return e?.translation_key&&e?.translation_domain&&(o=(await t.loadBackendTranslation?.("exceptions",e.translation_domain))?.(`component.${e.translation_domain}.exceptions.${e.translation_key}.message`,e.translation_placeholders)||o),o}var er=`<svg viewBox="0 0 100 62" aria-hidden="true"><g fill="#c4cad0">
  <rect x="2" y="2" width="47" height="28" rx="2.5"/><rect x="51" y="2" width="47" height="28" rx="2.5"/>
  <rect x="2" y="32" width="47" height="28" rx="2.5"/><rect x="51" y="32" width="47" height="28" rx="2.5"/></g>
  <g fill="none" stroke="#3b4148" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M21 11 h8 v7 a4 4 0 0 1 -8 0 Z M29 13 h2 a2 2 0 0 1 0 4 h-2"/><path d="M69 11 h12 v6 a6 6 0 0 1 -12 0 Z M81 13 h2 a2 2 0 0 1 0 4 h-2"/>
  <path d="M19 41 h12 v7 a6 6 0 0 1 -12 0 Z M31 43 h2 a2 2 0 0 1 0 4 h-2 M21 39 c1 -2 3 -2 4 0"/><path d="M71 39 h8 l-1 14 h-6 Z M72 46 h6"/></g></svg>`,tr=`<svg viewBox="0 0 12 14" aria-hidden="true"><path d="M3 6 V4.2 a3 3 0 0 1 6 0 V6" fill="none" stroke="currentColor" stroke-width="1.5"/>
  <rect x="1.2" y="6" width="9.6" height="7" rx="1.4" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M6 8.6 v2" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>`,ht=t=>U(Math.ceil(Math.max(0,t)/60)*60),Ce=me.filter(t=>t!=="hand_iron"),or={basic:'<span class="t" id="lcd-t"></span><span class="s" id="lcd-s"></span>',line:'<span class="lk" id="lcd-k"></span><span class="lb" id="lcd-l"></span><span class="t" id="lcd-t"></span>',seg:'<span class="lad" id="lcd-l"></span><span class="sg" id="lcd-t"></span>',oven:'<span class="lb" id="lcd-l"></span><span class="t" id="lcd-t"></span><span class="cur" id="lcd-s"></span>',menu:'<span class="hd"><span id="lcd-l"></span><span id="lcd-k"></span></span><span class="bd" id="lcd-t"></span>',zones:'<span class="zt" id="lcd-t"></span>',hood:'<span class="hb" id="lcd-t"></span>',cool:'<span class="ct" id="lcd-t"></span>',robot:'<span class="t" id="lcd-t"></span>'},ft=t=>{let e=[t.temp,t.temp2,t.temp3].filter(o=>o!=null);return e.length?e:(t.thermo??[]).map(o=>o.current).filter(o=>o!=null)},Le=t=>t.fan?.on?Math.max(1,Math.min(4,Math.ceil(t.fan.pct/25))):0,$=t=>String(t??"").replace(/[&<>"]/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"})[e]),ir=0,Ae=class extends HTMLElement{static getConfigElement(){return document.createElement("miele-appliance-card-editor")}static getStubConfig(e){let o=A(e)[0];return o?{device_id:o.id}:{}}setConfig(e){if(!e)throw new Error("Invalid configuration");this._config={theme:"dark",animations:"full",controls:!0,...e},this._dev=null,this._hass&&this._init()}set hass(e){let o=!this._hass;if(this._hass=e,this._dev||this._init(),!this._dev)return;let i=Object.values(this._dev.roles);(o||i.some(r=>e.states[r]!==this._seen?.[r]))&&(this._seen=Object.fromEntries(i.map(r=>[r,e.states[r]])),this._update())}connectedCallback(){clearInterval(this._tick),this._tick=setInterval(()=>this._update(),1e3),this._hass&&!this._dev&&this._init()}disconnectedCallback(){clearInterval(this._tick)}getCardSize(){return 9}getGridOptions(){return{columns:12,min_columns:4,rows:"auto"}}_deviceId(){let e=this._config,o=this._hass;return e.device_id?e.device_id:e.entity?o.entities?.[e.entity]?.device_id??null:A(o)[0]?.id??null}_init(){if(!this._config||!this._hass)return;let e=this._deviceId(),o=e?W(this._hass,e,{overrides:this._config.entities}):null;if(!o||!o.roles.status){this._dev=null,this._buildEmpty();return}this._dev=o,this._tracker=new P(o.family),this._seen=null,this._hass.loadBackendTranslation?.("entity","miele")?.then?.(()=>this._update(!0)),this._build(),this._update(!0)}get _lang(){return Q(this._hass,this._config)}_t(e,o){return k(this._lang,e,o)}_buildEmpty(){let e=this.shadowRoot??this.attachShadow({mode:"open"});e.innerHTML=`<style>${dt}</style><ha-card class="theme-${this._themeName()}"><div class="err">${$(this._t(J(this._hass)?"err.old_integration":"err.no_device"))}</div></ha-card>`}_themeName(){let e=this._config.theme;return e==="auto"?this._hass?.themes?.darkMode?"dark":"light":["dark","light","ha"].includes(e)?e:"dark"}_build(){let e=this._config,o=this._dev,i=o.family,r=this._draw=T[e.drawing]?e.drawing:i.drawing,s=this._hass.devices?.[o.id]?.model_id??o.modelId,n=this._design=$e(r,e.design,s),l=zo(r,n,s),a=l.geom,p=`mc${++ir}`;this._geom=a;let d=this._style=l.display??"basic",c=Do(e.finish,l.finish??i.finish),h=e.accent||te[r]||te.generic,f=this._name=e.name||this._hass.devices?.[o.id]?.name_by_user||this._t(`kind.${i.kind}`);this._inText=e.name||this._hass.devices?.[o.id]?.name_by_user?f:f.toLowerCase();let _=a.icons.at.map(([S,Y],I)=>`<div class="at icon" id="ic${I}" style="left:${S}%;top:${Y}%;width:${a.icons.size}%"><ha-icon></ha-icon></div>`).join(""),m=a.window,y=m.d!=null,b=y?`class="at glass round" style="left:${m.x}%;top:${m.y}%;width:${m.d}%"`:`class="glass box" style="left:${m.left}%;top:${m.top}%;width:${m.width}%;height:${m.height}%;border-radius:${m.radius}"`,x=[0,1,2,3].map(S=>`<div class="row"><span class="k" id="k${S}"></span><span class="v" id="v${S}"></span></div>`).join(""),g=a.panel,u=g?`<div class="panel over" style="left:${g.left}%;right:${g.right}%;top:${g.top}%;bottom:${g.bottom}%">${x}</div>`:`<div class="panel below">${x}</div>`,v=e.images?`<img src="${$(String(e.images).replace(/\/?$/,"/")+i.drawing+".svg")}" alt="">`:l.svg(p),C=this.shadowRoot??this.attachShadow({mode:"open"});C.innerHTML=`<style>${dt}</style>
<ha-card class="${r} g-${i.group} ${y?"round":"flat"} theme-${this._themeName()} anim-${["full","reduced","off"].includes(e.animations)?e.animations:"full"}"
  style="--c:${$(h)};${Oo(c)}${e.max_width||l.maxWidth?`;--maxw:${$(e.max_width||l.maxWidth)}`:""}">
  <div class="head"><span class="name">${$(f)}</span><span class="pill" id="pill"></span></div>
  <div class="bigtime" id="bigtime" hidden><span class="bt" id="bt"></span><span class="bs" id="bs"></span></div>
  <div class="ctl" id="ctl" hidden>
    <button id="b-pause"><ha-icon icon="mdi:pause"></ha-icon>${$(this._t("btn.pause"))}</button>
    <button id="b-resume"><ha-icon icon="mdi:play"></ha-icon>${$(this._t("btn.resume"))}</button>
    <button id="b-start"><ha-icon icon="mdi:play"></ha-icon>${$(this._t("btn.start"))}</button>
    <button id="b-stop"><ha-icon icon="mdi:stop"></ha-icon>${$(this._t("btn.stop"))}</button>
    <button id="b-power"><ha-icon icon="mdi:power"></ha-icon><span id="b-power-t"></span></button>
  </div>
  <div class="ask" id="ask" hidden><span id="ask-t"></span><button id="ask-no">${$(this._t("btn.cancel"))}</button><button class="go" id="ask-yes"></button></div>
  <div class="err" id="err"></div>
  <div class="pic" id="pic" style="--ratio:${a.ratio}">
    <div class="art">${v}</div>
    <div ${b}>${l.window(p)}<div class="phase" id="phase"></div></div>
    <svg class="ring" viewBox="${a.view}" aria-hidden="true"><path class="track" d="${a.ring.path}" pathLength="100" style="stroke-width:${a.ring.width}"/>
      <path class="bar" id="bar" d="${a.ring.path}" pathLength="100" stroke-dasharray="100" stroke-dashoffset="100" style="stroke-width:${a.ring.width}"/></svg>
    ${a.ring.spin?`<div class="at spinbox" style="left:${a.ring.spin.x}%;top:${a.ring.spin.y}%;width:${a.ring.spin.d}%"><div class="spin"><svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="48.5" pathLength="100"/></svg></div></div>`:""}
    <div class="lcd ${d}${a.lcd.ghost?" ghost":""}" style="left:${a.lcd.x}%;top:${a.lcd.y}%;width:${a.lcd.w}%;height:${a.lcd.h}%">${or[d]}</div>
    ${_}
    ${g?u:""}
  </div>
  ${g?"":u}
</ha-card>`,this._root=C.querySelector("ha-card"),this._el=S=>C.getElementById(S),this._text={};let V=S=>()=>this._call("button","press",{entity_id:this._dev.roles[S]});this._el("b-pause").onclick=V("btn_pause"),this._el("b-resume").onclick=V("btn_start"),this._el("b-start").onclick=()=>this._ask("start"),this._el("b-stop").onclick=()=>this._ask("stop"),this._el("b-power").onclick=()=>this._vm?.state==="off"?this._power(!0):this._ask("off"),this._el("ask-no").onclick=()=>this._ask(null),this._el("ask-yes").onclick=()=>{let S=this._asking;this._ask(null),S==="start"&&V("btn_start")(),S==="stop"&&V("btn_stop")(),S==="off"&&this._power(!1)};let B=this._el("ic3");B&&(B.onclick=S=>{S.stopPropagation(),this._dev.roles.light&&this._call("light","toggle",{entity_id:this._dev.roles.light})}),this._el("pic").onclick=()=>this.dispatchEvent(new CustomEvent("hass-more-info",{detail:{entityId:this._dev.roles.status},bubbles:!0,composed:!0}))}_set(e,o){if(this._text[e]===o)return;this._text[e]=o;let i=this._el(e);i&&(i.textContent=o)}_setHTML(e,o){if(this._text[e]===o)return;this._text[e]=o;let i=this._el(e);i&&(i.innerHTML=o)}_update(){if(!this._dev||!this._root||!this._hass)return;let e=this._hass,o=this._dev,i=this._lang,r=X(e,o.roles),s=this._vm=this._tracker.update(r,j());this._powerErr&&r.power===this._powerErr.on&&(this._text.err===this._powerErr.text&&this._set("err",""),this._powerErr=null);let n=s.flags??{},l=s.state,a=l==="running"||l==="paused",p=this._draw,d=s.program??"",c=s.phase??"",h=o.family.group==="oven",f=p==="coffee"||p==="coffee_builtin",_=p==="drawer",m=f&&l==="running"&&!n.rinsing&&!/grinding|rinse/.test(c),y={[`st-${l}`]:!0,[`m-${s.progress.mode}`]:!0,moving:a||!1,stale:s.stale,"f-spin":n.spin&&l==="running","f-anti":n.antiCrease&&l==="done","f-cool":n.cooling,"f-heat":p==="dryer"&&a&&!n.cooling||h&&l==="running"&&!n.cooling||p==="washer_dryer"&&a&&c==="drying"||!1,"f-heating":h&&l==="running"&&n.heating,"f-steam":h&&a&&(/steam|moisture|sous_vide|blanching|bottling|defrost/.test(d)||c==="steam_reduction")||p==="dishwasher"&&a&&c==="drying","f-spray":p==="dishwasher"&&l==="running"&&/dishwash|rinse|reactivating/.test(c),"f-super":!!(r.supercooling||r.superfreezing),"f-clean":r.vacuum==="cleaning","f-docked":r.vacuum==="docked","f-micro":h&&l==="running"&&/microwave|popcorn/.test(d),"f-grind":f&&l==="running"&&/grinding/.test(c),"f-dispense":m,"f-rinse":f&&l==="running"&&(n.rinsing||c==="rinse"),"f-warm":_&&(a||n.keepWarm),"f-door":n.doorOpen||c==="door_open"||_&&l==="paused",lit:a||n.doorOpen||n.antiCrease||l==="done"&&n.cooling||n.light===!0,lamp:n.light===!0||n.light==null&&(a||n.doorOpen)||!1,loaded:["ready","scheduled","running","paused","done","interrupted","error"].includes(l)&&!(f&&!a)&&s.programType!=="maintenance_program"&&!/clean_machine|descal|rinse_out_lint|^rinse$/.test(d),quiet:["off","standby","offline"].includes(l),wet:(p==="washer"||p==="washer_dryer")&&a&&!n.spin&&!n.drain&&!["anti_crease","drying","finished"].includes(s.phase),"has-phase":!!s.phase&&(a||l==="done")},b=Object.entries(y).filter(([,E])=>E).map(([E])=>E).join(" ");if(b!==this._cls){for(let E of(this._cls??"").split(" ").filter(Boolean))this._root.classList.remove(E);for(let E of b.split(" "))this._root.classList.add(E);this._cls=b}let x=this._t(`state.${l}`);l==="running"&&n.almostDone?x=this._t("pill.almost_done"):l==="running"&&s.phase?x=M(e,"phase",s.phase,this._lang):l==="scheduled"&&n.smartGridWait?x=this._t("pill.smart_grid"):l==="paused"&&p==="drawer"?x=this._t("pill.drawer_open"):l==="paused"&&n.doorOpen&&(x=this._t("pill.door_open"));let g=o.family.group,u=Le(r);if(g==="hob"){let E=(r.plates??[]).filter(St=>re(St).level>0).length;E&&(x=this._t("pill.zones",{n:E}))}else g==="hood"&&u?x=this._t("pill.fan",{n:u}):g==="cooling"&&l!=="offline"?x=r.supercooling?this._t("pill.supercool"):r.superfreezing?this._t("pill.superfreeze"):ft(r).map(E=>G(E,s.temps.unit)).join(" \xB7 ")||x:g==="vacuum"&&r.vacuum&&(x={cleaning:this._t("pill.cleaning"),returning:this._t("pill.returning"),paused:this._t("state.paused"),error:this._t("state.error"),docked:this._t(r.battery!=null&&r.battery<100?"pill.charging":"pill.docked")}[r.vacuum]??x);this._set("pill",x),this._set("phase",s.phase?M(e,"phase",s.phase,this._lang):""),this._display(s,r),this._extra(r);let v=p==="robot"&&r.battery!=null?Math.max(0,Math.min(1,r.battery/100)):null,C=v==null&&s.progress.mode==="indeterminate"&&!this._geom.ring.spin,V=v??(l==="error"||l==="interrupted"||C?1:s.progress.value);this._root.classList.toggle("breathe",C);let B=this._el("bar"),S=String(100-Math.round((V??0)*1e3)/10);B.style.strokeDashoffset!==S&&(B.style.strokeDashoffset=S),B.style.opacity=V==null?"0":"1";let Y=o.family.group==="laundry"||o.family.group==="dishwasher";this._icon(0,s.connection==="lost"?"mdi:wifi-off":"mdi:wifi",s.connection==="lost"?"warn":n.remote?"lit":"",this._t(s.connection==="lost"?"icon.lost":"icon.remote"),!!o.roles.remote_control),this._icon(1,"mdi:cellphone-arrow-down",n.mobileStart?"lit":"",this._t("icon.mobile"),!!o.roles.mobile_start);let I=n.doorOpen?["mdi:door-open","lit","icon.door_open"]:a&&Y?["mdi:lock","lit","icon.door_locked"]:["mdi:door-closed","","icon.door_closed"];this._icon(2,I[0],I[1],this._t(I[2]),!!o.roles.door),this._el("ic3")&&this._icon(3,n.light?"mdi:lightbulb-on":"mdi:lightbulb-outline",n.light?"lit":"",this._t("icon.light"),!!o.roles.light),this._rows(s,r,i),this._controls(s,r),this._config.big_countdown&&this._bigTime(s)}_extra(e){let o=this._draw,i=this._root;if(o==="hob"){let r=(e.plates??[]).map(s=>String(re(s).level));i.querySelectorAll(".zone").forEach(s=>{let n=r[Number(s.dataset.z)]??"0";s.style.getPropertyValue("--lvl")!==n&&s.style.setProperty("--lvl",n)})}else if(o==="hood"){let r=Le(e);for(let s=1;s<=4;s++)i.classList.toggle(`fan-${s}`,s===r);i.classList.toggle("fan-on",r>0),i.classList.toggle("ambient",e.ambient===!0)}}_display(e,o){let i=this._hass,r=this._lang,s=e.state,n=e.lcd.main,l=this._style,a=(f,_)=>M(i,f,_,r);if(l==="zones"){this._setHTML("lcd-t",(o.plates??[]).map(f=>{let _=re(f);return`<i class="${_.level>0?"on":""}">${$(_.text)}</i>`}).join(""));return}if(l==="cool"){this._setHTML("lcd-t",ft(o).map(f=>`<b>${Math.round(f)}\xB0</b>`).join("")),this._root.classList.toggle("lcd-on",e.state!=="off"&&e.state!=="offline");return}if(l==="robot"){this._set("lcd-t",o.battery!=null?`${Math.round(o.battery)} %`:"");return}if(l==="hood"){let f=Le(o);this._setHTML("lcd-t",[1,2,3,4].map(_=>`<i class="${_<=f?"on":""}"></i>`).join(""));return}if(l==="basic"){this._set("lcd-t",this._lcd(n,e)),this._set("lcd-s",e.lcd.sub?.kind==="phase"?"":this._lcd(e.lcd.sub,e)),this._el("lcd-t").classList.toggle("word",["text","program","phase"].includes(n?.kind));return}let p=z(j(),i,r),d=n?.kind==="text"?this._t(`lcd.${n.value}`):"",c=s==="standby"?p:n?.kind==="countdown"?ht(n.value):n?.kind==="duration"?U(n.value):n?.kind==="clock"?z(n.value,i,r):"",h=s==="running"||s==="paused";if(this._root.classList.toggle("lcd-on",s!=="off"&&s!=="offline"),l==="line"){let f=d||(s==="paused"?this._t("lcd.paused"):s==="ready"?a("program",e.program):s==="scheduled"?this._t("lcd.starts"):h&&e.phase?a("phase",e.phase):h?a("program",e.program):"");this._setHTML("lcd-k",h&&!e.flags.doorOpen?tr:""),this._set("lcd-l",f),this._set("lcd-t",d?"":c)}else if(l==="seg"){let f=o.dryingStep,_=[...Ce].reverse(),m=_.indexOf(f),y=m>=0&&!d&&["ready","scheduled","running","paused"].includes(s);this._setHTML("lcd-l",y?_.slice(Math.max(0,Math.min(m-1,_.length-3)),Math.max(0,Math.min(m-1,_.length-3))+3).map(b=>`<span class="${b===f?"on":""}">${$(a("dryness",b))}</span>`).join(""):`<span class="on">${$(d||(s==="standby"?"":a("program",e.program)))}</span>`),this._setHTML("lcd-t",c&&!d?Io(c):"")}else if(l==="oven"){let f=e.temps,_=f.unit,m=n?.kind==="countdown"?ht(n.value):f.target!=null&&(h||s==="ready"||s==="scheduled")?G(f.target,_):d||c;this._set("lcd-l",s==="standby"?"":d&&m!==d?d:a("program",e.program)),this._set("lcd-t",m),this._el("lcd-t").classList.toggle("word",m===d&&!!d),this._set("lcd-s",h&&f.current!=null?G(f.current,_):"")}else if(l==="menu"){let f=e.program?a("program",e.program):"";this._set("lcd-l",s==="standby"?this._t("lcd.drinks"):d||f||(e.flags.rinsing?this._t("lcd.rinsing"):"")),this._set("lcd-k",s==="off"||s==="offline"?"":p),this._setHTML("lcd-t",s==="standby"?er:s==="running"||s==="paused"?`<span class="big">${$(e.flags.rinsing?this._t("lcd.rinsing"):f)}</span><span class="small">${$(e.phase?a("phase",e.phase):"")}</span>`:d?`<span class="big">${$(d)}</span>`:"")}}_bigTime(e){let o=e.state,i=this._hass,r=this._lang,s=e.lcd.main,n=o==="running"||o==="paused",l=(d,c)=>M(i,d,c,r),a="",p="";n&&s?.kind==="countdown"?(a=ht(s.value),p=e.endAt?`${this._t("row.ends")} ${z(e.endAt,i,r)}`:""):n&&e.progress.mode==="heat"&&e.temps.current!=null?(a=G(e.temps.current,e.temps.unit),p=e.temps.target!=null?`${this._t("lcd.heating")} \u2192 ${G(e.temps.target,e.temps.unit)}`:this._t("lcd.heating")):n?(a=e.program?l("program",e.program):this._t(`state.${o}`),p=e.phase?l("phase",e.phase):""):o==="scheduled"&&e.startAt?(a=z(e.startAt,i,r),p=this._t("row.starts")):o==="done"&&(a=this._t("state.done"),p=e.endAt?z(e.endAt,i,r):""),o==="paused"&&(p=[this._t("state.paused"),p].filter(Boolean).join(" \xB7 ")),this._el("bigtime").hidden=!a,this._set("bt",a),this._set("bs",p)}_icon(e,o,i,r,s){let n=`ic${e}`,l=`${o}|${i}|${r}|${s}`;if(this._text[n]===l)return;this._text[n]=l;let a=this._el(n);a.hidden=!s,a.className=`at icon ${i}${e===3?" tap":""}`,a.title=r,a.firstElementChild.setAttribute("icon",o)}_lcd(e,o){if(!e)return"";let i=this._hass,r=this._lang;switch(e.kind){case"dashes":return"--:--";case"blank":return"";case"countdown":return To(e.value);case"duration":return U(e.value);case"clock":return z(e.value,i,r);case"temp":return G(e.value,o.temps.unit);case"elapsed":return`${e.value} ${this._t("unit.min")}`;case"percent":return o.progress.value==null?"":`${Math.round(o.progress.value*100)}%`;case"program":return M(i,"program",e.value,this._lang);case"phase":return M(i,"phase",e.value,this._lang);case"text":return this._t(`lcd.${e.value}`)}return""}_rows(e,o,i){let r=this._hass,s=this._dev.family,n=e.state,l=this._specialRows(s,o);if(l)return this._showRows(l);let a=[[this._t("row.program"),e.program?$(M(r,"program",e.program,this._lang)):"\u2014"]];if(s.kind==="dryer"||s.kind==="washer_dryer"){let p=o.dryingStep,d=e.dryness?.reached,c=Ce.indexOf(p),h=Ce.indexOf(d),f=c>=0?`<span class="dots">${Ce.slice(0,c+1).map((_,m)=>`<i class="${m<=h?"on":""}${m===c?" target":""}" title="${$(M(r,"dryness",_,this._lang))}"></i>`).join("")}</span>`:"";a.push([this._t("row.dryness"),p?f+$(M(r,"dryness",p,this._lang)):"\u2014"])}else if(s.group==="laundry"){let p=[o.targetTemp!=null?G(o.targetTemp,e.temps.unit):null,o.spin?`${o.spin} ${this._t("unit.rpm")}`:null].filter(Boolean);a.push([this._t("row.temp"),p.length?p.join(" \xB7 "):"\u2014"])}else if(s.group==="oven"||s.group==="drawer"){let p=e.temps.unit,d=e.temps.current,c=e.temps.target,h=["running","paused","ready","scheduled"].includes(n),f=d!=null&&c!=null&&h?`${Math.round(d)} \u2192 ${G(c,p)}`:c!=null&&h?G(c,p):d!=null?G(d,p):"\u2014";a.push([this._t("row.temp"),f]),e.temps.core!=null&&h&&a.push([this._t("row.core"),e.temps.coreTarget!=null?`${Math.round(e.temps.core)} \u2192 ${G(e.temps.coreTarget,p)}`:G(e.temps.core,p)])}n==="ready"&&e.lcd.main?.kind==="duration"?a.push([this._t("row.duration"),U(e.lcd.main.value)]):n==="scheduled"&&e.startAt?a.push([this._t("row.starts"),z(e.startAt,r,i)]):e.endAt&&["running","paused","done","scheduled"].includes(n)?a.push([this._t(n==="done"?"row.ended":"row.ends"),z(e.endAt,r,i)]):(n==="running"||n==="paused")&&e.elapsedMin!=null&&a.push([this._t("row.elapsed"),`${e.elapsedMin} ${this._t("unit.min")}`]),this._showRows(a)}_showRows(e){for(e=e.slice(0,4);e.length<4;)e.push(["",""]);e.forEach(([o,i],r)=>{this._set(`k${r}`,o),this._setHTML(`v${r}`,i),this._el(`k${r}`).parentElement.hidden=!o})}_specialRows(e,o){let i=r=>r==null?"\u2014":this._t(r?"btn.on_state":"state.off");if(e.group==="hob"){let r=(o.plates??[]).map((s,n)=>[n+1,re(s)]).filter(([,s])=>s.level>0);return[[this._t("row.zones"),r.length?r.map(([s,n])=>`${s}: ${$(n.text)}`).join(" \xB7 "):this._t("state.off")]]}if(e.group==="hood"){let r=Le(o),s=[[this._t("row.fan"),r?this._t("pill.fan",{n:r}):this._t("state.off")],[this._t("row.light"),i(o.light)]];return o.ambient!=null&&s.push([this._t("row.ambient"),i(o.ambient)]),s}if(e.group==="cooling"){let r=this._vm?.temps?.unit,s=ft(o),n=o.thermo??[],l=s.map((a,p)=>{let d=n[p]?.target;return[e.kind==="wine"?this._t("row.zone",{n:p+1}):this._t((d??a)<0?"row.freezer":"row.fridge"),d!=null?`${Math.round(a)} \u2192 ${G(d,r)}`:G(a,r)]});return o.supercooling&&l.push([this._t("pill.supercool"),this._t("btn.on_state")]),o.superfreezing&&l.push([this._t("pill.superfreeze"),this._t("btn.on_state")]),l.length?l:[[this._t("row.temp"),"\u2014"]]}return e.group==="vacuum"?[[this._t("row.battery"),o.battery!=null?`${Math.round(o.battery)} %`:"\u2014"],[this._t("row.suction"),o.fanSpeed?$(o.fanSpeed.replace(/^./,r=>r.toUpperCase())):"\u2014"],[this._t("row.program"),this._vm?.program?$(M(this._hass,"program",this._vm.program,this._lang)):"\u2014"]]:null}_controls(e,o){let i=this._config.controls!==!1,r=e.controls??{},s=e.state,n=!!this._dev.roles.power&&o.power!=null,l={"b-pause":r.pause,"b-resume":r.resume,"b-start":r.start,"b-stop":r.stop,"b-power":n&&e.connection!=="lost"},a=!1;for(let[p,d]of Object.entries(l))this._el(p).hidden=!d,a||(a=!!d);this._set("b-power-t",this._t(s==="off"?"btn.on":"btn.off")),this._el("ctl").hidden=!i||!a,(!i||s==="offline")&&this._ask(null)}_ask(e){this._asking=e;let o=this._el("ask");if(o.hidden=!e,!e)return;let i=this._vm,r=this._inText,s=i&&["running","paused","scheduled"].includes(i.state);o.classList.toggle("start",e==="start"),this._set("ask-t",e==="start"?this._t("ask.start",{program:M(this._hass,"program",i?.program,this._lang)||"",name:r}):e==="off"?this._t(s?"ask.off_running":"ask.off",{name:r}):this._t("ask.stop",{name:r})),this._set("ask-yes",this._t(e==="start"?"btn.start":e==="off"?"btn.off":"btn.stop"))}async _power(e){this._powerErr=null,await this._call("switch",e?"turn_on":"turn_off",{entity_id:this._dev.roles.power})&&(this._powerErr={on:e,text:this._text.err})}async _call(e,o,i){this._set("err","");let r=await Ge(this._hass,e,o,i);return r&&this._set("err",this._t("err.send",{msg:r})),r}};var He=t=>String(t??"").normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase().trim().replace(/[^a-z0-9]+/g,"_").replace(/^_|_$/g,""),jo=t=>t.replace(/_/g,""),No={washer:["cottons","eco_40_60","minimum_iron","denim","woollens","quick_power_wash","freshen_up","drain_spin","down_duvets","cottons_hygiene"],dryer:["cottons","minimum_iron","warm_air","cottons_eco"],coffee:["long_coffee","herbal_tea","milk_foam"],steam_oven:["fan_plus","steam_cooking"],microwave:["microwave","quick_microwave","fan_plus","microwave_fan_plus"],drawer:["warm_cups_glasses","warm_dishes_plates","keep_warm","slow_roasting"]},Ro=t=>t?(Number(t.hours)||0)*60+(Number(t.minutes)||0):null;function he(t,e=[]){let o=new Map(e.map(i=>[jo(i),i]));return(t?.programs??[]).filter(i=>String(i.program??"").trim()).map(i=>{let r=i.parameters?.temperature,s=i.parameters?.duration;return{id:Number(i.program_id),name:String(i.program).trim(),key:o.get(jo(He(i.program)))??null,temp:r&&r.min!=null&&r.max!=null?{min:r.min,max:r.max,step:r.step||1}:null,dur:s&&s.max?{min:Math.max(1,Ro(s.min)??1),max:Ro(s.max)}:null}})}function Vo(t,e){let o=(e??[]).map(String);if(!t)return{favs:o.map(s=>({id:null,key:s,name:s,temp:null,dur:null})),rest:[]};let i=s=>t.find(n=>n.key===s||String(n.id)===s),r=o.map(i).filter((s,n,l)=>s&&l.indexOf(s)===n);return{favs:r,rest:t.filter(s=>!r.includes(s))}}function Bo(t,e,o,i){return!t||t.state==="offline"||t.connection==="lost"?"offline":e.group==="drawer"||i&&!i.length?"no_programs":["running","paused","scheduled"].includes(t.state)?"busy":o.mobile_start?t.flags?.mobileStart!==!0?t.state==="ready"&&t.program?"waiting":"mobile_start":i?null:"no_list":"no_remote"}function qo(t,e,o){return(t==="mobile_start"||t==="waiting")&&["oven","coffee"].includes(o.group)&&["standby","ready"].includes(e?.state)}var Ee=(t,e,o)=>Math.min(o,Math.max(e,t)),rr=(t,e)=>Ee(e.min+Math.round((t-e.min)/e.step)*e.step,e.min,e.max),gt=t=>/microwave/.test(t.key??He(t.name));function Po(t,e){let o=t.key??He(t.name),i=/sous_vide/.test(o)?60:/steam/.test(o)?100:/defrost/.test(o)?t.temp?.max:180,r=t.temp?rr(e?.temperature??i,t.temp):null,s=e?.minutes??(gt(t)?2:0);return t.dur&&s&&(s=Ee(s,t.dur.min,t.dur.max)),{temperature:r,minutes:t.dur?s:0}}function Fo(t,e,o,i){let r=i?0:o.min;if(e>0)return t===0?o.min:Ee(t+(t<10?1:t<60?5:15),r,o.max);let s=t<=o.min?0:t-(t<=10?1:t<=60?5:15);return Ee(s<o.min?i?0:o.min:s,r,o.max)}function Wo(t,e,o,i={}){if(e.group!=="oven")return["miele","set_program",{device_id:t,program_id:o.id}];let r={device_id:t,program_id:o.id};return o.temp&&i.temperature!=null&&(r.temperature=i.temperature),o.dur&&i.minutes>0&&(r.duration={hours:Math.floor(i.minutes/60),minutes:i.minutes%60}),["miele","set_program_oven",r]}var Ko=t=>`miele-programmes:${t}`;function ze(t,e){try{let o=JSON.parse(t?.getItem(Ko(e))??"null");return o&&Array.isArray(o.programs)?o:null}catch{return null}}function Zo(t,e,o,i){try{t?.setItem(Ko(e),JSON.stringify({at:i,programs:o?.programs??[]}))}catch{}}var Uo=(t,e)=>`miele-programmes:${t}:last:${e}`;function Yo(t,e,o){try{return JSON.parse(t?.getItem(Uo(e,o))??"null")}catch{return null}}function Jo(t,e,o,i){try{t?.setItem(Uo(e,o),JSON.stringify(i))}catch{}}var sr=[[/tea/,"mdi:tea"],[/hot_water|very_hot_water/,"mdi:cup-water"],[/milk/,"mdi:cup-outline"],[/ristretto|espresso|coffee|cappuccino|latte|caffe|cafe|americano|black$|flat_white|macchiato/,"mdi:coffee"],[/microwave/,"mdi:microwave"],[/sous_vide/,"mdi:thermometer-water"],[/steam/,"mdi:pot-steam-outline"],[/defrost/,"mdi:snowflake-melt"],[/grill/,"mdi:grill-outline"],[/roast/,"mdi:food-drumstick-outline"],[/fan_plus|fan_heat/,"mdi:fan"],[/heat|bake|cake/,"mdi:heating-coil"],[/cups|glasses/,"mdi:cup-outline"],[/dishes|plates/,"mdi:circle-double"],[/keep_warm/,"mdi:heat-wave"],[/eco/,"mdi:leaf"],[/hygiene/,"mdi:shield-check-outline"],[/cotton/,"mdi:tshirt-crew-outline"],[/minimum_iron|shirts|smoothing/,"mdi:hanger"],[/wool/,"mdi:sheep"],[/silk|delicate/,"mdi:feather"],[/denim|jeans/,"mdi:hanger"],[/quick|express/,"mdi:lightning-bolt-outline"],[/freshen|warm_air/,"mdi:weather-windy"],[/cool_air/,"mdi:snowflake"],[/drain|spin/,"mdi:rotate-right"],[/rinse/,"mdi:water-outline"],[/duvet|pillow|bed/,"mdi:bed-outline"],[/sport|outdoor/,"mdi:run"],[/towel/,"mdi:rug"],[/automatic/,"mdi:autorenew"]];function mt(t,e){let o=t.key??He(t.name);return sr.find(([i])=>i.test(o))?.[1]??{laundry:"mdi:washing-machine",oven:"mdi:stove",coffee:"mdi:coffee-maker-outline",drawer:"mdi:tray"}[e]??"mdi:play-circle-outline"}var nr=6*36e5,ar=10*6e4,D=t=>String(t??"").replace(/[&<>"]/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"})[e]),De=()=>{try{return globalThis.localStorage??null}catch{return null}},Xo=(t,e)=>t<60?`${t} min`:`${U(t*60)} ${e==="nl"?"u":"h"}`,ut=new Map,lr=`
.why { display: flex; gap: 8px; align-items: flex-start; margin: 0 0 10px; padding: 9px 11px; border-radius: 12px;
  font-size: 13.5px; line-height: 1.35; background: var(--mc-btn); color: var(--mc-muted); }
.why ha-icon { --mdc-icon-size: 18px; flex: none; margin-top: 1px; }
.why:empty { display: none; }
.remote-on .pill { background: color-mix(in srgb, var(--c) 18%, transparent); color: var(--c); }
/* two columns on a phone: room for "Kreukherstellend" and "QuickPowerWash" without breaking them */
.tiles { display: grid; grid-template-columns: repeat(auto-fill, minmax(136px, 1fr)); gap: 8px; }
.tile { position: relative; display: flex; flex-direction: column; align-items: flex-start; justify-content: space-between; gap: 8px;
  min-height: 72px; padding: 10px 12px; text-align: left; font: 600 13.5px/1.25 inherit; font-family: inherit; color: var(--mc-fg);
  background: var(--mc-btn); border: 1px solid var(--mc-line); border-radius: 14px; cursor: pointer;
  -webkit-tap-highlight-color: transparent; touch-action: manipulation; }
.tile ha-icon { --mdc-icon-size: 22px; color: var(--c); }
.tile span { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; overflow-wrap: anywhere;
  -webkit-hyphens: auto; hyphens: auto; }
.tile:active { background: color-mix(in srgb, var(--c) 22%, var(--mc-btn)); }
.tile.sel { border-color: var(--c); background: color-mix(in srgb, var(--c) 16%, var(--mc-btn)); }
.tile.now { border-color: color-mix(in srgb, var(--c) 60%, transparent); }
.tile.now::after { content: ""; position: absolute; top: 11px; right: 11px; width: 8px; height: 8px; border-radius: 50%; background: var(--c); }
.tile:disabled { cursor: default; opacity: .45; }
.tile.now:disabled { opacity: 1; }
.tile:disabled:active { background: var(--mc-btn); }
.more { display: flex; align-items: center; gap: 4px; margin: 10px 0 0; padding: 6px 2px; font: 600 13.5px/1 inherit; font-family: inherit;
  color: var(--mc-muted); background: none; border: 0; cursor: pointer; }
.more ha-icon { --mdc-icon-size: 18px; }
#rest { margin-top: 8px; }
.sheet { margin: 0 0 12px; padding: 12px; border-radius: 14px; background: var(--mc-panel); color: var(--mc-panel-fg);
  border: 1px solid color-mix(in srgb, var(--c) 50%, transparent); }
.sh-t { display: flex; align-items: center; gap: 8px; font-weight: 600; font-size: 16px; }
.sh-t ha-icon { --mdc-icon-size: 22px; color: var(--c); }
.field { display: grid; grid-template-columns: 1fr auto; align-items: center; gap: 6px 10px; margin-top: 12px; font-size: 13.5px; }
.field .k { color: var(--mc-muted); }
.field .v { font-weight: 600; font-size: 17px; font-variant-numeric: tabular-nums; }
.field input[type=range] { grid-column: 1 / -1; width: 100%; margin: 2px 0 0; accent-color: var(--c); }
.step { display: inline-flex; align-items: center; gap: 10px; }
.step button { width: 38px; height: 38px; display: inline-flex; align-items: center; justify-content: center; padding: 0;
  color: var(--mc-fg); background: var(--mc-btn); border: 1px solid var(--mc-line); border-radius: 50%; cursor: pointer;
  -webkit-tap-highlight-color: transparent; touch-action: manipulation; }
.step button ha-icon { --mdc-icon-size: 18px; }
.step .v { min-width: 4.2em; text-align: center; }
.step .v small { display: block; font-weight: 400; font-size: 11.5px; color: var(--mc-muted); }
.q { margin: 14px 0 0; font-size: 13.5px; line-height: 1.35; }
.acts { display: flex; flex-wrap: wrap; justify-content: flex-end; gap: 8px; margin-top: 10px; }
.acts button { display: inline-flex; align-items: center; gap: 6px; min-height: 40px; padding: 0 16px; font: 600 14px/1 inherit; font-family: inherit;
  color: var(--mc-fg); background: var(--mc-btn); border: 1px solid var(--mc-line); border-radius: 999px; cursor: pointer;
  -webkit-tap-highlight-color: transparent; touch-action: manipulation; }
.acts .go { background: var(--c); border-color: transparent; color: #fff; }
.acts .go:disabled { opacity: .45; cursor: default; }
.acts button ha-icon { --mdc-icon-size: 18px; }
.ok { font-size: 13px; color: var(--ok); margin: 0 0 10px; }
.ok:empty { display: none; }
.src { margin: 10px 0 0; font-size: 12px; color: var(--mc-muted); }
.src:empty { display: none; }
.err { margin: 0 0 10px; }
.fold .head { margin: 0; cursor: pointer; -webkit-tap-highlight-color: transparent; }
.fold .head .name { font-size: 15px; flex: 1 1 auto; min-width: 0; }
.fold .head .pill { max-width: 46%; }
.fold .head ha-icon { --mdc-icon-size: 20px; color: var(--mc-muted); flex: none; }
.fold:not(.open) > :not(.head) { display: none; }
.fold.open .head { margin-bottom: 10px; }
`,Oe=class extends HTMLElement{static getConfigElement(){return document.createElement("miele-programmes-card-editor")}static getStubConfig(e){let o=A(e).find(i=>i.family.group!=="drawer")??A(e)[0];return o?{device_id:o.id}:{}}setConfig(e){if(!e)throw new Error("Invalid configuration");this._config={theme:"dark",show_all:!0,...e},this._dev=null,this._hass&&this._init()}set hass(e){let o=!this._hass;if(this._hass=e,this._dev||this._init(),!this._dev)return;let i=Object.values(this._dev.roles);(o||i.some(r=>e.states[r]!==this._seen?.[r]))&&(this._seen=Object.fromEntries(i.map(r=>[r,e.states[r]])),this._update())}connectedCallback(){this._hass&&!this._dev&&this._init()}getCardSize(){return this._config?.collapsed?1:6}getGridOptions(){return{columns:12,min_columns:4,rows:"auto"}}get _lang(){return Q(this._hass,this._config)}_t(e,o){return k(this._lang,e,o)}_init(){if(!this._config||!this._hass)return;let e=this._config,o=this._hass,i=e.device_id||(e.entity?o.entities?.[e.entity]?.device_id:null)||A(o)[0]?.id,r=i?W(o,i,{overrides:e.entities}):null;if(!r||!r.roles.status){this._dev=null,this._buildEmpty();return}this._dev=r,this._tracker=new P(r.family),this._seen=null,this._pick=null,this._showAll=!1,this._open=!this._config.collapsed,this._sig=null,o.loadBackendTranslation?.("entity","miele")?.then?.(()=>{this._sig=null,this._update()}),this._build(),this._update()}_themeName(){let e=this._config.theme;return e==="auto"?this._hass?.themes?.darkMode?"dark":"light":["dark","light","ha"].includes(e)?e:"dark"}_buildEmpty(){let e=this.shadowRoot??this.attachShadow({mode:"open"});e.innerHTML=`<style>${Se}</style><ha-card class="theme-${this._themeName()}"><div class="err">${D(this._t(J(this._hass)?"err.old_integration":"err.no_device"))}</div></ha-card>`}_build(){let e=this._config,o=this._dev.family,i=e.accent||te[o.drawing]||te.generic;this._name=e.name||this._hass.devices?.[this._dev.id]?.name_by_user||this._t(`kind.${o.kind}`),this._inText=e.name||this._hass.devices?.[this._dev.id]?.name_by_user?this._name:this._name.toLowerCase();let r=this.shadowRoot??this.attachShadow({mode:"open"});r.innerHTML=`<style>${Se}${lr}</style>
<ha-card class="prog theme-${this._themeName()}${e.collapsed?" fold":""}" lang="${D(this._lang)}" style="--c:${D(i)}">
  <div class="head" id="head"><span class="name">${D(e.collapsed?e.show_name?`${this._t("prog.title")} \xB7 ${this._name}`:this._t("prog.title"):this._name)}</span><span class="pill" id="pill"></span>${e.collapsed?'<ha-icon id="fold" icon="mdi:chevron-down"></ha-icon>':""}</div>
  <div class="why" id="why"></div>
  <div class="ok" id="ok"></div>
  <div class="err" id="err"></div>
  <div class="sheet" id="sheet" hidden>
    <div class="sh-t"><ha-icon id="sh-i"></ha-icon><span id="sh-n"></span></div>
    <div class="field" id="f-temp"><span class="k">${D(this._t("prog.temp"))}</span><span class="v" id="temp-v"></span>
      <input type="range" id="temp" aria-label="${D(this._t("prog.temp"))}"></div>
    <div class="field" id="f-time"><span class="k">${D(this._t("prog.time"))}</span>
      <span class="step"><button id="time-dn" aria-label="\u2212"><ha-icon icon="mdi:minus"></ha-icon></button><span class="v" id="time-v"></span>
      <button id="time-up" aria-label="+"><ha-icon icon="mdi:plus"></ha-icon></button></span></div>
    <div class="q" id="q"></div>
    <div class="acts"><button id="no">${D(this._t("btn.cancel"))}</button>
      <button class="go" id="go"><ha-icon id="go-i" icon="mdi:play"></ha-icon><span id="go-t"></span></button></div>
  </div>
  <div class="tiles" id="favs"></div>
  <button class="more" id="more" hidden><ha-icon icon="mdi:chevron-down"></ha-icon><span id="more-t"></span></button>
  <div class="tiles" id="rest" hidden></div>
  <div class="src" id="src"></div>
</ha-card>`,this._root=r.querySelector("ha-card"),this._el=n=>r.getElementById(n),this._text={};let s=n=>{let l=n.target.closest(".tile");l&&!l.disabled&&this._choose(this._tiles[Number(l.dataset.i)])};this._el("favs").onclick=s,e.collapsed&&(this._el("head").onclick=()=>{this._open=!this._open,this._root.classList.toggle("open",this._open),this._el("fold").setAttribute("icon",this._open?"mdi:chevron-up":"mdi:chevron-down"),this._open||this._choose(null)}),this._el("rest").onclick=s,this._el("more").onclick=()=>{this._showAll=!this._showAll,this._update()},this._el("no").onclick=()=>this._choose(null),this._el("go").onclick=()=>this._start(),this._el("temp").oninput=n=>{this._values.temperature=Number(n.target.value),this._sheet()},this._el("time-dn").onclick=()=>this._stepTime(-1),this._el("time-up").onclick=()=>this._stepTime(1)}_set(e,o){if(this._text[e]===o)return;this._text[e]=o;let i=this._el(e);i&&(i.textContent=o)}_setHTML(e,o){if(this._text[e]===o)return;this._text[e]=o;let i=this._el(e);i&&(i.innerHTML=o)}_options(){let e=this._hass.states[this._dev.roles.program];return Array.isArray(e?.attributes?.options)?e.attributes.options:[]}_load(e){let o=this._dev,i=o.id,r=ut.get(i)??{},s=e.flags?.mobileStart===!0,n=s&&this._ms===!1;if(this._ms=s,o.family.group==="drawer"||r.pending)return;let l=j();r.at&&l-r.at<nr&&!n||r.failedAt&&l-r.failedAt<ar&&!n||o.family.group==="laundry"&&!s||(r.pending=this._hass.callService("miele","get_programs",{device_id:i},void 0,!1,!0).then(a=>{r.at=j(),r.response=a?.response??{programs:[]},r.error=null,Zo(De(),i,r.response,r.at)}).catch(async a=>{r.failedAt=j(),r.error=await pt(this._hass,a)}).finally(()=>{r.pending=null,this._sig=null,this._update()}),ut.set(i,r))}_list(){if(this._dev.family.group==="drawer")return{list:[],cachedAt:null,error:null};let e=ut.get(this._dev.id),o=this._options();if(e?.response)return{list:he(e.response,o),cachedAt:null,error:null};let i=ze(De(),this._dev.id);return{list:i?he(i,o):null,cachedAt:i?.at??null,error:e?.error??null}}_label(e){return e.key?M(this._hass,"program",e.key,this._lang):e.name.replace(/^./,o=>o.toUpperCase())}_update(){if(!this._dev||!this._root||!this._hass)return;let e=this._hass,o=this._dev,i=o.family,r=this._lang,s=this._vm=this._tracker.update(X(e,o.roles),j());this._load(s);let{list:n,cachedAt:l,error:a}=this._list(),p=this._config.programs??No[i.drawing]??[],{favs:d,rest:c}=Vo(n,p),h=this._block=Bo(s,i,o.roles,n),f=this._mode=h?qo(h,s,i)?"prepare":null:"start",_=this._inText,m=s.flags?.mobileStart===!0;this._root.classList.toggle("remote-on",m),this._set("pill",o.roles.mobile_start?this._t(m?"prog.remote_on":"prog.remote_off"):this._t(`state.${s.state}`)),this._setHTML("why",h?`<ha-icon icon="${h==="busy"?"mdi:progress-clock":"mdi:information-outline"}"></ha-icon><span>${D(this._t(`prog.why.${f==="prepare"&&h==="mobile_start"?"prepare":h}`,{name:_,program:M(e,"program",s.program,r)}))}</span>`:""),this._set("err",this._startErr||(a&&m&&!n?this._t("err.send",{msg:a}):"")),this._set("src",l?this._t("prog.cached",{when:`${new Date(l).toLocaleDateString(r)} ${z(l,e,r)}`}):"");let y=this._config.show_all!==!1&&c.length>0,b=y&&(this._showAll||!d.length)?[...d,...c]:d,x=JSON.stringify([b.map(u=>[u.id,u.key,u.name]),d.length,r]);if(x!==this._sig){this._sig=x,this._tiles=b;let u=(v,C)=>`<button class="tile" data-i="${C}"><ha-icon icon="${mt(v,i.group)}"></ha-icon><span>${D(this._label(v))}</span></button>`;this._el("favs").innerHTML=b.slice(0,d.length||b.length).map(u).join(""),this._el("rest").innerHTML=d.length?b.slice(d.length).map((v,C)=>u(v,C+d.length)).join(""):""}this._el("rest").hidden=!d.length||!this._showAll,this._el("more").hidden=!y||!d.length,this._set("more-t",this._t(this._showAll?"prog.fewer":"prog.all",{n:c.length})),this._el("more").firstElementChild.setAttribute("icon",this._showAll?"mdi:chevron-up":"mdi:chevron-down");let g=s.state==="running"||s.state==="paused";this._root.querySelectorAll(".tile").forEach(u=>{let v=this._tiles[Number(u.dataset.i)];u.disabled=!f||v.id==null,u.classList.toggle("now",(g||s.state==="ready")&&!!v.key&&v.key===s.program),u.classList.toggle("sel",v===this._pick)}),this._pick&&(!f||!this._tiles.includes(this._pick))?this._choose(null):this._pick&&this._sheet()}_choose(e){if(this._pick=e,this._set("ok",""),this._startErr&&(this._startErr="",this._set("err","")),e){let i=Yo(De(),this._dev.id,e.id);this._values=Po(e,i)}if(this._root.querySelectorAll(".tile").forEach(i=>i.classList.toggle("sel",this._tiles[Number(i.dataset.i)]===e)),this._el("sheet").hidden=!e,!e)return;let o=this._el("temp");e.temp&&Object.assign(o,{min:e.temp.min,max:e.temp.max,step:e.temp.step,value:this._values.temperature}),this._sheet(),this._el("sheet").scrollIntoView?.({block:"nearest",behavior:"smooth"})}_stepTime(e){let o=this._pick;o?.dur&&(this._values.minutes=Fo(this._values.minutes,e,o.dur,!gt(o)),this._sheet())}_sheet(){let e=this._pick,o=this._values,i=this._dev.family.group==="oven",r=this._vm?.temps?.unit,s=this._label(e);this._el("sh-i").setAttribute("icon",mt(e,this._dev.family.group)),this._set("sh-n",s);let n=i&&e.temp&&e.temp.max>e.temp.min;this._el("f-temp").hidden=!i||!e.temp,this._el("temp").hidden=!n,e.temp&&this._set("temp-v",G(o.temperature,r)),this._el("f-time").hidden=!i||!e.dur;let l=!o.minutes;this._setHTML("time-v",l?`${D(this._t("prog.none"))}<small>${D(this._t("prog.until_stop"))}</small>`:D(Xo(o.minutes,this._lang)));let a=[s,i&&e.temp?G(o.temperature,r):null,i&&e.dur&&o.minutes?Xo(o.minutes,this._lang):null].filter(Boolean).join(" \xB7 "),p=this._inText,d=this._mode==="prepare";this._set("q",this._t(d?"prog.ask_prepare":"prog.ask",{what:a,name:p})),this._set("go-t",this._t(d?"prog.prepare":"prog.start")),this._el("go-i").setAttribute("icon",d?"mdi:tray-arrow-down":"mdi:play"),this._el("go").disabled=!this._mode||this._starting===!0}async _start(){let e=this._pick,o=this._dev,i=this._mode;if(!e||!i||this._starting)return;this._starting=!0,this._el("go").disabled=!0,this._startErr="",this._set("err","");let[r,s,n]=Wo(o.id,o.family,e,this._values),l=await Ge(this._hass,r,s,n);if(this._starting=!1,l){this._startErr=this._t("err.send",{msg:l}),this._set("err",this._startErr),this._el("go").disabled=!this._mode;return}o.family.group==="oven"&&Jo(De(),o.id,e.id,this._values);let a=this._label(e);this._choose(null);let p=this._inText;this._set("ok",this._t(i==="prepare"?"prog.prepared":"prog.started",{program:a,name:p}))}};var wt=["rooms","grid","active","phone","display"],Qo={oven:0,steam_oven:1,steam_oven_combi:1,dialog_oven:2,steam_oven_micro:3,oven_microwave:3,microwave:4,drawer:9,washer:10,washer_dryer:11,dryer:12,dishwasher:13,coffee:14},cr={running:0,paused:0,scheduled:1,ready:1,done:2,interrupted:2,error:2,standby:3,off:4,offline:5},ei={laundry:"280px",oven:"400px",coffee:"300px",drawer:"400px",other:"320px"},_t=t=>t.roles.status,yt=t=>["laundry","oven","coffee"].includes(t.family.group);function xt(t){return[...t].sort((e,o)=>String(e.areaId??"~").localeCompare(String(o.areaId??"~"))||(Qo[e.family.kind]??20)-(Qo[o.family.kind]??20)||e.name.localeCompare(o.name)).map(e=>({entity:_t(e),programmes:yt(e)}))}function vt(t,e,o,{all:i=!1}={}){let r=new Map(t.flatMap(a=>Object.values(a.roles).map(p=>[p,a]))),s=new Map(t.map(a=>[a.id,a])),n=new Set,l=[];for(let a of e.appliances??[]){let p=a.device_id&&s.get(a.device_id)||r.get(a.entity)||a.entity&&s.get(o?.entities?.[a.entity]?.device_id);!p||n.has(p.id)||(n.add(p.id),l.push({dev:p,opts:a}))}for(let a of xt(t.filter(p=>!n.has(p.id))))l.push({dev:r.get(a.entity),opts:{...a,auto:!0}});return i?l:l.filter(a=>a.opts.show!==!1)}var dr=t=>t&&t!=="off"&&t!=="offline";function pr(t,e,o,i){let r={};for(let a of["theme","language","accent","animations"])i[a]!=null&&(r[a]=i[a]);for(let a of["name","finish","accent","design"])e[a]!=null&&(r[a]=e[a]);let s=_t(t),n={type:"custom:miele-appliance-card",entity:s,...r};o==="phone"&&(n.max_width="250px"),o==="display"&&Object.assign(n,{controls:!1,animations:"reduced",big_countdown:!0,max_width:ei[t.family.group]??ei.other});let l=null;if(o!=="display"&&(e.programmes??yt(t))&&yt(t)){l={type:"custom:miele-programmes-card",entity:s,collapsed:!0};for(let a of["theme","language","accent","name"])r[a]!=null&&(l[a]=r[a]);e.programs?.length&&(l.programs=e.programs)}return{appliance:n,programmes:l}}function Te(t,e={},o={},{areas:i={},hass:r}={}){let s=wt.includes(e.layout)?e.layout:"rooms",n=vt(t,e,r),l=c=>cr[o[c.dev.id]]??4;(s==="active"||s==="display")&&(n=n.filter(c=>dr(o[c.dev.id]))),(s==="active"||s==="phone"||s==="display")&&(n=[...n].sort((c,h)=>l(c)-l(h)));let a=(c,h)=>{let f={dev:c.dev,entity:_t(c.dev),...pr(c.dev,c.opts,s,e)};return h&&f.programmes&&(f.programmes.show_name=!0),f};if(s!=="rooms")return{preset:s,blocks:n.length?[{title:null,kind:s==="phone"?"column":"grid",items:n.map(c=>a(c))}]:[],quiet:!n.length};let p=new Map;for(let c of n){let h=c.dev.areaId??`~${c.dev.family.group==="laundry"?"laundry":"kitchen"}`;p.has(h)||p.set(h,[]),p.get(h).push(c)}let d=[];for(let[c,h]of p){let f=i[c]?.name??(c.startsWith("~")?null:c),_=h.filter(b=>b.dev.family.builtIn),m=h.filter(b=>!b.dev.family.builtIn),y=[];_.length&&y.push({kind:"column",items:_.map(b=>a(b,!0))}),m.length&&y.push({kind:"row",items:m.map(b=>a(b))}),d.push({title:f,key:c,kind:"room",parts:y})}return{preset:s,blocks:d,quiet:!n.length}}function ti(t){let e=o=>o.parts?o.parts.flatMap(i=>i.items):o.items;return t.blocks.map(o=>({type:"grid",cards:[...o.title?[{type:"heading",heading:o.title}]:[],...e(o).flatMap(i=>[i.appliance,...i.programmes?[i.programmes]:[]])]}))}var Ie=t=>String(t??"").replace(/[&<>"]/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"})[e]),hr=`
:host { display: block; }
.ov { container-type: inline-size; color: var(--primary-text-color, inherit);
  font-family: var(--ha-font-family-body, Roboto, system-ui, -apple-system, "Segoe UI", sans-serif); }
.blocks { display: flex; flex-wrap: wrap; gap: 20px 24px; align-items: flex-start; }
/* a room is no wider than its appliances side by side (--n), so rooms sit together on a wide screen */
.room { flex: 1 1 320px; min-width: 0; max-width: calc(var(--n, 2) * 460px + (var(--n, 2) - 1) * 12px); }
.set { flex: 1 1 100%; min-width: 0; }
.set .part { flex: 1 1 100%; }
.room h2 { margin: 0 0 10px 2px; font-size: 18px; font-weight: 500; line-height: 1.3; }
.parts { display: flex; flex-wrap: wrap; gap: 12px; align-items: flex-start; }
.part { min-width: 0; }
.part.row { flex: 2 1 300px; display: flex; flex-wrap: wrap; gap: 12px; align-items: flex-start; }
.part.row > .item { flex: 1 1 300px; max-width: 460px; min-width: min(100%, 280px); }
/* a built-in wall: the appliances close together, their programmes under the column */
.part.column { flex: 1 1 320px; max-width: 460px; display: flex; flex-direction: column; gap: 6px; }
.part.column .progs { display: flex; flex-direction: column; gap: 6px; margin-top: 6px; }
.part.grid { flex: 1 1 100%; display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 300px), 1fr)); gap: 12px; align-items: start; }
.preset-phone .part.column { max-width: none; gap: 12px; }
.preset-display .part.grid { grid-template-columns: repeat(auto-fit, minmax(min(100%, 300px), 1fr)); }
.item { display: flex; flex-direction: column; gap: 6px; min-width: 0; }
.quiet { display: flex; flex-direction: column; align-items: center; gap: 10px; padding: 32px 16px; text-align: center;
  border-radius: var(--ha-card-border-radius, 16px); background: var(--ha-card-background, var(--card-background-color, #232528)); }
.quiet .clock { font-size: 72px; font-weight: 300; line-height: 1; font-variant-numeric: tabular-nums; }
.quiet .msg { font-size: 16px; color: var(--secondary-text-color, #9ca1a7); }
.quiet .chips { display: flex; flex-wrap: wrap; justify-content: center; gap: 6px; margin-top: 4px; }
.quiet .chips span { font-size: 13px; padding: 4px 10px; border-radius: 999px; background: var(--secondary-background-color, #33363a);
  color: var(--secondary-text-color, #9ca1a7); }
.empty { padding: 16px; color: var(--secondary-text-color, #9ca1a7); }
[hidden] { display: none !important; }
`,je=class extends HTMLElement{static getStubConfig(){return{layout:"rooms"}}static getConfigElement(){return document.createElement("miele-overview-card-editor")}setConfig(e){if(!e)throw new Error("Invalid configuration");this._config={layout:"rooms",...e},this._sig=null,this._hass&&this._update()}set hass(e){let o=!this._hass;this._hass=e,(o||e.entities!==this._entities||e.devices!==this._devicesRef)&&(this._entities=e.entities,this._devicesRef=e.devices,this._devices=A(e),this._trackers=new Map(this._devices.map(i=>[i.id,this._trackers?.get(i.id)??new P(i.family)]))),this._update();for(let i of this._cards?.values()??[])i.hass=e}connectedCallback(){clearInterval(this._tick),this._tick=setInterval(()=>this._update(),3e4)}disconnectedCallback(){clearInterval(this._tick)}getCardSize(){return 12}getGridOptions(){return{columns:"full",rows:"auto"}}get _lang(){return Q(this._hass,this._config)}_states(){let e={};for(let o of this._devices)e[o.id]=this._trackers.get(o.id).update(X(this._hass,o.roles),j()).state;return e}_update(){if(!this._config||!this._hass||!this._devices)return;let e=this._plan=Te(this._devices,this._config,this._states(),{areas:this._hass.areas,hass:this._hass}),o=JSON.stringify([e.preset,e.quiet,e.blocks.map(i=>[i.title,(i.parts??[i]).map(r=>[r.kind,r.items.map(s=>[s.appliance,s.programmes])])])]);o!==this._sig&&(this._sig=o,this._render(e)),e.quiet&&this._quiet()}_card(e){let o=JSON.stringify(e),i=this._cards.get(o);return i||(i=document.createElement(e.type.replace(/^custom:/,"")),i.setConfig(e),i.hass=this._hass,this._cards.set(o,i)),this._used.add(o),i}_render(e){let o=this.shadowRoot??this.attachShadow({mode:"open"});this._cards??(this._cards=new Map),this._used=new Set;let i=document.createElement("div");if(i.className=`ov preset-${e.preset}`,!this._devices.length)i.innerHTML=`<div class="empty">${Ie(k(this._lang,J(this._hass)?"err.old_integration":"err.no_device"))}</div>`;else if(e.quiet)i.innerHTML=`<div class="quiet"><div class="clock" id="clock"${e.preset==="display"?"":" hidden"}></div>
        <div class="msg">${Ie(k(this._lang,"ov.all_off"))}</div><div class="chips" id="chips"></div></div>`;else{let r=document.createElement("div");r.className="blocks";for(let s of e.blocks){let n=document.createElement("section");n.className=s.kind==="room"?"room":"set",s.parts&&n.style.setProperty("--n",s.parts.reduce((a,p)=>a+(p.kind==="column"?1:p.items.length),0)),s.title&&(n.innerHTML=`<h2>${Ie(s.title)}</h2>`);let l=document.createElement("div");l.className="parts";for(let a of s.parts??[s]){let p=document.createElement("div");p.className=`part ${a.kind}`;let d=s.kind==="room"&&a.kind==="column",c=document.createElement("div");c.className="progs";for(let h of a.items){let f=document.createElement("div");f.className="item",f.append(this._card(h.appliance)),h.programmes&&(d?c:f).append(this._card(h.programmes)),p.append(f)}d&&c.childElementCount&&p.append(c),l.append(p)}n.append(l),r.append(n)}i.append(r)}for(let r of[...this._cards.keys()])this._used.has(r)||this._cards.delete(r);o.firstChild||(o.innerHTML=`<style>${hr}</style>`),o.querySelector(".ov")?.remove(),o.append(i)}_quiet(){let e=this.shadowRoot,o=this._lang,i=e?.getElementById("clock"),r=e?.getElementById("chips");i&&(i.textContent=z(j(),this._hass,o)),r&&(r.innerHTML=this._devices.map(s=>`<span>${Ie(this._hass.devices?.[s.id]?.name_by_user||k(o,`kind.${s.family.kind}`))}</span>`).join(""))}};async function bt(){if(!customElements.get("ha-form")){try{await(await(await window.loadCardHelpers?.())?.createCardElement({type:"entities",entities:[]}))?.constructor?.getConfigElement?.()}catch{}await Promise.race([customElements.whenDefined("ha-form"),new Promise(t=>setTimeout(t,4e3))])}}var kt=(t,e)=>t.dispatchEvent(new CustomEvent("config-changed",{detail:{config:e},bubbles:!0,composed:!0}));function Re(t,e={}){return Object.fromEntries(Object.entries(t).filter(([o,i])=>i!=null&&i!==""&&!(Array.isArray(i)&&!i.length)&&!(o in e&&e[o]===i)))}function fr(t,e){let o=e.device_id||t?.entities?.[e.entity]?.device_id;return o?W(t,o):A(t??{})[0]??null}var q=(t,e)=>({value:t,label:e}),oe=t=>({entity:{entity:{filter:{integration:"miele",domain:"sensor"}}},finish:{select:{mode:"dropdown",custom_value:!0,options:Object.keys(pe).map(e=>q(e,k(t,`ed.finish.${e}`)))}},drawing:{select:{mode:"dropdown",options:Object.keys(T).map(e=>q(e,k(t,`ed.drawing.${e}`)))}},theme:{select:{mode:"dropdown",options:["dark","light","auto","ha"].map(e=>q(e,k(t,`ed.theme.${e}`)))}},animations:{select:{mode:"dropdown",options:["full","reduced","off"].map(e=>q(e,k(t,`ed.anim.${e}`)))}},language:{select:{mode:"dropdown",options:[q("nl","Nederlands"),q("en","English")]}},text:{text:{}},design:e=>({select:{mode:"dropdown",options:(T[e]?.designs??[]).map(o=>q(o,k(t,`ed.design.${o}`)))}}),boolean:{boolean:{}}});function Ne(t,e,o){if(!e)return[];let i=t.states?.[e.roles.program]?.attributes?.options??[],r=null;try{r=ze(globalThis.localStorage,e.id)}catch{}return(r?he(r,i).map(n=>q(n.key??String(n.id),n.key?M(t,"program",n.key,o):n.name)):i.filter(n=>n!=="no_program").map(n=>q(n,M(t,"program",n,o)))).sort((n,l)=>n.label.localeCompare(l.label,o))}var gr=`
:host { display: block; }
.info { margin: 0 0 12px; padding: 10px 12px; border-radius: 10px; font-size: 13px; line-height: 1.4;
  background: var(--secondary-background-color, #f2f2f2); color: var(--secondary-text-color, #555); }
.info b { color: var(--primary-text-color, #222); font-weight: 600; }
.info:empty { display: none; }
`,fe=class extends HTMLElement{setConfig(e){this._config={...e},this._render()}set hass(e){this._hass=e,this._render()}_t(e,o){return k(this._lang,e,o)}get _lang(){return String(this._config?.language||this._hass?.locale?.language||this._hass?.language||"en").slice(0,2)==="nl"?"nl":"en"}async connectedCallback(){await bt(),this._ready=!0,this._render()}_render(){if(!this._ready||!this._config||!this._hass)return;let e=this.shadowRoot??this.attachShadow({mode:"open"});this._form||(e.innerHTML=`<style>${gr}</style><div class="info" id="info"></div>`,this._form=document.createElement("ha-form"),this._form.computeLabel=i=>k(this._lang,`ed.f.${i.name}`),this._form.computeHelper=i=>{let r=k(this._lang,`ed.h.${i.name}`);return r===`ed.h.${i.name}`?void 0:r},this._form.addEventListener("value-changed",i=>{i.stopPropagation();let r={...this._config,...i.detail.value};r.entity&&delete r.device_id,this._config=Re(r,this.defaults),kt(this,this._config)}),e.append(this._form));let o=fr(this._hass,this._config);this._form.hass=this._hass,this._form.schema=this.schema(o),this._form.data={...this.defaults,entity:o?.roles.status,...this._config},e.getElementById("info").innerHTML=this.info(o)}info(e){if(!e)return k(this._lang,"err.no_device");let o=i=>String(i??"").replace(/[&<>"]/g,r=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"})[r]);return k(this._lang,"ed.found",{model:`<b>${o(e.modelId??e.model??"?")}</b>`,kind:o(k(this._lang,`kind.${e.family.kind}`)),drawing:`<b>${o(k(this._lang,`ed.drawing.${this._config.drawing||e.family.drawing}`))}${this._designHint(e)}</b>`})}_designHint(e){let o=this._config.drawing||e.family.drawing,i=$e(o,this._config.design,this._hass.devices?.[e.id]?.model_id??e.modelId);return i?`, ${k(this._lang,`ed.design.${i}`)}`:""}};var mr=(t,e)=>T[t.drawing||e?.family.drawing]?.designs??[],Ve=class extends fe{get defaults(){return{theme:"dark",animations:"full",controls:!0,big_countdown:!1}}schema(e){let o=oe(this._lang);return[{name:"entity",required:!0,selector:o.entity},{name:"name",selector:o.text},{type:"grid",name:"",schema:[{name:"finish",selector:o.finish},{name:"drawing",selector:o.drawing}]},...mr(this._config,e).length>1?[{name:"design",selector:o.design(this._config.drawing||e?.family.drawing)}]:[],{type:"grid",name:"",schema:[{name:"theme",selector:o.theme},{name:"animations",selector:o.animations}]},{type:"grid",name:"",schema:[{name:"controls",selector:o.boolean},{name:"big_countdown",selector:o.boolean}]},{type:"expandable",name:"",title:this._t("ed.more"),schema:[{type:"grid",name:"",schema:[{name:"accent",selector:o.text},{name:"language",selector:o.language}]},{type:"grid",name:"",schema:[{name:"max_width",selector:o.text},{name:"images",selector:o.text}]}]}]}},Be=class extends fe{get defaults(){return{theme:"dark",show_all:!0,collapsed:!1,show_name:!1}}schema(e){let o=oe(this._lang);return[{name:"entity",required:!0,selector:o.entity},{name:"programs",selector:{select:{multiple:!0,mode:"list",options:Ne(this._hass,e,this._lang)}}},{type:"grid",name:"",schema:[{name:"show_all",selector:o.boolean},{name:"collapsed",selector:o.boolean}]},{type:"grid",name:"",schema:[{name:"theme",selector:o.theme},{name:"language",selector:o.language}]},{type:"grid",name:"",schema:[{name:"name",selector:o.text},{name:"accent",selector:o.text}]}]}};var ur=t=>/^[A-Za-z_][\w.:\/-]*$/.test(t)&&!/^(true|false|null|yes|no|on|off|~)$/i.test(t),oi=t=>typeof t=="string"?ur(t)?t:JSON.stringify(t):String(t);function ge(t,e=0){let o=" ".repeat(e);return Array.isArray(t)?t.length?t.every(i=>i===null||typeof i!="object")?`[${t.map(oi).join(", ")}]`:t.map(i=>{let r=ge(i,e+2);return`${o}- ${typeof i=="object"?r.trimStart():r}`}).join(`
`):"[]":t&&typeof t=="object"?Object.entries(t).filter(([,i])=>i!==void 0).map(([i,r])=>r&&typeof r=="object"&&!(Array.isArray(r)&&(!r.length||r.every(s=>s===null||typeof s!="object")))?`${o}${i}:
${ge(r,e+2)}`:`${o}${i}: ${ge(r,e+2)}`).join(`
`):oi(t)}var qe=t=>String(t??"").replace(/[&<>"]/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"})[e]),yr=`
:host { display: block; }
h3 { margin: 18px 0 8px; font-size: 15px; font-weight: 500; }
.bar { display: flex; flex-wrap: wrap; gap: 8px; margin: 12px 0 4px; }
button { font: 500 13.5px/1 var(--ha-font-family-body, inherit); min-height: 36px; padding: 0 14px; border-radius: 18px; cursor: pointer;
  color: var(--primary-color, #03a9f4); background: none; border: 1px solid var(--divider-color, #ddd); }
button.icon { min-height: 32px; width: 32px; padding: 0; border-radius: 50%; color: var(--secondary-text-color, #666); }
button:disabled { opacity: .35; cursor: default; }
.dev { border: 1px solid var(--divider-color, #ddd); border-radius: 12px; margin: 0 0 8px; background: var(--card-background-color, #fff); }
.dev.off { opacity: .6; }
.dh { display: flex; align-items: center; gap: 10px; padding: 8px 10px; }
.dh input { width: 18px; height: 18px; margin: 0; accent-color: var(--primary-color, #03a9f4); }
.dn { flex: 1; min-width: 0; cursor: pointer; }
.dn b { display: block; font-weight: 500; font-size: 14px; }
.dn small { color: var(--secondary-text-color, #666); font-size: 12px; }
.warn { margin: 0 10px 8px 38px; font-size: 12.5px; line-height: 1.4; color: var(--secondary-text-color, #666); display: flex; flex-wrap: wrap; align-items: center; gap: 6px 10px; }
.warn.bad { color: var(--error-color, #db4437); }
.warn.alert { color: var(--warning-color, #ffa600); }
.db { padding: 0 12px 12px 38px; }
.db[hidden] { display: none; }
textarea { width: 100%; box-sizing: border-box; min-height: 220px; margin-top: 8px; font: 12px/1.45 ui-monospace, Menlo, Consolas, monospace;
  border-radius: 8px; border: 1px solid var(--divider-color, #ddd); padding: 8px; background: var(--secondary-background-color, #f6f6f6);
  color: var(--primary-text-color, #222); }
.note { font-size: 12.5px; color: var(--secondary-text-color, #666); margin-top: 6px; }
`,Pe=class extends HTMLElement{setConfig(e){this._config={...e},this._render()}set hass(e){let o=!this._hass;this._hass=e,o&&this._loadRegistry(),this._render()}async connectedCallback(){await bt(),this._ready=!0,this._render()}get _lang(){return String(this._config?.language||this._hass?.locale?.language||this._hass?.language||"en").slice(0,2)==="nl"?"nl":"en"}_t(e,o){return k(this._lang,e,o)}async _loadRegistry(){try{this._registry=await this._hass.callWS({type:"config/entity_registry/list"})}catch{this._registry=null}this._render()}_change(e){this._config=Re(e,{layout:"rooms"}),kt(this,this._config),this._render()}_entries(){return vt(A(this._hass),this._config,this._hass,{all:!0})}_writeEntries(e){this._change({...this._config,appliances:e.map(o=>Re({entity:o.dev.roles.status,...o.opts,auto:void 0}))})}_render(){if(!this._ready||!this._config||!this._hass)return;let e=this.shadowRoot??this.attachShadow({mode:"open"});this._main||(e.innerHTML=`<style>${yr}</style><div id="main"></div><div class="bar"><button id="suggest"></button><button id="export"></button></div>
        <div id="out" hidden><textarea id="yaml" readonly></textarea><div class="note" id="copied"></div></div>
        <h3 id="h-dev"></h3><div id="devs"></div>`,this._main=document.createElement("ha-form"),this._main.computeLabel=r=>this._t(`ed.f.${r.name}`),this._main.addEventListener("value-changed",r=>{r.stopPropagation(),this._change({...this._config,...r.detail.value})}),e.getElementById("main").append(this._main),e.getElementById("suggest").onclick=()=>this._change({...this._config,appliances:xt(A(this._hass))}),e.getElementById("export").onclick=()=>this._export(),this._rows=new Map);let o=oe(this._lang);this._main.hass=this._hass,this._main.schema=[{name:"layout",selector:{select:{mode:"list",options:wt.map(r=>({value:r,label:this._t(`ed.layout.${r}`)}))}}},{type:"grid",name:"",schema:[{name:"theme",selector:o.theme},{name:"animations",selector:o.animations}]},{name:"language",selector:o.language}],this._main.data={layout:"rooms",theme:"dark",...this._config},e.getElementById("suggest").textContent=this._t("ed.suggest"),e.getElementById("export").textContent=this._t("ed.export"),e.getElementById("h-dev").textContent=this._t("ed.appliances");let i=this._entries();i.forEach((r,s)=>this._row(r,s,i));for(let[r,s]of this._rows)i.some(n=>n.dev.id===r)||(s.el.remove(),this._rows.delete(r))}_row(e,o,i){let{dev:r,opts:s}=e,n=this._hass,l=this._lang,a=this._rows.get(r.id);if(!a){let m=document.createElement("div");m.className="dev",m.innerHTML=`<div class="dh"><input type="checkbox"><div class="dn"><b></b><small></small></div>
        <button class="icon up" title="\u2191">\u25B2</button><button class="icon down" title="\u2193">\u25BC</button></div><div class="ws"></div><div class="db" hidden></div>`;let y=document.createElement("ha-form");y.computeLabel=x=>this._t(`ed.f.${x.name}`),y.addEventListener("value-changed",x=>{x.stopPropagation();let g=this._entries(),u=g.findIndex(C=>C.dev.id===r.id),v={...x.detail.value};v.programmes===["laundry","oven","coffee"].includes(r.family.group)&&delete v.programmes,g[u]={...g[u],opts:{...g[u].opts,programmes:void 0,...v}},this._writeEntries(g)}),m.querySelector(".db").append(y),m.querySelector(".dn").onclick=()=>{let x=m.querySelector(".db");x.hidden=!x.hidden},m.querySelector("input").onchange=x=>{let g=this._entries(),u=g.findIndex(v=>v.dev.id===r.id);g[u]={...g[u],opts:{...g[u].opts,show:x.target.checked?void 0:!1}},this._writeEntries(g)};let b=x=>()=>{let g=this._entries(),u=g.findIndex(C=>C.dev.id===r.id),v=u+x;v<0||v>=g.length||([g[u],g[v]]=[g[v],g[u]],this._writeEntries(g))};m.querySelector(".up").onclick=b(-1),m.querySelector(".down").onclick=b(1),a={el:m,form:y},this._rows.set(r.id,a)}let{el:p,form:d}=a,c=s.show!==!1;p.classList.toggle("off",!c),p.querySelector("input").checked=c,p.querySelector("b").textContent=s.name||n.devices?.[r.id]?.name_by_user||k(l,`kind.${r.family.kind}`),p.querySelector("small").textContent=[r.modelId??r.model,k(l,`ed.drawing.${r.family.drawing}`),n.areas?.[r.areaId]?.name].filter(Boolean).join(" \xB7 "),p.querySelector(".up").disabled=o===0,p.querySelector(".down").disabled=o===i.length-1,p.querySelector(".ws").innerHTML=this._warnings(r),p.querySelector(".ws button")?.addEventListener("click",m=>this._enable(r,m.target));let h=oe(l),f=["laundry","oven","coffee"].includes(r.family.group);d.hass=n,d.schema=[{type:"grid",name:"",schema:[{name:"name",selector:h.text},{name:"finish",selector:h.finish}]},...(T[r.family.drawing]?.designs?.length??0)>1?[{name:"design",selector:h.design(r.family.drawing)}]:[],{type:"grid",name:"",schema:[{name:"accent",selector:h.text},...f?[{name:"programmes",selector:h.boolean}]:[]]},...f&&s.programmes!==!1?[{name:"programs",selector:{select:{multiple:!0,mode:"list",options:Ne(n,r,l)}}}]:[]],d.data={programmes:f,...s};let _=this.shadowRoot.getElementById("devs");return _.children[o]!==p&&_.insertBefore(p,_.children[o]??null),p}_warnings(e){let o=this._hass,i=[],r=Ke(this._registry,e.id);return Object.keys(r).length&&i.push(`<div class="warn alert">\u26A0 ${qe(this._t("ed.w.buttons"))} <button>${qe(this._t("ed.w.enable"))}</button></div>`),o.states?.[e.roles.status]?.state==="not_connected"?i.push(`<div class="warn bad">\u26A0 ${qe(this._t("ed.w.offline"))}</div>`):e.roles.mobile_start&&o.states?.[e.roles.mobile_start]?.state==="off"&&["laundry","oven","coffee"].includes(e.family.group)&&i.push(`<div class="warn">\u24D8 ${qe(this._t("ed.w.mobile_start"))}</div>`),i.join("")}async _enable(e,o){o.disabled=!0;try{for(let i of Object.values(Ke(this._registry,e.id)))await this._hass.callWS({type:"config/entity_registry/update",entity_id:i,disabled_by:null});o.replaceWith(Object.assign(document.createElement("span"),{textContent:this._t("ed.w.enabled")})),await this._loadRegistry()}catch(i){o.disabled=!1,o.insertAdjacentText("afterend",` ${i?.message??i}`)}}async _export(){let e=this.shadowRoot,o=A(this._hass),i=Object.fromEntries(o.map(a=>[a.id,"running"])),r=Te(o,this._config,i,{areas:this._hass.areas,hass:this._hass}),s=ge({type:"sections",sections:ti(r)}),n=e.getElementById("yaml");n.value=s,e.getElementById("out").hidden=!1;let l=!1;try{await navigator.clipboard.writeText(s),l=!0}catch{n.select();try{l=document.execCommand("copy")}catch{}}e.getElementById("copied").textContent=this._t(l?"ed.copied":"ed.copy_by_hand")}};var wr="dev",$t=(t,e,o,i)=>{customElements.get(t)||customElements.define(t,e),window.customCards=window.customCards||[],window.customCards.some(r=>r.type===t)||window.customCards.push({type:t,name:o,description:i,preview:!0,documentationURL:"https://github.com/g-force-be/ha-miele-appliance-card"})};$t("miele-appliance-card",Ae,"Miele appliance","A Miele appliance with a progress ring, its own display and controls");$t("miele-overview-card",je,"Miele overview","All your Miele appliances, laid out per room, for the phone or for a kitchen display");$t("miele-programmes-card",Oe,"Miele programmes","Start a programme on a Miele appliance, always after confirmation");for(let[t,e]of[["miele-appliance-card-editor",Ve],["miele-programmes-card-editor",Be],["miele-overview-card-editor",Pe]])customElements.get(t)||customElements.define(t,e);console.info(`%c MIELE-APPLIANCE-CARD %c ${wr} `,"color:#fff;background:#3b3f44;font-weight:600","color:#3b3f44;background:#e4e6e9");export{wr as VERSION};
