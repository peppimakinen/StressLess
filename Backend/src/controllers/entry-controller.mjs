/* eslint-disable camelcase */
import {
  addEntry,
  addMeasurement,
  getActivitiesForEntry,
  getMeasurementsForPatient,
  getEntryUsingDate,
  addAllActivities,
  getMonthlyPatientEntries,
  connectMeasurementToEntry,
} from '../models/entry-models.mjs';
import {customError, checkActivities} from '../middlewares/error-handler.mjs';
import {retrieveDataForDate} from '../controllers/kubios-controller.mjs';

/**
 * Handle GET request to get all diary entries from a specific month
 * @async
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @return {res} All found entries, measurements and activities that month
 */
const getMonth = async (req, res, next) => {
  try {
    console.log('Entered getMonth');
    const {month, year} = req.query;
    const userId = req.user.user_id;
    // Fetch all entries and measurements that took place in during chosen month
    const entries = await gatherMonthlyPatientEntries(month, year, userId);
    // Add completed activities to the found entries
    const completeEntries = await attachCompletedActivitiesToEntries(entries);
    // Add empty dicts for days that didnt have a entry
    const wholeMonth = populateMissingDaysInMonth(completeEntries, month, year);
    // Return all found data
    return res.json(wholeMonth);
  } catch (error) {
    console.log('getMonth catch block', error);
    next(customError(error.message, error.status));
  }
};

/**
 * Get all entry data for a specific date
 * @async
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @return {res} Found entry, measurements and activities that day
 */
const getDay = async (req, res, next) => {
  try {
    console.log(req);
    const userId = req.user.user_id;
    const entryDate = req.params.entry_date;
    // Fetch data from DiaryEntries table for a specific date
    const entry = await gatherEntryDataUsingDate(userId, entryDate);
    // Get entry ID from result
    const entryId = entry.entry_id;
    // Fetch Measurement data for that entry ID
    const hrvData = await gatherPatientMeasurementData(
      entryId,
      userId,
      entryDate,
    );
    // Fetch CompletedActivities data for that entry ID
    const activities = await gatherActivities(entryId, userId, entryDate);
    // Format response data
    const allEntryData = {
      diary_entry: entry,
      measurement_data: hrvData,
      activities: activities,
    };
    // Return OK data
    return res.json(allEntryData);
    // Handle errors via error handler
  } catch (error) {
    console.log('getEntryById catch error');
    next(customError(error.message, error.status));
  }
};

/**
 * Hande POST request for new diary entry
 * @async
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @return {res} success message
 */
const postEntry = async (req, res, next) => {
  try {
    console.log('Entered postEntry...');
    // Format request body data to a list
    const {entry_date, mood_color, notes} = req.body;
    const entryParams = [req.user.user_id, entry_date, mood_color, notes];
    // Make sure the request contains only valid HEX values
    validateMoodColors(mood_color);
    // Validate and format activities list
    const activitiesParams = validateyActivitiesList(req);
    // Check if this user has a existing entry for this day
    await checkForExistingEntry(req.user.user_id, entry_date);
    // Get kubios daily measurement for the specific date
    const hrvData = await getKubiosData(req);
    // Format hrv values
    const hrvParams = extractHRVMeasurementValues(hrvData.results[0]);
    // Create a new entry to the database and save its ID
    const addedEntry = await addEntry(entryParams);
    const entryId = addedEntry.insertId;
    // Save Kubios measurement data and save measurement ID
    const addedMeasurement = await addMeasurement(hrvParams);
    const measurementId = addedMeasurement.insertId;
    // Connect measurements to the new entry
    const entry = await connectMeasurementToEntry(measurementId, entryId);
    // Some new entries may have activities
    if (activitiesParams.length > 0) {
      // Add each activity to a seperate table
      const addedActivities = await addAllActivities(entryId, activitiesParams);
      console.log(`Added ${addedActivities.length} activities`);
    }
    // New entry added succesfully
    console.log('New entry added');
    return res.json({message: `New entry_id=${entryId}`});
    // Handle errors via error handler
  } catch (error) {
    console.log('postEntry catch error');
    next(customError(error.message, error.status, error.errors));
  }
};

/**
 *  Check if provided HEX value is one that the system approves
 * @param {string} moodColor A HEX value to describe mood
 */
