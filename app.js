//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const encrypt = require("mongoose-encryption");

//skapa instans av server
const app = express();


//config av server
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
  extended: true
}));

//Skapa connection med databas
mongoose.connect("mongodb://localhost:27017/userDB");
//create Schema - åste använda mongoose - schema om man ska använda schemat t ex för encryption
const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

//Add encrytion on the schema to make password not readable in the usesr db
userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] });

//User model
const User = new mongoose.model("User", userSchema);



app.get("/", function(req,res){
  res.render("home");
});
app.get("/login", function(req,res){
  res.render("login");
});
app.get("/register", function(req,res){
  res.render("register");
});


app.post("/register", function(req,res){
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  });

  newUser.save(function(err){
    if(!err){
      res.render("secrets");
    }
    else{
      console.log(err);
    }
  });
});

app.post("/login", function(req,res){
  const username = req.body.username;
  const password = req.body.password
User.findOne({ email: username}, function(err, foundUser){
     if(err){
        console.log(err);
      }else{
        if(foundUser){
          if(foundUser.password === password){
          res.render("secrets");
        }  else{
            res.send("Ingen användare hittades, kontrollera username och password");
          }

      }else {
        res.send("Ingen användare hittades, kontrollera username och password");
      }
    }
});

});

app.listen(3000, function(err){
  if(!err){
    console.log("Server started on port 3000");
  }
});


//BLir aktuellt om vi ska använda mongoose
//OBS - kom ihåg att ange databas <namnpåDB>
//mongoose.connect("mongodb://localhost:27017/<namnpåDB>");

/* ///////Exempel ////////////////////
const articleSchema = mongoose.Schema({
  title: String,
  content: String
});
//Model
const Article = new mongoose.model("Article", articleSchema);
////////////////////////////////////////*/
