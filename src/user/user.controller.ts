import {
  Controller,
  Post,
  Req,
  UseGuards,
  Body,
  Get,
  Res,
  Param,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Request, Response } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RegisterUserDto } from './dto/create-user.dto';
import { RolesGuard } from 'src/roles/guards/roles.guard';
import { RolesDecorator } from 'src/roles/roles.decorator';
import { Role } from 'src/types/auth.types';

// @UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto) {
    const { user } = await this.userService.registerUser(registerUserDto);
    return { user };
  }

  @Get('hospitals')
  async findAllHospitals(
    @Query('search') search: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    const { users, pagination } = await this.userService.findAllByRole(
      'hospital',
      +page,
      +limit,
      search,
    );
    return { users, pagination };
  }

  @Get('hospitals/:id')
  async getHospitalById(@Param('id') id: string) {
    return this.userService.findHospitalById(+id);
  }

  @Get('donors/:id')
  async getDonorById(@Param('id') id: string) {
    return this.userService.findDonorById(+id);
  }

  // TODO: add role authorization
  @Get(':role')
  async finaAll(
    @Param('role') role: Role,
    @Query('search') search: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    const { users, pagination } = await this.userService.findAllByRole(
      role,
      +page,
      +limit,
      search,
    );
    return { users, pagination };
  }
  @RolesDecorator('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  allUsers(@Res() res: Response) {
    return res.status(200).send({ users: 'all users' });
  }
}
