import { UserModel } from "../../../dao/models/user.model.js";
import UserManager from "../../../dao/mongoDB/userManager.js";
import { createHash } from "../../../helpers/utils.js";

const userManager = new UserManager();

export const register = async (req, res) => {
  if (!req.user) {
    console.log("Sign up failed");
    return res.status(400).redirect("/");
  }

  return res.status(200).redirect("/");
};

export const login = async (req, res) => {
  if (!req.user) {
    console.log("Invalid credentials");
    req.session.destroy();
    return res.status(400).redirect("/");
  } else {
    req.session.user = req.user;
    req.session.login = true;
  }

  return res.redirect("/profile");
};

export const reset = async (req, res) => {
  const { email, password } = req.body;

  try {
    const redir = req.session.login ? "/profile" : "/"; //Verifica session para redirigir

    const user = await UserModel.findOne({ email });

    if (!user) {
      console.log("User not found");
      req.session.destroy();
      return res.status(404).redirect(redir);
    } else {
      const userId = user._id;

      const userNewPassword = await UserModel.findByIdAndUpdate(userId, {
        password: createHash(password),
      });

      const reUser = await UserModel.find(); //Evita recargar login con F5
    }

    return res.status(200).redirect(redir);
  } catch (err) {
    res.status(500).redirect("/");
  }
};
