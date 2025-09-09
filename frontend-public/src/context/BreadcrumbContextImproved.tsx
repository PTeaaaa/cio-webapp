'use client';

import React, { useState, ReactNode, useCallback } from 'react';
import { createContext, useContext } from 'react';
import { BreadcrumbItem } from '@/types';

export interface BreadcrumbContextType {
    breadcrumbs: BreadcrumbItem[];
    setBreadcrumbs: (items: BreadcrumbItem[]) => void;
    addBreadcrumb: (item: BreadcrumbItem) => void;
    removeBreadcrumb: (index: number) => void;
    clearBreadcrumbs: () => void;
}

export const BreadcrumbContext = createContext<BreadcrumbContextType | undefined>(undefined);

export const useBreadcrumb = () => {
    const context = useContext(BreadcrumbContext);
    if (context === undefined) {
        throw new Error('useBreadcrumbContext must be used within a BreadcrumbProvider');
    }
    return context;
}

export function BreadcrumbProvider({ children }: { children: ReactNode }) {
    const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([]);

    // Helper methods for more flexible breadcrumb management
    const addBreadcrumb = useCallback((item: BreadcrumbItem) => {
        setBreadcrumbs(prev => [...prev, item]);
    }, []);

    const removeBreadcrumb = useCallback((index: number) => {
        setBreadcrumbs(prev => prev.filter((_, i) => i !== index));
    }, []);

    const clearBreadcrumbs = useCallback(() => {
        setBreadcrumbs([]);
    }, []);

    const contextValue: BreadcrumbContextType = {
        breadcrumbs,
        setBreadcrumbs,
        addBreadcrumb,
        removeBreadcrumb,
        clearBreadcrumbs,
    };

    return (
        <BreadcrumbContext.Provider value={contextValue}>
            {children}
        </BreadcrumbContext.Provider>
    );
}
