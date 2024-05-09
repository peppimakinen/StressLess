import { convertToYYYYMMDD } from "./convertday.js";

// function to send POST request using fetch
async function putData(url, options = {}) {
    try {
      // Define request settings
      const response = await fetch("https://hyte-server-aleksi.northeurope.cloudapp.azure.com/api/entries", options);
  
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
  async function putEditEntry(url, options) {
    // Define POST request and send it
    putData(url, options)
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
  async function gatherEditData() {
    // get entry_date data
    const entryDateHeading = document.querySelector(
      ".FormPopupEdit .EntryHeading"
    );
    const selectedDate = convertToYYYYMMDD(entryDateHeading.textContent);
  
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
    const activitiesDropdown = document.getElementById("ActivitiesEdit");
    const selectedActivityIndex = activitiesDropdown.selectedIndex;
    const selectedActivity =
      activitiesDropdown.options[selectedActivityIndex].value;
  
    // Create an array with the selected activity
    const activities = [selectedActivity];
  
    // get notes data from input
    const notes = document.querySelector(".notesEdit input").value;
  
    // Get token from localStorage
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Token not found in local storage");
      return;
    }
  
    // insert entry form values into data
    const editEntrydata = {
      entry_date: selectedDate,
      mood_color: mood_color,
      activities: activities,
      notes: notes,
    };
  
    // check data in console
    console.log(editEntrydata);
  
    // Define POST request options
    const options = {
      method: "PUT", // Method is POST
      headers: {
        "Content-Type": "application/json", // Send data in JSON format
        Authorization: "Bearer " + token, // Include authorization token
      },
      body: JSON.stringify(editEntrydata), // Convert data to JSON format and send it
    };
  
    try {
      // Send POST request
      await putEditEntry("https://hyte-server-aleksi.northeurope.cloudapp.azure.com/api/entries", options);
    } catch (error) {
      console.error("Error submitting entry edits:", error);
      // Handle error appropriately (e.g., display an error message to the user)
    }
  }

export { gatherEditData, getMoodColor };
