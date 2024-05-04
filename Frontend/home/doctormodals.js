import { convertToDDMMYYYY } from "./convertday.js";
import { hasEntry } from "./checkdata.js";
import { getPatientDay, getPatientSurvey } from "./getdata.js";

// get required elements for displaying the modal
const PastEntry = document.querySelector(".PopupPastEntry");
const survey = document.querySelector(".PopupSurvey");
const calendarWrapper = document.querySelector(".calendarBackground");
const overlay = document.getElementById("overlay");


export async function showSurveyPopup() {
  survey.style.display = "flex";
  overlay.style.display = "block";
  calendarWrapper.style.display = "none";

  try {
      const surveyData = await getPatientSurvey();
      if (surveyData) {
          populateSurveyModal(surveyData); // Populate the modal with data
      } else {
          console.log("No survey data received");
          // Optionally show an error message in the modal
      }
  } catch (error) {
      console.error("Failed to display survey data:", error);
      showSnackbar("Red", "Error displaying survey data");
  }
}

function populateSurveyModal(data) {
  const surveyContent = document.querySelector('#surveyContent'); // Make sure you have this element in your HTML
  surveyContent.innerHTML = ''; // Clear previous contents

  if (data && data.questions) {
      data.questions.forEach(question => {
          const questionElement = document.createElement('div');
          questionElement.innerHTML = `<h5>${question.question}</h5><p>${question.answer}</p>`;
          surveyContent.appendChild(questionElement);
      });
  } else {
      surveyContent.textContent = 'No survey data available.';
  }
}


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
      document.querySelector(".PopupPastEntry .hrv #stress").textContent =
        "Stressi-indeksi: " + entryData.measurement_data.stress_index;

      document.querySelector(".PopupPastEntry .hrv #sns").textContent =
        "SNS-indeksi: " + entryData.measurement_data.sns_index;

      document.querySelector(".PopupPastEntry .hrv #pns").textContent =
        "PNS-indeksi: " + entryData.measurement_data.pns_index;

      document.querySelector(".PopupPastEntry .hrv #rmssd").textContent =
        "RMSSD: " + entryData.measurement_data.rmssd_ms;

      document.querySelector(".PopupPastEntry .hrv #sdnn").textContent =
        "SDNN: " + entryData.measurement_data.sdnn_ms;

      document.querySelector(".PopupPastEntry .hrv #rr").textContent =
        "Mean RR: " + entryData.measurement_data.mean_rr_ms;

      document.querySelector(".PopupPastEntry .hrv #lf").textContent =
        "LF power: " + entryData.measurement_data.lf_power;

      document.querySelector(".PopupPastEntry .hrv #hf").textContent =
        "HF power: " + entryData.measurement_data.hf_power;

      document.querySelector(".PopupPastEntry .hrv #lf_nu").textContent =
        "LF n.u.: " + entryData.measurement_data.lf_power_nu;

      document.querySelector(".PopupPastEntry .hrv #hf_nu").textContent =
        "HF n.u.: " + entryData.measurement_data.hf_power_nu;

      document.querySelector(".PopupPastEntry .hrv #total").textContent =
        "LF/HF ratio: " + entryData.measurement_data.tot_power;

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
  survey.style.display = "none";
  calendarWrapper.style.display = "block";
  overlay.style.display = "none";
}
