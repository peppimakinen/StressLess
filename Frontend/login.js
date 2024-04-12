import { fetchData } from "./fetch.js";

// PAGE LOAD
// clear localstorage
// window.addEventListener("load", () => {
//   clearLocalStorage();
// });

// Sisäänkirjautuminen
const LoginUser = document.querySelector(".LoginUser");
LoginUser.addEventListener("click", async (evt) => {
  evt.preventDefault();

  const LoginForm = document.querySelector(".LoginForm");
  const LoginEmail = LoginForm.querySelector('input[name="LoginEmail"]');
  const LoginPassword = LoginForm.querySelector('input[name="LoginPassword"]');

  const url = "http://127.0.0.1:3000/api/auth/doctorlogin";

  const data = {
    email: LoginEmail.value,
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
    // window.location.href = "home.html";
    logResponse(
      "loginResponse",
      `localStorage set with token value: ${responseData.token}`
    );
  } catch (error) {
    console.error(error);
    alert("Error logging in");
  }
});

// const Login = () => {
//   const LoginForm = document.querySelector(".LoginForm");
//   const LoginEmail = LoginForm.querySelector('input[name="LoginEmail"]');
//   const LoginPassword = LoginForm.querySelector('input[name="LoginPassword"]');

//   LoginForm.addEventListener("submit", async (evt) => {
//     evt.preventDefault();
//     const url = "http://127.0.0.1:3000/api/auth/doctorlogin";

//     const data = {
//       email: LoginEmail.value,
//       password: LoginPassword.value,
//     };

//     const options = {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(data),
//     };

//     try {
//       const responseData = await fetchData(url, options);
//       console.log(responseData);
//       localStorage.setItem("token", responseData.token);
//       localStorage.setItem("user_id", responseData.user.user_id);
//       window.location.href = "home.html";
//       logResponse(
//         "loginResponse",
//         `localStorage set with token value: ${responseData.token}`
//       );
//     } catch (error) {
//       console.error(error);
//       alert("Error logging in");
//     }
//   });
// };

// Käyttäjän rekisteröinti
const createDoctor = document.querySelector(".CreateUser");
createDoctor.addEventListener("click", async (evt) => {
  evt.preventDefault();

  const NewUserForm = document.querySelector(".NewUserForm");
  const RegisterEmail = NewUserForm.querySelector(
    'input[name="RegisterEmail"]'
  );
  const RegisterPassword = NewUserForm.querySelector(
    'input[name="RegisterPassword"]'
  );
  const RegisterName = NewUserForm.querySelector("input[name=RegisterName");

  const url = "http://127.0.0.1:3000/api/users/createDoctor";

  const data = {
    username: RegisterEmail.value,
    password: RegisterPassword.value,
    full_name: RegisterName.value,
    user_level: 'doctor',
    admin_password: 'superSecret'
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
    // alert("User created successfully");
  } catch (error) {
    console.error(error);
    alert("Error creating user");
  }
});

// const Registration = () => {
//   const NewUserForm = document.querySelector(".NewUserForm");
//   const RegisterEmail = NewUserForm.querySelector(
//     'input[name="RegisterEmail"]'
//   );
//   const RegisterPassword = NewUserForm.querySelector(
//     'input[name="RegisterPassword"]'
//   );
//   const RegisterName = NewUserForm.querySelector("input[name=RegisterName");

//   NewUserForm.addEventListener("submit", async (evt) => {
//     evt.preventDefault();

//     const url = "http://127.0.0.1:3000/api/users/createDoctor";

//     const data = {
//       name: RegisterName.value,
//       email: RegisterEmail.value,
//       password: RegisterPassword.value,
//     };

//     const options = {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(data),
//     };

//     try {
//       const responseData = await fetchData(url, options);
//       console.log(responseData);
//       alert("User created successfully");
//     } catch (error) {
//       console.error(error);
//       alert("Error creating user");
//     }
//   });
// };

// Login();
// Registration();

// Apufunktio, Tyhjennä local storage
// function clearLocalStorage() {
//   localStorage.removeItem("token");
//   localStorage.removeItem("user_id");
//   logResponse("clearResponse", "localStorage cleared!");
// }

// Modal handling
const overlay = document.getElementById("overlay");

// Login popup handling
const loginModal = document.getElementById("LoginModal");
const loginBtn = document.querySelector(".LoginBtn");
const closeLoginBtn = document.querySelector(".CloseLogin");

loginBtn.addEventListener("click", function (evt) {
  evt.preventDefault();
  console.log("clicked login");
  loginModal.style.display = "block";
  overlay.style.display = "block";
});

closeLoginBtn.addEventListener("click", function () {
  loginModal.style.display = "none";
  overlay.style.display = "none";
});

// Registration popup handling
const newUserModal = document.getElementById("NewUserModal");
const registerBtn = document.querySelector(".RegisterBtn");
const closeNewUserBtn = document.querySelector(".CloseNewUser");

registerBtn.addEventListener("click", function (evt) {
  evt.preventDefault();
  console.log("clicked Register");
  newUserModal.style.display = "block";
  overlay.style.display = "block";
});

closeNewUserBtn.addEventListener("click", function () {
  newUserModal.style.display = "none";
  overlay.style.display = "none";
});
