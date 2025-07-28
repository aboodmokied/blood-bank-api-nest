import { IsString, MaxLength, MinLength, IsEmail, IsNotEmpty } from "class-validator";
import { Role } from "src/types/auth.types";

export class SingUpDto {
    // @IsString()
    // @MinLength(3, { message: "Name must be at least 3 characters" })
    // @MaxLength(20, { message: "Name must be at most 20 characters" })
    // name: string;

    @IsString()
    @IsEmail({}, { message: "Email is not valid" })
    email: string;

    @IsString({ message: 'Password must be a string' })
    password: string;

    // @IsString()
    // @MinLength(3, { message: "Role must be at least 3 characters" })
    // @MaxLength(20, { message: "Role must be at most 20 characters" })
    // role: string;
}

export class SingInDto {
    @IsString()
    @IsEmail({}, { message: "Email is not valid" })
    email: string;

    @IsString({ message: 'Password must be a string' })
    password: string;
    
}

export class ResetPasswordDto {
    @IsString()
    @IsEmail({}, { message: "Email is not valid" })
    email: string;

    @IsNotEmpty({message : "User Role required"})
    @IsString()
    role:Role
}

export class ChangePasswordDto {

    @IsString()
    @MinLength(3, { message: "password must be at least 3 characters" })
    @MaxLength(20, { message: "password must be at most 20 characters" })
    newPassword: string;

    @IsString()
    @IsEmail({}, { message: "Email is not valid" })
    email: string;

    @IsNotEmpty({message : "User Role required"})
    @IsString()
    role:Role
}