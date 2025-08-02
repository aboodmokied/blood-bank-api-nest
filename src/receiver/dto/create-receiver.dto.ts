import { IsString, IsNotEmpty, IsIn, IsNumber, Min, Max , IsEmail} from 'class-validator';


export class CreateReceiverDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    
    @IsEmail({})
    @IsNotEmpty()
    email: string;

    //   @IsNumber()
    //   @IsNotEmpty()
    //   nationalId: number;

    @IsNumber()
    @Min(1)
    @Max(120)
    age: number;

    @IsString()
    @IsIn(['Male', 'Female'])
    gender: string;
}