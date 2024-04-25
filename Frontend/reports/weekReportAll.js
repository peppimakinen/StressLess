import { fetchData } from "../assets/fetch.js";
import { convertToDDMMYYYY } from "../home/convertday.js"

// Function to handle click event on "Näytä raportti" links
window.addEventListener('load', async (evt) => {
    evt.preventDefault();
    try {
        const url = "http://127.0.0.1:3000/api/reports/available-weeks";
        let token = localStorage.getItem("token");

        const options = {
            method: "GET",
            headers: {
                Authorization: "Bearer " + token,
            },
        };

        const reportData = await fetchData(url, options); 
        console.log(reportData);

        const weekNumber = document.querySelector('.weeks');
    // Iterate over the reportData to populate the week numbers
    reportData.forEach((week, date, index) => {
        //week
        const weekItem = document.createElement('li');
        weekItem.classList.add('week');
        weekItem.textContent = `Viikko ${week.week_number}`;

        //date
        const dateDiv = document.createElement('div');
        dateDiv.classList.add('date');
        dateDiv.textContent = `${week.week_start_date} - ${week.week_end_date}`;

        const start_date = convertToDDMMYYYY(`${week.week_start_date}`);
        const end_date = convertToDDMMYYYY(`${week.week_start_date}`);
        console.log(start_date, end_date)
        // dateDiv.textContent = `${week.start_date} - ${week.end_date}`;
  

        //reports
        const reportsDiv = document.createElement('div');
        reportsDiv.classList.add('reports');
        const reportLink = document.createElement('a');
        reportLink.href = `weekReport.html?week=${week.weekNumber}`; // Adjust the URL as needed
        reportLink.textContent = 'Näytä raportti';
        reportsDiv.appendChild(reportLink);
        weekItem.appendChild(dateDiv);
        weekItem.appendChild(reportsDiv);
        weekNumber.appendChild(weekItem);
    });


    } catch (error) {
        console.error('Error fetching report:', error);
    }
    });

    
    