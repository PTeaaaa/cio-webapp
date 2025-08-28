// ไฟล์: InfoEditCard.tsx
import React from "react";
import { Modal } from "../../../components/ui/modal";
import { ConfirmationCard } from "../../../components/ui/modal/ConfirmationCard";
import Button from "../../../components/ui/button/Button";
import Input from "../../../components/form/input/InputField";
import Label from "../../../components/form/Label";
import { useEditInfoCard } from "@/hooks/infoCardHook/useEditInfoCard";
import { useAccounts } from "@/contexts/AccountsContext";

export default function DataEditCard() {
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
    } = useEditInfoCard();

    const { accountsLoading } = useAccounts();

    const handleFormSubmit = (event: React.FormEvent) => {
        // This line is the key: it stops the browser from reloading the page.
        event.preventDefault();
    };

    if (loading || !originalData) {
        return (
            <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
                <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400">กำลังโหลดข้อมูล...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div>
                    <h4 className="text-base font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
                        ข้อมูลส่วนตัว
                    </h4>

                    <div className="grid grid-cols-2 pt-4 gap-3 xl:grid-cols-3 lg:gap-10 lg:gap-x-40">
                        {/* ส่วนแสดงข้อมูล */}
                        <div>
                            <p className="mb-1 text-sm leading-normal text-gray-500 dark:text-gray-400">
                                คำนำหน้า
                            </p>
                            <p className="text-base font-medium text-gray-800 dark:text-white/90">
                                {originalData.prefix}
                            </p>
                        </div>
                        <div>
                            <p className="mb-1 text-sm leading-normal text-gray-500 dark:text-gray-400">
                                ชื่อ
                            </p>
                            <p className="text-base font-medium text-gray-800 dark:text-white/90">
                                {originalData.name}
                            </p>
                        </div>
                        <div>
                            <p className="mb-1 text-sm leading-normal text-gray-500 dark:text-gray-400">
                                นามสกุล
                            </p>
                            <p className="text-base font-medium text-gray-800 dark:text-white/90">
                                {originalData.surname}
                            </p>
                        </div>
                        <div>
                            <p className="mb-1 text-sm leading-normal text-gray-500 dark:text-gray-400">
                                อีเมล
                            </p>
                            <p className="text-base font-medium text-gray-800 dark:text-white/90 break-words" style={{ whiteSpace: "nowrap" }}>
                                {originalData.email}
                            </p>
                        </div>
                        <div>
                            <p className="mb-1 text-sm leading-normal text-gray-500 dark:text-gray-400">
                                เบอร์โทรศัพท์
                            </p>
                            <p className="text-base font-medium text-gray-800 dark:text-white/90">
                                {originalData.phone}
                            </p>
                        </div>
                        <div>
                            <p className="mb-1 text-sm leading-normal text-gray-500 dark:text-gray-400">
                                ตำแหน่งตามหน่วยงานที่สังกัด
                            </p>
                            <p className="text-base font-medium text-gray-800 dark:text-white/90">
                                {originalData.position}
                            </p>
                        </div>
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
                            แก้ไขข้อมูลส่วนตัว
                        </h4>
                        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
                            อัปเดตรายละเอียดของคุณเพื่อให้โปรไฟล์ของคุณเป็นปัจจุบัน
                        </p>
                    </div>
                    <form className="flex flex-col" onSubmit={handleFormSubmit}>
                        <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
                            <div className="mt-7">
                                <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                                    ข้อมูลส่วนตัว
                                </h5>

                                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">

                                    <div className="col-span-2 w-[50%]">
                                        <Label>คำนำหน้า</Label>
                                        <Input
                                            type="text"
                                            defaultValue={formData.prefix || ""}
                                            onChange={(e) => handleInputChange('prefix', e.target.value)}
                                        />
                                    </div>

                                    <div className="col-span-2 lg:col-span-1">
                                        <Label>ชื่อ</Label>
                                        <Input
                                            type="text"
                                            defaultValue={formData.name || ""}
                                            onChange={(e) => handleInputChange('name', e.target.value)}
                                        />
                                    </div>

                                    <div className="col-span-2 lg:col-span-1">
                                        <Label>นามสกุล</Label>
                                        <Input
                                            type="text"
                                            defaultValue={formData.surname || ""}
                                            onChange={(e) => handleInputChange('surname', e.target.value)}
                                        />
                                    </div>

                                    <div className="col-span-2 lg:col-span-1">
                                        <Label>อีเมล</Label>
                                        <Input
                                            type="email"
                                            defaultValue={formData.email || ""}
                                            onChange={(e) => handleInputChange('email', e.target.value)}
                                        />
                                    </div>

                                    <div className="col-span-2 lg:col-span-1">
                                        <Label>เบอร์โทรศัพท์</Label>
                                        <Input
                                            type="text"
                                            defaultValue={formData.phone || ""}
                                            onChange={(e) => handleInputChange('phone', e.target.value)}
                                        />
                                    </div>

                                    <div className="col-span-2">
                                        <Label>ตำแหน่งตามหน่วยงานที่สังกัด</Label>
                                        <Input
                                            type="text"
                                            defaultValue={formData.position || ""}
                                            onChange={(e) => handleInputChange('position', e.target.value)}
                                        />
                                    </div>
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