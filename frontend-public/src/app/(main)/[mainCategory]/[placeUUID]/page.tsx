import "@/app/globals.css";
import { notFound } from "next/navigation";
import ItemsList from "@/components/mycomponents/list-items/YearListItem";
import Pagination from "@/components/mycomponents/pagination";
import { PlaceForm, PeopleResponse } from "@/types";
import { getPeopleByPlaceId } from "@/services/peoplePublicAPI/peoplePublicAPI";
import { getPlaceByID } from "@/services/placesPublicAPI/placesPublicAPI";
import BreadcrumbUpdater from "@/helpercomponents/breadcrumbsupdater";
import sidebarData from "@/mockData/Sidebardata.json";
import NotFoundCard from '@/components/mycomponents/Card-OtherError';
import OtherErrorCard from "@/components/mycomponents/Card-OtherError";

interface PageProps {
  params: {
    mainCategory: string,
    placeUUID: string
  };
  searchParams?: {
    page?: number;
    limit?: number;
    mock?: string; // for testing purpose
  };
}

export default async function PeopleListPage({ params, searchParams, }: PageProps) {

  const awaitQuery = await searchParams;
  const awaitParams = await params;

  const currentPage = Number(awaitQuery?.page) || 1;
  const limit = Number(awaitQuery?.limit) || 5;
  const { mainCategory, placeUUID } = awaitParams;

  // // ===== MSW Testing =====
  // const mockMode = awaitQuery?.mock; 
  // if (process.env.NEXT_PUBLIC_API_MOCKING === 'enabled') {
  //   return <ClientLoader agency={mainCategory} page={currentPage} limit={limit} />;
  // }

  if (!placeUUID) {
    console.error("Agency parameter is missing, calling notFound().");
    notFound();
  }

  // --- Check URL, match category or not ---
  let placeData: PlaceForm | null;
  let peopleResponse: PeopleResponse | null;

  try {
    placeData = await getPlaceByID(placeUUID);
    if (!placeData) {
      console.log(`No place found for UUID: ${placeUUID}, calling notFound().`);
      notFound();
    }

    if (placeData.agency !== mainCategory) {
      console.warn(`Mismatch found: place's agency: ${placeData.agency} does not match URL's mainCategory: ${mainCategory}.`)
      return <NotFoundCard errorMessage={"ไม่สามารถแสดงข้อมูลได้"} />;
    }

    // --- Fetch to get people that relate to this place ---
    peopleResponse = await getPeopleByPlaceId(placeUUID, currentPage, limit);
    if (!peopleResponse || !peopleResponse.data || peopleResponse.data.length === 0) {
      console.log(`No people found for place: ${placeUUID}`);
      return <NotFoundCard errorMessage={"ไม่พบข้อมูล"} />;
    }

  } catch (apiError: unknown) {
    if (apiError instanceof Error) {
      console.error(`API Error for placeUUID "${placeUUID}":`, apiError.message);

      // ถ้าเป็น place ที่ไม่พบในฐานข้อมูล หรือ 404 error
      if (apiError.message.includes('PLACE_NOT_FOUND') ||
        apiError.message.includes('PLACE_MISSING') ||
        apiError.message.includes('404')) {
        console.error(`Place not found: ${placeUUID}, calling notFound().`);
        notFound();
      }
    }

    // สำหรับ error อื่นๆ (network, server error) ให้แสดง error message
    const errorMessage = apiError instanceof Error ? apiError.message : String(apiError);
    console.error("Network/Server Error in PeopleListPage:", errorMessage);

    return <OtherErrorCard errorMessage={errorMessage} />;
  }

  const peopleData = peopleResponse.data;
  const totalPages = peopleResponse.meta.lastPage;

  // === Update Breadcrumb ===
  const matchedCategory = sidebarData.find(item => item.keyMain === mainCategory);
  const mainCategoryName = matchedCategory ? matchedCategory.title : "ไม่พบหมวดหมู่";
  const SubplaceName = peopleData && peopleData.length > 0 ? peopleData[0].department : 'ไม่พบข้อมูลสถานที่';

  const breadcrumbItems = SubplaceName
    ? [
      { label: mainCategoryName, href: `/${mainCategory}` },
      { label: SubplaceName, href: `/${mainCategory}/${placeUUID}` }
    ]
    : [{ label: "ไม่พบข้อมูลสถานที่", href: "/" }]

  return (
    <div className="flex flex-col pt-[30px] pb-[90px]">
      <BreadcrumbUpdater breadcrumbItems={breadcrumbItems} />
      <div className="flex justify-center">
        <div className="h-fit bg-white rounded-2xl shadow-xl/30 font-prompt lg:p-10 w-[80%]">
          <div className="w-full p-9 md:p-9 lg:p-0 flex flex-col justify-start gap-4 md:gap-6">
            <h1 className="text-xl md:text-2xl font-bold">{SubplaceName}</h1>
            {peopleData.length > 0 ? (
              <ItemsList category={mainCategory} placeUUID={placeUUID} items={peopleData} />
            ) : (
              <p>No items found for this category.</p>
            )}
          </div>
        </div>
      </div>
      {peopleData.length > 0 && totalPages > 0 && (
        <div className="flex w-[91%] justify-end pt-[20px]">
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
          />
        </div>
      )}
    </div>
  );
}

