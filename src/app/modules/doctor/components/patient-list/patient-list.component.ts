import { Component } from '@angular/core';
import { Appointment } from '../../../shared/models/appointment.model';
import { Patient } from '../../../shared/models/patient.model';
import { DoctorService } from '../../services/doctor.service';
import { UserService } from '../../../shared/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-patient-list',
  standalone: false,
  templateUrl: './patient-list.component.html',
  styleUrl: './patient-list.component.scss',
})
export class PatientListComponent {
  constructor(
    private doctorService: DoctorService,
    private userService: UserService,
    private route: Router
  ) {}

  doctorId: string | undefined = '';
  appointments: Appointment[] = [];
  patients: (Patient | undefined)[] = [];
  mergedAppointments: {
    appointment: Appointment;
    patient: Patient | undefined;
  }[] = [];
  loading: boolean = false;

  searchName: string = '';
  searchDate: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 3;
  loader: boolean = false;
  ngOnInit(): void {
    const DoctorUser: string = this.userService.getTypeUser();
    this.loader = true;
    setTimeout(() => {
      this.doctorService
        .getPatientsByDoctor(DoctorUser)
        .subscribe((appointments) => {
          this.loader = false;
          this.appointments = appointments;

          this.doctorService.getPatients().subscribe((patients) => {
            const mergedData = appointments.map((appointment) => {
              const patient = patients.find(
                (p) => p.id === appointment.patient_id
              );
              return {
                appointment,
                patient,
              };
            });
            this.mergedAppointments = mergedData;
          });
        });
    }, 1000);
  }

  goToDetails(appointmentId: string) {
    this.route.navigate(['/doctor/appointment-details', appointmentId]);
  }

  get filteredAppointments() {
    return this.mergedAppointments.filter((item) => {
      const matchesName =
        item.patient?.name
          ?.toLowerCase()
          .includes(this.searchName.toLowerCase()) ?? false;

      const matchesDate = this.searchDate
        ? item.appointment.date.toString().includes(this.searchDate)
        : true;

      return matchesName && matchesDate;
    });
  }

  // Pagination logic
  get totalPages() {
    return Math.ceil(this.filteredAppointments.length / this.itemsPerPage);
  }

  paginatedAppointments() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredAppointments.slice(startIndex, endIndex);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
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
