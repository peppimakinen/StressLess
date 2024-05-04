import { fetchData } from "../assets/fetch.js";

// Function to handle click event on "Näytä raportti" links
window.addEventListener('load', async (evt) => {
    evt.preventDefault();
    try {
        const url = "http://127.0.0.1:3000/api/users/doctor/patients";
        let token = localStorage.getItem("token");

        const options = {
            method: "GET",
            headers: {
                Authorization: "Bearer " + token,
            },
        };

        const reportData = await fetchData(url, options); 
        if (Object.keys(reportData).length === 0) {
            const clientItem = document.querySelector('.clients');
            clientItem.textContent = "Käyttäjätililläsi ei ole vielä yhtään potilastiliä liitettynä.";

        } else {
            console.log(reportData);

            const clients = document.querySelector('.clients');
        // Iterate over the reportData to populate the client numbers
            reportData.forEach((client, index) => {
                //delete
                const delete_user = document.createElement('li');
                delete_user.classList.add('delete');
                delete_user.textContent = 'x';

                //client
                const clientItem = document.createElement('li');
                clientItem.classList.add('client');
                clientItem.textContent = client.full_name;
                console.log(client.full_name)
                localStorage.setItem('full_name', client.full_name);

                //reports
                const reportsDiv = document.createElement('div');
                reportsDiv.classList.add('reports');
                const reportLink = document.createElement('a');
                //change into the home page of the client
                reportLink.href = `../home/doctorhome.html?client=${client.user_id}`; 
                reportLink.addEventListener('click', function(event) {
                    localStorage.setItem('full_name', client.full_name);
                });
                reportLink.textContent = 'Näytä asiakastili';

                reportsDiv.appendChild(reportLink);
                delete_user.appendChild(clientItem);
                delete_user.appendChild(reportsDiv);
                clients.appendChild(delete_user);
            });
        }


    } catch (error) {
        console.error('Error fetching report:', error);
    }
});

            
            