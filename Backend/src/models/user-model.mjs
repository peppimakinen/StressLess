/* eslint-disable max-len */
import promisePool from '../utils/database.mjs';

// Get all users in database - For admin
const listAllUsers = async () => {
  try {
    // Get user data, exercise count and diary entry count.
    const sql = `
    SELECT
      user_id,
      username,
      email,
      created_at,
      user_level
    FROM
        Users;`;
    // Returns a empty list if no users found
    const [rows] = await promisePool.query(sql);
    return rows;
  } catch (error) {
    console.error('listAllUsers', error);
    return {error: 500, message: error};
  }
};
// Get specific user in db
const selectUserById = async (id) => {
  try {
    const sql =
      `SELECT user_id, username, user_level, created_at from Users`;
    const params = [id];
    const [rows] = await promisePool.query(sql, params);
    // if nothing is found with the user id, result array is empty []
    if (rows.length === 0) {
      return {error: 404, message: 'User not found'};
    }
    return rows[0];
  } catch (error) {
    console.error('selectUserById', error);
    return {error: 500, message: 'db error'};
  }
};


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

// update user in db
const updateUserById = async (user) => {
  try {
    const sql =
      'UPDATE Users SET username=?, password=?, email=? WHERE user_id=?';
    const params = [user.username, user.password, user.email, user.user_id];
    const [result] = await promisePool.query(sql, params);
    console.log(result);
    // Check were any rows affected
    if (result.affectedRows === 0) {
      // 0 Affected rows mean that matching user_id was not found
      return {error: 404, message: 'Matching User ID not found'};
    } else {
      // Request ok
      return {message: 'user data updated', user_id: user.user_id};
    }
  } catch (error) {
    console.log('updateUserById', error);
    // Lack of username/email uniqueness will raise a error
    if (error.errno === 1062) {
      // If username/email was not unique, return conflict response
      return {error: 409, message: 'Username or email address taken'};
    } else {
      // Return generic database error
      return {error: 500, message: 'db error'};
    }
  }
};

// delete user in db
const deleteUserById = async (id) => {
  try {
    const sql = 'DELETE FROM Users WHERE user_id=?';
    const params = [id];
    const [result] = await promisePool.query(sql, params);
    console.log(result);

    // User id not found
    if (result.affectedRows === 0) {
      return {error: 404, message: 'User not found'};
    }
    return {message: 'User deleted', user_id: id};
  } catch (error) {
    // note that users with other data (FK constraint) cant be deleted directly
    if (error.errno === 1451) {
      return {error: 500, message: 'FK constraint'};
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
      return {error: 404, message: 'user not found'};
    }
    return rows[0];
  } catch (error) {
    console.error('selectUserByEmail', error);
    return {error: 500, message: 'db error'};
  }
};


export {
  selectUserByUsername,
  listAllUsers,
  selectUserById,
  checkSurveyExistance,
  insertUser,
  updateUserById,
  deleteUserById,
  selectUserByEmail,
  insertDoctor,
  selectDoctorByEmail,
};
