/**
 * Validates image URL format
 * @param {string} url - URL to validate
 * @returns {boolean} - True if valid
 */
export const validateImageUrl = (url) => {
    return /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(url);
};

/**
 * Validates video URL format (including YouTube and Vimeo)
 * @param {string} url - URL to validate
 * @returns {boolean} - True if valid
 */
export const validateVideoUrl = (url) => {
    return /^https?:\/\/.+\.(mp4|avi|mov|wmv|webm)$/i.test(url) ||
           /^https?:\/\/(www\.)?(youtube\.com|youtu\.be|vimeo\.com)/.test(url);
};

/**
 * Validates PDF URL format
 * @param {string} url - URL to validate
 * @returns {boolean} - True if valid
 */
export const validatePdfUrl = (url) => {
    return /^https?:\/\/.+\.pdf$/i.test(url);
};