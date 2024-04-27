import { Router } from "express";
import passport from "passport";
import dotenv from "dotenv";
import {
  register as registerV1,
  login as loginV1,
  reset as resetV1,
  logout as logoutV1,
} from "./jwt/v1.js";

dotenv.config();

const router = Router();

router.post("/v1/jwt/register", registerV1);

router.post("/v1/jwt/login", loginV1);

router.post("/v1/jwt/reset", resetV1);

router.get("/v1/jwt/logout", logoutV1);

//GitHub
router.get(
  "/v2/jwt/login-github",
  passport.authenticate("github", { scope: ["user:email"], session: false }),
  async (req, res) => {}
);

router.get(
  "/v2/jwt/githubcallback",
  passport.authenticate("github", { failureRedirect: "/", session: false }),
  async (req, res) => {
    res.cookie(process.env.COOKIE, req.user.token);
    res.redirect("/profile");
  }
);

//Google
router.get(
  "/v2/jwt/login-google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  }),
  async (req, res) => {}
);

router.get(
  "/v2/jwt/googlecallback",
  passport.authenticate("google", { failureRedirect: "/", session: false }),
  async (req, res) => {
    res.cookie(process.env.COOKIE, req.user.token);
    res.redirect("/profile");
  }
);

export default router;
