import { IsNumber, IsOptional, IsString, IsIn } from 'class-validator';

export class CreateIncomingRequestDto {
    @IsNumber()
    bloodRequestId: number;

    @IsOptional()
    @IsNumber()
    receiverId?: number;

    @IsOptional()
    @IsString()
    @IsIn(['Received', 'Processing', 'Completed', 'Rejected'])
    status?: string;

    @IsOptional()
    @IsString()
    notes?: string;
}
