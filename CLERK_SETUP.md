# Clerk Webhook Setup Instructions

## Issue Fixed
Your backend now has:
1. ✅ A Clerk webhook endpoint at `/api/webhooks/clerk` to sync users from Clerk to MongoDB
2. ✅ A root route `/` to serve API responses in development
3. ✅ Environment variable support for `CLERK_WEBHOOK_SECRET`

## What You Need To Do In Clerk Dashboard

1. **Go to Clerk Dashboard** → https://dashboard.clerk.com
2. **Select Your Project**
3. **Navigate to Webhooks** (usually in Settings or Configuration)
4. **Create a New Webhook Endpoint** with these settings:
   - **Endpoint URL**: `http://localhost:3000/api/webhooks/clerk` (for development)
     - For production: `https://your-domain.com/api/webhooks/clerk`
   - **Events to Subscribe to**:
     - `user.created`
     - `user.updated`
     - `user.deleted`

5. **After Creating the Webhook**:
   - Clerk will generate a **Signing Secret**
   - Copy this secret and add it to your `.env` file in the backend folder:
     ```
     CLERK_WEBHOOK_SECRET=your_signing_secret_here
     ```

6. **Restart your backend server**

## How It Works

When a user signs up/updates their profile in Clerk:
1. Clerk sends a webhook event to your backend
2. Your backend verifies the webhook is authentic using the signing secret
3. A new User document is created/updated in MongoDB
4. Now when users make API requests, they'll be found in the database ✅

## Testing

After setting up the webhook:
1. Sign up a new user through your frontend
2. Try creating a new session
3. The "User not found" error should be gone!

## Environment Variables Needed

Make sure your `.env` file has:
```
PORT=3000
DB_URL=your_mongodb_connection_string
CLIENT_URL=http://localhost:5173
CLERK_WEBHOOK_SECRET=your_clerk_webhook_secret
NODE_ENV=development
```
