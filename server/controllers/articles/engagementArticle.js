import asyncHandler from 'express-async-handler';
import Article from '../../models/schemas/article.js';

// ============= LIKE/UNLIKE ARTICLE =============
export const toggleLike = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.user._id;

    const article = await Article.findById(id);
    if (!article) {
        return res.status(404).json({
            success: false,
            message: 'Article non trouvé'
        });
    }

    if (article.status !== 'approved') {
        return res.status(403).json({
            success: false,
            message: 'Impossible de liker un article non approuvé'
        });
    }


    let existingLike = article.likes.find(like =>
        like.user && like.user.toString() === userId.toString()
    );

    // Store the initial like state before modifying it
    const wasLiked = !!existingLike;
    
    let updatedArticle;
    if (wasLiked) {
        // Retirer le like
        updatedArticle = await article.removeLike(userId);
    } else {
        // Ajouter le like
        updatedArticle = await article.addLike(userId);
    }

    res.status(200).json({
        success: true,
        message: wasLiked ? 'Like retiré' : 'Article liké',
        data: {
            likesCount: updatedArticle.likesCount,
            userHasLiked: !wasLiked
        }
    });
});

// ============= ADD COMMENT =============
export const addComment = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { content, parentComment } = req.body;

    if (!content || content.trim().length < 3) {
        return res.status(400).json({
            success: false,
            message: 'Le commentaire doit contenir au moins 5 caractères'
        });
    }

    const article = await Article.findById(id);
    if (!article) {
        return res.status(404).json({
            success: false,
            message: 'Article non trouvé'
        });
    }

    if (article.status !== 'approved') {
        return res.status(403).json({
            success: false,
            message: 'Impossible de commenter un article non approuvé'
        });
    }

    const commentData = {
        content: content.trim(),
        author: req.user._id,
        parentComment: parentComment || null
    };

    const updatedArticle = await article.addComment(commentData);
    await updatedArticle.populate('comments.author', 'firstName familyName userName profilePicture');

    const newComment = updatedArticle.comments[updatedArticle.comments.length - 1];

    res.status(201).json({
        success: true,
        message: 'Commentaire ajouté avec succès',
        data: newComment
    });
});

// ============= DELETE COMMENT =============
export const deleteComment = asyncHandler(async (req, res, next) => {
    const { articleId, commentId } = req.params;

    const article = await Article.findById(articleId);
    if (!article) {
        return res.status(404).json({
            success: false,
            message: 'Article non trouvé'
        });
    }

    const comment = article.comments.id(commentId);
    if (!comment) {
        return res.status(404).json({
            success: false,
            message: 'Commentaire non trouvé'
        });
    }

    // Vérifier si l'utilisateur est l'auteur du commentaire ou un admin
    if (comment.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Vous n\'êtes pas autorisé à supprimer ce commentaire'
        });
    }

    // Remove comment directly from the comments array
    article.comments.pull(commentId);
    await article.save();

    res.status(200).json({
        success: true,
        message: 'Commentaire supprimé avec succès'
    });
});
