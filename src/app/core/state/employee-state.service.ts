import { Injectable } from '@angular/core';
import { EmployeeService } from '@core/services/employee.service';
import {
  Employee,
  EmployeeNode,
  EmployeeSelectionState,
} from '@shared/models/employee.model';
import { BehaviorSubject, Observable, finalize, catchError, of } from 'rxjs';
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

  private isLoading = new BehaviorSubject<boolean>(false);
  private error = new BehaviorSubject<string | null>(null);

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

  get isLoading$(): Observable<boolean> {
    return this.isLoading.asObservable();
  }

  get error$(): Observable<string | null> {
    return this.error.asObservable();
  }

  selectEmployee(employee: Employee | undefined): void {
    const currentState = this.state.getValue();
    const newEmployee = employee ?? null;

    this.error.next(null);

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

    this.isLoading.next(true);

    this.employeeService
      .getSubordinateTree(newEmployee.id)
      .pipe(
        catchError((err) => {
          this.error.next(
            `Failed to load subordinates: ${err.message || 'Unknown error'}`
          );
          return of([]);
        }),
        finalize(() => this.isLoading.next(false))
      )
      .subscribe((subordinates) => {
        this.state.next({
          selectedEmployee: newEmployee,
          subordinates,
          isAllExpanded: false,
        });
      });

    this.employeeService
      .getEmployeeHierarchyPath(newEmployee.id)
      .pipe(
        catchError((err) => {
          this.error.next(
            `Failed to load hierarchy path: ${err.message || 'Unknown error'}`
          );
          return of([]);
        })
      )
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

  clearError(): void {
    this.error.next(null);
  }
}
