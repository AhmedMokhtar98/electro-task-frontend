// pages/auth/ResetPassword.jsx

import { useMemo, useState } from "react";

import { Button } from "antd";
import { Form, Formik } from "formik";
import {
  Link,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import * as Yup from "yup";

import {
  RiArrowLeftLine,
  RiCheckLine,
  RiCheckboxLine,
  RiErrorWarningLine,
  RiLock2Line,
  RiShieldCheckLine,
} from "react-icons/ri";

import AppInput from "@/common/AppInput";
import usePostData from "@/api/usePostData";
import { showToast } from "@/components/toastify/Toast";
import { resetPasswordValidationSchema } from "@/utils/validationSchema";

const initialValues = {
  newPassword: "",
  confirmPassword: "",
};

// ======================================================
// Password requirements
// ======================================================

const passwordRequirements = [
  {
    key: "length",
    label: "8+ characters",
    validate: (password) => password.length >= 8,
  },
  {
    key: "uppercase",
    label: "Uppercase letter",
    validate: (password) => /[A-Z]/.test(password),
  },
  {
    key: "lowercase",
    label: "Lowercase letter",
    validate: (password) => /[a-z]/.test(password),
  },
  {
    key: "number",
    label: "One number",
    validate: (password) => /\d/.test(password),
  },
  {
    key: "special",
    label: "Special character",
    validate: (password) =>
      /[^A-Za-z0-9]/.test(password),
  },
];

// ======================================================
// Logo
// ======================================================

function BrandLogo({ light = false }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={`flex size-[44px] shrink-0 items-center justify-center rounded-[10px] ${
          light
            ? "bg-white/15 text-white"
            : "bg-[#079d72]/10 text-[#079d72]"
        }`}
      >
        <RiCheckboxLine className="text-[23px]" />
      </div>

      <span
        className={`text-[21px] font-extrabold tracking-[-0.04em] ${
          light ? "text-white" : "text-[#101828]"
        }`}
      >
        Electro Pi
      </span>
    </div>
  );
}

// ======================================================
// Full-screen centered layout
// ======================================================

