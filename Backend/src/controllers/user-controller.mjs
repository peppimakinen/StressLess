import bcrypt from 'bcryptjs';
import 'dotenv/config';
import {customError} from '../middlewares/error-handler.mjs';
import {
  insertDoctor,
  selectDoctorByEmail,
  selectDoctorByName,
  pairExistsAlready,
  insertNewPair,
} from '../models/user-model.mjs';
/* eslint-disable camelcase */


const postDoctor = async (req, res, next) => {
  const {username, password, full_name, admin_password} = req.body;
  if (admin_password !== process.env.APPLICATION_ADMIN_PASSWORD) {
    next(customError('You are not a StressLess application admin', 401));
    return;
  }
  // Generate salt to hash password
  const salt = await bcrypt.genSalt(10);
  // Apply salt and hash
  const hashedPassword = await bcrypt.hash(password, salt);
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
  } else {
    // Respond with an OK status - User created successfully
    return res.status(201).json(result);
  }
};

const getDoctor = async (req, res, next) => {
  console.log('Patient user trying to find a doctor via usename or name');
  const nameOrEmail = req.body.doctor_name_or_email;
  // Check if there is a doctor with the same email/username address
  const doctorFoundWithEmail = await selectDoctorByEmail(nameOrEmail);
  // selectDoctorByEmail returns 404 error if doctor not found
  if (!doctorFoundWithEmail.error) {
    delete doctorFoundWithEmail.password;
    // There was no errors, so a matching doctor was found
    doctorFoundWithEmail['message'] = 'Doctor found using email address';
    // Return selected doctor user data
    return res.json({found_doctor: doctorFoundWithEmail});
  }
  // Doctor was not found using email, try searching with full name
  console.log('No results with email adress, searching again with name...');
  const doctorFoundWithName = await selectDoctorByName(nameOrEmail);
  // selectDoctorByName returns 404 error if doctor not found
  if (!doctorFoundWithName.error) {
    delete doctorFoundWithName.password;
    // There was no errors, so a matching doctor was found
    doctorFoundWithName['message'] = 'Doctor found using full name';
    // Return selected doctor user data
    return res.json({found_doctor: doctorFoundWithName});
    // If there was a error, no doctor was found
  } else {
    console.log('Doctor was not found with full name');
    // Return a error message to the client
    return next(
      customError(
        `Could not find doctor using: '${nameOrEmail}' as search input`,
        404,
      ),
    );
  }
};

const formPair = async (req, res, next) => {
  const doctorEmail = req.body.doctor_username;
  // Check if there is a existing doctor user with provided username
  console.log('Looking up a doctor user...');
  const doctor = await selectDoctorByEmail(doctorEmail);
  // selectDoctorByEmail returns 404 error if no doctor was found
  if (doctor.error) {
    return next(
      customError(
        `Could not find doctor with the username:'${doctorEmail}'`,
        400,
      ),
    );
  }
  // Doctor was found
  console.log(`Doctor '${doctor.full_name}' found`);
  delete doctor.password;
  const patientId = req.user.user_id;
  const patientName = req.user.username;
  const doctorId = doctor.user_id;
  const doctorName = doctor.username;
  const existingPair = await pairExistsAlready(patientId, doctorId);
  if (existingPair) {
    const errorMessage = `${patientName} and ${doctorName} are already a pair`;
    return next(customError(errorMessage, 409));
  }
  const result = await insertNewPair(patientId, doctorId);
  // Check for errors
  if (!result.error) {
    // Return OK response if there was no error in the db
    const resultMessage = `${req.user.username} is now sharing their data with
     ${doctor.full_name}`;
    const pairId = resultMessage.insertId;
    console.log('A pair was found');
    return res.json({message: resultMessage, pair_id: pairId});
    // Tell client that it was a server issue if pair creation failed
  } else {
    return next(
      customError('Doctor was found but a pair could not be established', 500),
    );
  }
};

export {
  formPair,
  postDoctor,
  getDoctor,
};
