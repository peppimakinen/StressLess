import { fetchData } from "../assets/fetch.js";
import { showSnackbar } from "../snackbar.js"

function showProfile() {
    const user_name = localStorage.getItem('user_name');
    const nameSpan = document.getElementById("name");
    nameSpan.textContent = user_name || "No name available";
    console.log(nameSpan)

    const user_email = localStorage.getItem('user_email');
    const emailSpan = document.getElementById("email");
    emailSpan.textContent = user_email || "No email available";
}

document.getElementById('changePasswordLink').addEventListener('click', function(event) {
    event.preventDefault();
    document.getElementById('passwordModal').style.display = 'block';
});

document.querySelector('.close').addEventListener('click', function() {
    document.getElementById('passwordModal').style.display = 'none';
});

document.getElementById('passwordForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const newPassword = document.getElementById('newPassword').value;

    const url = 'http://127.0.0.1:3000/api/users/doctor/change-password';
    const token = localStorage.getItem("token");

    const options = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ new_password: newPassword })
    };

    try {
        const response = await fetch(url, options);
        if (response.ok) {
            showSnackbar('Green','Salasana vaihdettu onnistuneesti');
            document.getElementById('passwordModal').style.display = 'none';
        } else {
            throw new Error('Salasanan vaihto epäonnistui');
        }
    } catch (error) {
        showSnackbar('Red','Salasanan vaihto epäonnistui')
        console.log(error.message);
    }
});


showProfile()

