import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { Receiver } from "./models/receiver.model";
import { ReceiverController } from "./receiver.controller";
import { ReceiverService } from "./receiver.services";

@Module({
    imports: [SequelizeModule.forFeature([Receiver])],
    controllers: [ReceiverController],
    providers: [ReceiverService],
})

export class ReceiverModule {}