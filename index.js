const express=require('express');
const bodyParser=require("body-parser");
const mongoose=require('mongoose');
const User=require('./models/user');
const dotenv=require('dotenv');

const app=express();

dotenv.config();

app.set('view engine', 'ejs');

mongoose.connect(process.env.MONGOCONN,{ useNewUrlParser: true , useUnifiedTopology: true });

app.use(express.static('public'));

app.use(bodyParser.urlencoded({extended:true}));

app.get("/",function(req,res){
    res.render("request");
});

// get user data
app.get("/restapi/users",function(req,res){
    User.find(req.query,function(err,user){
        if(err){
            res.send(err);
        } else {
            if(user.length!=0){
                res.send(user);
            } else {
                if(req.query.username)
                res.send(["Username Not Found"]);
                else
                res.send(["Country Not Found"]);
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
    User.findOne({username:username},function(err,olduser){
        if(err)
        res.send(err);
        else{
            if(olduser){
                if(!req.body.username && !req.body.country){
                    res.send("No Updation");
                }
                else{
                    User.updateOne({username:username},req.body,function(err,data){
                        if(err)
                        res.send(err);
                        else{
                            if(data.nModified==1){
                                if(req.body.username){
                                    User.findOne({username:req.body.username},function(err,newuser){
                                        if(err)
                                        res.send(err);
                                        else{
                                            res.send(`Previous Record : (Username : ${olduser.username} , Country : ${olduser.country})<br>Updated Record : (Username : ${newuser.username} , Country : ${newuser.country})`);
                                        }
                                    });
                                }
                                else
                                res.send(`Previous Record : (Username : ${olduser.username} , Country : ${olduser.country})<br>Updated Record : (Username : ${olduser.username} , Country : ${req.body.country})`);
                            }
                        }
                    });
                }
            }
            else{
                res.send("Username Not Found");
            }
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