import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        default: null,
        required: true,
    },
    lastname: {
        type: String,
        default: null,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {  // ✅ NEW field!
        type: String,
        enum: ["admin", "user"],
        default: "user"
    }
});

export default mongoose.model('User', userSchema);
