import { fetchData } from '../assets/fetch.js';
import { showSnackbar } from "../snackbar.js";


// ENTERIN TOIMIMATTOMUUS KIITOS
document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.answer-form-all');
    form.addEventListener('keypress', function(event) {
        if (event.keyCode === 13) {  // Enter key code is 13
            event.preventDefault(); // Prevent the default form submit action
            // Optionally, you can trigger your desired action here
            return false; // Prevent the event from propagating further
        }
    });

    // Existing code to handle popup display or other interactions
    // Ensure this code block is added after the DOMContentLoaded to ensure all elements are loaded
});


// aktiviteetit
document.getElementById('submitButton').addEventListener('click', function() {
    const inputField = document.getElementById('question14');
    const activity = inputField.value.trim();
    if (activity !== '') {
        let activities = [];

        // Check for an existing hidden input for activities
        const existingInput = document.querySelector('input[name="activities"]');
        if (existingInput) {
            activities = JSON.parse(existingInput.value);
            existingInput.remove();  // Remove it to replace later
        }

        // Add the new activity to the array
        activities.push(activity);

        // Create or update the hidden input to store all activities
        const activityInput = document.createElement('input');
        activityInput.type = 'hidden';
        activityInput.name = 'activities';
        activityInput.value = JSON.stringify(activities);
        const form = document.querySelector('.answer-form-all');
        form.appendChild(activityInput);

        // Clear the input field after adding the activity
        inputField.value = '';

        // Display the activities list
        updateActivitiesList(activities);

        showSnackbar('green', 'Aktiviteetti lisätty, voit halutessasi lisätä useamman');
    } else {
        showCustomAlert('Lisää aktiviteettejä ennen alkukartoituksen lähettämistä.');
    }
});

// Function to update the displayed list of activities
function updateActivitiesList(activities) {
    const listElement = document.getElementById('activitiesList');
    listElement.innerHTML = ''; // Clear existing list items

    activities.forEach(activity => {
        const listItem = document.createElement('li');
        listItem.textContent = activity;
        listElement.appendChild(listItem);
    });
}


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

    const url = `https://hyte-server-aleksi.northeurope.cloudapp.azure.com/api/users/find-doctor/${doctorEmail}`;
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
            const doctorPair = responseData.found_doctor.username;
            const doctorName = responseData.found_doctor.full_name;
            localStorage.setItem("Paired_doc_name", doctorPair);
            localStorage.setItem("doc_name", doctorName);
            console.log(doctorPair);
            document.getElementById('popup2').style.display = 'block';
            document.getElementById('overlay').style.display = 'block';
            return responseData;
        } else {
            showCustomAlert('Sähköpostiosoitetta ei löytynyt');
            document.getElementById('popup2').style.display = 'none';
            document.getElementById('overlay').style.display = 'none';
            return null;
        }
    } catch (error) {
        console.error('Error finding doctor:', error);
        showCustomAlert('Virhe etsiessä lääkäriä, yritä uudelleen.');
    }
}



async function pairDoctor() {
    const doctorUsername = localStorage.getItem("Paired_doc_name");
    const url = 'https://hyte-server-aleksi.northeurope.cloudapp.azure.com/api/users/create-pair';
    const token = localStorage.getItem("token");

    if (!doctorUsername) {
        showCustomAlert("Lääkäriä ei löytynyt.");
        return;
    }

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({
            doctor_username: doctorUsername
        })
    };

    try {
        const response = await fetch(url, options);
        if (response.ok) {
            const responseData = await response.json();
            console.log('Doctor pairing successful:', responseData);
            showSnackbar('#9BCF53','Lääkäri yhdistetty onnistuneesti.');
        } else {
            showCustomAlert('Lääkäriä ei pystytty yhdistämään.');
            preventDefault()
            return null;
        }
    } catch (error) {
        console.error('Error creating doctor pair:', error);
        showCustomAlert('Lääkäriä ei pystytty yhdistämään.');
        return null;
    }
}



