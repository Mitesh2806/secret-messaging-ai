import { z } from "zod";

export const usernameValidation = z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be less than 20 characters")
    .regex(/^[a-zA-Z0-9]+$/, "Username must only contain letters and numbers");

export const signUpSchema = z.object({
    username:usernameValidation,
    email:z.string().email("Please use a valid email address"),
    password:z
        .string()
        .min(6, "Password must be at least 6 characters")
        .max(20, "Password must be less than 20 characters")
})