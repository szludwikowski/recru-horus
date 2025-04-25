import { Injectable } from '@angular/core';
import { EmployeeService } from '@core/services/employee.service';
import {
  Employee,
  EmployeeNode,
  EmployeeSelectionState,
} from '@shared/models/employee.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class EmployeeStateService {
  private initialState: EmployeeSelectionState = {
    selectedEmployee: null,
    subordinates: [],
    isAllExpanded: false,
  };

  private state = new BehaviorSubject<EmployeeSelectionState>(
    this.initialState
  );
  private hierarchyPath = new BehaviorSubject<Employee[]>([]);

  constructor(private employeeService: EmployeeService) {}

  get state$(): Observable<EmployeeSelectionState> {
    return this.state.asObservable();
  }

  get selectedEmployee$(): Observable<Employee | null> {
    return this.state$.pipe(map((state) => state.selectedEmployee));
  }

  get subordinates$(): Observable<EmployeeNode[]> {
    return this.state$.pipe(map((state) => state.subordinates));
  }

  get isAllExpanded$(): Observable<boolean> {
    return this.state$.pipe(map((state) => state.isAllExpanded));
  }

  get hierarchyPath$(): Observable<Employee[]> {
    return this.hierarchyPath.asObservable();
  }

  selectEmployee(employee: Employee | undefined): void {
    const currentState = this.state.getValue();
    const newEmployee = employee ?? null;

    if (!newEmployee) {
      this.hierarchyPath.next([]);
      this.state.next({
        ...currentState,
        selectedEmployee: null,
        subordinates: [],
        isAllExpanded: false,
      });
      return;
    }

    this.employeeService
      .getSubordinateTree(newEmployee.id)
      .subscribe((subordinates) => {
        this.state.next({
          selectedEmployee: newEmployee,
          subordinates,
          isAllExpanded: false,
        });
      });

    this.employeeService
      .getEmployeeHierarchyPath(newEmployee.id)
      .subscribe((path) => {
        this.hierarchyPath.next(path);
      });
  }

  setAllExpanded(isExpanded: boolean): void {
    const currentState = this.state.getValue();
    this.state.next({
      ...currentState,
      isAllExpanded: isExpanded,
    });
  }
}