function AuthLayout({ children }) {
  return (
    <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[linear-gradient(145deg,#0ca47c_0%,#078866_48%,#002a32_100%)] px-4 py-24 sm:px-6">
      {/* Top-right decorative circle */}
      <div className="pointer-events-none absolute -right-32 -top-32 size-[420px] rounded-full bg-white/[0.055]" />

      {/* Bottom-left decorative circles */}
      <div className="pointer-events-none absolute -bottom-36 -left-36 size-[400px] rounded-full border border-white/[0.07]" />

      <div className="pointer-events-none absolute -bottom-20 -left-24 size-[280px] rounded-full border border-white/[0.07]" />

      {/* Center glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 size-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.025] blur-3xl" />

      {/* Logo */}
      <div className="absolute left-5 top-5 z-10 sm:left-8 sm:top-8">
        <BrandLogo light />
      </div>

      {/* Centered form */}
      <section className="relative z-10 w-full max-w-[540px] rounded-[24px] border border-white/20 bg-white px-6 py-8 shadow-[0_28px_90px_rgba(0,24,31,0.3)] sm:px-9 sm:py-10">
        {children}
      </section>

      {/* Footer */}
      <p className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap text-[12px] text-white/65">
        © {new Date().getFullYear()} Electro Pi
      </p>
    </main>
  );
}

// ======================================================
// Form header
// ======================================================

function FormHeader({
  title,
  description,
  icon: Icon,
  danger = false,
}) {
  return (
    <div className="text-center">
      {Icon && (
        <div
          className={`mx-auto mb-5 flex size-[56px] items-center justify-center rounded-2xl ${
            danger
              ? "bg-red-50 text-red-500"
              : "bg-[#079d72]/10 text-[#079d72]"
          }`}
        >
          <Icon className="text-[27px]" />
        </div>
      )}

      <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#079d72]">
        Electro Pi Tasks Dashboard
      </p>

      <h1 className="mt-2 text-[29px] font-bold tracking-[-0.04em] text-[#101828] sm:text-[32px]">
        {title}
      </h1>

      <p className="mx-auto mt-3 max-w-[350px] text-[14px] leading-6 text-[#667085]">
        {description}
      </p>
    </div>
  );
}

// ======================================================
// Password requirements
// ======================================================

function PasswordRequirements({ password }) {
  return (
    <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2.5">
      {passwordRequirements.map((requirement) => {
        const passed =
          requirement.validate(password);

        return (
          <div
            key={requirement.key}
            className={`flex items-center gap-2 text-[11px] transition-colors ${
              passed
                ? "font-medium text-[#079d72]"
                : "text-[#98a2b3]"
            }`}
          >
            <span
              className={`flex size-[17px] shrink-0 items-center justify-center rounded-full border transition-all ${
                passed
                  ? "border-[#079d72] bg-[#079d72] text-white"
                  : "border-[#d0d5dd] bg-white"
              }`}
            >
              {passed && (
                <RiCheckLine className="text-[11px]" />
              )}
            </span>

            <span>{requirement.label}</span>
          </div>
        );
      })}
    </div>
  );
}

// ======================================================
// Invalid-token state
// ======================================================

function InvalidTokenState() {
  return (
    <AuthLayout>
      <FormHeader
        icon={RiErrorWarningLine}
        danger
        title="Reset link unavailable"
        description="This password reset link is invalid or has expired. Request a new link to continue."
      />

      <Link
        to="/forgot-password"
        className="mt-7 inline-flex h-[48px] w-full items-center justify-center rounded-[10px] bg-[#079d72] px-5 text-[14px] font-semibold text-white transition-colors hover:bg-[#078863]"
      >
        Request a new reset link
      </Link>

      <div className="mt-5 text-center">
        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#079d72] transition-colors hover:text-[#067b5a]"
        >
          <RiArrowLeftLine className="text-[16px]" />
          Back to sign in
        </Link>
      </div>
    </AuthLayout>
  );
}

// ======================================================
// Success state
// ======================================================

function SuccessState() {
  const navigate = useNavigate();

  return (
    <AuthLayout>
      <FormHeader
        icon={RiShieldCheckLine}
        title="Password updated"
        description="Your password has been updated successfully. You can now sign in securely using your new password."
      />

      <Button
        type="primary"
        onClick={() =>
          navigate("/login", {
            replace: true,
          })
        }
        className="!mt-7 !h-[48px] !w-full !rounded-[10px] !border-0 !bg-[#079d72] !text-[14px] !font-semibold !shadow-none hover:!bg-[#078863]"
      >
        Continue to sign in
      </Button>
    </AuthLayout>
  );
}

// ======================================================
// Page
// ======================================================

function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = useMemo( () => String( searchParams.get("token") || "", ).trim(), [searchParams], );
  const [resetComplete, setResetComplete] = useState(false);
  const { postData: resetPassword, loading, } = usePostData();

  const handleSubmit = async ( values, { setSubmitting }, ) => {
    if (!token) {
      showToast( "error", "The password reset link is invalid or missing.", );
      setSubmitting(false);
      return;
    }
      const response = await resetPassword({route:"auth/password/reset", data:{ token, newPassword: values.newPassword } });
      setResetComplete(true);
      window.setTimeout(() => {
        navigate("/login", {
          replace: true,
        });
      }, 2500);
  };

  if (!token) {
    return <InvalidTokenState />;
  }

  if (resetComplete) {
    return <SuccessState />;
  }

  return (
    <AuthLayout>
      <FormHeader
        title="Create a new password"
        description="Choose a strong, unique password to protect your account and securely access your workspace."
      />

      <Formik
        initialValues={initialValues}
        validationSchema={resetPasswordValidationSchema}
        onSubmit={handleSubmit}
      >
        {({
          values,
          isSubmitting,
        }) => (
          <Form
            noValidate
            className="mt-7"
          >
            <AppInput
              name="newPassword"
              type="password"
              label="New Password"
              placeholder="Enter your new password"
              prefix={
                <RiLock2Line className="text-[#98a2b3]" />
              }
              autoComplete="new-password"
              showPasswordRequirements={false}
            />

            <PasswordRequirements
              password={values.newPassword}
            />

            <div className="mt-5">
              <AppInput
                name="confirmPassword"
                type="password"
                label="Confirm Password"
                placeholder="Re-enter your new password"
                prefix={
                  <RiLock2Line className="text-[#98a2b3]" />
                }
                autoComplete="new-password"
                showPasswordRequirements={false}
              />
            </div>

            <Button
              htmlType="submit"
              type="primary"
              loading={loading || isSubmitting}
              disabled={loading || isSubmitting}
              className="!mt-7 !h-[48px] !w-full !rounded-[10px] !border-0 !bg-[#079d72] !text-[14px] !font-semibold !shadow-none hover:!bg-[#078863] disabled:!cursor-not-allowed disabled:!opacity-60"
            >
              Set new password
            </Button>

            <div className="mt-6 text-center">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#079d72] transition-colors hover:text-[#067b5a]"
              >
                <RiArrowLeftLine className="text-[16px]" />
                Back to sign in
              </Link>
            </div>
          </Form>
        )}
      </Formik>
    </AuthLayout>
  );
}

export default ResetPassword;