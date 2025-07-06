import { z } from "zod";


export const signupRequestSchema = z.object({

  name: z.string().min(4, "Name must be at least 4 characters").max(30, "Name must not exceed 30 characters"),
  email: z.string().email("Invalid email format"),
  dob: z.coerce.date({ invalid_type_error: "Invalid or missing date of birth" }),
});


export const emailOnlySchema = z.object({

  email: z.string().email("Invalid email"),
});


export const verifyOtpSchema = z.object({

  email: z.string().email("Invalid email"),
  otp: z.string().length(6, "OTP must be 6 digits"),
});
