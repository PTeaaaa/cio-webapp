'use client';

import useSWR from 'swr';
import ItemsList from "@/components/mycomponents/list-items/SubListItem";
import Pagination from "@/components/mycomponents/pagination";
import sidebarData from "@/mockData/Sidebardata.json";
import BreadcrumbUpdater from "@/helpercomponents/breadcrumbsupdater";
import OtherErrorCard from "@/components/mycomponents/Card-OtherError";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL!;

const fetcher = async (url: string) => {
  console.log('🔍 ClientLoader fetching:', url);
  const res = await fetch(url, { cache: 'no-store' }); // avoid cache while testing
  console.log('📡 ClientLoader response status:', res.status);

  if (!res.ok) {
    const errorText = await res.text();
    console.log('❌ ClientLoader error response:', errorText);
    throw new Error(`HTTP ${res.status}: ${errorText}`);
  }

  const data = await res.json();
  console.log('✅ ClientLoader success data:', data);
  return data;
};

export default function ClientLoader({
  agency,
  page,
  limit,
}: {
  agency: string;
  page: number;
  limit: number;
}) {
  const url = `${BACKEND_URL}/places/by-agency/${encodeURIComponent(agency)}?page=${page}&limit=${limit}`;
  const { data, error, isLoading } = useSWR(url, fetcher, {
    shouldRetryOnError: false,
    revalidateOnFocus: false,
  });

  // Find display name from sidebar data
  const matchedSidebarItem = sidebarData.find(item => item.keyMain === agency);
  const MainplaceName = matchedSidebarItem ? matchedSidebarItem.title : agency;

  const breadcrumbItems = matchedSidebarItem
    ? [{ label: matchedSidebarItem.title, href: matchedSidebarItem.url }]
    : [{ label: agency, href: `/${agency}` }];

  if (isLoading) {
    return (
      <div className="flex flex-col pt-[30px] pb-[90px]">
        <BreadcrumbUpdater breadcrumbItems={breadcrumbItems} />
        <div className="flex justify-center">
          <div className="h-fit bg-white rounded-2xl shadow-xl/30 font-prompt lg:p-10 w-[80%]">
            <div className="w-full p-9 md:p-9 lg:p-0 flex flex-col justify-start gap-4 md:gap-6">
              <h1 className="text-xl md:text-2xl font-bold">{MainplaceName}</h1>
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mr-3"></div>
                <span>กำลังโหลดข้อมูล...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    const errorMessage = error.message || String(error);
    return <OtherErrorCard errorMessage={errorMessage} />;
  }

  // Success case
  const placesData = data?.data || [];
  const totalPages = data?.meta?.lastPage || 0;

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
            currentPage={page}
          />
        </div>
      )}
    </div>
  );
}
