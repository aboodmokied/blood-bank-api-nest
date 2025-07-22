import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/user/user.model';


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
                models: [User],
                autoLoadModels: true,
                synchronize : true,
                sync: { alter: true },
            })
        })
    ]

})
export class DatabaseModule {}
