import productsRouterFileSystem from "./fileSystem/products.routes.js";
import cartsRouterFileSystem from "./fileSystem/carts.routes.js";
import productRouterMongo from "./mongoDB/products.routes.js";
import cartRouterMongo from "./mongoDB/carts.routes.js";
import chatRouterMongo from "./mongoDB/chats.routes.js";
import userRouterMongo from "./mongoDB/users.routes.js";
import sessionRouterMongo from "./mongoDB/sessions.routes.js";
import jwtRouterMongo from "./mongoDB/jwt.routes.js";

import productsView from "./views/products.view.js";
import cartView from "./views/cart.view.js";
import chatView from "./views/chat.view.js";
import jwtView from "./views/jwt.view.js";

import page404 from "./views/page404.view.js";

const router = (app) => {
  //Postman
  app.use("/api", productsRouterFileSystem);
  app.use("/api", cartsRouterFileSystem);
  app.use("/api", productRouterMongo);
  app.use("/api", cartRouterMongo);
  app.use("/api", chatRouterMongo);
  app.use("/api", userRouterMongo);
  app.use("/api", sessionRouterMongo);
  app.use("/api", jwtRouterMongo);
  //Navegador
  app.use("/products", productsView);
  app.use("/cart", cartView);
  app.use("/chat", chatView);
  app.use("/", jwtView);
  app.use("*", page404);
};

export default router;
