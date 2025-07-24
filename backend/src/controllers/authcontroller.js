import User from "../models/user.models.js";



export const registerUser= async(req,res) =>{
    try{
        const{ name, email, password} = req.body;

        if(!name || !email || !password){
            return res.status(400).json({message: "Please fill all the fields"});
        }

        const existingUser =  await User.findOne({email});
        if (existingUser){
            return res.status(404).json({message:"User already exists"})
        }

        const user =  await new User({name , email, password}).save();
        if(!user){
            return res.status(500).json({message:"Error creating user"})
        }
        return res.status(201).json({message:"user created successfully", user})
    }
    catch(error){

    }
}