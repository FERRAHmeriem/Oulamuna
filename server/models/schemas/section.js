import { Schema } from 'mongoose';
import { validateImageUrl, validateVideoUrl } from '../validators/urlValidators.js';

const sectionSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Le titre de la section est requis'],
        trim: true,
        maxLength: [200, 'Le titre de la section ne peut pas dépasser 200 caractères']
    },
    content: {
        type: String,
        minLength: [10, 'Le contenu doit contenir au moins 10 caractères']
    },
    pictures: [{
        url: {
            type: String,       
        },
    }],
    videos: [{
        url: {
            type: String,
            required: true,       
        },
    }],
    order: {
        type: Number,
        required: true,
        min: [1, 'L\'ordre doit être au moins 1']
    }
}, {
    timestamps: true
});

export default sectionSchema;