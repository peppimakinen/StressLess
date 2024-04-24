/* eslint-disable max-len */
import promisePool from '../utils/database.mjs';

// create new user in db
const insertUser = async (user) => {
  try {
    const sql =
      'INSERT INTO Users (username, password, user_level, full_name) VALUES (?, ?, ?, ?)';
    const params = [user.username, user.password, user.user_level, user.full_name];
    const [result] = await promisePool.query(sql, params);
    return {message: 'new user created', user_id: result.insertId};
  } catch (error) {
    console.error('insertUser', error);
    if (error.errno == 1062) {
      return {error: 409, message: 'Username or email address taken'};
    } else {
      return {error: 500, message: 'db error'};
    }
  }
};

// create new user in db
const insertDoctor = async (username, password, fullname, userLevel) => {
  try {
    const sql =
      'INSERT INTO Users (username, password, full_name, user_level) VALUES (?, ?, ?, ?)';
    const params = [username, password, fullname, userLevel];
    const [result] = await promisePool.query(sql, params);
    return {message: 'new user created', user_id: result.insertId};
  } catch (error) {
    console.error('insertDoctor', error);
    if (error.errno == 1062) {
      return {error: 409, message: 'Username or email address taken'};
    } else {
      return {error: 500, message: 'db error'};
    }
  }
};
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

const checkSurveyExistance = async (id) => {
  try {
    const sql = 'SELECT * FROM Surveys WHERE u_id=?';
    const params = [id];
    const [rows] = await promisePool.query(sql, params);
    // if nothing is found with the user id, result array is empty []
    if (rows.length === 0) {
      return {error: 404, message: 'user not found'};
    }
    // console.log('Survey query result: ', rows[0]);
    return rows[0];
  } catch (error) {
    console.error('selectUserByEmail', error);
    return {error: 500, message: 'db error'};
  }
};

const selectDoctorByEmail = async (email) => {
  try {
    const sql = 'SELECT * FROM Users WHERE username=? and user_level="doctor"';
    const params = [email];
    const [rows] = await promisePool.query(sql, params);
    // if nothing is found with the user id, result array is empty []
    if (rows.length === 0) {
      return {error: 404, message: 'No doctor was found using the provided username'};
    }
    return rows[0];
  } catch (error) {
    console.error('selectUserByEmail', error);
    return {error: 500, message: 'db error'};
  }
};


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

export {
  selectUserByUsername,
  checkSurveyExistance,
  insertUser,
  selectUserByEmail,
  insertDoctor,
  selectDoctorByEmail,
  pairExistsAlready,
  insertNewPair,
  getOwnDoctor,
};
