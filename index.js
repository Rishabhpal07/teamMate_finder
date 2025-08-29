const express=require("express")
const mongoose=require("mongoose")
const cors=require("cors")
require('dotenv').config();
const cloudinary=require("cloudinary").v2


const app=express();

cloudinary.config({
  cloud_name:process.env.CLOUD_NAME,
  api_key:process.env.API_KEY,
  api_secret:process.env.API_SECRET,
})

app.use(cors());
 app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/user', require('./routes/user'));
app.use('/api/message',require('./routes/message'))

async function main() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log(" Connected to MongoDB");

    app.listen(3002, () => {
      console.log("Server running on port 3002");
    });
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
  }
}

main();
