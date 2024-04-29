import { fetchData } from "./fetch.js";
import { showSnackbar } from "../snackbar.js";

// PAGE LOAD
// clear localstorage
window.addEventListener('load', () => {
  clearLocalStorage();
});

// Doctor login
const LoginDoctor = document.querySelector(".LoginUser");
LoginDoctor.addEventListener("click", async (evt) => {
  evt.preventDefault();

  const LoginForm = document.querySelector(".LoginForm");
  const LoginEmail = LoginForm.querySelector('input[name="LoginEmail"]');
  const LoginPassword = LoginForm.querySelector('input[name="LoginPassword"]');

  const url = "http://127.0.0.1:3000/api/auth/login-doctor";

  const data = {
    username: LoginEmail.value,
    password: LoginPassword.value,
  };

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };

  try {
    const responseData = await fetchData(url, options);
    console.log(responseData);
    localStorage.setItem("token", responseData.token);
    localStorage.setItem("user_id", responseData.user_id);
    showSnackbar('Green', 'Kirjaudutaan sisään!');
    //console.log(responseData.user.surveyCompleted)
    setTimeout(() => {
      window.location.href = '../settings/profileD.html';
    }, 3000);  // 3000 millisekuntia = 3 sekuntia '

  } catch (error) {
    console.error(error);
    alert("Error logging in");
  }
});

// Function to clear local storage
function clearLocalStorage() {
  localStorage.removeItem('token');
  localStorage.removeItem('user_id');
}