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

const profileNamePattern = /^[\p{L}\p{M}' -]+$/u;

export const ProfileValidationSchema = Yup.object({
  firstName: Yup.string()
    .trim()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name cannot exceed 50 characters")
    .matches(
      profileNamePattern,
      "First name can contain only letters, spaces, apostrophes, and hyphens",
    )
    .required("First name is required"),
  lastName: Yup.string()
    .trim()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name cannot exceed 50 characters")
    .matches(
      profileNamePattern,
      "Last name can contain only letters, spaces, apostrophes, and hyphens",
    )
    .required("Last name is required"),
  email: Yup.string()
    .email("Enter a valid email address")
    .required("Email is required"),
  oldPassword: Yup.string()
    .max(72, "Current password is too long")
    .test(
      "required-with-new-password",
      "Current password is required",
      function (value) {
        return !this.parent.newPassword || Boolean(value);
      },
    ),
  newPassword: Yup.string()
    .test(
      "required-with-current-password",
      "New password is required",
      function (value) {
        return !this.parent.oldPassword || Boolean(value);
      },
    )
    .test(
      "minimum-length",
      "New password must contain at least 8 characters",
      (value) => !value || value.length >= 8,
    )
    .test(
      "maximum-length",
      "New password cannot exceed 50 characters",
      (value) => !value || value.length <= 50,
    )
    .test(
      "uppercase",
      "New password must contain an uppercase letter",
      (value) => !value || /[A-Z]/.test(value),
    )
    .test(
      "lowercase",
      "New password must contain a lowercase letter",
      (value) => !value || /[a-z]/.test(value),
    )
    .test(
      "number",
      "New password must contain a number",
      (value) => !value || /[0-9]/.test(value),
    )
    .test(
      "special-character",
      "New password must contain a special character",
      (value) => !value || /[^A-Za-z0-9]/.test(value),
    )
    .test(
      "no-spaces",
      "New password cannot contain spaces",
      (value) => !value || !/\s/.test(value),
    ),
});

const taskTitlePattern = /^[\p{L}\p{M}\p{N}' -]*$/u;
const taskDescriptionPattern = /^[\p{L}\p{M}\p{N}\s.,!?،؛؟'"():;\/-]*$/u;

export const TaskValidationSchema = Yup.object({
  title: Yup.string()
    .trim()
    .max(200, "Title cannot exceed 200 characters")
    .matches(
      taskTitlePattern,
      "Use only letters, numbers, spaces, apostrophes, and hyphens",
    )
    .required("Title is required"),
  description: Yup.string()
    .trim()
    .max(5000, "Description cannot exceed 5000 characters")
    .matches(
      taskDescriptionPattern,
      "Description contains unsupported special characters",
    )
    .required("Description is required"),
  status: Yup.string()
    .oneOf(["To Do", "In Progress", "Done"], "Select a valid status")
    .required("Status is required"),
  priority: Yup.string()
    .oneOf(["Low", "Medium", "High"], "Select a valid priority")
    .required("Priority is required"),
  dueDate: Yup.string()
    .required("Due date is required")
    .test(
      "valid-date",
      "Enter a valid due date",
      (value) => Boolean(value) && !Number.isNaN(new Date(value).getTime()),
    ),
});

