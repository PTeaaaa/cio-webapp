import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ListAccountTable from "@/components/PageComponents/listaccounts/client/ListAccountsTable";
import ListAccountsNotification from "@/components/PageComponents/listaccounts/client/ListAccountsNotification";
import { Plus } from "lucide-react";

export default function ListPeople() {
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

      <ListAccountsNotification />
    </>
  );
}