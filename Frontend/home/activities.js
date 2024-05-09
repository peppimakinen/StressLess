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
      "https://hyte-server-aleksi.northeurope.cloudapp.azure.com/api/survey/activities",
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
async function populateActivitiesDropdown(dropdownId) {
  const activitiesDropdown = document.getElementById(dropdownId);
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

export { populateActivitiesDropdown };