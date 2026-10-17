import {mongoose} from 'mongoose';


const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: false,
    },
    description: {
        type: String,
        required: false,
        default: "No description provided"},
    price: {
        type: Number,
        required: true,
    },
    brand: {
        type: String,
        required: true,
        default: 'brand not available',
    },
    category: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: false,
    },
    rating: {
        type: Number,
        default: 0,
    },
    inStore: {
        type: Boolean,
        default: true,
    },
    inStock: {
        type: Boolean,
        default: true,
    },

}, {timestamps: true});





const Product = mongoose.model('Product', productSchema);
export default Product;