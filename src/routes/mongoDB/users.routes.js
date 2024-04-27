import UserManager from "../../dao/mongoDB/userManager.js";
import { Router } from "express";
import { createHash, generateToken } from "../../helpers/utils.js";

const userManager = new UserManager();
const router = Router();

router.post("/v2/users", async (req, res) => {
  const { first_name, last_name, email, age, password, social, role } = req.body;

  if (!first_name || !last_name || !email || !age) {
    return res.status(400).json("All fields are required");
  }

  try {
    const user = {
      first_name,
      last_name,
      email,
      age,
      password: createHash(password),
      social,
      role,
    };

    const result = await userManager.createUser(user);

    res.status(201).json("User created");
  } catch (err) {
    if (err.message.includes("Email")) {
      res.status(404).json(err.message);
    } else {
      res.status(500).json(err);
    }
  }
});

router.get("/v2/users", async (req, res) => {
  try {
    const users = await userManager.getUsers();

    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/v2/users/:email", async (req, res) => {
  const { email } = req.params;

  try {
    const user = await userManager.getUserByEmail(email);

    res.status(200).json(user);
  } catch (err) {
    if (err.message.includes("User not")) {
      res.status(404).json(err.message);
    } else {
      res.status(500).json(err);
    }
  }
});

router.put("/v2/users", async (req, res) => {
  const { email, password } = req.body;

  try {
    const reset = await userManager.updatePassword(email, password);

    res.status(200).json("Password reset");
  } catch (err) {
    if (err.message.includes("Email")) {
      res.status(404).json(err.message);
    } else if (err.message.includes("Same password")) {
      res.status(404).json(err.message);
    } else {
      res.status(500).json(err);
    }
  }
});

router.post("/v2/register", async (req, res) => {
  const { first_name, last_name, email, age, password, social, role } = req.body;

  try {
    const newUser = {
      first_name,
      last_name,
      email,
      age,
      password: createHash(password),
      social,
      role,
    };

    const user = await userManager.createUser(newUser);

    const token = generateToken({ id: user._id });

    res
      .cookie(process.env.COOKIE, token, {
        maxAge: 60 * 60 * 2000,
        httpOnly: true,
      })
      .json({
        status: "success",
        message: "Successful register",
        token: token,
      });
  } catch (err) {
    if (err.message.includes("Email")) {
      res.status(401).json(err.message);
    } else {
      res.status(500).json(err);
    }
  }
});

router.post("/v2/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const userValid = await userManager.getUserValid(email, password);

    const loginUser = {
      first_name: userValid.first_name,
      last_name: userValid.last_name,
      email: userValid.email,
      role: userValid.role,
    };

    const token = generateToken(loginUser);

    res
      .cookie(process.env.COOKIE, token, {
        maxAge: 60 * 60 * 2000,
        httpOnly: true,
      })
      .json({ status: "success", message: "Successful login", token: token });
  } catch (err) {
    if (err.message.includes("Invalid credentials")) {
      res.status(401).json(err.message);
    } else if (err.message.includes("Invalid password")) {
      res.status(401).json(err.message);
    } else {
      res.status(500).json(err);
    }
  }
});

router.post("/v2/reset", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userManager.getUserByEmail(email);

    const userNewPassword = await userManager.updatePassword(email, password);

    const token = generateToken({ id: user._id });

    res
      .cookie(process.env.COOKIE, token, {
        maxAge: 60 * 60 * 2000,
        httpOnly: true,
      })
      .json({
        status: "success",
        message: "Successful reset password",
        token: token,
      });
  } catch (err) {
    if (err.message.includes("User")) {
      res.status(401).json(err.message);
    } else if (err.message.includes("Email")) {
      res.status(401).json(err.message);
    } else if (err.message.includes("Same")) {
      res.status(401).json(err.message);
    } else {
      res.status(500).json(err);
    }
  }
});

router.get("/v2/logout", async (req, res) => {
  if (req?.cookies[process.env.COOIE]) {
    res
      .clearCookie(process.env.COOKIE, { secure: true })
      .status(200)
      .json({ status: "success", message: "Successful logout" });
  } else {
    res.status(400).json({ status: "failure", message: "Not logged in" });
  }
});

export default router;
