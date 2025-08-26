"use client";

import { FaXTwitter } from "react-icons/fa6";
import { FiFacebook } from "react-icons/fi";
import { FaInstagram } from "react-icons/fa";
import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-[#422e13] pt-8 lg:pt-[40px] pb-[10px] text-white normal-case relative overflow-visible">
            <div className="flex flex-col relative items-center w-full px-4 lg:px-0">
                <div className="flex flex-col lg:flex-row flex-1 pt-2 lg:pt-[20px] pl-0 lg:pl-[10px] text-[1rem] sm:text-[1.2rem] lg:text-[2.2rem] leading-[1.3] text-center lg:text-left items-center lg:items-start justify-between gap-8 lg:gap-10 w-full max-w-5xl mx-auto">
                    <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start lg:ml-[30px] text-3xl">
                        <h1 className="text-[#f5ecd5] font-serif">Contact Us</h1>
                        <div className="bg-[#f0bb78] w-1/4 lg:w-[300px] h-[2px] my-4" />
                        <div className="flex flex-col font-prompt text-[#f5ecd5] gap-1 lg:gap-0 text-[1rem] leading-7">
                            <p>ศูนย์เทคโนโลยีสารสนเทศและการสื่อสาร</p>
                            <p>สำนักงานปลัดกระทรวงสาธารณสุข</p>
                            <p>ถนนติวานนท์ ต.ตลาดขวัญ อ.เมือง</p>
                            <p>จ.นนทบุรี 11000</p>
                            <p>0-2590-1174 | 0-2590-1000</p>
                            <p>saraban@moph.go.th</p>
                        </div>
                    </div>

                    <div className="w-full lg:w-1/2 flex flex-col gap-2 font-serif items-center lg:items-end text-[#f5ecd5] mt-6 lg:mt-0 lg:mr-[70px] text-3xl">
                        <h1>Follow us</h1>
                        <div className="flex flex-row lg:flex-col gap-3 justify-center lg:justify-end">
                            <div className="border border-[#f5ecd5] rounded-full w-12 h-12 lg:w-14 lg:h-14 p-2 flex items-center justify-center hover:border-[#f0bb78] hover:text-[#f0bb78] transition-all duration-200"><FiFacebook /></div>
                            <div className="border border-[#f5ecd5] rounded-full w-12 h-12 lg:w-14 lg:h-14 p-2 flex items-center justify-center hover:border-[#f0bb78] hover:text-[#f0bb78] transition-all duration-200"><FaInstagram /></div>
                            <div className="border border-[#f5ecd5] rounded-full w-12 h-12 lg:w-14 lg:h-14 p-2 flex items-center justify-center hover:border-[#f0bb78] hover:text-[#f0bb78] transition-all duration-200"><FaXTwitter /></div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 lg:mt-10 flex flex-col items-center w-full">
                    <div className="w-full lg:w-1/3 flex flex-row flex-wrap justify-center text-[#f5ecd5] gap-2 text-[0.9rem] lg:text-[1rem]">
                        <Link href="/page/privacy" className="cursor-pointer hover:text-[#f0bb78] transition-all duration-200">ความเป็นส่วนตัว</Link>
                        <p>•</p>
                        <Link href="/page/termOFuse" className="cursor-pointer hover:text-[#f0bb78] transition-all duration-200">เงื่อนไขการใช้งาน</Link>
                        <p>•</p>
                        <Link href="/page/cookies" className="cursor-pointer hover:text-[#f0bb78] transition-all duration-200">เกี่ยวกับคุกกี้</Link>
                    </div>
                    <div className="w-full lg:w-3/5 copyright mt-2 pt-5 border-t-[1px] border-solid border-[#f0bb78]">
                        <p className="text-[#f5ecd5] text-center text-[0.7rem] lg:text-[0.7rem]">Copyright © 2022 - 2025 ผู้บริหารเทคโนโลยีสารสนเทศระดับสูง All rights reserved.</p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
