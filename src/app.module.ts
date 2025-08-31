import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { RolesModule } from './roles/roles.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { MedicalHistoryModule } from './medical-history/medical-history.module';
import { BloodRequestModule } from './blood-request/blood-request.module';
import { ProfileModule } from './profile/profile.module';
import { AppointmentModule } from './appointment/appointment.module';
import { DonationModule } from './donation/donation.module';
import { BloodUnitModule } from './blood-unit/blood-unit.module';
import { MedicalTestModule } from './medical-test/medical-test.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes ConfigService available app-wide
    }),
    MailerModule.forRoot({
      transport: {
        service: process.env.EMAIL_SERVICE,
        secure: true, // true for 465, false for other ports
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      },
    }),
    // SequelizeModule.forRootAsync({
    //   imports: [ConfigModule],
    //   useFactory: (configService: ConfigService) => ({
    //     dialect: configService.get<'postgres' | 'mysql' | 'sqlite'>('DB_DIALECT'),
    //     host: configService.get<string>('DB_HOST'),
    //     port: configService.get<number>('DB_PORT'),
    //     username: configService.get<string>('DB_USERNAME'),
    //     password: configService.get<string>('DB_PASSWORD'),
    //     database: configService.get<string>('DB_NAME'),
    //     autoLoadModels: true,
    //     synchronize: true, // Set false in production
    //   }),
    //   inject: [ConfigService],
    // }),
    DatabaseModule,
    AuthModule,
    UserModule,
    RolesModule,
    MedicalHistoryModule,
    BloodRequestModule,
    ProfileModule,
    AppointmentModule,
    DonationModule,
    BloodUnitModule,
    MedicalTestModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
