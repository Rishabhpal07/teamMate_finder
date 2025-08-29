const express=require("express");
const { auth, usermiddleware } = require("../midleware/authMiddle");
const User = require("../model/user");
const { object } = require("zod");
const upload = require("../midleware/upload");
const router=express.Router();
const multer = require("multer");
const { default: cloudinary, cloudinary_js_config } = require("../lib/cloudinary");


router.get("/profile",usermiddleware,async (req,res)=>{
    try {
        console.log(req.user._id)
        const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json([user.getPublicProfile()]); 
    } catch (error) {
        res.status(500).json({ message: 'Error fetching profile', error: error.message });   
    }
})

router.patch("/updateProfile",usermiddleware,async (req,res)=>{
    const updates=Object.keys(req.body)
    const allowedUpdates = [
        'name', 'college', 'city', 'skills', 'projects', 'bio',
        'techStack', 'hackathonInterests', 'role', 'experience',
        'githubProfile', 'linkedinProfile', 'profileImage'
      ];
      const isValidOperation=updates.every(update=>allowedUpdates.includes(update))
      if (!isValidOperation) {
        return res.status(400).json({ message: 'Invalid updates' });
      }
      try {
        const user=req.user;
        updates.forEach(update=>user[update]=req.body[update]);
        await user.save();
        res.status(200).json(
            user.getPublicProfile()
        )
      } catch (error) {
        res.status(500).json({ message: 'Error updating profile', error: error.message });
      }
})

router.get('/matches',usermiddleware,async (req, res) => {
  try {
    const users=await User.find().select("-password -email -createdAt");
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

  router.post("/connect/:id",usermiddleware,async(req,res)=>{
    try {
        const me=req.user._id;
        const otherUser=req.params.id;
        if(me.toString()==otherUser){
            return res.status(400).json({
                message:"you cant connect with yourself"
            })
        }
        const user=await User.findById(me);
        if(!user.connections.includes(otherUser)){
          user.connections.push(otherUser)
          user.save();
        }
        res.status(200).json({
            message:"user connect sucessfully",
        })
        } catch (error) {
            console.log(error)
        res.status(500).json({
            message:"there is some error while connection with user"
        })
    }
  })
  router.post("/upload", upload.single("file"), async (req, res) => {
    try {
      console.log("✅ File received:", req.file.path);
  
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "uploads",
      });
  
      // delete local file after upload
      fs.unlinkSync(req.file.path);
  
      res.json({ url: result.secure_url });
    } catch (error) {
      console.error("Cloudinary upload failed:", error.message);
      res.status(500).json({ error: "Cloudinary upload failed" });
    }
  });
   
router.get("/connections",usermiddleware, async (req, res) => {
    try {
      const me = req.user._id;
      const user = await User.findById(me).populate("connections", "name email");
      res.json(user.connections);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
   
  module.exports = router;

