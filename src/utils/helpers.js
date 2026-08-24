import { jwtDecode } from "jwt-decode";
import CryptoJS from "crypto-js";

export const asyncOperation = (loading, status) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!loading) {
        if (status) { resolve("Success message"); }
        else { reject("Error message"); }
      }
    }, 1000);
  });
};


/*------------------------------------- Filtering text handled in input Field -----------------------------------------------*/

// Helper function to remove all whitespace characters from a string.
export const stringSpacingValidation = (originalValue) => {
  if (typeof originalValue === "string") {
    return originalValue.replace(/\s/g, "");
  }
  return originalValue;
};

// Helper function to normalize spaces and filter out unwanted characters.
export const normalizeString = (value) => {
  if (typeof value === "string") {
    return value
      .trim()
      // Replace disallowed characters (i.e., characters not in the allowed regex)
      .replace(/[^a-zA-Z0-9\s.,()@_\-!?$%[\]{}\/+'"]/g, ' ')
      .replace(/ـ/g, " ") // Specific replacement for Arabic Tatweel character
      .replace(/\s+/g, " "); // Replaces multiple spaces with a single space
  }
  return value;
};


// Function to normalize spaces in various data types.
export const normalizeSpacesWithFilter = (value) => {
  if (typeof value === "string") {
    return normalizeString(value);
  } else if (Array.isArray(value)) {
    return value.map((item) => normalizeString(item));
  } else if (typeof value === "object" && value !== null) {
    const normalizedObject = {};
    for (const [key, nestedValue] of Object.entries(value)) {
      normalizedObject[key] = normalizeString(nestedValue);
    }
    return normalizedObject;
  } else {
    return value; // Return unchanged for non-string, non-array, non-object values
  }
};

// Function to trim spaces from all string values within an object.

export const trimSpacesFromObjectValues = (obj) => {
  const stringSpacingValidation = (value) => {
    if (typeof value === "string") {
      return value.trim().replace(/\s+/g, " ");
    }
    return value;
  };

  const recursiveTrim = (obj) => {
    if (typeof obj === "object" && obj !== null) {
      if (Array.isArray(obj)) {
        return obj.map((item) => recursiveTrim(item));
      } else {
        const trimmedObject = {};
        for (const [key, value] of Object.entries(obj)) {
          trimmedObject[key] = recursiveTrim(value);
        }
        return trimmedObject;
      }
    }
    return stringSpacingValidation(obj);
  };

  return recursiveTrim(obj);
};


// ==delete any key in object has a undefined value==
export const paramsValidate = (params) => {
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value === undefined || value === "" || value === "undefined") {
        delete params[key];
      }
    }
  }
  return params;
};

/*------------------------------------- updateStatus of isActive isVerified , etc ( ON Click) -----------------------------------------------*/
export const noEmptySpaces = (value) => {
  if (typeof value === "string") {
    return value.trim().length > 0;
  }
  return true;
};

export function formatDate(dateString) {
  if (!dateString) return "N/A";

  const date = new Date(dateString);

  if (isNaN(date.getTime())) return "N/A";

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// Helper function to format date for input fields
export const formatDateForInput = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";
  return date.toISOString().split("T")[0];
};


export function encryptPassword(password) {
  const SECRET_KEY_ENCRYPTION = import.meta.env.VITE_SECRET_KEY_ENCRYPTION;
  return CryptoJS.AES.encrypt(password, SECRET_KEY_ENCRYPTION).toString();
}



// Helper function to safely decode JWT
export const getDecodedToken = () => {
  try {
    const token = localStorage.getItem('token');
    if (token) return jwtDecode(token);
  } catch (e) {
    console.error("Invalid token in localStorage:", e);
    localStorage.removeItem('token'); // Clean up bad token
  }
  return {}; // Fallback if decode fails
};

// Helper function to get boolean auth state
export const isTokenValid = () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return false;

    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decoded?.exp && decoded.exp > currentTime;
  } catch (e) {
    console.error("Error validating token:", e);
    return false;
  }
};