
import { fetchData } from './fetch.js';



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

document.addEventListener('DOMContentLoaded', function () {
  // Example data received from backend
  const hrvData = [50, 80, 120, 170, 70, 100, 30];
  const pieData = [30, 45, 25]; // Percentages

  // Set HRV bars height
  const bars = document.querySelectorAll('.hrvSummary .chart .bar');
  bars.forEach((bar, index) => {
      bar.style.height = `${hrvData[index]}px`;
  });

  // Set pie chart slice sizes
  const slices = document.querySelectorAll('.moodSummary .pie-chart .slice');
  slices.forEach((slice, index) => {
      slice.style.setProperty('--size', `${pieData[index]}%`);
  });
});