import {
  addWeekReport,
  getReportData,
  getLatestReportDateByUserId,
  getFirstEntryDateByUserId,
  getAvailableReportDates,
  getStressIndexByDates,
  getReport,
} from '../models/report-model.mjs';
import {customError} from '../middlewares/error-handler.mjs';

/* eslint-disable require-jsdoc */

/**
 * Get all available week reports. Check for updates if none are found
 * @async
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
const getAvailableWeeks = async (req, res, next) => {
  try {
    console.log('Entered getAvailableWeeks');
    const userId = req.user.user_id;
    // Get date object for current date
    const currentDate = getCurrentDate();
    // Get date object for the latest sunday
    const latestSunday = getLastSunday(currentDate);
    // Get the latest date object from weekly reports
    const latestReportDates = await getLatestReportDates(userId);
    // Check if user has no report
    if (!latestReportDates) {
      // Try to generate reports using existing entries
      await generateFirstReports(latestSunday, userId);
    // If reports are found
    } else {
      const latestReportEndDate = latestReportDates.end;
      // Check weeks between last report to latest sunday
      const weeksFromLastReport = getWeeksBetweenSundays(
        latestReportEndDate,
        latestSunday,
      );
      // Attempt to update weekly reports talbe if there are missing weeks
      if (Object.keys(weeksFromLastReport).length > 0) {
        await updateWeeklyReportsTable(weeksFromLastReport, userId);
      }
    }
    // Fetch report dates from database
    const result = await getAvailableReportDates(userId);
    // Check for error
    if (result.error) {
      throw customError(result.message, result.error);
    }
    return res.json(result);
  // Handle errors
  } catch (error) {
    next(customError(error.message, error.status));
  }
};

/**
 * Get a specific report using report ID from URL parameters
 * @async
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
const getSpecificReport = async (req, res, next) => {
  try {
    console.log('Entered getSpecificReport');
    const userId = req.user.user_id;
    const reportId = req.params.report_id;
    // Fetch report from database
    const result = await getReport(userId, reportId);
    // Check for errors
    if (result.error) {
      throw customError(result.message, result.error);
    }
    return res.json(result);
  // Handle errors
  } catch (error) {
    next(customError(error.message, error.status));
  }
};

/**
 * Check if there is a need to generate reports based on new entries
 * @async
 * @param {dict} allWeeks all weeks between two dates
 * @param {int} userId
 */
const updateWeeklyReportsTable = async (allWeeks, userId) => {
  // Remove all weeks that do not contain entry data
  const weeksWithData = await deleteWeeksWithoutData(allWeeks, userId);
  // Check if there is weeks left that contain data
  if (Object.keys(weeksWithData).length > 0) {
    // There is a need to generate new report for found weeks
    console.log('There is a need to update weekly reports table in db');
    await generateReportForEachWeek(weeksWithData, userId);
  }
  console.log('WeeklyReports is up to date');
};

/**
 * Generate weekly reports from first entry to latest sunday
 * @async
 * @param {dateObj} latestSunday
 * @param {int} userId
 */
const generateFirstReports = async (latestSunday, userId) => {
  console.log('Weekly reports table is empty, trying to generate reports...');
  // Fetch date for the first entry
  const firstEntryDate = await getFirstEntryDate(userId);
  // Revert to previous sunday
  const firstSunday = revertDateTimeToPreviousSunday(firstEntryDate);
  // Gather all weeks between first sunday and latest sunday
  const weeksFromFirstEntry = getWeeksBetweenSundays(firstSunday, latestSunday);
  // Remove all weeks that do not contain data
  const weeksWithData = await deleteWeeksWithoutData(
    weeksFromFirstEntry,
    userId,
  );
  // console.log('All weeks from first entry:', weeksFromFirstEntry);
  // console.log('All weeks from first entry containing data', weeksWithData);
  // Generate a report for all weeks that contain data
  const result = await generateReportForEachWeek(weeksWithData, userId);
  // Handle errors
  if (result) {
    return result;
  } else {
    throw customError('Could not initialize WeeklyReports table', 500);
  }
};

