import"./modulepreload-polyfill-B5Qt9EMX.js";import{f as a}from"./fetch-CGUiTqyx.js";import{s as c}from"./snackbar-BNtgsuzo.js";window.location.search.includes("redirected=true")||setTimeout(()=>{window.location.href="../settings/contacts.html?redirected=true"},500);function i(){const t=localStorage.getItem("full_name"),n=document.getElementById("doctorName");n.textContent=t||"Ei yhdistettyä lääkäriä";const o=localStorage.getItem("username"),e=document.getElementById("doctorEmail");e.textContent=o||"Ei yhdistettyä lääkäriä"}async function l(){const t="https://hyte-server-aleksi.northeurope.cloudapp.azure.com/api/auth/me",o={method:"GET",headers:{"Content-Type":"application/json",Authorization:"Bearer "+localStorage.getItem("token")}};try{const e=await a(t,o);if(console.log(e),e&&e.stressLessUser){const s=e.stressLessUser.chosen_doctor[0].full_name;localStorage.setItem("full_name",s);const r=e.stressLessUser.chosen_doctor[0].username;localStorage.setItem("username",r)}else console.log("No doctor info")}catch{c("Grey","Lääkäriä ei ole yhdistetty")}}document.addEventListener("DOMContentLoaded",function(){i(),l()});