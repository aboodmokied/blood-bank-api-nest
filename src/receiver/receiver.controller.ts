import { Controller, Get, Post, Body, Param, Put, Delete, Patch } from '@nestjs/common';

import { CreateReceiverDto } from './dto/create-receiver.dto';
import { UpdateReceiverDto } from './dto/update-receiver.dto';
import { ReceiverService } from './receiver.services';

@Controller('receivers')
export class ReceiverController {
    constructor(private readonly receiverService: ReceiverService) { }

    @Post('create')
    create(@Body() data: CreateReceiverDto) {
        return this.receiverService.create(data);
    }

    @Get()
    findAll() {
        return this.receiverService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.receiverService.findOne(id);
    }

    @Patch('update/:id')
    update(@Param('id') id: number, @Body() data: UpdateReceiverDto) {
        return this.receiverService.update(id, data);
    }

    @Delete('delete/:id')
    remove(@Param('id') id: number) {
        return this.receiverService.remove(id);
    }
}