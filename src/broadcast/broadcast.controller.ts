import { Controller, Post, Body, BadRequestException, Get, UseGuards, Req } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { NotificationService } from 'src/notification/notification.service';
import { Donor } from 'src/user/donor.model';
import { Donation } from 'src/donation/donation.model';
import { Broadcast } from './broadcast.model';
import { Op } from 'sequelize';
import { Hospital } from 'src/user/hopsital.model';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/roles/guards/roles.guard';
import { RolesDecorator } from 'src/roles/roles.decorator';
import { Request } from 'express';

@Controller('broadcast')
export class BroadcastController {
  constructor(
    private readonly notificationService: NotificationService,
    @InjectModel(Donor)
    private readonly donorModel: typeof Donor,
    @InjectModel(Hospital)
    private readonly hospitalModel: typeof Hospital,
    @InjectModel(Donation)
    private readonly donationModel: typeof Donation,
    @InjectModel(Broadcast)
    private readonly broadcastModel: typeof Broadcast,
  ) {}

  @Get()
  async getAllBroadcasts() {
    // Return all broadcasts from the last 24 hours
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    const broadcasts = await this.broadcastModel.findAll({
      where: {
        createdAt: {
          [Op.gte]: oneDayAgo,
        },
      },
      include: [
        {
          model: Hospital,
          attributes: ['id', 'name'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    return { broadcasts };
  }

  @RolesDecorator('hospital')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('urgent-need')
  async broadcastUrgentNeed(
    @Body() body: { bloodType: string },
    @Req() req: Request,
  ) {
    const { bloodType } = body;
    const hospitalId = (req.user as any).id;

    const hospital = await this.hospitalModel.findByPk(hospitalId);
    if (!hospital) {
      throw new BadRequestException('Hospital not found');
    }

    // 1. Find eligible donors with matching bloodType
    const fourMonthsAgo = new Date();
    fourMonthsAgo.setMonth(fourMonthsAgo.getMonth() - 4);

    const donors = await this.donorModel.findAll({
      where: {
        bloodType: bloodType,
        isEligible: true,
        [Op.or]: [
          { lastDonationDate: null },
          { lastDonationDate: { [Op.lt]: fourMonthsAgo } },
        ],
      },
    });

    let count = 0;
    for (const donor of donors) {
      await this.notificationService.sendUrgentBloodNeed(
        donor.email,
        bloodType,
        hospital.name,
      );
      count++;
    }

    // Save broadcast to database
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 1); // Expire after 24 hours

    const broadcast = await this.broadcastModel.create({
      hospitalId,
      bloodType,
      donorsNotified: count,
      status: 'active',
      expiresAt,
    });

    return { 
      message: `Broadcast sent to ${count} eligible donors.`,
      broadcast: {
        id: broadcast.id,
        hospitalId,
        hospitalName: hospital.name,
        bloodType,
        donorsNotified: count,
        status: broadcast.status,
        createdAt: broadcast.createdAt,
        expiresAt: broadcast.expiresAt,
      }
    };
  }
}
