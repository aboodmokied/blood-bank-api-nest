import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { Token } from 'src/auth/token.model';
import { MedicalHistory } from 'src/medical-history/models/medical-history.model';
import { MedicalHistoryLog } from 'src/medical-history/models/medical-history-logs';
import { Admin } from 'src/user/admin.model';
import { Doctor } from 'src/user/doctor.model';
import { Donor } from 'src/user/donor.model';
import { ForgetPassword } from 'src/user/forgetPassword.model';
import { Hospital } from 'src/user/hopsital.model';
import { User } from 'src/user/user.model';
import { factory } from 'typescript';


@Module({
    imports: [
        SequelizeModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                dialect: 'mysql',
                host: configService.get<string>('DB_HOST'),
                port: parseInt(configService.get<string>('DB_PORT') || '3306', 10),
                username: configService.get<string>('DB_USERNAME'),
                password: configService.get<string>('DB_PASSWORD'),
                database: configService.get<string>('DB_NAME'),
                models: [User, Donor, Doctor , Admin, Hospital, ForgetPassword, Token , MedicalHistory , MedicalHistoryLog],
                autoLoadModels: false, 
                synchronize : true,
                sync: { alter: true },
            })
        })
    ]

})
export class DatabaseModule {}
