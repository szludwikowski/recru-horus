import {
  Component,
  ViewChild,
  ChangeDetectionStrategy,
  OnDestroy,
  OnInit,
  ChangeDetectorRef,
  AfterViewInit,
} from '@angular/core';
import { EmployeeStateService } from '@core/state/employee-state.service';
import { TreeViewComponent } from '@shared/components/tree-view/tree-view.component';
import { Employee, EmployeeNode } from '@shared/models/employee.model';
import {
  Subject,
  BehaviorSubject,
  combineLatest,
  Observable,
  debounceTime,
  distinctUntilChanged,
  map,
  take,
  takeUntil,
} from 'rxjs';

@Component({
  selector: 'app-employee-browser',
  templateUrl: './employee-browser.component.html',
  styleUrls: ['./employee-browser.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeeBrowserComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @ViewChild('subordinateTreeView') subordinateTreeView!: TreeViewComponent;

  selectedEmployee$ = this.employeeState.selectedEmployee$;
  subordinateTree$ = this.employeeState.subordinates$;
  isAllExpanded$ = this.employeeState.isAllExpanded$;

  searchQuery = '';
  private searchQuery$ = new BehaviorSubject<string>('');
  filteredSubordinates$!: Observable<EmployeeNode[]>;

  private destroy$ = new Subject<void>();

  constructor(
    public employeeState: EmployeeStateService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.filteredSubordinates$ = combineLatest([
      this.subordinateTree$,
      this.searchQuery$.pipe(debounceTime(300), distinctUntilChanged()),
    ]).pipe(
      map(([subordinates, searchTerm]) => {
        if (!searchTerm.trim()) {
          return subordinates;
        }
        return this.filterNodes(subordinates, searchTerm.toLowerCase());
      })
    );

    this.isAllExpanded$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.changeDetectorRef.markForCheck();
    });
  }

  ngAfterViewInit(): void {
    this.employeeState.isAllExpanded$
      .pipe(takeUntil(this.destroy$))
      .subscribe((isExpanded) => {
        if (this.subordinateTreeView) {
          if (isExpanded) {
            this.subordinateTreeView.expandAll();
          } else {
            this.subordinateTreeView.collapseAll();
          }
          this.changeDetectorRef.markForCheck();
        }
      });
  }

  onEmployeeSelected(employee?: Employee): void {
    this.employeeState.selectEmployee(employee);
    this.clearSearch();
  }

  toggleAllSubordinates(): void {
    if (!this.subordinateTreeView) return;

    this.employeeState.isAllExpanded$
      .pipe(take(1), takeUntil(this.destroy$))
      .subscribe((isExpanded) => {
        const newState = !isExpanded;

        if (newState) {
          this.subordinateTreeView.expandAll();
        } else {
          this.subordinateTreeView.collapseAll();
        }
        this.employeeState.setAllExpanded(newState);

        this.changeDetectorRef.markForCheck();
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

  onSearchInput(): void {
    this.searchQuery$.next(this.searchQuery);
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.searchQuery$.next('');
  }

  private filterNodes(
    nodes: EmployeeNode[],
    searchTerm: string
  ): EmployeeNode[] {
    const filteredNodes: EmployeeNode[] = [];

    for (const node of nodes) {
      const nodeCopy = { ...node };

      const nodeMatches = this.employeeMatchesSearch(
        nodeCopy.employee,
        searchTerm
      );

      if (nodeCopy.children && nodeCopy.children.length > 0) {
        nodeCopy.children = this.filterNodes(nodeCopy.children, searchTerm);
      }

      if (nodeMatches || (nodeCopy.children && nodeCopy.children.length > 0)) {
        if (nodeCopy.children && nodeCopy.children.length > 0) {
          nodeCopy.isExpanded = true;
        }
        filteredNodes.push(nodeCopy);
      }
    }

    return filteredNodes;
  }

  private employeeMatchesSearch(
    employee: Employee,
    searchTerm: string
  ): boolean {
    const fullName = `${employee.firstName} ${employee.lastName}`.toLowerCase();
    return fullName.includes(searchTerm);
  }

  clearError(): void {
    this.employeeState.clearError();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