/**
 * Generate weekly report for each week the parameter list contains
 * @async
 * @param {dict} weeks
 * @param {int} userId
 * @return {dict} All the weeks with data
 */
const generateReportForEachWeek = async (weeks, userId) => {
  // Iterate over every week
  for (const week in weeks) {
    if (Object.prototype.hasOwnProperty.call(weeks, week)) {
      // Get date objects for the week
      const weekStartObj = weeks[week].week_start_date;
      const weekEndObj = weeks[week].week_end_date;
      const weekStartStr = convertDateObjToStr(weekStartObj);
      const weekEndStr = convertDateObjToStr(weekEndObj);
      // Parse week number from dict key
      const weekNumber = parseInt(week.replace('week_', ''));
      // Get the entry data for the week
      const entryData = weeks[week].data;
      // Gather all data for the report
      const weeklyParams = await getReportParams(
        weekStartStr,
        weekEndStr,
        weekNumber,
        userId,
        entryData,
      );
      // Check for errors
      if (weeklyParams) {
        // Insert new report to database
        await insertWeekReport(weeklyParams);
      }
    }
  }
  return weeks;
};

/**
 * Gather and calculate all weekly report data for one specific week
 * @async
 * @param {dateObj} monday
 * @param {dateObj} sunday
 * @param {int} weekNum
 * @param {int} userId
 * @param {list} entries Contains entry data for each found date inside the week
 * @return {list} All the needed data for the report in a params list
 */
const getReportParams = async (monday, sunday, weekNum, userId, entries) => {
  console.log(`Collecting params between ${monday} and ${sunday}`);
  // Initialize params list with function parameters
  const params = [userId, weekNum, monday, sunday];
  // Calculate percentages for circle diagramme
  const colors = calculateMoodColorPercentages(entries);
  // Append percentages to params
  params.push(colors.red);
  params.push(colors.green);
  params.push(colors.yellow);
  params.push(colors.gray);
  // Get a list where list indices represent weekday stress index
  const stressIndicises = getDailyStressIndexFromEntries(
    monday,
    sunday,
    entries,
  );
  // Append every weekday list item to params
  for (const dailyIndex of stressIndicises) {
    params.push(dailyIndex);
  }
  // Calculate stress index average
  params.push(calculateListAverage(stressIndicises));
  // Fetch previous week report for last stress index
  const previousAvg = await fetchPreviousWeekStressAvg(sunday, userId);
  // Append result to params
  params.push(previousAvg);
  // return params
  return params;
};

/**
 * Gather and calculate all weekly report data for one specific week
 * @param {dateObj} dateObj yyyy-mm-ddT00:00:00:000Z
 * @return {dateObj} Return a object that is the last or current sunday
 */
const revertDateTimeToPreviousSunday = (dateObj) => {
  // Check that provided parameter is a valid Date object
  if (dateObj instanceof Date && !isNaN(dateObj.getTime())) {
    // Calculate how many days to subtract to reach previous Sunday
    const daysToPreviousSunday = dateObj.getUTCDay();
    // Subtract the days to get previous Sunday
    dateObj.setUTCDate(dateObj.getUTCDate() - daysToPreviousSunday);
    // Verify the result with isSunday function
    isSunday(dateObj);
    return dateObj;
  }
  // Throw error because parameter was not a Date object
  throw customError('Invalid param for revertToPreviousSunday', 500);
};

/**
 * Delete all weeks that do not contain necessary data for new report
 * @async
 * @param {dict} weeks Contains weeks with data and dates
 * @param {int} userId
 * @return {dict} Modified dict that has only the weeks that had data
 */
