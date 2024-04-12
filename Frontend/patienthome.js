import { fetchData } from "./fetch.js";

function generateCalendar(year, month) {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
  
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);
  
    const calendarBody = document.getElementById("calendar-body");
    calendarBody.innerHTML = "";
  
    let currentDate = new Date(startDate);
  
    while (currentDate <= endDate) {
      const row = document.createElement("tr");
  
      for (let i = 0; i < 7; i++) {
        const cell = document.createElement("td");
        cell.textContent = currentDate.getDate();
  
        if (currentDate.getMonth() !== month) {
          cell.classList.add("other-month");
        } else {
          cell.addEventListener("click", function () {
            alert(`You clicked on ${currentDate.toLocaleDateString()}`);
          });
        }
  
        row.appendChild(cell);
        currentDate.setDate(currentDate.getDate() + 1);
      }
  
      calendarBody.appendChild(row);
    }
  }
  
  // Generate the current month's calendar by default
  const currentDate = new Date();
  generateCalendar(currentDate.getFullYear(), currentDate.getMonth());
  