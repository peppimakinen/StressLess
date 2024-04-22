import { fetchData } from '../assets/fetch.js';

// aktiviteetit
document.getElementById('submitButton').addEventListener('click', function() {
    const inputField = document.getElementById('question14');
    const activity = inputField.value.trim();
    const questionText = document.getElementById('activityLabel').textContent.trim(); // Make sure the label is correctly associated

    if (activity !== '') {
        let activities = [];

        // Check if there's already an existing hidden input for activities
        const existingInput = document.querySelector('input[name="activities"]');
        if (existingInput) {
            activities = JSON.parse(existingInput.value);
            existingInput.remove();  // Remove it to replace later
        }

        activities.push(activity);

        const activityInput = document.createElement('input');
        activityInput.type = 'hidden';
        activityInput.name = 'activities';
        activityInput.value = JSON.stringify(activities);

        const form = document.querySelector('.answer-form-all');
        form.appendChild(activityInput);

        inputField.value = '';

        const activitiesString = `Mitä aktiviteetteja hyödynnät stressin lievennyksessä?: ${JSON.stringify(activities)}`;
        console.log(activitiesString);
    } else {
        alert('Please enter an activity before submitting.');
    }
});

// POPUP HANDLING
const popup = document.getElementById('popup');
const overlay = document.getElementById('overlay');
const openPopupBtn = document.getElementById('yes');
const closePopupBtn = document.getElementById('closePopup');

const popup2 = document.getElementById('popup2');
const openPopup = document.querySelector('.submitdoc'); // Target the submit button with class 'submitdoc'
const closePopup = document.getElementById('closePopup2');

// first popup
openPopupBtn.addEventListener('click', function (evt) {
    evt.preventDefault();
    popup.style.display = 'block';
    overlay.style.display = 'block';
});

closePopupBtn.addEventListener('click', function () {
    popup.style.display = 'none';
    overlay.style.display = 'none';
});

// second popup
openPopup.addEventListener('click', function (evt) { // Change the event listener to listen for click event on 'submitdoc'
    evt.preventDefault();
    popup2.style.display = 'block';
    overlay.style.display = 'block';
});

closePopup.addEventListener('click', function () {
    popup2.style.display = 'none';
    overlay.style.display = 'none';
});


// haetaan lekuri
const doctorForm = document.querySelector('.doctor_form'); // Select the doctor form

doctorForm.addEventListener('submit', async function (evt) {
    evt.preventDefault();
    const doctorNameInput = document.getElementById('doctor_name');
    const doctorName = doctorNameInput.value;
    console.log('mooi');

    try {
        // Perform a fetch request to your backend to find the doctor's name in the database
        const response = await fetchData('http://127.0.0.1:3000/api/users/find-doctor', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ doctorName }) // Sending the doctor's name to the backend
        });

        if (response.ok) {
            // If the doctor is found, display the second popup
            document.getElementById('popup2').style.display = 'block';
            document.getElementById('overlay').style.display = 'block';
        } else {
            // If the doctor is not found, display an alert message
            alert('Doctor not found.');
            console.error('Doctor not found.');
        }
    } catch (error) {
        console.error('Error finding doctor:', error);
        // Handle error as needed
    }
});

// ei lääkäriä, submittaa vastsaukset ja menee patienthome
const survey = document.getElementById('no');

survey.addEventListener('click', async (evt) => {
    evt.preventDefault();
    console.log('Nyt palautetaan vastauslomake');

    const url = "http://127.0.0.1:3000/api/survey";

    // Select the form element
    const form = document.querySelector('.answer-form-all');

    // Check if the form is valid
    if (!form.checkValidity()) {
        // If the form is not valid, show the validation messages
        form.reportValidity();
        return; // Exit function if form is not valid
    }

    console.log('Tiedot valideja, jatketaan');

    // Create an object to hold all the questions and answers
    const survey = {};

    // Loop through all input and select fields in the form
    form.querySelectorAll('input, select').forEach(input => {
        if (!input.name || input.name === 'user_choice' || input.value === "") {
            return;
        }
        if (input.name === 'activities') {
            survey['Mitä aktiviteetteja hyödynnät stressin lievennyksessä?'] = JSON.parse(input.value); // Parse JSON string into array
        } else {
            survey[input.previousElementSibling && input.previousElementSibling.textContent.trim()] = input.value;
        }
    });

    // This will log the object in the format you requested
    console.log(survey);

    // Retrieve the authentication token from local storage
    const authToken = localStorage.getItem("token");

    // Create the options object for the fetch request
    const options = {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + authToken // Include the authentication token from local storage
        },
        body: JSON.stringify(survey), // body data type must match "Content-Type" header
    };

    // Fetch the data
    try {
        const response = await fetchData(url, options);
        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
        const responseData = await response.json();
        console.log(responseData);
        
        // Store the token in local storage
        localStorage.setItem("token", responseData.token);
        
        alert('Form submitted!');
        window.location.href = 'patienthome.html';
    } catch (error) {
        console.error('Error submitting form data:', error);
    }
});



// checkbox
// Select the form and the checkbox element
const doctorForm2 = document.querySelector('.doctor_form2');
const checkbox = document.getElementById('give-info');

// Add event listener to form submission
doctorForm2.addEventListener('submit', function (event) {
    // Check if the checkbox is not checked
    if (!checkbox.checked) {
        // Prevent the default form submission behavior
        event.preventDefault();
        // Show alert message
        alert("Sinun on valittava valintaruutu jatkaaksesi!");
    }
});
