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
