import mongoose from 'mongoose';



const userSchema= new mongoose.Schema({
    firstname:{
        type: String,
        default:null,   
        required: true,
    },
    lastname:{
        type:String,
        default:null,
        required: true,
    },
    email:{
        type: String,
        unique: true,
        required: true,
        unique: true,
    },
    password:{
        type: String,
        required: true, 
    }

});

export default mongoose.model('User', userSchema);
