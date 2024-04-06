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
  const userId = req.user.user_id;
  const existingSurvey = await getSurveyWithUserId(userId);
  if (existingSurvey) {
    return next(customError('This user has already filled the survey', 403));
  }
  console.log('No previous survey was found');
  // Create a new survey and save survey ID
  const survey = await createSurvey(userId);
  const surveyId = survey.insertId;
  // Variable to save new question ID to link questions to the new survey
  let newRowId;
  // Iterate over every key:value pair
  for (const [question, answer] of Object.entries(req.body)) {
    // Check for array in value (Activities are stored in a array)
    if (Array.isArray(answer)) {
      // iterate over every list item
      for (const activity of answer) {
        // Insert each list item as a sole activity
        const newRow = await addSurveyRow('Activity', activity);
        newRowId = newRow.insertId;
        // Link the activities to the survey
        const result = await connectQuestionToSurvey(newRowId, surveyId);
        // Check for errors
        if (result.error) {
          next(customError(result.message, result.error));
        }
      }
      // If the value is not a array
    } else {
      // Insert a new question - answer row
      const newRow = await addSurveyRow(question, answer);
      newRowId = newRow.insertId;
      // Link the question and answer to the survey
      const result = await connectQuestionToSurvey(newRowId, surveyId);
      // Check for errors
      if (result.error) {
        next(customError(result.message, result.error));
      }
    }
  }
  console.log('New survey poster succesfully survey_id=', surveyId);
  return res.json({message: 'Survey posted succesfully!'});
};

export {getOwnSurvey, postSurvey};
