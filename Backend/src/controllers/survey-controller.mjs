import {customError} from '../middlewares/error-handler.mjs';
import {
  getSurveyWithUserId,
  connectQuestionToSurvey,
  createSurvey,
  getOnlyActivities,
  addSurveyRow,
} from '../models/survey-model.mjs';

/**
 * Get own survey
 * @async
 * @param {req} req
 * @param {res} res
 * @param {Function} next
 * @return {res} Found survey
 */
const getOwnSurvey = async (req, res, next) => {
  const {user_id: userId, username} = req.user;
  console.log(`Retrieving survey made by ${username}`);
  // Fetch survey
  const result = await getSurveyWithUserId(userId);
  // Check for errors
  if (!result.error) {
    // Sort activities to a seperate list if survey found
    const sortedSurvey = extractActivities(result);
    // Return sorted survey
    return res.json(sortedSurvey);
  } else {
    // Forward to error handler if no survey was found or db error
    return next(customError(result.message, result.error));
  }
};

/**
 * Get only the activities that have been determined in survey
 * @async
 * @param {req} req
 * @param {res} res
 * @param {Function} next
 * @return {res} Found survey
 */
const getActivities = async (req, res, next) => {
  const userId = req.user.user_id;
  // Get activities
  const activities = await getOnlyActivities(userId);
  // Check for errors
  if (!activities.error) {
    // return found activities
    return res.json({activities: activities});
  } else {
    // Handle errors
    next(customError(activities.message, activities.error));
  }
};

/**
 * Post a new survey
 * @async
 * @param {req} req
 * @param {res} res
 * @param {Function} next
 * @return {res} Found survey
 */
const postSurvey = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    // Check if user has already filled the survey
    await checkForExistingSurvey(userId);
    // Create a new survey and save its ID
    const survey = await handleDatabaseOperation(createSurvey, userId);
    const surveyId = survey.insertId;
    let newRowId;
    // Iterate over every key:value pair from the request body
    for (const [question, answer] of Object.entries(req.body)) {
      // Check for array in value (Activities are stored in an array)
      if (Array.isArray(answer)) {
        // Send activities list to a seperate function to be handled
        addActivities(answer, surveyId);
      } else {
        // Insert a new question - answer row
        const newRow = await handleDatabaseOperation(
          addSurveyRow,
          question,
          answer,
        );
        newRowId = newRow.insertId;
        // Link the question and answer to the survey
        await handleDatabaseOperation(
          connectQuestionToSurvey,
          newRowId,
          surveyId,
        );
      }
    }
    console.log('New survey posted successfully, survey_id=', surveyId);
    return res.json({message: 'Survey posted successfully!'});
  } catch (error) {
    console.error('Error posting survey:', error);
    // Pass the error to the error handling middleware
    return next(error);
  }
};

/**
 * Handle database result for fetching previously completed survey
 * @async
 * @param {int} userId
 * @throws {Error} customError
 */
const checkForExistingSurvey = async (userId) => {
  const existingSurvey = await getSurveyWithUserId(userId);
  // Searching for a nonexistent survey will return a 404 error
  if (existingSurvey.error === 404) {
    // Return back to postSurvey if no survey was found
    console.log('No previous survey was found');
    return;
  }
  // Return an error if a survey is found
  if (existingSurvey.error === 500) {
    throw customError(existingSurvey.message, existingSurvey.error);
  }
  // If there was no error, return a conflict error
  throw customError('User has already completed the survey', 409);
};

/**
 * Format questions and activities to a seperate list
 * @param {list} survey A list with questions and answers
 * @return {dict} Formatted survey
 */
const extractActivities = (survey) => {
  const activities = [];
  // Filter questions to a seperate list
  const questions = survey.filter((item) => item.question !== 'Activity');
  // Iterate over every question answer pair
  survey.forEach((item) => {
    // Performed activities have Activity as key
    if (item.question === 'Activity') {
      // Add found activity to the activities list
      activities.push(item.answer);
    }
  });
  // Return both lists
  return {questions, activities};
};

/**
 * Add each activity as a seperate row to db
 * @async
 * @param {list} activityList A list where items are chosen activities
 * @param {int} surveyId
 */
const addActivities = async (activityList, surveyId) => {
  let newRowId;
  // Iterate over every list item/activity
  for (const activity of activityList) {
    // Insert each list item as a sole activity and save its id
    const newRow = await handleDatabaseOperation(
      addSurveyRow,
      'Activity',
      activity,
    );
    newRowId = newRow.insertId;
    // Link the activities to the survey
    await handleDatabaseOperation(connectQuestionToSurvey, newRowId, surveyId);
  }
};

/**
 * Handle a database operation asynchronously
 * @async
 * @param {function} operation The database operation function to be executed
 * @param  {...any} args Additional arguments to be passed to the function
 * @return {Promise<any>}
 * @throws {Error} Throws an error if the database operation fails.
 */
const handleDatabaseOperation = async (operation, ...args) => {
  const result = await operation(...args);
  if (result.error) {
    throw customError(result.message, result.error);
  }
  return result;
};

const getPatientSurvey = async (req, res, next) => {
  console.log('Entered getPatientSurvey');
  const patientId = req.params.patient_id;
  const patientSurvey = await getSurveyWithUserId(patientId);
  if (patientSurvey.error === 404) {
    return next(customError('Selected patient ID has no survey', 404));
  } else if (patientSurvey.error === 500) {
    return next(customError(patientSurvey.message, patientSurvey.error));
  } else {
    const sortedPatientSurvey = extractActivities(patientSurvey);
    // Return sorted survey
    return res.json(sortedPatientSurvey);
  }
};

export {getOwnSurvey, postSurvey, getActivities, getPatientSurvey};
