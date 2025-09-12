import "@/app/globals.css";
import { notFound, redirect } from "next/navigation";
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
    // ดึงเลขหน้าปัจจุบันจาก searchParams
    const awaitQuery = await searchParams;
    const awaitParams = await params;

    const currentPage = Number(awaitQuery?.page) || 1;
    const limit = Number(awaitQuery?.limit) || 5;
    const agency = decodeURIComponent(awaitParams.mainCategory);

    console.log("Your agency is:", agency);

    // ตรวจสอบว่า agency มีค่าหรือไม่
    if (!agency) {
        notFound();
    }

    // ตรวจสอบว่า agency ที่ส่งมาเป็น agency ที่ถูกต้องหรือไม่จาก sidebarData
    const validAgencies = sidebarData.map(item => item.keyMain);
    const isValidAgency = validAgencies.includes(agency);

    if (!isValidAgency) {
        console.log(`Invalid agency: ${agency}. Calling notFound() directly.`);
        notFound();
    }

    // ดึงข้อมูลสถานที่ตาม agency จาก Backend โดยใช้ฟังก์ชันสำหรับ Server Component
    let placesResponse: PlacesResponse;

    try {
        placesResponse = await getPlacesByAgency(agency, currentPage, limit);
        
        // ตรวจสอบข้อมูลที่ได้รับ
        if (!placesResponse || !placesResponse.data) {
            console.log(`Invalid response structure for agency: ${agency}`);
            notFound();
        }
    } catch (apiError: unknown) {
        if (apiError instanceof Error) {
            console.log(`API Error for agency "${agency}":`, apiError.message);

            // ถ้าเป็น agency ที่ไม่พบในฐานข้อมูล หรือ 404 error
            if (apiError.message.includes('AGENCY_NOT_FOUND') ||
                apiError.message.includes('AGENCY_MISSING') ||
                apiError.message.includes('404')) {
                console.log(`Agency not found: ${agency}, calling notFound().`);
                notFound();
            }
        }
        
        // สำหรับ error อื่นๆ (network, server error) ให้แสดง error message
        const errorMessage = apiError instanceof Error ? apiError.message : String(apiError);
        console.error("Network/Server Error in SubPlaceSelectPage:", errorMessage);

        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] p-6">
                <div className="text-red-400 mb-4">
                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                </div>
                <h1 className="text-xl md:text-2xl font-bold text-red-600 mb-4">เกิดข้อผิดพลาดในการโหลดข้อมูล</h1>
                <p className="text-gray-600 text-center max-w-md mb-4">
                    ระบบไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ในขณะนี้ กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ตและลองใหม่อีกครั้ง
                </p>
                <a
                    href="/"
                    className="inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors no-underline"
                >
                    กลับหน้าหลัก
                </a>
                <div className="text-xs text-gray-700 mt-4 bg-gray-300 p-2 rounded overflow-auto">
                    {errorMessage}
                </div>
            </div>
        );
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
                            <h1 className="text-xl md:text-2xl font-bold">{MainplaceName}</h1>
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
                                    <p className="text-gray-600 text-center">ขณะนี้ยังไม่มีสถานที่สำหรับหมวดหมู่ "{MainplaceName}"</p>
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
