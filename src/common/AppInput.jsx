import { useEffect, useRef, useState } from "react";
import { Checkbox, Input, Select } from "antd";
import TextArea from "antd/es/input/TextArea";
import { Field, getIn, useFormikContext } from "formik";
import { AiOutlineEye, AiOutlineEyeInvisible, } from "react-icons/ai";
import { useLocation } from "react-router-dom";

const AppInput = ({
  name,
  label,
  type,
  placeholder,
  disabled,
  hideLabel,
  hideError,
  is_required,
  icon,
  options,
  showPasswordRequirements = true,
  ...props
}) => {
  const location = useLocation();

  const {
    setFieldValue,
    setFieldTouched,
    validateField,
    values,
    errors,
    touched,
  } = useFormikContext();

  const pickerRef = useRef(null);

  const [isPickerVisible, setIsPickerVisible] =
    useState(false);

  const [showPassword, setShowPassword] =
    useState(false);

  const [
    shouldShowPasswordValidation,
    setShouldShowPasswordValidation,
  ] = useState(false);

  const isLoginPage = location.pathname === "/login";
  const isProfilePage =
    location.pathname === "/profile";

  const getNestedValue = (object, path) => {
    const keys = path.split(".");

    return keys.reduce(
      (currentValue, key) =>
        currentValue?.[key] !== undefined
          ? currentValue[key]
          : undefined,
      object,
    );
  };

  const checkPasswordRequirements = (
    password = "",
  ) => ({
    minLength: password.length >= 8,
    maxLength: password.length <= 50,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecialChar:
      /[!@#$%^&*(),.?":{}|<>_\-+=]/.test(password),
    noSpaces:
      password.length > 0 &&
      password.trim() === password &&
      !/\s/.test(password),
  });

  useEffect(() => {
    if (
      type === "password" &&
      !isLoginPage &&
      !isProfilePage
    ) {
      setShouldShowPasswordValidation(true);
    }
  }, [type, isLoginPage, isProfilePage]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target)
      ) {
        setIsPickerVisible(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside,
      );
    };
  }, []);

  const handleInputClick = (event) => {
    props.onClick?.(event);

    if (type === "color") {
      setIsPickerVisible((current) => !current);
    }

    if (type === "date" && !disabled) {
      const dateInput = event.target.closest?.(
        'input[type="date"]',
      );

      dateInput?.focus();

      if (typeof dateInput?.showPicker === "function") {
        dateInput.showPicker();
      }
    }
  };

  const handleFocus = async () => {
    if (type !== "password") return;

    setShouldShowPasswordValidation(true);
    setFieldTouched(name, true, false);

    await validateField(name);
  };

  const handleBlur = () => {
    setFieldTouched(name, true, true);
  };

  const handlePasswordChange = (event) => {
    const value = event.target.value;

    setFieldValue(name, value);

    if (shouldShowPasswordValidation) {
      setTimeout(() => {
        validateField(name);
      }, 0);
    }
  };

  const fieldValue =
    getNestedValue(values, name) ||
    (type === "color" ? "#000000" : "");

  const checkType = [
    "text",
    "number",
    "email",
    "password",
    "color",
    "date",
  ].includes(type);

  const fieldError = getIn(errors, name);
  const fieldTouched = getIn(touched, name);

  const shouldShowError = () => {
    if (type === "password" && isProfilePage) {
      return fieldTouched && fieldError;
    }

    if (type === "password") {
      return (
        shouldShowPasswordValidation && fieldError
      );
    }

    return fieldTouched && fieldError;
  };

  const renderPasswordRequirements = () => {
    if (
      type !== "password" ||
      !showPasswordRequirements ||
      isLoginPage ||
      isProfilePage
    ) {
      return null;
    }

    const hasPasswordText =
      String(fieldValue).length > 0;

    const requirements =
      checkPasswordRequirements(fieldValue);

    const requirementsList = [
      {
        key: "length",
        text: "Your password must contain between 8 and 50 characters",
        check:
          requirements.minLength &&
          requirements.maxLength,
      },
      {
        key: "uppercase",
        text: "Your password must have at least 1 uppercase letter",
        check: requirements.hasUppercase,
      },
      {
        key: "lowercase",
        text: "Your password must have at least 1 lowercase letter",
        check: requirements.hasLowercase,
      },
      {
        key: "number",
        text: "Your password must have at least 1 number",
        check: requirements.hasNumber,
      },
      {
        key: "special-character",
        text: "Your password must have at least 1 special character",
        check: requirements.hasSpecialChar,
      },
      {
        key: "spaces",
        text: "Your password cannot contain spaces",
        check: requirements.noSpaces,
      },
    ];

    return (
      <div
        aria-hidden={!hasPasswordText}
        className={`grid overflow-hidden transition-all duration-300 ease-in-out ${
          hasPasswordText
            ? "mt-3 grid-rows-[1fr] opacity-100"
            : "pointer-events-none mt-0 grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="flex flex-col gap-2">
            {requirementsList.map(
              (requirement) => (
                <div
                  key={requirement.key}
                  className={`flex items-center gap-2 text-sm font-normal transition-colors duration-200 ${
                    requirement.check
                      ? "text-green-500"
                      : "text-slate-400 dark:text-slate-500"
                  }`}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="shrink-0"
                    aria-hidden="true"
                  >
                    <path
                      d="M20 6L9 17L4 12"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>

                  <span>
                    {requirement.text}
                  </span>
                </div>
              ),
            )}
          </div>
        </div>
      </div>
    );
  };

  const inputWrapperClass =
    type === "checkbox"
      ? "relative mb-4 flex w-auto"
      : "relative mb-4 block w-full";

  return (
    <div className={inputWrapperClass}>
      {!hideLabel && (
        <label
          htmlFor={name}
          className="mb-2 ml-2 block text-sm font-medium text-slate-900 dark:text-slate-100"
        >
          {label}

          {is_required && (
            <span className="ml-1 text-red-500">
              *
            </span>
          )}
        </label>
      )}

      {type === "select" ? (
        <Select
          id={name}
          options={options}
          value={fieldValue || undefined}
          onChange={(value) => {
            setFieldValue(name, value);
            setFieldTouched(name, true, false);
          }}
          onBlur={handleBlur}
          placeholder={
            placeholder ||
            `${"Select"} ${label}`
          }
          size="large"
          disabled={disabled}
          className="app-input-select h-[52px] w-full placeholder:text-xs disabled:opacity-60 sm:h-auto max-sm:[&_.ant-select-selector]:!h-[52px] max-sm:[&_.ant-select-selection-wrap]:!h-[50px] max-sm:[&_.ant-select-selection-item]:!leading-[50px]"
        />
      ) :  type === "password" ? (
        <>
          <Input
            id={name}
            name={name}
            type={
              showPassword
                ? "text"
                : "password"
            }
            value={fieldValue}
            onChange={handlePasswordChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={
              placeholder ||
              `${"Enter Your"} ${label}`
            }
            size="large"
            prefix={icon}
            suffix={
              <button
                type="button"
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
                onClick={() => {
                  setShowPassword(
                    (current) => !current,
                  );
                }}
                className="flex cursor-pointer items-center border-0 bg-transparent p-0 text-slate-400"
              >
                {showPassword ? (
                  <AiOutlineEyeInvisible
                    size={18}
                  />
                ) : (
                  <AiOutlineEye size={18} />
                )}
              </button>
            }
            disabled={disabled}
            className="mt-2 rounded-xl !border-slate-300 placeholder:text-xs focus:!border-emerald-500 focus:!shadow-[0_0_0_2px_rgba(16,185,129,0.12)] disabled:text-[var(--text-primary-color)] disabled:opacity-60 dark:!border-slate-700 max-sm:!min-h-[52px]"
            autoComplete="new-password"
            spellCheck={false}
          />

          {!hideError && shouldShowError() && (
            <div className="ml-2 mt-1.5 text-sm font-normal text-red-500">
              {fieldError}
            </div>
          )}

          {renderPasswordRequirements()}
        </>
      ) : (
        <Field
          {...props}
          id={name}
          as={
            checkType
              ? Input
              : type === "textArea"
                ? TextArea
                : Checkbox
          }
          name={name}
          type={type || "text"}
          placeholder={
            placeholder ||
            `${"Enter Your"} ${label}`
          }
          size="large"
          prefix={icon}
          disabled={disabled}
          className="mt-2 rounded-xl !border-slate-300 placeholder:text-xs focus:!border-emerald-500 focus:!shadow-[0_0_0_2px_rgba(16,185,129,0.12)] disabled:text-[var(--text-primary-color)] disabled:opacity-60 dark:!border-slate-700 max-sm:!min-h-[52px]"
          autoComplete="off"
          spellCheck={false}
          onClick={handleInputClick}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      )}

      {type !== "password" &&
        !hideError &&
        shouldShowError() && (
          <div className="ml-2 mt-1.5 text-sm font-normal text-red-500">
            {fieldError}
          </div>
        )}
    </div>
  );
};

export default AppInput;
