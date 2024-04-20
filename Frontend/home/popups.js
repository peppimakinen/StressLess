// popups.js

// get required elements for displaying the modals
const NewEntry = document.querySelector(".FormPopupNew");
const PastEntry = document.querySelector(".PopupPastEntry");
const EditEntry = document.querySelector(".FormPopupEdit");
const calendarWrapper = document.querySelector(".calendarBackground");
const overlay = document.getElementById("overlay");

// selected date variable
let selectedDate = "";

// Function to show NewEntry popup
export function showNewEntryPopup(date) {
  selectedDate = date;
  NewEntry.style.display = "block";
  calendarWrapper.style.display = "none";
  overlay.style.display = "block";

  // Update the date in the NewEntry modal
  document
    .querySelectorAll(".FormPopupNew .EntryHeading")
    .forEach((heading) => {
      heading.textContent = selectedDate;
    });
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
  document.querySelector(".FormPopupEdit .EntryHeading").textContent = selectedDate;
}

// Function to hide all popups
export function hideAllPopups() {
  NewEntry.style.display = "none";
  PastEntry.style.display = "none";
  EditEntry.style.display = "none";
  calendarWrapper.style.display = "block";
  overlay.style.display = "none";
}
