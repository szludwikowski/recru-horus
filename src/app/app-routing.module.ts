import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'browser',
    loadChildren: () =>
      import('./features/employee-browser/employee-browser.module').then(
        (m) => m.EmployeeBrowserModule
      ),
  },
  {
    path: '',
    redirectTo: '/browser',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
