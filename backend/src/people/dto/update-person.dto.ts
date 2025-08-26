import { IsString, IsUUID, IsEmail, IsOptional } from 'class-validator';

export class UpdatePersonDto {
    @IsOptional()
    @IsString()
    prefix?: string;

    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    surname?: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsString()
    phone?: string;

    @IsOptional()
    @IsString()
    position?: string;

    @IsOptional()
    @IsUUID()
    placeId?: string;
}