import { populateActivitiesDropdown } from "./newentry";
import { renderCalendar } from "./calendar";
import { convertToYYYYMMDD, checkHRVDataForDate } from "./newentry";

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
      populateActivitiesDropdown();
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

// Function to show PastEntry popup
export function showPastEntryPopup(date) {
  selectedDate = date;
  PastEntry.style.display = "block";
  calendarWrapper.style.display = "none";
  overlay.style.display = "block";

  // Update the date in the PastEntry modal
  document
    .querySelectorAll(".PopupPastEntry .EntryHeading")
    .forEach((heading) => {
      heading.textContent = selectedDate;
    });
}

// Function to show EditEntry popup
export function showEditEntryPopup() {
  EditEntry.style.display = "block";
  PastEntry.style.display = "none";
  // Update the date in the FormPopupEdit modal
  document.querySelector(".FormPopupEdit .EntryHeading").textContent =
    selectedDate;
}

// Function to hide all popups
export function hideAllPopups() {
  NewEntry.style.display = "none";
  PastEntry.style.display = "none";
  EditEntry.style.display = "none";
  calendarWrapper.style.display = "block";
  overlay.style.display = "none";
}
