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


openPopupBtn.addEventListener('click', function (evt) {
    evt.preventDefault();
    popup.style.display = 'block';
    overlay.style.display = 'block';
});

closePopupBtn.addEventListener('click', function () {
    popup.style.display = 'none';
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
        const response = await fetch('find-doctor-endpoint', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ doctorName }) // Sending the doctor's name to the backend
        });

        if (response.ok) {
            // If the doctor is found, redirect to patienthome.html
            window.location.href = 'patienthome.html';
        } else {
            console.error('Doctor not found.');
            // Handle error as needed
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

    const url = "http://127.0.0.1:3000/api/survey"

    // Select the form element
    const form = document.querySelector('.answer-form-all');

    // Check if the form is valid
    if (!form.checkValidity()) {
    // If the form is not valid, show the validation messages
        form.reportValidity();
        return; // Exit function if form is not valid
    };

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

    const data = { questions };

    // const data = {
    //     question: form.querySelector('input[name=password]').value,
    //     answer: form.querySelector('input[name=password]').value,
    // };

    const options = {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data), // body data type must match "Content-Type" header
    };

    // fetchataan tiedot
    try {
        const responseData = await fetchData(url, options);
        console.log(responseData);
        alert('Form submitted!');
        window.location.href = 'patienthome.html';
    } catch (error) {
        console.error('Error submitting form data:',error);
    }
});

