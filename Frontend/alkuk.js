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
const No = document.getElementById('no');

No.addEventListener('click', async (evt) => {
    evt.preventDefault();
    // Select the form element
    const form = document.querySelector('.answer-form-all');
    // Serialize form data
    const formData = new FormData(form);
    const serializedFormData = {};
    for (const [key, value] of formData) {
        serializedFormData[key] = value;
    }

    const url = "http://127.0.0.1:3000/api/survey"

    try {
        // Send form data to the backend for processing and storing in the database
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(serializedFormData)
        });

        if (response.ok) {
            // If submission is successful, redirect to patienthome.html
            window.location.href = 'patienthome.html';
        } else {
            console.error('Failed to submit form data to the server.');
            // Handle error as needed
        }
    } catch (error) {
        console.error('Error submitting form data:', error);
        // Handle error as needed
    }
});
