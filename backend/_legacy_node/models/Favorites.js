import mongoose from 'mongoose'
// FAVORITE SCHEMA 
const favoriteSchema = new mongoose.Schema({
    userId: String,
    name: String,
    imageUrl: String,
    price: Number,
    brand: String,
}, {timestamps: true})

export default mongoose.model("Favorites", favoriteSchema)

