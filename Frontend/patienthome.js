import { renderCalendar } from "./rendercalendar";
import { fetchData } from "./fetch.js";

// Render calendar when page is loaded
window.addEventListener("load", () => {
  renderCalendar();
});

// Render calendar when previous or next buttons are clicked
const prevNextIcon = document.querySelectorAll(".calendarHeader span");

prevNextIcon.forEach((icon) => {
  // getting prev and next calendarHeader
  icon.addEventListener("click", () => {
    // adding click event on both calendarHeader
    // if clicked icon is previous icon then decrement current month by 1 else increment it by 1
    currMonth = icon.id === "prev" ? currMonth - 1 : currMonth + 1;

    if (currMonth < 0 || currMonth > 11) {
      // if current month is less than 0 or greater than 11
      // creating a new date of current year & month and pass it as date value
      date = new Date(currYear, currMonth, new Date().getDate());
      currYear = date.getFullYear(); // updating current year with new date year
      currMonth = date.getMonth(); // updating current month with new date month
    } else {
      date = new Date(); // pass the current date as date value
    }
    renderCalendar(); // calling renderCalendar function
  });
});
