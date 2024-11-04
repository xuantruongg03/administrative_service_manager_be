import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { StorageService } from './storage.service';
import * as path from 'path';
import * as fs from 'fs';

@Controller('uploads')
export class StorageController {
    constructor(private readonly storageService: StorageService) {}

    @Get(':filename')
    async downloadFile(
        @Param('filename') filename: string,
        @Res() res: Response,
    ) {
        try {
            const filePath = path.join(
                process.cwd(),
                'static/uploads',
                filename,
            );
            // Check if file exists before sending
            if (!fs.existsSync(filePath)) {
                console.log('File not found at:', filePath);
                return res.status(404).send(`File not found: ${filename}`);
            }

            return res.sendFile(filePath);
        } catch (error) {
            console.error('Error serving file:', error);
            return res.status(500).send('Error serving file');
        }
    }
}
