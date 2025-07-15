import type { DefaultSession, DefaultUser } from "next-auth";


declare module "next-auth" {
    interface Session {
        accessToken?: string;
        user: {
            id?: string;
            name?: string;
            email?: string | null;
            image?: string | null;
            role?: string;
        };
    }

    interface JWT {
        accessToken?: string;
        refreshToken?: string;
        id?: string;
        name?: string;
        role?: string;
    }

    interface User {
        access?: string;
        refresh?: string;
        id?: string;
        full_name?: string;
        role?: string;
    }
}
