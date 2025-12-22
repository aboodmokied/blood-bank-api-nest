import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { Alert } from 'src/alert/alert.model';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(private readonly mailerService: MailerService) {}

  async sendHospitalAlert(alert: Alert, email: string) {
    this.logger.log(`Sending alert for hospital ${alert.hospital_id} to ${email}`);
    
    // In a real app, you would probably want to use a template
    await this.mailerService.sendMail({
      to: email,
      subject: `Low Stock Alert: ${alert.blood_type}`,
      text: `Urgent: Your stock for blood type ${alert.blood_type} is low. Current units: ${alert.current_units}. Please take necessary actions.`,
      html: `
        <h1>Low Stock Alert</h1>
        <p>Your stock for blood type <strong>${alert.blood_type}</strong> is low.</p>
        <p>Current units: <strong>${alert.current_units}</strong></p>
        <p>Threshold: 10</p>
        <p>Please take necessary actions.</p>
      `,
    });
  }
}
