import { fetchData } from "../assets/fetch.js";

// url variable
const url = "http://127.0.0.1:3000/api/entries";

// function to send POST request using fetch
async function postData(url, options = {}) {
  try {
    // Define request settings
    const response = await fetch("http://127.0.0.1:3000/api/entries", options);

    // Check if response status is okay
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Parse response as JSON
    const data = await response.json();
    console.log("Response data:", data);

    // Return response data
    return data;
  } catch (error) {
    console.error("Error:", error);
    // Handle error appropriately (e.g., display an error message to the user)
  }
}

// function to send POST request
async function postNewEntry(url, options) {
  // Define POST request and send it
  postData(url, options)
    .then((data) => {
      console.log("Response data:", data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

// Function to convert selected date to yyyy-mm-dd format
function convertToYYYYMMDD(selectedDate) {
  // Split the date into day, month, and year
  const [day, month, year] = selectedDate.split(".");
  // Construct the date string in yyyy-mm-dd format
  const formattedDate = `${year}-${month.padStart(2, "0")}-${day.padStart(
    2,
    "0"
  )}`;
  return formattedDate;
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

// Add event listener to each mood button
const moodColorButtons = document.querySelectorAll(".moodBtn");
moodColorButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    // Remove "selected" class from all buttons
    moodColorButtons.forEach((otherBtn) => {
      otherBtn.classList.remove("selected");
    });
    // Add "selected" class to the clicked button
    btn.classList.add("selected");
  });
});

// Function to get HEX color value based on button ID
function getMoodColor(buttonId) {
  switch (buttonId) {
    case "redBtn":
      return "FF8585"; // Red color
    case "yellowBtn":
      return "FFF67E"; // Yellow color
    case "greenBtn":
      return "9BCF53"; // Green color
    default:
      return ""; // Default color or handle error
  }
}

async function fetchActivities() {
  try {
    // Retrieve the bearer token from localStorage
    const token = localStorage.getItem("token");

    // Check if the token exists
    if (!token) {
      throw new Error("Bearer token missing");
    }

    // Set up request headers with the bearer token
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const response = await fetch(
      "http://127.0.0.1:3000/api/survey/activities",
      {
        headers: headers,
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch activities");
    }

    const activities = await response.json();
    return activities;
  } catch (error) {
    console.error(error);
    // Handle error appropriately
    return [];
  }
}
// Function to populate the dropdown menu with activities
async function populateActivitiesDropdown() {
  const activitiesDropdown = document.getElementById("ActivitiesNew");
  activitiesDropdown.innerHTML = ""; // Clear previous options

  try {
    const response = await fetchActivities();

    // Check if the response contains the "activities" key
    if (!response.hasOwnProperty("activities")) {
      throw new Error("Activities data not found in response");
    }

    const activities = response.activities;

    // Check if the activities data is an array
    if (!Array.isArray(activities)) {
      throw new Error("Activities data is not an array");
    }

    // Add the placeholder option
    const placeholderOption = document.createElement("option");
    placeholderOption.value = "";
    placeholderOption.textContent = "Valitse...";
    activitiesDropdown.appendChild(placeholderOption);

    // Populate dropdown only if activities is not empty
    if (activities.length > 0) {
      activities.forEach((activity) => {
        const option = document.createElement("option");
        option.value = activity;
        option.textContent = activity;
        activitiesDropdown.appendChild(option);
      });
    } else {
      // If activities array is empty, display a default option
      const defaultOption = document.createElement("option");
      defaultOption.value = "";
      defaultOption.textContent = "No activities available";
      activitiesDropdown.appendChild(defaultOption);
    }
  } catch (error) {
    console.error(error);
    // Handle error appropriately
  }
}

// function to gather data from the form
async function gatherNewEntryData() {
  // get entry_date data
  const entryDateHeading = document.querySelector(
    ".FormPopupNew .EntryHeading"
  );
  const selectedDate = entryDateHeading.textContent;

  const entry_date = convertToYYYYMMDD(selectedDate);
  // check date in console
  console.log(entry_date);

  // get chosen mood color data
  let mood_color = "";

  // Loop through mood buttons to find the selected one
  moodColorButtons.forEach((btn) => {
    if (btn.classList.contains("selected")) {
      // Get the HEX color value based on the button ID
      mood_color = getMoodColor(btn.id);
    }
    // Remove "selected" class from all buttons
    btn.classList.remove("selected");
  });

  // get activities data
  const activitiesDropdown = document.getElementById("ActivitiesNew");
  const selectedActivityIndex = activitiesDropdown.selectedIndex;
  const selectedActivity =
    activitiesDropdown.options[selectedActivityIndex].value;

  // Create an array with the selected activity
  const activities = [selectedActivity];

  // get notes data from input
  const notes = document.querySelector(".notesNew input").value;

  // Get token from localStorage
  const token = localStorage.getItem("token");
  console.log(token);
  if (!token) {
    console.error("Token not found in local storage");
    return;
  }

  // insert entry form values into data
  const newEntrydata = {
    entry_date: entry_date,
    mood_color: mood_color,
    activities: activities,
    notes: notes,
  };

  // check data in console
  console.log(newEntrydata);

  // Define POST request options
  const options = {
    method: "POST", // Method is POST
    headers: {
      "Content-Type": "application/json", // Send data in JSON format
      Authorization: "Bearer " + token, // Include authorization token
    },
    body: JSON.stringify(newEntrydata), // Convert data to JSON format and send it
  };

  // Send POST request
  postNewEntry("http://127.0.0.1:3000/api/entries", options);
}

export { gatherNewEntryData, populateActivitiesDropdown, convertToYYYYMMDD, checkHRVDataForDate };
