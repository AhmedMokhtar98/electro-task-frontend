import { useEffect, useMemo, useState } from "react";
import { Button } from "antd";
import { Form, Formik } from "formik";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { RiArrowLeftLine, RiMailCheckLine, RiShieldCheckLine, } from "react-icons/ri";
import AppInput from "@/common/AppInput";
import usePostData from "@/api/usePostData";
import { showToast } from "@/components/toastify/Toast";
import { emailConfirmationValidationSchema } from "@/utils/validationSchema";

const RESEND_SECONDS = 60;
const COOLDOWN_STORAGE_PREFIX = "email-verification-resend-until";

const getCooldownKey = (email) => `${COOLDOWN_STORAGE_PREFIX}:${email}`;

const getRemainingSeconds = (expiresAt) => Math.max(Math.ceil((expiresAt - Date.now()) / 1000), 0);

const maskEmail = (email) => {
  if (!email || !email.includes("@")) return email || "your email";
  const [name, domain] = email.split("@");
  const visibleName = name.slice(0, Math.min(2, name.length));
  return `${visibleName}${"*".repeat(Math.max(name.length - 2, 3))}@${domain}`;
};

export default function EmailConfirmation() {
  const location = useLocation();
  const { postData } = usePostData();
  const navigate = useNavigate();

  const [resendLoading, setResendLoading] = useState(false);

  const queryEmail = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get("email");
  }, [location.search]);

  const email = queryEmail?.trim().toLowerCase() || "";

  const cooldownKey = useMemo( () => (email ? getCooldownKey(email) : ""), [email], );
  const [cooldownExpiresAt, setCooldownExpiresAt] = useState(0);
  const [remainingSeconds, setRemainingSeconds] = useState(0);


  useEffect(() => {
    if (!cooldownKey) {
      setCooldownExpiresAt(0);
      setRemainingSeconds(0);
      return;
    }

    const storedExpiresAt = Number(localStorage.getItem(cooldownKey));

    if (Number.isFinite(storedExpiresAt) && storedExpiresAt > 0) {
      setCooldownExpiresAt(storedExpiresAt);
      setRemainingSeconds(getRemainingSeconds(storedExpiresAt));
      return;
    }

    const initialExpiresAt = Date.now() + RESEND_SECONDS * 1000;

    localStorage.setItem(cooldownKey, String(initialExpiresAt));
    setCooldownExpiresAt(initialExpiresAt);
    setRemainingSeconds(RESEND_SECONDS);
  }, [cooldownKey]);



  useEffect(() => {
    if (!cooldownExpiresAt) return undefined;

    const updateRemainingTime = () => {
      setRemainingSeconds(getRemainingSeconds(cooldownExpiresAt));
    };

    updateRemainingTime();

    const timer = window.setInterval(updateRemainingTime, 1000);

    return () => window.clearInterval(timer);
  }, [cooldownExpiresAt]);

  const onSubmit = async (values, { setSubmitting }) => {
    const normalizedEmail = values.email.trim().toLowerCase();

    if (!normalizedEmail) {
      showToast({ text: "Email address is missing. Please register again.", status: false, });
      setSubmitting(false);
      return;
    }

      const response = await postData({ route: "auth/email-verify", data: { email: normalizedEmail, otp: values.otp.trim(), }, });

      if (!response?.error || response?.error?.status === 409) {
        if (cooldownKey) { localStorage.removeItem(cooldownKey); }
        navigate("/login", { replace: true })
        return;
      }
  };

const resendCode = async () => {
  if (!email || remainingSeconds > 0 || resendLoading) return;
  setResendLoading(true);
  try {
    const response = await postData({ route: "auth/email-verify/otp-resend", data: { email }, });
    if (response?.error) {
      showToast({ text: response?.error?.response?.data?.message || response?.error?.response?.data?.error || response?.data?.message || "Unable to resend the confirmation code", status: false, });
      return;
    }
    const nextExpiresAt = Date.now() + RESEND_SECONDS * 1000;
    localStorage.setItem(cooldownKey, String(nextExpiresAt));
    setCooldownExpiresAt(nextExpiresAt);
    setRemainingSeconds(RESEND_SECONDS);
  } catch (error) {
    showToast({ text: error?.response?.data?.message || error?.response?.data?.error || error?.message || "Unable to resend the confirmation code", status: false, });
  } finally {
    // Always stop the Sending... state
    setResendLoading(false);
  }
};

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10 text-slate-900 transition-colors dark:bg-slate-950 dark:text-white sm:px-6">
      <div className="w-full max-w-md">
        <Link
          to="/login"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400"
        >
          <RiArrowLeftLine size={18} />
          Back to sign in
        </Link>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
          <header className="mb-8 text-center">
            <div className="relative mx-auto mb-5 grid h-16 w-16 place-items-center rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400">
              <RiMailCheckLine size={32} />
              <span className="absolute -bottom-1 -right-1 grid h-6 w-6 place-items-center rounded-full border-2 border-white bg-emerald-600 text-white dark:border-slate-900">
                <RiShieldCheckLine size={14} />
              </span>
            </div>

            <p className="mb-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
              Electro Pi Tasks Dashboard
            </p>
            <h1 className="text-3xl font-bold tracking-tight">
              Confirm your email
            </h1>
            <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
              We sent a 6-digit confirmation code to
              <span className="mt-1 block font-semibold text-slate-700 dark:text-slate-200">
                {maskEmail(email)}
              </span>
            </p>
          </header>

          <Formik
            initialValues={{ email, otp: "" }}
            validationSchema={emailConfirmationValidationSchema}
            onSubmit={onSubmit}
            enableReinitialize
          >
            {({ isSubmitting }) => (
              <Form noValidate>
                <AppInput
                  is_required
                  disabled
                  name="email"
                  type="email"
                  label="Email Address"
                  placeholder="Email address"
                />

                <AppInput
                  is_required
                  name="otp"
                  type="text"
                  label="Confirmation Code"
                  placeholder="Enter the 6-digit code"
                  inputMode="numeric"
                  maxLength={6}
                  autoComplete="one-time-code"
                  icon={<RiShieldCheckLine className="text-slate-400" />}
                />

                <Button
                  block
                  size="large"
                  type="primary"
                  htmlType="submit"
                  loading={isSubmitting}
                  disabled={isSubmitting}
                  className="!mt-3 !h-12 !rounded-xl !border-0 !bg-emerald-600 !font-semibold !text-white hover:!bg-emerald-700"
                >
                  Confirm email
                </Button>
              </Form>
            )}
          </Formik>

          <div className="mt-7 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Didn&apos;t receive the code?
            </p>

            <button
              type="button"
              onClick={resendCode}
              disabled={remainingSeconds > 0 || resendLoading || !email}
              className="mt-2 text-sm font-semibold text-emerald-600 transition hover:text-emerald-700 disabled:cursor-not-allowed disabled:text-slate-400 dark:text-emerald-400 dark:hover:text-emerald-300 dark:disabled:text-slate-600"
            >
              {resendLoading
                ? "Sending..."
                : remainingSeconds > 0
                  ? `Resend code in ${remainingSeconds}s`
                  : "Resend confirmation code"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}