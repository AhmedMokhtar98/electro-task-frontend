import axios from "axios";
import { showToast } from "../../components/Toast/Toast";
import { encryptPassword } from "@/utils/helpers";
import { store } from "@/redux/store";
import { logout } from "@/redux/slices/authDataSlice";

const baseURL = import.meta.env.VITE_REACT_APP_API_URL;
const xAppToken = import.meta.env.VITE_X_APP_TOKEN_SECRET;

const Axios = axios.create({
  baseURL,
  headers: {
    "x-app-token": xAppToken,
  },
});

// Separate instance to prevent refresh requests from passing
// through the main Axios interceptors.
const refreshClient = axios.create({
  baseURL,
  headers: {
    "x-app-token": xAppToken,
  },
});

const AUTH_ENDPOINTS = [
  "/auth/login",
  "/auth/register",
  "/login",
  "/register",
  "/refresh-token",
  "/forgot-password",
  "/forget-password",
  "/reset-password",
];

const isAuthEndpoint = (url = "") => {
  const normalizedUrl = String(url)
    .split("?")[0]
    .replace(/\/$/, "");

  return AUTH_ENDPOINTS.some(
    (endpoint) =>
      normalizedUrl === endpoint ||
      normalizedUrl.endsWith(endpoint),
  );
};

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });

  failedQueue = [];
};

const redirectToLogin = () => {
  if (window.location.pathname !== "/login") {
    window.location.replace("/login");
  }
};

const clearSession = () => {
  store.dispatch(logout());

  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");

  delete Axios.defaults.headers.common.Authorization;
};

const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken");

  if (!refreshToken) {
    throw new Error("No refresh token found");
  }

  const response = await refreshClient.post(
    "refresh-token",
    {
      refreshToken,
    },
  );

  const newAccessToken =
    response.data?.token?.accessToken ||
    response.data?.token;

  const newRefreshToken =
    response.data?.token?.refreshToken ||
    response.data?.refreshToken;

  if (!newAccessToken) {
    throw new Error(
      "No access token in refresh response",
    );
  }

  localStorage.setItem("token", newAccessToken);

  if (newRefreshToken) {
    localStorage.setItem(
      "refreshToken",
      newRefreshToken,
    );
  }

  Axios.defaults.headers.common.Authorization =
    `Bearer ${newAccessToken}`;

  return newAccessToken;
};

const encryptPasswordFields = (config) => {
  if (
    !config.data ||
    config.data instanceof FormData ||
    config._passwordsEncrypted
  ) {
    return config;
  }

  const passwordFields = [
    "password",
    "confirmPassword",
    "newPassword",
    "oldPassword",
  ];

  const encryptedData = {
    ...config.data,
  };

  passwordFields.forEach((field) => {
    const fieldValue = encryptedData[field];

    if (
      typeof fieldValue === "string" &&
      fieldValue.length > 0
    ) {
      encryptedData[field] =
        encryptPassword(fieldValue);
    }
  });

  config.data = encryptedData;
  config._passwordsEncrypted = true;

  return config;
};

// Request interceptor
Axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token && !isAuthEndpoint(config.url)) {
      config.headers.Authorization =
        `Bearer ${token}`;
    } else {
      delete config.headers.Authorization;
    }

    config.headers["x-app-token"] = xAppToken;

    encryptPasswordFields(config);

    // Remove pagination parameters from non-list requests.
    if (
      !isAuthEndpoint(config.url) &&
      !config.url?.includes("/list")
    ) {
      const updatedParams = {
        ...config.params,
      };

      delete updatedParams.page;
      delete updatedParams.limit;
      delete updatedParams.pageNo;

      config.params = updatedParams;
    }

    /*
     * Do not manually set multipart/form-data.
     * The browser needs to add the correct boundary.
     */
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor
Axios.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    if (error.code === "ERR_NETWORK") {
      showToast({
        text: "Network Error",
        status: false,
      });

      return Promise.reject(error);
    }

    /*
     * Login, register and refresh-token errors must
     * return directly to the form.
     *
     * Never attempt token refresh for these endpoints.
     */
    if (
      !originalRequest ||
      isAuthEndpoint(originalRequest.url)
    ) {
      return Promise.reject(error);
    }

    const isUnauthorized =
      status === 401 || status === 403;

    if (
      !isUnauthorized ||
      originalRequest._retry
    ) {
      return Promise.reject(error);
    }

    const storedRefreshToken =
      localStorage.getItem("refreshToken");

    /*
     * This is a protected request, but the user has
     * no refresh token. Clear the session and redirect.
     */
    if (!storedRefreshToken) {
      clearSession();
      redirectToLogin();

      return Promise.reject(error);
    }

    /*
     * A refresh request is already running.
     * Queue this request until the refresh finishes.
     */
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve,
          reject,
        });
      })
        .then((newToken) => {
          originalRequest.headers.Authorization =
            `Bearer ${newToken}`;

          return Axios(originalRequest);
        })
        .catch((queueError) =>
          Promise.reject(queueError),
        );
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const newAccessToken =
        await refreshAccessToken();

      processQueue(null, newAccessToken);

      originalRequest.headers.Authorization =
        `Bearer ${newAccessToken}`;

      return Axios(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError);

      clearSession();
      redirectToLogin();

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export default Axios;