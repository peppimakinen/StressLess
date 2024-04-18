const renderCalendar = (currYear, currMonth) => {
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
    liTag += `<li class="${isToday}">${i}</li>`;
  }

  const remainingCells = totalCells - (firstDayofMonth + lastDateofMonth - 1);

  for (let i = 1; i <= remainingCells; i++) {
    liTag += `<li class="inactive">${i}</li>`;
  }

  currentDate.innerText = `${months[currMonth]} ${currYear}`;
  daysTag.innerHTML = liTag;
};

export { renderCalendar };
