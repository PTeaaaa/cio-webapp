import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { IoFilterCircle } from "react-icons/io5";
import Link from "next/link";

interface SearchResult {
    title: string;
    path: string;
}

export default function SearchBar({ onSearch, debounceTime = 300, placeholder = "Search..." }: { onSearch: (input: string) => void, debounceTime?: number, placeholder?: string }) {
    const [input, setInput] = useState("");
    const [results, setResults] = useState<SearchResult[]>([]);
    const [showResults, setShowResults] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const router = useRouter();
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Should be replaced with actual search logic hereeeeee
    const searchPages = (query: string): SearchResult[] => {
        const pages = [
            { title: "กรม", path: "/page/SubPlaceSelectPage/Department" },
            { title: "กระทรวงสาธารณสุข", path: "/page/YearSelectPage/PublicHealth" },
            { title: "กรมการแพทย์", path: "/page/YearSelectPage/MedicalService" },
            { title: "เขตสุขภาพที่ 1", path: "/page/YearSelectPage/HealthZone1" },
            { title: "ไข่", path: "/page/SubPlaceSelectPage/State" },
            { title: "Info Page", path: "/page/infopage/Surakmet67" },
        ];
        return pages.filter(page =>
            page.title.toLowerCase().includes(query.toLowerCase())
        );
    };

    useEffect(() => {
        const handler = setTimeout(() => {
            if (input.trim()) {
                const searchResults = searchPages(input);
                setResults(searchResults);
                setShowResults(true);
                onSearch(input);
            } else {
                setResults([]);
                setShowResults(false);
            }
        }, debounceTime);
        return () => clearTimeout(handler);
    }, [input, onSearch, debounceTime]);

    const handleResultClick = (path: string) => {
        router.push(path);
        setShowResults(false);
        setInput("");
        setExpanded(false);
    };

    // Click outside to collapse
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setExpanded(false);
            }
        }
        if (expanded) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [expanded]);

    useEffect(() => {
        if (expanded && inputRef.current) {
            inputRef.current.focus();
        }
    }, [expanded]);

    return (
        <div className="relative" ref={containerRef}>
            {/* Container for both states */}
            <div className="flex justify-end items-center">

                <Link
                    href="/page/AdvancedSearch"
                    title="การค้นหาขั้นสูง"
                    className={`${expanded ? "-mr-7" : "mr-3"} hover:cursor-pointer inline-flex items-center justify-center w-9 h-9 rounded`}
                >
                    <IoFilterCircle className="w-9 h-9" />
                </Link>

                {/* Search icon button */}
                <button
                    className={`bg-white rounded-full shadow flex items-center justify-end focus:outline-none z-10
                        ${expanded ? 'w-10 h-10 p-0 opacity-0 scale-0' : 'w-10 h-10 p-2 opacity-100 scale-100'}
                        transition-all duration-300 ease-in-out hover:cursor-pointer`}
                    onClick={() => setExpanded(true)}
                    aria-label="Open search"
                    tabIndex={expanded ? -1 : 0}
                >
                    <Search className="text-[#14774a] w-6 h-6" />
                </button>

                {/* Expanded search input */}
                <div
                    className={`flex items-center bg-white rounded-full shadow 
                        ${expanded
                            ? 'h-10 w-48 sm:w-64 px-3 py-1 mt-[6px] lg:mt-0 opacity-100 scale-100'
                            : 'w-5 h-10 px-0 py-0 opacity-0 scale-90'}
                        transition-all duration-400 ease`}
                >
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onFocus={() => input.trim() && setShowResults(true)}
                        onBlur={() => setTimeout(() => setShowResults(false), 100)}
                        placeholder={placeholder}
                        className={`bg-transparent outline-none transition-all duration-300
                            ${expanded ? 'w-full opacity-100' : 'w-0 opacity-0'}
                            text-black`}
                        tabIndex={expanded ? 0 : -1}
                    />
                    <Search className={`text-[#14774a] transition-all duration-300 ${expanded ? 'ml-2 w-5 h-5' : 'w-0 h-0'}`} />
                </div>
            </div>
            {/* Results dropdown */}
            <div
                className={`absolute right-0 top-full z-[10] mt-1 bg-white border rounded-md shadow-lg text-black
                    w-48 sm:w-64 overflow-hidden transition-all duration-300 ease-in-out
                    ${expanded && showResults && results.length > 0
                        ? 'max-h-60 opacity-100 scale-100'
                        : 'max-h-0 opacity-0 scale-95 pointer-events-none'}`}
            >
                {results.map((result, index) => (
                    <div
                        key={index}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onMouseDown={() => handleResultClick(result.path)}
                    >
                        {result.title}
                    </div>
                ))}
            </div>
        </div>
    );
}
