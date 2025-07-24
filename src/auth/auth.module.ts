import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from 'src/user/user.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { Token } from './token.model';
import { User } from 'src/user/user.model';
import { Hospital } from 'src/user/hopsital.model';
import { Admin } from 'src/user/admin.model';
import { Donor } from 'src/user/donor.model';
import { Doctor } from 'src/user/doctor.model';
import { ForgetPassword } from 'src/user/forgetPassword.model';

@Module({
  imports:[
    PassportModule,
    JwtModule.registerAsync({
      imports:[ConfigModule],
      useFactory:async(configService:ConfigService)=>({
        secret:configService.get<string>('JWT_SECRET'),
        signOptions:{
          expiresIn:configService.get<string>('JWT_EXPIRATION'),
        },
      }),
      inject:[ConfigService]
    }),
    forwardRef(() => UserModule),
    SequelizeModule.forFeature([Token, User , Hospital, Admin , Donor, Doctor , ForgetPassword]), // Ensure all models are imported
  ],
  controllers: [AuthController],
  providers: [AuthService,LocalStrategy,JwtAuthGuard],
  exports: [JwtAuthGuard,AuthService]
})
export class AuthModule {}
