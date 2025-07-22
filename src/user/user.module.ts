import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './user.model';
import { AuthModule } from 'src/auth/auth.module';
import { Admin } from './admin.model';
import { Doctor } from './doctor.model';
import { Donor } from './donor.model';
import { Hospital } from './hopsital.model';

@Module({
  imports:[SequelizeModule.forFeature([User,Admin,Doctor,Donor,Hospital]),forwardRef(() => AuthModule),],
  providers: [UserService],
  controllers: [UserController],
  exports:[UserService]
})
export class UserModule {}
