import { upload } from '../config/multer.js';

export const articleUploadCustom = (req, res, next) => {
    const uploadAny = upload.any();

    uploadAny(req, res, (err) => {
        if (err) {
            return next(err);
        }

        // Organize files by field name for easier access
        req.organizedFiles = {};

        if (req.files) {
            req.files.forEach(file => {
                const fieldName = file.fieldname;
                if (!req.organizedFiles[fieldName]) {
                    req.organizedFiles[fieldName] = [];
                }
                req.organizedFiles[fieldName].push(file);
            });
        }

        next();
    });
};