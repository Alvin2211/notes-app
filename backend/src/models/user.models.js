import mongoose from "mongoose";
import bcrypt from 'bcryptjs';
import  jwt from 'jsonwebtoken';
import {Note} from "./note.models.js";

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required:true,
        trim: true,
    },

    email:{
        type: String,
        required: true,
        unique:true,
    },
    password:{
        type: String,
        reuired:true,
    },
    notes:[{
        type: mongoose.Schema.Types.ObjectId,
        Ref: 'Note'
    }]

},{timestamps: true});


userSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        return next();
    }

    this.password = await bcrypt.hash(this.password, 10);
    next();
})

userSchema.methods.isPasswordCorrect =async function (enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            name: this.name,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY,
        }
    )
}

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY,
        }
    )
}



export const User = mongoose.model('User',userSchema)

