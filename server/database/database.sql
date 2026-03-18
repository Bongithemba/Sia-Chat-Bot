CREATE TABLE IF NOT EXISTS users(
      uuid TEXT PRIMARY KEY,
      name TEXT,
      email TEXT UNIQUE
      )



-- queries;
 CREATE TABLE IF NOT EXISTS queries(
      query_id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      query TEXT,
      query_solved INTEGER NOT NULL CHECK (query_solved IN(0,1)) DEFAULT (0),
      FOREIGN KEY(user_id) REFERENCES users(uuid)
      )



