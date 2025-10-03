"use client";

import React, { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../../components/ui/table";
import Link from "next/link";
import { getAllPlaces } from "@/services/places/placesAPI";
import { Place } from "@/types";

export default function ListAccountTable() {

    const [places, setPlaces] = useState<Place[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAccounts = async () => {
            try {
                setIsLoading(true);
                const data = await getAllPlaces();
                if (data) {
                    setPlaces(data);
                } else {
                    setError("Failed to fetch accounts");
                }
            } catch (err) {
                setError("Error fetching accounts");
                console.error("Error fetching accounts:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAccounts();
    }, []);

    if (isLoading) {
        return <div className="text-center py-4 text-gray-500">กำลังโหลดข้อมูล...</div>;
    }

    if (error) {
        return <div className="text-center py-4 text-red-500">เกิดข้อผิดพลาด: {error}</div>;
    }

    const frameworks = [
        { value: "Department", label: "กรม" },
        { value: "State", label: "เขตสุขภาพ" },
        { value: "Office", label: "สำนักงานสาธารณสุขจังหวัด" },
        { value: "HCenter", label: "โรงพยาบาลศูนย์" },
        { value: "HGeneral", label: "โรงพยาบาลทั่วไป" },
    ]

    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="max-w-full overflow-x-auto">
                <div className="min-w-full">
                    <Table>
                        {/* Table Header */}
                        <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                            <TableRow className="">
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 block lg:hidden"
                                >
                                    <span className="sr-only">Editing</span>
                                </TableCell>

                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    ชื่อหน่วยงาน
                                </TableCell>

                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400"
                                >
                                    ประเภทองค์กร
                                </TableCell>

                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400 hidden lg:block"
                                >
                                    <span className="sr-only">Editing</span>
                                </TableCell>

                            </TableRow>
                        </TableHeader>

                        {/* Table Body */}
                        <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                            {places.map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400 lg:hidden">
                                        <Link
                                            href={`/edit-place?id=${order.id}`}
                                            className="flex w-fit items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-3 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                                        >
                                            <svg
                                                className="fill-current"
                                                width="18"
                                                height="18"
                                                viewBox="0 0 18 18"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    clipRule="evenodd"
                                                    d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
                                                    fill=""
                                                />
                                            </svg>
                                        </Link>
                                    </TableCell>

                                    <TableCell className="w-1/2 px-5 py-4 sm:px-6 text-start">
                                        <div className="flex items-center gap-3">
                                            <div>
                                                <span className="font-medium text-gray-800 text-theme-sm dark:text-white/90" style={{ whiteSpace: "nowrap" }}>
                                                    {order.name}
                                                </span>

                                            </div>
                                        </div>
                                    </TableCell>

                                    <TableCell className="px-5 py-4 sm:px-6 text-center">
                                        <div className="gap-3 font-medium text-gray-800 text-theme-sm dark:text-white/90" style={{ whiteSpace: "nowrap" }}>
                                            {frameworks.find(f => f.value === order.agency)?.label || order.agency}
                                        </div>
                                    </TableCell>

                                    <TableCell className="px-4 py-5 text-gray-500 text-theme-sm dark:text-gray-400 hidden lg:block">
                                        <div className="flex justify-center">
                                            <Link
                                                href={`/edit-place?id=${order.id}`}
                                                className="flex w-fit items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-3 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                                            >
                                                <svg
                                                    className="fill-current"
                                                    width="18"
                                                    height="18"
                                                    viewBox="0 0 18 18"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        clipRule="evenodd"
                                                        d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
                                                        fill=""
                                                    />
                                                </svg>
                                            </Link>
                                        </div>
                                    </TableCell>

                                </TableRow>
                            ))}

                        </TableBody>
                    </Table>
                </div>

            </div>

        </div>
    );
}
