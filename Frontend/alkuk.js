import { fetchData } from './fetch.js';

//aktiviteetit listaus
document.getElementById('submitButton').addEventListener('click', function() {
    const textarea = document.getElementById('question14');
    const activities = textarea.value.trim().split('\n').map(activity => activity.trim());

    if (activities.length > 0) {
        activities.forEach(activity => {
            if (activity !== '') {
                // Here you can send the activity to your backend for processing
                // For demonstration purpose, we're just logging it to the console
                console.log('Activity submitted:', activity);
            }
        });

        // Add activities to the survey form data
        const form = document.querySelector('.answer-form-all');
        const activityInput = document.createElement('input');
        activityInput.type = 'hidden';
        activityInput.name = 'activities';
        activityInput.value = JSON.stringify(activities);
        form.appendChild(activityInput);

        // Clear the textarea for the next input
        textarea.value = '';
    } else {
        alert('Please enter some activities before submitting.');
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

    // Create an array to hold all the questions and answers
    const questions = [];

    // Loop through all input fields in the form
    form.querySelectorAll('input, select').forEach(input => {
        // Skip inputs without a name attribute or with the name "user_choice"
        if (!input.name || input.name === 'user_choice') {
            return;
        }
        // Add the input question and answer to the questions array
        questions.push({
            question: input.previousElementSibling.textContent.trim(),
            answer: input.value
        });
    });

    // Create the data object with the questions array
    const data = { questions };

    // Retrieve the authentication token from local storage
    const authToken = localStorage.getItem("token");

    // Create the options object for the fetch request
    const options = {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + authToken // Include the authentication token from local storage
        },
        body: JSON.stringify(data), // body data type must match "Content-Type" header
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


