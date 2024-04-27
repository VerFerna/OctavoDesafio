import CartManager from "../../dao/fileSystem/cartManager.js";
import { Router } from "express";

const cartManager = new CartManager();
const router = Router();

router.post("/v1/carts", async (req, res) => {
  try {
    const newCart = await cartManager.createCart();
    res.status(201).json("New Cart created");
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/v1/carts/:cid/product/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  const quantity = req.body.quantity || 1;

  try {
    const updatedCart = await cartManager.updateCart(
      Number(cid),
      Number(pid),
      quantity
    );

    res.status(200).json("Product was added correctly");
  } catch (err) {
    if (err.message.includes("Not found Cart")) {
      res.status(404).json(err.message);
    } else if (err.message.includes("Not found Product")) {
      res.status(404).json(err.message);
    } else if (err.message.includes("Exceeds available stock")) {
      res.status(404).json(err.message);
    } else {
      res.status(500).json(err);
    }
  }
});

router.get("/v1/carts", async (req, res) => {
  const { limit } = req.query;

  try {
    const carts = await cartManager.getCarts();

    if (carts === undefined) {
      res.status(200).json([]);
    }

    if (!limit || limit < 1) {
      res.status(200).json(carts);
    } else {
      const limitedCarts = carts.slice(0, limit);
      res.status(206).json(limitedCarts);
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/v1/carts/:cid", async (req, res) => {
  const { cid } = req.params;

  try {
    const cart = await cartManager.getCartById(Number(cid));

    res.status(200).json(cart);
  } catch (err) {
    if (err.message.includes("Not found")) {
      res.status(404).json(err.message);
    } else {
      res.status(500).json(err);
    }
  }
});

router.delete("/v1/carts/:cid", async (req, res) => {
  const { cid } = req.params;

  try {
    const cart = await cartManager.deleteCart(Number(cid));

    res.status(200).json(`Cart with id: ${cid} was removed`);
  } catch (err) {
    if (err.message.includes("Not found")) {
      res.status(404).json(err.message);
    } else {
      res.status(500).json(err);
    }
  }
});

router.delete("/v1/carts/:cid/products", async (req, res) => {
  const { cid } = req.params;

  try {
    const cart = await cartManager.deleteProducts(Number(cid));

    res.status(200).json(`Cart with id: ${cid} was emptied`);
  } catch (err) {
    if (err.message.includes("Not found")) {
      res.status(404).json(err.message);
    } else if (err.message.includes("Cart is already")) {
      res.status(404).json(err.message);
    } else {
      res.status(500).json(err);
    }
  }
});

router.delete("/v1/carts/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;

  try {
    const cart = await cartManager.deleteProductById(Number(cid), Number(pid));

    res.status(200).json(`Product with id: ${pid} has been removed`);
  } catch (err) {
    if (err.message.includes("Not found Cart")) {
      res.status(404).json(err.message);
    } else if (err.message.includes("Not found Product")) {
      res.status(404).json(err.message);
    } else {
      res.status(500).json(err);
    }
  }
});

export default router;
