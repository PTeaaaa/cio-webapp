"use client";
import Image from 'next/image';

export default function NotFoundCard({ text }: { text: string }) {
    return (
        <div className="flex justify-center pb-[90px] pt-[30px]">

            <div className="h-fit bg-white rounded-2xl shadow-xl/30 font-prompt p-10 w-[80%]">

                <div className="flex flex-col">
                    <div className="w-full flex flex-col items-center justify-center">
                        
                        <Image
                            src="/assets/NotSmile.svg"
                            alt="404"
                            width={200}
                            height={50}
                        />
                        
                        <h1 className="text-4xl font-bold pt-10 text-center">
                            <span style={{ whiteSpace: "nowrap" }}>ขออภัย</span>
                        </h1>

                        <h2 className="text-3xl font-bold pt-2 text-center">
                            <span style={{ whiteSpace: "nowrap" }}>[ {text} ]</span>
                        </h2>
                    </div>

                </div>
            </div>
        </div>
    );
}