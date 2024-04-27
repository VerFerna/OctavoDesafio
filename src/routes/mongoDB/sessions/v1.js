import { UserModel } from "../../../dao/models/user.model.js";

export const register = async (req, res) => {
  const { first_name, last_name, email, age, password } = req.body;

  try {
    const userExist = await UserModel.findOne({ email: email });

    if (userExist) {
      console.log("Email is already registered");
      return res.status(400).redirect("/");
    }

    const user = { first_name, last_name, email, age, password };

    if (
      user.email === "adminCoder@coder.com" &&
      user.password === "adminCod3r123"
    ) {
      user.role = "admin";
    }

    await UserModel.create(user);

    return res.status(200).redirect("/");
  } catch (err) {
    console.log("Internal server error");
    res.status(500).redirect("/");
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email, password });

    if (!user) {
      console.log("Invalid credentials");
      req.session.destroy();
      return res.status(401).redirect("/");
    } else {
      req.session.user = user;
      req.session.login = true;
    }

    return res.redirect("/profile");
  } catch (err) {
    console.log("Internal server error");
    res.status(500).redirect("/");
  }
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
        password: password,
      });

      const reUser = await UserModel.find(); //Evita recargar login con F5
    }

    return res.status(200).redirect(redir);
  } catch (err) {
    res.status(500).redirect("/");
  }
};

export const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.json({ message: err });
    }
    res.redirect("/");
  });
};
