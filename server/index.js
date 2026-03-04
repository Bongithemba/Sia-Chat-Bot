import express from "express";
import pg from pg;
import { Pool } from "pg-pool";
import fs from "fs/promises";
import { parseString } from "xml2js";

const app = express()
const port = 3000

let clientURL=""

app.use(express.static(clientURL))

const pool = new Pool()




app.listen(port, ()=>{
      console.log(`App running on port ${port}`)
})

app.post("/Register")


app.post("/login", async (req,res)=>{

})


app.post("/newQuery")