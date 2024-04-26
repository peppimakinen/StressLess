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

const updateEntry = async (params, entryId) => {
  try {
    const sql = `
      UPDATE DiaryEntries
        set entry_date=?, mood_color=?, notes=?
      WHERE 
        entry_id=?;`;
    params.push(entryId);
    const rows = await promisePool.query(sql, params);
    return rows;
  } catch (error) {
    console.error('updateEntry', error);
    return {error: 500, message: 'db error'};
  }
};

const getMonthlyPatientEntries = async (year, month, userId) => {
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

const getMonthlyEntriesForDoctor = async (year, month, patienId) => {
  try {
    const sql = `
    SELECT 
        Users.user_id,
        DATE_FORMAT(DiaryEntries.entry_date, '%Y-%m-%d') AS entry_date,
        DiaryEntries.mood_color,
        DiaryEntries.notes,
        DiaryEntries.entry_id,
        Measurements.measurement_id,
        Measurements.kubios_result_id,
        DATE_FORMAT(Measurements.measurement_date, '%Y-%m-%d')
          AS measurement_date,
        Measurements.artefact_level,
        Measurements.lf_power,
        Measurements.lf_power_nu,
        Measurements.hf_power,
        Measurements.hf_power_nu,
        Measurements.tot_power,
        Measurements.mean_hr_bpm,
        Measurements.mean_rr_ms,
        Measurements.rmssd_ms,
        Measurements.sd1_ms,
        Measurements.sd2_ms,
        Measurements.sdnn_ms,
        Measurements.sns_index,
        Measurements.pns_index,
        Measurements.stress_index,
        Measurements.respiratory_rate,
        Measurements.user_readiness,
        Measurements.user_recovery,
        Measurements.user_happiness,
        Measurements.result_type
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

const deleteExistingActivities = async (entryId) => {
  const sql = `DELETE FROM CompletedActivities WHERE e_id=?; `;
  try {
    const rows = await promisePool.query(sql, entryId);
    return rows[0];
  } catch (error) {
    console.log('deleteExistingEntries', error);
    return {error: 500, message: 'Failed to delete activities'};
  };
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
  const sql = `
  INSERT INTO Measurements (
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

const updateEntryMeasurements = async (params, entryId) => {
  const sql = `
    UPDATE Measurements m
    JOIN DM d ON m.measurement_id = d.m_id
    JOIN DiaryEntries e ON e.entry_id = d.e_id
    SET 
        m.kubios_result_id = ?, m.measurement_date = ?, m.artefact_level = ?,
        m.lf_power = ?,m.lf_power_nu = ?, m.hf_power = ?, m.hf_power_nu = ?,
        m.tot_power = ?, m.mean_hr_bpm = ?, m.mean_rr_ms = ?, m.rmssd_ms = ?,
        m.sd1_ms = ?, m.sd2_ms = ?, m.sdnn_ms = ?, m.sns_index = ?,
        m.pns_index = ?, m.stress_index = ?, m.respiratory_rate = ?,
        m.user_readiness = ?, m.user_recovery = ?, m.user_happiness = ?,
        m.result_type = ?
    WHERE e.entry_id = ?;`;
  try {
    // Add entryId to the params array
    params.push(entryId);
    const rows = await promisePool.query(sql, params);
    return rows[0];
  } catch (error) {
    console.log('updateEntryMeasurements', error);
    return {error: 500, message: 'Failed to update Measurements'};
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

const getEntryCount = async (userId) => {
  try {
    const sql = `
    SELECT 
      COUNT(*) AS entry_count 
    FROM DiaryEntries
    WHERE user_id=?;`;
    const [rows] = await promisePool.query(sql, userId);
    return rows[0];
  } catch (error) {
    return {error: 500, message: 'db error'};
  };
};


export {
  addEntry,
  updateEntry,
  getEntryCount,
  getEntryUsingDate,
  addAllActivities,
  deleteExistingActivities,
  addMeasurement,
  getMeasurementsForPatient,
  connectMeasurementToEntry,
  updateEntryMeasurements,
  getMonthlyPatientEntries,
  getMonthlyEntriesForDoctor,
  getActivitiesForEntry,
};
