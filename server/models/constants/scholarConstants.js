
// Réutilisation des constantes d'article
import { EPOQUES, DOMAINS_EXPERTISE } from './articleConstants.js';

// Statuts spécifiques aux demandes de savants
export const SCHOLAR_STATUS = [
    'pending',      // En attente de révision
    'approved',     // Approuvé par l'admin
    'rejected'      // Rejeté par l'admin
];

// Types de notifications pour les demandes de savants
export const SCHOLAR_NOTIFICATION_TYPES = {
    SCHOLAR_SUBMITTED: 'scholar_submitted',
    SCHOLAR_APPROVED: 'scholar_approved',
    SCHOLAR_REJECTED: 'scholar_rejected'
};

// Re-export imported constants
export { EPOQUES, DOMAINS_EXPERTISE };