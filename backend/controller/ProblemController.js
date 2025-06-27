import Problem from "../models/Problem.js";
import TestCase from "../models/Testcase.js";

export const getProblemById = async (req, res) => {
  try {
    const { problemId } = req.params;

    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    const sampleTestcases = await TestCase.find({
      problemId,
      isHidden: false
    });

    res.json({ problem, sampleTestcases });
  } catch (err) {
    console.error("Error fetching problem:", err);
    res.status(500).json({ message: "Server error" });
  }
};

