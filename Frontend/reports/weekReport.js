import { fetchData } from '../assets/fetch.js';

// Render charts 


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

        const summary = document.querySelector('.stressSummary');
        summary.textContent = user_id;
        const diagrams = document.querySelector('.diagrams');


    //trials
    reportData.forEach((HRV, mood) => {
        //week
        const summaryItem = document.createElement('h3');
        summaryItem.classList.add('summary');
        summaryItem.textContent = `Tässä summary: ${summary.previous_week_si_avg}`;


        const HRVItem = document.createElement('li');
        HRVItem.classList.add('hrvSummary');
        HRVItem.textContent = `Viikko ${diagrams.week_number}`;

        const moodItem = document.createElement('li');
        moodItem.classList.add('moodSummary');
        moodItem.textContent = `Viikko ${diagrams.week_number}`;

        // //date
        // const dateDiv = document.createElement('div');
        // dateDiv.classList.add('date');
        // const start_date = convertToDDMMYYYY(`${week.week_start_date}`);
        // const end_date = convertToDDMMYYYY(`${week.week_end_date}`);
        // console.log(start_date, end_date)
        // dateDiv.textContent = `${start_date} - ${end_date}`;
  

        // //reports
        // const reportsDiv = document.createElement('div');
        // reportsDiv.classList.add('reports');
        // const reportLink = document.createElement('a');
        // reportLink.href = `weekReport.html?week=${week.weekNumber}`; // Adjust the URL as needed
        // reportLink.textContent = 'Näytä raportti';
        // reportsDiv.appendChild(reportLink);
        // weekItem.appendChild(dateDiv);
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


// async function renderData() {
//     let token = localStorage.getItem("token");
//     // let userId = getUserID(); // Get the user ID from wherever it's available

//     const user_email = localStorage.getItem('user_email')
//     console.log(user_email)

//     const url = `http://127.0.0.1:3000/api/users/${user_email}`;
//     const options = {
//      method: "GET",
//         headers: {
//         Authorization: "Bearer " + token,
//         },
//   };

//     const data = await fetchData(url, options);
//     console.log(data);

//     const pieChartContainer = document.getElementById('pieChart');
//     const barChartContainer = document.getElementById('barChart');
//     const noDataMessage = document.getElementById('noDataMessage');

//     if (!data || Object.keys(data).length === 0) {
//         // If no data available, display message and hide charts
//         noDataMessage.style.display = 'block';
//         pieChartContainer.style.display = 'none';
//         barChartContainer.style.display = 'none';
//      } else {
//         renderPieChart(data.colorPercentages);
//         renderBarChart(data.hrvValues);
//         noDataMessage.style.display = 'none';
//         pieChartContainer.style.display = 'block';
//         barChartContainer.style.display = 'block';
//     }
//     }

// // Render pie chart
// function renderPieChart(colorPercentages) {
//     const pieChartCanvas = document.getElementById('pieChart').getContext('2d');
    
//     // Set the aspect ratio to make the pie chart a circle
//     pieChartCanvas.canvas.height = pieChartCanvas.canvas.width;
    
//     new Chart(pieChartCanvas, {
//         type: 'pie',
//         data: {
//             labels: ['Red', 'Green', 'Yellow', 'Gray'],
//             datasets: [{
//                 data: Object.values(colorPercentages),
//                 backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#D3D3D3'],
//             }]
//         }
//     });
// }

// // Render bar chart
// function renderBarChart(hrvValues) {
//     const barChartCanvas = document.getElementById('barChart').getContext('2d');
//     new Chart(barChartCanvas, {
//         type: 'bar',
//         data: {
//             labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
//             datasets: [{
//                 label: 'HRV Values',
//                 data: hrvValues,
//                 backgroundColor: 'rgba(54, 162, 235, 0.2)',
//                 borderColor: 'rgba(54, 162, 235, 1)',
//                 borderWidth: 1
//             }]
//         },
//         options: {
//             scales: {
//                 y: {
//                     beginAtZero: true
//                 }
//             }
//         }
//     });
// }

// window.onload = renderData;
