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
    SequelizeModule.forFeature([Token])
  ],
  controllers: [AuthController],
  providers: [AuthService,LocalStrategy,JwtAuthGuard],
  exports: [JwtAuthGuard,AuthService]
})
export class AuthModule {}
