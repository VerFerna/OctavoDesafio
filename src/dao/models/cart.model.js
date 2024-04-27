import mongoose from "mongoose";

const cartsCollection = "carts";

const productsSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "products",
    },
    quantity: {
      type: Number,
    },
  },
  { _id: false }
);

const cartSchema = new mongoose.Schema({
  products: [productsSchema],
});

cartSchema.pre("findOne", function () {
  this.populate("products.product", "_id title price thumbnail category");
});

export const CartModel = mongoose.model(cartsCollection, cartSchema);
