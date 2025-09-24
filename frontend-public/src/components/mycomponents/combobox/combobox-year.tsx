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
import { searchYear } from "@/services/search/searchPublicAPI";

interface ComboboxSubProps {
    disabled?: boolean;
}

export default function Combobox({ disabled = false }: ComboboxSubProps) {
    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState("");
    const [selectedItem, setSelectedItem] = React.useState<PlaceSearchResult | null>(null);

    const [searchTerm, setSearchTerm] = React.useState("");
    const [filteredFrameworks, setFilteredFrameworks] = React.useState<PlaceSearchResult[]>([]);
    const [isLoading, setIsLoading] = React.useState(false);

    React.useEffect(() => {
        // ฟังก์ชันสำหรับเรียก API ผ่าน placesPublicAPI service
        const search = async () => {
            setIsLoading(true);
            try {
                // เรียกใช้ searchPlacesByName จาก placesPublicAPI service
                const results = await searchYear(searchTerm, 10, 0);
                setFilteredFrameworks(results);
            } catch (error) {
                console.error('Search error:', error);
                // แสดงผลลัพธ์ว่างเปล่าหาก error
                setFilteredFrameworks([]);
            } finally {
                setIsLoading(false);
            }
        };

        if (!searchTerm.trim()) {
            setFilteredFrameworks([]);
            return;
        }

        // ใช้ debounce เพื่อลดการยิง API ถี่เกินไป
        const timeoutId = setTimeout(() => {
            search();
        }, 300); // รอ 300ms หลังจากผู้ใช้หยุดพิมพ์

        return () => clearTimeout(timeoutId);
    }, [searchTerm]);


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
                                                    } else {
                                                        // Select new item
                                                        setValue(selectedFramework.value);
                                                        setSelectedItem(selectedFramework);
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