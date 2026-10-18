/*! Miele Appliance Card for Home Assistant — https://github.com/g-force-be/ha-miele-appliance-card
 * MIT License. Copyright (c) 2026 My Media Build; Copyright (c) 2026 Peter Gheeraert.
 * Based on hOn Washer & Dryer Card by My Media Build (https://github.com/spikey1965/ha-hon-appliance-card), MIT.
 * Not affiliated with or endorsed by Miele. Miele is a trademark of Miele & Cie. KG. */
var Oe={sensor:{status:"status",program_id:"program",program_phase:"phase",program_type:"program_type",remaining_time:"remaining",elapsed_time:"elapsed",start_time:"start_in",finish:"finish",start:"start_ts",target_temperature:"target_temp",core_temperature:"core_temp",core_target_temperature:"core_target",temperature_zone_2:"temp_2",temperature_zone_3:"temp_3",spin_speed:"spin_speed",drying_step:"drying_step",energy_consumption:"energy",energy_forecast:"energy_forecast",water_consumption:"water",water_forecast:"water_forecast",twin_dos_1_level:"twindos_1",twin_dos_2_level:"twindos_2"},binary_sensor:{remote_control:"remote_control",mobile_start:"mobile_start",smart_grid:"smart_grid",notification_active:"notification"},button:{start:"btn_start",stop:"btn_stop",pause:"btn_pause"},switch:{power:"power"},light:{light:"light",ambient_light:"ambient_light"}},Ee={state_status:"status",state_program_id:"program",state_program_phase:"phase",state_program_type:"program_type",state_remaining_time:"remaining",state_elapsed_time:"elapsed",state_start_time:"start_in",state_finish_timestamp:"finish",state_start_timestamp:"start_ts",state_target_temperature:"target_temp",state_temperature_1:"temp",state_core_temperature:"core_temp",state_core_target_temperature:"core_target",state_spinning_speed:"spin_speed",state_drying_step:"drying_step",current_energy_consumption:"energy",energy_forecast:"energy_forecast",current_water_consumption:"water",water_forecast:"water_forecast",twin_dos_1_level:"twindos_1",twin_dos_2_level:"twindos_2",state_signal_door:"door",state_signal_failure:"failure",state_signal_info:"notification",state_full_remote_control:"remote_control",state_mobile_start:"mobile_start",state_smart_grid:"smart_grid",start:"btn_start",stop:"btn_stop",pause:"btn_pause",poweronoff:"power",light:"light"},He={"sensor.temperature":"temp","binary_sensor.door":"door","binary_sensor.problem":"failure"},De=[["program_ended","status"],["no_program","program"],["normal_operation_mode","program_type"],["not_running","phase"],["extra_dry","drying_step"]];function ze(t,e,o,r){let i=t.slice(0,t.indexOf(".")),a=e?.translation_key;if(a)return Oe[i]?.[a]??null;if(r){let c=Ee[r.slice(r.indexOf("-")+1)];if(c)return c}let s=o?.attributes??{};if(i==="sensor"&&s.device_class==="enum"&&Array.isArray(s.options)){for(let[c,l]of De)if(s.options.includes(c))return l}return He[`${i}.${s.device_class}`]??null}function Re(t,e,{uniqueIds:o={},overrides:r={}}={}){let i={};for(let[a,s]of Object.entries(t.entities??{})){if(s.device_id!==e||s.platform!=="miele")continue;let c=ze(a,s,t.states?.[a],o[a]);c&&!i[c]&&(i[c]=a)}for(let[a,s]of Object.entries(r??{}))s&&(i[a]=s);return i}var Te={"washing machine":"washer","tumble dryer":"dryer","washer dryer":"washer_dryer",dishwasher:"dishwasher",oven:"oven","oven microwave":"oven_microwave","steam oven":"steam_oven","steam oven combi":"steam_oven_combi","steam oven micro":"steam_oven_micro","dialog oven":"dialog_oven",microwave:"microwave","coffee system":"coffee","warming drawer":"drawer",hob:"hob","hob extraction":"hob",hood:"hood",refrigerator:"fridge",freezer:"fridge","fridge freezer":"fridge","wine cabinet":"wine","wine conditioning unit":"wine","wine unit":"wine","wine cabinet freezer":"wine","robot vacuum cleaner":"vacuum"},je=[[/^(WT|WWT)/,"washer_dryer"],[/^W/,"washer"],[/^T/,"dryer"],[/^G/,"dishwasher"],[/^ESW/,"drawer"],[/^(CM|CVA)/,"coffee"],[/^DGM/,"steam_oven_micro"],[/^DG/,"steam_oven_combi"],[/^H\w*BM/,"oven_microwave"],[/^M/,"microwave"],[/^H/,"oven"],[/^KM/,"hob"],[/^DA/,"hood"],[/^KWT/,"wine"],[/^(K|F)/,"fridge"],[/^RX/,"vacuum"]],Ie={washer:{group:"laundry",drawing:"washer"},washer_dryer:{group:"laundry",drawing:"washer"},dryer:{group:"laundry",drawing:"dryer"},dishwasher:{group:"dishwasher",drawing:"generic"},oven:{group:"oven",drawing:"steam_oven"},steam_oven:{group:"oven",drawing:"steam_oven"},steam_oven_combi:{group:"oven",drawing:"steam_oven"},dialog_oven:{group:"oven",drawing:"steam_oven"},steam_oven_micro:{group:"oven",drawing:"microwave"},oven_microwave:{group:"oven",drawing:"microwave"},microwave:{group:"oven",drawing:"microwave"},coffee:{group:"coffee",drawing:"coffee"},drawer:{group:"drawer",drawing:"drawer"}};function Ne(t,e){let o=String(e??"").replace(/\s+/g,"").toUpperCase(),r=Te[String(t??"").trim().toLowerCase()];if(!r){let a=o||String(t??"").replace(/\s+/g,"").toUpperCase();r=je.find(([s])=>s.test(a))?.[1]??"other"}let i=Ie[r]??{group:"other",drawing:"generic"};return{kind:r,group:i.group,drawing:i.drawing,builtIn:r==="coffee"?o.startsWith("CVA"):!["washer","washer_dryer","dryer","vacuum","other"].includes(r),finish:i.group==="laundry"?"lotus_white":"obsidian_black"}}function Z(t,e){let o=new Set;for(let r of Object.values(t.entities??{}))r.platform==="miele"&&r.device_id&&o.add(r.device_id);return[...o].map(r=>q(t,r,e)).sort((r,i)=>String(r.areaId).localeCompare(String(i.areaId))||r.name.localeCompare(i.name))}function q(t,e,o){let r=t.devices?.[e]??{};return{id:e,name:r.name_by_user||r.name||e,model:r.model??null,modelId:r.model_id??null,areaId:r.area_id??null,family:Ne(r.model,r.model_id),roles:Re(t,e,o)}}var Pe=new Set(["unknown","unavailable",""]),We=t=>t!=null&&!Pe.has(t),Be={s:1/60,min:1,h:60,d:1440},Ve=(t,e)=>t==null?null:t*(Be[e]??1);function fe(t,e){let o=n=>e[n]?t.states?.[e[n]]:void 0,r=n=>{let d=o(n)?.state;return We(d)?d:null},i=n=>{let d=r(n),p=d==null?NaN:Number(d);return Number.isFinite(p)?p:null},a=n=>Ve(i(n),o(n)?.attributes?.unit_of_measurement),s=n=>{let d=o(n);return d?Date.parse(d.last_changed):NaN},c=n=>{let d=r(n),p=d==null?NaN:Date.parse(d);return Number.isFinite(p)?p:null},l=n=>{let d=r(n);return d==="on"?!0:d==="off"?!1:null},f=n=>e[n]?o(n)?o(n).state==="unavailable"?"unavailable":"available":"disabled":"none";return{status:o("status")?.state??null,statusAt:s("status"),program:r("program"),phase:r("phase"),programType:r("program_type"),remaining:a("remaining"),remainingAt:s("remaining"),elapsed:a("elapsed"),elapsedAt:s("elapsed"),startIn:a("start_in"),finish:c("finish"),startTs:c("start_ts"),temp:i("temp"),targetTemp:i("target_temp"),coreTemp:i("core_temp"),coreTarget:i("core_target"),tempUnit:o("temp")?.attributes?.unit_of_measurement??o("target_temp")?.attributes?.unit_of_measurement??"\xB0C",spin:i("spin_speed"),dryingStep:r("drying_step"),energyForecast:i("energy_forecast"),waterForecast:i("water_forecast"),twindos1:i("twindos_1"),twindos2:i("twindos_2"),door:l("door"),failure:l("failure"),notification:l("notification"),remote:l("remote_control"),mobileStart:l("mobile_start"),smartGrid:l("smart_grid"),power:l("power"),light:l("light"),buttons:{start:f("btn_start"),stop:f("btn_stop"),pause:f("btn_pause")}}}var Fe={off:"off",reserved:"off",on:"standby",idle:"standby",programmed:"ready",waiting_to_start:"scheduled",in_use:"running",rinse_hold:"running",autocleaning:"running",superheating:"running",superfreezing:"running",supercooling:"running",supercooling_superfreezing:"running",pause:"paused",program_ended:"done",program_interrupted:"interrupted",failure:"error",service:"error"},z=new Set(["ready","scheduled","running","paused"]),Ke=new Set(["scheduled","running","paused","done"]),Ze=new Set(["off","standby"]),he=new Set(["not_running"]),qe=new Set(["finished","process_finished"]);function ce(t){let e=t.status;if(e==null||e==="not_connected"||e==="unavailable")return{state:"offline",connected:!1,guessed:!1};if(e==="unknown"){if(t.phase==null&&t.program==null)return{state:"offline",connected:!1,guessed:!1};let r=he.has(t.phase)||t.phase==null?"standby":qe.has(t.phase)?"done":"running";return{state:t.failure?"error":r,connected:!0,guessed:!0}}return{state:t.failure?"error":Fe[e]??"standby",connected:!0,guessed:!1}}var de=new Set(["heating_up_phase","pre_heating","heating_up"]),Ue=new Set(["cooling_down","comfort_cooling","safety_cooling","cooling_phase"]),W=["machine_iron","hand_iron_2","hand_iron","hand_iron_1","slightly_dry","normal","normal_plus","extra_dry"],pe=t=>W.indexOf(t),Ye=2,P=class{constructor(e,o={}){this.family=e,this.opts={holdMs:6e4,activeHoldMs:20*6e4,endGraceMs:5*6e4,debounceMs:1e3,...o},this.prev=null,this.good=null,this.offlineSince=null,this.unknownSince=null,this.c=this._newCycle(null)}_newCycle(e){return{since:e,pausedMs:0,pauseStart:null,heatFrom:null,maxRemaining:null,lastElapsed:null,program:null,reachedDry:null,frozen:null,last:null,readyProgram:void 0,readySince:null,readyShown:null}}update(e,o){let r=this.opts,i=ce(e),a=(c,l)=>this.good?o-c<l||Ze.has(this.good.state)?!0:Ke.has(this.good.state)?this.good.endAt?o<this.good.endAt+r.endGraceMs:o-c<r.activeHoldMs:!1:!1;if(!i.connected)return this.unknownSince=null,this.offlineSince==null&&(this.offlineSince=Number.isFinite(e.statusAt)&&e.statusAt<=o?e.statusAt:o),a(this.offlineSince,r.holdMs)?this._compute(this.good.snap,o,{stale:!0,connection:"lost"}):this._offline(o);if(this.offlineSince=null,i.guessed){if(this.unknownSince==null&&(this.unknownSince=o),o-this.unknownSince<r.holdMs&&this.good)return this._compute(this.good.snap,o,{stale:!0,connection:"ok"})}else this.unknownSince=null;let s=this._compute(e,o,{stale:!1,connection:"ok",guessed:i.guessed});return this.good={snap:e,state:s.state,endAt:s.state==="done"?null:s.endAt},s}_offline(e){return{state:"offline",phase:null,program:null,stale:!1,connection:"lost",offlineSince:this.offlineSince,lastState:this.good?.state??null,progress:{mode:"none",value:null},leftSec:null,endAt:null,startAt:null,lcd:{main:{kind:"dashes"},sub:{kind:"text",value:"offline"}},flags:{},dryness:null,temps:{},controls:{}}}_compute(e,o,{stale:r,connection:i,guessed:a=!1}){let s=this.family,c=this.opts,l=ce(e).state,f=this.prev,n=this.c;if(!r){let _=Number.isFinite(e.statusAt)&&e.statusAt<=o?e.statusAt:o,$=s.group==="oven"&&l==="running"&&n.program&&e.program&&e.program!=="no_program"&&e.program!==n.program,Ae=e.elapsed!=null&&n.lastElapsed!=null&&e.elapsed<n.lastElapsed;(z.has(l)&&!z.has(f)||Ae||$)&&(n=this.c=this._newCycle(o)),l==="paused"&&n.pauseStart==null&&(n.pauseStart=_,n.frozen=n.last),l!=="paused"&&n.pauseStart!=null&&(n.pausedMs+=Math.max(0,_-n.pauseStart),n.pauseStart=null,n.frozen=null),e.program&&e.program!=="no_program"&&(n.program=e.program),e.elapsed!=null&&(n.lastElapsed=e.elapsed),e.remaining!=null&&e.remaining>0&&(l==="ready"?n.maxRemaining=e.remaining:l==="running"&&(n.maxRemaining=Math.max(n.maxRemaining??0,e.remaining))),W.includes(e.phase)&&(n.reachedDry==null||pe(e.phase)>pe(n.reachedDry))&&(n.reachedDry=e.phase),this.prev=l}let d=l==="running"||l==="paused",p=z.has(l)||l==="done",v=e.program&&e.program!=="no_program"?e.program:p?n.program:null,S=e.phase&&!he.has(e.phase)?e.phase:null,m=null;if(e.remaining!=null&&e.remaining>0){let _=e.remaining*60,$=Number.isFinite(e.remainingAt)?Math.max(0,(o-e.remainingAt)/1e3):0;m=l==="running"?Math.max(_-$,_-60):_}else e.finish!=null&&(l==="running"||l==="scheduled")&&(m=Math.max(0,(e.finish-o)/1e3));let k=s.group==="oven"&&e.targetTemp!=null&&e.temp!=null&&d,M=k&&de.has(e.phase)&&e.temp<e.targetTemp-Ye;M&&!r&&(n.heatFrom=Math.min(n.heatFrom??e.temp,e.temp));let y="none",u=null,b=!1,A=(n.pausedMs+(n.pauseStart!=null?Math.max(0,o-n.pauseStart):0))/1e3;if(l==="done")y="done",u=1;else if(l==="paused"&&n.frozen)({mode:y,progress:u}=n.frozen),m=n.frozen.leftSec??m;else if(d){if(M){y="heat";let _=n.heatFrom??e.temp,$=e.targetTemp-_;u=$>0?Math.min(.99,Math.max(0,(e.temp-_)/$)):0}else if(m!=null){if(y="time",e.elapsed!=null){let _=l==="running"&&Number.isFinite(e.elapsedAt)?Math.min(59,Math.max(0,(o-e.elapsedAt)/1e3)):0,$=Math.max(0,e.elapsed*60+_-A);u=$+m>0?$/($+m):0}else n.maxRemaining&&(u=1-m/(n.maxRemaining*60));l==="running"&&m<=0&&(b=!0)}else(s.group==="laundry"||s.group==="dishwasher")&&e.remaining===0&&l==="running"?(y="time",b=!0,m=0,u=Math.max(n.last?.progress??0,.99)):k?(y="at_temp",u=1):y="indeterminate";u!=null&&(u=Math.min(y==="at_temp"?1:.99,Math.max(0,u)))}!r&&l==="running"&&(n.last={mode:y,progress:u,leftSec:m});let g=z.has(l)?e.finish??(m>0?o+m*1e3:null):l==="done"?e.finish:null,O=l!=="scheduled"?null:e.startTs!=null&&e.startTs>o?e.startTs:e.startIn?o+e.startIn*6e4:null,H=null;l==="ready"&&(e.program!==n.readyProgram&&(n.readyProgram=e.program,n.readySince=o),(n.readyShown==null||o-n.readySince>=c.debounceMs)&&(n.readyShown=e.remaining),H=n.readyShown);let N={heating:d&&de.has(e.phase),cooling:Ue.has(e.phase)&&(d||l==="done"),antiCrease:e.phase==="anti_crease",keepWarm:e.phase==="keeping_warm",rinsing:e.status==="autocleaning",spin:e.phase==="spin",drain:e.phase==="drain",almostDone:b,doorOpen:e.door===!0,smartGridWait:l==="scheduled"&&e.smartGrid===!0,remote:e.remote===!0,mobileStart:e.mobileStart===!0,light:e.light},C=e.buttons,G={pause:l==="running"&&C.pause==="available",resume:l==="paused"&&C.start==="available",start:l==="ready"&&C.start==="available",stop:z.has(l)&&C.stop==="available",disabled:Object.entries(C).filter(([,_])=>_==="disabled").map(([_])=>_)},Le=(s.kind==="dryer"||s.kind==="washer_dryer")&&p&&(e.dryingStep||n.reachedDry)?{target:e.dryingStep,reached:n.reachedDry}:null;return{state:l,phase:S,program:v,programType:e.programType,stale:r,connection:i,guessed:a,progress:{mode:y,value:u},leftSec:m,endAt:g,startAt:O,flags:N,dryness:Le,lcd:this._lcd({state:l,mode:y,leftSec:m,almostDone:b,readyDur:H,startAt:O,snap:e,program:v,phase:S,flags:N}),temps:{current:e.temp,target:e.targetTemp,core:e.coreTemp,coreTarget:e.coreTarget,unit:e.tempUnit},elapsedMin:e.elapsed,pausedSec:Math.round(A),controls:G}}_lcd({state:e,mode:o,leftSec:r,almostDone:i,readyDur:a,startAt:s,snap:c,program:l,phase:f,flags:n}){let d=this.family.group;switch(e){case"off":return{main:{kind:"dashes"},sub:null};case"standby":return{main:{kind:"blank"},sub:null};case"ready":return{main:a?{kind:"duration",value:a*60}:{kind:"blank"},sub:{kind:"text",value:"ready"}};case"scheduled":return{main:s?{kind:"clock",value:s}:{kind:"dashes"},sub:{kind:"text",value:n.smartGridWait?"smart_grid":"starts"}};case"done":return{main:{kind:"text",value:"end"},sub:f?{kind:"phase",value:f}:null};case"interrupted":return{main:{kind:"text",value:"interrupted"},sub:null};case"error":return{main:{kind:"text",value:"error"},sub:null}}let p=e==="paused"?{kind:"text",value:"paused"}:null;return i?{main:{kind:"text",value:"almost_done"},sub:p??{kind:"percent"}}:o==="time"?{main:{kind:"countdown",value:r},sub:p??{kind:"percent"}}:o==="heat"?{main:{kind:"temp",value:c.temp},sub:p??{kind:"text",value:"heating"}}:o==="at_temp"?{main:{kind:"temp",value:c.temp},sub:p??(c.elapsed!=null?{kind:"elapsed",value:c.elapsed}:{kind:"text",value:"at_temp"})}:d==="coffee"?{main:n.rinsing?{kind:"text",value:"rinsing"}:l?{kind:"program",value:l}:{kind:"blank"},sub:f?{kind:"phase",value:f}:p}:d==="drawer"&&c.temp!=null?{main:{kind:"temp",value:c.temp},sub:f?{kind:"phase",value:f}:p}:c.elapsed!=null?{main:{kind:"elapsed",value:c.elapsed},sub:p}:{main:l?{kind:"program",value:l}:{kind:"blank"},sub:p}}};var me=()=>typeof globalThis.__MIELE_NOW__=="function"?globalThis.__MIELE_NOW__():Date.now();var Xe={state:{off:"Uit",offline:"Niet verbonden",standby:"Aan",ready:"Klaar om te starten",scheduled:"Gepland",running:"Bezig",paused:"Gepauzeerd",done:"Klaar",interrupted:"Onderbroken",error:"Storing"},lcd:{ready:"Klaar",starts:"Start om",smart_grid:"Slim starten",end:"Einde",interrupted:"Onderbroken",error:"Storing",almost_done:"Bijna klaar",heating:"Opwarmen",at_temp:"Op temperatuur",paused:"Pauze",rinsing:"Spoelen",offline:"Geen verbinding"},row:{program:"Programma",temp:"Temperatuur",spin:"Centrifuge",dryness:"Droogtegraad",ends:"Klaar om",ended:"Klaar om",duration:"Duur",starts:"Start om",elapsed:"Verstreken",core:"Kerntemperatuur"},pill:{almost_done:"Bijna klaar",smart_grid:"Wacht op slim starten",lost:"Geen verbinding"},btn:{pause:"Pauzeren",resume:"Hervatten",start:"Starten",stop:"Stoppen",off:"Uitzetten",on:"Aanzetten",cancel:"Annuleren"},ask:{stop:"{name} stoppen? Het programma wordt afgebroken.",off:"{name} uitzetten?",off_running:"{name} uitzetten? Het programma stopt.",start:"{program} starten op de {name}?"},icon:{remote:"Bediening op afstand",mobile:"Start op afstand",door_open:"Deur open",door_closed:"Deur dicht",door_locked:"Deur vergrendeld",lost:"Geen verbinding, laatste toestand",light:"Licht aan/uit"},err:{send:"Niet verstuurd: {msg}",no_device:"Geen Miele-toestel gevonden. Kies een toestel in de kaartinstellingen."},unit:{rpm:"tpm",min:"min"},kind:{washer:"Wasmachine",dryer:"Droogkast",washer_dryer:"Was-droogcombinatie",dishwasher:"Vaatwasser",oven:"Oven",steam_oven:"Stoomoven",steam_oven_combi:"Stoomoven",steam_oven_micro:"Stoomoven met microgolf",dialog_oven:"Dialog-oven",oven_microwave:"Oven met microgolf",microwave:"Microgolfoven",coffee:"Koffiemachine",drawer:"Warmhoudlade",hob:"Kookplaat",hood:"Dampkap",fridge:"Koelkast",wine:"Wijnkast",vacuum:"Robotstofzuiger",other:"Miele-toestel"}},U={state:{off:"Off",offline:"Not connected",standby:"On",ready:"Ready to start",scheduled:"Scheduled",running:"Running",paused:"Paused",done:"Finished",interrupted:"Interrupted",error:"Fault"},lcd:{ready:"Ready",starts:"Starts at",smart_grid:"Smart start",end:"End",interrupted:"Interrupted",error:"Fault",almost_done:"Almost done",heating:"Heating up",at_temp:"At temperature",paused:"Paused",rinsing:"Rinsing",offline:"No connection"},row:{program:"Programme",temp:"Temperature",spin:"Spin",dryness:"Dryness",ends:"Ends at",ended:"Ended at",duration:"Duration",starts:"Starts at",elapsed:"Elapsed",core:"Core temperature"},pill:{almost_done:"Almost done",smart_grid:"Waiting for smart start",lost:"No connection"},btn:{pause:"Pause",resume:"Resume",start:"Start",stop:"Stop",off:"Switch off",on:"Switch on",cancel:"Cancel"},ask:{stop:"Stop the {name}? This cancels the programme.",off:"Switch the {name} off?",off_running:"Switch the {name} off? The programme stops.",start:"Start {program} on the {name}?"},icon:{remote:"Remote control",mobile:"Remote start",door_open:"Door open",door_closed:"Door closed",door_locked:"Door locked",lost:"No connection, last known state",light:"Light on/off"},err:{send:"Not sent: {msg}",no_device:"No Miele appliance found. Pick one in the card settings."},unit:{rpm:"rpm",min:"min"},kind:{washer:"Washing machine",dryer:"Tumble dryer",washer_dryer:"Washer dryer",dishwasher:"Dishwasher",oven:"Oven",steam_oven:"Steam oven",steam_oven_combi:"Steam oven",steam_oven_micro:"Steam oven with microwave",dialog_oven:"Dialog oven",oven_microwave:"Oven with microwave",microwave:"Microwave",coffee:"Coffee machine",drawer:"Warming drawer",hob:"Hob",hood:"Cooker hood",fridge:"Fridge",wine:"Wine cabinet",vacuum:"Robot vacuum",other:"Miele appliance"}},ue={nl:Xe,en:U},ge=(t,e)=>{let o=String(e?.language||t?.locale?.language||t?.language||"en").slice(0,2).toLowerCase();return ue[o]?o:"en"};function ye(t,e,o){let r=e.split(".").reduce((i,a)=>i?.[a],ue[t]??U)??e.split(".").reduce((i,a)=>i?.[a],U)??e;return o?r.replace(/\{(\w+)\}/g,(i,a)=>o[a]??""):r}var Je={status:{autocleaning:["Automatic cleaning","Automatisch spoelen"],reserved:["Reserved","Gereserveerd"],supercooling:["Supercooling","SuperKoelen"],superfreezing:["Superfreezing","SuperVriezen"],supercooling_superfreezing:["Supercooling/superfreezing","SuperKoelen/SuperVriezen"],superheating:["Superheating","Snel opwarmen"]},phase:{"2nd_espresso":["2nd espresso coffee","2e espresso"],"2nd_grinding":["2nd grinding","2e keer malen"],"2nd_pre_brewing":["2nd pre-brewing","2e voorbrouwen"],comfort_cooling:["Comfort cooling","Comfortkoeling"],cooling_phase:["Cooling phase","Afkoelen"],dispensing:["Dispensing","Uitschenken"],dust_box_missing:["Missing dust box","Stofbox ontbreekt"],energy_save:["Energy save","Energiebesparing"],espresso:["Espresso coffee","Espresso"],final_rinse:["Final rinse","Laatste spoeling"],flex_load_active:["FlexLoad active","FlexLoad actief"],freshen_up_and_moisten:["Freshen up & moisten","Opfrissen en bevochtigen"],going_to_target_area:["Going to target area","Onderweg naar doelzone"],grinding:["Grinding","Malen"],hand_iron:["Hand iron","Strijkdroog"],hygiene_drying:["Hygiene drying","Hygi\xEBnisch drogen"],interim_rinse:["Interim rinse","Tussenspoeling"],keep_warm:["Keep warm","Warmhouden"],keeping_warm:["Keeping warm","Warmhouden"],milk_foam:["Milk foam","Melkschuim"],moisten:["Moisten","Bevochtigen"],motor_overload:["Check dust box and filter","Controleer stofbox en filter"],perfect_dry_active:["PerfectDry active","PerfectDry actief"],pre_brewing:["Pre-brewing","Voorbrouwen"],pre_dishwash:["Pre-cleaning","Voorreinigen"],process_finished:["Process finished","Klaar"],process_running:["Process running","Bezig"],program_running:["Program running","Programma loopt"],reactivating:["Reactivating","Opnieuw starten"],remote_controlled:["Remote controlled","Op afstand bediend"],rinse_out_lint:["Rinse out lint","Pluizen uitspoelen"],rinses:["Rinses","Spoelen"],roasting:["Roasting","Braden"],safety_cooling:["Safety cooling","Veiligheidskoeling"],searing:["Searing","Aanbraden"],slightly_dry:["Slightly dry","Licht droog"],slow_roasting:["Slow roasting","Lagetemperatuurgaren"],soak:["Soak","Inweken"],starch_stop:["Starch stop","Stijfselstop"],steam_reduction:["Steam reduction","Stoomreductie"],steam_smoothing:["Steam smoothing","Stoomgladmaken"],thermo_spin:["Thermo spin","ThermoSpin"],timed_drying:["Timed drying","Drogen op tijd"],venting:["Venting","Ontluchten"],waiting_for_start:["Waiting for start","Wacht op start"],warm_cups_glasses:["Warm cups/glasses","Kopjes en glazen voorverwarmen"],warm_dishes_plates:["Warm dishes/plates","Borden voorverwarmen"],wheel_lifted:["Wheel lifted","Wiel opgetild"]},program:{clean_machine:["Clean machine","Machine reinigen"],easy_care:["Easy care","Onderhoudsarm"],freshen_up:["Freshen up","Opfrissen"],outdoor_garments:["Outdoor garments","Outdoorkleding"],rinse_out_lint:["Rinse out lint","Pluizen uitspoelen"],separate_rinse_starch:["Separate rinse/starch","Apart spoelen/stijven"],steam_care:["Steam care","Stoomverzorging"],stuffed_toys:["Stuffed toys","Knuffels"],towels:["Towels","Handdoeken"],trainers_refresh:["Trainers refresh","Sportschoenen opfrissen"],downs_duvets:["Downs/Duvets","Dons/dekbedden"],pillows_sanitize:["Pillows sanitize","Kussens hygi\xEBne"],steam_smoothing:["Steam smoothing","Stoomgladmaken"],fan_plus:["Fan plus","Hetelucht plus"],conventional_heat:["Conventional heat","Boven- en onderwarmte"],intensive_bake:["Intensive bake","Intensief bakken"],fan_grill:["Fan grill","Grill met circulatie"],eco_fan_heat:["ECO fan heat","ECO hetelucht"],top_heat:["Top heat","Bovenwarmte"],steam_cooking:["Steam cooking","Stoomgaren"],rapid_steam_cooking:["Rapid steam cooking","Snel stoomgaren"],reheating_with_steam:["Reheating with steam","Opwarmen met stoom"],moisture_plus_fan_plus:["Moisture plus + Fan plus","Klimaatgaren + hetelucht plus"],keeping_warm:["Keeping warm","Warmhouden"],descale:["Descale","Ontkalken"],microwave_fan_plus:["Microwave + Fan plus","Microgolf + hetelucht plus"],microwave_fan_grill:["Microwave + Fan grill","Microgolf + grill met circulatie"],microwave_auto_roast:["Microwave + Auto roast","Microgolf + automatisch braden"],reheating_with_microwave:["Reheating with microwave","Opwarmen met microgolf"],auto_roast:["Auto roast","Automatisch braden"],low_temperature_cooking:["Low temperature cooking","Lagetemperatuurgaren"],appliance_settings:["Appliance settings menu","Instellingen"],brewing_unit_degrease:["Brewing unit degrease","Zetgroep ontvetten"],coffee_pot:["Coffee pot","Koffiepot"],descaling:["Appliance descaling","Ontkalken"],fruit_tea:["Fruit tea","Vruchtenthee"],herbal_tea:["Herbal tea","Kruidenthee"],intermediate_rinsing:["Intermediate rinsing","Tussentijds spoelen"],long_coffee:["Long coffee","Lange koffie"],very_hot_water:["Very hot water","Zeer heet water"],white_tea:["White tea","Witte thee"],evaporate_water:["Evaporate water","Water verdampen"],quick_microwave:["","Snel microgolf"],microwave_grill:["","Microgolf + grill"],keep_warm:["","Warmhouden"],slow_roasting:["","Lagetemperatuurgaren"],warm_cups_glasses:["","Kopjes en glazen voorverwarmen"],warm_dishes_plates:["","Borden voorverwarmen"]}};function L(t,e,o,r){if(o==null)return"";let i={program:"program_id",phase:"program_phase",dryness:"drying_step",status:"status"}[e],a=t?.localize?.(`component.miele.entity.sensor.${i}.state.${o}`),s=r==="nl"?Je[e]?.[o]:null;return s&&(!a||a===s[0])?s[1]:a||String(o).replace(/_/g," ").replace(/^./,c=>c.toUpperCase())}var X={ratio:"600/850",view:"0 0 600 850",window:{x:50,y:43.53,d:50},ring:{path:"M300 132 A238 238 0 1 1 300 608 A238 238 0 1 1 300 132",width:8.5,spin:{x:50,y:43.53,d:79.4}},lcd:{x:36.33,y:3.06,w:27.33,h:7.53},icons:{size:5.8,at:[[9,7.4],[16,7.4],[23,7.4]]},panel:{left:4.5,right:4.5,top:75.6,bottom:5.4}},h=t=>`var(--f-${t})`;function Qe(t,e){let o=[26,20,30,22,28,18,24],r="";return o.forEach((i,a)=>{let s=e-27+a*9,c=o[6-a];r+=`<rect x="${t-40-i}" y="${s-1.1}" width="${i}" height="2.2" rx="1.1"/><circle cx="${t-34}" cy="${s}" r="1.3"/>`,r+=`<rect x="${t+40}" y="${s-1.1}" width="${c}" height="2.2" rx="1.1"/><circle cx="${t+34}" cy="${s}" r="1.3"/>`}),r}var et=(t,e,o,r,i)=>`<rect x="${t}" y="${e}" width="${o}" height="${r}" rx="${r/2}" fill="${i("slot")}"/>
  <path d="M${t+r/2} ${e+1.2} H${t+o-r/2}" stroke="#000" stroke-opacity=".18" stroke-width="2" stroke-linecap="round"/>`,Y=(t,e,o)=>`<circle cx="${t}" cy="${e}" r="10.5" fill="${o("knob")}" style="stroke:${h("edge")}" stroke-width="1.4"/>`;function J(t,e=!1){let o=i=>`url(#${t}-${i})`,r="M10 18 H590 V127 H214 C209 150 190 168 152 170 H10 Z";return`<svg class="art-svg" viewBox="0 0 600 850" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
<defs>
  <linearGradient id="${t}-body" x1="0" x2="1">
    <stop offset="0" style="stop-color:${h("lo")}"/><stop offset=".05" style="stop-color:${h("mid")}"/>
    <stop offset=".42" style="stop-color:${h("hi")}"/><stop offset=".92" style="stop-color:${h("mid")}"/><stop offset="1" style="stop-color:${h("lo")}"/>
  </linearGradient>
  <linearGradient id="${t}-sheen" x1="0" x2="0" y1="0" y2="1">
    <stop offset="0" stop-color="#fff" stop-opacity=".14"/><stop offset=".3" stop-color="#fff" stop-opacity="0"/>
    <stop offset=".85" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".1"/>
  </linearGradient>
  <linearGradient id="${t}-panel" x1="0" x2="0" y1="0" y2="1">
    <stop offset="0" style="stop-color:${h("hi")}"/><stop offset=".7" style="stop-color:${h("hi")}"/><stop offset="1" style="stop-color:${h("mid")}"/>
  </linearGradient>
  <linearGradient id="${t}-under" x1="0" x2="0" y1="0" y2="1">
    <stop offset="0" stop-color="#000" stop-opacity=".12"/><stop offset="1" stop-color="#000" stop-opacity="0"/>
  </linearGradient>
  <linearGradient id="${t}-slot" x1="0" x2="0" y1="0" y2="1">
    <stop offset="0" style="stop-color:${h("edge")}"/><stop offset=".6" style="stop-color:${h("lo")}"/><stop offset="1" style="stop-color:${h("mid")}"/>
  </linearGradient>
  <linearGradient id="${t}-flap" x1="0" x2="0" y1="0" y2="1">
    <stop offset="0" style="stop-color:${h("hi")}"/><stop offset="1" style="stop-color:${h("mid")}"/>
  </linearGradient>
  <radialGradient id="${t}-knob" cx=".42" cy=".38" r=".7">
    <stop offset="0" style="stop-color:${h("hi")}"/><stop offset=".75" style="stop-color:${h("mid")}"/><stop offset="1" style="stop-color:${h("lo")}"/>
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
  <clipPath id="${t}-top"><path d="${r}"/></clipPath>
</defs>

<ellipse cx="300" cy="842" rx="292" ry="8" fill="${o("ground")}"/>

<g class="body">
  <rect x="10" y="8" width="580" height="830" rx="10" fill="${o("body")}"/>
  <rect x="10" y="8" width="580" height="830" rx="10" fill="${o("sheen")}"/>
  <rect x="10.5" y="8.5" width="579" height="829" rx="10" fill="none" style="stroke:${h("edge")}" stroke-width="1.3"/>
  <path d="M14 10 H586" stroke="#fff" stroke-opacity=".6" stroke-width="1.4"/>
  <path d="M10 18 H590" style="stroke:${h("edge")}" stroke-opacity=".7" stroke-width="1.1"/>
</g>

<g class="controls">
  <path d="${r}" fill="${o("panel")}"/>
  <path d="M214 127 C209 150 190 168 152 170 H10 V188 H152 C200 186 226 160 232 145 H590 V127 Z" fill="${o("under")}"/>
  <path d="M590 127 H214 C209 150 190 168 152 170 H10" fill="none" style="stroke:${h("edge")}" stroke-width="1.3"/>
  <path d="M207 19 V110" style="stroke:${h("edge")}" stroke-opacity=".75" stroke-width="1.1"/>
  ${et(44,128,110,24,o)}
  <rect x="218" y="26" width="164" height="64" rx="6" fill="${o("screen")}"/>
  <path d="M222 29 H378 L362 46 H222 Z" fill="#fff" opacity=".045"/>
  <g style="fill:${h("ink")}" opacity=".26">${Qe(486,50)}</g>
  <circle cx="486" cy="50" r="26" fill="${o("chrome")}"/>
  <circle cx="486" cy="50" r="22.5" fill="${o("chromeIn")}"/>
  <circle cx="486" cy="50" r="19" fill="${o("knob")}" stroke="#000" stroke-opacity=".08"/>
  <path d="M486 37 V44" style="stroke:${h("ink")}" stroke-width="2.6" stroke-linecap="round"/>
</g>

<g class="door">
  <circle cx="303" cy="377" r="238" fill="${o("shadow")}"/>
  <circle cx="300" cy="370" r="228" fill="${o("chrome")}"/>
  <circle cx="300" cy="370" r="214" fill="${o("chromeIn")}"/>
  <circle cx="300" cy="370" r="186" fill="#8d959c"/>
  <circle cx="300" cy="370" r="183" fill="${o("bezel")}"/>
  <circle cx="300" cy="370" r="151" fill="${o("glass")}"/>
  <path d="M520 334 a228 228 0 0 1 0 72" fill="none" stroke="#000" stroke-opacity=".22" stroke-width="7" stroke-linecap="round"/>
  <path d="M110 250 a222 222 0 0 1 150 -100" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="3.5" stroke-linecap="round"/>
</g>

<g class="lower">
  ${e?`<rect x="30" y="646" width="236" height="154" rx="8" fill="${o("flap")}" style="stroke:${h("edge")}" stroke-width="1.3"/>
  ${Y(148,722,o)}
  <rect x="274" y="646" width="296" height="154" rx="8" fill="${o("flap")}" style="stroke:${h("edge")}" stroke-width="1.3"/>
  <g style="fill:${h("lo")}">${Array.from({length:13},(i,a)=>`<rect x="290" y="${660+a*10.4}" width="264" height="5" rx="2.5"/>`).join("")}</g>
  <g fill="#000" opacity=".1">${Array.from({length:13},(i,a)=>`<rect x="290" y="${660+a*10.4}" width="264" height="1.6" rx=".8"/>`).join("")}</g>`:`<rect x="35" y="646" width="180" height="152" rx="8" fill="${o("flap")}" style="stroke:${h("edge")}" stroke-width="1.3"/>
  ${Y(125,672,o)}
  <rect x="272" y="646" width="292" height="152" rx="8" fill="${o("flap")}" style="stroke:${h("edge")}" stroke-width="1.3"/>
  ${Y(418,672,o)}`}
  <rect x="10" y="810" width="580" height="28" rx="6" style="fill:${h("lo")}"/>
  <path d="M12 810.5 H588" style="stroke:${h("edge")}" stroke-width="1.2"/>
  <rect x="10" y="830" width="580" height="8" rx="4" fill="#000" opacity=".22"/>
</g>
</svg>`}var tt=t=>`<pattern id="${t}-hex" width="13" height="22.5" patternUnits="userSpaceOnUse" patternTransform="rotate(8)">
  <path d="M6.5 0 L13 3.75 L13 11.25 L6.5 15 L0 11.25 L0 3.75 Z M6.5 15 V22.5" fill="none" stroke="#000" stroke-opacity=".14" stroke-width=".9"/>
  <path d="M6.5 1.2 L11.8 4.3" stroke="#fff" stroke-opacity=".35" stroke-width=".8"/>
</pattern>`,ot=t=>`<pattern id="${t}-hex" width="7" height="12.12" patternUnits="userSpaceOnUse" patternTransform="rotate(8)">
  <circle cx="3.5" cy="3" r="1.25" fill="#000" fill-opacity=".38"/><circle cx="0" cy="9.06" r="1.25" fill="#000" fill-opacity=".38"/><circle cx="7" cy="9.06" r="1.25" fill="#000" fill-opacity=".38"/>
</pattern>`,it=(t,e)=>`<svg viewBox="0 0 200 200" aria-hidden="true"><defs>
  <radialGradient id="${t}-steel" cx=".5" cy=".46" r=".56">
    <stop offset="0" stop-color="#e3e6e9"/><stop offset=".4" stop-color="#c3c8cd"/><stop offset=".78" stop-color="#8e959b"/><stop offset="1" stop-color="#4e5459"/>
  </radialGradient>
  <linearGradient id="${t}-lifter" x1="0" x2="1"><stop offset="0" stop-color="#f4f6f7"/><stop offset="1" stop-color="#a9b0b6"/></linearGradient>
  ${e?ot(t):tt(t)}</defs>
  <circle cx="100" cy="100" r="100" fill="url(#${t}-steel)"/>
  <circle cx="100" cy="100" r="94" fill="url(#${t}-hex)"/>
  <circle cx="100" cy="100" r="58" fill="none" stroke="#000" stroke-opacity=".1" stroke-width="10"/>
  <g fill="url(#${t}-lifter)" stroke="#000" stroke-opacity=".16" stroke-width=".8">
    <path d="M92 8 C96 26 104 34 116 38 L110 8 Z"/><path d="M92 8 C96 26 104 34 116 38 L110 8 Z" transform="rotate(120 100 100)"/><path d="M92 8 C96 26 104 34 116 38 L110 8 Z" transform="rotate(240 100 100)"/>
  </g>
  <circle cx="100" cy="100" r="15" fill="#cfd3d7" stroke="#000" stroke-opacity=".18"/><circle cx="100" cy="100" r="6" fill="#9aa1a7"/></svg>`,rt=(t,e)=>{let o=e?["#7d8fa3","#e9e5dc","#c3958c","#a9b0b8","#8f9e86","#ddd6c8"]:["#3f5a78","#e7e3db","#b98582","#8b929a","#86a084","#d8d2c6"];return`<svg viewBox="0 0 200 200" aria-hidden="true"><defs>
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
  <path d="M58 136 L66 128 M110 113 L104 122" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="1.4" stroke-linecap="round"/></svg>`},st=t=>`<svg viewBox="0 0 400 200" preserveAspectRatio="none" aria-hidden="true"><defs>
  <linearGradient id="${t}-water" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#7fb8e6" stop-opacity=".55"/><stop offset="1" stop-color="#2d6aa3" stop-opacity=".62"/></linearGradient></defs>
  <path d="M0 132 C25 124 50 140 75 132 S125 124 150 132 S200 140 225 132 S275 124 300 132 S350 140 375 132 S400 128 400 128 V200 H0 Z" fill="url(#${t}-water)"/>
  <path d="M0 132 C25 124 50 140 75 132 S125 124 150 132 S200 140 225 132 S275 124 300 132 S350 140 375 132" fill="none" stroke="#d8ecfb" stroke-opacity=".5" stroke-width="1.6"/></svg>`,nt=t=>`<svg viewBox="0 0 200 200" aria-hidden="true"><defs>
  <radialGradient id="${t}-vig" cx=".5" cy=".5" r=".5"><stop offset=".72" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".45"/></radialGradient>
  <linearGradient id="${t}-shine" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".26"/><stop offset=".45" stop-color="#fff" stop-opacity=".03"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient></defs>
  <circle cx="100" cy="100" r="100" fill="#0d1218" opacity=".1"/>
  <circle cx="100" cy="100" r="100" fill="url(#${t}-vig)"/>
  <path d="M30 70 A80 80 0 0 1 112 22 A92 92 0 0 0 46 96 Z" fill="url(#${t}-shine)"/></svg>`;function Q(t,e=!1){return`<div class="layer drum">${it(t,e)}</div>
    <div class="layer laundry">${rt(t,e)}</div>
    ${e?'<div class="layer heat"></div><div class="layer chill"></div>':`<div class="layer water"><div class="wave">${st(t)}</div></div>`}
    <div class="layer led"></div>
    <div class="layer reflect">${nt(t)}</div>`}var R=t=>`var(--f-${t})`;function T(t,e,o,r,i){return`M${t+o/2} ${e} H${t+o-i} A${i} ${i} 0 0 1 ${t+o} ${e+i} V${e+r-i} A${i} ${i} 0 0 1 ${t+o-i} ${e+r} H${t+i} A${i} ${i} 0 0 1 ${t} ${e+r-i} V${e+i} A${i} ${i} 0 0 1 ${t+i} ${e} Z`}var ee=t=>({ratio:"600/456",view:"0 0 600 456",window:{left:17,top:44.96,width:66,height:36.62,radius:"1.6% / 3.8%"},ring:{path:T(92,195,416,187,14),width:6},lcd:t?{x:41.5,y:11,w:17,h:7.6}:{x:37,y:7,w:26,h:13},icons:{size:4.2,at:[[78,9],[83,9],[88,9],[93,9]]},panel:null}),at=(t,e)=>{let o=[118,146,168,400,424,448,472];return`<path d="M84 ${t} H516" style="stroke:${e}" stroke-opacity=".28" stroke-width="1.2"/>
  <circle cx="104" cy="${t-10}" r="6.5" fill="none" style="stroke:${e}" stroke-opacity=".6" stroke-width="1.6"/>
  <path d="M104 ${t-16} v5" style="stroke:${e}" stroke-opacity=".6" stroke-width="1.6" stroke-linecap="round"/>
  ${o.map(r=>`<rect x="${r-4}" y="${t-14}" width="8" height="8" rx="2" fill="none" style="stroke:${e}" stroke-opacity=".45" stroke-width="1.2"/>`).join("")}
  <g style="fill:${e}" opacity=".35">${Array.from({length:28},(r,i)=>`<rect x="${226+i*5.4}" y="${t-11}" width="1.6" height="3" rx=".8"/>`).join("")}</g>`},lt=t=>Array.from({length:10},(e,o)=>{let r=146+o*30;return`<rect x="${r}" y="31" width="16" height="12" rx="2.4" fill="none" style="stroke:${t}" stroke-opacity=".9" stroke-width="1.3"/>
    <path d="M${r+4} ${o%2?37:39} h8" style="stroke:${t}" stroke-opacity=".8" stroke-width="1.2" stroke-linecap="round"/>`}).join("");function te(t,e=!1){let o=a=>`url(#${t}-${a})`,r=R("ink"),i=e?{x:249,y:50,w:102,h:35}:{x:222,y:32,w:156,h:59};return`<svg class="art-svg" viewBox="0 0 600 456" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
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
  ${e?lt(r):""}
  <rect x="${i.x}" y="${i.y}" width="${i.w}" height="${i.h}" rx="${e?3:5}" fill="${o("screen")}" stroke="#fff" stroke-opacity=".06"/>
  ${at(103,r)}
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
</svg>`}var ct=t=>`<svg viewBox="0 0 396 167" preserveAspectRatio="none" aria-hidden="true"><defs>
  <radialGradient id="${t}-wall" cx=".5" cy=".55" r=".7"><stop offset="0" stop-color="#2a2b2e"/><stop offset=".7" stop-color="#151618"/><stop offset="1" stop-color="#08090a"/></radialGradient></defs>
  <rect width="396" height="167" fill="url(#${t}-wall)"/>
  <path d="M0 0 L40 22 V145 L0 167 M396 0 L356 22 V145 L396 167 M40 22 H356 M40 145 H356" fill="none" stroke="#fff" stroke-opacity=".06" stroke-width="1.5"/>
  <path d="M6 64 H40 M356 64 H390 M6 112 H40 M356 112 H390" stroke="#9aa1a8" stroke-opacity=".35" stroke-width="3" stroke-linecap="round"/>
  <path d="M60 14 L80 8 L100 14 L120 8 L140 14 L160 8 L180 14 L200 8 L220 14 L240 8 L260 14 L280 8 L300 14 L320 8 L336 14" fill="none" stroke="#5b5f64" stroke-opacity=".7" stroke-width="2.2" stroke-linejoin="round"/></svg>`,dt=()=>`<svg viewBox="0 0 396 167" preserveAspectRatio="none" aria-hidden="true">
  <path d="M40 112 H356" stroke="#b9c0c6" stroke-opacity=".55" stroke-width="2.4"/>
  <path d="M128 112 L138 132 H258 L268 112 Z" fill="#3b3f44"/>
  <path d="M128 112 H268" stroke="#9aa1a8" stroke-width="2"/>
  <path d="M146 112 C156 92 180 86 198 88 C218 86 240 92 250 112 Z" fill="#9c6a42"/>
  <path d="M160 104 C172 96 188 94 198 96" fill="none" stroke="#e2b07a" stroke-opacity=".55" stroke-width="3" stroke-linecap="round"/></svg>`,oe=t=>`<div class="layer w"><svg viewBox="0 0 396 167" preserveAspectRatio="none" aria-hidden="true">
  <path d="${t}" fill="none" stroke="#f2f5f7" stroke-opacity=".5" stroke-width="7" stroke-linecap="round"/></svg></div>`,ie=()=>`<div class="layer wv"><svg viewBox="0 0 396 167" aria-hidden="true">
  <circle cx="198" cy="84" r="34" fill="none" stroke="#9fd3ff" stroke-opacity=".75" stroke-width="3"/></svg></div>`,pt=(t,e)=>`<svg viewBox="0 0 396 167" preserveAspectRatio="none" aria-hidden="true"><defs>
  ${e?`<pattern id="${t}-mesh" width="4" height="4" patternUnits="userSpaceOnUse"><path d="M0 0 H4 M0 0 V4" stroke="#000" stroke-opacity=".55" stroke-width="1.3"/></pattern>`:`<pattern id="${t}-mesh" width="5" height="5" patternUnits="userSpaceOnUse"><circle cx="2.5" cy="2.5" r=".95" fill="#000" fill-opacity=".45"/></pattern>`}
  <linearGradient id="${t}-refl" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".1"/><stop offset=".4" stop-color="#fff" stop-opacity=".02"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient></defs>
  <rect width="396" height="167" fill="url(#${t}-mesh)"/>
  <rect width="396" height="167" fill="url(#${t}-refl)"/></svg>`;function re(t,e=!1){return`<div class="layer cavity">${ct(t)}</div>
    <div class="layer dish">${dt()}</div>
    <div class="layer glow"></div>
    <div class="layer light"></div>
    <div class="layer steam">${oe("M150 100 C140 80 162 66 150 46 S156 18 148 6")}${oe("M200 104 C210 82 188 66 200 44 S192 18 202 4")}${oe("M250 100 C240 78 262 64 248 42 S256 20 246 6")}</div>
    ${e?`<div class="layer waves">${ie()}${ie()}${ie()}</div>`:""}
    <div class="layer print">${pt(t,e)}</div>`}var x=t=>`var(--f-${t})`,_e={ratio:"600/620",view:"0 0 600 620",window:{left:36.67,top:48.39,width:53.33,height:41.94,radius:"4% / 5%"},ring:{path:T(212,292,336,276,18),width:4.5},lcd:{x:53.67,y:8.71,w:19.33,h:13.55},icons:{size:4.4,at:[[78,13.5],[82.6,13.5],[87.2,13.5],[91.8,13.5]]},panel:null};function we(t){let e=o=>`url(#${t}-${o})`;return`<svg class="art-svg" viewBox="0 0 600 620" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
<defs>
  <linearGradient id="${t}-body" x1="0" x2="1">
    <stop offset="0" style="stop-color:${x("lo")}"/><stop offset=".3" style="stop-color:${x("hi")}"/><stop offset=".7" style="stop-color:${x("mid")}"/><stop offset="1" style="stop-color:${x("lo")}"/>
  </linearGradient>
  <linearGradient id="${t}-glass" x1="0" x2="0" y1="0" y2="1">
    <stop offset="0" stop-color="#fff" stop-opacity=".1"/><stop offset="1" stop-color="#fff" stop-opacity=".02"/>
  </linearGradient>
  <linearGradient id="${t}-steel" x1="0" x2="1">
    <stop offset="0" stop-color="#8d949a"/><stop offset=".25" stop-color="#e9ecee"/><stop offset=".55" stop-color="#b4bac0"/><stop offset=".8" stop-color="#f4f6f7"/><stop offset="1" stop-color="#7f868c"/>
  </linearGradient>
  <linearGradient id="${t}-niche" x1="0" x2="0" y1="0" y2="1">
    <stop offset="0" stop-color="#050506"/><stop offset="1" stop-color="#18191b"/>
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
  <rect x="206" y="14" width="348" height="22" rx="7" style="fill:${x("lo")};stroke:${x("edge")}" stroke-width="1.4"/>
  <rect x="190" y="30" width="380" height="580" rx="12" fill="${e("body")}"/>
  <rect x="190.5" y="30.5" width="379" height="579" rx="12" fill="none" style="stroke:${x("edge")}" stroke-width="1.4"/>
  <rect x="190" y="30" width="380" height="176" rx="12" fill="${e("glass")}"/>
  <path d="M190 206 H570" stroke="#000" stroke-opacity=".45" stroke-width="2"/>
  <path d="M198 34 H562" stroke="#fff" stroke-opacity=".14" stroke-width="1.2"/>
</g>

<g class="controls">
  <rect x="322" y="54" width="116" height="84" rx="5" fill="${e("screen")}" stroke="#fff" stroke-opacity=".08"/>
  <path d="M214 176 H546" style="stroke:${x("ink")}" stroke-opacity=".35" stroke-width="1.2"/>
  <circle cx="236" cy="166" r="7" fill="none" style="stroke:${x("ink")}" stroke-opacity=".7" stroke-width="1.6"/>
  <path d="M236 159 v5" style="stroke:${x("ink")}" stroke-opacity=".7" stroke-width="1.6" stroke-linecap="round"/>
  <path d="M374 162 a5 5 0 1 1 -5 5" fill="none" style="stroke:${x("ink")}" stroke-opacity=".55" stroke-width="1.4"/>
</g>

<g class="front">
  <rect x="220" y="300" width="320" height="260" rx="14" fill="${e("niche")}"/>
  <rect x="328" y="212" width="104" height="90" rx="5" fill="${e("steel")}"/>
  <path d="M332 214 H428" stroke="#fff" stroke-opacity=".7" stroke-width="1.2"/>
  <rect x="340" y="296" width="80" height="10" rx="3" fill="#2c2f33"/>
  <g fill="#0c0d0e"><circle cx="366" cy="303" r="3.5"/><circle cx="380" cy="303" r="3.5"/><circle cx="394" cy="303" r="3.5"/></g>
  <rect x="214" y="540" width="332" height="30" rx="6" fill="${e("steel")}"/>
  <g stroke="#000" stroke-opacity=".28" stroke-width="2.4">${Array.from({length:15},(o,r)=>`<path d="M${236+r*20} 546 V564"/>`).join("")}</g>
  <rect x="210" y="570" width="340" height="30" rx="6" fill="#0d0e0f"/>
  <path d="M214 571 H546" stroke="#fff" stroke-opacity=".1" stroke-width="1.2"/>
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
    <div class="layer drops">${[146,160,174].map(e=>`<div class="layer d"><svg viewBox="0 0 320 260" aria-hidden="true"><path d="M${e} 10 c3 6 5 9 5 12 a5 5 0 0 1 -10 0 c0 -3 2 -6 5 -12 Z" fill="#cfe6f7" fill-opacity=".8"/></svg></div>`).join("")}</div>`}var D=t=>`var(--f-${t})`,ke={ratio:"600/292",view:"0 0 600 292",window:{left:0,top:0,width:100,height:100,radius:"0.8% / 1.7%"},ring:{path:T(4,4,592,284,7),width:3.5},lcd:{x:35,y:36,w:30,h:28,ghost:!0},icons:{size:4.4,at:[[5.5,14],[10.3,14],[15.1,14]]},panel:null},be=t=>`<svg class="art-svg" viewBox="0 0 600 292" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
<defs><linearGradient id="${t}-in" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#2a1e14"/><stop offset=".25" stop-color="#0c0b0a"/><stop offset="1" stop-color="#050505"/></linearGradient></defs>
<rect x="0" y="0" width="600" height="292" rx="5" fill="url(#${t}-in)"/>
<path d="M20 6 H580" stroke="#ffb36b" stroke-opacity=".35" stroke-width="3"/>
</svg>`,xe=t=>`<div class="layer front"><svg viewBox="0 0 600 292" preserveAspectRatio="none" aria-hidden="true"><defs>
  <linearGradient id="${t}-df" x1="0" x2="1">
    <stop offset="0" style="stop-color:${D("lo")}"/><stop offset=".22" style="stop-color:${D("mid")}"/><stop offset=".5" style="stop-color:${D("hi")}"/>
    <stop offset=".78" style="stop-color:${D("mid")}"/><stop offset="1" style="stop-color:${D("lo")}"/>
  </linearGradient>
  <linearGradient id="${t}-dv" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".09"/><stop offset=".4" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".12"/></linearGradient></defs>
  <rect x="1" y="1" width="598" height="290" rx="5" fill="url(#${t}-df)"/>
  <rect x="1" y="1" width="598" height="290" rx="5" fill="url(#${t}-dv)"/>
  <rect x="1.5" y="1.5" width="597" height="289" rx="5" fill="none" style="stroke:${D("edge")}" stroke-width="1.6"/>
  <path d="M8 3 H592" stroke="#fff" stroke-opacity=".16" stroke-width="1.2"/></svg></div>
  <div class="layer warmline"></div>`;var ft={ratio:"600/700",view:"0 0 600 700",window:{x:50,y:52,d:44},ring:{path:"M300 202 A162 162 0 1 1 300 526 A162 162 0 1 1 300 202",width:7,spin:{x:50,y:52,d:54}},lcd:{x:30,y:7.5,w:40,h:8.5},icons:{size:6,at:[[9,22],[9,30],[9,38],[9,46]]},panel:null},ht=t=>`<svg class="art-svg" viewBox="0 0 600 700" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs>
  <linearGradient id="${t}-gb" x1="0" x2="1"><stop offset="0" style="stop-color:var(--f-lo)"/><stop offset=".45" style="stop-color:var(--f-hi)"/><stop offset="1" style="stop-color:var(--f-lo)"/></linearGradient></defs>
  <rect x="20" y="10" width="560" height="676" rx="22" fill="url(#${t}-gb)" style="stroke:var(--f-edge)" stroke-width="1.5"/>
  <path d="M22 116 H578" style="stroke:var(--f-edge)" stroke-width="1.5"/>
  <rect x="172" y="46" width="256" height="70" rx="10" fill="#0b0c0e"/>
  <circle cx="300" cy="364" r="150" style="fill:var(--f-lo);stroke:var(--f-edge)" stroke-width="3"/>
  <circle cx="300" cy="364" r="132" fill="#14181d"/></svg>`,B={washer:{svg:t=>J(t,!1),geom:X,window:t=>Q(t,!1)},dryer:{svg:t=>J(t,!0),geom:X,window:t=>Q(t,!0)},steam_oven:{svg:t=>te(t,!1),geom:ee(!1),window:t=>re(t,!1)},microwave:{svg:t=>te(t,!0),geom:ee(!0),window:t=>re(t,!0)},coffee:{svg:we,geom:_e,window:ve},drawer:{svg:be,geom:ke,window:xe},generic:{svg:ht,geom:ft,window:()=>""}},$e=t=>B[t]??B.generic;var se={lotus_white:{hi:"#f7f6f2",mid:"#ebeae5",lo:"#d6d5cf",edge:"#bdbcb5",ink:"#6f6e68"},brilliant_white:{hi:"#ffffff",mid:"#f2f3f4",lo:"#dcdfe2",edge:"#c3c7cb",ink:"#6b7075"},pearl_beige:{hi:"#efe7db",mid:"#e0d6c6",lo:"#c8bca9",edge:"#aea28f",ink:"#6e6455"},clean_steel:{hi:"#e6e8ea",mid:"#c9cdd1",lo:"#a3a8ad",edge:"#8a9095",ink:"#4f555a"},graphite_grey:{hi:"#6e7175",mid:"#56595d",lo:"#3e4144",edge:"#2e3033",ink:"#b8bcc0"},obsidian_black:{hi:"#3b3c3f",mid:"#27282b",lo:"#18191b",edge:"#0e0e10",ink:"#8d9196"}},mt=t=>{let e=/^#?([0-9a-f]{6})$/i.exec(String(t).trim());return e?[0,2,4].map(o=>parseInt(e[1].slice(o,o+2),16)):null},j=t=>"#"+t.map(e=>Math.round(Math.max(0,Math.min(255,e))).toString(16).padStart(2,"0")).join(""),I=(t,e,o)=>t.map((r,i)=>r+(e[i]-r)*o);function ut(t){let e=mt(t);if(!e)return null;let o=(.2126*e[0]+.7152*e[1]+.0722*e[2])/255;return{hi:j(I(e,[255,255,255],.18)),mid:j(e),lo:j(I(e,[0,0,0],.16)),edge:j(I(e,[0,0,0],.32)),ink:j(o>.55?I(e,[0,0,0],.55):I(e,[255,255,255],.55))}}var Se=(t,e)=>se[t]??ut(t)??se[e]??se.lotus_white,Me=t=>Object.entries(t).map(([e,o])=>`--f-${e}:${o}`).join(";");var ne=`
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
.lcd { position: absolute; display: flex; align-items: center; justify-content: center; container-type: size;
  border-radius: 6px; color: #f2f4f6; font-variant-numeric: tabular-nums; white-space: nowrap; overflow: hidden; }
.lcd .t { font-size: min(58cqh, 15cqw); font-weight: 500; letter-spacing: .01em; line-height: 1; }
.lcd .t.word { font-size: min(42cqh, 11cqw); letter-spacing: 0; }
.lcd .s { font-size: min(30cqh, 8cqw); color: #9ba4ae; line-height: 1; margin-left: .45em; }
.lcd .s:empty { display: none; }
.st-off .lcd .t { color: #5d6268; }

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
.f-door .front { transform: translateY(5%) scale(1.015); }
.drawer .pic { margin-bottom: 4%; }
.warmline { bottom: auto; height: 12%; background: linear-gradient(to bottom, #ffa45c99, #ffa45c00); opacity: 0; transition: opacity 1s; }
.f-warm .warmline { opacity: 1; }
.anim-full.f-warm .warmline { animation: mc-pulse 4s ease-in-out infinite; }

.st-paused .layer, .st-paused .wave, .st-paused .jet::before { animation-play-state: paused !important; }
@media (prefers-reduced-motion: reduce) {
  .layer, .wave, .spin, .ring .bar, .jet::before, .art { animation: none !important; }
  .water, .cup .fill { transition: none !important; }
}
`;var V=t=>String(t).padStart(2,"0");function Ce(t){let e=Math.max(0,Math.round(t)),o=Math.floor(e/3600),r=Math.floor(e%3600/60),i=e%60;return o?`${o}:${V(r)}:${V(i)}`:`${r}:${V(i)}`}function ae(t){let e=Math.round(t/60);return`${Math.floor(e/60)}:${V(e%60)}`}function F(t,e,o){let r=e?.locale??{},i={hour:"2-digit",minute:"2-digit"};r.time_zone==="server"&&e?.config?.time_zone&&(i.timeZone=e.config.time_zone),r.time_format==="12"?i.hour12=!0:r.time_format==="24"&&(i.hour12=!1);try{return new Intl.DateTimeFormat(o,i).format(t)}catch{return new Date(t).toTimeString().slice(0,5)}}var E=(t,e="\xB0C")=>`${Math.round(t)} ${e}`;var Ge={washer:"#4fa3e0",dryer:"#e9a23b",steam_oven:"#e07a4f",microwave:"#e07a4f",coffee:"#c98b5a",drawer:"#e0a84f",generic:"#4fa3e0"},le=W.filter(t=>t!=="hand_iron"),w=t=>String(t??"").replace(/[&<>"]/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"})[e]),gt=0,K=class extends HTMLElement{static getStubConfig(e){let o=Z(e)[0];return o?{device_id:o.id}:{}}setConfig(e){if(!e)throw new Error("Invalid configuration");this._config={theme:"dark",animations:"full",controls:!0,...e},this._dev=null,this._hass&&this._init()}set hass(e){let o=!this._hass;if(this._hass=e,this._dev||this._init(),!this._dev)return;let r=Object.values(this._dev.roles);(o||r.some(i=>e.states[i]!==this._seen?.[i]))&&(this._seen=Object.fromEntries(r.map(i=>[i,e.states[i]])),this._update())}connectedCallback(){clearInterval(this._tick),this._tick=setInterval(()=>this._update(),1e3),this._hass&&!this._dev&&this._init()}disconnectedCallback(){clearInterval(this._tick)}getCardSize(){return 9}getGridOptions(){return{columns:12,min_columns:4,rows:"auto"}}_deviceId(){let e=this._config,o=this._hass;return e.device_id?e.device_id:e.entity?o.entities?.[e.entity]?.device_id??null:Z(o)[0]?.id??null}_init(){if(!this._config||!this._hass)return;let e=this._deviceId(),o=e?q(this._hass,e,{overrides:this._config.entities}):null;if(!o||!o.roles.status){this._dev=null,this._buildEmpty();return}this._dev=o,this._tracker=new P(o.family),this._seen=null,this._hass.loadBackendTranslation?.("entity","miele")?.then?.(()=>this._update(!0)),this._build(),this._update(!0)}get _lang(){return ge(this._hass,this._config)}_t(e,o){return ye(this._lang,e,o)}_buildEmpty(){let e=this.shadowRoot??this.attachShadow({mode:"open"});e.innerHTML=`<style>${ne}</style><ha-card class="theme-${this._themeName()}"><div class="err">${w(this._t("err.no_device"))}</div></ha-card>`}_themeName(){let e=this._config.theme;return e==="auto"?this._hass?.themes?.darkMode?"dark":"light":["dark","light","ha"].includes(e)?e:"dark"}_build(){let e=this._config,o=this._dev,r=o.family,i=this._draw=B[e.drawing]?e.drawing:r.drawing,a=$e(i),s=a.geom,c=`mc${++gt}`;this._geom=s;let l=Se(e.finish,r.finish),f=e.accent||Ge[i]||Ge.generic,n=this._name=e.name||this._hass.devices?.[o.id]?.name_by_user||this._t(`kind.${r.kind}`),d=s.icons.at.map(([g,O],H)=>`<div class="at icon" id="ic${H}" style="left:${g}%;top:${O}%;width:${s.icons.size}%"><ha-icon></ha-icon></div>`).join(""),p=s.window,v=p.d!=null,S=v?`class="at glass round" style="left:${p.x}%;top:${p.y}%;width:${p.d}%"`:`class="glass box" style="left:${p.left}%;top:${p.top}%;width:${p.width}%;height:${p.height}%;border-radius:${p.radius}"`,m=[0,1,2,3].map(g=>`<div class="row"><span class="k" id="k${g}"></span><span class="v" id="v${g}"></span></div>`).join(""),k=s.panel,M=k?`<div class="panel over" style="left:${k.left}%;right:${k.right}%;top:${k.top}%;bottom:${k.bottom}%">${m}</div>`:`<div class="panel below">${m}</div>`,y=e.images?`<img src="${w(String(e.images).replace(/\/?$/,"/")+r.drawing+".svg")}" alt="">`:a.svg(c),u=this.shadowRoot??this.attachShadow({mode:"open"});u.innerHTML=`<style>${ne}</style>
<ha-card class="${i} ${v?"round":"flat"} theme-${this._themeName()} anim-${["full","reduced","off"].includes(e.animations)?e.animations:"full"}"
  style="--c:${w(f)};${Me(l)}${e.max_width?`;--maxw:${w(e.max_width)}`:""}">
  <div class="head"><span class="name">${w(n)}</span><span class="pill" id="pill"></span></div>
  <div class="ctl" id="ctl" hidden>
    <button id="b-pause"><ha-icon icon="mdi:pause"></ha-icon>${w(this._t("btn.pause"))}</button>
    <button id="b-resume"><ha-icon icon="mdi:play"></ha-icon>${w(this._t("btn.resume"))}</button>
    <button id="b-start"><ha-icon icon="mdi:play"></ha-icon>${w(this._t("btn.start"))}</button>
    <button id="b-stop"><ha-icon icon="mdi:stop"></ha-icon>${w(this._t("btn.stop"))}</button>
    <button id="b-power"><ha-icon icon="mdi:power"></ha-icon><span id="b-power-t"></span></button>
  </div>
  <div class="ask" id="ask" hidden><span id="ask-t"></span><button id="ask-no">${w(this._t("btn.cancel"))}</button><button class="go" id="ask-yes"></button></div>
  <div class="err" id="err"></div>
  <div class="pic" id="pic" style="--ratio:${s.ratio}">
    <div class="art">${y}</div>
    <div ${S}>${a.window(c)}<div class="phase" id="phase"></div></div>
    <svg class="ring" viewBox="${s.view}" aria-hidden="true"><path class="track" d="${s.ring.path}" pathLength="100" style="stroke-width:${s.ring.width}"/>
      <path class="bar" id="bar" d="${s.ring.path}" pathLength="100" stroke-dasharray="100" stroke-dashoffset="100" style="stroke-width:${s.ring.width}"/></svg>
    ${s.ring.spin?`<div class="at spinbox" style="left:${s.ring.spin.x}%;top:${s.ring.spin.y}%;width:${s.ring.spin.d}%"><div class="spin"><svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="48.5" pathLength="100"/></svg></div></div>`:""}
    <div class="lcd${s.lcd.ghost?" ghost":""}" style="left:${s.lcd.x}%;top:${s.lcd.y}%;width:${s.lcd.w}%;height:${s.lcd.h}%"><span class="t" id="lcd-t"></span><span class="s" id="lcd-s"></span></div>
    ${d}
    ${k?M:""}
  </div>
  ${k?"":M}
</ha-card>`,this._root=u.querySelector("ha-card"),this._el=g=>u.getElementById(g),this._text={};let b=g=>()=>this._call("button","press",{entity_id:this._dev.roles[g]});this._el("b-pause").onclick=b("btn_pause"),this._el("b-resume").onclick=b("btn_start"),this._el("b-start").onclick=()=>this._ask("start"),this._el("b-stop").onclick=()=>this._ask("stop"),this._el("b-power").onclick=()=>this._vm?.state==="off"?this._power(!0):this._ask("off"),this._el("ask-no").onclick=()=>this._ask(null),this._el("ask-yes").onclick=()=>{let g=this._asking;this._ask(null),g==="start"&&b("btn_start")(),g==="stop"&&b("btn_stop")(),g==="off"&&this._power(!1)};let A=this._el("ic3");A&&(A.onclick=g=>{g.stopPropagation(),this._dev.roles.light&&this._call("light","toggle",{entity_id:this._dev.roles.light})}),this._el("pic").onclick=()=>this.dispatchEvent(new CustomEvent("hass-more-info",{detail:{entityId:this._dev.roles.status},bubbles:!0,composed:!0}))}_set(e,o){this._text[e]!==o&&(this._text[e]=o,this._el(e).textContent=o)}_setHTML(e,o){this._text[e]!==o&&(this._text[e]=o,this._el(e).innerHTML=o)}_update(){if(!this._dev||!this._root||!this._hass)return;let e=this._hass,o=this._dev,r=this._lang,i=fe(e,o.roles),a=this._vm=this._tracker.update(i,me()),s=a.flags??{},c=a.state,l=c==="running"||c==="paused",f=this._draw,n=a.program??"",d=a.phase??"",p=o.family.group==="oven",v=f==="coffee",S=f==="drawer",m=v&&c==="running"&&!s.rinsing&&!/grinding|rinse/.test(d),k={[`st-${c}`]:!0,[`m-${a.progress.mode}`]:!0,moving:l||!1,stale:a.stale,"f-spin":s.spin&&c==="running","f-anti":s.antiCrease&&c==="done","f-cool":s.cooling,"f-heat":f==="dryer"&&l&&!s.cooling||p&&c==="running"&&!s.cooling||!1,"f-heating":p&&c==="running"&&s.heating,"f-steam":p&&l&&(/steam|moisture|sous_vide|blanching|bottling|defrost/.test(n)||d==="steam_reduction"),"f-micro":p&&c==="running"&&/microwave|popcorn/.test(n),"f-grind":v&&c==="running"&&/grinding/.test(d),"f-dispense":m,"f-rinse":v&&c==="running"&&(s.rinsing||d==="rinse"),"f-warm":S&&(l||s.keepWarm),"f-door":s.doorOpen||d==="door_open",lit:l||s.doorOpen||s.antiCrease||c==="done"&&s.cooling||s.light===!0,loaded:["ready","scheduled","running","paused","done","interrupted","error"].includes(c)&&!(v&&!l),quiet:["off","standby","offline"].includes(c),wet:f==="washer"&&l&&!s.spin&&!s.drain&&!["anti_crease","drying","finished"].includes(a.phase),"has-phase":!!a.phase&&(l||c==="done")},M=Object.entries(k).filter(([,G])=>G).map(([G])=>G).join(" ");if(M!==this._cls){for(let G of(this._cls??"").split(" ").filter(Boolean))this._root.classList.remove(G);for(let G of M.split(" "))this._root.classList.add(G);this._cls=M}let y=this._t(`state.${c}`);c==="running"&&s.almostDone?y=this._t("pill.almost_done"):c==="running"&&a.phase?y=L(e,"phase",a.phase,this._lang):c==="scheduled"&&s.smartGridWait&&(y=this._t("pill.smart_grid")),this._set("pill",y),this._set("phase",a.phase?L(e,"phase",a.phase,this._lang):"");let u=a.lcd.main,b=a.lcd.sub;this._set("lcd-t",this._lcd(u,a)),this._set("lcd-s",b?.kind==="phase"?"":this._lcd(b,a)),this._el("lcd-t").classList.toggle("word",["text","program","phase"].includes(u?.kind));let A=a.progress.mode==="indeterminate"&&!this._geom.ring.spin,g=c==="error"||c==="interrupted"||A?1:a.progress.value;this._root.classList.toggle("breathe",A);let O=this._el("bar"),H=String(100-Math.round((g??0)*1e3)/10);O.style.strokeDashoffset!==H&&(O.style.strokeDashoffset=H),O.style.opacity=g==null?"0":"1";let N=o.family.group==="laundry"||o.family.group==="dishwasher";this._icon(0,a.connection==="lost"?"mdi:wifi-off":"mdi:wifi",a.connection==="lost"?"warn":s.remote?"lit":"",this._t(a.connection==="lost"?"icon.lost":"icon.remote"),!!o.roles.remote_control),this._icon(1,"mdi:cellphone-arrow-down",s.mobileStart?"lit":"",this._t("icon.mobile"),!!o.roles.mobile_start);let C=s.doorOpen?["mdi:door-open","lit","icon.door_open"]:l&&N?["mdi:lock","lit","icon.door_locked"]:["mdi:door-closed","","icon.door_closed"];this._icon(2,C[0],C[1],this._t(C[2]),!!o.roles.door),this._el("ic3")&&this._icon(3,s.light?"mdi:lightbulb-on":"mdi:lightbulb-outline",s.light?"lit":"",this._t("icon.light"),!!o.roles.light),this._rows(a,i,r),this._controls(a,i)}_icon(e,o,r,i,a){let s=`ic${e}`,c=`${o}|${r}|${i}|${a}`;if(this._text[s]===c)return;this._text[s]=c;let l=this._el(s);l.hidden=!a,l.className=`at icon ${r}${e===3?" tap":""}`,l.title=i,l.firstElementChild.setAttribute("icon",o)}_lcd(e,o){if(!e)return"";let r=this._hass,i=this._lang;switch(e.kind){case"dashes":return"--:--";case"blank":return"";case"countdown":return Ce(e.value);case"duration":return ae(e.value);case"clock":return F(e.value,r,i);case"temp":return E(e.value,o.temps.unit);case"elapsed":return`${e.value} ${this._t("unit.min")}`;case"percent":return o.progress.value==null?"":`${Math.round(o.progress.value*100)}%`;case"program":return L(r,"program",e.value,this._lang);case"phase":return L(r,"phase",e.value,this._lang);case"text":return this._t(`lcd.${e.value}`)}return""}_rows(e,o,r){let i=this._hass,a=this._dev.family,s=e.state,c=[[this._t("row.program"),e.program?w(L(i,"program",e.program,this._lang)):"\u2014"]];if(a.kind==="dryer"||a.kind==="washer_dryer"){let l=o.dryingStep,f=e.dryness?.reached,n=le.indexOf(l),d=le.indexOf(f),p=n>=0?`<span class="dots">${le.slice(0,n+1).map((v,S)=>`<i class="${S<=d?"on":""}${S===n?" target":""}" title="${w(L(i,"dryness",v,this._lang))}"></i>`).join("")}</span>`:"";c.push([this._t("row.dryness"),l?p+w(L(i,"dryness",l,this._lang)):"\u2014"])}else if(a.group==="laundry"){let l=[o.targetTemp!=null?E(o.targetTemp,e.temps.unit):null,o.spin?`${o.spin} ${this._t("unit.rpm")}`:null].filter(Boolean);c.push([this._t("row.temp"),l.length?l.join(" \xB7 "):"\u2014"])}else if(a.group==="oven"||a.group==="drawer"){let l=e.temps.unit,f=e.temps.current,n=e.temps.target,d=["running","paused","ready","scheduled"].includes(s),p=f!=null&&n!=null&&d?`${Math.round(f)} \u2192 ${E(n,l)}`:n!=null&&d?E(n,l):f!=null?E(f,l):"\u2014";c.push([this._t("row.temp"),p]),e.temps.core!=null&&d&&c.push([this._t("row.core"),e.temps.coreTarget!=null?`${Math.round(e.temps.core)} \u2192 ${E(e.temps.coreTarget,l)}`:E(e.temps.core,l)])}for(s==="ready"&&e.lcd.main?.kind==="duration"?c.push([this._t("row.duration"),ae(e.lcd.main.value)]):s==="scheduled"&&e.startAt?c.push([this._t("row.starts"),F(e.startAt,i,r)]):e.endAt&&["running","paused","done","scheduled"].includes(s)?c.push([this._t(s==="done"?"row.ended":"row.ends"),F(e.endAt,i,r)]):(s==="running"||s==="paused")&&e.elapsedMin!=null&&c.push([this._t("row.elapsed"),`${e.elapsedMin} ${this._t("unit.min")}`]);c.length<4;)c.push(["",""]);c.forEach(([l,f],n)=>{this._set(`k${n}`,l),this._setHTML(`v${n}`,f),this._el(`k${n}`).parentElement.hidden=!l})}_controls(e,o){let r=this._config.controls!==!1,i=e.controls??{},a=e.state,s=!!this._dev.roles.power&&o.power!=null,c={"b-pause":i.pause,"b-resume":i.resume,"b-start":i.start,"b-stop":i.stop,"b-power":s&&e.connection!=="lost"},l=!1;for(let[f,n]of Object.entries(c))this._el(f).hidden=!n,l||(l=!!n);this._set("b-power-t",this._t(a==="off"?"btn.on":"btn.off")),this._el("ctl").hidden=!r||!l,(!r||a==="offline")&&this._ask(null)}_ask(e){this._asking=e;let o=this._el("ask");if(o.hidden=!e,!e)return;let r=this._vm,i=this._lang==="nl"?this._name.toLowerCase():this._name,a=r&&["running","paused","scheduled"].includes(r.state);o.classList.toggle("start",e==="start"),this._set("ask-t",e==="start"?this._t("ask.start",{program:L(this._hass,"program",r?.program,this._lang)||"",name:i}):e==="off"?this._t(a?"ask.off_running":"ask.off",{name:i}):this._t("ask.stop",{name:i})),this._set("ask-yes",this._t(e==="start"?"btn.start":e==="off"?"btn.off":"btn.stop"))}_power(e){return this._call("switch",e?"turn_on":"turn_off",{entity_id:this._dev.roles.power})}async _call(e,o,r){this._set("err","");try{await this._hass.callService(e,o,r)}catch(i){let a=i?.message||String(i);i?.translation_key&&i?.translation_domain&&(a=(await this._hass.loadBackendTranslation?.("exceptions",i.translation_domain))?.(`component.${i.translation_domain}.exceptions.${i.translation_key}.message`,i.translation_placeholders)||a),this._set("err",this._t("err.send",{msg:a}))}}};var yt="0.2.0-dev",_t=(t,e,o,r)=>{customElements.get(t)||customElements.define(t,e),window.customCards=window.customCards||[],window.customCards.some(i=>i.type===t)||window.customCards.push({type:t,name:o,description:r,preview:!0,documentationURL:"https://github.com/g-force-be/ha-miele-appliance-card"})};_t("miele-appliance-card",K,"Miele appliance","A Miele appliance with a progress ring, its own display and controls");console.info(`%c MIELE-APPLIANCE-CARD %c ${yt} `,"color:#fff;background:#3b3f44;font-weight:600","color:#3b3f44;background:#e4e6e9");export{yt as VERSION};
