const express = require("express");

const router = express.Router();

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const multer = require("multer");

const fs = require("fs");

const User = require("../models/User");
console.log("🔥 USER ROUTES FILE LOADED");

// CREATE uploads FOLDER

if (!fs.existsSync("uploads")) {

  fs.mkdirSync("uploads");

}


// MULTER STORAGE

const storage = multer.diskStorage({

  destination: function (req, file, cb) {

    cb(null, "uploads/");

  },

  filename: function (req, file, cb) {

    cb(null, Date.now() + "-" + file.originalname);

  }

});

const upload = multer({ storage });


// REGISTER USER

router.post(

  "/register",

  upload.single("profilePic"),

  async (req, res) => {

    try {

      const { name, email, password } = req.body;

      // CHECK USER EXISTS

      const existingUser = await User.findOne({ email });

      if (existingUser) {

        return res.status(400).json({
          message: "User already exists"
        });

      }

      // HASH PASSWORD

      const hashedPassword = await bcrypt.hash(password, 10);

      // CREATE USER

      const user = new User({

        name,

        email,

        password: hashedPassword,

        profilePic: req.file
          ? req.file.filename
          : ""

      });

      await user.save();

      // TOKEN

      const token = jwt.sign(

        { id: user._id },

        process.env.JWT_SECRET || "secretkey",

        { expiresIn: "1d" }

      );

      // RESPONSE

      res.status(201).json({

        token,

        user: {

          _id: user._id,

          name: user.name,

          email: user.email,

          profilePic: user.profilePic

        }

      });

    } catch (error) {

      console.log(error);

      res.status(500).json({

        message: "Register Error"

      });

    }

  }

);


// LOGIN USER

router.post("/login", async (req, res) => {

  try {

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {

      return res.status(400).json({

        message: "User not found"

      });

    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {

      return res.status(400).json({

        message: "Invalid Password"

      });

    }

    const token = jwt.sign(

      { id: user._id },

      process.env.JWT_SECRET || "secretkey",

      { expiresIn: "1d" }

    );

    res.json({

      token,

      user: {

        _id: user._id,

        name: user.name,

        email: user.email,

        profilePic: user.profilePic

      }

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({

      message: "Login Error"

    });

  }

});


// UPDATE PROFILE PIC

router.put(

  "/update-profile/:id",

  upload.single("profilePic"),

  async (req, res) => {

    try {

      if (!req.file) {

        return res.status(400).json({

          message: "No file uploaded"

        });

      }

      const updatedUser =
      await User.findByIdAndUpdate(

        req.params.id,

        {
          profilePic: req.file.filename
        },

        { new: true }

      );

      res.json({

        _id: updatedUser._id,

        name: updatedUser.name,

        email: updatedUser.email,

        profilePic: updatedUser.profilePic

      });

    } catch (error) {

      console.log(error);

      res.status(500).json({

        message: "Profile upload failed"

      });

    }

  }

);


module.exports = router;