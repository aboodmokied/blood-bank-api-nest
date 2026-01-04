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

    // 1. Find donors with matching bloodType
    // 2. Filter valid donors (eligible: last donation > 4 months ago OR no donations)
    
    // Simplification: Find all donors with bloodType. 
    // Ideally we check eligibility. 
    // To check eligibility efficiently, we can use a subquery or join, but for now let's fetch matching donors and check in code or assume all registered donors with that blood type should be notified (maybe they haven't donated recently).
    
    // Let's implement a better check:
    // Donors with bloodType AND (latestDonationDate < 4 months ago OR no donation)
    
    const donors = await this.donorModel.findAll({
      where: {
        bloodType: bloodType,
      },
      include: [
        {
          model: Donation,
          limit: 1,
          order: [['donationDate', 'DESC']],
          required: false,
        }
      ] as any
    });

    const eligibleDonors = donors.filter(donor => {
      // If no donations, they are eligible
      // Since it's a HasMany, we can't easily get single 'latestDonation' without separate query or careful include.
      // Actually sequelize `HasOne` association alias might help or just checking the array.
      // But `hasMany` `medicalHistory` is defined, `donations` relation might need `HasMany` in Donor model.
      
        // Assuming we fix Donor model to have HasMany Donations
        // For now, let's assume we notify ALL matching donors for simplicity, or we check their last donation via query.
        return true; 
    });
    
    // Refined logic: check last donation date
     const fourMonthsAgo = new Date();
     fourMonthsAgo.setMonth(fourMonthsAgo.getMonth() - 4);

    let count = 0;
    for (const donor of donors) {
        // Query last donation for this donor
        const lastDonation = await this.donationModel.findOne({
            where: { donorId: donor.id },
            order: [['donationDate', 'DESC']],
        });

        if (!lastDonation || new Date(lastDonation.donationDate) < fourMonthsAgo) {
             await this.notificationService.sendUrgentBloodNeed(
                donor.email,
                bloodType,
                hospital.name,
              );
              count++;
        }
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
