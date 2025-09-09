export interface Person {
    id: string;
    prefix?: string;
    name: string;
    surname: string;
    email?: string;
    phone?: string;
    position?: string;
    imageUrl?: string;
    placeId?: string;
    department: string;
    year: number;
    createdAt: Date;
    updatedAt: Date;
}

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

export type CreatePersonPayload = Omit<PersonForm, 'id' | 'imageUrl'>

export type UpdatePersonPayload = Partial<Omit<PersonForm, "id">>;

export interface Place {
    id: string;
    name: string;
    agency: string;
}

export type User = {
    id: string;
    username?: string;
    role?: string;
    assignedPlaces?: any;
    rememberMe?: boolean;
};

export type QueueItem = {
    resolve: (value: Response) => void;
    reject: (reason: any) => void;
};

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
    isActive: boolean;
    assignedPlaces?: AccountPlace[];
}

export interface AccountPlace {
    id: number;
    accountId: string;
    placeId: string;
    place: {
        id: string;
        name: string;
        agency: string;
    };
}

export interface UpdateAccountPayload {
    username?: string;
    role?: string;
    isActive?: boolean;
    assignedPlaces?: string[];
}