import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import * as bcrypt from 'bcryptjs';
import { InjectModel } from '@nestjs/sequelize';
import { Token } from './token.model';
import { User } from 'src/user/user.model';
import { AuthPayload } from 'src/types/auth.types';
import { randomUUID } from 'crypto';


@Injectable()
export class AuthService {
    constructor(@InjectModel(Token) private tokenModel:typeof Token,private jwtService:JwtService){}
    async isValidTokenWithUser(token:string){
        try {
            const signature=token?.split('.')[2];
            if(signature){
                const tokenObj=await this.tokenModel.findOne({
                    where:{signature,revoked:false},
                    include:{model:User,attributes:['id','name','email']}
                });
                const {sub,email}=this.jwtService.decode<AuthPayload>(token);
                if(tokenObj && tokenObj.user){
                    if(sub==tokenObj.user.id&&email==tokenObj.user.email)
                    return tokenObj.user;
                }
            }
            return null;
        } catch (error) {
            return null;
        }
    }

    async generateJwtToken(user:User){
        const payload:AuthPayload={
            sub:user.id,
            email:user.email,
            jti:randomUUID(),
        }
        const accessToken=this.jwtService.sign(payload);
        const signature=accessToken.split('.')[2];
        await this.tokenModel.create({
            signature,
            userId:user.id
        })
        const {id,name,email}=user;
        return {token:accessToken,user:{id,name,email}};
    }

    async logout(token:string){
        const signature=token.split('.')[2];
        return this.tokenModel.update({revoked:true},{where:{signature}});
    }
    
}
