"use client";

import {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    useMemo,
    ReactNode,
} from "react";
import { Language, translations, TranslationKeys } from "@/data/translations";

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    toggleLanguage: () => void;
    t: TranslationKeys;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = "ptn_lang";
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

const isValidLanguage = (value: unknown): value is Language =>
    value === "vi" || value === "en";

const readCookie = (name: string): string | null => {
    if (typeof document === "undefined") return null;
    const match = document.cookie.match(
        new RegExp("(?:^|; )" + name.replace(/([.$?*|{}()[\]\\/+^])/g, "\\$1") + "=([^;]*)")
    );
    return match ? decodeURIComponent(match[1]) : null;
};

const writeCookie = (name: string, value: string) => {
    if (typeof document === "undefined") return;
    const secure = typeof location !== "undefined" && location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${COOKIE_MAX_AGE_SECONDS}; SameSite=Lax${secure}`;
};

export const LanguageProvider = ({
    children,
    initialLanguage = "vi",
}: {
    children: ReactNode;
    initialLanguage?: Language;
}) => {
    const [language, setLanguageState] = useState<Language>(initialLanguage);

    // Reconcile with client-side storage on mount. Covers the case where the
    // server had no cookie but the user already has a preference in localStorage
    // (e.g. set before we added cookie persistence).
    useEffect(() => {
        const cookieLang = readCookie(STORAGE_KEY);
        if (isValidLanguage(cookieLang)) {
            if (cookieLang !== language) setLanguageState(cookieLang);
            return;
        }
        const stored = localStorage.getItem(STORAGE_KEY);
        if (isValidLanguage(stored)) {
            if (stored !== language) setLanguageState(stored);
            writeCookie(STORAGE_KEY, stored);
        }
        // Intentionally run once — subsequent changes go through setLanguage.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Keep <html lang> in sync with current language for SEO and a11y.
    useEffect(() => {
        if (typeof document !== "undefined") {
            document.documentElement.lang = language;
        }
    }, [language]);

    // Cross-tab sync: another tab changed the language → update this one.
    useEffect(() => {
        const onStorage = (e: StorageEvent) => {
            if (e.key === STORAGE_KEY && isValidLanguage(e.newValue)) {
                setLanguageState(e.newValue);
            }
        };
        window.addEventListener("storage", onStorage);
        return () => window.removeEventListener("storage", onStorage);
    }, []);

    const setLanguage = useCallback((lang: Language) => {
        setLanguageState((prev) => (prev === lang ? prev : lang));
        writeCookie(STORAGE_KEY, lang);
        try {
            localStorage.setItem(STORAGE_KEY, lang);
        } catch {
            // localStorage can throw in private mode / when disabled — cookie is enough.
        }
    }, []);

    const toggleLanguage = useCallback(() => {
        setLanguage(language === "vi" ? "en" : "vi");
    }, [language, setLanguage]);

    const value = useMemo<LanguageContextType>(
        () => ({ language, setLanguage, toggleLanguage, t: translations[language] }),
        [language, setLanguage, toggleLanguage]
    );

    return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
};
