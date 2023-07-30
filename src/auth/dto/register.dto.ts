import { IsNotEmpty, IsString, IsEmail } from 'class-validator';
export class RegisterDTO {
  @IsString()
  @IsNotEmpty({ message: 'firstName is required' })
  firstName: string;

  @IsString()
  @IsNotEmpty({ message: 'lastName is required' })
  lastName: string;

  @IsEmail()
  @IsNotEmpty({ message: 'email is required' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'username is required' })
  username: string;

  @IsString()
  @IsNotEmpty({ message: 'password is required' })
  password: string;
}
