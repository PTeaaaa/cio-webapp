"use client";
import React from "react";
import ComponentCard from "@/components/common/ComponentCard";
import { Modal } from "../../../components/ui/modal";
import Button from "../../../components/ui/button/Button";
import { useEditPhotoCard } from "@/hooks/photoCardHook/useEditPhotoCard"; // นำเข้า useEditPhotoCard hook
import Image from "next/image";

export default function PhotoEditCard() {
    // ดึงค่าและฟังก์ชันที่จำเป็นจาก useEditPhotoCard hook
    const {
        currentImage,
        isOpen, // สำหรับ Modal หลัก (Preview/Success)
        getRootProps,
        getInputProps,
        isDragActive,
        openModal, // ฟังก์ชันเปิด Modal หลัก
        handleSave, // ฟังก์ชันบันทึกและอัปโหลดรูปภาพ
        handleCancel, // ฟังก์ชันยกเลิก
        selectedFile, // ไฟล์ที่ผู้ใช้เลือก (สำหรับพรีวิว)
        isUploading, // สถานะกำลังอัปโหลด
        uploadError, // ข้อผิดพลาดในการอัปโหลด
        isLoadingCurrentImage, // สถานะกำลังโหลดรูปภาพปัจจุบัน
        status,
    } = useEditPhotoCard();

    // ฟังก์ชันสำหรับจัดการการปิด Modal (เมื่อกด "เข้าใจแล้ว" หรือ "ยกเลิก" ใน Modal)
    const handleModalClose = () => {
        handleCancel(); // เรียกใช้ handleCancel จาก hook เพื่อเคลียร์สถานะ
    };

    return (
        <ComponentCard title="อัปโหลดรูปภาพ">

            {/* ส่วนแสดงรูปภาพปัจจุบัน */}
            {isLoadingCurrentImage ? (
                <div className="mb-6 flex justify-center">
                    <div className="relative">
                        <div className="w-32 h-32 object-cover rounded-full border-4 border-gray-200 flex items-center justify-center text-gray-500 dark:text-gray-400">
                            กำลังโหลดรูปภาพ...
                        </div>
                    </div>
                </div>
            ) : (
                currentImage && (
                    <div className="mb-6 flex justify-center">
                        <div className="relative">
                            <Image
                                width={128}
                                height={128}
                                src={currentImage}
                                alt="Current Profile"
                                className="w-32 h-32 object-cover rounded-full border-4 border-gray-200"
                            />

                            <div className="absolute -bottom-2 left-5 bg-green-500 text-white text-xs px-2 py-1 rounded-lg">
                                รูปภาพปัจจุบัน
                            </div>

                        </div>
                    </div>
                )
            )}

            {/* Dropzone สำหรับอัปโหลดรูปภาพ */}
            <div className="transition border border-gray-300 border-dashed cursor-pointer dark:hover:border-brand-500 dark:border-gray-700 rounded-xl hover:border-brand-500">
                <form
                    {...getRootProps()}
                    className={`dropzone rounded-xl border-dashed border-gray-300 p-7 lg:p-10
                    ${isDragActive
                            ? "border-brand-500 bg-gray-100 dark:bg-gray-800"
                            : "border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-900"
                        }`}
                    id="demo-upload"
                >
                    {/* Hidden Input */}
                    <input {...getInputProps()} />

                    <div className="dz-message flex flex-col items-center m-0!">
                        {/* Icon Container หรือ Preview รูปภาพที่เลือก */}
                        <div className="mb-[22px] flex justify-center">
                            <div className="flex h-[68px] w-[68px] items-center justify-center rounded-full bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-400 overflow-hidden">
                                {selectedFile ? (
                                    // แสดงพรีวิวรูปภาพที่เลือก
                                    <img
                                        src={URL.createObjectURL(selectedFile)}
                                        alt="Selected Preview"
                                        className="h-full w-full object-cover"
                                        // Revoke Object URL เมื่อรูปภาพโหลดเสร็จ เพื่อประหยัด Memory
                                        onLoad={(e) => URL.revokeObjectURL((e.target as HTMLImageElement).src)}
                                    />
                                ) : (
                                    // แสดงไอคอนอัปโหลดเดิม
                                    <svg
                                        className="fill-current"
                                        width="29"
                                        height="28"
                                        viewBox="0 0 29 28"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                            d="M14.5019 3.91699C14.2852 3.91699 14.0899 4.00891 13.953 4.15589L8.57363 9.53186C8.28065 9.82466 8.2805 10.2995 8.5733 10.5925C8.8661 10.8855 9.34097 10.8857 9.63396 10.5929L13.7519 6.47752V18.667C13.7519 19.0812 14.0877 19.417 14.5019 19.417C14.9161 19.417 15.2519 19.0812 15.2519 18.667V6.48234L19.3653 10.5929C19.6583 10.8857 20.1332 10.8855 20.426 10.5925C20.7188 10.2995 20.7186 9.82463 20.4256 9.53184L15.0838 4.19378C14.9463 4.02488 14.7367 3.91699 14.5019 3.91699ZM5.91626 18.667C5.91626 18.2528 5.58047 17.917 5.16626 17.917C4.75205 17.917 4.41626 18.2528 4.41626 18.667V21.8337C4.41626 23.0763 5.42362 24.0837 6.66626 24.0837H22.3339C23.5766 24.0837 24.5839 23.0763 24.5839 21.8337V18.667C24.5839 18.2528 24.2482 17.917 23.8339 17.917C23.4197 17.917 23.0839 18.2528 23.0839 18.667V21.8337C23.0839 22.2479 22.7482 22.5837 22.3339 22.5837H6.66626C6.25205 22.5837 5.91626 22.2479 5.91626 21.8337V18.667Z"
                                        />
                                    </svg>
                                )}
                            </div>
                        </div>

                        {/* Text Content */}
                        <h4 className="mb-3 font-semibold text-gray-800 text-theme-xl dark:text-white/90">
                            {isUploading ? "กำลังอัปโหลด..." : (selectedFile ? selectedFile.name : (isDragActive ? "วางไฟล์ที่นี่" : "ลากและวางไฟล์ที่นี่"))}
                        </h4>

                        {/* แสดงข้อผิดพลาดในการอัปโหลด */}
                        {uploadError && (
                            <p className="text-red-500 text-sm mb-2">{uploadError}</p>
                        )}

                        <span className=" text-center mb-5 block w-full max-w-[290px] text-sm text-gray-700 dark:text-gray-400">
                            {selectedFile ? "ไฟล์ที่เลือกพร้อมอัปโหลด" : "ลากและวางไฟล์ PNG, JPG, JPEG ที่นี่ หรือเลือกไฟล์"}
                        </span>

                        <span className="font-medium underline text-theme-sm text-brand-500">
                            เลือกไฟล์
                        </span>
                    </div>
                </form>
            </div>

            <div className="flex justify-end">
                <button
                    onClick={openModal} // เปิด Modal เมื่อคลิกปุ่ม "ยืนยันการอัปโหลด"
                    className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-brand-600 dark:text-white dark:hover:bg-brand-700 dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
                    disabled={isUploading || isLoadingCurrentImage} // ปิดการใช้งานปุ่มขณะโหลด/อัปโหลด
                >
                    ยืนยันการอัปโหลด
                </button>
            </div>

            {/* Modal สำหรับ Preview/แจ้งเตือนการอัปโหลด */}
            <Modal isOpen={isOpen} onClose={handleModalClose} className="max-w-[700px] m-4">
                <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-6 dark:bg-gray-900 lg:p-10">

                    {/* View for Previewing the image */}
                    {(status === 'preview') && (
                        <>
                            <div>
                                {uploadError ? (
                                    <>
                                        <h4 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-white/90">
                                            ดูตัวอย่างรูปภาพของคุณ
                                        </h4>
                                        <span className="flex justify-center text-red-500 pt-10">
                                            อัปโหลดรูปภาพล้มเหลว : {uploadError}
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <h4 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-white/90">
                                            ดูตัวอย่างรูปภาพของคุณ
                                        </h4>
                                        {selectedFile && (
                                            <div className="flex justify-center p-7">
                                                <img
                                                    src={URL.createObjectURL(selectedFile)}
                                                    alt="Preview"
                                                    className="max-w-full max-h-64 object-contain rounded-lg border"
                                                />
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>

                            <div className="flex items-center gap-3 px-2 mt-10 justify-end">
                                {uploadError ? (
                                    <Button size="sm" variant="outline" onClick={handleCancel}>ปิด</Button>
                                ) : (
                                    <>
                                        <Button size="sm" variant="outline" onClick={handleCancel}>ยกเลิก
                                        </Button>
                                        <Button size="sm" onClick={handleSave}>บันทึกรูปภาพ</Button>
                                    </>
                                )}
                            </div>
                        </>
                    )}

                    {/* View for when the image is uploading */}
                    {status === 'uploading' && (
                        <div className="px-2 pr-14 text-center">
                            <h4 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-white/90">กำลังอัปโหลด...</h4>
                            <p>กรุณารอสักครู่</p>
                        </div>
                    )}

                    {/* View for a successful upload */}
                    {status === 'success' && (
                        <>
                            <div>
                                <h4 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-white/90">อัปโหลดรูปภาพสำเร็จ</h4>
                                <p className="flex justify-center py-4 font-semibold text-gray-800 dark:text-white/90">รูปภาพโปรไฟล์ของคุณได้รับการอัปเดตแล้ว</p>
                            </div>

                            <div className="flex items-center mt-6 justify-end">
                                <Button size="sm" onClick={handleCancel}>ตกลง</Button>
                            </div>
                        </>
                    )}

                    {/* View for a failed upload */}
                    {status === 'error' && (
                        <>
                            <div className="px-2 pr-14">
                                <h4 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-white/90">เกิดข้อผิดพลาด</h4>
                                <p className="text-red-500">{uploadError}</p>
                            </div>
                            <div className="flex items-center gap-3 px-2 mt-6 justify-end">
                                <Button size="sm" onClick={handleCancel}>ปิด</Button>
                            </div>
                        </>
                    )}
                </div>

            </Modal>
        </ComponentCard>
    );
};
