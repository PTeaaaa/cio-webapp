"use client"

import * as React from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { searchPlacesByName } from "@/services/search/searchPublicAPI";
import { getPlacesByAgency } from "@/services/placesPublicAPI/placesPublicAPI";
import { type PlaceSearchResult } from "@/types";

interface ComboboxSubProps {
    disabled?: boolean;
    selectedOrg?: string;
    value?: string;
    onChange?: (value: string) => void;
}

export default function Combobox({ disabled = false, selectedOrg, value: externalValue, onChange }: ComboboxSubProps) {
    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState("");
    const [selectedItem, setSelectedItem] = React.useState<PlaceSearchResult | null>(null);

    const [searchTerm, setSearchTerm] = React.useState("");
    const [filteredFrameworks, setFilteredFrameworks] = React.useState<PlaceSearchResult[]>([]);
    const [isLoading, setIsLoading] = React.useState(false);
    const [initialItemsLoaded, setInitialItemsLoaded] = React.useState(false);


    React.useEffect(() => {
        // ฟังก์ชันสำหรับเรียก API ผ่าน placesPublicAPI service
        const search = async () => {
            setIsLoading(true);
            try {
                // เรียกใช้ searchPlacesByName จาก placesPublicAPI service with selectedOrg filter
                const results = await searchPlacesByName(searchTerm, 10, 0, selectedOrg);
                setFilteredFrameworks(results);
            } catch (error) {
                console.error('Search error:', error);
                // แสดงผลลัพธ์ว่างเปล่าหาก error
                setFilteredFrameworks([]);
            } finally {
                setIsLoading(false);
            }
        };

        // ฟังก์ชันสำหรับโหลดรายการเริ่มต้น
        const loadInitialItems = async () => {
            if (!selectedOrg) {
                setFilteredFrameworks([]);
                return;
            }

            setIsLoading(true);
            try {
                const response = await getPlacesByAgency(selectedOrg, 1, 100);
                const results: PlaceSearchResult[] = response.data.map(place => ({
                    value: place.id,
                    label: place.name,
                }));
                setFilteredFrameworks(results);
                setInitialItemsLoaded(true);
            } catch (error) {
                console.error('Initial items loading error:', error);
                setFilteredFrameworks([]);
            } finally {
                setIsLoading(false);
            }
        };

        if (!searchTerm.trim()) {
            // หากไม่มีการค้นหา และยังไม่ได้โหลดรายการเริ่มต้น ให้โหลดรายการเริ่มต้น
            if (!initialItemsLoaded) {
                loadInitialItems();
            }
            return;
        }

        // ใช้ debounce เพื่อลดการยิง API ถี่เกินไป
        const timeoutId = setTimeout(() => {
            search();
        }, 300); // รอ 300ms หลังจากผู้ใช้หยุดพิมพ์

        return () => clearTimeout(timeoutId);
    }, [searchTerm, selectedOrg, initialItemsLoaded]);

    // Sync external value with internal state
    React.useEffect(() => {
        if (externalValue !== undefined && externalValue !== value) {
            setValue(externalValue);
            if (!externalValue) {
                setSelectedItem(null);
            }
        }
    }, [externalValue]);

    // Clear selection when selectedOrg changes
    React.useEffect(() => {
        setValue("");
        setSelectedItem(null);
        setSearchTerm("");
        setFilteredFrameworks([]);
        setInitialItemsLoaded(false);
        // Also notify parent of the change
        if (onChange) {
            onChange("");
        }
    }, [selectedOrg, onChange]);

    // Load initial items when popover opens
    React.useEffect(() => {
        if (open && !disabled && !initialItemsLoaded && !searchTerm.trim() && selectedOrg) {
            const loadInitialItems = async () => {
                setIsLoading(true);
                try {
                    const response = await getPlacesByAgency(selectedOrg, 1, 10);
                    const results: PlaceSearchResult[] = response.data.map(place => ({
                        value: place.id,
                        label: place.name,
                    }));
                    setFilteredFrameworks(results);
                    setInitialItemsLoaded(true);
                } catch (error) {
                    console.error('Initial items loading error:', error);
                    setFilteredFrameworks([]);
                } finally {
                    setIsLoading(false);
                }
            };
            loadInitialItems();
        }
    }, [open, disabled, initialItemsLoaded, searchTerm, selectedOrg]);

    return (
        <Popover open={open && !disabled} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn(
                        "w-full justify-between text-gray-600",
                        disabled && "opacity-70 bg-gray-50"
                    )}
                >
                    {disabled
                        ? "กรุณาเลือกประเภทองค์กรก่อน..." : selectedItem
                            ? selectedItem.label : "เลือกหน่วยงาน..."
                    }
                    <ChevronDown className={cn("opacity-50", disabled && "opacity-30")} />
                </Button>
            </PopoverTrigger>

            <PopoverContent className="p-1">
                <Command shouldFilter={false}>
                    <CommandInput
                        placeholder={disabled ? "ไม่สามารถใช้งานได้" : "ค้นหาสถานที่..."}
                        className="h-9"
                        value={searchTerm}
                        onValueChange={setSearchTerm}
                        disabled={disabled}
                    />
                    <CommandList>
                        {isLoading ? (
                            <div className="p-4 text-center text-sm">กำลังค้นหา...</div>
                        ) : (
                            <>
                                <CommandEmpty>ไม่พบสถานที่ที่ค้นหา</CommandEmpty>
                                <CommandGroup>
                                    {filteredFrameworks.map((framework) => (
                                        <CommandItem
                                            key={framework.value}
                                            value={framework.label}
                                            onSelect={(currentValue) => {
                                                const selectedFramework = filteredFrameworks.find(f => f.label.toLowerCase() === currentValue.toLowerCase());
                                                if (selectedFramework) {
                                                    if (selectedFramework.value === value) {
                                                        // Deselect if clicking on already selected item
                                                        setValue("");
                                                        setSelectedItem(null);
                                                        if (onChange) {
                                                            onChange("");
                                                        }
                                                    } else {
                                                        // Select new item
                                                        setValue(selectedFramework.value);
                                                        setSelectedItem(selectedFramework);
                                                        if (onChange) {
                                                            onChange(selectedFramework.value);
                                                        }
                                                    }
                                                }
                                                setSearchTerm("");
                                                setOpen(false);
                                            }}
                                        >
                                            {framework.label}
                                            <Check className={cn("ml-auto", value === framework.value ? "opacity-100" : "opacity-0")} />
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </>
                        )}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}