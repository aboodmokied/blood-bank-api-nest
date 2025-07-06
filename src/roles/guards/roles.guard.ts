import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { Request } from "express";
import { AuthPayload, Role } from "src/types/auth.types";

@Injectable()
export class RolesGuard implements CanActivate{
    constructor(private readonly reflector:Reflector){}
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const requiredRoles=this.reflector.get<Role[]>('roles',context.getHandler()) || this.reflector.get<Role[]>('roles',context.getClass());
        if(!requiredRoles){ // no required roles
            return true;
        }
        const request:Request=context.switchToHttp().getRequest();
        const user=request.user as AuthPayload;
        // check the roles
        if(!user || !requiredRoles?.some(role=>user.role.includes(role))){
            throw new ForbiddenException('You Do Not Have Permission To Access This Resource.'); 
        }
        return true;
    }
};