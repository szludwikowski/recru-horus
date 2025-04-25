import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Employee } from '@shared/models/employee.model';
import { of } from 'rxjs';
import { EmployeeHierarchyComponent } from './employee-hierarchy.component';
import { EmployeeStateService } from '@core/state/employee-state.service';

describe('EmployeeHierarchyComponent', () => {
  let component: EmployeeHierarchyComponent;
  let fixture: ComponentFixture<EmployeeHierarchyComponent>;
  let mockEmployeeStateService: jasmine.SpyObj<EmployeeStateService>;

  beforeEach(async () => {
    mockEmployeeStateService = jasmine.createSpyObj(
      'EmployeeStateService',
      [],
      {
        hierarchyPath$: of([]),
      }
    );

    await TestBed.configureTestingModule({
      declarations: [EmployeeHierarchyComponent],
      providers: [
        { provide: EmployeeStateService, useValue: mockEmployeeStateService },
      ],
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
    const testPath: Employee[] = [
      {
        id: '1',
        firstName: 'Jan',
        lastName: 'Kowalski',
      },
      {
        id: '2',
        firstName: 'Anna',
        lastName: 'Nowak',
      },
    ];

    Object.defineProperty(mockEmployeeStateService, 'hierarchyPath$', {
      get: () => of(testPath),
    });

    fixture.detectChanges();

    const html = fixture.nativeElement.innerHTML;
    expect(html).toContain('Jan Kowalski');
    expect(html).toContain('Anna Nowak');
  });
});
