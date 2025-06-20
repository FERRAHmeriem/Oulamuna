import { WORDS_PER_MINUTE } from './../models/constants/articleConstants.js';

/**
 * Pre-save middleware to calculate reading time
 */
export const calculateReadingTime = function (next) {
    if (this.isModified('sections')) {
        let totalWords = 0;
        this.sections.forEach(section => {
            if (section.content) {
                totalWords += section.content.split(/\s+/).length;
            }
        });
        // Estimation: mots par minute défini dans les constantes
        this.readingTime = Math.ceil(totalWords / WORDS_PER_MINUTE) || 1;
    }
    next();
};