import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { Request } from 'express';
import fs from 'fs';
import { env } from './env';
import { ALLOWED_UPLOAD_TYPES, MAX_FILE_SIZE_BYTES } from '../constants';

// Ensure upload directory exists
const uploadDir = path.resolve(process.cwd(), env.UPLOAD_DIR);
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Disk storage: save with a UUID filename to avoid collisions
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueName = `${uuidv4()}${ext}`;
    cb(null, uniqueName);
  },
});

// MIME type validation
const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
): void => {
  if (ALLOWED_UPLOAD_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `File type '${file.mimetype}' is not allowed. Accepted: ${ALLOWED_UPLOAD_TYPES.join(', ')}`
      )
    );
  }
};

// Single file upload
export const uploadSingle = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_FILE_SIZE_BYTES },
}).single('file');

// Multiple files upload (max 10)
export const uploadMultiple = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_FILE_SIZE_BYTES },
}).array('files', 10);

// Export upload dir path for use in controllers
export { uploadDir };
