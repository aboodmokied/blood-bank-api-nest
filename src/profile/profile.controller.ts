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
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileSignatureValidator } from './validation/file-signature.valdiator';
import { CreateProfileDto } from './dto/create-profile.dto';
import { ProfileService } from './profile.service';
import { memoryStorage } from 'multer';
import { Role } from 'src/types/auth.types';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}
  // TODO:  create Guard for the profile owner
  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
    }),
  )
  async createProfile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 1024 * 1024 * 5,
            message: (maxSize) =>
              `File size exceeds the maximum limit of ${maxSize} bytes`,
          }),
          new FileTypeValidator({
            fileType: /png|jpg|jpeg/,
          }),
          new FileSignatureValidator(),
        ],
        errorHttpStatusCode: HttpStatus.UNSUPPORTED_MEDIA_TYPE,
      }),
    )
    file: Express.Multer.File,
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

  // TODO:  create Guard for the profile owner and admin
  @Get(':role/:id')
  @HttpCode(HttpStatus.OK)
  async findProfile(@Param('role') role: Role, @Param('id') id: string) {
    const { profile } = await this.profileService.findOne(role, +id);
    return { profile };
  }
}
