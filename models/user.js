let mongoose = require('mongoose');
let express = require('express');
const passportLocalMongoose = require('passport-local-mongoose');

let userSchema = new mongoose.Schema({
    email : {
        type: String,
        required: true,
        unique: true
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true
    },
    username: {
    type: String,
    required: true
  },
    displayName: String
});

userSchema.plugin(passportLocalMongoose);
let User = mongoose.model("User",userSchema);
module.exports = User;