const validateMoodColors = (moodColor) => {
  const acceptedHexValues = ['9BCF53', 'FFF67E', 'FF8585', 'D9D9D9'];
  const match = acceptedHexValues.includes(moodColor);
  if (!match) {
    throw customError(
      'Invalid mood color',
      400,
      `Available HEX values: ${acceptedHexValues}`,
    );
  }
  return;
};

/**
 *  Add empty dicts for days that didnt have a entry
 * @param {list} entries A list of diary entries
 * @param {int} month A number to represent a month
 * @param {int} year A number to represent a year
 * @return {dictionary} Key:value pairs for every day of the month
 */
const populateMissingDaysInMonth = (entries, month, year) => {
  // Get the number of days in the specified month
  const daysInMonth = new Date(year, month, 0).getDate();
  const result = {};
  // Iterate through each day in the month
  for (let day = 1; day <= daysInMonth; day++) {
    // Create a Date object for the current day
    const currentDate = new Date(year, month - 1, day);
    // Get current date in yyyy-mm-dd format
    const yyyy = currentDate.getFullYear();
    const mm = String(currentDate.getMonth() + 1).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    const fullDate = yyyy + '-' + mm + '-' + dd;
    // Search for the current date in the entries list
    const foundEntry = entries.find((entry) => entry.entry_date === fullDate);
    // If a match is found, attatch entry to be the value for the date
    if (foundEntry) {
      result[fullDate] = foundEntry;
    } else {
      result[fullDate] = {};
    }
  }
  return result;
};

/**
 * Fetch DiaryEntries and Measurements data with patient scope
 * @async
 * @param {int} month A month number
 * @param {int} year Year
 * @param {int} userId User ID
 * @return {json} All found entries and measurements within the month
 */
const gatherMonthlyPatientEntries = async (month, year, userId) => {
  // Fetch data from DiaryEntries and Measurements tables
  const result = await getMonthlyPatientEntries(year, month, userId);
  // Check for errors
  if (result.error) {
    throw customError(result.message, result.error);
  }
  return result;
};

/**
 * Iterate over entry dates and attatch completed activities if found
 * @async
 * @param {list} allEntries List containing every found entry
 * @return {list} Modified allEntries
 */
const attachCompletedActivitiesToEntries = async (allEntries) => {
  // Iterate over every entry
  for (const entry of allEntries) {
    const entryId = entry.entry_id;
    const entryDate = entry.entry_date;
    const userId = entry.user_id;
    // Get activities for that specific date
    const allActivities = await gatherActivities(entryId, userId, entryDate);
    // Add a new key:value pair to entry where value is list of activities
    entry['all_activities'] = allActivities;
  }
  // Return modified list
  return allEntries;
};

/**
 * Get data from DiaryEntries table for a specific date
 * @async
 * @param {int} userId User ID
 * @param {Date} entryDate Entry date in yyyy-mm-dd -format
 * @return {dictionary} The found entry
 */
const gatherEntryDataUsingDate = async (userId, entryDate) => {
  console.log('Fetching entry for', entryDate);
  // Fetch data from DiaryEntries table
  const entry = await getEntryUsingDate(userId, entryDate);
  // Check for errors
  if (entry.error) {
    throw customError(entry.message, entry.error);
  }
  // Return OK result
  return entry;
};

/**
 * Get measurements for a specific entry
 * @async
 * @param {int} entryId ID of the entry the data should be linked to
 * @param {int} userId User ID
 * @param {Date} entryDate Entry date in yyyy-mm-dd -format
 * @return {dictionary} The found measurement data
 */
const gatherPatientMeasurementData = async (entryId, userId, entryDate) => {
  // Fetch data from Measurements table that link to entry ID
  const hrvData = await getMeasurementsForPatient(entryId, userId, entryDate);
  // Check for errors
  if (hrvData.error) {
    throw customError(hrvData.message, hrvData.error);
  }
  // Return OK result
  return hrvData;
};

/**
 * Get activities for a specific entry
 * @async
 * @param {int} entryId ID of the entry the activities should be linked to
 * @param {int} userId User ID
 * @param {Date} entryDate Entry date in yyyy-mm-dd -format
 * @return {list} The found activities for the provided date
 */
