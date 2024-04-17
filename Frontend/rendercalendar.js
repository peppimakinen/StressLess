const daysTag = document.querySelector(".days"),
  currentDate = document.querySelector(".currentDate");
  
// get new date, current year and month
let date = new Date(),
  currYear = date.getFullYear(),
  currMonth = date.getMonth();

// store full name of all months in array
const months = [
  "Tammikuu",
  "Helmikuu",
  "Maaliskuu",
  "Huhtikuu",
  "Toukokuu",
  "Kesäkuu",
  "Heinäkuu",
  "Elokuu",
  "Syyskuu",
  "Lokakuu",
  "Marraskuu",
  "Joulukuu",
];

const renderCalendar = () => {
    let firstDayofMonth = new Date(currYear, currMonth, 1).getDay(), // getting first day of month
      lastDateofMonth = new Date(currYear, currMonth + 1, 0).getDate(), // getting last date of month
      lastDayofMonth = new Date(currYear, currMonth, lastDateofMonth).getDay(), // getting last day of month
      lastDateofLastMonth = new Date(currYear, currMonth, 0).getDate(); // getting last date of previous month
    let liTag = "";
  
    // Adjust first day of the week to start from Monday
    if (firstDayofMonth === 0) {
      firstDayofMonth = 7;
    }
  
    // Calculate number of cells needed to display
    const totalCells = 42; // 7 days * 6 weeks
  
    for (let i = firstDayofMonth - 1; i > 0; i--) {
      // create li of previous month last days
      liTag += `<li class="inactive">${lastDateofLastMonth - i + 1}</li>`;
    }
  
    for (let i = 1; i <= lastDateofMonth; i++) {
      // create li of all days of current month
      // add active class to li if the current day, month, and year matched
      let isToday =
        i === date.getDate() &&
        currMonth === new Date().getMonth() &&
        currYear === new Date().getFullYear()
          ? "active"
          : "";
      liTag += `<li class="${isToday}">${i}</li>`;
    }
  
    // Calculate the remaining cells after the current month's days
    const remainingCells = totalCells - (firstDayofMonth + lastDateofMonth - 1);
  
    for (let i = 1; i <= remainingCells; i++) {
      // create li of next month first days
      liTag += `<li class="inactive">${i}</li>`;
    }
  
    currentDate.innerText = `${months[currMonth]} ${currYear}`; // pass current mon and yr as currentDate text
    daysTag.innerHTML = liTag;
  };
  
renderCalendar();

export {renderCalendar}


