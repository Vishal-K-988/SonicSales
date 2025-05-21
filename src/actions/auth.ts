'use server'
import { currentUser } from "@clerk/nextjs/server"
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// For authenticating the user 
//  prisma and clerkId 

async function onAuthenticateUser(){
    try{
        console.log("🔍 Starting user authentication process...");
        
        // Get Clerk user
        const user = await currentUser();
        console.log("👤 Clerk user data received:", user ? "Yes" : "No");
        
        if (!user) {
            console.log("❌ No user found in Clerk");
            return {
                status: 403,
                message: "No user found in Clerk"
            }
        }

        // Log specific user data we need
        console.log("📝 User details:", {
            clerkId: user.id,
            email: user.emailAddresses?.[0]?.emailAddress,
            name: `${user.firstName} ${user.lastName}`,
            imageUrl: user.imageUrl
        });

        // Check if user exists
        console.log("🔎 Checking database for existing user...");
        const userExists = await prisma.user.findUnique({
            where: {
                clerkId: user.id,
            }
        });

        if (userExists) {
            console.log("✅ Existing user found in database");
            return {
                status: 200,
                user: userExists
            }
        }

        // Create new user
        console.log("➕ Creating new user in database...");
        try {
            const newUser = await prisma.user.create({
                data: {
                    clerkId: user.id,
                    email: user.emailAddresses[0].emailAddress,
                    name: `${user.firstName} ${user.lastName}`,
                    profileImage: user.imageUrl
                }
            });
            console.log("✅ New user created successfully:", newUser.id);
            return {
                status: 201,
                user: newUser,
            }
        } catch (createError) {
            console.error("❌ Error creating user:", createError);
            throw createError;
        }
    }
    catch(error) {
        console.error("❌ Error in onAuthenticateUser:", error);
        return {
            status: 500,
            error: "Internal server error",
            details: error instanceof Error ? error.message : "Unknown error"
        }
    }
}

export default onAuthenticateUser