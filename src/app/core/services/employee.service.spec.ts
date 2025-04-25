import { TestBed } from '@angular/core/testing';
import { EmployeeService } from './employee.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { Employee } from '@shared/models/employee.model';

describe('EmployeeService', () => {
  let service: EmployeeService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(EmployeeService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return employees from getEmployees()', (done) => {
    const mockEmployees: Employee[] = [
      { id: '1', firstName: 'Jan', lastName: 'Kowalski' },
      { id: '2', firstName: 'Anna', lastName: 'Nowak' },
    ];

    service.getEmployees().subscribe((employees) => {
      expect(employees.length).toBe(2);
      expect(employees[0].firstName).toBe('Jan');
      done();
    });

    const reqs = httpMock.match(
      (req) =>
        req.url.endsWith('employee-structure.json') ||
        req.url.endsWith('employees.json')
    );
    reqs.forEach((req) => req.flush(mockEmployees));
  });

  it('should return a single employee by id from getEmployeeById()', (done) => {
    const mockEmployees: Employee[] = [
      { id: '1', firstName: 'Jan', lastName: 'Kowalski' },
      { id: '2', firstName: 'Anna', lastName: 'Nowak' },
    ];

    service.getEmployeeById('2').subscribe((employee) => {
      expect(employee).toBeTruthy();
      expect(employee?.id).toBe('2');
      expect(employee?.firstName).toBe('Anna');
      done();
    });

    const reqs = httpMock.match(
      (req) =>
        req.url.endsWith('employee-structure.json') ||
        req.url.endsWith('employees.json')
    );
    reqs.forEach((req) => req.flush(mockEmployees));
  });
});
