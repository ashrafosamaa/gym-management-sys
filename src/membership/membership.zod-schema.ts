import { z } from 'zod';

export class MembershipZodSchema {

    static addMembershipByAdminSchema = z.object({
        duration: z.number().int().refine((val) => [1, 3, 6, 12].includes(val),
            { message: 'duration must be one of 1, 3, 6, 12' }),
        startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {message: 'startDate must be in YYYY-MM-DD format'})
            .refine((val) => new Date(val) >= new Date(),{ message: 'startDate cannot be before today' }),
        isPaid: z.boolean(),
        branchId: z.string().length(24, { message: 'ID must be exactly 24 characters long' })
            .regex(/^[a-fA-F0-9]+$/, { message: 'ID must be a valid hexadecimal string' }),
        phoneNumber: z.string().length(11, { message: 'Phone must be exactly 11 digits' }),
    }).required().strict()

    static getAllSchema = z.object({
        page: z.string().regex(/^[0-9]+$/, { message: 'Page must be only digits' }).optional(),
        size: z.string().regex(/^[0-9]+$/, { message: 'Size must be only digits' }).optional(),
        sortBy: z.string().regex(/^(\w+)\s(asc|desc)$/, 
            { message: 'Sort must be 2 words first word is field and second asc or desc' }).optional()
    }).strict()

    static IDSchema = z.object({
        membershipId: z.string().length(24, { message: 'ID must be exactly 24 characters long' })
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

    static noSchema = z.object({
        zaza: z.string().optional()
    }).strict()

    static updateMembershipByAdminSchema = z.object({
        duration: z.number().int().refine((val) => [1, 3, 6, 12].includes(val),
            { message: 'duration must be one of 1, 3, 6, 12' }).optional(),
        startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {message: 'startDate must be in YYYY-MM-DD format'})
            .refine((val) => new Date(val) >= new Date(),{ message: 'startDate cannot be before today' }).optional(),
        isActive: z.boolean().optional(),
        isPaid: z.boolean().optional()
    }).strict()

    // user

    static addMembershipSchema = z.object({
        duration: z.number().int().refine((val) => [1, 3, 6, 12].includes(val),
            { message: 'duration must be one of 1, 3, 6, 12' }),
        startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {message: 'startDate must be in YYYY-MM-DD format'})
            .refine((val) => new Date(val) >= new Date(),{ message: 'startDate cannot be before today' }),
        branchId: z.string().length(24, { message: 'ID must be exactly 24 characters long' })
            .regex(/^[a-fA-F0-9]+$/, { message: 'ID must be a valid hexadecimal string' }),
    }).required().strict()

    static updateMyMembershipSchema = z.object({
        duration: z.number().int().refine((val) => [1, 3, 6, 12].includes(val),
            { message: 'duration must be one of 1, 3, 6, 12' }).optional(),
        startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {message: 'startDate must be in YYYY-MM-DD format'})
            .refine((val) => new Date(val) >= new Date(),{ message: 'startDate cannot be before today' }).optional(),
    }).strict()

}