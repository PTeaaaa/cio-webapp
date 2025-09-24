"use client";

import { useState, useMemo } from "react";
import ComboboxMain from "./combobox/combobox-main";
import ComboboxSub from "./combobox/combobox-sub";
import ComboboxYear from "./combobox/combobox-year";

export default function FilterSearch() {
    const [orgType, setOrgType] = useState<string>("");       // for disabling agency until org selected
    const [agencyQuery, setAgencyQuery] = useState<string>(""); // what user types

    // Your agency list (you can later fetch from API and filter by orgType)
    const allAgencies = [
        "สำนักงานปลัดกระทรวงสาธารณสุข",
        "กรมการแพทย์",
        "กรมการแพทย์แผนไทยและการแพทย์ทางเลือก",
        "กรมสุขภาพจิต",
        "กรมวิทยาศาสตร์การแพทย์",
        "กรมอนามัย",
        "กรมควบคุมโรค",
        "กรมสนับสนุนบริการสุขภาพ",
        "สถาบันพระบรมราชชนก",
        "สำนักงานคณะกรรมการอาหารและยา",
        "เขตสุขภาพที่ 1",
        "เขตสุขภาพที่ 2",
        "เขตสุขภาพที่ 3",
        "สำนักงานสาธารณสุขจังหวัดประจวบคีรีขันธ์",
    ];

    // Example: filter by orgType here (for now just return all)
    const agencies = useMemo(() => {
        // TODO: filter allAgencies by orgType if needed
        return allAgencies;
    }, [orgType]);

    return (
        <div>
            <h2 className="text-xl mb-6">ค้นหาบุคลากรที่สังกัดอยู่ที่...</h2>
            <div className="flex flex-row">
                <form className="space-y-6 w-full md:w-1/2 pr-20">
                    <div>
                        <label className="block mb-2 font-medium">ประเภทองค์กร</label>

                        <ComboboxMain
                            value={orgType}
                            onChange={setOrgType}
                        />
                    </div>

                    <div>
                        <label className="block mb-2 font-medium">ชื่อหน่วยงาน</label>

                        <ComboboxSub disabled={!orgType} orgType={orgType} />

                        {!orgType && (
                            <p className="text-xs text-gray-500 mt-1 ml-3 text-red-500">กรุณาเลือกประเภทองค์กรก่อน</p>
                        )}
                    </div>

                    <div>
                        <label className="block mb-2 font-medium">ปีงบประมาณ</label>

                        <ComboboxYear
                        // disabled={!orgType}
                        />

                        {!orgType && (
                            <p className="text-xs text-gray-500 mt-1 ml-3 text-red-500">กรุณาเลือกหน่วยงานก่อน</p>
                        )}
                    </div>
                </form>

                <div className="w-2/3 border-l-1 border-gray-300 text-center">
                    <div className="text-lg font-medium mb-4">ผลลัพธ์การค้นหา</div>

                    <div className="font-prompt grid grid-cols-1 mb-6 items-center mx-11 my-3 text-lg mb-1 p-3 shadow-md rounded-xl border hover:bg-gray-100 transition-all duration-300">

                        <h2 className="font-semibold text-base mb-1">
                            ปีงบประมาณ XXXX
                        </h2>
                        <p className="text-muted-foreground text-sm">
                            Mr.X Brian Jown
                        </p>

                    </div>

                    <div className="font-prompt grid grid-cols-1 mb-6 items-center mx-11 my-3 text-lg mb-1 p-3 shadow-md rounded-xl border hover:bg-gray-100 transition-all duration-300">

                        <h2 className="font-semibold text-base mb-1">
                            ปีงบประมาณ XXXX
                        </h2>
                        <p className="text-muted-foreground text-sm">
                            Mr.X Brian Jown
                        </p>

                    </div>

                    <div className="font-prompt grid grid-cols-1 mb-6 items-center mx-11 my-3 text-lg mb-1 p-3 shadow-md rounded-xl border hover:bg-gray-100 transition-all duration-300">

                        <h2 className="font-semibold text-base mb-1">
                            ปีงบประมาณ XXXX
                        </h2>
                        <p className="text-muted-foreground text-sm">
                            Mr.X Brian Jown
                        </p>

                    </div>

                    <div className="font-prompt grid grid-cols-1 mb-6 items-center mx-11 my-3 text-lg mb-1 p-3 shadow-md rounded-xl border hover:bg-gray-100 transition-all duration-300">

                        <h2 className="font-semibold text-base mb-1">
                            ปีงบประมาณ XXXX
                        </h2>
                        <p className="text-muted-foreground text-sm">
                            Mr.X Brian Jown
                        </p>

                    </div>

                    <div className="font-prompt grid grid-cols-1 mb-6 items-center mx-11 my-3 text-lg mb-1 p-3 shadow-md rounded-xl border hover:bg-gray-100 transition-all duration-300">

                        <h2 className="font-semibold text-base mb-1">
                            ปีงบประมาณ XXXX
                        </h2>
                        <p className="text-muted-foreground text-sm">
                            Mr.X Brian Jown
                        </p>

                    </div>

                </div>
            </div>
        </div>
    );
}