const gatherActivities = async (entryId, userId, entryDate) => {
  // Fetch data from the CompletedActivities table
  const foundActivities = await getActivitiesForEntry(
    entryId,
    userId,
    entryDate,
  );
  // Check the lenght of the list
  if (foundActivities.length > 0) {
    // Initialize a empty list for found activities
    const activitiesList = [];
    // Iterate over every activity from the CompletedActivities result
    for (const activity of foundActivities) {
      // Append each activity to the list
      activitiesList.push(activity.activity_name);
    }
    // return activities
    return activitiesList;
  }
  // If initial list lenght was 0, just return empty list
  return [];
};

/**
 * Get and handle kubios API result data for a specific data
 * @async
 * @param {Request} req
 * @return {res} Fetched HRV data
 */
const getKubiosData = async (req) => {
  // Fetch data from Kubios API for a specific date
  const hrvData = await retrieveDataForDate(req, req.body.entry_date);
  // Check result object lenght
  const resultsLength = Object.keys(hrvData.results).length;
  // Check for errors is response
  if (hrvData.error) {
    throw customError('Could not retrieve kubios data', 500);
  }
  // Check if the response was empty
  if (resultsLength === 0) {
    throw customError('No kubios data found', 400);
  }
  // Return OK Data
  return hrvData;
};

/**
 * Check if there is a existing entry for the provided date
 * @async
 * @param {int} userId
 * @param {string} entryDate in yyyy-mm-dd format
 */
const checkForExistingEntry = async (userId, entryDate) => {
  console.log('Checking if there is a entry for this date already');
  const result = await getEntryUsingDate(userId, entryDate);
  if (result.error === 500) {
    throw customError(result.message, result.error);
  }
  if (result.error === 404) {
    console.log(result.message);
    return;
  }
  throw customError(
    'There is a existing entry for this date already',
    409,
    'One entry per day',
  );
};

/**
 * Validate the Activities list input for postEntry
 * @param {Request} req
 * @return {res} List of vali activities
 */
const validateyActivitiesList = (req) => {
  const activitiesList = req.body.activities;
  // Make sure activity list exists in the request
  if (!Array.isArray(activitiesList)) {
    throw customError('Activities list missing', 400);
  } else {
    // Check that each activity item is valid
    const invalidListItems = checkActivities(activitiesList);
    // Check for validation errors
    if (invalidListItems.status === 400) {
      console.log('Error found in activities list, throwing new error...');
      throw customError(
        invalidListItems.message,
        invalidListItems.status,
        invalidListItems.errors,
      );
      // Return OK activities list
    } else {
      return activitiesList;
    }
  }
};

/**
 * Pick and choose wanted HRV values from the plethera of data
 * @param {dictionary} kubiosResult All data for a specific date from kubios API
 * @return {list} All of the values that match Measurement table columns
 */
const extractHRVMeasurementValues = (kubiosResult) => {
  console.log('Started to sort kubios hrv data');
  // Simplify the paths to frequency and calculated values
  const freqValues = kubiosResult.result.freq_domain;
  const hrvValues = kubiosResult.result;
  const hrvList = [];
  // Pick and choose the values that match Measurement table columns
  hrvList.push(kubiosResult.result_id);
  hrvList.push(kubiosResult.daily_result);
  hrvList.push(kubiosResult.result.artefact_level);
  hrvList.push(freqValues.LF_power);
  hrvList.push(freqValues.LF_power_nu);
  hrvList.push(freqValues.HF_power);
  hrvList.push(freqValues.HF_power_nu);
  hrvList.push(freqValues.tot_power);
  hrvList.push(hrvValues.mean_hr_bpm);
  hrvList.push(hrvValues.mean_rr_ms);
  hrvList.push(hrvValues.rmssd_ms);
  hrvList.push(hrvValues.sd1_ms);
  hrvList.push(hrvValues.sd2_ms);
  hrvList.push(hrvValues.sdnn_ms);
  hrvList.push(hrvValues.sns_index);
  hrvList.push(hrvValues.pns_index);
  hrvList.push(hrvValues.stress_index);
  hrvList.push(hrvValues.respiratory_rate);
  hrvList.push(hrvValues.readiness);
  hrvList.push(hrvValues.recovery);
  hrvList.push(kubiosResult.user_happiness);
  hrvList.push(kubiosResult.result_type);
  // Return the list
  console.log('Hrv data sorted returning to postEntry...');
  return hrvList;
};

export {getMonth, getDay, postEntry};
