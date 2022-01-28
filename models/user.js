const mongoose = require('mongoose') 
const Schema = mongoose.Schema 
const passportLocalMongoose = require('passport-local-mongoose') 
const findOrCreate = require('mongoose-findorcreate') 

const userSchema = new Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    googleId: {
        type: String,
        unique: true,
    },
    userType: {
        type: String,
        required: true,
        lowercase: true,
        enum: ['client', 'doctor', 'admin'],
        default: 'client'
    }
})

userSchema.plugin(passportLocalMongoose) 
userSchema.plugin(findOrCreate) 

module.exports = mongoose.model('User', userSchema) 