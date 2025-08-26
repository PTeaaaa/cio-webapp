"use client";

import { useForm, SubmitHandler } from "react-hook-form";

// Define form data type for type safety
type SearchFormData = {
    allWords: string;
    exactPhrase: string;
    anyWords: string;
    excludeWords: string;
    rangeStart: string;
    rangeEnd: string;
};

// Define props for reusable FormField component
type FormFieldProps = {
    label: string;
    hint: string;
    inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
    eg: string;

};

// Reusable FormField component for consistent field rendering
function FormField({ label, hint, inputProps, eg }: FormFieldProps) {
    const id = `input-${label.replace(/\s/g, "-")}`;
    return (
        <>
            <label htmlFor={id} className="text-right pr-4 text-zinc-400">
                {label}
            </label>
            <input
                id={id}
                type="text"
                className="border border-gray-500 bg-[#202124] rounded p-2"
                aria-describedby={`${id}-hint`}
                {...inputProps}
            />
            <div id={`${id}-hint`} className="pl-4 text-zinc-400">
                {hint}
                <span className="text-white">{eg}</span>
            </div>
        </>
    );
}

// Centralized form field definitions for easy maintenance
const formFields: FormFieldProps[] = [
    {
        label: "ทุกคำเหล่านี้:",
        hint: "พิมพ์คำสำคัญ: ",
        eg: "2567 นายแพทย์",
    },
    {
        label: "คำหรือวลีที่ตรงตามนี้:",
        hint: 'ใส่คำที่ต้องการให้ตรงตามนี้ในเครื่องหมายอัญประกาศ: ',
        eg: '"สำนักงานปลัดกระทรวงสาธารณสุข"',
    },
    {
        label: "ไม่มีคำเหล่านี้:",
        hint: 'ใส่เครื่องหมายลบหน้าคำที่คุณไม่ต้องการ: ',
        eg: '-2560, -นางสาว',
    },
];

// Client component for form logic
export default function AdvancedSearch({ baseURL }: { baseURL: string }) {
    const { register, handleSubmit } = useForm<SearchFormData>();
    const onSubmit: SubmitHandler<SearchFormData> = (data) => {
        console.log("Form data:", data);
        // Example: Send data to API using baseURL
        // fetch(`${baseURL}/api/search`, { method: "POST", body: JSON.stringify(data) });
    };

    return (
        <div className="mb-8">
            <h2 className="text-xl mb-6">ค้นหาหน้าเว็บที่มี...</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-1 md:grid-cols-[200px_1fr_1fr] gap-y-4 items-center">
                    {formFields.map((field) => (
                        <FormField
                            key={field.label}
                            label={field.label}
                            hint={field.hint}
                            eg={field.eg}
                            inputProps={register(field.label as keyof SearchFormData)}
                        />
                    ))}


                    {/* Range inputs */}
                    <label htmlFor="range-start" className="text-right pr-4 text-zinc-400">
                        จำนวนตั้งแต่:
                    </label>
                    <div className="flex items-center">
                        <input
                            id="range-start"
                            type="text"
                            className="border border-gray-500 bg-[#202124] rounded p-2 w-full"
                            aria-describedby="range-hint"
                            {...register("rangeStart")}
                        />
                        <span className="px-4">ถึง</span>
                        <input
                            type="text"
                            className="border border-gray-500 bg-[#202124] rounded p-2 w-full"
                            {...register("rangeEnd")}
                        />
                    </div>
                    <div id="range-hint" className="pl-4 text-zinc-400">
                        ใส่สองจุดระหว่างค่าต่ำสุดและค่าสูงสุดของทุกชนิด: <span className="text-white">2564..2567</span>
                    </div>
                </div>


                <div className="flex justify-center pt-7">
                    <button
                        type="submit"
                        className="w-1/5 bg-[#14774a] text-white p-2 rounded mt-4"
                    >
                        ค้นหา
                    </button>
                </div>
                
            </form>
        </div>
    );
}