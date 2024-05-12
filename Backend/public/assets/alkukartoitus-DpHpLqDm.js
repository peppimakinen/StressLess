import"./modulepreload-polyfill-B5Qt9EMX.js";import{f as y}from"./fetch-CGUiTqyx.js";import{s as d}from"./snackbar-BNtgsuzo.js";document.addEventListener("DOMContentLoaded",()=>{document.querySelector(".answer-form-all").addEventListener("keypress",function(s){if(s.keyCode===13)return s.preventDefault(),!1})});document.getElementById("submitButton").addEventListener("click",function(){const e=document.getElementById("question14"),s=e.value.trim();if(s!==""){let o=[];const n=document.querySelector('input[name="activities"]');n&&(o=JSON.parse(n.value),n.remove()),o.push(s);const i=document.createElement("input");i.type="hidden",i.name="activities",i.value=JSON.stringify(o),document.querySelector(".answer-form-all").appendChild(i),e.value="",v(o),d("green","Aktiviteetti lisätty, voit halutessasi lisätä useamman")}else a("Lisää aktiviteettejä ennen alkukartoituksen lähettämistä.")});function v(e){const s=document.getElementById("activitiesList");s.innerHTML="",e.forEach(o=>{const n=document.createElement("li");n.textContent=o,s.appendChild(n)})}const p=document.getElementById("popup"),u=document.getElementById("overlay"),f=document.getElementById("yes"),h=document.getElementById("closePopup"),k=document.getElementById("popup2"),g=document.querySelector(".submitdoc"),E=document.getElementById("closePopup2");f.addEventListener("click",function(e){e.preventDefault(),p.style.display="block",u.style.display="block"});h.addEventListener("click",function(){p.style.display="none",u.style.display="none"});g.addEventListener("click",function(e){e.preventDefault(),k.style.display="block",u.style.display="block"});E.addEventListener("click",function(){k.style.display="none",u.style.display="none"});function a(e){document.getElementById("alertMessage").textContent=e,document.getElementById("customAlert").style.display="block",document.getElementById("customOverlay").style.display="block"}document.addEventListener("DOMContentLoaded",()=>{const e=document.getElementById("closeAlertButton");e?e.addEventListener("click",S):console.log("Close alert button not found!")});function S(){document.getElementById("customAlert").style.display="none",document.getElementById("customOverlay").style.display="none"}async function I(){const o=`https://hyte-server-aleksi.northeurope.cloudapp.azure.com/api/users/find-doctor/${document.getElementById("doctor_email").value.trim()}`,i={method:"GET",headers:{"Content-Type":"application/json",Authorization:"Bearer "+localStorage.getItem("token")}};try{const r=await fetch(o,i),t=await r.json();if(console.log(r),console.log(t),r.ok&&t){console.log("Doctor found:",t);const c=t.found_doctor.username,l=t.found_doctor.full_name;return localStorage.setItem("Paired_doc_name",c),localStorage.setItem("doc_name",l),console.log(c),document.getElementById("popup2").style.display="block",document.getElementById("overlay").style.display="block",t}else return a("Sähköpostiosoitetta ei löytynyt"),document.getElementById("popup2").style.display="none",document.getElementById("overlay").style.display="none",null}catch(r){console.error("Error finding doctor:",r),a("Virhe etsiessä lääkäriä, yritä uudelleen.")}}async function B(){const e=localStorage.getItem("Paired_doc_name"),s="https://hyte-server-aleksi.northeurope.cloudapp.azure.com/api/users/create-pair",o=localStorage.getItem("token");if(!e){a("Lääkäriä ei löytynyt.");return}const n={method:"POST",headers:{"Content-Type":"application/json",Authorization:"Bearer "+o},body:JSON.stringify({doctor_username:e})};try{const i=await fetch(s,n);if(i.ok){const r=await i.json();console.log("Doctor pairing successful:",r),d("#9BCF53","Lääkäri yhdistetty onnistuneesti.")}else return a("Lääkäriä ei pystytty yhdistämään."),preventDefault(),null}catch(i){return console.error("Error creating doctor pair:",i),a("Lääkäriä ei pystytty yhdistämään."),null}}const b=document.querySelector(".submitdoc");b.addEventListener("click",()=>{I()});const T=document.getElementById("no");T.addEventListener("click",async e=>{e.preventDefault(),console.log("Nyt palautetaan vastauslomake");const s="https://hyte-server-aleksi.northeurope.cloudapp.azure.com/api/survey",o=document.querySelector(".answer-form-all");if(!o.checkValidity()){o.reportValidity();return}console.log("Tiedot valideja, jatketaan");const n=o.querySelector('input[name="activities"]'),i=n?JSON.parse(n.value):[];if(i.length===0){console.log("No activities added. Survey will not be submitted."),a("Tapahtui virhe. Tarkista, että olet vastannut kaikkiin pakollisiin kysymyksiin ja yritä uudelleen.");return}const r={};o.querySelectorAll("input, select").forEach(l=>{!l.name||l.name==="user_choice"||l.value===""||(l.name==="activities"?r["Mitä aktiviteetteja hyödynnät stressin lievennyksessä?"]=i:r[l.previousElementSibling.textContent.trim()]=l.value)}),console.log(r);const c={method:"POST",headers:{"Content-Type":"application/json",Authorization:"Bearer "+localStorage.getItem("token")},body:JSON.stringify(r)};try{const l=await y(s,c);console.log(l),l.ok||console.error("Failed to submit survey:",l),console.log("Survey submitted successfully"),a("Alkukartoitus on nyt suoritettu. Sinut uudelleenohjataan kalenterisivulle."),setTimeout(()=>{sessionStorage.setItem("fromSurveyPage",!0),window.location.href="../home/patienthome.html"},3e3)}catch(l){console.error("Error submitting form data:",l),a("Tapahtui virhe. Tarkista, että olet vastannut kaikkiin pakollisiin kysymyksiin ja yritä uudelleen.")}});const m=document.querySelector(".doctor_form2");m&&m.addEventListener("submit",async function(e){e.preventDefault(),console.log("Submit button clicked"),console.log("Nyt palautetaan vastauslomake");const s="https://hyte-server-aleksi.northeurope.cloudapp.azure.com/api/survey",o=document.querySelector(".answer-form-all");if(!o.checkValidity()){o.reportValidity();return}console.log("Tiedot valideja, jatketaan");const n={};o.querySelectorAll("input, select").forEach(t=>{!t.name||t.name==="user_choice"||t.value===""||(t.name==="activities"?n["Mitä aktiviteetteja hyödynnät stressin lievennyksessä?"]=JSON.parse(t.value):n[t.previousElementSibling.textContent.trim()]=t.value)}),console.log(n);const r={method:"POST",headers:{"Content-Type":"application/json",Authorization:"Bearer "+localStorage.getItem("token")},body:JSON.stringify(n)};try{const t=await y(s,r);console.log(t),t.ok||console.error("Failed to submit survey:",t),console.log("Survey submitted successfully"),a("Alkukartoitus on nyt suoritettu. Sinut uudelleenohjataan kalenterisivulle."),B(),setTimeout(()=>{sessionStorage.setItem("fromSurveyPage",!0),window.location.href="../home/patienthome.html"},3e3)}catch(t){console.error("Error submitting form data:",t),d("Red","Tapahtui virhe. Tarkista, että olet vastannut kaikkiin pakollisiin kysymyksiin ja yritä uudelleen.")}});
