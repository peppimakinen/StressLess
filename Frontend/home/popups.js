import { populateActivitiesDropdown } from "./activities.js";
import { convertToYYYYMMDD, convertToDDMMYYYY } from "./convertday.js";
import { checkHRVDataForDate, hasEntry } from "./checkdata.js";
import { getDayData } from "./getdata.js";
import { showSnackbar } from "../snackbar.js";
import { getMoodColor } from "./editentry.js";

// get required elements for displaying the modals
const NewEntry = document.querySelector(".FormPopupNew");
const PastEntry = document.querySelector(".PopupPastEntry");
const EditEntry = document.querySelector(".FormPopupEdit");
const InfoPopup = document.querySelector(".InfoPopup");
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
      NewEntry.style.display = "flex";
      calendarWrapper.style.display = "none";
      overlay.style.display = "block";

      // Update the date in the NewEntry modal
      document
        .querySelectorAll(".FormPopupNew .EntryHeading")
        .forEach((heading) => {
          heading.textContent = selectedDate;
        });

      // Populate the dropdown menu with activities
      populateActivitiesDropdown("ActivitiesNew");
    } else {
      // HRV data not found, show an alert
      showSnackbar("Red", "HRV dataa ei löytynyt.");
    }
  } catch (error) {
    console.error("Error checking HRV data:", error);
    // Handle error appropriately
    showSnackbar("Red", "HRV dataa ei löytynyt.");
  }
}

// Function to show PastEntry popup and populate with entry data
export async function showPastEntryPopup(date, monthData) {
  selectedDate = date;

  // Convert the selected date to the yyyy-mm-dd format
  const formattedDate = convertToYYYYMMDD(selectedDate);
  console.log(formattedDate);

  try {
    // Check if there's an entry for the selected date
    const hasEntryForDate = hasEntry(monthData, formattedDate);
    console.log("Has entry for date:", hasEntryForDate);

    if (hasEntryForDate) {
      // Fetch entry data for the selected date
      const entryData = await getDayData(formattedDate);

      // Update the date in the PastEntry modal
      document
        .querySelectorAll(".PopupPastEntry .EntryHeading")
        .forEach((heading) => {
          heading.textContent = selectedDate;
        });

      // Update HRV data in the modal
      document.querySelector(".PopupPastEntry .hrv #sns").textContent =
        "SNS-indeksi: " + entryData.measurement_data.sns_index;

      document.querySelector(".PopupPastEntry .hrv #pns").textContent =
        "PNS-indeksi: " + entryData.measurement_data.pns_index;

      document.querySelector(".PopupPastEntry .hrv #stress").textContent =
        "Stressi-indeksi: " + entryData.measurement_data.stress_index;

      // Update activities data in the modal
      const activitiesList =
        entryData.activities && entryData.activities.length > 0
          ? entryData.activities.join(", ")
          : "No activities";
      document.querySelector(".PopupPastEntry .activitiesPast p").textContent =
        activitiesList;

      // Update notes data in the modal
      document.querySelector(".PopupPastEntry .notesPast p").textContent =
        entryData.diary_entry.notes || "No notes";

      // Display the PastEntry modal
      PastEntry.style.display = "flex";
      calendarWrapper.style.display = "none";
      overlay.style.display = "block";
    } else {
      // Entry not found, handle accordingly
      alert("No entry found for the selected date.");
    }
  } catch (error) {
    console.error("Error fetching entry data:", error);
    // Handle error appropriately (e.g., display an error message to the user)
  }
}

// Function to show EditEntry popup
export function showEditEntryPopup(selectedDate) {
  EditEntry.style.display = "flex";
  PastEntry.style.display = "none";
  // Update the date in the FormPopupEdit modal
  document.querySelector(".FormPopupEdit .EntryHeading").textContent =
    selectedDate;

  // fetch the data of the entry
  const entry_date = convertToYYYYMMDD(selectedDate);
  getDayData(entry_date).then((responseData) => {
    // populate notes field with previous data
    document.getElementById("NotesEdit").value = responseData.diary_entry.notes;

    // Populate mood color
    const moodColor = responseData.diary_entry.mood_color;
    const moodColorButtons = document.querySelectorAll(".moodBtn");
    moodColorButtons.forEach((btn) => {
      if (btn.id === getMoodButtonId(moodColor)) {
        btn.classList.add("selected");
      } else {
        btn.classList.remove("selected");
      }
    });

    // Populate activities dropdown
    populateActivitiesDropdown('ActivitiesEdit').then(() => {
      // Select the chosen activity
      const activitiesDropdown = document.getElementById("ActivitiesEdit");
      const chosenActivity = responseData.activities[0];
      const optionIndex = [...activitiesDropdown.options].findIndex(option => option.value === chosenActivity);
      activitiesDropdown.selectedIndex = optionIndex;
    });
  });
}

// Function to get the button ID based on mood color
function getMoodButtonId(moodColor) {
  switch (moodColor) {
    case "FF8585":
      return "redBtn";
    case "FFF67E":
      return "yellowBtn";
    case "9BCF53":
      return "greenBtn";
    default:
      return ""; // Default or handle error
  }
}

export function showInfoPopup() {
  InfoPopup.style.display = "block";
  overlay.style.display = "block";
  calendarWrapper.style.display = "none";
}

// Function to hide all popups
export function hideAllPopups() {
  NewEntry.style.display = "none";
  PastEntry.style.display = "none";
  EditEntry.style.display = "none";
  InfoPopup.style.display = "none";
  calendarWrapper.style.display = "block";
  overlay.style.display = "none";
}
