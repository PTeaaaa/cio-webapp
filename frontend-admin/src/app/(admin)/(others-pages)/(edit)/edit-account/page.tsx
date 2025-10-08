import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import DataEditCard from "@/components/PageComponents/edit-account/client/AccountDataEditCard";
import EditAccountDeleteConfirmation from "@/components/PageComponents/edit-account/client/EditAccountDeleteConfirmation";

export default function EditAccountPage() {
    return (
        <div>
            <PageBreadcrumb pageTitle="ข้อมูลบัญชีผู้ใช้" />
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
                <div className="space-y-6">
                    <DataEditCard />
                </div>
                <EditAccountDeleteConfirmation />
            </div>
        </div>
    );
}
