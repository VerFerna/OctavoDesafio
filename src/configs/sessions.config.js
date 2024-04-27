import session from "express-session";
import MongoStore from "connect-mongo";
import { mongodb } from "../services/mongo.js";

const url = `mongodb+srv://verferna:verferna123@margaritamaia.4pohsdq.mongodb.net/?retryWrites=true&w=majority&appName=MargaritaMaia`;


const sessions = session({
  secret: secret,
  resave: true,
  saveUninitialized: true,
  /* store: MongoStore.create({
    mongoUrl: `mongodb+srv://verferna:verferna123@margaritamaia.4pohsdq.mongodb.net/?retryWrites=true&w=majority&appName=MargaritaMaia`,
  }), */
});

export default sessions;
