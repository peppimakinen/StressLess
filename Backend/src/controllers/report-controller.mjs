/* eslint-disable require-jsdoc */
const getAvailableWeeks = async (req, res, next) => {
  console.log('Entered getAvailableWeeks');
  console.log(getPastWeeksFromDate('2024-02-01'));
};

function getPastWeeksFromDate(startDate) {
  // Date object for first date in db
  const firstDate = new Date(startDate);
  // Date object for the current date
  const currentDate = new Date();
  // Create the weeks object
  const pastWeeks = {};

  // Iterate from the first date to the current date
  for (
    let date = new Date(firstDate);
    date <= currentDate;
    date.setUTCDate(date.getDate() + 7)
  ) {
    const weekNo = getWeekNumber(date);
    const key = 'week_' + weekNo;

    // Get the first and last date of the week
    const firstDateOfWeek = new Date(date);
    firstDateOfWeek.setDate(
      firstDateOfWeek.getDate() - firstDateOfWeek.getDay() + 1,
    );
    const lastDateOfWeek = new Date(firstDateOfWeek);
    lastDateOfWeek.setDate(lastDateOfWeek.getDate() + 6);

    // Format the ISO dates to 'yyyy-mm-dd'
    const formattedFirstDateOfWeek = firstDateOfWeek.toISOString().slice(0, 10);
    const formattedLastDateOfWeek = lastDateOfWeek.toISOString().slice(0, 10);

    // Save the first and last date of the week as the value for pastWeeks[key]
    pastWeeks[key] = {
      week_start: formattedFirstDateOfWeek,
      week_end: formattedLastDateOfWeek,
    };
  }

  return pastWeeks;
}

// Function to get the week number
function getWeekNumber(day) {
  day = new Date(Date.UTC(day.getFullYear(), day.getMonth(), day.getDate()));
  day.setUTCDate(day.getUTCDate() + 4 - (day.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(day.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((day - yearStart) / 86400000 + 1) / 7);
  return weekNo;
}
export {getAvailableWeeks};
