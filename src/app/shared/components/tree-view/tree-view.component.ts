import {
  Component,
  Input,
  ChangeDetectionStrategy,
  OnChanges,
  SimpleChanges,
  ChangeDetectorRef,
} from '@angular/core';
import { EmployeeNode } from '../../models/employee.model';

@Component({
  selector: 'app-tree-view',
  templateUrl: './tree-view.component.html',
  styleUrls: ['./tree-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TreeViewComponent implements OnChanges {
  @Input() nodes: EmployeeNode[] = [];

  constructor(private changeDetectorRef: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['nodes']) {
      this.changeDetectorRef.markForCheck();
    }
  }

  toggleNode(node: EmployeeNode): void {
    if (node.children && node.children.length > 0) {
      node.isExpanded = !node.isExpanded;
      this.changeDetectorRef.markForCheck();
    }
  }

  expandAll(): void {
    this.setExpansionState(this.nodes, true);
    this.changeDetectorRef.markForCheck();
  }

  collapseAll(): void {
    this.setExpansionState(this.nodes, false);
    this.changeDetectorRef.markForCheck();
  }

  private setExpansionState(nodes: EmployeeNode[], isExpanded: boolean): void {
    for (const node of nodes) {
      if (node.children && node.children.length > 0) {
        node.isExpanded = isExpanded;
        if (node.children.length) {
          this.setExpansionState(node.children, isExpanded);
        }
      }
    }
  }
}
