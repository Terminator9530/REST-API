const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create user Schema

const UserSchema=new Schema({
    username:{
        type:String
    },
    country:{
        type:String
    }
});

const User = mongoose.model('user',UserSchema);

module.exports=User;