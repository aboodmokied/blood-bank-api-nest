import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { BloodInventory } from "./models/blood-inventory.model";
import { BloodInventoryController } from "./blood-inventory.controller";
import { BloodInventoryService } from "./blood-inventory.servies";
import { BloodType } from "../blood-types/models/blood-type.model";
@Module({
  imports: [SequelizeModule.forFeature([BloodInventory, BloodType])],
  controllers: [BloodInventoryController],
  providers: [BloodInventoryService],
})
export class BloodInventoryModule { }