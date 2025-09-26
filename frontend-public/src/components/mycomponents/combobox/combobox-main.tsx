"use client"

import * as React from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

interface ComboboxMainProps {
    value?: string;
    onChange?: (value: string) => void;
}

const frameworks = [
    { value: "Department", label: "กรม" },
    { value: "State", label: "เขตสุขภาพ" },
    { value: "Office", label: "สำนักงานสาธารณสุขจังหวัด" },
    { value: "HCenter", label: "โรงพยาบาลศูนย์" },
    { value: "HGeneral", label: "โรงพยาบาลทั่วไป" },
]

export default function Combobox({
    value = "",
    onChange,
}: ComboboxMainProps) {
    const [open, setOpen] = React.useState(false)

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between text-gray-600"
                >
                    {value
                        ? frameworks.find((framework) => framework.value === value)?.label
                        : "เลือกประเภทองค์กร..."}
                    <ChevronDown className="opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0">
                <Command>
                    <CommandList>
                        <CommandEmpty>ไม่พบชื่อองค์กรที่คุณค้นหา</CommandEmpty>
                        <CommandGroup>
                            {frameworks.map((framework) => (
                                <CommandItem
                                    key={framework.value}
                                    value={framework.value}
                                    onSelect={(currentValue) => {
                                        onChange?.(currentValue === value ? "" : currentValue)
                                        setOpen(false)
                                    }}
                                >
                                    {framework.label}
                                    <Check
                                        className={cn(
                                            "ml-auto",
                                            value === framework.value ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
