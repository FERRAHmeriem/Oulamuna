import mongoose from 'mongoose';

/**
 * Instance methods for Article model
 */
export const instanceMethods = {
    /**
     * Increment view count and track viewer
     */
    incrementView: function (userId = null, ip = null, userAgent = null) {
        this.viewCount += 1;

        // Ajouter le viewer si des informations sont là
        if (userId || ip) {
            this.viewers.push({
                user: userId,
                ip: ip,
                userAgent: userAgent,
                viewedAt: new Date()
            });
        }

        return this.save();
    },

    /**
     * Add like to article
     */
    addLike: function (userId) {
        // Check if user already liked the article
        const alreadyLiked = this.likes.some(like =>
            like.user && like.user.toString() === userId.toString()
        );

        if (!alreadyLiked) {
            this.likes.push({ user: userId });
        }
        return this.save();
    },

    /**
     * Remove like from article
     */
    removeLike: function (userId) {
        this.likes = this.likes.filter(like =>
            !like.user || like.user.toString() !== userId.toString()
        );
        return this.save();
    },

    /**
     * Add comment to article
     */
    addComment: function (commentData) {
        this.comments.push(commentData);
        return this.save();
    }
};

/**
 * Static methods for Article model
 */
export const staticMethods = {
    /**
     * Get articles by status
     */
    getByStatus: function (status, limit = 10, skip = 0) {
        return this.find({ status })
            .populate('author', 'firstName familyName userName')
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip(skip);
    },

    /**
     * Get most viewed articles by author
     */
    getMostViewedByAuthor: function (authorId, limit = 3) {
        return this.find({
            author: authorId,
            status: 'approved'
        })
            .populate('author', 'firstName familyName userName')
            .sort({ viewCount: -1 })
            .limit(limit);
    },

    /**
     * Get all articles by author sorted by views
     */
    getAllByAuthorSortedByViews: function (authorId, limit = 10, skip = 0) {
        return this.find({
            author: authorId,
            status: 'approved'
        })
            .populate('author', 'firstName familyName userName')
            .sort({ viewCount: -1 })
            .limit(limit)
            .skip(skip);
    },

    /**
     * Get comprehensive author statistics
     */
    getAuthorStats: async function (authorId) {
        const stats = await this.aggregate([
            { $match: { author: new mongoose.Types.ObjectId(authorId) } },
            {
                $group: {
                    _id: null,
                    totalArticles: { $sum: 1 },
                    totalLikes: { $sum: { $size: '$likes' } },
                    totalComments: { $sum: { $size: '$comments' } },
                    totalViews: { $sum: '$viewCount' },
                    totalReadingTime: { $sum: '$readingTime' },
                    domainesExpertise: { $addToSet: '$domaineExpertise' }
                }
            },
            {
                $project: {
                    _id: 0,
                    totalArticles: 1,
                    totalLikes: 1,
                    totalComments: 1,
                    totalViews: 1,
                    totalReadingTime: 1,
                    numberOfCategpriesExplored: { $size: '$domainesExpertise' },
                    domainesExpertise: 1
                }
            }
        ]);

        // Get status counts with separate queries
        const statusStats = {
            approved: await this.countDocuments({ author: authorId, status: 'approved' }),
            draft: await this.countDocuments({ author: authorId, status: 'draft' }),
            pending: await this.countDocuments({ author: authorId, status: 'pending' }),
            rejected: await this.countDocuments({ author: authorId, status: 'rejected' }),
            archived: await this.countDocuments({ author: authorId, status: 'archived' })
        };

        return {
            ...(stats[0] || {
                totalArticles: 0,
                totalLikes: 0,
                totalComments: 0,
                totalViews: 0,
                totalReadingTime: 0,
                uniqueDomainesCount: 0,
                domainesExpertise: []
            }),
            approvedArticles: statusStats.approved || 0,
            draftArticles: statusStats.draft || 0,
            pendingArticles: statusStats.pending || 0,
            rejectedArticles: statusStats.rejected || 0,
            archivedArticles: statusStats.archived || 0
        };
    }
};