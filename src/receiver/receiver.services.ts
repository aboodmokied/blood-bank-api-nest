import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Receiver } from './models/receiver.model';
import { CreateReceiverDto } from './dto/create-receiver.dto';
import { UpdateReceiverDto } from './dto/update-receiver.dto';
import e from 'express';
import { Op } from 'sequelize';

@Injectable()
export class ReceiverService {
    constructor(
        @InjectModel(Receiver) private receiverModel: typeof Receiver,
    ) { }

    async create(data: CreateReceiverDto) {

        const medicalOfficer = await this.receiverModel.findOne({
            where: { email: data.email },
        });
        if (medicalOfficer) {
            throw new ConflictException('Receiver with this email already exists');
        }

        return await this.receiverModel.create({ ...data });
    }

    async findAll() {
        return await this.receiverModel.findAll();
    }

    async findOne(id: number) {
        const receiver = await this.receiverModel.findByPk(id);
        if (!receiver) throw new NotFoundException('Receiver not found');
        return receiver;
    }

    async update(id: number, data: UpdateReceiverDto) {
        const receiver = await this.findOne(id);
        return await receiver.update(data);
    }

    async remove(id: number) {
        const receiver = await this.findOne(id);
        await receiver.destroy();
        return { message: 'Receiver deleted successfully' };
    }
}