import"./modulepreload-polyfill-B5Qt9EMX.js";import{f as l}from"./fetch-CGUiTqyx.js";import{s as r}from"./snackbar-BNtgsuzo.js";function c(){sessionStorage.getItem("reloaded")||(sessionStorage.setItem("reloaded","true"),window.location.reload())}c();function i(){const t=localStorage.getItem("user_name"),n=document.getElementById("name");n.textContent=t||"No name available";const a=localStorage.getItem("user_email"),e=document.getElementById("email");e.textContent=a||"No email available";const o=localStorage.getItem("entry_count"),s=document.getElementById("count");s.textContent=o||"0"}async function d(){const t="https://hyte-server-aleksi.northeurope.cloudapp.azure.com/api/auth/me",a={method:"GET",headers:{"Content-Type":"application/json",Authorization:"Bearer "+localStorage.getItem("token")}};console.log("Fetching entry count...");try{const e=await l(t,a);if(console.log("Data received:",e),e&&e.stressLessUser){const o=e.stressLessUser.entry_count||0;console.log("Entry count fetched:",o),localStorage.setItem("entry_count",o),document.getElementById("count").textContent=o}else console.log("No entries found"),document.getElementById("count").textContent="0"}catch(e){console.error("Error finding entries:",e),r("Red","Merkintöjen määrää ei löytynyt.")}}document.querySelector(".pic a").addEventListener("click",function(t){t.preventDefault(),document.getElementById("deleteModal").style.display="block"});document.querySelector(".close").addEventListener("click",function(){document.getElementById("deleteModal").style.display="none"});document.getElementById("confirmDeletion").addEventListener("click",async function(){if(document.getElementById("deleteConfirm").value==="Poista tili")try{if((await fetch("https://hyte-server-aleksi.northeurope.cloudapp.azure.com/api/users",{method:"DELETE",headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}})).ok)r("Green","Tili poistettu onnistuneesti"),setTimeout(()=>{window.location.href="../login/loginpatient.html"},3e3);else throw new Error("Failed to delete account")}catch(n){r("Red",n.message)}else r("Red","Poistaminen epäonnistui: väärä teksti");document.getElementById("deleteModal").style.display="none"});document.addEventListener("DOMContentLoaded",function(){i(),d()});