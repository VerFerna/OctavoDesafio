import { Router } from "express";

const router = Router();

router.get("/", async (req, res) => {
  res.render("page404", {title: "404"});
});

export default router;
