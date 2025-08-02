import { IsInt, Min } from 'class-validator';

export class UpdateBloodInventoryDto {
  @IsInt()
  @Min(0)
  quantity: number;
}
