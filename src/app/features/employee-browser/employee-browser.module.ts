import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployeeBrowserRoutingModule } from './employee-browser-routing.module';
import { EmployeeBrowserComponent } from './employee-browser.component';
import { EmployeeSelectComponent } from './components/employee-select/employee-select.component';
import { EmployeeHierarchyComponent } from './components/employee-hierarchy/employee-hierarchy.component';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  declarations: [
    EmployeeBrowserComponent,
    EmployeeSelectComponent,
    EmployeeHierarchyComponent,
  ],
  imports: [CommonModule, EmployeeBrowserRoutingModule, SharedModule],
})
export class EmployeeBrowserModule {}
