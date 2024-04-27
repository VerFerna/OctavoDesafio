import UserManager from "../../../dao/mongoDB/userManager.js";
import { createHash, generateToken } from "../../../helpers/utils.js";

const userManager = new UserManager();

export const register = async (req, res) => {
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

    res.redirect("/");
  } catch (err) {
    if (err.message.includes("Email")) {
      res.status(401).json(err.message);
    } else {
      res.status(500).json(err);
    }
  }
};

export const login = async (req, res) => {
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

    res.cookie(process.env.COOKIE, token, {
      maxAge: 60 * 60 * 2000,
      httpOnly: true,
    });

    res.redirect("/profile");
  } catch (err) {
    if (err.message.includes("Invalid credentials")) {
      res.status(401).json(err.message);
    } else if (err.message.includes("Invalid password")) {
      res.status(401).json(err.message);
    } else {
      res.status(500).json(err);
    }
  }
};

export const reset = async (req, res) => {
  const { email, password } = req.body;

  try {
    const redir = req.cookies[process.env.COOKIE] ? "/profile" : "/";

    const user = await userManager.getUserByEmail(email);

    const userNewPassword = await userManager.updatePassword(email, password);

    const resetPassword = {
      first_name: userNewPassword.first_name,
      last_name: userNewPassword.last_name,
      email: userNewPassword.email,
      role: userNewPassword.role,
    };

    const tokenUser = generateToken(resetPassword);

    res.cookie(process.env.COOKIE, tokenUser, {
      maxAge: 60 * 60 * 2000,
      httpOnly: true,
    });

    res.redirect(redir);
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
};

export const logout = async (req, res) => {
  if (req?.cookies[process.env.COOKIE]) {
    res.clearCookie(process.env.COOKIE, { secure: true });

    res.status(200).redirect("/");
  } else {
    res.status(400).json({ status: "failure", message: "Not logged in" });
  }
};
