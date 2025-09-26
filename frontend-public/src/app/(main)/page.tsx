"use client";

import "@/app/globals.css";
import BreadcrumbUpdater from "@/helpercomponents/breadcrumbsupdater";
import { BreadcrumbItem } from "@/types";

export default function Homepage() {
  // Clear breadcrumbs for homepage by passing empty array
  const breadcrumbItems: BreadcrumbItem[] = [];

  return (
    <>
      <BreadcrumbUpdater breadcrumbItems={breadcrumbItems} />
        <div className="pt-[30px] pb-4 px-10 lg:px-20">
          <div className="flex flex-col bg-white items-center rounded-2xl shadow-xl/30 font-prompt md:pl-8 lg:p-10 w-full">
            <div className="p-4 text-center">
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold mb-3 md:mb-4">
                Hello, Welcome to the CIO Info System
              </h1>
              <p className="text-base md:text-lg lg:text-xl">
                This is the homepage of the system. You can view, manage, or edit CIO data here.
              </p>
            </div>
          </div>
        </div>
    </>
  );
}

