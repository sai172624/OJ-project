import { generateFile } from "../utils/generateFile.js";
import { executeCode } from "../utils/executeCode.js";

export const verifyCode = async (req, res) => {
  const { code, language, testcases } = req.body;
  if (!code || !language || !testcases || !Array.isArray(testcases)) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const filePath = generateFile(language, code);
    let timeLimit = 1000;
    if (language === "java") timeLimit = 2000;
    else if (language === "python") timeLimit = 5000;
    let memoryLimit = 256 * 1024 * 1024; // 256 MB

    const results = [];
    for (const tc of testcases) {
      try {
        const output = await executeCode(filePath, language, tc.input, timeLimit, memoryLimit);
        const expected = (tc.expectedOutput || "").trim().replace(/\r/g, "");
        const actual = (output || "").trim().replace(/\r/g, "");
        results.push({
          status: expected === actual ? "pass" : "fail",
          input: tc.input,
          expected,
          actual,
        });
      } catch (err) {
        const isTLE = err.message.toLowerCase().includes("time limit exceeded") || err.message.toLowerCase().includes("timed out");
        results.push({
          status: isTLE ? "tle" : "mle",
          input: tc.input,
          error: err.message,
        });
      }
    }
    res.json({ results });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}; 