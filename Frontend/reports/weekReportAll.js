import { getReport } from "./pastReports.js";

// Function to handle click event on "Näytä raportti" links
const showReport = async function(event) {
    event.preventDefault();
    const weekElement = event.target.closest('.week'); // Get the parent week element
    const reportId = weekElement.dataset.reportId; // Get the report ID from the week element's dataset
    try {
        const userId = getUserID(); // Get the authenticated user's ID
        const reportData = await getReport(userId, reportId); // Use getReport function to fetch report data
        // Display the fetched report data on the HTML page
        displayReport(reportData);
    } catch (error) {
        console.error('Error fetching report:', error);
    }
};

// Function to handle click event on "Näytä raportti" links
const reportLinks = document.querySelectorAll('.reports a');
reportLinks.forEach(link => {
    link.addEventListener('click', showReport);
});
