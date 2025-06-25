import { IsString, MinLength, IsEmail, MaxLength, IsNotEmpty } from "class-validator";
import { NotEmpty } from "sequelize-typescript";

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
}

export class ValidateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}
