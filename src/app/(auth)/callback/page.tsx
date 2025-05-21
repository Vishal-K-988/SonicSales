// Todo : implement the auth callback page 

import onAuthenticateUser from "@/actions/auth"
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic"

const AuthCallbackPage = async () => {
    console.log("🔄 Auth callback page called");

    try {
        console.log("🔍 Attempting to authenticate user...");
        const auth = await onAuthenticateUser();
        console.log("📊 Auth response status:", auth.status);

        if (auth.status === 200 || auth.status === 201) {
            console.log("✅ Authentication successful, redirecting to /home");
            redirect("/home");
        }

        console.log("❌ Authentication failed:", auth.error || "Unknown error");
        redirect("/");
    } catch (error) {
        console.error("❌ Error in auth callback:", error);
        redirect("/");
    }
}

export default AuthCallbackPage