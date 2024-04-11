/* eslint-disable camelcase */
import {
  addEntry,
  addMeasurement,
  listAllEntries,
  selectEntryById,
  getActivitiesForEntry,
  getMeasurementsForPatient,
  getEntryUsingDate,
  updateEntryById,
  addAllActivities,
  deleteEntryByIdUser,
  deleteEntryByIdAdmin,
  listAllEntriesByUserId,
  connectMeasurementToEntry,
} from '../models/entry-models.mjs';
import {customError, checkActivities} from '../middlewares/error-handler.mjs';
import {retrieveDataForDate} from '../controllers/kubios-controller.mjs';

// Get all entries
const getEntries = async (req, res, next) => {
  let result = '';
  // Check what token is included in the request
  if (req.user.user_level === 'admin') {
    // Request contained admin token
    console.log('Admin user accessing all entries');
    result = await listAllEntries();
  } else {
    // Request contained regular token
    console.log('Regular user accessing all available entries');
    result = await listAllEntriesByUserId(req.user.user_id);
  }
  // Check if result is error-free
  if (!result.error) {
    // Send response containing entries
    res.json(result);
  } else {
    // Forward to errorhandler, if result contains a error
    next(new Error(result.error));
  }
};
const gatherEntryData = async (userId, entryDate) => {
  console.log('Fetching entry for', entryDate);
  const entry = await getEntryUsingDate(userId, entryDate);
  if (entry.error) {
    throw customError(entry.message, entry.error);
  }
  return entry;
};

const gatherPatientMeasurementData = async (entryId, userId, entryDate) => {
  const hrvData = await getMeasurementsForPatient(entryId, userId, entryDate);
  if (hrvData.error) {
    throw customError(hrvData.message, hrvData.error);
  }
  return hrvData;
};

const gatherActivities = async (entryId, userId, entryDate) => {
  const foundActivities = await getActivitiesForEntry(
    entryId,
    userId,
    entryDate,
  );
  if (foundActivities.length > 0) {
    const activitiesList = [];
    for (const activity of foundActivities) {
      activitiesList.push(activity.activity_name);
    }
    return activitiesList;
  } else {
    return [];
  }
};

const getEntryById = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const entryDate = req.params.entry_date;
    const entry = await gatherEntryData(userId, entryDate);
    const entryId = entry.entry_id;
    const hrvData = await gatherPatientMeasurementData(
      entryId,
      userId,
      entryDate,
    );
    const activities = await gatherActivities(entryId, userId, entryDate);
    const allEntryData = {
      diary_entry: entry,
      measurement_data: hrvData,
      activities: activities,
    };

    return res.json(allEntryData);
  } catch (error) {
    console.log('getEntryById catch error');
    next(customError(error.message, error.status));
  }
};

const getKubiosDataForNewEntry = async (req) => {
  const hrvData = await retrieveDataForDate(req, req.body.entry_date);
  const resultsLength = Object.keys(hrvData.results).length;
  // Check for errors is response
  if (hrvData.error) {
    console.log(hrvData);
    throw customError('Could not retrieve kubios data', 500);
  }
  if (resultsLength === 0) {
    throw customError('No kubios data found', 400);
  }
  return hrvData;
};

// Hande POST request for new diary entry
const postEntry = async (req, res, next) => {
  try {
    // TODO CHECK FOR OLD ENTRY
    console.log('Entered postEntry...');
    // Format request body data to a list
    const {entry_date, mood_color, notes} = req.body;
    const entryParams = [req.user.user_id, entry_date, mood_color, notes];
    // Validate and format activities list
    const activitiesParams = validateyActivitiesList(req);
    // Get kubios daily measurement for the specific date
    const hrvData = await getKubiosDataForNewEntry(req);
    // Format hrv values
    const hrvParams = chooseWantedHrvValuesAndReformat(hrvData.results[0]);
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
  } catch (error) {
    console.log('postEntry catch error');
    next(customError(error.message, error.status, error.errors));
  }
};

const validateyActivitiesList = (req) => {
  const activitiesList = req.body.activities;
  // Make sure activity list exists in the request
  if (!Array.isArray(activitiesList)) {
    throw customError('Activities list missing', 400);
  } else {
    // Check that each activity item is valid
    const invalidListItems = checkActivities(activitiesList);
    if (invalidListItems.status === 400) {
      console.log('Error found in activities list, throwing new error...');
      throw customError(
        invalidListItems.message,
        invalidListItems.status,
        invalidListItems.errors,
      );
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
const chooseWantedHrvValuesAndReformat = (kubiosResult) => {
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

// Update existing diary entry using entry_id from request
const putEntry = async (req, res, next) => {
  const userId = req.user.user_id;
  const result = await updateEntryById({userId, ...req.body});
  if (result.error) {
    // Forward to errorhandler if result contains a error
    return next(customError(result.message, result.error));
  } else {
    // Respond with OK-status, if there was no errors
    return res.status(201).json(result);
  }
};

// Delete entry
const deleteEntry = async (req, res, next) => {
  let result = '';
  // Check what token is included in the request
  if (req.user.user_level === 'admin') {
    // Request contained admin token
    console.log('admin-user accessing deleteEntry function');
    result = await deleteEntryByIdAdmin(req.body.entry_id);
  } else {
    // Request contained regular token
    console.log('regular-user accessing deleteEntry function');
    result = await deleteEntryByIdUser(req.user.user_id, req.body.entry_id);
  }
  if (result.error) {
    // Forward to errorhandler, if result contains a error
    next(customError(result.message, result.error));
  } else {
    // Respond with OK-status, if there was no errors
    return res.json(result);
  }
};

export {getEntries, getEntryById, putEntry, deleteEntry, postEntry};
