import mongoose from 'mongoose';
import { Schema, model } from 'mongoose';
import {
    EPOQUES,
    DOMAINS_EXPERTISE,
    SCHOLAR_STATUS
} from '../constants/scholarConstants.js';
import { validateImageUrl } from '../validators/urlValidators.js';
import { instanceMethods, staticMethods } from '../methods/scholarMethods.js';
import { createScholarIndexes } from '../indexes/scholarIndexes.js';
import { createScholarVirtuals } from '../virtuals/scholarVirtuals.js';

// ============= SCHOLAR SCHEMA =============
const scholarSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Le nom du savant est requis'],
        trim: true,
        minLength: [2, 'Le nom doit contenir au moins 2 caractères'],
        maxLength: [100, 'Le nom ne peut pas dépasser 100 caractères']
    },

    picture: {
        type: String,
        required: [true, 'La photo du savant est requise'],
    },

    epoque: {
        type: String,
        required: [true, 'L\'époque est requise'],
        enum: {
            values: EPOQUES,
            message: 'Veuillez sélectionner une époque valide'
        }
    },
    biography: {
        type: String,
        required: [true, 'La biographie est requise'],
        minLength: [10, 'La biographie doit contenir au moins 10 caractères'],
        maxLength: [2000, 'La biographie ne peut pas dépasser 2000 caractères']
    },

    domaineExpertise: {
        type: String,
        required: [true, 'Le domaine d\'expertise est requis'],
        enum: {
            values: DOMAINS_EXPERTISE,
            message: 'Veuillez sélectionner un domaine d\'expertise valide'
        }
    },

    // Utilisateur qui a soumis la demande
    submittedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'L\'utilisateur qui soumet la demande est requis']
    },

    // Statut de la demande
    status: {
        type: String,
        enum: {
            values: SCHOLAR_STATUS,
            message: 'Statut non valide'
        },
        default: 'pending'
    },

    // Révision par l'admin
    adminReview: {
        reviewedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        reviewedAt: Date,
        reviewNotes: {
            type: String,
            maxLength: [500, 'Les notes de révision ne peuvent pas dépasser 500 caractères']
        },
        rejectionReason: {
            type: String,
            maxLength: [500, 'La raison du rejet ne peut pas dépasser 500 caractères']
        }
    },

    // Date d'approbation
    approvedAt: {
        type: Date,
        default: null
    },

    // Statistiques
    articlesCount: {
        type: Number,
        default: 0,
        min: 0
    },

}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// ============= SETUP SCHEMA =============
createScholarIndexes(scholarSchema);

createScholarVirtuals(scholarSchema);

Object.assign(scholarSchema.statics, staticMethods);

Object.assign(scholarSchema.methods, instanceMethods);

// ============= EXPORT MODEL =============
const Scholar = model('Scholar', scholarSchema);

export default Scholar;