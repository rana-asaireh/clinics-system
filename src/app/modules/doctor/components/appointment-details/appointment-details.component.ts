import { Component, OnInit } from '@angular/core';
import { Appointment } from '../../../shared/models/appointment.model';
import { Patient } from '../../../shared/models/patient.model';
import { Drug } from '../../../shared/models/drug.model';
import { Doctor } from '../../../shared/models/doctor.model';
import { Diagnosis } from '../../../shared/models/diagnosis.model';
import { FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DoctorService } from '../../services/doctor.service';
import { DrugService } from '../../../shared/services/drug.service';
import { DiagnosisService } from '../../../shared/services/diagnosis.service';
import { ApprovalStatus } from '../../../shared/enum/approval-status.enum';
@Component({
  selector: 'app-appointment-details',
  standalone: false,
  templateUrl: './appointment-details.component.html',
  styleUrl: './appointment-details.component.scss',
})
export class AppointmentDetailsComponent implements OnInit {
  appointmentId!: string;
  appointment!: Appointment;
  isAccepted = false;
  patient!: Patient;
  doctor!: Doctor;
  drugs: Drug[] = [];
  diagnoses: Diagnosis[] = [];
  formErrorMessage: string = '';
  rejectionMessage: string = '';
  loader: boolean = false;

  updatesAppointment!: Appointment;
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
    private router: Router,
    private drugService: DrugService,
    private diagnosisService: DiagnosisService
  ) {}

  ngOnInit(): void {
    this.appointmentId = this.route.snapshot.paramMap.get('id') || '';
    this.loadAppointmentDetails();
    this.loadDrugs();
    this.loadDiagnoses();
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
            this.doctor = doctor;
            this.appointmentForm.patchValue({
              doctorName: doctor?.name,
              clinicName: doctor.specification,
            });
          });
          this.appointmentForm.patchValue({
            appointmentStatus: appointment.approval_status,

            payment: appointment.appointment_details?.payment,
          });
        });
    }, 1000);
  }

  onSubmit(): void {
    const drugsValue = this.appointmentForm.get('drugsName')?.value;
    const diagnosisValue = this.appointmentForm.get('diagnosesNames')?.value;

    if (!drugsValue || !diagnosisValue) {
      this.formErrorMessage =
        'Please fill in both the Drugs and Diagnosis fields before submitting.';
      return;
    }

    const selectedDrug = this.drugs.find((d) => d.name === drugsValue);
    const selectedDiagnosis = this.diagnoses.find(
      (d) => d.name === diagnosisValue
    );

    if (!selectedDrug || !selectedDiagnosis) {
      this.formErrorMessage = 'Selected drug or diagnosis is invalid.';
      return;
    }

    const updatedAppointment: Appointment = {
      ...this.appointment,
      approval_status: ApprovalStatus.approved,
      appointment_details: {
        drugs: selectedDrug,
        diagnosis: selectedDiagnosis,
      },
    };

    this.doctorService
      .updateAppointmentStatus(this.appointmentId, updatedAppointment)
      .subscribe(
        (response) => {
          this.router.navigate(['doctor/patients']);
        },
        (error) => {
          console.error('Error updating appointment:', error);
        }
      );
  }

  onAccept() {
    this.isAccepted = true;
    this.formErrorMessage = '';
    this.rejectionMessage = '';

    this.appointment.approval_status = ApprovalStatus.approved;
    this.appointmentForm.patchValue({
      appointmentStatus: ApprovalStatus.approved,
    });
  }

  onReject() {
    const updatedAppointment = {
      ...this.appointment,
      approval_status: ApprovalStatus.rejected,
    };

    this.doctorService
      .updateAppointmentStatus(this.appointmentId, updatedAppointment)
      .subscribe(
        (response) => {
          this.router.navigate(['doctor/patients']);
        },
        (error) => {
          console.error('Error rejecting appointment:', error);
        }
      );
  }

  loadDrugs(): void {
    this.drugService.getDrugs().subscribe((data) => {
      this.drugs = data;
    });
  }

  loadDiagnoses(): void {
    this.diagnosisService.getDiagnosis().subscribe((data) => {
      this.diagnoses = data;
    });
  }
  getStatusClass(status: string | null | undefined): string {
    switch (status) {
      case 'approved':
        return 'status-approved';
      case 'rejected':
        return 'status-rejected';
      case 'pending':
        return 'status-pending';
      default:
        return '';
    }
  }
}
