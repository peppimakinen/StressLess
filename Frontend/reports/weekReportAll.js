
// LOGOUT 
// const logout = document.querySelector('.logout');

// const logout = function(evt) {
//   evt.preventDefault();
//   window.location.href = 'login.html';
// };

// logout.addEventListener('click', logout);

//check the amount of reports
// Function to fetch specific report based on user ID and report ID
// Function to handle click event on "Näytä raportti" links
const showReport = async function(event) {
    event.preventDefault();
    const weekElement = event.target.closest('.week'); // Get the parent week element
    const reportId = weekElement.dataset.reportId; // Get the report ID from the week element's dataset
    try {
        const userId = getUserID(); // Get the authenticated user's ID (implement this function)
        const reportData = await getSpecificReport(userId, reportId);
        // Display the fetched report data on the HTML page
        displayReport(reportData);
    } catch (error) {
        console.error('Error fetching report:', error);
    }
};

// Function to fetch specific report based on user ID and report ID
const getSpecificReport = async (userId, reportId) => {
    try {
        const response = await fetch(`/api/reports/${reportId}?userId=${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // Add any necessary authentication headers if required
            },
        });
        if (!response.ok) {
            throw new Error('Failed to fetch report');
        }
        return await response.json();
    } catch (error) {
        throw new Error('Error fetching report');
    }
};

// Function to handle click event on "Näytä raportti" links
const reportLinks = document.querySelectorAll('.reports a');
reportLinks.forEach(link => {
    link.addEventListener('click', showReport);
});