import mongoose from "mongoose";
import { CartModel } from "../models/cart.model.js";
import { getLocaleTime } from "../../helpers/utils.js";

class CartManager {
  createCart = async (cart) => {
    try {
      const theLastCart = await CartModel.create(cart);

      console.log(`Cart created successfully - ${getLocaleTime()}`);
      return theLastCart;
    } catch (err) {
      console.log(err);
      return err;
    }
  };

  getCarts = async (limit) => {
    try {
      const carts = CartModel.find().limit(Number(limit));

      return carts;
    } catch {
      console.log("Carts not found");
      return [];
    }
  };

  getCartById = async (idC) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(idC)) {
        console.log(`Invalid cart ID - ${getLocaleTime()}`);
        throw new Error("Invalid cart ID");
      }

      const cart = await CartModel.findById(idC);

      if (!cart) {
        console.error(`Not found Cart - ${getLocaleTime()}`);
        throw new Error("Not found Cart");
      }

      return cart;
    } catch (err) {
      throw err;
    }
  };

  updateCart = async (idC, idP, quantity) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(idC)) {
        console.log(`Invalid cart ID - ${getLocaleTime()}`);
        throw new Error("Invalid cart ID");
      }

      if (!mongoose.Types.ObjectId.isValid(idP)) {
        console.log(`Invalid product ID - ${getLocaleTime()}`);
        throw new Error("Invalid product ID");
      }

      const cart = await CartModel.findById(idC);

      if (!cart) {
        console.log(`Not found Cart - ${getLocaleTime()}`);
        throw new Error("Not found Cart");
      }

      const existingProductIndex = cart.products.findIndex(
        (product) => product.product == idP
      );

      if (existingProductIndex !== -1) {
        cart.products[existingProductIndex].quantity += quantity;
      } else {
        cart.products.push({ product: idP, quantity });
      }

      const updatedCart = await cart.save();

      console.log(updatedCart);
      return updatedCart;
    } catch (err) {
      throw err;
    }
  };

  deleteCart = async (idC) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(idC)) {
        console.log(`Invalid cart ID - ${getLocaleTime()}`);
        throw new Error("Invalid cart ID");
      }

      const cartDeleted = await CartModel.findByIdAndDelete(idC);

      if (!cartDeleted) {
        console.log(`Not found Cart - ${getLocaleTime()}`);
        throw new Error("Not found Cart");
      }

      console.log(`Cart removed - ${getLocaleTime()}`);
      return true;
    } catch (err) {
      throw err;
    }
  };

  deleteProducts = async (idC) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(idC)) {
        console.log(`Invalid cart ID - ${getLocaleTime()}`);
        throw new Error("Invalid cart ID");
      }

      const cart = await CartModel.findById(idC);

      if (!cart) {
        console.log("Not found Cart");
        throw new Error("Not found Cart");
      }

      if (cart.products.length === 0) {
        console.log(`Cart is already empty - ${getLocaleTime()}`);
        throw new Error("Cart is already empty");
      }

      const productsDelete = await CartModel.findByIdAndUpdate(idC, {
        products: [],
      });

      console.log(`Cart was emptied - ${getLocaleTime()}`);
      return true;
    } catch (err) {
      throw err;
    }
  };

  deleteProductById = async (idC, idP) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(idC)) {
        console.log(`Invalid cart ID - ${getLocaleTime()}`);
        throw new Error("Invalid cart ID");
      }

      if (!mongoose.Types.ObjectId.isValid(idP)) {
        console.log(`Invalid product ID - ${getLocaleTime()}`);
        throw new Error("Invalid product ID");
      }

      const updatedCart = await CartModel.findByIdAndUpdate(idC, {
        $pull: { products: { product: idP } },
      });

      if (!updatedCart) {
        console.log(`Not found Cart - ${getLocaleTime()}`);
        throw new Error("Not found Cart");
      }

      const productPosition = updatedCart.products.findIndex(
        (el) => el.product._id == idP
      );

      if (productPosition === -1) {
        console.log(`Not found Product - ${getLocaleTime()}`);
        throw new Error("Not found Product");
      }

      updatedCart.products.splice(productPosition, 1);
      await updatedCart.save();

      console.log(`Product removed successfully - ${getLocaleTime()}`);
      return true;
    } catch (err) {
      throw err;
    }
  };
}

export default CartManager;
