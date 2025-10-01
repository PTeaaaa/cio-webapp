"use client";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import DataEditCard from "@/components-my/edit/account/DataEditCard";
import React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAccounts } from "@/contexts/AccountsContext";

export default function EditAccountPageContent() {

    const searchParams = useSearchParams();
    const router = useRouter();
    const personID = searchParams.get('id');
    const { deleteAccount } = useAccounts();

    const handleDelete = async () => {
        if (!personID) {
            console.warn("[EditAccountPage] handleDelete triggered without personID search param");
            return;
        }

        console.log("[EditAccountPage] attempting delete", { personID });

        try {
            await deleteAccount(personID, () => {
                // Navigate immediately when deletion succeeds
                router.replace('/listaccounts');
            });
            console.log("[EditAccountPage] delete succeeded", { personID });
        } catch (error) {
            console.error("[EditAccountPage] delete failed", { personID, error });
        }
    };

    return (
        <div>
            <PageBreadcrumb pageTitle="ข้อมูลบัญชีผู้ใช้" />
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
                <div className="space-y-6">
                    <DataEditCard />
                </div>
                <div className="flex justify-end mt-6">
                    <button
                        className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-red-600 px-4 py-3 text-sm font-medium text-white shadow-theme-xs hover:bg-red-700 dark:border-gray-700 dark:bg-red-500 dark:text-white dark:hover:bg-red-700 dark:hover:text-gray-200 lg:inline-flex lg:w-auto duration-200 ease-in-out"
                        onClick={handleDelete}
                    >
                        ลบรายชื่อและข้อมูลส่วนตัว
                    </button>
                </div>
            </div>
        </div>
    );
}
