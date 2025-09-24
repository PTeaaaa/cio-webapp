import InfoCard from '@/components/mycomponents/InfoCard';
import { notFound } from 'next/navigation';
import { getPersonByPersonId } from '@/services/peoplePublicAPI/peoplePublicAPI';
import { getPlaceByID } from "@/services/placesPublicAPI/placesPublicAPI";
import { PersonForm, PlaceForm } from '@/types';
import sidebarData from "@/mockData/Sidebardata.json";
import BreadcrumbUpdater from "@/helpercomponents/breadcrumbsupdater";
import NotFoundCard from '@/components/mycomponents/Card-OtherError';
import OtherErrorCard from "@/components/mycomponents/Card-OtherError";
import ClientLoader from '../../client-loader';

interface PageProps {
    params: {
        mainCategory: string,
        placeUUID: string,
        personUUID: string
    };
    searchParams?: {
        page?: string
        mock?: string   // for testing purpose
    };
}

export default async function PersonPage({ params, searchParams }: PageProps) {
    const awaitedParams = await params;


    const { mainCategory, placeUUID, personUUID } = awaitedParams;

    // // ===== MSW Testing =====
    // const awaitQuery = await searchParams;
    // const currentPage = 1;
    // const limit = 5;
    // if (process.env.NEXT_PUBLIC_API_MOCKING === 'enabled') {
    //     return <ClientLoader agency={mainCategory} page={currentPage} limit={limit} />;
    // }

    // ตรวจสอบว่า parameter ครบหรือไม่
    if (!mainCategory || !placeUUID || !personUUID) {
        console.error("Parameters are missing, calling notFound().");
        notFound();
    }

    // --- Check URL, match category or not ---
    let placeData: PlaceForm | null;
    let personData: PersonForm | null;

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

        // --- Check URL, people match place or not ---
        personData = await getPersonByPersonId(personUUID);
        if (!personData) {
            console.log(`No person found for UUID: ${personUUID}, calling notFound().`);
            notFound();
        }

        if (personData.placeId !== placeUUID) {
            console.warn(`Mismatch found: person's placeId: ${personData.placeId} does not match URL's placeUUID: ${placeUUID}.`)
            return <NotFoundCard errorMessage={"ไม่สามารถแสดงข้อมูลได้"} />;
        }

    } catch (apiError: unknown) {
        if (apiError instanceof Error) {
            console.error(`API Error for personUUID "${personUUID}" or placeUUID "${placeUUID}":`, apiError.message);

            // ถ้าเป็น person หรือ place ที่ไม่พบในฐานข้อมูล หรือ 404 error
            if (apiError.message.includes('PERSON_NOT_FOUND') ||
                apiError.message.includes('PLACE_NOT_FOUND') ||
                apiError.message.includes('PERSON_MISSING') ||
                apiError.message.includes('PLACE_MISSING') ||
                apiError.message.includes('404')) {
                console.error(`Person or place not found: ${personUUID}/${placeUUID}, calling notFound().`);
                notFound();
            }
        }

        // สำหรับ error อื่นๆ (network, server error) ให้แสดง error message
        const errorMessage = apiError instanceof Error ? apiError.message : String(apiError);
        console.error("Network/Server Error in PersonPage:", errorMessage);

        return <OtherErrorCard errorMessage={errorMessage} />;
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

    console.log(`DEBUG: Calling getPersonByPersonId for ID: ${personUUID}`);
    console.log('DEBUG: Data received from getPersonByPersonId:', personData);

    return (
        <>
            <BreadcrumbUpdater breadcrumbItems={breadcrumbItems} />
            <InfoCard personForm={personData as PersonForm} />
        </>
    )
}
