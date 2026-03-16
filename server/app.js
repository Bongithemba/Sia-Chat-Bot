import express from "express";
import Database from "better-sqlite3";
import fs from "fs/promises";
import { parseString } from "xml2js";
import db from "./database/db.js"
import { v4 as uuidv4 } from 'uuid';

const app = express()
const port = 3000


let currentUser = 'b0ed2a26-0148-4276-8481-5173d06996ea'

app.use(express.urlencoded({extended:true}))
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



//CREATE
//USER

app.post('/newUser', async (req,res)=>{
      const {name,email}= req.body;

      try {

            const query = db.prepare('INSERT INTO users(uuid,name,email) VALUES (?,?,?)');
            const result = query.run(uuidv4(),name,email);
            res.send(result)
      } catch (error) {
            res.send(error)  
      }
      
})


//QUERY

app.post("/newQuery", async (req,res)=>{
      const {query} =req.body;

      try {
            const stmnt = db.prepare('INSERT INTO queries(user_id,query_text) VALUES(?,?)');
            const result= stmnt.run(currentUser,query);
            console.log(result)
            res.send("done")
            
            
      } catch (error) {
            console.log(error)
            res.send(error)
      }
      
})

//READ
//users

app.get('/users', async (req,res)=>{
      const query = db.prepare('SELECT * FROM users');
      const result = query.all();
      console.log()
      res.send(result)
})
//queries
app.get('/queries', async (req,res)=>{
      const query = db.prepare('SELECT * FROM queries');
      const result = query.all();
      res.send(result)
})

