import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Employee } from '../../../../shared/models/employee.model';
import { EmployeeService } from '../../../../core/services/employee.service';

@Component({
  selector: 'app-employee-hierarchy',
  templateUrl: './employee-hierarchy.component.html',
  styleUrls: ['./employee-hierarchy.component.scss'],
})
export class EmployeeHierarchyComponent implements OnChanges {
  @Input() selectedEmployee: Employee | null = null;

  hierarchyPath$: Observable<Employee[]> = of([]);

  constructor(private employeeService: EmployeeService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedEmployee'] && this.selectedEmployee) {
      this.hierarchyPath$ = this.employeeService.getEmployeeHierarchyPath(
        this.selectedEmployee.id
      );
    } else {
      this.hierarchyPath$ = of([]);
    }
  }
}
