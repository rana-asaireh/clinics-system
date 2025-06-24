import { Component, OnInit } from '@angular/core';
import { DoctorService } from '../../services/doctor.service';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../shared/services/user.service';
import { Router } from '@angular/router';
import { Appointment } from '../../../shared/models/appointment.model';
import { Patient } from '../../../shared/models/patient.model';

@Component({
  selector: 'app-patient-details',
  standalone: false,
  templateUrl: './patient-details.component.html',
  styleUrls: ['./patient-details.component.scss'],
})
export class PatientDetailsComponent implements OnInit {
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

  searchText: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 4;
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
              return { appointment, patient };
            });

            this.mergedAppointments = mergedData;
          });
        });
    }, 1000);
  }

  goToDetails(appointmentId: string) {
    this.route.navigate(['/doctor/appointments', appointmentId]);
  }

  get filteredAppointments() {
    return this.mergedAppointments.filter((item) =>
      item.patient?.name?.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  get paginatedAppointments() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredAppointments.slice(start, end);
  }

  get totalPages() {
    return Math.max(
      Math.ceil(this.filteredAppointments.length / this.itemsPerPage),
      1
    );
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }
}
