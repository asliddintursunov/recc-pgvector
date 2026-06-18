import { IsBoolean, IsOptional, IsString } from 'class-validator';


export class AuthDto {
    @IsString()
    username!: string;

    @IsString()
    password!: string;
}

export class RegisterDto extends AuthDto {
    @IsBoolean()
    @IsOptional()
    merchantIntent?: boolean;
}
