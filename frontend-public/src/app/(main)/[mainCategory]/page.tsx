import "@/app/globals.css";
import { notFound } from "next/navigation";
import ItemsList from "@/mycomponents/SubListItem";
import Pagination from "@/mycomponents/pagination";
import { getPlacesByAgency } from "@/services/placesPublicAPI/placesPublicAPI";
import { PlacesResponse } from "@/types";
import sidebarData from "@/mockData/Sidebardata.json";
import BreadcrumbUpdater from "@/helpercomponents/breadcrumbsupdater";

interface PageProps {
    params: { mainCategory: string };
    searchParams?: {
        page?: string;
        limit?: string;
    };
}

export default async function SubPlaceSelectPage({ params, searchParams, }: PageProps) {

    try {
        // ดึงเลขหน้าปัจจุบันจาก searchParams
        const awaitQuery = await searchParams;
        const awaitParams = await params;

        const currentPage = Number(awaitQuery?.page) || 1;
        const limit = Number(awaitQuery?.limit) || 5;
        const agency = decodeURIComponent(awaitParams.mainCategory);

        console.log("Your agency is:", agency);

        // ตรวจสอบว่า agency มีค่าหรือไม่
        if (!agency) {
            console.error("Agency parameter is missing, calling notFound().");
            notFound();
        }

        // ดึงข้อมูลสถานที่ตาม agency จาก Backend โดยใช้ฟังก์ชันสำหรับ Server Component
        const placesResponse: PlacesResponse | null = await getPlacesByAgency(agency, currentPage, limit);

        // หากไม่พบข้อมูลสถานที่ (getPlacesByAgency คืนค่า null หรือ Array ว่าง)
        if (!placesResponse || !placesResponse.data || placesResponse.data.length === 0) {
            console.log(`No places found for agency: ${agency}, calling notFound().`);
            notFound(); // แสดงหน้า Not Found ของ Next.js
        }

        const placesData = placesResponse.data;
        const totalPages = placesResponse.meta.lastPage;

        // หาชื่อที่แสดงจาก Sidebardata.json โดยเปรียบเทียบ agency กับ keyMain
        const matchedSidebarItem = sidebarData.find(item => item.keyMain === agency);
        const MainplaceName = matchedSidebarItem ? matchedSidebarItem.title : agency;

        const breadcrumbItems = matchedSidebarItem
            ? [{ label: matchedSidebarItem.title, href: matchedSidebarItem.url }]
            : [{ label: "ไม่พบข้อมูลสถานที่", href: "/" }];

        return (
            <div className="flex flex-col pt-[30px] pb-[90px]">
                <BreadcrumbUpdater breadcrumbItems={breadcrumbItems} />
                <div className="flex justify-center">
                    <div className="h-fit bg-white rounded-2xl shadow-xl/30 font-prompt lg:p-10 w-[80%]">
                        <div className="w-full p-9 md:p-9 lg:p-0 flex flex-col justify-start gap-4 md:gap-6">
                            <h1 className="text-xl md:text-2xl font-bold">{MainplaceName}</h1>
                            {placesData.length > 0 ? (
                                <ItemsList category={agency} items={placesData} />
                            ) : (
                                <p>ไม่พบรายการสำหรับหมวดหมู่นี้</p>
                            )}
                        </div>
                    </div>
                </div>

                {placesData.length > 0 && totalPages > 0 && (
                    <div className="flex w-[91%] justify-end pt-[30px]">
                        <Pagination
                            totalPages={totalPages}
                            currentPage={currentPage}
                        />
                    </div>
                )}
            </div>
        );
    }
    catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error("API Error in SubPlaceSelectPage:", errorMessage);

        // สำหรับ Error อื่นๆ, แสดง Error Component
        return (
            <div>
                <h1>เกิดข้อผิดพลาด</h1>
                <p>ไม่สามารถโหลดข้อมูลได้: {errorMessage}</p>
            </div>
        );
    }
}
