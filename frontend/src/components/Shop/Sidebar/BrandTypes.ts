import { ProductsDb } from "../ProductDb"

const brand = [...new Set(ProductsDb.map((item) => item.brand))];
const category = [... new Set(ProductsDb.map((item)=> item.category))]
export const BrandTypes = brand
// export const CategoryTypes = ["Hair", "Skincare", "Makeup", "Nail Art", "Body Care", "Fragrance", "Jewelries & Accessories"]
export const CategoryTypes = category