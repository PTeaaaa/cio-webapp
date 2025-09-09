'use client';

import Link from 'next/link';
import { useBreadcrumb } from '@/context/BreadcrumbContext';

export default function Breadcrumbs() {
    // ดึง breadcrumbs array จาก useBreadcrumb hook
    const { breadcrumbs } = useBreadcrumb();

    // สร้างรายการ Breadcrumb ทั้งหมด โดยรวม Home เข้าไปด้วย
    const allBreadcrumbs = [
        { label: 'Home', href: '/' },
        ...breadcrumbs
    ];

    return (
        <div className="ml-[30px] lg:ml-[190px] pt-[50px]">
            <nav className="bg-white border border-gray-200 rounded-full px-4 py-2 w-fit hover:border-gray-400 transition-all duration-300" aria-label="Breadcrumb">
                <ol className="flex flex-wrap items-center">
                    {allBreadcrumbs.map((item, index) => (
                        <li key={item.href} className="flex items-center">
                            {/* แสดงตัวแบ่งเฉพาะเมื่อไม่ใช่รายการแรก */}
                            {index > 0 && (
                                <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                                </svg>
                            )}

                            {/* Home Icon */}
                            {index === 0 ? (
                                <Link href={item.href} className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-green-700 rounded-md px-2 py-1 transition-colors duration-200">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[20px] mr-2 mb-[2px] lucide lucide-house-icon lucide-house"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" /><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /></svg>
                                    {item.label}
                                </Link>
                            ) : (
                                // ถ้าเป็นรายการสุดท้าย จะไม่เป็นลิงก์
                                index === allBreadcrumbs.length - 1 ? (
                                    <span className="text-sm font-medium text-gray-500 rounded-md px-2 py-1">
                                        {item.label}
                                    </span>
                                ) : (
                                    // ถ้าไม่ใช่ตัวสุดท้าย จะเป็นลิงก์ที่คลิกได้
                                    <Link href={item.href} className="text-sm font-medium text-gray-700 hover:text-green-700 rounded-md px-2 py-1 transition-colors duration-200">
                                        {item.label}
                                    </Link>
                                )
                            )}
                        </li>
                    ))}
                </ol>
            </nav>
        </div>
    );
}
