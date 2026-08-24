import usePostData from "@/api/usePostData";
import AppInput from "@/common/AppInput";
import { setAuthData } from "@/redux/slices/authDataSlice";
import { LoginValidationSchema } from "@/utils/validationSchema";

import { Button } from "antd";
import { Form, Formik } from "formik";
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { MdOutlineEmail } from "react-icons/md";
import {
  RiArrowRightLine,
  RiCheckLine,
  RiLockPasswordLine,
  RiShieldCheckLine,
  RiTaskLine,
} from "react-icons/ri";

const initialValues = {
  email: "",
  password: "",
};

const dashboardFeatures = [
  "Create and organize tasks",
  "Keep your team focused",
  "Track work from one dashboard",
];

const Login = () => {
  const { postData, loading } = usePostData({
    route: "login",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onSubmit = async (values) => {
    const response = await postData({
      route: "auth/login",
      data: values,
    });

      const accessToken = response?.data?.result?.token?.accessToken;
      const refreshToken = response?.data?.result?.token?.refreshToken;

    if (!response?.error && accessToken) {
      const decodedToken = jwtDecode(accessToken);

      dispatch(
        setAuthData({
          authData: decodedToken,
          auth: true,
          token: accessToken,
          refreshToken,
        }),
      );

      navigate("/", {
        replace: true,
      });

      return;
    }

    if (response?.error?.status === 403) {
      navigate(
        `/email-confirmation?email=${encodeURIComponent(
          values.email,
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
        {/* Desktop panel */}
        <section className="relative hidden overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-700 to-slate-950 p-10 text-white lg:flex lg:flex-col lg:justify-between xl:p-14">
          <div className="absolute -left-28 bottom-10 h-80 w-80 rounded-full border border-white/10" />
          <div className="absolute -left-16 bottom-24 h-56 w-56 rounded-full border border-white/10" />
          <div className="absolute -right-28 -top-28 h-96 w-96 rounded-full bg-white/5" />

          <div className="relative z-10 flex items-center gap-5">
            <div className="grid h-16 w-16 place-items-center rounded-2xl bg-white/15 ring-1 ring-white/20 backdrop-blur-sm xl:h-20 xl:w-20">
              <RiTaskLine className="text-2xl xl:text-4xl" />
            </div>

            <span className="text-2xl font-black tracking-[-0.04em] xl:text-4xl">
              Electro Pi
            </span>
          </div>

          <div className="relative z-10 max-w-xl py-16">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-emerald-100">
              Tasks Dashboard
            </p>

            <h1 className="text-4xl font-bold leading-tight xl:text-5xl">
              Plan clearly.
              <br />
              Deliver confidently.
            </h1>

            <p className="mt-5 max-w-lg text-base leading-7 text-emerald-50/80 xl:text-lg">
              A focused workspace for managing tasks, priorities, and everyday
              progress with your team.
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

        {/* Login section */}
        <section className="relative flex min-h-screen flex-col lg:items-center lg:justify-center lg:bg-white lg:px-12 lg:py-10 dark:lg:bg-slate-950">
          {/* Mobile top area */}
          <div className="relative flex min-h-[245px] flex-col overflow-hidden px-5 pb-16 pt-5 text-white sm:min-h-[270px] sm:px-8 lg:hidden">
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

              <div className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-2.5 py-1.5 text-[10px] font-semibold">
                <RiShieldCheckLine size={13} />
                Secure
              </div>
            </div>

            <div className="relative z-10 mt-auto">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-100">
                Your workspace
              </p>

              <h1 className="mt-2 max-w-xs text-[26px] font-bold leading-tight tracking-tight">
                Everything is ready for your return.
              </h1>
            </div>
          </div>

          {/* Mobile bottom sheet / desktop form */}
          <div className="relative w-full z-10 -mt-8 flex flex-1 flex-col rounded-t-[34px] bg-white px-5 pb-6 pt-8 sm:-mt-10 sm:px-8 sm:pt-10 lg:mt-0 lg:flex-none lg:rounded-none lg:bg-transparent lg:p-0 dark:bg-slate-950">
            {/* Mobile sheet handle */}
            <span className="absolute left-1/2 top-3 h-1 w-10 -translate-x-1/2 rounded-full bg-slate-200 lg:hidden dark:bg-white/10" />

            <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center">
              <header className="mb-7">
                <p className="mb-2 hidden text-sm font-semibold text-emerald-600 lg:block dark:text-emerald-400">
                  Electro Pi Tasks Dashboard
                </p>

                <div className="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-emerald-50 text-emerald-600 lg:hidden dark:bg-emerald-500/10 dark:text-emerald-400">
                  <RiLockPasswordLine size={22} />
                </div>

                <h2 className="text-[28px] font-bold leading-tight tracking-tight sm:text-3xl lg:text-4xl">
                  Welcome back
                </h2>

                <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500 sm:mt-3 dark:text-slate-400">
                  Sign in to continue managing your tasks and team workspace.
                </p>
              </header>

              <Formik
                initialValues={initialValues}
                validationSchema={LoginValidationSchema}
                onSubmit={onSubmit}
              >
                <Form noValidate>
                  <AppInput
                    is_required
                    name="email"
                    type="email"
                    label="Email Address"
                    placeholder="name@example.com"
                    icon={
                      <MdOutlineEmail
                        size={20}
                        className="text-slate-400"
                      />
                    }
                  />

                  <AppInput
                    is_required
                    name="password"
                    type="password"
                    label="Password"
                    placeholder="Enter your password"
                    icon={
                      <RiLockPasswordLine
                        size={20}
                        className="text-slate-400"
                      />
                    }
                  />

                  <div className="-mt-1 mb-6 flex justify-end">
                    <Link
                      to="/forgot-password"
                      className="text-sm font-semibold text-emerald-600 transition-colors hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  <Button
                    block
                    size="large"
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    disabled={loading}
                    className="group !flex !h-12 !items-center !justify-center !rounded-xl !border-0 !bg-emerald-600 !font-semibold !text-white !shadow-none transition-colors hover:!bg-emerald-700 disabled:!opacity-70"
                  >
                    <span className="flex items-center justify-center gap-2">
                      Sign in

                      {!loading && (
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
                      New to Electro Pi?
                    </span>

                    <span className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
                  </div>

                  <p className="text-center text-sm text-slate-500 lg:mt-7 dark:text-slate-400">
                    Don&apos;t have an account?{" "}
                    <Link
                      to="/register"
                      className="font-semibold text-emerald-600 transition-colors hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
                    >
                      Create Account
                    </Link>
                  </p>
                </Form>
              </Formik>
            </div>

            <p className="mt-7 text-center text-[11px] text-slate-400 lg:hidden dark:text-slate-600">
              © {new Date().getFullYear()} Electro Pi
            </p>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Login;