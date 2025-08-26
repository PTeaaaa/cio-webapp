export interface PersonForm {
    id: string;
    prefix: string;
    name: string;
    surname: string;
    email: string;
    phone: string;
    position: string;
    imageUrl?: string;
    placeId: string;
    department: string;
    year: number;
}

export interface PlaceForm {
    id: string;
    name: string;
    agency: string;
}

export interface BreadcrumbItem {
    label: string;
    href: string;
}

export interface PaginationMeta {
    total: number;
    page: number;
    limit: number;
    lastPage: number;
}

export interface PlacesResponse {
    data: PlaceForm[];
    meta: PaginationMeta;
}

export interface PeopleResponse {
    data: PersonForm[];
    meta: PaginationMeta;
}