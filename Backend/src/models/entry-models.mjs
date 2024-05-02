import promisePool from '../utils/database.mjs';

/**
 * Get specific entry using entry date
 * @async
 * @param {Int} userId
 * @param {Date} date Date of entry
 * @return {Object} Search result. Empty list is not returned
 */
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
  // Handle errors
  } catch (error) {
    console.error('getEntryUsingDate', error);
    return {error: 500, message: 'db error'};
  }
};

/**
 * Update a specific entry using entry ID
 * @async
 * @param {List} params List containing entry date, color and notes
 * @param {Int} entryId Entry ID for a specific entry
 * @return {Object} result
 */
const updateEntry = async (params, entryId) => {
  try {
    const sql = `
      UPDATE DiaryEntries
        set entry_date=?, mood_color=?, notes=?
      WHERE 
        entry_id=?;`;
    // Add entry ID to params list
    params.push(entryId);
    const rows = await promisePool.query(sql, params);
    return rows;
  // Handle errors
  } catch (error) {
    console.error('updateEntry', error);
    return {error: 500, message: 'db error'};
  }
};

/**
 * Get all entries with limited HRV data for a specific month and user ID
 * @async
 * @param {Int} year year between 2020-2030
 * @param {Int} month
 * @param {Int} userId
 * @return {List} List with search results. Empty list is also returned
 */
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
  // Handle errors
  } catch (error) {
    console.error('getEntriesFromSpecificMonth', error);
    return {error: 500, message: 'db error'};
  }
};

/**
 * Get all entries with full hrv data for a specific month and user ID
 * @async
 * @param {Int} year year between 2020-2030
 * @param {Int} month
 * @param {Int} patienId Patient ID is the same as user ID
 * @return {List} List with search results. Empty list is also returned
 */
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
  // Handle errors
  } catch (error) {
    console.error('getEntriesFromSpecificMonthForDoctor', error);
    return {error: 500, message: 'db error'};
  }
};

/**
 * Get all activities that are linked to a specific entry with date
 * @async
 * @param {Int} entryId
 * @param {Int} userId
 * @param {Date} entryDate
 * @return {List} List with search results. Empty list is also returned
 */
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
  // Handle errors
  } catch (error) {
    console.error('getActivitiesForEntry', error);
    return {error: 500, message: 'db error'};
  }
};

/**
 * Get limited HRV values that are linked to a specific entry with entry ID
 * @async
 * @param {Int} entryId
 * @param {Int} userId
 * @param {Date} date
 * @return {Object} Result. Empty list is not returned
 */
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
    // if nothing is found, return a error
    if (rows.length === 0) {
      return {
        error: 404,
        message: `No measurements found with entry_id=${entryId}`,
      };
    }
    // return first item from result
    return rows[0];
  // Handle errors
  } catch (error) {
    console.error('getMeasurementsForPatient', error);
    return {error: 500, message: 'db error'};
  }
};

/**
 * Get all HRV values that are linked to a specific entry with entry ID
 * @async
 * @param {Int} entryId
 * @param {Int} userId
 * @param {Date} date
 * @return {Object} result. Empty list is not returned
 */
