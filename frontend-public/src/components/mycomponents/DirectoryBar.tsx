"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/breadcrumb";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import testPeopleData from "@/mockData/Peopledata.json";
import testSubplaceData from "@/mockData/Subplacedata.json";
import testSidebarData from "@/mockData/Sidebardata.json";
import { House } from "lucide-react";

const subplaceTypeMap: Record<string, string> = {
  Department: "Department",
  State: "State",
  Office: "Office",
};

// Sidebar items lookup
const SidebarData: Record<string, typeof testSidebarData[number]> = testSidebarData.reduce((acc, cur) => {
  acc[cur.keyMain] = cur;
  return acc;
}, {} as Record<string, typeof testSidebarData[number]>);

// Subplace entries and lookups
const subplaceEntries = Object.values(testSubplaceData).flat() as Array<{
  keySub: string;
  mainType: string;
  title: string;
  YearContain: string;
}>;

const SubplaceData: Record<string, typeof subplaceEntries[0]> = subplaceEntries.reduce((acc, cur) => {
  acc[cur.keySub] = cur;
  return acc;
}, {} as Record<string, typeof subplaceEntries[0]>);

const SubplaceTypeMapping: Record<string, string> = subplaceEntries.reduce((acc, cur) => {
  acc[cur.keySub] = cur.mainType;
  return acc;
}, {} as Record<string, string>);

// People entries and lookup
const peopleEntries = Object.values(testPeopleData).flat() as Array<{
  keyPerson: string;
  honorific: string;
  name: string;
  surname: string;
  keySub: string;
  year: string;
  [key: string]: any;
}>;
const peopleData: Record<string, typeof peopleEntries[0]> = peopleEntries.reduce((acc, cur) => {
  acc[cur.keyPerson] = cur;
  return acc;
}, {} as Record<string, typeof peopleEntries[0]>);

// Config array for breadcrumbs
const breadcrumbConfig: {
  pattern: RegExp;
  build: (match: RegExpMatchArray) => { title: string; href: string }[];
}[] = [
  {
    pattern: /^\/page\/SubPlaceSelectPage\/([^/]+)/,
    build: (match) => {
      const mainPlaceType = match[1];
      const mainPlace = SidebarData[mainPlaceType];
      return [
        { title: "Home", href: "/" },
        { title: mainPlace?.title || "Unknown", href: `/page/SubPlaceSelectPage/${mainPlaceType}` },
      ];
    },
  },
  {
    pattern: /^\/page\/YearSelectPage\/([^/]+)/,
    build: (match) => {
      const subplaceId = match[1];
      const subplace = SubplaceData[subplaceId];
      const subplaceType = SubplaceTypeMapping[subplaceId];
      const mainPlaceType = subplaceTypeMap[subplaceType];
      const mainPlace = SidebarData[mainPlaceType];
      return [
        { title: "Home", href: "/" },
        { title: mainPlace?.title || "Unknown", href: `/page/SubPlaceSelectPage/${mainPlaceType}` },
        { title: subplace?.title || "Unknown", href: `/page/YearSelectPage/${subplaceId}` },
      ];
    },
  },
  {
    pattern: /^\/page\/infopage\/([^/]+)/,
    build: (match) => {
      const personId = match[1];
      const person = peopleData[personId];
      const subplaceId = person?.keySub;
      const subplace = SubplaceData[subplaceId];
      const subplaceType = subplaceId ? SubplaceTypeMapping[subplaceId] : undefined;
      const mainPlaceType = subplaceType ? subplaceTypeMap[subplaceType] : undefined;
      const mainPlace = mainPlaceType ? SidebarData[mainPlaceType] : undefined;
      return [
        { title: "Home", href: "/" },
        { title: mainPlace?.title || "Unknown", href: `/page/SubPlaceSelectPage/${mainPlaceType}` },
        { title: subplace?.title || "Unknown", href: `/page/YearSelectPage/${subplaceId}` },
        { title: person ? `ปี ${person.year}` : "Unknown", href: `/page/infopage/${personId}` },
      ];
    },
  },
];

// Utility function
function getBreadcrumbItems(pathname: string) {
  for (const { pattern, build } of breadcrumbConfig) {
    const match = pathname.match(pattern);
    if (match) return build(match);
  }
  return [{ title: "Home", href: "/" }]; // fallback
}

export default function DirectoryBar() {
  const pathname = usePathname();

  const breadcrumbItems = getBreadcrumbItems(pathname);

  return (
    <div className="ml-[30px] lg:ml-[190px] pt-[50px]">
      <div className="bg-white border-1 border-gray-200 rounded-full px-4 py-2 w-fit hover:border-gray-400 traisition-all duration-300">
        <Breadcrumb>
          <BreadcrumbList className="flex flex-wrap">
            <BreadcrumbItem className="w-[20px]">
              <House />
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            {breadcrumbItems.map((item, index) => (
              <div key={item.href || item.title} className="contents">
                <BreadcrumbItem>
                  {index === breadcrumbItems.length - 1 ? (
                    <BreadcrumbPage>{item.title}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink href={item.href}>{item.title}</BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {index < breadcrumbItems.length - 1 && <BreadcrumbSeparator />}
              </div>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </div>
  );
}