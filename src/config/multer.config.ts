import { diskStorage } from 'multer';
import { extname, join } from 'path';
import CONSTANTS from 'src/common/constants';

export const multerConfig = {
    storage: diskStorage({
        destination: join(__dirname, '..', '..', 'static', 'other-resources'),
        filename: (req, file, callback) => {
            const uniqueSuffix =
                Date.now() + '-' + Math.round(Math.random() * 1e9);
            callback(
                null,
                `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`,
            );
        },
    }),
    fileFilter: (req, file, callback) => {
        const ext = file.originalname.split('.').pop();
        if (CONSTANTS.ACCEPTED_FILE_TYPES.includes(ext)) {
            callback(null, true);
        } else {
            callback(new Error('Unsupported file type'), false);
        }
    },
    limits: {
        fileSize: 1024 * 1024 * 24, // 24MB
    },
};
