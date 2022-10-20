require("dotenv").config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require("mongoose");
const encrypt = require('mongoose-encryption');

const app = express();

const dotenv = require('dotenv').config({
  path: __dirname + '/.env'
});

app.use(express.static("public"))
app.set('view engine','ejs')
app.use(bodyParser.urlencoded({
  extended:true
}));
  
mongoose.connect('mongodb://localhost:27017/userDB')

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password'] });

const User = mongoose.model('User', userSchema
);

app.get("/", (req, res) =>{
  res.render("home")
})

app.get("/login", (req, res) =>{
  res.render("login")
})

app.get("/register", (req, res) =>{
  res.render("register")
})

app.post("/register", (req,res) =>{
  const newUser = new User({ email: req.body.username, password: req.body.password
  })  
  
newUser.save(err =>{
  if(!err){
    res.render("Secrets")
  }else{
    console.log(err)
  }
})
})

app.post("/login", (req,res) =>{
  const userName = req.body.username
  const password =  req.body.password

  User.findOne({email: userName}, function (err, result) {
    if(err){
      console.log(err) 
    }else{
      if(result){
        if(result.password === password){
          res.render("secrets")
        }
      }
    }
  });
  })  

  






app.listen(3000,function(req,res){
  console.log("Server started on port 3000.");
})