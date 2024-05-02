import {getSurveyWithUserId} from '../models/survey-model.mjs';
import {getDoctorPatientPair} from '../models/user-model.mjs';
import {validationResult} from 'express-validator';

/**
 * Throw a new error
 * @author mattpe <mattpe@metropolia.fi>
 * @param {string} message
 * @param {int} status
 * @param {string} errors
 * @return {Error}
 */
const customError = (message, status, errors) => {
  const error = new Error(message);
  error.status = status || 500;
  if (errors) {
    error.errors = errors;
  }
  return error;
};

/**
 * Respond with a error if request directed at a invalid URL
 * @author mattpe <mattpe@metropolia.fi>
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
const notFoundHandler = (req, res, next) => {
  const error = customError(`Not Found - ${req.originalUrl}`, 404);
  next(error);
};

/**
 * Handle thrown errors
 * @author mattpe <mattpe@metropolia.fi>
 * @param {Error} err
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
const errorHandler = (err, req, res, next) => {
  res.status(err.status || 500);
  console.log('errorHandler', err.message, err.status, err.errors);
  res.json({
    error: {
      message: err.message,
      status: err.status || 500,
      errors: err.errors,
    },
  });
};

/**
 * Throw error if request fails to pass express-validator
 * @author mattpe <mattpe@metropolia.fi>
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @return {Error}
 */
const validationErrorHandler = (req, res, next) => {
  const errors = validationResult(req, {strictParams: ['body']});
  if (!errors.isEmpty()) {
    console.log('validation errors', errors.array({onlyFirstError: true}));
    const error = customError('Bad Request', 400);
    error.errors = errors.array({onlyFirstError: true}).map((error) => {
      return {field: error.path, message: error.msg};
    });
    return next(error);
  }
  next();
};

/**
 * Check if request is coming from a patient user
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @return {Error}
 */
const onlyForPatientHandler = (req, res, next) => {
  const userLevel = req.user.user_level;
  if (userLevel === 'patient') {
    console.log('Request came from a patient user');
    next();
  } else {
    console.log('a non-patient user was intercepted');
    const error = customError(
      'This endpoint is only for StressLess patient users',
      403,
    );
    return next(error);
  }
};

/**
 * Check if request is coming from doctor user
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @return {Error}
 */
const onlyForDoctorHandler = (req, res, next) => {
  const userLevel = req.user.user_level;
  if (userLevel === 'doctor') {
    console.log('Request came from a doctor user');
    next();
  } else {
    console.log('a non-doctor user was intercepted');
    const error = customError(
      'This endpoint is only for StressLess doctor users',
      403,
    );
    return next(error);
  }
};

/**
 * Check if doctor request is for a authorized patient
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @return {error} customError
 */
const verifyRightToViewPatientsData = async (req, res, next) => {
  const patientId = req.params.patient_id;
  const doctorId = req.user.user_id;
  const result = await getDoctorPatientPair(patientId, doctorId);
  if (!result.error) {
    console.log('Doctor user fetching authorized patient data');
    next();
  } else {
    return next(customError(result.message, result.error));
  }
};

/**
 * Check if request is coming from a patient user that has completed survey
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @return {error} customError
 */
const onlyForPatientWhoCompletedSurvey = async (req, res, next) => {
  // Check if user level is anything else than patient
  if (req.user.user_level !== 'patient') {
    // Return a error if it is
    return next(
      customError('This endpoint is only for StressLess patient users', 401),
    );
  }
  // Request came from a patient
  console.log('Request came from a patient user');
  // Search for a survey for requesting patient user ID
  const result = await getSurveyWithUserId(req.user.user_id);
  // Check if there was no errors
  if (!result.error) {
    // Survey found, continue to next function
    console.log('Existing survey found');
    next();
  // Survey could not be fetched, return a error
  } else {
    return next(customError(result.message, result.error));
  }
};

/**
 * Validate survey
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @return {error} customError
 */
// Validate each key:value pair in a survey
const validateSurvey = (req, res, next) => {
  console.log('Validating survey key:value pairs...');
  // The request needs to have exactly one list for activities
  let foundActivityLists = 0;
  // Check for empty dictionary
  if (Object.keys(req.body).length === 0) {
    return next(customError('Empty survey cant be submitted', 400));
  }
  // Iterate over every key:value pair
  for (const [question, answer] of Object.entries(req.body)) {
    // Check if question key is empty
    if (!question) {
      // Throw a error if a empty question key is detected
      return next(customError('Provide text for every question', 400));
    }
    // Check if dictionary value is a list (list is used for activities)
    if (Array.isArray(answer)) {
      foundActivityLists += 1;
      // Make sure a empty list isnt submitted
      if (answer.length === 0) {
        return next(customError('Empty activity list cant be submitted', 400));
      }
      // Pass the activities list to different function to check validity
      const invalidActivities = checkActivities(answer);
      if (invalidActivities.status === 400) {
        return next(invalidActivities);
      }
      // If the anwer is not a list, its a regular question:answer pair
    } else {
      // Check that answer text isnt too long
      const validAnswer = checkStringLenght(answer, 250);
      // Throw a error if answer lenght over 250 characters
      if (!validAnswer) {
        throw customError(
          `The asnwer for '${question}' is too long`,
          400,
          'Character limit is 250',
        );
      }
    }
  }
  // After all key:value pairs have been iterated over
  // There should be only one list in the request
  if (foundActivityLists === 1) {
    // Survey data is valid
    console.log('Survey data has been validated');
    next();
    // The request is missing a list for the activities
  } else if (foundActivityLists === 0) {
    throw customError('Missing a list for activities', 400);
    // There can be exactly one list in the request and its for activities
  } else {
    throw customError('There should be only one list in the request', 400);
  }
};

/**
 * Validate activities list and its items
 * @param {List} activitiesList
 * @return {error} customError
 */
const checkActivities = (activitiesList) => {
  // Iterate over every list item
  for (const activity of activitiesList) {
    // Check if list item syntax is valid
    const validActivity = checkStringLenght(activity, 75);
    // Throw a error if there is a list item with invalid syntax
    if (!validActivity) {
      console.log('Invalid activity list item detected');
      return customError(
        `Invalid activity:'${activity}'`,
        400,
        'Character limit for each activity is 75',
      );
    }
  }
  return activitiesList;
};

/**
 * Check if str parameter is larger than given lenght parameter
 * @param {string} str
 * @param {Int} strLenght
 * @return {Boolean}
 */
const checkStringLenght = (str, strLenght) => {
  if (str.length > strLenght) {
    return false;
  } else {
    return true;
  }
};

export {
  onlyForPatientWhoCompletedSurvey,
  verifyRightToViewPatientsData,
  validationErrorHandler,
  onlyForPatientHandler,
  onlyForDoctorHandler,
  notFoundHandler,
  checkActivities,
  validateSurvey,
  errorHandler,
  customError,
};
