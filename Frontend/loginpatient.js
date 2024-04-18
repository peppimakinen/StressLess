import { fetchData } from "./fetch.js";

// PAGE LOAD
// clear localstorage
window.addEventListener('load', () => {
  clearLocalStorage();
});

// Patient login
const LoginPatient = document.querySelector(".LoginUser");
LoginPatient.addEventListener("click", async (evt) => {
  evt.preventDefault();

  const LoginForm = document.querySelector(".LoginForm");
  const LoginEmail = LoginForm.querySelector('input[name="LoginEmail"]');
  const LoginPassword = LoginForm.querySelector('input[name="LoginPassword"]');

  const url = "http://127.0.0.1:3000/api/auth/patientlogin";

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
    localStorage.setItem("user_email", responseData.user.username);
    localStorage.setItem("user_name", responseData.user.full_name);
    localStorage.setItem("user_level", responseData.user.user_level);

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