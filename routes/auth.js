const express=require("express");
const router=express.Router();
const jwt=require("jsonwebtoken")
const bcrypt=require("bcrypt");
const User = require("../model/user");
const {z}=require("zod")

router.post("/register", async (req, res) => {
    const requiredbody = z.object({
      name: z.string(),
      email: z.string().email(),
      password: z.string().min(5).max(14),
    });
  
    const parsedData = requiredbody.safeParse(req.body);
    if (!parsedData.success) {
      return res.status(400).json({
        message: "Incorrect data",
        error: parsedData.error.errors,
      });
    }
  
    const { name, email, password } = parsedData.data;
  
    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({
          message: "User already exists",
        });
      }
  
      const hashedpass = await bcrypt.hash(password, 5);
  
      const user = await User.create({
        name,
        password: hashedpass,
        email,
      });
      const token = jwt.sign({ id: user._id },process.env.JWT_SECRET);
     
  
      return res.status(201).json({
        message: "You are signed up",
        token,
        user: user.getPublicProfile(), // you can limit this if needed
      });
  
    } catch (error) {
      console.error("Signup error:", error);
      return res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  });

  router.post("/login",async (req,res)=>{
    try {
        const { email, password } = req.body;
    
        const user = await User.findOne({ email });
        if (!user) {
          return res.status(401).json({ message: 'Invalid credentials' });
        }
    
        const isMatch=await bcrypt.compare(password,user.password)
        if (!isMatch) {
          return res.status(401).json({ message: 'Invalid credentials' });
        }
    
        const token = jwt.sign({ id: user._id }, jwt_secret);
    
        res.json({
         message:"user logged in",
          token,
          user: user.getPublicProfile()
        });
      } catch (error) {
        res.status(500).json({ message: 'Error logging in', error: error.message });
      }
    });
  

module.exports = router; 
