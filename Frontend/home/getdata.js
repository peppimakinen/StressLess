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

async function getPatientMonth (year, month) {
  // Extracting the client parameter value from the URL
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const client = urlParams.get('client');
  
  console.log("Fetching patient entries for year:", year, "and month:", month);
  const url = `http://127.0.0.1:3000/api/entries/doctor/monthly/${client}?year=${year}&month=${month}`;
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

async function getPatientDay(entry_date) {
  console.log('Get patient day: ' + entry_date);
  const patient_id = localStorage.getItem("patient_id");
  const url = `http://127.0.0.1:3000/api/doctor/daily/${entry_date}/${patient_id}`;
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


export { getMonthData, getPatientMonth, getDayData, getPatientDay };
