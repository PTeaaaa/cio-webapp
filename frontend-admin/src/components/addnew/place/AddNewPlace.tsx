"use client";

import React from "react";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import ComponentCard from '@/components/common/ComponentCard';
import { usePlaceForm } from '@/hooks/usePlaceForm';

export default function AddNewPlace() {
    const {
        formData,
        isLoading,
        error,
        success,
        handleInputChange,
        handleSubmit,
    } = usePlaceForm();

    return (
        <>
            <div className="flex flex-col items-center">
                <div className="flex flex-col pb-7 lg:py-7 w-full lg:w-[70%]">
                    <ComponentCard title="เพิ่มสถานที่ใหม่" className="w-full">

                        {/* Error/Success Messages */}
                        {error && (
                            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                                {success}
                            </div>
                        )}

                        <div className="gap-x-6 gap-y-6 px-2 grid grid-cols-2">
                            <div className="">
                                <Label>ชื่อสถานที่<span className="text-red-500">{" *"}</span></Label>
                                <Input
                                    type="text"
                                    placeholder="ชื่อสถานที่"
                                    defaultValue={formData.name}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                />
                            </div>

                            <div className="">
                                <Label>หน่วยงานที่สังกัด<span className="text-red-500">{" *"}</span></Label>
                                <select
                                    name="agency"
                                    value={formData.agency}
                                    onChange={(e) => {
                                        handleInputChange('agency', e.target.value);
                                    }}
                                    className="w-full p-2.5 border rounded-lg bg-white dark:bg-gray-900 dark:border-gray-700 text-gray-900 dark:text-white/40 text-sm"
                                    required
                                >
                                    <option value="">กรุณาเลือกหน่วยงานที่สังกัด</option>
                                    <option value="Department">กรม</option>
                                    <option value="State">เขตสุขภาพ</option>
                                    <option value="Office">สำนักงานสาธารณสุขจังหวัด</option>
                                    <option value="HCenter">โรงพยาบาลศูนย์</option>
                                    <option value="HGeneral">โรงพยาบาลทั่วไป</option>
                                </select>
                            </div>
                        </div>
                    </ComponentCard>

                    <div className="flex justify-end mt-10">
                        <button
                            onClick={handleSubmit}
                            disabled={isLoading}
                            className={`flex w-full items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-medium shadow-theme-xs lg:inline-flex lg:w-auto duration-200 ease-in-out ${isLoading
                                ? 'border-gray-400 bg-gray-400 text-white cursor-not-allowed'
                                : 'border-green-600 bg-green-600 text-white hover:bg-green-700 hover:text-gray-100 dark:border-green-700 dark:text-white dark:hover:bg-green-700 dark:hover:text-gray-200'
                                }`}
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    กำลังเพิ่มสถานที่...
                                </>
                            ) : (
                                'เพิ่มสถานที่'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
