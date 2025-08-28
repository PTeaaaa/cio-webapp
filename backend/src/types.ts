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
    numberOrder: number;
    id: string;
    name: string;
    agency: string;
}

export type PersonPlacementSeeding = Pick<PersonForm, 'id' | 'name' | 'surname' | 'department' | 'year'>

export type PersonFormSeeding = Omit<PersonForm, 'imageUrl' | 'placeId'>;

export interface AccountForm {
    id: string;
    username: string;
    role: string;
    lastLoginAt: Date;
    passwordChangedAt?: Date;
    createdBy: string;
    createdAt: Date;
    modifiedBy: string;
    updatedAt: Date;
}
