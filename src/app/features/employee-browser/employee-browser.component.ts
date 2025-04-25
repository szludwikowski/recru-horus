import { Component, ViewChild } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Employee, EmployeeNode } from '../../shared/models/employee.model';
import { EmployeeService } from '../../core/services/employee.service';
import { TreeViewComponent } from '../../shared/components/tree-view/tree-view.component';

@Component({
  selector: 'app-employee-browser',
  templateUrl: './employee-browser.component.html',
  styleUrls: ['./employee-browser.component.scss'],
})
export class EmployeeBrowserComponent {
  @ViewChild('subordinateTreeView') subordinateTreeView!: TreeViewComponent;

  currentSelectedEmployee: Employee | null = null;
  subordinateTree$: Observable<EmployeeNode[]> = of([]);
  allSubordinatesExpanded: boolean = false;

  constructor(private employeeService: EmployeeService) {}

  onEmployeeSelected(employee: Employee | undefined): void {
    if (employee) {
      this.currentSelectedEmployee = employee;
      this.allSubordinatesExpanded = false;
      this.subordinateTree$ = this.employeeService.getSubordinateTree(
        employee.id
      );
    } else {
      this.currentSelectedEmployee = null;
      this.subordinateTree$ = of([]);
      this.allSubordinatesExpanded = false;
    }
  }

  toggleAllSubordinates(): void {
    if (this.subordinateTreeView && this.currentSelectedEmployee) {
      if (this.allSubordinatesExpanded) {
        this.subordinateTreeView.collapseAll();
      } else {
        this.subordinateTreeView.expandAll();
      }
      this.allSubordinatesExpanded = !this.allSubordinatesExpanded;
    }
  }
}
