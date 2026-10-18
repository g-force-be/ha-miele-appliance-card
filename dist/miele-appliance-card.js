/*! Miele Appliance Card for Home Assistant — https://github.com/g-force-be/ha-miele-appliance-card
 * MIT License. Copyright (c) 2026 My Media Build; Copyright (c) 2026 Peter Gheeraert.
 * Based on hOn Washer & Dryer Card by My Media Build (https://github.com/spikey1965/ha-hon-appliance-card), MIT.
 * Not affiliated with or endorsed by Miele. Miele is a trademark of Miele & Cie. KG. */
var ze={sensor:{status:"status",program_id:"program",program_phase:"phase",program_type:"program_type",remaining_time:"remaining",elapsed_time:"elapsed",start_time:"start_in",finish:"finish",start:"start_ts",target_temperature:"target_temp",core_temperature:"core_temp",core_target_temperature:"core_target",temperature_zone_2:"temp_2",temperature_zone_3:"temp_3",spin_speed:"spin_speed",drying_step:"drying_step",energy_consumption:"energy",energy_forecast:"energy_forecast",water_consumption:"water",water_forecast:"water_forecast",twin_dos_1_level:"twindos_1",twin_dos_2_level:"twindos_2"},binary_sensor:{remote_control:"remote_control",mobile_start:"mobile_start",smart_grid:"smart_grid",notification_active:"notification"},button:{start:"btn_start",stop:"btn_stop",pause:"btn_pause"},switch:{power:"power"},light:{light:"light",ambient_light:"ambient_light"}},De={state_status:"status",state_program_id:"program",state_program_phase:"phase",state_program_type:"program_type",state_remaining_time:"remaining",state_elapsed_time:"elapsed",state_start_time:"start_in",state_finish_timestamp:"finish",state_start_timestamp:"start_ts",state_target_temperature:"target_temp",state_temperature_1:"temp",state_core_temperature:"core_temp",state_core_target_temperature:"core_target",state_spinning_speed:"spin_speed",state_drying_step:"drying_step",current_energy_consumption:"energy",energy_forecast:"energy_forecast",current_water_consumption:"water",water_forecast:"water_forecast",twin_dos_1_level:"twindos_1",twin_dos_2_level:"twindos_2",state_signal_door:"door",state_signal_failure:"failure",state_signal_info:"notification",state_full_remote_control:"remote_control",state_mobile_start:"mobile_start",state_smart_grid:"smart_grid",start:"btn_start",stop:"btn_stop",pause:"btn_pause",poweronoff:"power",light:"light"},Ee={"sensor.temperature":"temp","binary_sensor.door":"door","binary_sensor.problem":"failure"},Te=[["program_ended","status"],["no_program","program"],["normal_operation_mode","program_type"],["not_running","phase"],["extra_dry","drying_step"]];function Re(t,e,o,i){let r=t.slice(0,t.indexOf(".")),n=e?.translation_key;if(n)return ze[r]?.[n]??null;if(i){let c=De[i.slice(i.indexOf("-")+1)];if(c)return c}let s=o?.attributes??{};if(r==="sensor"&&s.device_class==="enum"&&Array.isArray(s.options)){for(let[c,l]of Te)if(s.options.includes(c))return l}return Ee[`${r}.${s.device_class}`]??null}function je(t,e,{uniqueIds:o={},overrides:i={}}={}){let r={};for(let[n,s]of Object.entries(t.entities??{})){if(s.device_id!==e||s.platform!=="miele")continue;let c=Re(n,s,t.states?.[n],o[n]);c&&!r[c]&&(r[c]=n)}for(let[n,s]of Object.entries(i??{}))s&&(r[n]=s);return r}var qe={"washing machine":"washer","tumble dryer":"dryer","washer dryer":"washer_dryer",dishwasher:"dishwasher",oven:"oven","oven microwave":"oven_microwave","steam oven":"steam_oven","steam oven combi":"steam_oven_combi","steam oven micro":"steam_oven_micro","dialog oven":"dialog_oven",microwave:"microwave","coffee system":"coffee","warming drawer":"drawer",hob:"hob","hob extraction":"hob",hood:"hood",refrigerator:"fridge",freezer:"fridge","fridge freezer":"fridge","wine cabinet":"wine","wine conditioning unit":"wine","wine unit":"wine","wine cabinet freezer":"wine","robot vacuum cleaner":"vacuum"},Ie=[[/^(WT|WWT)/,"washer_dryer"],[/^W/,"washer"],[/^T/,"dryer"],[/^G/,"dishwasher"],[/^ESW/,"drawer"],[/^(CM|CVA)/,"coffee"],[/^DGM/,"steam_oven_micro"],[/^DG/,"steam_oven_combi"],[/^H\w*BM/,"oven_microwave"],[/^M/,"microwave"],[/^H/,"oven"],[/^KM/,"hob"],[/^DA/,"hood"],[/^KWT/,"wine"],[/^(K|F)/,"fridge"],[/^RX/,"vacuum"]],Ne={washer:{group:"laundry",drawing:"washer"},washer_dryer:{group:"laundry",drawing:"washer"},dryer:{group:"laundry",drawing:"dryer"},dishwasher:{group:"dishwasher",drawing:"generic"},oven:{group:"oven",drawing:"steam_oven"},steam_oven:{group:"oven",drawing:"steam_oven"},steam_oven_combi:{group:"oven",drawing:"steam_oven"},dialog_oven:{group:"oven",drawing:"steam_oven"},steam_oven_micro:{group:"oven",drawing:"microwave"},oven_microwave:{group:"oven",drawing:"microwave"},microwave:{group:"oven",drawing:"microwave"},coffee:{group:"coffee",drawing:"coffee"},drawer:{group:"drawer",drawing:"drawer"}};function Pe(t,e){let o=String(e??"").replace(/\s+/g,"").toUpperCase(),i=qe[String(t??"").trim().toLowerCase()];if(!i){let n=o||String(t??"").replace(/\s+/g,"").toUpperCase();i=Ie.find(([s])=>s.test(n))?.[1]??"other"}let r=Ne[i]??{group:"other",drawing:"generic"};return{kind:i,group:r.group,drawing:r.drawing,builtIn:i==="coffee"?o.startsWith("CVA"):!["washer","washer_dryer","dryer","vacuum","other"].includes(i),finish:r.group==="laundry"?"lotus_white":"obsidian_black"}}function Z(t,e){let o=new Set;for(let i of Object.values(t.entities??{}))i.platform==="miele"&&i.device_id&&o.add(i.device_id);return[...o].map(i=>U(t,i,e)).sort((i,r)=>String(i.areaId).localeCompare(String(r.areaId))||i.name.localeCompare(r.name))}function U(t,e,o){let i=t.devices?.[e]??{};return{id:e,name:i.name_by_user||i.name||e,model:i.model??null,modelId:i.model_id??null,areaId:i.area_id??null,family:Pe(i.model,i.model_id),roles:je(t,e,o)}}var Ve=new Set(["unknown","unavailable",""]),Be=t=>t!=null&&!Ve.has(t),We={s:1/60,min:1,h:60,d:1440},Fe=(t,e)=>t==null?null:t*(We[e]??1);function fe(t,e){let o=a=>e[a]?t.states?.[e[a]]:void 0,i=a=>{let d=o(a)?.state;return Be(d)?d:null},r=a=>{let d=i(a),h=d==null?NaN:Number(d);return Number.isFinite(h)?h:null},n=a=>Fe(r(a),o(a)?.attributes?.unit_of_measurement),s=a=>{let d=o(a);return d?Date.parse(d.last_changed):NaN},c=a=>{let d=i(a),h=d==null?NaN:Date.parse(d);return Number.isFinite(h)?h:null},l=a=>{let d=i(a);return d==="on"?!0:d==="off"?!1:null},f=a=>e[a]?o(a)?o(a).state==="unavailable"?"unavailable":"available":"disabled":"none";return{status:o("status")?.state??null,statusAt:s("status"),program:i("program"),phase:i("phase"),programType:i("program_type"),remaining:n("remaining"),remainingAt:s("remaining"),elapsed:n("elapsed"),elapsedAt:s("elapsed"),startIn:n("start_in"),finish:c("finish"),startTs:c("start_ts"),temp:r("temp"),targetTemp:r("target_temp"),coreTemp:r("core_temp"),coreTarget:r("core_target"),tempUnit:o("temp")?.attributes?.unit_of_measurement??o("target_temp")?.attributes?.unit_of_measurement??"\xB0C",spin:r("spin_speed"),dryingStep:i("drying_step"),energyForecast:r("energy_forecast"),waterForecast:r("water_forecast"),twindos1:r("twindos_1"),twindos2:r("twindos_2"),door:l("door"),failure:l("failure"),notification:l("notification"),remote:l("remote_control"),mobileStart:l("mobile_start"),smartGrid:l("smart_grid"),power:l("power"),light:l("light"),buttons:{start:f("btn_start"),stop:f("btn_stop"),pause:f("btn_pause")}}}var Ke={off:"off",reserved:"off",on:"standby",idle:"standby",programmed:"ready",waiting_to_start:"scheduled",in_use:"running",rinse_hold:"running",autocleaning:"running",superheating:"running",superfreezing:"running",supercooling:"running",supercooling_superfreezing:"running",pause:"paused",program_ended:"done",program_interrupted:"interrupted",failure:"error",service:"error"},T=new Set(["ready","scheduled","running","paused"]),Ze=new Set(["scheduled","running","paused","done"]),Ue=new Set(["off","standby"]),he=new Set(["not_running"]),Ye=new Set(["finished","process_finished"]);function ce(t){let e=t.status;if(e==null||e==="not_connected"||e==="unavailable")return{state:"offline",connected:!1,guessed:!1};if(e==="unknown"){if(t.phase==null&&t.program==null)return{state:"offline",connected:!1,guessed:!1};let i=he.has(t.phase)||t.phase==null?"standby":Ye.has(t.phase)?"done":"running";return{state:t.failure?"error":i,connected:!0,guessed:!0}}return{state:t.failure?"error":Ke[e]??"standby",connected:!0,guessed:!1}}var de=new Set(["heating_up_phase","pre_heating","heating_up"]),Xe=new Set(["cooling_down","comfort_cooling","safety_cooling","cooling_phase"]),V=["machine_iron","hand_iron_2","hand_iron","hand_iron_1","slightly_dry","normal","normal_plus","extra_dry"],pe=t=>V.indexOf(t),Je=2,P=class{constructor(e,o={}){this.family=e,this.opts={holdMs:6e4,activeHoldMs:20*6e4,endGraceMs:5*6e4,debounceMs:1e3,...o},this.prev=null,this.good=null,this.offlineSince=null,this.unknownSince=null,this.c=this._newCycle(null)}_newCycle(e){return{since:e,pausedMs:0,pauseStart:null,heatFrom:null,maxRemaining:null,lastElapsed:null,program:null,reachedDry:null,frozen:null,last:null,readyProgram:void 0,readySince:null,readyShown:null}}update(e,o){let i=this.opts,r=ce(e),n=(c,l)=>this.good?o-c<l||Ue.has(this.good.state)?!0:Ze.has(this.good.state)?this.good.endAt?o<this.good.endAt+i.endGraceMs:o-c<i.activeHoldMs:!1:!1;if(!r.connected)return this.unknownSince=null,this.offlineSince==null&&(this.offlineSince=Number.isFinite(e.statusAt)&&e.statusAt<=o?e.statusAt:o),n(this.offlineSince,i.holdMs)?this._compute(this.good.snap,o,{stale:!0,connection:"lost"}):this._offline(o);if(this.offlineSince=null,r.guessed){if(this.unknownSince==null&&(this.unknownSince=o),o-this.unknownSince<i.holdMs&&this.good)return this._compute(this.good.snap,o,{stale:!0,connection:"ok"})}else this.unknownSince=null;let s=this._compute(e,o,{stale:!1,connection:"ok",guessed:r.guessed});return this.good={snap:e,state:s.state,endAt:s.state==="done"?null:s.endAt},s}_offline(e){return{state:"offline",phase:null,program:null,stale:!1,connection:"lost",offlineSince:this.offlineSince,lastState:this.good?.state??null,progress:{mode:"none",value:null},leftSec:null,endAt:null,startAt:null,lcd:{main:{kind:"dashes"},sub:{kind:"text",value:"offline"}},flags:{},dryness:null,temps:{},controls:{}}}_compute(e,o,{stale:i,connection:r,guessed:n=!1}){let s=this.family,c=this.opts,l=ce(e).state,f=this.prev,a=this.c;if(!i){let b=Number.isFinite(e.statusAt)&&e.statusAt<=o?e.statusAt:o,C=s.group==="oven"&&l==="running"&&a.program&&e.program&&e.program!=="no_program"&&e.program!==a.program,Oe=e.elapsed!=null&&a.lastElapsed!=null&&e.elapsed<a.lastElapsed;(T.has(l)&&!T.has(f)||Oe||C)&&(a=this.c=this._newCycle(o)),l==="paused"&&a.pauseStart==null&&(a.pauseStart=b,a.frozen=a.last),l!=="paused"&&a.pauseStart!=null&&(a.pausedMs+=Math.max(0,b-a.pauseStart),a.pauseStart=null,a.frozen=null),e.program&&e.program!=="no_program"&&(a.program=e.program),e.elapsed!=null&&(a.lastElapsed=e.elapsed),e.remaining!=null&&e.remaining>0&&(l==="ready"?a.maxRemaining=e.remaining:l==="running"&&(a.maxRemaining=Math.max(a.maxRemaining??0,e.remaining))),V.includes(e.phase)&&(a.reachedDry==null||pe(e.phase)>pe(a.reachedDry))&&(a.reachedDry=e.phase),this.prev=l}let d=l==="running"||l==="paused",h=T.has(l)||l==="done",p=e.program&&e.program!=="no_program"?e.program:h?a.program:null,m=e.phase&&!he.has(e.phase)?e.phase:null,u=null;if(e.remaining!=null&&e.remaining>0){let b=e.remaining*60,C=Number.isFinite(e.remainingAt)?Math.max(0,(o-e.remainingAt)/1e3):0;u=l==="running"?Math.max(b-C,b-60):b}else e.finish!=null&&(l==="running"||l==="scheduled")&&(u=Math.max(0,(e.finish-o)/1e3));let A=s.group==="oven"&&e.targetTemp!=null&&e.temp!=null&&d,v=A&&e.temp<e.targetTemp-Je&&(de.has(e.phase)||!(e.remaining>0));v&&!i&&(a.heatFrom=Math.min(a.heatFrom??e.temp,e.temp));let y="none",k=null,M=!1,S=(a.pausedMs+(a.pauseStart!=null?Math.max(0,o-a.pauseStart):0))/1e3;if(l==="done")y="done",k=1;else if(l==="paused"&&a.frozen)({mode:y,progress:k}=a.frozen),u=a.frozen.leftSec??u;else if(d){if(v){y="heat";let b=a.heatFrom??e.temp,C=e.targetTemp-b;k=C>0?Math.min(.99,Math.max(0,(e.temp-b)/C)):0}else if(u!=null){if(y="time",e.elapsed!=null){let b=l==="running"&&Number.isFinite(e.elapsedAt)?Math.min(59,Math.max(0,(o-e.elapsedAt)/1e3)):0,C=Math.max(0,e.elapsed*60+b-S);k=C+u>0?C/(C+u):0}else a.maxRemaining&&(k=1-u/(a.maxRemaining*60));l==="running"&&u<=0&&(M=!0)}else(s.group==="laundry"||s.group==="dishwasher")&&e.remaining===0&&l==="running"?(y="time",M=!0,u=0,k=Math.max(a.last?.progress??0,.99)):A?(y="at_temp",k=1):y="indeterminate";k!=null&&(k=Math.min(y==="at_temp"?1:.99,Math.max(0,k)))}!i&&l==="running"&&(a.last={mode:y,progress:k,leftSec:u});let O=T.has(l)?e.finish??(u>0?o+u*1e3:null):l==="done"?e.finish:null,w=l!=="scheduled"?null:e.startTs!=null&&e.startTs>o?e.startTs:e.startIn?o+e.startIn*6e4:null,H=null;l==="ready"&&(e.program!==a.readyProgram&&(a.readyProgram=e.program,a.readySince=o),(a.readyShown==null||o-a.readySince>=c.debounceMs)&&(a.readyShown=e.remaining),H=a.readyShown);let x={heating:d&&de.has(e.phase),cooling:Xe.has(e.phase)&&(d||l==="done"),antiCrease:e.phase==="anti_crease",keepWarm:e.phase==="keeping_warm",rinsing:e.status==="autocleaning",spin:e.phase==="spin",drain:e.phase==="drain",almostDone:M,doorOpen:e.door===!0,smartGridWait:l==="scheduled"&&e.smartGrid===!0,remote:e.remote===!0,mobileStart:e.mobileStart===!0,light:e.light},E=e.buttons,Ae={pause:l==="running"&&E.pause==="available",resume:l==="paused"&&E.start==="available",start:l==="ready"&&E.start==="available",stop:T.has(l)&&E.stop==="available",disabled:Object.entries(E).filter(([,b])=>b==="disabled").map(([b])=>b)},He=(s.kind==="dryer"||s.kind==="washer_dryer")&&h&&(e.dryingStep||a.reachedDry)?{target:e.dryingStep,reached:a.reachedDry}:null;return{state:l,phase:m,program:p,programType:e.programType,stale:i,connection:r,guessed:n,progress:{mode:y,value:k},leftSec:u,endAt:O,startAt:w,flags:x,dryness:He,lcd:this._lcd({state:l,mode:y,leftSec:u,almostDone:M,readyDur:H,startAt:w,snap:e,program:p,phase:m,flags:x}),temps:{current:e.temp,target:e.targetTemp,core:e.coreTemp,coreTarget:e.coreTarget,unit:e.tempUnit},elapsedMin:e.elapsed,pausedSec:Math.round(S),controls:Ae}}_lcd({state:e,mode:o,leftSec:i,almostDone:r,readyDur:n,startAt:s,snap:c,program:l,phase:f,flags:a}){let d=this.family.group;switch(e){case"off":return{main:{kind:"dashes"},sub:null};case"standby":return{main:{kind:"blank"},sub:null};case"ready":return{main:n?{kind:"duration",value:n*60}:{kind:"blank"},sub:{kind:"text",value:"ready"}};case"scheduled":return{main:s?{kind:"clock",value:s}:{kind:"dashes"},sub:{kind:"text",value:a.smartGridWait?"smart_grid":"starts"}};case"done":return{main:{kind:"text",value:"end"},sub:f?{kind:"phase",value:f}:null};case"interrupted":return{main:{kind:"text",value:"interrupted"},sub:null};case"error":return{main:{kind:"text",value:"error"},sub:null}}let h=e==="paused"?{kind:"text",value:"paused"}:null;return r?{main:{kind:"text",value:"almost_done"},sub:h??{kind:"percent"}}:o==="time"?{main:{kind:"countdown",value:i},sub:h??{kind:"percent"}}:o==="heat"?{main:{kind:"temp",value:c.temp},sub:h??{kind:"text",value:"heating"}}:o==="at_temp"?{main:{kind:"temp",value:c.temp},sub:h??(c.elapsed!=null?{kind:"elapsed",value:c.elapsed}:{kind:"text",value:"at_temp"})}:d==="coffee"?{main:a.rinsing?{kind:"text",value:"rinsing"}:l?{kind:"program",value:l}:{kind:"blank"},sub:f?{kind:"phase",value:f}:h}:d==="drawer"&&c.temp!=null?{main:{kind:"temp",value:c.temp},sub:f?{kind:"phase",value:f}:h}:c.elapsed!=null?{main:{kind:"elapsed",value:c.elapsed},sub:h}:{main:l?{kind:"program",value:l}:{kind:"blank"},sub:h}}};var Y=()=>typeof globalThis.__MIELE_NOW__=="function"?globalThis.__MIELE_NOW__():Date.now();var Qe={state:{off:"Uit",offline:"Niet verbonden",standby:"Aan",ready:"Klaar om te starten",scheduled:"Gepland",running:"Bezig",paused:"Gepauzeerd",done:"Klaar",interrupted:"Onderbroken",error:"Storing"},lcd:{ready:"Klaar",starts:"Start om",smart_grid:"Slim starten",end:"Einde",interrupted:"Onderbroken",error:"Storing",almost_done:"Bijna klaar",heating:"Opwarmen",at_temp:"Op temperatuur",paused:"Pauze",rinsing:"Spoelen",offline:"Geen verbinding",drinks:"Dranken"},row:{program:"Programma",temp:"Temperatuur",spin:"Centrifuge",dryness:"Droogtegraad",ends:"Klaar om",ended:"Klaar om",duration:"Duur",starts:"Start om",elapsed:"Verstreken",core:"Kerntemperatuur"},pill:{almost_done:"Bijna klaar",smart_grid:"Wacht op slim starten",lost:"Geen verbinding",door_open:"Deur open",drawer_open:"Lade open"},btn:{pause:"Pauzeren",resume:"Hervatten",start:"Starten",stop:"Stoppen",off:"Uitzetten",on:"Aanzetten",cancel:"Annuleren"},ask:{stop:"{name} stoppen? Het programma wordt afgebroken.",off:"{name} uitzetten?",off_running:"{name} uitzetten? Het programma stopt.",start:"{program} starten op de {name}?"},icon:{remote:"Bediening op afstand",mobile:"Start op afstand",door_open:"Deur open",door_closed:"Deur dicht",door_locked:"Deur vergrendeld",lost:"Geen verbinding, laatste toestand",light:"Licht aan/uit"},err:{send:"Niet verstuurd: {msg}",no_device:"Geen Miele-toestel gevonden. Kies een toestel in de kaartinstellingen."},unit:{rpm:"tpm",min:"min"},kind:{washer:"Wasmachine",dryer:"Droogkast",washer_dryer:"Was-droogcombinatie",dishwasher:"Vaatwasser",oven:"Oven",steam_oven:"Stoomoven",steam_oven_combi:"Stoomoven",steam_oven_micro:"Stoomoven met microgolf",dialog_oven:"Dialog-oven",oven_microwave:"Oven met microgolf",microwave:"Microgolfoven",coffee:"Koffiemachine",drawer:"Warmhoudlade",hob:"Kookplaat",hood:"Dampkap",fridge:"Koelkast",wine:"Wijnkast",vacuum:"Robotstofzuiger",other:"Miele-toestel"}},X={state:{off:"Off",offline:"Not connected",standby:"On",ready:"Ready to start",scheduled:"Scheduled",running:"Running",paused:"Paused",done:"Finished",interrupted:"Interrupted",error:"Fault"},lcd:{ready:"Ready",starts:"Starts at",smart_grid:"Smart start",end:"End",interrupted:"Interrupted",error:"Fault",almost_done:"Almost done",heating:"Heating up",at_temp:"At temperature",paused:"Paused",rinsing:"Rinsing",offline:"No connection",drinks:"Drinks"},row:{program:"Programme",temp:"Temperature",spin:"Spin",dryness:"Dryness",ends:"Ends at",ended:"Ended at",duration:"Duration",starts:"Starts at",elapsed:"Elapsed",core:"Core temperature"},pill:{almost_done:"Almost done",smart_grid:"Waiting for smart start",lost:"No connection",door_open:"Door open",drawer_open:"Drawer open"},btn:{pause:"Pause",resume:"Resume",start:"Start",stop:"Stop",off:"Switch off",on:"Switch on",cancel:"Cancel"},ask:{stop:"Stop the {name}? This cancels the programme.",off:"Switch the {name} off?",off_running:"Switch the {name} off? The programme stops.",start:"Start {program} on the {name}?"},icon:{remote:"Remote control",mobile:"Remote start",door_open:"Door open",door_closed:"Door closed",door_locked:"Door locked",lost:"No connection, last known state",light:"Light on/off"},err:{send:"Not sent: {msg}",no_device:"No Miele appliance found. Pick one in the card settings."},unit:{rpm:"rpm",min:"min"},kind:{washer:"Washing machine",dryer:"Tumble dryer",washer_dryer:"Washer dryer",dishwasher:"Dishwasher",oven:"Oven",steam_oven:"Steam oven",steam_oven_combi:"Steam oven",steam_oven_micro:"Steam oven with microwave",dialog_oven:"Dialog oven",oven_microwave:"Oven with microwave",microwave:"Microwave",coffee:"Coffee machine",drawer:"Warming drawer",hob:"Hob",hood:"Cooker hood",fridge:"Fridge",wine:"Wine cabinet",vacuum:"Robot vacuum",other:"Miele appliance"}},ge={nl:Qe,en:X},ue=(t,e)=>{let o=String(e?.language||t?.locale?.language||t?.language||"en").slice(0,2).toLowerCase();return ge[o]?o:"en"};function me(t,e,o){let i=e.split(".").reduce((r,n)=>r?.[n],ge[t]??X)??e.split(".").reduce((r,n)=>r?.[n],X)??e;return o?i.replace(/\{(\w+)\}/g,(r,n)=>o[n]??""):i}var et={status:{autocleaning:["Automatic cleaning","Automatisch spoelen"],reserved:["Reserved","Gereserveerd"],supercooling:["Supercooling","SuperKoelen"],superfreezing:["Superfreezing","SuperVriezen"],supercooling_superfreezing:["Supercooling/superfreezing","SuperKoelen/SuperVriezen"],superheating:["Superheating","Snel opwarmen"]},phase:{"2nd_espresso":["2nd espresso coffee","2e espresso"],"2nd_grinding":["2nd grinding","2e keer malen"],"2nd_pre_brewing":["2nd pre-brewing","2e voorbrouwen"],comfort_cooling:["Comfort cooling","Comfortkoeling"],cooling_phase:["Cooling phase","Afkoelen"],dispensing:["Dispensing","Uitschenken"],dust_box_missing:["Missing dust box","Stofbox ontbreekt"],energy_save:["Energy save","Energiebesparing"],espresso:["Espresso coffee","Espresso"],final_rinse:["Final rinse","Laatste spoeling"],flex_load_active:["FlexLoad active","FlexLoad actief"],freshen_up_and_moisten:["Freshen up & moisten","Opfrissen en bevochtigen"],going_to_target_area:["Going to target area","Onderweg naar doelzone"],grinding:["Grinding","Malen"],hand_iron:["Hand iron","Strijkdroog"],hygiene_drying:["Hygiene drying","Hygi\xEBnisch drogen"],interim_rinse:["Interim rinse","Tussenspoeling"],keep_warm:["Keep warm","Warmhouden"],keeping_warm:["Keeping warm","Warmhouden"],milk_foam:["Milk foam","Melkschuim"],moisten:["Moisten","Bevochtigen"],motor_overload:["Check dust box and filter","Controleer stofbox en filter"],perfect_dry_active:["PerfectDry active","PerfectDry actief"],pre_brewing:["Pre-brewing","Voorbrouwen"],pre_dishwash:["Pre-cleaning","Voorreinigen"],process_finished:["Process finished","Klaar"],process_running:["Process running","Bezig"],program_running:["Program running","Programma loopt"],reactivating:["Reactivating","Opnieuw starten"],remote_controlled:["Remote controlled","Op afstand bediend"],rinse_out_lint:["Rinse out lint","Pluizen uitspoelen"],rinses:["Rinses","Spoelen"],roasting:["Roasting","Braden"],safety_cooling:["Safety cooling","Veiligheidskoeling"],searing:["Searing","Aanbraden"],slightly_dry:["Slightly dry","Licht droog"],slow_roasting:["Slow roasting","Lagetemperatuurgaren"],soak:["Soak","Inweken"],starch_stop:["Starch stop","Stijfselstop"],steam_reduction:["Steam reduction","Stoomreductie"],steam_smoothing:["Steam smoothing","Stoomgladmaken"],thermo_spin:["Thermo spin","ThermoSpin"],timed_drying:["Timed drying","Drogen op tijd"],venting:["Venting","Ontluchten"],waiting_for_start:["Waiting for start","Wacht op start"],warm_cups_glasses:["Warm cups/glasses","Kopjes en glazen voorverwarmen"],warm_dishes_plates:["Warm dishes/plates","Borden voorverwarmen"],wheel_lifted:["Wheel lifted","Wiel opgetild"]},program:{clean_machine:["Clean machine","Machine reinigen"],easy_care:["Easy care","Onderhoudsarm"],freshen_up:["Freshen up","Opfrissen"],outdoor_garments:["Outdoor garments","Outdoorkleding"],rinse_out_lint:["Rinse out lint","Pluizen uitspoelen"],separate_rinse_starch:["Separate rinse/starch","Apart spoelen/stijven"],steam_care:["Steam care","Stoomverzorging"],stuffed_toys:["Stuffed toys","Knuffels"],towels:["Towels","Handdoeken"],trainers_refresh:["Trainers refresh","Sportschoenen opfrissen"],downs_duvets:["Downs/Duvets","Dons/dekbedden"],pillows_sanitize:["Pillows sanitize","Kussens hygi\xEBne"],steam_smoothing:["Steam smoothing","Stoomgladmaken"],fan_plus:["Fan plus","Hetelucht plus"],conventional_heat:["Conventional heat","Boven- en onderwarmte"],intensive_bake:["Intensive bake","Intensief bakken"],fan_grill:["Fan grill","Grill met circulatie"],eco_fan_heat:["ECO fan heat","ECO hetelucht"],top_heat:["Top heat","Bovenwarmte"],steam_cooking:["Steam cooking","Stoomgaren"],rapid_steam_cooking:["Rapid steam cooking","Snel stoomgaren"],reheating_with_steam:["Reheating with steam","Opwarmen met stoom"],moisture_plus_fan_plus:["Moisture plus + Fan plus","Klimaatgaren + hetelucht plus"],keeping_warm:["Keeping warm","Warmhouden"],descale:["Descale","Ontkalken"],microwave_fan_plus:["Microwave + Fan plus","Microgolf + hetelucht plus"],microwave_fan_grill:["Microwave + Fan grill","Microgolf + grill met circulatie"],microwave_auto_roast:["Microwave + Auto roast","Microgolf + automatisch braden"],reheating_with_microwave:["Reheating with microwave","Opwarmen met microgolf"],auto_roast:["Auto roast","Automatisch braden"],low_temperature_cooking:["Low temperature cooking","Lagetemperatuurgaren"],appliance_settings:["Appliance settings menu","Instellingen"],brewing_unit_degrease:["Brewing unit degrease","Zetgroep ontvetten"],coffee_pot:["Coffee pot","Koffiepot"],descaling:["Appliance descaling","Ontkalken"],fruit_tea:["Fruit tea","Vruchtenthee"],herbal_tea:["Herbal tea","Kruidenthee"],intermediate_rinsing:["Intermediate rinsing","Tussentijds spoelen"],long_coffee:["Long coffee","Lange koffie"],very_hot_water:["Very hot water","Zeer heet water"],white_tea:["White tea","Witte thee"],evaporate_water:["Evaporate water","Water verdampen"],quick_microwave:["","Snel microgolf"],microwave_grill:["","Microgolf + grill"],keep_warm:["","Warmhouden"],slow_roasting:["","Lagetemperatuurgaren"],warm_cups_glasses:["","Kopjes en glazen voorverwarmen"],warm_dishes_plates:["","Borden voorverwarmen"]}};function L(t,e,o,i){if(o==null)return"";let r={program:"program_id",phase:"program_phase",dryness:"drying_step",status:"status"}[e],n=t?.localize?.(`component.miele.entity.sensor.${r}.state.${o}`),s=i==="nl"?et[e]?.[o]:null;return s&&(!n||n===s[0])?s[1]:n||String(o).replace(/_/g," ").replace(/^./,c=>c.toUpperCase())}var Q={ratio:"600/850",view:"0 0 600 850",window:{x:50,y:43.53,d:50},ring:{path:"M300 132 A238 238 0 1 1 300 608 A238 238 0 1 1 300 132",width:8.5,spin:{x:50,y:43.53,d:79.4}},lcd:{x:36.33,y:3.06,w:27.33,h:7.53},icons:{size:5.8,at:[[9,7.4],[16,7.4],[23,7.4]]},panel:{left:4.5,right:4.5,top:75.6,bottom:5.4}},g=t=>`var(--f-${t})`;function tt(t,e){let o=[26,20,30,22,28,18,24],i="";return o.forEach((r,n)=>{let s=e-27+n*9,c=o[6-n];i+=`<rect x="${t-40-r}" y="${s-1.1}" width="${r}" height="2.2" rx="1.1"/><circle cx="${t-34}" cy="${s}" r="1.3"/>`,i+=`<rect x="${t+40}" y="${s-1.1}" width="${c}" height="2.2" rx="1.1"/><circle cx="${t+34}" cy="${s}" r="1.3"/>`}),i}var ot=(t,e,o,i,r)=>`<rect x="${t}" y="${e}" width="${o}" height="${i}" rx="${i/2}" fill="${r("slot")}"/>
  <path d="M${t+i/2} ${e+1.2} H${t+o-i/2}" stroke="#000" stroke-opacity=".18" stroke-width="2" stroke-linecap="round"/>`,J=(t,e,o)=>`<circle cx="${t}" cy="${e}" r="10.5" fill="${o("knob")}" style="stroke:${g("edge")}" stroke-width="1.4"/>`;function ee(t,e=!1){let o=r=>`url(#${t}-${r})`,i="M10 18 H590 V127 H214 C209 150 190 168 152 170 H10 Z";return`<svg class="art-svg" viewBox="0 0 600 850" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
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
  <clipPath id="${t}-top"><path d="${i}"/></clipPath>
</defs>

<ellipse cx="300" cy="842" rx="292" ry="8" fill="${o("ground")}"/>

<g class="body">
  <rect x="10" y="8" width="580" height="830" rx="10" fill="${o("body")}"/>
  <rect x="10" y="8" width="580" height="830" rx="10" fill="${o("sheen")}"/>
  <rect x="10.5" y="8.5" width="579" height="829" rx="10" fill="none" style="stroke:${g("edge")}" stroke-width="1.3"/>
  <path d="M14 10 H586" stroke="#fff" stroke-opacity=".6" stroke-width="1.4"/>
  <path d="M10 18 H590" style="stroke:${g("edge")}" stroke-opacity=".7" stroke-width="1.1"/>
</g>

<g class="controls">
  <path d="${i}" fill="${o("panel")}"/>
  <path d="M214 127 C209 150 190 168 152 170 H10 V188 H152 C200 186 226 160 232 145 H590 V127 Z" fill="${o("under")}"/>
  <path d="M590 127 H214 C209 150 190 168 152 170 H10" fill="none" style="stroke:${g("edge")}" stroke-width="1.3"/>
  <path d="M207 19 V110" style="stroke:${g("edge")}" stroke-opacity=".75" stroke-width="1.1"/>
  ${ot(44,128,110,24,o)}
  <rect x="218" y="26" width="164" height="64" rx="6" fill="${o("screen")}"/>
  <path d="M222 29 H378 L362 46 H222 Z" fill="#fff" opacity=".045"/>
  <g style="fill:${g("ink")}" opacity=".26">${tt(486,50)}</g>
  <circle cx="486" cy="50" r="26" fill="${o("chrome")}"/>
  <circle cx="486" cy="50" r="22.5" fill="${o("chromeIn")}"/>
  <circle cx="486" cy="50" r="19" fill="${o("knob")}" stroke="#000" stroke-opacity=".08"/>
  <path d="M480.5 59.5 L476.5 66.5" stroke="#f2a33a" stroke-width="3.4" stroke-linecap="round"/>
</g>

<g class="door">
  <circle cx="303" cy="377" r="238" fill="${o("shadow")}"/>
  <circle cx="300" cy="370" r="228" fill="${o("chrome")}"/>
  <circle cx="300" cy="370" r="214" fill="${o("chromeIn")}"/>
  <circle cx="300" cy="370" r="186" fill="#8d959c"/>
  <circle cx="300" cy="370" r="183" fill="${o("bezel")}"/>
  <circle cx="300" cy="370" r="151" fill="${o("glass")}"/>
  <path d="${e?"M370.6 218.6 A167 167 0 0 1 447.4 291.6":"M148.6 299.4 A167 167 0 0 1 216.5 225.4"}" fill="none" stroke="#f2a33a" stroke-width="8" stroke-linecap="round"/>
  <path d="M520 334 a228 228 0 0 1 0 72" fill="none" stroke="#000" stroke-opacity=".22" stroke-width="7" stroke-linecap="round"/>
  <path d="M110 250 a222 222 0 0 1 150 -100" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="3.5" stroke-linecap="round"/>
</g>

<g class="lower">
  ${e?`<rect x="30" y="646" width="236" height="154" rx="8" fill="${o("flap")}" style="stroke:${g("edge")}" stroke-width="1.3"/>
  ${J(148,722,o)}
  <rect x="274" y="646" width="296" height="154" rx="8" fill="${o("flap")}" style="stroke:${g("edge")}" stroke-width="1.3"/>
  <g style="fill:${g("lo")}">${Array.from({length:13},(r,n)=>`<rect x="290" y="${660+n*10.4}" width="264" height="5" rx="2.5"/>`).join("")}</g>
  <g fill="#000" opacity=".1">${Array.from({length:13},(r,n)=>`<rect x="290" y="${660+n*10.4}" width="264" height="1.6" rx=".8"/>`).join("")}</g>`:`<rect x="35" y="646" width="180" height="152" rx="8" fill="${o("flap")}" style="stroke:${g("edge")}" stroke-width="1.3"/>
  ${J(125,672,o)}
  <rect x="272" y="646" width="292" height="152" rx="8" fill="${o("flap")}" style="stroke:${g("edge")}" stroke-width="1.3"/>
  ${J(418,672,o)}`}
  <rect x="10" y="810" width="580" height="28" rx="6" style="fill:${g("lo")}"/>
  <path d="M12 810.5 H588" style="stroke:${g("edge")}" stroke-width="1.2"/>
  <rect x="10" y="830" width="580" height="8" rx="4" fill="#000" opacity=".22"/>
</g>
</svg>`}var it=t=>`<pattern id="${t}-hex" width="13" height="22.5" patternUnits="userSpaceOnUse" patternTransform="rotate(8)">
  <path d="M6.5 0 L13 3.75 L13 11.25 L6.5 15 L0 11.25 L0 3.75 Z M6.5 15 V22.5" fill="none" stroke="#000" stroke-opacity=".14" stroke-width=".9"/>
  <path d="M6.5 1.2 L11.8 4.3" stroke="#fff" stroke-opacity=".35" stroke-width=".8"/>
</pattern>`,rt=t=>`<pattern id="${t}-hex" width="7" height="12.12" patternUnits="userSpaceOnUse" patternTransform="rotate(8)">
  <circle cx="3.5" cy="3" r="1.25" fill="#000" fill-opacity=".38"/><circle cx="0" cy="9.06" r="1.25" fill="#000" fill-opacity=".38"/><circle cx="7" cy="9.06" r="1.25" fill="#000" fill-opacity=".38"/>
</pattern>`,st=(t,e)=>`<svg viewBox="0 0 200 200" aria-hidden="true"><defs>
  <radialGradient id="${t}-steel" cx=".5" cy=".46" r=".56">
    <stop offset="0" stop-color="#e3e6e9"/><stop offset=".4" stop-color="#c3c8cd"/><stop offset=".78" stop-color="#8e959b"/><stop offset="1" stop-color="#4e5459"/>
  </radialGradient>
  <linearGradient id="${t}-lifter" x1="0" x2="1"><stop offset="0" stop-color="#f4f6f7"/><stop offset="1" stop-color="#a9b0b6"/></linearGradient>
  ${e?rt(t):it(t)}</defs>
  <circle cx="100" cy="100" r="100" fill="url(#${t}-steel)"/>
  <circle cx="100" cy="100" r="94" fill="url(#${t}-hex)"/>
  <circle cx="100" cy="100" r="58" fill="none" stroke="#000" stroke-opacity=".1" stroke-width="10"/>
  <g fill="url(#${t}-lifter)" stroke="#000" stroke-opacity=".16" stroke-width=".8">
    <path d="M92 8 C96 26 104 34 116 38 L110 8 Z"/><path d="M92 8 C96 26 104 34 116 38 L110 8 Z" transform="rotate(120 100 100)"/><path d="M92 8 C96 26 104 34 116 38 L110 8 Z" transform="rotate(240 100 100)"/>
  </g>
  <circle cx="100" cy="100" r="15" fill="#cfd3d7" stroke="#000" stroke-opacity=".18"/><circle cx="100" cy="100" r="6" fill="#9aa1a7"/></svg>`,nt=(t,e)=>{let o=e?["#7d8fa3","#e9e5dc","#c3958c","#a9b0b8","#8f9e86","#ddd6c8"]:["#3f5a78","#e7e3db","#b98582","#8b929a","#86a084","#d8d2c6"];return`<svg viewBox="0 0 200 200" aria-hidden="true"><defs>
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
  <path d="M58 136 L66 128 M110 113 L104 122" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="1.4" stroke-linecap="round"/></svg>`},at=t=>`<svg viewBox="0 0 400 200" preserveAspectRatio="none" aria-hidden="true"><defs>
  <linearGradient id="${t}-water" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#7fb8e6" stop-opacity=".55"/><stop offset="1" stop-color="#2d6aa3" stop-opacity=".62"/></linearGradient></defs>
  <path d="M0 132 C25 124 50 140 75 132 S125 124 150 132 S200 140 225 132 S275 124 300 132 S350 140 375 132 S400 128 400 128 V200 H0 Z" fill="url(#${t}-water)"/>
  <path d="M0 132 C25 124 50 140 75 132 S125 124 150 132 S200 140 225 132 S275 124 300 132 S350 140 375 132" fill="none" stroke="#d8ecfb" stroke-opacity=".5" stroke-width="1.6"/></svg>`,lt=t=>`<svg viewBox="0 0 200 200" aria-hidden="true"><defs>
  <radialGradient id="${t}-vig" cx=".5" cy=".5" r=".5"><stop offset=".72" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".45"/></radialGradient>
  <linearGradient id="${t}-shine" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".26"/><stop offset=".45" stop-color="#fff" stop-opacity=".03"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient></defs>
  <circle cx="100" cy="100" r="100" fill="#0d1218" opacity=".1"/>
  <circle cx="100" cy="100" r="100" fill="url(#${t}-vig)"/>
  <path d="M30 70 A80 80 0 0 1 112 22 A92 92 0 0 0 46 96 Z" fill="url(#${t}-shine)"/></svg>`;function te(t,e=!1){return`<div class="layer drum">${st(t,e)}</div>
    <div class="layer laundry">${nt(t,e)}</div>
    ${e?'<div class="layer heat"></div><div class="layer chill"></div>':`<div class="layer water"><div class="wave">${at(t)}</div></div>`}
    <div class="layer led"></div>
    <div class="layer reflect">${lt(t)}</div>`}var R=t=>`var(--f-${t})`;function j(t,e,o,i,r){return`M${t+o/2} ${e} H${t+o-r} A${r} ${r} 0 0 1 ${t+o} ${e+r} V${e+i-r} A${r} ${r} 0 0 1 ${t+o-r} ${e+i} H${t+r} A${r} ${r} 0 0 1 ${t} ${e+i-r} V${e+r} A${r} ${r} 0 0 1 ${t+r} ${e} Z`}var oe=t=>({ratio:"600/456",view:"0 0 600 456",window:{left:17,top:44.96,width:66,height:36.62,radius:"1.6% / 3.8%"},ring:{path:j(92,195,416,187,14),width:6},lcd:t?{x:41.5,y:11,w:17,h:7.6}:{x:34,y:5.26,w:32,h:15.35},icons:{size:4.2,at:[[78,9],[83,9],[88,9],[93,9]]},panel:null}),ct=(t,e)=>{let o=[118,146,168,400,424,448,472];return`<path d="M84 ${t} H516" style="stroke:${e}" stroke-opacity=".28" stroke-width="1.2"/>
  <circle cx="104" cy="${t-10}" r="6.5" fill="none" style="stroke:${e}" stroke-opacity=".6" stroke-width="1.6"/>
  <path d="M104 ${t-16} v5" style="stroke:${e}" stroke-opacity=".6" stroke-width="1.6" stroke-linecap="round"/>
  ${o.map(i=>`<rect x="${i-4}" y="${t-14}" width="8" height="8" rx="2" fill="none" style="stroke:${e}" stroke-opacity=".45" stroke-width="1.2"/>`).join("")}
  <g style="fill:${e}" opacity=".35">${Array.from({length:28},(i,r)=>`<rect x="${226+r*5.4}" y="${t-11}" width="1.6" height="3" rx=".8"/>`).join("")}</g>`},dt=t=>Array.from({length:8},(e,o)=>{let i=146+o*38;return`<rect x="${i}" y="24" width="24" height="17" rx="3" fill="none" style="stroke:${t}" stroke-opacity=".9" stroke-width="1.5"/>
    <path d="M${i+6} ${o%2?31:34} h12 M${i+6} ${o%2?35:30} h7" style="stroke:${t}" stroke-opacity=".8" stroke-width="1.3" stroke-linecap="round"/>`}).join("");function ie(t,e=!1){let o=n=>`url(#${t}-${n})`,i=R("ink"),r=e?{x:249,y:50,w:102,h:35}:{x:204,y:24,w:192,h:70};return`<svg class="art-svg" viewBox="0 0 600 456" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
<defs>
  <linearGradient id="${t}-front" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" style="stop-color:${R("hi")}"/><stop offset=".45" style="stop-color:${R("mid")}"/><stop offset="1" style="stop-color:${R("lo")}"/>
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
  <rect x="1.5" y="1.5" width="597" height="453" rx="5" fill="none" style="stroke:${R("edge")}" stroke-width="1.6"/>
  <path d="M8 3 H592" stroke="#fff" stroke-opacity=".14" stroke-width="1.2"/>
</g>
<g class="controls">
  ${e?dt(i):""}
  <rect x="${r.x}" y="${r.y}" width="${r.w}" height="${r.h}" rx="${e?3:5}" fill="${o("screen")}" stroke="#fff" stroke-opacity=".06"/>
  ${ct(103,i)}
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
</svg>`}var pt=t=>`<svg viewBox="0 0 396 167" preserveAspectRatio="none" aria-hidden="true"><defs>
  <radialGradient id="${t}-wall" cx=".5" cy=".55" r=".7"><stop offset="0" stop-color="#2a2b2e"/><stop offset=".7" stop-color="#151618"/><stop offset="1" stop-color="#08090a"/></radialGradient></defs>
  <rect width="396" height="167" fill="url(#${t}-wall)"/>
  <path d="M0 0 L40 22 V145 L0 167 M396 0 L356 22 V145 L396 167 M40 22 H356 M40 145 H356" fill="none" stroke="#fff" stroke-opacity=".06" stroke-width="1.5"/>
  <path d="M6 64 H40 M356 64 H390 M6 112 H40 M356 112 H390" stroke="#9aa1a8" stroke-opacity=".35" stroke-width="3" stroke-linecap="round"/>
  <path d="M60 14 L80 8 L100 14 L120 8 L140 14 L160 8 L180 14 L200 8 L220 14 L240 8 L260 14 L280 8 L300 14 L320 8 L336 14" fill="none" stroke="#5b5f64" stroke-opacity=".7" stroke-width="2.2" stroke-linejoin="round"/></svg>`,ft=()=>`<svg viewBox="0 0 396 167" preserveAspectRatio="none" aria-hidden="true">
  <path d="M40 112 H356" stroke="#b9c0c6" stroke-opacity=".55" stroke-width="2.4"/>
  <path d="M128 112 L138 132 H258 L268 112 Z" fill="#3b3f44"/>
  <path d="M128 112 H268" stroke="#9aa1a8" stroke-width="2"/>
  <path d="M146 112 C156 92 180 86 198 88 C218 86 240 92 250 112 Z" fill="#9c6a42"/>
  <path d="M160 104 C172 96 188 94 198 96" fill="none" stroke="#e2b07a" stroke-opacity=".55" stroke-width="3" stroke-linecap="round"/></svg>`,re=t=>`<div class="layer w"><svg viewBox="0 0 396 167" preserveAspectRatio="none" aria-hidden="true">
  <path d="${t}" fill="none" stroke="#f2f5f7" stroke-opacity=".5" stroke-width="7" stroke-linecap="round"/></svg></div>`,se=()=>`<div class="layer wv"><svg viewBox="0 0 396 167" aria-hidden="true">
  <circle cx="198" cy="84" r="34" fill="none" stroke="#9fd3ff" stroke-opacity=".75" stroke-width="3"/></svg></div>`,ht=(t,e)=>`<svg viewBox="0 0 396 167" preserveAspectRatio="none" aria-hidden="true"><defs>
  ${e?`<pattern id="${t}-mesh" width="4" height="4" patternUnits="userSpaceOnUse"><path d="M0 0 H4 M0 0 V4" stroke="#000" stroke-opacity=".55" stroke-width="1.3"/></pattern>`:`<pattern id="${t}-mesh" width="5" height="5" patternUnits="userSpaceOnUse"><circle cx="2.5" cy="2.5" r=".95" fill="#000" fill-opacity=".45"/></pattern>`}
  <linearGradient id="${t}-refl" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".1"/><stop offset=".4" stop-color="#fff" stop-opacity=".02"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient></defs>
  <rect width="396" height="167" fill="url(#${t}-mesh)"/>
  <rect width="396" height="167" fill="url(#${t}-refl)"/></svg>`;function ne(t,e=!1){return`<div class="layer cavity">${pt(t)}</div>
    <div class="layer dish">${ft()}</div>
    <div class="layer glow"></div>
    <div class="layer light"></div>
    <div class="layer steam">${re("M150 100 C140 80 162 66 150 46 S156 18 148 6")}${re("M200 104 C210 82 188 66 200 44 S192 18 202 4")}${re("M250 100 C240 78 262 64 248 42 S256 20 246 6")}</div>
    ${e?`<div class="layer waves">${se()}${se()}${se()}</div>`:""}
    <div class="layer print">${ht(t,e)}</div>`}var $=t=>`var(--f-${t})`,ye={ratio:"600/620",view:"0 0 600 620",window:{left:36.67,top:48.39,width:53.33,height:41.94,radius:"4% / 5%"},ring:{path:j(212,292,336,276,18),width:4.5},lcd:{x:55,y:10,w:16.67,h:12.58},icons:{size:4.4,at:[[78,13.5],[82.6,13.5],[87.2,13.5],[91.8,13.5]]},panel:null};function we(t){let e=o=>`url(#${t}-${o})`;return`<svg class="art-svg" viewBox="0 0 600 620" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
<defs>
  <linearGradient id="${t}-body" x1="0" x2="1">
    <stop offset="0" style="stop-color:${$("lo")}"/><stop offset=".3" style="stop-color:${$("mid")}"/><stop offset=".7" style="stop-color:${$("mid")}"/><stop offset="1" style="stop-color:${$("lo")}"/>
  </linearGradient>
  <linearGradient id="${t}-block" x1="0" x2="0" y1="0" y2="1">
    <stop offset="0" style="stop-color:${$("mid")}"/><stop offset="1" style="stop-color:${$("edge")}"/>
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
  <rect x="300" y="8" width="160" height="18" rx="5" style="fill:${$("lo")};stroke:${$("edge")}" stroke-width="1.2"/>
  <rect x="190" y="196" width="380" height="408" rx="10" fill="${e("body")}"/>
  <rect x="190.5" y="196.5" width="379" height="407" rx="10" fill="none" style="stroke:${$("edge")}" stroke-width="1.4"/>
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
  <circle cx="214" cy="182" r="9" fill="none" style="stroke:${$("ink")}" stroke-opacity=".8" stroke-width="1.6"/>
  <path d="M214 175 v5" style="stroke:${$("ink")}" stroke-opacity=".8" stroke-width="1.6" stroke-linecap="round"/>
  <path d="M374 182 h9 a5 5 0 0 1 0 10 h-7 M378 178 l-4 4 l4 4" fill="none" style="stroke:${$("ink")}" stroke-opacity=".75" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
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
</svg>`}function _e(t){return`<div class="layer cuplight"></div>
    <div class="layer cup"><svg viewBox="0 0 320 260" aria-hidden="true"><defs>
      <clipPath id="${t}-cupin"><path d="M126 120 H194 L188 236 a8 8 0 0 1 -8 8 H140 a8 8 0 0 1 -8 -8 Z"/></clipPath></defs>
      <g clip-path="url(#${t}-cupin)"><g class="fill"><rect x="120" y="150" width="80" height="100" fill="#6b4226"/><rect x="120" y="130" width="80" height="24" fill="#efe6da"/></g></g>
      <path d="M126 120 H194 L188 236 a8 8 0 0 1 -8 8 H140 a8 8 0 0 1 -8 -8 Z" fill="#fff" fill-opacity=".07" stroke="#fff" stroke-opacity=".55" stroke-width="2"/>
      <path d="M132 128 L138 232" stroke="#fff" stroke-opacity=".35" stroke-width="3" stroke-linecap="round"/></svg></div>
    <div class="layer stream"><div class="jet"></div><div class="jet two"></div></div>
    <div class="layer steam">
      <div class="layer w"><svg viewBox="0 0 320 260" aria-hidden="true"><path d="M150 112 C142 96 160 86 150 70 S154 50 148 40" fill="none" stroke="#fff" stroke-opacity=".45" stroke-width="5" stroke-linecap="round"/></svg></div>
      <div class="layer w"><svg viewBox="0 0 320 260" aria-hidden="true"><path d="M172 112 C180 94 162 84 172 68 S168 48 174 38" fill="none" stroke="#fff" stroke-opacity=".45" stroke-width="5" stroke-linecap="round"/></svg></div></div>
    <div class="layer drops">${[146,160,174].map(e=>`<div class="layer d"><svg viewBox="0 0 320 260" aria-hidden="true"><path d="M${e} 10 c3 6 5 9 5 12 a5 5 0 0 1 -10 0 c0 -3 2 -6 5 -12 Z" fill="#cfe6f7" fill-opacity=".8"/></svg></div>`).join("")}</div>`}var z=t=>`var(--f-${t})`,ve={ratio:"600/292",view:"0 0 600 292",window:{left:0,top:0,width:100,height:100,radius:"0.8% / 1.7%"},ring:{path:j(4,4,592,284,7),width:3.5},lcd:{x:35,y:36,w:30,h:28,ghost:!0},icons:{size:4.4,at:[[5.5,14],[10.3,14],[15.1,14]]},panel:null},ke=t=>`<svg class="art-svg" viewBox="0 0 600 292" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
<defs><linearGradient id="${t}-in" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#2a1e14"/><stop offset=".25" stop-color="#0c0b0a"/><stop offset="1" stop-color="#050505"/></linearGradient></defs>
<rect x="0" y="0" width="600" height="292" rx="5" fill="url(#${t}-in)"/>
<rect x="8" y="4" width="584" height="34" rx="3" fill="#060607" stroke="#fff" stroke-opacity=".08"/>
<g fill="none" stroke="#d8dce0" stroke-opacity=".75" stroke-width="1.5" stroke-linecap="round">
  <circle cx="150" cy="21" r="6"/><path d="M150 14 v5"/><rect x="200" y="14" width="9" height="14" rx="2"/><path d="M250 16 h12 M250 21 h12 M250 26 h12"/>
  <path d="M318 17 h9 v5 a4.5 4.5 0 0 1 -9 0 Z"/><path d="M352 25 h14"/><path d="M420 14 v9 a3 3 0 1 0 1 0"/></g>
<path d="M384 26 c0 -4 4 -4 4 -8 M390 26 c0 -4 4 -4 4 -8 M396 26 c0 -4 4 -4 4 -8" fill="none" stroke="#f2a33a" stroke-width="1.8" stroke-linecap="round"/>
<g fill="#d8dce0" opacity=".75"><rect x="458" y="19" width="12" height="4" rx="2"/><rect x="474" y="19" width="12" height="4" rx="2"/><rect x="490" y="19" width="12" height="4" rx="2"/><rect x="522" y="19" width="12" height="4" rx="2"/></g>
<rect x="506" y="19" width="12" height="4" rx="2" fill="#f2a33a"/>
</svg>`,be=t=>`<div class="layer front"><svg viewBox="0 0 600 292" preserveAspectRatio="none" aria-hidden="true"><defs>
  <linearGradient id="${t}-df" x1="0" x2="1">
    <stop offset="0" style="stop-color:${z("lo")}"/><stop offset=".22" style="stop-color:${z("mid")}"/><stop offset=".5" style="stop-color:${z("hi")}"/>
    <stop offset=".78" style="stop-color:${z("mid")}"/><stop offset="1" style="stop-color:${z("lo")}"/>
  </linearGradient>
  <linearGradient id="${t}-dv" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".09"/><stop offset=".4" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".12"/></linearGradient></defs>
  <rect x="1" y="1" width="598" height="290" rx="5" fill="url(#${t}-df)"/>
  <rect x="1" y="1" width="598" height="290" rx="5" fill="url(#${t}-dv)"/>
  <rect x="1.5" y="1.5" width="597" height="289" rx="5" fill="none" style="stroke:${z("edge")}" stroke-width="1.6"/>
  <path d="M8 3 H592" stroke="#fff" stroke-opacity=".16" stroke-width="1.2"/></svg></div>
  <div class="layer warmline"></div>`;var gt={ratio:"600/700",view:"0 0 600 700",window:{x:50,y:52,d:44},ring:{path:"M300 202 A162 162 0 1 1 300 526 A162 162 0 1 1 300 202",width:7,spin:{x:50,y:52,d:54}},lcd:{x:30,y:7.5,w:40,h:8.5},icons:{size:6,at:[[9,22],[9,30],[9,38],[9,46]]},panel:null},ut=t=>`<svg class="art-svg" viewBox="0 0 600 700" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs>
  <linearGradient id="${t}-gb" x1="0" x2="1"><stop offset="0" style="stop-color:var(--f-lo)"/><stop offset=".45" style="stop-color:var(--f-hi)"/><stop offset="1" style="stop-color:var(--f-lo)"/></linearGradient></defs>
  <rect x="20" y="10" width="560" height="676" rx="22" fill="url(#${t}-gb)" style="stroke:var(--f-edge)" stroke-width="1.5"/>
  <path d="M22 116 H578" style="stroke:var(--f-edge)" stroke-width="1.5"/>
  <rect x="172" y="46" width="256" height="70" rx="10" fill="#0b0c0e"/>
  <circle cx="300" cy="364" r="150" style="fill:var(--f-lo);stroke:var(--f-edge)" stroke-width="3"/>
  <circle cx="300" cy="364" r="132" fill="#14181d"/></svg>`,B={washer:{svg:t=>ee(t,!1),geom:Q,window:t=>te(t,!1),display:"line"},dryer:{svg:t=>ee(t,!0),geom:Q,window:t=>te(t,!0),display:"seg"},steam_oven:{svg:t=>ie(t,!1),geom:oe(!1),window:t=>ne(t,!1),display:"oven"},microwave:{svg:t=>ie(t,!0),geom:oe(!0),window:t=>ne(t,!0),display:"oven"},coffee:{svg:we,geom:ye,window:_e,display:"menu"},drawer:{svg:ke,geom:ve,window:be},generic:{svg:ut,geom:gt,window:()=>""}},xe=t=>B[t]??B.generic;var ae={lotus_white:{hi:"#f7f6f2",mid:"#ebeae5",lo:"#d6d5cf",edge:"#bdbcb5",ink:"#6f6e68"},brilliant_white:{hi:"#ffffff",mid:"#f2f3f4",lo:"#dcdfe2",edge:"#c3c7cb",ink:"#6b7075"},pearl_beige:{hi:"#efe7db",mid:"#e0d6c6",lo:"#c8bca9",edge:"#aea28f",ink:"#6e6455"},clean_steel:{hi:"#e6e8ea",mid:"#c9cdd1",lo:"#a3a8ad",edge:"#8a9095",ink:"#4f555a"},graphite_grey:{hi:"#6e7175",mid:"#56595d",lo:"#3e4144",edge:"#2e3033",ink:"#b8bcc0"},obsidian_black:{hi:"#3b3c3f",mid:"#27282b",lo:"#18191b",edge:"#0e0e10",ink:"#8d9196"}},mt=t=>{let e=/^#?([0-9a-f]{6})$/i.exec(String(t).trim());return e?[0,2,4].map(o=>parseInt(e[1].slice(o,o+2),16)):null},q=t=>"#"+t.map(e=>Math.round(Math.max(0,Math.min(255,e))).toString(16).padStart(2,"0")).join(""),I=(t,e,o)=>t.map((i,r)=>i+(e[r]-i)*o);function yt(t){let e=mt(t);if(!e)return null;let o=(.2126*e[0]+.7152*e[1]+.0722*e[2])/255;return{hi:q(I(e,[255,255,255],.18)),mid:q(e),lo:q(I(e,[0,0,0],.16)),edge:q(I(e,[0,0,0],.32)),ink:q(o>.55?I(e,[0,0,0],.55):I(e,[255,255,255],.55))}}var $e=(t,e)=>ae[t]??yt(t)??ae[e]??ae.lotus_white,Me=t=>Object.entries(t).map(([e,o])=>`--f-${e}:${o}`).join(";");var le=`
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
.lit .cavity { opacity: 1; }
.dish { opacity: 0; transition: opacity .8s; }
.loaded .dish { opacity: 1; }
.glow { background: radial-gradient(ellipse 70% 60% at 50% 100%, #ff8a3d78, #ff8a3d00 70%), radial-gradient(ellipse 80% 45% at 50% 0%, #ff6a2a5c, #ff6a2a00 70%);
  opacity: 0; transition: opacity 1.2s; }
.f-heat .glow { opacity: .85; }
.light { background: radial-gradient(ellipse 80% 70% at 50% 0%, #ffe8c0a0, #ffe8c000 75%); opacity: 0; transition: opacity .8s; }
.lit .light { opacity: 1; }
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
.lit .cuplight { opacity: 1; }
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
`;var W=t=>String(t).padStart(2,"0");function Se(t){let e=Math.max(0,Math.round(t)),o=Math.floor(e/3600),i=Math.floor(e%3600/60),r=e%60;return o?`${o}:${W(i)}:${W(r)}`:`${i}:${W(r)}`}function N(t){let e=Math.round(t/60);return`${Math.floor(e/60)}:${W(e%60)}`}function D(t,e,o){let i=e?.locale??{},r={hour:"2-digit",minute:"2-digit"};i.time_zone==="server"&&e?.config?.time_zone&&(r.timeZone=e.config.time_zone),i.time_format==="12"?r.hour12=!0:i.time_format==="24"&&(r.hour12=!1);try{return new Intl.DateTimeFormat(o,r).format(t)}catch{return new Date(t).toTimeString().slice(0,5)}}var G=(t,e="\xB0C")=>`${Math.round(t)} ${e}`;var wt={a:"M3.2 1.6 H8.8",b:"M10.4 3.2 V8.8",c:"M10.4 11.2 V16.8",d:"M3.2 18.4 H8.8",e:"M1.6 11.2 V16.8",f:"M1.6 3.2 V8.8",g:"M3.2 10 H8.8"},_t={0:"abcdef",1:"bc",2:"abged",3:"abgcd",4:"fgbc",5:"afgcd",6:"afgedc",7:"abc",8:"abcdefg",9:"abfgcd","-":"g"," ":""};function Ce(t){let e=0,o="";for(let i of String(t)){if(i===":"){o+=`<circle cx="${e+2}" cy="6.4" r="1.25"/><circle cx="${e+2}" cy="13.6" r="1.25"/>`,e+=4.2;continue}let r=_t[i]??"";o+=`<g transform="translate(${e} 0)">${Object.entries(wt).map(([n,s])=>`<path d="${s}" class="${r.includes(n)?"on":"off"}"/>`).join("")}</g>`,e+=12.6}return`<svg viewBox="-1 0 ${e+1} 20" aria-hidden="true"><g transform="skewX(-6)">${o}</g></svg>`}var vt=`<svg viewBox="0 0 100 62" aria-hidden="true"><g fill="#c4cad0">
  <rect x="2" y="2" width="47" height="28" rx="2.5"/><rect x="51" y="2" width="47" height="28" rx="2.5"/>
  <rect x="2" y="32" width="47" height="28" rx="2.5"/><rect x="51" y="32" width="47" height="28" rx="2.5"/></g>
  <g fill="none" stroke="#3b4148" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M21 11 h8 v7 a4 4 0 0 1 -8 0 Z M29 13 h2 a2 2 0 0 1 0 4 h-2"/><path d="M69 11 h12 v6 a6 6 0 0 1 -12 0 Z M81 13 h2 a2 2 0 0 1 0 4 h-2"/>
  <path d="M19 41 h12 v7 a6 6 0 0 1 -12 0 Z M31 43 h2 a2 2 0 0 1 0 4 h-2 M21 39 c1 -2 3 -2 4 0"/><path d="M71 39 h8 l-1 14 h-6 Z M72 46 h6"/></g></svg>`,kt=`<svg viewBox="0 0 12 14" aria-hidden="true"><path d="M3 6 V4.2 a3 3 0 0 1 6 0 V6" fill="none" stroke="currentColor" stroke-width="1.5"/>
  <rect x="1.2" y="6" width="9.6" height="7" rx="1.4" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M6 8.6 v2" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>`,Le=t=>N(Math.ceil(Math.max(0,t)/60)*60),Ge={washer:"#4fa3e0",dryer:"#e9a23b",steam_oven:"#e07a4f",microwave:"#e07a4f",coffee:"#c98b5a",drawer:"#e0a84f",generic:"#4fa3e0"},F=V.filter(t=>t!=="hand_iron"),bt={basic:'<span class="t" id="lcd-t"></span><span class="s" id="lcd-s"></span>',line:'<span class="lk" id="lcd-k"></span><span class="lb" id="lcd-l"></span><span class="t" id="lcd-t"></span>',seg:'<span class="lad" id="lcd-l"></span><span class="sg" id="lcd-t"></span>',oven:'<span class="lb" id="lcd-l"></span><span class="t" id="lcd-t"></span><span class="cur" id="lcd-s"></span>',menu:'<span class="hd"><span id="lcd-l"></span><span id="lcd-k"></span></span><span class="bd" id="lcd-t"></span>'},_=t=>String(t??"").replace(/[&<>"]/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"})[e]),xt=0,K=class extends HTMLElement{static getStubConfig(e){let o=Z(e)[0];return o?{device_id:o.id}:{}}setConfig(e){if(!e)throw new Error("Invalid configuration");this._config={theme:"dark",animations:"full",controls:!0,...e},this._dev=null,this._hass&&this._init()}set hass(e){let o=!this._hass;if(this._hass=e,this._dev||this._init(),!this._dev)return;let i=Object.values(this._dev.roles);(o||i.some(r=>e.states[r]!==this._seen?.[r]))&&(this._seen=Object.fromEntries(i.map(r=>[r,e.states[r]])),this._update())}connectedCallback(){clearInterval(this._tick),this._tick=setInterval(()=>this._update(),1e3),this._hass&&!this._dev&&this._init()}disconnectedCallback(){clearInterval(this._tick)}getCardSize(){return 9}getGridOptions(){return{columns:12,min_columns:4,rows:"auto"}}_deviceId(){let e=this._config,o=this._hass;return e.device_id?e.device_id:e.entity?o.entities?.[e.entity]?.device_id??null:Z(o)[0]?.id??null}_init(){if(!this._config||!this._hass)return;let e=this._deviceId(),o=e?U(this._hass,e,{overrides:this._config.entities}):null;if(!o||!o.roles.status){this._dev=null,this._buildEmpty();return}this._dev=o,this._tracker=new P(o.family),this._seen=null,this._hass.loadBackendTranslation?.("entity","miele")?.then?.(()=>this._update(!0)),this._build(),this._update(!0)}get _lang(){return ue(this._hass,this._config)}_t(e,o){return me(this._lang,e,o)}_buildEmpty(){let e=this.shadowRoot??this.attachShadow({mode:"open"});e.innerHTML=`<style>${le}</style><ha-card class="theme-${this._themeName()}"><div class="err">${_(this._t("err.no_device"))}</div></ha-card>`}_themeName(){let e=this._config.theme;return e==="auto"?this._hass?.themes?.darkMode?"dark":"light":["dark","light","ha"].includes(e)?e:"dark"}_build(){let e=this._config,o=this._dev,i=o.family,r=this._draw=B[e.drawing]?e.drawing:i.drawing,n=xe(r),s=n.geom,c=`mc${++xt}`;this._geom=s;let l=this._style=n.display??"basic",f=$e(e.finish,i.finish),a=e.accent||Ge[r]||Ge.generic,d=this._name=e.name||this._hass.devices?.[o.id]?.name_by_user||this._t(`kind.${i.kind}`),h=s.icons.at.map(([w,H],x)=>`<div class="at icon" id="ic${x}" style="left:${w}%;top:${H}%;width:${s.icons.size}%"><ha-icon></ha-icon></div>`).join(""),p=s.window,m=p.d!=null,u=m?`class="at glass round" style="left:${p.x}%;top:${p.y}%;width:${p.d}%"`:`class="glass box" style="left:${p.left}%;top:${p.top}%;width:${p.width}%;height:${p.height}%;border-radius:${p.radius}"`,A=[0,1,2,3].map(w=>`<div class="row"><span class="k" id="k${w}"></span><span class="v" id="v${w}"></span></div>`).join(""),v=s.panel,y=v?`<div class="panel over" style="left:${v.left}%;right:${v.right}%;top:${v.top}%;bottom:${v.bottom}%">${A}</div>`:`<div class="panel below">${A}</div>`,k=e.images?`<img src="${_(String(e.images).replace(/\/?$/,"/")+i.drawing+".svg")}" alt="">`:n.svg(c),M=this.shadowRoot??this.attachShadow({mode:"open"});M.innerHTML=`<style>${le}</style>
<ha-card class="${r} ${m?"round":"flat"} theme-${this._themeName()} anim-${["full","reduced","off"].includes(e.animations)?e.animations:"full"}"
  style="--c:${_(a)};${Me(f)}${e.max_width?`;--maxw:${_(e.max_width)}`:""}">
  <div class="head"><span class="name">${_(d)}</span><span class="pill" id="pill"></span></div>
  <div class="ctl" id="ctl" hidden>
    <button id="b-pause"><ha-icon icon="mdi:pause"></ha-icon>${_(this._t("btn.pause"))}</button>
    <button id="b-resume"><ha-icon icon="mdi:play"></ha-icon>${_(this._t("btn.resume"))}</button>
    <button id="b-start"><ha-icon icon="mdi:play"></ha-icon>${_(this._t("btn.start"))}</button>
    <button id="b-stop"><ha-icon icon="mdi:stop"></ha-icon>${_(this._t("btn.stop"))}</button>
    <button id="b-power"><ha-icon icon="mdi:power"></ha-icon><span id="b-power-t"></span></button>
  </div>
  <div class="ask" id="ask" hidden><span id="ask-t"></span><button id="ask-no">${_(this._t("btn.cancel"))}</button><button class="go" id="ask-yes"></button></div>
  <div class="err" id="err"></div>
  <div class="pic" id="pic" style="--ratio:${s.ratio}">
    <div class="art">${k}</div>
    <div ${u}>${n.window(c)}<div class="phase" id="phase"></div></div>
    <svg class="ring" viewBox="${s.view}" aria-hidden="true"><path class="track" d="${s.ring.path}" pathLength="100" style="stroke-width:${s.ring.width}"/>
      <path class="bar" id="bar" d="${s.ring.path}" pathLength="100" stroke-dasharray="100" stroke-dashoffset="100" style="stroke-width:${s.ring.width}"/></svg>
    ${s.ring.spin?`<div class="at spinbox" style="left:${s.ring.spin.x}%;top:${s.ring.spin.y}%;width:${s.ring.spin.d}%"><div class="spin"><svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="48.5" pathLength="100"/></svg></div></div>`:""}
    <div class="lcd ${l}${s.lcd.ghost?" ghost":""}" style="left:${s.lcd.x}%;top:${s.lcd.y}%;width:${s.lcd.w}%;height:${s.lcd.h}%">${bt[l]}</div>
    ${h}
    ${v?y:""}
  </div>
  ${v?"":y}
</ha-card>`,this._root=M.querySelector("ha-card"),this._el=w=>M.getElementById(w),this._text={};let S=w=>()=>this._call("button","press",{entity_id:this._dev.roles[w]});this._el("b-pause").onclick=S("btn_pause"),this._el("b-resume").onclick=S("btn_start"),this._el("b-start").onclick=()=>this._ask("start"),this._el("b-stop").onclick=()=>this._ask("stop"),this._el("b-power").onclick=()=>this._vm?.state==="off"?this._power(!0):this._ask("off"),this._el("ask-no").onclick=()=>this._ask(null),this._el("ask-yes").onclick=()=>{let w=this._asking;this._ask(null),w==="start"&&S("btn_start")(),w==="stop"&&S("btn_stop")(),w==="off"&&this._power(!1)};let O=this._el("ic3");O&&(O.onclick=w=>{w.stopPropagation(),this._dev.roles.light&&this._call("light","toggle",{entity_id:this._dev.roles.light})}),this._el("pic").onclick=()=>this.dispatchEvent(new CustomEvent("hass-more-info",{detail:{entityId:this._dev.roles.status},bubbles:!0,composed:!0}))}_set(e,o){if(this._text[e]===o)return;this._text[e]=o;let i=this._el(e);i&&(i.textContent=o)}_setHTML(e,o){if(this._text[e]===o)return;this._text[e]=o;let i=this._el(e);i&&(i.innerHTML=o)}_update(){if(!this._dev||!this._root||!this._hass)return;let e=this._hass,o=this._dev,i=this._lang,r=fe(e,o.roles),n=this._vm=this._tracker.update(r,Y()),s=n.flags??{},c=n.state,l=c==="running"||c==="paused",f=this._draw,a=n.program??"",d=n.phase??"",h=o.family.group==="oven",p=f==="coffee",m=f==="drawer",u=p&&c==="running"&&!s.rinsing&&!/grinding|rinse/.test(d),A={[`st-${c}`]:!0,[`m-${n.progress.mode}`]:!0,moving:l||!1,stale:n.stale,"f-spin":s.spin&&c==="running","f-anti":s.antiCrease&&c==="done","f-cool":s.cooling,"f-heat":f==="dryer"&&l&&!s.cooling||h&&c==="running"&&!s.cooling||!1,"f-heating":h&&c==="running"&&s.heating,"f-steam":h&&l&&(/steam|moisture|sous_vide|blanching|bottling|defrost/.test(a)||d==="steam_reduction"),"f-micro":h&&c==="running"&&/microwave|popcorn/.test(a),"f-grind":p&&c==="running"&&/grinding/.test(d),"f-dispense":u,"f-rinse":p&&c==="running"&&(s.rinsing||d==="rinse"),"f-warm":m&&(l||s.keepWarm),"f-door":s.doorOpen||d==="door_open"||m&&c==="paused",lit:l||s.doorOpen||s.antiCrease||c==="done"&&s.cooling||s.light===!0,loaded:["ready","scheduled","running","paused","done","interrupted","error"].includes(c)&&!(p&&!l)&&n.programType!=="maintenance_program"&&!/clean_machine|descal|rinse_out_lint|^rinse$/.test(a),quiet:["off","standby","offline"].includes(c),wet:f==="washer"&&l&&!s.spin&&!s.drain&&!["anti_crease","drying","finished"].includes(n.phase),"has-phase":!!n.phase&&(l||c==="done")},v=Object.entries(A).filter(([,x])=>x).map(([x])=>x).join(" ");if(v!==this._cls){for(let x of(this._cls??"").split(" ").filter(Boolean))this._root.classList.remove(x);for(let x of v.split(" "))this._root.classList.add(x);this._cls=v}let y=this._t(`state.${c}`);c==="running"&&s.almostDone?y=this._t("pill.almost_done"):c==="running"&&n.phase?y=L(e,"phase",n.phase,this._lang):c==="scheduled"&&s.smartGridWait?y=this._t("pill.smart_grid"):c==="paused"&&f==="drawer"?y=this._t("pill.drawer_open"):c==="paused"&&s.doorOpen&&(y=this._t("pill.door_open")),this._set("pill",y),this._set("phase",n.phase?L(e,"phase",n.phase,this._lang):""),this._display(n,r);let k=n.progress.mode==="indeterminate"&&!this._geom.ring.spin,M=c==="error"||c==="interrupted"||k?1:n.progress.value;this._root.classList.toggle("breathe",k);let S=this._el("bar"),O=String(100-Math.round((M??0)*1e3)/10);S.style.strokeDashoffset!==O&&(S.style.strokeDashoffset=O),S.style.opacity=M==null?"0":"1";let w=o.family.group==="laundry"||o.family.group==="dishwasher";this._icon(0,n.connection==="lost"?"mdi:wifi-off":"mdi:wifi",n.connection==="lost"?"warn":s.remote?"lit":"",this._t(n.connection==="lost"?"icon.lost":"icon.remote"),!!o.roles.remote_control),this._icon(1,"mdi:cellphone-arrow-down",s.mobileStart?"lit":"",this._t("icon.mobile"),!!o.roles.mobile_start);let H=s.doorOpen?["mdi:door-open","lit","icon.door_open"]:l&&w?["mdi:lock","lit","icon.door_locked"]:["mdi:door-closed","","icon.door_closed"];this._icon(2,H[0],H[1],this._t(H[2]),!!o.roles.door),this._el("ic3")&&this._icon(3,s.light?"mdi:lightbulb-on":"mdi:lightbulb-outline",s.light?"lit":"",this._t("icon.light"),!!o.roles.light),this._rows(n,r,i),this._controls(n,r)}_display(e,o){let i=this._hass,r=this._lang,n=e.state,s=e.lcd.main,c=this._style,l=(p,m)=>L(i,p,m,r);if(c==="basic"){this._set("lcd-t",this._lcd(s,e)),this._set("lcd-s",e.lcd.sub?.kind==="phase"?"":this._lcd(e.lcd.sub,e)),this._el("lcd-t").classList.toggle("word",["text","program","phase"].includes(s?.kind));return}let f=D(Y(),i,r),a=s?.kind==="text"?this._t(`lcd.${s.value}`):"",d=n==="standby"?f:s?.kind==="countdown"?Le(s.value):s?.kind==="duration"?N(s.value):s?.kind==="clock"?D(s.value,i,r):"",h=n==="running"||n==="paused";if(this._root.classList.toggle("lcd-on",n!=="off"&&n!=="offline"),c==="line"){let p=a||(n==="paused"?this._t("lcd.paused"):n==="ready"?l("program",e.program):n==="scheduled"?this._t("lcd.starts"):h&&e.phase?l("phase",e.phase):h?l("program",e.program):"");this._setHTML("lcd-k",h&&!e.flags.doorOpen?kt:""),this._set("lcd-l",p),this._set("lcd-t",a?"":d)}else if(c==="seg"){let p=o.dryingStep,m=[...F].reverse(),u=m.indexOf(p),A=u>=0&&!a&&["ready","scheduled","running","paused"].includes(n);this._setHTML("lcd-l",A?m.slice(Math.max(0,Math.min(u-1,m.length-3)),Math.max(0,Math.min(u-1,m.length-3))+3).map(v=>`<span class="${v===p?"on":""}">${_(l("dryness",v))}</span>`).join(""):`<span class="on">${_(a||(n==="standby"?"":l("program",e.program)))}</span>`),this._setHTML("lcd-t",d&&!a?Ce(d):"")}else if(c==="oven"){let p=e.temps,m=p.unit,u=s?.kind==="countdown"?Le(s.value):p.target!=null&&(h||n==="ready"||n==="scheduled")?G(p.target,m):a||d;this._set("lcd-l",n==="standby"?"":a&&u!==a?a:l("program",e.program)),this._set("lcd-t",u),this._el("lcd-t").classList.toggle("word",u===a&&!!a),this._set("lcd-s",h&&p.current!=null?G(p.current,m):"")}else if(c==="menu"){let p=e.program?l("program",e.program):"";this._set("lcd-l",n==="standby"?this._t("lcd.drinks"):a||p||(e.flags.rinsing?this._t("lcd.rinsing"):"")),this._set("lcd-k",n==="off"||n==="offline"?"":f),this._setHTML("lcd-t",n==="standby"?vt:n==="running"||n==="paused"?`<span class="big">${_(e.flags.rinsing?this._t("lcd.rinsing"):p)}</span><span class="small">${_(e.phase?l("phase",e.phase):"")}</span>`:a?`<span class="big">${_(a)}</span>`:"")}}_icon(e,o,i,r,n){let s=`ic${e}`,c=`${o}|${i}|${r}|${n}`;if(this._text[s]===c)return;this._text[s]=c;let l=this._el(s);l.hidden=!n,l.className=`at icon ${i}${e===3?" tap":""}`,l.title=r,l.firstElementChild.setAttribute("icon",o)}_lcd(e,o){if(!e)return"";let i=this._hass,r=this._lang;switch(e.kind){case"dashes":return"--:--";case"blank":return"";case"countdown":return Se(e.value);case"duration":return N(e.value);case"clock":return D(e.value,i,r);case"temp":return G(e.value,o.temps.unit);case"elapsed":return`${e.value} ${this._t("unit.min")}`;case"percent":return o.progress.value==null?"":`${Math.round(o.progress.value*100)}%`;case"program":return L(i,"program",e.value,this._lang);case"phase":return L(i,"phase",e.value,this._lang);case"text":return this._t(`lcd.${e.value}`)}return""}_rows(e,o,i){let r=this._hass,n=this._dev.family,s=e.state,c=[[this._t("row.program"),e.program?_(L(r,"program",e.program,this._lang)):"\u2014"]];if(n.kind==="dryer"||n.kind==="washer_dryer"){let l=o.dryingStep,f=e.dryness?.reached,a=F.indexOf(l),d=F.indexOf(f),h=a>=0?`<span class="dots">${F.slice(0,a+1).map((p,m)=>`<i class="${m<=d?"on":""}${m===a?" target":""}" title="${_(L(r,"dryness",p,this._lang))}"></i>`).join("")}</span>`:"";c.push([this._t("row.dryness"),l?h+_(L(r,"dryness",l,this._lang)):"\u2014"])}else if(n.group==="laundry"){let l=[o.targetTemp!=null?G(o.targetTemp,e.temps.unit):null,o.spin?`${o.spin} ${this._t("unit.rpm")}`:null].filter(Boolean);c.push([this._t("row.temp"),l.length?l.join(" \xB7 "):"\u2014"])}else if(n.group==="oven"||n.group==="drawer"){let l=e.temps.unit,f=e.temps.current,a=e.temps.target,d=["running","paused","ready","scheduled"].includes(s),h=f!=null&&a!=null&&d?`${Math.round(f)} \u2192 ${G(a,l)}`:a!=null&&d?G(a,l):f!=null?G(f,l):"\u2014";c.push([this._t("row.temp"),h]),e.temps.core!=null&&d&&c.push([this._t("row.core"),e.temps.coreTarget!=null?`${Math.round(e.temps.core)} \u2192 ${G(e.temps.coreTarget,l)}`:G(e.temps.core,l)])}for(s==="ready"&&e.lcd.main?.kind==="duration"?c.push([this._t("row.duration"),N(e.lcd.main.value)]):s==="scheduled"&&e.startAt?c.push([this._t("row.starts"),D(e.startAt,r,i)]):e.endAt&&["running","paused","done","scheduled"].includes(s)?c.push([this._t(s==="done"?"row.ended":"row.ends"),D(e.endAt,r,i)]):(s==="running"||s==="paused")&&e.elapsedMin!=null&&c.push([this._t("row.elapsed"),`${e.elapsedMin} ${this._t("unit.min")}`]);c.length<4;)c.push(["",""]);c.forEach(([l,f],a)=>{this._set(`k${a}`,l),this._setHTML(`v${a}`,f),this._el(`k${a}`).parentElement.hidden=!l})}_controls(e,o){let i=this._config.controls!==!1,r=e.controls??{},n=e.state,s=!!this._dev.roles.power&&o.power!=null,c={"b-pause":r.pause,"b-resume":r.resume,"b-start":r.start,"b-stop":r.stop,"b-power":s&&e.connection!=="lost"},l=!1;for(let[f,a]of Object.entries(c))this._el(f).hidden=!a,l||(l=!!a);this._set("b-power-t",this._t(n==="off"?"btn.on":"btn.off")),this._el("ctl").hidden=!i||!l,(!i||n==="offline")&&this._ask(null)}_ask(e){this._asking=e;let o=this._el("ask");if(o.hidden=!e,!e)return;let i=this._vm,r=this._lang==="nl"?this._name.toLowerCase():this._name,n=i&&["running","paused","scheduled"].includes(i.state);o.classList.toggle("start",e==="start"),this._set("ask-t",e==="start"?this._t("ask.start",{program:L(this._hass,"program",i?.program,this._lang)||"",name:r}):e==="off"?this._t(n?"ask.off_running":"ask.off",{name:r}):this._t("ask.stop",{name:r})),this._set("ask-yes",this._t(e==="start"?"btn.start":e==="off"?"btn.off":"btn.stop"))}_power(e){return this._call("switch",e?"turn_on":"turn_off",{entity_id:this._dev.roles.power})}async _call(e,o,i){this._set("err","");try{await this._hass.callService(e,o,i)}catch(r){let n=r?.message||String(r);r?.translation_key&&r?.translation_domain&&(n=(await this._hass.loadBackendTranslation?.("exceptions",r.translation_domain))?.(`component.${r.translation_domain}.exceptions.${r.translation_key}.message`,r.translation_placeholders)||n),this._set("err",this._t("err.send",{msg:n}))}}};var $t="0.2.0-dev",Mt=(t,e,o,i)=>{customElements.get(t)||customElements.define(t,e),window.customCards=window.customCards||[],window.customCards.some(r=>r.type===t)||window.customCards.push({type:t,name:o,description:i,preview:!0,documentationURL:"https://github.com/g-force-be/ha-miele-appliance-card"})};Mt("miele-appliance-card",K,"Miele appliance","A Miele appliance with a progress ring, its own display and controls");console.info(`%c MIELE-APPLIANCE-CARD %c ${$t} `,"color:#fff;background:#3b3f44;font-weight:600","color:#3b3f44;background:#e4e6e9");export{$t as VERSION};
