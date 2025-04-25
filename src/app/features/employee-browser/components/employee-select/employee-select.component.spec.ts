import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmployeeSelectComponent } from './employee-select.component';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { EmployeeService } from '@core/services/employee.service';
import { Employee } from '@shared/models/employee.model';

describe('EmployeeSelectComponent', () => {
  let component: EmployeeSelectComponent;
  let fixture: ComponentFixture<EmployeeSelectComponent>;
  let mockEmployeeService: jasmine.SpyObj<EmployeeService>;

  beforeEach(async () => {
    mockEmployeeService = jasmine.createSpyObj('EmployeeService', [
      'getEmployees',
      'getEmployeeById',
    ]);
    const testEmployees: Employee[] = [
      { id: '1', firstName: 'Jan', lastName: 'Kowalski' },
      { id: '2', firstName: 'Anna', lastName: 'Nowak' },
    ];
    mockEmployeeService.getEmployees.and.returnValue(of(testEmployees));
    await TestBed.configureTestingModule({
      declarations: [EmployeeSelectComponent],
      providers: [{ provide: EmployeeService, useValue: mockEmployeeService }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render employee options', () => {
    fixture.detectChanges();
    const options = fixture.debugElement.queryAll(By.css('option'));
    expect(options.length).toBe(3);
    expect(options[1].nativeElement.textContent).toContain('Jan Kowalski');
    expect(options[2].nativeElement.textContent).toContain('Anna Nowak');
  });
});
