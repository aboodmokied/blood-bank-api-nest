import { Controller, Get, Post, Req, Res, UseGuards , Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Request, Response } from 'express';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { User } from 'src/user/user.model';
import { ChangePasswordDto, ResetPasswordDto, SingInDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService:AuthService){}

    @UseGuards(LocalAuthGuard)
    @Post('login')
    login(@Req() req:Request){
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

    // @UseGuards(JwtAuthGuard)
    @Post('reset-password')
    async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
        return this.authService.resetPassword(resetPasswordDto);
    }

    @Post('verify-code') 
    async verifyCode(@Body('email') email: string, @Body('code') code: string,@Body('role') role: string) {
        return this.authService.verifyResetCode(email, code,role);
    }

    @Post('change-password')
  async changePassword(@Req() req:Request,@Body() changePasswordDto: ChangePasswordDto) {
    const bearerToken=req.headers.authorization;
    const token=bearerToken?.split(' ')[1];
    if(!token){
        throw new UnauthorizedException();
    }
    return this.authService.changePassword(token,changePasswordDto);
  }
}
