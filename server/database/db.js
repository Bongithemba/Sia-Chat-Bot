import Database from "better-sqlite3";

const db = new Database("./app.db");

const insertUser = db.prepare("INSERT INTO users(name,email,uuid)");
const insertQuery =db.prepare("INSERT INTO queries(query,query_solved,user_id)");
export default db;

