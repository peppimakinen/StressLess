import { fetchData } from '../assets/fetch.js';



window.addEventListener('load', async (evt) => {
    evt.preventDefault();
    try {
        //get all the weeks related to the user
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
        console.log(reportData[0]['report_id']);
        //get the report_id that is neede to get a specific report
        const reportId = reportData[0]['report_id'];

        //get the specific report by using report_id
        const url2 = `http://127.0.0.1:3000/api/reports/${reportId}`;
        let token2 = localStorage.getItem("token");
        const options2 = {
            method: "GET",
            headers: {
                Authorization: "Bearer " + token2,
            },
        };
        const specificReportData = await fetchData(url2, options2); 
        console.log(specificReportData);

        //stressindex summary comparing last week
        const stressIndexNow = specificReportData.week_si_avg;
        const stressIndexPrev = specificReportData.previous_week_si_avg;
        console.log(stressIndexNow, stressIndexPrev)

        if ( stressIndexNow >= (stressIndexPrev || null) ) {
            const summary = document.querySelector('#stressSummary');
            summary.textContent = "Stressasit tällä viikolla enemmän verrattuna viime viikkoon. On hyvä kerrata tapoja, jotka ovat tehokkaimmin alentaneet stressiäsi aikaisemmin.";
        } if ( stressIndexNow == stressIndexPrev) {
            const summary = document.querySelector('#stressSummary');
            summary.textContent = "Stressitasossa ei havaittu merkittäviä muutoksia viime viikkoon verrattuna.";
        } if ( stressIndexNow <= stressIndexPrev ) {
            const summary = document.querySelector('#stressSummary');
            summary.textContent = "Stressasit tällä viikolla vähemmän edelliseen viikkoon verrattuna, hienoa! Kannattaa kiinnittää huomioita niihin tapoihin, joita olet tällä viikolla tehnyt stressisi lieventämiseksi. Niistä voi olla hyötyä myös jatkossa!"
        } else {
            const summary = document.querySelector('#stressSummary');
            summary.textContent = "Tietokannassa ei ole tarpeeksi tarkkaa tietoa antamaan vertailu yhteenvetoa tämän viikon stressitasosta verrattuna aiempaan viikkoon."
        }
    
        //trials for diagrams
        const diagrams = document.querySelector('.diagrams');
        reportData.forEach((HRV, mood) => {
            //HRV from the week
            const HRVItem = document.createElement('li');
            HRVItem.classList.add('hrvSummary');
            HRVItem.textContent = `Viikko ${diagrams.week_number}`;

            const moodItem = document.createElement('li');
            moodItem.classList.add('moodSummary');
            moodItem.textContent = `Viikko ${diagrams.week_number}`;

            reportParts.appendChild(summaryItem);
            diagrams.appendChild(HRVItem);
            diagrams.appendChild(moodItem);
            infoParts.appendChild(reportParts)
            infoParts.appendChild(diagrams)
        });

        } catch (error) {
            console.error('Error fetching report:', error);
        };
    });
