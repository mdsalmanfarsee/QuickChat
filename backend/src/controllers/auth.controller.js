import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";
import { Readable } from 'stream';








const signup = async (req, res) => {

    const { fullName, email, password } = req.body;
    try {
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "Please fill all the fields" });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be atleast 6 characters long" });
        }
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }

        const salt = await bcrypt.genSalt(12);
        const hassedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({
            fullName: fullName,
            email: email,
            password: hassedPassword
        });

        if (newUser) {
            //generate jwt token
            generateToken(newUser._id, res);
            await newUser.save();
            return res.status(201).json({
                message: "User created successfully",
                _id: newUser._id,
                profilepic: newUser.profilepic,
                fullName: newUser.fullName,
                email: newUser.email,
                createdAt: user.createdAt,
            });

        }
        else {
            return res.status(400).json({ message: "Something went wrong" });
        }

    } catch (error) {

    }
}



const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User does not exist" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        generateToken(user._id, res);
        return res.status(200).json({
            message: "User logged in successfully",
            _id: user._id,
            profilepic: user.profilepic,
            fullName: user.fullName,
            email: user.email,
            createdAt: user.createdAt,
        });

    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}



const logout = (req, res) => {
    try {
        res.clearCookie("jwt");
        return res.status(200).json({ message: "User logged out successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

const updateProfile = async (req, res) => {
    const file = req.file;
    if (!file) {
        return res.status(400).json({ message: "Please provide profile picture" });
    }


    //convert buffer to readable stream and upload to cloudinary

    try {
        //upload to cloudinary
        const uploadToCloudinary = () => {
            return new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder: "QuickChat" },
                    (error, result) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(result.secure_url);
                        }
                    }
                );
                Readable.from(file.buffer).pipe(stream); // Pipe buffer to Cloudinary stream
            });
        };
        const imageUrl = await uploadToCloudinary();

        //update user profile pic
        const userId = req.user._id;
        const updatedUser = await User.findByIdAndUpdate(userId, { profilepic: imageUrl }, { new: true });

        //return res.status(200).json({ updatedUser, message: "Profile picture updated successfully" });
        return res.status(200).json({
            message: "Profile picture updated successfully",
            _id: updatedUser._id,
            profilepic: updatedUser.profilepic,
            fullName: updatedUser.fullName,
            email: updatedUser.email,
            createdAt: updatedUser.createdAt,
        });
    } catch (error) {
        console.log('error in cloudinary:', error);

        return res.status(500).json({ message: "Internal server error while updating" });
    }
}

const checkAuth = (req, res) => {
    try {
        return res.status(200).json({ user: req.user });
    } catch (error) {
        console.log(error);

        return res.status(500).json({ message: "Internal server error" });
    }
}


export { signup, login, logout, updateProfile, checkAuth }; 