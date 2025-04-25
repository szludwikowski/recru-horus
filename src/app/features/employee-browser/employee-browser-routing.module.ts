import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeBrowserComponent } from './employee-browser.component';

const routes: Routes = [
  {
    path: '',
    component: EmployeeBrowserComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmployeeBrowserRoutingModule {}
