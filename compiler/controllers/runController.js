import { generateFile } from "../utils/generateFile.js";
import { executeCode } from "../utils/executeCode.js";

export const runCode = async (req, res) => {
  const { code, language = "cpp", input = "" } = req.body;
  console.log("runCode is executing" );

  if (!code) {
    return res.status(400).json({ success: false, error: "Code is required." });
  }

  try {
    const filePath = generateFile(language, code);
    const output = await executeCode(filePath, language, input);
    res.status(200).json({ success: true, output });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message || error.stderr });
  }
};
