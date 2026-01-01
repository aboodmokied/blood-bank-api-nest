import { Injectable, Logger } from '@nestjs/common';
// import { MailerService } from '@nestjs-modules/mailer';
import { Alert } from 'src/alert/alert.model';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  // constructor(private readonly mailerService: MailerService) {}
  constructor() {}

  async sendHospitalAlert(alert: Alert, email: string) {
    this.logger.log(`Sending alert for hospital ${alert.hospital_id} to ${email}`);
    
    // In a real app, you would probably want to use a template
    // await this.mailerService.sendMail({
    //   to: email,
    //   subject: `Low Stock Alert: ${alert.blood_type}`,
    //   text: `Urgent: Your stock for blood type ${alert.blood_type} is low. Current units: ${alert.current_units}. Please take necessary actions.`,
    //   html: `
    //     <h1>Low Stock Alert</h1>
    //     <p>Your stock for blood type <strong>${alert.blood_type}</strong> is low.</p>
    //     <p>Current units: <strong>${alert.current_units}</strong></p>
    //     <p>Threshold: 10</p>
    //     <p>Please take necessary actions.</p>
    //   `,
    // });
  }

  async sendMedicalTestResult(email: string, result: 'PASSED' | 'FAILED', conditions?: string[]) {
    this.logger.log(`Sending medical test result (${result}) to ${email}`);
    
    // In a real app:
    // const subject = result === 'PASSED' ? 'Medical Test Passed' : 'Important: Medical Test Results';
    // const text = result === 'PASSED' 
    //   ? 'Your blood donation medical tests passed. Thank you for saving lives!'
    //   : `Your medical tests indicated some issues: ${conditions?.join(', ')}. Please consult a doctor.`;
    
    // await this.mailerService.sendMail({ to: email, subject, text });
  }
}
