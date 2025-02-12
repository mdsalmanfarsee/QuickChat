import User from "../models/user.model.js";
import Message from "../models/message.model.js"

const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } });
        return res.status(200).json(filteredUsers);
    } catch (error) {
        console.log("error in getUsersForSidebar: ");

        return res.status(500).json({ message: "Internal server error" });
    }
}

const getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params;
        const myId = req.user.id;

        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: myId }
            ]
        });
        return res.status(200).json(messages);

    } catch (error) {
        console.log("error in getMessages: ");
        return res.status(500).json({ message: "Internal server error" });

    }
}


const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;
        let imageUrl;
        if (image) {
            const upload = await cloudinary.uploader.upload(image);
            imageUrl = upload.secure_url;
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl
        });

        await newMessage.save();

        //todo: send socket.io message to the receiver

        return res.status(200).json(newMessage);

    } catch (error) {
        console.log("error in sendMessage: ");
        return res.status(500).json({ message: "Internal server error" });
    }
}

export { getUsersForSidebar, getMessages, sendMessage };