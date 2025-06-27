export const validateImageUrl = (url) => {
    return /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(url);
};

export const validateVideoUrl = (url) => {
    return /^https?:\/\/.+\.(mp4|avi|mov|wmv|webm)$/i.test(url) ||
           /^https?:\/\/(www\.)?(youtube\.com|youtu\.be|vimeo\.com)/.test(url);
};

export const validatePdfUrl = (url) => {
    return /^https?:\/\/.+\.pdf$/i.test(url);
};