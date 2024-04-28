import { fetchData } from "../assets/fetch";

async function displayDoctorInfo() {
    const url = 'http://127.0.0.1:3000/api/users/create-pair'; 
    const token = localStorage.getItem("token");

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    };

    try {
        const response = await fetchData(url, options);
        if (response.ok) {
            const data = await response.json();
            if (data) {
                // Update the DOM with the doctor's name and email
                document.getElementById('doctorName').textContent = data.doctor_username;
            } else {
                // Hide the list or display a default message if no doctor info
                document.getElementById('doctorInfo').style.display = 'none';
            }
        } else {
            throw new Error('Failed to fetch doctor info');
        }
    } catch (error) {
        console.error('Error fetching doctor info:', error);
        document.getElementById('doctorInfo').textContent = 'Lääkäriä ei löydy';
    }
}

// Call this function on page load or after form submission
document.addEventListener('DOMContentLoaded', displayDoctorInfo);
