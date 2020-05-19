const express=require('express');
const bodyParser=require("body-parser");
const mongoose=require('mongoose');
const User=require('./models/user');

const app=express();

dotenv.config();

app.set('view engine', 'ejs');

mongoose.connect('mongodb+srv://Terminator:Vaibhav@0306@rest-api-ag54g.mongodb.net/test?retryWrites=true&w=majority',{ useNewUrlParser: true , useUnifiedTopology: true });

app.use(express.static('public'));

app.use(bodyParser.urlencoded({extended:true}));

app.get("/",function(req,res){
    res.render("request");
});

// get user data
app.get("/restapi/users",function(req,res){
    console.log(req.query);
    User.find(req.query,function(err,user){
        if(err){
            res.send(err);
        } else {
            if(user){
                res.send(user);
            } else {
                res.send("Username Not Found");
            }
        }
    });
});

// add a new user
app.post("/restapi/users",function(req,res){
    User.findOne({username:req.body.username},function(err,searchuser){
        if(err){
            res.send(err);
        } else {
            if(searchuser){
                res.send("Username already exists");
            } else {
             User.create(req.body,function(err,user){
                 if(!err){
                     res.send(user.username+" added successfully");
                 } else {
                     res.send(err);
                 }
             });
            }
        }
    });
});

// updated the user
app.put("/restapi/users/:username",function(req,res){
    var username=req.params.username;
    User.findOne({username:username},function(err,user){
        if(err)
        res.send(err);
        else{
            User.updateOne({username:username},req.body,function(err,data){
                if(err)
                res.send(err);
                else{
                    if(data.nModified==1)
                    res.send(`Previous Record : (Username : ${user.username} , Country : ${user.country})<br>Updated Record : (Username : ${req.body.username} , Country : ${req.body.country})`);
                    else
                    res.send("Username Not Found");
                }
            });
        }
    });
});

// delete the user
app.delete("/restapi/users/:username",function(req,res){
    var username=req.params.username;
    User.deleteOne({username:username},function(err,user){
        if(err)
        res.send(err);
        else{
            if(user.deletedCount==1)
            res.send(username+" deleted successfully");
            else
            res.send("Username Not Found");
        }
    });
});

app.listen(process.env.PORT||4000,function(){
    console.log("Server Started");
});