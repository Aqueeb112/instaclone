import getDataUri from "../config/datauri.js";
import { UserModel } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import cloudinary from "../config/cloudinary.js"
import { PostModel } from "../models/post.model.js";

export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(401).json({
                message: "All fireld are required",
                status: false,
            });
        }

        const existingUser = await UserModel.findOne({ email });

        if (existingUser) {
            return res.status(401).json({ message: "Email already exist" });
        }

        await UserModel.create({
            username,
            email,
            password,
        });

        return res
            .status(200)
            .json({ message: "SignUp Successfully", success: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(401).json({
                message: "All fireld are required",
                status: false,
            });
        }

        let user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: "incorrect Email or password" });
        }

        const isPasswordmatch = password == user.password;

        if (!isPasswordmatch) {
            return res.status(401).json({ message: "incorrect Email or password" });
        }

        const token = await jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
            expiresIn: "30d",
        });

        //populate each post if in the posts array

        const populatedPosts = await Promise.all(
            user.posts.map(async (postId)=>{
                const post = await PostModel.findById(postId);
                if(post?.author.equals(user._id)){
                    return post
                }
                return null
            })
        )

        user = {
            _id:user._id,
            username:user.username,
            email:user.email,
            profilePicture:user.profilePicture,
            bio:user.bio,
            followers:user.followers,
            following:user.following,
            post:populatedPosts
        }

        return res
            .cookie("token", token, {
                httpOnly: true,
                sameSite: "strict",
                maxAge: 30 * 24 * 60 * 60 * 1000,
            })
            .json({
                message: `Welocome Back ${user.username}`,
                success: true,
                user,
            });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
};

export const logout = async (req, res) => {
    try {
        return res.cookie("token", "", { maxAge: 0 }).json({
            message: `Logout Success`,
            success: true,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
};
export const getProfile = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await UserModel.findById(userId).populate({path:"posts",createdAt:-1}).populate('bookmarks');
        return res.status(200).json({
            user,
            success: true,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal Server Error",
            error:error.message
        });
    }
};

export const editProfile = async (req, res) => {
    try {
        // console.log(process.env.CLOUD_NAME, process.env.API_KEY, process.env.API_SECRET);
        const userId = req.id;
        let { bio, gender } = req.body;
        let profilePicture = req.file;
        let cloudResponse;

        if (profilePicture) {
            const uri = getDataUri(profilePicture);
            cloudResponse = await cloudinary.uploader.upload(uri, {
                folder: "instagram"
            });
        }


        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(401).json({
                message: "User not Found",
            });
        }

        if (bio) user.bio = bio;
        if (gender) user.gender = gender;
        if (cloudResponse) user.profilePicture = cloudResponse.secure_url;

        await user.save();
        return res.status(200).json({
            message: "Profile Update Successfully",
            success: true,
            user,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error:error,
            message: "Internal Server Error"
        });
    }
};

export const getSuggestedUser = async (req, res) => {
    try {
        const suggestedUser = await UserModel.find({ _id: { $ne: req.id } }).select(
            "-password"
        );
        if (!suggestedUser) {
            return res.status(400).json({
                message: "Currently dont have have any user",
            });
        }
        return res.status(200).json({
            success: true,
            users: suggestedUser,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
};

export const followandUnfollow = async (req, res) => {
    try {
        const myfollwid = req.id;
        const targetfollowid = req.params.id;
        if (myfollwid === targetfollowid) {
            return res.status(400).json({
                message: "You cannot follow/unfollow yourself",
                success: false
            });
        }

        const user = await UserModel.findById(myfollwid)
        const target = await UserModel.findById(targetfollowid)

        if (!user || !target) {
            return res.status(400).json({
                message: "User Not found",
                success: false
            });
        }

        const isFollowing = user.following.includes(targetfollowid);
        if (isFollowing) {
            await Promise.all([
                UserModel.updateOne({ _id: myfollwid }, { $pull: { following: targetfollowid } }),
                UserModel.updateOne({ _id: targetfollowid }, { $pull: { followers: myfollwid } })
            ])
            return res.status(200).json({ message: "Unfollowed Successfully" ,success:true})
        }
        else {
            await Promise.all([
                UserModel.updateOne({ _id: myfollwid }, { $push: { following: targetfollowid } }),
                UserModel.updateOne({ _id: targetfollowid }, { $push: { followers: myfollwid } })
            ])
            return res.status(200).json({ message: "followed Successfully" ,success:true})
        }


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
};
