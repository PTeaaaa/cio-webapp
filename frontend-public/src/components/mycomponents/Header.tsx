"use client";
import { useState } from "react";
import SearchBar from "./searchbar";
import Link from "next/link";

export default function Header() {

  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // You can add additional search logic here if needed
  };
  
  return (
    <header className="bg-[#14774a] lg:h-[150px] text-white font-prompt font-light normal-case relative overflow-visible z-[11] w-full">
      <div className="flex flex-col lg:flex-row items-center lg:items-center lg:justify-between gap-0  lg:gap-4 lg:px-[30px] w-full">

        <Link href="/">
          <img
            src="/assets/MainLogo.png"
            alt="Ministry of Public Health"
            className="w-[80px] lg:w-[200px] object-cover pt-[8px] lg:pt-[10px]"
          />
        </Link>

        <div className="flex-1 text-center lg:text-left lg:ml-6 mt-2 lg:mb-14">
          <div className="text-[1.1rem] sm:text-[1.4rem] lg:text-[2.2rem] leading-[1.3]">
            <div>ผู้บริหารเทคโนโลยีสารสนเทศระดับสูง</div>
            <div>กระทรวงสาธารณสุข</div>
          </div>
        </div>

        <div className="w-full flex justify-end m-2 lg:w-full lg:mt-0 lg:max-w-xs pr-[20px]">
          <SearchBar onSearch={handleSearch} />
        </div>

      </div>

    </header>
  );
}
