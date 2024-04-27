import { Router } from "express";
import ChatManager from "../../dao/mongoDB/chatManager.js";
import passport from "passport";
import { passportCall } from "../../helpers/middlewares.js";

const router = Router();
const chatManager = new ChatManager();

router.get(
  "/",
  passportCall("jwt"),
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const messages = await chatManager.getMessages();

    res.render("chat", {
      title: "Atlas Tech | Chat",
      messages: messages,
      req: req,
    });
  }
);

export default router;
