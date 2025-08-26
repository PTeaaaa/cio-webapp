import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import MockupInfoEditCard from "@/components-my/mockupCard/edit/mockupInfoEditCard";
import MockupPhotoEditCard from "@/components-my/mockupCard/edit/mockupPhotoEditCard";
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
      <PageBreadcrumb pageTitle="แก้ไขข้อมูล" />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <div className="space-y-6">
          <MockupInfoEditCard />
          <MockupPhotoEditCard />
        </div>
        <div className="flex justify-start mt-6">
          <button
            className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-red-600 px-4 py-3 text-sm font-medium text-white shadow-theme-xs hover:bg-red-700 dark:border-gray-700 dark:bg-red-500 dark:text-white dark:hover:bg-red-700 dark:hover:text-gray-200 lg:inline-flex lg:w-auto duration-200 ease-in-out"
          >
            ลบรายชื่อและข้อมูลส่วนตัว
          </button>
        </div>
      </div>
    </div>
  );
}
