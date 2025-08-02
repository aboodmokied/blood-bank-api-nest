import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { IncomingRequest } from "./models/Incoming-requests.models";
import { IncomingRequestController } from "./Incoming-requests.controller";
import { IncomingRequestService } from "./Incoming-requests.service";

@Module({
    imports: [SequelizeModule.forFeature([IncomingRequest])],
    controllers: [IncomingRequestController],
    providers: [IncomingRequestService],
})
export class IncomingRequestsModule {}