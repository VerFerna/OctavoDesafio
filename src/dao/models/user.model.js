import mongoose from "mongoose";

const usersCollections = "users";

const userSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: { type: String, unique: true },
  age: Number,
  password: String,
  cartId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "carts",
  },
  social: {
    type: String,
    enum: ["Local", "GitHub", "Google"],
    default: "Local",
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
});

mongoose.set("strictQuery", false);

export const UserModel = mongoose.model(usersCollections, userSchema);
