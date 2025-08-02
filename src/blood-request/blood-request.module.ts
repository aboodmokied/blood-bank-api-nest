import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { BloodRequest } from "./models/blood-request.model";
import { BloodRequestController } from "./blood-request.controller";
import { BloodRequestService } from "./blood-request.service";
import { BloodInventory } from "src/blood-inventory/models/blood-inventory.model";
import { MedicalHistoryLog } from "src/medical-history/models/medical-history-logs";
import { BloodType } from "src/blood-types/models/blood-type.model";
import { Hospital } from "src/user/hopsital.model";
import { Receiver } from "src/receiver/models/receiver.model";
import { IncomingRequest } from "src/Incoming requests/models/Incoming-requests.models";

@Module({
    imports: [SequelizeModule.forFeature([BloodRequest , BloodInventory, MedicalHistoryLog, BloodType , Hospital , Receiver , IncomingRequest])],
    controllers: [BloodRequestController],
    providers: [BloodRequestService],
})

export class BloodRequestModule {}
