import User from '../models/user.model.js';
import bcrypt from 'bcrypt';
import Profile from '../models/profile.model.js';
import crypto from 'crypto';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import ConnectionRequest from "../models/connections.model.js";

const convertUserDataTOPDF = async(userData) => {
    const doc = new PDFDocument();
    const outputPath = crypto.randomBytes(32).toString('hex') + '.pdf';
    const stream = fs.createWriteStream("uploads/" + outputPath);

    doc.pipe(stream);
    doc.image(`uploads/${userData.userId.profilePicture}`,{align: 'center', width: 100});
    doc.fontSize(14).text(`Name: ${userData.userId.name}`);
    doc.fontSize(14).text(`Username: ${userData.userId.username}`);
    doc.fontSize(14).text(`Email: ${userData.userId.email}`);
    doc.fontSize(14).text(`Bio: ${userData.bio}`);
    doc.fontSize(14).text(`Current Position: ${userData.currentPost}`);
    doc.fontSize(14).text(`Past Work : `);
    userData.pastWork.forEach((work, index) => {
        doc.fontSize(14).text(`Company Name : ${work.company}`);
        doc.fontSize(14).text(`Position : ${work.position}`);
        doc.fontSize(14).text(`Years : ${work.years}`);
    });
    doc.end();
    return outputPath;
};

const register = async(req, res) => {
    try{
        // Registration logic here
        const { name, email, password, username } = req.body;
        if(!name || !email || !password || !username){
            return res.status(400).json({message: "All fields are required"});
        }
        const user = await User.findOne({ email });
        if(user){
            return res.status(400).json({message: "User already exists"});
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            username
        });
        await newUser.save();
        const profile = new Profile({
            userId: newUser._id
        });
        await profile.save();
        return res.status(201).json({message: "User created successfully"});
    }catch(error){
        return res.status(500).json({message: error.message});
    }
};

const login = async(req, res) => {
    try{
        // Login logic here
        const { email, password } = req.body;
        if(!email || !password){
            return res.status(400).json({message: "All fields are required"});
        }
        const user = await User.findOne({ email });
        if(!user){  
            return res.status(404).json({message: "User does not exist"});
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({message: "Invalid credentials"});
        }
        const token = crypto.randomBytes(16).toString('hex');
        await User.updateOne({ _id: user._id }, { token });
        return res.status(200).json({message: "Login successful", token : token});
    }catch(error){
        return res.status(500).json({message: error.message});
    }   
};

const uploadProfilePicture = async(req, res) => {
    try{
       const {token} = req.body;
       if(!token){
        return res.status(400).json({message: "Token is required"});
       }
       const user = await User.findOne({ token });
       if(!user){
        return res.status(404).json({message: "User not found"});
       }
       user.profilePicture = req.file.filename;
       await user.save();
       return res.status(200).json({message: "Profile picture updated successfully"});
    }catch(error){
        return res.status(500).json({message: error.message});
    }
};

const updateUserProfile = async(req, res) => {
    try{
        const {token, ...newUserData} = req.body;
        const user = await User.findOne({ token : token });
        if(!user){
            return res.status(404).json({message: "User not found"});
        }
        const { username, email } = newUserData;
        const existingUser = await User.findOne({$or : [{username}, {email}]});
        if(existingUser || String(existingUser._id) !== String(user._id)){
            return res.status(400).json({message: "User already exists"});
        }
        Object.assign(user, newUserData);
        await user.save();
        return res.status(200).json({message: "User updated successfully"});
    }catch(error){
        return res.status(500).json({message: error.message});
    }
};

const getUserAndProfile = async(req, res) =>{
    try{
        const { token } = req.body;
        if(!token){
            return res.status(400).json({message: "Token is required"});
        }
        const user = await User.findOne({ token });
        if(!user){
            return res.status(404).json({message: "User not found"});
        }
        const userProfile = await Profile.findOne({userId : user._id}).populate("userId", "name email username profilePicture");
        return res.status(200).json({userProfile});
    }catch(error){
        return res.status(500).json({message: error.message});
    }
};

