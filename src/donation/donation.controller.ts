import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { DonationService } from './donation.service';
import { CreateDonationDto } from './dto/create-donation.dto';
import { UpdateDonationDto } from './dto/update-donation.dto';
import { DonationStatus } from './donation.model';

@Controller('donations')
export class DonationController {
  constructor(private readonly donationService: DonationService) {}

  // Create donation
  @Post()
  async create(@Body() createDonationDto: CreateDonationDto) {
    return this.donationService.create(createDonationDto);
  }

  // Get all donations with pagination
  @Get()
  async findAll(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.donationService.findAll(Number(page), Number(limit));
  }

  // Get donation by id
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.donationService.findOne(Number(id));
  }

  // Get all donations for a specific donor
  @Get('donor/:donorId')
  async findByDonor(
    @Param('donorId') donorId: number,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.donationService.findByDonor(
      Number(donorId),
      Number(page),
      Number(limit),
    );
  }

  // Update donation
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateDonationDto: UpdateDonationDto,
  ) {
    return this.donationService.update(Number(id), updateDonationDto);
  }

  // Delete donation
  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.donationService.remove(Number(id));
  }

  // Change donation status
  @Patch(':id/status')
  async changeStatus(
    @Param('id') id: number,
    @Body('status') newStatus: DonationStatus,
  ) {
    return this.donationService.changeStatus(Number(id), newStatus);
  }
}
