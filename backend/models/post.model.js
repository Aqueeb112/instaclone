import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  caption: {
    type: String,
    default: "",
  },
  image: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      // required:true,
    },
  ],
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      // required:true,
    },
  ],
});

export const PostModel = mongoose.model("Post", postSchema);
