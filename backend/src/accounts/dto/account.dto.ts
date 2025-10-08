import { IsString, IsNotEmpty, MinLength, IsIn, IsArray, ValidateIf } from 'class-validator';

export class AccountDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  username!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password!: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['admin', 'user'])
  role!: string;

  @IsArray()
  @ValidateIf((o) => o.assignPlace && o.assignPlace.length > 0)
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  assignPlace!: string[];
}
