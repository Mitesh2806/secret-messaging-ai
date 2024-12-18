import { z } from "zod";

export const signInSchema = z.object({
    identifier: z.string().min(1, "Username or email is required"),
    password: z.string()
});
