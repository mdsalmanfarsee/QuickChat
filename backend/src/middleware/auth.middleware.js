import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';


export const protectRoute = async (req, res, next) => {
    const token = req.cookies.jwt;
    //const token = localStorage.getItem("jwt");
    if (!token) {
        return res.status(401).json({ message: "You need to login first" });
    }

    try {
        //console.log(process.env.JWT_SECRET);

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        //console.log(decoded);
        if (!decoded) {
            return res.status(401).json({ message: "Invalid token" })
        }

        const user = await User.findById(decoded.userId);
        console.log("user found: ", user);

        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(500).json({ message: "Internal server error in middleware" });

    }

}