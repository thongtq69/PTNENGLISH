"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { DEFAULT_FONT_SIZES } from '@/components/admin/FontSizeManager';

export interface FontSizeValue {
    desktop: number;
    mobile: number;
}

/**
 * useFontSizeEditor — Hook dùng trong admin editors.
 * Load font sizes từ API, cho phép chỉnh từng field, auto-save khi thay đổi.
 * 
 * @param section - Key của section (e.g. "home", "aboutUs", "courses")
 */
export function useFontSizeEditor(section: string) {
    const [allFontSizes, setAllFontSizes] = useState<Record<string, Record<string, FontSizeValue>>>({});
    const [loaded, setLoaded] = useState(false);
    const [saving, setSaving] = useState(false);
    const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Load from API on mount
    useEffect(() => {
        fetch('/api/font-sizes', { cache: 'no-store' })
            .then(res => res.json())
            .then(data => {
                if (data && typeof data === 'object') {
                    setAllFontSizes(data);
                }
                setLoaded(true);
            })
            .catch(() => setLoaded(true));
    }, []);

    // Get font size value for a field (with defaults fallback)
    const getFontSize = useCallback((field: string): FontSizeValue => {
        const saved = allFontSizes[section]?.[field];
        const defaults = DEFAULT_FONT_SIZES[section]?.[field];
        return saved || defaults || { desktop: 16, mobile: 14 };
    }, [allFontSizes, section]);

    // Get default for a field
    const getDefault = useCallback((field: string): FontSizeValue => {
        return DEFAULT_FONT_SIZES[section]?.[field] || { desktop: 16, mobile: 14 };
    }, [section]);

    // Update a font size value (auto-save after debounce)
    const setFontSize = useCallback((field: string, value: FontSizeValue) => {
        setAllFontSizes(prev => {
            const newData = {
                ...prev,
                [section]: {
                    ...(prev[section] || {}),
                    [field]: value,
                }
            };

            // Debounced auto-save
            if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
            saveTimeoutRef.current = setTimeout(() => {
                setSaving(true);
                fetch('/api/font-sizes', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newData),
                })
                    .then(() => setSaving(false))
                    .catch(() => setSaving(false));
            }, 800);

            return newData;
        });
    }, [section]);

    // Cleanup
    useEffect(() => {
        return () => {
            if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
        };
    }, []);

    return {
        getFontSize,
        setFontSize,
        getDefault,
        loaded,
        saving,
    };
}