const updateProfileData = async(req, res) => {
    try{
        const { token, ...newProfileData } = req.body;
        if(!token){
            return res.status(400).json({message: "Token is required"});
        }
        const userProfile = await User.findOne({ token : token });
        if(!userProfile){
            return res.status(404).json({message: "User not found"});
        }
        const profileToUpdate = await Profile.findOne({ userId: userProfile._id });
        if(!profileToUpdate){
            return res.status(404).json({message: "Profile not found"});
        }
        Object.assign(profileToUpdate, newProfileData);
        await profileToUpdate.save();
        return res.status(200).json({message: "Profile updated successfully"});
    }catch(error){
        return res.status(500).json({message: error.message});
    }   
};

const getAllUsersProfile = async(req, res) => {
    try{
        const usersProfiles = await Profile.find().populate("userId", "name username email profilePicture");
        return res.status(200).json({usersProfiles});
    }catch(error){
        return res.status(500).json({message: error.message});
    }
};

const downloadProfile = async(req, res) => {
    try{
        const userId  = req.query.id;
        if(!userId){
            return res.status(400).json({message: "User ID is required"});
        }
        const userProfile = await Profile.findOne({userId : userId}).populate("userId", "name username email profilePicture");
        let outputPath = await convertUserDataTOPDF(userProfile);

        return res.status(200).json({"message" : outputPath});
    }
    catch(error){
        return res.status(500).json({message: error.message});
    }
};

const sendConnectionRequest = async(req, res)=>{
    const { token , connectionId} = req.body;
    try {
        const user = await User.findOne({ token : token});
        if(!user){
            return res.status(404).json({ message : "User not found"});
        }
        const connectionUser = await User.findOne({ _id : connectionId});
        if(!connectionUser){
            return res.status(404).json({message : "Connection User not found"});
        }
        const existingRequest = await ConnectionRequest.findOne({
            userId : user._id,
            connectionId : connectionUser._id
        });
        if(existingRequest){
            return res.status(400).json({message : "Request already sent"});
        }
        const request = new ConnectionRequest({
            userId : user._id,
            connectionId : connectionUser._id
        })
        await request.save();
        return res.status(201).json({message : "Request sent"});
    } catch (error) {
        return res.status(500).json({message : error.message});
    }
};

const getMyConnectionRequest = async(req, res) =>{
    const { token } = req.body;
    try {
        const user = await User.findOne({ token });
        if(!user){
            return res.status(404).json({message : "User not found"});
        }
        const connections = await ConnectionRequest.find({ userId : user._id}).populate("connectionId", "name username email profilePicture"); 
        return res.json({connections});
    } catch (error) {
        return res.status(500).json({message : error.message});
    }
};

const whatAreMyConnection = async(req, res) =>{
    const { token } = req.body;
    try {
        const user = await User.findOne({ token });
        if(!user){
            return res.status(404).json({message : "User not found"});
        }
        const connections = await ConnectionRequest.find({ connectionId : user._id}).populate("userId", "name username email profilePicture");
        return res.json({connections});
    } catch (error) {
        return res.status(500).json({message : error.message});
    }
};

const acceptConnectionRequest = async(req, res) =>{
    const {token, requestId, action_type} = req.body;
    try {
        const user = await User.findOne({ token });
        if(!user){
            return res.status(404).json({message : "User not found"});
        }
        const connectionRequest = await ConnectionRequest.findOne({ _id : requestId});
        if(!connectionRequest){
            return res.status(404).json({message : "Connection Request not found"});
        }
        connectionRequest.status_accepted = action_type === "accept" ? true : false;
        await connectionRequest.save();
        return res.status(200).json({message : `Request ${action_type}ed successfully`});
    } catch (error) {
        return res.status(500).json({message : error.message});
    }
};

export { register, login, uploadProfilePicture, updateUserProfile, getUserAndProfile, updateProfileData, getAllUsersProfile, downloadProfile, sendConnectionRequest, getMyConnectionRequest, whatAreMyConnection, acceptConnectionRequest };