const getMeasurementsForDoctor = async (entryId, userId, date) => {
  try {
    const sql = `
    SELECT
        M.measurement_id,
        M.kubios_result_id,
        DATE_FORMAT(M.measurement_date, '%Y-%m-%d')
          AS measurement_date,
        M.artefact_level,
        M.lf_power,
        M.lf_power_nu,
        M.hf_power,
        M.hf_power_nu,
        M.tot_power,
        M.mean_hr_bpm,
        M.mean_rr_ms,
        M.rmssd_ms,
        M.sd1_ms,
        M.sd2_ms,
        M.sdnn_ms,
        M.sns_index,
        M.pns_index,
        M.stress_index,
        M.respiratory_rate,
        M.user_readiness,
        M.user_recovery,
        M.user_happiness,
        M.result_type
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
    // if nothing is found, return a error
    if (rows.length === 0) {
      return {
        error: 404,
        message: `No measurements found with entry_id=${entryId}`,
      };
    }
    // Return first item from result
    return rows[0];
  // Handle errors
  } catch (error) {
    console.error('getMeasurementsForDoctor', error);
    return {error: 500, message: 'db error'};
  }
};

/**
 * Add new entry data to DiaryEntries table
 * @async
 * @param {List} params data for columns
 * @return {Object} results
 */
const addEntry = async (params) => {
  const sql = `INSERT INTO DiaryEntries (user_id, entry_date, mood_color, notes)
  VALUES (?, ?, ?, ?)`;
  try {
    const rows = await promisePool.query(sql, params);
    // Return result
    return rows[0];
  // Handle errors
  } catch (error) {
    console.log('addEntry', error);
    return {error: 500, message: 'Failed to add a new DiaryEntry'};
  }
};

/**
 * Delete all activities linked to a specific entry
 * @async
 * @param {Int} entryId
 * @return {Object} results
 */
const deleteExistingActivities = async (entryId) => {
  const sql = `DELETE FROM CompletedActivities WHERE e_id=?; `;
  try {
    const rows = await promisePool.query(sql, entryId);
    return rows[0];
  } catch (error) {
    console.error('deleteExistingEntries', error);
    return {error: 500, message: 'Failed to delete activities'};
  };
};

/**
 * Take a list of activities and add them seperatly to CompletedActivities
 * @async
 * @param {Int} entryId
 * @param {List} activitiesList List of completed activities on specific date
 * @return {List} insertedRows
 */
const addAllActivities = async (entryId, activitiesList) => {
  const sql = `INSERT INTO CompletedActivities (e_id, activity_name)
    VALUES (?, ?)`;
  // Initialize a list to save result data
  const insertedRows = [];
  // Enter a try block
  try {
    // Iterate over every list item / activity
    for (const activity of activitiesList) {
      // Insert activity to db
      const params = [entryId, activity];
      const [rows] = await promisePool.query(sql, params);
      // Save result to list
      insertedRows.push(rows);
    }
    // Return saved data from all operations
    return insertedRows;
  // Handle errors
  } catch (error) {
    console.error('addAllActivities error:', error);
    return {error: 500, message: 'db error'};
  }
};

/**
 * Take a list of HRV values and add them to a specific diary entry
 * @async
 * @param {List} params All needed HRV values from kubios in the correct order
 * @return {Object} results
 */
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
  // Handle errors
  } catch (error) {
    console.error('addMeasurement', error);
    return {error: 500, message: 'db error'};
  }
};

/**
 * Update measurements that are linked to specific entry ID
 * @async
 * @param {List} params All needed HRV values from kubios in the correct order
 * @param {int} entryId
 * @return {Object} results
 */
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
  // Handle errors
  } catch (error) {
    console.error('updateEntryMeasurements', error);
    return {error: 500, message: 'db error'};
  }
};

/**
 * Use DM table to connect a set of measurements to one specific entry
 * @async
 * @param {int} entryId
 * @param {Int} measurementId
 * @return {Object} results
 */
const connectMeasurementToEntry = async (entryId, measurementId) => {
  const sql = `INSERT INTO DM (m_id, e_id) VALUES (?, ?)`;
  const params = [measurementId, entryId];
  try {
    const rows = await promisePool.query(sql, params);
    return rows[0];
  // Handle errors
  } catch (error) {
    console.log('connectMeasurementToEntry', error);
    return {error: 500, message: 'db error'};
  }
};

/**
 * Get count for specific users all entries
 * @async
 * @param {int} userId
 * @return {Object} results
 */
const getEntryCount = async (userId) => {
  try {
    const sql = `
    SELECT 
      COUNT(*) AS entry_count 
    FROM DiaryEntries
    WHERE user_id=?;`;
    const [rows] = await promisePool.query(sql, userId);
    return rows[0];
  // Handle errors
  } catch (error) {
    return {error: 500, message: 'db error'};
  };
};


export {
  getMonthlyEntriesForDoctor,
  getMeasurementsForPatient,
  connectMeasurementToEntry,
  deleteExistingActivities,
  getMonthlyPatientEntries,
  getMeasurementsForDoctor,
  updateEntryMeasurements,
  getActivitiesForEntry,
  getEntryUsingDate,
  addAllActivities,
  addMeasurement,
  getEntryCount,
  updateEntry,
  addEntry,
};
