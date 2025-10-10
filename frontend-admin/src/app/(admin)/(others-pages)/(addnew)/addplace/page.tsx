import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import AddNewPlace from "@/components/addnew/place/AddNewPlace";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
    title: "CIOSite - Edit",
    description:
        "This is CIOSite editing page.",
};

export default function EditPage() {
    return (
        <div>
            <PageBreadcrumb pageTitle="เพิ่มข้อมูลใหม่" />
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
                <div className="space-y-6">
                    <AddNewPlace />
                </div>
            </div>
        </div>
    );
}
