import {validationResult} from 'express-validator';

const customError = (message, status, errors) => {
  const error = new Error(message);
  error.status = status || 500;
  if (errors) {
    error.errors = errors;
  }
  return error;
};

const notFoundHandler = (req, res, next) => {
  const error = customError(`Not Found - ${req.originalUrl}`, 404);
  next(error);
};

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

const onlyForPatientHandler = (req, res, next) => {
  const userLevel = req.user.user_level;
  if (userLevel === 'patient') {
    console.log('Request came from a patient user');
    next();
  } else {
    console.log('a non-patient user was intercepted');
    const error = customError(
      'This endpoint is only for StressLess patient users',
      401,
    );
    return next(error);
  }
};

const onlyForDoctorHandler = (req, res, next) => {
  const userLevel = req.user.user_level;
  if (userLevel === 'doctor') {
    console.log('Request came from a doctor user');
    next();
  } else {
    console.log('a non-doctor user was intercepted');
    const error = customError(
      'This endpoint is only for StressLess doctor users',
      401,
    );
    return next(error);
  }
};

// Validate each key:value pair in a survey
const validateSurvey = (req, res, next) => {
  console.log('Validating survey key:value pairs...');
  // The request needs to have exactly one list for activities
  // The presence of activities is essential for future functionality
  let foundActivityLists = 0;
  // Check for empty dictionary
  if (Object.keys(req.body).length === 0) {
    throw customError('Empty survey cant be submitted', 400);
  }
  // Iterate over every key:value pair
  for (const [question, answer] of Object.entries(req.body)) {
    // Check if question key is empty
    if (!question) {
      // Throw a error if a empty question key is detected
      throw customError('Provide question text for every key:value pair', 400);
    }
    // Check if dictionary value is a list (list is used for activities)
    if (Array.isArray(answer)) {
      // Pass the activities list to different function to check validity
      checkActivities(answer);
      // There was no validation errors in the list
      foundActivityLists += 1;
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

const checkActivities = (activitiesList) => {
  // Make sure a empty list isnt submitted
  if (activitiesList.length === 0) {
    throw customError('Cant submit a empty list for activities', 400);
  }
  // Iterate over every list item
  for (const activity of activitiesList) {
    // Check if list item syntax is valid
    const validActivity = checkActivityStringValidity(activity);
    // Throw a error if there is a list item with invalid syntax
    if (!validActivity) {
      console.log('Invalid activity list item detected');
      throw customError(
        `Invalid activity:'${activity}'`,
        400,
        'Character limit for each activity is 75',
      );
    }
  }
};

const checkActivityStringValidity = (str) => {
  if (str.length > 75) {
    return false;
  } else {
    return true;
  }
};

export {
  customError,
  notFoundHandler,
  errorHandler,
  validationErrorHandler,
  onlyForPatientHandler,
  onlyForDoctorHandler,
  validateSurvey,
};
