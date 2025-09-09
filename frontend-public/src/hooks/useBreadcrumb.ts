'use client';

import { useEffect } from 'react';
import { useBreadcrumb as useBreadcrumbContext } from '@/context/BreadcrumbContext';
import { BreadcrumbItem } from '@/types';

/**
 * Custom hook for managing breadcrumbs
 * Automatically updates breadcrumbs when component mounts and cleans up when unmounts
 */
export function useBreadcrumb(breadcrumbItems: BreadcrumbItem[]) {
    const { setBreadcrumbs } = useBreadcrumbContext();

    useEffect(() => {
        setBreadcrumbs(breadcrumbItems);
        
        // Optional: Clean up when component unmounts
        return () => {
            // You can choose to clear breadcrumbs or leave them
            // setBreadcrumbs([]);
        };
    }, [breadcrumbItems, setBreadcrumbs]);
}
