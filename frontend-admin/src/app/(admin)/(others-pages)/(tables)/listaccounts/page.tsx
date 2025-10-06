"use client";

import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ListAccountTable from "@/components-my/tables/ListAccountsTable";
import TimeLimitModal from "@/components/ui/modal/TimeLimitModal";
import React, { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";

export default function ListPeople() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);

  useEffect(() => {
    // Check if we have the deleted=success parameter
    if (searchParams.get('deleted') === 'success') {
      setShowSuccessNotification(true);
    }
  }, [searchParams]);

  const handleNotificationClose = () => {
    setShowSuccessNotification(false);
    // Clean up the URL parameter
    router.replace('/listaccounts');
  };

  return (
    <>
      <PageBreadcrumb pageTitle="ข้อมูลของคุณ" />
      <div className="space-y-6">
        <ComponentCard title={"ข้อมูลบัญชีผู้ใช้"}>
          <ListAccountTable />
          <div className="flex justify-end">
            <a
              href="/addaccount"
              className="flex w-fit items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
            >
              <Plus />
              เพิ่มบัญชี
            </a>
          </div>
        </ComponentCard>
      </div>

      <TimeLimitModal
        isOpen={showSuccessNotification}
        onClose={handleNotificationClose}
        title="ลบข้อมูลสำเร็จ"
        message="บัญชีผู้ใช้ถูกลบออกจากระบบแล้ว"
        variant="success"
        autoDismissTime={5000}
        position="top"
      />
    </>
  );
}