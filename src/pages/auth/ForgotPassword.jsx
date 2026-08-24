// pages/auth/ForgotPassword.jsx

import { useState } from "react";
import { Button } from "antd";
import { Form, Formik } from "formik";
import { Link } from "react-router-dom";
import * as Yup from "yup";

import {
  RiArrowLeftLine,
  RiArrowRightLine,
  RiCheckLine,
  RiMailCheckLine,
  RiMailLine,
  RiShieldCheckLine,
  RiTaskLine,
} from "react-icons/ri";

import AppInput from "@/common/AppInput";
import usePostData from "@/api/usePostData";
import { showToast } from "@/components/toastify/Toast";
import { forgetPasswordValidationSchema } from "@/utils/validationSchema";


const initialValues = {
  email: "",
};

const dashboardFeatures = [
  "Create and organize tasks",
  "Keep your team focused",
  "Track work from one dashboard",
];

// ======================================================
// Desktop visual panel
// ======================================================

function AuthVisualPanel() {
  return (
    <section className="relative hidden min-h-screen overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-700 to-slate-950 p-10 text-white lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:justify-between xl:p-14">
      <div className="pointer-events-none absolute -left-28 bottom-10 h-80 w-80 rounded-full border border-white/10" />

      <div className="pointer-events-none absolute -left-16 bottom-24 h-56 w-56 rounded-full border border-white/10" />

      <div className="pointer-events-none absolute -right-28 -top-28 h-96 w-96 rounded-full bg-white/5" />

      <div className="relative z-10 flex items-center gap-5">
        <div className="grid h-16 w-16 place-items-center rounded-2xl bg-white/15 ring-1 ring-white/20 backdrop-blur-sm xl:h-20 xl:w-20">
          <RiTaskLine className="text-3xl xl:text-4xl" />
        </div>

        <span className="text-2xl font-black tracking-[-0.04em] xl:text-4xl">
          Electro Pi
        </span>
      </div>

      <div className="relative z-10 max-w-xl py-12">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-emerald-100">
          Tasks Dashboard
        </p>

        <h1 className="text-4xl font-bold leading-tight xl:text-5xl">
          Recover access.
          <br />
          Keep moving forward.
        </h1>

        <p className="mt-5 max-w-lg text-base leading-7 text-emerald-50/80 xl:text-lg">
          We&apos;ll send you a secure password reset link so you can
          return to your tasks and keep your work moving.
        </p>

        <ul className="mt-8 space-y-3">
          {dashboardFeatures.map((feature) => (
            <li
              key={feature}
              className="flex items-center gap-3 text-sm text-emerald-50"
            >
              <span className="grid h-6 w-6 place-items-center rounded-full bg-white/15">
                <RiCheckLine size={16} />
              </span>

              {feature}
            </li>
          ))}
        </ul>
      </div>

      <p className="relative z-10 text-sm text-emerald-100/70">
        © {new Date().getFullYear()} Electro Pi
      </p>
    </section>
  );
}

// ======================================================
// Shared responsive layout
// ======================================================

