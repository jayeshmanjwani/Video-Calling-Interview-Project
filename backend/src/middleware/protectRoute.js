import { requireAuth } from "@clerk/express";
import User from "../models/User.js";
import { ENV } from "../lib/env.js";

export const protectRoute = [
  requireAuth(),
  async (req, res, next) => {
    try {
      const clerkId = req.auth().userId;

      if (!clerkId) return res.status(401).json({ message: "Unauthorized - invalid token" });

      // find user in db by clerk ID
      let user = await User.findOne({ clerkId });

      // If user not found locally, try to fetch from Clerk and create
      if (!user) {
        if (!ENV.CLERK_SECRET_KEY) {
          return res.status(404).json({ message: "User not found" });
        }

        try {
          const clerkRes = await fetch(`https://api.clerk.dev/v1/users/${clerkId}`, {
            headers: { Authorization: `Bearer ${ENV.CLERK_SECRET_KEY}` },
          });

          if (clerkRes.ok) {
            const data = await clerkRes.json();
            const email = data.email_addresses?.[0]?.email_address || "";
            const name = `${data.first_name || ""} ${data.last_name || ""}`.trim();
            const image_url = data.image_url || "";

            user = await User.create({ clerkId: data.id, email, name, profileImage: image_url });
            console.log(`Created local user for clerkId=${data.id} email=${email}`);
          } else {
            console.error("Clerk API error fetching user:", await clerkRes.text());
            return res.status(404).json({ message: "User not found" });
          }
        } catch (err) {
          console.error("Error fetching user from Clerk:", err);
          return res.status(500).json({ message: "Internal Server Error" });
        }
      }

      // attach user to req
      req.user = user;

      next();
    } catch (error) {
      console.error("Error in protectRoute middleware", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
];
