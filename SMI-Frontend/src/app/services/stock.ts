import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // <-- Importamos HttpClient
import { Observable } from 'rxjs';

export interface MaterialItem {
  orden: string;
  proveedor: string;
  fecha: string;
  moneda: string;
  codigo_sap: string;
  nombre_material: string;
  cantidad: number;
  unidad: string;
  precio_unitario: number;
  cantidad_total: number;
}

@Injectable({
  providedIn: 'root'
})
export class StockService {

  // URL exacta de tu Backend en C# .NET 8 (Fíjate que usa el puerto 5008)
  private apiUrl = 'http://localhost:5008/api/stock';

  constructor(private http: HttpClient) { }

  // 1. OBTENER DATOS DESDE EL BACKEND DE C# (.NET 8)
  obtenerStock(): Observable<MaterialItem[]> {
    return this.http.get<MaterialItem[]>(this.apiUrl);
  }

  // 2. ENVIAR NUEVOS DATOS AL BACKEND (Lo usaremos en el siguiente paso)
  agregarRegistro(nuevoItem: MaterialItem): Observable<MaterialItem> {
    return this.http.post<MaterialItem>(this.apiUrl, nuevoItem);
  }

  // 3. SUBIR PDF PARA EXTRACCIÓN
  subirPdf(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    // Apuntamos a la nueva ruta /upload-pdf
    return this.http.post<any>(`${this.apiUrl}/upload-pdf`, formData);
  }

}