import { fetchData } from "../assets/fetch.js";
import { renderCalendar } from "./calendar.js";
import { gatherNewData } from "./newentry.js";
import { gatherEditData } from "./editentry.js";
import { getMonthData } from "./getdata.js";
import { hasEntry } from "./checkdata.js";
import { showNewEntryPopup, showPastEntryPopup, showEditEntryPopup, hideAllPopups } from "./popups.js";

// RENDERING CALENDAR
// get new date, current year and month
let date = new Date(),
  currYear = date.getFullYear(),
  currMonth = date.getMonth();

// store full name of all months in array
const prevNextIcon = document.querySelectorAll(".calendarHeader span");

// Declare monthData variable globally
let monthData = {};

// function to render calendar when page is loaded
const initializeCalendar = async () => {
  // Fetch month data
  monthData = await getMonthData(currYear, currMonth + 1);
  renderCalendar(currYear, currMonth, monthData);
};

// function to update calendar when previous or next buttons are clicked
const updateCalendar = async (icon) => {
  currMonth = icon.id === "prev" ? currMonth - 1 : currMonth + 1;

  if (currMonth < 0 || currMonth > 11) {
    date = new Date(currYear, currMonth, new Date().getDate());
    currYear = date.getFullYear();
    currMonth = date.getMonth();
  } else {
    date = new Date();
  }
  // Update the calendar with the new month data
  renderCalendar(currYear, currMonth, await getMonthData(currYear, currMonth + 1));
};

// event listeners for previous and next buttons
prevNextIcon.forEach((icon) => {
  icon.addEventListener("click", () => {
    updateCalendar(icon);
  });
});

// render calendar when page is loaded
window.addEventListener("load", () => {
  initializeCalendar();
});


// MODAL HANDLING
// event listener for calendar days
const calendar = document.querySelector(".calendar");
calendar.addEventListener("click", (event) => {
  if (
    event.target.tagName === "LI" &&
    event.target.parentElement.classList.contains("days")
  ) {
    // get clicked date
    const clickedDate = parseInt(event.target.textContent); 
    const currentDate = new Date(currYear, currMonth, clickedDate);
    const today = new Date(); 

    if (currentDate > today || event.target.classList.contains("inactive")) {
      return;
    }

    const formattedDay = currentDate.getDate().toString().padStart(2, "0");
    const formattedMonth = (currentDate.getMonth() + 1).toString().padStart(2, "0");
    const selectedDate = `${formattedDay}.${formattedMonth}.${currentDate.getFullYear()}`;

    console.log("Clicked date:", selectedDate);

    // Check if there's an entry for the clicked date
    const hasEntryForDate = hasEntry(monthData, currYear, currMonth + 1, clickedDate);
    console.log("Has entry for date:", hasEntryForDate);

    // Open the appropriate modal based on whether there's an entry for the clicked date
    if (hasEntryForDate) {
      showPastEntryPopup(selectedDate);
    } else {
      showNewEntryPopup(selectedDate);
    }
  }
});



// event listener for edit icon
const editIcon = document.querySelector(".editIcon");
editIcon.addEventListener("click", () => {
    // Extract the date information from the PastEntry modal
    const dateHeading = document.querySelector(".PopupPastEntry .EntryHeading");
    if (dateHeading) {
        const date = dateHeading.textContent;
        console.log("Date extracted:", date);
        // Call showEditEntryPopup with the extracted date
        showEditEntryPopup(date);
    } else {
        console.error("Date heading not found or empty.");
    }
});



// event listener for closePopup buttons
const closePopups = document.querySelectorAll(".closePopup");
closePopups.forEach((button) => {
  button.addEventListener("click", hideAllPopups);
});


// CREATE NEW ENTRY
const createEntry = document.querySelector('.submitNewEntry');
createEntry.addEventListener('click', async (evt) => {
  evt.preventDefault();
  console.log('Lets create a new diary entry');

  gatherNewData();
  hideAllPopups();
});

// EDIT AN ENTRY
const editEntry = document.querySelector('.submitEditEntry');
editEntry.addEventListener('click', async (evt) => {
  evt.preventDefault();
  console.log('Let\'s edit the diary entry');

  gatherEditData();
  hideAllPopups();
});