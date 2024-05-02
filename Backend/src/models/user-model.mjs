/* eslint-disable max-len */
import promisePool from '../utils/database.mjs';

/**
 * Insert a new patient user
 * @async
 * @param {Object} user User object from request
 * @return {Object} Result. Empty result is returned as error
 */
const insertUser = async (user) => {
  try {
    const sql =
      'INSERT INTO Users (username, password, user_level, full_name) VALUES (?, ?, ?, ?)';
    const params = [user.username, user.password, user.user_level, user.full_name];
    const [result] = await promisePool.query(sql, params);
    // Return ok if no errors
    return {message: 'new user created', user_id: result.insertId};
  } catch (error) {
    console.error('insertUser', error);
    // Check if error came from non-unique username
    if (error.errno == 1062) {
      return {error: 409, message: 'Username or email address taken'};
    // Else return a generic internal error
    } else {
      return {error: 500, message: 'db error'};
    }
  }
};

/**
 * Insert a new doctor user
 * @async
 * @param {String} username
 * @param {String} password
 * @param {String} fullname
 * @param {String} userLevel
 * @return {Object} Result. Empty result is returned as error
 */
const insertDoctor = async (username, password, fullname, userLevel) => {
  try {
    const sql =
      'INSERT INTO Users (username, password, full_name, user_level) VALUES (?, ?, ?, ?)';
    const params = [username, password, fullname, userLevel];
    const [result] = await promisePool.query(sql, params);
    // Return ok result
    return {message: 'new user created', user_id: result.insertId};
  } catch (error) {
    console.error('insertDoctor', error);
    // Check if error came from non-unique username
    if (error.errno == 1062) {
      return {error: 409, message: 'Username or email address taken'};
    // Else return a generic internal error
    } else {
      return {error: 500, message: 'db error'};
    }
  }
};

/**
 * Select a user with username
 * @async
 * @param {String} username
 * @return {Object} Result. Empty result is returned as error
 */
const selectUserByUsername = async (username) => {
  try {
    const sql = 'SELECT * FROM Users WHERE username=?';
    const params = [username];
    const [rows] = await promisePool.query(sql, params);
    // if nothing is found with the username and password
    if (rows.length === 0) {
      return {error: 401, message: 'Invalid username or password'};
    }
    return rows[0];
  } catch (error) {
    console.error('selectByUsername', error);
    return {error: 500, message: 'db error'};
  }
};

/**
 * Select a user with email
 * @async
 * @param {String} email
 * @return {Object} Result. Empty result is returned as error
 */
const selectUserByEmail = async (email) => {
  try {
    const sql = 'SELECT * FROM Users WHERE username=?';
    const params = [email];
    const [rows] = await promisePool.query(sql, params);
    // if nothing is found with the user id, result array is empty []
    if (rows.length === 0) {
      return {error: 404, message: 'user not found'};
    }
    // Remove the password field from the returned user object
    delete rows[0].password;
    return rows[0];
  } catch (error) {
    console.error('selectUserByEmail', error);
    return {error: 500, message: 'db error'};
  }
};

/**
 * Select survey for a user existing user
 * @async
 * @param {Int} id
 * @return {Object} Result. Empty result is returned as error
 */
const checkSurveyExistance = async (id) => {
  try {
    const sql = 'SELECT * FROM Surveys WHERE u_id=?';
    const params = [id];
    const [rows] = await promisePool.query(sql, params);
    // if nothing is found with the user id, result array is empty []
    if (rows.length === 0) {
      return {error: 404, message: 'user not found'};
    }
    return rows[0];
  } catch (error) {
    console.error('checkSurveyExistance', error);
    return {error: 500, message: 'db error'};
  }
};

/**
 * Select all data for a specific doctor user
 * @async
 * @param {string} email Email is used as username
 * @return {object} Found user or error
 */
const selectDoctorByEmail = async (email) => {
  try {
    // Form the query
    const sql = 'SELECT * FROM Users WHERE username=? and user_level="doctor"';
    // Fetch data from db
    const [rows] = await promisePool.query(sql, [email]);
    // Check if no users was found
    if (rows.length === 0) {
      // Return a 404 error if no doctor user was found
      return {error: 404, message: 'No doctor was found using the provided username'};
    }
    // Return the found user
    return rows[0];
  // Handle errors
  } catch (error) {
    console.error('selectUserByEmail', error);
    return {error: 500, message: 'db error in selectDoctorByEmail'};
  }
};

/**
 * Insert a new pair into DoctorPatient
 * @async
 * @param {Int} patientId
 * @param {Int} doctorId
 * @return {Object} Result
 */
const insertNewPair = async (patientId, doctorId) => {
  try {
    const sql = 'INSERT INTO DoctorPatient (patient_id, doctor_id) VALUES (?,?)';
    const params = [patientId, doctorId];
    const [rows] = await promisePool.query(sql, params);
    return rows;
  } catch (error) {
    return {error: 500, message: 'db error'};
  }
};

