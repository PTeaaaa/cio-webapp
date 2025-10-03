"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useModal } from "@/hooks/useModal";
import { Place, UpdatePlacePayload } from "@/types";
import { getAllPlaces, getPlaceById, updatePlaceById } from "@/services/places/placesAPI";

export function usePlaceLogic() {
    const { isOpen, openModal, closeModal } = useModal();
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);

    const [places, setPlaces] = useState<Place[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const searchParams = useSearchParams();
    const placeId = searchParams.get("id") ?? "default";

    useEffect(() => {
        const fetchPlaces = async () => {
            try {
                setIsLoading(true);
                const data = await getAllPlaces();
                if (data) {
                    setPlaces(data);
                } else {
                    setError("Failed to fetch accounts");
                }
            } catch (err) {
                setError("Error fetching accounts");
                console.error("Error fetching accounts:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPlaces();
    }, []);

    // ข้อมูลเดิม (ที่โหลดมาในตอนแรก)
    const [originalData, setOriginalData] = useState<Place | null>(null);
    const [formData, setFormData] = useState<UpdatePlacePayload>({
        name: "",
        agency: "",
    });

    useEffect(() => {
        const fetchAccountData = async () => {
            // ตรวจสอบว่า placeId ถูกต้องหรือไม่
            if (!placeId || placeId === "default") {
                console.error('No valid place ID found in URL.');
                setOriginalData(null);
                setIsLoading(false);
                return;
            }

            // รอให้ places โหลดเสร็จก่อน
            if (places.length === 0 && isLoading) {
                return;
            }

            try {
                setIsLoading(true);

                // หาบัญชีในรายการที่โหลดมาแล้วก่อน
                let foundPlace = places.find(place => place.id === placeId);

                // หากไม่พบในรายการ ให้ดึงข้อมูลจาก API โดยตรง
                if (!foundPlace) {
                    const placeData = await getPlaceById(placeId);
                    foundPlace = placeData || undefined;
                }

                if (foundPlace) {
                    // ตั้งค่าข้อมูลเดิมและข้อมูลฟอร์ม
                    setOriginalData(foundPlace);
                    setFormData({
                        name: foundPlace.name,
                        agency: foundPlace.agency,
                    });
                } else {
                    // ไม่พบข้อมูล - ตั้งค่า originalData เป็น null
                    console.error(`Place with ID ${placeId} not found!`);
                    setOriginalData(null);
                }
            } catch (error) {
                console.error("Error fetching place data:", error);
                setOriginalData(null);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAccountData();
    }, [placeId, places]);

    // ตรวจสอบว่าข้อมูลมีการเปลี่ยนแปลงหรือไม่
    const hasUnsavedChanges = () => {
        if (!originalData) return false;
        const originalFormData = {
            name: originalData.name,
            agency: originalData.agency,
        };
        return JSON.stringify(originalFormData) !== JSON.stringify(formData);
    };

    const handleInputChange = (field: keyof UpdatePlacePayload, value: string | boolean | string[]) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSave = async () => {
        // ตรวจสอบว่ามี accountID และ originalData หรือไม่ก่อนทำการบันทึก
        if (placeId && originalData) {
            try {
                const result = await updatePlaceById(placeId, formData);

                if (result) {

                    // อัปเดต original data หลังจากบันทึกสำเร็จ
                    const updatePlace: Place = {
                        ...originalData,
                        name: formData.name || originalData.name,
                        agency: formData.agency || originalData.agency,
                    };

                    setOriginalData(updatePlace);
                    closeModal();
                }

            } catch (error) {
                console.error("Failed to save changes:", error);
            }
        }
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

        // ตั้งค่า form data กลับเป็นค่าเดิม
        if (originalData) {
            setFormData({
                name: originalData.name,
                agency: originalData.agency,
            });
        }

        closeModal();
    };

    const handleCancelClose = () => {
        setShowConfirmDialog(false);
    };

    // ส่งคืนค่าและฟังก์ชันที่คอมโพเนนต์จะนำไปใช้
    return {
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
        isLoading,
    };
}
