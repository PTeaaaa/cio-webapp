
"use client";

import { useRouter } from "next/navigation";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "";

// Types for the navigation function
export interface FilterSearchState {
    selectedOrg?: string;      // Department/Organization type
    selectedAgency?: string;   // Place UUID (Agency)
    selectedYear?: string;     // Person UUID (Year/Person data)
}

export interface NavigationOptions {
    replace?: boolean;         // Use router.replace instead of push
    openInNewTab?: boolean;   // Open in new tab instead of current window
    baseUrl?: string;         // Override base URL
}

/**
 * Builds the URL path based on available selections from the chained comboboxes
 * Follows the pattern: /{Department}/{placeUUID}/{personUUID}
 * Only includes segments that have values
 */
export const buildNavigationPath = (state: FilterSearchState): string => {
    const { selectedOrg, selectedAgency, selectedYear } = state;
    
    // Normalize and filter out empty values
    const segments: string[] = [];
    
    if (selectedOrg && selectedOrg.trim()) {
        segments.push(encodeURIComponent(selectedOrg.trim()));
    }
    
    if (selectedAgency && selectedAgency.trim()) {
        segments.push(encodeURIComponent(selectedAgency.trim()));
    }
    
    if (selectedYear && selectedYear.trim()) {
        segments.push(encodeURIComponent(selectedYear.trim()));
    }
    
    // Return root if no segments, otherwise join with slashes
    return segments.length === 0 ? "/" : `/${segments.join("/")}`;
};

/**
 * Builds the complete URL with base URL
 */
export const buildNavigationUrl = (
    state: FilterSearchState, 
    baseUrl?: string
): string => {
    const path = buildNavigationPath(state);
    const finalBaseUrl = baseUrl || BASE_URL || (typeof window !== "undefined" ? window.location.origin : "");
    
    if (!finalBaseUrl) {
        return path;
    }
    
    const normalizedBase = finalBaseUrl.replace(/\/+$/, "");
    return `${normalizedBase}${path}`;
};

/**
 * Navigation function compatible with FilterSearch component
 * Handles the chained combobox logic and navigates based on available selections
 */
export default function searchNavigationClaude(
    state: FilterSearchState,
    options: NavigationOptions = {}
): string {
    const { replace = false, openInNewTab = false, baseUrl } = options;
    
    // Build the path and URL
    const path = buildNavigationPath(state);
    const fullUrl = buildNavigationUrl(state, baseUrl);
    
    // Handle navigation
    if (typeof window !== "undefined") {
        if (openInNewTab) {
            window.open(fullUrl, "_blank", "noopener,noreferrer");
        } else {
            // Use Next.js router for client-side navigation
            const router = useRouter();
            if (replace) {
                router.replace(path);
            } else {
                router.push(path);
            }
        }
    }
    
    return path;
}

/**
 * Hook version for use within React components
 * Returns a navigation function that can be called with the current filter state
 */
export const useSearchNavigation = () => {
    const router = useRouter();
    
    return (state: FilterSearchState, options: NavigationOptions = {}) => {
        const { replace = false, openInNewTab = false, baseUrl } = options;
        const path = buildNavigationPath(state);
        const fullUrl = buildNavigationUrl(state, baseUrl);
        
        if (openInNewTab) {
            window.open(fullUrl, "_blank", "noopener,noreferrer");
        } else {
            if (replace) {
                router.replace(path);
            } else {
                router.push(path);
            }
        }
        
        return path;
    };
};

/**
 * Utility function to check if navigation is possible based on current state
 * Returns true if at least one selection is made
 */
export const canNavigate = (state: FilterSearchState): boolean => {
    return !!(state.selectedOrg?.trim() || state.selectedAgency?.trim() || state.selectedYear?.trim());
};

/**
 * Get navigation readiness info for UI feedback
 */
export const getNavigationInfo = (state: FilterSearchState) => {
    const { selectedOrg, selectedAgency, selectedYear } = state;
    
    const hasOrg = !!(selectedOrg?.trim());
    const hasAgency = !!(selectedAgency?.trim());
    const hasYear = !!(selectedYear?.trim());
    
    let level = 0;
    let description = "No selection made";
    
    if (hasOrg) {
        level = 1;
        description = "Organization selected - can navigate to department";
    }
    
    if (hasAgency) {
        level = 2;
        description = "Agency selected - can navigate to specific place";
    }
    
    if (hasYear) {
        level = 3;
        description = "Year selected - can navigate to specific person/data";
    }
    
    return {
        level,
        description,
        canNavigate: level > 0,
        path: buildNavigationPath(state)
    };
};

