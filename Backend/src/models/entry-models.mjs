/* eslint-disable camelcase */
import promisePool from '../utils/database.mjs';

// Get all entries in db - FOR ADMIN
const listAllEntries = async () => {
  try {
    const sql = 'SELECT * FROM DiaryEntries';
    const [rows] = await promisePool.query(sql);
    if (rows.length === 0) {
      // If there is no entries in db
      return {error: 404, message: 'No entries found'};
    } else {
      // return all found entries
      return rows;
    }
  } catch (error) {
    console.error('listAllEntries', error);
    return {error: 500, message: 'db error'};
  }
};

const getEntryUsingDate = async (userId, date) => {
  try {
    const sql = `SELECT * FROM DiaryEntries WHERE user_id=? AND entry_date=?;`;
    const params = [userId, date];
    const [rows] = await promisePool.query(sql, params);
    // if nothing is found with the user id, result array is empty []
    if (rows.length === 0) {
      return {error: 404, message: `No entry found with entry_date=${date} `};
    }
    // return all found entries
    return rows[0];
  } catch (error) {
    console.error('getEntryUsingDate', error);
    return {error: 500, message: 'db error'};
  }
};

const getActivitiesForEntry = async (entryId, userId, entryDate) => {
  try {
    const sql = `
    SELECT
        CA.activity_name
    FROM 
        CompletedActivities AS CA
    JOIN 
        DiaryEntries AS DE ON CA.e_id = DE.entry_id
    JOIN 
        Users AS U ON DE.user_id = U.user_id
    WHERE 
        U.user_id=?
        AND DE.entry_id=?
        AND DE.entry_date=?;`;
    const params = [userId, entryId, entryDate];
    const [rows] = await promisePool.query(sql, params);
    // return all found entries
    return rows;
  } catch (error) {
    console.error('getActivitiesForEntry', error);
    return {error: 500, message: 'db error'};
  }
};
const getMeasurementsForPatient = async (entryId, userId, date) => {
  try {
    const sql = `
      SELECT
          M.measurement_id,
          M.kubios_result_id,
          M.measurement_date,
          M.mean_hr_bpm,
          M.sns_index,
          M.pns_index,
          M.stress_index
      FROM 
          DM D
      JOIN 
          Measurements M ON D.m_id = M.measurement_id
      JOIN 
          DiaryEntries DE ON D.e_id = DE.entry_id
      JOIN 
          Users U ON DE.user_id = U.user_id
      WHERE 
          U.user_id=?
          AND DE.entry_id=?
          AND DE.entry_date=?;
    `;
    const params = [userId, entryId, date];
    const [rows] = await promisePool.query(sql, params);
    // if nothing is found with the user id, result array is empty []
    if (rows.length === 0) {
      return {
        error: 404,
        message: `No measurements found with entry_id=${entryId}`,
      };
    }
    // return all found entries
    return rows[0];
  } catch (error) {
    console.error('getMeasurementsForPatient', error);
    return {error: 500, message: 'db error'};
  }
};

// Get specific entry in db - FOR ADMIN
const selectEntryById = async (id) => {
  try {
    const sql = 'SELECT * FROM DiaryEntries WHERE user_id=?';
    const params = [id];
    const [rows] = await promisePool.query(sql, params);
    // if nothing is found with the user id, result array is empty []
    if (rows.length === 0) {
      return {error: 404, message: `No entries found with user_id = ${id} `};
    }
    // return all found entries
    return rows;
  } catch (error) {
    console.error('selectUserById', error);
    return {error: 500, message: 'db error'};
  }
};

// Get all entries in db - FOR USER
const listAllEntriesByUserId = async (id) => {
  try {
    const sql = 'SELECT * FROM DiaryEntries WHERE user_id=?';
    const params = [id];
    const [rows] = await promisePool.query(sql, params);
    return rows;
  } catch (error) {
    console.error('listAllEntriesByUserId', error);
    return {error: 500, message: 'db error'};
  }
};

const addEntry = async (params) => {
  const sql = `INSERT INTO DiaryEntries (user_id, entry_date, mood_color, notes)
  VALUES (?, ?, ?, ?)`;
  try {
    const rows = await promisePool.query(sql, params);
    return rows[0];
  } catch (error) {
    console.log('addEntry', error);
    return {error: 500, message: 'Failed to add a new DiaryEntry'};
  }
};