function AuthLayout({
  children,
  mobileEyebrow = "Account recovery",
  mobileTitle = "Let’s get you back to your tasks.",
}) {
  return (
    <main className="min-h-screen bg-emerald-600 text-slate-900 transition-colors lg:bg-white dark:bg-slate-950 dark:text-white">
      <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
        <AuthVisualPanel />

        <section className="relative flex min-h-screen flex-col lg:items-center lg:justify-center lg:bg-white lg:px-12 lg:py-10 dark:lg:bg-slate-950">
          {/* Mobile hero */}
          <div className="relative min-h-[245px] overflow-hidden px-5 pb-16 pt-5 text-white sm:min-h-[265px] sm:px-8 lg:hidden">
            <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full border-[46px] border-white/5" />

            <div className="pointer-events-none absolute -left-24 top-20 h-52 w-52 rounded-full border border-white/10" />

            <div className="pointer-events-none absolute bottom-6 right-10 h-16 w-16 rotate-12 rounded-2xl bg-white/5" />

            <div className="relative z-10 flex items-center justify-between">
              <Link to="/" className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-white/15 ring-1 ring-white/20 backdrop-blur-sm">
                  <RiTaskLine size={23} />
                </div>

                <div>
                  <p className="text-lg font-black leading-tight tracking-tight">
                    Electro Pi
                  </p>

                  <p className="text-[11px] text-emerald-50/75">
                    Tasks Dashboard
                  </p>
                </div>
              </Link>

              <div className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-2.5 py-1.5 text-[10px] font-semibold backdrop-blur-sm">
                <RiShieldCheckLine size={13} />
                Secure
              </div>
            </div>

            <div className="relative z-10 mt-9">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-100">
                {mobileEyebrow}
              </p>

              <h1 className="mt-2 max-w-xs text-[26px] font-bold leading-tight tracking-tight sm:text-3xl">
                {mobileTitle}
              </h1>
            </div>
          </div>

          {/* Mobile bottom sheet */}
          <div className="relative z-10 -mt-8 flex flex-1 flex-col rounded-t-[34px] bg-white px-5 pb-6 pt-9 sm:-mt-10 sm:px-8 sm:pt-10 lg:mt-0 lg:w-full lg:max-w-md lg:flex-none lg:rounded-none lg:bg-transparent lg:p-0 dark:bg-slate-950">
            <span className="absolute left-1/2 top-3 h-1 w-10 -translate-x-1/2 rounded-full bg-slate-200 lg:hidden dark:bg-white/10" />

            <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center">
              {children}
            </div>

            <p className="mt-8 text-center text-[11px] text-slate-400 lg:hidden dark:text-slate-600">
              © {new Date().getFullYear()} Electro Pi
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

// ======================================================
// Email sent state
// ======================================================

function EmailSentState({ email, onTryAgain }) {
  return (
    <AuthLayout
      mobileEyebrow="Email sent"
      mobileTitle="Your reset link is on the way."
    >
      <div className="text-center">
        <div className="relative mx-auto inline-flex">
          <div className="grid h-16 w-16 place-items-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
            <RiMailCheckLine className="text-3xl" />
          </div>

          <span className="absolute -bottom-1 -right-1 grid h-6 w-6 place-items-center rounded-full border-2 border-white bg-emerald-500 text-white dark:border-slate-950">
            <RiCheckLine size={14} />
          </span>
        </div>

        <p className="mt-6 hidden text-sm font-semibold text-emerald-600 lg:block dark:text-emerald-400">
          Electro Pi Tasks Dashboard
        </p>

        <h1 className="mt-4 text-[28px] font-bold tracking-tight sm:text-3xl lg:mt-2 lg:text-4xl">
          Check your email
        </h1>

        <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-500 dark:text-slate-400">
          If an account exists for{" "}
          <span className="break-all font-semibold text-slate-700 dark:text-slate-200">
            {email}
          </span>
          , we&apos;ve sent a secure password reset link.
        </p>

        <div className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4 text-left dark:border-emerald-500/15 dark:bg-emerald-500/5">
          <div className="flex gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
              <RiShieldCheckLine size={21} />
            </span>

            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                The link expires in 15 minutes
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                Check your spam folder if you don&apos;t see the email
                in your inbox.
              </p>
            </div>
          </div>
        </div>

        <Link
          to="/login"
          className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
        >
          Back to sign in
          <RiArrowRightLine size={18} />
        </Link>

        <button
          type="button"
          onClick={onTryAgain}
          className="mt-5 inline-flex items-center text-sm font-semibold text-emerald-600 transition-colors hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
        >
          Use another email address
        </button>
      </div>
    </AuthLayout>
  );
}

// ======================================================
// Forgot password page
// ======================================================

export default function ForgotPassword() {
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  const {
    postData: forgotPassword,
    loading,
  } = usePostData();

  const handleSubmit = async (
    values,
    {
      setSubmitting,
      setFieldError,
    },
  ) => {
    const email = String(values.email || "")
      .trim()
      .toLowerCase();

    try {
      const response = await forgotPassword({
        route: "auth/password/forgot",
        data: {
          email,
        },
      });

      const result = response?.data || response;

      if (
        result?.code !== 200 &&
        result?.success !== true
      ) {
        throw new Error(
          result?.message ||
            "Unable to send the password reset link.",
        );
      }

      setSubmittedEmail(email);
      setEmailSent(true);

      showToast(
        "success",
        "Password reset link sent. Check your email.",
      );
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Unable to send the password reset link.";

      if (
        message === "errors.requiredEmail" ||
        message === "errors.validEmail"
      ) {
        setFieldError(
          "email",
          "Enter a valid email address",
        );

        return;
      }

      showToast("error", message);
    } finally {
      setSubmitting(false);
    }
  };

  if (emailSent) {
    return (
      <EmailSentState
        email={submittedEmail}
        onTryAgain={() => {
          setSubmittedEmail("");
          setEmailSent(false);
        }}
      />
    );
  }

  return (
    <AuthLayout>
      <header className="mb-7 sm:mb-8">
        <div className="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-emerald-50 text-emerald-600 lg:hidden dark:bg-emerald-500/10 dark:text-emerald-400">
          <RiMailLine size={22} />
        </div>

        <p className="mb-2 hidden text-sm font-semibold text-emerald-600 lg:block dark:text-emerald-400">
          Electro Pi Tasks Dashboard
        </p>

        <h1 className="text-[28px] font-bold leading-tight tracking-tight sm:text-3xl lg:text-4xl">
          Forgot password?
        </h1>

        <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500 sm:mt-3 dark:text-slate-400">
          Enter your email address and we&apos;ll send you a secure link
          to reset your password.
        </p>
      </header>

      <Formik
        initialValues={initialValues}
        validationSchema={forgetPasswordValidationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form noValidate>
            <AppInput
              is_required
              name="email"
              type="email"
              label="Email Address"
              placeholder="name@example.com"
              icon={
                <RiMailLine className="text-slate-400" />
              }
              autoComplete="email"
            />

            <Button
              block
              size="large"
              type="primary"
              htmlType="submit"
              loading={loading || isSubmitting}
              disabled={loading || isSubmitting}
              className="group !mt-7 !flex !h-12 !items-center !justify-center !rounded-xl !border-0 !bg-emerald-600 !font-semibold !text-white !shadow-none hover:!bg-emerald-700 disabled:!cursor-not-allowed disabled:!opacity-70"
            >
              <span className="flex items-center justify-center gap-2">
                Send reset link

                {!loading && !isSubmitting && (
                  <RiArrowRightLine
                    size={18}
                    className="transition-transform duration-200 group-hover:translate-x-1"
                  />
                )}
              </span>
            </Button>

            <div className="my-6 flex items-center gap-3 lg:hidden">
              <span className="h-px flex-1 bg-slate-200 dark:bg-white/10" />

              <span className="text-[11px] text-slate-400">
                Remember your password?
              </span>

              <span className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
            </div>

            <div className="text-center lg:mt-6">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 transition-colors hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
              >
                <RiArrowLeftLine />
                Back to sign in
              </Link>
            </div>
          </Form>
        )}
      </Formik>
    </AuthLayout>
  );
}