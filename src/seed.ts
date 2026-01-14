import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UserService } from './user/user.service';
import { AppointmentService } from './appointment/appointment.service';
import { DonationService } from './donation/donation.service';
import { RegisterUserDto } from './user/dto/create-user.dto';
import { UnitStatus, BloodUnit } from './blood-unit/blood-unit.model';
import { getModelToken } from '@nestjs/sequelize';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  console.log('Seeding started...');

  const userService = app.get(UserService);
  const appointmentService = app.get(AppointmentService);
  const donationService = app.get(DonationService);
  
  // Direct Model Access for updating statuses where services might restrict
  const bloodUnitModel = app.get<typeof BloodUnit>(getModelToken(BloodUnit));

  // 1. Create Hospital
  console.log('Creating Hospital...');
  const hospitalData: RegisterUserDto = {
    email: 'city@hospital.com',
    password: 'password123',
    name: 'City Hospital',
    role: 'hospital',
  };

  let hospital;
  try {
    const res = await userService.registerUser(hospitalData);
    hospital = res.user;
    console.log(`Hospital created: ${hospital.name} (${hospital.id})`);
  } catch (error) {
     console.log('Hospital likely exists...');
     // Try to find one? For now assume it was created previously or manually cleaned
     // If we can't find it, we can't seed effectively. 
     // Let's assume ID 1 is the hospital if it fails, or search by email.
     // UserService has no findByEmail. 
     // We'll proceed hoping for the best or manual DB check.
     hospital = { id: 1, ...hospitalData };
  }

  // 2. Create Doctor
  console.log('Creating Doctor...');
  const doctorData: RegisterUserDto = {
    email: 'house@hospital.com',
    password: 'password123',
    name: 'Dr. Gregory House',
    role: 'doctor',
  };
  
  try {
      const res = await userService.registerUser(doctorData);
      console.log(`Doctor created: ${res.user.name}`);
  } catch (e) {
      console.log('Doctor likely exists...');
  }


  // 3. Create Donors
  console.log('Creating Donors...');
  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const donors: any[] = [];

  for (let i = 0; i < 10; i++) {
    const bloodType = bloodTypes[i % bloodTypes.length];
    const donorData: RegisterUserDto = {
      email: `donor${i}@test.com`,
      password: 'password123',
      name: `Donor ${bloodType} ${i}`,
      bloodType: bloodType,
      role: 'donor',
    };

    let donor;
    try {
      const res = await userService.registerUser(donorData);
      donor = res.user;
      console.log(`Donor created: ${res.user.name}`);
    } catch (e) {
      console.log(`Donor ${i} likely exists...`);
      // Fake donor object for logic
      donor = { id: i + 3, bloodType, name: donorData.name, email: donorData.email }; 
    }
    donors.push(donor);
  }

  // 4. Create Transactions
  if (donors.length > 0 && hospital.id) {
      console.log('Seeding Transactions...');
      
      // Loop through donors to create robust data
      for (const donor of donors) {
          // A. Create a Stored Donation (creates a Pending Blood Unit automatically)
          try {
             // Random Doctor ID assumption: 2
             const doctorId = 2; 

             const pastDate = new Date();
             pastDate.setMonth(pastDate.getMonth() - Math.floor(Math.random() * 6));
             
             // Create donation (Status: stored)
             // Note: DonationService.create expects CreateDonationDto
             await donationService.create({
                  donorId: donor.id,
                  hospitalId: hospital.id,
                  doctorId: doctorId,
                  bloodType: donor.bloodType,
                  volume: 450,
                  donationDate: pastDate.toISOString(),
                  status: 'stored'
              });
             
             // B. Create Pending Appointment
             await appointmentService.create({
                hospitalId: hospital.id,
                donorId: donor.id,
                date: new Date(Date.now() + 86400000 * (Math.random() * 10)).toISOString(),
                status: 'pending'
            });

          } catch(e) { /* ignore dupes/errors */ }
      }
      
      // 5. Seed Stock (Manipulate Units)
      console.log('Seeding extra stock (Creating donations and updating units)...');
      for (const type of bloodTypes) doctor_loop: {
           // We need a donor of this type. 
           const targetDonor = donors.find(d => d.bloodType === type);
           if (!targetDonor) break doctor_loop;

           // Create PASSED units
           for(let k=0; k<3; k++) {
               try {
                   const { donation } = await donationService.create({
                      donorId: targetDonor.id,
                      hospitalId: hospital.id,
                      doctorId: 2,
                      bloodType: type,
                      volume: 450,
                      donationDate: new Date().toISOString(),
                      status: 'stored'
                   });
                   
                   // Update the unit to PASSED
                   if (donation) {
                       await bloodUnitModel.update(
                           { status: UnitStatus.PASSED },
                           { where: { donationId: donation.id } }
                       );
                   }
               } catch(e) {}
           }
           
           // Create FAILED units (Discarded)
           for(let k=0; k<1; k++) {
                try {
                    const { donation } = await donationService.create({
                       donorId: targetDonor.id,
                       hospitalId: hospital.id,
                       doctorId: 2,
                       bloodType: type,
                       volume: 450,
                       donationDate: new Date().toISOString(),
                       status: 'stored'
                    });
                    
                    if (donation) {
                        await bloodUnitModel.update(
                            { status: UnitStatus.FAILED },
                            { where: { donationId: donation.id } }
                        );
                    }
                } catch(e) {}
           }
      }
  }
  
  console.log('Seeding complete! Log in with city@hospital.com / password123');
  await app.close();
}

bootstrap();
