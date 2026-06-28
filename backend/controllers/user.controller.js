import User from '../models/user.model.js';
import bcrypt from 'bcrypt';
import Profile from '../models/profile.model.js';
import crypto from 'crypto';

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
        return res.status(200).json({message: "Login successful", token});
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

export {register, login, uploadProfilePicture, updateUserProfile, getUserAndProfile, updateProfileData, getAllUsersProfile};