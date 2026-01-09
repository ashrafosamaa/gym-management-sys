import { z } from 'zod';

export class UserZodSchema {
    static getAllSchema = z.object({
        page: z.string().regex(/^[0-9]+$/, { message: 'Page must be only digits' }).optional(),
        size: z.string().regex(/^[0-9]+$/, { message: 'Size must be only digits' }).optional(),
        sortBy: z.string().regex(/^(\w+)\s(asc|desc)$/, 
            { message: 'Sort must be 2 words first word is field and second asc or desc' }).optional()
    }).strict()

    static IDSchema = z.object({
        userId: z.string().length(24, { message: 'ID must be exactly 24 characters long' })
            .regex(/^[a-fA-F0-9]+$/, { message: 'ID must be a valid hexadecimal string' })
    }).required().strict()

    static noSchema = z.object({
        zaza: z.string().optional()
    }).strict()

    static searchSchema = z.object({
        firstName: z.string().min(1, { message: 'Name must be at least 3 characters long' })
            .max(64, { message: 'Name must be at most 16 characters long' }).optional(),
        lastName: z.string().min(1, { message: 'Name must be at least 3 characters long' })
            .max(64, { message: 'Name must be at most 16 characters long' }).optional(),
        email: z.string().email({ message: 'Invalid email address' }).optional(),
        phoneNumber: z.string().length(11, { message: 'Phone must be exactly 11 digits' }).optional(),
    }).strict()

    static updateUserAccSchema = z.object({
        firstName: z.string().min(3, { message: 'Name must be at least 3 characters long' })
            .max(64, { message: 'Name must be at most 16 characters long' }).optional(),
        lastName: z.string().min(3, { message: 'Name must be at least 3 characters long' })
            .max(64, { message: 'Name must be at most 16 characters long' }).optional(),
        phoneNumber: z.string().length(11, { message: 'Phone must be exactly 11 digits' }).optional(),
        memberStatus:z.enum(['active', 'inactive'], { message: 'Member status must be either active or inactive' }).optional(),
        gender: z.enum(['male', 'female'], { message: 'Gender must be either male or female' }).optional(),
        weight: z.string().min(2, { message: 'Weight must be at least 2 characters long' })
            .max(4, { message: 'Weight must be at most 16 characters long' }).optional(),
        height: z.string().min(2, { message: 'Height must be at least 3 characters long' })
            .max(3, { message: 'Height must be at most 16 characters long' }).optional(),
    }).strict()

    static updateMyAccSchema = z.object({
        firstName: z.string().min(3, { message: 'Name must be at least 3 characters long' })
            .max(64, { message: 'Name must be at most 16 characters long' }).optional(),
        lastName: z.string().min(3, { message: 'Name must be at least 3 characters long' })
            .max(64, { message: 'Name must be at most 16 characters long' }).optional(),
        phoneNumber: z.string().length(11, { message: 'Phone must be exactly 11 digits' }).optional(),
        gender: z.enum(['male', 'female'], { message: 'Gender must be either male or female' }).optional(),
        weight: z.string().min(2, { message: 'Weight must be at least 2 characters long' })
            .max(4, { message: 'Weight must be at most 16 characters long' }).optional(),
        height: z.string().min(2, { message: 'Height must be at least 3 characters long' })
            .max(3, { message: 'Height must be at most 16 characters long' }).optional(),
    }).strict()

    static updatePasswordSchema = z.object({
        oldPassword: z.string().min(8, { message: 'Old Password must be at least 8 characters long' }),
        newPassword: z.string().min(8, { message: 'Password must be at least 8 characters long' })
            .max(16, { message: 'Password must be at most 16 characters long' })
            .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#@$!%*?&])[A-Za-z\d#@$!%*?&]{8,}$/, {
                message: 'Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character' }),
        newPasswordConfirm: z.string()
    }).required().strict().superRefine(({ newPassword, newPasswordConfirm }, ctx) => {
        if (newPassword !== newPasswordConfirm) {
            ctx.addIssue({
                code: 'custom',
                message: 'Passwords don\'t match',
                path: ['newPasswordConfirm']
            })
        }
    })

        static updateProfilePicSchema = z.object({
        oldPublicId: z.string()
    }).strict().required()

}