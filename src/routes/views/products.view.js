import ProductManager from "../../dao/mongoDB/productManager.js";
import { Router } from "express";
import { ProductModel } from "../../dao/models/product.model.js";
import passport from "passport";
import { passportCall } from "../../helpers/middlewares.js";

const productManager = new ProductManager();
const router = Router();

router.get(
  "/realtimeproducts",
  passportCall("jwt"),
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { limit } = req.query;

    try {
      const products = await productManager.getProducts(limit);

      res.render("realtimeproducts", {
        title: "Atlas Tech | Products",
        products: products,
        req: req,
      });
    } catch (err) {
      res.status(500).json(err);
    }
  }
);

router.get(
  "/:pid",
  passportCall("jwt"),
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { pid } = req.params;

    try {
      const product = await productManager.getProductById(pid);

      res.render("product", {
        title: `Atlas Tech | ${product.title}`,
        product: product,
        req: req,
      });
    } catch (err) {
      res.status(500).json(err);
    }
  }
);

router.get(
  "/",
  passportCall("jwt"),
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const page = Number(req.query?.page) || 1;
      const limit = Number(req.query?.limit) || 10;
      const sort = {};
      const sortValue = req.query?.sort;
      const query = {};
      const queryParams = req.query?.query || "";

      if (queryParams) {
        const key = queryParams.split(",")[0];
        let value = queryParams.split(",")[1];

        if (!isNaN(Number(value))) {
          value = Number(value);
        }

        query[key] = value;
      }

      if (sortValue === "desc") {
        sort.price = -1;
      } else if (sortValue === "asc") {
        sort.price = 1;
      }

      const result = await ProductModel.paginate(query, {
        page,
        sort,
        limit,
        lean: true,
      });

      let prevLink;
      let nextLink;

      if (result.hasPrevPage == false) {
        prevLink = null;
      } else {
        prevLink = `/products?page=${result.prevPage}&limit=${limit}&sort=${sortValue}`;
      }

      if (result.hasNextPage == false) {
        nextLink = null;
      } else {
        nextLink = `/products?page=${result.nextPage}&limit=${limit}&sort=${sortValue}`;
      }

      result.nextLink = result.hasNextPage
        ? `/products?page=${result.nextPage}&limit=${limit}&sort=${sortValue}`
        : "";
      result.prevLink = result.hasPrevPage
        ? `/products?page=${result.prevPage}&limit=${limit}&sort=${sortValue}`
        : "";

      const format = {
        status: "success",
        payload: result.docs,
        totalPages: result.totalDocs,
        prevPage: result.prevPage,
        nextPage: result.nextPage,
        page: result.page,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
        prevLink: prevLink,
        nextLink: nextLink,
        limit,
      };

      res.render("products", {
        title: "Atlas Tech | Products",
        result: format,
        req: req,
      });
    } catch (err) {
      res.status(400).json("Bad Request");
    }
  }
);

export default router;
