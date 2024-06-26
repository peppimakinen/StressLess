import { fetchData } from "../assets/fetch.js";
import { showSnackbar } from "../snackbar.js";


// Check if the URL parameter `redirected` is not set
if (!window.location.search.includes('redirected=true')) {
    setTimeout(() => {
        // Append `redirected=true` to the URL
        window.location.href = '../settings/contacts.html?redirected=true';
    }, 500);
}



function showProfile() {
    const doc_name = localStorage.getItem('full_name');
    const nameSpan = document.getElementById("doctorName");
    nameSpan.textContent = doc_name || "Ei yhdistettyä lääkäriä";

    const doc_email = localStorage.getItem('username');
    const emailSpan = document.getElementById("doctorEmail");
    emailSpan.textContent = doc_email || "Ei yhdistettyä lääkäriä";
}



async function getOwnDoctor() {
    const url = `https://hyte-server-aleksi.northeurope.cloudapp.azure.com/api/auth/me`;
    const token = localStorage.getItem("token");

    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
    };
    
    try {
        const responseData = await fetchData(url, options); // Assuming fetchData returns JSON directly
        console.log(responseData);
        if (responseData && responseData.stressLessUser) {
            const fullName = responseData.stressLessUser.chosen_doctor[0].full_name;
            localStorage.setItem("full_name", fullName);
            const docEmail = responseData.stressLessUser.chosen_doctor[0].username;
            localStorage.setItem("username", docEmail);
        } else {
            console.log('No doctor info');
        }
    } catch (error) {
        showSnackbar("Grey","Lääkäriä ei ole yhdistetty");
    }
    }

    document.addEventListener('DOMContentLoaded', function() {
        showProfile();
        getOwnDoctor();
});