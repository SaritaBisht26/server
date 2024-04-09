import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
const connectToDB = () => {
  mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
      console.log("connection established successfully!");
    })
    .catch((err) => console.log("some error occured",err.message));
};

export default connectToDB;
