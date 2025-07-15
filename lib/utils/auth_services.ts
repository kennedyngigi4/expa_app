"use client";

import { signIn } from "next-auth/react";
import { UserModel } from "../models/user_model";


export async function userRegistration(userData: any): Promise<any> {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_APIURL}/account/register/`, {
            method: "POST",
            body: userData,
        });
        const data = await res.json();

        return data;

    } catch(e){
        return { "success": false, "message": "Something went wrong." }
    }
}



export async function userLogin(email: string, password: string): Promise<{ success: boolean; message: string; data?: any;}> {
    try {
        const res = await signIn("credentials", {
            email: email,
            password: password,
            redirect: false,
        });
        
        

        if (!res) {
            return { success: false, message: "No response from server" };
        }
        
        if (res.error) {
            console.error("Login error:", res.error);  // helpful for debugging
            return { success: false, message: res.error || "Invalid Email or Password" };
        }

        return { success: true, message: "Login successful", data: res };
    } catch (e: any) {
        console.error("Login exception:", e);
        return { success: false, message: "Unexpected error occurred" };
    }
}


