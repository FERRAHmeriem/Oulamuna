/**
 * Virtual properties for Article model
 */
export const createArticleVirtuals = (schema) => {
    // Virtual pour le nombre total de likes
    schema.virtual('likesCount').get(function () {
        return this.likes ? this.likes.length : 0;
    });

    // Virtual pour le nombre total de commentaires
    schema.virtual('commentsCount').get(function () {
        return this.comments ? this.comments.length : 0;
    });

    // Virtual pour vérifier si un article est publié
    // Article est public quand il est approuvé par l'admin
    schema.virtual('isPublished').get(function () {
        return (this.status === 'approved' && this.publishedAt && new Date(this.publishedAt) <= new Date());
    });
};