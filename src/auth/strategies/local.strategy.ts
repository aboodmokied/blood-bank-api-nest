import { BadRequestException, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import {Strategy} from 'passport-local';
import { UserService } from "src/user/user.service";
import { SingUpDto } from "../dto/auth.dto";
import { Request } from "express";
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy,'local'){
    constructor(private readonly userService:UserService){
        super({
            usernameField:'email',
            passReqToCallback: true
        })
    }
    async validate(req:Request,email: string, password: string) {
        const role = (req.body as any).role;
        const user = await this.userService.validateUser({ email, password,role });
        if(!user){
            console.log('here');
            throw new BadRequestException(['البيانات المدخلة غير صحيحة']);
        }
        return user;
    }
}
