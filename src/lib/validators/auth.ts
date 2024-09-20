import { z } from 'zod';

export const MessageFormSchema = z.object({
	fullName: z.string().min(2, {
		message: 'Your full name must be at least 2 characters.',
	}),
	email: z.string().email({
		message: 'Please enter a valid email address.',
	}),
	phone: z.string().min(10, {
		message: 'Please enter a valid phone number.',
	}),
	town: z.string().min(2, {
		message: 'Please enter a valid Town Name.',
	}),
	message: z.string().optional(),
	countryCode: z.string().optional(),
	allowMarketing: z.boolean().optional(),
});
export type MessageFormInput = z.infer<typeof MessageFormSchema>;

export const signupSchema = z.object({
	email: z.string().email('Please enter a valid email'),
	password: z
		.string()
		.min(8, 'Password is too short. Minimum 8 characters required.')
		.max(255),
});
export type SignupInput = z.infer<typeof signupSchema>;

export const loginSchema = z.object({
	email: z.string().email('Please enter a valid email.'),
	password: z.string().min(1, 'Please provide your password.').max(255),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const resetPasswordSchema = z.object({
	token: z.string().min(1, 'Invalid token'),
	password: z.string().min(8, 'Password is too short').max(255),
});
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

export const AuthLoginSchema = z.object({
	email: z.string().email('Please enter a valid email.'),
	password: z
		.string()
		.min(8, 'Password is too short. Minimum 8 characters required.')
		.max(255),
});
export type AuthLoginInput = z.infer<typeof AuthLoginSchema>;

export const forgotPasswordSchema = z.object({
	email: z.string().email(),
});
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export const manualResetPasswordSchema = z.object({
	currentPassword: z.string().min(8, 'Password is too short').max(255),
	newPassword: z.string().min(8, 'Password is too short').max(255),
	confirmPassword: z.string().min(8, 'Password is too short').max(255),
});
export type ManualResetPasswordInput = z.infer<
	typeof manualResetPasswordSchema
>;

export const AuthSignupFormSchema = z.object({
	firstName: z.string().min(2, {
		message: 'Your first name must be at least 2 characters.',
	}),
	lastName: z.string().min(2, {
		message: 'Your last name must be at least 2 characters.',
	}),
	email: z.string().email({
		message: 'Please enter a valid email address.',
	}),
	phone: z.string().min(10, {
		message: 'Please enter a valid phone number.',
	}),
	password: z.string().min(8, {
		message: 'Your password must be at least 8 characters.',
	}),
	businessName: z.string().min(2, {
		message: 'Your business name must be at least 2 characters.',
	}),
	country: z.string().min(2, {
		message: 'Please select your country.',
	}),
	countryCode: z.string().min(2, {
		message: 'Please select your country code.',
	}),
	id: z.string().optional(),
	city: z.string().optional(),
	state: z.string().optional(),
});
export type AuthSignupFormInput = z.infer<typeof AuthSignupFormSchema>;