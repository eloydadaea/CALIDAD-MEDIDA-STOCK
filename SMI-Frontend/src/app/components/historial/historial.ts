import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StockService, MaterialItem } from '../../services/stock';

@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './historial.html' 
})
export class HistorialComponent implements OnInit {
  
  stockData: MaterialItem[] = [];
  filteredData: MaterialItem[] = [];


  paginaActual: number = 1;
  itemsPorPagina: number = 5; 
  totalPaginas: number = 1;

  constructor(private stockService: StockService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.cargarDatos(); 
  }

  cargarDatos() {
    this.stockService.obtenerStock().subscribe({
      next: (data) => {
        this.stockData = data;
        this.filteredData = [...this.stockData];
        this.actualizarPaginacion();
        this.cdr.detectChanges(); 
      },
      error: (err) => {
        console.error('Error al conectar con el Backend de C#:', err);
      }
    });
  }

  esEgreso(item: MaterialItem): boolean {
    const cant = Number(item.cantidad) || 0;
    return cant < 0 || item.proveedor === "RESERVA INTERNA";
  }

  buscar(event: Event) {
    const query = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredData = this.stockData.filter(item => 
        (item.nombre_material && item.nombre_material.toLowerCase().includes(query)) ||
        (item.codigo_sap && item.codigo_sap.toLowerCase().includes(query)) ||
        (item.proveedor && item.proveedor.toLowerCase().includes(query)) ||
        (item.orden && item.orden.toLowerCase().includes(query))
    );
    this.paginaActual = 1;
    this.actualizarPaginacion();
    this.cdr.detectChanges();
  }

  actualizarPaginacion() {
    this.totalPaginas = Math.ceil(this.filteredData.length / this.itemsPorPagina);
    if (this.totalPaginas === 0) this.totalPaginas = 1;
  }


  get datosPaginados() {
    const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
    const fin = inicio + this.itemsPorPagina;
    return this.filteredData.slice(inicio, fin);
  }

  cambiarPagina(pagina: number) {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaActual = pagina;
      this.cdr.detectChanges();
    }
  }
}