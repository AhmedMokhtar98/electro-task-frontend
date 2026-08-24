import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Ar from "./lang/ar.json";

// Initialize i18next
i18n
    .use(initReactI18next)
    .init({
        resources: {
            ar: { translation: Ar },
        },
        fallbackLng: "en",
        lng: localStorage.getItem('lang') || 'en', // Set language from localStorage or default to English
        debug: false,
        interpolation: { escapeValue: false }
    });

// Function to set language in localStorage
const setLanguageInLocalStorage = (lng) => {
    localStorage.setItem('lang', lng);
};

// Export i18n instance
export default i18n;

// Export function to set language in localStorage
export { setLanguageInLocalStorage };
