const jwt=require("jsonwebtoken");
const User = require("../model/user");

async function usermiddleware(req,res,next) {
    const authHeader = req.headers["authorization"];

    const token = authHeader.split(" ")[1];
    try {
       const decode=jwt.verify(token,process.env.JWT_SECRET) 
       const decodedId=await User.findById(decode.id)
       if(!decodedId){
        return res.status(404).json({ message: "User not found" });
       }
       req.user=decodedId;
       next();
    } catch (error) {
        console.error("JWT Verification Error:", err.message);
        return res.status(403).json({ message: "Invalid or expired token" });  
    }
}

module.exports={
    usermiddleware
}