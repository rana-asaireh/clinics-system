import { Component, OnInit } from '@angular/core';
import { DoctorService } from '../../../doctor/services/doctor.service';
import { Doctor } from '../../../shared/models/doctor.model';
import { Clinic } from '../../../shared/models/clinic.model';
import { ClinicService } from '../../../shared/services/clinic.service';
import { PaginationService } from '../../../shared/services/pagination.service';

@Component({
  selector: 'app-doctors-list',
  standalone: false,
  templateUrl: './doctors-list.component.html',
  styleUrl: './doctors-list.component.scss'
})
export class DoctorsListComponent implements OnInit {

  selectedClinicId: string = ''
  doctors: Doctor[] = [];
  filteredDoctors: Doctor[] = [];
  clinics: Clinic[] = [];
  searchQuery: any;
  searchImage: string = 'search';

  currentPage: number = 1;
  pageSize: number = 3;
  totalDoctors: number = 0;
  totalPages: number = 0;
  pages: number[] = [];
  loader : boolean = false ;

  constructor(private doctorService: DoctorService,
    private clinicService: ClinicService,
    private paginationService: PaginationService) {

  }

  ngOnInit(): void {
    this.loader = true ;
    this.doctorService.getDoctors().subscribe(
      (doctors) => {
        setTimeout(()=>{
        this.doctors = doctors
        console.log("doctors", this.doctors)

        this.totalDoctors = doctors.length;
        this.totalPages = this.paginationService.getTotalPages(this.totalDoctors, this.pageSize);
        this.pages = this.paginationService.generatePageNumbers(this.totalPages)
        this.filteredDoctors = this.paginationService.paginate(doctors, this.currentPage, this.pageSize)
        this.loader = false ;
      },1000);
      }
    )

    this.clinicService.getClinics().subscribe((clinics) => {
      this.clinics = clinics;
    });
  }

  getClinicNameByDoctorId(doctorId: string): string {
    const doctor = this.doctors.find(d => d.id?.toString() == doctorId);
    if (doctor) {
      const clinic = this.clinics.find(c => c.id?.toString() == doctor.clinic_id);
      console.log("clinic", clinic)
      return clinic ? clinic.name : 'Unknown Clinic';
    }
    return 'Unknown Clinic';
  }



  onFilterChange(): void {
    this.loader = true ;
    this.currentPage = 1;
    
    this.doctorService.getFilteredDoctors(this.selectedClinicId, this.searchQuery).subscribe(
      (filteredDoctors) => {
        setTimeout(()=>{
        console.log("filtered Doctors ", filteredDoctors)
        this.doctors = filteredDoctors;
        if (this.searchQuery) {
          this.searchImage = 'trash'
        }
        else {
          this.searchImage = 'search'

        }
        this.totalDoctors = filteredDoctors.length;
        this.totalPages = this.paginationService.getTotalPages(this.totalDoctors, this.pageSize);
        this.pages = this.paginationService.generatePageNumbers(this.totalPages)
        this.filteredDoctors = this.paginationService.paginate(filteredDoctors, this.currentPage, this.pageSize)
        this.loader = false;
        },1000);
      }

    )


  }
  imageClicked(): void {
    this.loader = true ;
    this.searchQuery = ''
    this.doctorService.getDoctors().subscribe(
      (doctors) => {
        setTimeout(()=>{
        this.doctors = doctors
        console.log("doctors", this.doctors)
        this.searchImage = 'search'

        this.onFilterChange();
        this.loader = false ;
      },1000);
      }
    )
  }



  goToPage(page: number) {
    this.loader = true;
    this.currentPage = page;
    setTimeout(()=>{
    this.filteredDoctors = this.paginationService.paginate(
      this.doctors,
      this.currentPage,
      this.pageSize
    );
    this.loader = false ;
    },1000);
  }

}
