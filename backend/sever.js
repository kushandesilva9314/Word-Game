import express from 'express'
import mysql from 'mysql'
import cors from 'cors'
import session from 'express-session'
import cookieParser from 'cookie-parser' 
import bodyParser from 'body-parser'


const app = express();
app.use(cors({
    origin: ['http://localhost:3000'], // Allow requests from the React frontend
    methods: ["POST", "GET"],
    credentials: true // Allow credentials (session cookies)
}));

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json())
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // Ensure `true` for HTTPS
        maxAge: 1000 * 60 * 60 * 24 // 1 dayiuhuihui
    }
}));


const db = mysql.createConnection({
    host: "localhost",
    user:'root',
    password: "",
    database: 'user'
})

app.get('/home', (req,res)=>{
    if(req.session.Username){
        return res.json({valid: true, Username:req.session.Username})
    }else{
        return res.json({valid: false})
    }
})

app.post('/register', (req,res)=>{
    const sql="INSERT INTO gameusers (`Email`,`Username`,`Password`) VALUES(?)";
    const values = [
        req.body.Email,
        req.body.Username,
        req.body.Password,
    ]
    db.query(sql, [values], (err, result)=>{
        if(err) return res.json({Messsge:"Error in Node"});
        return res.json(result);
    })
})

app.post('/login', (req,res)=>{
    const sql="SELECT * FROM gameusers WHERE Username=? and Password=?";
    db.query(sql, [req.body.Username, req.body.Password], (err,result)=>{
        if(err) return res.json({Messege:"Error inside sever"});
        if(result.length>0){
            req.session.Username=result[0].Username;
            return res.json({Login: true})
        }else{
            return res.json({Login: false})
        }
    })
})

// Logout route
app.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.json({ Message: "Logout failed", Success: false });
        } else {
            res.clearCookie('connect.sid'); // Clear the session cookie
            return res.json({ Message: "Logout successful", Success: true });
        }
    });
});


app.listen(8081,()=>{
    console.log("Connected to sever");
})