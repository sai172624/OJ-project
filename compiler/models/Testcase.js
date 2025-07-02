
import mongoose from 'mongoose';

const testCaseSchema = new mongoose.Schema({
  problemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Problem',
    required: true
  },
  input: {
    type: String,  // multi-line input string
    required: true
  },
  expectedOutput: {
    type: String,  // multi-line output string
    required: true
  },
  isHidden: {
    type: Boolean,
    default: false  // false → sample testcase shown to user, true → hidden
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('TestCase', testCaseSchema);
