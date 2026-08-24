import { useRef, useState } from "react";
import { Button, Result, Skeleton } from "antd";
import { Form, Formik } from "formik";
import { useDispatch } from "react-redux";
import {
  BadgeCheck,
  CalendarDays,
  Edit3,
  KeyRound,
  Mail,
  Save,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";
import useGetData from "@/api/useGetData";
import usePutData from "@/api/usePutData";
import AppInput from "@/common/AppInput";
import { showToast } from "@/components/toastify/Toast";
import { setAuthData } from "@/redux/slices/authDataSlice";
import { ProfileValidationSchema } from "@/utils/validationSchema";

const getProfileInitialValues = (client = {}) => ({
  firstName: client.firstName || "",
  lastName: client.lastName || "",
  email: client.email || "",
  oldPassword: "",
  newPassword: "",
});

const Profile = () => {
  const formikRef = useRef(null);
  const dispatch = useDispatch();
  const [isEditMode, setIsEditMode] = useState(false);
  const { putData, loading: updateLoading } = usePutData();
  const {
    data,
    error,
    loading,
    setData,
    getData,
  } = useGetData({
    route: "profile",
    disableUrlParam: true,
  });

  const client = data?.client || {};
  const fullName =
    [client.firstName, client.lastName].filter(Boolean).join(" ") || "User";
  const initials =
    [client.firstName, client.lastName]
      .filter(Boolean)
      .map((name) => name.charAt(0).toUpperCase())
      .join("") || "U";
  const joinedDate = client.createdAt
    ? new Date(client.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "Not available";

  const cancelEdit = () => {
    formikRef.current?.resetForm({
      values: getProfileInitialValues(client),
    });
    setIsEditMode(false);
  };

  const onSubmit = async (values, { resetForm }) => {
    if (!isEditMode) return;

    const firstName = values.firstName.trim();
    const lastName = values.lastName.trim();
    const changedData = {};

    if (firstName !== client.firstName) changedData.firstName = firstName;
    if (lastName !== client.lastName) changedData.lastName = lastName;

    if (values.oldPassword && values.newPassword) {
      changedData.oldPassword = values.oldPassword;
      changedData.newPassword = values.newPassword;
    }

    if (!Object.keys(changedData).length) {
      showToast({ text: "No changes detected", status: false, });
      return;
    }

    const response = await putData({
      route: "profile",
      data: changedData,
    });

    if (response?.error) return;

    const result = response?.data?.result;
    const updatedClient = result?.client || {
      ...client,
      firstName,
      lastName,
    };
    const accessToken = result?.token?.accessToken;
    const refreshToken = result?.token?.refreshToken;

    setData({ client: updatedClient, });

    if (accessToken) {
      dispatch(
        setAuthData({
          token: accessToken,
          refreshToken,
        }),
      );
    }

    resetForm({ values: getProfileInitialValues(updatedClient), });
    setIsEditMode(false);
  };

  if (loading) {
    return (
      <div className="min-h-full bg-slate-50 px-4 py-7 dark:bg-slate-950 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-[300px_minmax(0,1fr)]">
          <Skeleton.Node active className="!h-80 !w-full !rounded-3xl" />
          <Skeleton.Node active className="!h-[520px] !w-full !rounded-3xl" />
        </div>
      </div>
    );
  }

  if (error && !client._id) {
    return (
      <div className="grid min-h-[calc(100vh-80px)] place-items-center px-4">
        <Result
          status="error"
          title="Unable to load your profile"
          subTitle={error}
          extra={
            <Button
              type="primary"
              onClick={() => getData({ disableUrlParam: true, })}
            >
              Try again
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <main className="min-h-full bg-slate-50 px-4 py-7 dark:bg-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-600 dark:text-emerald-400">
              Account settings
            </p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950 dark:text-white">
              My profile
            </h1>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Manage your personal information and account security.
            </p>
          </div>

          {!isEditMode && (
            <Button
              className="!flex !h-11 !items-center !rounded-xl !border-emerald-600 !bg-emerald-600 !px-5 !font-semibold !text-white hover:!border-emerald-700 hover:!bg-emerald-700"
              icon={<Edit3 size={17} />}
              type="primary"
              onClick={() => setIsEditMode(true)}
            >
              Edit profile
            </Button>
          )}
        </header>

        <div className="grid gap-5 lg:grid-cols-[300px_minmax(0,1fr)]">
          <aside className="h-fit overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="h-24 bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700" />
            <div className="px-6 pb-6">
              <div className="-mt-12 grid h-24 w-24 place-items-center rounded-3xl border-4 border-white bg-slate-950 text-3xl font-bold text-white shadow-lg dark:border-slate-900">
                {initials}
              </div>

              <div className="mt-4">
                <div className="flex items-center gap-2">
                  <h2 className="truncate text-xl font-bold text-slate-950 dark:text-white">
                    {fullName}
                  </h2>
                  {client.isEmailVerified && (
                    <BadgeCheck
                      aria-label="Verified email"
                      className="shrink-0 text-emerald-500"
                      size={19}
                    />
                  )}
                </div>
                <p className="mt-1 truncate text-sm text-slate-500 dark:text-slate-400">
                  {client.email}
                </p>
              </div>

              <div className="mt-6 space-y-3 border-t border-slate-100 pt-5 text-sm dark:border-slate-800">
                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                    <ShieldCheck size={17} />
                  </span>
                  <div>
                    <p className="text-xs text-slate-400">Account status</p>
                    <p className="font-medium">
                      {client.isEmailVerified ? "Verified" : "Pending verification"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-sky-50 text-sky-600 dark:bg-sky-950/50 dark:text-sky-400">
                    <CalendarDays size={17} />
                  </span>
                  <div>
                    <p className="text-xs text-slate-400">Member since</p>
                    <p className="font-medium">{joinedDate}</p>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-7 lg:p-8">
            <Formik
              enableReinitialize
              innerRef={formikRef}
              initialValues={getProfileInitialValues(client)}
              validationSchema={ProfileValidationSchema}
              onSubmit={onSubmit}
            >
              {({ isSubmitting }) => (
                <Form noValidate>
                  <div className="flex items-start gap-3 border-b border-slate-100 pb-5 dark:border-slate-800">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                      <UserRound size={20} />
                    </span>
                    <div>
                      <h2 className="text-lg font-semibold text-slate-950 dark:text-white">
                        Personal information
                      </h2>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        Keep your name and contact details up to date.
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-x-4 sm:grid-cols-2">
                    <AppInput
                      is_required
                      disabled={!isEditMode}
                      icon={<UserRound className="text-slate-400" size={17} />}
                      label="First Name"
                      name="firstName"
                      placeholder="Enter your first name"
                      type="text"
                    />

                    <AppInput
                      is_required
                      disabled={!isEditMode}
                      icon={<UserRound className="text-slate-400" size={17} />}
                      label="Last Name"
                      name="lastName"
                      placeholder="Enter your last name"
                      type="text"
                    />

                    <div className="sm:col-span-2">
                      <AppInput
                        is_required
                        disabled
                        icon={<Mail className="text-slate-400" size={17} />}
                        label="Email"
                        name="email"
                        type="email"
                      />
                      {isEditMode && (
                        <p className="-mt-2 ml-2 text-xs text-slate-400">
                          Your verified email cannot be changed from this page.
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-8 border-t border-slate-100 pt-6 dark:border-slate-800">
                    <div className="flex items-start gap-3">
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
                        <KeyRound size={20} />
                      </span>
                      <div>
                        <h2 className="text-lg font-semibold text-slate-950 dark:text-white">
                          Password
                        </h2>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                          {isEditMode
                            ? "Leave both password fields empty to keep your current password."
                            : "Your password is securely protected."}
                        </p>
                      </div>
                    </div>

                    {isEditMode && (
                      <div className="mt-6 grid gap-x-4 sm:grid-cols-2">
                        <AppInput
                          label="Current Password"
                          name="oldPassword"
                          placeholder="Enter current password"
                          showPasswordRequirements={false}
                          type="password"
                        />

                        <AppInput
                          label="New Password"
                          name="newPassword"
                          placeholder="Enter new password"
                          showPasswordRequirements={false}
                          type="password"
                        />
                        <p className="text-xs leading-5 text-slate-400 sm:col-span-2">
                          Use 8–50 characters with uppercase, lowercase, a number,
                          and a special character.
                        </p>
                      </div>
                    )}
                  </div>

                  {isEditMode && (
                    <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 dark:border-slate-800 sm:flex-row sm:justify-end">
                      <Button
                        className="!flex !h-11 !items-center !justify-center !rounded-xl !border-slate-200 !px-5 !font-medium dark:!border-slate-700 dark:!text-slate-200"
                        disabled={isSubmitting || updateLoading}
                        icon={<X size={17} />}
                        onClick={cancelEdit}
                      >
                        Cancel
                      </Button>
                      <Button
                        className="!flex !h-11 !items-center !justify-center !rounded-xl !border-emerald-600 !bg-emerald-600 !px-6 !font-semibold !text-white hover:!border-emerald-700 hover:!bg-emerald-700"
                        htmlType="submit"
                        icon={<Save size={17} />}
                        loading={isSubmitting || updateLoading}
                        type="primary"
                      >
                        Save changes
                      </Button>
                    </div>
                  )}
                </Form>
              )}
            </Formik>
          </section>
        </div>
      </div>
    </main>
  );
};

export default Profile;
