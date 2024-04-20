import { fetchData } from "../assets/fetch.js";
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
// get required elements for displaying the modals
const NewEntry = document.querySelector(".FormPopupNew");
const PastEntry = document.querySelector(".PopupPastEntry");
const EditEntry = document.querySelector(".FormPopupEdit");
const calendarWrapper = document.querySelector(".calendarBackground");
const overlay = document.getElementById("overlay");

// selected date variable
let selectedDate = "";

// Add click event listeners to calendar days
const calendar = document.querySelector(".calendar");
calendar.addEventListener("click", (event) => {
  // Check if the clicked element is an li element inside the .days list
  if (
    event.target.tagName === "LI" &&
    event.target.parentElement.classList.contains("days")
  ) {
    const clickedDate = parseInt(event.target.textContent); // Get the clicked date
    const currentDate = new Date(currYear, currMonth, clickedDate);
    const today = new Date(); // Get current date

    // Check if clicked date is in the future
    if (currentDate > today || event.target.classList.contains("inactive")) {
      return; // Exit the event handler if clicked date is in the future
    }

    // Check if clicked date is today
    if (currentDate.toDateString() === today.toDateString()) {
      // Display FormPopupNew modal
      NewEntry.style.display = "block";
      // Hide the calendar
      calendarWrapper.style.display = "none";
      // Show the overlay
      overlay.style.display = "block";
    } else {
      // Display PopupPastEntry modal
      PastEntry.style.display = "block";
      // Hide the calendar
      calendarWrapper.style.display = "none";
      // Show the overlay
      overlay.style.display = "block";
    }

    // format date for the modal headings
    const formattedDay = currentDate.getDate().toString().padStart(2, "0");
    const formattedMonth = (currentDate.getMonth() + 1)
      .toString()
      .padStart(2, "0");
      selectedDate = `${formattedDay}.${formattedMonth}.${currentDate.getFullYear()}`;

    // update the date in the NewEntry modal
    document
      .querySelectorAll(".FormPopupNew .EntryHeading")
      .forEach((heading) => {
        heading.textContent = selectedDate;
      });

    // update the date in the PastEntry modal
    document
      .querySelectorAll(".PopupPastEntry .EntryHeading")
      .forEach((heading) => {
        heading.textContent = selectedDate;
      });
  }
});

// Add click event listener to edit icon in PopupPastEntry modal
const editIcon = document.querySelector(".editIcon");
editIcon.addEventListener("click", () => {
  // Display FormPopupEdit modal
  EditEntry.style.display = "block";

  // Hide pastentry
  PastEntry.style.display = "none"

  // Update the date in the FormPopupEdit modal
  document.querySelector(".FormPopupEdit .EntryHeading").textContent = selectedDate
});

// Add click event listener to the closePopup buttons
const closePopups = document.querySelectorAll(".closePopup");
closePopups.forEach((button) => {
  button.addEventListener("click", () => {
    // Hide the popup
    button.parentElement.style.display = "none";

    // Show the calendar
    calendarWrapper.style.display = "block";

    // Hide the overlay
    overlay.style.display = "none";
  });
});
