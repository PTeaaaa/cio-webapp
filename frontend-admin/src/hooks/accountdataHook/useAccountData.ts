"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAccounts } from "@/contexts/AccountsContext";
import { useModal } from "@/hooks/useModal";
import { AccountForm, UpdateAccountPayload } from "@/types";

export function useAccountData() {
    const { isOpen, openModal, closeModal } = useModal();
    const { accounts, updateAccountData, accountsLoading, getAccount } = useAccounts();
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);

    const searchParams = useSearchParams();
    const router = useRouter();
    const accountID = searchParams.get("id") ?? "default";

    // ข้อมูลเดิม (ที่โหลดมาในตอนแรก)
    const [originalData, setOriginalData] = useState<AccountForm | null>(null);
    const [formData, setFormData] = useState<UpdateAccountPayload>({
        username: "",
        role: "",
        isActive: true,
        assignedPlaces: [],
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAccountData = async () => {
            // ตรวจสอบว่า accountID ถูกต้องหรือไม่
            if (!accountID || accountID === "default") {
                console.error('No valid account ID found in URL.');
                setLoading(false);
                return;
            }

            // ตรวจสอบว่าข้อมูลจาก context โหลดเสร็จหรือยัง
            if (accountsLoading) {
                setLoading(true);
                return;
            }

            try {
                setLoading(true);
                
                // หาบัญชีในรายการที่โหลดมาแล้วก่อน
                let foundAccount = accounts.find(a => a.id === accountID);
                
                // หากไม่พบในรายการ ให้ดึงข้อมูลจาก API โดยตรง
                if (!foundAccount) {
                    const accountData = await getAccount(accountID);
                    foundAccount = accountData || undefined;
                }

                if (foundAccount) {
                    // ตั้งค่าข้อมูลเดิมและข้อมูลฟอร์ม
                    setOriginalData(foundAccount);
                    setFormData({
                        username: foundAccount.username,
                        role: foundAccount.role,
                        isActive: foundAccount.isActive,
                        assignedPlaces: foundAccount.assignedPlaces?.map(ap => ap.placeId) || [],
                    });
                } else {
                    console.error(`Account with ID ${accountID} not found!`);
                }
            } catch (error) {
                console.error("Error fetching account data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAccountData();
    }, [accountID, accounts, accountsLoading, getAccount]);

    // ตรวจสอบว่าข้อมูลมีการเปลี่ยนแปลงหรือไม่
    const hasUnsavedChanges = () => {
        if (!originalData) return false;
        const originalFormData = {
            username: originalData.username,
            role: originalData.role,
            isActive: originalData.isActive,
            assignedPlaces: originalData.assignedPlaces?.map(ap => ap.placeId) || [],
        };
        return JSON.stringify(originalFormData) !== JSON.stringify(formData);
    };

    const handleInputChange = (field: keyof UpdateAccountPayload, value: string | boolean | string[]) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSave = async () => {
        // ตรวจสอบว่ามี accountID และ originalData หรือไม่ก่อนทำการบันทึก
        if (accountID && originalData) {
            try {
                const result = await updateAccountData(accountID, formData);
                if (result.success) {
                    console.log("Saving changes...", formData);
                    // อัปเดต original data หลังจากบันทึกสำเร็จ
                    const updatedAccount: AccountForm = {
                        ...originalData,
                        username: formData.username || originalData.username,
                        role: formData.role || originalData.role,
                        isActive: formData.isActive ?? originalData.isActive,
                        assignedPlaces: formData.assignedPlaces ? 
                            formData.assignedPlaces.map((placeId, index) => ({
                                id: index,
                                accountId: originalData.id,
                                placeId,
                                place: {
                                    id: placeId,
                                    name: "Unknown Place", // This will be updated from server response
                                    agency: "Unknown Agency"
                                }
                            })) : originalData.assignedPlaces,
                        updatedAt: new Date()
                    };
                    setOriginalData(updatedAccount);
                    closeModal();
                } else {
                    console.error("Failed to save changes:", result.error);
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
                username: originalData.username,
                role: originalData.role,
                isActive: originalData.isActive,
                assignedPlaces: originalData.assignedPlaces?.map(ap => ap.placeId) || [],
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
