import { PlaceForm, PlaceSearchResult, PersonForm } from "@/types";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:3003';

export const searchPlacesByName = async (
    searchTerm: string,
    limit: number = 10,
    offset: number = 0,
    agency?: string
): Promise<PlaceSearchResult[]> => {

    // หาก searchTerm ไม่มีค่าหรือเป็นช่องว่าง, คืนค่า empty array
    if (!searchTerm || !searchTerm.trim()) {
        console.log("searchPlacesByName: searchTerm is empty or missing.");
        return [];
    }

    try {
        const trimmedSearchTerm = searchTerm.trim();

        // Build URL with agency parameter if provided
        let url = `${BACKEND_URL}/search/places?name=${encodeURIComponent(trimmedSearchTerm)}&limit=${limit}&offset=${offset}`;

        if (agency && agency.trim() !== '') {
            url += `&agency=${encodeURIComponent(agency.trim())}`;
        }

        console.log('searchPlacesByName - Making request to:', url);
        console.log('searchPlacesByName - BACKEND_URL:', BACKEND_URL);
        console.log('searchPlacesByName - Parameters:', { searchTerm: trimmedSearchTerm, agency, limit, offset });

        const response = await fetch(url, {
            method: 'GET',
            // Add timeout to prevent hanging
            signal: AbortSignal.timeout(5000), // 5 second timeout
        });

        console.log('searchPlacesByName - Response status:', response.status, response.statusText);
        console.log('searchPlacesByName - Response headers:', Object.fromEntries(response.headers.entries()));

        if (!response.ok) {
            if (response.status === 404) {
                console.log(`No places found for search term: "${trimmedSearchTerm}" (404).`);
                return []; // Return empty array instead of null for search results
            }

            const errorBody = await response.text(); // อ่านเป็น text ก่อนเพื่อ debug
            console.error(`Error searching places by name: "${trimmedSearchTerm}". Status: ${response.status}. Body: ${errorBody.substring(0, 100)}`);
            throw new Error(`Failed to search places for term: "${trimmedSearchTerm}" with status ${response.status}`);
        }

        // แปลง Response Body เป็น JSON และ transform ให้เป็นรูปแบบที่ combobox ต้องการ
        const backendResults: PlaceForm[] = await response.json();

        // Transform backend data to match combobox expectations
        const searchResults: PlaceSearchResult[] = Array.isArray(backendResults)
            ? backendResults.map(place => ({
                value: place.id,
                label: place.name,
                // Optional: include agency in label if needed
                // label: place.agency ? `${place.name} (${place.agency})` : place.name,
            }))
            : [];

        console.log(`Found ${searchResults.length} places for search term: "${trimmedSearchTerm}"`);
        return searchResults;
    }
    catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error(`Error in searchPlacesByName for term "${searchTerm}":`, errorMessage);
        console.error('Full error object:', error);

        // Return empty array on error instead of fallback results
        console.log("Returning empty search results due to error.");
        return [];
    }
};

export const getInitialPlaces = async (
    limit: number = 10,
    offset: number = 0,
    agency?: string
): Promise<PlaceSearchResult[]> => {
    try {
        // Build URL with agency parameter if provided
        let url = `${BACKEND_URL}/places?limit=${limit}&offset=${offset}`;

        if (agency && agency.trim() !== '') {
            url = `${BACKEND_URL}/places/by-agency/${encodeURIComponent(agency.trim())}?page=${Math.floor(offset / limit) + 1}&limit=${limit}`;
        }

        console.log('getInitialPlaces - Making request to:', url);
        console.log('getInitialPlaces - Parameters:', { agency, limit, offset });

        const response = await fetch(url, {
            method: 'GET',
            signal: AbortSignal.timeout(5000), // 5 second timeout
        });

        console.log('getInitialPlaces - Response status:', response.status, response.statusText);

        if (!response.ok) {
            if (response.status === 404) {
                console.log(`No initial places found (404).`);
                return [];
            }

            const errorBody = await response.text();
            console.error(`Error fetching initial places. Status: ${response.status}. Body: ${errorBody.substring(0, 100)}`);
            throw new Error(`Failed to fetch initial places with status ${response.status}`);
        }

        // Handle different response formats based on endpoint
        let backendResults: PlaceForm[] = [];

        if (agency && agency.trim() !== '') {
            // Agency-specific endpoint returns PlacesResponse format
            const placesResponse = await response.json();
            backendResults = Array.isArray(placesResponse.places) ? placesResponse.places : [];
        } else {
            // General places endpoint returns PlaceForm[] directly
            const results = await response.json();
            backendResults = Array.isArray(results) ? results : [];
        }

        // Transform backend data to match combobox expectations
        const searchResults: PlaceSearchResult[] = backendResults.map(place => ({
            value: place.id,
            label: place.name,
        }));

        console.log(`Found ${searchResults.length} initial places`);
        return searchResults;
    }
    catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error(`Error in getInitialPlaces:`, errorMessage);
        console.error('Full error object:', error);

        // Return empty array on error
        console.log("Returning empty initial places due to error.");
        return [];
    }
};

export const searchYear = async (
    searchTerm: string,
    limit: number = 10,
    offset: number = 0,
): Promise<PlaceSearchResult[]> => {
    // หาก searchTerm ไม่มีค่าหรือเป็นช่องว่าง, คืนค่า empty array
    if (!searchTerm || !searchTerm.trim()) {
        console.log("searchYear: searchTerm is empty or missing.");
        return [];
    }

    try {
        const trimmedSearchTerm = searchTerm.trim();
        const url = `${BACKEND_URL}/search/years?name=${encodeURIComponent(trimmedSearchTerm)}&limit=${limit}&offset=${offset}`;

        const response = await fetch(url, {
            method: "GET",
            signal: AbortSignal.timeout(5000), // 5 second timeout
        });

        if (!response.ok) {
            if (response.status === 404) {
                console.log(`No people found for year/name term: "${trimmedSearchTerm}" (404).`);
                return [];
            }

            const errorBody = await response.text();
            console.error(
                `Error searching years (people by name/year): "${trimmedSearchTerm}". Status: ${response.status}. Body: ${errorBody.substring(0, 100)}`
            );
            throw new Error(
                `Failed to search years for term: "${trimmedSearchTerm}" with status ${response.status}`
            );
        }

        // Backend returns array of people; we must extract unique year values
        const backendResults: PersonForm[] = await response.json();

        const uniqueYears = Array.from(
            new Set(
                (Array.isArray(backendResults) ? backendResults : [])
                    .map((p) => p?.year)
                    .filter((y): y is number => typeof y === "number" && Number.isFinite(y))
            )
        );

        // Sort years (desc) so recent years show first
        uniqueYears.sort((a, b) => b - a);

        // Apply offset/limit on distinct year list
        const pagedYears = uniqueYears.slice(offset, offset + limit);

        const searchResults: PlaceSearchResult[] = pagedYears.map((y) => ({
            value: String(y),
            label: String(y),
        }));

        console.log(`Found ${searchResults.length} unique years for term: "${trimmedSearchTerm}"`);
        return searchResults;
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error(`Error in searchYear for term "${searchTerm}":`, errorMessage);

        // Return empty array on error
        console.log("Returning empty year search results due to error.");
        return [];
    }
};