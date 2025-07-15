import mongoose from "mongoose";

const ConnectTodb = async () => {
  try {
    await mongoose.connect(process.env.MONGODBURL);
    console.log("Connected to Database");
  } catch (error) {
    console.log(error);
  }
};

export default ConnectTodb;
