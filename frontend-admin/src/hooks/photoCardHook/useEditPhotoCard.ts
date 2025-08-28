"use client";

import { useState, useEffect } from "react";
import { useModal } from "@/hooks/useModal";
// import { usePeople } from "@/context/PeopleContext"; // ไม่จำเป็นต้องใช้ updatePerson จาก usePeople แล้ว
import { useSearchParams } from "next/navigation";
import { useDropzone } from "react-dropzone";
import { uploadPersonImage } from "@/services/upload/uploadAPI"; // นำเข้าฟังก์ชันอัปโหลดรูปภาพ
import { getPersonByPersonId } from "@/services/people/peopleAPI"; // นำเข้าฟังก์ชันดึงข้อมูลบุคคล

type ModalStatus = 'preview' | 'uploading' | 'success' | 'error';

export function useEditPhotoCard() {
    const searchParams = useSearchParams();
    const personID = searchParams.get("id"); // ได้รับ personID จาก URL

    const [selectedFile, setSelectedFile] = useState<File | null>(null); // เก็บไฟล์ที่ผู้ใช้เลือก
    const [currentImage, setCurrentImage] = useState<string>(""); // URL ของรูปภาพปัจจุบัน
    const [isUploading, setIsUploading] = useState<boolean>(false); // สถานะการอัปโหลด
    const [uploadError, setUploadError] = useState<string | null>(null); // ข้อผิดพลาดในการอัปโหลด
    const [isLoadingCurrentImage, setIsLoadingCurrentImage] = useState<boolean>(true); // สถานะการโหลดรูปภาพปัจจุบัน
    const [status, setStatus] = useState<ModalStatus>('preview');

    // Modal state สำหรับ Preview/แจ้งเตือนการอัปโหลด
    const { isOpen, openModal, closeModal } = useModal();

    // โหลด URL รูปภาพปัจจุบันของบุคคลจาก Backend
    useEffect(() => {
        const fetchCurrentImage = async () => {
            if (!personID) {
                setIsLoadingCurrentImage(false);
                return;
            }

            setIsLoadingCurrentImage(true);
            try {
                const personData = await getPersonByPersonId(personID); // ดึงข้อมูลบุคคลจาก Backend

                if (personData && personData.imageUrl) {
                    setCurrentImage(personData.imageUrl); // ตั้งค่า URL รูปภาพที่ได้จาก Backend
                } else {
                    setCurrentImage(""); // ไม่มีรูปภาพปัจจุบัน
                }
            } catch (error) {
                console.error("Error fetching current person image:", error);
                setUploadError("ไม่สามารถโหลดรูปภาพปัจจุบันได้");
                setCurrentImage(""); // ตั้งค่าเป็นว่างเปล่าหากเกิดข้อผิดพลาด
            } finally {
                setIsLoadingCurrentImage(false);
            }
        };

        fetchCurrentImage();
    }, [personID]); // ให้ทำงานใหม่เมื่อ personID เปลี่ยน

    // onDrop จะแค่เก็บไฟล์ที่เลือกไว้ใน State
    const onDrop = async (acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];

            // ตรวจสอบขนาดไฟล์ (จำกัดที่ 2MB)
            if (file.size > 5 * 1024 * 1024) {
                alert("ขนาดไฟล์ควรน้อยกว่า 2MB"); // ใช้ alert ชั่วคราว, ควรเปลี่ยนเป็น Modal/Toast
                setSelectedFile(null); // เคลียร์ไฟล์ที่เลือก
                setUploadError("ขนาดไฟล์ใหญ่เกินไป (สูงสุด 5MB)");
                return;
            }

            setSelectedFile(file); // เก็บไฟล์ที่เลือก
            setUploadError(null); // เคลียร์ข้อผิดพลาดเก่า
            // ไม่ต้องแปลงเป็น base64 และเปิด Modal ทันที
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "image/png": [],
            "image/jpeg": [],
            "image/jpg": [],
            // "image/webp": [], // หากต้องการรองรับ webp ให้เปิดคอมเมนต์
            // "image/svg+xml": [], // หากต้องการรองรับ svg ให้เปิดคอมเมนต์
        },
        maxFiles: 1,
    });

    // handleSave จะรับผิดชอบการอัปโหลดไฟล์ไปยัง Backend
    const handleSave = async () => {
        if (!personID) {
            setUploadError("ไม่พบ ID บุคคล");
            return;
        }
        if (!selectedFile) {
            setUploadError("กรุณาเลือกไฟล์รูปภาพก่อนบันทึก");
            return;
        }

        setIsUploading(true); // เริ่มสถานะการโหลด
        setUploadError(null); // เคลียร์ข้อผิดพลาดเก่า
        setStatus('uploading');

        try {
            // เรียกใช้ฟังก์ชันอัปโหลดรูปภาพไปยัง Backend
            const newImageUrl = await uploadPersonImage(selectedFile, personID);

            // อัปเดต State ของรูปภาพปัจจุบันด้วย URL ใหม่ที่ได้จาก Backend
            setCurrentImage(newImageUrl);
            setSelectedFile(null); // เคลียร์ไฟล์ที่เลือกหลังจากอัปโหลดสำเร็จ
            setStatus('success');
            
            console.log("Photo updated successfully! New URL:", newImageUrl);

        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            setUploadError(`อัปโหลดรูปภาพไม่สำเร็จ: ${errorMessage}`);
            setStatus('error');
            console.error("Error uploading photo:", error);
            // ไม่ต้องปิด Modal ทันที เพื่อให้ผู้ใช้เห็นข้อผิดพลาด
        } finally {
            setIsUploading(false); // สิ้นสุดสถานะการโหลด
        }
    };

    const handleCancel = () => {
        setSelectedFile(null); // เคลียร์ไฟล์ที่เลือก
        setUploadError(null); // เคลียร์ข้อผิดพลาด
        setStatus('preview');
        closeModal(); // ปิด Modal
    };

    return {
        currentImage,
        isOpen, // Modal state
        getRootProps,
        getInputProps,
        isDragActive,
        openModal, // เปิด Modal (ตอนนี้จะถูกเรียกด้วยปุ่ม "ยืนยันการอัปโหลด" ใน PhotoEditCard)
        handleSave, // บันทึกและอัปโหลด
        handleCancel, // ยกเลิกการเลือก/อัปโหลด
        selectedFile, // ไฟล์ที่เลือก (สำหรับแสดงพรีวิวใน UI)
        isUploading, // สถานะการโหลด
        uploadError, // ข้อผิดพลาด
        isLoadingCurrentImage, // สถานะการโหลดรูปภาพปัจจุบัน
        status,
    };
}
