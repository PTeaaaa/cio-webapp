import { headers } from "next/headers";
import AdvancedSearch from "@/components/mycomponents/advSearch";

// Server component to handle headers and main layout
export default async function AdSearch() {
  // Handle headers with error handling and fallback
  let baseURL = "https://fallback-host.com";
  try {
    const requestHeaders = await headers();
    const host = requestHeaders.get("host") || "localhost";
    const protocol =
      process.env.NEXT_PUBLIC_PROTOCOL ||
      (process.env.NODE_ENV === "development" ? "http" : "https");
    baseURL = `${protocol}://${host}`;
  } catch (error) {
    console.error("Failed to fetch headers:", error);
  }

  return (
    <div className="min-h-screen bg-[#202124] text-white p-6 pt-[70px]">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-2xl font-bold text-[#14774a] mb-4">
          การค้นหาขั้นสูง
        </h1>
        <div className="bg-black h-[1px] mb-8" />

        <AdvancedSearch baseURL={baseURL} />
      </div>
    </div>
  );
}