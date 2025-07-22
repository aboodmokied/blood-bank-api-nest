import { IsString, MinLength, IsEmail, MaxLength, IsNotEmpty, IsEnum } from "class-validator";
import { NotEmpty } from "sequelize-typescript";
import { Role } from "src/types/auth.types";

export class RegisterUserDto {
    @IsString()
    @IsNotEmpty({message : "The Name required"})
    @MinLength(3, { message: "Name must be at least 3 characters" })
    @MaxLength(20, { message: "Name must be at most 20 characters" })
    name : string;
    @IsEmail({}, { message: 'Invalid email address' })
    @IsNotEmpty({message : "The Email required"})
    email : string;
    @IsString()
    @IsNotEmpty({message : "The Password required"})
    @MinLength(6, { message: 'Password is too short. Minimum length is 6 characters' })
    password : string;
  
    @IsNotEmpty({message : "User Role required"})
    @IsString()
    role:Role
}

export class ValidateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  role:Role
}
