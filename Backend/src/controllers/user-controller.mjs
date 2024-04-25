import bcrypt from 'bcryptjs';
import 'dotenv/config';
import {customError} from '../middlewares/error-handler.mjs';
import {
  insertDoctor,
  selectDoctorByEmail,
  pairExistsAlready,
  selectUserByUsername,
  insertNewPair,
  getOwnPatients,
} from '../models/user-model.mjs';
import {
  deleteSelfFromWeeklyReports,
  deleteSelfEntryLinkedData,
  deleteSelfSurveyLinkedData,
  deleteSelfFromSurveys,
  deleteSelfFromDoctorPatientAsPatient,
  deleteSelfFromDoctorPatientAsDoctor,
  deleteSelfFromDiaryEntries,
  deleteSelfFromUsers,
} from '../models/delete-self-model.mjs';
/* eslint-disable camelcase */


/**
 * Create a new Doctor user to stressless - only for system admins
 * @async
 * @param {req} req - Request object including system admin password
 * @param {res} res
 * @param {next} next
 */
const postDoctor = async (req, res, next) => {
  const {username, password, full_name, admin_password} = req.body;
  // Check if password in request matches the one defined by system admins
  if (admin_password !== process.env.APPLICATION_ADMIN_PASSWORD) {
    // Block access if passwords do not match
    next(customError('You are not a StressLess application admin', 401));
    return;
  }
  // Generate salt to hash the new password
  const salt = await bcrypt.genSalt(10);
  // Apply salt and hash
  const hashedPassword = await bcrypt.hash(password, salt);
  // Insert new doctor user to db
  const result = await insertDoctor(
    username,
    hashedPassword,
    full_name,
    'doctor',
  );
  // Check for error in result
  if (result.error) {
    // Forward to error handler if result contains an error
    next(customError(result.message, result.error));
    return;
  };
  // Respond with an OK status - User created successfully
  return res.status(201).json(result);
};

/**
 * Handle GET request to find a doctor using username in the URL
 * @async
 * @param {req} req
 * @param {res} res
 * @param {next} next
 * @return {res}
 */
const getDoctor = async (req, res, next) => {
  console.log('Patient user trying to find a doctor via usename');
  // Get doctor username from the URL
  const doctorEmail = req.params.doctor_username;
  // Check if there is a doctor with the same email/username address
  const result = await selectDoctorByEmail(doctorEmail);
  // Check for errors - A not found doctor will return a 404 also
  if (result.error) {
    return next(customError(result.message, result.error));
  }
  // Delete password from result object before sending it in the response
  delete result.password;
  // Return doctor user information.
  return res.json({found_doctor: result});
};

/**
 * Handle POST request from a patient to establish a relationship with a doctor
 * @async
 * @param {req} req
 * @param {res} res
 * @param {next} next
 * @return {res}
 */
const formPair = async (req, res, next) => {
  const doctorEmail = req.body.doctor_username;
  // Check if there is a existing doctor user with provided username
  const doctor = await selectDoctorByEmail(doctorEmail);
  // selectDoctorByEmail returns 404 error if no doctor was found
  if (doctor.error) {
    return next(customError(doctor.message, doctor.error));
  }
  // Doctor was found
  console.log(`Doctor '${doctor.full_name}' found`);
  // Delete password from doctor result object
  delete doctor.password;
  // Save patient information to variables
  const patientId = req.user.user_id;
  const patientName = req.user.username;
  // Save doctor information to variables
  const doctorId = doctor.user_id;
  const doctorName = doctor.username;
  // Check if there is a existing relationship already between these users
  const existingPair = await pairExistsAlready(patientId, doctorId);
  // Check for errors
  if (existingPair) {
    const errorMessage = `${patientName} and ${doctorName} are already a pair`;
    return next(customError(errorMessage, 409));
  } else if (existingPair.error) {
    return next(customError(existingPair.message, existingPair.error));
  }
  // Create a new relationship to db
  const result = await insertNewPair(patientId, doctorId);
  // Check for errors
  if (!result.error) {
    // Return OK response if there were no error in the db
    const resultMessage = `${req.user.username} is now sharing their data with
     ${doctor.full_name}`;
    const pairId = resultMessage.insertId;
    return res.json({message: resultMessage, pair_id: pairId});
    // Tell client that it was a server issue if pair creation failed
  } else {
    return next(
      customError('Doctor was found but there was a db error', 500),
    );
  }
};

