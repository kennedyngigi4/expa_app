"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

const formSchema = z
    .object({
        password: z.string().min(6, "Password must be at least 6 characters"),
        confirmpassword: z.string().min(6, "Please confirm your password"),
    })
    .refine((data) => data.password === data.confirmpassword, {
        message: "Passwords do not match",
        path: ["confirmpassword"],
    });

const ResetPasswordPage = () => {
    const [loading, setLoading] = useState(false);
    const params = useSearchParams();
    const uid = params.get("uid");
    const token = params.get("token");

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            password: "",
            confirmpassword: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        if (!uid || !token) {
            toast.error("Invalid reset link");
            return;
        }

        setLoading(true);
        try {
            const resp = await fetch(`${process.env.NEXT_PUBLIC_APIURL}/account/password-reset-confirm/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ uid, token, password: values.password }),
            });

            const data = await resp.json();

            if (resp.ok) {
                toast.success("Password reset successful! You can now log in.");
            } else {
                toast.error(data.detail || "Invalid or expired link.");
            }
        } catch (err) {
            toast.error("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="md:w-[60%] w-[90%]">
            <Card>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="flex flex-col items-center justify-center">
                        <Image src="/icons/auth.png" width={400} height={100} alt="" />
                        <div className="flex flex-col py-6 md:block max-md:hidden">
                            <h1 className="text-center text-xl text-primary font-bold pb-1">
                                Welcome Back To ExPa
                            </h1>
                            <p className="text-center">
                                Fast, reliable deliveries at your fingertips. Sign in or create an account to begin.
                            </p>
                        </div>
                    </div>

                    <div>
                        <CardTitle className="text-lg text-primary font-bold">Reset Password</CardTitle>
                        <CardDescription className="mb-4">
                            Enter your new password and submit.
                        </CardDescription>

                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <Input type="password" className="bg-white" placeholder="******" {...field} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="confirmpassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Confirm Password</FormLabel>
                                            <FormControl>
                                                <Input type="password" className="bg-white" placeholder="******" {...field} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                <Button type="submit" disabled={loading || !form.formState.isValid} className="bg-primary text-white w-full">
                                    {loading ? "Resetting..." : "RESET PASSWORD"}
                                </Button>
                            </form>
                        </Form>

                        <p className="flex flex-row pt-5">
                            Have an account?
                            <Link className="text-primary ps-1" href="/auth/login">
                                Login
                            </Link>
                        </p>
                    </div>
                </CardContent>
            </Card>
        </section>
    );
};

export default ResetPasswordPage;
