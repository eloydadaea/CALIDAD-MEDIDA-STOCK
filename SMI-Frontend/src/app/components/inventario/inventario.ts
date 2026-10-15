import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; 
import { CommonModule } from '@angular/common'; 
import { StockService, MaterialItem } from '../../services/stock';

export interface ProductoConsolidado {
  sap: string;
  nombre: string;
  cantidad: number;
  unidad: string;
}

@Component({
  selector: 'app-inventario',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inventario.html'
})
export class InventarioComponent implements OnInit {
  
  stockData: MaterialItem[] = [];
  inventarioConsolidado: ProductoConsolidado[] = [];
  inventarioFiltrado: ProductoConsolidado[] = [];

  constructor(
    private stockService: StockService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.cargarDatos();
  }

  cargarDatos() {
    this.stockService.obtenerStock().subscribe({
      next: (data) => {
        this.stockData = data;
        this.consolidarInventario();
        this.cdr.detectChanges(); 
      },
      error: (err) => {
        console.error('Error al conectar con el Backend de C#:', err);
      }
    });
  }

  consolidarInventario() {
    const inventarioMap: { [key: string]: ProductoConsolidado } = {};

    this.stockData.forEach(item => {
      const sap = item.codigo_sap;
      if (!sap || sap === '-' || sap.trim() === '') return;

      if (!inventarioMap[sap]) {
        inventarioMap[sap] = {
          sap: sap,
          nombre: item.nombre_material,
          cantidad: 0,
          unidad: item.unidad || 'UN'
        };
      }
      const cant = Number(item.cantidad) || 0;
      inventarioMap[sap].cantidad += cant; 
    });

    this.inventarioConsolidado = Object.values(inventarioMap);
    this.inventarioFiltrado = [...this.inventarioConsolidado];
  }

  buscar(event: Event) {
    const query = (event.target as HTMLInputElement).value.toLowerCase();
    this.inventarioFiltrado = this.inventarioConsolidado.filter(prod => 
      (prod.nombre && prod.nombre.toLowerCase().includes(query)) ||
      (prod.sap && prod.sap.toLowerCase().includes(query))
    );
    this.cdr.detectChanges();
  }
}