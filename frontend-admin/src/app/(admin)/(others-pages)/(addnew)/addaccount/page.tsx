import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import AddNewAccount from "@/components/PageComponents/addaccount/client/AddNewAccount";
import { Metadata } from "next";
import React from "react";
import AddAccountNotification from "@/components/PageComponents/addaccount/client/AddAccountNotification";

export const metadata: Metadata = {
  title: "CIOSite - Edit",
  description:
    "This is CIOSite editing page.",
};

export default function EditPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="เพิ่มข้อมูลใหม่" />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6 shadow-xl">
        <div className="space-y-6">
          <AddNewAccount />
        </div>
      </div>

      <AddAccountNotification />
    </div>
  );
}
