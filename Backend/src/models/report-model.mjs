import promisePool from '../utils/database.mjs';

/**
 * Get weeks that containe reports
 * @async
 * @param {int} userId
 * @return {List} Found reports with report ID. Returns a error if list is empty
 */
const getAvailableReportDates = async (userId) => {
  try {
    const sql = `
    SELECT
      user_id,
      report_id,
      week_number,
      DATE_FORMAT(week_start_date, '%Y-%m-%d') AS week_start_date,
      DATE_FORMAT(week_end_date, '%Y-%m-%d') AS week_end_date
    FROM WeeklyReports WHERE user_id=?;`;
    const [rows] = await promisePool.query(sql, userId);
    if (rows.length === 0) {
      return {error: 404, message: `No reports found with user_id=${userId}`};
    }
    return rows;
  } catch (error) {
    console.error('getAvailableReportDates', error);
    return {error: 500, message: 'db error'};
  }
};

/**
 * Get specific report with report ID
 * @async
 * @param {Int} userId
 * @param {Int} reportId
 * @return {Object} Result. Returns a error if result is empty
 */
const getReport = async (userId, reportId) => {
  try {
    const sql = `
    SELECT
      user_id,
      report_id, 
      week_number,
      DATE_FORMAT(week_start_date, '%Y-%m-%d') AS week_start_date,
      DATE_FORMAT(week_end_date, '%Y-%m-%d') AS week_end_date,
      red_percentage,
      green_percentage,
      yellow_percentage,
      gray_percentage,
      monday_si,
      tuesday_si,
      wednesday_si,
      thursday_si,
      friday_si,
      saturday_si,
      sunday_si,
      week_si_avg,
      previous_week_si_avg,
      DATE_FORMAT(created_at, '%Y-%m-%d') AS created_at
    FROM WeeklyReports
    WHERE user_id=?
    AND report_id=?;`;
    const params = [userId, reportId];
    const [rows] = await promisePool.query(sql, params);
    if (rows.length === 0) {
      return {error: 404, message: `Report_id=${reportId} not found`};
    }
    return rows[0];
  } catch (error) {
    console.error('getReport', error);
    return {error: 500, message: 'db error'};
  }
};

/**
 * Get the date for first entry for specific user ID
 * @async
 * @param {Int} userId
 * @return {Object} Result. Returns a error if result is empty
 */
const getFirstEntryDateByUserId = async (userId) => {
  try {
    const sql = `
        SELECT
            entry_id,
            user_id,
            DATE_FORMAT(entry_date, '%Y-%m-%d') AS entry_date
        FROM DiaryEntries
        WHERE user_id=?
        ORDER BY entry_date
        LIMIT 1;
        `;
    const [rows] = await promisePool.query(sql, userId);
    if (rows.length === 0) {
      return {error: 404, message: `No entries found with user_id=${userId}`};
    }
    return rows[0];
  } catch (error) {
    console.error('getFirstEntryDateByUserId', error);
    return {error: 500, message: 'db error'};
  }
};

/**
 * Get data from DiaryEntries and Measurements between two dates
 * @async
 * @param {Int} userId
 * @param {Date} startDate
 * @param {endDate} endDate
 * @return {List} Result. Returns a empty list if result is null
 */
const getReportData = async (userId, startDate, endDate) => {
  try {
    const sql = `
        SELECT
            de.entry_id,
            de.user_id,
            DATE_FORMAT(de.entry_date, '%Y-%m-%d') AS entry_date,
            de.mood_color,
            de.created_at,
            DATE_FORMAT(m.measurement_date, '%Y-%m-%d') AS measurement_date,
            m.stress_index
        FROM DiaryEntries de
        JOIN DM ON de.entry_id = DM.e_id
        JOIN Measurements m ON DM.m_id = m.measurement_id
        WHERE de.user_id=?
        AND de.entry_date BETWEEN ? AND ?;`;
    const params = [userId, startDate, endDate];
    const [rows] = await promisePool.query(sql, params);
    return rows;
  } catch (error) {
    console.error('getReportData', error);
    return {error: 500, message: 'db error'};
  }
};

/**
 * Insert a new report to WeeklyReports
 * @async
 * @param {List} params List containing data for each column in order
 * @return {List} Result.
 */
const addWeekReport = async (params) => {
  try {
    const sql = `
      INSERT INTO WeeklyReports
        (user_id, week_number, week_start_date, week_end_date, red_percentage,
        green_percentage, yellow_percentage, gray_percentage,
        monday_si, tuesday_si, wednesday_si, thursday_si,
        friday_si, saturday_si, sunday_si, week_si_avg,
        previous_week_si_avg
        )
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);`;
    const [rows] = await promisePool.query(sql, params);
    return rows;
  } catch (error) {
    console.error('addWeekReport', error);
    return {error: 500, message: 'db error'};
  }
};

/**
 * Get latest weekly report dates
 * @async
 * @param {Int} userId
 * @return {Object} Result
 */
const getLatestReportDateByUserId = async (userId) => {
  try {
    const sql = `
        SELECT
            report_id,
            user_id,
            DATE_FORMAT(week_start_date, '%Y-%m-%d') AS week_start_date,
            DATE_FORMAT(week_end_date, '%Y-%m-%d') AS week_end_date
        FROM WeeklyReports
        WHERE user_id=?
        ORDER BY week_end_date DESC
        LIMIT 1;
        `;
    const [rows] = await promisePool.query(sql, userId);
    return rows;
  } catch (error) {
    console.error('getLatestReportDate', error);
    return {error: 500, message: 'db error'};
  }
};

/**
 * Get Stress index for specific date
 * @async
 * @param {Date} endDate
 * @param {Int} userId
 * @return {Object} Result
 */
const getStressIndexByDates = async (endDate, userId) => {
  try {
    const sql = `
        SELECT
          week_si_avg
        FROM WeeklyReports
        WHERE user_id=?
        AND week_end_date=?;`;
    const params = [userId, endDate];
    const [rows] = await promisePool.query(sql, params);
    return rows;
  } catch (error) {
    console.error('getStressIndexByDates', error);
    return {error: 500, message: 'db error'};
  };
};

export {
  getLatestReportDateByUserId,
  getFirstEntryDateByUserId,
  getAvailableReportDates,
  getStressIndexByDates,
  getReportData,
  addWeekReport,
  getReport,
};
