/* eslint-disable camelcase */
import {
  addEntry,
  updateEntry,
  addMeasurement,
  getActivitiesForEntry,
  getMeasurementsForPatient,
  getEntryUsingDate,
  addAllActivities,
  getMonthlyPatientEntries,
  connectMeasurementToEntry,
  deleteExistingActivities,
  updateEntryMeasurements,
} from '../models/entry-models.mjs';
import {customError, checkActivities} from '../middlewares/error-handler.mjs';
import {retrieveDataForDate} from '../controllers/kubios-controller.mjs';

/**
 * Handle GET request to get all diary entries for a specific month
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
    // Handle errors
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
    // Fetch data from DiaryEntries table for a specific date and save its ID
    const entry = await gatherEntryDataUsingDate(userId, entryDate);
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
    // Return gathered data for the specific date
    return res.json(allEntryData);
    // Handle errors
  } catch (error) {
    console.log('getDay catch error');
    next(customError(error.message, error.status));
  }
};

/**
 * Hande PUT request to update existing diary entry
 * @async
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @return {res} success message
 */
const putEntry = async (req, res, next) => {
  try {
    // Parse variables from request
    const {entry_date: entryDate, mood_color: moodColor, notes} = req.body;
    const userId = req.user.user_id;
    // Make sure the request contains only valid HEX values
    validateMoodColors(moodColor);
    // Validate and format activities list
    const activitiesParams = validateyActivitiesList(req);
    // Check if this user has a existing entry for this day and save its ID
    const entry = await verifyThatEntryExists(userId, entryDate);
    const entryId = entry.entry_id;
    // Format new DiaryEntries params from the request body
    const entryParams = [entryDate, moodColor, notes];
    // Fetch kubios data for the chosen date
    const hrvData = await getKubiosData(req);
    // Update database
    await updateMeasurementsTable(hrvData, entryId, userId, entryDate);
    await updateActivitiesTable(activitiesParams, entryId);
    await updateEntryTable(entryParams, entryId);
    // Inform the client that entry has been updated
    return res.json({message: 'Entry updated'});
    // Handle errors
  } catch (error) {
    console.log('putEntry catch error');
    next(customError(error.message, error.status, error.errors));
  }
};

/**
 * Update a specific entry using entry ID in DiaryEntries table
 * @async
 * @param {list} entryParams validated request body data
 * @param {int} entryId
 * @throws customError
 */
const updateEntryTable = async (entryParams, entryId) => {
  // Update DiaryEntries table
  const result = await updateEntry(entryParams, entryId);
  // Check for errors
  if (result.error) {
    throw customError(result.message, result.error);
  }
  console.log('DiaryEntries table updated');
  return;
};

/**
 * Update a specific entry using entry ID in CompletedActivities table
 * @async
 * @param {list} params validated activities list
 * @param {int} entryId
 * @throws customError
 */
const updateActivitiesTable = async (params, entryId) => {
  // Delete all activities for the entry ID
  const deleteResult = await deleteExistingActivities(entryId);
  // Check for errors
  if (deleteResult.error) {
    throw customError(deleteResult.message, deleteResult.error);
  }
  // Check if the list is empty
  if (params.length > 0) {
    // Insert all activities into CompletedActivities table
    const newActivities = await addAllActivities(entryId, params);
    // Check for errors
    if (newActivities.error) {
      throw customError(newActivities.message, newActivities.error);
    }
    console.log('Added activities to entry');
  }
  console.log('CompletedActivities table updated');
  return;
};

/**
 * Update a specific entry using entry ID in Measurements table
 * @async
 * @param {dict} kubiosResult all data from kubios cloud for a specific date
 * @param {int} entryId
 * @param {int} userId
 * @param {string} date entry date in yyyy-mm-dd format
 * @throws customError
 */
