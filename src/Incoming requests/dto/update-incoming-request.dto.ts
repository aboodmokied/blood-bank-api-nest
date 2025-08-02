import { PartialType } from '@nestjs/mapped-types';
import { CreateIncomingRequestDto } from './create-incoming-request.dto';

export class UpdateIncomingRequestDto extends PartialType(CreateIncomingRequestDto) {}