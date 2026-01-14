import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ProfileModel } from './models/profile.model';
import { CreateProfileDto } from './dto/create-profile.dto';
import * as fs from 'fs';
import * as path from 'path';
import { Role } from 'src/types/auth.types';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Donor } from 'src/user/donor.model';

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(ProfileModel)
    private readonly profileModel: typeof ProfileModel,
    @InjectModel(Donor)
    private readonly donorModel: typeof Donor,
  ) {}

  async createProfile(
    createProfileDto: CreateProfileDto,
    file?: Express.Multer.File,
  ) {
    const isExist = await this.profileModel.count({
      where: { role: createProfileDto.role, userId: createProfileDto.userId },
    });
    if (isExist) {
      throw new BadRequestException('user already has a profile');
    }
    let photoFilename: string | null = null;
    if (file) {
      const uploadsDir = path.join(process.cwd(), 'uploads');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      const ext = path.extname(file.originalname);
      photoFilename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
      const filePath = path.join(uploadsDir, photoFilename);

      fs.writeFileSync(filePath, file.buffer);
    }
    const profile = await this.profileModel.create({
      ...createProfileDto,
      photo: photoFilename,
    });
    return { profile };
  }

  async initProfile(userId: number, role: Role, bloodType?: string) {
    const isExist = await this.profileModel.count({
      where: { role, userId },
    });
    if (!isExist) {
      await this.profileModel.create({
        role,
        userId,
        bloodType,
      });
    }
  }

  async findOne(role: Role, id: number) {
    const profile = await this.profileModel.findOne({
      where: { role, userId: id },
    });
    if (!profile) {
      throw new NotFoundException('profile not found');
    }
    return { profile };
  }

  async updateProfile(id: number, updateProfileDto: UpdateProfileDto) {
    const profile = await this.profileModel.findByPk(id);
    if (!profile) {
      throw new NotFoundException('profile not found');
    }
    await profile.update(updateProfileDto);

    // Sync bloodType to Donor model if role is donor
    if (profile.role === 'donor' && updateProfileDto.bloodType) {
      await this.donorModel.update(
        { bloodType: updateProfileDto.bloodType },
        { where: { id: profile.userId } }
      );
    }

    return { profile };
  }

  async uploadProfileImage(id: number, file: Express.Multer.File) {
    const profile = await this.profileModel.findByPk(id);
    if (!profile) {
      throw new NotFoundException('profile not found');
    }
    const path = `/uploads/${file.filename}`;
    await profile.update({ photo: path });
    return { profile };
  }
}
