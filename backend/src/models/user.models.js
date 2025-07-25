import mongoose from "mongoose";

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
    }
},{timestamps: true});


userSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        return next();
    }

    this.password=  await bcrypt.hash(this.password, 10);
    next();
})

userSchema.methods.isPasswordCorrect =async function (enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
}

export const User = mongoose.model('User',userSchema)