/**
 * Handle DELETE request from client to delete self
 * @async
 * @param {req} req
 * @param {res} res
 * @param {next} next
 * @return {res}
 */
const deleteSelf = async (req, res, next) => {
  try {
    const confPassword = req.body.confirmation_password;
    // Fetch local user
    const existingUser = await selectUserByUsername(req.user.username);
    // Check for errors
    if (existingUser.error) {
      throw customError(existingUser.message, existingUser.error);
    }
    // Save the found users password hash
    const foundPasswordHash = existingUser.password;
    // Compare the confirmation password hash with the stored password hash
    const isMatch = await bcrypt.compare(confPassword, foundPasswordHash);
    // Check if passwords match
    if (isMatch) {
      // When passwords match, proceed to delete all data for request user ID
      const userId = req.user.user_id;
      const userLevel = req.user.user_level;
      // NOTE: Following functions are in a seperate model and throw customError
      // Check if request came from a patient user
      if (userLevel === 'patient') {
        // If true, proceed to delete all data for patient user
        console.log('Patient user deleting themselves');
        await deleteSelfAsPatient(userId);
        // Check if request came from a doctor user
      } else if (userLevel === 'doctor') {
        // If true, proceed to delete all data for doctor user
        console.log('Doctor user deleting themselves');
        await deleteSelfAsDoctor(userId);
      // Throw a error, if user level was not recognized
      } else {
        throw customError('User level not recognized', 500);
      }
      // Return OK response
      res.status(200).json({message: 'StressLess user deleted'});
    // Passwords didnt match, respond with an error message
    } else {
      throw customError('Invalid confirmation password', 400);
    }
  // Handle errors
  } catch (error) {
    console.log('deleteSelf catch block');
    next(customError(error.message, error.status));
  }
};

/**
 * Delete all data that a patient user might have
 * NOTE: Functions used are in a seperate model file and throw customError
 * @async
 * @param {int} userId
 */
const deleteSelfAsPatient = async (userId) => {
  // Delele all weekly reports
  await deleteSelfFromWeeklyReports(userId);
  // Delete all data related to survey
  await deleteSelfSurveyLinkedData(userId);
  await deleteSelfFromSurveys(userId);
  // Delete all data related to diary entries
  await deleteSelfEntryLinkedData(userId);
  await deleteSelfFromDiaryEntries(userId);
  // Delete doctor patient pair
  await deleteSelfFromDoctorPatientAsPatient(userId);
  // Delete  user
  await deleteSelfFromUsers(userId);
  console.log('All patient user related data deleted');
  return;
};

/**
 * Delete all data that a doctor user might have
 * NOTE: Functions used are in a seperate model file and throw customError
 * @async
 * @param {int} userId
 */
const deleteSelfAsDoctor = async (userId) => {
  // Delete doctor patient pair
  await deleteSelfFromDoctorPatientAsDoctor(userId);
  // Delete user
  await deleteSelfFromUsers(userId);
  console.log('All doctor user related data deleted');
  return;
};

/**
 * Handle doctor GET request to fetch all patients that share data with them
 * @async
 * @param {req} req
 * @param {res} res
 * @param {next} next
 */
const getPatients = async (req, res, next) => {
  const doctorId = req.user.user_id;
  // Fetch all patients that have formed a pair with this doctor ID
  const allPatients = await getOwnPatients(doctorId);
  // Check for errors
  if (allPatients.error) {
    return next(customError(allPatients.message, allPatients.error));
  }
  // Return result (empty or populated list)
  return res.json(allPatients);
};


export {formPair, postDoctor, getDoctor, deleteSelf, getPatients};
