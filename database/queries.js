const {db} = require('./db.js')

const queries = {
      insertUser:db.prepare('INSERT INTO users(uuid,name,email,password) VALUES(?,?,?,?) RETURNING *'),
      insertQuery: db.prepare('INSERT INTO queries(user_id,query_text) VALUES(?,?)'),
      updateQueryStatus:db.prepare('UPDATE queries SET query_solved = ? WHERE query_id = ?'),
      findUser:db.prepare('SELECT * FROM users WHERE email = ?'),

      getUsers: db.prepare('SELECT * FROM users'),
      getQueries: db.prepare('SELECT * FROM queries')
}


module.exports = {queries};