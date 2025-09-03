"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { usePeople } from "@/contexts/PeopleContext";
import { useModal } from "@/hooks/useModal";
import { PersonForm, UpdatePersonPayload } from "@/types";

export function useAccountData() {
    const { isOpen, openModal, closeModal } = useModal();
    const { people, updatePerson, loading: contextLoading, placeId } = usePeople();
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);

    const searchParams = useSearchParams();
    const router = useRouter();
    const personID = searchParams.get("id") ?? "default";

    // ข้อมูลเดิม (ที่โหลดมาในตอนแรก)
    const [originalData, setOriginalData] = useState<PersonForm | null>(null);
    const [formData, setFormData] = useState<UpdatePersonPayload>({
        prefix: "",
        name: "",
        surname: "",
        email: "",
        phone: "",
        position: "",
        placeId: "",
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // ตรวจสอบว่า personID ถูกต้องหรือไม่
        // if (!personID || personID === "default") {
        //     console.error('No valid person ID found in URL.');
        //     router.push(`/listpeople/asdf`);
        //     // /edit?id=${personID}&placeId=${placeId}
        //     return;
        // }

        // ตรวจสอบว่าข้อมูลจาก context โหลดเสร็จหรือยัง
        if (contextLoading) {
            setLoading(true);
            return;
        }

        // หากข้อมูล people โหลดแล้ว ให้ค้นหาบุคคล
        const foundPerson = people.find(p => p.id === personID);
        
        if (foundPerson) {
            // สร้าง object PersonForm เพื่อใช้ตั้งค่า state
            const personFormData: PersonForm = {
                id: foundPerson.id,
                prefix: foundPerson.prefix || "",
                name: foundPerson.name,
                surname: foundPerson.surname,
                email: foundPerson.email || "",
                phone: foundPerson.phone || "",
                position: foundPerson.position || "",
                imageUrl: foundPerson.imageUrl,
                placeId: foundPerson.placeId || "",
                department:foundPerson.department,
                year: foundPerson.year,
            };

            // ตั้งค่าข้อมูลเดิมและข้อมูลฟอร์ม
            setOriginalData(personFormData);
            setFormData({
                prefix: personFormData.prefix,
                name: personFormData.name,
                surname: personFormData.surname,
                email: personFormData.email,
                phone: personFormData.phone,
                position: personFormData.position,
                placeId: personFormData.placeId,
            });
            setLoading(false); // ตั้งค่า loading เป็น false หลังจากโหลดข้อมูลเสร็จ
        } else {
            // console.error(`Person with ID ${personID} not found!`);
            // // หากไม่พบบุคคล ให้ redirect ไปหน้า not-found
            // router.push(`/listpeople/asdf`);
            setLoading(false); // ตั้งค่า loading เป็น false เพื่อหยุดการโหลด
        }
    }, [personID, people, contextLoading, router]);

    // ตรวจสอบว่าข้อมูลมีการเปลี่ยนแปลงหรือไม่
    const hasUnsavedChanges = () => {
        if (!originalData) return false;
        const originalFormData = {
            prefix: originalData.prefix,
            name: originalData.name,
            surname: originalData.surname,
            email: originalData.email,
            phone: originalData.phone,
            position: originalData.position,
            placeId: originalData.placeId,
        };
        return JSON.stringify(originalFormData) !== JSON.stringify(formData);
    };

    const handleInputChange = (field: keyof UpdatePersonPayload, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSave = async () => {
        // ตรวจสอบว่ามี personID และ originalData หรือไม่ก่อนทำการบันทึก
        if (personID && originalData) {
            try {
                await updatePerson(personID, formData);
                console.log("Saving changes...", formData);
                // อัปเดต original data หลังจากบันทึกสำเร็จ
                setOriginalData({ ...originalData, ...formData });
                closeModal();
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
                prefix: originalData.prefix,
                name: originalData.name,
                surname: originalData.surname,
                email: originalData.email,
                phone: originalData.phone,
                position: originalData.position,
                placeId: originalData.placeId,
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
        loading,
    };
}
