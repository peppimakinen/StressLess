import './login.css';
import { fetchData } from './fetch.js';

// PAGE LOAD
// clear localstorage
window.addEventListener('load', () => {
  clearLocalStorage();
});

// Sisäänkirjautuminen
// Avaa pop-up -ikkunan ja täyttää sähköpostin ja salasanan
const openLoginForm = () => {
  const loginModal = document.createElement('div');
  loginModal.id = 'LoginModal';
  loginModal.classList.add('modal');

  const closeButton = document.createElement('span');
  closeButton.classList.add('CloseLogin');
  closeButton.innerHTML = '&times;'; // Lisää ruksi (X-merkki)

  closeButton.addEventListener('click', () => {
    loginModal.remove(); // Sulje modaalinen ikkuna ruksista painamalla
  });

  const loginHeading = document.createElement('h1');
  loginHeading.classList.add('LoginHeading');
  loginHeading.textContent = 'Tervetuloa takaisin';

  const form = document.createElement('form');
  form.classList.add('LoginForm');

  const heading = document.createElement('h2');
  heading.textContent = 'Kirjaudu sisään';

  const emailLabel = document.createElement('label');
  emailLabel.setAttribute('for', 'email');
  emailLabel.textContent = 'Sähköposti';

  const emailInput = document.createElement('input');
  emailInput.setAttribute('type', 'email');
  emailInput.setAttribute('name', 'email');
  emailInput.setAttribute('placeholder', 'Sähköposti');

  const passwordLabel = document.createElement('label');
  passwordLabel.setAttribute('for', 'password');
  passwordLabel.textContent = 'Salasana';

  const passwordInput = document.createElement('input');
  passwordInput.setAttribute('type', 'password');
  passwordInput.setAttribute('name', 'password');
  passwordInput.setAttribute('placeholder', 'Salasana');

  const submitButton = document.createElement('input');
  submitButton.setAttribute('type', 'submit');
  submitButton.setAttribute('name', 'submit');
  submitButton.setAttribute('value', 'Kirjaudu sisään');
  submitButton.classList.add('LoginUser');

  const notExisting = document.createElement('p');
  notExisting.classList.add('NotExisting');
  notExisting.textContent = 'Puuttuuko sinulta käyttäjä?';

  const createUserLink = document.createElement('a');
  createUserLink.setAttribute('href', '#');
  createUserLink.classList.add('OpenNewUser');
  createUserLink.textContent = 'Luo käyttäjä';

  notExisting.appendChild(createUserLink);

  form.append(heading, emailLabel, emailInput, passwordLabel, passwordInput, submitButton, notExisting);
  loginModal.append(closeButton, loginHeading, form);

  document.body.appendChild(loginModal);

  form.addEventListener('submit', async (evt) => {
    evt.preventDefault();
    const url = 'http://127.0.0.1:3000/api/auth/login';

    const email = emailInput.value;
    const password = passwordInput.value;

    const data = {
      email: email,
      password: password,
    };

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    };

    try {
      const responseData = await fetchData(url, options);
      console.log(responseData);
      localStorage.setItem("token", responseData.token);
      localStorage.setItem("user_id", responseData.user.user_id);
      window.location.href = 'home.html';
      logResponse('loginResponse', `localStorage set with token value: ${responseData.token}`);
    } catch (error) {
      console.error(error);
      alert('Error logging in');
    }

    loginModal.remove();
  });
};

const loginButton = document.querySelector('.LoginBtn');
loginButton.addEventListener('click', () => {
  openLoginForm();
});




// Käyttäjän rekisteröinti
const openRegistrationForm = () => {
  const newUserModal = document.createElement('div');
  newUserModal.id = 'NewUserModal';
  newUserModal.classList.add('modal');

  const closeButton = document.createElement('span');
  closeButton.classList.add('CloseNewUser');
  closeButton.innerHTML = '&times;'; // Lisää ruksi (X-merkki)

  closeButton.addEventListener('click', () => {
    newUserModal.remove(); // Sulje modaalinen ikkuna ruksista painamalla
  });

  const newUserHeading = document.createElement('h1');
  newUserHeading.classList.add('NewUserHeading');
  newUserHeading.textContent = 'Tervetuloa takaisin';

  const form = document.createElement('form');
  form.classList.add('NewUserForm');

  const heading = document.createElement('h2');
  heading.textContent = 'Luo uusi käyttäjä';

  const emailLabel = document.createElement('label');
  emailLabel.setAttribute('for', 'email');
  emailLabel.textContent = 'Sähköposti';

  const emailInput = document.createElement('input');
  emailInput.setAttribute('type', 'email');
  emailInput.setAttribute('name', 'email');
  emailInput.setAttribute('placeholder', 'Sähköposti');

  const passwordLabel = document.createElement('label');
  passwordLabel.setAttribute('for', 'password');
  passwordLabel.textContent = 'Salasana';

  const passwordInput = document.createElement('input');
  passwordInput.setAttribute('type', 'password');
  passwordInput.setAttribute('name', 'password');
  passwordInput.setAttribute('placeholder', 'Salasana');

  const submitButton = document.createElement('input');
  submitButton.setAttribute('type', 'submit');
  submitButton.setAttribute('name', 'submit');
  submitButton.setAttribute('value', 'Luo käyttäjä');
  submitButton.classList.add('CreateUser');

  const existingUser = document.createElement('p');
  existingUser.classList.add('Existing');
  existingUser.textContent = 'Onko sinulla jo käyttäjä?';

  const loginUserLink = document.createElement('a');
  loginUserLink.setAttribute('href', '#');
  loginUserLink.classList.add('OpenLogin');
  loginUserLink.textContent = 'Kirjaudu sisään';

  existingUser.appendChild(loginUserLink);

  form.append(heading, emailLabel, emailInput, passwordLabel, passwordInput, submitButton, existingUser);
  newUserModal.append(closeButton, newUserHeading, form);

  document.body.appendChild(newUserModal);

  form.addEventListener('submit', async (evt) => {
    evt.preventDefault();
    const url = 'http://127.0.0.1:3000/api/users';

    const email = emailInput.value;
    const password = passwordInput.value;

    const data = {
      email: email,
      password: password,
    };

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    };

    try {
      const responseData = await fetchData(url, options);
      console.log(responseData);
      alert('User created successfully');
      newUserModal.remove();
    } catch (error) {
      console.error(error);
      alert('Error creating user');
    }
  });
};

const registerButton = document.querySelector('.RegisterBtn');
registerButton.addEventListener('click', () => {
  openRegistrationForm();
});



// Apufunktio, Tyhjennä local storage
function clearLocalStorage() {
  localStorage.removeItem('token');
  localStorage.removeItem('user_id');
  logResponse('clearResponse', 'localStorage cleared!');
}

// popup handling
const popup = document.getElementById('popup');
const overlay = document.getElementById('overlay');
const openPopupBtn = document.querySelector('.openPopup');
const closePopupBtn = document.getElementById('closePopup');
const createAccountBtn = document.getElementById('createAccount');

openPopupBtn.addEventListener('click', function(evt) {
  evt.preventDefault();
  popup.style.display = 'block';
  overlay.style.display = 'block';
});

closePopupBtn.addEventListener('click', function() {
  popup.style.display = 'none';
  overlay.style.display = 'none';
});

createAccountBtn.addEventListener('click', function(evt) {
  evt.preventDefault();
  popup.style.display = 'none';
  overlay.style.display = 'none';
});