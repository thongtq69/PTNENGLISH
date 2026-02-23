"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';

interface FontSizeValue {
    desktop: number;
    mobile: number;
}

type FontSizeMap = Record<string, Record<string, FontSizeValue>>;

interface FontSizeContextType {
    fontSizes: FontSizeMap;
    getFontSize: (section: string, field: string) => FontSizeValue;
    loaded: boolean;
}

const FontSizeContext = createContext<FontSizeContextType>({
    fontSizes: {},
    getFontSize: () => ({ desktop: 16, mobile: 14 }),
    loaded: false,
});

export function useFontSize() {
    return useContext(FontSizeContext);
}

// Helper: generate CSS variable name from section + field
function cssVar(section: string, field: string) {
    return `--fs-${section}-${field}`;
}

export function FontSizeProvider({ children, initialFontSizes }: { children: React.ReactNode; initialFontSizes?: FontSizeMap }) {
    const [fontSizes, setFontSizes] = useState<FontSizeMap>(initialFontSizes || {});
    const [loaded, setLoaded] = useState(!!initialFontSizes);

    // Fetch from API if no initial data
    useEffect(() => {
        if (initialFontSizes && Object.keys(initialFontSizes).length > 0) {
            setFontSizes(initialFontSizes);
            setLoaded(true);
            return;
        }

        fetch('/api/font-sizes', { cache: 'no-store' })
            .then(res => res.json())
            .then(data => {
                if (data && Object.keys(data).length > 0) {
                    setFontSizes(data);
                }
                setLoaded(true);
            })
            .catch(() => setLoaded(true));
    }, [initialFontSizes]);

    // Inject CSS variables into <head> whenever fontSizes change
    useEffect(() => {
        if (!loaded || Object.keys(fontSizes).length === 0) return;

        let desktopStyles = '';
        let mobileStyles = '';

        for (const section of Object.keys(fontSizes)) {
            for (const field of Object.keys(fontSizes[section])) {
                const val = fontSizes[section][field];
                if (!val) continue;
                const varName = cssVar(section, field);
                desktopStyles += `${varName}: ${val.desktop}px;\n`;
                mobileStyles += `${varName}: ${val.mobile}px;\n`;
            }
        }

        const css = `
:root {
${desktopStyles}
}
@media (max-width: 767px) {
:root {
${mobileStyles}
}
}
`;

        // Remove old style element if exists
        const existingStyle = document.getElementById('ptn-font-sizes');
        if (existingStyle) existingStyle.remove();

        const style = document.createElement('style');
        style.id = 'ptn-font-sizes';
        style.textContent = css;
        document.head.appendChild(style);

        return () => {
            const el = document.getElementById('ptn-font-sizes');
            if (el) el.remove();
        };
    }, [fontSizes, loaded]);

    const getFontSize = (section: string, field: string): FontSizeValue => {
        return fontSizes[section]?.[field] || { desktop: 16, mobile: 14 };
    };

    return (
        <FontSizeContext.Provider value={{ fontSizes, getFontSize, loaded }}>
            {children}
        </FontSizeContext.Provider>
    );
}

// ============================================
// DynamicText component - renders text with custom font size from admin
// Usage: <DynamicText section="home" field="heroTitle" as="h1" className="...">Title</DynamicText>
// ============================================
interface DynamicTextProps {
    section: string;
    field: string;
    as?: React.ElementType;
    className?: string;
    children: React.ReactNode;
    style?: React.CSSProperties;
    dangerouslySetInnerHTML?: { __html: string };
    [key: string]: any;
}

export function DynamicText({
    section,
    field,
    as: Component = 'span',
    className = '',
    children,
    style,
    dangerouslySetInnerHTML,
    ...rest
}: DynamicTextProps) {
    const varName = cssVar(section, field);

    const mergedStyle: React.CSSProperties = {
        fontSize: `var(${varName})`,
        ...style,
    };

    if (dangerouslySetInnerHTML) {
        return (
            // @ts-ignore
            <Component
                className={className}
                style={mergedStyle}
                dangerouslySetInnerHTML={dangerouslySetInnerHTML}
                {...rest}
            />
        );
    }

    return (
        // @ts-ignore
        <Component className={className} style={mergedStyle} {...rest}>
            {children}
        </Component>
    );
}
