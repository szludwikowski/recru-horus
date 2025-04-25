import {
  Component,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { Observable } from 'rxjs';
import { Employee } from '@shared/models/employee.model';
import { EmployeeService } from '@core/services/employee.service';

@Component({
  selector: 'app-employee-select',
  templateUrl: './employee-select.component.html',
  styleUrls: ['./employee-select.component.scss'],
})
export class EmployeeSelectComponent {
  @ViewChild('employeeSelectElement')
  selectElementRef!: ElementRef<HTMLSelectElement>;
  employees$ = this.employeeService.getEmployees();
  selectedEmployeeId: string | null = null;
  @Output() employeeSelected = new EventEmitter<Employee | undefined>();

  constructor(private employeeService: EmployeeService) {}

  onSelectionChange(event: Event): void {
    const employeeId = (event.target as HTMLSelectElement).value || null;
    this.selectedEmployeeId = employeeId;
    if (employeeId) {
      this.employeeService
        .getEmployeeById(employeeId)
        .subscribe((employee) => this.employeeSelected.emit(employee));
    } else {
      this.employeeSelected.emit(undefined);
    }
  }
}
