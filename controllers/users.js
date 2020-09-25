const mysql = require('mysql')
const pool = require('../sql/connection')
const { handleSQLError } = require('../sql/error')

const getAllUsers = (req, res) => {
  // SELECT ALL USERS
  let sql = "SELECT * FROM users JOIN usersContact ON users.id = usersContact.user_id JOIN usersAddress ON users.id = usersAddress.user_id;"
  pool.query(sql, (err, rows) => {
    if (err) return handleSQLError(res, err)
    return res.json(rows);
  })
}

const getUserById = (req, res) => {
  // SELECT USERS WHERE ID = <REQ PARAMS ID>
  let sql = "SELECT * FROM users WHERE id = ?"
  // WHAT GOES IN THE BRACKETS
  sql = mysql.format(sql, [req.params.id])

  pool.query(sql, (err, rows) => {
    if (err) return handleSQLError(res, err)
    return res.json(rows);
  })
}

const createUser = (req, res) => {
  // INSERT INTO USERS FIRST AND LAST NAME 
  let sql = "INSERT INTO users (first_name, last_name) VALUES (?, ?);"
  // WHAT GOES IN THE BRACKETS
  sql = mysql.format(sql, [req.body.first_name, req.body.last_name]);

  pool.query(sql, (err, results) => {
    if (err) return handleSQLError(res, err)
    return res.json({ 
      newId: results.insertId,
      first_name: req.body.first_name,
      last_name: req.body.last_name
    });
  })
}

const updateUserById = (req, res) => {
  // UPDATE USERS AND SET FIRST AND LAST NAME WHERE ID = <REQ PARAMS ID>
  let sql = "UPDATE users SET first_name = ?, last_name = ? WHERE id = ?"
  // WHAT GOES IN THE BRACKETS
  sql = mysql.format(sql, [req.body.first_name, req.body.last_name, req.params.id])

  pool.query(sql, (err, results) => {
    if (err) return handleSQLError(res, err)
    // return res.status(204)
    return res.json({ 
        id: req.params.id,
        first_name: req.body.first_name,
        last_name: req.body.last_name
      })
  })
}

const deleteUserByFirstName = (req, res) => {
  // DELETE FROM USERS WHERE FIRST NAME = <REQ PARAMS FIRST_NAME>
  let sql = "DELETE FROM users WHERE first_name = ?"
  // WHAT GOES IN THE BRACKETS
  sql = mysql.format(sql, [req.body.first_name])

  pool.query(sql, (err, results) => {
    if (err) return handleSQLError(res, err)
    return res.json({ message: `Deleted ${results.affectedRows} user(s)` });
  })
}

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUserById,
  deleteUserByFirstName
}