import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import AddNewDataCard from "@/components/PageComponents/addperson/client/AddPersonCard";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "CIOSite - Edit",
  description:
    "This is CIOSite editing page.",
};

export default function AddPersonPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="เพิ่มข้อมูลใหม่" />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <div className="space-y-6">
          <AddNewDataCard />
        </div>
      </div>
    </div>
  );
}
