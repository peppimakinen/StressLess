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

// alerts
function showCustomAlert(message) {
    document.getElementById('alertMessage').textContent = message;
    document.getElementById('customAlert').style.display = 'block';
    document.getElementById('customOverlay').style.display = 'block';
}

document.addEventListener('DOMContentLoaded', () => {
    const closeAlertButton = document.getElementById('closeAlertButton');
    if (closeAlertButton) {
        closeAlertButton.addEventListener('click', closeCustomAlert);
    } else {
        console.log("Close alert button not found!");
    }
});

function closeCustomAlert() {
    document.getElementById('customAlert').style.display = 'none';
    document.getElementById('customOverlay').style.display = 'none';
}


// Function to fetch doctor data
async function getDoctor() {
    const doctorEmailInput = document.getElementById('doctor_email');
    const doctorEmail = doctorEmailInput.value.trim();

    const url = `http://127.0.0.1:3000/api/users/find-doctor/${doctorEmail}`;
    const token = localStorage.getItem("token");

    const options = {
        method: 'GET', // Assuming your API handles finding a doctor with GET request
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    };

    try {
        const response = await fetch(url, options);
        const responseData = await response.json(); // Assuming response returns JSON
        console.log(response);
        console.log(responseData);

        if (response.ok && responseData) { // Check both that fetch was ok and responseData is truthy
            console.log('Doctor found:', responseData);
            document.getElementById('popup2').style.display = 'block';
            document.getElementById('overlay').style.display = 'block';
        } else {
            showCustomAlert('Sähköpostiosoitetta ei löytynyt');
            document.getElementById('popup2').style.display = 'none';
            document.getElementById('overlay').style.display = 'none';
        }
    } catch (error) {
        console.error('Error finding doctor:', error);
        alert('An error occurred while trying to find the doctor. Please try again.');
    }
}

// Event listener for the button with class 'submitdoc'
const submitDocButton = document.querySelector('.submitdoc');
submitDocButton.addEventListener('click', () => {
    getDoctor();
});


//ei lääkäriä
const survey = document.getElementById('no');

survey.addEventListener('click', async (evt) => {
    evt.preventDefault();
    console.log('Nyt palautetaan vastauslomake');

    const url = "http://127.0.0.1:3000/api/survey";
    const form = document.querySelector('.answer-form-all');

    if (!form.checkValidity()) {
        form.reportValidity();
        return; // Exit function if form is not valid
    }

    console.log('Tiedot valideja, jatketaan');

    const surveyData = {};
    form.querySelectorAll('input, select').forEach(input => {
        if (!input.name || input.name === 'user_choice' || input.value === "") {
            return;
        }
        if (input.name === 'activities') {
            surveyData['Mitä aktiviteetteja hyödynnät stressin lievennyksessä?'] = JSON.parse(input.value);
        } else {
            surveyData[input.previousElementSibling.textContent.trim()] = input.value;
        }
    });

    console.log(surveyData);

    const authToken = localStorage.getItem("token");

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + authToken
        },
        body: JSON.stringify(surveyData),
    };

    try {
        const response = await fetchData(url, options);

        if (!response.ok) { // Check if the fetch was NOT successful
            console.error('Failed to submit survey:', response);
            throw new Error('Failed to submit survey: ' + response.statusText); // Throw an error to catch it below
        }

        console.log('Survey submitted successfully');
        alert('Alkukartoitus tehty!');
        window.location.href = '../home/patienthome.html';
    } catch (error) {
        console.error('Error submitting form data:', error);
        alert('Tapahtui virhe. Tarkista, että olet vastannut kaikkiin pakollisiin kysymyksiin ja yritä uudelleen.');
    }
});




// checkbox
// Select the form and the checkbox element
const doctorForm2 = document.querySelector('.doctor_form2');
const checkbox = document.getElementById('give-info');

if (doctorForm2 && checkbox) {
    doctorForm2.addEventListener('submit', async function(event) {
        event.preventDefault();  // Prevent the default form submission
        console.log('Submit button clicked');
        
        if (!checkbox.checked) {
            console.log('Checkbox is not checked');
            showCustomAlert('Sinun on valittava valintaruutu jatkaaksesi!');
        } else {
            console.log('Checkbox is checked, submitting form...');

            const url = 'http://127.0.0.1:3000/api/survey'; 
            const form = document.querySelector('.answer-form-all');

            if (!form.checkValidity()) {
                form.reportValidity();
                return; // Exit function if form is not valid
            }

            console.log('Tiedot valideja, jatketaan');

            const surveyData = {};
            form.querySelectorAll('input, select').forEach(input => {
                if (!input.name || input.name === 'user_choice' || input.value === "") {
                    return;
                }
                if (input.name === 'activities') {
                    surveyData['Mitä aktiviteetteja hyödynnät stressin lievennyksessä?'] = JSON.parse(input.value);
                } else {
                    surveyData[input.previousElementSibling.textContent.trim()] = input.value;
                }
            });

            console.log(surveyData);

            const authToken = localStorage.getItem("token");

            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + authToken
                },
                body: JSON.stringify(surveyData),
            };

            try {
                const response = await fetchData(url, options);
        
                if (!response) { // Check if the fetch was NOT successful
                    console.error('Failed to submit survey:', response);
                    throw new Error('Failed to submit survey: ' + response.statusText); // Throw an error to catch it below
                }
        
                console.log('Survey submitted successfully');
                alert('Alkukartoitus tehty!');
                window.location.href = '../home/patienthome.html';
            } catch (error) {
                console.log('Error submitting form data:', error);
            }
        }
    });
} 

