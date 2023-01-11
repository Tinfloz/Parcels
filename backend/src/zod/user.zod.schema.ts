import { z } from "zod";

export const userZodSchema = z.object({
    email: z.string(),
    password: z.string(),
    name: z.string().optional(),
    userType: z.string().optional()
});

export const addressZodSchema = z.object({
    address: z.string(),
    state: z.string(),
    city: z.string(),
    pincode: z.string()
});

export const userResetPasswordZodSchema = z.object({
    email: z.string()
});

export const userSetPasswordZodSchema = z.object({
    password: z.string(),
    confirmPassword: z.string()
});