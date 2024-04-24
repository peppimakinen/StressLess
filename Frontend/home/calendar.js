// calendar.js

const renderCalendar = (currYear, currMonth, monthData = {}) => {
  const daysTag = document.querySelector(".days"),
    currentDate = document.querySelector(".currentDate");
  let date = new Date();

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

  let firstDayofMonth = new Date(currYear, currMonth, 1).getDay(),
    lastDateofMonth = new Date(currYear, currMonth + 1, 0).getDate(),
    lastDateofLastMonth = new Date(currYear, currMonth, 0).getDate();
  let liTag = "";

  if (firstDayofMonth === 0) {
    firstDayofMonth = 7;
  }

  const totalCells = 42;

  for (let i = firstDayofMonth - 1; i > 0; i--) {
    liTag += `<li class="inactive">${lastDateofLastMonth - i + 1}</li>`;
  }

  for (let i = 1; i <= lastDateofMonth; i++) {
    let isToday =
      i === date.getDate() &&
      currMonth === new Date().getMonth() &&
      currYear === new Date().getFullYear()
        ? "active"
        : "";

    // Check if mood data exists for this date
    const currentDateKey = `${currYear}-${(currMonth + 1).toString().padStart(2, "0")}-${i.toString().padStart(2, "0")}`;
    const moodColor = monthData[currentDateKey] ? monthData[currentDateKey].mood_color : null;

    // Set the background color based on mood data
    let bgColor = '';
    if (moodColor) {
      bgColor = `background-color: #${moodColor};`;
    } else if (new Date(currYear, currMonth, i) < new Date(date.getFullYear(), date.getMonth(), date.getDate())) {
      bgColor = 'background-color: #D9D9D9;';
    }

    liTag += `<li class="${isToday}" style="${bgColor}">${i}</li>`;
  }

  const remainingCells = totalCells - (firstDayofMonth + lastDateofMonth - 1);

  for (let i = 1; i <= remainingCells; i++) {
    liTag += `<li class="inactive">${i}</li>`;
  }

  currentDate.innerText = `${months[currMonth]} ${currYear}`;
  daysTag.innerHTML = liTag;
};

export { renderCalendar };
