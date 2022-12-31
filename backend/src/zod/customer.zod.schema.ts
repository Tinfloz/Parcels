import { z } from "zod";

export const qtyZodSchema = z.object({
    qty: z.string(),
})