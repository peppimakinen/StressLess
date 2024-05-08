import"./modulepreload-polyfill-B5Qt9EMX.js";import{c as h,a as _,h as I,g as x,b as w,r as C}from"./checkdata-CK_wV3AH.js";import{s as g}from"./snackbar-BNtgsuzo.js";import"./fetch-CGUiTqyx.js";async function M(e,o={}){try{const t=await fetch("https://hyte-server-aleksi.northeurope.cloudapp.azure.com/api/entries",o);if(!t.ok)throw new Error(`HTTP error! status: ${t.status}`);const n=await t.json();return console.log("Response data:",n),n}catch(t){console.error("Error:",t)}}async function T(e,o){M(e,o).then(t=>{console.log("Response data:",t)}).catch(t=>{console.error("Error:",t)})}const k=document.querySelectorAll(".moodBtn");k.forEach(e=>{e.addEventListener("click",()=>{k.forEach(o=>{o.classList.remove("selected")}),e.classList.add("selected")})});function R(e){switch(e){case"redBtn":return"FF8585";case"yellowBtn":return"FFF67E";case"greenBtn":return"9BCF53";default:return""}}async function b(){const o=document.querySelector(".FormPopupNew .EntryHeading").textContent,t=h(o);console.log(t);let n="";k.forEach(E=>{E.classList.contains("selected")&&(n=R(E.id)),E.classList.remove("selected")});const s=document.getElementById("ActivitiesNew"),r=s.selectedIndex,u=[s.options[r].value],l=document.querySelector(".notesNew input").value,d=localStorage.getItem("token");if(console.log(d),!d){console.error("Token not found in local storage");return}const f={entry_date:t,mood_color:n,activities:u,notes:l};console.log(f);const y={method:"POST",headers:{"Content-Type":"application/json",Authorization:"Bearer "+d},body:JSON.stringify(f)};try{await T("https://hyte-server-aleksi.northeurope.cloudapp.azure.com/api/entries",y)}catch(E){console.error("Error submitting new entry:",E)}}async function z(e,o={}){try{const t=await fetch("https://hyte-server-aleksi.northeurope.cloudapp.azure.com/api/entries",o);if(!t.ok)throw new Error(`HTTP error! status: ${t.status}`);const n=await t.json();return console.log("Response data:",n),n}catch(t){console.error("Error:",t)}}async function O(e,o){z(e,o).then(t=>{console.log("Response data:",t)}).catch(t=>{console.error("Error:",t)})}const P=document.querySelectorAll(".moodBtn");P.forEach(e=>{e.addEventListener("click",()=>{P.forEach(o=>{o.classList.remove("selected")}),e.classList.add("selected")})});function Y(e){switch(e){case"redBtn":return"FF8585";case"yellowBtn":return"FFF67E";case"greenBtn":return"9BCF53";default:return""}}async function $(){const e=document.querySelector(".FormPopupEdit .EntryHeading"),o=h(e.textContent);let t="";P.forEach(y=>{y.classList.contains("selected")&&(t=Y(y.id)),y.classList.remove("selected")});const n=document.getElementById("ActivitiesEdit"),s=n.selectedIndex,a=[n.options[s].value],u=document.querySelector(".notesEdit input").value,l=localStorage.getItem("token");if(!l){console.error("Token not found in local storage");return}const d={entry_date:o,mood_color:t,activities:a,notes:u};console.log(d);const f={method:"PUT",headers:{"Content-Type":"application/json",Authorization:"Bearer "+l},body:JSON.stringify(d)};try{await O("https://hyte-server-aleksi.northeurope.cloudapp.azure.com/api/entries",f)}catch(y){console.error("Error submitting entry edits:",y)}}async function j(){try{const e=localStorage.getItem("token");if(!e)throw new Error("Bearer token missing");const o={Authorization:`Bearer ${e}`},t=await fetch("https://hyte-server-aleksi.northeurope.cloudapp.azure.com/api/survey/activities",{headers:o});if(!t.ok)throw new Error("Failed to fetch activities");return await t.json()}catch(e){return console.error(e),[]}}async function A(e){const o=document.getElementById(e);o.innerHTML="";try{const t=await j();if(!t.hasOwnProperty("activities"))throw new Error("Activities data not found in response");const n=t.activities;if(!Array.isArray(n))throw new Error("Activities data is not an array");const s=document.createElement("option");if(s.value="",s.textContent="Valitse...",o.appendChild(s),n.length>0)n.forEach(r=>{const a=document.createElement("option");a.value=r,a.textContent=r,o.appendChild(a)});else{const r=document.createElement("option");r.value="",r.textContent="No activities available",o.appendChild(r)}}catch(t){console.error(t)}}const q=document.querySelector(".FormPopupNew"),F=document.querySelector(".PopupPastEntry"),L=document.querySelector(".FormPopupEdit"),N=document.querySelector(".InfoPopup"),S=document.querySelector(".calendarBackground"),D=document.getElementById("overlay");function V(){document.getElementById("NotesNew").value=""}let m="";async function G(e){V(),m=e;const o=h(m);console.log(o);try{await _(o)?(q.style.display="flex",S.style.display="none",D.style.display="block",document.querySelectorAll(".FormPopupNew .EntryHeading").forEach(n=>{n.textContent=m}),A("ActivitiesNew")):g("Red","HRV dataa ei löytynyt.")}catch(t){console.error("Error checking HRV data:",t),g("Red","HRV dataa ei löytynyt.")}}async function J(e,o){m=e;const t=h(m);console.log(t);try{const n=I(o,t);if(console.log("Has entry for date:",n),n){const s=await x(t);document.querySelectorAll(".PopupPastEntry .EntryHeading").forEach(a=>{a.textContent=m}),document.querySelector(".PopupPastEntry .hrv #sns").textContent="SNS-indeksi: "+s.measurement_data.sns_index,document.querySelector(".PopupPastEntry .hrv #pns").textContent="PNS-indeksi: "+s.measurement_data.pns_index,document.querySelector(".PopupPastEntry .hrv #stress").textContent="Stressi-indeksi: "+s.measurement_data.stress_index;const r=s.activities&&s.activities.length>0?s.activities.join(", "):"No activities";document.querySelector(".PopupPastEntry .activitiesPast p").textContent=r,document.querySelector(".PopupPastEntry .notesPast p").textContent=s.diary_entry.notes||"No notes",F.style.display="flex",S.style.display="none",D.style.display="block"}else alert("No entry found for the selected date.")}catch(n){console.error("Error fetching entry data:",n)}}function U(e){L.style.display="flex",F.style.display="none",document.querySelector(".FormPopupEdit .EntryHeading").textContent=e;const o=h(e);x(o).then(t=>{document.getElementById("NotesEdit").value=t.diary_entry.notes;const n=t.diary_entry.mood_color;document.querySelectorAll(".moodBtn").forEach(r=>{r.id===W(n)?r.classList.add("selected"):r.classList.remove("selected")}),A("ActivitiesEdit").then(()=>{const r=document.getElementById("ActivitiesEdit"),a=t.activities[0],u=[...r.options].findIndex(l=>l.value===a);r.selectedIndex=u})})}function W(e){switch(e){case"FF8585":return"redBtn";case"FFF67E":return"yellowBtn";case"9BCF53":return"greenBtn";default:return""}}function H(){N.style.display="block",D.style.display="block",S.style.display="none"}function B(){q.style.display="none",F.style.display="none",L.style.display="none",N.style.display="none",S.style.display="block",D.style.display="none"}let p=new Date,i=p.getFullYear(),c=p.getMonth();const K=document.querySelectorAll(".calendarHeader span");let v={};const Q=async()=>{v=await w(i,c+1),console.log(v),C(i,c,v)},X=async e=>{c=e.id==="prev"?c-1:c+1,c<0||c>11?(p=new Date(i,c,new Date().getDate()),i=p.getFullYear(),c=p.getMonth()):p=new Date;const o=await w(i,c+1);console.log(o),C(i,c,o)};K.forEach(e=>{e.addEventListener("click",()=>{X(e)})});window.addEventListener("load",()=>{Q(),sessionStorage.getItem("fromSurveyPage")&&(H(),sessionStorage.removeItem("fromSurveyPage"))});const Z=document.querySelector(".calendar");Z.addEventListener("click",async e=>{if(e.target.tagName==="LI"&&e.target.parentElement.classList.contains("days")){const o=parseInt(e.target.textContent);console.log("clicked date: "+o);const t=new Date(i,c,o);if(t>new Date||e.target.classList.contains("inactive"))return;const s=t.getDate().toString().padStart(2,"0"),r=(t.getMonth()+1).toString().padStart(2,"0"),a=`${s}.${r}.${t.getFullYear()}`;console.log("Selected date: "+a);const u=h(a);console.log("Clicked date:",u);const l=await w(i,c+1),d=I(l,u);console.log("Has entry for date:",d),d?J(a,l):G(a)}});const ee=document.querySelector(".editIcon");ee.addEventListener("click",()=>{const e=document.querySelector(".PopupPastEntry .EntryHeading");if(e){const o=e.textContent;console.log("Date extracted:",o),U(o)}else console.error("Date heading not found or empty.")});const te=document.querySelector(".infoIcon");te.addEventListener("click",async e=>{e.preventDefault(),console.log("clicked info!"),H()});const oe=document.querySelectorAll(".closePopup");oe.forEach(e=>{e.addEventListener("click",B)});const ne=document.querySelector(".submitNewEntry");ne.addEventListener("click",async e=>{e.preventDefault(),console.log("Lets create a new diary entry"),g("Green","Uusi merkintä luotu ja HRV data lisätty"),b(),B();const o=new Event("entrySubmitted");document.dispatchEvent(o)});const re=document.querySelector(".submitEditEntry");re.addEventListener("click",async e=>{e.preventDefault(),console.log("Let's edit the diary entry"),g("Green","Merkinnän muokkaus onnistui"),$(),B();const o=new Event("entrySubmitted");document.dispatchEvent(o)});document.addEventListener("entrySubmitted",async()=>{console.log("DOES THIS WORK?"),await new Promise(o=>setTimeout(o,1e3)),v=await w(i,c+1),C(i,c,v)});