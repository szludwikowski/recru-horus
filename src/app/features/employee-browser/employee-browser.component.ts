import { Component, ViewChild } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Employee, EmployeeNode } from '@shared/models/employee.model';
import { EmployeeService } from '@core/services/employee.service';
import { TreeViewComponent } from '@shared/components/tree-view/tree-view.component';

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

  onEmployeeSelected(employee?: Employee): void {
    this.currentSelectedEmployee = employee ?? null;
    this.allSubordinatesExpanded = false;
    this.subordinateTree$ = employee
      ? this.employeeService.getSubordinateTree(employee.id)
      : of([]);
  }

  toggleAllSubordinates(): void {
    if (!this.subordinateTreeView || !this.currentSelectedEmployee) return;
    this.allSubordinatesExpanded
      ? this.subordinateTreeView.collapseAll()
      : this.subordinateTreeView.expandAll();
    this.allSubordinatesExpanded = !this.allSubordinatesExpanded;
  }

  hasExpandableNodes(nodes: EmployeeNode[]): boolean {
    if (!nodes || nodes.length === 0) return false;
    return this.checkForExpandableNodes(nodes);
  }

  private checkForExpandableNodes(nodes: EmployeeNode[]): boolean {
    for (const node of nodes) {
      if (node.children && node.children.length > 0) {
        return true;
      }
    }

    for (const node of nodes) {
      if (node.children && this.checkForExpandableNodes(node.children)) {
        return true;
      }
    }

    return false;
  }
}
