import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {

    @ApiProperty({
        description: 'Email of the user',
        nullable: false,
        minLength: 6,
        example: "cristian.aiki1@gmail.com"
    })
    @IsString()
    @IsEmail()
    email: string;
    
  
    @ApiProperty({
        // es el password
        description: 'Password of the user',
        nullable: false,
        minLength: 6,
        example: "Password123!"
    })
    @IsString()
    @MinLength(6)
    @MaxLength(50)
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'The password must have a Uppercase, lowercase letter and a number'
    })
    password: string;

    @ApiProperty({
        description: 'Full name of the user',
        nullable: false,
        example: "Cristian Micchele"
    })
    @IsString()
    @MinLength(1)
    fullName: string;

}