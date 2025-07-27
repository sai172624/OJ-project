// generateFile.js
import fs from 'fs';
import path from 'path';
import { v4 as uuid } from 'uuid';

const codesDir = path.join(path.resolve(), 'codes');
if (!fs.existsSync(codesDir)) {
  fs.mkdirSync(codesDir, { recursive: true });
}

export const generateFile = (language, code) => {
  const id = uuid().replace(/-/g, "_");
  const extensionMap = {
    cpp: 'cpp',
    c: 'c',
    python: 'py',
    java: 'java'
  };

  const extension = extensionMap[language];

  if (language === 'java') {
    const javaDir = path.join(codesDir, id);
    if (!fs.existsSync(javaDir)) {
      fs.mkdirSync(javaDir, { recursive: true });
    }
    const filename = 'Main.java';
    const filePath = path.join(javaDir, filename);
    fs.writeFileSync(filePath, code);
    return { filePath, dir: javaDir, id };
  }

  const filename = `${id}.${extension}`;
  const filePath = path.join(codesDir, filename);
  fs.writeFileSync(filePath, code);
  return { filePath, dir: codesDir, id };
};
