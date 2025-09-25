"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import searchNavigation from "../../services/navigation/search/searchNavigation";
import ComboboxMain from "./combobox/combobox-main";
import ComboboxSub from "./combobox/combobox-sub";
import ComboboxYear from "./combobox/combobox-year";

export default function FilterSearch() {
    const [selectedOrg, setSelectedOrg] = useState<string>("");       // for disabling agency until org selected
    const [selectedAgency, setSelectedAgency] = useState<string>(""); // for disabling year until agency selected
    const [selectedYear, setSelectedYear] = useState<string>(""); // for storing selected year

    const router = useRouter();

    // Clear selected agency when selectedOrg changes
    useEffect(() => {
        setSelectedAgency("");
        setSelectedYear(""); // Also clear selected year
    }, [selectedOrg]);

    // Clear selected year when selectedAgency changes
    useEffect(() => {
        setSelectedYear("");
    }, [selectedAgency]);

    // Handle search navigation with support for both left-click and middle-click
    const handleSearchNavigation = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();

        if (event.button === 2) return;
        if (!selectedOrg) return;

        const isMiddleClick = event.button === 1;
        const openInNewTab = isMiddleClick;

        searchNavigation({
            department: selectedOrg,
            placeUUID: selectedAgency,
            personUUID: selectedYear,
            router: openInNewTab ? undefined : router, // Don't use router for new tab
            openInNewTab,
        });
    };

    return (
        <div>
            <h2 className="text-xl mb-6">ค้นหาบุคลากรที่สังกัดอยู่ที่...</h2>
            <div className="flex flex-row">
                <div className="space-y-6 w-full md:w-1/2 pr-20">
                    <div>
                        <label className="block mb-2 font-medium">ประเภทองค์กร</label>

                        <ComboboxMain
                            value={selectedOrg}
                            onChange={setSelectedOrg}
                        />
                    </div>

                    <div>
                        <label className="block mb-2 font-medium">ชื่อหน่วยงาน</label>

                        <ComboboxSub
                            disabled={!selectedOrg}
                            selectedOrg={selectedOrg}
                            value={selectedAgency}
                            onChange={setSelectedAgency}
                        />

                        {!selectedOrg && (
                            <p className="text-xs text-gray-500 mt-1 ml-3 text-red-500">กรุณาเลือกประเภทองค์กรก่อน</p>
                        )}
                    </div>

                    <div>
                        <label className="block mb-2 font-medium">ปีงบประมาณ</label>

                        <ComboboxYear
                            disabled={!selectedAgency}
                            selectedPlaceId={selectedAgency}
                            value={selectedYear}
                            onChange={setSelectedYear}
                        />

                        {!selectedAgency && (
                            <p className="text-xs text-gray-500 mt-1 ml-3 text-red-500">กรุณาเลือกหน่วยงานก่อน</p>
                        )}
                    </div>

                    <div className="mt-10">
                        <button
                            type="button"
                            disabled={!selectedOrg}
                            className="w-full bg-[#0f804f] text-white p-2 rounded-md hover:bg-[#0c663f] transition-colors duration-200 disabled:bg-gray-400"
                            onMouseUp={handleSearchNavigation}
                        >
                            ค้นหา
                        </button>
                    </div>
                </div>

                <div className="w-2/3 border-l-1 border-gray-300 text-center">
                    <div className="text-lg font-medium mb-4">ผลลัพธ์การค้นหาบุคคลที่พบ</div>

                    <div className="font-prompt grid grid-cols-1 mb-6 items-center mx-11 my-3 text-lg mb-1 p-3 shadow-md rounded-xl border hover:bg-gray-100 transition-all duration-300">

                        <h2 className="font-semibold text-base mb-1">
                            ปีงบประมาณ XXXX
                        </h2>
                        <p className="text-muted-foreground text-sm">
                            Mr.X Brian Jown
                        </p>

                    </div>

                    <div className="font-prompt grid grid-cols-1 mb-6 items-center mx-11 my-3 text-lg mb-1 p-3 shadow-md rounded-xl border hover:bg-gray-100 transition-all duration-300">

                        <h2 className="font-semibold text-base mb-1">
                            ปีงบประมาณ XXXX
                        </h2>
                        <p className="text-muted-foreground text-sm">
                            Mr.X Brian Jown
                        </p>

                    </div>

                    <div className="font-prompt grid grid-cols-1 mb-6 items-center mx-11 my-3 text-lg mb-1 p-3 shadow-md rounded-xl border hover:bg-gray-100 transition-all duration-300">

                        <h2 className="font-semibold text-base mb-1">
                            ปีงบประมาณ XXXX
                        </h2>
                        <p className="text-muted-foreground text-sm">
                            Mr.X Brian Jown
                        </p>

                    </div>

                    <div className="font-prompt grid grid-cols-1 mb-6 items-center mx-11 my-3 text-lg mb-1 p-3 shadow-md rounded-xl border hover:bg-gray-100 transition-all duration-300">

                        <h2 className="font-semibold text-base mb-1">
                            ปีงบประมาณ XXXX
                        </h2>
                        <p className="text-muted-foreground text-sm">
                            Mr.X Brian Jown
                        </p>

                    </div>

                    <div className="font-prompt grid grid-cols-1 mb-6 items-center mx-11 my-3 text-lg mb-1 p-3 shadow-md rounded-xl border hover:bg-gray-100 transition-all duration-300">

                        <h2 className="font-semibold text-base mb-1">
                            ปีงบประมาณ XXXX
                        </h2>
                        <p className="text-muted-foreground text-sm">
                            Mr.X Brian Jown
                        </p>

                    </div>

                </div>
            </div>
        </div>
    );
}