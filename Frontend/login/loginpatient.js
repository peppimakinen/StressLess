import { fetchData } from "../assets/fetch.js";
import { showSnackbar } from "../snackbar.js";

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

  const url = "http://127.0.0.1:3000/api/auth/patient-login";

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
    localStorage.setItem("user_id", responseData.user.user_id);
    
    // Redirect based on survey completion status
    if (responseData.user.surveyCompleted) {
      showSnackbar('Green', 'Kirjaudutaan sisään!');
      setTimeout(() => {
        window.location.href = '../home/patienthome.html';
      }, 3000);  // 3000 milliseconds = 3 seconds
    } else {
      showSnackbar('Green', 'Kirjaudutaan sisään!');
      setTimeout(() => {
        window.location.href = '../survey/alkukartoitus.html';
      }, 3000);  // 3000 milliseconds = 3 seconds
    }
  
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
  localStorage.removeItem("Paired_doc_Name");
  localStorage.removeItem("doc_name");
  localStorage.removeItem("full_name");
  localStorage.removeItem("entry_count");
  localStorage.removeItem("username");
};


