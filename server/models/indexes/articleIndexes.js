/**
 * Database indexes for Article model to improve query performance
 */
export const createArticleIndexes = (schema) => {
    // Text search indexes
    schema.index({ title: 'text', description: 'text', scholarName: 'text' });
    
    // Status and sorting indexes
    schema.index({ status: 1, createdAt: -1 });
    schema.index({ author: 1 });
    schema.index({ epoque: 1 });
    schema.index({ domaineExpertise: 1 });
    schema.index({ featured: 1, publishedAt: -1 });
    
    // Performance indexes
    schema.index({ viewCount: -1 }); // Pour les articles les plus vus
    schema.index({ 'likes.user': 1 });
    schema.index({ 'comments.author': 1 });
};