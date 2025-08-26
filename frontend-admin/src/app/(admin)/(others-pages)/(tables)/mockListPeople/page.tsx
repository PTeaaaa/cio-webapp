import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import MockListPeopleTable from "@/components-my/tables/mockListPeopleTable";
import { Metadata } from "next";
import React from "react";
import { Plus } from "lucide-react";

export const metadata: Metadata = {
  title: "CIO admin site - list people",
  description:
    "This is Next.js Basic Table  page for TailAdmin  Tailwind CSS Admin Dashboard Template",
  // other metadata
};

export default function mockListPeople() {

  return (
    <div>
      <PageBreadcrumb pageTitle="ข้อมูลของคุณ" />
      <div className="space-y-6">
        <ComponentCard title="{Your place name}">
          <MockListPeopleTable />
          <div className="flex justify-end">
            <a
              href="/addnew"
              className="flex w-fit items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
            >
              <Plus />
              เพิ่มข้อมูล
            </a>
          </div>
        </ComponentCard>
      </div>
    </div>
  );
}
