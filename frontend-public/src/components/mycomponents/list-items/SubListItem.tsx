import Link from 'next/link';
import { MapPinHouse } from "lucide-react";

export default function ItemsList({ category, items }: { category: string, items: any[] }) {
    return (
        <div className="font-prompt grid grid-cols-1 gap-4 mb-6">
            {items.map((values, index) => (
                <div className="grid grid-cols-[auto_1fr] items-center gap-4" key={index}>
                    <MapPinHouse className="text-[#14774a] w-6 h-6" />
                    <Link
                        href={`/${category}/${values.id}?page=1`}
                        className="p-4 shadow-md rounded-xl border hover:bg-gray-100 transition-all duration-300"
                    >
                        <h2 className=" text-lg mb-1">
                            {values.name}
                        </h2>
                    </Link>
                </div>
            ))}
        </div>
    );
}
