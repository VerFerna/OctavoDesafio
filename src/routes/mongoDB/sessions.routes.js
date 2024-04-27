import passport from "passport";
import { Router } from "express";
import {
  register as registerV1,
  login as loginV1,
  reset as resetV1,
  logout,
} from "./sessions/v1.js";
import {
  register as registerV2,
  login as loginV2,
  reset as resetV2,
} from "./sessions/v2.js";

const router = Router();

router.post("/v1/sessions/register", registerV1);

router.post("/v1/sessions/login", loginV1);

router.post("/v1/sessions/reset", resetV1);

router.post("/v2/sessions/reset", resetV2);

router.get("/v1/sessions/logout", logout);

//Passport
router.post(
  "/v2/sessions/register",
  passport.authenticate("register", {
    failureRedirect: "/",
  }),
  registerV2
);

router.post(
  "/v2/sessions/login",
  passport.authenticate("login", {
    failureRedirect: "/",
  }),
  loginV2
);

//GitHub
router.get(
  "/v2/sessions/login-github",
  passport.authenticate("github", { scope: ["user:email"], session: true }),
  async (req, res) => {}
);

router.get(
  "/v2/sessions/githubcallback",
  passport.authenticate("github", { failureRedirect: "/" }),
  async (req, res) => {
    req.session.user = req.user;
    req.session.login = true;
    res.redirect("/profile");
  }
);

//Google
router.get(
  "/v2/sessions/login-google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: true,
  }),
  async (req, res) => {}
);

router.get(
  "/v2/sessions/googlecallback",
  passport.authenticate("google", { failureRedirect: "/" }),
  async (req, res) => {
    req.session.user = req.user;
    req.session.login = true;
    res.redirect("/profile");
  }
);

export default router;
