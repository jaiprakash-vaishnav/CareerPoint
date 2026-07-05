import Profile from "../models/profile.model.js";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import Post from "../models/posts.model.js";

const activeCheck = async(req, res) => {
    return res.status(200).json({message: "Active"});
};

const createPost = async(req, res) => {
    const  { token } = req.body;
    if(!token) {
        return res.status(401).json({message: "Unauthorized"});
    }
    try{
        const user = await User.findOne({token});
        if(!user) {
            return res.status(404).json({message: "User not found"});
        }
        const post = new Post({
            userId: user._id,
            body: req.body.body,
            media : req.file != undefined ? req.file.path : "",
            filetype : req.file != undefined ? req.file.mimetype.split("/")[1] : "",
        });
        await post.save();
        return res.status(201).json({message: "Post created successfully"});
    }catch(err){
        return res.status(500).json({message: err.message});
    }
};
export {activeCheck, createPost};