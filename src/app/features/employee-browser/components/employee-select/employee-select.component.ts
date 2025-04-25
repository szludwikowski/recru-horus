import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { Observable } from 'rxjs';
import { Employee } from '../../../../shared/models/employee.model';
import { EmployeeService } from '../../../../core/services/employee.service';

@Component({
  selector: 'app-employee-select',
  templateUrl: './employee-select.component.html',
  styleUrls: ['./employee-select.component.scss'],
})
export class EmployeeSelectComponent implements OnInit {
  @ViewChild('employeeSelectElement')
  selectElementRef!: ElementRef<HTMLSelectElement>;

  employees$: Observable<Employee[]>;
  selectedEmployeeId: string | null = null;

  @Output() employeeSelected = new EventEmitter<Employee>();

  constructor(private employeeService: EmployeeService) {
    this.employees$ = this.employeeService.getEmployees();
  }

  ngOnInit(): void {}

  onSelectionChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const employeeId = selectElement.value;
    this.selectedEmployeeId = employeeId === '' ? null : employeeId;

    if (this.selectedEmployeeId) {
      this.employeeService
        .getEmployeeById(this.selectedEmployeeId)
        .subscribe((employee) => {
          if (employee) {
            this.employeeSelected.emit(employee);
          }
        });
    } else {
      this.employeeSelected.emit(undefined);
    }
  }
}
