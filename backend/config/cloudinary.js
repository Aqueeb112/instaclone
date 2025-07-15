import { v2 as cloudinary } from 'cloudinary'
import dotenv from "dotenv"
dotenv.config()

// console.log(process.env.CLOUD_NAME); // should print: dhuhsakun
// console.log(process.env.API_KEY);    // should print: 946359173869341
// console.log(process.env.API_SECRET); // should print: -yO4PaxTRNiqd_lI45m2g8hsZjY

cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key:process.env.API_KEY, 
  api_secret:process.env.API_SECRET
});

export default cloudinary