const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

const app = express();
const port = 3000;
const saltRounds = 10;

app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use(express.static(__dirname + "/public"));

// Mongoose setup:
mongoose.connect("mongodb://localhost:27017/onlypans");
const db = mongoose.connection;

db.on("open", (ex) => {
    if(ex) throw ex;
    console.log("Connected to database!");
});

const userSchema = mongoose.Schema({
    username: String,
    email: String,
    password: String
});
const Users = mongoose.model("users", userSchema, "onlypans");




app.post("/login", (req, res) => {
    let data = req.body;
    console.log(data);

    Users.find({username: data.txtUser}, (err, findData) => {
        console.log(findData);

        if(findData.length == 0){
            console.log("No users found");
            res.redirect("/");
        }else{
            if(bcrypt.compareSync(data.txtPassword, findData[0].password)){
                console.log("User password matched");
                res.redirect("/home");
            }else{
                res.redirect("/");
            }
        }
    });
});
app.post("/register", (req, res) => {
    let data = req.body;
    console.log(data);

    // Encryption
    const password = data.txtPassword;
    const hashedPasswords = bcrypt.hashSync(password, saltRounds);

    let user = new Users({
        username: data.txtUser,
        email: data.txtEmail,
        password: hashedPasswords
    });
    user.save();

    res.redirect("/");
});

app.listen(port, () => console.log("Listening on port: " + port));