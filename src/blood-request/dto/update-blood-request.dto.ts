import { PartialType } from '@nestjs/mapped-types';
import { CreateBloodRequestDto } from './create-blood-request.dto';

export class UpdateBloodRequestDto extends PartialType(CreateBloodRequestDto) {
  approvedAt?: string;
}
