import { Component, OnInit } from '@angular/core';
import { Appointment } from '../../../shared/models/appointment.model';
import { AppointmentService } from '../../../shared/services/appointment.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../shared/services/user.service';
import { User } from '../../../shared/models/user.model';
import { PatientAuthService } from '../../services/patient-auth.service';
import { Clinic } from '../../../shared/models/clinic.model';
import { Doctor } from '../../../shared/models/doctor.model';
import { Patient } from '../../../shared/models/patient.model';
import { ClinicService } from '../../../shared/services/clinic.service';
import { DoctorService } from '../../../doctor/services/doctor.service';
import { ApprovalStatus } from '../../../shared/enum/approval-status.enum';
import Swal from 'sweetalert2';
import { PaginationService } from '../../../shared/services/pagination.service';

@Component({
  selector: 'app-patient-appointment-list',
  standalone: false,
  templateUrl: './patient-appointment-list.component.html',
  styleUrl: './patient-appointment-list.component.scss'
})
export class PatientAppointmentListComponent implements OnInit {

  appointmentsList: Appointment[] = [];
  filteredAppointments: Appointment[] = [];
  patientId: string | undefined;
  approvalStatuses: string[] = [];
  selectedApprovalStatus: string = '';
  currentPage: number = 1;
  pageSize: number = 5;
  totalAppointments: number = 0;
  totalPages: number = 0;
  pages: number[] = [];
  clinics: Clinic[] = [];
  doctors: Doctor[] = [];
  patients: Patient[] = [];
  sortColumn: string = '';
  sortDirection: string = 'asc';
    loader: boolean = false;

  constructor(
    private route: Router,
    private router: ActivatedRoute,
    private appointmentService: AppointmentService,
    private userService: UserService,
    private patientService: PatientAuthService,
    private clinicService: ClinicService,
    private doctorService: DoctorService,
    private paginationService: PaginationService
  ) { }

  ngOnInit(): void {
    this.loadPatientData();
    this.loadAdditionalData();
  }
  private loadPatientData(): void {
     this.loader = true;
    const userObj: User = this.userService.getCurrentUser();
    if (userObj) {
      this.patientService.getCurrentPatientId(userObj.email).subscribe((currentPatientId) => {
        this.patientId = currentPatientId?.toString();
        this.loadAppointments();
      });
    } else {
      this.loader = false;
    }
  }

  // Load additional data (clinics, doctors, patients)
  private loadAdditionalData(): void {
    this.clinicService.getClinics().subscribe((clinics) => (this.clinics = clinics));
    this.patientService.getPatientsList().subscribe((patients) => (this.patients = patients));
    this.doctorService.getDoctors().subscribe((doctors) => (this.doctors = doctors));
  }

  // Fetch appointments for the current patient
  private loadAppointments(): void {
    if (this.patientId) {
      this.appointmentService.getAppointmentsByPatient(this.patientId).subscribe((appointments) => {
        setTimeout(() => {
        this.filterAndPaginateAppointments(appointments);
        this.approvalStatuses = this.getApprovalStatuses(appointments);
        this.loader = false;
        }, 1000); 
      });
    }else{
      this.loader=false;
    }
  }

  // Filter and paginate the appointments based on approval status and pagination
  private filterAndPaginateAppointments(appointments: Appointment[]): void {
    this.appointmentsList = appointments.filter((appointment) => appointment.approval_status !== ApprovalStatus.cancelled);
    this.totalAppointments = this.appointmentsList.length;
    this.totalPages = this.paginationService.getTotalPages(this.totalAppointments, this.pageSize);
    this.pages = this.paginationService.generatePageNumbers(this.totalPages);
    this.filteredAppointments = this.paginationService.paginate(this.appointmentsList, this.currentPage, this.pageSize);
  }

  // Getapprovalstatuses  
  private getApprovalStatuses(appointments: Appointment[]): string[] {
    return Object.values(ApprovalStatus).filter((status) => status !== ApprovalStatus.cancelled);
  }

  //sort table columns
  sortTable(column: string): void {
    this.loader=true;
    this.sortDirection = this.sortColumn === column && this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.sortColumn = column;

    if (this.patientId) {
      const data = this.selectedApprovalStatus
        ? this.appointmentService.getFilteredAppointment(this.patientId, this.selectedApprovalStatus, this.sortColumn, this.sortDirection)
        : this.appointmentService.getAppointmentsByPatient(this.patientId, this.sortColumn, this.sortDirection);

      data.subscribe((appointments) => {
         setTimeout(() => {
        this.filterAndPaginateAppointments(appointments);
        this.loader=false;
         },1000);
      });
    }else{
      this.loader=false;
    }
  }

  // Filter appointments by approval status
  onFilterChange(): void {
    this.loader = true ;
    this.currentPage = 1;
    if (this.patientId) {
      this.appointmentService.getFilteredAppointment(this.patientId, this.selectedApprovalStatus, this.sortColumn, this.sortDirection)
        .subscribe((filteredAppointments) => {
          setTimeout(()=>{
          this.filterAndPaginateAppointments(filteredAppointments);
          this.loader = false ;
        },1000);
        });
    }else{
      this.loader = false ;
    }
  }

  // Cancel an appointment with confirmation
  cancelAppointment(id: string | undefined): void {
    this.currentPage = 1;
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won’t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, cancel it!',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed && id) {
        this.loader = true ;
        this.appointmentService.updateAppintmentStatus(id, { approval_status: ApprovalStatus.cancelled }).subscribe(() => {
          setTimeout(()=>{
          this.loadAppointments();
        },1000);
        });
      }  
    });
  }


  //edit appointment 

  editAppointment(id: string | undefined) {
    this.route.navigate(['/patient/edit-appointment', id])
  }
  //view appointment 

  viewAppointmentDetails(id: string | undefined) {
    this.route.navigate(['/patient/appointment-details', id])
  }






  // Pagination logic
  goToPage(page: number): void {
    this.loader = true ;
    this.currentPage = page;
    setTimeout(()=>{
    this.filteredAppointments = this.paginationService.paginate(this.appointmentsList, this.currentPage, this.pageSize);
    this.loader = false ;
    },1000);
}


  //approval status classes
  getApprovalStatus(status: ApprovalStatus): string {
    switch (status.toLowerCase().trim()) {
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


  //#region additiobnal functions 

  getClinicName(clinicId: string): string {
    const clinic = this.clinics.find((clinic) => clinic.id?.toString() === clinicId);
    return clinic ? clinic.name : 'Unknown Clinic';
  }

  getDoctorName(doctorId: string): string {
    const doctor = this.doctors.find((doctor) => doctor.id?.toString() === doctorId);
    return doctor ? doctor.name : 'Unknown Doctor';
  }

  getPatientName(patientId: string): string {
    const patient = this.patients.find((patient) => patient.id?.toString() === patientId);
    return patient ? patient.name : 'Unknown Patient';
  }

  getClinicNameByDoctorId(doctorId: string): string {
    const doctor = this.doctors.find((d) => d.id?.toString() === doctorId);
    const clinic = doctor ? this.clinics.find((c) => c.id?.toString() === doctor.clinic_id) : null;
    return clinic ? clinic.name : 'Unknown Clinic';
  }


  //#endregion
}
