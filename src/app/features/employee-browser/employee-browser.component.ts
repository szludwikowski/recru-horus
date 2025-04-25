import { Component, ViewChild } from '@angular/core';
import { EmployeeStateService } from '@core/state/employee-state.service';
import { TreeViewComponent } from '@shared/components/tree-view/tree-view.component';
import { Employee, EmployeeNode } from '@shared/models/employee.model';
import { take } from 'rxjs';

@Component({
  selector: 'app-employee-browser',
  templateUrl: './employee-browser.component.html',
  styleUrls: ['./employee-browser.component.scss'],
})
export class EmployeeBrowserComponent {
  @ViewChild('subordinateTreeView') subordinateTreeView!: TreeViewComponent;

  selectedEmployee$ = this.employeeState.selectedEmployee$;
  subordinateTree$ = this.employeeState.subordinates$;
  isAllExpanded$ = this.employeeState.isAllExpanded$;

  constructor(private employeeState: EmployeeStateService) {}

  onEmployeeSelected(employee?: Employee): void {
    this.employeeState.selectEmployee(employee);
  }

  toggleAllSubordinates(): void {
    if (!this.subordinateTreeView) return;
    this.employeeState.isAllExpanded$.pipe(take(1)).subscribe((isExpanded) => {
      if (isExpanded) {
        this.subordinateTreeView.collapseAll();
        this.employeeState.setAllExpanded(false);
      } else {
        this.subordinateTreeView.expandAll();
        this.employeeState.setAllExpanded(true);
      }
    });
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
      if (node.children && this.checkForExpandableNodes(node.children)) {
        return true;
      }
    }

    return false;
  }
}
