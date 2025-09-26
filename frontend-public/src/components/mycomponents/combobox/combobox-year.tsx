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
import { PlaceSearchResult } from "@/types";
import { getPeopleByPlaceId } from "@/services/peoplePublicAPI/peoplePublicAPI";

interface ComboboxYearProps {
    disabled?: boolean;
    selectedPlaceId?: string;
    value?: string;
    onChange?: (value: string) => void;
}

export default function Combobox({ disabled = false, selectedPlaceId, value: externalValue, onChange }: ComboboxYearProps) {
    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState("");
    const [selectedItem, setSelectedItem] = React.useState<PlaceSearchResult | null>(null);

    const [searchTerm, setSearchTerm] = React.useState("");
    const [filteredFrameworks, setFilteredFrameworks] = React.useState<PlaceSearchResult[]>([]);
    const [isLoading, setIsLoading] = React.useState(false);
    const [initialItemsLoaded, setInitialItemsLoaded] = React.useState(false);

    React.useEffect(() => {
        // ฟังก์ชันสำหรับโหลดข้อมูลปีจาก people data
        const loadYearOptions = async () => {
            if (!selectedPlaceId) {
                setFilteredFrameworks([]);
                return;
            }

            setIsLoading(true);
            try {
                // เรียกใช้ getPeopleByPlaceId เพื่อดึงข้อมูลคนในสถานที่นั้น
                const response = await getPeopleByPlaceId(selectedPlaceId, 1, 100); // ดึงข้อมูลทั้งหมด

                if (response && response.data) {
                    // Group people by year and get the latest person for each year
                    const yearMap = new Map<number, string>(); // year -> personId
                    
                    // Process each person to find the latest one for each year
                    response.data.forEach(person => {
                        if (person.year && person.year > 0) {
                            // If we haven't seen this year yet, or if this person is newer (has a higher ID)
                            if (!yearMap.has(person.year) || 
                                (person.id && person.id > (yearMap.get(person.year) || ''))) {
                                yearMap.set(person.year, person.id);
                            }
                        }
                    });

                    // Convert to array and sort by year in descending order
                    const yearOptions: PlaceSearchResult[] = Array.from(yearMap.entries())
                        .sort(([yearA], [yearB]) => yearB - yearA) // Sort by year descending
                        .map(([year, personId]) => ({
                            value: personId, // Use person ID as the value
                            label: `ปีงบประมาณ ${year}` // Keep year as display text
                        }));

                    // กรองตามคำค้นหาถ้ามี
                    if (searchTerm.trim()) {
                        const filtered = yearOptions.filter(option =>
                            option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            option.value.includes(searchTerm)
                        );
                        setFilteredFrameworks(filtered);
                    } else {
                        setFilteredFrameworks(yearOptions);
                    }
                    setInitialItemsLoaded(true);
                } else {
                    setFilteredFrameworks([]);
                }
            } catch (error) {
                console.error('Error loading year options:', error);
                setFilteredFrameworks([]);
            } finally {
                setIsLoading(false);
            }
        };

        // ใช้ debounce เมื่อมีการค้นหา
        if (searchTerm.trim()) {
            const timeoutId = setTimeout(() => {
                loadYearOptions();
            }, 300);
            return () => clearTimeout(timeoutId);
        } else {
            // โหลดข้อมูลทันทีเมื่อไม่มีการค้นหา
            if (!initialItemsLoaded || selectedPlaceId) {
                loadYearOptions();
            }
        }
    }, [searchTerm, selectedPlaceId, initialItemsLoaded]);

    // Sync external value with internal state
    React.useEffect(() => {
        if (externalValue !== undefined && externalValue !== value) {
            setValue(externalValue);
            if (!externalValue) {
                setSelectedItem(null);
            } else {
                // หา selectedItem จาก filteredFrameworks
                const item = filteredFrameworks.find(f => f.value === externalValue);
                setSelectedItem(item || null);
            }
        }
    }, [externalValue, filteredFrameworks]);

    // Clear selection when selectedPlaceId changes
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
    }, [selectedPlaceId, onChange]);

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
                        ? "กรุณาเลือกหน่วยงานก่อน..." : selectedItem
                            ? selectedItem.label : "เลือกปีงบประมาณ..."
                    }
                    <ChevronDown className={cn("opacity-50", disabled && "opacity-30")} />
                </Button>
            </PopoverTrigger>

            <PopoverContent className="p-1">
                <Command shouldFilter={false}>
                    <CommandInput
                        placeholder={disabled ? "ไม่สามารถใช้งานได้" : "ค้นหาปีงบประมาณ..."}
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
                                <CommandEmpty>ไม่พบปีงบประมาณที่ค้นหา</CommandEmpty>
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