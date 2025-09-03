import { IsString, IsNotEmpty, MinLength, IsIn } from 'class-validator';

export class SignupDto {
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
  @IsIn(['admin', 'user', 'moderator'])
  role!: string;

  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  assignPlace!: string[];
}
