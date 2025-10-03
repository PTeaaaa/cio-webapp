// ไฟล์: DataEditCard.tsx
import React, { useState, useEffect } from "react";
import { Modal } from "../../../components/ui/modal";
import { ConfirmationCard } from "../../../components/ui/modal/ConfirmationModal";
import Button from "../../../components/ui/button/Button";
import Input from "../../../components/form/input/InputField";
import Label from "../../../components/form/Label";
import { useAccountData } from "@/hooks/accountdataHook/useAccountData";
import { useAccounts } from "@/contexts/AccountsContext";
import { getAllPlaces } from "@/services/places/placesAPI";
import { Place } from "@/types";

export default function AccountDataEditCard() {
    const {
        isOpen,
        openModal,
        handleCloseAttempt,
        handleConfirmClose,
        handleCancelClose,
        originalData,
        formData,
        hasUnsavedChanges,
        handleInputChange,
        handleSave,
        showConfirmDialog,
        loading,
    } = useAccountData();

    const { accountsLoading } = useAccounts();
    const [places, setPlaces] = useState<Place[]>([]);
    const [placesLoading, setPlacesLoading] = useState(true);

    // Load places for the dropdown
    useEffect(() => {
        const fetchPlaces = async () => {
            try {
                setPlacesLoading(true);
                const placesData = await getAllPlaces();
                if (placesData) {
                    setPlaces(placesData);
                }
            } catch (error) {
                console.error("Error fetching places:", error);
            } finally {
                setPlacesLoading(false);
            }
        };

        fetchPlaces();
    }, []);

    const handleFormSubmit = (event: React.FormEvent) => {
        // This line is the key: it stops the browser from reloading the page.
        event.preventDefault();
    };

    const formatDateTime = (date: Date | string | undefined) => {
        if (!date) return "ไม่มีข้อมูล";
        const d = new Date(date);
        return d.toLocaleString('th-TH', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getPlaceNames = (assignedPlaces: any[] | undefined) => {
        if (!assignedPlaces || assignedPlaces.length === 0) return "ไม่มีสถานที่ที่ได้รับมอบหมาย";
        return assignedPlaces.map(ap => ap.place.name).join(", ");
    };

    const handleAssignedPlacesChange = (selectedPlaceIds: string[]) => {
        handleInputChange('assignedPlaces', selectedPlaceIds);
    };

    if (accountsLoading || loading) {
        return (
            <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
                <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400">กำลังโหลดข้อมูล...</p>
                </div>
            </div>
        );
    }

    if (!originalData) {
        return (
            <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
                <div className="text-center py-8">
                    <p className="text-red-500 dark:text-red-400">ไม่พบข้อมูลบัญชี</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div>
                    <h4 className="text-base font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
                        ข้อมูลบัญชี
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 pt-4 gap-10 lg:gap-x-40">
                        {/* ส่วนแสดงข้อมูล */}

                        <div>
                            <p className="mb-1 text-sm leading-normal text-gray-500 dark:text-gray-400">
                                ID
                            </p>
                            <p className="text-base font-medium text-gray-800 dark:text-white/90">
                                {originalData.id}
                            </p>
                        </div>

                        <div>
                            <p className="mb-1 text-sm leading-normal text-gray-500 dark:text-gray-400">
                                Username
                            </p>
                            <p className="text-base font-medium text-gray-800 dark:text-white/90">
                                {originalData.username}
                            </p>
                        </div>

                        <div>
                            <p className="mb-1 text-sm leading-normal text-gray-500 dark:text-gray-400">
                                ประเภทของบัญชี
                            </p>
                            <p className="text-base font-medium text-gray-800 dark:text-white/90">
                                {originalData.role}
                            </p>
                        </div>

                        <div>
                            <p className="mb-1 text-sm leading-normal text-gray-500 dark:text-gray-400">
                                สถานที่ที่ได้รับมอบหมาย
                            </p>
                            <p className="text-base font-medium text-gray-800 dark:text-white/90 break-words">
                                {getPlaceNames(originalData.assignedPlaces)}
                            </p>
                        </div>

                        <div>
                            <p className="mb-1 text-sm leading-normal text-gray-500 dark:text-gray-400">
                                เวลาที่ล็อกอินล่าสุด
                            </p>
                            <p className="text-base font-medium text-gray-800 dark:text-white/90">
                                {formatDateTime(originalData.lastLoginAt)}
                            </p>
                        </div>

                        <div>
                            <p className="mb-1 text-sm leading-normal text-gray-500 dark:text-gray-400">
                                จำนวนครั้งที่พยายามเข้าสู่ระบบ
                            </p>
                            <p className="text-base font-medium text-gray-800 dark:text-white/90">
                                ไม่มีข้อมูล
                                {/* {originalData.loginAttempts || 0} */}
                            </p>
                        </div>

                        <div>
                            <p className="mb-1 text-sm leading-normal text-gray-500 dark:text-gray-400">
                                ระงับการเข้าสู่ระบบจนถึง
                            </p>
                            <p className="text-base font-medium text-gray-800 dark:text-white/90">
                                ไม่มีข้อมูล
                                {/* {formatDateTime(originalData.lockedUntil)} */}
                            </p>
                        </div>

                        <div>
                            <p className="mb-1 text-sm leading-normal text-gray-500 dark:text-gray-400">
                                เปลี่ยนรหัสผ่านล่าสุดเมื่อ
                            </p>
                            <p className="text-base font-medium text-gray-800 dark:text-white/90">
                                {formatDateTime(originalData.passwordChangedAt)}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-21">
                            <div>
                                <p className="mb-1 text-sm leading-normal text-gray-500 dark:text-gray-400">
                                    วันที่สร้าง
                                </p>
                                <p className="text-base font-medium text-gray-800 dark:text-white/90">
                                    {formatDateTime(originalData.createdAt)}
                                </p>
                            </div>

                            <div>
                                <p className="mb-1 text-sm leading-normal text-gray-500 dark:text-gray-400">
                                    สร้างโดย
                                </p>
                                <p className="text-base font-medium text-gray-800 dark:text-white/90">
                                    {originalData.createdBy || "ไม่มีข้อมูล"}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-21">
                            <div>
                                <p className="mb-1 text-sm leading-normal text-gray-500 dark:text-gray-400">
                                    วันที่อัปเดตล่าสุด
                                </p>
                                <p className="text-base font-medium text-gray-800 dark:text-white/90">
                                    {formatDateTime(originalData.updatedAt)}
                                </p>
                            </div>

                            <div>
                                <p className="mb-1 text-sm leading-normal text-gray-500 dark:text-gray-400">
                                    แก้ไขโดย
                                </p>
                                <p className="text-base font-medium text-gray-800 dark:text-white/90">
                                    {originalData.modifiedBy || "ไม่มีข้อมูล"}
                                </p>
                            </div>
                        </div>

                        <div>
                            <p className="mb-1 text-sm leading-normal text-gray-500 dark:text-gray-400">
                                สถานะของบัญชี
                            </p>
                            <p className={`text-base font-medium ${originalData.isActive
                                ? 'text-green-600 dark:text-green-400'
                                : 'text-red-600 dark:text-red-400'}`}>
                                {originalData.isActive ? 'ใช้งานได้' : 'ถูกระงับ'}
                            </p>
                        </div>

                        {/* <div className="mt-4">
                            <button
                                className="flex w-full items-center justify-center gap-2 rounded-full border border-green-600 px-4 py-3 text-sm font-medium text-black shadow-theme-xs hover:bg-green-600 dark:border-green-700 dark:text-white dark:hover:bg-green-700 dark:hover:text-gray-200 lg:inline-flex lg:w-auto duration-200 ease-in-out"
                                onClick={() => { }}
                            >
                                เปลี่ยนรหัสผ่านของบัญชีนี้
                            </button>
                        </div> */}

                    </div>
                </div>

                <button
                    onClick={openModal}
                    className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
                    style={{ whiteSpace: "nowrap" }}
                >
                    <svg
                        className="fill-current"
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
                            fill=""
                        />
                    </svg>
                    แก้ไข
                </button>
            </div>

            <Modal
                isOpen={isOpen}
                onClose={handleCloseAttempt}
                className="max-w-[700px] m-4"
                hasUnsavedChanges={hasUnsavedChanges()}
                onConfirmClose={handleCloseAttempt}
            >
                <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
                    <div className="px-2 pr-14">
                        <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                            แก้ไขข้อมูลบัญชี
                        </h4>
                        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
                            อัปเดตข้อมูลบัญชีให้เป็นปัจจุบัน
                        </p>
                    </div>
                    <form className="flex flex-col" onSubmit={handleFormSubmit}>
                        <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
                            <div className="mt-7 space-y-4">

                                {/* Username */}
                                <div>
                                    <Label htmlFor="username">ชื่อผู้ใช้</Label>
                                    <Input
                                        id="username"
                                        type="text"
                                        defaultValue={formData.username || ""}
                                        onChange={(e) => handleInputChange('username', e.target.value)}
                                        placeholder="กรอกชื่อผู้ใช้"
                                    />
                                </div>

                                {/* Role */}
                                <div>
                                    <Label htmlFor="role">บทบาท</Label>
                                    <select
                                        id="role"
                                        value={formData.role || ""}
                                        onChange={(e) => handleInputChange('role', e.target.value)}
                                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                    >
                                        <option value="">เลือกบทบาท</option>
                                        <option value="admin">ผู้ดูแลระบบ</option>
                                        <option value="user">ผู้ใช้ทั่วไป</option>
                                        <option value="moderator">ผู้ดูแล</option>
                                    </select>
                                </div>

                                {/* Account Status */}
                                <div>
                                    <Label htmlFor="isActive">สถานะบัญชี</Label>
                                    <select
                                        id="isActive"
                                        value={formData.isActive?.toString() || "true"}
                                        onChange={(e) => handleInputChange('isActive', e.target.value === 'true')}
                                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                    >
                                        <option value="true">ใช้งานได้</option>
                                        <option value="false">ถูกระงับ</option>
                                    </select>
                                </div>

                                {/* Assigned Places */}
                                <div>
                                    <Label htmlFor="assignedPlaces">สถานที่ที่ได้รับมอบหมาย</Label>
                                    {placesLoading ? (
                                        <p className="text-sm text-gray-500">กำลังโหลดสถานที่...</p>
                                    ) : (
                                        <div className="border border-gray-300 rounded-lg p-3 max-h-40 overflow-y-auto dark:border-gray-600">
                                            {places.map((place) => (
                                                <label key={place.id} className="flex items-center space-x-2 mb-2">
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.assignedPlaces?.includes(place.id) || false}
                                                        onChange={(e) => {
                                                            const currentPlaces = formData.assignedPlaces || [];
                                                            if (e.target.checked) {
                                                                handleAssignedPlacesChange([...currentPlaces, place.id]);
                                                            } else {
                                                                handleAssignedPlacesChange(currentPlaces.filter(id => id !== place.id));
                                                            }
                                                        }}
                                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                                                    />
                                                    <span className="text-sm text-gray-700 dark:text-gray-300">
                                                        {place.name} ({place.agency})
                                                    </span>
                                                </label>
                                            ))}
                                        </div>
                                    )}
                                </div>

                            </div>
                        </div>
                        <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                            <Button size="sm" variant="outline" onClick={handleCloseAttempt} type="button">
                                ปิด
                            </Button>
                            <Button size="sm" onClick={handleSave} type="button">
                                บันทึกการเปลี่ยนแปลง
                            </Button>
                        </div>
                    </form>
                </div>
            </Modal>

            <ConfirmationCard
                isOpen={showConfirmDialog}
                onConfirm={handleConfirmClose}
                onCancel={handleCancelClose}
                title="มีการเปลี่ยนแปลงที่ยังไม่ได้บันทึก"
                message="คุณมีการเปลี่ยนแปลงที่ยังไม่ได้บันทึก คุณต้องการปิดโดยที่ไม่บันทึกหรือไม่?"
                confirmText="ละทิ้งและปิด"
                cancelText="ยกเลิก"
            />
        </div>
    );
}