// Event listener for the button with class 'submitdoc'
const getDocButton = document.querySelector('.submitdoc');
getDocButton.addEventListener('click', () => {
    getDoctor();
});



//ei lääkäriä
const survey = document.getElementById('no');

survey.addEventListener('click', async (evt) => {
    evt.preventDefault();
    console.log('Nyt palautetaan vastauslomake');

    const url = "https://hyte-server-aleksi.northeurope.cloudapp.azure.com/api/survey";
    const form = document.querySelector('.answer-form-all');

    if (!form.checkValidity()) {
        form.reportValidity();
        return; // Exit function if form is not valid
    }

    console.log('Tiedot valideja, jatketaan');

    const activitiesInput = form.querySelector('input[name="activities"]');
    const activities = activitiesInput ? JSON.parse(activitiesInput.value) : [];

    if (activities.length === 0) {
        console.log('No activities added. Survey will not be submitted.');
        showCustomAlert('Tapahtui virhe. Tarkista, että olet vastannut kaikkiin pakollisiin kysymyksiin ja yritä uudelleen.');
        return; // Exit function if activities list is empty
    }

    const surveyData = {};
    form.querySelectorAll('input, select').forEach(input => {
        if (!input.name || input.name === 'user_choice' || input.value === "") {
            return;
        }
        if (input.name === 'activities') {
            surveyData['Mitä aktiviteetteja hyödynnät stressin lievennyksessä?'] = activities;
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
        console.log(response);

        if (!response.ok) { // Check if the fetch was NOT successful
            console.error('Failed to submit survey:', response);
            // throw new Error('Failed to submit survey: ' + response.statusText); // Throw an error to catch it below
        }

        console.log('Survey submitted successfully');
        showCustomAlert('Alkukartoitus on nyt suoritettu. Sinut uudelleenohjataan kalenterisivulle.');
        // Aseta uudelleenohjaus tapahtumaan 3 sekunnin kuluttua
        setTimeout(() => {
            sessionStorage.setItem('fromSurveyPage', true);
            window.location.href = '../home/patienthome.html';
        }, 3000);  // 3000 millisekuntia = 3 sekuntia
    } catch (error) {
        console.error('Error submitting form data:', error);
        showCustomAlert('Tapahtui virhe. Tarkista, että olet vastannut kaikkiin pakollisiin kysymyksiin ja yritä uudelleen.');
    }
});



// lähetään alkukartoituse lääkärin yhdistämisen jälkeen
const doctorForm2 = document.querySelector('.doctor_form2');

if (doctorForm2) {
    doctorForm2.addEventListener('submit', async function(event) {
        event.preventDefault();  // Prevent the default form submission
        console.log('Submit button clicked');
        
        console.log('Nyt palautetaan vastauslomake');

    const url = "https://hyte-server-aleksi.northeurope.cloudapp.azure.com/api/survey";
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
        console.log(response)

        if (!response.ok) { // Check if the fetch was NOT successful
            console.error('Failed to submit survey:', response);
            // throw new Error('Failed to submit survey: ' + response.statusText); // Throw an error to catch it below
        }

        console.log('Survey submitted successfully');
        showCustomAlert('Alkukartoitus on nyt suoritettu. Sinut uudelleenohjataan kalenterisivulle.');
        pairDoctor()
        // Aseta uudelleenohjaus tapahtumaan 3 sekunnin kuluttua
        setTimeout(() => {
            sessionStorage.setItem('fromSurveyPage', true);
            window.location.href = '../home/patienthome.html';
        }, 3000);  // 3000 millisekuntia = 3 sekuntia
    } catch (error) {
        console.error('Error submitting form data:', error);
        showSnackbar('Red','Tapahtui virhe. Tarkista, että olet vastannut kaikkiin pakollisiin kysymyksiin ja yritä uudelleen.');
    }
});
} 

