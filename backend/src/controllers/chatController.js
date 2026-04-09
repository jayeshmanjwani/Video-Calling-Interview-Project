import { chatClient } from "../lib/stream.js";

export async function getStreamToken(req, res) {
    try {
        // use clerkId for Stream (not mongo_id) => It should match the Id that we have in Stream dashboard
        const token=chatClient.createToken(req.user.clerkId);

        res.status(200).json({
            token,
            userId: req.user.clerkId,
            userName: req.user.name,
            userImage: req.user.profileImage
        })
    } catch (error) {
        console.log("Error in getStreamToken controller:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}