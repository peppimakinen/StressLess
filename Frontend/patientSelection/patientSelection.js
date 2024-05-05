import { fetchData } from "../assets/fetch.js";
import { showSnackbar } from "../snackbar.js";

// Function to handle click event on "Näytä raportti" links
window.addEventListener('load', async () => {
    try {
        const url = "http://127.0.0.1:3000/api/users/doctor/patients";
        const token = localStorage.getItem("token");

        const options = {
            method: "GET",
            headers: {
                Authorization: "Bearer " + token,
            },
        };

        const reportData = await fetchData(url, options); 
        const clientsList = document.querySelector('.clients');

        if (Object.keys(reportData).length === 0) {
            clientsList.textContent = "Käyttäjätililläsi ei ole vielä yhtään potilastiliä liitettynä.";
        } else {
            reportData.forEach((client, index) => {
                // Create client item container
                const clientContainer = document.createElement('li');
                clientContainer.classList.add('client-container');

                const clientName = document.createElement('span');
                clientName.classList.add('client-name');
                clientName.textContent = client.full_name;

                // Create reports link element
                const reportLink = document.createElement('a');
                reportLink.href = `../home/doctorhome.html?client=${client.user_id}`;
                reportLink.textContent = 'Näytä asiakastili';

                // Create delete button element
                const deleteButton = document.createElement('button');
                deleteButton.classList.add('delete');
                deleteButton.textContent = 'X';
                deleteButton.dataset.userId = client.user_id;

                // Event listener for delete button
                deleteButton.addEventListener('click', async function(event) {
                    event.preventDefault();
                    const userId = event.target.dataset.userId; // Extract the user ID from the clicked delete button
                    document.getElementById('deleteModal').style.display = 'block'; // Display confirmation modal

                    // Get the close span element
                    const closeModalButton = document.querySelector('.close');

                    // Add event listener to the close button
                    closeModalButton.addEventListener('click', function() {
                        document.getElementById('deleteModal').style.display = 'none'; // Hide the modal
                    });

                    // Event listener for confirm deletion button
                    document.getElementById('confirmDeletion').addEventListener('click', async function() {
                        const userInput = document.getElementById('deleteConfirm').value;
                        if (userInput === 'Poista tili') {
                            try {
                                const response = await fetch(`http://127.0.0.1:3000/api/users/doctor/delete-patient/${userId}`, {
                                    method: 'DELETE',
                                    headers: {
                                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                                    }
                                });
                                
                                if (response.ok) {
                                    showSnackbar("Green","Tili poistettu onnistuneesti");
                                    setTimeout(() => {
                                        window.location.href = './patientSelection.html';
                                    }, 3000);
                                } else {
                                    throw new Error('Failed to delete account');
                                }
                            } catch (error) {
                                showSnackbar("Red", error.message);
                            }
                        } else {
                            showSnackbar("Red", "Poistaminen epäonnistui: väärä teksti");
                        }
                        document.getElementById('deleteModal').style.display = 'none';
                    });
                });

                // Create client list item
                const clientItem = document.createElement('li');
                clientItem.classList.add('client');
                clientItem.textContent = client.full_name;

                // Create reports link
                const reportsDiv = document.createElement('div');
                reportsDiv.classList.add('reports');
                reportLink.href = `../home/doctorhome.html?client=${client.user_id}`;
                reportLink.textContent = 'Näytä asiakastili';

                // Append elements to client item container
                clientContainer.appendChild(deleteButton);
                clientContainer.appendChild(clientName);
                clientContainer.appendChild(reportLink);

                // Append client item container to clients list
                clientsList.appendChild(clientContainer);
            });
        }

    } catch (error) {
        console.error('Error fetching report:', error);
    }
});
