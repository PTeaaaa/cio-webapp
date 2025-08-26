"use client";

import { PersonForm } from '@/types';

export default function InfoCard({ personForm }: { personForm: PersonForm }) {
    return (
        <div className="flex justify-center pb-[90px] pt-[30px]">

            <div className="h-fit bg-white rounded-2xl shadow-xl/30 font-prompt p-10 w-[80%]">

                <div className="flex flex-col lg:flex-row justify-between gap-8">
                    <div className="w-full flex flex-col items-center lg:items-start">

                        <p className="text-gray-600 mb-4 md:mb-6 text-sm md:text-base text-center lg:text-left">
                            ข้อมูลผู้บริหารเทคโนโลยีสารสนเทศระดับสูง
                        </p>

                        <h1 className="text-2xl md:text-4xl font-bold mb-4 md:mb-10 text-center lg:text-left">
                            <span>{personForm.prefix}</span>
                            <span style={{ whiteSpace: "nowrap" }}>{personForm.name}</span>
                            <span style={{ whiteSpace: "nowrap" }}> {personForm.surname ?? "เกิดข้อผิดพลากในการแสดงนามสกุล"} </span>
                        </h1>

                        <div className="leading-[1.8] text-base md:text-lg text-center lg:text-left">
                            <p><span className="font-semibold">ตำแหน่งตามหน่วยงาน :</span> {personForm.position || "ไม่พบตำแหน่งตามหน่วยงาน"}</p>
                            <p><span className="font-semibold">หน่วยงาน :</span> {personForm.department || "ไม่พบหน่วยงาน"}</p>
                            <p><span className="font-semibold">อีเมล :</span> {personForm.email || "ไม่พบอีเมล"}</p>
                            <p><span className="font-semibold">เบอร์โทรศัพท์ :</span> {personForm.phone || "ไม่พบเบอร์โทรศัพท์"}</p>
                        </div>
                    </div>

                    <div className="w-full flex flex-shrink items-center justify-center lg:justify-end">
                        <div className="w-fit h-fit flex bg-red-600 rounded-sm overflow-hidden mt-4 md:mt-0">
                            <img
                                src={personForm.imageUrl}
                                alt={"ไม่พบรูปภาพ"}
                                className="object-cover w-full h-full"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}