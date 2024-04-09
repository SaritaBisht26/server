import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";

const connectToDB = () => {
  // Set strictQuery option to false
  mongoose.set('strictQuery', false);

  mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
      console.log("connection established successfully!");
    })
    .catch((err) => console.log("some error occurred", err.message));
};

export default connectToDB;
