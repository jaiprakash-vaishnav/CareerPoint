import Profile from "../models/profile.model.js";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import Post from "../models/posts.model.js";
import Comment from "../models/comments.model.js";

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

const getAllPosts = async(req, res) => {
    try {
        const posts = await Post.find().populate("userId", "name username email profilePicture");
        return res.json({posts});
    } catch (error) {
        return res.status(500).json({message : error.message});
    }
};

const deletePost = async(req, res) => {
    const { token, postId } = req.body;
    if(!token) {
        return res.status(401).json({message: "Unauthorized"});
    }
    if(!postId) {
        return res.status(400).json({message: "Post ID is required"});
    }
    try{
        const user = await User.findOne({token}).select("_id");
        if(!user) {
            return res.status(404).json({message: "User not found"});
        }
        const post = await Post.findOne({ _id: postId });
        if(!post) {
            return res.status(404).json({message: "Post not found"});
        }
        if(post.userId.toString() !== user._id.toString()) {
            return res.status(403).json({message: "You are not authorized to delete this post"});
        }
        await Post.findByIdAndDelete({ _id: postId });
        return res.status(200).json({message: "Post deleted successfully"});
    }catch(err){
        return res.status(500).json({message: err.message});
    }
};

const commentPost = async(req,res) =>{
    const { token, post_id, commentBody } = req.body;
    if(!token){
        return res.status(401).json({message: "Unauthorized"});
    }
    try {
        const user = await User.findOne({ token : token}).select("_id");
        if(!user){
            return res.status(404).json({message: "User not found"});
        }
        const post = await Post.findOne({ _id: post_id });
        if(!post){
            return res.status(404).json({message: "Post not found"});
        }
        const comment = new Comment({
            userId: user._id,
            postId: post._id,
            comment: commentBody
        });
        await comment.save();
        return res.status(201).json({message: "Comment added successfully"});
    } catch (error) {
        res.status(500).json({message : error.message});
    }
};

const getCommentsByPost = async(req,res) =>{
    const { post_id } = req.body;
    if(!post_id){
        return res.status(400).json({message: "Post ID is required"});
    }
    try {
        const post = await Post.findOne({ _id: post_id });
        if(!post){
            return res.status(404).json({message: "Post not found"});
        }   
        return res.status(200).json({comments: post.comments});
    } catch (error) {
        res.status(500).json({message : error.message});
    }
};

const deleteCommentOfUser = async(req,res) =>{
    const { token, comment_id } = req.body;
    try{
        const user = await User.findOne({ token : token}).select("_id");
        if(!user){
            return res.status(404).json({message: "User not found"});
        }
        const comment = await Comment.findOne({ _id: comment_id });
        if(!comment){
            return res.status(404).json({message: "Comment not found"});
        }
        if(comment.userId.toString() !== user._id.toString()) {
            return res.status(403).json({message: "Unauthorized"});
        }
        await Comment.findByIdAndDelete({ _id: comment_id });
        return res.status(200).json({message: "Comment deleted successfully"});

    }catch(err){
        return res.status(500).json({message: err.message});
    }
};

const incrementLikes = async(req,res) =>{
    const { post_id } = req.body;
    if(!post_id){
        return res.status(400).json({message: "Post ID is required"});
    }
    try {
        const post = await Post.findOne({ _id: post_id });
        if(!post){
            return res.status(404).json({message: "Post not found"});
        }
        post.likes += 1;
        await post.save();
        return res.status(200).json({message: "Post liked successfully"});
    } catch (error) {
        res.status(500).json({message : error.message});
    }
};

export {activeCheck, createPost, getAllPosts, deletePost, commentPost, getCommentsByPost, deleteCommentOfUser, incrementLikes};