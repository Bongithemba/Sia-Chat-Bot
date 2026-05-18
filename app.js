const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt'); //hashing passwords from user inpt
const cookieParser =  require('cookie-parser');
const jwt = require('jsonwebtoken');
const dotenv = require  ('dotenv'); // import dotenv package
const {v4: uuidv4} = require('uuid');
const {queries} = require('./database/queries');
const path = require('path');
// import {GoogleGenAI} from '@google/genai';
const {GoogleGenAI} = require('@google/genai');
//***********All Imports**************/

dotenv.config({ path: '/home/student/Sia-Chat-Bot/.env'}); //configure dotenv filepath
const app = express();
const PORT = 3000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({apiKey: GEMINI_API_KEY});

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`)
    console.log(`connected to Gemini as ${ai}`);
});




/*
    function to verify jwt token, first checks for token then checks token. if no token or incorrect token fail req
 */


const jwtSecurity = process.env.JWT_SECRET || "devSecret"

const authenticateToken = (req,res, next) =>{

    const token = req.cookies.token

    // If no token is provided, return an error
    if (!token) {
        return res.status(401).json({
        message: 'Unauthorized. No token provided.'
        });
    }
    try {
        // Verify the token
        const decoded = jwt.verify(token, jwtSecurity);

        req.user = decoded; // Save user info in the request

        next(); // Continue to the next middleware or route
    } catch (error) {
        return res.status(403).json({
        message: 'Forbidden - Invalid or expired token, try loggin in',
        });
    }
};


app.get("/", (req, res)=>{
    res.render('signup');
});


app.post('/api/enquiry', authenticateToken, (req, res) => {
    const { name, email, enquiry } = req.body;
    if(!enquiry) return res.status(400).json({ error: "Enquiry is required" });
    
    let enquiryID;
    const userID = req.user.userID

    
    try{
        const insertQrr = queries.insertQuery.run(userID,enquiry);
        enquiryID = insertQrr.lastInsertRowid;
    } catch (err){
        return res.status(500).json({
            message:"Error inserting enquiry",
            error:err
        })
    }  


    const result = generateSolution(name,enquiry);
    res.json({
        category:result.category,
        solution:result.solution,
        queryid:enquiryID
    });
});


//******User query */
app.post("/getResponse", async (req, res) => {
    const query = req.body.query;

    try {
        const interaction1 = await ai.interactions.create({
            model: 'gemini-2.5-flash',
            input: 'Provide one concise solution to the customer enquiry as Sia Bot by taking a your best guess'
        });

        const interaction2 = await ai.interactions.create({
            model: 'gemini-2.5-flash',
            input: query,
            previous_interaction_id: interaction1.id
        });

        if (!interaction2) {
            return res.status(500).json({ error: "Failed to get response from Gemini" });
        }

        console.log(JSON.stringify(interaction2.outputs, null, 2));

        const textBlock = interaction2.outputs[1].text

        return res.json({ response: textBlock });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server error" });
    }
});



//******sign-up logic**********
app.post("/signup", (req, res)=>{
	const saltRounds = 10; //Number of saltrounds in each hash

    const {name,email,password,finalPassword} = req.body

	if (password != finalPassword){
		return res.render("signup", {message: "Passwords much match"});
	}else {
		bcrypt.hash(finalPassword, saltRounds, function (err, hash) {
    		if (err) {
        	 return res.render('signup',{message:'Error saving password'})
    		}
			try {
                const result = queries.insertUser.run(uuidv4(),name,email,hash)
                return res.render('login')
            } catch (error) {
                return res.render('signup',{message:'Email already in use, login or use a different email'})
            }
		});
	}
});



//******login logic******** */
app.get('/login', (req, res) => {
	res.render('login');  //load login page
});


app.post("/loginDetails", (req, res)=>{

    const {email,password} = req.body;


    //find user in db
    const user = queries.findUser.get(email);

    //Tell user to login if user not found
    if(!user){
        return res.render('login', { message: "Email not found. Please register first." });
    }
	bcrypt.compare(password, user.password, function(err, result) {
		if (err){
            return res.render('login',{message:'Error checking password'})
        }
        // if user has correct password:creates token, logs user in
        if(result){
            const payload = {
                userID:user.uuid,
                role:'user'
            }
            //create token
            const token = jwt.sign(payload,jwtSecurity, {
                expiresIn:'1h'
            })

    
            //Set cookie as header and redirect user
            return res.cookie('token',token).render('query')            
        } else{
            // if password is incorrect tell user to try again
            return res.render('login', {message: "Incorrect Password!Try Again"})
        }
	});
});

//******************* 


app.post('/api/escalate', (req, res) => {
    const { name, enquiry,enquiryID } = req.body;
   try {
    const result= queries.updateQueryStatus.run(0,enquiryID);
   } catch (err) {
    return res.status(500).json({
        message:'Error updating enquiry status',
        errror:err
    })
   } 
    return res.json({ message: "Enquiry escalated to human support. Our team will get back to you shortly." });
});


app.get('/users', (req,res)=>{
    const users = queries.getUsers.all()
    res.json(users)
})

app.get('/queries', (req,res)=>{
    const enquirys = queries.getQueries.all();
    res.json(enquirys)
})

