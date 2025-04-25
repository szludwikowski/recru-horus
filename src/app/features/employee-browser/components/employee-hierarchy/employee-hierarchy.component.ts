import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { Employee } from '@shared/models/employee.model';
import { EmployeeStateService } from '@core/state/employee-state.service';

@Component({
  selector: 'app-employee-hierarchy',
  templateUrl: './employee-hierarchy.component.html',
  styleUrls: ['./employee-hierarchy.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeeHierarchyComponent {
  hierarchyPath$ = this.employeeState.hierarchyPath$;

  constructor(private employeeState: EmployeeStateService) {}
}
