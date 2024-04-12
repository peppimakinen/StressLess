import {getFirstEntryDate, getReportData} from '../models/report-model.mjs';
import {customError} from '../middlewares/error-handler.mjs';

/* eslint-disable require-jsdoc */
const getAvailableWeeks = async (req, res, next) => {
  try {
    console.log('Entered getAvailableWeeks');
    const {user_id: userId} = req.user;
    const firstEntry = await getFirstEntryDate(userId);
    const firstEntryDate = firstEntry.entry_date;
    const availableWeeks = getPastWeeksFromDate(firstEntryDate);
    return res.json(availableWeeks);
  } catch (error) {
    console.log('getAvailableWeeks catch block');
    next(customError(error.message, error.error));
  }
};

const getWeeklyReport = async (req, res, next) => {
  console.log('Entered getWeeklyReport');
  const userId = req.user.user_id;
  const {week_start_date: startDate, week_end_date: endDate} = req.body;
  const reportData = await getReportData(userId, startDate, endDate);
  // Check for errors in result
  if (reportData.error) {
    next(customError(reportData.message, reportData.error, reportData.errors));
  }
  console.log('Entries found within the provided dates');
  const colorPercentages = calculateMoodColorPercentages(reportData);
  console.log(colorPercentages)
  const stressIndecises = seperateStressIndexFromEntries(reportData);
};

function seperateStressIndexFromEntries(entries) {
  console.log(entries);
  for (const entry of entries) {
    console.log(entry.stress_index);
  }
}

function calculateMoodColorPercentages(entries) {
  const colors = {};
  const pieChartPercentages = {};
  // Iterate over every entry
  entries.forEach((entry) => {
    // Isolate moodColor from entry data
    const moodColor = entry.mood_color;
    // If color exists add 1 to its sum. Otherwise add a new color
    colors[moodColor] = (colors[moodColor] || 0) + 1;
  });
  // Missing days are represented in gray color
  const missingDayCount = 7 - entries.length;
  // Hex value is used as key
  colors['D9D9D9'] = missingDayCount;
  console.log('All colors for the week', colors);
  // Iterate over every found color
  for (const color in colors) {
    if (colors.hasOwnProperty(color)) {
      // Calculate percentage for each color
      pieChartPercentages[color] = parseFloat(
        ((colors[color] / 7) * 100).toFixed(2),
      );
    }
  }
  return pieChartPercentages;
}

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
export {getAvailableWeeks, getWeeklyReport};
