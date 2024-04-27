import express from "express";
import router from "./routes/index.js";
import hbs from "./configs/handlebars.config.js";
import morgan from "morgan";
import sessions from "./configs/sessions.config.js";
import passport from "passport";
import cookieParser from "cookie-parser";
import { initializePassport } from "./configs/passport.config.js";
import socketioHandler from "./helpers/socket.js";

const app = express();

const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev"));

app.use("/static", express.static("./src/public"));
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
app.set("views", "./src/views");

app.use(cookieParser());
app.use(passport.initialize());
initializePassport();

router(app);

app.get("/", (req, res) => {
  res.render("login", { title: "Atlas Tech" });
});

const httpServer = app.listen(PORT, () => {
  console.log(`Server is running at: http://localhost:${PORT}`);
});

socketioHandler(httpServer);
