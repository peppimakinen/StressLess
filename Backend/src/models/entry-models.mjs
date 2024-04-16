/* eslint-disable camelcase */
import promisePool from '../utils/database.mjs';


const getEntryUsingDate = async (userId, date) => {
  try {
    const sql = `
    SELECT
      entry_id, 
      user_id,
      DATE_FORMAT(entry_date, '%Y-%m-%d') AS entry_date,
      mood_color,
      notes
    FROM 
      DiaryEntries 
    WHERE 
      user_id=?
    AND
      entry_date=?
    ;`;
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

const getEntriesFromSpecificMonthForPatient = async (year, month, userId) => {
  try {
    const sql = `
    SELECT 
        Users.user_id,
        DiaryEntries.entry_id,
        DATE_FORMAT(DiaryEntries.entry_date, '%Y-%m-%d') AS entry_date,
        DiaryEntries.mood_color,
        DiaryEntries.notes,
        Measurements.measurement_id,
        DATE_FORMAT(Measurements.measurement_date, '%Y-%m-%d')
          AS measurement_date,
        Measurements.mean_hr_bpm,
        Measurements.sns_index,
        Measurements.pns_index,
        Measurements.stress_index
    FROM 
        Users
    JOIN 
        DiaryEntries ON Users.user_id = DiaryEntries.user_id
    JOIN 
        DM ON DiaryEntries.entry_id = DM.e_id
    JOIN 
        Measurements ON DM.m_id = Measurements.measurement_id
    WHERE 
        YEAR(DiaryEntries.entry_date)=? 
        AND MONTH(DiaryEntries.entry_date)=?
        AND Users.user_id=?;`;

    const params = [year, month, userId];
    const [rows] = await promisePool.query(sql, params);
    // return all found entries
    return rows;
  } catch (error) {
    console.error('getEntriesFromSpecificMonth', error);
    return {error: 500, message: 'db error'};
  }
};

const getEntriesFromSpecificMonthForDoctor = async (year, month, patienId) => {
  try {
    const sql = `
    SELECT 
        Users.user_id,
        DATE_FORMAT(entry_date, '%Y-%m-%d') AS entry_date,
        DiaryEntries.entry_date,
        DiaryEntries.mood_color,
        DiaryEntries.notes,
        Measurements.*
    FROM 
        Users
    JOIN 
        DiaryEntries ON Users.user_id = DiaryEntries.user_id
    JOIN 
        DM ON DiaryEntries.entry_id = DM.e_id
    JOIN 
        Measurements ON DM.m_id = Measurements.measurement_id
    WHERE 
        YEAR(DiaryEntries.entry_date)=? 
        AND MONTH(DiaryEntries.entry_date)=?
        AND Users.user_id=?;`;

    const params = [year, month, patienId];
    const [rows] = await promisePool.query(sql, params);
    // if nothing is found with the user id, result array is empty []
    if (rows.length === 0) {
      return {error: 404, message: `No entries found in ${month}/${year} `};
    }
    // return all found entries
    return rows;
  } catch (error) {
    console.error('getEntriesFromSpecificMonthForDoctor', error);
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
        DATE_FORMAT(M.measurement_date, '%Y-%m-%d') AS measurement_date,
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
  const sql = 
  `INSERT INTO Measurements (
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


export {
  addEntry,
  getEntryUsingDate,
  selectEntryById,
  addAllActivities,
  addMeasurement,
  getMeasurementsForPatient,
  connectMeasurementToEntry,
  getEntriesFromSpecificMonthForPatient,
  getEntriesFromSpecificMonthForDoctor,
  getActivitiesForEntry,
};
