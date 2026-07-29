import { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import prisma from '../config/database';
import { sendCreated, sendSuccess, sendBadRequest, sendNotFound, sendForbidden } from '../utils/response';
import { AuthenticatedRequest } from '../types';
import { env } from '../config/env';

// Build public URL for uploaded file
function buildFileUrl(filename: string, req: Request): string {
  const protocol = req.protocol;
  const host = req.get('host');
  return `${protocol}://${host}/${env.UPLOAD_DIR}/${filename}`;
}

export async function uploadFile(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.file) {
      sendBadRequest(res, 'No file was uploaded');
      return;
    }

    const userId = (req as AuthenticatedRequest).user.userId;
    const url = buildFileUrl(req.file.filename, req);

    const record = await prisma.uploadFile.create({
      data: {
        userId,
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
        url,
      },
    });

    sendCreated(res, { file: record }, 'File uploaded successfully');
  } catch (err) {
    next(err);
  }
}

export async function uploadMultipleFiles(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      sendBadRequest(res, 'No files were uploaded');
      return;
    }

    const userId = (req as AuthenticatedRequest).user.userId;

    const records = await Promise.all(
      files.map((file) =>
        prisma.uploadFile.create({
          data: {
            userId,
            filename: file.filename,
            originalName: file.originalname,
            mimeType: file.mimetype,
            size: file.size,
            url: buildFileUrl(file.filename, req),
          },
        })
      )
    );

    sendCreated(res, { files: records }, `${records.length} file(s) uploaded`);
  } catch (err) {
    next(err);
  }
}

export async function deleteFile(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { userId, role } = (req as AuthenticatedRequest).user;
    const fileId = req.params.id!;

    const record = await prisma.uploadFile.findUnique({ where: { id: fileId } });

    if (!record) {
      sendNotFound(res, 'File not found');
      return;
    }

    if (record.userId !== userId && role !== 'admin') {
      sendForbidden(res, 'You can only delete your own files');
      return;
    }

    // Remove from disk
    const filePath = path.resolve(process.cwd(), env.UPLOAD_DIR, record.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await prisma.uploadFile.delete({ where: { id: fileId } });
    sendSuccess(res, null, 'File deleted');
  } catch (err) {
    next(err);
  }
}
