import { Controller, Post, Req, UseGuards , Body } from '@nestjs/common';
import { UserService } from './user.service';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RegisterUserDto } from './dto/create-user.dto';

// @UseGuards(JwtAuthGuard) // 🔒 applies to ALL routes in this controller
@Controller('user')
export class UserController {
    constructor(private userService:UserService){}
    @Post('register')
        register(@Body() registerUserDto: RegisterUserDto){
             return this.userService.registerUser(registerUserDto);    
        }

}
