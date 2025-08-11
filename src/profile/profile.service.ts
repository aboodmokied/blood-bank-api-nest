import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { ProfileModel } from "./models/profile.model";
import { CreateProfileDto } from "./dto/create-profile.dto";
import * as fs from 'fs';
import * as path from 'path';


@Injectable()
export class ProfileService {
    constructor(
        @InjectModel(ProfileModel) private readonly profileModel: typeof ProfileModel
    ) { }

    async createProfile(createProfileDto: CreateProfileDto, file: Express.Multer.File) {
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

            const profile = await this.profileModel.create({
                ...createProfileDto,
                photo: photoFilename,
                Roles: createProfileDto.role
            });
            return profile;
        }

    }
}