const deleteWeeksWithoutData = async (weeks, userId) => {
  console.log('Iterating over every found week and checking if entries found');
  // Iterate over every week
  for (const week in weeks) {
    if (Object.prototype.hasOwnProperty.call(weeks, week)) {
      // Get date objects
      const weekStartObj = weeks[week].week_start_date;
      const weekEndObj = weeks[week].week_end_date;
      const weekStartStr = convertDateObjToStr(weekStartObj);
      const weekEndStr = convertDateObjToStr(weekEndObj);
      // fetch all data that is needed to generate the report
      const data = await getReportData(userId, weekStartStr, weekEndStr);
      // Check for error
      if (data.error) {
        throw customError(data.message, data.error);
      }
      // Check if entry was found
      if (data.length === 0) {
        // Delete from weeks dict if no data was found
        delete weeks[week];
      } else {
        // Append data to week, it its found
        weeks[week]['data'] = data;
      }
    }
  }
  // Return all weeks that contain the necessary data for the report
  console.log('All weeks have been checked, data found in:', weeks);
  return weeks;
};

/**
 * Convert Date object yyyy-mm-ddT00:00:00.000Z --> yyyy-mm-dd
 * @param {dateObj} dateObj
 * @return {string} The same date but in string format 
 */
function convertDateObjToStr(dateObj) {
  return dateObj.toISOString().slice(0, 10);
}

/**
 * Change date object time to second before midnight
 * @param {dateObj} dateObj
 * @return {string} The same date object but with time 23:59:59
 */
function setDateTimeToLastMinute(dateObj) {
  dateObj.setUTCHours(23);
  dateObj.setUTCMinutes(59);
  dateObj.setUTCSeconds(59);
  return dateObj;
}

/**
 * Change date object time to just past midnight
 * @param {dateObj} dateObj
 * @return {string} The same date object but with time 00:00:00
 */
function setDateTimeToFirstMinute(dateObj) {
  dateObj.setUTCHours(0);
  dateObj.setUTCMinutes(0);
  dateObj.setUTCSeconds(0);
  return dateObj;
}

/**
 * Check if provided date object is a sunday (Sunday = 0, monday = 1....)
 * @param {dateObj} dateObj
 * @return {boolean}
 */
function isSunday(dateObj) {
  // Check that provided parameter is a valid Date object
  if (dateObj instanceof Date && !isNaN(dateObj.getTime())) {
    // Check if date object is a sunday
    if (dateObj.getUTCDay() === 0) {
      // return true if it is sunday
      return true;
    // Throw a error
    } else {
      throw customError('Provided isSunday object is not a sunday', 500);
    }
  }
  // Throw error because parameter was not a Date object
  throw customError('Parameter for isSunday is not a date object', 500);
}

/**
 * Get all weeks with week number, start and end -dates between given parameters
 * @param {dateObj} startDateObj
 * @param {dateObj} endDateObj
 * @return {dict} {week_x: {week_start_date: dateObj, week_end_date: dateObj}}
 */
function getWeeksBetweenSundays(startDateObj, endDateObj) {
  // Make sure given parameters are valid Date objects for Sunday
  isSunday(startDateObj);
  isSunday(endDateObj);
  // Create an object to store the weeks
  const weeks = {};
  // Iterate from the start date to the end date, one week at a time
  for (
    let date = new Date(startDateObj);
    date < endDateObj;
    date.setUTCDate(date.getUTCDate() + 7)
  ) {
    // Get the week number
    const weekNo = getWeekNumber(date);
    const key = 'week_' + weekNo;
    // Get the first date of the week
    const firstDateOfWeek = new Date(date);
    firstDateOfWeek.setUTCDate(
      firstDateOfWeek.getUTCDate() - firstDateOfWeek.getUTCDay() + 1,
    );
    // Get the last date of the week
    const lastDateOfWeek = new Date(firstDateOfWeek);
    lastDateOfWeek.setUTCDate(lastDateOfWeek.getUTCDate() + 6);
    // Set times for dates to prevent problems with daylight savings / timezones
    const lastDateTime = setDateTimeToLastMinute(lastDateOfWeek);
    const firstDateTime = setDateTimeToFirstMinute(firstDateOfWeek);
    // Save the first and last date of the week as the value for weeks[key]
    weeks[key] = {
      week_start_date: firstDateTime,
      week_end_date: lastDateTime,
    };
  }
  // Return all weeks
  return weeks;
};

