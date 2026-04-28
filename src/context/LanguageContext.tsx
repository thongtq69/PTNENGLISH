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
const SAME_TAB_EVENT = "ptn:lang-change";

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

    // Reconcile with client-side storage on mount. Cookie is the source of
    // truth (server can read it for SSR); localStorage is a backwards-compat
    // fallback that we promote to a cookie when found.
    useEffect(() => {
        const cookieLang = readCookie(STORAGE_KEY);
        if (isValidLanguage(cookieLang)) {
            setLanguageState((prev) => (prev === cookieLang ? prev : cookieLang));
            return;
        }
        let stored: string | null = null;
        try {
            stored = localStorage.getItem(STORAGE_KEY);
        } catch {
            // localStorage may throw in private mode — ignore.
        }
        if (isValidLanguage(stored)) {
            setLanguageState((prev) => (prev === stored ? prev : stored));
            writeCookie(STORAGE_KEY, stored);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Keep <html lang> in sync with current language for SEO and a11y.
    useEffect(() => {
        if (typeof document !== "undefined") {
            document.documentElement.lang = language;
        }
    }, [language]);

    // Cross-tab + same-tab sync. `storage` only fires in OTHER tabs, so we
    // also dispatch a custom event for any sibling providers in this tab.
    useEffect(() => {
        const onStorage = (e: StorageEvent) => {
            if (e.key === STORAGE_KEY && isValidLanguage(e.newValue)) {
                setLanguageState(e.newValue);
            }
        };
        const onSameTab = (e: Event) => {
            const detail = (e as CustomEvent<Language>).detail;
            if (isValidLanguage(detail)) setLanguageState(detail);
        };
        window.addEventListener("storage", onStorage);
        window.addEventListener(SAME_TAB_EVENT, onSameTab as EventListener);
        return () => {
            window.removeEventListener("storage", onStorage);
            window.removeEventListener(SAME_TAB_EVENT, onSameTab as EventListener);
        };
    }, []);

    const setLanguage = useCallback((lang: Language) => {
        if (!isValidLanguage(lang)) return;
        setLanguageState((prev) => {
            if (prev === lang) return prev;
            writeCookie(STORAGE_KEY, lang);
            try {
                localStorage.setItem(STORAGE_KEY, lang);
            } catch {
                // localStorage can throw in private mode — cookie is enough.
            }
            if (typeof window !== "undefined") {
                window.dispatchEvent(new CustomEvent(SAME_TAB_EVENT, { detail: lang }));
            }
            return lang;
        });
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
