import { fetchData } from "../assets/fetch.js";
import { convertToDDMMYYYY } from "./convertDay.js"

window.addEventListener('load', async (evt) => {
    evt.preventDefault();
    try {
        //weekreports
        const user_id = localStorage.getItem('userId');
        console.log(user_id)


        const url = `http://127.0.0.1:3000/api/reports/doctor/available-weeks/${user_id}`;
        let token = localStorage.getItem("token");

        const options = {
            method: "GET",
            headers: {
                Authorization: "Bearer " + token,
            },
        };

        const reportData = await fetchData(url, options); 
        if (reportData && reportData.length > 0) {
            const weekNumber = document.querySelector('.weeks');
            reportData.forEach((week) => {
                const weekItem = document.createElement('li');
                weekItem.classList.add('week');
                weekItem.textContent = `Viikko ${week.week_number}`;

                const dateDiv = document.createElement('div');
                dateDiv.classList.add('date');
                const start_date = convertToDDMMYYYY(week.week_start_date);
                const end_date = convertToDDMMYYYY(week.week_end_date);
                dateDiv.textContent = `${start_date} - ${end_date}`;

                const reportsDiv = document.createElement('div');
                reportsDiv.classList.add('reports');
                const reportLink = document.createElement('a');
                reportLink.href = `weekReportD.html?week=${week.week_number}`;
                reportLink.addEventListener('click', function(event) {
                    localStorage.setItem('selectedReportId', week.report_id);
                });
                reportLink.textContent = 'Näytä raportti';
                reportsDiv.appendChild(reportLink);
                weekItem.appendChild(dateDiv);
                weekItem.appendChild(reportsDiv);
                weekNumber.appendChild(weekItem);
            });
        } else {
            const weekItem = document.querySelector('.weeks');
            weekItem.style.whiteSpace = 'pre-line';
            weekItem.textContent = "Viikkoraportit ovat erinomainen tapa seurata omaa hyvinvointia ja tarkastella kuluneita viikkoja kokonaisuutena.\nTällä hetkellä sivu on tyhjä, koska asiakkaalla ei ole menneiltä viikoilta päiväkirjamerkintöjä. Uusi raportti generoituu aina viikon vaihtuessa.";
        }
    } catch (error) {
        console.error('Error fetching report:', error);
    }
});