/**
 * Check for a existing pair
 * @async
 * @param {Int} patientId
 * @param {Int} doctorId
 * @return {Boolean}
 */
const pairExistsAlready = async (patientId, doctorId) => {
  try {
    const sql = 'SELECT pair_id FROM DoctorPatient WHERE patient_id=? and doctor_id=?';
    const params = [patientId, doctorId];
    const [rows] = await promisePool.query(sql, params);
    // if nothing is found with the user id, result array is empty []
    if (rows.length === 0) {
      return false;
    } else {
      return true;
    }
  } catch (error) {
    console.error('pairExistsAlready', error);
    return {error: 500, message: 'db error'};
  }
};

/**
 * Change password for a doctor user
 * @async
 * @param {Int} userId
 * @param {string} newPasswordHash
 * @return {Object} Result
 */
const updateDoctorPasswordWithId = async (userId, newPasswordHash) => {
  try {
    const sql = `UPDATE Users SET password=? WHERE user_id=? AND user_level='doctor'`;
    const [rows] = await promisePool.query(sql, [newPasswordHash, userId]);
    return rows;
  } catch (error) {
    console.error('Error in updateDoctorPasswordWithId:', error);
    throw customError('db error', 500);
  }
};

/**
 * Delete pair using patient and doctor ID's
 * @async
 * @param {Int} doctorId
 * @param {Int} patientId
 * @return {object} Result
 */
const deletePair = async (doctorId, patientId) => {
  try {
    const sql = `DELETE FROM DoctorPatient WHERE doctor_id=? AND patient_id=?`;
    const [rows] = await promisePool.query(sql, [doctorId, patientId]);
    // Check if any rows were affected
    if (rows.affectedRows === 0) {
      // Return a 500 error
      return {error: 500, message: 'No affected rows because pair was not found'};
    }
    return rows;
  // Handle errors
  } catch (error) {
    console.error('Error in deletePair:', error);
    return {error: 500, message: 'db error'};
  }
};

/**
 * Get selected doctor for patient user
 * @async
 * @param {Int} userId
 * @return {Object} Result
 */
const getOwnDoctor = async (userId) => {
  try {
    const sql = `
      SELECT
        u.user_id,
        u.username,
        u.full_name,
        u.user_level,
        u.created_at
      FROM Users u
      INNER JOIN DoctorPatient DP ON u.user_id = DP.doctor_id
      WHERE DP.patient_id=?;
      `;
    const [rows] = await promisePool.query(sql, [userId]);
    // if nothing is found with the user id, result array is empty []
    return rows;
  } catch (error) {
    console.error('getOwnDoctor', error);
    return {error: 500, message: 'db error'};
  };
};

/**
 * Get a list of patients that have selected a specific doctor
 * @async
 * @param {Int} userId
 * @return {List} Result. Empty search is returned as a error
 */
const getOwnPatients = async (userId) => {
  try {
    const sql = `
      SELECT
          u.user_id,
          u.username,
          u.full_name,
          u.user_level,
          u.created_at,
          DP.pair_id
      FROM
          Users u
      INNER JOIN
          DoctorPatient DP ON u.user_id = DP.patient_id
      WHERE
          DP.doctor_id=?;
        `;
    const [rows] = await promisePool.query(sql, [userId]);
    if (rows.length === 0) {
      return {error: 404, message: 'There is no patients sharing data with this doctor user'};
    };
    return rows;
  } catch (error) {
    console.error('getOwnPatients', error);
    return {error: 500, message: 'db error'};
  };
};

/**
 * Check for a existing pair using doctor and patient ID's
 * @async
 * @param {Int} patientId
 * @param {Int} doctorId
 * @return {List} Result. Empty search is returned as a error
 */
const getDoctorPatientPair = async (patientId, doctorId) => {
  try {
    const sql = `SELECT * FROM DoctorPatient WHERE patient_id=? AND doctor_id=?;`;
    const params = [patientId, doctorId];
    const [rows] = await promisePool.query(sql, params);
    if (rows.length === 0) {
      return {error: 403, message: `Requested patient is not sharing data with doctor_id=${doctorId}`};
    } else {
      return rows[0];
    };
  } catch (error) {
    console.error('getDoctorPatientPair', error);
    return {error: 500, message: 'db error'};
  };
};

export {
  updateDoctorPasswordWithId,
  selectUserByUsername,
  checkSurveyExistance,
  getDoctorPatientPair,
  selectDoctorByEmail,
  selectUserByEmail,
  pairExistsAlready,
  getOwnPatients,
  insertNewPair,
  insertDoctor,
  getOwnDoctor,
  insertUser,
  deletePair,
};
