import { fetchData } from "../assets/fetch.js";

// PATIENT SIDE
async function getMonthData(year, month) {
  console.log("Fetching monthly entries for year:", year, "and month:", month);
  const url = `https://hyte-server-aleksi.northeurope.cloudapp.azure.com/api/entries/monthly?year=${year}&month=${month}`;
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
  const url = `https://hyte-server-aleksi.northeurope.cloudapp.azure.com/api/entries/daily/${entry_date}`;
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

// DOCTOR SIDE
async function getPatientMonth (year, month) {
  // Extracting the client parameter value from the URL
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const client = urlParams.get('client');
  
  console.log("Fetching patient entries for year:", year, "and month:", month);
  const url = `https://hyte-server-aleksi.northeurope.cloudapp.azure.com/api/entries/doctor/monthly/${client}?year=${year}&month=${month}`;
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

async function getPatientDay(entry_date) {
  // Extracting the client parameter value from the URL
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const client = urlParams.get('client');

  console.log('Get patient day: ' + entry_date);
  const url = `https://hyte-server-aleksi.northeurope.cloudapp.azure.com/api/entries/doctor/daily/${entry_date}/${client}`;
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

async function getPatientSurvey() {
  // Extracting the client parameter value from the URL
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const client = urlParams.get('client');

  const url = `https://hyte-server-aleksi.northeurope.cloudapp.azure.com/api/survey/doctor/${client}`;
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


export { getMonthData, getDayData, getPatientMonth, getPatientDay, getPatientSurvey };
