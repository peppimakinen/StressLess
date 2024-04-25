import { fetchData } from "../assets/fetch.js";

// Function to check if a date has an entry
function hasEntry(data, year, month, day) {
  const entryDate = `${year}-${month.toString().padStart(2, "0")}-${day
    .toString()
    .padStart(2, "0")}`;

  // Check if data exists for the entryDate and if it's not an empty object
  return (
    data.hasOwnProperty(entryDate) && Object.keys(data[entryDate]).length > 0
  );
}

// function to send GET request to check HRV data for a specific date
async function checkHRVDataForDate(date) {
    // Retrieve the Bearer token from localStorage
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Bearer token missing");
      return;
    }
  
    // Construct the URL for checking HRV data
    const url = `http://127.0.0.1:3000/api/kubios/check/${date}`;
  
    // Define request options with the Bearer token included in the headers
    const options = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  
    try {
      // Send GET request to check HRV data
      const response = await fetchData(url, options);
      console.log("HRV data found:", response.kubiosDataFound);
      return response.kubiosDataFound;
    } catch (error) {
      console.error("Error checking HRV data:", error);
      return false; // Return false in case of error
    }
  }

export { hasEntry, checkHRVDataForDate };