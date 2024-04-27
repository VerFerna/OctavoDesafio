import CartManager from "../../dao/mongoDB/cartManager.js";
import { Router } from "express";

const cartManager = new CartManager();
const router = Router();

router.post("/v2/carts", async (req, res) => {
  try {
    const newCart = await cartManager.createCart();
    res.status(201).json("New Cart created");
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/v2/carts/:cid/product/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  const quantity = req.body.quantity || 1;

  try {
    const updatedCart = await cartManager.updateCart(cid, pid, quantity);

    res.status(200).json("Product was added correctly");
  } catch (err) {
    if (err.message.includes("Invalid cart")) {
      res.status(404).json(err.message);
    } else if (err.message.includes("Invalid product")) {
      res.status(404).json(err.message);
    } else if (err.message.includes("Not found")) {
      res.status(404).json(err.message);
    } else {
      res.status(500).json(err);
    }
  }
});

router.get("/v2/carts", async (req, res) => {
  const { limit } = req.query;

  try {
    const carts = await cartManager.getCarts(limit);

    res.status(200).json(carts);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/v2/carts/:cid", async (req, res) => {
  let { cid } = req.params;

  try {
    const product = await cartManager.getCartById(cid);

    res.status(200).json(product);
  } catch (err) {
    if (err.message.includes("Invalid cart")) {
      res.status(404).json(err.message);
    } else if (err.message.includes("Not found")) {
      res.status(404).json(err.message);
    } else {
      res.status(500).json(err);
    }
  }
});

router.delete("/v2/carts/:cid", async (req, res) => {
  const { cid } = req.params;

  try {
    const status = await cartManager.deleteCart(cid);

    res.status(200).json(`Cart with id: ${cid} was removed`);
  } catch (err) {
    if (err.message.includes("Invalid cart")) {
      res.status(404).json(err.message);
    } else if (err.message.includes("Not found")) {
      res.status(404).json(err.message);
    } else {
      res.status(500).json(err);
    }
  }
});

router.delete("/v2/carts/:cid/products", async (req, res) => {
  const { cid } = req.params;

  try {
    const status = await cartManager.deleteProducts(cid);

    res.status(200).json(`Cart with id: ${cid} was emptied`);
  } catch (err) {
    if (err.message.includes("Invalid cart")) {
      res.status(404).json(err.message);
    } else if (err.message.includes("Not found")) {
      res.status(404).json(err.message);
    } else if (err.message.includes("Cart is already")) {
      res.status(404).json(err.message);
    } else {
      res.status(500).json(err);
    }
  }
});

router.delete("/v2/carts/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;

  try {
    const status = await cartManager.deleteProductById(cid, pid);

    res.status(200).json(`Product with id: ${pid} has been removed`);
  } catch (err) {
    if (err.message.includes("Invalid cart")) {
      res.status(404).json(err.message);
    } else if (err.message.includes("Invalid product")) {
      res.status(404).json(err.message);
    } else if (err.message.includes("Not found Cart")) {
      res.status(404).json(err.message);
    } else if (err.message.includes("Not found Product")) {
      res.status(404).json(err.message);
    } else {
      res.status(500).json(err);
    }
  }
});

export default router;
