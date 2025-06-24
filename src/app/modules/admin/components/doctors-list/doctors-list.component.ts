import { Component, OnInit } from '@angular/core';
import { DoctorService } from '../../../doctor/services/doctor.service';
import { Doctor } from '../../../shared/models/doctor.model';
import { AdminService } from '../../services/admin.service';
import { ClinicService } from '../../../shared/services/clinic.service';
import { Clinic } from '../../../shared/models/clinic.model';
import { PaginationService } from '../../../shared/services/pagination.service';
import { Router } from '@angular/router';
import { UserService } from '../../../shared/services/user.service';
import { User } from '../../../shared/models/user.model';

@Component({
  selector: 'app-doctors-list',
  standalone: false,
  templateUrl: './doctors-list.component.html',
  styleUrls: ['./doctors-list.component.scss']
})
export class DoctorsListComponent implements OnInit {
  doctors: Doctor[] = [];
  filteredDoctors: Doctor[] = [];
  clinics: Clinic[] = [];
  selectedClinicId: string = '';
  searchTerm: string = '';
  userDoctor!: Doctor;
  userData!: User;
  currentPage: number = 1;
  pageSize: number = 4;
  totalDoctors: number = 0;
  totalPages: number = 0;
  pages: number[] = [];
  error: string = '';
  success: string = '';
  loader: boolean = false;

  constructor(
    private doctorService: DoctorService,
    private adminService: AdminService,
    private clinicService: ClinicService,
    private paginationService: PaginationService,
    private router: Router,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.loadDoctors();
    this.loadClinics();
  }

  loadDoctors(): void {
    this.loader = true;
    setTimeout(() => {
      this.doctorService.getDoctors().subscribe(
        (data: Doctor[]) => {
          this.doctors = data;
          this.filterDoctors();
          this.error = '';
          this.loader = false;
        },
        (error: any) => {
          this.loader = false;
          this.error = 'Failed to load doctors';
        }
      );
    }, 1000);
  }

  loadClinics(): void {
    this.clinicService.getClinics().subscribe(
      (data: Clinic[]) => {
        this.clinics = data;
        this.error = '';
      },
      (error: any) => {
        this.error = error;
      }
    );
  }

  filterDoctors(): void {
    const term = this.searchTerm.trim().toLowerCase();
    let filtered = this.doctors;

    if (this.selectedClinicId) {
      filtered = filtered.filter(doctor => doctor.clinic_id === this.selectedClinicId);
    }

    if (term) {
      filtered = filtered.filter(doctor =>
        doctor.name.toLowerCase().includes(term) ||
        doctor.specification.toLowerCase().includes(term)
      );
    }

    this.totalDoctors = filtered.length;
    this.totalPages = this.paginationService.getTotalPages(this.totalDoctors, this.pageSize);
    this.pages = this.paginationService.generatePageNumbers(this.totalPages);
    this.filteredDoctors = this.paginationService.paginate(filtered, this.currentPage, this.pageSize);
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.filterDoctors();
  }

  onSearch(): void {
    this.currentPage = 1;
    this.filterDoctors();
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.filterDoctors();
    }
  }

  onKeyUp(event: KeyboardEvent): void {
    if (this.searchTerm === '') {
      setTimeout(() => {
        const trimmed = this.searchTerm.trim();
        if (trimmed.length === 0) {
          this.filterDoctors();
        }
      }, 0);
    }
  }
  editDoctor(id?: string): void {
    this.router.navigate(['admin', 'edit-doctor', id])
  }

  deleteDoctor(id?: string): void {
    if (!id) {
      this.error = 'Invalid Doctor Id';
      setTimeout(() => this.error = '', 4000);
      return;
    }
    this.loader = true;
    this.doctorService.getDoctorById(id).subscribe({
      next: (doctor: Doctor) => {
        this.userDoctor = doctor;

        this.userService.getUserDoctorByEmail(this.userDoctor.email).subscribe({
          next: (user: any) => {
            this.userData = user;

            if (this.userData?.id) {

              this.userService.deleteUserDoctorByid(this.userData.id).subscribe({
                next: () => {


                  this.adminService.deleteDoctor(id).subscribe({
                    next: () => {
                      this.success = 'Doctor deleted successfully';
                      setTimeout(() => this.success = '', 4000);
                      setTimeout(() => {
                        this.doctorService.getDoctors().subscribe({
                          next: (data: Doctor[]) => {
                            this.doctors = data;
                            this.totalDoctors = data.length;

                            if (this.totalDoctors === 0) {
                              this.currentPage = 1;
                            } else if ((this.currentPage - 1) * this.pageSize >= this.totalDoctors) {
                              this.currentPage = Math.max(this.currentPage - 1, 1);
                            }

                            this.filterDoctors();
                            this.loader = false;
                          },
                          error: () => {
                            this.loader = false;
                            this.error = 'Failed to reload doctors after delete.';
                          }
                        });
                      }, 1000);
                    },
                    error: () => {
                      this.error = 'Failed to delete doctor.';
                    }
                  });
                },
                error: (err) => {
                  this.error = 'Failed to delete user associated with doctor.';
                }
              });
            } else {
              this.error = 'No user found for the doctor';
            }
          },
          error: () => {
            this.error = 'Failed to find user by doctor email.';
          }
        });
      },
      error: () => {
        this.error = 'Failed to find doctor by ID.';
      }
    });
  }
}
