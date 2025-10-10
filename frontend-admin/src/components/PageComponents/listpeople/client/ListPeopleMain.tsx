"use client";

import React from "react";
import ComponentCard from "@/components/common/ComponentCard";
import ListPeopleTable from "@/components-my/tables/ListPeopleTable";
import { Plus } from "lucide-react";
import { PeopleProvider } from "@/contexts/PeopleContext";
import { Place } from "@/types";

interface ListPeopleClientProps {
    place: Place | null;
    placeId: string;
}

export default function ListPeopleMain({ place, placeId }: ListPeopleClientProps) {
    return (
        <>
            <PeopleProvider initialPlaceId={placeId}>
                <div className="space-y-6">
                    <ComponentCard title={place?.name || "ไม่พบข้อมูลสถานที่"}>
                        <ListPeopleTable />
                        <div className="flex justify-end">
                            <a
                                href="/addperson"
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