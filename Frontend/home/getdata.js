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

async function getDayData(entry_date) {
  console.log('GetDayData: ' + entry_date);
  const url = `http://127.0.0.1:3000/api/entries/daily/${entry_date}`;
  let token = localStorage.getItem("token");

  const options = {
    method: "GET",
    headers: {
      Authorization: "Bearer " + token,
    },
  };

  try {
    const responseData = await fetchData(url, options);
    console.log(responseData);
    return responseData; // Return the response data
  } catch (error) {
    console.error("Error fetching entries:", error);
    return {}; // Return an empty object in case of error
  }
}

export { getMonthData, getDayData };
