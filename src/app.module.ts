import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    // ConfigModule.forRoot({
    //   isGlobal: true, // Makes ConfigService available app-wide
    // }),
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
    AuthModule,
    UserModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
