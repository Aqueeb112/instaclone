import { populate } from "dotenv";
import cloudinary from "../config/cloudinary.js";
import { PostModel } from "../models/post.model.js";
import { UserModel } from "../models/user.model.js";
import { CommentModel } from "../models/comment.model.js";
import sharp from "sharp";
import { getReciverSocketId, io } from "../socket/socket.js";

export const addNewPost = async (req, res) => {
  try {
    const { caption } = req.body;
    const image = req.file;
    const authorId = req.id;
    console.log(caption);
    if (!image) {
      return res.status(400).json({ message: "Image Required" });
    }

    const optimizedImage = await sharp(image.buffer)
      .resize({ width: 800, height: 800, fit: "inside" })
      .toFormat("jpeg", { quality: 80 })
      .toBuffer();

    //buffer to data uri

    const fileUri = `data:image/jpeg;base64,${optimizedImage.toString(
      "base64"
    )}`;
    const cloudResponse = await cloudinary.uploader.upload(fileUri, {
      folder: "instagram",
    });

    const post = await PostModel.create({
      caption,
      image: cloudResponse.secure_url,
      author: authorId,
    });
    //    console.log(post)

    const user = await UserModel.findById(authorId);
    if (user) {
      user.posts.push(post._id);
      await user.save();
    }
    await post.populate({ path: "author", select: "-password" });
    return res.status(201).json({
      message: "New Post Added",
      post,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const getAllPost = async (req, res) => {
  try {
    const posts = await PostModel.find()
      .sort({ createdAt: -1 })
      .populate({ path: "author", select: "username profilePicture" })
      .populate({
        path: "comments",
        sort: { createdAt: -1 },
        populate: {
          path: "author",
          select: "username profilePicture",
        },
      });

    return res.status(200).json({
      message: "All Post fetch Successfully",
      posts,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const getUserPost = async (req, res) => {
  try {
    const authorId = req.id;
    const posts = await PostModel.find({ author: authorId })
      .sort({ createdAt: -1 })
      .populate({ path: "author", select: "username,profilePicture" })
      .populate({
        path: "comments",
        sort: { createdAt: -1 },
        populate: {
          path: "author",
          select: "username,profilePicture",
        },
      });

    return res.status(200).json({
      message: "All Post fetch Successfully",
      posts,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const likePost = async (req, res) => {
  try {
    const likekarwala = req.id;
    const postId = req.params.id;

    const post = await PostModel.findById(postId);
    if (!post) {
      return res.status(400).json({ message: "Post not found" });
    }

    await post.updateOne({ $addToSet: { likes: likekarwala } });
    await post.save();

    // implementing socket io for real time notification 
      const user = await UserModel.findById(likekarwala).select('username profilePicture')
      const postOwnerId = post.author.toString();
      if(postOwnerId !== likekarwala){
        const notification = {
          type:"like",
          userId:likekarwala,
          userDetails:user,
          postId,
          message:"Your Post Liked"
        }

        const postOwnerSockedId = getReciverSocketId(postOwnerId)
        io.to(postOwnerSockedId).emit('notification',notification)
      }

    return res.status(201).json({
      message: "Post like successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const dislikePost = async (req, res) => {
  try {
    const likekarwala = req.id;
    const postId = req.params.id;

    const post = await PostModel.findById(postId);
    if (!post) {
      return res.status(400).json({ message: "Post not found" });
    }

    await post.updateOne({ $pull: { likes: likekarwala } });
    await post.save();

      // implementing socket io for real time notification 
      const user = await UserModel.findById(likekarwala).select('username profilePicture')
      const postOwnerId = post.author.toString();
      if(postOwnerId !== likekarwala){
        const notification = {
          type:"dislike",
          userId:likekarwala,
          userDetails:user,
          postId,
          message:"Your Post dislike"
        }

        const postOwnerSockedId = getReciverSocketId(postOwnerId)
        io.to(postOwnerSockedId).emit('notification',notification)
      }

    return res.status(201).json({
      message: "dislike successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const addComment = async (req, res) => {
  try {
    const commentkarnawala = req.id;
    const postId = req.params.id;
    const { text } = req.body;

    const post = await PostModel.findById(postId);

    if (!text) {
      return res.status(400).json({ message: "text is required" });
    }

    const comment = await CommentModel.create({
      text,
      author: commentkarnawala,
      post: postId,
    }) // .populate({
    //   path: "author",
    //   select: "username,profilePicture",
    // });
   

    const populatedComment = await comment.populate({
      path: "author",
      select: "username profilePicture",
    });

    post.comments.push(comment._id);
    await post.save();

    return res.status(201).json({
      message: "Comment save Successfully",
      comment:populatedComment,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const getCommentofPost = async (req, res) => {
  try {
    const postId = req.params.id;

    const comment = await CommentModel.find({ post: postId }).populate(
      "author",
      "username profilePicture",
    );

    if (comment.length === 0)
      return res
        .status(200)
        .json({ message: "No comments found fot this post", success: false });

    return res.status(201).json({
      message: "Comment save Successfully",
      comment,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const authorId = req.id;

    const post = await PostModel.findById(postId);
    if (!post)
      return res.status(400).json({ message: "No post found", success: false });

    // is check if the loggin user is owner of the post
    if (post.author.toString() !== authorId) {
      return res.status(400).json({ message: "unauthorized", success: false });
    }

    //delete post
    await PostModel.findByIdAndDelete(postId);

    //remove the post id from the user post
    let user = await UserModel.findById(authorId);
    user.posts = user.posts.filter((id) => id.toString() !== postId);
    await user.save();

    //delete associated comments
    await CommentModel.deleteMany({ post: postId });

    res.status(201).json({ message: "post deleted",success:true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const bookmarkPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const authorId = req.id;

    const post = await PostModel.findById(postId);
    if (!post)
      return res.status(400).json({ message: "No post found", success: false });

    const user = await UserModel.findById(authorId);
    if (user.bookmarks.includes(post._id)) {
      // if already in the bookmark

      await user.updateOne({ $pull: { bookmarks: post._id } });
      await user.save();
      return res
        .status(201)
        .json({
          type: "unsaved",
          message: "post removed from the bookmark",
          success: true,
        });
    } else {
      //add to bpookmark in the cart
      await user.updateOne({ $addToSet: { bookmarks: post._id } });
      await user.save();
      return res
        .status(201)
        .json({
          type: "saved",
          message: "post add to bookmark",
          success: true,
        });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};


