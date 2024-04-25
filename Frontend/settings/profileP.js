import { fetchData } from "../assets/fetch";

function showProfile() {
    const user_name = localStorage.getItem('user_name');
    const nameSpan = document.getElementById("name");
    nameSpan.textContent = user_name || "No name available";

    const user_email = localStorage.getItem('user_email');
    const emailSpan = document.getElementById("email");
    emailSpan.textContent = user_email || "No email available";

    const entry_count = localStorage.getItem('entry_count');
    const entrySpan = document.getElementById("count");
    entrySpan.textContent = entry_count || "0";
}



async function getEntryCount() {
    const url = `http://127.0.0.1:3000/api/auth/me`;
    const token = localStorage.getItem("token");

    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
    };
    
    try {
        const response = await fetchData(url, options);
        const responseData = await response.json();
        console.log(responseData);
        if (responseData && responseData.stressLessUser && responseData.stressLessUser.entry_count !== undefined) {
            localStorage.setItem("entry_count", responseData.stressLessUser.entry_count);
        } else {
            localStorage.setItem("entry_count", 0);  // Set default count as 0
        }
    } catch (error) {
        console.error(error);
        alert("Entries could not be retrieved.");
    }
};




// Select the delete account button
const deleteAccountButton = document.querySelector('.pic a');

// Add event listener to the delete account button
deleteAccountButton.addEventListener('click', async function(evt) {
    evt.preventDefault(); // Prevent default link behavior

    const user_id = evt.target.dataset.user_id;
    console.log('User ID to delete:', user_id);

    // Confirm deletion with user
    const confirmation = confirm("Are you sure you want to delete your account? This action cannot be undone.");

    // If user confirms deletion
    if (confirmation) {
        try {
            // Retrieve the token from localStorage
            const token = localStorage.getItem('token');

            // Construct the URL for deleting the account
            const url = `http://127.0.0.1:3000/api/users/${user_id}`;

            // Set up the options for the DELETE request
            const options = {
                method: 'DELETE',
                headers: {
                    'Authorization': 'Bearer ' + token,
                },
            };

            // Send the DELETE request to delete the account
            const response = await fetchData(url, options);

            // Check if the request was successful
            if (response.ok) {
                alert('Account deleted successfully.');
                // Optionally, redirect the user to a confirmation page or log them out
                // window.location.href = 'confirmation.html';
            } else {
                // If the request was not successful, display an error message
                const errorData = await response.json();
                alert('Error deleting account: ' + errorData.message);
            }
        } catch (error) {
            console.error('Error deleting account:', error);
            alert('Error deleting account. Please try again later.');
        }
    }
});


  

showProfile();
getEntryCount();
