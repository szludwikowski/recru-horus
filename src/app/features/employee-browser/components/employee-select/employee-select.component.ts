import {
  Component,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  ChangeDetectionStrategy,
  OnDestroy,
} from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';
import { Employee } from '@shared/models/employee.model';
import { EmployeeService } from '@core/services/employee.service';

@Component({
  selector: 'app-employee-select',
  templateUrl: './employee-select.component.html',
  styleUrls: ['./employee-select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeeSelectComponent implements OnDestroy {
  @ViewChild('employeeSelectElement')
  selectElementRef!: ElementRef<HTMLSelectElement>;
  employees$ = this.employeeService.getEmployees();
  selectedEmployeeId: string | null = null;
  @Output() employeeSelected = new EventEmitter<Employee | undefined>();

  private destroy$ = new Subject<void>();

  constructor(private employeeService: EmployeeService) {}

  onSelectionChange(event: Event): void {
    const employeeId = (event.target as HTMLSelectElement).value || null;
    this.selectedEmployeeId = employeeId;
    if (employeeId) {
      this.employeeService
        .getEmployeeById(employeeId)
        .pipe(takeUntil(this.destroy$))
        .subscribe((employee) => this.employeeSelected.emit(employee));
    } else {
      this.employeeSelected.emit(undefined);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
