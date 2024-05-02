import { convertToDDMMYYYY } from "./convertday.js";
import { hasEntry } from "./checkdata.js";
import { getPatientDay } from "./getdata.js";

// get required elements for displaying the modal
const PastEntry = document.querySelector(".PopupPastEntry");
const calendarWrapper = document.querySelector(".calendarBackground");
const overlay = document.getElementById("overlay");

// Function to show PastEntry popup and populate with entry data
export async function showPastEntryPopup(monthData, date) {
  console.log("Modal date: " + date);
  console.log("Modal month: " + monthData);

  const selectedDate = date;

  // Convert the selected date to the yyyy-mm-dd format
  const formattedDate = convertToDDMMYYYY(selectedDate);
  console.log(formattedDate);

  try {
    // Check if there's an entry for the selected date
    const hasEntryForDate = hasEntry(monthData, date);
    console.log("Has entry for date:", hasEntryForDate);

    if (hasEntryForDate) {
      // Fetch entry data for the selected date
      const entryData = await getPatientDay(date);

      // Update the date in the PastEntry modal
      document
        .querySelectorAll(".PopupPastEntry .EntryHeading")
        .forEach((heading) => {
          heading.textContent = formattedDate;
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

// Function to hide all popups
export function hideAllPopups() {
  PastEntry.style.display = "none";
  //   InfoPopup.style.display = "none";
  calendarWrapper.style.display = "block";
  overlay.style.display = "none";
}
