import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.model';
import * as bcrypt from 'bcryptjs';
import { RegisterUserDto, ValidateUserDto } from './dto/create-user.dto';


@Injectable()
export class UserService {
    constructor(
        @InjectModel(User)
        private userModel: typeof User
    ) { }

    async validateUser(validateUserDto: ValidateUserDto) {
        const { email, password } = validateUserDto;
        const user = await this.userModel.findOne({ where: { email } })
        if (user && bcrypt.compareSync(password, user.password)) {
            return user;
        }
        return null;
    }

    async registerUser(registerUserDto: RegisterUserDto) {
        const { name, email, password } = registerUserDto;
        const existingUser = await this.userModel.findOne({ where: { email } });
        if (existingUser) {
            throw new BadRequestException('البريد الإلكتروني مستخدم مسبقًا');
        }
        return this.userModel.create({
            name,
            email,
            password: bcrypt.hashSync(password, 12)
        });
    }

}
