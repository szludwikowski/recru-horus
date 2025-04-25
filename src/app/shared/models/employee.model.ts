export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  position: string;
}

export interface EmployeeNode {
  employee: Employee;
  children: EmployeeNode[];
  isExpanded?: boolean;
}
