import { Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import * as path from 'path';

@Injectable()
export class StorageService {
    private readonly uploadDir = 'static/uploads';

    async uploadFile(
        file: Express.Multer.File,
        name?: string,
    ): Promise<string> {
        const fileExt = path.extname(file.originalname);
        const fileName = name
            ? `${name}${fileExt}`
            : `${Date.now()}-${file.originalname}`;
        const filePath = path.join(this.uploadDir, fileName);
        await fs.mkdir(path.dirname(filePath), { recursive: true });
        await fs.writeFile(filePath, file.buffer);
        return `/uploads/${fileName}`;
    }
}
