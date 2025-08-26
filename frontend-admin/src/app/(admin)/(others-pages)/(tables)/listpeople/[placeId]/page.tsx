"use client";

import { useEffect, useState, use } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ListPeopleTable from "@/components-my/tables/ListPeopleTable";
import React from "react";
import { Plus } from "lucide-react";
import { PeopleProvider } from "@/contexts/PeopleContext";
import { getPlaceById } from "@/services/placesAPI/placesAPI";
import { Place } from "@/types";

export default function ListPeople({ params }: { params: Promise<{ placeId: string }> }) {
  const [place, setPlace] = useState<Place | null>(null);
  const [loading, setLoading] = useState(true);

  const { placeId } = use(params);

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const placeData = await getPlaceById(placeId);
        setPlace(placeData);
      } catch (error) {
        console.error("Error fetching place:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlace();
  }, [placeId]);

  return (
    <>
      <PeopleProvider initialPlaceId={placeId}>
        <PageBreadcrumb pageTitle="ข้อมูลของคุณ" />
        <div className="space-y-6">
          <ComponentCard title={loading ? "กำลังโหลด..." : (place?.name || "ไม่พบข้อมูลสถานที่")}>
            <ListPeopleTable />
            <div className="flex justify-end">
              <a
                href="/addnew"
                className="flex w-fit items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
              >
                <Plus />
                เพิ่มข้อมูล
              </a>
            </div>
          </ComponentCard>
        </div>
      </PeopleProvider>
    </>
  );
}
