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
    };
    return rows[0];
  } catch (error) {
    console.error('getFirstEntryDate', error);
    return {error: 500, message: 'db error'};
  }
};

export {getFirstEntryDate};