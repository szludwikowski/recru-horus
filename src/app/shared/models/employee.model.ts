export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
}

export interface EmployeeNode {
  employee: Employee;
  children: EmployeeNode[];
  isExpanded?: boolean;
}

export interface EmployeeSelectionState {
  selectedEmployee: Employee | null;
  subordinates: EmployeeNode[];
  isAllExpanded: boolean;
}
