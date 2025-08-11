import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    title:{
        type: String,
        default: 'Untitled',
        trim: true,
    },
    content:{
        type: String,
        default: ' ',
        trim: true,
        
    }
},{timestamps: true});

export const Note = mongoose.model('Note', noteSchema);


