import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route } from '@angular/router';
import { AppointmentService } from '../../../shared/services/appointment.service';
import { Appointment } from '../../../shared/models/appointment.model';
import { UserService } from '../../../shared/services/user.service';
import { PatientAuthService } from '../../services/patient-auth.service';
import { DoctorService } from '../../../doctor/services/doctor.service';
import { ClinicService } from '../../../shared/services/clinic.service';
import { Clinic } from '../../../shared/models/clinic.model';
import { Doctor } from '../../../shared/models/doctor.model';
import { Patient } from '../../../shared/models/patient.model';

@Component({
  selector: 'app-appointment-details',
  standalone: false,
  templateUrl: './appointment-details.component.html',
  styleUrl: './appointment-details.component.scss'
})
export class AppointmentDetailsComponent implements OnInit {

  appointmentObj!: Appointment;
  appointmentsList!: any;
  appointmentId: string | null | undefined;
  clinics: Clinic[] = [];
  doctors: Doctor[] = [];
  patients: Patient[] = [];
  loader : boolean = false ;
  constructor(private route: ActivatedRoute,
    private router: ActivatedRoute,
    private appointmentService: AppointmentService,
    private userService: UserService,
    private patientService: PatientAuthService,
    private clinicService: ClinicService,
    private doctorService: DoctorService
  ) {

  }
  ngOnInit(): void {
    this.loader = true ;
    this.appointmentId = this.route.snapshot.paramMap.get('id')
    console.log("id", this.appointmentId)
    if (this.appointmentId) {

      this.appointmentService.getAppointmentById(this.appointmentId).subscribe(
        (appointments) => {
          setTimeout(()=>{
          console.log('Appointments for patient:', appointments);
          this.appointmentsList = appointments;
          this.loader = false ;
         },1000);
        },
        (error) => {
          console.error('Error fetching appointments:', error);
          this.loader = false ;
        }
      );
    }else{
      this.loader = false ;
    }

    this.clinicService.getClinics().subscribe((clinics) => {
      this.clinics = clinics;
    });
    this.patientService.getPatientsList().subscribe((patients) => {
      this.patients = patients;
    });
    this.doctorService.getDoctors().subscribe((doctors) => {
      this.doctors = doctors;
    });


  }
  getClinicObj(clinicId: string): string {
    const clinic = this.clinics.find((clinic) => clinic.id?.toString() == clinicId);

    return clinic ? clinic.name : 'Unknown Clinic';
  }
  getDoctorObj(doctorId: string): Doctor | undefined {
    const doctor = this.doctors.find((doctor) => doctor.id?.toString() == doctorId);
    console.log("doctor", doctor)
    return doctor
  }
  getPatientObj(patientId: string): Patient | undefined {
    const patient = this.patients.find((patient) => patient.id?.toString() == patientId);
    console.log("patient", patient)
    return patient
  }

  getClinicObjByDoctorId(doctorId: string): Clinic | undefined {
    const doctor = this.doctors.find(d => d.id?.toString() == doctorId);
    if (doctor) {
      const clinic = this.clinics.find(c => c.id?.toString() == doctor.clinic_id);
      console.log("clinic", clinic)
      return clinic
    }
    return undefined

  }

}
