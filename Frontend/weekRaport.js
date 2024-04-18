import './weekRaport.css'
import { fetchData } from './fetch.js';

// LOGOUT 
// const logout = document.querySelector('.logout');

const logout = function(evt) {
  evt.preventDefault();
  window.location.href = 'login.html';
};

logout.addEventListener('click', logout);

// MOOD
// fetching mood data from the backend


// HRV
// fetching HRV data from the backend
async function fetchHRVDataFromBackend(entry_id) {
  try {
      // URL with query parameters for the beginning and ending dates
      const url = `http://backendUrl.com/hrv-data?entry_id=${entry_id}`;

      // GET request to fetch HRV data
      const response = await fetch(url);

      if (!response.ok) {
          throw new Error('Failed to fetch HRV data');
      }

      // Parse the response JSON
      const data = await response.json();
      
      return data; // array of objects
  } catch (error) {
      console.error('Error fetching HRV data:', error);
      return null;
  }
}

// Call the fetchHRVDataFromBackend function
// fetchHRVDataFromBackend(beginningDate, endDate)
//   .then(weeklyHRVData => {
//       console.log('Weekly HRV data:', weeklyHRVData);
//   })
//   .catch(error => {
//       console.error('Error:', error);
//   });


// Function to fetch weekly HRV data based on the beginning and ending dates
function fetchWeeklyHRV(beginningDate, endDate) {
  // Fetch HRV data from the backend for the given week
  const weeklyHRVData = fetchHRVDataFromBackend(beginningDate, endDate);
  return weeklyHRVData;
}

// fetching hrv data by a week
const beginningDate = new Date('2024-04-01'); 
const endDate = new Date('2024-04-07'); 
const weeklyHRV = fetchWeeklyHRV(beginningDate, endDate);
console.log(weeklyHRV); 

// POPUP
// const popup = document.getElementById('popup');
// const overlay = document.getElementById('overlay');
// const openPopupBtn = document.querySelector('.yes');
// const closePopupBtn = document.getElementById('closePopup');
// const createEntryBtn = document.querySelector('.createEntry');

// openPopupBtn.addEventListener('click', function(evt) {
//   evt.preventDefault();
//   popup.style.display = 'block';
//   overlay.style.display = 'block';
// });

// closePopupBtn.addEventListener('click', function() {
//   popup.style.display = 'none';
//   overlay.style.display = 'none';
// });

// createEntryBtn.addEventListener('click', function(evt) {
//   evt.preventDefault();
//   popup.style.display = 'none';
//   overlay.style.display = 'none';
// });