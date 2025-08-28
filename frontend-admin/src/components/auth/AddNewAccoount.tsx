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
import { getSidebarItems } from "@/services/sidebars/sidebarAPI";
import { createPerson } from "@/services/people/peopleAPI";
import { CreatePersonPayload, PersonForm, Place } from "@/types";
import { uploadPersonImage } from "@/services/upload/uploadAPI"; // นำเข้าฟังก์ชันอัปโหลดรูปภาพ

export default function AddNewAccount() {
    const router = useRouter();
    const [places, setPlaces] = useState<Place[]>([]);
    const [isLoading, setIsLoading] = useState(false); // สถานะการโหลดสำหรับการสร้างบุคคล
    const [error, setError] = useState<string | null>(null); // ข้อผิดพลาดสำหรับการสร้างบุคคล

    // Updated state for multiple places selection
    const [selectedPlaces, setSelectedPlaces] = useState<Place[]>([]);

    // State สำหรับข้อมูลฟอร์มบุคคล - remove placeId since we're using multiple places
    const [formData, setFormData] = useState<Omit<CreatePersonPayload, 'placeId'> & { accountType?: string }>({
        prefix: "",
        name: "",
        surname: "",
        email: "",
        phone: "",
        position: "",
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
    const handleInputChange = (field: keyof (Omit<CreatePersonPayload, 'placeId'> & { accountType?: string }), value: string | number) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // Handle adding a place to selection
    const handlePlaceSelect = (placeId: string) => {
        const selectedPlace = places.find(place => place.id === placeId);
        if (selectedPlace && !selectedPlaces.find(p => p.id === placeId)) {
            setSelectedPlaces(prev => [...prev, selectedPlace]);
        }
    };

    // Handle removing a place from selection
    const handlePlaceRemove = (placeId: string) => {
        setSelectedPlaces(prev => prev.filter(place => place.id !== placeId));
    };

    // Get available places (not yet selected)
    const getAvailablePlaces = () => {
        return places.filter(place => !selectedPlaces.find(selected => selected.id === place.id));
    };

    // handleSave: จัดการการบันทึกข้อมูลบุคคลและการอัปโหลดรูปภาพ
    const handleSave = async () => {
        // ตรวจสอบข้อมูลที่จำเป็น - updated validation for multiple places
        if (!formData.name || !formData.surname || !formData.email || selectedPlaces.length === 0 || !formData.year) {
            alert("ข้อมูลที่จำเป็นยังถูกกรอกไม่ครบ กรุณากรอกข้อมูลที่จำเป็น"); // ควรเปลี่ยนเป็น Modal/Toast
            return;
        }

        setIsLoading(true); // เริ่มสถานะโหลดสำหรับการสร้างบุคคล
        setError(null); // เคลียร์ข้อผิดพลาดเก่า

        try {
            // For now, use the first selected place as primary place
            // You might need to modify your backend to handle multiple places
            const primaryPlace = selectedPlaces[0];
            const personData = {
                ...formData,
                placeId: primaryPlace.id,
                department: primaryPlace.name
            };

            const newPerson = await createPerson(personData); // createPerson ควรคืนค่า PersonForm ที่มี ID
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
                router.push(`/listpeople/${primaryPlace.id}`);
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


    return (
        <>
            <div className="flex flex-col items-center lg:justify-between pb-7 lg:py-7">
                <ComponentCard title="ลงทะเบียนบัญชีผู้ใช้" className="w-full lg:w-[70%]">
                    
                    <div className="gap-x-6 gap-y-6 px-2 grid grid-cols-1">
                        <div>
                            <Label>Username<span className="text-red-500">{" *"}</span></Label>
                            <Input
                                type="text"
                                placeholder="Username"
                                defaultValue={formData.prefix}
                                onChange={(e) => handleInputChange('prefix', e.target.value)}
                            />
                        </div>

                        <div>
                            <Label>Password<span className="text-red-500">{" *"}</span></Label>
                            <Input
                                type="password"
                                placeholder="Password"
                                defaultValue={formData.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                            />
                        </div>

                        <div className="">
                            <Label>ประเภทของบัญชี<span className="text-red-500">{" *"}</span></Label>
                            <select
                                name="accountType"
                                onChange={(e) => {
                                    handleInputChange('accountType', e.target.value);
                                }}
                                className="w-full p-2.5 border rounded-lg bg-white dark:bg-gray-900 dark:border-gray-700 text-gray-400 dark:text-white/30 text-sm"
                                required
                            >
                                <option value="">กรุณาเลือกประเภทของบัญชี</option>
                                <option value="admin">Admin</option>
                                <option value="user">User</option>
                            </select>
                        </div>

                        <div className="">
                            <Label>หน่วยงานที่มอบหมาย<span className="text-red-500">{" *"}</span></Label>

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
                                    {index === selectedPlaces.length - 1 && getAvailablePlaces().length > 0 && (
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
                                                {getAvailablePlaces().map((place) => (
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
                            )}

                        </div>

                    </div>
                </ComponentCard>
            </div>

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
