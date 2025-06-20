import mongoose from 'mongoose';
import { Schema, model } from 'mongoose';
import commentSchema from './comment.js';
import sectionSchema from './section.js';
import { 
    EPOQUES, 
    LANGUAGES, 
    DOMAINS_EXPERTISE, 
    ARTICLE_STATUS 
} from '../constants/articleConstants.js';
import { validateImageUrl, validatePdfUrl } from '../validators/urlValidators.js';
import { instanceMethods, staticMethods } from '../methods/articleMethods.js';
import { calculateReadingTime } from '../../middlewares/articleMiddleware.js';
import { createArticleIndexes } from '../indexes/articleIndexes.js';
import { createArticleVirtuals } from '../virtuals/articleVirtuals.js';

// ============= ARTICLE SCHEMA =============
const articleSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Le titre de l\'article est requis'],
        trim: true,
        minLength: [5, 'Le titre doit contenir au moins 5 caractères'],
        maxLength: [200, 'Le titre ne peut pas dépasser 200 caractères']
    },
    
    description: {
        type: String,
        required: [true, 'La description est requise'],
        trim: true,
        minLength: [20, 'La description doit contenir au moins 20 caractères'],
        maxLength: [1000, 'La description ne peut pas dépasser 1000 caractères']
    },
    
    scholarName: {
        type: String,
        required: [true, 'Le nom du savant est requis'],
        trim: true,
        maxLength: [100, 'Le nom du savant ne peut pas dépasser 100 caractères']
    },
    
    epoque: {
        type: String,
        required: [true, 'L\'époque est requise'],
        enum: {
            values: EPOQUES,
            message: 'Veuillez sélectionner une époque valide'
        }
    },
    
    articleLanguage: {
        type: String,
        required: [true, 'La langue est requise'],
        enum: {
            values: LANGUAGES,
            message: 'Veuillez sélectionner une langue valide'
        }
    },
    
    domaineExpertise: {
        type: String,
        required: [true, 'Le domaine d\'expertise est requis'],
        enum: {
            values: DOMAINS_EXPERTISE,
            message: 'Veuillez sélectionner un domaine d\'expertise valide'
        }
    },
    
    imageArticle: {
        url: {
            type: String,
            required: [true, 'L\'image principale de l\'article est requise'],
            validate: {
                validator: validateImageUrl,
                message: 'L\'URL de l\'image n\'est pas valide'
            }
        },
    },
    
    sections: [sectionSchema],
    
    pdfFiles: [{
        url: {
            type: String,
            required: true,
            validate: {
                validator: validatePdfUrl,
                message: 'L\'URL doit pointer vers un fichier PDF'
            }
        },
    }],
    
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'L\'auteur de l\'article est requis']
    },
    
    status: {
        type: String,
        enum: {
            values: ARTICLE_STATUS,
            message: 'Statut non valide'
        },
        default: 'draft'
    },
    
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
    
    publishedAt: {
        type: Date,
        default: null
    },
    
    viewCount: {
        type: Number,
        default: 0,
        min: 0
    },
    
    likes: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        likedAt: {
            type: Date,
            default: Date.now
        }
    }],
    
    comments: [commentSchema],
    
    featured: {
        type: Boolean,
        default: false
    },
    
    readingTime: {
        type: Number, // en minutes
        min: 1
    },

    viewers: [{
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        viewedAt: {
            type: Date,
            default: Date.now
        },
        ip: String,
        userAgent: String
    }]
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// ============= SETUP SCHEMA =============
createArticleIndexes(articleSchema);

createArticleVirtuals(articleSchema);

articleSchema.pre('save', calculateReadingTime);

Object.assign(articleSchema.statics, staticMethods);

Object.assign(articleSchema.methods, instanceMethods);

// ============= EXPORT MODEL =============
const Article = model('Article', articleSchema);

export default Article;