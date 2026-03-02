import express from "express";
import fs from "fs/promises";
import { parseString } from "xml2js";

const app = express()
const port = 3000

app.listen(port, ()=>{
      console.log(`App running on port ${port}`)
})



/*
Step 1:Turn string into an array
SteP 2: Iterate over array and compare
      go over array: check first over billing/accoun/tech array, whenever a word is found updata tally 


*/

let str = "I am trying to log into the amy account but keep getting the reply that my username does not exist, even tho I a registered before ";
const billingArr =[]

const accountArr =[]

const technicalArr =[]
function queryType (query){

}
