"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowDownWideNarrow } from "lucide-react";
import { cn } from "@/lib/utils";

interface SortOption {
    value: string;
    label: string;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
}

const sortOptionsPlace: SortOption[] = [
    { value: "default", label: "ค่าเริ่มต้น", sortBy: "numberOrder", sortOrder: "asc" },
    { value: "name-asc", label: "ชื่อ (ก - ฮ)", sortBy: "name", sortOrder: "asc" },
    { value: "name-desc", label: "ชื่อ (ฮ - ก)", sortBy: "name", sortOrder: "desc" },
];

const sortOptionsPeople: SortOption[] = [
    { value: "year-desc", label: "ปีงบประมาณ (มาก - น้อย)", sortBy: "year", sortOrder: "desc" },
    { value: "year-asc", label: "ปีงบประมาณ (น้อย - มาก)", sortBy: "year", sortOrder: "asc" },
    { value: "name-asc", label: "ชื่อ (ก - ฮ)", sortBy: "name", sortOrder: "asc" },
    { value: "name-desc", label: "ชื่อ (ฮ - ก)", sortBy: "name", sortOrder: "desc" },
];

interface SortByProps {
    type?: 'place' | 'people';
}

export default function SortBy({ type = 'place' }: SortByProps) {
    const [active, setActive] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const dropdownRef = useRef<HTMLDivElement>(null);

    const sortOptions = type === 'place' ? sortOptionsPlace : sortOptionsPeople;

    // Get current sort from URL
    const currentSortBy = searchParams.get('sortBy') || 'numberOrder';
    const currentSortOrder = searchParams.get('sortOrder') || 'asc';
    const currentValue = sortOptions.find(
        opt => opt.sortBy === currentSortBy && opt.sortOrder === currentSortOrder
    )?.value || 'default';

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setActive(false);
            }
        };

        if (active) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [active]);

    const handleSortChange = (option: SortOption) => {
        const params = new URLSearchParams(searchParams.toString());

        // Reset to page 1 when sorting changes
        params.set('page', '1');

        // Set sort parameters
        params.set('sortBy', option.sortBy);
        params.set('sortOrder', option.sortOrder);

        router.push(`?${params.toString()}`);
        setActive(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                className="size-10 border rounded-full bg-white shadow-md hover:shadow-lg transition-shadow"
                onClick={() => setActive((prev) => !prev)}
                aria-label="Sort options"
            >
                <div className="items-center justify-center p-2">
                    <ArrowDownWideNarrow
                        className={cn(
                            "text-gray-700 duration-300 ease-in-out transition-transform",
                            active ? "rotate-180 text-green-700" : "rotate-0"
                        )}
                    />
                </div>
            </button>

            <div className={cn(
                "absolute right-0 w-[210px] bg-white mt-2 p-2 border border-gray-200 rounded-lg shadow-lg z-10 transition-all duration-200",
                active ? "opacity-100 visible" : "opacity-0 invisible"
            )}>
                <div className="text-start text-sm font-semibold text-gray-700 px-2 py-1 mb-1">
                    เรียงตาม
                </div>
                {sortOptions.map((option) => (
                    <button
                        key={option.value}
                        onClick={() => handleSortChange(option)}
                        className={cn(
                            "w-full text-left px-3 py-2 rounded-md text-sm transition-colors",
                            currentValue === option.value
                                ? "bg-green-100 text-green-800 font-medium"
                                : "hover:bg-gray-100 text-gray-700"
                        )}
                    >
                        {option.label}
                    </button>
                ))}
            </div>
        </div>
    );
}