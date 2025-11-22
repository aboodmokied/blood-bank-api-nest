import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.model';
import * as bcrypt from 'bcryptjs';
import { RegisterUserDto, ValidateUserDto } from './dto/create-user.dto';
import { Admin } from './admin.model';
import { Donor } from './donor.model';
import { Hospital } from './hopsital.model';
import { Doctor } from './doctor.model';
import { ProfileService } from 'src/profile/profile.service';
import { Role } from 'src/types/auth.types';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
    @InjectModel(Admin)
    private adminModel: typeof Admin,
    @InjectModel(Donor)
    private donorModel: typeof Donor,
    @InjectModel(Hospital)
    private hospitalModel: typeof Hospital,
    @InjectModel(Doctor)
    private doctorModel: typeof Doctor,
    private profileService: ProfileService,
  ) {}

  async validateUser(validateUserDto: ValidateUserDto) {
    const { email, password, role } = validateUserDto;
    const model = this.getModel(role);
    const user = await model.findOne({ where: { email } });
    if (user && bcrypt.compareSync(password, user.password)) {
      return user;
    }
    return null;
  }

  async registerUser(registerUserDto: RegisterUserDto) {
    const { name, email, password, role } = registerUserDto;
    const model = this.getModel(role);
    const existingUser = await model.findOne({ where: { email } });
    if (existingUser) {
      throw new BadRequestException('البريد الإلكتروني مستخدم مسبقًا');
    }
    const user = await model.create({
      name,
      email,
      password: bcrypt.hashSync(password, 12),
      role,
    });
    this.profileService.initProfile(user.id, user.role);
    return { user };
  }
  async findAllHospitals() {
    return this.hospitalModel.findAll();
  }
  async findAllByRole(role: Role, page = 1, limit = 10, search?: string) {
    const model = this.getModel(role);
    let resule: { data: any; pagination: any } = {
      data: [],
      pagination: null,
    };
    if (search) {
      resule = await model.findWithPaginationAndSearch(
        page,
        limit,
        {},
        search,
        ['name', 'email'],
      );
    } else {
      resule = await model.findWithPagination(page, limit);
    }
    const { data: users, pagination } = resule;
    return { users, pagination };
  }

  private getModel(
    role: Role,
  ):
    | typeof this.adminModel
    | typeof this.doctorModel
    | typeof this.adminModel
    | typeof this.donorModel
    | typeof this.hospitalModel {
    let model = this.donorModel;
    switch (role) {
      case 'donor':
        model = this.donorModel;
        break;
      case 'doctor':
        model = this.doctorModel;
        break;
      case 'hospital':
        model = this.hospitalModel;
        break;
      case 'admin':
        model = this.adminModel;
        break;
      default:
        throw new BadRequestException('user type not provided');
    }
    return model;
  }
}
