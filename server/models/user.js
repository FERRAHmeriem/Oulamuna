import { Schema, model } from 'mongoose';
import pkg from 'bcryptjs';
const { hash, compare } = pkg;

const UserSchema = Schema({
    familyName: {
        type: String,
        required: true,
        trim: true
    },
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate: {
            validator: function (v) {
                return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);
            },
            message: props => `${props.value} is not a valid email!`
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    birthday: {
        type: Date,

    },
    sexe: {
        type: String,

        enum: ['Homme', 'Femme']
    },
    profileImage: {
        type: String,
        default: 'default-profile.png'
    },
    userName: {
        type: String,

        unique: true,
        trim: true
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },
    verified: {
        type: Boolean,
        default: false
    },
});



UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await hash(this.password, 12)
    next()
})

UserSchema.methods.matchPassword = async function (pswd, pswdDB) {
    return await compare(pswd, pswdDB);
};


const User = model('User', UserSchema);
const findById = async (id) => await User.findById(id);
const findOne = async (filter) => {
    if (typeof filter === 'string') {
        filter = { email: filter };
    }
    return await User.findOne(filter);
};

export { User, findById, findOne };
