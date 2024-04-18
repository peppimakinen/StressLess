import { fetchData } from "./fetch.js";
import { renderCalendar } from "./rendercalendar.js";

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

// POPUP HANDLING
const NewEntry = document.querySelector('.FormPopupNew');
const EditEntry = document.querySelector('.FormPopupEdit');