
import { mongoose } from "mongoose";
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
  
    shippingAddress: {
        type: Object,
        required: false,
        default: {
            street: '',
            city: '',
            state: '',
            zip: '',
        },
    },
    phone: {
        type: String,
        required: false,
    },
    role: {
        type: String,
        required: false,
    }
}, {timestamps: true});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    return next(error);
  }
});


const User = mongoose.model('User', userSchema);
export default User;