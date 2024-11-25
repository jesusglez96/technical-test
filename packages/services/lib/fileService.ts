import fs from 'fs';
import path from 'path';

export const saveFile = async (file: Buffer, fileName: string) => {
  const filePath = path.join(__dirname, '../../uploads', fileName);
  fs.writeFileSync(filePath, file);
  return filePath;
};
