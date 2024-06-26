import { fetchData } from "../assets/fetch.js";
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

  const url = "https://hyte-server-aleksi.northeurope.cloudapp.azure.com/api/auth/doctor-login";

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
    localStorage.setItem("user_id", responseData.user.user_id);
    localStorage.setItem("user_name", responseData.user.full_name);
    localStorage.setItem("user_email", responseData.user.username);
    showSnackbar('Green', 'Kirjaudutaan sisään!');
    setTimeout(() => {
      window.location.href = '../patientSelection/patientSelection.html';
    }, 3000);  // 3000 millisekuntia = 3 sekuntia '

  } catch (error) {
    console.error(error);
    showSnackbar("Red","Error logging in");
  }
});

// Function to clear local storage
function clearLocalStorage() {
  localStorage.removeItem('token');
  localStorage.removeItem('user_id');
  localStorage.removeItem("user_email");
  localStorage.removeItem("user_name");
  localStorage.removeItem("user_level");
  localStorage.removeItem("Paired_doc_name");
  localStorage.removeItem("doc_name");
  localStorage.removeItem("full_name");
  localStorage.removeItem("entry_count");
  localStorage.removeItem("username");
  localStorage.removeItem("patient_id");
};