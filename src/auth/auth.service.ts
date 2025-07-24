import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import * as bcrypt from 'bcryptjs';
import { InjectModel } from '@nestjs/sequelize';
import { Token } from './token.model';
import { User } from 'src/user/user.model';
import { AuthPayload } from 'src/types/auth.types';
import { randomUUID } from 'crypto';
import { ChangePasswordDto, ResetPasswordDto } from './dto/auth.dto';
import * as crypto from 'crypto';
import { Hospital } from 'src/user/hopsital.model';
import { Admin } from 'src/user/admin.model';
import { Donor } from 'src/user/donor.model';
import { Doctor } from 'src/user/doctor.model';
import { ForgetPassword } from 'src/user/forgetPassword.model';
import { MailerService } from '@nestjs-modules/mailer';


@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User) private userModel: typeof User,
        @InjectModel(Hospital) private hospitalModel: typeof Hospital,
        @InjectModel(Admin) private adminModel: typeof Admin,
        @InjectModel(Donor) private donorModel: typeof Donor,
        @InjectModel(Token) private tokenModel: typeof Token,
        @InjectModel(Doctor) private doctorModel: typeof Doctor,
        @InjectModel(ForgetPassword) private forgetPasswordModel: typeof ForgetPassword,
        private jwtService: JwtService,
        private mailService: MailerService,
    ) { }
    async isValidTokenWithUser(token: string) {
        try {
            const signature = token?.split('.')[2];
            if (signature) {
                const tokenObj = await this.tokenModel.findOne({
                    where: { signature, revoked: false },
                    include: { model: User, attributes: ['id', 'name', 'email'] }
                });
                const { sub, email } = this.jwtService.decode<AuthPayload>(token);
                if (tokenObj && tokenObj.user) {
                    if (sub == tokenObj.user.id && email == tokenObj.user.email)
                        return tokenObj.user;
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
        }
        const accessToken = this.jwtService.sign(payload);
        const signature = accessToken.split('.')[2];
        await this.tokenModel.create({
            signature,
            userId: user.id
        })
        const { id, name, email } = user;
        return { token: accessToken, user: { id, name, email } };
    }

    async logout(token: string) {
        const signature = token.split('.')[2];
        return this.tokenModel.update({ revoked: true }, { where: { signature } });
    }

    async resetPassword(resetPasswordDto: ResetPasswordDto) {
        let user = await this.userModel.findOne({ where: { email: resetPasswordDto.email } });
        if (!user) user = await this.hospitalModel.findOne({ where: { email: resetPasswordDto.email } });
        if (!user) user = await this.adminModel.findOne({ where: { email: resetPasswordDto.email } });
        if (!user) user = await this.donorModel.findOne({ where: { email: resetPasswordDto.email } });
        if (!user) user = await this.doctorModel.findOne({ where: { email: resetPasswordDto.email } });

        if (!user) throw new ConflictException('User not found');

        const code = Math.floor(100000 + Math.random() * 900000).toString().padStart(6, '0');
        const hashedCode = crypto.createHash('sha256').update(code).digest('hex');

        const forgetEntry = await this.forgetPasswordModel.findOne({
            where: { email: resetPasswordDto.email },
        });

        if (forgetEntry) {
            
            await this.forgetPasswordModel.update(
                {
                    passwordResetCode: hashedCode,
                    passwordResetExpires: new Date(Date.now() + 10 * 60 * 1000),
                    passwordResetVerified: false,
                },
                { where: { email: resetPasswordDto.email } }
            );
        } else {
           
            await this.forgetPasswordModel.create({
                email: resetPasswordDto.email,
                passwordResetCode: hashedCode,
                passwordResetExpires: new Date(Date.now() + 10 * 60 * 1000),
                passwordResetVerified: false,
                role: user.role ?? 'user', 
            });
        }

        const message = `
    Forgot your password? If you didn't forget your password, please ignore this email!
    Your password reset code is ${code}. The code is valid for 10 minutes.`;

        await this.mailService.sendMail({
            from: 'Blood Bank Admin <' + process.env.EMAIL_USER + '>',
            to: resetPasswordDto.email,
            subject: 'Reset Password',
            html: `
      <h1>Hello ${user.name},</h1>
      <p>${message}</p>
      <p>Your reset code is: <strong>${code}</strong></p>
      <p>This code will expire in 10 minutes.</p>
    `,
        });

        return { message: 'Reset password code sent to your email' };
    }

    async verifyResetCode(email: string, code: string) {
        const user = await this.forgetPasswordModel.findOne({ where: { email } });
        if (!user) {
            throw new UnauthorizedException('Invalid email or code');
        }

        const hashedCode = crypto
            .createHash('sha256')
            .update(code)
            .digest('hex');

        if (user.passwordResetCode !== hashedCode) {
            throw new UnauthorizedException('Invalid code');
        }

        if (user.passwordResetExpires < new Date()) {
            throw new UnauthorizedException('Code expired');
        }

        if (user.passwordResetVerified) {
            throw new UnauthorizedException('Code already verified');
        }

        await this.forgetPasswordModel.update(
            { passwordResetVerified: true, passwordResetCode: hashedCode },
            { where: { email: email } }
        );

        await this
        return { message: 'Code verified successfully' };
    }


    async changePassword(changePasswordDto: ChangePasswordDto) {
        const forgetEntry = await this.forgetPasswordModel.findOne({
            where: { email: changePasswordDto.email },
        });

        if (!forgetEntry) {
            throw new UnauthorizedException('No reset request found for this email');
        }

        if (!forgetEntry.passwordResetVerified) {
            throw new UnauthorizedException('Reset code has not been verified');
        }

        if (changePasswordDto.newPassword === changePasswordDto.oldPassword) {
            throw new ConflictException('New password must be different from old password');
        }


        let targetModel;
        const models = [
            this.userModel,
            this.hospitalModel,
            this.adminModel,
            this.donorModel,
            this.doctorModel,
        ];

        for (const model of models) {
            const user = await model.findOne({ where: { email: changePasswordDto.email } });
            if (user) {
                targetModel = model;
                break;
            }
        }

        if (!targetModel) {
            throw new ConflictException('User record not found');
        }

        const hashedNewPassword = await bcrypt.hash(changePasswordDto.newPassword, 10);
        await targetModel.update(
            { password: hashedNewPassword },
            { where: { email: changePasswordDto.email } }
        );


        await this.forgetPasswordModel.update(
            {
                passwordResetCode: null,
                passwordResetVerified: false,
                passwordResetExpires: null,
            },
            { where: { email: changePasswordDto.email } }
        );

        return { message: 'Password changed successfully' };
    }
}
