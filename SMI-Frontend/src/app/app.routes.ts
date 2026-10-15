import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login'; 
import { DashboardComponent } from './components/dashboard/dashboard';
import { InicioComponent } from './components/inicio/inicio';
import { HistorialComponent } from './components/historial/historial';
import { InventarioComponent } from './components/inventario/inventario';
import { InsertarComponent } from './components/insertar/insertar';
import { ReservaComponent } from './components/reserva/reserva';
import { EstadisticasComponent } from './components/estadisticas/estadisticas';
import { ProyectoSmiComponent } from './components/proyecto-smi/proyecto-smi';

export const routes: Routes = [
  { path: '', component: LoginComponent }, 
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    children: [
      { path: '', redirectTo: 'inicio', pathMatch: 'full' },
      { path: 'inicio', component: InicioComponent },
      { path: 'historial', component: HistorialComponent },
      { path: 'inventario', component: InventarioComponent },
      { path: 'insertar', component: InsertarComponent },
      { path: 'reserva', component: ReservaComponent },
      { path: 'estadisticas', component: EstadisticasComponent },
      { path: 'proyecto-smi', component: ProyectoSmiComponent },
    ]
  }
];