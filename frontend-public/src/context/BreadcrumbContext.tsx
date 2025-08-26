'use client';

import React, { useState, ReactNode } from 'react';
import { createContext, useContext } from 'react';
import { BreadcrumbItem } from '@/types';

export interface BreadcrumbContextType {
    breadcrumbs: BreadcrumbItem[];
    setBreadcrumbs: (items: BreadcrumbItem[]) => void;
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
    // ใช้ useState เพื่อจัดการสถานะของ Breadcrumb Item
    // ค่าเริ่มต้นคืออาร์เรย์ว่างเปล่า
    const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([]);

    // สร้าง Object ที่จะถูกส่งผ่าน Context
    const contextValue: BreadcrumbContextType = {
        breadcrumbs,
        setBreadcrumbs,
    };

    return (
        // ให้ค่า contextValue แก่ BreadcrumbContext.Provider
        // ทำให้ Component ลูกทั้งหมดที่อยู่ภายใต้ Provider นี้สามารถเข้าถึงค่านี้ได้
        <BreadcrumbContext.Provider value={contextValue}>
            {children}
        </BreadcrumbContext.Provider>
    );
}
