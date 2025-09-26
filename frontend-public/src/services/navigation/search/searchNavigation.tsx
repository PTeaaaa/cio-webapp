
"use client";

type SegmentValue = string | null | undefined;

type RouterLike = {
    push: (href: string) => void;
    replace?: (href: string) => void;
};

export interface SearchNavigationInput {
    department?: SegmentValue;
    placeUUID?: SegmentValue;
    personUUID?: SegmentValue;
}

export interface SearchNavigationOptions extends SearchNavigationInput {
    baseUrl?: string;
    router?: RouterLike;
    replace?: boolean;
    openInNewTab?: boolean;
}

const envBase = process.env.NEXT_PUBLIC_BASE_URL;

/**
 * Normalises a single URL segment, stripping surrounding slashes and encoding it.
 */
const normalizeSegment = (value: SegmentValue): string | null => {

    const trimmed = typeof value === "string" ? value.trim() : "";

    if (!trimmed) {
        return null;
    }

    const withoutSlashes = trimmed.replace(/^\/+|\/+$/g, "");
    if (!withoutSlashes) {
        return null;
    }

    return encodeURIComponent(withoutSlashes);
};

/**
 * Builds a relative path (`/{department}/{placeUUID}/{personUUID}`) using only the
 * segments that are present.
 */
export const buildSearchPath = ({
    department,
    placeUUID,
    personUUID,
}: SearchNavigationInput): string => {
    const segments = [department, placeUUID, personUUID]
        .map(normalizeSegment)
        .filter((segment): segment is string => Boolean(segment));

    if (segments.length === 0) {
        return "/";
    }

    return `/${segments.join("/")}`;
};

/**
 * Builds an absolute URL using the configured base URL (falling back to the browser origin when available).
 */
export const buildSearchUrl = (
    input: SearchNavigationInput,
    explicitBaseUrl?: string,
): string => {
    const path = buildSearchPath(input);

    const runtimeBase =
        explicitBaseUrl ??
        envBase ??
        (typeof window !== "undefined" ? window.location.origin : "");

    if (!runtimeBase) {
        return path;
    }

    const normalisedBase = runtimeBase.replace(/\/+$/, "");
    return `${normalisedBase}${path}`;
};

export default function searchNavigation(options: SearchNavigationOptions): string {

    const { router, replace, openInNewTab, baseUrl, ...input } = options;
    const path = buildSearchPath(input);
    const url = buildSearchUrl(input, baseUrl);

    if (router) {
        if (replace && typeof router.replace === "function") {
            router.replace(path); // เปลี่ยน URL แต่ไม่เพิ่มใน history
        } else {
            router.push(path); // เปลี่ยน URL และเพิ่มใน history (ปกติ)
        }
        return path;
    }

    if (typeof window !== "undefined") {
        if (openInNewTab) {
            window.open(url, "_blank", "noopener"); // เปิดหน้าในแท็บใหม่
        } else {
            window.location.href = url; // เปิดหน้าในแทบปัจจุบัน (refresh หน้า)
        }
    }

    return url;
}

