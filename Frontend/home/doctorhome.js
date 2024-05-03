import { renderCalendar } from "./calendar.js";
import { getPatientMonth } from "./getdata.js";
import { hasEntry } from "./checkdata.js";
import { showPastEntryPopup, showSurveyPopup, hideAllPopups } from "./doctormodals.js";
import { showSnackbar } from "../snackbar.js";

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
  monthData = await getPatientMonth(currYear, currMonth + 1);
  console.log(monthData);
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
  // Fetch fresh month data for the updated month
  const monthData = await getPatientMonth(currYear, currMonth + 1);
  console.log(monthData)

  // Update the calendar with the new month data
  renderCalendar(currYear, currMonth, monthData);
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
calendar.addEventListener("click", async (event) => {
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
    const selectedDate = `${currentDate.getFullYear()}-${formattedMonth}-${formattedDay}`;

    console.log("Clicked date:", selectedDate);

    // Check if there's an entry for the clicked date
    const monthData = await getPatientMonth(currYear, currMonth + 1);
    const hasEntryForDate = hasEntry(monthData, selectedDate);
    console.log("Has entry for date:", hasEntryForDate);

    // Open the appropriate modal based on whether there's an entry for the clicked date
    if (hasEntryForDate) {
      showPastEntryPopup(monthData, selectedDate);
    } else {
      showSnackbar("Red","Ei tehtyä merkintää");
    }
  }
});

// event listener for survey modal
const surveyBtn = document.querySelector('.surveyBtn');
surveyBtn.addEventListener('click', () => {
  showSurveyPopup();
});

// event listener for closePopup buttons
const closePopups = document.querySelectorAll(".closePopup");
closePopups.forEach((button) => {
  button.addEventListener("click", hideAllPopups);
});

//username
const username = localStorage.getItem('full_name');
console.log(username)
const show_name = document.querySelector("#username")
show_name.textContent= username;
