// generateFile.js
import fs from 'fs';
import path from 'path';
import { v4 as uuid } from 'uuid';

const codesDir = path.join(path.resolve(), 'codes');
if (!fs.existsSync(codesDir)) {
  fs.mkdirSync(codesDir, { recursive: true });
}

export const generateFile = (language, code) => {
  const id = uuid().replace(/-/g, "_"); // Safer class/file names
  const extensionMap = {
    cpp: 'cpp',
    c: 'c',
    python: 'py',
    java: 'java'
  };

  const extension = extensionMap[language];

  // 🔄 If language is Java, rename the class to match the UUID
  if (language === 'java') {
    const className = `Class_${id}`;
    code = code.replace(/class\s+Main/, `class ${className}`);
    const filename = `${className}.java`;
    const filePath = path.join(codesDir, filename);
    fs.writeFileSync(filePath, code);
    return filePath;
  }

  // Other languages
  const filename = `${id}.${extension}`;
  const filePath = path.join(codesDir, filename);
  fs.writeFileSync(filePath, code);
  return filePath;
};
