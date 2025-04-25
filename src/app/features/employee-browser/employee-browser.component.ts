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

  onEmployeeSelected(employee: Employee): void {
    console.log('Employee selected in browser:', employee);
    this.currentSelectedEmployee = employee;
    this.allSubordinatesExpanded = false;

    if (employee) {
      this.subordinateTree$ = this.employeeService.getSubordinateTree(
        employee.id
      );
    } else {
      this.subordinateTree$ = of([]);
    }
  }

  toggleAllSubordinates(): void {
    if (this.subordinateTreeView) {
      if (this.allSubordinatesExpanded) {
        this.subordinateTreeView.collapseAll();
      } else {
        this.subordinateTreeView.expandAll();
      }
      this.allSubordinatesExpanded = !this.allSubordinatesExpanded;
    }
  }
}
