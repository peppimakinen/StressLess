import {customError} from '../middlewares/error-handler.mjs';
import {
  getFirstEntryDateByUserId,
  getAvailableReportDates,
  getStressIndexByDates,
  addWeekReport,
  getReportData,
  getReport,
} from '../models/report-model.mjs';

/**
 * Get all available week reports. Check for updates if none are found
 * @async
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
const getAvailableWeeks = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    // Fetch existing report dates from database
    const reports = await getAvailableReportDates(userId);
    // Check for db error
    if (reports.error === 500) {
      throw customError(reports.message, reports.error);
    }
    // Get weeks between last sunday and first entry
    const missingWeeks = await findMissingWeeks(userId, reports);
    // Check if there is any new data for these weeks
    const weeksWithData = await deleteWeeksWithoutData(missingWeeks, userId);
    // Check if there is atleast 1 week with new data
    if (Object.keys(weeksWithData).length > 0) {
      // Generate new report for each week with data
      await generateReportForEachWeek(weeksWithData, userId);
    }
    // Get all report dates
    const upToDateList = await getAvailableReportDates(userId);
    // Check for error
    if (upToDateList.error) {
      throw customError(upToDateList.message, upToDateList.error);
    }
    // Sort the list from smallest week number to highest
    const sortedReports = sortByWeekNumber(upToDateList);
    // Return ok result
    return res.json(sortedReports);
  // Handle errors
  } catch (error) {
    console.log('getAvailableWeeks catch error');
    next(customError(error.message, error.status));
  }
};

/**
 * Get a specific report using report ID from URL parameters
 * @async
 * @param {Int} userId
 * @param {List} reportWeeks Weeks with reports in a list or error object
 * @throws customError
 * @return {List} Weeks that do not have a report in them
 */
const findMissingWeeks = async (userId, reportWeeks) => {
  // Get laitest sunday
  const latestSunday = getLastSunday(getCurrentDate());
  // Fetch date for the first entry
  const firstEntryDate = await getFirstEntryDate(userId);
  // Revert to previous sunday
  const firstSunday = revertDateTimeToPreviousSunday(firstEntryDate);
  // Get all weeks between first sunday and latest sunday
  const weeksFromStart = getWeeksBetweenSundays(firstSunday, latestSunday);
  // console.log('first entry to last sunday weeks:', weeksFromStart);
  // Check if there is atleast one week with a report
  if (reportWeeks.length > 0) {
    // Iterate over weeks with reports if true
    for (const week of reportWeeks) {
      // Create a search key
      const searchKey = 'week_' + week.week_number;
      // Delete week with a existing report from weeks to be checked
      if (weeksFromStart.hasOwnProperty(searchKey)) {
        delete weeksFromStart[searchKey];
      }
    }
  }
  // console.log('All weeks containing reports:', reportWeeks);
  // console.log('Weeks that do not have reports:', weeksFromStart);
  console.log('Missing weeks have been searched');
  return weeksFromStart;
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
 * Get all available week reports for specific patient ID
 * @async
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
const getAvailablePatientReports = async (req, res, next) => {
  const patientId = req.params.patient_id;
  // Fetch report dates from database
  const result = await getAvailableReportDates(patientId);
  // Check for error
  if (result.error) {
    // Check if it was a not found error
    if (result.error === 404) {
      // Replace user ID with patient ID in error msg to avoid confusion.
      result.message = `No reports found for patient_id=${patientId}.`;
    };
    return next(customError(result.message, result.error));
  };
  // Return ok result, if no errors occurred
  return res.json(result);
};

/**
 * Handle GET requests to get own patients report using patient ID and report ID
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
const getPatientsReport = async (req, res, next) => {
  try {
    const patientId = req.params.patient_id;
    const patientReportId = req.params.report_id;
    // Fetch the report
    const result = await getReport(patientId, patientReportId);
    // Check for errors
    if (result.error) {
      // Check if it was a not found error
      if (result.error === 404) {
        // Reword the error msg to avoid confusion
        // eslint-disable-next-line max-len
        result.message = `There is no report_id=${patientReportId} for patient_id=${patientId}`;
      }
      throw customError(result.message, result.error);
    }
    // Return the found report
    return res.json(result);
  } catch (error) {
    console.log('getPatientsReport', error);
    next(customError(error.message, error.status));
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
 * Delete all weeks that do not contain necessary data for new report
 * @async
 * @param {dict} weeks Contains weeks with data and dates
 * @param {int} userId
 * @return {dict} Modified dict that has only the weeks that had data
 */
const deleteWeeksWithoutData = async (weeks, userId) => {
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
      // Check if week contains entries
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
  console.log('All empty weeks have been deleted, data found in:', weeks);
  return weeks;
};


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
}

/**
 * Insert a new weekly report to the database
 * @async
 * @param {list} params All report data in a list
 * @return {object} result
 */
const insertWeekReport = async (params) => {
  // Insert report to db
  const result = addWeekReport(params);
  // Check for errors
  if (result.error) {
    throw customError(result.message, result.error);
  }
  console.log('New report inserted to db');
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
 * Sort a list of report dates based on week number
 * @param {List} reports All report dates
 * @return {List} Sorted list
 */
function sortByWeekNumber(reports) {
  return reports.sort((a, b) => a.week_number - b.week_number);
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

/**
 * Get week number from date
 * @source https://bito.ai/resources/javascript-get-week-number-javascript-explained/
 * @param {Date} day
 * @return {Int} Week number
 */
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

export {
  getAvailablePatientReports,
  convertDateObjToStr,
  getAvailableWeeks,
  getPatientsReport,
  getSpecificReport,
  getCurrentDate,
};
