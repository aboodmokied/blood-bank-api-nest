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
import { ProfileModel } from 'src/profile/models/profile.model';

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        // If DATABASE_URL is provided (e.g., from Render), use it
        const databaseUrl = configService.get<string>('DATABASE_URL');
        if (databaseUrl) {
          return {
            dialect: 'postgres',
            url: databaseUrl,
            dialectOptions: {
              ssl: {
                require: true,
                rejectUnauthorized: false,
              },
            },
            autoLoadModels: true,
            synchronize: true,
            sync: { alter: false },
          };
        }

        // Otherwise, use individual connection parameters
        const dialect = configService.get<string>('DB_DIALECT') || 'mysql';
        const config: any = {
          dialect: dialect,
          host: configService.get<string>('DB_HOST'),
          port: parseInt(
            configService.get<string>('DB_PORT') ||
              (dialect === 'postgres' ? '5432' : '3306'),
            10,
          ),
          username: configService.get<string>('DB_USERNAME'),
          password: configService.get<string>('DB_PASSWORD'),
          database: configService.get<string>('DB_NAME'),
          autoLoadModels: true,
          synchronize: true,
          sync: { alter: false },
        };

        // Add SSL for PostgreSQL in production
        if (dialect === 'postgres' && configService.get<string>('NODE_ENV') === 'production') {
          config.dialectOptions = {
            ssl: {
              require: true,
              rejectUnauthorized: false,
            },
          };
        }

        return config;
      },
    }),
  ],
})
export class DatabaseModule {}
