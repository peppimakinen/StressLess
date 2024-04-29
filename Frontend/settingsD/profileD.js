import { fetchData } from "../assets/fetch.js";

function showProfile() {
    const user_name = localStorage.getItem('user_name');
    const nameSpan = document.getElementById("name");
    nameSpan.textContent = user_name || "No name available";
    console.log(nameSpan)

    const user_email = localStorage.getItem('user_email');
    const emailSpan = document.getElementById("email");
    emailSpan.textContent = user_email || "No email available";
}

showProfile()

