import { fetchData } from "../assets/fetch.js";
import { convertToYYYYMMDD } from "./convertday.js";

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

// function to gather data from the form
async function gatherNewData() {
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

  try {
    // Send POST request
    await postNewEntry("http://127.0.0.1:3000/api/entries", options);
    
    // Reload the page after successful submission
    window.location.reload();
  } catch (error) {
    console.error("Error submitting new entry:", error);
    // Handle error appropriately (e.g., display an error message to the user)
  }
}

export { gatherNewData };