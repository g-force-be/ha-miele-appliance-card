/*! Miele Appliance Card for Home Assistant — https://github.com/g-force-be/ha-miele-appliance-card
 * MIT License. Copyright (c) 2026 My Media Build; Copyright (c) 2026 Peter Gheeraert.
 * Based on hOn Washer & Dryer Card by My Media Build (https://github.com/spikey1965/ha-hon-appliance-card), MIT.
 * Not affiliated with or endorsed by Miele. Miele is a trademark of Miele & Cie. KG. */
var ct={sensor:{status:"status",program_id:"program",program_phase:"phase",program_type:"program_type",remaining_time:"remaining",elapsed_time:"elapsed",start_time:"start_in",finish:"finish",start:"start_ts",target_temperature:"target_temp",core_temperature:"core_temp",core_target_temperature:"core_target",temperature_zone_2:"temp_2",temperature_zone_3:"temp_3",spin_speed:"spin_speed",drying_step:"drying_step",energy_consumption:"energy",energy_forecast:"energy_forecast",water_consumption:"water",water_forecast:"water_forecast",twin_dos_1_level:"twindos_1",twin_dos_2_level:"twindos_2"},binary_sensor:{remote_control:"remote_control",mobile_start:"mobile_start",smart_grid:"smart_grid",notification_active:"notification"},button:{start:"btn_start",stop:"btn_stop",pause:"btn_pause"},switch:{power:"power"},light:{light:"light",ambient_light:"ambient_light"}},dt={state_status:"status",state_program_id:"program",state_program_phase:"phase",state_program_type:"program_type",state_remaining_time:"remaining",state_elapsed_time:"elapsed",state_start_time:"start_in",state_finish_timestamp:"finish",state_start_timestamp:"start_ts",state_target_temperature:"target_temp",state_temperature_1:"temp",state_core_temperature:"core_temp",state_core_target_temperature:"core_target",state_spinning_speed:"spin_speed",state_drying_step:"drying_step",current_energy_consumption:"energy",energy_forecast:"energy_forecast",current_water_consumption:"water",water_forecast:"water_forecast",twin_dos_1_level:"twindos_1",twin_dos_2_level:"twindos_2",state_signal_door:"door",state_signal_failure:"failure",state_signal_info:"notification",state_full_remote_control:"remote_control",state_mobile_start:"mobile_start",state_smart_grid:"smart_grid",start:"btn_start",stop:"btn_stop",pause:"btn_pause",poweronoff:"power",light:"light"},pt={"sensor.temperature":"temp","binary_sensor.door":"door","binary_sensor.problem":"failure"},ht=[["program_ended","status"],["no_program","program"],["normal_operation_mode","program_type"],["not_running","phase"],["extra_dry","drying_step"]];function ft(t,e,i,o){let r=t.slice(0,t.indexOf(".")),s=e?.translation_key;if(s)return ct[r]?.[s]??null;if(o){let l=dt[o.slice(o.indexOf("-")+1)];if(l)return l}let n=i?.attributes??{};if(r==="sensor"&&n.device_class==="enum"&&Array.isArray(n.options)){for(let[l,d]of ht)if(n.options.includes(l))return d}return pt[`${r}.${n.device_class}`]??null}function mt(t,e,{uniqueIds:i={},overrides:o={}}={}){let r={};for(let[s,n]of Object.entries(t.entities??{})){if(n.device_id!==e||n.platform!=="miele")continue;let l=ft(s,n,t.states?.[s],i[s]);l&&!r[l]&&(r[l]=s)}for(let[s,n]of Object.entries(o??{}))n&&(r[s]=n);return r}var gt={"washing machine":"washer","tumble dryer":"dryer","washer dryer":"washer_dryer",dishwasher:"dishwasher",oven:"oven","oven microwave":"oven_microwave","steam oven":"steam_oven","steam oven combi":"steam_oven_combi","steam oven micro":"steam_oven_micro","dialog oven":"dialog_oven",microwave:"microwave","coffee system":"coffee","warming drawer":"drawer",hob:"hob","hob extraction":"hob",hood:"hood",refrigerator:"fridge",freezer:"fridge","fridge freezer":"fridge","wine cabinet":"wine","wine conditioning unit":"wine","wine unit":"wine","wine cabinet freezer":"wine","robot vacuum cleaner":"vacuum"},ut=[[/^(WT|WWT)/,"washer_dryer"],[/^W/,"washer"],[/^T/,"dryer"],[/^G/,"dishwasher"],[/^ESW/,"drawer"],[/^(CM|CVA)/,"coffee"],[/^DGM/,"steam_oven_micro"],[/^DG/,"steam_oven_combi"],[/^H\w*BM/,"oven_microwave"],[/^M/,"microwave"],[/^H/,"oven"],[/^KM/,"hob"],[/^DA/,"hood"],[/^KWT/,"wine"],[/^(K|F)/,"fridge"],[/^RX/,"vacuum"]],_t={washer:{group:"laundry",drawing:"washer"},washer_dryer:{group:"laundry",drawing:"washer"},dryer:{group:"laundry",drawing:"dryer"},dishwasher:{group:"dishwasher",drawing:"generic"},oven:{group:"oven",drawing:"steam_oven"},steam_oven:{group:"oven",drawing:"steam_oven"},steam_oven_combi:{group:"oven",drawing:"steam_oven"},dialog_oven:{group:"oven",drawing:"steam_oven"},steam_oven_micro:{group:"oven",drawing:"microwave"},oven_microwave:{group:"oven",drawing:"microwave"},microwave:{group:"oven",drawing:"microwave"},coffee:{group:"coffee",drawing:"coffee"},drawer:{group:"drawer",drawing:"drawer"}};function wt(t,e){let i=String(e??"").replace(/\s+/g,"").toUpperCase(),o=gt[String(t??"").trim().toLowerCase()];if(!o){let s=i||String(t??"").replace(/\s+/g,"").toUpperCase();o=ut.find(([n])=>n.test(s))?.[1]??"other"}let r=_t[o]??{group:"other",drawing:"generic"};return{kind:o,group:r.group,drawing:r.drawing,builtIn:o==="coffee"?i.startsWith("CVA"):!["washer","washer_dryer","dryer","vacuum","other"].includes(o),finish:r.group==="laundry"?"lotus_white":"obsidian_black"}}function H(t,e){let i=new Set;for(let o of Object.values(t.entities??{}))o.platform==="miele"&&o.device_id&&i.add(o.device_id);return[...i].map(o=>P(t,o,e)).sort((o,r)=>String(o.areaId).localeCompare(String(r.areaId))||o.name.localeCompare(r.name))}function P(t,e,i){let o=t.devices?.[e]??{};return{id:e,name:o.name_by_user||o.name||e,model:o.model??null,modelId:o.model_id??null,areaId:o.area_id??null,family:wt(o.model,o.model_id),roles:mt(t,e,i)}}var yt=new Set(["unknown","unavailable",""]),vt=t=>t!=null&&!yt.has(t),bt={s:1/60,min:1,h:60,d:1440},kt=(t,e)=>t==null?null:t*(bt[e]??1);function K(t,e){let i=a=>e[a]?t.states?.[e[a]]:void 0,o=a=>{let c=i(a)?.state;return vt(c)?c:null},r=a=>{let c=o(a),p=c==null?NaN:Number(c);return Number.isFinite(p)?p:null},s=a=>kt(r(a),i(a)?.attributes?.unit_of_measurement),n=a=>{let c=i(a);return c?Date.parse(c.last_changed):NaN},l=a=>{let c=o(a),p=c==null?NaN:Date.parse(c);return Number.isFinite(p)?p:null},d=a=>{let c=o(a);return c==="on"?!0:c==="off"?!1:null},h=a=>e[a]?i(a)?i(a).state==="unavailable"?"unavailable":"available":"disabled":"none";return{status:i("status")?.state??null,statusAt:n("status"),program:o("program"),phase:o("phase"),programType:o("program_type"),remaining:s("remaining"),remainingAt:n("remaining"),elapsed:s("elapsed"),elapsedAt:n("elapsed"),startIn:s("start_in"),finish:l("finish"),startTs:l("start_ts"),temp:r("temp"),targetTemp:r("target_temp"),coreTemp:r("core_temp"),coreTarget:r("core_target"),tempUnit:i("temp")?.attributes?.unit_of_measurement??i("target_temp")?.attributes?.unit_of_measurement??"\xB0C",spin:r("spin_speed"),dryingStep:o("drying_step"),energyForecast:r("energy_forecast"),waterForecast:r("water_forecast"),twindos1:r("twindos_1"),twindos2:r("twindos_2"),door:d("door"),failure:d("failure"),notification:d("notification"),remote:d("remote_control"),mobileStart:d("mobile_start"),smartGrid:d("smart_grid"),power:d("power"),light:d("light"),buttons:{start:h("btn_start"),stop:h("btn_stop"),pause:h("btn_pause")}}}var xt={off:"off",reserved:"off",on:"standby",idle:"standby",programmed:"ready",waiting_to_start:"scheduled",in_use:"running",rinse_hold:"running",autocleaning:"running",superheating:"running",superfreezing:"running",supercooling:"running",supercooling_superfreezing:"running",pause:"paused",program_ended:"done",program_interrupted:"interrupted",failure:"error",service:"error"},I=new Set(["ready","scheduled","running","paused"]),$t=new Set(["scheduled","running","paused","done"]),St=new Set(["off","standby"]),ae=new Set(["not_running"]),Mt=new Set(["finished","process_finished"]);function Me(t){let e=t.status;if(e==null||e==="not_connected"||e==="unavailable")return{state:"offline",connected:!1,guessed:!1};if(e==="unknown"){if(t.phase==null&&t.program==null)return{state:"offline",connected:!1,guessed:!1};let o=ae.has(t.phase)||t.phase==null?"standby":Mt.has(t.phase)?"done":"running";return{state:t.failure?"error":o,connected:!0,guessed:!0}}return e==="pause"&&ae.has(t.phase)&&!(t.elapsed>0)&&!t.failure?{state:"ready",connected:!0,guessed:!1,notStarted:!0}:{state:t.failure?"error":xt[e]??"standby",connected:!0,guessed:!1}}var Ce=new Set(["heating_up_phase","pre_heating","heating_up"]),Ct=new Set(["cooling_down","comfort_cooling","safety_cooling","cooling_phase"]),Z=["machine_iron","hand_iron_2","hand_iron","hand_iron_1","slightly_dry","normal","normal_plus","extra_dry"],Le=t=>Z.indexOf(t),Lt=2,j=class{constructor(e,i={}){this.family=e,this.opts={holdMs:6e4,activeHoldMs:20*6e4,endGraceMs:5*6e4,debounceMs:1e3,...i},this.prev=null,this.good=null,this.offlineSince=null,this.unknownSince=null,this.c=this._newCycle(null)}_newCycle(e){return{since:e,pausedMs:0,pauseStart:null,heatFrom:null,maxRemaining:null,lastElapsed:null,program:null,reachedDry:null,frozen:null,last:null,readyProgram:void 0,readySince:null,readyShown:null}}update(e,i){let o=this.opts,r=Me(e),s=(l,d)=>this.good?i-l<d||St.has(this.good.state)?!0:$t.has(this.good.state)?this.good.endAt?i<this.good.endAt+o.endGraceMs:i-l<o.activeHoldMs:!1:!1;if(!r.connected)return this.unknownSince=null,this.offlineSince==null&&(this.offlineSince=Number.isFinite(e.statusAt)&&e.statusAt<=i?e.statusAt:i),s(this.offlineSince,o.holdMs)?this._compute(this.good.snap,i,{stale:!0,connection:"lost"}):this._offline(i);if(this.offlineSince=null,r.guessed){if(this.unknownSince==null&&(this.unknownSince=i),i-this.unknownSince<o.holdMs&&this.good)return this._compute(this.good.snap,i,{stale:!0,connection:"ok"})}else this.unknownSince=null;let n=this._compute(e,i,{stale:!1,connection:"ok",guessed:r.guessed});return this.good={snap:e,state:n.state,endAt:n.state==="done"?null:n.endAt},n}_offline(e){return{state:"offline",phase:null,program:null,stale:!1,connection:"lost",offlineSince:this.offlineSince,lastState:this.good?.state??null,progress:{mode:"none",value:null},leftSec:null,endAt:null,startAt:null,lcd:{main:{kind:"dashes"},sub:{kind:"text",value:"offline"}},flags:{},dryness:null,temps:{},controls:{}}}_compute(e,i,{stale:o,connection:r,guessed:s=!1}){let n=this.family,l=this.opts,d=Me(e),h=this.prev,a=d.notStarted&&(h==="running"||h==="paused")?"paused":d.state,c=this.c;if(!o){let $=Number.isFinite(e.statusAt)&&e.statusAt<=i?e.statusAt:i,E=n.group==="oven"&&a==="running"&&c.program&&e.program&&e.program!=="no_program"&&e.program!==c.program,lt=e.elapsed!=null&&c.lastElapsed!=null&&e.elapsed<c.lastElapsed;(I.has(a)&&!I.has(h)||lt||E)&&(c=this.c=this._newCycle(i)),a==="paused"&&c.pauseStart==null&&(c.pauseStart=$,c.frozen=c.last),a!=="paused"&&c.pauseStart!=null&&(c.pausedMs+=Math.max(0,$-c.pauseStart),c.pauseStart=null,c.frozen=null),e.program&&e.program!=="no_program"&&(c.program=e.program),e.elapsed!=null&&(c.lastElapsed=e.elapsed),e.remaining!=null&&e.remaining>0&&(a==="ready"?c.maxRemaining=e.remaining:a==="running"&&(c.maxRemaining=Math.max(c.maxRemaining??0,e.remaining))),Z.includes(e.phase)&&(c.reachedDry==null||Le(e.phase)>Le(c.reachedDry))&&(c.reachedDry=e.phase),this.prev=a}let p=a==="running"||a==="paused",f=I.has(a)||a==="done",w=e.program&&e.program!=="no_program"?e.program:f?c.program:null,k=e.phase&&!ae.has(e.phase)?e.phase:null,u=null;if(e.remaining!=null&&e.remaining>0){let $=e.remaining*60,E=Number.isFinite(e.remainingAt)?Math.max(0,(i-e.remainingAt)/1e3):0;u=a==="running"?Math.max($-E,$-60):$}else e.finish!=null&&(a==="running"||a==="scheduled")&&(u=Math.max(0,(e.finish-i)/1e3));let y=n.group==="oven"&&e.targetTemp!=null&&e.temp!=null&&p,S=y&&e.temp<e.targetTemp-Lt&&(Ce.has(e.phase)||!(e.remaining>0));S&&!o&&(c.heatFrom=Math.min(c.heatFrom??e.temp,e.temp));let _="none",m=null,x=!1,T=(c.pausedMs+(c.pauseStart!=null?Math.max(0,i-c.pauseStart):0))/1e3;if(a==="done")_="done",m=1;else if(a==="paused"&&c.frozen)({mode:_,progress:m}=c.frozen),u=c.frozen.leftSec??u;else if(p){if(S){_="heat";let $=c.heatFrom??e.temp,E=e.targetTemp-$;m=E>0?Math.min(.99,Math.max(0,(e.temp-$)/E)):0}else if(u!=null){if(_="time",e.elapsed!=null){let $=a==="running"&&Number.isFinite(e.elapsedAt)?Math.min(59,Math.max(0,(i-e.elapsedAt)/1e3)):0,E=Math.max(0,e.elapsed*60+$-T);m=E+u>0?E/(E+u):0}else c.maxRemaining&&(m=1-u/(c.maxRemaining*60));a==="running"&&u<=0&&(x=!0)}else(n.group==="laundry"||n.group==="dishwasher")&&e.remaining===0&&a==="running"?(_="time",x=!0,u=0,m=Math.max(c.last?.progress??0,.99)):y?(_="at_temp",m=1):_="indeterminate";m!=null&&(m=Math.min(_==="at_temp"?1:.99,Math.max(0,m)))}!o&&a==="running"&&(c.last={mode:_,progress:m,leftSec:u});let v=I.has(a)?e.finish??(u>0?i+u*1e3:null):a==="done"?e.finish:null,O=a!=="scheduled"?null:e.startTs!=null&&e.startTs>i?e.startTs:e.startIn?i+e.startIn*6e4:null,A=null;a==="ready"&&(e.program!==c.readyProgram&&(c.readyProgram=e.program,c.readySince=i),(c.readyShown==null||i-c.readySince>=l.debounceMs)&&(c.readyShown=e.remaining),A=c.readyShown);let Se={heating:p&&Ce.has(e.phase),cooling:Ct.has(e.phase)&&(p||a==="done"),antiCrease:e.phase==="anti_crease",keepWarm:e.phase==="keeping_warm",rinsing:e.status==="autocleaning",spin:e.phase==="spin",drain:e.phase==="drain",almostDone:x,doorOpen:e.door===!0,smartGridWait:a==="scheduled"&&e.smartGrid===!0,remote:e.remote===!0,mobileStart:e.mobileStart===!0,light:e.light},N=e.buttons,nt={pause:a==="running"&&N.pause==="available",resume:a==="paused"&&N.start==="available",start:a==="ready"&&N.start==="available",stop:I.has(a)&&N.stop==="available",disabled:Object.entries(N).filter(([,$])=>$==="disabled").map(([$])=>$)},at=(n.kind==="dryer"||n.kind==="washer_dryer")&&f&&(e.dryingStep||c.reachedDry)?{target:e.dryingStep,reached:c.reachedDry}:null;return{state:a,phase:k,program:w,programType:e.programType,stale:o,connection:r,guessed:s,progress:{mode:_,value:m},leftSec:u,endAt:v,startAt:O,flags:Se,dryness:at,lcd:this._lcd({state:a,mode:_,leftSec:u,almostDone:x,readyDur:A,startAt:O,snap:e,program:w,phase:k,flags:Se}),temps:{current:e.temp,target:e.targetTemp,core:e.coreTemp,coreTarget:e.coreTarget,unit:e.tempUnit},elapsedMin:e.elapsed,pausedSec:Math.round(T),controls:nt}}_lcd({state:e,mode:i,leftSec:o,almostDone:r,readyDur:s,startAt:n,snap:l,program:d,phase:h,flags:a}){let c=this.family.group;switch(e){case"off":return{main:{kind:"dashes"},sub:null};case"standby":return{main:{kind:"blank"},sub:null};case"ready":return{main:s?{kind:"duration",value:s*60}:{kind:"blank"},sub:{kind:"text",value:"ready"}};case"scheduled":return{main:n?{kind:"clock",value:n}:{kind:"dashes"},sub:{kind:"text",value:a.smartGridWait?"smart_grid":"starts"}};case"done":return{main:{kind:"text",value:"end"},sub:h?{kind:"phase",value:h}:null};case"interrupted":return{main:{kind:"text",value:"interrupted"},sub:null};case"error":return{main:{kind:"text",value:"error"},sub:null}}let p=e==="paused"?{kind:"text",value:"paused"}:null;return r?{main:{kind:"text",value:"almost_done"},sub:p??{kind:"percent"}}:i==="time"?{main:{kind:"countdown",value:o},sub:p??{kind:"percent"}}:i==="heat"?{main:{kind:"temp",value:l.temp},sub:p??{kind:"text",value:"heating"}}:i==="at_temp"?{main:{kind:"temp",value:l.temp},sub:p??(l.elapsed!=null?{kind:"elapsed",value:l.elapsed}:{kind:"text",value:"at_temp"})}:c==="coffee"?{main:a.rinsing?{kind:"text",value:"rinsing"}:d?{kind:"program",value:d}:{kind:"blank"},sub:h?{kind:"phase",value:h}:p}:c==="drawer"&&l.temp!=null?{main:{kind:"temp",value:l.temp},sub:h?{kind:"phase",value:h}:p}:l.elapsed!=null?{main:{kind:"elapsed",value:l.elapsed},sub:p}:{main:d?{kind:"program",value:d}:{kind:"blank"},sub:p}}};var z=()=>typeof globalThis.__MIELE_NOW__=="function"?globalThis.__MIELE_NOW__():Date.now();var At={state:{off:"Uit",offline:"Niet verbonden",standby:"Aan",ready:"Klaar om te starten",scheduled:"Gepland",running:"Bezig",paused:"Gepauzeerd",done:"Klaar",interrupted:"Onderbroken",error:"Storing"},lcd:{ready:"Klaar",starts:"Start om",smart_grid:"Slim starten",end:"Einde",interrupted:"Onderbroken",error:"Storing",almost_done:"Bijna klaar",heating:"Opwarmen",at_temp:"Op temperatuur",paused:"Pauze",rinsing:"Spoelen",offline:"Geen verbinding",drinks:"Dranken"},row:{program:"Programma",temp:"Temperatuur",spin:"Centrifuge",dryness:"Droogtegraad",ends:"Klaar om",ended:"Klaar om",duration:"Duur",starts:"Start om",elapsed:"Verstreken",core:"Kerntemperatuur"},pill:{almost_done:"Bijna klaar",smart_grid:"Wacht op slim starten",lost:"Geen verbinding",door_open:"Deur open",drawer_open:"Lade open"},btn:{pause:"Pauzeren",resume:"Hervatten",start:"Starten",stop:"Stoppen",off:"Uitzetten",on:"Aanzetten",cancel:"Annuleren"},ask:{stop:"{name} stoppen? Het programma wordt afgebroken.",off:"{name} uitzetten?",off_running:"{name} uitzetten? Het programma stopt.",start:"{program} starten op de {name}?"},icon:{remote:"Bediening op afstand",mobile:"Start op afstand",door_open:"Deur open",door_closed:"Deur dicht",door_locked:"Deur vergrendeld",lost:"Geen verbinding, laatste toestand",light:"Licht aan/uit"},err:{send:"Niet verstuurd: {msg}",no_device:"Geen Miele-toestel gevonden. Kies een toestel in de kaartinstellingen."},prog:{title:"Programma's",all:"Alle programma's ({n})",fewer:"Minder programma's",remote_on:"Start op afstand aan",remote_off:"Start op afstand uit",temp:"Temperatuur",time:"Tijd",none:"Geen",until_stop:"tot je stopt",start:"Starten",ask:"{what} starten op de {name}?",started:"{program} gestart.",cached:"Lijst van {when}, bewaard in deze browser.",why:{mobile_start:"Zet Start op afstand aan op de {name} om hier een programma te starten.",waiting:"{program} staat klaar op de {name}. Druk op Start op het toestel, of zet Start op afstand aan om hier te starten.",busy:"Er loopt al een programma. Starten kan weer als het klaar is.",offline:"De {name} is niet verbonden.",no_programs:"Miele biedt voor de {name} geen programma's aan om op afstand te starten.",no_remote:"Deze {name} kan niet op afstand starten.",no_list:"De programmalijst is nog niet binnen."}},unit:{rpm:"tpm",min:"min"},kind:{washer:"Wasmachine",dryer:"Droogkast",washer_dryer:"Was-droogcombinatie",dishwasher:"Vaatwasser",oven:"Oven",steam_oven:"Stoomoven",steam_oven_combi:"Stoomoven",steam_oven_micro:"Stoomoven met microgolf",dialog_oven:"Dialog-oven",oven_microwave:"Oven met microgolf",microwave:"Microgolfoven",coffee:"Koffiemachine",drawer:"Warmhoudlade",hob:"Kookplaat",hood:"Dampkap",fridge:"Koelkast",wine:"Wijnkast",vacuum:"Robotstofzuiger",other:"Miele-toestel"}},le={state:{off:"Off",offline:"Not connected",standby:"On",ready:"Ready to start",scheduled:"Scheduled",running:"Running",paused:"Paused",done:"Finished",interrupted:"Interrupted",error:"Fault"},lcd:{ready:"Ready",starts:"Starts at",smart_grid:"Smart start",end:"End",interrupted:"Interrupted",error:"Fault",almost_done:"Almost done",heating:"Heating up",at_temp:"At temperature",paused:"Paused",rinsing:"Rinsing",offline:"No connection",drinks:"Drinks"},row:{program:"Programme",temp:"Temperature",spin:"Spin",dryness:"Dryness",ends:"Ends at",ended:"Ended at",duration:"Duration",starts:"Starts at",elapsed:"Elapsed",core:"Core temperature"},pill:{almost_done:"Almost done",smart_grid:"Waiting for smart start",lost:"No connection",door_open:"Door open",drawer_open:"Drawer open"},btn:{pause:"Pause",resume:"Resume",start:"Start",stop:"Stop",off:"Switch off",on:"Switch on",cancel:"Cancel"},ask:{stop:"Stop the {name}? This cancels the programme.",off:"Switch the {name} off?",off_running:"Switch the {name} off? The programme stops.",start:"Start {program} on the {name}?"},icon:{remote:"Remote control",mobile:"Remote start",door_open:"Door open",door_closed:"Door closed",door_locked:"Door locked",lost:"No connection, last known state",light:"Light on/off"},err:{send:"Not sent: {msg}",no_device:"No Miele appliance found. Pick one in the card settings."},prog:{title:"Programmes",all:"All programmes ({n})",fewer:"Fewer programmes",remote_on:"Remote start on",remote_off:"Remote start off",temp:"Temperature",time:"Time",none:"None",until_stop:"until you stop it",start:"Start",ask:"Start {what} on the {name}?",started:"{program} started.",cached:"List from {when}, kept in this browser.",why:{mobile_start:"Turn on Remote start on the {name} to start a programme here.",waiting:"{program} is set on the {name}. Press Start on the appliance, or turn on Remote start to start it here.",busy:"A programme is running. You can start again once it's finished.",offline:"The {name} isn't connected.",no_programs:"Miele offers no programmes to start remotely on the {name}.",no_remote:"This {name} can't be started remotely.",no_list:"The programme list hasn't arrived yet."}},unit:{rpm:"rpm",min:"min"},kind:{washer:"Washing machine",dryer:"Tumble dryer",washer_dryer:"Washer dryer",dishwasher:"Dishwasher",oven:"Oven",steam_oven:"Steam oven",steam_oven_combi:"Steam oven",steam_oven_micro:"Steam oven with microwave",dialog_oven:"Dialog oven",oven_microwave:"Oven with microwave",microwave:"Microwave",coffee:"Coffee machine",drawer:"Warming drawer",hob:"Hob",hood:"Cooker hood",fridge:"Fridge",wine:"Wine cabinet",vacuum:"Robot vacuum",other:"Miele appliance"}},Ae={nl:At,en:le},U=(t,e)=>{let i=String(e?.language||t?.locale?.language||t?.language||"en").slice(0,2).toLowerCase();return Ae[i]?i:"en"};function Y(t,e,i){let o=e.split(".").reduce((r,s)=>r?.[s],Ae[t]??le)??e.split(".").reduce((r,s)=>r?.[s],le)??e;return i?o.replace(/\{(\w+)\}/g,(r,s)=>i[s]??""):o}var Gt={status:{autocleaning:["Automatic cleaning","Automatisch spoelen"],reserved:["Reserved","Gereserveerd"],supercooling:["Supercooling","SuperKoelen"],superfreezing:["Superfreezing","SuperVriezen"],supercooling_superfreezing:["Supercooling/superfreezing","SuperKoelen/SuperVriezen"],superheating:["Superheating","Snel opwarmen"]},phase:{"2nd_espresso":["2nd espresso coffee","2e espresso"],"2nd_grinding":["2nd grinding","2e keer malen"],"2nd_pre_brewing":["2nd pre-brewing","2e voorbrouwen"],comfort_cooling:["Comfort cooling","Comfortkoeling"],cooling_phase:["Cooling phase","Afkoelen"],dispensing:["Dispensing","Uitschenken"],dust_box_missing:["Missing dust box","Stofbox ontbreekt"],energy_save:["Energy save","Energiebesparing"],espresso:["Espresso coffee","Espresso"],final_rinse:["Final rinse","Laatste spoeling"],flex_load_active:["FlexLoad active","FlexLoad actief"],freshen_up_and_moisten:["Freshen up & moisten","Opfrissen en bevochtigen"],going_to_target_area:["Going to target area","Onderweg naar doelzone"],grinding:["Grinding","Malen"],hand_iron:["Hand iron","Strijkdroog"],hygiene_drying:["Hygiene drying","Hygi\xEBnisch drogen"],interim_rinse:["Interim rinse","Tussenspoeling"],keep_warm:["Keep warm","Warmhouden"],keeping_warm:["Keeping warm","Warmhouden"],milk_foam:["Milk foam","Melkschuim"],moisten:["Moisten","Bevochtigen"],motor_overload:["Check dust box and filter","Controleer stofbox en filter"],perfect_dry_active:["PerfectDry active","PerfectDry actief"],pre_brewing:["Pre-brewing","Voorbrouwen"],pre_dishwash:["Pre-cleaning","Voorreinigen"],process_finished:["Process finished","Klaar"],process_running:["Process running","Bezig"],program_running:["Program running","Programma loopt"],reactivating:["Reactivating","Opnieuw starten"],remote_controlled:["Remote controlled","Op afstand bediend"],rinse_out_lint:["Rinse out lint","Pluizen uitspoelen"],rinses:["Rinses","Spoelen"],roasting:["Roasting","Braden"],safety_cooling:["Safety cooling","Veiligheidskoeling"],searing:["Searing","Aanbraden"],slightly_dry:["Slightly dry","Licht droog"],slow_roasting:["Slow roasting","Lagetemperatuurgaren"],soak:["Soak","Inweken"],starch_stop:["Starch stop","Stijfselstop"],steam_reduction:["Steam reduction","Stoomreductie"],steam_smoothing:["Steam smoothing","Stoomgladmaken"],thermo_spin:["Thermo spin","ThermoSpin"],timed_drying:["Timed drying","Drogen op tijd"],venting:["Venting","Ontluchten"],waiting_for_start:["Waiting for start","Wacht op start"],warm_cups_glasses:["Warm cups/glasses","Kopjes en glazen voorverwarmen"],warm_dishes_plates:["Warm dishes/plates","Borden voorverwarmen"],wheel_lifted:["Wheel lifted","Wiel opgetild"]},program:{clean_machine:["Clean machine","Machine reinigen"],easy_care:["Easy care","Onderhoudsarm"],freshen_up:["Freshen up","Opfrissen"],outdoor_garments:["Outdoor garments","Outdoorkleding"],rinse_out_lint:["Rinse out lint","Pluizen uitspoelen"],separate_rinse_starch:["Separate rinse/starch","Apart spoelen/stijven"],steam_care:["Steam care","Stoomverzorging"],stuffed_toys:["Stuffed toys","Knuffels"],towels:["Towels","Handdoeken"],trainers_refresh:["Trainers refresh","Sportschoenen opfrissen"],downs_duvets:["Downs/Duvets","Dons/dekbedden"],pillows_sanitize:["Pillows sanitize","Kussens hygi\xEBne"],steam_smoothing:["Steam smoothing","Stoomgladmaken"],fan_plus:["Fan plus","Hetelucht plus"],conventional_heat:["Conventional heat","Boven- en onderwarmte"],intensive_bake:["Intensive bake","Intensief bakken"],fan_grill:["Fan grill","Grill met circulatie"],eco_fan_heat:["ECO fan heat","ECO hetelucht"],top_heat:["Top heat","Bovenwarmte"],eco_steam_cooking:["ECO steam cooking","ECO stoomgaren"],steam_cooking:["Steam cooking","Stoomgaren"],rapid_steam_cooking:["Rapid steam cooking","Snel stoomgaren"],reheating_with_steam:["Reheating with steam","Opwarmen met stoom"],moisture_plus_fan_plus:["Moisture plus + Fan plus","Klimaatgaren + hetelucht plus"],keeping_warm:["Keeping warm","Warmhouden"],descale:["Descale","Ontkalken"],microwave_fan_plus:["Microwave + Fan plus","Microgolf + hetelucht plus"],microwave_fan_grill:["Microwave + Fan grill","Microgolf + grill met circulatie"],microwave_auto_roast:["Microwave + Auto roast","Microgolf + automatisch braden"],reheating_with_microwave:["Reheating with microwave","Opwarmen met microgolf"],auto_roast:["Auto roast","Automatisch braden"],low_temperature_cooking:["Low temperature cooking","Lagetemperatuurgaren"],appliance_settings:["Appliance settings menu","Instellingen"],brewing_unit_degrease:["Brewing unit degrease","Zetgroep ontvetten"],coffee_pot:["Coffee pot","Koffiepot"],descaling:["Appliance descaling","Ontkalken"],fruit_tea:["Fruit tea","Vruchtenthee"],herbal_tea:["Herbal tea","Kruidenthee"],intermediate_rinsing:["Intermediate rinsing","Tussentijds spoelen"],long_coffee:["Long coffee","Lange koffie"],very_hot_water:["Very hot water","Zeer heet water"],white_tea:["White tea","Witte thee"],evaporate_water:["Evaporate water","Water verdampen"],quick_microwave:["","Snel microgolf"],microwave_grill:["","Microgolf + grill"],keep_warm:["","Warmhouden"],slow_roasting:["","Lagetemperatuurgaren"],warm_cups_glasses:["","Kopjes en glazen voorverwarmen"],warm_dishes_plates:["","Borden voorverwarmen"]}};function C(t,e,i,o){if(i==null)return"";let r={program:"program_id",phase:"program_phase",dryness:"drying_step",status:"status"}[e],s=t?.localize?.(`component.miele.entity.sensor.${r}.state.${i}`),n=o==="nl"?Gt[e]?.[i]:null;return n&&(!s||s===n[0])?n[1]:s||String(i).replace(/_/g," ").replace(/^./,l=>l.toUpperCase())}var de={ratio:"600/850",view:"0 0 600 850",window:{x:50,y:43.53,d:50},ring:{path:"M300 132 A238 238 0 1 1 300 608 A238 238 0 1 1 300 132",width:8.5,spin:{x:50,y:43.53,d:79.4}},lcd:{x:36.33,y:3.06,w:27.33,h:7.53},icons:{size:5.8,at:[[9,7.4],[16,7.4],[23,7.4]]},panel:{left:4.5,right:4.5,top:75.6,bottom:5.4}},g=t=>`var(--f-${t})`;function Et(t,e){let i=[26,20,30,22,28,18,24],o="";return i.forEach((r,s)=>{let n=e-27+s*9,l=i[6-s];o+=`<rect x="${t-40-r}" y="${n-1.1}" width="${r}" height="2.2" rx="1.1"/><circle cx="${t-34}" cy="${n}" r="1.3"/>`,o+=`<rect x="${t+40}" y="${n-1.1}" width="${l}" height="2.2" rx="1.1"/><circle cx="${t+34}" cy="${n}" r="1.3"/>`}),o}var Tt=(t,e,i,o,r)=>`<rect x="${t}" y="${e}" width="${i}" height="${o}" rx="${o/2}" fill="${r("slot")}"/>
  <path d="M${t+o/2} ${e+1.2} H${t+i-o/2}" stroke="#000" stroke-opacity=".18" stroke-width="2" stroke-linecap="round"/>`,ce=(t,e,i)=>`<circle cx="${t}" cy="${e}" r="10.5" fill="${i("knob")}" style="stroke:${g("edge")}" stroke-width="1.4"/>`;function pe(t,e=!1){let i=r=>`url(#${t}-${r})`,o="M10 18 H590 V127 H214 C209 150 190 168 152 170 H10 Z";return`<svg class="art-svg" viewBox="0 0 600 850" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
<defs>
  <linearGradient id="${t}-body" x1="0" x2="1">
    <stop offset="0" style="stop-color:${g("lo")}"/><stop offset=".05" style="stop-color:${g("mid")}"/>
    <stop offset=".42" style="stop-color:${g("hi")}"/><stop offset=".92" style="stop-color:${g("mid")}"/><stop offset="1" style="stop-color:${g("lo")}"/>
  </linearGradient>
  <linearGradient id="${t}-sheen" x1="0" x2="0" y1="0" y2="1">
    <stop offset="0" stop-color="#fff" stop-opacity=".14"/><stop offset=".3" stop-color="#fff" stop-opacity="0"/>
    <stop offset=".85" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".1"/>
  </linearGradient>
  <linearGradient id="${t}-panel" x1="0" x2="0" y1="0" y2="1">
    <stop offset="0" style="stop-color:${g("hi")}"/><stop offset=".7" style="stop-color:${g("hi")}"/><stop offset="1" style="stop-color:${g("mid")}"/>
  </linearGradient>
  <linearGradient id="${t}-under" x1="0" x2="0" y1="0" y2="1">
    <stop offset="0" stop-color="#000" stop-opacity=".12"/><stop offset="1" stop-color="#000" stop-opacity="0"/>
  </linearGradient>
  <linearGradient id="${t}-slot" x1="0" x2="0" y1="0" y2="1">
    <stop offset="0" style="stop-color:${g("edge")}"/><stop offset=".6" style="stop-color:${g("lo")}"/><stop offset="1" style="stop-color:${g("mid")}"/>
  </linearGradient>
  <linearGradient id="${t}-flap" x1="0" x2="0" y1="0" y2="1">
    <stop offset="0" style="stop-color:${g("hi")}"/><stop offset="1" style="stop-color:${g("mid")}"/>
  </linearGradient>
  <radialGradient id="${t}-knob" cx=".42" cy=".38" r=".7">
    <stop offset="0" style="stop-color:${g("hi")}"/><stop offset=".75" style="stop-color:${g("mid")}"/><stop offset="1" style="stop-color:${g("lo")}"/>
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
  <clipPath id="${t}-top"><path d="${o}"/></clipPath>
</defs>

<ellipse cx="300" cy="842" rx="292" ry="8" fill="${i("ground")}"/>

<g class="body">
  <rect x="10" y="8" width="580" height="830" rx="10" fill="${i("body")}"/>
  <rect x="10" y="8" width="580" height="830" rx="10" fill="${i("sheen")}"/>
  <rect x="10.5" y="8.5" width="579" height="829" rx="10" fill="none" style="stroke:${g("edge")}" stroke-width="1.3"/>
  <path d="M14 10 H586" stroke="#fff" stroke-opacity=".6" stroke-width="1.4"/>
  <path d="M10 18 H590" style="stroke:${g("edge")}" stroke-opacity=".7" stroke-width="1.1"/>
</g>

<g class="controls">
  <path d="${o}" fill="${i("panel")}"/>
  <path d="M214 127 C209 150 190 168 152 170 H10 V188 H152 C200 186 226 160 232 145 H590 V127 Z" fill="${i("under")}"/>
  <path d="M590 127 H214 C209 150 190 168 152 170 H10" fill="none" style="stroke:${g("edge")}" stroke-width="1.3"/>
  <path d="M207 19 V110" style="stroke:${g("edge")}" stroke-opacity=".75" stroke-width="1.1"/>
  ${Tt(44,128,110,24,i)}
  <rect x="218" y="26" width="164" height="64" rx="6" fill="${i("screen")}"/>
  <path d="M222 29 H378 L362 46 H222 Z" fill="#fff" opacity=".045"/>
  <g style="fill:${g("ink")}" opacity=".26">${Et(486,50)}</g>
  <circle cx="486" cy="50" r="26" fill="${i("chrome")}"/>
  <circle cx="486" cy="50" r="22.5" fill="${i("chromeIn")}"/>
  <circle cx="486" cy="50" r="19" fill="${i("knob")}" stroke="#000" stroke-opacity=".08"/>
  <path d="M480.5 59.5 L476.5 66.5" stroke="#f2a33a" stroke-width="3.4" stroke-linecap="round"/>
</g>

<g class="door">
  <circle cx="303" cy="377" r="238" fill="${i("shadow")}"/>
  <circle cx="300" cy="370" r="228" fill="${i("chrome")}"/>
  <circle cx="300" cy="370" r="214" fill="${i("chromeIn")}"/>
  <circle cx="300" cy="370" r="186" fill="#8d959c"/>
  <circle cx="300" cy="370" r="183" fill="${i("bezel")}"/>
  <circle cx="300" cy="370" r="151" fill="${i("glass")}"/>
  <path d="${e?"M370.6 218.6 A167 167 0 0 1 447.4 291.6":"M148.6 299.4 A167 167 0 0 1 216.5 225.4"}" fill="none" stroke="#f2a33a" stroke-width="8" stroke-linecap="round"/>
  <path d="M520 334 a228 228 0 0 1 0 72" fill="none" stroke="#000" stroke-opacity=".22" stroke-width="7" stroke-linecap="round"/>
  <path d="M110 250 a222 222 0 0 1 150 -100" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="3.5" stroke-linecap="round"/>
</g>

<g class="lower">
  ${e?`<rect x="30" y="646" width="236" height="154" rx="8" fill="${i("flap")}" style="stroke:${g("edge")}" stroke-width="1.3"/>
  ${ce(148,722,i)}
  <rect x="274" y="646" width="296" height="154" rx="8" fill="${i("flap")}" style="stroke:${g("edge")}" stroke-width="1.3"/>
  <g style="fill:${g("lo")}">${Array.from({length:13},(r,s)=>`<rect x="290" y="${660+s*10.4}" width="264" height="5" rx="2.5"/>`).join("")}</g>
  <g fill="#000" opacity=".1">${Array.from({length:13},(r,s)=>`<rect x="290" y="${660+s*10.4}" width="264" height="1.6" rx=".8"/>`).join("")}</g>`:`<rect x="35" y="646" width="180" height="152" rx="8" fill="${i("flap")}" style="stroke:${g("edge")}" stroke-width="1.3"/>
  ${ce(125,672,i)}
  <rect x="272" y="646" width="292" height="152" rx="8" fill="${i("flap")}" style="stroke:${g("edge")}" stroke-width="1.3"/>
  ${ce(418,672,i)}`}
  <rect x="10" y="810" width="580" height="28" rx="6" style="fill:${g("lo")}"/>
  <path d="M12 810.5 H588" style="stroke:${g("edge")}" stroke-width="1.2"/>
  <rect x="10" y="830" width="580" height="8" rx="4" fill="#000" opacity=".22"/>
</g>
</svg>`}var Ot=t=>`<pattern id="${t}-hex" width="13" height="22.5" patternUnits="userSpaceOnUse" patternTransform="rotate(8)">
  <path d="M6.5 0 L13 3.75 L13 11.25 L6.5 15 L0 11.25 L0 3.75 Z M6.5 15 V22.5" fill="none" stroke="#000" stroke-opacity=".14" stroke-width=".9"/>
  <path d="M6.5 1.2 L11.8 4.3" stroke="#fff" stroke-opacity=".35" stroke-width=".8"/>
</pattern>`,zt=t=>`<pattern id="${t}-hex" width="7" height="12.12" patternUnits="userSpaceOnUse" patternTransform="rotate(8)">
  <circle cx="3.5" cy="3" r="1.25" fill="#000" fill-opacity=".38"/><circle cx="0" cy="9.06" r="1.25" fill="#000" fill-opacity=".38"/><circle cx="7" cy="9.06" r="1.25" fill="#000" fill-opacity=".38"/>
</pattern>`,Dt=(t,e)=>`<svg viewBox="0 0 200 200" aria-hidden="true"><defs>
  <radialGradient id="${t}-steel" cx=".5" cy=".46" r=".56">
    <stop offset="0" stop-color="#e3e6e9"/><stop offset=".4" stop-color="#c3c8cd"/><stop offset=".78" stop-color="#8e959b"/><stop offset="1" stop-color="#4e5459"/>
  </radialGradient>
  <linearGradient id="${t}-lifter" x1="0" x2="1"><stop offset="0" stop-color="#f4f6f7"/><stop offset="1" stop-color="#a9b0b6"/></linearGradient>
  ${e?zt(t):Ot(t)}</defs>
  <circle cx="100" cy="100" r="100" fill="url(#${t}-steel)"/>
  <circle cx="100" cy="100" r="94" fill="url(#${t}-hex)"/>
  <circle cx="100" cy="100" r="58" fill="none" stroke="#000" stroke-opacity=".1" stroke-width="10"/>
  <g fill="url(#${t}-lifter)" stroke="#000" stroke-opacity=".16" stroke-width=".8">
    <path d="M92 8 C96 26 104 34 116 38 L110 8 Z"/><path d="M92 8 C96 26 104 34 116 38 L110 8 Z" transform="rotate(120 100 100)"/><path d="M92 8 C96 26 104 34 116 38 L110 8 Z" transform="rotate(240 100 100)"/>
  </g>
  <circle cx="100" cy="100" r="15" fill="#cfd3d7" stroke="#000" stroke-opacity=".18"/><circle cx="100" cy="100" r="6" fill="#9aa1a7"/></svg>`,Ht=(t,e)=>{let i=e?["#7d8fa3","#e9e5dc","#c3958c","#a9b0b8","#8f9e86","#ddd6c8"]:["#3f5a78","#e7e3db","#b98582","#8b929a","#86a084","#d8d2c6"];return`<svg viewBox="0 0 200 200" aria-hidden="true"><defs>
  <linearGradient id="${t}-fold" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".2"/><stop offset=".55" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".32"/></linearGradient>
  <clipPath id="${t}-towel"><path d="M86 158 C84 140 98 128 118 128 C140 126 160 136 164 152 C168 168 154 182 132 184 C108 186 88 176 86 158 Z"/></clipPath></defs>
  <g stroke="#000" stroke-opacity=".16" stroke-width="1.2" stroke-linejoin="round">
    <path d="M118 120 L134 106 C146 102 160 108 166 120 L170 140 C162 148 148 150 136 146 L120 140 C112 134 112 126 118 120 Z" fill="${i[3]}"/>
    <path d="M30 128 C30 116 42 110 52 112 L66 116 C72 122 70 132 62 136 L44 140 C36 140 30 136 30 128 Z" fill="${i[4]}"/>
    <path d="M56 134 C60 118 76 108 94 108 L110 112 C122 116 126 128 120 138 C112 148 96 152 82 150 L66 148 C58 146 54 140 56 134 Z" fill="${i[2]}"/>
    <path d="M24 160 C26 146 40 136 58 134 L88 132 C100 134 106 144 102 156 L96 170 C88 180 72 184 56 182 L38 178 C28 174 22 168 24 160 Z" fill="${i[0]}"/>
    <path d="M86 158 C84 140 98 128 118 128 C140 126 160 136 164 152 C168 168 154 182 132 184 C108 186 88 176 86 158 Z" fill="${i[1]}"/>
    <path d="M128 172 C134 164 150 162 160 168 L172 176 C170 186 158 192 146 190 L132 186 C124 182 124 176 128 172 Z" fill="${i[5]}"/>
  </g>
  <g clip-path="url(#${t}-towel)" fill="${i[0]}" opacity=".55"><rect x="80" y="146" width="100" height="5"/><rect x="80" y="155" width="100" height="2.5"/></g>
  <path d="M24 160 C26 146 40 136 58 134 L88 132 C100 134 106 144 102 156 L96 170 C88 180 72 184 56 182 L38 178 C28 174 22 168 24 160 Z
    M86 158 C84 140 98 128 118 128 C140 126 160 136 164 152 C168 168 154 182 132 184 C108 186 88 176 86 158 Z
    M56 134 C60 118 76 108 94 108 L110 112 C122 116 126 128 120 138 C112 148 96 152 82 150 L66 148 C58 146 54 140 56 134 Z" fill="url(#${t}-fold)"/>
  <path d="M40 150 C52 146 66 150 74 160 M62 172 C72 166 84 166 92 172 M100 150 C112 144 126 146 134 156 M72 124 C82 120 94 122 102 130 M128 118 C138 116 150 120 156 130"
    fill="none" stroke="#000" stroke-opacity=".2" stroke-width="1.6" stroke-linecap="round"/>
  <path d="M58 136 L66 128 M110 113 L104 122" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="1.4" stroke-linecap="round"/></svg>`},Rt=t=>`<svg viewBox="0 0 400 200" preserveAspectRatio="none" aria-hidden="true"><defs>
  <linearGradient id="${t}-water" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#7fb8e6" stop-opacity=".55"/><stop offset="1" stop-color="#2d6aa3" stop-opacity=".62"/></linearGradient></defs>
  <path d="M0 132 C25 124 50 140 75 132 S125 124 150 132 S200 140 225 132 S275 124 300 132 S350 140 375 132 S400 128 400 128 V200 H0 Z" fill="url(#${t}-water)"/>
  <path d="M0 132 C25 124 50 140 75 132 S125 124 150 132 S200 140 225 132 S275 124 300 132 S350 140 375 132" fill="none" stroke="#d8ecfb" stroke-opacity=".5" stroke-width="1.6"/></svg>`,jt=t=>`<svg viewBox="0 0 200 200" aria-hidden="true"><defs>
  <radialGradient id="${t}-vig" cx=".5" cy=".5" r=".5"><stop offset=".72" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".45"/></radialGradient>
  <linearGradient id="${t}-shine" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".26"/><stop offset=".45" stop-color="#fff" stop-opacity=".03"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient></defs>
  <circle cx="100" cy="100" r="100" fill="#0d1218" opacity=".1"/>
  <circle cx="100" cy="100" r="100" fill="url(#${t}-vig)"/>
  <path d="M30 70 A80 80 0 0 1 112 22 A92 92 0 0 0 46 96 Z" fill="url(#${t}-shine)"/></svg>`;function he(t,e=!1){return`<div class="layer drum">${Dt(t,e)}</div>
    <div class="layer laundry">${Ht(t,e)}</div>
    ${e?'<div class="layer heat"></div><div class="layer chill"></div>':`<div class="layer water"><div class="wave">${Rt(t)}</div></div>`}
    <div class="layer led"></div>
    <div class="layer reflect">${jt(t)}</div>`}var B=t=>`var(--f-${t})`;function V(t,e,i,o,r){return`M${t+i/2} ${e} H${t+i-r} A${r} ${r} 0 0 1 ${t+i} ${e+r} V${e+o-r} A${r} ${r} 0 0 1 ${t+i-r} ${e+o} H${t+r} A${r} ${r} 0 0 1 ${t} ${e+o-r} V${e+r} A${r} ${r} 0 0 1 ${t+r} ${e} Z`}var fe=t=>({ratio:"600/456",view:"0 0 600 456",window:{left:17,top:44.96,width:66,height:36.62,radius:"1.6% / 3.8%"},ring:{path:V(92,195,416,187,14),width:6},lcd:t?{x:41.5,y:11,w:17,h:7.6}:{x:34,y:5.26,w:32,h:15.35},icons:{size:4.2,at:[[78,9],[83,9],[88,9],[93,9]]},panel:null}),qt=(t,e)=>{let i=[118,146,168,400,424,448,472];return`<path d="M84 ${t} H516" style="stroke:${e}" stroke-opacity=".28" stroke-width="1.2"/>
  <circle cx="104" cy="${t-10}" r="6.5" fill="none" style="stroke:${e}" stroke-opacity=".6" stroke-width="1.6"/>
  <path d="M104 ${t-16} v5" style="stroke:${e}" stroke-opacity=".6" stroke-width="1.6" stroke-linecap="round"/>
  ${i.map(o=>`<rect x="${o-4}" y="${t-14}" width="8" height="8" rx="2" fill="none" style="stroke:${e}" stroke-opacity=".45" stroke-width="1.2"/>`).join("")}
  <g style="fill:${e}" opacity=".35">${Array.from({length:28},(o,r)=>`<rect x="${226+r*5.4}" y="${t-11}" width="1.6" height="3" rx=".8"/>`).join("")}</g>`},Nt=t=>Array.from({length:8},(e,i)=>{let o=146+i*38;return`<rect x="${o}" y="24" width="24" height="17" rx="3" fill="none" style="stroke:${t}" stroke-opacity=".9" stroke-width="1.5"/>
    <path d="M${o+6} ${i%2?31:34} h12 M${o+6} ${i%2?35:30} h7" style="stroke:${t}" stroke-opacity=".8" stroke-width="1.3" stroke-linecap="round"/>`}).join("");function me(t,e=!1){let i=s=>`url(#${t}-${s})`,o=B("ink"),r=e?{x:249,y:50,w:102,h:35}:{x:204,y:24,w:192,h:70};return`<svg class="art-svg" viewBox="0 0 600 456" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
<defs>
  <linearGradient id="${t}-front" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" style="stop-color:${B("hi")}"/><stop offset=".45" style="stop-color:${B("mid")}"/><stop offset="1" style="stop-color:${B("lo")}"/>
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
  <rect x="1" y="1" width="598" height="454" rx="5" fill="${i("front")}"/>
  <rect x="1" y="1" width="598" height="454" rx="5" fill="${i("sheen")}"/>
  <rect x="1.5" y="1.5" width="597" height="453" rx="5" fill="none" style="stroke:${B("edge")}" stroke-width="1.6"/>
  <path d="M8 3 H592" stroke="#fff" stroke-opacity=".14" stroke-width="1.2"/>
</g>
<g class="controls">
  ${e?Nt(o):""}
  <rect x="${r.x}" y="${r.y}" width="${r.w}" height="${r.h}" rx="${e?3:5}" fill="${i("screen")}" stroke="#fff" stroke-opacity=".06"/>
  ${qt(103,o)}
</g>
<g class="slot">
  <rect x="1" y="110" width="598" height="15" fill="${i("slot")}"/>
  <path d="M1 110.6 H599" stroke="#fff" stroke-opacity=".22" stroke-width="1.2"/>
  <path d="M1 124.6 H599" stroke="#fff" stroke-opacity=".08" stroke-width="1"/>
</g>
<g class="door">
  <rect x="100" y="203" width="400" height="171" rx="11" fill="#000" opacity=".35"/>
  <rect x="102" y="205" width="396" height="167" rx="9" fill="#0d0e10"/>
</g>
</svg>`}var It=t=>`<svg viewBox="0 0 396 167" preserveAspectRatio="none" aria-hidden="true"><defs>
  <radialGradient id="${t}-wall" cx=".5" cy=".55" r=".7"><stop offset="0" stop-color="#2a2b2e"/><stop offset=".7" stop-color="#151618"/><stop offset="1" stop-color="#08090a"/></radialGradient></defs>
  <rect width="396" height="167" fill="url(#${t}-wall)"/>
  <path d="M0 0 L40 22 V145 L0 167 M396 0 L356 22 V145 L396 167 M40 22 H356 M40 145 H356" fill="none" stroke="#fff" stroke-opacity=".06" stroke-width="1.5"/>
  <path d="M6 64 H40 M356 64 H390 M6 112 H40 M356 112 H390" stroke="#9aa1a8" stroke-opacity=".35" stroke-width="3" stroke-linecap="round"/>
  <path d="M60 14 L80 8 L100 14 L120 8 L140 14 L160 8 L180 14 L200 8 L220 14 L240 8 L260 14 L280 8 L300 14 L320 8 L336 14" fill="none" stroke="#5b5f64" stroke-opacity=".7" stroke-width="2.2" stroke-linejoin="round"/></svg>`,Pt=()=>`<svg viewBox="0 0 396 167" preserveAspectRatio="none" aria-hidden="true">
  <path d="M40 112 H356" stroke="#b9c0c6" stroke-opacity=".55" stroke-width="2.4"/>
  <path d="M128 112 L138 132 H258 L268 112 Z" fill="#3b3f44"/>
  <path d="M128 112 H268" stroke="#9aa1a8" stroke-width="2"/>
  <path d="M146 112 C156 92 180 86 198 88 C218 86 240 92 250 112 Z" fill="#9c6a42"/>
  <path d="M160 104 C172 96 188 94 198 96" fill="none" stroke="#e2b07a" stroke-opacity=".55" stroke-width="3" stroke-linecap="round"/></svg>`,ge=t=>`<div class="layer w"><svg viewBox="0 0 396 167" preserveAspectRatio="none" aria-hidden="true">
  <path d="${t}" fill="none" stroke="#f2f5f7" stroke-opacity=".5" stroke-width="7" stroke-linecap="round"/></svg></div>`,ue=()=>`<div class="layer wv"><svg viewBox="0 0 396 167" aria-hidden="true">
  <circle cx="198" cy="84" r="34" fill="none" stroke="#9fd3ff" stroke-opacity=".75" stroke-width="3"/></svg></div>`,Bt=(t,e)=>`<svg viewBox="0 0 396 167" preserveAspectRatio="none" aria-hidden="true"><defs>
  ${e?`<pattern id="${t}-mesh" width="4" height="4" patternUnits="userSpaceOnUse"><path d="M0 0 H4 M0 0 V4" stroke="#000" stroke-opacity=".55" stroke-width="1.3"/></pattern>`:`<pattern id="${t}-mesh" width="5" height="5" patternUnits="userSpaceOnUse"><circle cx="2.5" cy="2.5" r=".95" fill="#000" fill-opacity=".45"/></pattern>`}
  <linearGradient id="${t}-refl" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".1"/><stop offset=".4" stop-color="#fff" stop-opacity=".02"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient></defs>
  <rect width="396" height="167" fill="url(#${t}-mesh)"/>
  <rect width="396" height="167" fill="url(#${t}-refl)"/></svg>`;function _e(t,e=!1){return`<div class="layer cavity">${It(t)}</div>
    <div class="layer dish">${Pt()}</div>
    <div class="layer glow"></div>
    <div class="layer light"></div>
    <div class="layer steam">${ge("M150 100 C140 80 162 66 150 46 S156 18 148 6")}${ge("M200 104 C210 82 188 66 200 44 S192 18 202 4")}${ge("M250 100 C240 78 262 64 248 42 S256 20 246 6")}</div>
    ${e?`<div class="layer waves">${ue()}${ue()}${ue()}</div>`:""}
    <div class="layer print">${Bt(t,e)}</div>`}var G=t=>`var(--f-${t})`,Ge={ratio:"600/620",view:"0 0 600 620",window:{left:36.67,top:48.39,width:53.33,height:41.94,radius:"4% / 5%"},ring:{path:V(212,292,336,276,18),width:4.5},lcd:{x:55,y:10,w:16.67,h:12.58},icons:{size:4.4,at:[[78,13.5],[82.6,13.5],[87.2,13.5],[91.8,13.5]]},panel:null};function Ee(t){let e=i=>`url(#${t}-${i})`;return`<svg class="art-svg" viewBox="0 0 600 620" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
<defs>
  <linearGradient id="${t}-body" x1="0" x2="1">
    <stop offset="0" style="stop-color:${G("lo")}"/><stop offset=".3" style="stop-color:${G("mid")}"/><stop offset=".7" style="stop-color:${G("mid")}"/><stop offset="1" style="stop-color:${G("lo")}"/>
  </linearGradient>
  <linearGradient id="${t}-block" x1="0" x2="0" y1="0" y2="1">
    <stop offset="0" style="stop-color:${G("mid")}"/><stop offset="1" style="stop-color:${G("edge")}"/>
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
  <rect x="300" y="8" width="160" height="18" rx="5" style="fill:${G("lo")};stroke:${G("edge")}" stroke-width="1.2"/>
  <rect x="190" y="196" width="380" height="408" rx="10" fill="${e("body")}"/>
  <rect x="190.5" y="196.5" width="379" height="407" rx="10" fill="none" style="stroke:${G("edge")}" stroke-width="1.4"/>
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
  <circle cx="214" cy="182" r="9" fill="none" style="stroke:${G("ink")}" stroke-opacity=".8" stroke-width="1.6"/>
  <path d="M214 175 v5" style="stroke:${G("ink")}" stroke-opacity=".8" stroke-width="1.6" stroke-linecap="round"/>
  <path d="M374 182 h9 a5 5 0 0 1 0 10 h-7 M378 178 l-4 4 l4 4" fill="none" style="stroke:${G("ink")}" stroke-opacity=".75" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</g>

<g class="front">
  <rect x="330" y="216" width="100" height="84" rx="3" fill="${e("steel")}"/>
  <path d="M334 218 H426" stroke="#fff" stroke-opacity=".7" stroke-width="1.2"/>
  <rect x="340" y="296" width="80" height="10" rx="3" fill="#2c2f33"/>
  <g fill="#0c0d0e"><circle cx="366" cy="303" r="3.5"/><circle cx="380" cy="303" r="3.5"/><circle cx="394" cy="303" r="3.5"/></g>
  <rect x="206" y="538" width="348" height="36" rx="5" fill="${e("steel")}"/>
  <g stroke="#000" stroke-opacity=".3" stroke-width="2" stroke-linecap="round">${[546,552,558,564,570].map(i=>`<path d="M224 ${i} H536"/>`).join("")}</g>
  <g fill="#1e2124" stroke="#fff" stroke-opacity=".35" stroke-width="1.2"><circle cx="352" cy="557" r="8.5"/><circle cx="408" cy="557" r="8.5"/><circle cx="474" cy="549" r="4"/></g>
  <rect x="198" y="574" width="364" height="30" rx="6" fill="#0d0e0f"/>
  <path d="M202 575 H558" stroke="#fff" stroke-opacity=".1" stroke-width="1.2"/>
</g>
</svg>`}function Te(t){return`<div class="layer cuplight"></div>
    <div class="layer cup"><svg viewBox="0 0 320 260" aria-hidden="true"><defs>
      <clipPath id="${t}-cupin"><path d="M126 120 H194 L188 236 a8 8 0 0 1 -8 8 H140 a8 8 0 0 1 -8 -8 Z"/></clipPath></defs>
      <g clip-path="url(#${t}-cupin)"><g class="fill"><rect x="120" y="150" width="80" height="100" fill="#6b4226"/><rect x="120" y="130" width="80" height="24" fill="#efe6da"/></g></g>
      <path d="M126 120 H194 L188 236 a8 8 0 0 1 -8 8 H140 a8 8 0 0 1 -8 -8 Z" fill="#fff" fill-opacity=".07" stroke="#fff" stroke-opacity=".55" stroke-width="2"/>
      <path d="M132 128 L138 232" stroke="#fff" stroke-opacity=".35" stroke-width="3" stroke-linecap="round"/></svg></div>
    <div class="layer stream"><div class="jet"></div><div class="jet two"></div></div>
    <div class="layer steam">
      <div class="layer w"><svg viewBox="0 0 320 260" aria-hidden="true"><path d="M150 112 C142 96 160 86 150 70 S154 50 148 40" fill="none" stroke="#fff" stroke-opacity=".45" stroke-width="5" stroke-linecap="round"/></svg></div>
      <div class="layer w"><svg viewBox="0 0 320 260" aria-hidden="true"><path d="M172 112 C180 94 162 84 172 68 S168 48 174 38" fill="none" stroke="#fff" stroke-opacity=".45" stroke-width="5" stroke-linecap="round"/></svg></div></div>
    <div class="layer drops">${[146,160,174].map(e=>`<div class="layer d"><svg viewBox="0 0 320 260" aria-hidden="true"><path d="M${e} 10 c3 6 5 9 5 12 a5 5 0 0 1 -10 0 c0 -3 2 -6 5 -12 Z" fill="#cfe6f7" fill-opacity=".8"/></svg></div>`).join("")}</div>`}var q=t=>`var(--f-${t})`,Oe={ratio:"600/292",view:"0 0 600 292",window:{left:0,top:0,width:100,height:100,radius:"0.8% / 1.7%"},ring:{path:V(4,4,592,284,7),width:3.5},lcd:{x:35,y:36,w:30,h:28,ghost:!0},icons:{size:4.4,at:[[5.5,14],[10.3,14],[15.1,14]]},panel:null},ze=t=>`<svg class="art-svg" viewBox="0 0 600 292" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
<defs><linearGradient id="${t}-in" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#2a1e14"/><stop offset=".25" stop-color="#0c0b0a"/><stop offset="1" stop-color="#050505"/></linearGradient></defs>
<rect x="0" y="0" width="600" height="292" rx="5" fill="url(#${t}-in)"/>
<rect x="8" y="4" width="584" height="34" rx="3" fill="#060607" stroke="#fff" stroke-opacity=".08"/>
<g fill="none" stroke="#d8dce0" stroke-opacity=".75" stroke-width="1.5" stroke-linecap="round">
  <circle cx="150" cy="21" r="6"/><path d="M150 14 v5"/><rect x="200" y="14" width="9" height="14" rx="2"/><path d="M250 16 h12 M250 21 h12 M250 26 h12"/>
  <path d="M318 17 h9 v5 a4.5 4.5 0 0 1 -9 0 Z"/><path d="M352 25 h14"/><path d="M420 14 v9 a3 3 0 1 0 1 0"/></g>
<path d="M384 26 c0 -4 4 -4 4 -8 M390 26 c0 -4 4 -4 4 -8 M396 26 c0 -4 4 -4 4 -8" fill="none" stroke="#f2a33a" stroke-width="1.8" stroke-linecap="round"/>
<g fill="#d8dce0" opacity=".75"><rect x="458" y="19" width="12" height="4" rx="2"/><rect x="474" y="19" width="12" height="4" rx="2"/><rect x="490" y="19" width="12" height="4" rx="2"/><rect x="522" y="19" width="12" height="4" rx="2"/></g>
<rect x="506" y="19" width="12" height="4" rx="2" fill="#f2a33a"/>
</svg>`,De=t=>`<div class="layer front"><svg viewBox="0 0 600 292" preserveAspectRatio="none" aria-hidden="true"><defs>
  <linearGradient id="${t}-df" x1="0" x2="1">
    <stop offset="0" style="stop-color:${q("lo")}"/><stop offset=".22" style="stop-color:${q("mid")}"/><stop offset=".5" style="stop-color:${q("hi")}"/>
    <stop offset=".78" style="stop-color:${q("mid")}"/><stop offset="1" style="stop-color:${q("lo")}"/>
  </linearGradient>
  <linearGradient id="${t}-dv" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".09"/><stop offset=".4" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".12"/></linearGradient></defs>
  <rect x="1" y="1" width="598" height="290" rx="5" fill="url(#${t}-df)"/>
  <rect x="1" y="1" width="598" height="290" rx="5" fill="url(#${t}-dv)"/>
  <rect x="1.5" y="1.5" width="597" height="289" rx="5" fill="none" style="stroke:${q("edge")}" stroke-width="1.6"/>
  <path d="M8 3 H592" stroke="#fff" stroke-opacity=".16" stroke-width="1.2"/></svg></div>
  <div class="layer warmline"></div>`;var Vt={ratio:"600/700",view:"0 0 600 700",window:{x:50,y:52,d:44},ring:{path:"M300 202 A162 162 0 1 1 300 526 A162 162 0 1 1 300 202",width:7,spin:{x:50,y:52,d:54}},lcd:{x:30,y:7.5,w:40,h:8.5},icons:{size:6,at:[[9,22],[9,30],[9,38],[9,46]]},panel:null},Ft=t=>`<svg class="art-svg" viewBox="0 0 600 700" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs>
  <linearGradient id="${t}-gb" x1="0" x2="1"><stop offset="0" style="stop-color:var(--f-lo)"/><stop offset=".45" style="stop-color:var(--f-hi)"/><stop offset="1" style="stop-color:var(--f-lo)"/></linearGradient></defs>
  <rect x="20" y="10" width="560" height="676" rx="22" fill="url(#${t}-gb)" style="stroke:var(--f-edge)" stroke-width="1.5"/>
  <path d="M22 116 H578" style="stroke:var(--f-edge)" stroke-width="1.5"/>
  <rect x="172" y="46" width="256" height="70" rx="10" fill="#0b0c0e"/>
  <circle cx="300" cy="364" r="150" style="fill:var(--f-lo);stroke:var(--f-edge)" stroke-width="3"/>
  <circle cx="300" cy="364" r="132" fill="#14181d"/></svg>`,X={washer:{svg:t=>pe(t,!1),geom:de,window:t=>he(t,!1),display:"line"},dryer:{svg:t=>pe(t,!0),geom:de,window:t=>he(t,!0),display:"seg"},steam_oven:{svg:t=>me(t,!1),geom:fe(!1),window:t=>_e(t,!1),display:"oven"},microwave:{svg:t=>me(t,!0),geom:fe(!0),window:t=>_e(t,!0),display:"oven"},coffee:{svg:Ee,geom:Ge,window:Te,display:"menu"},drawer:{svg:ze,geom:Oe,window:De},generic:{svg:Ft,geom:Vt,window:()=>""}},He=t=>X[t]??X.generic;var we={lotus_white:{hi:"#f7f6f2",mid:"#ebeae5",lo:"#d6d5cf",edge:"#bdbcb5",ink:"#6f6e68"},brilliant_white:{hi:"#ffffff",mid:"#f2f3f4",lo:"#dcdfe2",edge:"#c3c7cb",ink:"#6b7075"},pearl_beige:{hi:"#efe7db",mid:"#e0d6c6",lo:"#c8bca9",edge:"#aea28f",ink:"#6e6455"},clean_steel:{hi:"#e6e8ea",mid:"#c9cdd1",lo:"#a3a8ad",edge:"#8a9095",ink:"#4f555a"},graphite_grey:{hi:"#6e7175",mid:"#56595d",lo:"#3e4144",edge:"#2e3033",ink:"#b8bcc0"},obsidian_black:{hi:"#3b3c3f",mid:"#27282b",lo:"#18191b",edge:"#0e0e10",ink:"#8d9196"}},Wt=t=>{let e=/^#?([0-9a-f]{6})$/i.exec(String(t).trim());return e?[0,2,4].map(i=>parseInt(e[1].slice(i,i+2),16)):null},F=t=>"#"+t.map(e=>Math.round(Math.max(0,Math.min(255,e))).toString(16).padStart(2,"0")).join(""),W=(t,e,i)=>t.map((o,r)=>o+(e[r]-o)*i);function Kt(t){let e=Wt(t);if(!e)return null;let i=(.2126*e[0]+.7152*e[1]+.0722*e[2])/255;return{hi:F(W(e,[255,255,255],.18)),mid:F(e),lo:F(W(e,[0,0,0],.16)),edge:F(W(e,[0,0,0],.32)),ink:F(i>.55?W(e,[0,0,0],.55):W(e,[255,255,255],.55))}}var Re=(t,e)=>we[t]??Kt(t)??we[e]??we.lotus_white,je=t=>Object.entries(t).map(([e,i])=>`--f-${e}:${i}`).join(";");var J=`
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
.err:empty { display: none; }
`,ye=J+`
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
.coffee:not(.moving) .ring .track { opacity: 0; }

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

/* coffee: cup light, the cup filling up, the stream, steam, rinse drops, the grinder's buzz */
@keyframes mc-fall { to { transform: translateY(10px); } }
@keyframes mc-drop { 0% { transform: translateY(0); opacity: 0; } 15% { opacity: .9; } 100% { transform: translateY(62%); opacity: 0; } }
@keyframes mc-buzz { 25% { transform: translate(.5px, -.4px); } 75% { transform: translate(-.5px, .4px); } }
.cuplight { background: radial-gradient(ellipse 42% 62% at 50% 0%, #fff3d8a0, #fff3d800 72%); opacity: 0; transition: opacity .8s; }
.lcd-on .cuplight { opacity: .3; }
.lamp .cuplight { opacity: 1; }
.cup { opacity: 0; transition: opacity .6s; }
.coffee.moving .cup, .coffee.st-done .cup { opacity: 1; }
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
`;var Q=t=>String(t).padStart(2,"0");function qe(t){let e=Math.max(0,Math.round(t)),i=Math.floor(e/3600),o=Math.floor(e%3600/60),r=e%60;return i?`${i}:${Q(o)}:${Q(r)}`:`${o}:${Q(r)}`}function R(t){let e=Math.round(t/60);return`${Math.floor(e/60)}:${Q(e%60)}`}function D(t,e,i){let o=e?.locale??{},r={hour:"2-digit",minute:"2-digit"};o.time_zone==="server"&&e?.config?.time_zone&&(r.timeZone=e.config.time_zone),o.time_format==="12"?r.hour12=!0:o.time_format==="24"&&(r.hour12=!1);try{return new Intl.DateTimeFormat(i,r).format(t)}catch{return new Date(t).toTimeString().slice(0,5)}}var L=(t,e="\xB0C")=>`${Math.round(t)} ${e}`;var Zt={a:"M3.2 1.6 H8.8",b:"M10.4 3.2 V8.8",c:"M10.4 11.2 V16.8",d:"M3.2 18.4 H8.8",e:"M1.6 11.2 V16.8",f:"M1.6 3.2 V8.8",g:"M3.2 10 H8.8"},Ut={0:"abcdef",1:"bc",2:"abged",3:"abgcd",4:"fgbc",5:"afgcd",6:"afgedc",7:"abc",8:"abcdefg",9:"abfgcd","-":"g"," ":""};function Ne(t){let e=0,i="";for(let o of String(t)){if(o===":"){i+=`<circle cx="${e+2}" cy="6.4" r="1.25"/><circle cx="${e+2}" cy="13.6" r="1.25"/>`,e+=4.2;continue}let r=Ut[o]??"";i+=`<g transform="translate(${e} 0)">${Object.entries(Zt).map(([s,n])=>`<path d="${n}" class="${r.includes(s)?"on":"off"}"/>`).join("")}</g>`,e+=12.6}return`<svg viewBox="-1 0 ${e+1} 20" aria-hidden="true"><g transform="skewX(-6)">${i}</g></svg>`}async function ee(t,e,i,o){try{return await t.callService(e,i,o),null}catch(r){return ve(t,r)}}async function ve(t,e){let i=e?.message||String(e);return e?.translation_key&&e?.translation_domain&&(i=(await t.loadBackendTranslation?.("exceptions",e.translation_domain))?.(`component.${e.translation_domain}.exceptions.${e.translation_key}.message`,e.translation_placeholders)||i),i}var Yt=`<svg viewBox="0 0 100 62" aria-hidden="true"><g fill="#c4cad0">
  <rect x="2" y="2" width="47" height="28" rx="2.5"/><rect x="51" y="2" width="47" height="28" rx="2.5"/>
  <rect x="2" y="32" width="47" height="28" rx="2.5"/><rect x="51" y="32" width="47" height="28" rx="2.5"/></g>
  <g fill="none" stroke="#3b4148" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M21 11 h8 v7 a4 4 0 0 1 -8 0 Z M29 13 h2 a2 2 0 0 1 0 4 h-2"/><path d="M69 11 h12 v6 a6 6 0 0 1 -12 0 Z M81 13 h2 a2 2 0 0 1 0 4 h-2"/>
  <path d="M19 41 h12 v7 a6 6 0 0 1 -12 0 Z M31 43 h2 a2 2 0 0 1 0 4 h-2 M21 39 c1 -2 3 -2 4 0"/><path d="M71 39 h8 l-1 14 h-6 Z M72 46 h6"/></g></svg>`,Xt=`<svg viewBox="0 0 12 14" aria-hidden="true"><path d="M3 6 V4.2 a3 3 0 0 1 6 0 V6" fill="none" stroke="currentColor" stroke-width="1.5"/>
  <rect x="1.2" y="6" width="9.6" height="7" rx="1.4" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M6 8.6 v2" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>`,Ie=t=>R(Math.ceil(Math.max(0,t)/60)*60),Pe={washer:"#4fa3e0",dryer:"#e9a23b",steam_oven:"#e07a4f",microwave:"#e07a4f",coffee:"#c98b5a",drawer:"#e0a84f",generic:"#4fa3e0"},te=Z.filter(t=>t!=="hand_iron"),Jt={basic:'<span class="t" id="lcd-t"></span><span class="s" id="lcd-s"></span>',line:'<span class="lk" id="lcd-k"></span><span class="lb" id="lcd-l"></span><span class="t" id="lcd-t"></span>',seg:'<span class="lad" id="lcd-l"></span><span class="sg" id="lcd-t"></span>',oven:'<span class="lb" id="lcd-l"></span><span class="t" id="lcd-t"></span><span class="cur" id="lcd-s"></span>',menu:'<span class="hd"><span id="lcd-l"></span><span id="lcd-k"></span></span><span class="bd" id="lcd-t"></span>'},b=t=>String(t??"").replace(/[&<>"]/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"})[e]),Qt=0,ie=class extends HTMLElement{static getStubConfig(e){let i=H(e)[0];return i?{device_id:i.id}:{}}setConfig(e){if(!e)throw new Error("Invalid configuration");this._config={theme:"dark",animations:"full",controls:!0,...e},this._dev=null,this._hass&&this._init()}set hass(e){let i=!this._hass;if(this._hass=e,this._dev||this._init(),!this._dev)return;let o=Object.values(this._dev.roles);(i||o.some(r=>e.states[r]!==this._seen?.[r]))&&(this._seen=Object.fromEntries(o.map(r=>[r,e.states[r]])),this._update())}connectedCallback(){clearInterval(this._tick),this._tick=setInterval(()=>this._update(),1e3),this._hass&&!this._dev&&this._init()}disconnectedCallback(){clearInterval(this._tick)}getCardSize(){return 9}getGridOptions(){return{columns:12,min_columns:4,rows:"auto"}}_deviceId(){let e=this._config,i=this._hass;return e.device_id?e.device_id:e.entity?i.entities?.[e.entity]?.device_id??null:H(i)[0]?.id??null}_init(){if(!this._config||!this._hass)return;let e=this._deviceId(),i=e?P(this._hass,e,{overrides:this._config.entities}):null;if(!i||!i.roles.status){this._dev=null,this._buildEmpty();return}this._dev=i,this._tracker=new j(i.family),this._seen=null,this._hass.loadBackendTranslation?.("entity","miele")?.then?.(()=>this._update(!0)),this._build(),this._update(!0)}get _lang(){return U(this._hass,this._config)}_t(e,i){return Y(this._lang,e,i)}_buildEmpty(){let e=this.shadowRoot??this.attachShadow({mode:"open"});e.innerHTML=`<style>${ye}</style><ha-card class="theme-${this._themeName()}"><div class="err">${b(this._t("err.no_device"))}</div></ha-card>`}_themeName(){let e=this._config.theme;return e==="auto"?this._hass?.themes?.darkMode?"dark":"light":["dark","light","ha"].includes(e)?e:"dark"}_build(){let e=this._config,i=this._dev,o=i.family,r=this._draw=X[e.drawing]?e.drawing:o.drawing,s=He(r),n=s.geom,l=`mc${++Qt}`;this._geom=n;let d=this._style=s.display??"basic",h=Re(e.finish,o.finish),a=e.accent||Pe[r]||Pe.generic,c=this._name=e.name||this._hass.devices?.[i.id]?.name_by_user||this._t(`kind.${o.kind}`);this._inText=e.name||this._hass.devices?.[i.id]?.name_by_user?c:c.toLowerCase();let p=n.icons.at.map(([v,O],A)=>`<div class="at icon" id="ic${A}" style="left:${v}%;top:${O}%;width:${n.icons.size}%"><ha-icon></ha-icon></div>`).join(""),f=n.window,w=f.d!=null,k=w?`class="at glass round" style="left:${f.x}%;top:${f.y}%;width:${f.d}%"`:`class="glass box" style="left:${f.left}%;top:${f.top}%;width:${f.width}%;height:${f.height}%;border-radius:${f.radius}"`,u=[0,1,2,3].map(v=>`<div class="row"><span class="k" id="k${v}"></span><span class="v" id="v${v}"></span></div>`).join(""),y=n.panel,S=y?`<div class="panel over" style="left:${y.left}%;right:${y.right}%;top:${y.top}%;bottom:${y.bottom}%">${u}</div>`:`<div class="panel below">${u}</div>`,_=e.images?`<img src="${b(String(e.images).replace(/\/?$/,"/")+o.drawing+".svg")}" alt="">`:s.svg(l),m=this.shadowRoot??this.attachShadow({mode:"open"});m.innerHTML=`<style>${ye}</style>
<ha-card class="${r} ${w?"round":"flat"} theme-${this._themeName()} anim-${["full","reduced","off"].includes(e.animations)?e.animations:"full"}"
  style="--c:${b(a)};${je(h)}${e.max_width?`;--maxw:${b(e.max_width)}`:""}">
  <div class="head"><span class="name">${b(c)}</span><span class="pill" id="pill"></span></div>
  <div class="ctl" id="ctl" hidden>
    <button id="b-pause"><ha-icon icon="mdi:pause"></ha-icon>${b(this._t("btn.pause"))}</button>
    <button id="b-resume"><ha-icon icon="mdi:play"></ha-icon>${b(this._t("btn.resume"))}</button>
    <button id="b-start"><ha-icon icon="mdi:play"></ha-icon>${b(this._t("btn.start"))}</button>
    <button id="b-stop"><ha-icon icon="mdi:stop"></ha-icon>${b(this._t("btn.stop"))}</button>
    <button id="b-power"><ha-icon icon="mdi:power"></ha-icon><span id="b-power-t"></span></button>
  </div>
  <div class="ask" id="ask" hidden><span id="ask-t"></span><button id="ask-no">${b(this._t("btn.cancel"))}</button><button class="go" id="ask-yes"></button></div>
  <div class="err" id="err"></div>
  <div class="pic" id="pic" style="--ratio:${n.ratio}">
    <div class="art">${_}</div>
    <div ${k}>${s.window(l)}<div class="phase" id="phase"></div></div>
    <svg class="ring" viewBox="${n.view}" aria-hidden="true"><path class="track" d="${n.ring.path}" pathLength="100" style="stroke-width:${n.ring.width}"/>
      <path class="bar" id="bar" d="${n.ring.path}" pathLength="100" stroke-dasharray="100" stroke-dashoffset="100" style="stroke-width:${n.ring.width}"/></svg>
    ${n.ring.spin?`<div class="at spinbox" style="left:${n.ring.spin.x}%;top:${n.ring.spin.y}%;width:${n.ring.spin.d}%"><div class="spin"><svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="48.5" pathLength="100"/></svg></div></div>`:""}
    <div class="lcd ${d}${n.lcd.ghost?" ghost":""}" style="left:${n.lcd.x}%;top:${n.lcd.y}%;width:${n.lcd.w}%;height:${n.lcd.h}%">${Jt[d]}</div>
    ${p}
    ${y?S:""}
  </div>
  ${y?"":S}
</ha-card>`,this._root=m.querySelector("ha-card"),this._el=v=>m.getElementById(v),this._text={};let x=v=>()=>this._call("button","press",{entity_id:this._dev.roles[v]});this._el("b-pause").onclick=x("btn_pause"),this._el("b-resume").onclick=x("btn_start"),this._el("b-start").onclick=()=>this._ask("start"),this._el("b-stop").onclick=()=>this._ask("stop"),this._el("b-power").onclick=()=>this._vm?.state==="off"?this._power(!0):this._ask("off"),this._el("ask-no").onclick=()=>this._ask(null),this._el("ask-yes").onclick=()=>{let v=this._asking;this._ask(null),v==="start"&&x("btn_start")(),v==="stop"&&x("btn_stop")(),v==="off"&&this._power(!1)};let T=this._el("ic3");T&&(T.onclick=v=>{v.stopPropagation(),this._dev.roles.light&&this._call("light","toggle",{entity_id:this._dev.roles.light})}),this._el("pic").onclick=()=>this.dispatchEvent(new CustomEvent("hass-more-info",{detail:{entityId:this._dev.roles.status},bubbles:!0,composed:!0}))}_set(e,i){if(this._text[e]===i)return;this._text[e]=i;let o=this._el(e);o&&(o.textContent=i)}_setHTML(e,i){if(this._text[e]===i)return;this._text[e]=i;let o=this._el(e);o&&(o.innerHTML=i)}_update(){if(!this._dev||!this._root||!this._hass)return;let e=this._hass,i=this._dev,o=this._lang,r=K(e,i.roles),s=this._vm=this._tracker.update(r,z());this._powerErr&&r.power===this._powerErr.on&&(this._text.err===this._powerErr.text&&this._set("err",""),this._powerErr=null);let n=s.flags??{},l=s.state,d=l==="running"||l==="paused",h=this._draw,a=s.program??"",c=s.phase??"",p=i.family.group==="oven",f=h==="coffee",w=h==="drawer",k=f&&l==="running"&&!n.rinsing&&!/grinding|rinse/.test(c),u={[`st-${l}`]:!0,[`m-${s.progress.mode}`]:!0,moving:d||!1,stale:s.stale,"f-spin":n.spin&&l==="running","f-anti":n.antiCrease&&l==="done","f-cool":n.cooling,"f-heat":h==="dryer"&&d&&!n.cooling||p&&l==="running"&&!n.cooling||!1,"f-heating":p&&l==="running"&&n.heating,"f-steam":p&&d&&(/steam|moisture|sous_vide|blanching|bottling|defrost/.test(a)||c==="steam_reduction"),"f-micro":p&&l==="running"&&/microwave|popcorn/.test(a),"f-grind":f&&l==="running"&&/grinding/.test(c),"f-dispense":k,"f-rinse":f&&l==="running"&&(n.rinsing||c==="rinse"),"f-warm":w&&(d||n.keepWarm),"f-door":n.doorOpen||c==="door_open"||w&&l==="paused",lit:d||n.doorOpen||n.antiCrease||l==="done"&&n.cooling||n.light===!0,lamp:n.light===!0||n.light==null&&(d||n.doorOpen)||!1,loaded:["ready","scheduled","running","paused","done","interrupted","error"].includes(l)&&!(f&&!d)&&s.programType!=="maintenance_program"&&!/clean_machine|descal|rinse_out_lint|^rinse$/.test(a),quiet:["off","standby","offline"].includes(l),wet:h==="washer"&&d&&!n.spin&&!n.drain&&!["anti_crease","drying","finished"].includes(s.phase),"has-phase":!!s.phase&&(d||l==="done")},y=Object.entries(u).filter(([,A])=>A).map(([A])=>A).join(" ");if(y!==this._cls){for(let A of(this._cls??"").split(" ").filter(Boolean))this._root.classList.remove(A);for(let A of y.split(" "))this._root.classList.add(A);this._cls=y}let S=this._t(`state.${l}`);l==="running"&&n.almostDone?S=this._t("pill.almost_done"):l==="running"&&s.phase?S=C(e,"phase",s.phase,this._lang):l==="scheduled"&&n.smartGridWait?S=this._t("pill.smart_grid"):l==="paused"&&h==="drawer"?S=this._t("pill.drawer_open"):l==="paused"&&n.doorOpen&&(S=this._t("pill.door_open")),this._set("pill",S),this._set("phase",s.phase?C(e,"phase",s.phase,this._lang):""),this._display(s,r);let _=s.progress.mode==="indeterminate"&&!this._geom.ring.spin,m=l==="error"||l==="interrupted"||_?1:s.progress.value;this._root.classList.toggle("breathe",_);let x=this._el("bar"),T=String(100-Math.round((m??0)*1e3)/10);x.style.strokeDashoffset!==T&&(x.style.strokeDashoffset=T),x.style.opacity=m==null?"0":"1";let v=i.family.group==="laundry"||i.family.group==="dishwasher";this._icon(0,s.connection==="lost"?"mdi:wifi-off":"mdi:wifi",s.connection==="lost"?"warn":n.remote?"lit":"",this._t(s.connection==="lost"?"icon.lost":"icon.remote"),!!i.roles.remote_control),this._icon(1,"mdi:cellphone-arrow-down",n.mobileStart?"lit":"",this._t("icon.mobile"),!!i.roles.mobile_start);let O=n.doorOpen?["mdi:door-open","lit","icon.door_open"]:d&&v?["mdi:lock","lit","icon.door_locked"]:["mdi:door-closed","","icon.door_closed"];this._icon(2,O[0],O[1],this._t(O[2]),!!i.roles.door),this._el("ic3")&&this._icon(3,n.light?"mdi:lightbulb-on":"mdi:lightbulb-outline",n.light?"lit":"",this._t("icon.light"),!!i.roles.light),this._rows(s,r,o),this._controls(s,r)}_display(e,i){let o=this._hass,r=this._lang,s=e.state,n=e.lcd.main,l=this._style,d=(f,w)=>C(o,f,w,r);if(l==="basic"){this._set("lcd-t",this._lcd(n,e)),this._set("lcd-s",e.lcd.sub?.kind==="phase"?"":this._lcd(e.lcd.sub,e)),this._el("lcd-t").classList.toggle("word",["text","program","phase"].includes(n?.kind));return}let h=D(z(),o,r),a=n?.kind==="text"?this._t(`lcd.${n.value}`):"",c=s==="standby"?h:n?.kind==="countdown"?Ie(n.value):n?.kind==="duration"?R(n.value):n?.kind==="clock"?D(n.value,o,r):"",p=s==="running"||s==="paused";if(this._root.classList.toggle("lcd-on",s!=="off"&&s!=="offline"),l==="line"){let f=a||(s==="paused"?this._t("lcd.paused"):s==="ready"?d("program",e.program):s==="scheduled"?this._t("lcd.starts"):p&&e.phase?d("phase",e.phase):p?d("program",e.program):"");this._setHTML("lcd-k",p&&!e.flags.doorOpen?Xt:""),this._set("lcd-l",f),this._set("lcd-t",a?"":c)}else if(l==="seg"){let f=i.dryingStep,w=[...te].reverse(),k=w.indexOf(f),u=k>=0&&!a&&["ready","scheduled","running","paused"].includes(s);this._setHTML("lcd-l",u?w.slice(Math.max(0,Math.min(k-1,w.length-3)),Math.max(0,Math.min(k-1,w.length-3))+3).map(y=>`<span class="${y===f?"on":""}">${b(d("dryness",y))}</span>`).join(""):`<span class="on">${b(a||(s==="standby"?"":d("program",e.program)))}</span>`),this._setHTML("lcd-t",c&&!a?Ne(c):"")}else if(l==="oven"){let f=e.temps,w=f.unit,k=n?.kind==="countdown"?Ie(n.value):f.target!=null&&(p||s==="ready"||s==="scheduled")?L(f.target,w):a||c;this._set("lcd-l",s==="standby"?"":a&&k!==a?a:d("program",e.program)),this._set("lcd-t",k),this._el("lcd-t").classList.toggle("word",k===a&&!!a),this._set("lcd-s",p&&f.current!=null?L(f.current,w):"")}else if(l==="menu"){let f=e.program?d("program",e.program):"";this._set("lcd-l",s==="standby"?this._t("lcd.drinks"):a||f||(e.flags.rinsing?this._t("lcd.rinsing"):"")),this._set("lcd-k",s==="off"||s==="offline"?"":h),this._setHTML("lcd-t",s==="standby"?Yt:s==="running"||s==="paused"?`<span class="big">${b(e.flags.rinsing?this._t("lcd.rinsing"):f)}</span><span class="small">${b(e.phase?d("phase",e.phase):"")}</span>`:a?`<span class="big">${b(a)}</span>`:"")}}_icon(e,i,o,r,s){let n=`ic${e}`,l=`${i}|${o}|${r}|${s}`;if(this._text[n]===l)return;this._text[n]=l;let d=this._el(n);d.hidden=!s,d.className=`at icon ${o}${e===3?" tap":""}`,d.title=r,d.firstElementChild.setAttribute("icon",i)}_lcd(e,i){if(!e)return"";let o=this._hass,r=this._lang;switch(e.kind){case"dashes":return"--:--";case"blank":return"";case"countdown":return qe(e.value);case"duration":return R(e.value);case"clock":return D(e.value,o,r);case"temp":return L(e.value,i.temps.unit);case"elapsed":return`${e.value} ${this._t("unit.min")}`;case"percent":return i.progress.value==null?"":`${Math.round(i.progress.value*100)}%`;case"program":return C(o,"program",e.value,this._lang);case"phase":return C(o,"phase",e.value,this._lang);case"text":return this._t(`lcd.${e.value}`)}return""}_rows(e,i,o){let r=this._hass,s=this._dev.family,n=e.state,l=[[this._t("row.program"),e.program?b(C(r,"program",e.program,this._lang)):"\u2014"]];if(s.kind==="dryer"||s.kind==="washer_dryer"){let d=i.dryingStep,h=e.dryness?.reached,a=te.indexOf(d),c=te.indexOf(h),p=a>=0?`<span class="dots">${te.slice(0,a+1).map((f,w)=>`<i class="${w<=c?"on":""}${w===a?" target":""}" title="${b(C(r,"dryness",f,this._lang))}"></i>`).join("")}</span>`:"";l.push([this._t("row.dryness"),d?p+b(C(r,"dryness",d,this._lang)):"\u2014"])}else if(s.group==="laundry"){let d=[i.targetTemp!=null?L(i.targetTemp,e.temps.unit):null,i.spin?`${i.spin} ${this._t("unit.rpm")}`:null].filter(Boolean);l.push([this._t("row.temp"),d.length?d.join(" \xB7 "):"\u2014"])}else if(s.group==="oven"||s.group==="drawer"){let d=e.temps.unit,h=e.temps.current,a=e.temps.target,c=["running","paused","ready","scheduled"].includes(n),p=h!=null&&a!=null&&c?`${Math.round(h)} \u2192 ${L(a,d)}`:a!=null&&c?L(a,d):h!=null?L(h,d):"\u2014";l.push([this._t("row.temp"),p]),e.temps.core!=null&&c&&l.push([this._t("row.core"),e.temps.coreTarget!=null?`${Math.round(e.temps.core)} \u2192 ${L(e.temps.coreTarget,d)}`:L(e.temps.core,d)])}for(n==="ready"&&e.lcd.main?.kind==="duration"?l.push([this._t("row.duration"),R(e.lcd.main.value)]):n==="scheduled"&&e.startAt?l.push([this._t("row.starts"),D(e.startAt,r,o)]):e.endAt&&["running","paused","done","scheduled"].includes(n)?l.push([this._t(n==="done"?"row.ended":"row.ends"),D(e.endAt,r,o)]):(n==="running"||n==="paused")&&e.elapsedMin!=null&&l.push([this._t("row.elapsed"),`${e.elapsedMin} ${this._t("unit.min")}`]);l.length<4;)l.push(["",""]);l.forEach(([d,h],a)=>{this._set(`k${a}`,d),this._setHTML(`v${a}`,h),this._el(`k${a}`).parentElement.hidden=!d})}_controls(e,i){let o=this._config.controls!==!1,r=e.controls??{},s=e.state,n=!!this._dev.roles.power&&i.power!=null,l={"b-pause":r.pause,"b-resume":r.resume,"b-start":r.start,"b-stop":r.stop,"b-power":n&&e.connection!=="lost"},d=!1;for(let[h,a]of Object.entries(l))this._el(h).hidden=!a,d||(d=!!a);this._set("b-power-t",this._t(s==="off"?"btn.on":"btn.off")),this._el("ctl").hidden=!o||!d,(!o||s==="offline")&&this._ask(null)}_ask(e){this._asking=e;let i=this._el("ask");if(i.hidden=!e,!e)return;let o=this._vm,r=this._inText,s=o&&["running","paused","scheduled"].includes(o.state);i.classList.toggle("start",e==="start"),this._set("ask-t",e==="start"?this._t("ask.start",{program:C(this._hass,"program",o?.program,this._lang)||"",name:r}):e==="off"?this._t(s?"ask.off_running":"ask.off",{name:r}):this._t("ask.stop",{name:r})),this._set("ask-yes",this._t(e==="start"?"btn.start":e==="off"?"btn.off":"btn.stop"))}async _power(e){this._powerErr=null,await this._call("switch",e?"turn_on":"turn_off",{entity_id:this._dev.roles.power})&&(this._powerErr={on:e,text:this._text.err})}async _call(e,i,o){this._set("err","");let r=await ee(this._hass,e,i,o);return r&&this._set("err",this._t("err.send",{msg:r})),r}};var re=t=>String(t??"").normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase().trim().replace(/[^a-z0-9]+/g,"_").replace(/^_|_$/g,""),Be=t=>t.replace(/_/g,""),Fe={washer:["cottons","eco_40_60","minimum_iron","denim","woollens","quick_power_wash","freshen_up","drain_spin","down_duvets","cottons_hygiene"],dryer:["cottons","minimum_iron","warm_air","cottons_eco"],coffee:["long_coffee","herbal_tea","milk_foam"],steam_oven:["fan_plus","steam_cooking"],microwave:["microwave","quick_microwave","fan_plus","microwave_fan_plus"],drawer:["warm_cups_glasses","warm_dishes_plates","keep_warm","slow_roasting"]},Ve=t=>t?(Number(t.hours)||0)*60+(Number(t.minutes)||0):null;function be(t,e=[]){let i=new Map(e.map(o=>[Be(o),o]));return(t?.programs??[]).filter(o=>String(o.program??"").trim()).map(o=>{let r=o.parameters?.temperature,s=o.parameters?.duration;return{id:Number(o.program_id),name:String(o.program).trim(),key:i.get(Be(re(o.program)))??null,temp:r&&r.min!=null&&r.max!=null?{min:r.min,max:r.max,step:r.step||1}:null,dur:s&&s.max?{min:Math.max(1,Ve(s.min)??1),max:Ve(s.max)}:null}})}function We(t,e){let i=(e??[]).map(String);if(!t)return{favs:i.map(s=>({id:null,key:s,name:s,temp:null,dur:null})),rest:[]};let o=s=>t.find(n=>n.key===s||String(n.id)===s),r=i.map(o).filter((s,n,l)=>s&&l.indexOf(s)===n);return{favs:r,rest:t.filter(s=>!r.includes(s))}}function Ke(t,e,i,o){return!t||t.state==="offline"||t.connection==="lost"?"offline":e.group==="drawer"||o&&!o.length?"no_programs":["running","paused","scheduled"].includes(t.state)?"busy":i.mobile_start?t.flags?.mobileStart!==!0?t.state==="ready"&&t.program?"waiting":"mobile_start":o?null:"no_list":"no_remote"}var oe=(t,e,i)=>Math.min(i,Math.max(e,t)),ei=(t,e)=>oe(e.min+Math.round((t-e.min)/e.step)*e.step,e.min,e.max),ke=t=>/microwave/.test(t.key??re(t.name));function Ze(t,e){let i=t.key??re(t.name),o=/sous_vide/.test(i)?60:/steam/.test(i)?100:/defrost/.test(i)?t.temp?.max:180,r=t.temp?ei(e?.temperature??o,t.temp):null,s=e?.minutes??(ke(t)?2:0);return t.dur&&s&&(s=oe(s,t.dur.min,t.dur.max)),{temperature:r,minutes:t.dur?s:0}}function Ue(t,e,i,o){let r=o?0:i.min;if(e>0)return t===0?i.min:oe(t+(t<10?1:t<60?5:15),r,i.max);let s=t<=i.min?0:t-(t<=10?1:t<=60?5:15);return oe(s<i.min?o?0:i.min:s,r,i.max)}function Ye(t,e,i,o={}){if(e.group!=="oven")return["miele","set_program",{device_id:t,program_id:i.id}];let r={device_id:t,program_id:i.id};return i.temp&&o.temperature!=null&&(r.temperature=o.temperature),i.dur&&o.minutes>0&&(r.duration={hours:Math.floor(o.minutes/60),minutes:o.minutes%60}),["miele","set_program_oven",r]}var Xe=t=>`miele-programmes:${t}`;function Je(t,e){try{let i=JSON.parse(t?.getItem(Xe(e))??"null");return i&&Array.isArray(i.programs)?i:null}catch{return null}}function Qe(t,e,i,o){try{t?.setItem(Xe(e),JSON.stringify({at:o,programs:i?.programs??[]}))}catch{}}var et=(t,e)=>`miele-programmes:${t}:last:${e}`;function tt(t,e,i){try{return JSON.parse(t?.getItem(et(e,i))??"null")}catch{return null}}function it(t,e,i,o){try{t?.setItem(et(e,i),JSON.stringify(o))}catch{}}var ti=[[/tea/,"mdi:tea"],[/hot_water|very_hot_water/,"mdi:cup-water"],[/milk/,"mdi:cup-outline"],[/ristretto|espresso|coffee|cappuccino|latte|caffe|cafe|americano|black$|flat_white|macchiato/,"mdi:coffee"],[/microwave/,"mdi:microwave"],[/sous_vide/,"mdi:thermometer-water"],[/steam/,"mdi:pot-steam-outline"],[/defrost/,"mdi:snowflake-melt"],[/grill/,"mdi:grill-outline"],[/roast/,"mdi:food-drumstick-outline"],[/fan_plus|fan_heat/,"mdi:fan"],[/heat|bake|cake/,"mdi:heating-coil"],[/cups|glasses/,"mdi:cup-outline"],[/dishes|plates/,"mdi:circle-double"],[/keep_warm/,"mdi:heat-wave"],[/eco/,"mdi:leaf"],[/hygiene/,"mdi:shield-check-outline"],[/cotton/,"mdi:tshirt-crew-outline"],[/minimum_iron|shirts|smoothing/,"mdi:hanger"],[/wool/,"mdi:sheep"],[/silk|delicate/,"mdi:feather"],[/denim|jeans/,"mdi:hanger"],[/quick|express/,"mdi:lightning-bolt-outline"],[/freshen|warm_air/,"mdi:weather-windy"],[/cool_air/,"mdi:snowflake"],[/drain|spin/,"mdi:rotate-right"],[/rinse/,"mdi:water-outline"],[/duvet|pillow|bed/,"mdi:bed-outline"],[/sport|outdoor/,"mdi:run"],[/towel/,"mdi:rug"],[/automatic/,"mdi:autorenew"]];function xe(t,e){let i=t.key??re(t.name);return ti.find(([o])=>o.test(i))?.[1]??{laundry:"mdi:washing-machine",oven:"mdi:stove",coffee:"mdi:coffee-maker-outline",drawer:"mdi:tray"}[e]??"mdi:play-circle-outline"}var ot={washer:"#4fa3e0",dryer:"#e9a23b",steam_oven:"#e07a4f",microwave:"#e07a4f",coffee:"#c98b5a",drawer:"#e0a84f",generic:"#4fa3e0"},ii=6*36e5,oi=10*6e4,M=t=>String(t??"").replace(/[&<>"]/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"})[e]),se=()=>{try{return globalThis.localStorage??null}catch{return null}},rt=(t,e)=>t<60?`${t} min`:`${R(t*60)} ${e==="nl"?"u":"h"}`,$e=new Map,ri=`
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
`,ne=class extends HTMLElement{static getStubConfig(e){let i=H(e).find(o=>o.family.group!=="drawer")??H(e)[0];return i?{device_id:i.id}:{}}setConfig(e){if(!e)throw new Error("Invalid configuration");this._config={theme:"dark",show_all:!0,...e},this._dev=null,this._hass&&this._init()}set hass(e){let i=!this._hass;if(this._hass=e,this._dev||this._init(),!this._dev)return;let o=Object.values(this._dev.roles);(i||o.some(r=>e.states[r]!==this._seen?.[r]))&&(this._seen=Object.fromEntries(o.map(r=>[r,e.states[r]])),this._update())}connectedCallback(){this._hass&&!this._dev&&this._init()}getCardSize(){return 6}getGridOptions(){return{columns:12,min_columns:4,rows:"auto"}}get _lang(){return U(this._hass,this._config)}_t(e,i){return Y(this._lang,e,i)}_init(){if(!this._config||!this._hass)return;let e=this._config,i=this._hass,o=e.device_id||(e.entity?i.entities?.[e.entity]?.device_id:null)||H(i)[0]?.id,r=o?P(i,o,{overrides:e.entities}):null;if(!r||!r.roles.status){this._dev=null,this._buildEmpty();return}this._dev=r,this._tracker=new j(r.family),this._seen=null,this._pick=null,this._showAll=!1,this._sig=null,i.loadBackendTranslation?.("entity","miele")?.then?.(()=>{this._sig=null,this._update()}),this._build(),this._update()}_themeName(){let e=this._config.theme;return e==="auto"?this._hass?.themes?.darkMode?"dark":"light":["dark","light","ha"].includes(e)?e:"dark"}_buildEmpty(){let e=this.shadowRoot??this.attachShadow({mode:"open"});e.innerHTML=`<style>${J}</style><ha-card class="theme-${this._themeName()}"><div class="err">${M(this._t("err.no_device"))}</div></ha-card>`}_build(){let e=this._config,i=this._dev.family,o=e.accent||ot[i.drawing]||ot.generic;this._name=e.name||this._hass.devices?.[this._dev.id]?.name_by_user||this._t(`kind.${i.kind}`),this._inText=e.name||this._hass.devices?.[this._dev.id]?.name_by_user?this._name:this._name.toLowerCase();let r=this.shadowRoot??this.attachShadow({mode:"open"});r.innerHTML=`<style>${J}${ri}</style>
<ha-card class="prog theme-${this._themeName()}" lang="${M(this._lang)}" style="--c:${M(o)}">
  <div class="head"><span class="name">${M(this._name)}</span><span class="pill" id="pill"></span></div>
  <div class="why" id="why"></div>
  <div class="ok" id="ok"></div>
  <div class="err" id="err"></div>
  <div class="sheet" id="sheet" hidden>
    <div class="sh-t"><ha-icon id="sh-i"></ha-icon><span id="sh-n"></span></div>
    <div class="field" id="f-temp"><span class="k">${M(this._t("prog.temp"))}</span><span class="v" id="temp-v"></span>
      <input type="range" id="temp" aria-label="${M(this._t("prog.temp"))}"></div>
    <div class="field" id="f-time"><span class="k">${M(this._t("prog.time"))}</span>
      <span class="step"><button id="time-dn" aria-label="\u2212"><ha-icon icon="mdi:minus"></ha-icon></button><span class="v" id="time-v"></span>
      <button id="time-up" aria-label="+"><ha-icon icon="mdi:plus"></ha-icon></button></span></div>
    <div class="q" id="q"></div>
    <div class="acts"><button id="no">${M(this._t("btn.cancel"))}</button>
      <button class="go" id="go"><ha-icon icon="mdi:play"></ha-icon>${M(this._t("prog.start"))}</button></div>
  </div>
  <div class="tiles" id="favs"></div>
  <button class="more" id="more" hidden><ha-icon icon="mdi:chevron-down"></ha-icon><span id="more-t"></span></button>
  <div class="tiles" id="rest" hidden></div>
  <div class="src" id="src"></div>
</ha-card>`,this._root=r.querySelector("ha-card"),this._el=n=>r.getElementById(n),this._text={};let s=n=>{let l=n.target.closest(".tile");l&&!l.disabled&&this._choose(this._tiles[Number(l.dataset.i)])};this._el("favs").onclick=s,this._el("rest").onclick=s,this._el("more").onclick=()=>{this._showAll=!this._showAll,this._update()},this._el("no").onclick=()=>this._choose(null),this._el("go").onclick=()=>this._start(),this._el("temp").oninput=n=>{this._values.temperature=Number(n.target.value),this._sheet()},this._el("time-dn").onclick=()=>this._stepTime(-1),this._el("time-up").onclick=()=>this._stepTime(1)}_set(e,i){if(this._text[e]===i)return;this._text[e]=i;let o=this._el(e);o&&(o.textContent=i)}_setHTML(e,i){if(this._text[e]===i)return;this._text[e]=i;let o=this._el(e);o&&(o.innerHTML=i)}_options(){let e=this._hass.states[this._dev.roles.program];return Array.isArray(e?.attributes?.options)?e.attributes.options:[]}_load(e){let i=this._dev,o=i.id,r=$e.get(o)??{},s=e.flags?.mobileStart===!0,n=s&&this._ms===!1;if(this._ms=s,i.family.group==="drawer"||r.pending)return;let l=z();r.at&&l-r.at<ii&&!n||r.failedAt&&l-r.failedAt<oi&&!n||i.family.group==="laundry"&&!s||(r.pending=this._hass.callService("miele","get_programs",{device_id:o},void 0,!1,!0).then(d=>{r.at=z(),r.response=d?.response??{programs:[]},r.error=null,Qe(se(),o,r.response,r.at)}).catch(async d=>{r.failedAt=z(),r.error=await ve(this._hass,d)}).finally(()=>{r.pending=null,this._sig=null,this._update()}),$e.set(o,r))}_list(){if(this._dev.family.group==="drawer")return{list:[],cachedAt:null,error:null};let e=$e.get(this._dev.id),i=this._options();if(e?.response)return{list:be(e.response,i),cachedAt:null,error:null};let o=Je(se(),this._dev.id);return{list:o?be(o,i):null,cachedAt:o?.at??null,error:e?.error??null}}_label(e){return e.key?C(this._hass,"program",e.key,this._lang):e.name.replace(/^./,i=>i.toUpperCase())}_update(){if(!this._dev||!this._root||!this._hass)return;let e=this._hass,i=this._dev,o=i.family,r=this._lang,s=this._vm=this._tracker.update(K(e,i.roles),z());this._load(s);let{list:n,cachedAt:l,error:d}=this._list(),h=this._config.programs??Fe[o.drawing]??[],{favs:a,rest:c}=We(n,h),p=this._block=Ke(s,o,i.roles,n),f=this._inText,w=s.flags?.mobileStart===!0;this._root.classList.toggle("remote-on",w),this._set("pill",i.roles.mobile_start?this._t(w?"prog.remote_on":"prog.remote_off"):this._t(`state.${s.state}`)),this._setHTML("why",p?`<ha-icon icon="${p==="busy"?"mdi:progress-clock":"mdi:information-outline"}"></ha-icon><span>${M(this._t(`prog.why.${p}`,{name:f,program:C(e,"program",s.program,r)}))}</span>`:""),this._set("err",this._startErr||(d&&w&&!n?this._t("err.send",{msg:d}):"")),this._set("src",l?this._t("prog.cached",{when:`${new Date(l).toLocaleDateString(r)} ${D(l,e,r)}`}):"");let k=this._config.show_all!==!1&&c.length>0,u=k&&(this._showAll||!a.length)?[...a,...c]:a,y=JSON.stringify([u.map(_=>[_.id,_.key,_.name]),a.length,r]);if(y!==this._sig){this._sig=y,this._tiles=u;let _=(m,x)=>`<button class="tile" data-i="${x}"><ha-icon icon="${xe(m,o.group)}"></ha-icon><span>${M(this._label(m))}</span></button>`;this._el("favs").innerHTML=u.slice(0,a.length||u.length).map(_).join(""),this._el("rest").innerHTML=a.length?u.slice(a.length).map((m,x)=>_(m,x+a.length)).join(""):""}this._el("rest").hidden=!a.length||!this._showAll,this._el("more").hidden=!k||!a.length,this._set("more-t",this._t(this._showAll?"prog.fewer":"prog.all",{n:c.length})),this._el("more").firstElementChild.setAttribute("icon",this._showAll?"mdi:chevron-up":"mdi:chevron-down");let S=s.state==="running"||s.state==="paused";this._root.querySelectorAll(".tile").forEach(_=>{let m=this._tiles[Number(_.dataset.i)];_.disabled=!!p||m.id==null,_.classList.toggle("now",S&&!!m.key&&m.key===s.program),_.classList.toggle("sel",m===this._pick)}),this._pick&&(p||!this._tiles.includes(this._pick))&&this._choose(null)}_choose(e){if(this._pick=e,this._set("ok",""),this._startErr&&(this._startErr="",this._set("err","")),e){let o=tt(se(),this._dev.id,e.id);this._values=Ze(e,o)}if(this._root.querySelectorAll(".tile").forEach(o=>o.classList.toggle("sel",this._tiles[Number(o.dataset.i)]===e)),this._el("sheet").hidden=!e,!e)return;let i=this._el("temp");e.temp&&Object.assign(i,{min:e.temp.min,max:e.temp.max,step:e.temp.step,value:this._values.temperature}),this._sheet(),this._el("sheet").scrollIntoView?.({block:"nearest",behavior:"smooth"})}_stepTime(e){let i=this._pick;i?.dur&&(this._values.minutes=Ue(this._values.minutes,e,i.dur,!ke(i)),this._sheet())}_sheet(){let e=this._pick,i=this._values,o=this._dev.family.group==="oven",r=this._vm?.temps?.unit,s=this._label(e);this._el("sh-i").setAttribute("icon",xe(e,this._dev.family.group)),this._set("sh-n",s);let n=o&&e.temp&&e.temp.max>e.temp.min;this._el("f-temp").hidden=!o||!e.temp,this._el("temp").hidden=!n,e.temp&&this._set("temp-v",L(i.temperature,r)),this._el("f-time").hidden=!o||!e.dur;let l=!i.minutes;this._setHTML("time-v",l?`${M(this._t("prog.none"))}<small>${M(this._t("prog.until_stop"))}</small>`:M(rt(i.minutes,this._lang)));let d=[s,o&&e.temp?L(i.temperature,r):null,o&&e.dur&&i.minutes?rt(i.minutes,this._lang):null].filter(Boolean).join(" \xB7 "),h=this._inText;this._set("q",this._t("prog.ask",{what:d,name:h})),this._el("go").disabled=!!this._block||this._starting===!0}async _start(){let e=this._pick,i=this._dev;if(!e||this._block||this._starting)return;this._starting=!0,this._el("go").disabled=!0,this._startErr="",this._set("err","");let[o,r,s]=Ye(i.id,i.family,e,this._values),n=await ee(this._hass,o,r,s);if(this._starting=!1,n){this._startErr=this._t("err.send",{msg:n}),this._set("err",this._startErr),this._el("go").disabled=!!this._block;return}i.family.group==="oven"&&it(se(),i.id,e.id,this._values);let l=this._label(e);this._choose(null),this._set("ok",this._t("prog.started",{program:l}))}};var si="dev",st=(t,e,i,o)=>{customElements.get(t)||customElements.define(t,e),window.customCards=window.customCards||[],window.customCards.some(r=>r.type===t)||window.customCards.push({type:t,name:i,description:o,preview:!0,documentationURL:"https://github.com/g-force-be/ha-miele-appliance-card"})};st("miele-appliance-card",ie,"Miele appliance","A Miele appliance with a progress ring, its own display and controls");st("miele-programmes-card",ne,"Miele programmes","Start a programme on a Miele appliance, always after confirmation");console.info(`%c MIELE-APPLIANCE-CARD %c ${si} `,"color:#fff;background:#3b3f44;font-weight:600","color:#3b3f44;background:#e4e6e9");export{si as VERSION};
