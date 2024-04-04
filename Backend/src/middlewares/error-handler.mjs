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


export {
  customError,
  notFoundHandler,
  errorHandler,
  validationErrorHandler,
  onlyForPatientHandler,
  onlyForDoctorHandler,
};
