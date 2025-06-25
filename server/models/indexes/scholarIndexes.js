export const createScholarIndexes = (schema) => {
    // Index pour la recherche par nom
    schema.index({ name: 1 });
    
    // Index pour la recherche textuelle
    schema.index({ name: 'text', biography: 'text' });
    
    // Index composé pour les filtres courants
    schema.index({ status: 1, epoque: 1 });
    schema.index({ status: 1, domaineExpertise: 1 });
    schema.index({ status: 1, articlesCount: -1 });
    schema.index({ status: 1, featured: 1 });
    
    // Index pour les demandes en attente (pour les admins)
    schema.index({ status: 1, createdAt: -1 });
    
    // Index pour l'utilisateur qui a soumis
    schema.index({ submittedBy: 1 });
    
    // Index pour les savants approuvés (le plus utilisé)
    schema.index({ status: 1, name: 1 });
    
    // Index pour la popularité (nombre d'articles)
    schema.index({ articlesCount: -1 });
    
    // Index pour les dates importantes
    schema.index({ approvedAt: -1 });
    schema.index({ createdAt: -1 });
    
    // Index composé pour la recherche avancée
    schema.index({ 
        status: 1, 
        epoque: 1, 
        domaineExpertise: 1, 
        name: 1 
    });
};