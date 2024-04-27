import ChatManager from "../../dao/mongoDB/chatManager.js";
import { Router } from "express";

const chatManager = new ChatManager();
const router = Router();

router.post("/v2/chats", async (req, res) => {
  const { user, message } = req.body;

  try {
    const chat = {
      user,
      message,
    };

    await chatManager.saveMessage(chat);

    res.status(201).json("Message created successfully");
  } catch (err) {
    if (err.message.includes("All fields")) {
      res.status(400).json(err.message);
    } else {
      res.status(500).json(err);
    }
  }
});

router.get("/v2/chats", async (req, res) => {
  try {
    const messages = await chatManager.getMessages();

    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put("/v2/chats/:mid", async (req, res) => {
  const { mid } = req.params;
  const props = req.body;

  try {
    const updatedMessage = await chatManager.editMessage(mid, props);

    res.status(200).json(updatedMessage);
  } catch (err) {
    if (err.message.includes("Invalid message")) {
      res.status(404).json(err.message);
    } else if (err.message.includes("Message cannot")) {
      res.status(404).json(err.message);
    } else if (err.message.includes("Not found")) {
      res.status(400).json(err.message);
    } else {
      res.status(500).json(err);
    }
  }
});

export default router;
