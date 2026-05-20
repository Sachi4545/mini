const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  user: String,
  text: String
});

const postSchema = new mongoose.Schema({

  user: {
    type: String,
    required: true
  },

  caption: {
    type: String,
    required: true
  },

    image: {
        type: String
    },

    likes: {
        type: Number,
        default: 0
    },

  comments: [commentSchema]

}, { timestamps: true });

module.exports = mongoose.model("Post", postSchema);