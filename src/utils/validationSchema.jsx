import * as Yup from "yup";
import { noEmptySpaces } from "./helpers";

// ==========================
//   Login Validation  Schema
//===========================

export const LoginValidationSchema = Yup.object({
  email: Yup.string()
    .min(3, "Email must be at least 3 characters")
    .max(50, "Email must be at most 50 characters")
    .email("Invalid email format")
    .required("Email is required")
    .matches(
      /^[a-zA-Z0-9._-]+@[^\s@]+\.com$/,
      "Email must be in valid format such as: example@example.com"
    )
    .test(
      "no-spaces-anywhere",
      "Email must not contain spaces",
      (value) => !/\s/.test(value || "")
    ),

  password: Yup.string()
    .trim()
    .required("Password is required")
});


export const RegisterValidationSchema = Yup.object({
  firstName: Yup.string()
    .trim()
    .min(
      2,
      "First name must be at least 2 characters",
    )
    .max(
      50,
      "First name cannot exceed 50 characters",
    )
    .required("First name is required"),

  lastName: Yup.string()
    .trim()
    .min(
      2,
      "Last name must be at least 2 characters",
    )
    .max(
      50,
      "Last name cannot exceed 50 characters",
    )
    .required("Last name is required"),

  email: Yup.string()
    .trim()
    .lowercase()
    .email("Enter a valid email address")
    .required("Email is required"),

  password: Yup.string()
    .min(
      8,
      "Password must contain at least 8 characters",
    )
    .max(
      50,
      "Password cannot exceed 50 characters",
    )
    .matches(
      /[A-Z]/,
      "Password must contain an uppercase letter",
    )
    .matches(
      /[a-z]/,
      "Password must contain a lowercase letter",
    )
    .matches(
      /[0-9]/,
      "Password must contain a number",
    )
    .matches(
      /[!@#$%^&*(),.?":{}|<>_\-+=]/,
      "Password must contain a special character",
    )
    .matches(
      /^\S*$/,
      "Password cannot contain spaces",
    )
    .required("Password is required"),

  confirmPassword: Yup.string()
    .oneOf(
      [Yup.ref("password")],
      "Passwords do not match",
    )
    .required("Confirm password is required"),

  acceptTerms: Yup.boolean()
    .oneOf(
      [true],
      "You must accept the terms and conditions",
    )
    .required(
      "You must accept the terms and conditions",
    ),
});



export const forgetPasswordValidationSchema = Yup.object({
  email: Yup.string()
    .min(3, "Email must be at least 3 characters")
    .max(50, "Email must be at most 50 characters")
    .email("Invalid email format")
    .required("Email is required")
    .test(
      "no-spaces-anywhere",
      "Email must not contain spaces",
      (value) => !/\s/.test(value || "")
    ),
});

export const emailConfirmationValidationSchema = Yup.object({
 email: Yup.string()
     .trim()
     .email("Enter a valid email address")
     .required("Email address is required"),
   otp: Yup.string()
     .trim()
     .matches(/^\d{6}$/, "Enter the 6-digit confirmation code")
     .required("Confirmation code is required"),
});


export const resetPasswordValidationSchema = Yup.object({
  newPassword: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(
      /[a-z]/,
      "Include at least one lowercase letter",
    )
    .matches(
      /[A-Z]/,
      "Include at least one uppercase letter",
    )
    .matches(
      /\d/,
      "Include at least one number",
    )
    .matches(
      /[^A-Za-z0-9]/,
      "Include at least one special character",
    )
    .required("New password is required"),

  confirmPassword: Yup.string()
    .oneOf(
      [Yup.ref("newPassword")],
      "Passwords do not match",
    )
    .required("Confirm your password"),
});

