import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    // Cambiamos a Zoneless para eliminar el error de zone.js por completo
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient()
  ]
};