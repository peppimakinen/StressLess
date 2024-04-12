import promisePool from '../utils/database.mjs';

const getFirstEntryDate = async (userId) => {
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
    console.error('getFirstEntryDate', error);
    return {error: 500, message: 'db error'};
  }
};

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
    if (rows.length === 0) {
      return {
        error: 404,
        message: `No entries found between ${startDate} and ${endDate}`,
        errors: 'Report cant be calculated without entry data',
      };
    }
    return rows;
  } catch (error) {
    console.error('getAnalysisData', error);
    return {error: 500, message: 'db error'};
  }
};

export {getFirstEntryDate, getReportData};
