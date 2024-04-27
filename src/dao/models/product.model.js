import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productsCollection = "products";

const enumCategories = ["DAMAS", "CABALLEROS", "KIDS"];

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  thumbnail: Array,
  code: { type: String, unique: true, index: true, required: true },
  stock: { type: Number, required: true },
  category: { type: String, index: true, enum: enumCategories, required: true },
  status: Boolean,
});

productSchema.plugin(mongoosePaginate);

mongoose.set("strictQuery", false);

export const ProductModel = mongoose.model(productsCollection, productSchema);
