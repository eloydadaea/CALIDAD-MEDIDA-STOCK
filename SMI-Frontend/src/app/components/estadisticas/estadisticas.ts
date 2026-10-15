import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StockService, MaterialItem } from '../../services/stock';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-estadisticas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './estadisticas.html'
})
export class EstadisticasComponent implements OnInit {

  @ViewChild('graficoDona') graficoDona!: ElementRef;
  @ViewChild('graficoBarras') graficoBarras!: ElementRef;

  stockData: MaterialItem[] = [];

  chartDona: any;
  chartBarras: any;

  totalIngresos: number = 0;
  totalEgresos: number = 0;
  totalMaterialesDistintos: number = 0;

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
        const topMateriales = this.procesarKPIs();

        setTimeout(() => {
          this.renderizarGraficos(topMateriales);
        }, 100);
        
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al cargar datos para estadísticas:', err)
    });
  }

  procesarKPIs() {
    let ingresos = 0;
    let egresos = 0;
    const stockConsolidado: { [key: string]: { nombre: string, cantidad: number } } = {};

    this.stockData.forEach(item => {
      const cant = Number(item.cantidad) || 0;

      if (cant > 0 && item.proveedor !== 'RESERVA INTERNA') {
        ingresos += cant;
      } else {
        egresos += Math.abs(cant);
      }

      const sap = item.codigo_sap;
      if (sap && sap !== '-' && sap.trim() !== '') {
        if (!stockConsolidado[sap]) {
          stockConsolidado[sap] = { nombre: item.nombre_material, cantidad: 0 };
        }
        stockConsolidado[sap].cantidad += cant;
      }
    });

    this.totalIngresos = ingresos;
    this.totalEgresos = egresos;
    
    const arrayStock = Object.values(stockConsolidado);
    this.totalMaterialesDistintos = arrayStock.length;

    return arrayStock.sort((a, b) => b.cantidad - a.cantidad).slice(0, 5);
  }

  renderizarGraficos(topMateriales: {nombre: string, cantidad: number}[]) {
    if (this.chartDona) this.chartDona.destroy();
    if (this.chartBarras) this.chartBarras.destroy();

    this.chartDona = new Chart(this.graficoDona.nativeElement, {
      type: 'doughnut',
      data: {
        labels: ['Ingresos (Compras)', 'Egresos (Reservas)'],
        datasets: [{
          data: [this.totalIngresos, this.totalEgresos],
          backgroundColor: ['#2e7d32', '#c62828'], // Verde y Rojo
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { position: 'bottom' } }
      }
    });

    const nombres = topMateriales.map(m => m.nombre);
    const cantidades = topMateriales.map(m => m.cantidad);

    this.chartBarras = new Chart(this.graficoBarras.nativeElement, {
      type: 'bar',
      data: {
        labels: nombres,
        datasets: [{
          label: 'Unidades en Stock',
          data: cantidades,
          backgroundColor: '#273481', 
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        scales: { y: { beginAtZero: true } },
        plugins: { legend: { display: false } }
      }
    });
  }
}