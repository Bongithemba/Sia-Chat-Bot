import express from "express";
import pg from pg;
import { Pool } from "pg-pool";
import fs from "fs/promises";
import { parseString } from "xml2js";

import "dotenv/config";

const app = express()
const port = 3000

let clientURL=""

app.use(express.static(clientURL))

const pool = new Pool({
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  database: process.env.PG_DATABASE
})

let currentUser 


app.listen(port, ()=>{
      console.log(`App running on port ${port}`)
})

app.post("/Register",async (req,res)=>{
      const {name, email} = req.body

      const checkUser = await pool.qeuery('SELECT * FROM USERS WHERE email = $1',[email])
      if(!checkUser.rows){
            try {
                  const result = await pool.query('INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *', [username, password])
                  currentUser =
                  res.json(result.rows[0])
            } catch (error) {
                  console.log(error)
                  res.send('Error registering user').json({error:error})
            }
      }else{
            res.json({message:"User already exists"})

      }
})


app.post("/login", async (req,res)=>{
      const {name,email} = req.body;

      try {
            const response = await pool.query('SELECT * FROM users WHERE email = $1',[email]);
            const result = response.rows[0]
            currentUser = result.uuid
      } catch (error) {
            console.log(error)
            res.json({message:"User not found"})
      }
})




app.post("/newQuery", async (req,res)=>{
    const {query} = req.bodY 
    try {
      const response = await pool.query('INSERT INTO queries (query, user_id) VALUES ($1, $2) RETURNING *', [query, currentUser])
      
    } catch (error) {
      
    }  
})
