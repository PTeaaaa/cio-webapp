import Example from "@/services/navigation/search/example-integration";

export default async function FilterSearchPage() {

    return (
        <div className="min-h-screen bg-gray-50 text-black p-6 pt-[70px]">
            <div className="max-w-6xl mx-auto">

                <h1 className="text-2xl font-bold text-[#14774a] mb-4" >
                    <span style={{ whiteSpace: "nowrap" }}>ตัวกรองการค้นหา</span>{" "}
                    <span style={{ whiteSpace: "nowrap" }}>(Filter Search)</span>
                </h1>
                <div className="bg-black h-[1px] mb-8" />

                <Example />
            </div>
        </div>
    );
}