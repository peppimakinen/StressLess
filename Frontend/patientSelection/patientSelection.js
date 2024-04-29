import { fetchData } from "../assets/fetch.js";

// Function to handle click event on "Näytä raportti" links
window.addEventListener('load', async (evt) => {
    evt.preventDefault();
    try {
        const url = "http://127.0.0.1:3000/api/users/doctors/patients";
        let token = localStorage.getItem("token");

        const options = {
            method: "GET",
            headers: {
                Authorization: "Bearer " + token,
            },
        };

        const reportData = await fetchData(url, options); 
        if (reportData == null ) {
            const clientItem = document.querySelector('.client_list');
            clientItem.textContent = "Käyttäjätililläsi ei ole vielä yhtään potilastiliä liitettynä.";

        } else {
            console.log(reportData);

            const clients = document.querySelector('.clients');
        // Iterate over the reportData to populate the client numbers
            reportData.forEach((name, index) => {
                //client
                const clientItem = document.createElement('li');
                clientItem.classList.add('client');
                clientItem.textContent = `Viikko ${client.username}`;

                //date
                const dateDiv = document.createElement('div');
                dateDiv.classList.add('date');
                const start_date = convertToDDMMYYYY(`${client.client_start_date}`);
                const end_date = convertToDDMMYYYY(`${client.client_end_date}`);
                console.log(start_date, end_date)
                dateDiv.textContent = `${start_date} - ${end_date}`;
        

                //reports
                const reportsDiv = document.createElement('div');
                reportsDiv.classList.add('reports');
                const reportLink = document.createElement('a');
                reportLink.href = `clientReport.html?client=${client.clientNumber}`; // Adjust the URL as needed
                reportLink.textContent = 'Näytä raportti';
                reportsDiv.appendChild(reportLink);
                clientItem.appendChild(dateDiv);
                clientItem.appendChild(reportsDiv);
                clientNumber.appendChild(clientItem);
            });
        }


    } catch (error) {
        console.error('Error fetching report:', error);
    }
});

            
            