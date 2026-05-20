const express = require("express");
const multer = require("multer");

const router = express.Router();

const Post = require("../models/Post");


// MULTER STORAGE

const storage = multer.diskStorage({

  destination: function(req, file, cb){
    cb(null, "uploads/");
  },

  filename: function(req, file, cb){
    cb(null, Date.now() + "-" + file.originalname);
  }

});

const upload = multer({
  storage: storage
});



// CREATE POST

router.post(
  "/create",
  upload.single("image"),
  async (req, res) => {

    try {

      const { user, caption } = req.body;

      const newPost = new Post({
        user,
        caption,
        image: req.file
          ? req.file.filename
          : ""
      });

      await newPost.save();

      res.status(201).json(newPost);

    } catch(error){

      console.log(error);

      res.status(500).json({
        message: error.message
      });

    }

  }
);



// GET POSTS

router.get("/", async (req, res) => {

  try {

    const posts = await Post.find()
      .sort({ createdAt: -1 });

    res.json(posts);

  } catch(error){

    res.status(500).json({
      message: error.message
    });

  }

});



// ADD COMMENT

router.post("/comment/:id", async (req, res) => {

  try {

    const { user, text } = req.body;

    const post = await Post.findById(req.params.id);

    post.comments.push({
      user,
      text
    });

    await post.save();

    res.json(post);

  } catch(error){

    res.status(500).json({
      message: error.message
    });

  }
});
  
  router.put("/like/:id", async (req, res) => {

  try {

    const post = await Post.findById(req.params.id);

    post.likes += 1;

    await post.save();

    res.json(post);

  } catch(error){

    res.status(500).json({
      message: error.message
    });

  }

});

router.delete("/delete/:id", async (req, res) => {

  try {

    await Post.findByIdAndDelete(req.params.id);

    res.json({
      message: "Post deleted"
    });

  } catch(error){

    res.status(500).json({
      message: error.message
    });

  }

});



module.exports = router;