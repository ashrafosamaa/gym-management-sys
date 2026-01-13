import { z } from 'zod';

export class SubZodSchema {

    static addSubByAdminSchema = z.object({
        duration: z.number().int().refine((val) => [1, 2, 3].includes(val),
            { message: 'duration must be one of 1, 2, 3' }),
        startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {message: 'startDate must be in YYYY-MM-DD format'})
            .refine((val) => new Date(val) >= new Date(),{ message: 'startDate cannot be before today' }),
        isPaid: z.boolean(),
        trainerId: z.string().length(24, { message: 'ID must be exactly 24 characters long' })
            .regex(/^[a-fA-F0-9]+$/, { message: 'ID must be a valid hexadecimal string' }),
        phoneNumber: z.string().length(11, { message: 'Phone must be exactly 11 digits' }),
    }).required().strict()

    static getAllSchema = z.object({
        page: z.string().regex(/^[0-9]+$/, { message: 'Page must be only digits' }).optional(),
        size: z.string().regex(/^[0-9]+$/, { message: 'Size must be only digits' }).optional(),
    }).strict()

    static IDSchema = z.object({
        subId: z.string().length(24, { message: 'ID must be exactly 24 characters long' })
            .regex(/^[a-fA-F0-9]+$/, { message: 'ID must be a valid hexadecimal string' })
    }).required().strict()
    static userIDSchema = z.object({
        userId: z.string().length(24, { message: 'ID must be exactly 24 characters long' })
            .regex(/^[a-fA-F0-9]+$/, { message: 'ID must be a valid hexadecimal string' })
    }).required().strict()
    static branchIDSchema = z.object({
        branchId: z.string().length(24, { message: 'ID must be exactly 24 characters long' })
            .regex(/^[a-fA-F0-9]+$/, { message: 'ID must be a valid hexadecimal string' })
    }).required().strict()
    static trainerIDSchema = z.object({
        trainerId: z.string().length(24, { message: 'ID must be exactly 24 characters long' })
            .regex(/^[a-fA-F0-9]+$/, { message: 'ID must be a valid hexadecimal string' })
    }).required().strict()

    static noSchema = z.object({
        zaza: z.string().optional()
    }).strict()

    static updateSubByAdminSchema = z.object({
        duration: z.number().int().refine((val) => [1, 2, 3].includes(val),
            { message: 'duration must be one of 1, 2, 3' }).optional(),
        startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {message: 'startDate must be in YYYY-MM-DD format'})
            .refine((val) => new Date(val) >= new Date(),{ message: 'startDate cannot be before today' }).optional(),
        isActive: z.boolean().optional(),
        isPaid: z.boolean().optional()
    }).strict()

    // user

    static addSubSchema = z.object({
        duration: z.number().int().refine((val) => [1, 2, 3].includes(val),
            { message: 'duration must be one of 1, 2, 3' }),
        startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {message: 'startDate must be in YYYY-MM-DD format'})
            .refine((val) => new Date(val) >= new Date(),{ message: 'startDate cannot be before today' }),
        trainerId: z.string().length(24, { message: 'ID must be exactly 24 characters long' })
            .regex(/^[a-fA-F0-9]+$/, { message: 'ID must be a valid hexadecimal string' }),
    }).required().strict()

    static updateMySubSchema = z.object({
        duration: z.number().int().refine((val) => [1, 2, 3].includes(val),
            { message: 'duration must be one of 1, 2, 3' }).optional(),
        startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {message: 'startDate must be in YYYY-MM-DD format'})
            .refine((val) => new Date(val) >= new Date(),{ message: 'startDate cannot be before today' }).optional(),
    }).strict()

    static addCommentAndRateSchema = z.object({
        comment: z.string().min(3, { message: 'comment must be at least 3 character long' })
                    .max(128, { message: 'comment must be at most 128 character long' }),
        rate: z.number().int().min(1, { message: 'rate must be at least 1' }).max(5, { message: 'rate must be at most 5' }),
    }).required().strict()

}