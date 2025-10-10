import { IsIn, IsOptional, IsString, IsEnum } from 'class-validator';

// Define which fields are allowed for sorting places
export enum PlaceSortBy {
    NAME = 'name',
    NUMBER_ORDER = 'numberOrder',
}

export class GetPlacesByAgencyDto {
    @IsOptional()
    @IsString()
    @IsEnum(PlaceSortBy) // Only allows 'name', 'numberOrder'
    sortBy?: PlaceSortBy = PlaceSortBy.NUMBER_ORDER; // Default value

    @IsOptional()
    @IsString()
    @IsIn(['asc', 'desc'])
    sortOrder?: 'asc' | 'desc' = 'asc'; // Default value
}