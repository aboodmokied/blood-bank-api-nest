import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProfileModel } from './models/profile.model';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { Donor } from 'src/user/donor.model';

@Module({
  imports: [SequelizeModule.forFeature([ProfileModel, Donor])],
  controllers: [ProfileController],
  providers: [ProfileService],
  exports: [ProfileService],
})
export class ProfileModule {}
