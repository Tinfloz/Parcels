import { z } from "zod";

export const menuZodSchema = z.object({
    item: z.string(),
    image: z.string(),
    left: z.string(),
    price: z.string()
});

export const menuUpdateZodSchema = z.object({
    item: z.string().optional(),
    image: z.string().optional(),
    left: z.string().optional(),
    price: z.string().optional()
})