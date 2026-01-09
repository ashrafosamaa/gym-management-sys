import { z } from 'zod';

export class UserAuthZodSchema {
    static signUpSchema = z.object({
        firstName: z.string().min(3, { message: 'Name must be at least 3 characters long' })
            .max(64, { message: 'Name must be at most 16 characters long' }),
        lastName: z.string().min(3, { message: 'Name must be at least 3 characters long' })
            .max(64, { message: 'Name must be at most 16 characters long' }),
        email: z.string().email({ message: 'Invalid email address' }),
        phoneNumber: z.string().length(11, { message: 'Phone must be exactly 11 digits' }),
        password: z.string().min(8, { message: 'Password must be at least 8 characters long' })
            .max(16, { message: 'Password must be at most 16 characters long' })
            .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#@$!%*?&])[A-Za-z\d#@$!%*?&]{8,}$/, {
                message: 'Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character' 
            }),
        gender: z.enum(['male', 'female'], { message: 'Gender must be either male or female' }) ,
        weight: z.string().min(2, { message: 'Weight must be at least 2 characters long' })
            .max(4, { message: 'Weight must be at most 16 characters long' }),
        height: z.string().min(2, { message: 'Height must be at least 3 characters long' })
            .max(3, { message: 'Height must be at most 16 characters long' }),
    }).required().strict()

    static confirmEmailSchema = z.object({
        email: z.string().email({ message: 'Invalid email address' }),
        activateCode: z.string().length(4, { message: 'Activation code must be exactly 4 characters long' })
    }).required().strict()

    static loginSchema = z.object({
        email: z.string().email({ message: 'Invalid email address' }),
        password: z.string().min(8, { message: 'Password must be at least 8 characters long' })
            .max(16, { message: 'Password must be at most 16 characters long' })
            .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#@$!%*?&])[A-Za-z\d#@$!%*?&]{8,}$/, {
                message: 'Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character' 
            })
    }).required().strict()

    static resendCode = z.object({
        email: z.string().email({ message: 'Invalid email address' })
    }).required().strict()

    static verifyPasswordResetCode = z.object({
        email: z.string().email({ message: 'Invalid email address' }),
        resetCode: z.string().length(4, { message: 'Password reset code must be exactly 4 characters long' })
    }).required().strict()

    static resetPassword = z.object({
        email: z.string().email({ message: 'Invalid email address' }),
        password: z.string().min(8, { message: 'Password must be at least 8 characters long' })
            .max(16, { message: 'Password must be at most 16 characters long' })
            .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#@$!%*?&])[A-Za-z\d#@$!%*?&]{8,}$/, {
                message: 'Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character' 
            }),
        passwordConfirm: z.string()
    }).required().strict().superRefine(({ password, passwordConfirm }, ctx) => {
        if (password !== passwordConfirm) {
            ctx.addIssue({
                code: 'custom',
                message: 'Passwords don\'t match',
                path: ['passwordConfirm']
            })
        }
    })

}