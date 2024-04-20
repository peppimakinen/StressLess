
// LOGOUT 
// const logout = document.querySelector('.logout');

// const logout = function(evt) {
//   evt.preventDefault();
//   window.location.href = 'login.html';
// };

// logout.addEventListener('click', logout);



// fetching weeks dates
const showReport = async function(event) {
    event.preventDefault();
    const weekElement = event.target.closest('.week'); // Get the parent week element
    const entryId = weekElement.dataset.entryId; // Get the entry ID from the week element's dataset
    try {
        const result = await fetch(`/api/reports/${entryId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // Add any necessary authentication headers if required
            },
        });
        if (!result.ok) {
            throw new Error('Failed to fetch report');
        }
        const reportData = await result.json();
        // Handle the fetched report data as needed
        console.log(reportData);
    } catch (error) {
        console.error('Error fetching report:', error);
    }
};

// Add click event listeners to all "Näytä raportti" links
const reportLinks = document.querySelectorAll('.reports a');
reportLinks.forEach(link => {
    link.addEventListener('click', showReport);
});
