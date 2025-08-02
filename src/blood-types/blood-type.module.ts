import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { BloodType } from "./models/blood-type.model";
import { BloodTypeController } from "./blood-type.controller";
import { BloodTypeService } from "./blood-type.servies";

@Module({
  imports: [
    SequelizeModule.forFeature([BloodType])
  ],
  controllers: [BloodTypeController],
  providers: [BloodTypeService],
  
})
export class BloodTypeModule {}