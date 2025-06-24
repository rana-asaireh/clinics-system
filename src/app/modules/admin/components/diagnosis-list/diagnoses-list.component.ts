import { Component, OnInit } from '@angular/core';
import { Diagnosis } from '../../../shared/models/diagnosis.model';
import { AdminService } from '../../services/admin.service';
import { DiagnosisService } from '../../../shared/services/diagnosis.service';
import { PaginationService } from '../../../shared/services/pagination.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-diagnosis-list',
  standalone: false,
  templateUrl: './diagnoses-list.component.html',
  styleUrls: ['./diagnoses-list.component.scss']
})
export class DiagnosesListComponent implements OnInit {
  diagnoses: Diagnosis[] = [];
  filteredDiagnoses: Diagnosis[] = [];
  error: string = '';
  success: string = '';
  searchTerm: string = '';
  currentPage: number = 1;
  pageSize: number = 4;
  totalDiagnoses: number = 0;
  totalPages: number = 0;
  pages: number[] = [];
  loader: boolean = false;

  constructor(
    private adminService: AdminService,
    private diagnosisService: DiagnosisService,
    private paginationService: PaginationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getDiagnoses();
  }

  getDiagnoses(): void {
    this.loader = true;
    setTimeout(() => {
      this.diagnosisService.getDiagnosis().subscribe(
        (data: Diagnosis[]) => {
          this.loader = false;
          this.diagnoses = data;
          this.filteredDiagnoses = [...data];
          this.totalDiagnoses = this.diagnoses.length;
          this.totalPages = this.paginationService.getTotalPages(this.totalDiagnoses, this.pageSize);
          this.generatePageNumbers();
          this.filterDiagnoses();
        },
        (error: any) => {
          this.loader = false;
          this.error = 'Failed to load diagnoses.';
        }
      );
    }, 1000);
  }

  filterDiagnoses(): void {
    const term = this.searchTerm.trim().toLowerCase();
    let filtered = this.diagnoses;
    if (term) {
      filtered = filtered.filter(diagnosis =>
        diagnosis.name.toLowerCase().includes(term)
      );
    }
    this.filteredDiagnoses = filtered;
    this.totalDiagnoses = filtered.length;
    this.totalPages = this.paginationService.getTotalPages(this.totalDiagnoses, this.pageSize);
    this.generatePageNumbers();
    this.filteredDiagnoses = this.paginationService.paginate(filtered, this.currentPage, this.pageSize);
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.filterDiagnoses();
  }

  generatePageNumbers(): void {
    this.pages = this.paginationService.generatePageNumbers(this.totalPages);
  }

  onSearch(): void {
    this.currentPage = 1;
    this.filterDiagnoses();
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.onSearch();
    }
  }

  onKeyUp(event: KeyboardEvent): void {
    if (this.searchTerm.trim() === '') {
      this.currentPage = 1;
      this.filterDiagnoses();
    }
  }
  editDiagnosis(id?: string): void {
    this.router.navigate(['admin', 'edit-diagnosis', id])
  }

  deleteDiagnosis(id?: string): void {
    if (!id) {
      this.error = 'Invalid Diagnosis Id';
      setTimeout(() => (this.error = ''), 3000);
      return;
    }
    this.loader = true;
    this.adminService.deleteDiagnosis(id).subscribe(
      () => {
        this.success = 'Diagnosis deleted successfully.';
        setTimeout(() => (this.success = ''), 3000);
        setTimeout(() => {
          this.diagnosisService.getDiagnosis().subscribe(
            (data: Diagnosis[]) => {
              this.diagnoses = data;
              this.totalDiagnoses = data.length;

              if (this.totalDiagnoses === 0) {
                this.currentPage = 1;
              } else if ((this.currentPage - 1) * this.pageSize >= this.totalDiagnoses) {
                this.currentPage = Math.max(this.currentPage - 1, 1);
              }

              this.filterDiagnoses();
              this.loader = false;
            },
            () => {
              this.error = 'Failed to reload diagnoses after delete.';
            }
          );
        }, 1000);
      },
      (error: any) => {
        this.loader = false;
        this.error = 'Failed to delete diagnosis.';
      }
    );
  }
}
