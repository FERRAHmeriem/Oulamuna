// ============= STATIC METHODS =============
export const staticMethods = {
    // Rechercher des savants approuvés par nom
    async searchByName(name, options = {}) {
        const { page = 1, limit = 10 } = options;
        const skip = (page - 1) * limit;
        
        return await this.find({
            name: { $regex: name, $options: 'i' },
            status: 'approved'
        })
        .sort({ name: 1 })
        .skip(skip)
        .limit(limit);
    },

    // Rechercher par époque
    async searchByEpoque(epoque, options = {}) {
        const { page = 1, limit = 10 } = options;
        const skip = (page - 1) * limit;
        
        return await this.find({
            epoque,
            status: 'approved'
        })
        .sort({ name: 1 })
        .skip(skip)
        .limit(limit);
    },

    // Rechercher par domaine d'expertise
    async searchByDomaine(domaineExpertise, options = {}) {
        const { page = 1, limit = 10 } = options;
        const skip = (page - 1) * limit;
        
        return await this.find({
            domaineExpertise,
            status: 'approved'
        })
        .sort({ name: 1 })
        .skip(skip)
        .limit(limit);
    },

    // Recherche avancée avec filtres multiples
    async advancedSearch(filters = {}, options = {}) {
        const { page = 1, limit = 10, sortBy = 'name', sortOrder = 'asc' } = options;
        const skip = (page - 1) * limit;
        
        const query = { status: 'approved' };
        
        if (filters.name) {
            query.name = { $regex: filters.name, $options: 'i' };
        }
        
        if (filters.epoque) {
            query.epoque = filters.epoque;
        }
        
        if (filters.domaineExpertise) {
            query.domaineExpertise = filters.domaineExpertise;
        }
        
        const sortOptions = {};
        sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
        
        return await this.find(query)
            .sort(sortOptions)
            .skip(skip)
            .limit(limit);
    },
    // Obtenir les statistiques des demandes
    async getRequestStats() {
        const stats = await this.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);
        
        return {
            pending: stats.find(s => s._id === 'pending')?.count || 0,
            approved: stats.find(s => s._id === 'approved')?.count || 0,
            rejected: stats.find(s => s._id === 'rejected')?.count || 0
        };
    }
};

// ============= INSTANCE METHODS =============
export const instanceMethods = {
    // Approuver un savant
    async approve(adminId, notes = '') {
        this.status = 'approved';
        this.approvedAt = new Date();
        this.adminReview = {
            reviewedBy: adminId,
            reviewedAt: new Date(),
            reviewNotes: notes
        };
        
        return await this.save();
    },

    // Rejeter un savant
    async reject(adminId, reason, notes = '') {
        this.status = 'rejected';
        this.adminReview = {
            reviewedBy: adminId,
            reviewedAt: new Date(),
            rejectionReason: reason,
            reviewNotes: notes
        };
        
        return await this.save();
    },

    // Incrémenter le nombre d'articles
    async incrementArticleCount() {
        this.articlesCount += 1;
        return await this.save();
    },

    // Décrémenter le nombre d'articles
    async decrementArticleCount() {
        if (this.articlesCount > 0) {
            this.articlesCount -= 1;
            return await this.save();
        }
        return this;
    },

    // Vérifier si le savant peut être utilisé pour les articles
    canBeUsedInArticles() {
        return this.status === 'approved';
    },

    // Obtenir les articles de ce savant
    async getArticles(options = {}) {
        const { page = 1, limit = 10, status = 'approved' } = options;
        const skip = (page - 1) * limit;
        
        const Article = this.constructor.model('Article');
        
        return await Article.find({
            scholar: this._id,
            status
        })
        .populate('author', 'firstName familyName userName profilePicture')
        .sort({ publishedAt: -1 })
        .skip(skip)
        .limit(limit);
    }
};