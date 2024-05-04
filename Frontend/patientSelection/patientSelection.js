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
                // Create delete button
                const deleteButton = document.createElement('button');
                deleteButton.classList.add('delete');
                deleteButton.textContent = 'X';

                // Attach the client's user ID as a data attribute to the delete button
                deleteButton.dataset.userId = client.user_id;

                // Event listener for delete button
                deleteButton.addEventListener('click', async function(event) {
                    event.preventDefault();
                    const userId = event.target.dataset.userId; // Extract the user ID from the clicked delete button
                    document.getElementById('deleteModal').style.display = 'block'; // Display confirmation modal

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
                const reportLink = document.createElement('a');
                reportLink.href = `../home/doctorhome.html?client=${client.user_id}`;
                reportLink.textContent = 'Näytä asiakastili';

                reportsDiv.appendChild(reportLink);

                // Append elements to clients list
                clientsList.appendChild(clientItem);
                clientsList.appendChild(reportsDiv);
                clientsList.appendChild(deleteButton);
            });
        }

    } catch (error) {
        console.error('Error fetching report:', error);
    }
});
