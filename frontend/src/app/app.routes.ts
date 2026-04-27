import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { DashboardComponent } from './layout/dashboard.component';
import { ProduitListComponent } from './features/produits/produit-list.component';
import { MachineListComponent } from './features/machines/machine-list.component';
import { TechnicienListComponent } from './features/techniciens/technicien-list.component';
import { MaintenanceListComponent } from './features/maintenances/maintenance-list.component';
import { OrdreFabricationListComponent } from './features/ordres-fabrication/ordre-fabrication-list.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'produits', component: ProduitListComponent },
      { path: 'machines', component: MachineListComponent },
      { path: 'techniciens', component: TechnicienListComponent },
      { path: 'maintenances', component: MaintenanceListComponent },
      { path: 'ordres-fabrication', component: OrdreFabricationListComponent }
    ]
  }
];
