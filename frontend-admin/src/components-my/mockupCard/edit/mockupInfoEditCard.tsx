"use client";
import React, { useState } from "react";
import { useModal } from "../../../hooks/useModal";
import { Modal } from "@/components/ui/modal";
import { ConfirmationCard } from "@/components/ui/modal/ConfirmationCard";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";

interface FormData {
    prefix: string;
    firstName: string;
    lastName: string;
    year: string;
    placeName: string;
    email: string;
    phone: string;
    position: string
    status: string;
    image: string;
    dateUpdated: string;
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
}

export default function mockupInfoEditCard() {
    const { isOpen, openModal, closeModal } = useModal();
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);

    // Original data (what was loaded initially)
    const [originalData, setOriginalData] = useState<FormData>({
        prefix: "",
        firstName: "",
        lastName: "",
        year: "",
        placeName: "",
        email: "",
        phone: "",
        position: "",
        status: "",
        image: "",
        dateUpdated: new Date().toISOString().split('T')[0] // Default to today's date
    });

    // Current form data (what user is editing)
    const [formData, setFormData] = useState<FormData>({ ...originalData });

    // Check if data has changed
    const hasUnsavedChanges = () => {
        return JSON.stringify(originalData) !== JSON.stringify(formData);
    };

    const handleInputChange = (field: keyof FormData, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSave = () => {
        console.log("Saving changes...", formData);
        // Save logic here
        setOriginalData({ ...formData }); // Update original data after save
        closeModal();
    };

    const handleCloseAttempt = () => {
        if (hasUnsavedChanges()) {
            setShowConfirmDialog(true);
        } else {
            closeModal();
        }
    };

    const handleConfirmClose = () => {
        setShowConfirmDialog(false);
        // Reset form data to original
        setFormData({ ...originalData });
        closeModal();
    };

    const handleCancelClose = () => {
        setShowConfirmDialog(false);
    };

    return (
        <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div>
                    <h4 className="text-base font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
                        ข้อมูลส่วนตัว
                    </h4>

                    <div className="grid grid-cols-2 pt-4 gap-3 xl:grid-cols-3 lg:gap-7">
                        <div>
                            <p className="mb-1 text-sm leading-normal text-gray-500 dark:text-gray-400">
                                คำนำหน้า
                            </p>
                            <p className="text-base font-medium text-gray-800 dark:text-white/90">
                                นายแพทย์
                            </p>
                        </div>

                        <div>
                            <p className="mb-1 text-sm leading-normal text-gray-500 dark:text-gray-400">
                                ชื่อ
                            </p>
                            <p className="text-base font-medium text-gray-800 dark:text-white/90">
                                สุรัชญ์
                            </p>
                        </div>

                        <div>
                            <p className="mb-1 text-sm leading-normal text-gray-500 dark:text-gray-400">
                                นามสกุล
                            </p>
                            <p className="text-base font-medium text-gray-800 dark:text-white/90">
                                วงศ์สวัสดิ์
                            </p>
                        </div>

                        <div>
                            <p className="mb-1 text-sm leading-normal text-gray-500 dark:text-gray-400">
                                อีเมล
                            </p>
                            <p className="text-base font-medium text-gray-800 dark:text-white/90 break-words">
                                fishstop@ussr.com
                            </p>
                        </div>

                        <div>
                            <p className="mb-1 text-sm leading-normal text-gray-500 dark:text-gray-400">
                                เบอร์โทรศัพท์
                            </p>
                            <p className="text-base font-medium text-gray-800 dark:text-white/90">
                                02 547 8966
                            </p>
                        </div>

                        <div>
                            <p className="mb-1 text-sm leading-normal text-gray-500 dark:text-gray-400">
                                ตำแหน่งตามหน่วยงานที่สังกัด
                            </p>
                            <p className="text-base font-medium text-gray-800 dark:text-white/90">
                                ผู้อำนวยการสำนักนโยบายและยุทธศาสตร์
                            </p>
                        </div>
                    </div>
                </div>

                <button
                    onClick={openModal}
                    className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
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
                    <form className="flex flex-col">
                        <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
                            <div>
                                <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                                    ลิงค์โซเชียล
                                </h5>

                                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                                    <div>
                                        <Label>Facebook</Label>
                                        <Input
                                            type="text"
                                            defaultValue={formData.facebook}
                                            onChange={(e) => handleInputChange('facebook', e.target.value)}
                                        />
                                    </div>

                                    <div>
                                        <Label>X.com</Label>
                                        <Input 
                                            type="text" 
                                            defaultValue={formData.twitter}
                                            onChange={(e) => handleInputChange('twitter', e.target.value)}
                                        />
                                    </div>

                                    <div>
                                        <Label>Linkedin</Label>
                                        <Input
                                            type="text"
                                            defaultValue={formData.linkedin}
                                            onChange={(e) => handleInputChange('linkedin', e.target.value)}
                                        />
                                    </div>

                                    <div>
                                        <Label>Instagram</Label>
                                        <Input
                                            type="text"
                                            defaultValue={formData.instagram}
                                            onChange={(e) => handleInputChange('instagram', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="mt-7">
                                <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                                    ข้อมูลส่วนตัว
                                </h5>

                                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                                    <div className="col-span-2 lg:col-span-1">
                                        <Label>ชื่อ</Label>
                                        <Input 
                                            type="text" 
                                            defaultValue={formData.firstName}
                                            onChange={(e) => handleInputChange('firstName', e.target.value)}
                                        />
                                    </div>

                                    <div className="col-span-2 lg:col-span-1">
                                        <Label>นามสกุล</Label>
                                        <Input 
                                            type="text" 
                                            defaultValue={formData.lastName}
                                            onChange={(e) => handleInputChange('lastName', e.target.value)}
                                        />
                                    </div>

                                    <div className="col-span-2 lg:col-span-1">
                                        <Label>อีเมล</Label>
                                        <Input 
                                            type="email" 
                                            defaultValue={formData.email}
                                            onChange={(e) => handleInputChange('email', e.target.value)}
                                        />
                                    </div>

                                    <div className="col-span-2 lg:col-span-1">
                                        <Label>เบอร์โทรศัพท์</Label>
                                        <Input 
                                            type="text" 
                                            defaultValue={formData.phone}
                                            onChange={(e) => handleInputChange('phone', e.target.value)}
                                        />
                                    </div>

                                    <div className="col-span-2">
                                        <Label>ตำแหน่ง</Label>
                                        <Input 
                                            type="text" 
                                            defaultValue={formData.position}
                                            onChange={(e) => handleInputChange('position', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                            <Button size="sm" variant="outline" onClick={handleCloseAttempt}>
                                ปิด
                            </Button>
                            <Button size="sm" onClick={handleSave}>
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
                confirmText="ยกเลิก"
                cancelText="ละทิ้งและปิด"
            />
        </div>
    );
}