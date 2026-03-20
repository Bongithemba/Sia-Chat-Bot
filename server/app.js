import express, { application } from "express";
import { v4 as uuidv4 } from 'uuid';
import db from "./database/db.js";
import { generateSolution, handleFeedback } from "./desicionLogic.js";

const app = express();
const port = 3000


app.use(express.urlencoded({extended:true}))

app.listen(port, ()=>{
      console.log(`App running on port:${port}`)
})

const queries = {
      insertUser:db.prepare('INSERT INTO users(uuid,name,email) VALUES(?,?,?) RETURNING *'),
      insertQuery: db.prepare('INSERT INTO queries(user_id,query_text) VALUES(?,?)'),
      updateQueryStatus:db.prepare('UPDATE queries SET query_solved = ?'),
      findUser:db.prepare('SELECT * FROM users WHERE EMAIL = ?'),

      getUsers: db.prepare('SELECT * FROM users'),
      getQueries: db.prepare('SELECT * FROM queries')
}


app.post('/newQuery',(req,res)=>{
      const {name, email,query} = req.body;
      let user
      try {
            user = queries.findUser.get(email);
      } catch (err) {
          return res.json({
            message:"Error getting user",
            error:err
          }) 
      }
      if(!user){
            try {
                  user = queries.insertUser.get(uuidv4(),name,email);
            } catch (err) {
                  return res.status().json({
                  message:"Error registering user",
                  Error:err
                  })
            }
            
      };
      try {
            const insertQrr = queries.insertQuery.run(user.uuid,query);
      } catch (err) {
            return res.status().json({
            message:"Error inserting query",
            Error:err
            }) 
      }
      
      /*
      genereateSolution(query)
      */

      res.status().json({
            message:"Query inserted successfuly",
            queryid:"",
            querySolution:""
      })
})

app.post('/updateQueryStatus', (req,res)=>{
      const status ='';
      const update = queries.updateQueryStatus.run()
})