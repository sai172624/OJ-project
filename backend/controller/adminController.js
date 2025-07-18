
import User from "../models/User.js";
import Problem from "../models/Problem.js";
import TestCase from "../models/Testcase.js";
import Submission from "../models/Submission.js";
export const addProblemWithTestcases= async (req, res) => {
    try {
        const { name, statement, code, difficulty, topics, sampleTestcases, hiddenTestcases } = req.body;

        // 1️⃣ Save Problem
        const problem = new Problem({
            name,
            statement,
            code,
            difficulty,
            topics
        });
        await problem.save();

        // 2️⃣ Save Sample Testcases
        const sampleCases = sampleTestcases.map(t => ({
            problemId: problem._id,
            input: t.input,
            expectedOutput: t.expectedOutput,
            isHidden: false
        }));

        // 3️⃣ Save Hidden Testcases
        const hiddenCases = hiddenTestcases.map(t => ({
            problemId: problem._id,
            input: t.input,
            expectedOutput: t.expectedOutput,
            isHidden: true
        }));

        // Save all testcases
        await TestCase.insertMany([...sampleCases, ...hiddenCases]);

        res.status(201).json({ success: true, message: "Problem and testcases added!", problemId: problem._id });

    } catch (err) {
        console.error("Error adding problem:", err);
        res.status(500).json({ success: false, message: "Server error while adding problem" });
    }
};



export const fetchProblems = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 50;

        const problems = await Problem.find()
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        res.json({ success: true, problems });
    } catch (err) {
        console.error("Error fetching problems:", err);
        res.status(500).json({ success: false, message: "Server error while fetching problems" });
    }
};

export const deleteProblem = async (req, res) => {
    try {
        const id = req.params.id;

        // Delete the problem
        await Problem.findByIdAndDelete(id);

        // Also delete related testcases
        await TestCase.deleteMany({ problemId: id });

        res.json({ success: true, message: "Problem deleted" });
    } catch (err) {
        console.error("Error deleting problem:", err);
        res.status(500).json({ success: false, message: "Server error while deleting problem" });
    }
};
 

// controllers/adminProblemController.js


export const editProblemInfo = async (req, res) => {
  try {
    const id = req.params.id;

    const problem = await Problem.findById(id);
    if (!problem) {
      return res.status(404).json({ success: false, message: "Problem not found" });
    }

    const sampleTestcases = await TestCase.find({ problemId: id, isHidden: false });
    const hiddenTestcases = await TestCase.find({ problemId: id, isHidden: true });

    res.status(200).json({
      success: true,
      problem,
      sampleTestcases,
      hiddenTestcases
    });
  } catch (err) {
    console.error("Error in editProblemInfo:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};



// PUT /api/admin/update/:id
export const updateProblem = async (req, res) => {
  try {
    const id = req.params.id;
    const {
      name,
      statement,
      code,
      difficulty,
      topics,
      sampleTestcases = [],
      hiddenTestcases = []
    } = req.body;

    // 1. Update problem info
    const updatedProblem = await Problem.findByIdAndUpdate(
      id,
      {
        name,
        statement,
        code,
        difficulty,
        topics,
      },
      { new: true }
    );

    if (!updatedProblem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    // 2. Fetch all existing testcases for this problem
    const allOldTestcases = await TestCase.find({ problemId: id });

    const oldIds = new Set(allOldTestcases.map(tc => tc._id.toString()));

    // 3. Collect all IDs from frontend
    const frontendIds = new Set([
      ...sampleTestcases.map(tc => tc._id).filter(Boolean),
      ...hiddenTestcases.map(tc => tc._id).filter(Boolean)
    ]);

    // 4. Identify and delete removed testcases
    const idsToDelete = [...oldIds].filter(id => !frontendIds.has(id));
    await TestCase.deleteMany({ _id: { $in: idsToDelete } });

    // 5. Update existing or insert new testcases
    const updateOrInsert = async (testcases, isHidden) => {
      for (let tc of testcases) {
        if (tc._id) {
          // Existing testcase: update
          await TestCase.findByIdAndUpdate(tc._id, {
            input: tc.input,
            expectedOutput: tc.expectedOutput,
            isHidden
          });
        } else {
          // New testcase: insert
          await TestCase.create({
            problemId: id,
            input: tc.input,
            expectedOutput: tc.expectedOutput,
            isHidden
          });
        }
      }
    };

    await updateOrInsert(sampleTestcases, false);
    await updateOrInsert(hiddenTestcases, true);

    res.json({ success: true, message: "Problem and testcases updated successfully!" });

  } catch (err) {
    console.error("Update Problem Error:", err);
    res.status(500).json({ success: false, message: "Server error while updating." });
  }
};

//stats


export const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: "user" });
    const totalProblems = await Problem.countDocuments();

    const userIds = await User.find({ role: "user" }).select("_id");
    const userIdList = userIds.map(user => user._id);
    
    const totalSubmissions = await Submission.countDocuments({ userId: { $in: userIdList } });

    res.status(200).json({ totalUsers, totalProblems, totalSubmissions });
  } catch (err) {
    console.error("Admin Stats Error:", err);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
};
