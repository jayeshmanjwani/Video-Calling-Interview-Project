import {Inngest} from 'inngest';
import {connectDB} from './db.js';
import User from '../models/User.js';
import {upsertStreamUser,deleteStreamUser} from './stream.js';

export const inngest = new Inngest({id: 'video-calling-interview-app'});

const syncUser = inngest.createFunction(
    {id:"sync-user"},
    {event:"clerk/user.created"},
    async ({event}) => {
        await connectDB();

        const{id,email_addresses,first_name,last_name,image_url} = event.data

        const email = email_addresses?.[0]?.email_address;
        if (!email) {
            console.error('No email found for user creation');
            return;
        }

        const name = [first_name, last_name].filter(Boolean).join(' ') || '';

        const newUser={
            clerkId: id,
            email,
            name,
            profileImage: image_url 
        }

        await User.create(newUser);

        await upsertStreamUser({
            id:newUser.clerkId.toString(),
            name: newUser.name,
            image: newUser.profileImage
        });
    }
)

const deleteUserFromDB = inngest.createFunction(
    {id:"delete-user-from-db"},
    {event:"clerk/user.deleted"},
    async ({event}) => {
        await connectDB();

        const{id} = event.data
        await User.deleteOne({clerkId: id});

        await deleteStreamUser(id.toString());
    }
)

export const functions = [syncUser, deleteUserFromDB];