import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const deleteFile = (filename) => {
    if (!filename || filename === 'default-profile.png') return;
    
    // Extract filename from URL if it's a full URL
    const actualFilename = filename.includes('/') ? path.basename(filename) : filename;
    
    const filePath = path.join(__dirname, '../../uploads', actualFilename);
    fs.unlink(filePath, (err) => {
        if (err) {
            console.log('Error deleting file:', err);
        }
    });
};

export const generateFileUrl = (filename, req) => {
    if (!filename) return null;
    return `${req.protocol}://${req.get('host')}/api/uploads/${filename}`;
};

// Extract filename from URL (for cases where you need just the filename)
export const extractFilename = (url) => {
    if (!url) return null;
    return url.includes('/') ? path.basename(url) : url;
};