import Submission from "../models/Submission.js";
import User from "../models/User.js";
import Problem from "../models/Problem.js";
<<<<<<< HEAD
=======
import mongoose from "mongoose";
>>>>>>> 4484a2d (Frontend: Hide auth buttons when logged in, show 4 featured problems, Get Started → Register)

export const getUserProblemSubmissions = async (req, res) => {
  const { problemId, userId } = req.params;

  try {
    const submissions = await Submission.find({ problemId, userId })
      .sort({ submittedAt: -1 }) // latest first
      .populate("userId", "firstname")
      .populate("problemId", "code name");

    // Map 'submittedAt' to 'createdAt' for frontend compatibility
    const mapped = submissions.map(sub => {
      const obj = sub.toObject();
      obj.createdAt = obj.submittedAt;
      return obj;
    });

    res.json(mapped);
  } catch (err) {
    console.error("Error fetching submissions:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// controllers/submissionController.js


// Get all submissions made by a specific user
export const getSubmissionsByUser = async (req, res) => {
  const { userId } = req.params;

<<<<<<< HEAD
=======
  // Validate userId
  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ success: false, message: "Invalid or missing userId" });
  }

>>>>>>> 4484a2d (Frontend: Hide auth buttons when logged in, show 4 featured problems, Get Started → Register)
  try {
    const submissions = await Submission.find({ userId });
    res.json({ success: true, submissions });
  } catch (err) {
    console.error("Error fetching user submissions:", err);
    res.status(500).json({ success: false, message: "Failed to fetch submissions" });
  }
};
