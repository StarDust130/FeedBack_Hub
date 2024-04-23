import { z } from "zod";

export const msgSchema = z.object({
  content: z
    .string()
    .min(1, "Message must not be empty 😁")
    .max(300, "Message must not exceed 300 characters 😁"),
});
