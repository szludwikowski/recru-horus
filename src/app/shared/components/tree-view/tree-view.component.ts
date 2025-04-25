import { Component, Input } from '@angular/core';
import { EmployeeNode } from '../../models/employee.model';

@Component({
  selector: 'app-tree-view',
  templateUrl: './tree-view.component.html',
  styleUrls: ['./tree-view.component.scss'],
})
export class TreeViewComponent {
  @Input() nodes: EmployeeNode[] = [];

  constructor() {}

  toggleNode(node: EmployeeNode): void {
    if (node.children && node.children.length > 0) {
      node.isExpanded = !node.isExpanded;
    }
  }
}
