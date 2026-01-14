import { Module } from '@nestjs/common';
import { BroadcastController } from './broadcast.controller';
import { NotificationModule } from 'src/notification/notification.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { Donor } from 'src/user/donor.model';
import { Hospital } from 'src/user/hopsital.model';
import { Donation } from 'src/donation/donation.model';
import { Broadcast } from './broadcast.model';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Donor, Hospital, Donation, Broadcast]),
    NotificationModule,
    AuthModule,
  ],
  controllers: [BroadcastController],
})
export class BroadcastModule {}
