"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useModal } from "../../hooks/useModal";
import { useDropzone } from "react-dropzone";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import ComponentCard from '@/components/common/ComponentCard';
import { getSidebarItems } from "@/services/sidebar/sidebarAPI";
import { createPerson } from "@/services/peopleAPI/peopleAPI";
import { CreatePersonPayload, PersonForm, Place } from "@/types";
import { uploadPersonImage } from "@/services/uploadAPI/uploadAPI"; // นำเข้าฟังก์ชันอัปโหลดรูปภาพ

export default function AddNewDataCard() {
    const router = useRouter();
    const [places, setPlaces] = useState<Place[]>([]);
    const [isLoading, setIsLoading] = useState(false); // สถานะการโหลดสำหรับการสร้างบุคคล
    const [error, setError] = useState<string | null>(null); // ข้อผิดพลาดสำหรับการสร้างบุคคล

    // State สำหรับข้อมูลฟอร์มบุคคล
    const [formData, setFormData] = useState<CreatePersonPayload>({
        prefix: "",
        name: "",
        surname: "",
        email: "",
        phone: "",
        position: "",
        placeId: "",
        department: "",
        year: new Date().getFullYear(),
    });

    // State สำหรับการอัปโหลดรูปภาพ
    const [selectedFile, setSelectedFile] = useState<File | null>(null); // เก็บไฟล์ที่เลือกจาก Dropzone
    const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null); // เก็บ URL รูปภาพที่อัปโหลดสำเร็จ (สำหรับแสดงใน Modal)
    const [imageUploadLoading, setImageUploadLoading] = useState(false); // สถานะการโหลดของการอัปโหลดรูปภาพ
    const [imageUploadError, setImageUploadError] = useState<string | null>(null); // ข้อผิดพลาดในการอัปโหลดรูปภาพ

    // Modal สำหรับแจ้งเตือนการอัปโหลดรูปภาพ
    const { isOpen: isUploadModalOpen, openModal: openUploadModal, closeModal: closeUploadModal } = useModal();

    // useEffect สำหรับดึงข้อมูลสถานที่สำหรับ Dropdown
    useEffect(() => {
        const fetchPlaces = async () => {
            try {
                const availablePlaces = await getSidebarItems();
                setPlaces(availablePlaces)
            }
            catch (err: unknown) { // ระบุ type เป็น unknown เพื่อความปลอดภัยของ Type
                const errorMessage = err instanceof Error ? err.message : String(err);
                console.error("Failed to fetch places for dropdown", errorMessage);
                setError("ไม่สามารถโหลดหน่วยงานได้ กรุณาลองใหม่ภายหลัง");
            }
        };
        fetchPlaces();
    }, []);

    // handleInputChange: จัดการการเปลี่ยนแปลงค่าใน Input fields
    const handleInputChange = (field: keyof CreatePersonPayload, value: string | number) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // handleSave: จัดการการบันทึกข้อมูลบุคคลและการอัปโหลดรูปภาพ
    const handleSave = async () => {
        // ตรวจสอบข้อมูลที่จำเป็น
        if (!formData.name || !formData.surname || !formData.email || !formData.placeId || !formData.year) {
            alert("ข้อมูลที่จำเป็นยังถูกกรอกไม่ครบ กรุณากรอกข้อมูลที่จำเป็น"); // ควรเปลี่ยนเป็น Modal/Toast
            return;
        }

        setIsLoading(true); // เริ่มสถานะโหลดสำหรับการสร้างบุคคล
        setError(null); // เคลียร์ข้อผิดพลาดเก่า

        let newPerson: PersonForm | null = null; // กำหนด Type เป็น PersonForm

        try {
            // 1. สร้างข้อมูลบุคคลใหม่
            newPerson = await createPerson(formData); // createPerson ควรคืนค่า PersonForm ที่มี ID
            alert("สร้างบุคคลสำเร็จ!"); // ควรเปลี่ยนเป็น Modal/Toast

            // 2. หากมีไฟล์รูปภาพถูกเลือก ให้ทำการอัปโหลด
            if (selectedFile && newPerson?.id) { // ตรวจสอบว่ามีไฟล์และได้ ID บุคคลแล้ว
                setImageUploadLoading(true); // เริ่มสถานะโหลดสำหรับการอัปโหลดรูปภาพ
                setImageUploadError(null); // เคลียร์ข้อผิดพลาดเก่า
                try {
                    // เรียกฟังก์ชันอัปโหลดรูปภาพไปยัง Backend
                    const url = await uploadPersonImage(selectedFile, newPerson.id);
                    setUploadedImageUrl(url); // เก็บ URL รูปภาพที่อัปโหลดสำเร็จ
                    openUploadModal(); // เปิด Modal แจ้งเตือนเมื่ออัปโหลดรูปภาพสำเร็จ
                } catch (imgErr: unknown) {
                    const errorMessage = imgErr instanceof Error ? imgErr.message : String(imgErr);
                    setImageUploadError(`อัปโหลดรูปภาพไม่สำเร็จ: ${errorMessage}`);
                    console.error("Error uploading image:", errorMessage);
                    alert(`อัปโหลดรูปภาพไม่สำเร็จ: ${errorMessage}`); // ควรเปลี่ยนเป็น Modal/Toast
                } finally {
                    setImageUploadLoading(false); // สิ้นสุดสถานะโหลดสำหรับการอัปโหลดรูปภาพ
                }
            } else {
                // ถ้าไม่มีไฟล์รูปภาพ หรือไม่มี ID บุคคล (ไม่ควรเกิดขึ้นถ้า createPerson สำเร็จ)
                // ก็ทำการนำทางไปยังหน้าต่อไปเลย
                router.push(`/listpeople/${formData.placeId}`);
            }

        } catch (err: unknown) { // ระบุ type เป็น unknown เพื่อความปลอดภัยของ Type
            const errorMessage = err instanceof Error ? err.message : String(err);
            setError(`บันทึกข้อมูลไม่สำเร็จ: ${errorMessage}`);
            console.error("Error saving person:", errorMessage);
        } finally {
            setIsLoading(false); // สิ้นสุดสถานะโหลดสำหรับการสร้างบุคคล
            // การนำทางจะถูกจัดการใน handlePhotoSave/handleModalClose หรือใน else block ด้านบน
        }
    };

    // handleCancel: จัดการการยกเลิก
    const handleCancel = () => {
        router.back();
    };

    // onDrop function: จัดการเมื่อผู้ใช้ลากและวางไฟล์ใน Dropzone
    const onDrop = (acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];

            // ตรวจสอบขนาดไฟล์ (จำกัดที่ 5MB)
            const MAX_FILE_SIZE_MB = 5;
            if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
                alert(`ขนาดไฟล์ควรน้อยกว่า ${MAX_FILE_SIZE_MB}MB`); // ควรเปลี่ยนเป็น Modal/Toast
                setSelectedFile(null); // เคลียร์ไฟล์ที่เลือก
                setImageUploadError(`ขนาดไฟล์ใหญ่เกินไป (สูงสุด ${MAX_FILE_SIZE_MB}MB)`);
                return;
            }

            setSelectedFile(file); // เก็บไฟล์ที่เลือกไว้ใน State
            setUploadedImageUrl(null); // เคลียร์ URL เก่าถ้ามี
            setImageUploadError(null); // เคลียร์ Error เก่าถ้ามี
            console.log("File selected:", file.name);
        }
    };

    // useDropzone hook สำหรับจัดการ Dropzone functionality
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "image/png": [],
            "image/jpeg": [],
            "image/jpg": [],
            // "image/webp": [], // หากต้องการรองรับ webp ให้เปิดคอมเมนต์
            // "image/svg+xml": [], // หากต้องการรองรับ svg ให้เปิดคอมเมนต์
        },
        maxFiles: 1, // อนุญาตให้อัปโหลดได้ทีละ 1 ไฟล์
    });

    // handlePhotoSave: จัดการเมื่อผู้ใช้กดปุ่ม "บันทึกรูปภาพ" ใน Modal (หลังจากอัปโหลดสำเร็จ)
    const handlePhotoSave = () => {
        closeUploadModal(); // ปิด Modal
        router.push(`/listpeople/${formData.placeId}`); // นำทางไปยังหน้า listpeople
    };

    // handleModalClose: จัดการเมื่อผู้ใช้กดปุ่ม "เข้าใจแล้ว" หรือปิด Modal
    const handleModalClose = () => {
        closeUploadModal(); // ปิด Modal
        router.push(`/listpeople/${formData.placeId}`); // นำทางไปยังหน้า listpeople
    }

    return (
        <>
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                <ComponentCard title="ข้อมูลส่วนตัว" className="w-full">
                    <div className="gap-x-6 gap-y-6 px-2 grid grid-cols-1 md:grid-cols-2">
                        <div>
                            <Label>คำนำหน้า</Label>
                            <Input
                                type="text"
                                placeholder="ตัวอย่าง : นาง นายแพทย์"
                                defaultValue={formData.prefix}
                                onChange={(e) => handleInputChange('prefix', e.target.value)}
                            />
                        </div>
                        <div>
                            <Label>ชื่อ<span className="text-red-500">*</span></Label>
                            <Input
                                type="text"
                                placeholder="ตัวอย่าง : พรสวรรค์"
                                defaultValue={formData.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                            />
                        </div>
                        <div>
                            <Label>นามสกุล<span className="text-red-500">*</span></Label>
                            <Input
                                type="text"
                                placeholder="ตัวอย่าง : ก้อยสุวรรณ"
                                defaultValue={formData.surname}
                                onChange={(e) => handleInputChange('surname', e.target.value)}
                            />
                        </div>
                        <div className="">
                            <Label>ตำแหน่งตามหน่วยงานที่สังกัด<span className="text-red-500">*</span></Label>
                            <Input
                                type="text"
                                placeholder="ตัวอย่าง : ผู้อำนวยการสำนักนโยบายและยุทธศาสตร์"
                                defaultValue={formData.position}
                                onChange={(e) => handleInputChange('position', e.target.value)}
                            />
                        </div>
                        <div>
                            <Label>อีเมล<span className="text-red-500">*</span></Label>
                            <Input
                                type="email"
                                placeholder="ตัวอย่าง : fishstop@ussr.com"
                                defaultValue={formData.email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                            />
                        </div>
                        <div>
                            <Label>เบอร์โทรศัพท์</Label>
                            <Input
                                type="text"
                                placeholder="ตัวอย่าง : 02 000 0000"
                                defaultValue={formData.phone}
                                onChange={(e) => handleInputChange('phone', e.target.value)}
                            />
                        </div>

                        <div className="">
                            <Label>หน่วยงานที่สังกัด<span className="text-red-500">*</span></Label>
                            <select
                                name="placeId"
                                onChange={(e) => {
                                    const selectedPlaceId = e.target.value;
                                    const selectedPlace = places.find(place => place.id === selectedPlaceId);

                                    if (selectedPlace) {
                                        setFormData(prev => ({
                                            ...prev,
                                            placeId: selectedPlace.id,
                                            department: selectedPlace.name,
                                        }));
                                    }
                                }}
                                className="w-full p-2.5 border rounded-lg bg-white dark:bg-gray-900 dark:border-gray-700 text-gray-400 dark:text-white/30 text-sm"
                                required
                            >
                                <option value="">กรุณาเลือกหน่วยงาน</option>
                                {places.map((place) => (
                                    <option key={place.id} value={place.id}>
                                        {place.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <Label>ปีที่ดำรงตำแหน่ง<span className="text-red-500">*</span></Label>
                            <Input
                                type="number"
                                placeholder="ตัวอย่าง : 2567"
                                defaultValue={formData.year.toString()}
                                onChange={(e) => handleInputChange('year', parseInt(e.target.value) || new Date().getFullYear())}
                            />
                        </div>
                    </div>
                </ComponentCard>
            </div>


            {/* Image upload section */}

            <ComponentCard title="อัปโหลดรูปภาพ">
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
                                {imageUploadLoading ? "กำลังอัปโหลด..." : (selectedFile ? selectedFile.name : (isDragActive ? "วางไฟล์ที่นี่" : "ลากและวางไฟล์ที่นี่"))}
                            </h4>

                            {/* แสดงข้อผิดพลาดในการอัปโหลด */}
                            {imageUploadError && (
                                <p className="text-red-500 text-sm mb-2">{imageUploadError}</p>
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

                {/* Modal สำหรับ Preview/แจ้งเตือนการอัปโหลด */}
                <Modal isOpen={isUploadModalOpen} onClose={handleModalClose} className="max-w-[700px] m-4">
                    <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
                        <div className="px-2 pr-14">
                            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                                {imageUploadLoading ? "กำลังอัปโหลดรูปภาพ..." : (imageUploadError ? "เกิดข้อผิดพลาด" : "รูปภาพของคุณถูกอัปโหลดแล้ว")}
                            </h4>
                            {uploadedImageUrl && !imageUploadLoading && !imageUploadError && (
                                <div className="mt-4 flex justify-center">
                                    <img src={uploadedImageUrl} alt="Uploaded Preview" className="max-w-full h-48 object-contain rounded-lg" />
                                </div>
                            )}
                            {imageUploadError && (
                                <p className="text-red-500 mt-2">{imageUploadError}</p>
                            )}
                        </div>
                        <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                            <Button size="sm" variant="outline" onClick={handleModalClose} disabled={imageUploadLoading}>
                                เข้าใจแล้ว
                            </Button>
                            <Button size="sm" onClick={handlePhotoSave} disabled={imageUploadLoading}>
                                เข้าใจแล้วเหมือนกันแค่สีม่วง
                            </Button>
                        </div>
                    </div>
                </Modal>
            </ComponentCard>

            <div className="flex justify-end gap-4 mt-6">
                <Button
                    variant="outline"
                    onClick={handleCancel}
                >
                    ยกเลิก
                </Button>
                <Button
                    variant="primary"
                    onClick={handleSave}
                    disabled={isLoading || imageUploadLoading} // ปิดการใช้งานปุ่มขณะโหลด/อัปโหลด
                >
                    {isLoading ? "กำลังบันทึก..." : "บันทึก"}
                </Button>
            </div>
        </>
    );
}
