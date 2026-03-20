import Database from "better-sqlite3";

const db = new Database("app.db");




//Create users table
db.prepare(`
      CREATE TABLE IF NOT EXISTS users(
      uuid TEXT PRIMARY KEY,
      name TEXT,
      email TEXT UNIQUE
      )
      `
).run();

//Create query table
db.prepare( `
      CREATE TABLE IF NOT EXISTS queries(
      query_id INTEGER PRIMARY KEY ,
      user_id TEXT NOT NULL,
      query_text TEXT,
      query_solved INTEGER NOT NULL CHECK (query_solved IN(0,1)) DEFAULT (0),
      FOREIGN KEY(user_id) REFERENCES users(uuid)
      )
      `
).run();




export default db;

