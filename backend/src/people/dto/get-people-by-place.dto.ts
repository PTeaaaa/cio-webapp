import { IsIn, IsOptional, IsString, IsEnum } from 'class-validator';

// Define which fields are allowed for sorting people
export enum PeopleSortBy {
    NAME = 'name',
    YEAR = 'year',
}

export class GetPeopleByPlaceDto {
    @IsOptional()
    @IsString()
    @IsEnum(PeopleSortBy) // Only allows 'name', 'year'
    sortBy?: PeopleSortBy = PeopleSortBy.YEAR; // Default value

    @IsOptional()
    @IsString()
    @IsIn(['asc', 'desc'])
    sortOrder?: 'asc' | 'desc' = 'desc'; // Default value
}