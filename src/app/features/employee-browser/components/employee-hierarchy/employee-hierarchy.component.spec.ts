import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmployeeService } from '@core/services/employee.service';
import { Employee } from '@shared/models/employee.model';
import { of } from 'rxjs';
import { EmployeeHierarchyComponent } from './employee-hierarchy.component';

describe('EmployeeHierarchyComponent', () => {
  let component: EmployeeHierarchyComponent;
  let fixture: ComponentFixture<EmployeeHierarchyComponent>;
  let mockEmployeeService: jasmine.SpyObj<EmployeeService>;

  beforeEach(async () => {
    mockEmployeeService = jasmine.createSpyObj('EmployeeService', [
      'getEmployeeHierarchyPath',
    ]);
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [EmployeeHierarchyComponent],
      providers: [{ provide: EmployeeService, useValue: mockEmployeeService }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeHierarchyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render hierarchy path', () => {
    const testEmployee: Employee = {
      id: '1',
      firstName: 'Jan',
      lastName: 'Kowalski',
    };
    const testPath: Employee[] = [
      testEmployee,
      {
        id: '2',
        firstName: 'Anna',
        lastName: 'Nowak',
      },
    ];
    mockEmployeeService.getEmployeeHierarchyPath.and.returnValue(of(testPath));
    component.selectedEmployee = testEmployee;
    component.ngOnChanges({
      selectedEmployee: {
        currentValue: testEmployee,
        previousValue: null,
        firstChange: true,
        isFirstChange: () => true,
      },
    });
    fixture.detectChanges();
    const html = fixture.nativeElement.innerHTML;
    expect(html).toContain('Jan Kowalski');
    expect(html).toContain('Anna Nowak');
  });
});
