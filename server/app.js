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

 
app.post("/register",async (req,res)=>{
      const {name, email} = req.body

      const findUser = db.prepare('SELECT * FROM users WHERE email = ?');
      const findUserResult = findUser.all(email);


      if(findUserResult.length < 1){
            try {
                 const registerUser = db.prepare("INSERT INTO users(email,name,uuid) VALUES(?,?,?)"); 
                 const registerResult = registerUser.run(email,name,uuidv4());
                 res.json({message:"User registered successfully"})

            } catch (err) {
                  res.json({
                        message:"Register failed",
                        error:err
                  })
            }
      }else{
            res.json({message:"User already exists"})
      }
})


app.post("/login", async (req,res)=>{
      const {email} = req.body;

      try {
            const login = db.prepare("SELECT * FROM users WHERE email = ?")
            const loginRes = login.get(email)
            if(!loginRes){
                 return res.status(404).json({
                        message:"User does not exist"
                  })
            }
            currentUser = loginRes.uuid
            return res.json({
                  message:"Login successful",
                  email:loginRes.email,
                  name:loginRes.name,
                  uuid:loginRes.uuid
            })
      } catch (err) {
            return res.status(500).json({
                  message:"Login failed",
                  Error:err
            })
      }
})


app.post("/newQuery", async (req,res)=>{
    const {query} = req.body
    /*
      Logic to get query type 
    */
      let queryType
      try {
            const insertQeury = db.prepare('INSERT INTO queries(user_id,query_text)');
            const insertResult = insertQeury.run(currentUser,query);
      } catch (error) {
            return res.json({
                  message:"Failed to insert query"
            })
      } 
      let response 
       /*
            Logic to send answer
      */
      res.json({message:""})
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

