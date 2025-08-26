import { IsString, IsNotEmpty, IsUUID, IsEmail, IsNumber, IsOptional } from 'class-validator';

export class CreatePersonDto {
    @IsOptional()
    @IsString()
    prefix?: string;

    @IsString()
    @IsNotEmpty()
    name!: string;

    @IsString()
    @IsNotEmpty()
    surname!: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsString()
    phone?: string;

    @IsOptional()
    @IsString()
    position?: string;

    // We also need to know which place to assign this person to.
    @IsUUID()
    @IsNotEmpty()
    placeId!: string;

    @IsString()
    @IsNotEmpty()
    department!: string;

    @IsNumber()
    year!: number;
}