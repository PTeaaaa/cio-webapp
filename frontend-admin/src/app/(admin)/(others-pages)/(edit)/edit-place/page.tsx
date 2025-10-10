"use client";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import DataEditCard from "@/components-my/edit/place/PlaceDataEditCard";
import React from "react";
import DeleteConfirmationModal from "@/components/ui/modal/DeleteConfirmationModal";
import { useModal } from "@/hooks/useModal";
import { usePlaceForm } from "@/hooks/useAddPlace";

export default function EditAccountPageContent() {

    const deleteModal = useModal();
    const { handleDelete } = usePlaceForm();

    return (
        <div>
            <PageBreadcrumb pageTitle="ข้อมูลหน่วยงาน" />
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
                <div className="space-y-6">
                    <DataEditCard />
                </div>
                <div className="flex justify-start mt-6">
                    <button
                        className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-red-600 px-4 py-3 text-sm font-medium text-white shadow-theme-xs hover:bg-red-700 dark:border-gray-700 dark:bg-red-500 dark:text-white dark:hover:bg-red-700 dark:hover:text-gray-200 lg:inline-flex lg:w-auto duration-200 ease-in-out"
                        onClick={deleteModal.openModal}
                    >
                        ลบหน่วยงานนี้
                    </button>
                </div>
            </div>

            <DeleteConfirmationModal
                isOpen={deleteModal.isOpen}
                onClose={deleteModal.closeModal}
                onConfirm={handleDelete}
                requiredText="I want to delete this place data"
            />
        </div>
    );
}
