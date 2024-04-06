import {customError} from '../middlewares/error-handler.mjs';
import {
  getSurveyWithUserId,
  connectQuestionToSurvey,
  createSurvey,
  addSurveyRow,
} from '../models/survey-model.mjs';

const getOwnSurvey = async (req, res, next) => {
  const {user_id: userId, username} = req.user;
  console.log(`Retrieving survey made by ${username}`);
  const result = await getSurveyWithUserId(userId);
  if (!result.error) {
    // console.log('Survey found', result);
    const sortedSurvey = extractActivities(result);
    return res.json(sortedSurvey);
  } else {
    console.log('Survey not found');
    next(
      customError(`There is no completed survey with user_id=${userId}`, 404),
    );
  }
};

/**
 * Retrieve Kubios data for a specific date
 * @async
 * @param {Object} survey - Request object including Kubios id token
 * @return {Object} - Object containing Kubios data or error information
 */
function extractActivities(survey) {
  const activities = [];
  const questions = survey.filter((item) => item.question !== 'Activity');

  survey.forEach((item) => {
    if (item.question === 'Activity') {
      activities.push(item.answer);
    }
  });

  return {questions, activities};
}

const postSurvey = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    // Check if user has already filled the survey
    const existingSurvey = await getSurveyWithUserId(userId);
    // Return an error if a survey is found
    if (existingSurvey) {
      return next(customError('This user has already filled the survey', 403));
    }
    // No survey was found
    console.log('No previous survey was found');
    // Create a new survey and save its ID
    const survey = await handleDatabaseOperation(createSurvey, userId);
    const surveyId = survey.insertId;
    let newRowId;
    // Iterate over every key:value pair from the request body
    for (const [question, answer] of Object.entries(req.body)) {
      // Check for array in value (Activities are stored in an array)
      if (Array.isArray(answer)) {
        // Iterate over every list item/activity
        for (const activity of answer) {
          // Insert each list item as a sole activity and save its id
          const newRow = await handleDatabaseOperation(
            addSurveyRow,
            'Activity',
            activity,
          );
          newRowId = newRow.insertId;
          // Link the activities to the survey
          await handleDatabaseOperation(
            connectQuestionToSurvey,
            newRowId,
            surveyId,
          );
        }
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
    return next(error); // Pass the error to the error handling middleware
  }
};

const handleDatabaseOperation = async (operation, ...args) => {
  const result = await operation(...args);
  if (result.error) {
    throw new Error(result.message);
  }
  return result;
};
export {getOwnSurvey, postSurvey};
