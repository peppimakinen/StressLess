import { fetchData } from "../assets/fetch.js";

async function getMonthData(year, month) {
  console.log("Fetching monthly entries for year:", year, "and month:", month);
  const url = `http://127.0.0.1:3000/api/entries/monthly?year=${year}&month=${month}`;
  let token = localStorage.getItem("token");

  const options = {
    method: "GET",
    headers: {
      Authorization: "Bearer " + token,
    },
  };

  try {
    const responseData = await fetchData(url, options);
    return responseData; // Return the response data
  } catch (error) {
    console.error("Error fetching entries:", error);
    return {}; // Return an empty object in case of error
  }
}

// Function to check if a date has an entry
function hasEntry(data, year, month, day) {
  const entryDate = `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
  
  // Check if data exists for the entryDate and if it's not an empty object
  return data.hasOwnProperty(entryDate) && Object.keys(data[entryDate]).length > 0;
}


export { getMonthData, hasEntry };
