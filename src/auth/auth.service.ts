import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import * as bcrypt from 'bcryptjs';
import { InjectModel } from '@nestjs/sequelize';
import { Token } from './token.model';
import { User } from 'src/user/user.model';
import { AuthPayload, Role } from 'src/types/auth.types';
import { randomUUID } from 'crypto';
import { ChangePasswordDto, ResetPasswordDto } from './dto/auth.dto';
import * as crypto from 'crypto';
import { Hospital } from 'src/user/hopsital.model';
import { Admin } from 'src/user/admin.model';
import { Donor } from 'src/user/donor.model';
import { Doctor } from 'src/user/doctor.model';
import { ForgetPassword } from 'src/user/forgetPassword.model';
// import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Hospital) private hospitalModel: typeof Hospital,
    @InjectModel(Admin) private adminModel: typeof Admin,
    @InjectModel(Donor) private donorModel: typeof Donor,
    @InjectModel(Token) private tokenModel: typeof Token,
    @InjectModel(Doctor) private doctorModel: typeof Doctor,
    @InjectModel(ForgetPassword)
    private forgetPasswordModel: typeof ForgetPassword,
    private jwtService: JwtService,
    // private mailService: MailerService,
    private configService: ConfigService,
  ) {}
  async isValidTokenWithUser(token: string) {
    try {
      const signature = token?.split('.')[2];
      if (signature) {
        const tokenObj = await this.tokenModel.findOne({
          where: { signature, revoked: false },
          // include: { model: User, attributes: ['id', 'name', 'email'] }
        });
        const {
          sub,
          email,
          role: payloadRole,
        } = this.jwtService.decode<AuthPayload>(token);
        if (tokenObj) {
          const model = this.getModel(tokenObj.role);
          const user = await model.findByPk(tokenObj.userId);
          if (
            user &&
            sub == user.id &&
            email == user.email &&
            payloadRole == user.role
          )
            return {
              email: user.email,
              name: user.name,
              id: user.id,
              role: user.role,
            };
        }
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  async generateJwtToken(user: User) {
    const payload: AuthPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      jti: randomUUID(),
    };
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET'),
    });
    const signature = accessToken.split('.')[2];
    await this.tokenModel.create({
      signature,
      userId: user.id,
      role: user.role,
    });
    const { id, name, email, role } = user;
    return { token: accessToken, user: { id, name, email, role } };
  }

  async logout(token: string) {
    const signature = token.split('.')[2];
    return this.tokenModel.update({ revoked: true }, { where: { signature } });
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const userModel = this.getModel(resetPasswordDto.role);

    let user = await userModel.findOne({
      where: { email: resetPasswordDto.email },
    });
    if (!user) throw new NotFoundException('User not found');

    const code = Math.floor(100000 + Math.random() * 900000)
      .toString()
      .padStart(6, '0');
    const hashedCode = crypto.createHash('sha256').update(code).digest('hex');

    // const forgetEntry = await this.forgetPasswordModel.findOne({
    //     where: { email: resetPasswordDto.email },
    // });

    // if (forgetEntry) {

    //     await this.forgetPasswordModel.update(
    //         {
    //             passwordResetCode: hashedCode,
    //             passwordResetExpires: new Date(Date.now() + 10 * 60 * 1000),
    //             passwordResetVerified: false,
    //         },
    //         { where: { email: resetPasswordDto.email } }
    //     );
    // } else {

    await this.forgetPasswordModel.create({
      email: resetPasswordDto.email,
      passwordResetCode: hashedCode,
      passwordResetExpires: new Date(Date.now() + 10 * 60 * 1000),
      passwordResetVerified: false,
      role: user.role,
    });
    // }

    const message = `
    Forgot your password? If you didn't forget your password, please ignore this email!
    Your password reset code is ${code}. The code is valid for 10 minutes.`;

    //     await this.mailService.sendMail({
    //         from: 'Blood Bank Admin <' + process.env.EMAIL_USER + '>',
    //         to: resetPasswordDto.email,
    //         subject: 'Reset Password',
    //         html: `
    //   <h1>Hello ${user.name},</h1>
    //   <p>${message}</p>
    //   <p>Your reset code is: <strong>${code}</strong></p>
    //   <p>This code will expire in 10 minutes.</p>
    // `,
    //     });
    console.log({ code });
    return { message: 'Reset password code sent to your email' };
  }

  async verifyResetCode(email: string, code: string, role: string) {
    const resetCode = await this.forgetPasswordModel.findOne({
      where: { email, passwordResetVerified: false, role },
      order: [['createdAt', 'DESC']],
    });
    if (!resetCode) {
      throw new UnauthorizedException('Invalid email or code');
    }

    const hashedCode = crypto.createHash('sha256').update(code).digest('hex');

    if (resetCode.passwordResetCode !== hashedCode) {
      throw new UnauthorizedException('Invalid code');
    }

    if (resetCode.passwordResetExpires < new Date()) {
      throw new UnauthorizedException('Code expired');
    }

    await this.forgetPasswordModel.update(
      { passwordResetVerified: true },
      { where: { email, role } },
    );
    const token = this.jwtService.sign(
      { email, role, type: 'password_reset' },
      {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: '10m',
      },
    );
    return { token, message: 'Code verified successfully' };
  }

  async changePassword(token: string, changePasswordDto: ChangePasswordDto) {
    let payload;
    try {
      payload = await this.jwtService.verify(token, {
        ignoreExpiration: false,
        secret: this.configService.get('JWT_SECRET'),
      });
    } catch (error) {
      throw new UnauthorizedException();
    }
    const { email: payloadEmail, role: payloadRole } = payload;
    const { email, role, newPassword } = changePasswordDto;
    console.log({
      payload,
      role,
      email,
      newPassword,
    });
    if (email == payloadEmail && role == payloadRole) {
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      const model = this.getModel(role);
      await model.update({ password: hashedNewPassword }, { where: { email } });
      return { message: 'Password changed successfully' };
    }
    throw new UnauthorizedException();
  }

  private getModel(role: string) {
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
