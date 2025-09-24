import Link from 'next/link';
import { CalendarRange } from "lucide-react";

export default function ItemsList({ category, placeUUID, items }: { category: string, placeUUID: string, items: any[] }) {
    return (
        <div className="font-prompt grid grid-cols-1 gap-4 mb-6">
            {items.map((values, index) => (

                <div className="grid grid-cols-[auto_1fr] items-center gap-4" key={index}>
                    <CalendarRange className="text-[#14774a] w-6 h-6" />
                    <Link
                        href={`/${category}/${placeUUID}/${values.id}`}
                        className="p-4 shadow-md rounded-xl border hover:bg-gray-100 transition-all duration-300"
                >

                        <h2 className="font-semibold text-lg mb-1">
                            ปีงบประมาณ {values.year}
                        </h2>
                        <p className="text-muted-foreground text-sm">
                            {values.prefix}{values.name} {values.surname}
                        </p>

                    </Link>
                </div>
                
            ))}
        </div>
    );
}
