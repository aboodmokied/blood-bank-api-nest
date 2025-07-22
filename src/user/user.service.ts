import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.model';
import * as bcrypt from 'bcryptjs';
import { RegisterUserDto, ValidateUserDto } from './dto/create-user.dto';
import { Admin } from './admin.model';
import { Donor } from './donor.model';
import { Hospital } from './hopsital.model';
import { Doctor } from './doctor.model';


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
    ) { }

    async validateUser(validateUserDto: ValidateUserDto) {
        const { email, password, role } = validateUserDto;
        const model=this.getModel(role);
        const user = await model.findOne({ where: { email } })
        if (user && bcrypt.compareSync(password, user.password)) {
            return user;
        }
        return null;
    }

    async registerUser(registerUserDto: RegisterUserDto) {
        const { name, email, password, role } = registerUserDto;
        const model=this.getModel(role);
        const existingUser = await model.findOne({ where: { email } });
        if (existingUser) {
            throw new BadRequestException('البريد الإلكتروني مستخدم مسبقًا');
        }
        return model.create({
            name,
            email,
            password: bcrypt.hashSync(password, 12),
            role
        });
    }

    private getModel(role:string){
        let model=this.donorModel;
        switch(role){
            case 'donor':
                model=this.donorModel;
                break;
            case 'doctor':
                model=this.doctorModel;
                break;
            case 'hospital':
                model=this.hospitalModel;
                break;
            case 'admin':
                model=this.adminModel;
                break;
            default:
                throw new BadRequestException('user type not provided');
        }
        return model;
    }
}
