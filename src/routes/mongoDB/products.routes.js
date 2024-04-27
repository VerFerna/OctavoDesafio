import ProductManager from "../../dao/mongoDB/productManager.js";
import { Router } from "express";

const productManager = new ProductManager();
const router = Router();

router.post("/v2/products", async (req, res) => {
  const { title, description, price, code, stock, category } = req.body;
  const thumbnail = req.thumbnail.lenght > 0 ? req.thumbnail : "";

  if (
    !title ||
    !description ||
    !code ||
    !price ||
    stock === undefined ||
    !category
  ) {
    return res.status(400).json("All fields are required");
  }

  try {
    const product = {
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
      category,
    };

    await productManager.addProduct(product);
    res.status(201).json("Product created successfully");
  } catch (err) {
    if (err.message.includes("Product with")) {
      res.status(409).json(err.message);
    } else {
      res.status(500).json(err);
    }
  }
});

router.get("/v2/products", async (req, res) => {
  const { limit } = req.query;
  try {
    const products = await productManager.getProducts(limit);

    res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/v2/products/:pid", async (req, res) => {
  let { pid } = req.params;

  try {
    const product = await productManager.getProductById(pid);

    res.status(200).json(product);
  } catch (err) {
    if (err.message.includes("Invalid product")) {
      res.status(404).json(err.message);
    } else if (err.message.includes("Not found")) {
      res.status(404).json(err.message);
    } else {
      res.status(500).json(err);
    }
  }
});

router.put("/v2/products/:pid", async (req, res) => {
  const { pid } = req.params;
  const props = req.body;

  try {
    const updatedProduct = await productManager.updateProduct(pid, props);

    res.status(200).json(updatedProduct);
  } catch (err) {
    if (err.message.includes("Invalid product")) {
      res.status(404).json(err.message);
    } else if (err.message.includes("Cannot update")) {
      res.status(404).json(err.message);
    } else if (err.message.includes("Not found")) {
      res.status(400).json(err.message);
    } else {
      res.status(500).json(err);
    }
  }
});

router.delete("/v2/products/physical/:pid", async (req, res) => {
  const { pid } = req.params;

  try {
    let status = await productManager.deleteProduct(pid);

    res.status(200).json(`Product with id: ${pid} was removed`);
  } catch (err) {
    if (err.message.includes("Invalid product")) {
      res.status(404).json(err.message);
    } else if (err.message.includes("Not found")) {
      res.status(404).json(err.message);
    } else {
      res.status(500).json(err);
    }
  }
});

router.delete("/v2/products/logical/:pid", async (req, res) => {
  const { pid } = req.params;
  try {
    let status = await productManager.logicalDeleteProduct(pid);

    res.status(200).json(`Product with id: ${pid} was removed`);
  } catch (err) {
    if (err.message.includes("Invalid product")) {
      res.status(404).json(err.message);
    } else if (err.message.includes("Not found")) {
      res.status(404).json(err.message);
    } else {
      res.status(500).json(err);
    }
  }
});

export default router;