const updateMeasurementsTable = async (kubiosResult, entryId, userId, date) => {
  // Get the existing Measurements set for the entry
  const curMeasurement = await getMeasurementsForPatient(entryId, userId, date);
  // Check for errors
  if (curMeasurement.error) {
    throw customError(curMeasurement.message, curMeasurement.error);
  }
  // Save the existing measurements kubios result ID
  const curMeasurementKubiosId = curMeasurement.kubios_result_id;
  // From fetched kubios cloud data parse the result ID
  const newMeasuremenetKubiosId = kubiosResult.results[0].result_id;
  // Check if the result ID from kubios cloud is the same that is already in db
  if (curMeasurementKubiosId === newMeasuremenetKubiosId) {
    // If true, the measurements in db are the same as in kubios cloud
    console.log('HRV data in db is already up to date');
    // Return because no need to update db
    return;
  }
  // There is need to update db if the ID's were different
  console.log('New HRV data found from kubios');
  // Format hrv values into a params list
  const hrvParams = extractHRVMeasurementValues(kubiosResult.results[0]);
  // Update the Measurements table
  const result = await updateEntryMeasurements(hrvParams, entryId);
  // Check for errors
  if (result.error) {
    throw customError(result.message, result.error);
  }
  console.log('Measurements table updated');
  return result;
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
    // Format request body data to a list
    const {entry_date: entryDate, mood_color: moodColor, notes} = req.body;
    const entryParams = [req.user.user_id, entryDate, moodColor, notes];
    // Make sure the request contains only valid HEX values
    validateMoodColors(moodColor);
    // Validate and format activities list
    const activitiesParams = validateyActivitiesList(req);
    // Check if this user has a existing entry for this day
    await checkForExistingEntry(req.user.user_id, entryDate);
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
    await connectMeasurementToEntry(measurementId, entryId);
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
 * Check if provided HEX value is one that the system approves
 * @param {string} moodColor mood_color value from req.body
 * @throws customError
 */
const validateMoodColors = (moodColor) => {
  // Define the HEX values that the system approves
  const acceptedHexValues = ['9BCF53', 'FFF67E', 'FF8585', 'D9D9D9'];
  // Check if given parameter is one of the items in the approved HEX values
  const match = acceptedHexValues.includes(moodColor);
  // Check if match was found
  if (!match) {
    // Throw a error if given parameter doesnt match any item in the list
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
 * @param {int} month
 * @param {int} year
 * @return {dictionary} Dict for every day of the month, where key is yyyy-mm-dd
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
 * @param {int} month
 * @param {int} year
 * @param {int} userId
 * @return {json} All found entries and measurements within the month
 * @throws CustomError
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
 * @throws CustomError
 */
const attachCompletedActivitiesToEntries = async (allEntries) => {
  // Iterate over every entry
  for (const entry of allEntries) {
    const entryId = entry.entry_id;
    const entryDate = entry.entry_date;
    const userId = entry.user_id;
    // Get activities for that specific date
    const allActivities = await gatherActivities(entryId, userId, entryDate);
    // Check for errors
    if (allActivities.error) {
      throw customError(allActivities.message, allActivities.error);
    }
    // Add a new key value pair to entry where value is list of activities
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
 * @throws CustomError
 */
const gatherEntryDataUsingDate = async (userId, entryDate) => {
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
 * @throws CustomError
 */
const gatherPatientMeasurementData = async (entryId, userId, entryDate) => {
  // Fetch data from Measurements table that link to entry ID
  const hrvData = await getMeasurementsForPatient(entryId, userId, entryDate);
  // Check for errors
  if (hrvData.error) {
    throw customError(hrvData.message, hrvData.error);
  }
  return hrvData;
};

/**
 * Get activities for a specific entry
 * @async
 * @param {int} entryId ID of the entry the activities should be linked to
 * @param {int} userId User ID
 * @param {Date} entryDate Entry date in yyyy-mm-dd -format
 * @return {list} The found activities for the provided date
 * @throws CustomError
 */
const gatherActivities = async (entryId, userId, entryDate) => {
  // Fetch data from the CompletedActivities table
  const foundActivities = await getActivitiesForEntry(
    entryId,
    userId,
    entryDate,
  );
  // Check for errors
  if (foundActivities.error) {
    throw customError(foundActivities.message, foundActivities.error);
  }
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
 * @throws customError
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
 * @throws customError
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
 * Check if there is a existing entry for the provided date
 * @async
 * @param {int} userId
 * @param {string} entryDate in yyyy-mm-dd format
 * @throws customError
 */
const verifyThatEntryExists = async (userId, entryDate) => {
  const result = await getEntryUsingDate(userId, entryDate);
  if (result.error === 500) {
    throw customError(result.message, result.error);
  }
  if (result.error === 404) {
    throw customError(result.message, result.error);
  }
  console.log('Found a entry that can be updated');
  return result;
};

/**
 * Validate the Activities list input for postEntry
 * @param {Request} req
 * @return {list} List of valid activities
 * @throws customError
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
  // Try block to account for potential changes in the Kubios result structure
  try {
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
    return hrvList;
    // Handle errors
  } catch (error) {
    throw customError(
      'Failed to parse through Kubios cloud data',
      500,
      'Check Kubios API documentation for result structure',
    );
  }
};

export {getMonth, getDay, postEntry, putEntry};
