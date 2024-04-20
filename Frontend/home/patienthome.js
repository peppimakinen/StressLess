import { fetchData } from "../assets/fetch.js";
import { renderCalendar } from "./calendar.js";
import { gatherNewEntryData } from "./newentry.js";
import { showNewEntryPopup, showPastEntryPopup, showEditEntryPopup, hideAllPopups } from "./popups.js";

// RENDERING CALENDAR
// get new date, current year and month
let date = new Date(),
  currYear = date.getFullYear(),
  currMonth = date.getMonth();

// store full name of all months in array
const prevNextIcon = document.querySelectorAll(".calendarHeader span");

// function to render calendar when page is loaded
const initializeCalendar = () => {
  renderCalendar(currYear, currMonth);
};

// function to update calendar when previous or next buttons are clicked
const updateCalendar = (icon) => {
  currMonth = icon.id === "prev" ? currMonth - 1 : currMonth + 1;

  if (currMonth < 0 || currMonth > 11) {
    date = new Date(currYear, currMonth, new Date().getDate());
    currYear = date.getFullYear();
    currMonth = date.getMonth();
  } else {
    date = new Date();
  }
  renderCalendar(currYear, currMonth);
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
    //get current date
    const today = new Date(); 

    if (currentDate > today || event.target.classList.contains("inactive")) {
      return;
    }

    const formattedDay = currentDate.getDate().toString().padStart(2, "0");
    const formattedMonth = (currentDate.getMonth() + 1).toString().padStart(2, "0");
    const selectedDate = `${formattedDay}.${formattedMonth}.${currentDate.getFullYear()}`;

    if (currentDate.toDateString() === today.toDateString()) {
      showNewEntryPopup(selectedDate);
    } else {
      showPastEntryPopup(selectedDate);
    }
  }
});

// event listener for edit icon
const editIcon = document.querySelector(".editIcon");
editIcon.addEventListener("click", showEditEntryPopup);

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

  gatherNewEntryData();
});