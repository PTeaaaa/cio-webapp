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
}

export type User = {
    id: string;
    username?: string;
    role?: string;
    assignedPlaces?: any;
};

export type QueueItem = {
    resolve: (value: Response) => void;
    reject: (reason: any) => void;
};