/**
 * Get first entry date as a date object
 * @async
 * @param {int} userId
 * @return {dateObj}
 */
const getFirstEntryDate = async (userId) => {
  // Fetch latest report
  const latestEntry = await getFirstEntryDateByUserId(userId);
  if (latestEntry.error) {
    throw customError(latestEntry.message, latestEntry.error);
  }
  // Convert to date object and set time
  const latestEntryObj = convertToDateObj(latestEntry.entry_date);
  const latestEntryTimeDateObj = setDateTimeToLastMinute(latestEntryObj);
  // Return found first entry date as a date object
  return latestEntryTimeDateObj;
};

/**
 * Get start/end date objects for the latest report
 * @async
 * @param {int} userId
 * @return {dict}
 */
const getLatestReportDates = async (userId) => {
  // Fetch latest report using user ID
  const latestReport = await getLatestReportDateByUserId(userId);
  // Check if no reports was found
  if (latestReport.length === 0) {
    // Return false
    return false;
  }
  // Grab date str and convert it to a date object
  const reportEndDate = latestReport[0].week_end_date;
  const endDate = setDateTimeToLastMinute(convertToDateObj(reportEndDate));
  const reportStartDate = latestReport[0].week_start_date;
  const startDate = setDateTimeToLastMinute(convertToDateObj(reportStartDate));
  // Return dates
  return {start: startDate, end: endDate};
};

/**
 * Convert a date in yyyy-mm-dd format to a date object
 * @param {string} dateStr
 * @return {dateObj}
 */
const convertToDateObj = (dateStr) => {
  // Create a Date object from the date string
  const dateObj = new Date(dateStr);
  return dateObj;
};

/**
 * Using current date get the last sunday as date object
 * @param {dateObj} date
 * @return {dateObj}
 */
const getLastSunday = (date) => {
  const currentDate = new Date(date);
  const dayOfWeek = currentDate.getUTCDay();
  const diff = currentDate.getUTCDate() - dayOfWeek;
  const lastSunday = new Date(
    Date.UTC(currentDate.getUTCFullYear(), currentDate.getUTCMonth(), diff),
  );
  const lastSundayWithTime = setDateTimeToLastMinute(lastSunday);
  if (isSunday(lastSundayWithTime)) {
    return lastSundayWithTime;
  }
};

/**
 * Get current date object in Finnish summer time
 * @return {dateObj}
 */
const getCurrentDate = () => {
  const currentDate = new Date();
  // Convert to UTC
  const utcDate = new Date(
    Date.UTC(
      currentDate.getUTCFullYear(),
      currentDate.getUTCMonth(),
      currentDate.getUTCDate(),
      currentDate.getUTCHours(),
      currentDate.getUTCMinutes(),
      currentDate.getUTCSeconds(),
    ),
  );
  // Adjust for Finnish timezone (UTC+3 for daylight saving)
  utcDate.setUTCHours(utcDate.getUTCHours() + 3);
  return utcDate;
};

/**
 * Insert a new weekly report to the database
 * @async
 * @param {list} params All report data in a list
 * @return {object} result
 */
const insertWeekReport = async (params) => {
  console.log('Inserting a new report to the db');
  const result = addWeekReport(params);
  if (result.error) {
    throw customError(result.message, result.error);
  }
  return result;
};

/**
 * Search for stress index average from previous week report
 * @async
 * @param {dateObj} sunday
 * @param {int} userId
 * @return {object} result
 */
const fetchPreviousWeekStressAvg = async (sunday, userId) => {
  const previousSunday = goSevenDaysBackwards(sunday);
  // Fetch stress index from previous week report
  const result = await getStressIndexByDates(previousSunday, userId);
  // Check for errors
  if (result.error) {
    throw customError(result.message, result.error);
  }
  // Check for response lenght
  if (result.length === 0) {
    return null;
  } else {
    const previousWeekSiAvg = result[0]['week_si_avg'];
    return previousWeekSiAvg;
  }
};

/**
 * Calculate list average
 * @param {list} list
 * @return {float} result
 */
