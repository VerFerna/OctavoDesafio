import mongoose from "mongoose";

const url = `mongodb+srv://verferna:verferna123@margaritamaia.4pohsdq.mongodb.net/?retryWrites=true&w=majority&appName=MargaritaMaia`;


mongoose.connect(url);

export const mongodb = mongoose.connection;
mongodb.on("error", console.error.bind(console, "MongoDB connection error:"));
mongodb.once("open", () => console.log("Connected to MongoDB successfully."));

process.on("SIGINT", () => {
  mongodb.close(() => {
    console.log("Connection to MongoDB closed");
    process.exit(0);
  });
});
