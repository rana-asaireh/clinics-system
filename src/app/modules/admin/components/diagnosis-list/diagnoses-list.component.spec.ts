import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiagnosesListComponent } from './diagnoses-list.component';

describe('DiagnosesListComponent', () => {
  let component: DiagnosesListComponent;
  let fixture: ComponentFixture<DiagnosesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DiagnosesListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiagnosesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
