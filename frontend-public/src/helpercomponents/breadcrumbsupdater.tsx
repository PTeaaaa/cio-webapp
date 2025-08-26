'use client';

import { useEffect } from 'react';
import { useBreadcrumb } from '@/context/BreadcrumbContext';
import { BreadcrumbItem } from '@/types';

interface BreadcrumbUpdaterProps {
    breadcrumbItems: BreadcrumbItem[];
}

export default function BreadcrumbUpdater({ breadcrumbItems }: BreadcrumbUpdaterProps) {
    const { setBreadcrumbs } = useBreadcrumb();

    useEffect(() => {
        setBreadcrumbs(breadcrumbItems);
    }, [breadcrumbItems, setBreadcrumbs]);

    return null;
}
