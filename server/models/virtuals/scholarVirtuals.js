export const createScholarVirtuals = (schema) => {
    // Virtual pour vérifier si le savant est approuvé
    schema.virtual('isApproved').get(function() {
        return this.status === 'approved';
    });
    
    // Virtual pour vérifier si le savant est en attente
    schema.virtual('isPending').get(function() {
        return this.status === 'pending';
    });
    
    // Virtual pour vérifier si le savant est rejeté
    schema.virtual('isRejected').get(function() {
        return this.status === 'rejected';
    });
    
    // Virtual pour obtenir le nom complet avec époque
    schema.virtual('fullNameWithEpoque').get(function() {
        return `${this.name} (${this.epoque})`;
    });
    
    // Virtual pour obtenir lwa9t li jaz depuis la soumission
    schema.virtual('timeFromSubmission').get(function() {
        const now = new Date();
        const diff = now - this.createdAt;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        
        if (days === 0) return 'Aujourd\'hui';
        if (days === 1) return 'Il y a 1 jour';
        if (days < 7) return `Il y a ${days} jours`;
        if (days < 30) return `Il y a ${Math.floor(days / 7)} semaine(s)`;
        if (days < 365) return `Il y a ${Math.floor(days / 30)} mois`;
        return `Il y a ${Math.floor(days / 365)} an(s)`;
    });
    
    // Virtual pour obtenir lwa9t li jaz depuis l'approbation
    schema.virtual('timeFromApproval').get(function() {
        if (!this.approvedAt) return null;
        
        const now = new Date();
        const diff = now - this.approvedAt;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        
        if (days === 0) return 'Approuvé aujourd\'hui';
        if (days === 1) return 'Approuvé il y a 1 jour';
        if (days < 7) return `Approuvé il y a ${days} jours`;
        if (days < 30) return `Approuvé il y a ${Math.floor(days / 7)} semaine(s)`;
        if (days < 365) return `Approuvé il y a ${Math.floor(days / 30)} mois`;
        return `Approuvé il y a ${Math.floor(days / 365)} an(s)`;
    });
    
    // Virtual pour obtenir un résumé du statut
    schema.virtual('statusSummary').get(function() {
        switch (this.status) {
            case 'pending':
                return 'En attente de révision';
            case 'approved':
                return `Approuvé - ${this.articlesCount} article(s)`;
            case 'rejected':
                return 'Demande rejetée';
            default:
                return 'Statut inconnu';
        }
    });
};