import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
} from '@nestjs/common';
import { CreateBloodInventoryDto } from './dto/create-blood-inventory.dto';
import { UpdateBloodInventoryDto } from './dto/update-blood-inventory.dto';
import { BloodInventoryService } from './blood-inventory.servies';

@Controller('blood-inventory')
export class BloodInventoryController {
  constructor(private readonly service: BloodInventoryService) {}

  @Post('create')
  create(@Body() dto: CreateBloodInventoryDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findByType(id);
  }

  @Patch('update/:id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateBloodInventoryDto,
  ) {
    return this.service.update(id, dto);
  }

  @Delete('remove/:id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}