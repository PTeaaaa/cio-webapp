import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ListPlacesTable from "@/components-my/tables/ListPlacesTable";
import ListPlacesNotification from "@/components/PageComponents/listplaces/client/ListPlaceNotification";
import React from "react";
import { Plus } from "lucide-react";

export default function ListPlaces() {

  return (
    <>
      <PageBreadcrumb pageTitle="ข้อมูลของคุณ" />
      <div className="space-y-6">
        <ComponentCard title={"ข้อมูลบัญชีผู้ใช้"}>
          <ListPlacesTable />
          <div className="flex justify-end">
            <a
              href="/addplace"
              className="flex w-fit items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
            >
              <Plus />
              เพิ่มบัญชี
            </a>
          </div>
        </ComponentCard>
      </div>

      <ListPlacesNotification />
    </>
  );
}