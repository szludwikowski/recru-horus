import { Component } from '@angular/core';
import { Employee } from '../../shared/models/employee.model';

@Component({
  selector: 'app-employee-browser',
  templateUrl: './employee-browser.component.html',
  styleUrls: ['./employee-browser.component.scss'],
})
export class EmployeeBrowserComponent {
  currentSelectedEmployee: Employee | null = null;

  onEmployeeSelected(employee: Employee): void {
    console.log('Employee selected in browser:', employee);
    this.currentSelectedEmployee = employee;
  }
}
