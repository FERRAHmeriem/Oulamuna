import { Schema } from 'mongoose';

const commentSchema = new Schema({
    content: {
        type: String,
        required: [true, 'Le contenu du commentaire est requis'],
        trim: true,
        minLength: [3, 'Le commentaire doit contenir au moins 3 caractères'],
        maxLength: [1000, 'Le commentaire ne peut pas dépasser 1000 caractères']
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'L\'auteur du commentaire est requis']
    },
    parentComment: {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
        default: null // Pour les réponses aux commentaires
    },
    isEdited: {
        type: Boolean,
        default: false
    },
    editedAt: {
        type: Date
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

export default commentSchema;