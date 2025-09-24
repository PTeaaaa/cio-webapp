export default function NoDataCard() {
    return (
        <div className="flex justify-center pb-[90px] pt-[30px]">

            <div className="h-fit bg-white rounded-2xl shadow-xl/30 font-prompt p-10 w-[80%]">

                <div className="flex flex-col">
                    <div className="w-full flex flex-col items-center justify-center">

                        <h1 className="text-2xl md:text-4xl font-bold p-10 text-center">
                            <span style={{ whiteSpace: "nowrap" }}>ไม่พบข้อมูล</span>
                        </h1>
                    </div>

                </div>
            </div>
        </div>
    );
}