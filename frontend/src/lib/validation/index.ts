import { z } from "zod";


export const SignupValidation = z
  .object({
    name: z.string().min(2, "Name is required"),
    username: z.string().min(2, "Username is required"),
    email: z.string().email("Invalid email"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain an uppercase letter")
      .regex(/[a-z]/, "Password must contain a lowercase letter")
      .regex(/[0-9]/, "Password must contain a number"),
    password_confirm: z.string(),
  })
  .refine((data) => data.password === data.password_confirm, {
    path: ["password_confirm"],
    message: "Passwords must match",
  });


export const SigninValidation = z.object({
  email: z.string().email(),
  password: z.string().min(8,{ message : 'The password must of atleast 8 characters .'}),
});

export const PostValidation = z.object({
  caption : z.string().min(5).max(2200),
  file: z.custom<File[]>(),
  location: z.string().min(2).max(100).optional(),
  tags: z.string(),
});

export const ProfileValidation = z.object({
  file: z.custom<File[]>(),
  name: z.string().min(3, { message: 'The name is too short' }),
  username: z.string().min(3, { message: "The username is too Short" }),
  email: z.string().email(),
  bio: z.string().max(2200),
});