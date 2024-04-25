import { fetchData } from "../assets/fetch.js";

// Function to handle click event on "Näytä raportti" links
const showReport = async function(event) {
    // event.preventDefault();
    // const weekElement = event.target.closest('.week'); // Get the parent week element
    // const reportId = weekElement.dataset.reportId; // Get the report ID from the week element's dataset
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
        return reportData
    } catch (error) {
        console.error('Error fetching report:', error);
    }
};

// Function to handle click event on "Näytä raportti" links
const reportLinks = document.querySelectorAll('.reports a');
reportLinks.forEach(link => {
    link.addEventListener('click', showReport);
});

// Function to fetch week data
async function fetchWeekData() {
    try {
        const response = await fetchData('http://127.0.0.1:3000/api/reports/available-weeks'); // Use fetchData function to fetch data
        const data = await response.json(); // Parse JSON response
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Render week information
async function renderData() {
    const data = await fetchWeekData(); // Use the fetchData function
    if (data) {
        renderWeekInfo(data.weekNumber, data.startDate, data.endDate);
    }
}

window.onload = renderData;
