function showProfile() {
    const user_name = localStorage.getItem('user_name');
    const nameSpan = document.getElementById("name");

    const user_email = localStorage.getItem('user_email');
    const emailSpan = document.getElementById("email");

    nameSpan.textContent = user_name;
    emailSpan.textContent = user_email;
}

showProfile();
