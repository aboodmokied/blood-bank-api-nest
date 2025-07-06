import { Controller, Post, Req, UseGuards , Body, Get, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { Request, Response } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RegisterUserDto } from './dto/create-user.dto';
import { RolesGuard } from 'src/roles/guards/roles.guard';
import { RolesDecorator } from 'src/roles/roles.decorator';

// @UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
    constructor(private userService:UserService){}
    @Post('register')
        register(@Body() registerUserDto: RegisterUserDto){
             return this.userService.registerUser(registerUserDto);    
        }
    @RolesDecorator('admin')
    @UseGuards(JwtAuthGuard,RolesGuard)
    @Get()
        allUsers(@Res() res:Response){
             return res.status(200).send({users:'all users'});    
        }


}
