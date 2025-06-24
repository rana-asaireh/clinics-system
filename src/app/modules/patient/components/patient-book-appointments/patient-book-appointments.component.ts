import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AppointmentService } from '../../../shared/services/appointment.service';
import { UserService } from '../../../shared/services/user.service';
import { ActivatedRoute } from '@angular/router';
import { PatientAuthService } from '../../services/patient-auth.service';

@Component({
  selector: 'app-patient-book-appointments',
  standalone: false,
  templateUrl: './patient-book-appointments.component.html',
  styleUrl: './patient-book-appointments.component.scss'
})
export class PatientBookAppointmentsComponent implements OnInit {

  appointmentForm!: FormGroup;
  todayDate: string | undefined;
  userId: string | null = null;
  appointmentData: any;
  appointmentId: string | null = null;
  doctorNameFromUrl: string | null = null;
  clinicNameFromUrl: string | null = null;
  doctorIdFromUrl: string | null = null;
  success: string = '';
  error!: string;
  loader: boolean = false;

  constructor(
    private appointmentService: AppointmentService,
    private userService: UserService,
    private route: ActivatedRoute,
    private patientAuthService: PatientAuthService
  ) { }

  ngOnInit(): void {
    this.appointmentForm = new FormGroup({
      fullname: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      phone: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{10,15}$')]),
      date: new FormControl('', Validators.required),
      time: new FormControl('', Validators.required),
      reason: new FormControl('', Validators.required),
      id: new FormControl(null),
      doctor_id: new FormControl(null)
    });

    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    this.todayDate = `${year}-${month}-${day}`;

    this.route.queryParams.subscribe(params => {
      this.doctorNameFromUrl = params['doctorName'];
      this.clinicNameFromUrl = params['clinicName'];
      this.doctorIdFromUrl = params['doctorId'];
      this.appointmentForm.patchValue({
        doctor_id: this.doctorIdFromUrl
      });
      console.log('Doctor Name from URL:', this.doctorNameFromUrl);
      console.log('Clinic Name from URL:', this.clinicNameFromUrl);
      console.log('Doctor ID from URL:', this.doctorIdFromUrl);
    });

    this.route.paramMap.subscribe(params => {
      this.appointmentId = params.get('id');
      if (this.appointmentId) {
        this.appointmentService.getAppointmentById(this.appointmentId).subscribe(
          (appointment) => {
            if (appointment) {
              this.populateFormForEdit(appointment);
            } else {
              this.error = 'Could not find appointment with this ID.';
            
            }
          },
          (error) => {
          
            this.error = 'Error fetching appointment.';
          
          }
        );
      }
    });
  }

  populateFormForEdit(appointment: any) {
    this.success = '';
    this.error = '';
    this.loader = true;
    setTimeout(() => {
    this.patientAuthService.getPatientById(appointment.patient_id).subscribe(
      (patient: any) => {
        this.loader = false;
        if (patient) {
          
          this.appointmentForm.patchValue({
            fullname: patient.name,
            email: patient.email,
            phone: patient.phone,
            date: appointment.date,
            time: this.formatTime(appointment.time),
            reason: appointment.appointment_details?.reason || '',
            id: appointment.id,
            doctor_id: appointment.doctor_id
          });
        } else {
          this.error = 'Could not find patient information for this appointment.';
        }
      },
      (error) => {
        this.loader = false;
        this.error = 'Error fetching patient information.';
      }
    );
    }, 1000);
  }

  formatTime(time: any): string {
    return time;
  }

  submitAppointment() {
    this.success = '';
    this.error = '';
    
    this.appointmentForm.markAllAsTouched();
    this.appointmentForm.updateValueAndValidity();
  

    if (this.appointmentForm.valid) {
      this.loader = true;
      const appointmentData = this.appointmentForm.value;
      const email = appointmentData.email;
    setTimeout(() => {
      this.userService.getPatientByEmail(email).subscribe(
        (patients) => {
          this.loader = false;
          if (patients && patients.length > 0) {
            const patient = patients[0];
            const appointmentToSend = {
              date: appointmentData.date,
              patient_id: patient.id,
              doctor_id: appointmentData.doctor_id,
              approval_status: "pending",
              appointment_details: {
                reason: appointmentData.reason,
                drugs: "",
                diagnosis: "",
              },
              payment: "",
              time: appointmentData.time,
            };

          

            if (this.appointmentId) {
              this.appointmentService.updateAppointment(this.appointmentId, appointmentToSend).subscribe(
                (response: any) => {
                  this.loader = false; 
                  this.success = 'Appointment updated successfully';
                  setTimeout(() => { this.success = ''; }, 3000);
                  this.appointmentForm.reset();
                },
                (error) => {
                  this.loader = false; 
                  this.error = 'Failed to update appointment. Please try again.';
                  setTimeout(() => { this.error = ''; }, 3000);
                }
              );
            } else {
              this.appointmentService.addAppointment(appointmentToSend).subscribe(
                (response: any) => {
                  this.loader = false; 
                  this.success = 'Appointment booked successfully';
                  setTimeout(() => { this.success = ''; }, 3000);
                  this.appointmentForm.reset();
                },
                (error) => {
                  this.loader = false; 
                  this.error = 'Failed to book appointment. Please try again.';
                  setTimeout(() => { this.error = ''; }, 3000);
                }
              );
            }
          } else {
            this.loader = false; 
            this.error = 'Could not find patient with this email. Please try again.';
          }
        },
        (error) => {
          this.loader = false; 
          this.error = 'Error fetching patient information. Please try again.';
        }
      );}, 1000);
    } else {
    
      this.error = 'Please fill in all the required fields correctly.';
    }
  }
}






