import { z } from "zod";

export const messageSchema = z.object({
    content: z
    .string()
    .min(2, "Message must be at least 2 character")
    .max(200, "Message must be less than 200 characters")
});
