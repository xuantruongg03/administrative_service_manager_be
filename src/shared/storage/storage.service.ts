import { Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import * as path from 'path';
import slugify from 'slugify';
import CONSTANTS from 'src/common/constants';

@Injectable()
export class StorageService {
    private readonly uploadDir = 'static/uploads';

    async uploadFile(
        file: Express.Multer.File,
        name?: string,
    ): Promise<{ file_path: string; size: number }> {
        const fileExt = path.extname(file.originalname);
        const fileName = slugify(name) + fileExt;
        const filePath = path.join(this.uploadDir, fileName);
        await fs.mkdir(path.dirname(filePath), { recursive: true });
        await fs.writeFile(filePath, file.buffer);
        return {
            file_path: `${slugify(fileName, CONSTANTS.TYPE_SLUG)}`,
            size: file.size,
        };
    }
}
