import { spawn } from "child_process";
import fs from "fs";
import path from "path";

const outputsDir = path.join(path.resolve(), "outputs");
if (!fs.existsSync(outputsDir)) {
  fs.mkdirSync(outputsDir, { recursive: true });
}

export const executeCode = (
  filePath,
  language,
  input,
  timeLimit = 1000, // 1s default
  memoryLimit = 256 * 1024 // 256 KB buffer
) => {
  return new Promise((resolve, reject) => {
    const basename = path.basename(filePath, path.extname(filePath));
    const dir = path.dirname(filePath);
    const outputPath = path.join(outputsDir, `${basename}.out`);

    let compileCommand, compileArgs;

    switch (language) {
      case "cpp":
        compileCommand = "g++";
        compileArgs = [filePath, "-o", outputPath];
        break;
      case "c":
        compileCommand = "gcc";
        compileArgs = [filePath, "-o", outputPath];
        break;
      case "java":
        compileCommand = "javac";
        compileArgs = [filePath];
        break;
      case "python":
        // Python doesn't require compilation
        return execute(filePath, "python3", [filePath], input, timeLimit, memoryLimit, dir, resolve, reject);
      default:
        return reject(new Error("Unsupported language"));
    }

    const compile = spawn(compileCommand, compileArgs, { cwd: dir });

    compile.on("error", (err) => {
      reject(new Error("Compilation error: " + err.message));
    });

    compile.on("close", (code) => {
      if (code !== 0) return reject(new Error("Compilation failed"));

      let runCmd, runArgs;
      if (language === "cpp" || language === "c") {
        runCmd = outputPath;
        runArgs = [];
      } else if (language === "java") {
        runCmd = "java";
        runArgs = [path.basename(filePath, ".java")];
      }

      execute(filePath, runCmd, runArgs, input, timeLimit, memoryLimit, dir, resolve, reject);
    });
  });
};

// --- Core executor ---
function execute(filePath, command, args, input, timeLimit, memoryLimit, cwd, resolve, reject) {
  const run = spawn(command, args, {
    cwd,
    maxBuffer: memoryLimit,
  });

  let stdout = "";
  let stderr = "";
  let isTimedOut = false;

  // Handle timeout
  const timeout = setTimeout(() => {
    isTimedOut = true;
    run.kill("SIGKILL");
  }, timeLimit);

  run.stdin.write(input);
  run.stdin.end();

  run.stdout.on("data", (data) => {
    stdout += data.toString();
  });

  run.stderr.on("data", (data) => {
    stderr += data.toString();
  });

  run.on("close", (code) => {
    clearTimeout(timeout);

    if (isTimedOut) {
      return reject(new Error("Time Limit Exceeded"));
    }

    if (code !== 0 && stderr.trim()) {
      return reject(new Error("Runtime Error / Memory Limit Exceeded"));
    }

    resolve(stdout.trim());
  });

  run.on("error", (err) => {
    clearTimeout(timeout);
    reject(new Error("Execution Error: " + err.message));
  });
}
