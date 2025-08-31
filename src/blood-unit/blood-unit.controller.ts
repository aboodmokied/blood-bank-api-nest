import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BloodUnitService } from './blood-unit.service';
import { CreateBloodUnitDto } from './dto/create-blood-unit.dto';
import { UpdateBloodUnitDto } from './dto/update-blood-unit.dto';

@Controller('blood-unit')
export class BloodUnitController {
  constructor(private readonly bloodUnitService: BloodUnitService) {}

  @Post()
  create(@Body() createBloodUnitDto: CreateBloodUnitDto) {
    return this.bloodUnitService.create(createBloodUnitDto);
  }

  @Get()
  findAll() {
    return this.bloodUnitService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bloodUnitService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBloodUnitDto: UpdateBloodUnitDto) {
    return this.bloodUnitService.update(+id, updateBloodUnitDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bloodUnitService.remove(+id);
  }
}
