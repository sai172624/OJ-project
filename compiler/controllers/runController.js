import { generateFile } from "../utils/generateFile.js";
import { executeCode } from "../utils/executeCode.js";

export const runCode = async (req, res) => {
  const { code, language = "cpp", input = "" } = req.body;
  console.log("runCode is executing");

  if (!code) {
    return res.status(400).json({ success: false, error: "Code is required." });
  }

  try {
    const { filePath } = generateFile(language, code);

    let timeLimit = 1000;
    if (language === "java") timeLimit = 2000;
    else if (language === "python") timeLimit = 5000;

    let memoryLimit = 256 * 1024 * 1024;

    const output = await executeCode(filePath, language, input, timeLimit, memoryLimit);
    res.status(200).json({ success: true, output });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message || error.stderr });
  }
};
