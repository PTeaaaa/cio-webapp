import InfoCard from '@/mycomponents/InfoCard';
import { notFound } from 'next/navigation';
import { getPersonByPersonId } from '@/services/peoplePublicAPI/peoplePublicAPI';
import { getPlaceByID } from "@/services/placesPublicAPI/placesPublicAPI";
import { PersonForm, PlaceForm } from '@/types';
import sidebarData from "@/mockData/Sidebardata.json";
import BreadcrumbUpdater from "@/helpercomponents/breadcrumbsupdater";
import NotFoundCard from '@/mycomponents/Card-BadRequest';
import NoDataCard from '@/mycomponents/Card-NoData';

interface PageProps {
    params: {
        mainCategory: string,
        placeUUID: string,
        personUUID: string
    };
    searchParams?: {
        page?: string
    };
}

export default async function PersonPage({ params }: PageProps) {
    const awaitedParams = await params;
    const { mainCategory, placeUUID, personUUID } = awaitedParams;

    // ตรวจสอบว่า parameter ครบหรือไม่
    if (!mainCategory || !placeUUID || !personUUID) {
        console.error("Parameters are missing, calling notFound().");
        notFound();
    }

    // --- Check URL, match category or not ---
    const placeData: PlaceForm | null = await getPlaceByID(placeUUID);
    if (!placeData) {
      console.log(`No person found for UUID: ${placeData}, calling notFound().`);
      notFound();
    }
  
    if (placeData.agency !== mainCategory) {
      console.warn(`Mismatch found: person's placeId: ${placeData.agency} does not match URL's mainCategory: ${mainCategory}.`)
      return <NotFoundCard text={"ไม่สามารถแสดงข้อมูลได้"} />;
    }

    // --- Check URL, people match place or not ---
    const personData: PersonForm | null = await getPersonByPersonId(personUUID);
    if (!personData) {
        console.log(`No person found for UUID: ${personUUID}, calling notFound().`);
        notFound();
    }

    if (personData.placeId !== placeUUID) {
        console.warn(`Mismatch found: person's placeId: ${personData.placeId} does not match URL's placeUUID: ${placeUUID}.`)
        return <NotFoundCard text={"ไม่สามารถแสดงข้อมูลได้"} />;
    }

    // สร้าง Breadcrumb Item จากข้อมูลที่มีอยู่
    const matchedCategory = sidebarData.find(item => item.keyMain === mainCategory);
    const mainCategoryName = matchedCategory ? matchedCategory.title : "ไม่พบสถานที่";
    const placeName = personData.department || "ไม่พบข้อมูลสถานที่";
    const personYear = personData.year || "ไม่ระบุปี";

    // สร้าง Breadcrumb Items ที่สมบูรณ์โดยไม่ต้องเรียก API เพิ่มเติม
    const breadcrumbItems = [
        { label: mainCategoryName, href: `/${mainCategory}` },
        { label: placeName, href: `/${mainCategory}/${placeUUID}` },
        { label: `ปีงบประมาณ ${personYear}`, href: '' },
    ];

    try {

        console.log(`DEBUG: Calling getPersonByPersonId for ID: ${personUUID}`);
        console.log('DEBUG: Data received from getPersonByPersonId:', personData);

        if (!personData) {
            console.error(`DEBUG: No personData found for ID ${personUUID}, calling notFound().`);
            notFound(); // แสดงหน้า Not Found ของ Next.js
        }
    }
    catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error(`DEBUG: Error in PersonPage try-catch for ID ${personUUID}:`, errorMessage);
        return <NotFoundCard text={"ไม่พบข้อมูล"} />
    }

    return (
        <>
            <BreadcrumbUpdater breadcrumbItems={breadcrumbItems} />
            <InfoCard personForm={personData as PersonForm} />
        </>
    )
}
