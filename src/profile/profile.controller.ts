import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  HttpCode,
  HttpStatus,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileSignatureValidator } from './validation/file-signature.valdiator';
import { CreateProfileDto } from './dto/create-profile.dto';
import { ProfileService } from './profile.service';
import { diskStorage, memoryStorage } from 'multer';
import { Role } from 'src/types/auth.types';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { extname } from 'path';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}
  // TODO:  create Guard for the profile owner
  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads', // folder to save files
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          return callback(new Error('Only image files are allowed!'), false);
        }
        callback(null, true);
      },
    }),
  )
  async createProfile(
    @UploadedFile() file: Express.Multer.File,
    @Body() createProfileDto: CreateProfileDto,
  ) {
    const profile = await this.profileService.createProfile(
      createProfileDto,
      file,
    );

    return {
      message: 'Profile created and file uploaded successfully',
      profile,
      fileInfo: {
        originalName: file.originalname,
        size: file.size,
        mimetype: file.mimetype,
      },
    };
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async editProfile(
    @Param('id') id: string,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    const { profile } = await this.profileService.updateProfile(
      +id,
      updateProfileDto,
    );
    return { profile };
  }

  @Patch('/image/:id')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads', // folder to save files
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          return callback(new Error('Only image files are allowed!'), false);
        }
        callback(null, true);
      },
    }),
  )
  async uploadProfileImage(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    console.log('image upload');
    const { profile } = await this.profileService.uploadProfileImage(+id, file);
    return { message: 'profile image uploaded sucessfully', profile };
  }

  // TODO:  create Guard for the profile owner and admin
  @Get(':role/:id')
  @HttpCode(HttpStatus.OK)
  async findProfile(@Param('role') role: Role, @Param('id') id: string) {
    const { profile } = await this.profileService.findOne(role, +id);
    return { profile };
  }
}
