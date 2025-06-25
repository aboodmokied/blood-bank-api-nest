import { Controller, Get, Post, Req, Res, UseGuards , Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Request, Response } from 'express';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { User } from 'src/user/user.model';
import { SingInDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService:AuthService){}

    @UseGuards(LocalAuthGuard)
    @Post('login')
    login(@Req() req:Request , @Body() singInDto : SingInDto){
        return this.authService.generateJwtToken(req.user as User);    
    }

    @UseGuards(JwtAuthGuard)
    @Get('logout')
    async logout(@Req() req:Request,@Res() res:Response){
        const token=req.headers.authorization?.split(' ')[1];
        await this.authService.logout(token!);
        return res.sendStatus(204);   
    }

//     @RolesDecorator(Roles.User)
    @UseGuards(JwtAuthGuard)
    @Get('me')
    me(@Req() req:Request){
        return {user:req.user}
    }
}
