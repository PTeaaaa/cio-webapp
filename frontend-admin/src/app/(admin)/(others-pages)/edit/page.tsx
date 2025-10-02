"use client";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import InfoEditCard from "@/components-my/edit/person/InfoEditCard";
import PhotoEditCard from "@/components-my/edit/person/PhotoEditCard";
import React from "react";
import { PeopleProvider, usePeople } from "@/contexts/PeopleContext";
import { useSearchParams, useRouter } from "next/navigation";
import { useModal } from "@/hooks/useModal";
import DeleteConfirmationModal from "@/components/ui/modal/DeleteConfirmationModal";

function EditPageContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const personId = searchParams.get('id');
    const placeId = searchParams.get('placeId');
    const { deletePerson: contextDeletePerson } = usePeople();
    const deleteModal = useModal();

    const handleDelete = async () => {
        if (!personId) {
            console.warn("[page: edit] handleDelete triggered without personId");
            return;
        }

        try {
            await contextDeletePerson(personId, () => {
                router.replace(`/listpeople/${placeId}`);
            });
        } catch (error) {
            console.error("Failed to delete person:", { personId, error });
        }
    };

    return (
        <div>
            <PageBreadcrumb pageTitle="แก้ไขข้อมูล" />
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
                <div className="space-y-6">
                    <InfoEditCard />
                    <PhotoEditCard />
                </div>
                <div className="flex justify-start mt-6">
                    <button
                        className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-red-600 px-4 py-3 text-sm font-medium text-white shadow-theme-xs hover:bg-red-700 dark:border-gray-700 dark:bg-red-500 dark:text-white dark:hover:bg-red-700 dark:hover:text-gray-200 lg:inline-flex lg:w-auto duration-200 ease-in-out"
                        onClick={deleteModal.openModal}
                    >
                        ลบรายชื่อและข้อมูลส่วนตัว
                    </button>
                </div>
            </div>

            <DeleteConfirmationModal
                isOpen={deleteModal.isOpen}
                onClose={deleteModal.closeModal}
                onConfirm={handleDelete}
                requiredText="I want to delete this people information"
            />
        </div>
    );
}

export default function EditPage() {
    const searchParams = useSearchParams();
    const placeId = searchParams.get('placeId');

    return (
        <PeopleProvider initialPlaceId={placeId || undefined}>
            <EditPageContent />
        </PeopleProvider>
    );
}
