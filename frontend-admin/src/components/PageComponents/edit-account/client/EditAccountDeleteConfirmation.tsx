"use client";

import React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAccounts } from "@/contexts/AccountsContext";
import DeleteConfirmationModal from "@/components/ui/modal/DeleteConfirmationModal";
import { useModal } from "@/hooks/useModal";

export default function EditAccountDeleteConfirmation() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const accountId = searchParams.get('id');
    const { deleteAccount } = useAccounts();
    const deleteModal = useModal();

    const handleDelete = async () => {
        if (!accountId) {
            console.warn("[page: edit-account] handleDelete triggered without accountId");
            return;
        }
        try {
            await deleteAccount(accountId, () => {
                // Store success notification in sessionStorage
                sessionStorage.setItem('accountNotification', JSON.stringify({
                    type: 'deleted',
                    title: 'ลบข้อมูลสำเร็จ',
                    message: 'บัญชีผู้ใช้ถูกลบออกจากระบบแล้ว',
                    variant: 'success'
                }));

                // Navigate immediately to listaccounts
                router.replace('/listaccounts');
            });
        } catch (error) {
            console.error("Failed to delete account:", { accountId, error });
        }
    };

    return (
        <>
            <div className="flex justify-start mt-6">
                <button
                    className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-red-600 px-4 py-3 text-sm font-medium text-white shadow-theme-xs hover:bg-red-700 dark:border-gray-700 dark:bg-red-500 dark:text-white dark:hover:bg-red-700 dark:hover:text-gray-200 lg:inline-flex lg:w-auto duration-200 ease-in-out"
                    onClick={deleteModal.openModal}
                >
                    ลบบัญชีผู้ใช้นี้
                </button>
            </div>

            <DeleteConfirmationModal
                isOpen={deleteModal.isOpen}
                onClose={deleteModal.closeModal}
                onConfirm={handleDelete}
                requiredText="I want to delete this account data"
            />
        </>
    );
}