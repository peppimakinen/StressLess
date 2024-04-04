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

const addEntry = async (user, entry) => {
  const {entry_date, mood_color, weight, sleep_hours, notes} = entry;
  // eslint-disable-next-line max-len
  const sql = `INSERT INTO DiaryEntries (user_id, entry_date, mood_color, weight, sleep_hours, notes)
  VALUES (?, ?, ?, ?, ?, ?)`;
  const params = [
    user.user_id,
    entry_date,
    mood_color,
    weight,
    sleep_hours,
    notes,
  ];
  try {
    const rows = await promisePool.query(sql, params);
    return rows;
  } catch (error) {
    console.log('addEntry', error);
    return {error: 500, message: 'db error'};
  }
};

const postEntry = async (req, res) => {
  const {user_id, entry_date, mood, weight, sleep_hours, notes} = req.body;
  if (entry_date && (weight || mood || sleep_hours || notes) && user_id) {
    const result = await addEntry(req.body);
    if (result.entry_id) {
      res.status(201);
      res.json({message: 'New entry added.', ...result});
    } else {
      res.status(500);
      res.json(result);
    }
  } else {
    res.sendStatus(400);
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
  listAllEntries,
  deleteEntryByIdAdmin,
  selectEntryById,
  updateEntryById,
  postEntry,
  deleteEntryByIdUser,
  listAllEntriesByUserId,
};
