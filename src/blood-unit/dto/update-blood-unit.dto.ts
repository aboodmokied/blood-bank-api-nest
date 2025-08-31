import { PartialType } from '@nestjs/mapped-types';
import { CreateBloodUnitDto } from './create-blood-unit.dto';

export class UpdateBloodUnitDto extends PartialType(CreateBloodUnitDto) {}
