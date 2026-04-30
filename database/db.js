const Database = require ('better-sqlite3');
const db = new Database('app.db')
db.pragma('foreign_keys = ON')


//Create users table
db.prepare(`
      CREATE TABLE IF NOT EXISTS users(
      uuid TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
      )
      `
).run();

//Create query table
db.prepare( `
      CREATE TABLE IF NOT EXISTS queries(
      query_id INTEGER PRIMARY KEY ,
      user_id TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      query_text TEXT,
      query_solved INTEGER NOT NULL CHECK (query_solved IN(0,1)) DEFAULT 1,
      FOREIGN KEY(user_id) REFERENCES users(uuid)
      )
      `
).run();






module.exports ={db}