/**
 * Example integration of searchNavigationClaude with FilterSearch component
 * This shows how to use the navigation function with the chained combobox logic
 */

"use client";

import { useState, useEffect } from "react";
import {
    useSearchNavigation,
    canNavigate,
    getNavigationInfo,
    type FilterSearchState
} from "./searchNavigationClaude";

export default function FilterSearchWithNavigation() {
    // State matching the FilterSearch component
    const [selectedOrg, setSelectedOrg] = useState<string>("");
    const [selectedAgency, setSelectedAgency] = useState<string>("");
    const [selectedYear, setSelectedYear] = useState<string>("");

    // Get the navigation function
    const navigate = useSearchNavigation();

    // Clear dependent selections when parent changes (same as FilterSearch)
    useEffect(() => {
        setSelectedAgency("");
        setSelectedYear("");
    }, [selectedOrg]);

    useEffect(() => {
        setSelectedYear("");
    }, [selectedAgency]);

    // Handle form submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const state: FilterSearchState = {
            selectedOrg,
            selectedAgency,
            selectedYear
        };

        // Check if we can navigate
        if (canNavigate(state)) {
            // Navigate with the current state
            navigate(state);
        } else {
            alert("Please select at least one option before searching");
        }
    };

    // Get navigation info for UI feedback
    const navInfo = getNavigationInfo({
        selectedOrg,
        selectedAgency,
        selectedYear
    });

    return (
        <div>
            <h2 className="text-xl mb-6">ค้นหาบุคลากรที่สังกัดอยู่ที่...</h2>

            {/* Navigation Info Display */}
            <div className="mb-4 p-3 bg-blue-50 rounded-md">
                <p className="text-sm text-blue-700">
                    <strong>Navigation Status:</strong> {navInfo.description}
                </p>
                <p className="text-xs text-blue-600">
                    <strong>Path:</strong> {navInfo.path}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block mb-2 font-medium">ประเภทองค์กร</label>
                    <select
                        value={selectedOrg}
                        onChange={(e) => setSelectedOrg(e.target.value)}
                        className="w-full p-2 border rounded-md"
                    >
                        <option value="">เลือกประเภทองค์กร</option>
                        <option value="ministry">กระทรวง</option>
                        <option value="department">กรม</option>
                        <option value="agency">หน่วยงาน</option>
                    </select>
                </div>

                <div>
                    <label className="block mb-2 font-medium">ชื่อหน่วยงาน</label>
                    <select
                        value={selectedAgency}
                        onChange={(e) => setSelectedAgency(e.target.value)}
                        disabled={!selectedOrg}
                        className="w-full p-2 border rounded-md disabled:bg-gray-100"
                    >
                        <option value="">เลือกหน่วยงาน</option>
                        {selectedOrg && (
                            <>
                                <option value="agency-1">หน่วยงาน 1</option>
                                <option value="agency-2">หน่วยงาน 2</option>
                                <option value="agency-3">หน่วยงาน 3</option>
                            </>
                        )}
                    </select>
                    {!selectedOrg && (
                        <p className="text-xs text-red-500 mt-1 ml-3">
                            กรุณาเลือกประเภทองค์กรก่อน
                        </p>
                    )}
                </div>

                <div>
                    <label className="block mb-2 font-medium">ปีงบประมาณ</label>
                    <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                        disabled={!selectedAgency}
                        className="w-full p-2 border rounded-md disabled:bg-gray-100"
                    >
                        <option value="">เลือกปีงบประมาณ</option>
                        {selectedAgency && (
                            <>
                                <option value="2024">2567</option>
                                <option value="2023">2566</option>
                                <option value="2022">2565</option>
                            </>
                        )}
                    </select>
                    {!selectedAgency && (
                        <p className="text-xs text-red-500 mt-1 ml-3">
                            กรุณาเลือกหน่วยงานก่อน
                        </p>
                    )}
                </div>

                {/* Navigation Buttons */}
                <div className="space-y-3">
                    <button
                        type="submit"
                        disabled={!navInfo.canNavigate}
                        className="w-full bg-[#0f804f] text-white p-2 rounded-md hover:bg-[#0c663f] transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        ค้นหา
                    </button>

                    {/* Additional navigation options */}
                    <div className="flex space-x-2">
                        <button
                            type="button"
                            onClick={() => navigate({
                                selectedOrg,
                                selectedAgency,
                                selectedYear
                            }, { openInNewTab: true })}
                            disabled={!navInfo.canNavigate}
                            className="flex-1 bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            เปิดในแท็บใหม่
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate({
                                selectedOrg,
                                selectedAgency,
                                selectedYear
                            }, { replace: true })}
                            disabled={!navInfo.canNavigate}
                            className="flex-1 bg-orange-600 text-white p-2 rounded-md hover:bg-orange-700 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            แทนที่หน้าปัจจุบัน
                        </button>
                    </div>
                </div>
            </form>

            {/* Debug Information */}
            <div className="mt-8 p-4 bg-gray-50 rounded-md">
                <h3 className="font-medium mb-2">Debug Information:</h3>
                <pre className="text-xs text-gray-600">
                    {JSON.stringify({
                        selectedOrg,
                        selectedAgency,
                        selectedYear,
                        navigationInfo: navInfo
                    }, null, 2)}
                </pre>
            </div>
        </div>
    );
}