const addAllActivities = async (entryId, activitiesList) => {
  const sql = `INSERT INTO CompletedActivities (e_id, activity_name)
    VALUES (?, ?)`;
  const insertedRows = [];
  try {
    for (const activity of activitiesList) {
      const params = [entryId, activity];
      const [rows] = await promisePool.query(sql, params);
      insertedRows.push(rows);
    }
    return insertedRows;
  } catch (error) {
    console.log('addAllActivities error:', error);
    return {error: 500, message: 'Failed to add all activities'};
  }
};

const addMeasurement = async (params) => {
  const sql = `INSERT INTO Measurements (
      kubios_result_id, measurement_date, artefact_level, lf_power,
      lf_power_nu, hf_power, hf_power_nu, tot_power,
      mean_hr_bpm, mean_rr_ms, rmssd_ms, sd1_ms,
      sd2_ms, sdnn_ms, sns_index, pns_index,
      stress_index, respiratory_rate, user_readiness, user_recovery,
      user_happiness, result_type)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;
  try {
    const rows = await promisePool.query(sql, params);
    return rows[0];
  } catch (error) {
    console.log('addMeasurement', error);
    return {error: 500, message: 'Failed to add a new set of Measurements'};
  }
};

const connectMeasurementToEntry = async (entryId, measurementId) => {
  const sql = `INSERT INTO DM (m_id, e_id) VALUES (?, ?)`;
  const params = [measurementId, entryId];
  try {
    const rows = await promisePool.query(sql, params);
    return rows[0];
  } catch (error) {
    console.log('connectMeasurementToEntry', error);
    return {error: 500, message: 'Failed to connect measurement to entry'};
  }
};

// update entry in db usint entry_date
const updateEntryById = async (user) => {
  try {
    const sql =
      // eslint-disable-next-line max-len
      'UPDATE DiaryEntries SET entry_date=?, mood_color=?, weight=?, sleep_hours=?, notes=? WHERE entry_id=?';
    const params = [
      user.entry_date,
      user.mood_color,
      user.weight,
      user.sleep_hours,
      user.notes,
      user.entry_id,
    ];
    console.log('params', params);
    const [result] = await promisePool.query(sql, params);
    console.log(result);
    // Make sure to return ok only if a row was affected
    if (result.affectedRows) {
      return {message: 'Entry updated', user_id: user.userId};
    } else {
      // Entry was not found and/or affected
      return {error: 404, message: 'Entry not found'};
    }
  } catch (error) {
    // Catch possible database errors
    console.error('updateEntryById', error);
    return {error: 500, message: 'db error'};
  }
};

// delete entries in db using entry_date
const deleteEntryByIdUser = async (userId, entryId) => {
  try {
    const sql = 'DELETE FROM DiaryEntries WHERE entry_id=? and user_id=?';
    const params = [entryId, userId];
    const [result] = await promisePool.query(sql, params);
    console.log(result);
    if (result.affectedRows === 0) {
      return {error: 404, message: 'entry not found'};
    }
    return {message: 'Entry deleted', user_id: userId};
  } catch (error) {
    console.error('deleteEntryById', error);
    return {error: 500, message: 'db error'};
  }
};

const deleteEntryByIdAdmin = async (entryDate) => {
  try {
    const sql = 'DELETE FROM DiaryEntries WHERE entry_id=?';
    const params = [entryDate];
    const [result] = await promisePool.query(sql, params);
    console.log(result);
    if (result.affectedRows === 0) {
      return {error: 404, message: 'entry not found'};
    }
    return {message: 'Entry deleted'};
  } catch (error) {
    console.error('deleteEntryByIdAdmin', error);
    return {error: 500, message: 'db error'};
  }
};

const deleteAll = async (userId) => {
  try {
    const sql = 'DELETE FROM DiaryEntries WHERE user_id=?';
    const params = [userId];
    const [result] = await promisePool.query(sql, params);
    console.log(result);
    if (result.affectedRows === 0) {
      return {error: 404, message: 'Entries not found'};
    } else {
      return {message: 'Entries deleted'};
    }
  } catch (error) {
    console.error('deleteAll', error);
    return {error: 500, message: 'db error'};
  }
};

export {
  addEntry,
  deleteAll,
  getEntryUsingDate,
  listAllEntries,
  deleteEntryByIdAdmin,
  selectEntryById,
  addAllActivities,
  updateEntryById,
  addMeasurement,
  deleteEntryByIdUser,
  getMeasurementsForPatient,
  listAllEntriesByUserId,
  connectMeasurementToEntry,
  getActivitiesForEntry,
};
