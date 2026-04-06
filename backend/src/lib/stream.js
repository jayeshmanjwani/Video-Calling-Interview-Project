import {StreamChat} from 'stream-chat';
import {ENV} from './env.js';
import e from 'express';
const apiKey = ENV.STREAM_API_KEY;
const apiSecret = ENV.STREAM_API_SECRET;

if(!apiKey || !apiSecret) {
    throw new Error("STREAM_API_KEY or STREAM_API_SECRET is missing. Cannot initialize Stream Chat client.");
}

export const chatClient = StreamChat.getInstance(apiKey, apiSecret);
export const upsertStreamUser = async (userData) => {
    try {
        await chatClient.upsertUser(userData)
        console.log(`Stream user upserted successfully :`,userData.id)
    } catch (error) {
        console.error("Error upserting Stream user:", error)
        throw error;
    }
}

export const deleteStreamUser = async (userId) => {
    try {
        await chatClient.deleteUser(userId)
        console.log(`Stream user ${userId} deleted successfully.`)
    } catch (error) {
        console.error("Error deleting Stream user:", error)
        throw error;
    }
}