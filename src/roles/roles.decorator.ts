import { SetMetadata } from "@nestjs/common"
import { Role } from "src/types/auth.types";

export const RolesDecorator=(...roles:Role[])=>SetMetadata('roles',roles);