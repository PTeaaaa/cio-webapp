"use client";

import React from "react";
import DeleteConfirmationModal from "@/components/ui/modal/DeleteConfirmationModal";
import { useModal } from "@/hooks/useModal";
import { useAccounts } from "@/contexts/AccountsContext";
import { useSearchParams } from "next/navigation";

export default function EditAccountDeleteConfirmation() {

    const { deleteAccount } = useAccounts();
    const searchParams = useSearchParams();
    const accountId = searchParams.get('id');
    const deleteModal = useModal();

    const handleDelete = async () => {
        if (!accountId) {
            console.warn("[EditAccountDeleteConfirmation] handleDelete triggered without accountId");
            return;
        }
        await deleteAccount(accountId);
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