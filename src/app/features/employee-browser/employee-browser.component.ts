import { Component } from '@angular/core';
import { Observable, of } from 'rxjs'; //
import { Employee, EmployeeNode } from '../../shared/models/employee.model'; //
import { EmployeeService } from '../../core/services/employee.service'; //

@Component({
  selector: 'app-employee-browser',
  templateUrl: './employee-browser.component.html',
  styleUrls: ['./employee-browser.component.scss'],
})
export class EmployeeBrowserComponent {
  currentSelectedEmployee: Employee | null = null;
  subordinateTree$: Observable<EmployeeNode[]> = of([]);

  constructor(private employeeService: EmployeeService) {}

  onEmployeeSelected(employee: Employee): void {
    console.log('Employee selected in browser:', employee);
    this.currentSelectedEmployee = employee;

    if (employee) {
      this.subordinateTree$ = this.employeeService.getSubordinateTree(
        employee.id
      );
    } else {
      this.subordinateTree$ = of([]);
    }
  }
}
