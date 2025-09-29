import NextAuth, { JWT } from "next-auth";
import Credentials from "next-auth/providers/credentials"

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            credentials: {
                email: {},
                password: {},
            },

            async authorize(credentials, req) {

                try {
                    const res = await fetch(`${process.env.APIURL}/account/login/`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            identifier: credentials?.email,
                            password: credentials?.password,
                        })
                    });

                    const user = await res.json();

                    if (!res.ok) {
                        return null;
                    }

                    console.log(user)

                    if (user.message.access) {

                        return user.message;
                    }
                    return null;
                } catch (e) {
                    console.error("Authorize error", e);
                    return null;
                }
            },
        })
    ],

    session: {
        strategy: "jwt",
    },


    callbacks: {
        async jwt({ token, user, account }) {
            if (account && user) {
                token.accessToken = user?.access;
                token.id = user?.id;
                token.name = user?.full_name ?? undefined;
                token.phone = user?.phone ?? undefined;
                token.role = user?.role;
                token.accounttype = user?.account_type;
            }
            return token;
        },
        async session({ session, token }) {
            const t = token as JWT;
            session.accessToken = t?.accessToken as string;
            session.user.id = t?.id as string;
            session.user.name = token?.name ?? undefined;
            session.user.phone = token?.phone ?? undefined;
            session.user.role = t?.role;
            session.user.accounttype = t?.accounttype;
            return session;
        },
    },


    pages: {
        signIn: "/auth/login",
    },

    trustHost: true,


})