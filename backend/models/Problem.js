import mongoose from 'mongoose';

const problemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  statement: {
    type: String,
    required: true
  },
  code: {  // like "sum-of-two-numbers" (URL slug / unique code)
    type: String,
    required: true,
    unique: true
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: true
  },
  topics: [String],  // ["Arrays", "Math", "DP"]
  
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Problem', problemSchema);
