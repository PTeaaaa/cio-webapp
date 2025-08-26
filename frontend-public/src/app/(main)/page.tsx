"use client";
import "@/app/globals.css";
import Link from "next/link";

export default function Homepage() {
  return (
    <div className="flex flex-1 pt-[20px] justify-center pb-[180px]">

      <div className="bg-white rounded-2xl flex flex-col shadow-xl/30 font-prompt md:pl-8 lg:p-10 w-[80%]">

        <div className="p-4 text-center">
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold mb-3 md:mb-4">Hello, Welcome to the CIO Info System</h1>
          <p className="text-base md:text-lg lg:text-xl">This is the homepage of the system. You can view, manage, or edit CIO data here.</p>
        </div>

      </div>

    </div>
  );
}

