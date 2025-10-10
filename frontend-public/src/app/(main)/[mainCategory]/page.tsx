import "@/app/globals.css";
import { notFound } from "next/navigation";
import ItemsList from "@/components/mycomponents/list-items/SubListItem";
import Pagination from "@/components/mycomponents/pagination";
import { getPlacesByAgency } from "@/services/placesPublicAPI/placesPublicAPI";
import { PlacesResponse } from "@/types";
import sidebarData from "@/mockData/Sidebardata.json";
import BreadcrumbUpdater from "@/helpercomponents/breadcrumbsupdater";
import OtherErrorCard from "@/components/mycomponents/Card-OtherError";
import SortBy from "@/components/mycomponents/sortBy";
import ClientLoader from './client-loader';

interface PageProps {
    params: { mainCategory: string };
    searchParams?: {
        page?: string;
        limit?: string;
        sortBy?: string;
        sortOrder?: string;
        mock?: string; // for testing purpose
    };
}

export default async function SubPlaceSelectPage({ params, searchParams, }: PageProps) {
    // ดึงเลขหน้าปัจจุบันจาก searchParams
    const awaitQuery = await searchParams;
    const awaitParams = await params;

    const currentPage = Number(awaitQuery?.page) || 1;
    const limit = Number(awaitQuery?.limit) || 5;
    const sortBy = awaitQuery?.sortBy || 'numberOrder';
    const sortOrder = (awaitQuery?.sortOrder as 'asc' | 'desc') || 'asc';
    const agency = decodeURIComponent(awaitParams.mainCategory);

    // // ===== MSW Testing =====
    // const mockMode = awaitQuery?.mock;
    // // Force client-side rendering when mock parameter is present
    // if (process.env.NEXT_PUBLIC_API_MOCKING === 'enabled' || mockMode) {
    //     return <ClientLoader agency={agency} page={currentPage} limit={limit} />;
    // }

    // ตรวจสอบว่า agency มีค่าหรือไม่
    if (!agency || !sidebarData.some(item => item.keyMain === agency)) {
        console.error(`Invalid agency: ${agency}.`);
        notFound();
    }

    // ดึงข้อมูลสถานที่ตาม agency จาก Backend โดยใช้ฟังก์ชันสำหรับ Server Component
    let placesResponse: PlacesResponse;

    try {
        placesResponse = await getPlacesByAgency(agency, currentPage, limit, sortBy, sortOrder);

        // ตรวจสอบข้อมูลที่ได้รับ
        if (!placesResponse?.data) {
            console.error(`Invalid response for agency: ${agency}`);
            notFound();
        }

    } catch (apiError: unknown) {
        if (apiError instanceof Error) {
            console.error(`API Error for agency "${agency}":`, apiError.message);

            // ถ้าเป็น agency ที่ไม่พบในฐานข้อมูล หรือ 404 error
            if (apiError.message.includes('AGENCY_NOT_FOUND') ||
                apiError.message.includes('AGENCY_MISSING') ||
                apiError.message.includes('404')) {
                console.error(`Agency not found: ${agency}, calling notFound().`);
                notFound();
            }
        }

        // สำหรับ error อื่นๆ (network, server error) ให้แสดง error message
        const errorMessage = apiError instanceof Error ? apiError.message : String(apiError);
        console.error("Network/Server Error in SubPlaceSelectPage:", errorMessage);

        return <OtherErrorCard errorMessage={errorMessage} />;
    }

    const placesData = placesResponse.data;
    const totalPages = placesResponse.meta.lastPage;

    // หาชื่อที่แสดงจาก Sidebardata.json โดยเปรียบเทียบ agency กับ keyMain
    const matchedSidebarItem = sidebarData.find(item => item.keyMain === agency);
    const MainplaceName = matchedSidebarItem ? matchedSidebarItem.title : agency;

    const breadcrumbItems = matchedSidebarItem
        ? [{ label: matchedSidebarItem.title, href: matchedSidebarItem.url }]
        : [{ label: agency, href: `/${agency}` }];

    return (
        <div className="flex flex-col pt-[30px] pb-[90px]">

            <BreadcrumbUpdater breadcrumbItems={breadcrumbItems} />

            <div className="flex justify-center">
                <div className="h-fit bg-white rounded-2xl shadow-xl/30 font-prompt lg:p-10 w-[80%]">
                    <div className="w-full p-9 md:p-9 lg:p-0 flex flex-col justify-start gap-4 md:gap-6">
                        <h1 className="flex text-xl md:text-2xl font-bold">
                            {MainplaceName}
                            <div className="justify-end ml-auto">
                                <SortBy />
                            </div>
                        </h1>
                        {placesData.length > 0 ? (
                            <ItemsList category={agency} items={placesData} />
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12">
                                <div className="text-gray-400 mb-4">
                                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">ไม่พบรายการ</h3>
                                <p className="text-gray-600 text-center">ขณะนี้ยังไม่มีรายการสำหรับ "{MainplaceName}"</p>
                            </div>
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
