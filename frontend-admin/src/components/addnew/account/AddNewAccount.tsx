"use client";

import React, { useState, useEffect } from "react";
import Input from "../../form/input/InputField";
import Label from "../../form/Label";
import ComponentCard from '@/components/common/ComponentCard';
import { useAccountForm } from '@/hooks/useAccountForm';

export default function AddNewAccount() {
    const {
        formData,
        places,
        selectedPlaces,
        isLoading,
        error,
        availablePlaces,
        handleInputChange,
        handlePlaceSelect,
        handlePlaceRemove,
        handleSubmit,
    } = useAccountForm();

    const [showSuccessNotification, setShowSuccessNotification] = useState(false);

    const handleNotificationClose = () => {
        setShowSuccessNotification(false);
    };

    return (
        <>
            <div className="flex flex-col items-center">
                <div className="flex flex-col pb-7 lg:py-7 w-full lg:w-[70%]">
                    <ComponentCard title="ลงทะเบียนบัญชีผู้ใช้" className="w-full">

                        {/* Error/Success Messages */}
                        {/* {error && (
                            toast.error(error)
                        )} */}

                        {/* Don't need it anymore, reserve just in case */}
                        {/* {success && (
                            <div className="mb-4 mx-2 px-4 py-2 bg-green-300 border border-green-400 text-green-700 rounded-lg">
                                {success}
                            </div>
                        )} */}

                        <div className="gap-x-6 gap-y-6 px-2 grid grid-cols-1">
                            <div>
                                <Label>Username<span className="text-red-500">{" *"}</span></Label>
                                <Input
                                    type="text"
                                    placeholder="Username"
                                    defaultValue={formData.username}
                                    onChange={(e) => handleInputChange('username', e.target.value)}
                                />
                            </div>

                            <div>
                                <Label>Password<span className="text-red-500">{" *"}</span></Label>
                                <Input
                                    type="password"
                                    placeholder="Password"
                                    defaultValue={formData.password}
                                    onChange={(e) => handleInputChange('password', e.target.value)}
                                />
                            </div>

                            <div className="">
                                <Label>ประเภทของบัญชี<span className="text-red-500">{" *"}</span></Label>
                                <select
                                    name="role"
                                    value={formData.role}
                                    onChange={(e) => {
                                        handleInputChange('role', e.target.value);
                                    }}
                                    className="w-full p-2.5 border rounded-lg bg-white dark:bg-gray-900 border-gray-400 dark:border-gray-700 text-gray-500 dark:text-gray-400 text-sm"
                                    required
                                >
                                    <option value="">กรุณาเลือกประเภทของบัญชี</option>
                                    <option value="admin" className="text-gray-600 dark:text-gray-400">Admin</option>
                                    <option value="user" className="text-gray-600 dark:text-gray-400">User</option>
                                </select>
                            </div>

                            <div className="">
                                <Label>
                                    หน่วยงานที่มอบหมาย
                                    {formData.role === 'user' && <span className="text-red-500">{" *"}</span>}
                                    {formData.role === 'admin' && <span className="text-red-500 text-sm ml-2">(ไม่จำเป็น - Admin มีสิทธิ์เข้าถึงทุกหน่วยงาน)</span>}
                                </Label>

                                {/* Display selected places */}
                                {selectedPlaces.map((place, index) => (
                                    <div key={place.id} className="mb-2">
                                        {/* Selected place display */}
                                        <div className="flex items-center justify-between p-2 bg-green-100 dark:bg-green-900/10 border border-green-400 dark:border-green-800 rounded-lg">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-medium text-green-700 dark:text-green-300 pl-2">
                                                    {index + 1}.
                                                </span>
                                                <span className="text-gray-800 dark:text-white">
                                                    {place.name}
                                                </span>
                                            </div>

                                            <button
                                                onClick={() => handlePlaceRemove(place.id)}
                                                className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-1"
                                                type="button"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>

                                        {/* Dropdown for next selection - show after each selected place */}
                                        {index === selectedPlaces.length - 1 && availablePlaces.length > 0 && (
                                            <div className="mt-2">
                                                <select
                                                    onChange={(e) => {
                                                        if (e.target.value) {
                                                            handlePlaceSelect(e.target.value);
                                                            e.target.value = ""; // Reset dropdown
                                                        }
                                                    }}
                                                    className="w-full p-2.5 border rounded-lg bg-white dark:bg-gray-900 dark:border-gray-700 text-gray-400 dark:text-white/30 text-sm"
                                                >
                                                    <option value="">
                                                        เลือกหน่วยงานเพิ่มเติม (ไม่จำเป็น)
                                                    </option>
                                                    {availablePlaces.map((place) => (
                                                        <option key={place.id} value={place.id}>
                                                            {place.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        )}
                                    </div>
                                ))}

                                {/* Initial dropdown when no places selected */}
                                {selectedPlaces.length === 0 && (
                                    <select
                                        onChange={(e) => {
                                            if (e.target.value) {
                                                handlePlaceSelect(e.target.value);
                                                e.target.value = ""; // Reset dropdown
                                            }
                                        }}
                                        className="w-full p-2.5 border rounded-lg bg-white dark:bg-gray-900 border-gray-400 dark:border-gray-700 text-gray-500 dark:text-gray-400 text-sm disabled:opacity-35 disabled:cursor-not-allowed"
                                        required={formData.role === 'user'}
                                        disabled={formData.role !== 'user' && formData.role == 'admin'}
                                    >
                                        <option value="">กรุณาเลือกหน่วยงาน</option>
                                        {places.map((place) => (
                                            <option key={place.id} value={place.id} className="text-gray-600 dark:text-gray-400">
                                                {place.name}
                                            </option>
                                        ))}
                                    </select>
                                )}
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
                                    กำลังสร้างบัญชี...
                                </>
                            ) : (
                                'สร้างบัญชี'
                            )}
                        </button>
                    </div>
                </div>
            </div >
        </>
    );
}
