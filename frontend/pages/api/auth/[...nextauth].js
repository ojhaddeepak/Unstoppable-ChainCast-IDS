import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
    // Configure one or more authentication providers
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                try {
                    // Using 127.0.0.1 to avoid Node v17+ IPv6 resolution delays
                    const res = await fetch("http://127.0.0.1:4000/api/auth/login", {
                        method: 'POST',
                        body: JSON.stringify(credentials),
                        headers: { "Content-Type": "application/json" }
                    });
                    const user = await res.json();

                    // If no error and we have user data, return it
                    if (res.ok && user.success) {
                        return user.user;
                    }
                    // Return null if user data could not be retrieved
                    return null;
                } catch (e) {
                    return null;
                }
            }
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_ID || "mock_google_id",
            clientSecret: process.env.GOOGLE_SECRET || "mock_google_secret",
        }),
        GithubProvider({
            clientId: process.env.GITHUB_ID || "mock_github_id",
            clientSecret: process.env.GITHUB_SECRET || "mock_github_secret",
        }),
    ],
    pages: {
        signIn: '/login', // Custom login page
    },
    callbacks: {
        async session({ session, token, user }) {
            return session;
        },
    },
    theme: {
        colorScheme: "dark",
    },
};

export default NextAuth(authOptions);
