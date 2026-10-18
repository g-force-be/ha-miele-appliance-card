/*! Miele Appliance Card for Home Assistant — https://github.com/g-force-be/ha-miele-appliance-card
 * MIT License. Copyright (c) 2026 My Media Build; Copyright (c) 2026 Peter Gheeraert.
 * Based on hOn Washer & Dryer Card by My Media Build (https://github.com/spikey1965/ha-hon-appliance-card), MIT.
 * Not affiliated with or endorsed by Miele. Miele is a trademark of Miele & Cie. KG. */
var ge={sensor:{status:"status",program_id:"program",program_phase:"phase",program_type:"program_type",remaining_time:"remaining",elapsed_time:"elapsed",start_time:"start_in",finish:"finish",start:"start_ts",target_temperature:"target_temp",core_temperature:"core_temp",core_target_temperature:"core_target",temperature_zone_2:"temp_2",temperature_zone_3:"temp_3",spin_speed:"spin_speed",drying_step:"drying_step",energy_consumption:"energy",energy_forecast:"energy_forecast",water_consumption:"water",water_forecast:"water_forecast",twin_dos_1_level:"twindos_1",twin_dos_2_level:"twindos_2"},binary_sensor:{remote_control:"remote_control",mobile_start:"mobile_start",smart_grid:"smart_grid",notification_active:"notification"},button:{start:"btn_start",stop:"btn_stop",pause:"btn_pause"},switch:{power:"power"},light:{light:"light",ambient_light:"ambient_light"}},_e={state_status:"status",state_program_id:"program",state_program_phase:"phase",state_program_type:"program_type",state_remaining_time:"remaining",state_elapsed_time:"elapsed",state_start_time:"start_in",state_finish_timestamp:"finish",state_start_timestamp:"start_ts",state_target_temperature:"target_temp",state_temperature_1:"temp",state_core_temperature:"core_temp",state_core_target_temperature:"core_target",state_spinning_speed:"spin_speed",state_drying_step:"drying_step",current_energy_consumption:"energy",energy_forecast:"energy_forecast",current_water_consumption:"water",water_forecast:"water_forecast",twin_dos_1_level:"twindos_1",twin_dos_2_level:"twindos_2",state_signal_door:"door",state_signal_failure:"failure",state_signal_info:"notification",state_full_remote_control:"remote_control",state_mobile_start:"mobile_start",state_smart_grid:"smart_grid",start:"btn_start",stop:"btn_stop",pause:"btn_pause",poweronoff:"power",light:"light"},ye={"sensor.temperature":"temp","binary_sensor.door":"door","binary_sensor.problem":"failure"},ve=[["program_ended","status"],["no_program","program"],["normal_operation_mode","program_type"],["not_running","phase"],["extra_dry","drying_step"]];function we(o,e,t,r){let i=o.slice(0,o.indexOf(".")),n=e?.translation_key;if(n)return ge[i]?.[n]??null;if(r){let c=_e[r.slice(r.indexOf("-")+1)];if(c)return c}let l=t?.attributes??{};if(i==="sensor"&&l.device_class==="enum"&&Array.isArray(l.options)){for(let[c,a]of ve)if(l.options.includes(c))return a}return ye[`${i}.${l.device_class}`]??null}function be(o,e,{uniqueIds:t={},overrides:r={}}={}){let i={};for(let[n,l]of Object.entries(o.entities??{})){if(l.device_id!==e||l.platform!=="miele")continue;let c=we(n,l,o.states?.[n],t[n]);c&&!i[c]&&(i[c]=n)}for(let[n,l]of Object.entries(r??{}))l&&(i[n]=l);return i}var ke={"washing machine":"washer","tumble dryer":"dryer","washer dryer":"washer_dryer",dishwasher:"dishwasher",oven:"oven","oven microwave":"oven_microwave","steam oven":"steam_oven","steam oven combi":"steam_oven_combi","steam oven micro":"steam_oven_micro","dialog oven":"dialog_oven",microwave:"microwave","coffee system":"coffee","warming drawer":"drawer",hob:"hob","hob extraction":"hob",hood:"hood",refrigerator:"fridge",freezer:"fridge","fridge freezer":"fridge","wine cabinet":"wine","wine conditioning unit":"wine","wine unit":"wine","wine cabinet freezer":"wine","robot vacuum cleaner":"vacuum"},xe=[[/^(WT|WWT)/,"washer_dryer"],[/^W/,"washer"],[/^T/,"dryer"],[/^G/,"dishwasher"],[/^ESW/,"drawer"],[/^(CM|CVA)/,"coffee"],[/^DGM/,"steam_oven_micro"],[/^DG/,"steam_oven_combi"],[/^H\w*BM/,"oven_microwave"],[/^M/,"microwave"],[/^H/,"oven"],[/^KM/,"hob"],[/^DA/,"hood"],[/^KWT/,"wine"],[/^(K|F)/,"fridge"],[/^RX/,"vacuum"]],$e={washer:{group:"laundry",drawing:"washer"},washer_dryer:{group:"laundry",drawing:"washer"},dryer:{group:"laundry",drawing:"dryer"},dishwasher:{group:"dishwasher",drawing:"generic"},oven:{group:"oven",drawing:"steam_oven"},steam_oven:{group:"oven",drawing:"steam_oven"},steam_oven_combi:{group:"oven",drawing:"steam_oven"},dialog_oven:{group:"oven",drawing:"steam_oven"},steam_oven_micro:{group:"oven",drawing:"microwave"},oven_microwave:{group:"oven",drawing:"microwave"},microwave:{group:"oven",drawing:"microwave"},coffee:{group:"coffee",drawing:"coffee"},drawer:{group:"drawer",drawing:"drawer"}};function Se(o,e){let t=String(e??"").replace(/\s+/g,"").toUpperCase(),r=ke[String(o??"").trim().toLowerCase()];if(!r){let n=t||String(o??"").replace(/\s+/g,"").toUpperCase();r=xe.find(([l])=>l.test(n))?.[1]??"other"}let i=$e[r]??{group:"other",drawing:"generic"};return{kind:r,group:i.group,drawing:i.drawing,builtIn:r==="coffee"?t.startsWith("CVA"):!["washer","washer_dryer","dryer","vacuum","other"].includes(r),finish:i.group==="laundry"?"lotus_white":"obsidian_black"}}function z(o,e){let t=new Set;for(let r of Object.values(o.entities??{}))r.platform==="miele"&&r.device_id&&t.add(r.device_id);return[...t].map(r=>R(o,r,e)).sort((r,i)=>String(r.areaId).localeCompare(String(i.areaId))||r.name.localeCompare(i.name))}function R(o,e,t){let r=o.devices?.[e]??{};return{id:e,name:r.name_by_user||r.name||e,model:r.model??null,modelId:r.model_id??null,areaId:r.area_id??null,family:Se(r.model,r.model_id),roles:be(o,e,t)}}var Me=new Set(["unknown","unavailable",""]),Ce=o=>o!=null&&!Me.has(o),Le={s:1/60,min:1,h:60,d:1440},Ge=(o,e)=>o==null?null:o*(Le[e]??1);function ee(o,e){let t=s=>e[s]?o.states?.[e[s]]:void 0,r=s=>{let d=t(s)?.state;return Ce(d)?d:null},i=s=>{let d=r(s),f=d==null?NaN:Number(d);return Number.isFinite(f)?f:null},n=s=>Ge(i(s),t(s)?.attributes?.unit_of_measurement),l=s=>{let d=t(s);return d?Date.parse(d.last_changed):NaN},c=s=>{let d=r(s),f=d==null?NaN:Date.parse(d);return Number.isFinite(f)?f:null},a=s=>{let d=r(s);return d==="on"?!0:d==="off"?!1:null},u=s=>e[s]?t(s)?t(s).state==="unavailable"?"unavailable":"available":"disabled":"none";return{status:t("status")?.state??null,statusAt:l("status"),program:r("program"),phase:r("phase"),programType:r("program_type"),remaining:n("remaining"),remainingAt:l("remaining"),elapsed:n("elapsed"),elapsedAt:l("elapsed"),startIn:n("start_in"),finish:c("finish"),startTs:c("start_ts"),temp:i("temp"),targetTemp:i("target_temp"),coreTemp:i("core_temp"),coreTarget:i("core_target"),tempUnit:t("temp")?.attributes?.unit_of_measurement??t("target_temp")?.attributes?.unit_of_measurement??"\xB0C",spin:i("spin_speed"),dryingStep:r("drying_step"),energyForecast:i("energy_forecast"),waterForecast:i("water_forecast"),twindos1:i("twindos_1"),twindos2:i("twindos_2"),door:a("door"),failure:a("failure"),notification:a("notification"),remote:a("remote_control"),mobileStart:a("mobile_start"),smartGrid:a("smart_grid"),power:a("power"),light:a("light"),buttons:{start:u("btn_start"),stop:u("btn_stop"),pause:u("btn_pause")}}}var Ae={off:"off",reserved:"off",on:"standby",idle:"standby",programmed:"ready",waiting_to_start:"scheduled",in_use:"running",rinse_hold:"running",autocleaning:"running",superheating:"running",superfreezing:"running",supercooling:"running",supercooling_superfreezing:"running",pause:"paused",program_ended:"done",program_interrupted:"interrupted",failure:"error",service:"error"},S=new Set(["ready","scheduled","running","paused"]),De=new Set(["scheduled","running","paused","done"]),Ee=new Set(["off","standby"]),te=new Set(["not_running"]),Te=new Set(["finished","process_finished"]);function X(o){let e=o.status;if(e==null||e==="not_connected"||e==="unavailable")return{state:"offline",connected:!1,guessed:!1};if(e==="unknown"){if(o.phase==null&&o.program==null)return{state:"offline",connected:!1,guessed:!1};let r=te.has(o.phase)||o.phase==null?"standby":Te.has(o.phase)?"done":"running";return{state:o.failure?"error":r,connected:!0,guessed:!0}}return{state:o.failure?"error":Ae[e]??"standby",connected:!0,guessed:!1}}var J=new Set(["heating_up_phase","pre_heating","heating_up"]),Oe=new Set(["cooling_down","comfort_cooling","safety_cooling","cooling_phase"]),D=["machine_iron","hand_iron_2","hand_iron","hand_iron_1","slightly_dry","normal","normal_plus","extra_dry"],Q=o=>D.indexOf(o),ze=2,A=class{constructor(e,t={}){this.family=e,this.opts={holdMs:6e4,activeHoldMs:20*6e4,endGraceMs:5*6e4,debounceMs:1e3,...t},this.prev=null,this.good=null,this.offlineSince=null,this.unknownSince=null,this.c=this._newCycle(null)}_newCycle(e){return{since:e,pausedMs:0,pauseStart:null,heatFrom:null,maxRemaining:null,lastElapsed:null,program:null,reachedDry:null,frozen:null,last:null,readyProgram:void 0,readySince:null,readyShown:null}}update(e,t){let r=this.opts,i=X(e),n=(c,a)=>this.good?t-c<a||Ee.has(this.good.state)?!0:De.has(this.good.state)?this.good.endAt?t<this.good.endAt+r.endGraceMs:t-c<r.activeHoldMs:!1:!1;if(!i.connected)return this.unknownSince=null,this.offlineSince==null&&(this.offlineSince=Number.isFinite(e.statusAt)&&e.statusAt<=t?e.statusAt:t),n(this.offlineSince,r.holdMs)?this._compute(this.good.snap,t,{stale:!0,connection:"lost"}):this._offline(t);if(this.offlineSince=null,i.guessed){if(this.unknownSince==null&&(this.unknownSince=t),t-this.unknownSince<r.holdMs&&this.good)return this._compute(this.good.snap,t,{stale:!0,connection:"ok"})}else this.unknownSince=null;let l=this._compute(e,t,{stale:!1,connection:"ok",guessed:i.guessed});return this.good={snap:e,state:l.state,endAt:l.state==="done"?null:l.endAt},l}_offline(e){return{state:"offline",phase:null,program:null,stale:!1,connection:"lost",offlineSince:this.offlineSince,lastState:this.good?.state??null,progress:{mode:"none",value:null},leftSec:null,endAt:null,startAt:null,lcd:{main:{kind:"dashes"},sub:{kind:"text",value:"offline"}},flags:{},dryness:null,temps:{},controls:{}}}_compute(e,t,{stale:r,connection:i,guessed:n=!1}){let l=this.family,c=this.opts,a=X(e).state,u=this.prev,s=this.c;if(!r){let y=Number.isFinite(e.statusAt)&&e.statusAt<=t?e.statusAt:t,b=l.group==="oven"&&a==="running"&&s.program&&e.program&&e.program!=="no_program"&&e.program!==s.program,me=e.elapsed!=null&&s.lastElapsed!=null&&e.elapsed<s.lastElapsed;(S.has(a)&&!S.has(u)||me||b)&&(s=this.c=this._newCycle(t)),a==="paused"&&s.pauseStart==null&&(s.pauseStart=y,s.frozen=s.last),a!=="paused"&&s.pauseStart!=null&&(s.pausedMs+=Math.max(0,y-s.pauseStart),s.pauseStart=null,s.frozen=null),e.program&&e.program!=="no_program"&&(s.program=e.program),e.elapsed!=null&&(s.lastElapsed=e.elapsed),e.remaining!=null&&e.remaining>0&&(a==="ready"?s.maxRemaining=e.remaining:a==="running"&&(s.maxRemaining=Math.max(s.maxRemaining??0,e.remaining))),D.includes(e.phase)&&(s.reachedDry==null||Q(e.phase)>Q(s.reachedDry))&&(s.reachedDry=e.phase),this.prev=a}let d=a==="running"||a==="paused",f=S.has(a)||a==="done",w=e.program&&e.program!=="no_program"?e.program:f?s.program:null,g=e.phase&&!te.has(e.phase)?e.phase:null,h=null;if(e.remaining!=null&&e.remaining>0){let y=e.remaining*60,b=Number.isFinite(e.remainingAt)?Math.max(0,(t-e.remainingAt)/1e3):0;h=a==="running"?Math.max(y-b,y-60):y}else e.finish!=null&&(a==="running"||a==="scheduled")&&(h=Math.max(0,(e.finish-t)/1e3));let x=l.group==="oven"&&e.targetTemp!=null&&e.temp!=null&&d,L=x&&J.has(e.phase)&&e.temp<e.targetTemp-ze;L&&!r&&(s.heatFrom=Math.min(s.heatFrom??e.temp,e.temp));let _="none",m=null,G=!1,U=(s.pausedMs+(s.pauseStart!=null?Math.max(0,t-s.pauseStart):0))/1e3;if(a==="done")_="done",m=1;else if(a==="paused"&&s.frozen)({mode:_,progress:m}=s.frozen),h=s.frozen.leftSec??h;else if(d){if(L){_="heat";let y=s.heatFrom??e.temp,b=e.targetTemp-y;m=b>0?Math.min(.99,Math.max(0,(e.temp-y)/b)):0}else if(h!=null){if(_="time",e.elapsed!=null){let y=a==="running"&&Number.isFinite(e.elapsedAt)?Math.min(59,Math.max(0,(t-e.elapsedAt)/1e3)):0,b=Math.max(0,e.elapsed*60+y-U);m=b+h>0?b/(b+h):0}else s.maxRemaining&&(m=1-h/(s.maxRemaining*60));a==="running"&&h<=0&&(G=!0)}else(l.group==="laundry"||l.group==="dishwasher")&&e.remaining===0&&a==="running"?(_="time",G=!0,h=0,m=Math.max(s.last?.progress??0,.99)):x?(_="at_temp",m=1):_="indeterminate";m!=null&&(m=Math.min(_==="at_temp"?1:.99,Math.max(0,m)))}!r&&a==="running"&&(s.last={mode:_,progress:m,leftSec:h});let fe=S.has(a)?e.finish??(h>0?t+h*1e3:null):a==="done"?e.finish:null,V=a!=="scheduled"?null:e.startTs!=null&&e.startTs>t?e.startTs:e.startIn?t+e.startIn*6e4:null,K=null;a==="ready"&&(e.program!==s.readyProgram&&(s.readyProgram=e.program,s.readySince=t),(s.readyShown==null||t-s.readySince>=c.debounceMs)&&(s.readyShown=e.remaining),K=s.readyShown);let Y={heating:d&&J.has(e.phase),cooling:Oe.has(e.phase)&&(d||a==="done"),antiCrease:e.phase==="anti_crease",keepWarm:e.phase==="keeping_warm",rinsing:e.status==="autocleaning",spin:e.phase==="spin",drain:e.phase==="drain",almostDone:G,doorOpen:e.door===!0,smartGridWait:a==="scheduled"&&e.smartGrid===!0,remote:e.remote===!0,mobileStart:e.mobileStart===!0,light:e.light},$=e.buttons,ue={pause:a==="running"&&$.pause==="available",resume:a==="paused"&&$.start==="available",start:a==="ready"&&$.start==="available",stop:S.has(a)&&$.stop==="available",disabled:Object.entries($).filter(([,y])=>y==="disabled").map(([y])=>y)},he=(l.kind==="dryer"||l.kind==="washer_dryer")&&f&&(e.dryingStep||s.reachedDry)?{target:e.dryingStep,reached:s.reachedDry}:null;return{state:a,phase:g,program:w,programType:e.programType,stale:r,connection:i,guessed:n,progress:{mode:_,value:m},leftSec:h,endAt:fe,startAt:V,flags:Y,dryness:he,lcd:this._lcd({state:a,mode:_,leftSec:h,almostDone:G,readyDur:K,startAt:V,snap:e,program:w,phase:g,flags:Y}),temps:{current:e.temp,target:e.targetTemp,core:e.coreTemp,coreTarget:e.coreTarget,unit:e.tempUnit},elapsedMin:e.elapsed,pausedSec:Math.round(U),controls:ue}}_lcd({state:e,mode:t,leftSec:r,almostDone:i,readyDur:n,startAt:l,snap:c,program:a,phase:u,flags:s}){let d=this.family.group;switch(e){case"off":return{main:{kind:"dashes"},sub:null};case"standby":return{main:{kind:"blank"},sub:null};case"ready":return{main:n?{kind:"duration",value:n*60}:{kind:"blank"},sub:{kind:"text",value:"ready"}};case"scheduled":return{main:l?{kind:"clock",value:l}:{kind:"dashes"},sub:{kind:"text",value:s.smartGridWait?"smart_grid":"starts"}};case"done":return{main:{kind:"text",value:"end"},sub:u?{kind:"phase",value:u}:null};case"interrupted":return{main:{kind:"text",value:"interrupted"},sub:null};case"error":return{main:{kind:"text",value:"error"},sub:null}}let f=e==="paused"?{kind:"text",value:"paused"}:null;return i?{main:{kind:"text",value:"almost_done"},sub:f??{kind:"percent"}}:t==="time"?{main:{kind:"countdown",value:r},sub:f??{kind:"percent"}}:t==="heat"?{main:{kind:"temp",value:c.temp},sub:f??{kind:"text",value:"heating"}}:t==="at_temp"?{main:{kind:"temp",value:c.temp},sub:f??(c.elapsed!=null?{kind:"elapsed",value:c.elapsed}:{kind:"text",value:"at_temp"})}:d==="coffee"?{main:s.rinsing?{kind:"text",value:"rinsing"}:a?{kind:"program",value:a}:{kind:"blank"},sub:u?{kind:"phase",value:u}:f}:d==="drawer"&&c.temp!=null?{main:{kind:"temp",value:c.temp},sub:u?{kind:"phase",value:u}:f}:c.elapsed!=null?{main:{kind:"elapsed",value:c.elapsed},sub:f}:{main:a?{kind:"program",value:a}:{kind:"blank"},sub:f}}};var oe=()=>typeof globalThis.__MIELE_NOW__=="function"?globalThis.__MIELE_NOW__():Date.now();var Re={state:{off:"Uit",offline:"Niet verbonden",standby:"Aan",ready:"Klaar om te starten",scheduled:"Gepland",running:"Bezig",paused:"Gepauzeerd",done:"Klaar",interrupted:"Onderbroken",error:"Storing"},lcd:{ready:"Klaar",starts:"Start om",smart_grid:"Slim starten",end:"Einde",interrupted:"Onderbroken",error:"Storing",almost_done:"Bijna klaar",heating:"Opwarmen",at_temp:"Op temperatuur",paused:"Pauze",rinsing:"Spoelen",offline:"Geen verbinding"},row:{program:"Programma",temp:"Temperatuur",spin:"Centrifuge",dryness:"Droogtegraad",ends:"Klaar om",ended:"Klaar om",duration:"Duur",starts:"Start om",elapsed:"Bezig sinds"},pill:{almost_done:"Bijna klaar",smart_grid:"Wacht op slim starten",lost:"Geen verbinding"},btn:{pause:"Pauzeren",resume:"Hervatten",start:"Starten",stop:"Stoppen",off:"Uitzetten",on:"Aanzetten",cancel:"Annuleren"},ask:{stop:"{name} stoppen? Het programma wordt afgebroken.",off:"{name} uitzetten?",off_running:"{name} uitzetten? Het programma stopt.",start:"{program} starten op de {name}?"},icon:{remote:"Bediening op afstand",mobile:"Start op afstand",door_open:"Deur open",door_closed:"Deur dicht",door_locked:"Deur vergrendeld",lost:"Geen verbinding, laatste toestand"},err:{send:"Niet verstuurd: {msg}",no_device:"Geen Miele-toestel gevonden. Kies een toestel in de kaartinstellingen."},unit:{rpm:"tpm",min:"min"},kind:{washer:"Wasmachine",dryer:"Droogkast",washer_dryer:"Was-droogcombinatie",dishwasher:"Vaatwasser",oven:"Oven",steam_oven:"Stoomoven",steam_oven_combi:"Stoomoven",steam_oven_micro:"Stoomoven met microgolf",dialog_oven:"Dialog-oven",oven_microwave:"Oven met microgolf",microwave:"Microgolfoven",coffee:"Koffiemachine",drawer:"Warmhoudlade",hob:"Kookplaat",hood:"Dampkap",fridge:"Koelkast",wine:"Wijnkast",vacuum:"Robotstofzuiger",other:"Miele-toestel"}},N={state:{off:"Off",offline:"Not connected",standby:"On",ready:"Ready to start",scheduled:"Scheduled",running:"Running",paused:"Paused",done:"Finished",interrupted:"Interrupted",error:"Fault"},lcd:{ready:"Ready",starts:"Starts at",smart_grid:"Smart start",end:"End",interrupted:"Interrupted",error:"Fault",almost_done:"Almost done",heating:"Heating up",at_temp:"At temperature",paused:"Paused",rinsing:"Rinsing",offline:"No connection"},row:{program:"Programme",temp:"Temperature",spin:"Spin",dryness:"Dryness",ends:"Ends at",ended:"Ended at",duration:"Duration",starts:"Starts at",elapsed:"Running for"},pill:{almost_done:"Almost done",smart_grid:"Waiting for smart start",lost:"No connection"},btn:{pause:"Pause",resume:"Resume",start:"Start",stop:"Stop",off:"Switch off",on:"Switch on",cancel:"Cancel"},ask:{stop:"Stop the {name}? This cancels the programme.",off:"Switch the {name} off?",off_running:"Switch the {name} off? The programme stops.",start:"Start {program} on the {name}?"},icon:{remote:"Remote control",mobile:"Remote start",door_open:"Door open",door_closed:"Door closed",door_locked:"Door locked",lost:"No connection, last known state"},err:{send:"Not sent: {msg}",no_device:"No Miele appliance found. Pick one in the card settings."},unit:{rpm:"rpm",min:"min"},kind:{washer:"Washing machine",dryer:"Tumble dryer",washer_dryer:"Washer dryer",dishwasher:"Dishwasher",oven:"Oven",steam_oven:"Steam oven",steam_oven_combi:"Steam oven",steam_oven_micro:"Steam oven with microwave",dialog_oven:"Dialog oven",oven_microwave:"Oven with microwave",microwave:"Microwave",coffee:"Coffee machine",drawer:"Warming drawer",hob:"Hob",hood:"Cooker hood",fridge:"Fridge",wine:"Wine cabinet",vacuum:"Robot vacuum",other:"Miele appliance"}},re={nl:Re,en:N},ie=(o,e)=>{let t=String(e?.language||o?.locale?.language||o?.language||"en").slice(0,2).toLowerCase();return re[t]?t:"en"};function ne(o,e,t){let r=e.split(".").reduce((i,n)=>i?.[n],re[o]??N)??e.split(".").reduce((i,n)=>i?.[n],N)??e;return t?r.replace(/\{(\w+)\}/g,(i,n)=>t[n]??""):r}function k(o,e,t){if(t==null)return"";let r={program:"program_id",phase:"program_phase",dryness:"drying_step",status:"status"}[e];return o?.localize?.(`component.miele.entity.sensor.${r}.state.${t}`)||String(t).replace(/_/g," ").replace(/^./,n=>n.toUpperCase())}var H={ratio:"600/850",glass:{x:50,y:43.53,d:50},ring:{x:50,y:43.53,d:79.4},lcd:{x:36.33,y:3.06,w:27.33,h:7.53},icons:{size:5.8,at:[[9,7.4],[16,7.4],[23,7.4]]},panel:{left:4.5,right:4.5,top:75.6,bottom:5.4}},p=o=>`var(--f-${o})`;function Ne(o,e){let t=[26,20,30,22,28,18,24],r="";return t.forEach((i,n)=>{let l=e-27+n*9,c=t[6-n];r+=`<rect x="${o-40-i}" y="${l-1.1}" width="${i}" height="2.2" rx="1.1"/><circle cx="${o-34}" cy="${l}" r="1.3"/>`,r+=`<rect x="${o+40}" y="${l-1.1}" width="${c}" height="2.2" rx="1.1"/><circle cx="${o+34}" cy="${l}" r="1.3"/>`}),r}var Ie=(o,e,t,r,i)=>`<rect x="${o}" y="${e}" width="${t}" height="${r}" rx="${r/2}" fill="${i("slot")}"/>
  <path d="M${o+r/2} ${e+1.2} H${o+t-r/2}" stroke="#000" stroke-opacity=".18" stroke-width="2" stroke-linecap="round"/>`,I=(o,e,t)=>`<circle cx="${o}" cy="${e}" r="10.5" fill="${t("knob")}" style="stroke:${p("edge")}" stroke-width="1.4"/>`;function P(o,e=!1){let t=i=>`url(#${o}-${i})`,r="M10 18 H590 V127 H214 C209 150 190 168 152 170 H10 Z";return`<svg class="art-svg" viewBox="0 0 600 850" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
<defs>
  <linearGradient id="${o}-body" x1="0" x2="1">
    <stop offset="0" style="stop-color:${p("lo")}"/><stop offset=".05" style="stop-color:${p("mid")}"/>
    <stop offset=".42" style="stop-color:${p("hi")}"/><stop offset=".92" style="stop-color:${p("mid")}"/><stop offset="1" style="stop-color:${p("lo")}"/>
  </linearGradient>
  <linearGradient id="${o}-sheen" x1="0" x2="0" y1="0" y2="1">
    <stop offset="0" stop-color="#fff" stop-opacity=".14"/><stop offset=".3" stop-color="#fff" stop-opacity="0"/>
    <stop offset=".85" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".1"/>
  </linearGradient>
  <linearGradient id="${o}-panel" x1="0" x2="0" y1="0" y2="1">
    <stop offset="0" style="stop-color:${p("hi")}"/><stop offset=".7" style="stop-color:${p("hi")}"/><stop offset="1" style="stop-color:${p("mid")}"/>
  </linearGradient>
  <linearGradient id="${o}-under" x1="0" x2="0" y1="0" y2="1">
    <stop offset="0" stop-color="#000" stop-opacity=".12"/><stop offset="1" stop-color="#000" stop-opacity="0"/>
  </linearGradient>
  <linearGradient id="${o}-slot" x1="0" x2="0" y1="0" y2="1">
    <stop offset="0" style="stop-color:${p("edge")}"/><stop offset=".6" style="stop-color:${p("lo")}"/><stop offset="1" style="stop-color:${p("mid")}"/>
  </linearGradient>
  <linearGradient id="${o}-flap" x1="0" x2="0" y1="0" y2="1">
    <stop offset="0" style="stop-color:${p("hi")}"/><stop offset="1" style="stop-color:${p("mid")}"/>
  </linearGradient>
  <radialGradient id="${o}-knob" cx=".42" cy=".38" r=".7">
    <stop offset="0" style="stop-color:${p("hi")}"/><stop offset=".75" style="stop-color:${p("mid")}"/><stop offset="1" style="stop-color:${p("lo")}"/>
  </radialGradient>
  <linearGradient id="${o}-chrome" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#fbfcfd"/><stop offset=".15" stop-color="#cfd4d9"/><stop offset=".32" stop-color="#8a9299"/>
    <stop offset=".48" stop-color="#f3f5f7"/><stop offset=".66" stop-color="#a4abb2"/><stop offset=".82" stop-color="#e6e9ec"/><stop offset="1" stop-color="#7a828a"/>
  </linearGradient>
  <linearGradient id="${o}-chromeIn" x1="1" y1="1" x2="0" y2="0">
    <stop offset="0" stop-color="#f4f6f7"/><stop offset=".35" stop-color="#9ea6ad"/><stop offset=".6" stop-color="#e2e6e9"/><stop offset="1" stop-color="#8c949b"/>
  </linearGradient>
  <radialGradient id="${o}-bezel" cx=".5" cy=".42" r=".55">
    <stop offset=".72" stop-color="${e?"#5b6066":"#3a3e43"}"/><stop offset=".88" stop-color="${e?"#3d4146":"#1f2225"}"/><stop offset="1" stop-color="#121416"/>
  </radialGradient>
  <radialGradient id="${o}-glass" cx=".45" cy=".4" r=".65">
    <stop offset="0" stop-color="#7d858c"/><stop offset=".7" stop-color="#454b51"/><stop offset="1" stop-color="#22262a"/>
  </radialGradient>
  <radialGradient id="${o}-shadow">
    <stop offset=".9" stop-color="#000" stop-opacity=".16"/><stop offset="1" stop-color="#000" stop-opacity="0"/>
  </radialGradient>
  <radialGradient id="${o}-ground" cx=".5" cy=".5" r=".5">
    <stop offset="0" stop-color="#000" stop-opacity=".3"/><stop offset="1" stop-color="#000" stop-opacity="0"/>
  </radialGradient>
  <linearGradient id="${o}-screen" x1="0" x2="0" y1="0" y2="1">
    <stop offset="0" stop-color="#17191c"/><stop offset="1" stop-color="#060708"/>
  </linearGradient>
  <clipPath id="${o}-top"><path d="${r}"/></clipPath>
</defs>

<ellipse cx="300" cy="842" rx="292" ry="8" fill="${t("ground")}"/>

<g class="body">
  <rect x="10" y="8" width="580" height="830" rx="10" fill="${t("body")}"/>
  <rect x="10" y="8" width="580" height="830" rx="10" fill="${t("sheen")}"/>
  <rect x="10.5" y="8.5" width="579" height="829" rx="10" fill="none" style="stroke:${p("edge")}" stroke-width="1.3"/>
  <path d="M14 10 H586" stroke="#fff" stroke-opacity=".6" stroke-width="1.4"/>
  <path d="M10 18 H590" style="stroke:${p("edge")}" stroke-opacity=".7" stroke-width="1.1"/>
</g>

<g class="controls">
  <path d="${r}" fill="${t("panel")}"/>
  <path d="M214 127 C209 150 190 168 152 170 H10 V188 H152 C200 186 226 160 232 145 H590 V127 Z" fill="${t("under")}"/>
  <path d="M590 127 H214 C209 150 190 168 152 170 H10" fill="none" style="stroke:${p("edge")}" stroke-width="1.3"/>
  <path d="M207 19 V110" style="stroke:${p("edge")}" stroke-opacity=".75" stroke-width="1.1"/>
  ${Ie(44,128,110,24,t)}
  <rect x="218" y="26" width="164" height="64" rx="6" fill="${t("screen")}"/>
  <path d="M222 29 H378 L362 46 H222 Z" fill="#fff" opacity=".045"/>
  <g style="fill:${p("ink")}" opacity=".26">${Ne(486,50)}</g>
  <circle cx="486" cy="50" r="26" fill="${t("chrome")}"/>
  <circle cx="486" cy="50" r="22.5" fill="${t("chromeIn")}"/>
  <circle cx="486" cy="50" r="19" fill="${t("knob")}" stroke="#000" stroke-opacity=".08"/>
  <path d="M486 37 V44" style="stroke:${p("ink")}" stroke-width="2.6" stroke-linecap="round"/>
</g>

<g class="door">
  <circle cx="303" cy="377" r="238" fill="${t("shadow")}"/>
  <circle cx="300" cy="370" r="228" fill="${t("chrome")}"/>
  <circle cx="300" cy="370" r="214" fill="${t("chromeIn")}"/>
  <circle cx="300" cy="370" r="186" fill="#8d959c"/>
  <circle cx="300" cy="370" r="183" fill="${t("bezel")}"/>
  <circle cx="300" cy="370" r="151" fill="${t("glass")}"/>
  <path d="M520 334 a228 228 0 0 1 0 72" fill="none" stroke="#000" stroke-opacity=".22" stroke-width="7" stroke-linecap="round"/>
  <path d="M110 250 a222 222 0 0 1 150 -100" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="3.5" stroke-linecap="round"/>
</g>

<g class="lower">
  ${e?`<rect x="30" y="646" width="236" height="154" rx="8" fill="${t("flap")}" style="stroke:${p("edge")}" stroke-width="1.3"/>
  ${I(148,722,t)}
  <rect x="274" y="646" width="296" height="154" rx="8" fill="${t("flap")}" style="stroke:${p("edge")}" stroke-width="1.3"/>
  <g style="fill:${p("lo")}">${Array.from({length:13},(i,n)=>`<rect x="290" y="${660+n*10.4}" width="264" height="5" rx="2.5"/>`).join("")}</g>
  <g fill="#000" opacity=".1">${Array.from({length:13},(i,n)=>`<rect x="290" y="${660+n*10.4}" width="264" height="1.6" rx=".8"/>`).join("")}</g>`:`<rect x="35" y="646" width="180" height="152" rx="8" fill="${t("flap")}" style="stroke:${p("edge")}" stroke-width="1.3"/>
  ${I(125,672,t)}
  <rect x="272" y="646" width="292" height="152" rx="8" fill="${t("flap")}" style="stroke:${p("edge")}" stroke-width="1.3"/>
  ${I(418,672,t)}`}
  <rect x="10" y="810" width="580" height="28" rx="6" style="fill:${p("lo")}"/>
  <path d="M12 810.5 H588" style="stroke:${p("edge")}" stroke-width="1.2"/>
  <rect x="10" y="830" width="580" height="8" rx="4" fill="#000" opacity=".22"/>
</g>
</svg>`}var He=o=>`<pattern id="${o}-hex" width="13" height="22.5" patternUnits="userSpaceOnUse" patternTransform="rotate(8)">
  <path d="M6.5 0 L13 3.75 L13 11.25 L6.5 15 L0 11.25 L0 3.75 Z M6.5 15 V22.5" fill="none" stroke="#000" stroke-opacity=".14" stroke-width=".9"/>
  <path d="M6.5 1.2 L11.8 4.3" stroke="#fff" stroke-opacity=".35" stroke-width=".8"/>
</pattern>`,Pe=o=>`<pattern id="${o}-hex" width="7" height="12.12" patternUnits="userSpaceOnUse" patternTransform="rotate(8)">
  <circle cx="3.5" cy="3" r="1.25" fill="#000" fill-opacity=".38"/><circle cx="0" cy="9.06" r="1.25" fill="#000" fill-opacity=".38"/><circle cx="7" cy="9.06" r="1.25" fill="#000" fill-opacity=".38"/>
</pattern>`,We=(o,e)=>`<svg viewBox="0 0 200 200" aria-hidden="true"><defs>
  <radialGradient id="${o}-steel" cx=".5" cy=".46" r=".56">
    <stop offset="0" stop-color="#e3e6e9"/><stop offset=".4" stop-color="#c3c8cd"/><stop offset=".78" stop-color="#8e959b"/><stop offset="1" stop-color="#4e5459"/>
  </radialGradient>
  <linearGradient id="${o}-lifter" x1="0" x2="1"><stop offset="0" stop-color="#f4f6f7"/><stop offset="1" stop-color="#a9b0b6"/></linearGradient>
  ${e?Pe(o):He(o)}</defs>
  <circle cx="100" cy="100" r="100" fill="url(#${o}-steel)"/>
  <circle cx="100" cy="100" r="94" fill="url(#${o}-hex)"/>
  <circle cx="100" cy="100" r="58" fill="none" stroke="#000" stroke-opacity=".1" stroke-width="10"/>
  <g fill="url(#${o}-lifter)" stroke="#000" stroke-opacity=".16" stroke-width=".8">
    <path d="M92 8 C96 26 104 34 116 38 L110 8 Z"/><path d="M92 8 C96 26 104 34 116 38 L110 8 Z" transform="rotate(120 100 100)"/><path d="M92 8 C96 26 104 34 116 38 L110 8 Z" transform="rotate(240 100 100)"/>
  </g>
  <circle cx="100" cy="100" r="15" fill="#cfd3d7" stroke="#000" stroke-opacity=".18"/><circle cx="100" cy="100" r="6" fill="#9aa1a7"/></svg>`,je=(o,e)=>{let t=e?["#7d8fa3","#e9e5dc","#c3958c","#a9b0b8","#8f9e86","#ddd6c8"]:["#3f5a78","#e7e3db","#b98582","#8b929a","#86a084","#d8d2c6"];return`<svg viewBox="0 0 200 200" aria-hidden="true"><defs>
  <linearGradient id="${o}-fold" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".2"/><stop offset=".55" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".32"/></linearGradient>
  <clipPath id="${o}-towel"><path d="M86 158 C84 140 98 128 118 128 C140 126 160 136 164 152 C168 168 154 182 132 184 C108 186 88 176 86 158 Z"/></clipPath></defs>
  <g stroke="#000" stroke-opacity=".16" stroke-width="1.2" stroke-linejoin="round">
    <path d="M118 120 L134 106 C146 102 160 108 166 120 L170 140 C162 148 148 150 136 146 L120 140 C112 134 112 126 118 120 Z" fill="${t[3]}"/>
    <path d="M30 128 C30 116 42 110 52 112 L66 116 C72 122 70 132 62 136 L44 140 C36 140 30 136 30 128 Z" fill="${t[4]}"/>
    <path d="M56 134 C60 118 76 108 94 108 L110 112 C122 116 126 128 120 138 C112 148 96 152 82 150 L66 148 C58 146 54 140 56 134 Z" fill="${t[2]}"/>
    <path d="M24 160 C26 146 40 136 58 134 L88 132 C100 134 106 144 102 156 L96 170 C88 180 72 184 56 182 L38 178 C28 174 22 168 24 160 Z" fill="${t[0]}"/>
    <path d="M86 158 C84 140 98 128 118 128 C140 126 160 136 164 152 C168 168 154 182 132 184 C108 186 88 176 86 158 Z" fill="${t[1]}"/>
    <path d="M128 172 C134 164 150 162 160 168 L172 176 C170 186 158 192 146 190 L132 186 C124 182 124 176 128 172 Z" fill="${t[5]}"/>
  </g>
  <g clip-path="url(#${o}-towel)" fill="${t[0]}" opacity=".55"><rect x="80" y="146" width="100" height="5"/><rect x="80" y="155" width="100" height="2.5"/></g>
  <path d="M24 160 C26 146 40 136 58 134 L88 132 C100 134 106 144 102 156 L96 170 C88 180 72 184 56 182 L38 178 C28 174 22 168 24 160 Z
    M86 158 C84 140 98 128 118 128 C140 126 160 136 164 152 C168 168 154 182 132 184 C108 186 88 176 86 158 Z
    M56 134 C60 118 76 108 94 108 L110 112 C122 116 126 128 120 138 C112 148 96 152 82 150 L66 148 C58 146 54 140 56 134 Z" fill="url(#${o}-fold)"/>
  <path d="M40 150 C52 146 66 150 74 160 M62 172 C72 166 84 166 92 172 M100 150 C112 144 126 146 134 156 M72 124 C82 120 94 122 102 130 M128 118 C138 116 150 120 156 130"
    fill="none" stroke="#000" stroke-opacity=".2" stroke-width="1.6" stroke-linecap="round"/>
  <path d="M58 136 L66 128 M110 113 L104 122" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="1.4" stroke-linecap="round"/></svg>`},Fe=o=>`<svg viewBox="0 0 400 200" preserveAspectRatio="none" aria-hidden="true"><defs>
  <linearGradient id="${o}-water" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#7fb8e6" stop-opacity=".55"/><stop offset="1" stop-color="#2d6aa3" stop-opacity=".62"/></linearGradient></defs>
  <path d="M0 132 C25 124 50 140 75 132 S125 124 150 132 S200 140 225 132 S275 124 300 132 S350 140 375 132 S400 128 400 128 V200 H0 Z" fill="url(#${o}-water)"/>
  <path d="M0 132 C25 124 50 140 75 132 S125 124 150 132 S200 140 225 132 S275 124 300 132 S350 140 375 132" fill="none" stroke="#d8ecfb" stroke-opacity=".5" stroke-width="1.6"/></svg>`,qe=o=>`<svg viewBox="0 0 200 200" aria-hidden="true"><defs>
  <radialGradient id="${o}-vig" cx=".5" cy=".5" r=".5"><stop offset=".72" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".45"/></radialGradient>
  <linearGradient id="${o}-shine" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".26"/><stop offset=".45" stop-color="#fff" stop-opacity=".03"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient></defs>
  <circle cx="100" cy="100" r="100" fill="#0d1218" opacity=".1"/>
  <circle cx="100" cy="100" r="100" fill="url(#${o}-vig)"/>
  <path d="M30 70 A80 80 0 0 1 112 22 A92 92 0 0 0 46 96 Z" fill="url(#${o}-shine)"/></svg>`;function W(o,e=!1){return`<div class="layer drum">${We(o,e)}</div>
    <div class="layer laundry">${je(o,e)}</div>
    ${e?'<div class="layer heat"></div><div class="layer chill"></div>':`<div class="layer water"><div class="wave">${Fe(o)}</div></div>`}
    <div class="layer led"></div>
    <div class="layer reflect">${qe(o)}</div>`}var Ze={ratio:"600/700",glass:{x:50,y:52,d:44},ring:{x:50,y:52,d:60},lcd:{x:30,y:7.5,w:40,h:8.5},icons:{size:7.5,at:[[9,36],[9,45],[9,54]]},panel:{left:8,right:8,top:76,bottom:5}},Be=o=>`<svg class="art-svg" viewBox="0 0 600 700" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs>
  <linearGradient id="${o}-gb" x1="0" x2="1"><stop offset="0" style="stop-color:var(--f-lo)"/><stop offset=".45" style="stop-color:var(--f-hi)"/><stop offset="1" style="stop-color:var(--f-lo)"/></linearGradient></defs>
  <rect x="20" y="10" width="560" height="676" rx="22" fill="url(#${o}-gb)" style="stroke:var(--f-edge)" stroke-width="1.5"/>
  <rect x="20" y="10" width="560" height="96" rx="22" style="fill:var(--f-mid);stroke:var(--f-edge)" stroke-width="1.5"/>
  <rect x="172" y="46" width="256" height="70" rx="10" fill="#0b0c0e"/>
  <circle cx="300" cy="364" r="150" style="fill:var(--f-lo);stroke:var(--f-edge)" stroke-width="3"/>
  <circle cx="300" cy="364" r="132" fill="#14181d"/></svg>`,se={washer:{svg:o=>P(o,!1),geom:H,window:o=>W(o,!1),round:!0},dryer:{svg:o=>P(o,!0),geom:H,window:o=>W(o,!0),round:!0},generic:{svg:Be,geom:Ze,window:()=>"",round:!0}},ae=o=>se[o]??se.generic;var j={lotus_white:{hi:"#f7f6f2",mid:"#ebeae5",lo:"#d6d5cf",edge:"#bdbcb5",ink:"#6f6e68"},brilliant_white:{hi:"#ffffff",mid:"#f2f3f4",lo:"#dcdfe2",edge:"#c3c7cb",ink:"#6b7075"},pearl_beige:{hi:"#efe7db",mid:"#e0d6c6",lo:"#c8bca9",edge:"#aea28f",ink:"#6e6455"},clean_steel:{hi:"#e6e8ea",mid:"#c9cdd1",lo:"#a3a8ad",edge:"#8a9095",ink:"#4f555a"},graphite_grey:{hi:"#6e7175",mid:"#56595d",lo:"#3e4144",edge:"#2e3033",ink:"#b8bcc0"},obsidian_black:{hi:"#3b3c3f",mid:"#27282b",lo:"#18191b",edge:"#0e0e10",ink:"#8d9196"}},Ue=o=>{let e=/^#?([0-9a-f]{6})$/i.exec(String(o).trim());return e?[0,2,4].map(t=>parseInt(e[1].slice(t,t+2),16)):null},M=o=>"#"+o.map(e=>Math.round(Math.max(0,Math.min(255,e))).toString(16).padStart(2,"0")).join(""),C=(o,e,t)=>o.map((r,i)=>r+(e[i]-r)*t);function Ve(o){let e=Ue(o);if(!e)return null;let t=(.2126*e[0]+.7152*e[1]+.0722*e[2])/255;return{hi:M(C(e,[255,255,255],.18)),mid:M(e),lo:M(C(e,[0,0,0],.16)),edge:M(C(e,[0,0,0],.32)),ink:M(t>.55?C(e,[0,0,0],.55):C(e,[255,255,255],.55))}}var le=(o,e)=>j[o]??Ve(o)??j[e]??j.lotus_white,ce=o=>Object.entries(o).map(([e,t])=>`--f-${e}:${t}`).join(";");var F=`
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
.glass { aspect-ratio: 1; border-radius: 50%; overflow: hidden; background: #0d1116; isolation: isolate; }
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

/* the progress ring round the door */
.ring { aspect-ratio: 1; pointer-events: none; }
.ring svg { position: absolute; inset: 0; width: 100%; height: 100%; transform: rotate(-90deg); overflow: visible; }
.ring .track { fill: none; stroke: #0000001f; stroke-width: 1.7; }
.ring .bar { fill: none; stroke: var(--rc); stroke-width: 1.9; stroke-linecap: round; transition: stroke-dashoffset 1s linear, stroke .6s, opacity .4s; }
.ring .spin { position: absolute; inset: 0; opacity: 0; transition: opacity .4s; }
.ring .spin circle { fill: none; stroke: var(--rc); stroke-width: 1.9; stroke-linecap: round; stroke-dasharray: 12 88; }
.m-indeterminate .ring .spin { opacity: 1; }
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

/* information on the lower front */
.panel { position: absolute; display: grid; align-content: center; gap: .9cqw; padding: 1.6cqw 3.4cqw; border-radius: 2.6cqw;
  background: var(--mc-panel); color: var(--mc-panel-fg); box-shadow: 0 0 0 1px var(--mc-panel-line), 0 2px 10px #0000001f;
  font-size: clamp(11px, 3.35cqw, 14.5px); line-height: 1.3; }
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
.anim-full.m-indeterminate .ring .spin, .anim-reduced.m-indeterminate .ring .spin { animation: mc-rot 2.6s linear infinite; }
.st-paused .layer, .st-paused .wave { animation-play-state: paused !important; }
@media (prefers-reduced-motion: reduce) {
  .layer, .wave, .ring .spin { animation: none !important; }
  .water { transition: none; }
}
`;var E=o=>String(o).padStart(2,"0");function de(o){let e=Math.max(0,Math.round(o)),t=Math.floor(e/3600),r=Math.floor(e%3600/60),i=e%60;return t?`${t}:${E(r)}:${E(i)}`:`${r}:${E(i)}`}function q(o){let e=Math.round(o/60);return`${Math.floor(e/60)}:${E(e%60)}`}function T(o,e,t){let r=e?.locale??{},i={hour:"2-digit",minute:"2-digit"};r.time_zone==="server"&&e?.config?.time_zone&&(i.timeZone=e.config.time_zone),r.time_format==="12"?i.hour12=!0:r.time_format==="24"&&(i.hour12=!1);try{return new Intl.DateTimeFormat(t,i).format(o)}catch{return new Date(o).toTimeString().slice(0,5)}}var Z=(o,e="\xB0C")=>`${Math.round(o)} ${e}`;var pe={washer:"#4fa3e0",dryer:"#e9a23b",steam_oven:"#e07a4f",microwave:"#e07a4f",coffee:"#c98b5a",drawer:"#e0a84f",generic:"#4fa3e0"},B=D.filter(o=>o!=="hand_iron"),v=o=>String(o??"").replace(/[&<>"]/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"})[e]),Ke=0,O=class extends HTMLElement{static getStubConfig(e){let t=z(e)[0];return t?{device_id:t.id}:{}}setConfig(e){if(!e)throw new Error("Invalid configuration");this._config={theme:"dark",animations:"full",controls:!0,...e},this._dev=null,this._hass&&this._init()}set hass(e){let t=!this._hass;if(this._hass=e,this._dev||this._init(),!this._dev)return;let r=Object.values(this._dev.roles);(t||r.some(i=>e.states[i]!==this._seen?.[i]))&&(this._seen=Object.fromEntries(r.map(i=>[i,e.states[i]])),this._update())}connectedCallback(){clearInterval(this._tick),this._tick=setInterval(()=>this._update(),1e3),this._hass&&!this._dev&&this._init()}disconnectedCallback(){clearInterval(this._tick)}getCardSize(){return 9}getGridOptions(){return{columns:12,min_columns:4,rows:"auto"}}_deviceId(){let e=this._config,t=this._hass;return e.device_id?e.device_id:e.entity?t.entities?.[e.entity]?.device_id??null:z(t)[0]?.id??null}_init(){if(!this._config||!this._hass)return;let e=this._deviceId(),t=e?R(this._hass,e,{overrides:this._config.entities}):null;if(!t||!t.roles.status){this._dev=null,this._buildEmpty();return}this._dev=t,this._tracker=new A(t.family),this._seen=null,this._hass.loadBackendTranslation?.("entity","miele")?.then?.(()=>this._update(!0)),this._build(),this._update(!0)}get _lang(){return ie(this._hass,this._config)}_t(e,t){return ne(this._lang,e,t)}_buildEmpty(){let e=this.shadowRoot??this.attachShadow({mode:"open"});e.innerHTML=`<style>${F}</style><ha-card class="theme-${this._themeName()}"><div class="err">${v(this._t("err.no_device"))}</div></ha-card>`}_themeName(){let e=this._config.theme;return e==="auto"?this._hass?.themes?.darkMode?"dark":"light":["dark","light","ha"].includes(e)?e:"dark"}_build(){let e=this._config,t=this._dev,r=t.family,i=ae(r.drawing),n=i.geom,l=`mc${++Ke}`;this._round=i.round;let c=le(e.finish,r.finish),a=e.accent||pe[r.drawing]||pe.generic,u=this._name=e.name||this._hass.devices?.[t.id]?.name_by_user||this._t(`kind.${r.kind}`),s=n.icons.at.map(([g,h],x)=>`<div class="at icon" id="ic${x}" style="left:${g}%;top:${h}%;width:${n.icons.size}%"><ha-icon></ha-icon></div>`).join(""),d=e.images?`<img src="${v(String(e.images).replace(/\/?$/,"/")+r.drawing+".svg")}" alt="">`:i.svg(l),f=this.shadowRoot??this.attachShadow({mode:"open"});f.innerHTML=`<style>${F}</style>
<ha-card class="${r.drawing} theme-${this._themeName()} anim-${["full","reduced","off"].includes(e.animations)?e.animations:"full"}"
  style="--c:${v(a)};${ce(c)}${e.max_width?`;--maxw:${v(e.max_width)}`:""}">
  <div class="head"><span class="name">${v(u)}</span><span class="pill" id="pill"></span></div>
  <div class="ctl" id="ctl" hidden>
    <button id="b-pause"><ha-icon icon="mdi:pause"></ha-icon>${v(this._t("btn.pause"))}</button>
    <button id="b-resume"><ha-icon icon="mdi:play"></ha-icon>${v(this._t("btn.resume"))}</button>
    <button id="b-start"><ha-icon icon="mdi:play"></ha-icon>${v(this._t("btn.start"))}</button>
    <button id="b-stop"><ha-icon icon="mdi:stop"></ha-icon>${v(this._t("btn.stop"))}</button>
    <button id="b-power"><ha-icon icon="mdi:power"></ha-icon><span id="b-power-t"></span></button>
  </div>
  <div class="ask" id="ask" hidden><span id="ask-t"></span><button id="ask-no">${v(this._t("btn.cancel"))}</button><button class="go" id="ask-yes"></button></div>
  <div class="err" id="err"></div>
  <div class="pic" id="pic" style="--ratio:${n.ratio}">
    <div class="art">${d}</div>
    <div class="at glass" style="left:${n.glass.x}%;top:${n.glass.y}%;width:${n.glass.d}%">${i.window(l)}<div class="phase" id="phase"></div></div>
    <div class="at ring" style="left:${n.ring.x}%;top:${n.ring.y}%;width:${n.ring.d}%">
      <svg viewBox="0 0 100 100"><circle class="track" cx="50" cy="50" r="48.5" pathLength="100"/>
        <circle class="bar" id="bar" cx="50" cy="50" r="48.5" pathLength="100" stroke-dasharray="100" stroke-dashoffset="100"/></svg>
      <div class="spin"><svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="48.5" pathLength="100"/></svg></div>
    </div>
    <div class="lcd" style="left:${n.lcd.x}%;top:${n.lcd.y}%;width:${n.lcd.w}%;height:${n.lcd.h}%"><span class="t" id="lcd-t"></span><span class="s" id="lcd-s"></span></div>
    ${s}
    <div class="panel" style="left:${n.panel.left}%;right:${n.panel.right}%;top:${n.panel.top}%;bottom:${n.panel.bottom}%">
      <div class="row"><span class="k" id="k0"></span><span class="v" id="v0"></span></div>
      <div class="row"><span class="k" id="k1"></span><span class="v" id="v1"></span></div>
      <div class="row"><span class="k" id="k2"></span><span class="v" id="v2"></span></div>
    </div>
  </div>
</ha-card>`,this._root=f.querySelector("ha-card"),this._el=g=>f.getElementById(g),this._text={};let w=g=>()=>this._call("button","press",{entity_id:this._dev.roles[g]});this._el("b-pause").onclick=w("btn_pause"),this._el("b-resume").onclick=w("btn_start"),this._el("b-start").onclick=()=>this._ask("start"),this._el("b-stop").onclick=()=>this._ask("stop"),this._el("b-power").onclick=()=>this._vm?.state==="off"?this._power(!0):this._ask("off"),this._el("ask-no").onclick=()=>this._ask(null),this._el("ask-yes").onclick=()=>{let g=this._asking;this._ask(null),g==="start"&&w("btn_start")(),g==="stop"&&w("btn_stop")(),g==="off"&&this._power(!1)},this._el("pic").onclick=()=>this.dispatchEvent(new CustomEvent("hass-more-info",{detail:{entityId:this._dev.roles.status},bubbles:!0,composed:!0}))}_set(e,t){this._text[e]!==t&&(this._text[e]=t,this._el(e).textContent=t)}_setHTML(e,t){this._text[e]!==t&&(this._text[e]=t,this._el(e).innerHTML=t)}_update(){if(!this._dev||!this._root||!this._hass)return;let e=this._hass,t=this._dev,r=this._lang,i=ee(e,t.roles),n=this._vm=this._tracker.update(i,oe()),l=n.flags??{},c=n.state,a=c==="running"||c==="paused",u={[`st-${c}`]:!0,[`m-${n.progress.mode}`]:!0,moving:a||!1,stale:n.stale,"f-spin":l.spin&&c==="running","f-anti":l.antiCrease&&c==="done","f-cool":l.cooling,"f-heat":t.family.drawing==="dryer"&&a&&!l.cooling||!1,lit:a||l.doorOpen||l.antiCrease||c==="done"&&l.cooling,loaded:["ready","scheduled","running","paused","done","interrupted","error"].includes(c),quiet:["off","standby","offline"].includes(c),wet:t.family.drawing==="washer"&&a&&!l.spin&&!l.drain&&!["anti_crease","drying","finished"].includes(n.phase),"has-phase":!!n.phase&&(a||c==="done")},s=Object.entries(u).filter(([,m])=>m).map(([m])=>m).join(" ");if(s!==this._cls){for(let m of(this._cls??"").split(" ").filter(Boolean))this._root.classList.remove(m);for(let m of s.split(" "))this._root.classList.add(m);this._cls=s}let d=this._t(`state.${c}`);c==="running"&&l.almostDone?d=this._t("pill.almost_done"):c==="running"&&n.phase?d=k(e,"phase",n.phase):c==="scheduled"&&l.smartGridWait&&(d=this._t("pill.smart_grid")),this._set("pill",d),this._set("phase",n.phase?k(e,"phase",n.phase):"");let f=n.lcd.main,w=n.lcd.sub;this._set("lcd-t",this._lcd(f,n)),this._set("lcd-s",w?.kind==="phase"&&this._round?"":this._lcd(w,n)),this._el("lcd-t").classList.toggle("word",["text","program","phase"].includes(f?.kind));let g=c==="error"||c==="interrupted"?1:n.progress.value,h=this._el("bar"),x=String(100-Math.round((g??0)*1e3)/10);h.style.strokeDashoffset!==x&&(h.style.strokeDashoffset=x),h.style.opacity=g==null?"0":"1";let L=t.family.group==="laundry"||t.family.group==="dishwasher";this._icon(0,n.connection==="lost"?"mdi:wifi-off":"mdi:wifi",n.connection==="lost"?"warn":l.remote?"lit":"",this._t(n.connection==="lost"?"icon.lost":"icon.remote"),!!t.roles.remote_control),this._icon(1,"mdi:cellphone-arrow-down",l.mobileStart?"lit":"",this._t("icon.mobile"),!!t.roles.mobile_start);let _=l.doorOpen?["mdi:door-open","lit","icon.door_open"]:a&&L?["mdi:lock","lit","icon.door_locked"]:["mdi:door-closed","","icon.door_closed"];this._icon(2,_[0],_[1],this._t(_[2]),!!t.roles.door),this._rows(n,i,r),this._controls(n,i)}_icon(e,t,r,i,n){let l=`ic${e}`,c=`${t}|${r}|${i}|${n}`;if(this._text[l]===c)return;this._text[l]=c;let a=this._el(l);a.hidden=!n,a.className=`at icon ${r}`,a.title=i,a.firstElementChild.setAttribute("icon",t)}_lcd(e,t){if(!e)return"";let r=this._hass,i=this._lang;switch(e.kind){case"dashes":return"--:--";case"blank":return"";case"countdown":return de(e.value);case"duration":return q(e.value);case"clock":return T(e.value,r,i);case"temp":return Z(e.value,t.temps.unit);case"elapsed":return`${e.value} ${this._t("unit.min")}`;case"percent":return t.progress.value==null?"":`${Math.round(t.progress.value*100)}%`;case"program":return k(r,"program",e.value);case"phase":return k(r,"phase",e.value);case"text":return this._t(`lcd.${e.value}`)}return""}_rows(e,t,r){let i=this._hass,n=this._dev.family,l=e.state,c=[[this._t("row.program"),e.program?v(k(i,"program",e.program)):"\u2014"]];if(n.drawing==="dryer"){let a=t.dryingStep,u=e.dryness?.reached,s=B.indexOf(a),d=B.indexOf(u),f=s>=0?`<span class="dots">${B.slice(0,s+1).map((w,g)=>`<i class="${g<=d?"on":""}${g===s?" target":""}" title="${v(k(i,"dryness",w))}"></i>`).join("")}</span>`:"";c.push([this._t("row.dryness"),a?f+v(k(i,"dryness",a)):"\u2014"])}else if(n.group==="laundry"){let a=[t.targetTemp!=null?Z(t.targetTemp,e.temps.unit):null,t.spin?`${t.spin} ${this._t("unit.rpm")}`:null].filter(Boolean);c.push([this._t("row.temp"),a.length?a.join(" \xB7 "):"\u2014"])}l==="ready"&&e.lcd.main?.kind==="duration"?c.push([this._t("row.duration"),q(e.lcd.main.value)]):l==="scheduled"&&e.startAt?c.push([this._t("row.starts"),T(e.startAt,i,r)]):e.endAt&&["running","paused","done","scheduled"].includes(l)?c.push([this._t(l==="done"?"row.ended":"row.ends"),T(e.endAt,i,r)]):c.push(["",""]),c.forEach(([a,u],s)=>{this._set(`k${s}`,a),this._setHTML(`v${s}`,u),this._el(`k${s}`).parentElement.hidden=!a})}_controls(e,t){let r=this._config.controls!==!1,i=e.controls??{},n=e.state,l=!!this._dev.roles.power&&t.power!=null,c={"b-pause":i.pause,"b-resume":i.resume,"b-start":i.start,"b-stop":i.stop,"b-power":l&&e.connection!=="lost"},a=!1;for(let[u,s]of Object.entries(c))this._el(u).hidden=!s,a||(a=!!s);this._set("b-power-t",this._t(n==="off"?"btn.on":"btn.off")),this._el("ctl").hidden=!r||!a,(!r||n==="offline")&&this._ask(null)}_ask(e){this._asking=e;let t=this._el("ask");if(t.hidden=!e,!e)return;let r=this._vm,i=this._lang==="nl"?this._name.toLowerCase():this._name,n=r&&["running","paused","scheduled"].includes(r.state);t.classList.toggle("start",e==="start"),this._set("ask-t",e==="start"?this._t("ask.start",{program:k(this._hass,"program",r?.program)||"",name:i}):e==="off"?this._t(n?"ask.off_running":"ask.off",{name:i}):this._t("ask.stop",{name:i})),this._set("ask-yes",this._t(e==="start"?"btn.start":e==="off"?"btn.off":"btn.stop"))}_power(e){return this._call("switch",e?"turn_on":"turn_off",{entity_id:this._dev.roles.power})}async _call(e,t,r){this._set("err","");try{await this._hass.callService(e,t,r)}catch(i){let n=i?.message||String(i);i?.translation_key&&i?.translation_domain&&(n=(await this._hass.loadBackendTranslation?.("exceptions",i.translation_domain))?.(`component.${i.translation_domain}.exceptions.${i.translation_key}.message`,i.translation_placeholders)||n),this._set("err",this._t("err.send",{msg:n}))}}};var Ye="0.2.0-dev",Xe=(o,e,t,r)=>{customElements.get(o)||customElements.define(o,e),window.customCards=window.customCards||[],window.customCards.some(i=>i.type===o)||window.customCards.push({type:o,name:t,description:r,preview:!0,documentationURL:"https://github.com/g-force-be/ha-miele-appliance-card"})};Xe("miele-appliance-card",O,"Miele appliance","A Miele appliance with a progress ring, its own display and controls");console.info(`%c MIELE-APPLIANCE-CARD %c ${Ye} `,"color:#fff;background:#3b3f44;font-weight:600","color:#3b3f44;background:#e4e6e9");export{Ye as VERSION};
