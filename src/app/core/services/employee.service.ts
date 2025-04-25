import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { map, shareReplay, catchError } from 'rxjs/operators';
import { Employee, EmployeeNode } from '../../shared/models/employee.model';

interface RawEmployeeNode {
  id: string;
  firstName: string;
  lastName: string;
  subordinates: RawEmployeeNode[];
}

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private employeesUrl = 'assets/data/employees.json';
  private structureUrl = 'assets/data/employee-structure.json';

  private processedDataCache$: Observable<{
    employees: Employee[];
    employeeMap: Map<string, Employee>;
    managerMap: Map<string, string | null>;
    structure: RawEmployeeNode | null;
  }> | null = null;

  constructor(private http: HttpClient) {}

  private getProcessedData(): Observable<{
    employees: Employee[];
    employeeMap: Map<string, Employee>;
    managerMap: Map<string, string | null>;
    structure: RawEmployeeNode | null;
  }> {
    if (!this.processedDataCache$) {
      this.processedDataCache$ = forkJoin({
        employees: this.http.get<Employee[]>(this.employeesUrl),
        structure: this.http.get<RawEmployeeNode>(this.structureUrl),
      }).pipe(
        map(({ employees, structure }) => {
          const employeeMap = new Map(employees.map((e) => [e.id, e]));
          const managerMap = this.buildManagerMap(structure);
          return { employees, employeeMap, managerMap, structure };
        }),
        shareReplay(1),
        catchError(() =>
          of({
            employees: [],
            employeeMap: new Map(),
            managerMap: new Map(),
            structure: null,
          })
        )
      );
    }
    return this.processedDataCache$;
  }

  private buildManagerMap(
    node: RawEmployeeNode | null,
    managerId: string | null = null,
    map = new Map<string, string | null>()
  ): Map<string, string | null> {
    if (!node) return map;
    map.set(node.id, managerId);
    if (node.subordinates && node.subordinates.length > 0) {
      node.subordinates.forEach((subordinate) => {
        this.buildManagerMap(subordinate, node.id, map);
      });
    }
    return map;
  }

  getEmployees(): Observable<Employee[]> {
    return this.getProcessedData().pipe(map((data) => data.employees));
  }

  getEmployeeById(employeeId: string): Observable<Employee | undefined> {
    return this.getProcessedData().pipe(
      map((data) => data.employeeMap.get(employeeId))
    );
  }

  private getEmployeeHierarchyPathSync(
    employeeId: string,
    employeeMap: Map<string, Employee>,
    managerMap: Map<string, string | null>
  ): Employee[] {
    const path: Employee[] = [];
    let currentEmployee = employeeMap.get(employeeId);

    while (currentEmployee) {
      path.unshift(currentEmployee);
      const managerId = managerMap.get(currentEmployee.id);
      if (!managerId) {
        break;
      }
      currentEmployee = employeeMap.get(managerId);
    }
    return path;
  }

  getEmployeeHierarchyPath(employeeId: string): Observable<Employee[]> {
    return this.getProcessedData().pipe(
      map((data) =>
        this.getEmployeeHierarchyPathSync(
          employeeId,
          data.employeeMap,
          data.managerMap
        )
      )
    );
  }

  private buildSubordinateTreeSync(
    structureNode: RawEmployeeNode | null,
    employeeMap: Map<string, Employee>
  ): EmployeeNode[] {
    if (!structureNode?.subordinates?.length) return [];
    return structureNode.subordinates.map((subNode) => {
      const employee = employeeMap.get(subNode.id) ?? {
        id: subNode.id,
        firstName: subNode.firstName,
        lastName: subNode.lastName,
        position: 'Unknown',
      };
      return {
        employee,
        children: this.buildSubordinateTreeSync(subNode, employeeMap),
        isExpanded: false,
      };
    });
  }

  getSubordinateTree(managerId: string): Observable<EmployeeNode[]> {
    return this.getProcessedData().pipe(
      map((data) => {
        const startNode = this.findNodeInStructure(data.structure, managerId);
        if (!startNode) return [];
        return this.buildSubordinateTreeSync(startNode, data.employeeMap);
      })
    );
  }

  private findNodeInStructure(
    node: RawEmployeeNode | null,
    id: string
  ): RawEmployeeNode | null {
    if (!node) return null;
    if (node.id === id) return node;
    if (node.subordinates) {
      for (const sub of node.subordinates) {
        const found = this.findNodeInStructure(sub, id);
        if (found) return found;
      }
    }
    return null;
  }

  getFullHierarchyTree(): Observable<EmployeeNode[]> {
    return this.getProcessedData().pipe(
      map((data) => {
        if (!data.structure) return [];
        const rootEmployee = data.employeeMap.get(data.structure.id);
        if (!rootEmployee) return [];

        return [
          {
            employee: rootEmployee,
            children: this.buildSubordinateTreeSync(
              data.structure,
              data.employeeMap
            ),
            isExpanded: true,
          },
        ];
      })
    );
  }
}
