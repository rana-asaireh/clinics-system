import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DoctorService } from '../../services/doctor.service';

import { FormGroup, FormControl } from '@angular/forms';

import { Doctor } from '../../../shared/models/doctor.model';
import { Appointment } from '../../../shared/models/appointment.model';
import { Patient } from '../../../shared/models/patient.model';

@Component({
  selector: 'app-view-appointment-list',
  standalone: false,
  templateUrl: './view-appointment-list.component.html',
  styleUrl: './view-appointment-list.component.scss',
})
export class ViewAppointmentListComponent implements OnInit {
  appointmentId!: string;
  appointment!: Appointment;
  patient!: Patient;
  doctor!: Doctor;
  loader: boolean = false;

  appointmentForm = new FormGroup({
    doctorName: new FormControl(''),
    clinicName: new FormControl(''),
    patientName: new FormControl(''),
    reservationDate: new FormControl(''),
    reservationTime: new FormControl(''),
    phoneNumber: new FormControl(''),
    email: new FormControl(''),
    appointmentStatus: new FormControl(''),
    drugsName: new FormControl(''),
    diagnosesNames: new FormControl(''),
    payment: new FormControl(''),
  });

  constructor(
    private route: ActivatedRoute,
    private doctorService: DoctorService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.appointmentId = this.route.snapshot.paramMap.get('id') || '';
    this.loadAppointmentDetails();
  }

  loadAppointmentDetails(): void {
    this.loader = true;
    setTimeout(() => {
      this.doctorService
        .getAppointmentById(this.appointmentId)
        .subscribe((appointment) => {
          this.loader = false;
          this.appointment = appointment;

          const patientId = this.appointment.patient_id;
          const doctorId = this.appointment.doctor_id;

          this.doctorService.getPatientById(patientId).subscribe((patient) => {
            this.patient = patient;
            this.appointmentForm.patchValue({
              patientName: patient.name,
              phoneNumber: patient.phone.toString(),
              email: patient.email,
            });
          });

          this.doctorService.getDoctorById(doctorId).subscribe((doctor) => {
            this.loader = false;
            this.doctor = doctor;
            this.appointmentForm.patchValue({
              doctorName: doctor?.name,
              clinicName: doctor?.specification,
            });
          });

          const reservationDate = this.formatDate(appointment.date);

          this.appointmentForm.patchValue({
            appointmentStatus: appointment.approval_status,
            reservationDate: reservationDate,
            payment: appointment.appointment_details?.payment,
          });
        });
    }, 1000);
  }

  formatDate(date: Date | string): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`; // This format works with input[type="date"]
  }
}
