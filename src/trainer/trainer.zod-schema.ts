import { z } from 'zod';

export class UserZodSchema {
    static addTrainerSchema = z.object({
        userName: z.string().min(3, { message: 'userName must be at least 3 characters long' })
            .max(64, { message: 'userName must be at most 16 characters long' }),
        description: z.string().min(10, { message: 'description must be at least 10 characters long' })
            .max(512, { message: 'description must be at most 512 characters long' }),
        experience: z.number().int().min(1, { message: 'Experience must be at least 1 year' }),
        phoneNumber: z.string().length(11, { message: 'Phone must be exactly 11 digits' }),
        gender: z.enum(['male', 'female'], { message: 'Gender must be either male or female' }) ,
        specialization: z.enum(["Personal", "Bodybuilding", "Functional", "Cardio",
            "Rehabilitation", "Physiotherapy", "Yoga", "Nutrition" ], { message: 'Invalid specialization' }) ,
        pricePerMonth: z.number().int().min(200, { message: 'Price must be at least 200' })
            .max(1000, { message: 'Price must be at most 1000' }),
        branchId: z.string().length(24, { message: 'ID must be exactly 24 characters long' })
            .regex(/^[a-fA-F0-9]+$/, { message: 'ID must be a valid hexadecimal string' }),
    }).required().strict()

    static getAllSchema = z.object({
        page: z.string().regex(/^[0-9]+$/, { message: 'Page must be only digits' }).optional(),
        size: z.string().regex(/^[0-9]+$/, { message: 'Size must be only digits' }).optional(),
        sortBy: z.string().regex(/^(\w+)\s(asc|desc)$/, 
            { message: 'Sort must be 2 words first word is field and second asc or desc' }).optional()
    }).strict()

    static IDSchema = z.object({
        trainerId: z.string().length(24, { message: 'ID must be exactly 24 characters long' })
            .regex(/^[a-fA-F0-9]+$/, { message: 'ID must be a valid hexadecimal string' })
    }).required().strict()
    static branchIdSchema = z.object({
        branchId: z.string().length(24, { message: 'ID must be exactly 24 characters long' })
            .regex(/^[a-fA-F0-9]+$/, { message: 'ID must be a valid hexadecimal string' })
    }).required().strict()

    static noSchema = z.object({
        zaza: z.string().optional()
    }).strict()

    static searchSchema = z.object({
        userName: z.string().min(1, { message: 'userName must be at least 3 characters long' })
            .max(64, { message: 'userName must be at most 16 characters long' }).optional(),
        experience: z.number().int().min(1, { message: 'Experience must be at least 1 year' }).optional(),
        phoneNumber: z.string().optional(),
        specialization: z.string().optional() ,
    }).strict()

    static updateTrainerAccSchema = z.object({
        userName: z.string().min(3, { message: 'userName must be at least 3 characters long' })
            .max(64, { message: 'userName must be at most 16 characters long' }).optional(),
        description: z.string().min(10, { message: 'description must be at least 10 characters long' })
            .max(512, { message: 'description must be at most 512 characters long' }).optional(),
        experience: z.number().int().min(1, { message: 'Experience must be at least 1 year' }).optional(),
        phoneNumber: z.string().length(11, { message: 'Phone must be exactly 11 digits' }).optional(),
        gender: z.enum(['male', 'female'], { message: 'Gender must be either male or female' }).optional() ,
        specialization: z.enum(["Personal", "Bodybuilding", "Functional", "Cardio",
            "Rehabilitation", "Physiotherapy", "Yoga", "Nutrition" ], { message: 'Invalid specialization' }).optional() ,
        pricePerMonth: z.number().int().min(200, { message: 'Price must be at least 200' })
            .max(1000, { message: 'Price must be at most 1000' }).optional(),
        branchId: z.string().length(24, { message: 'ID must be exactly 24 characters long' })
            .regex(/^[a-fA-F0-9]+$/, { message: 'ID must be a valid hexadecimal string' }).optional(),
        isActive: z.boolean().optional()
    }).strict()

    //trainer

    static firstLoginSchema = z.object({
        userName: z.string().min(3, { message: 'userName must be at least 3 characters long' })
            .max(64, { message: 'userName must be at most 16 characters long' }),
        passwordOneUse: z.string().length(11, { message: 'Phone must be exactly 11 digits' }),
        password: z.string().min(8, { message: 'Password must be at least 8 characters long' })
            .max(16, { message: 'Password must be at most 16 characters long' })
            .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#@$!%*?&])[A-Za-z\d#@$!%*?&]{8,}$/, {
                message: 'Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character' 
            }),
        passwordConfirm: z.string().min(8, { message: 'Password must be at least 8 characters long' })
            .max(16, { message: 'Password must be at most 16 characters long' })
    }).required().strict().superRefine(({ password, passwordConfirm }, ctx) => {
        if (password !== passwordConfirm) {
            ctx.addIssue({
                code: 'custom',
                message: 'Passwords don\'t match',
                path: ['passwordConfirm']
            })
        }
    })

    static signInSchema = z.object({
        userName: z.string().min(3, { message: 'userName must be at least 3 characters long' })
            .max(64, { message: 'userName must be at most 16 characters long' }),
        password: z.string().min(8, { message: 'Password must be at least 8 characters long' })
            .max(16, { message: 'Password must be at most 16 characters long' })
            .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#@$!%*?&])[A-Za-z\d#@$!%*?&]{8,}$/, {
                message: 'Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character'
            }),
    }).required().strict()

    static updateMyAccSchema = z.object({
        userName: z.string().min(3, { message: 'userName must be at least 3 characters long' })
            .max(64, { message: 'userName must be at most 16 characters long' }).optional(),
        description: z.string().min(10, { message: 'description must be at least 10 characters long' })
            .max(512, { message: 'description must be at most 512 characters long' }).optional(),
        experience: z.number().int().min(1, { message: 'Experience must be at least 1 year' }).optional(),
        phoneNumber: z.string().length(11, { message: 'Phone must be exactly 11 digits' }).optional(),
        gender: z.enum(['male', 'female'], { message: 'Gender must be either male or female' }).optional() ,
        specialization: z.enum(["Personal", "Bodybuilding", "Functional", "Cardio",
            "Rehabilitation", "Physiotherapy", "Yoga", "Nutrition" ], { message: 'Invalid specialization' }).optional() ,
        pricePerMonth: z.number().int().min(200, { message: 'Price must be at least 200' })
            .max(1000, { message: 'Price must be at most 1000' }).optional(),
        isActive: z.boolean().optional()
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


    static forgotPasswordSchema = z.object({
        userName: z.string().min(3, { message: 'userName must be at least 3 characters long' })
            .max(64, { message: 'userName must be at most 16 characters long' }),
    }).required().strict()
}