function calculateListAverage(list) {
  // Avoid dividing with zero
  if (list.length === 0) {
    return 0;
  }
  let sum = 0;
  // Iterate over every list item and sum them up
  for (const item of list) {
    if (isNaN(item)) {
      throw customError('Invalid values in calculateListAverage', 500);
    }
    sum += item;
  }
  // return calculated average in .2 accuracy
  return parseFloat((sum / list.length).toFixed(2));
}

/**
 * Get date string seven days prior
 * @param {string} dateStr
 * @return {string} result
 */
function goSevenDaysBackwards(dateStr) {
  const date = new Date(dateStr);
  date.setUTCDate(date.getUTCDate() - 7);
  const formattedDate = date.toISOString().slice(0, 10);
  return formattedDate;
}

/**
 * Match weekly stress index values to weekdays in a 7-item list
 * @param {dateObj} startDate
 * @param {dateObj} endDate
 * @param {list} entries
 * @return {list}
 */
function getDailyStressIndexFromEntries(startDate, endDate, entries) {
  const monday = new Date(startDate);
  const sunday = new Date(endDate);
  const indeciesList = [];
  // Iterate from monday to sunday
  for (
    let BetweenDate = new Date(monday);
    BetweenDate <= sunday;
    BetweenDate.setUTCDate(BetweenDate.getUTCDate() + 1)
  ) {
    // Format date to yyyy-mm-dd
    const formattedBetweenDate = BetweenDate.toISOString().slice(0, 10);
    // Attempt to find a match for current iterated date and entry date
    const entryThatHasSameDate = entries.find(
      (entry) => entry.entry_date === formattedBetweenDate,
    );
    // Check if matching dates were found
    if (entryThatHasSameDate) {
      // Parse stress index float from found entry
      const stressIndex = parseFloat(entryThatHasSameDate.stress_index);
      // Append stress index to list
      indeciesList.push(stressIndex);
    // If no match was found
    } else {
      // Append a zero where stress index was not found
      indeciesList.push(0);
    }
  }
  // return indices list
  return indeciesList;
}

/**
 * Calculate percentages for each appearing value from entries
 * @param {list} entries
 * @return {dict} calculated percentages for each color
 */
function calculateMoodColorPercentages(entries) {
  // Initialize dict for appearances
  const colors = {red: 0, green: 0, yellow: 0};
  // Initialize dict for percentages
  const pieChartPercentages = {};
  // Iterate over every entry
  entries.forEach((entry) => {
    // Isolate moodColor from entry data
    const moodColor = entry.mood_color;
    // Check if entry containes red hex value
    if (moodColor === 'FF8585') {
      colors.red += 1;
    // Check if entry containes green hex value
    } else if (moodColor === '9BCF53') {
      colors.green += 1;
    // Check if entry containes yellow hex value
    } else if (moodColor === 'FFF67E') {
      colors.yellow += 1;
    }
  });
  // Fill the missing days with gray
  colors['gray'] = 7 - entries.length;
  // Iterate over every found color
  for (const color in colors) {
    if (colors.hasOwnProperty(color)) {
      // Calculate percentage for each color
      pieChartPercentages[color] = parseFloat(
        ((colors[color] / 7) * 100).toFixed(2),
      );
    }
  }
  // return calculated percentages for each color
  return pieChartPercentages;
}

// https://bito.ai/resources/javascript-get-week-number-javascript-explained/
// Function to get the week number
function getWeekNumber(day) {
  // Copy date so don't modify original
  day = new Date(Date.UTC(day.getFullYear(), day.getMonth(), day.getDate()));
  // Set to nearest Thursday: current date + 4 - current day number
  // Make Sunday's day number 7
  day.setUTCDate(day.getUTCDate() + 4 - (day.getUTCDay() || 7));
  // Get first day of year
  const yearStart = new Date(Date.UTC(day.getUTCFullYear(), 0, 1));
  // Calculate full weeks to nearest Thursday
  const weekNo = Math.ceil(((day - yearStart) / 86400000 + 1) / 7);
  return weekNo;
}
export {getAvailableWeeks, getSpecificReport};
