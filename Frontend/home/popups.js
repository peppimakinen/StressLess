import { populateActivitiesDropdown } from "./activities.js";
import { convertToYYYYMMDD } from "./convertday.js";
import { checkHRVDataForDate, hasEntry } from "./checkdata.js";
import { getDayData } from "./getdata.js";

// get required elements for displaying the modals
const NewEntry = document.querySelector(".FormPopupNew");
const PastEntry = document.querySelector(".PopupPastEntry");
const EditEntry = document.querySelector(".FormPopupEdit");
const calendarWrapper = document.querySelector(".calendarBackground");
const overlay = document.getElementById("overlay");

// selected date variable
let selectedDate = "";

// Function to show NewEntry popup
export async function showNewEntryPopup(date) {
  selectedDate = date;

  // Convert the selected date to the yyyy-mm-dd format
  const formattedDate = convertToYYYYMMDD(selectedDate);
  console.log(formattedDate);

  try {
    // Check if HRV data exists for the selected date
    const hrvDataFound = await checkHRVDataForDate(formattedDate);

    if (hrvDataFound) {
      // HRV data found, display the FormPopupNew modal
      NewEntry.style.display = "block";
      calendarWrapper.style.display = "none";
      overlay.style.display = "block";

      // Update the date in the NewEntry modal
      document
        .querySelectorAll(".FormPopupNew .EntryHeading")
        .forEach((heading) => {
          heading.textContent = selectedDate;
        });

      // Populate the dropdown menu with activities
      populateActivitiesDropdown('ActivitiesNew');
    } else {
      // HRV data not found, show an alert
      alert("No HRV data was found for the selected date.");
    }
  } catch (error) {
    console.error("Error checking HRV data:", error);
    // Handle error appropriately
    alert("An error occurred while checking HRV data. Please try again later.");
  }
}

// Function to show PastEntry popup and populate with entry data
export async function showPastEntryPopup(date) {
  const dateHeading = date
  selectedDate = convertToYYYYMMDD(date);
  console.log(selectedDate);
  
  PastEntry.style.display = "block";
  calendarWrapper.style.display = "none";
  overlay.style.display = "block";

  try {
    // Fetch entry data for the selected date
    const entryData = await getDayData(selectedDate);

    // Update the date in the PastEntry modal
    document
      .querySelectorAll(".PopupPastEntry .EntryHeading")
      .forEach((heading) => {
        heading.textContent = dateHeading;
      });

    // Update HRV data in the modal
    document.querySelector(".PopupPastEntry .hrv p").textContent = 'PNS index: ' + entryData.measurement_data.pns_index + '\nSNS index: ' + entryData.measurement_data.sns_index || "HRV data not available";

    // Update activities data in the modal
    const activitiesList = entryData.activities && entryData.activities.length > 0 ? entryData.activities.join(", ") : "No activities";
    document.querySelector(".PopupPastEntry .activitiesPast p").textContent = entryData.activities;

    // Update notes data in the modal
    document.querySelector(".PopupPastEntry .notesPast p").textContent = entryData.diary_entry.notes || "No notes";

  } catch (error) {
    console.error("Error fetching entry data:", error);
    // Handle error appropriately (e.g., display an error message to the user)
  }
}

// Function to show EditEntry popup
export function showEditEntryPopup() {
  EditEntry.style.display = "block";
  PastEntry.style.display = "none";
  // Update the date in the FormPopupEdit modal
  document.querySelector(".FormPopupEdit .EntryHeading").textContent =
    selectedDate;
  // Populate the dropdown menu with activities
  populateActivitiesDropdown('ActivitiesEdit');
}


// Function to hide all popups
export function hideAllPopups() {
  NewEntry.style.display = "none";
  PastEntry.style.display = "none";
  EditEntry.style.display = "none";
  calendarWrapper.style.display = "block";
  overlay.style.display = "none";
}