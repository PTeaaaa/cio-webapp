import { IsString, IsOptional } from 'class-validator';

export class UpdatePlaceDto {

    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    agency?: string;
}