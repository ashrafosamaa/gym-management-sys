import { z } from 'zod';

export class BranchZodSchema {
    static addBranchSchema = z.object({
        name: z.string().min(3, { message: 'Name must be at least 3 characters long' })
            .max(64, { message: 'Name must be at most 64 characters long' }),
        description: z.string().min(3, { message: 'Description must be at least 3 characters long' })
            .max(256, { message: 'Description must be at most 256 characters long' }),
        address: z.string().min(3, { message: 'Address must be at least 3 characters long' })
            .max(128, { message: 'Address must be at most 128 characters long' }),
        isActive: z.boolean()
    }).required().strict()

    static IDSchema = z.object({
        branchId: z.string()
            .length(24, { message: 'Branch ID must be exactly 24 characters long' })
            .regex(/^[a-fA-F0-9]+$/, { message: 'ID must be a valid hexadecimal string' })
    }).required().strict()

    static NoSchema = z.object({
        zaza: z.string().optional()
    }).strict()

    static updateBranchSchema = z.object({
        name: z.string().min(3, { message: 'Name must be at least 3 characters long' })
            .max(64, { message: 'Name must be at most 64 characters long' }).optional(),
        description: z.string().min(3, { message: 'Description must be at least 3 characters long' })
            .max(256, { message: 'Description must be at most 256 characters long' }).optional(),
        address: z.string().min(3, { message: 'Address must be at least 3 characters long' })
            .max(128, { message: 'Address must be at most 128 characters long' }).optional(),
        isActive: z.boolean().optional()
    }).strict()

}