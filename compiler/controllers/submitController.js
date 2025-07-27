import TestCase from "../models/Testcase.js";
import Submission from "../models/Submission.js";
import { generateFile } from "../utils/generateFile.js";
import { executeCode } from "../utils/executeCode.js";

export const submitCode = async (req, res) => {
  const { code, language, problemId, userId } = req.body;

  if (!code || !language || !problemId || !userId) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const { filePath } = generateFile(language, code);
    const testcases = await TestCase.find({ problemId });

    const testResults = [];
    let verdict = "Accepted";
    let timeTaken = 0;

    for (let i = 0; i < testcases.length; i++) {
      const tc = testcases[i];
      try {
        let timeLimit = 1000;
        if (language === "java") timeLimit = 2000;
        else if (language === "python") timeLimit = 5000;

        let memoryLimit = 256 * 1024 * 1024;
        const start = Date.now();
        const output = await executeCode(filePath, language, tc.input, timeLimit, memoryLimit);
        const end = Date.now();

        const expected = tc.expectedOutput.trim().replace(/\r/g, "");
        const actual = output.trim().replace(/\r/g, "");

        const passed = expected === actual;

        timeTaken = Math.max(timeTaken, end - start);

        testResults.push({
          status: passed ? "pass" : "fail"
        });

        if (!passed) {
          verdict = "Wrong Answer";
          break;
        }

      } catch (err) {
        const isTLE = err.message.toLowerCase().includes("time limit exceeded") || err.message.toLowerCase().includes("timed out");
        verdict = isTLE ? "Time Limit Exceeded" : "Memory Limit Exceeded";
        testResults.push({ status: isTLE ? "tle" : "mle" });
        break;
      }
    }

    await Submission.create({
      userId,
      problemId,
      code,
      language,
      verdict,
      timeTaken
    });

    res.json({ testResults });
  } catch (err) {
    console.error("Submission error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
