import { Button, Checkbox } from "antd";
import { Form, Formik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import {
  RiArrowRightLine,
  RiCheckLine,
  RiLock2Line,
  RiMailLine,
  RiShieldCheckLine,
  RiTaskLine,
  RiUser3Line,
} from "react-icons/ri";

import AppInput from "@/common/AppInput";
import usePostData from "@/api/usePostData";
import { RegisterValidationSchema } from "@/utils/validationSchema";

const initialValues = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
  acceptTerms: false,
};

const dashboardFeatures = [
  "Create and organize tasks",
  "Keep your team focused",
  "Track work from one dashboard",
];

export default function Register() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { postData } = usePostData();

  const onSubmit = async (values) => {
    const {
      confirmPassword,
      acceptTerms,
      ...formData
    } = values;

    const dataToSend = {
      ...formData,
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim().toLowerCase(),
    };

    const response = await postData({
      route: "auth/register",
      data: dataToSend,
    });

    if (!response?.error) {
      navigate(
        `/email-confirmation?email=${encodeURIComponent(
          dataToSend.email,
        )}`,
        {
          replace: true,
        },
      );
    }
  };

  return (
    <main className="min-h-screen bg-emerald-600 text-slate-900 transition-colors lg:bg-white dark:bg-slate-950 dark:text-white">
      <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
        {/* Desktop presentation panel */}
        <section className="relative hidden min-h-screen overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-700 to-slate-950 p-10 text-white lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:justify-between xl:p-14">
          <div className="absolute -left-28 bottom-10 h-80 w-80 rounded-full border border-white/10" />

          <div className="absolute -left-16 bottom-24 h-56 w-56 rounded-full border border-white/10" />

          <div className="absolute -right-28 -top-28 h-96 w-96 rounded-full bg-white/5" />

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
              Build momentum.
              <br />
              Finish more together.
            </h1>

            <p className="mt-5 max-w-lg text-base leading-7 text-emerald-50/80 xl:text-lg">
              Create your workspace and bring tasks, priorities, and progress
              into one focused dashboard.
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

        {/* Registration section */}
        <section className="relative flex min-h-screen flex-col lg:bg-white lg:px-12 lg:py-10 dark:lg:bg-slate-950">
          {/* Mobile hero */}
          <div className="relative min-h-[245px] overflow-hidden px-5 pb-16 pt-5 text-white sm:min-h-[265px] sm:px-8 lg:hidden">
            <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full border-[46px] border-white/5" />

            <div className="pointer-events-none absolute -left-24 top-20 h-52 w-52 rounded-full border border-white/10" />

            <div className="pointer-events-none absolute bottom-6 right-10 h-16 w-16 rotate-12 rounded-2xl bg-white/5" />

            {/* Mobile branding */}
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

            {/* Mobile hero content */}
            <div className="relative z-10 mt-9">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-100">
                Create your workspace
              </p>

              <h1 className="mt-2 max-w-xs text-[26px] font-bold leading-tight tracking-tight sm:text-3xl">
                Start organizing your work today.
              </h1>
            </div>
          </div>

          {/* Mobile bottom sheet */}
          <div className="relative z-10 -mt-8 flex-1 rounded-t-[34px] bg-white px-4 pb-6 pt-9 sm:-mt-10 sm:px-8 sm:pt-10 lg:mt-0 lg:flex lg:items-center lg:justify-center lg:rounded-none lg:bg-transparent lg:p-0 dark:bg-slate-950">
            {/* Sheet handle */}
            <span className="absolute left-1/2 top-3 h-1 w-10 -translate-x-1/2 rounded-full bg-slate-200 lg:hidden dark:bg-white/10" />

            <div className="mx-auto w-full max-w-md">
              <header className="mb-6 sm:mb-8">
                <div className="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-emerald-50 text-emerald-600 lg:hidden dark:bg-emerald-500/10 dark:text-emerald-400">
                  <RiUser3Line size={22} />
                </div>

                <p className="mb-2 hidden text-sm font-semibold text-emerald-600 lg:block dark:text-emerald-400">
                  Electro Pi Tasks Dashboard
                </p>

                <h2 className="text-[27px] font-bold leading-tight tracking-tight sm:text-3xl lg:text-4xl">
                  {t("Create your account")}
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500 sm:mt-3 dark:text-slate-400">
                  {t("Start organizing your tasks in one place")}
                </p>
              </header>

              <Formik
                initialValues={initialValues}
                validationSchema={RegisterValidationSchema}
                onSubmit={onSubmit}
              >
                {({
                  errors,
                  isSubmitting,
                  setFieldTouched,
                  setFieldValue,
                  touched,
                  values,
                }) => (
                  <Form noValidate>
                    <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
                      <AppInput
                        is_required
                        name="firstName"
                        type="text"
                        label="First Name"
                        placeholder="Enter your first name"
                        icon={
                          <RiUser3Line className="text-slate-400" />
                        }
                      />

                      <AppInput
                        is_required
                        name="lastName"
                        type="text"
                        label="Last Name"
                        placeholder="Enter your last name"
                        icon={
                          <RiUser3Line className="text-slate-400" />
                        }
                      />
                    </div>

                    <AppInput
                      is_required
                      name="email"
                      type="email"
                      label="Email"
                      placeholder="name@example.com"
                      icon={
                        <RiMailLine className="text-slate-400" />
                      }
                    />

                    <AppInput
                      is_required
                      name="password"
                      type="password"
                      label="Password"
                      placeholder="Create a strong password"
                      icon={
                        <RiLock2Line className="text-slate-400" />
                      }
                    />

                    <AppInput
                      is_required
                      name="confirmPassword"
                      type="password"
                      label="Confirm Password"
                      placeholder="Enter your password again"
                      icon={
                        <RiLock2Line className="text-slate-400" />
                      }
                      showPasswordRequirements={false}
                    />

                    <div className="mb-6 mt-1">
                      <Checkbox
                        checked={values.acceptTerms}
                        onChange={(event) => {
                          setFieldValue(
                            "acceptTerms",
                            event.target.checked,
                          );

                          setFieldTouched(
                            "acceptTerms",
                            true,
                            false,
                          );
                        }}
                      >
                        <span className="text-sm leading-5 text-slate-600 dark:text-slate-300">
                          {t("I agree to the")}{" "}
                          <span className="font-semibold text-emerald-600 transition-colors hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300">
                            {t("Terms and Conditions")}
                          </span>
                        </span>
                      </Checkbox>

                      {touched.acceptTerms &&
                        errors.acceptTerms && (
                          <p className="ml-6 mt-1.5 text-xs text-red-500">
                            {t(errors.acceptTerms)}
                          </p>
                        )}
                    </div>

                    <Button
                      block
                      size="large"
                      type="primary"
                      htmlType="submit"
                      loading={isSubmitting}
                      disabled={isSubmitting}
                      className="group !flex !h-12 !items-center !justify-center !rounded-xl !border-0 !bg-emerald-600 !font-semibold !text-white !shadow-none hover:!bg-emerald-700 disabled:!cursor-not-allowed disabled:!opacity-70"
                    >
                      <span className="flex items-center justify-center gap-2">
                        {t("Create account")}

                        {!isSubmitting && (
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
                        {t("Already registered?")}
                      </span>

                      <span className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
                    </div>

                    <p className="text-center text-sm text-slate-500 lg:mt-7 dark:text-slate-400">
                      {t("Already have an account?")}{" "}
                      <Link
                        to="/login"
                        className="font-semibold text-emerald-600 transition-colors hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
                      >
                        {t("Sign in")}
                      </Link>
                    </p>
                  </Form>
                )}
              </Formik>

              <p className="mt-7 text-center text-[11px] text-slate-400 lg:hidden dark:text-slate-600">
                © {new Date().getFullYear()} Electro Pi
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}