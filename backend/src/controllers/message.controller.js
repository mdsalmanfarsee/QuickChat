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



export { getUsersForSidebar, getMessages };